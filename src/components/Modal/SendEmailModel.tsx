import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import {
  getNotesForProperty,
  sendInvoiceEmail,
  submitNotes,
} from "../../api/rental/rentalInquiry";
import { useAuth } from "../../hooks/useAuth";
import { toast } from 'react-toastify';
import { FormControl } from "../FormElements/FormControl";
import { Form } from "react-final-form";


export default function SendEmailModel({
  show,
  invoiceId,
  handleClose,
}: {
  show: boolean;
  invoiceId: string;
  handleClose: VoidFunction;
}) {
  const auth = useAuth();

  const onSubmit = (values:any) => {
    // e.preventDefault();
    // e.stopPropagation();
    // const existingNotes = notes[0]?.notes || []; // Safely accessing notes
    sendInvoiceEmail(invoiceId, values).then(
      (res) => {
        toast.success('Email has been added successfully')
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
        <strong className="d-block">Send Invoice Email</strong>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-group input-form">
              <FormControl
                  label="Email"
                  name="email"
                  type="Email"
                  placeholder="Email"
              />
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
        )}
       />
      </Modal.Body>
    </Modal>
  );
}
