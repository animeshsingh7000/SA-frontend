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

export default function DeleteBuildingModel({
  show,
  handleClose,
  buildingId= '',
  building = '',
  updateListItem,
}: {
  show: boolean;
  handleClose: VoidFunction;
  buildingId: string;
  building: string;
  updateListItem?: (data: any | undefined) => void;
}) {
  const [data, setData] = useState({
    building: building,
    buildingId: buildingId
  })

  const { mutate } = useCustomMutation({
    mutationFn: deleteBuilding,
    onSuccess: (res: any) => {
      toast.success(`Building deleted successfully`)
      if (updateListItem) updateListItem(res);
      handleClose();
    }
  });

  const onSubmit = (values: Any) => {
    mutate(data.buildingId);
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
        <h3>Delete Building</h3>
        <div className="closeIcon" onClick={closeDialog}>
          <img src={close} alt="" />
        </div>
      </div>
      <div className="subheading-dialog">
        You are about to delete the following building. This action can not be undone.
      </div>
      <Form
        initialValues={data}
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <FormControl
                label="Building"
                name="building"
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