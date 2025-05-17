import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-final-form";
import { Any } from "../../types/global.type";
import { useCustomMutation } from "../../hooks/useApi";
import { useEffect, useState } from "react";
import close from "../../assets/images/close.svg";
import { deleteRentalInquiry } from "../../api/admin/renterInquiry";
import { toast } from 'react-toastify';

export default function DeleteRentalInquiryModel({
  show,
  handleClose,
  rentalId= '',
  updateListItem,
}: {
  show: boolean;
  handleClose: VoidFunction;
  rentalId: string;
  updateListItem?: (data: any | undefined) => void;
}) {
  const [data, setData] = useState({
    rentalId: rentalId
  })

  const { mutate } = useCustomMutation({
    mutationFn: deleteRentalInquiry,
    onSuccess: (res: any) => {
      toast.success(`Rental inquiry deleted successfully`)
      if (updateListItem) updateListItem(res);
      handleClose();
    }
  });

  const onSubmit = (values: Any) => {
    mutate(data.rentalId);
  };

  const closeDialog = () => {
    handleClose();
  }

  return (
    <Modal
      show={!!show}
      backdrop="static"
      dialogClassName={"team-memeber-model delete-dialog"}
      keyboard={false}
    >

      <div className="header-dialog">
        <h3>Delete Rental Inquiry</h3>
        <div className="closeIcon" onClick={closeDialog}>
          <img src={close} alt="" />
        </div>
      </div>
      <div className="subheading-dialog">
        You are about to delete the following rental inquiry. This action can not be undone.
      </div>
      <Form
        initialValues={data}
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              {/* <FormControl
                label="Email"
                name="neighbourhood"
                type="Email"
                placeholder="Email"
                disabled={true}
              /> */}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="cancel" type="button" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button variant="delete" type="submit">
                  Delete
                </Button>
              </Modal.Footer>
          </form>
        )}
      />
    </Modal>
  );
}