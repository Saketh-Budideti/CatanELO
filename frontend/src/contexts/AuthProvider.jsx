import { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "../csrf/csrf.jsx";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { LinearProgress, Stack } from "@mui/material";


const AuthContext = createContext()


// Provides authentication status to children
// NOTE: The authorization state can be maliciously changed
// This should just be used to determine if a user can access a page
function AuthProvider({children}) {

    const checkUserAuth = () => axios.get('/api/user/is-auth/', {
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        withCredentials: true
    })
    .then(res => res.data.authenticated)
    .catch(ex => {
        console.error(ex.response?.data || ex.message)
        return false
    })

    useEffect(() => {checkUserAuth()}, [])

    return <AuthContext.Provider value={{checkUserAuth}}>
        {children}
    </AuthContext.Provider>
}


// Automatically reroutes unauthorized users to signin page
function RequireAuth({children}) {
    const { checkUserAuth } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        if(checkUserAuth)
            checkUserAuth().then(authorized => {
                setLoading(false)
                setIsAuthorized(authorized)
            })
    }, [])

    if(loading)
        return (
            <Stack sx={{width: '100%'}}>
                <LinearProgress />
            </Stack>
        )
    else if(!isAuthorized)
        return <Navigate to='/signin'/>
    else
        return children
}

// Automatically reroutes authorized users to their profile page (?)
function RequireNoAuth({children}) {
    const { checkUserAuth } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        if(checkUserAuth)
            checkUserAuth().then(authorized => {
                setLoading(false)
                setIsAuthorized(authorized)
            })
    }, [])

    if(loading)
        return (
            <Stack sx={{width: '100%'}}>
                <LinearProgress />
            </Stack>
        )
    else if(isAuthorized)
        return <Navigate to='/main' />
    else
        return children
}

export {AuthContext, AuthProvider, RequireAuth, RequireNoAuth}