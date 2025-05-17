import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-final-form";
import { Any } from "../../types/global.type";
import { useCustomMutation } from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { getDynamicPricingList } from "../../api/admin/ownerInquiry";
import close from "../../assets/images/close.svg";
import { FormControl } from "../FormElements/FormControl";

export default function DeleteUserModel({
  show,
  handleClose,
  email = '',
  updateListItem,
}: {
  show: boolean;
  handleClose: VoidFunction;
  email: string;
  updateListItem?: (data: any | undefined) => void;
}) {
  const [data, setData] = useState({
    email: email
  })

  const { mutate } = useCustomMutation({
    mutationFn: getDynamicPricingList,
    onSuccess: (res: any) => {
      if (updateListItem) updateListItem(res);
      handleClose();
    }
  });

  const onSubmit = (values: Any) => {
    //mutate(values.password);
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
        <h3>Delete User</h3>
        <div className="closeIcon" onClick={closeDialog}>
          <img src={close} alt="" />
        </div>
      </div>
      <div className="subheading-dialog">
        You are about to delete the following user. This action can not be undone.
      </div>
      <Form
        initialValues={data}
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <FormControl
                label="Email"
                name="email"
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