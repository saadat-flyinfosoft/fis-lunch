"use client"
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { app } from "../firebase/firebase.config";
import useStore from "../../store";

export const AuthContext = createContext(null);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Access the Zustand store's setUser function
    const setStoreUser = useStore((state) => state.setUser);

    const googleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, provider)
    }

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    const authInfo = {
        user,
        loading,
        googleLogin,
        logOut,
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            if (currentUser) {
                setLoading(false);
                setStoreUser(currentUser); // Save the user to Zustand store
            }

            // console.log('current user:', currentUser?.displayName, currentUser?.email);
        })

        return () => {
            return unsubscribe();
        };
    }, [setStoreUser]); // Ensure that this effect runs only once and update the store

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;