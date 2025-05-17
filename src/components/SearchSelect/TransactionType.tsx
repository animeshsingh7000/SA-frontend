import { useEffect, useRef, useState } from "react";
import { SearchSelectWithForm } from "./SearchSelect";
import { FieldProps } from "react-final-form";
import { getNeighbourhood, getQuadrants } from "../../api/admin/neighborhood";
import { getTransactionType } from "../../api/admin/lease";

interface FormControlProps extends FieldProps<any, any, any, any> {
  label?: string;
  icon?: string;
  maxlength?: number;
  blur?: boolean;
  updateFilterCategoryId?: (query: object) => void;
}

export default function TransactionType(props: FormControlProps) {
  const [options, setOptions] = useState([]);
  const effectRan = useRef(false);

  useEffect(() => {
    if (!effectRan.current) {
      const fetchOptions = async () => {
        try {
          const response = await getTransactionType();
          let data = response.data.map((item: any) => ({ 
            label: item.label,
            value: item.value,
          }));

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
