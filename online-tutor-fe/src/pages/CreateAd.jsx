import React, { useState } from "react";
import Card from "../components/Card/Card";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./css/createAd.css";
import axios from "axios";


function CreateAd(props){

    const [subject,setSubject] = useState("");
    const [mode,setMode] = useState("");
    const [price,setPrice] = useState("");
    const [location,setLocation] = useState("");

    function handleSubmit(e){
        e.preventDefault();
        axios.post("http://127.0.0.1:6969/advert/createnewad",{
            subject: subject,
            mode: mode,
            price: price,
            location: location
        }).then((response)=>{
            console.log(response);
            setSubject("");
            setMode("");
            setPrice("");
            setLocation("");
        }).catch((error)=>{
            console.log(error);
        });
    }


    return(
        <div className="form-holder">
            <Card heading="Create Ad" showHeading={true} showBr={true}>
                <div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicSubject">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control type="text" placeholder="Enter Subject" value={subject} onChange={(e)=>{setSubject(e.target.value);}} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Mode</Form.Label>
                            <Form.Control type="text" placeholder="Online/Offline" value={mode} onChange={(e)=>{setMode(e.target.value);}} />
                        </Form.Group>
                        <Form.Group className="mb-3 price" controlId="formBasicPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" placeholder="Price per hr in ₹" value={price} onChange={(e)=>{setPrice(e.target.value);}} />
                        </Form.Group>
                        <Form.Group className="mb-3 loc" controlId="formBasicLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" placeholder="Location" value={location} onChange={(e)=>{setLocation(e.target.value);}} />
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" type="submit">
                                Create Ad
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
            </Card>
        </div>
    );
}

export default CreateAd;