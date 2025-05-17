import { AxiosError } from "axios";
import React, { useMemo } from "react";
import { authetication } from "../api/";
import { AuthType, User } from "../types/User";
import { useMessageModal } from "./useMessage";


interface AuthContextType {
  user: User;
  signin: (user: AuthType, callback?: (response: any) => void) => void;
  signout: (callback?: VoidFunction) => void;
  saveToken: (user: any) => void;
  updateUserData: (data: any) => void;
  deleteToken: () => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { showMessage } = useMessageModal();
  let [user, setUser] = React.useState<any>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : null
  );

  const signin = (newUser: AuthType, callback?: (response: any) => void) => {
    return authetication
      .doSignIn(newUser)
      .then((response: { data: any }) => {
        
        saveToken(response.data);
        setTimeout(() => {
          callback && callback(response);
        }, 0);
      })
      .catch((error: AxiosError<{ message: string; status: number }>) => {
        showMessage({
          heading: "Error",
          body: <p>{error.response?.data?.message as string}</p>,
          type: "error",
        });
      });
  };

  const signout = (callback?: VoidFunction) => {
    localStorage.removeItem("impersonateToken")
    return authetication.doSignOut().then(() => {
      localStorage.clear();
      setUser(null);
      callback && callback();
    });
  };

  const saveToken = (user: any) => {
    localStorage.setItem("token", user.activeToken);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  const updateUserData =(data: any) => {
    const updatedUserData = {...user, ...data}
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  }

  const deleteToken = () => {
    localStorage.clear();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      signin,
      signout,
      saveToken,
      updateUserData,
      deleteToken
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
