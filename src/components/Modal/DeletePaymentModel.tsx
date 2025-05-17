import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-final-form";
import { Any } from "../../types/global.type";
import { useCustomMutation } from "../../hooks/useApi";
import close from "../../assets/images/close.svg";
import { toast } from 'react-toastify';
import { deletePayment } from "../../api/admin/lease";

export default function DeletePaymentModel({
  show,
  handleClose,
  paymentId = null,
  invoiceId = null,
  updateListItem,
}: {
  show: boolean;
  handleClose: VoidFunction;
  paymentId: any;
  invoiceId: any;
  updateListItem?: (data: any | undefined) => void;
}) {
  

  const { mutate } = useCustomMutation({
    mutationFn: deletePayment,
    onSuccess: (res: any) => {
      toast.success(`Payment deleted successfully`)
      if (updateListItem) updateListItem(paymentId);
      handleClose();
    }
  });

  const onSubmit = (values: Any) => {
    const data = {
      paymentId: paymentId,
      invoiceId: invoiceId
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
      dialogClassName={"team-memeber-model delete-dialog"}
      keyboard={false}
    >

      <div className="header-dialog">
        <h3>Delete Payment</h3>
        <div className="closeIcon" onClick={closeDialog}>
          <img src={close} alt="" />
        </div>
      </div>
      <div className="subheading-dialog">
        You are about to delete the following payment. This action can not be undone.
      </div>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            {/* <Modal.Body>
              <FormControl
                label="Heading"
                name="featuretteHeading"
                type="Email"
                placeholder="heading"
                disabled={true}
              />

            </Modal.Body> */}
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