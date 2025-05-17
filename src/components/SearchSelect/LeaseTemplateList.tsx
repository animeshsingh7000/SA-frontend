import { useEffect, useRef, useState } from "react";
import { SearchSelectWithForm } from "./SearchSelect";
import { FieldProps } from "react-final-form";
import { getQuadrants } from "../../api/admin/neighborhood";
import { getLeaseTemplate } from "../../api/admin/lease";

interface FormControlProps extends FieldProps<any, any, any, any> {
  label?: string;
  icon?: string;
  maxlength?: number;
  blur?: boolean;
  updateFilterCategoryId?: (query: object) => void;
}

export default function LeaseTemplateList(props: FormControlProps) {
  const [options, setOptions] = useState([]);
  const effectRan = useRef(false);

  useEffect(() => {
    if (!effectRan.current) {
      const fetchOptions = async () => {
        try {
          let payload = {
            count: 5000,
            page: 1,
          }
          const response = await getLeaseTemplate(payload);
          let data = response.data.map((item: any) => ({ 
            label: item.title,
            value: item._id,
          }));
          data = [{label: 'Select Document Template', value: ''}].concat(data)

          setOptions(data);
        } catch (error) {
          console.error("Error fetching data:", error);
          setOptions([]);
        }
      };
      fetchOptions();
    }
    return () => {
        effectRan.current = true;
    };
  }, [setOptions]);

  return (
    <>
      {options.length ? (
        <SearchSelectWithForm
          {...props}
          options={options}
          isSearchable={true}
          placeholder=""
        />
      ) : null}
    </>
  );
}
