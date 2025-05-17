import { utils, writeFile } from 'xlsx';
import dayjs from 'dayjs'; // Make sure you installed dayjs (npm install dayjs)
import { capitalizeFirstWord, formatDate } from '../utils/common';

const stripTags = (str: any) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '');
};

const containsHtml = (str: any) => {
  if (typeof str !== 'string') return false;
  return /<\/?[a-z][\s\S]*>/i.test(str);
};

const createXlsxExporter = () => {
  const exportToXlsx = (headers: any, keys: any, data: any, fileName = 'export.xlsx') => {
    if (!headers || !keys || !data || headers.length !== keys.length) {
      console.error('Invalid input: headers, keys, or data mismatch');
      return;
    }

    const formattedData = data.map((item: any) => {
      const row: any = {};

      keys.forEach((key: any, index: any) => {
        let value = item[key];

        // Handle fullName separately
        if (key === 'fullName') {
          if (item.fullName) {
            value = item.fullName;
          } else if (item.firstName || item.lastName) {
            value = `${capitalizeFirstWord(item.firstName) ?? ''} ${capitalizeFirstWord(item.lastName) ?? ''}`.trim();
          } else {
            value = '';
          }
        }

        if (typeof value === 'object' && value !== null && ('firstName' in value || 'lastName' in value)) {
          value = `${capitalizeFirstWord(value.firstName ?? '')} ${capitalizeFirstWord(value.lastName ?? '')}`.trim();
        }

        // Handle boolean values
        if (key == 'enabled' && typeof value === 'boolean') {
          value = value ? 'Enabled' : 'Disabled';
        }

        if (typeof value === 'boolean') {
          value = value ? 'Yes' : 'No';
        }

        // Handle date formatting
        if (value && isValidDate(value)) {
          value = formatDate(value);
        }

        if ((key === 'description' || key === 'context') && containsHtml(value)) {
          value = stripTags(value);
        }

        // Handle Arrays - export their length
        if (Array.isArray(value)) {
          value = value.length;
        }

        row[headers[index]] = value ?? '';
      });

      return row;
    });

    const worksheet = utils.json_to_sheet(formattedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    writeFile(workbook, fileName);
  };

  return exportToXlsx;
};

export default createXlsxExporter;

// Helper function to detect valid dates
const isValidDate = (value: any) => {
  return dayjs(value).isValid() && (typeof value === 'string' || value instanceof Date);
};
