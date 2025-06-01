import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

export default function fetchCurrentUser() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => unsubscribe();
      }, []);

    const username = user?.displayName || user?.email || '';

    return {user, username };
}