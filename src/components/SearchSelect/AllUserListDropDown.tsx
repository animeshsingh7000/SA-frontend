import { useEffect, useRef, useState } from "react";
import { SearchSelectWithForm } from "./SearchSelect";
import { FieldProps } from "react-final-form";
import { getUserList } from "../../api/admin/user";

interface FormControlProps extends FieldProps<any, any, any, any> {
  label?: string;
  value?: any;
  icon?: string;
  email?: boolean;
  maxlength?: number;
  blur?: boolean;
  updateFilterCategoryId?: (query: object) => void;
}

export default function AllUserListDropDown(props: FormControlProps) {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(props.value ? props.value : '');
  const effectRan = useRef(false);

  useEffect(() => {
    if (!effectRan.current) {
      const fetchOptions = async () => {
        try {
          let payload = {
              count: 5000,
              page: 1,
              type: -1,
              sortby: JSON.stringify({createdAt: -1}),
          }
          const response = await getUserList(payload);
          let data = response.data.map((item: any) => ({ 
            label: item.fullName + (props.email ? ' - ' +item.email : ''),
            value: item._id,
          }));
          data = [{label: 'Select', value: ''}].concat(data)
  
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
          value={value}
          isSearchable={true}
          placeholder=""
        />
      ) : null}
    </>
  );
}
