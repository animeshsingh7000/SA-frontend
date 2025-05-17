export interface MessageModal {
  heading: React.ReactNode | string;
  body: React.ReactNode | string;
  footer?: React.ReactNode | string;
  type: "success" | "error" | "info" | "warning" | "delete";
  callback?: (data?: any) => void;
  buttonMain?: string;
}

export interface MessageModalType extends MessageModal {
  show: boolean;
  handleClose: () => void;
  buttonMain?: string;
  buttonSecondary?:string;
  hideIcon?: boolean
}

export type Any = any;


declare module 'react-slick'
