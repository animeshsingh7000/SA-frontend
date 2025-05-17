import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-final-form";
import { Any } from "../../types/global.type";
import { useCustomMutation } from "../../hooks/useApi";
import { useEffect, useState } from "react";
import close from "../../assets/images/close.svg";
import { deleteRentalInquiry } from "../../api/admin/renterInquiry";
import { toast } from 'react-toastify';
import { createBlockDate } from "../../api/owner";
import { DatePickerControl } from "../FormElements/DatePicker";
import { composeValidators, required, requiredSelect } from "../../validations";
import PropertyListDropDown from "../SearchSelect/PropertyListDropDown";

export default function AddBlockDateModel({
  show,
  handleClose,
  updateListItem,
}: {
  show: boolean;
  handleClose: VoidFunction;
  updateListItem?: (data: any | undefined) => void;
}) {

  const { mutate } = useCustomMutation({
    mutationFn: createBlockDate,
    onSuccess: (res: any) => {
      toast.success(`Block date added successfully`)
      if (updateListItem) updateListItem(res);
      handleClose();
    }
  });

  const onSubmit = (values: Any) => {
    let data = {
      listingId: values.listingId.value,
      startDate: values.startDate,
      endDate: values.endDate
    }
    mutate(data);
  };

  const closeDialog = () => {
    handleClose();
  }

  return (
    <Modal
      show={!!show}
      backdrop="static"
      dialogClassName={"team-memeber-model delete-dialog block_date_dialog"}
      keyboard={false}
    >

      <div className="header-dialog">
        <h3>Block your property</h3>
        <div className="closeIcon" onClick={closeDialog}>
          <img src={close} alt="" />
        </div>
      </div>
      {/* <div className="subheading-dialog">
        You are about to delete the following rental inquiry. This action can not be undone.
      </div> */}
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, values, form }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="block_date_content">
                <div className="_date_row">
                    <DatePickerControl
                        label="Star Date"
                        name="startDate"
                        placeholder="MM-DD-YY"
                        validate={composeValidators(required)}
                    />
                </div>
                <div className="_date_row">
                    <DatePickerControl
                        label="End Date"
                        name="endDate"
                        placeholder="MM-DD-YY"
                        minDate={values.startDate}
                        validate={composeValidators(required)}
                    />
                </div>
                </div>

                <div className="col-12 custom-select-form _editchips">
                    <div className="text-start form-field">
                        <PropertyListDropDown
                            label="Property"
                            name="listingId"
                            ownerProperty={true}
                            isSearchable
                            validate={composeValidators(requiredSelect)}
                        />
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="cancel" type="button" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button className="btn primary minwdth" type="submit">
                  Submit
                </Button>
              </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
}