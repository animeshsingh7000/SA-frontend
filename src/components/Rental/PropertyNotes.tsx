import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import {
  getNotesForProperty,
  submitNotes,
} from "../../api/rental/rentalInquiry";
import { useAuth } from "../../hooks/useAuth";
import { formatDate, formatDateNotes } from "../../utils/common";
import { toast } from 'react-toastify';


export default function PropertyNotes({
  show,
  propertyId,
  handleClose,
}: {
  show: boolean;
  propertyId: string;
  handleClose: VoidFunction;
}) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ notes: string[], createdAt: string }[]>([]);
  const auth = useAuth();

  useEffect(() => {
    getNotesForProperty(propertyId).then((res) => {
      setNotes(res.data);
    });
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const existingNotes = notes[0]?.notes || []; // Safely accessing notes
    submitNotes({ notes: [note, ...existingNotes], propertyId }).then(
      (res) => {
        toast.success('Property note has been added successfully')
        handleClose();
      }
    );
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      dialogClassName={"model-common property-feedback-model"}
    >
      <Modal.Body className="property-feedback-form">
        <strong className="d-block">Add Your Note</strong>
        <div className="notes-container">
          <div className="notes-scroll">
            {notes.map((note) => (
              <>
                {note.notes.map((item) => (
                  <div className="notes-row">
                    <span className="d-block note-posted-date">
                      Posted by {auth?.user?.email} | {formatDateNotes(note.createdAt)}
                    </span>
                    <span className="d-block note-text">{item}</span>
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group input-form">
            <textarea
              rows={3}
              id="comments"
              name="comments"
              maxLength={300}
              className="form-control"
              placeholder="Add note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group input-button">
            <button type="button" className="btn secondary text-uppercase" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Submit
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
