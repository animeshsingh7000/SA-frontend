import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-final-form";
import { Any } from "../../types/global.type";
import { useCustomMutation } from "../../hooks/useApi";
import { useEffect, useState } from "react";
import close from "../../assets/images/close.svg";
import { deleteRentalInquiry } from "../../api/admin/renterInquiry";
import { toast } from 'react-toastify';
import { createBlockDate } from "../../api/owner";
import { DatePickerControl } from "../FormElements/DatePicker";
import { composeValidators, required, requiredSelect } from "../../validations";
import PropertyListDropDown from "../SearchSelect/PropertyListDropDown";
import iconRemove from "../../assets/images/info-icon-green.svg";


const ICON = {
  delete: iconRemove,
};

export default function InformationModel({
  show,
  handleClose,
  updateListItem,
}: {
  show: boolean;
  handleClose: VoidFunction;
  updateListItem?: (data: any | undefined) => void;
}) {


  const backTo = () => {
      if (updateListItem) updateListItem(true);
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      keyboard={false}
      dialogClassName={"team-memeber-model delete-dialog _edit_enquiry_dailog"}
    >

      <div className="header-dialog _flx-wrap">
         <div className="close_icon">
         <img src={close} alt="info" onClick={handleClose} />

         </div>
          <div className="icondelete">
            <img src={ICON['delete']} alt="info" />
          </div>
        <h3>Edit Inquiry?</h3>
      </div>
      <div className="subheading-dialog _centertxt"> If you adjust the dates or edit your search, your favorites will not be saved in your new search.</div>

      <div className=" _centertxt" style={{ marginTop: "15px", marginBottom: "13px" }}>
        <Button className="btn primary" onClick={backTo}>
          Continue
        </Button>
      </div>
    </Modal>
  );
}