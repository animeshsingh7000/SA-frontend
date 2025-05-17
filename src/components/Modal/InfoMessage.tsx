import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { MessageModalType } from "../../types/global.type";
// import iconInfo from "../../assets/images/iconInfo.svg";
// import iconSuccess from "../../assets/images/iconSuccess.svg";
// import iconError from "../../assets/images/iconError.svg";
import iconRemove from "../../assets/images/remove-red-icon.svg";

const ICON = {
  delete: iconRemove,
};

export default function InfoModal({
  heading,
  body,
  footer,
  show,
  handleClose,
  type = "success",
  callback,
  buttonMain = "Got it",
}: MessageModalType) {
  const onOk = () => {
    callback && callback();
    handleClose();
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      dialogClassName={"team-memeber-model delete-dialog"}
    >

      <div className="header-dialog _flx-wrap">
        {type === "delete" ? (
          <div className="icondelete">
            <img src={ICON[type]} alt="info" />
          </div>
        ) : null}
        <h3>{heading}</h3>
      </div>
      <div className="subheading-dialog _centertxt">{body}</div>

      {/* <Modal.Body>
        <p>
          The following statements refer to your personality, that is, feelings,
          attitudes and behaviors in your life. Please try to describe yourself
          as you see yourself in general.
        </p>
      </Modal.Body> */}
      <Modal.Footer className="">
        {footer}
        {type === "delete" && (<Button variant="cancel" onClick={handleClose}>
          Cancel
        </Button>)}
        <Button variant="delete" onClick={onOk}>
          {buttonMain}
        </Button>
        {/* <Button variant="download2" type="submit">
          <div className="icon-download">
            <img src={iconDownload} alt="Download" />
          </div>
          Download
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
}
