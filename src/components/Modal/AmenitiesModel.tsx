import Modal from "react-bootstrap/Modal";

export default function AmenitiesModel({
  detail,
  show,
  handleClose,
}: {
  detail: any;
  show: boolean;
  handleClose: VoidFunction;
}) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      dialogClassName={"model-common _amenities-model"}
    >
      <Modal.Header closeButton>Amenities</Modal.Header>
      <Modal.Body>
        {
          detail && detail.length > 0 ?
            <ul className="list-unstyled">
            {detail.map((data: any, key: any) => (
                <li className="list-item"key={key}>
                  {data}
                </li>
              ))}
            </ul>
          :
          <></>
        }
       
      </Modal.Body>
    </Modal>
  );
}
