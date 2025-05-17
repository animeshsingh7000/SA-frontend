import React from "react";
import { MessageModalContext } from "../contexts/MessageModalProvider";


export function useMessageModal() {
  return React.useContext(MessageModalContext);
}