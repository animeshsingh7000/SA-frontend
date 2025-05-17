import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-final-form";
import { Any } from "../../types/global.type";
import { useCustomMutation } from "../../hooks/useApi";
import { useState } from "react";
import close from "../../assets/images/close.svg";
import { FormControl } from "../FormElements/FormControl";
import { toast } from 'react-toastify';
import { deleteBlog } from "../../api/admin/siteManger";
import { deleteLease } from "../../api/admin/lease";

export default function DeleteLeaseModel({
  show,
  handleClose,
  leaseId= '',
  updateListItem,
}: {
  show: boolean;
  handleClose: VoidFunction;
  leaseId: string;
  updateListItem?: (data: any | undefined) => void;
}) {
  const [data, setData] = useState({
    leaseId: leaseId
  })

  const { mutate } = useCustomMutation({
    mutationFn: deleteLease,
    onSuccess: (res: any) => {
      toast.success(`Lease deleted successfully`)
      if (updateListItem) updateListItem(res);
      handleClose();
    }
  });

  const onSubmit = (values: Any) => {
    mutate(data.leaseId);
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
        <h3>Delete Lease</h3>
        <div className="closeIcon" onClick={closeDialog}>
          <img src={close} alt="" />
        </div>
      </div>
      <div className="subheading-dialog">
        You are about to delete the following lease. This action can not be undone.
      </div>
      <Form
        initialValues={data}
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