import { createContext, useState, useEffect, useContext } from "react";
import defaultPfp from '../assets/default_pfp.jpeg'
import { getCookie } from "../csrf/csrf.jsx";
import { AuthContext } from "./AuthProvider.jsx";
import { LinearProgress, Stack } from "@mui/material";
import axios from "axios";

const UserContext = createContext();

function UserProvider({ children }) {
    const [user, setUser] = useState(null); // Start with `null` for proper loading state
    const [userDataLoading, setUserDataLoading] = useState(true);
    const [holiday, setHoliday] = useState("Default"); // Add holiday state

    const setUserData = (data) => {
        setUser({
            ...data,
            profile_img: data?.profile_img || defaultPfp,
        });
    };

    const refreshUserData = async () => {
        setUserDataLoading(true);
        try {
            const res = await axios.get('/api/user/profile/', {
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                withCredentials: true,
            });
            setUserData(res.data);
        } catch (error) {
            console.error(error.response?.data || error.message);
            window.alert('Failed to retrieve user data. Check console for details.');
        } finally {
            setUserDataLoading(false);
        }
    };

    useEffect(() => {
        refreshUserData(); // Fetch user data when component mounts
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                refreshUserData,
                userDataLoading,
                holiday,
                setHoliday, // Add setHoliday to context value
            }}
        >
            {userDataLoading ? (
                // Optionally show a loading spinner or fallback UI while data loads
                <Stack spacing={2} sx={{ width: '100%', marginTop: 4 }}>
                    <LinearProgress />
                </Stack>
            ) : (
                children
            )}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider };