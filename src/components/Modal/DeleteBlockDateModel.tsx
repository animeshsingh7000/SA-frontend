import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-final-form";
import { Any } from "../../types/global.type";
import { useCustomMutation } from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { getDynamicPricingList } from "../../api/admin/ownerInquiry";
import close from "../../assets/images/close.svg";
import { FormControl } from "../FormElements/FormControl";
import { deleteNeighbourhood } from "../../api/admin/neighborhood";
import { toast } from 'react-toastify';
import { deleteBuilding } from "../../api/admin/building";
import { deleteBlockDate } from "../../api/admin/blockDates";

export default function DeleteBlockDateModel({
  show,
  handleClose,
  blockDateId= '',
  property = '',
  updateListItem,
}: {
  show: boolean;
  handleClose: VoidFunction;
  blockDateId: string;
  property: string;
  updateListItem?: (data: any | undefined) => void;
}) {
  const [data, setData] = useState({
    property: property,
    blockDateId: blockDateId
  })

  const { mutate } = useCustomMutation({
    mutationFn: deleteBlockDate,
    onSuccess: (res: any) => {
      toast.success(`Block date deleted successfully`)
      if (updateListItem) updateListItem(res);
      handleClose();
    }
  });

  const onSubmit = (values: Any) => {
    mutate(data.blockDateId);
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
        <h3>Delete Block date</h3>
        <div className="closeIcon" onClick={closeDialog}>
          <img src={close} alt="" />
        </div>
      </div>
      <div className="subheading-dialog">
        You are about to delete the following Block date.
      </div>
      <Form
        initialValues={data}
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <FormControl
                label="Property"
                name="property"
                type="Email"
                placeholder="Email"
                disabled={true}
              />

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