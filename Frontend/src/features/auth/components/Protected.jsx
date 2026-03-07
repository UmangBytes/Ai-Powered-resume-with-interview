import React from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'


const Protected = ({children}) => {

    const {loading,user}=useAuth();


    if(loading){
        return (
            <main>
                Loading....
            </main>
        )
    }

    if(!user){
        return <Navigate to={"/login"} />
    }

    return  children
}

export default Protected
