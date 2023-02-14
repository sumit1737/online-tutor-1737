import axios from "axios";
import React, { useContext, useState } from "react";
import Card from "../components/Card/Card";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./css/createAd.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {getLoggedIn} = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        let cred = {
            email: email,
            password: password
        }
        let response = await axios.post("http://127.0.0.1:6969/entry/login",cred,{
            withCredentials: true
        }).catch((error)=>{
            console.log("hello",error.response.status);
        });
        await getLoggedIn();
        navigate("/");
    }

    return(
        <div className="form-holder">
            <Card heading="Log in" showHeading={true} showBr={true}>
                <div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control required type="email" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value);}} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control required type="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value);}} />
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" type="submit">
                                Log in
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
            </Card>
        </div>
    );
}

export default Login;