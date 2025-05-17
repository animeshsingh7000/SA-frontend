import { useEffect, useRef, useState } from "react";
import { SearchSelectWithForm } from "./SearchSelect";
import { FieldProps } from "react-final-form";
import { getUserList } from "../../api/admin/user";
import { getBuildingList } from "../../api/admin/building";

interface FormControlProps extends FieldProps<any, any, any, any> {
  label?: string;
  icon?: string;
  maxlength?: number;
  blur?: boolean;
  updateFilterCategoryId?: (query: object) => void;
}

export default function BuildingListDropDown(props: FormControlProps) {
  const { updateFilterCategoryId } = props;
  const [options, setOptions] = useState([]);
  const effectRan = useRef(false);

  useEffect(() => {
    if (!effectRan.current) {
      const fetchOptions = async () => {
        try {
          let payload = {
              count: 5000,
              page: 1,
              sortby: JSON.stringify({createdAt: -1}),
          }
          const response = await getBuildingList(payload);
          let data = response.data.map((item: any) => ({ 
            label: item.name,
            value: item._id,
            requiresExtraPaperwork: item.requiresExtraPaperwork
          }));
          data = [{label: 'Select', value: '', requiresExtraPaperwork: false}].concat(data)

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

  const handleChange = (selectedOption: { label: string; value: string, requiresExtraPaperwork: boolean }) => {
    if (updateFilterCategoryId) {
      // updateFilterCategoryId({ requiresExtraPaperwork: selectedOption.requiresExtraPaperwork });
      updateFilterCategoryId({ requiresExtraPaperwork: selectedOption.requiresExtraPaperwork, label: selectedOption.label, value: selectedOption.value });
    }
  };

  return (
    <>
      {options.length ? (
        <SearchSelectWithForm
          {...props}
          options={options}
          isSearchable={true}
          placeholder=""
          onChange={handleChange}
        />
      ) : null}
    </>
  );
}
