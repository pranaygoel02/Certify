import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('_certify_user')))    
    const [showProfileModal, toggleProfileModal] = useState(false)

    useEffect(() => {
        if(user) {
            if(!user?.isVerified) toggleProfileModal(true)
            localStorage.setItem('_certify_user', JSON.stringify(user))
        }
        else {
            localStorage.removeItem('_certify_user')
        }
    },[user])

    const userLoggedIn = useMemo(() => {
        return user !== null && user !== undefined
    },[user])

    const logout = () => {
        setUser(null)
        localStorage.removeItem('_certify_user')
        window.location.href = '/'
    }

    return (
        <UserContext.Provider
            value={{
                user,
                userLoggedIn,
                setUser,
                logout,
                showProfileModal,
                toggleProfileModal
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => useContext(UserContext);
