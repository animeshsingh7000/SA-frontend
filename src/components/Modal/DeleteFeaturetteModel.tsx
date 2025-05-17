import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-final-form";
import { Any } from "../../types/global.type";
import { useCustomMutation } from "../../hooks/useApi";
import { useState } from "react";
import close from "../../assets/images/close.svg";
import { FormControl } from "../FormElements/FormControl";
import { toast } from 'react-toastify';
import { deleteFeaturette } from "../../api/admin/siteManger";

export default function DeleteFeaturetteModel({
  show,
  handleClose,
  featuretteId= '',
  featuretteHeading = '',
  updateListItem,
}: {
  show: boolean;
  handleClose: VoidFunction;
  featuretteId: string;
  featuretteHeading: string;
  updateListItem?: (data: any | undefined) => void;
}) {
  const [data, setData] = useState({
    featuretteHeading: featuretteHeading,
    featuretteId: featuretteId
  })

  const { mutate } = useCustomMutation({
    mutationFn: deleteFeaturette,
    onSuccess: (res: any) => {
      toast.success(`Featurette deleted successfully`)
      if (updateListItem) updateListItem(res);
      handleClose();
    }
  });

  const onSubmit = (values: Any) => {
    mutate(data.featuretteId);
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
        <h3>Delete Featurette</h3>
        <div className="closeIcon" onClick={closeDialog}>
          <img src={close} alt="" />
        </div>
      </div>
      <div className="subheading-dialog">
        You are about to delete the following featurette. This action can not be undone.
      </div>
      <Form
        initialValues={data}
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <FormControl
                label="Heading"
                name="featuretteHeading"
                type="Email"
                placeholder="heading"
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