import React, { useMemo } from "react";
import { InfoModal } from "../components";
import { MessageModal } from "../types/global.type";

interface MessageModalContextType {
  showMessage: (newConfig: MessageModal) => void;
  hideMessage: () => void;
}

export const MessageModalContext = React.createContext<MessageModalContextType>({
  showMessage: () => {},
  hideMessage: () => {}
});

export function MessageModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [show, setShow] = React.useState<boolean>(false);
  const [config, setConfig] = React.useState<MessageModal>({} as MessageModal);

  const showMessage = (newConfig: MessageModal) => {
    setConfig(newConfig);
    setShow(true);
  };

  const hideMessage = () => {
    setShow(false);
  };

  const value = useMemo(() => ({ showMessage, hideMessage }), []);

  return (
    <MessageModalContext.Provider value={value}>
      {children} <InfoModal {...config} show={show} handleClose={hideMessage} />
    </MessageModalContext.Provider>
  );
}