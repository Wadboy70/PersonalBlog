import { createContext, useContext, useEffect, useState } from "react";
import { COLLECTION_NAMES, getSingleFirestoreDoc } from "./firestore";
import useFirebaseAuth from "./useFirebaseAuth";

const AuthUserContext = createContext({
  authUser: null,
  loading: true,
  validUser: null,
  setValidUser: () => {},
  signInWithGoogle: async () => {},
  signOutFirebaseUser: async () => {},
});

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();
  const [validUser, setValidUser] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await getSingleFirestoreDoc(
        COLLECTION_NAMES.USERS,
        auth.authUser.email
      );
      if (result && !result.error) {
        setValidUser(true);
        return;
      }
      setValidUser(null);
    };
    if (auth.authUser) {
      checkAuth();
      return;
    }
    setValidUser(false);
  }, [auth.authUser]);

  return (
    <AuthUserContext.Provider value={{ ...auth, validUser, setValidUser }}>
      {children}
    </AuthUserContext.Provider>
  );
}
// custom hook to use the AuthUserContext and access authUser and loading
export const useAuth = () => useContext(AuthUserContext);
