import Modal from "react-bootstrap/Modal";

export default function TermsModal({
  url,
  // show,
  handleClose,
}: {
  url: any;
  // show: boolean;
  handleClose: VoidFunction;
}) {
  return (
    <Modal
    show={!!url}
    onHide={handleClose}
    backdrop="static"
    keyboard={false}
    dialogClassName={"model-common _confirmation-common"}
  >
    <Modal.Header closeButton></Modal.Header>
    <iframe
      src={url || ""}
      title="Terms and Conditions"
      className="w-full h-96 border-none"
    ></iframe>
  </Modal>
  );
}
