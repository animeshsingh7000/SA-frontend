export interface User {
  userRole?: number;
  email: string;
  // password?: string;
  firstName: string;
  lastName?: string;
  _id?: string;
  image?: string;
  Id?: string;
  // loginStatus?: number;
  isOwner: boolean;
  mobile: string;
  images: any;
  isAttache: boolean;
  isGuest: boolean;
  activeToken?: string; // JWT token for authenticated API calls
}

export interface AuthType {
  email: string;
  password: string;
  role?: number;
  name?: string;
  isRemember?: boolean;
}

export interface Member {
  _id: string;
  email: string;
  surname?: string;
  name: string;
  image?: string;
  position?: string;
  status: number;
  createdAt?: string;
  loginStatus?: number;
}

export interface MemberProfile {
  skillDetails: {
    skill: string;
    percent: string;
  }[];
  taskCapacity: Record<string, string>;
  totalTasksDone: number;
  userInfo: User;
}
