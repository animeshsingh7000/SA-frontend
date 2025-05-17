import { useState } from "react";
import { Field, FieldProps } from "react-final-form";
//import { TagsInput } from "react-tag-input-component";
import TagInput from 'rsuite/TagInput';


interface FormControlProps extends FieldProps<any, any, any, any> {
  label?: string;
//   icon?: string;
}

export function TagsInput({
  label,
  disabled,
  ...rest
}: FormControlProps) {
    const [ tagSelected, setTagSelected ] = useState<any>(rest?.tags ? rest?.tags: []);

    return (
        <Field
        {...rest}
        render={({ input, meta }) =>
            <div className="text-start form-field">
                <label className="form-label">{label}</label>
                <div className="input-group2">
                <TagInput
                    disabled={disabled}
                    value={tagSelected}
                    trigger={['Enter', 'Space', 'Comma']}
                    onChange={(data:any, event) => {
                        if(tagSelected.length > 9 && event.type !== 'click') {
                            return;
                        }
                        setTagSelected(data)
                        input.onChange(data)

                    }}
                    onClean={(data:any) => {
                    }}
                />
                </div>

                {meta.touched && meta.error && (
                    <span className="error">{meta.error}</span>
                )}
            </div>
        }
        />
  );
}
