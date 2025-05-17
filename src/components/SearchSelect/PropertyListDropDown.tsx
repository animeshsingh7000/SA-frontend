import { useEffect, useState } from "react";
import { getOwnerPropertyList, getPropertyList } from "../../api/rental/rentalInquiry";
import { SearchSelectWithForm } from "./SearchSelect";
import { FieldProps } from "react-final-form";

interface FormControlProps extends FieldProps<any, any, any, any> {
  label?: string;
  icon?: string;
  ownerProperty?: boolean;
  maxlength?: number;
  blur?: boolean;
  disabled?:boolean
  updateFilterCategoryId?: (query: object) => void;
}

export default function PropertyListDropDown(props: FormControlProps) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = props.ownerProperty ? await  getOwnerPropertyList(): await getPropertyList();
        let data = response.data.map((item: any) => ({
          label: item.name,
          value: item.id,
          image: item.image,
          propertyId: item.propertyId,
          unitBedrooms: item.unitBedrooms
        }));
        data = [{label: 'Select', value: '', image: '', propertyId: '', unitBedrooms: ''}].concat(data)

        setOptions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
      }
    };
    fetchOptions();
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
