import axios from "axios";
import React, { useContext, useState } from "react";
import Card from "../components/Card/Card";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./css/createAd.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Register(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [about, setAbout] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setpasswordVerify] = useState("");
    const [profileImg,setProfileImg] = useState("");
    const {getLoggedIn} = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        let cred = {
            name: name,
            email: email,
            contact: contact,
            password: password,
            passwordVerify: passwordVerify,
            img: profileImg,
            about: about
        }
        let response = await axios.post("http://127.0.0.1:6969/entry/register",cred,{
            withCredentials: true
        }).catch((error)=>{
            console.log("hello",error.response.status);
        });
        await getLoggedIn();
        navigate("/");
    }

    const handleFileUpload = async (e) =>{
        const file = e.target.files[0];
        const base64 = await convertBase64R(file);
        setProfileImg(base64);
    }

    return(
        <div className="form-holder">
            <Card heading="Register" showHeading={true} showBr={true}>
                <div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control required type="text" placeholder="Name" value={name} onChange={(e)=>{setName(e.target.value);}} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control required type="email" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value);}} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicContact">
                            <Form.Label>Contact</Form.Label>
                            <Form.Control maxLength={10} minLength={10} required type="number" placeholder="Phone Number" value={contact} onChange={(e)=>{setContact(e.target.value);}} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicAbout">
                            <Form.Label>About You</Form.Label>
                            <Form.Control as="textarea" placeholder="Tell us something about you!" value={about} onChange={(e)=>{setAbout(e.target.value);}} aria-label="With textarea" />
                            {/* <Form.Control type="number"  /> */}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicImage">
                            <Form.Label>Profile Image</Form.Label>
                            <Form.Control required type="file" placeholder="Profile Image" accept={".jpeg, .png, .jpg"} onChange={(e)=>handleFileUpload(e)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control minLength={6} required type="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value);}} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPasswordVerify">
                            <Form.Label>Verify Password</Form.Label>
                            <Form.Control minLength={6} required type="password" placeholder="Repeate Password" value={passwordVerify} 
                            onChange={(e)=>{
                                setpasswordVerify(e.target.value);
                            }} />
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

export default Register;

function convertBase64(file){
    return new Promise((resolve,reject)=>{
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = ()=>{
            resolve(fileReader.result);
        };
        fileReader.onerror = (error)=>{
            reject(error)
        }
    });
}

function convertBase64R(file){
    return new Promise((resolve,reject)=>{
        const WIDTH = 250;
        const HEIGHT = 333;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event)=>{
            let image_url = event.target.result;
            let image = document.createElement("img");
            image.src = image_url;

            image.onload = (e) =>{
                let canvas = document.createElement("canvas");
                let ratio = WIDTH/e.target.width;
                canvas.width = WIDTH;
                // canvas.height = e.target.height * ratio;
                // console.log(canvas.height);
                canvas.height = HEIGHT;
                const context = canvas.getContext("2d");
                context.drawImage(image, 0,0, canvas.width, canvas.height);
                let new_image_url = context.canvas.toDataURL("image/jpeg",50);
                // let new_image = document.createElement("img");
                // new_image.src = new_image_url;
                resolve(new_image_url);
                // document.getElementById("wrapper").appendChild(new_image);
            }
        }
    });
}