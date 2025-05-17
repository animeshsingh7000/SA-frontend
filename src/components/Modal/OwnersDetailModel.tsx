import Modal from "react-bootstrap/Modal";
import { capitalizeFirstWord, formatPhoneNumber } from "../../utils/common";

export default function OnwerDetailsModel({
  detail,
  show,
  title,
  handleClose,
}: {
  detail: any;
  show: boolean;
  title: any;
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
      <Modal.Header closeButton>{title}</Modal.Header>
      <Modal.Body>
        {
          detail && detail.length > 0 ?
            <ul className="list-unstyled">
              {detail.map((onwerDetails: any, key: any) => (
                <li className="list-item" key={key}>
                  <div className="owner-info _owner_personal_detail">

                    <div className="_name">{onwerDetails.fullName ? onwerDetails.fullName : onwerDetails.name}</div>
                    <div className="_email">{onwerDetails.email}</div>
                    {
                      onwerDetails.phoneNumbers && onwerDetails.phoneNumbers.length > 0 ?
                        <>
                            <div className="contact_num_detail">

                          {onwerDetails.phoneNumbers.map((data: any, key: any) => (
                              <div className="_number">{formatPhoneNumber(data.phone) + ' (' + capitalizeFirstWord(data.type) + ')'}</div>

                          ))}
                          </div>

                        </>
                        :
                        null
                    }
                  </div>
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
