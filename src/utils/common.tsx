import { format } from "date-fns";
import moment from "moment";

// export function formatDate(value:any) {
//     let date = new Date(value);
//     const day = date.toLocaleString('default', { day: '2-digit' });
//     const month = date.toLocaleString('default', { month: 'short' });
//     const year = date.toLocaleString('default', { year: 'numeric' });
//     return month + ' ' + day + ', ' + year;
// }

export function formatDate(value: any) {
    let date = new Date(value);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const year = date.getUTCFullYear();
    return `${month} ${day}, ${year}`;
}

export function formatDate1(value:any) {
    let date = new Date(value).toISOString().split('T')[0];
    return date;
}

export function formatDateNotes(value:any) {
    return format(new Date(value), 'MMM dd, yyyy, HH:mm');
}

export function formatDateTime(value:any) {
    return moment.utc(value).format('MMM DD, yyyy hh:mm A');
}

export function formatDatePrincing(value:any) {
    let localOffset = value.getTimezoneOffset() * 60000; // offset in milliseconds
    let localDate = new Date(value.getTime() - localOffset);
    return localDate.toISOString(); 
}

export const isToday = (dateStr:any) => {
    const today = new Date();
    const inputDate = new Date(dateStr);
  
    return (
      today.getFullYear() === inputDate.getFullYear() &&
      today.getMonth() === inputDate.getMonth() &&
      today.getDate() === inputDate.getDate()
    );
  };

export  function containsIframe(htmlContent:any) {
    // Create a new DOMParser
    const parser = new DOMParser();
  
    // Parse the HTML content into a DOM object
    const doc = parser.parseFromString(htmlContent, 'text/html');
  
    // Check if the parsed DOM object contains any <iframe> elements
    const iframes = doc.getElementsByTagName('iframe');
  
    // Return true if at least one <iframe> element is found, otherwise return false
    return iframes.length > 0;
}

export function stripTagsAndTruncate(content:string) { 
    return content.replace(/<[^>]*>/g, '').substring(0, 150) + "...";
}

export function  textToNumber(text:any) {
    const numberWords:  {[key: string]: number} = {
        'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
        'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    };
   
    let result = 0;

    if(text) {
       
        const match = text.match(/[A-Z][a-z]*/g);
        const words = match;

        // Iterate through each word and add its numeric value to the result
        words.forEach((word:string) => {
            // Convert text to lowercase and split it into word
            word = word.toLowerCase()
            if (numberWords.hasOwnProperty(word)) {
                result += numberWords[word];
            }
        });
    }

    return result;    
}

export function isArrayHas(arrays: string [], passedinstring: string) {
    const array= arrays.filter(
        (str:any) => str.toLowerCase().includes(passedinstring.toLowerCase()
    ));

    return array.length > 0 ? true : false;
}


export const formatNumber = (number:any) => {
    return new Intl.NumberFormat('en-US', { 
        style: 'decimal', 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }).format(number);
};

export const formatPhoneNumber = (phoneNumber:any) => {
    // Remove any non-digit characters (like spaces, dashes, etc.)
    const cleaned = phoneNumber.toString().replace(/\D/g, '');
  
    // Check if the number is long enough
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
};


export const capitalizeFirstWord = (str:any) => {
    if (!str) return ''; // Check if the input string is empty
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatCurrency = (amount:any) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};
