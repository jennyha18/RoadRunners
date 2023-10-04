import { UserContext } from "../context/UserContext";
import { useContext } from 'react';

export const useUserContext = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUserContext must be used inside the UserContext provider');
    }

    return context;
}