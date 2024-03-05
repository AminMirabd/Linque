import React, { createContext, useContext, useState } from "react";

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [userData, setUserData] = useState({});

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        email,
        setEmail,
        uid,
        setUid,
        userData,
        setUserData,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;