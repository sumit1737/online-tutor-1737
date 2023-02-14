import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Card as Crd } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./personalInfo.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Card from "../Card/Card";

function PersonalInfo(props){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [about, setAbout] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setpasswordVerify] = useState("");
    const [profileImg,setProfileImg] = useState("");
    const [userObj, setUserObj] = useState({});
    const [rating, setRating] = useState("");
    const {getLoggedIn} = useContext(AuthContext);
    const navigate = useNavigate();
    const [canEdit, setCanEdit] = useState(false); // to edit personal info by making the form editable

    async function fillData(){
        axios.get("http://127.0.0.1:6969/data/getmyinfo").then((response)=>{
            // console.log(response.data);
            setUserObj(response.data);
            setName(response.data.name);
            setEmail(response.data.email);
            setProfileImg(response.data.img);
            setAbout(response.data.about);
            setContact(response.data.contact);
            setRating(response.data.rating);
        }).catch((error)=>{
            console.log(error);
        })
    }

    useEffect(()=>{
        fillData();
    },[]);

    async function handleSubmit(e){
        
        e.preventDefault();
        let cred = {
            name: name,
            email: email,
            password: password,
            passwordVerify: passwordVerify,
            img: profileImg,
            about: about,
            contact:contact
        }
        let response = await axios.post("http://127.0.0.1:6969/entry/updateself",cred,{
            withCredentials: true
        });
        console.log("done");
        window.alert("Information Updated");
        setCanEdit(false);
        
        await getLoggedIn();
        navigate("/");
    }

    const handleFileUpload = async (e) =>{
        const file = e.target.files[0];
        const base64 = await convertBase64R(file);
        setProfileImg(base64);
    }

    function profilePic(){
        return(
            <Crd className=" card-sz-siri">
                <Crd.Img variant="top" src={profileImg}/>
                <Crd.Body>
                    <Crd.Title>
                        <span className="card-title-siri">
                            {name}
                        </span>
                    </Crd.Title>
                    <Crd.Text>
                        <span className="card-content-siri">
                            {rating} ⭐
                        </span>
                    </Crd.Text>
                </Crd.Body>
            </Crd>
        );
    }

    return(
        <div className="info-holder">
            <Card heading="Register" showHeading={false} showBr={true}>
                <div className="org-flex">
                    <div className="inf-block">
                        <fieldset disabled={!canEdit}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Name" value={name} onChange={(e)=>{setName(e.target.value);}} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value);}} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicContact">
                                    <Form.Label>Contact</Form.Label>
                                    <Form.Control type="number" placeholder="Phone Number" value={contact} onChange={(e)=>{setContact(e.target.value);}} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicAbout">
                                    <Form.Label>About You</Form.Label>
                                    <Form.Control as="textarea" placeholder="Tell us something about you!" value={about} onChange={(e)=>{setAbout(e.target.value);}} aria-label="With textarea" />
                                </Form.Group>
                                {!canEdit && <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Students: {userObj.students}</Form.Label><br/>
                                    <Form.Label>Teachers: {userObj.teachers}</Form.Label><br/>
                                    <Form.Label>Adverts: {userObj.ads}</Form.Label><br/>
                                    {/* <Form.Control type="text" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value);}} /> */}
                                </Form.Group>}
                                {canEdit && <> <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value);}} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPasswordVerify">
                                    <Form.Label>Verify Password</Form.Label>
                                    <Form.Control type="password" placeholder="Repeate Password" value={passwordVerify} 
                                    onChange={(e)=>{
                                        setpasswordVerify(e.target.value);
                                    }} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicImage">
                                    <Form.Label>Profile Image</Form.Label>
                                    <Form.Control type="file" placeholder="Profile Image" accept={".jpeg, .png, .jpg"} onChange={(e)=>handleFileUpload(e)} />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary" type="submit">
                                        Save Changes
                                    </Button>
                                </Form.Group></>}
                            </Form>
                        </fieldset>
                        <br/>
                        <Form>
                            <Form.Check 
                                type="switch"
                                id="custom-switch"
                                label="Edit Details"
                                checked={canEdit}
                                onChange={(e)=>{setCanEdit(e.target.checked)}}
                            />
                        </Form>
                    </div>
                    {profilePic()}
                </div>
            </Card>
        </div>
    );
}

export default PersonalInfo;

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