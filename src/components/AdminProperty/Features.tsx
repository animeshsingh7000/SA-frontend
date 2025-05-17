import React, { useEffect, useRef, useState } from "react";
import { configuration } from "../../api";
import { SearchSelectWithForm } from "../SearchSelect/SearchSelect";

export default function Features({
    handleSubmit,
    disabled = false,
    onChange
}: {
    handleSubmit?: () => void;
    disabled?: boolean;
    onChange?: (values: any) => void;
}) {

    const [amenitiesList, setAmenitiesList] = useState<any>([]);
    const effectRan = useRef(false);
    

    useEffect(() => {
        if (!effectRan.current) {
            configuration.getSharedAmenitiesV2().then((res: any) => {
                setAmenitiesList(res.data.map((item:any) => ({
                    label: item.label,
                    value: item.value
                })));
            });
        }
        return () => {
            effectRan.current = true;
        };
    }, [])

    return (
        <>
            <div className="row">
                <div className="col-12 custom-select-form _editchips">
                {
                    amenitiesList.length ? 
                        <SearchSelectWithForm
                            name="features.amenities"
                            label="Amenities"
                            options={amenitiesList}
                            isMulti={true}
                            isSearchable
                            placeholder="Select multiple"
                        />
                    :
                    null

                }
                </div>
            </div>
        </>
    );
}
