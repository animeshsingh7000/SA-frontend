import { useState } from "react";
import Modal from "react-bootstrap/Modal";

export default function AddNotesToNotInterestProperty({
  show,
  isFav,
  handleSubmit,
  handleClose,
}: {
  show: boolean;
  isFav: boolean;
  handleSubmit: (note: string) => void;
  handleClose: VoidFunction;
}) {
  const [note, setNote] = useState("");

  const handleSubmitCallBack = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(note);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      dialogClassName={"model-common property-feedback-model"}
    >
      <Modal.Body>
        <form
          className="property-feedback-form"
          onSubmit={handleSubmitCallBack}
        >
          <strong className="heading">
            Thank you for your feedback. This will help us be more accurate with
            other property suggestions.
            {isFav ? null : (
              <span>
                If you could please provide us with additional feedback about
                why you didn't like this unit, it will greatly help us improve
                our property selections.
              </span>
            )}
          </strong>
          <div className="form-group input-form">
            <textarea
              rows={3}
              id="comments"
              name="comments"
              maxLength={300}
              className="form-control"
              placeholder="Share it here"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group input-button">
            <a
              href="javascript:void(0)"
              className="btn secondary text-uppercase"
              onClick={handleClose}
            >
              Cancel
            </a>
            <button type="submit" className="btn primary">
              Submit
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
