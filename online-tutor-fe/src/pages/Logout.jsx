import axios from 'axios'
import React, { useContext } from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import AuthContext from  "../context/AuthContext";

export default function Logout() {
    const {getLoggedIn} = useContext(AuthContext);
    const navigate = useNavigate();

    async function logout(){
        await axios.get(process.env.REACT_APP_API+"/entry/logout");
        await getLoggedIn();
        navigate("/");
    }
    return (
        <Button variant="outline-danger" onClick={logout}>Log Out</Button>
    )
}
