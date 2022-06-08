import { useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import app from "./firebase";
import {
  COLLECTION_NAMES,
  getSingleFirestoreDoc,
  mergeFirestoreDoc,
} from "./firestore";

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    var formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setLoading(false);
  };

  // listen for firebase state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  const clear = () => {
    setAuthUser(null);
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then(async (authUser) => {
        if (
          !(await getSingleFirestoreDoc(
            COLLECTION_NAMES.USERS,
            authUser.user.uid
          ))
        ) {
          await mergeFirestoreDoc(
            {
              uid: authUser.user.uid,
              email: authUser.user.email,
              date: new Date(),
            },
            COLLECTION_NAMES.USERS,
            authUser.user.uid
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return {
    authUser,
    loading,
    signInWithGoogle,
  };
}
