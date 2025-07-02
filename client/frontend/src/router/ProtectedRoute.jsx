import React from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function ProtectedRoute ({children}) {
    console.log({ accessToken: localStorage.getItem('accessToken') })
    if (!localStorage.getItem("accessToken")) {
        return <Navigate to='/login' />;
    }
    return (
        <Outlet />
    )
}