import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-final-form";
import { Any } from "../../types/global.type";
import { useCustomMutation } from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { getDynamicPricingList } from "../../api/admin/ownerInquiry";
import PasswordField from "../FormElements/PasswordField";
import { required } from "../../validations";
import close from "../../assets/images/close.svg";

export default function PerDiemModal({
  show,
  handleClose,
  updateListItem,
}: {
  show: boolean;
  handleClose: VoidFunction;
  updateListItem?:(data: any | undefined) => void;
}) {
  const [data, setData] = useState({})

  const { mutate } = useCustomMutation({
      mutationFn: getDynamicPricingList,
      onSuccess: (res:any) => {
        if (updateListItem) updateListItem(res);
        handleClose();
      }
  });

  const onSubmit = (values: Any) => {
      mutate(values.password);
  };

  
  useEffect(()=> {
    if(show) {
      setData({});
    }
    
  }, [show])

  return (
    <Modal
      show={!!show}
      backdrop="static"
      dialogClassName={"team-memeber-model perdiemmodel"}
      keyboard={false}
    >
        {/* <Modal.Header>
          <Modal.Title>Per Diem Password</Modal.Title>
        </Modal.Header> */}
        <div className="categoryoverflowContent">
          <div className="head">
              Please provide password :
              <span><img src={close} alt="" /></span>
          </div>
        <Form
          initialValues={data}
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
                <Modal.Footer>
                  <PasswordField
                      placeholder="Enter your password"
                      validations={required}
                  />
                  <Button variant="primary" type="submit">
                    SUBMIT
                  </Button>
              </Modal.Footer>
            </form>
          )}
        />
        </div>
    </Modal>
  );
}
