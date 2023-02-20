import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Card from "../components/Card/Card";
import { Card as Crd, Form } from "react-bootstrap";
import {Button} from "react-bootstrap";
import './css/createAd.css';
import {AiOutlineEdit,AiOutlineCloseCircle,AiFillPlusSquare,AiOutlineDelete,AiOutlineEye} from "react-icons/ai";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DefaultContext } from "react-icons/lib";

function Myads(){

    const [editView,setEditView] = useState(false);
    const [detailedView,setDetailedView] = useState(false);
    const [detailTeacher,setDetailTeacher] = useState({});
    const [focusedAd, setFocusedAd] = useState({});
    const [searchRes, setSearchRes] = useState([]);
    const {loggedIn} = useContext(AuthContext);
    const [subject,setSubject] = useState("");
    const [mode,setMode] = useState("");
    const [price,setPrice] = useState("");
    const [location,setLocation] = useState("");
    const navigate = useNavigate();

    async function fillData(){
        axios.get(process.env.REACT_APP_API+"/advert/getmyads").then((response)=>{
            setSearchRes(response.data);
        }).catch((error)=>{
            console.log(error);
        })
    }

    useEffect((e)=>{
        fillData();
    },[])

    function getDetailedInfo(ad){
        setFocusedAd(ad);
        axios.get(`${process.env.REACT_APP_API}/data/getuserinfo/${ad.tid}`).then((response)=>{
            setDetailedView(true);
            setDetailTeacher(response.data);
            console.log(response);
        }).catch((error)=>{
            console.log(error.response);
        });
    }

    function handleSubmit(e){
        e.preventDefault();
        axios.post(process.env.REACT_APP_API+"/advert/editmyad",{
            subject: subject,
            mode: mode,
            price: price,
            location: location,
            adid:focusedAd._id
        }).then((response)=>{
            console.log(response);
            setEditView(false);
            fillData();
            setFocusedAd({});
        }).catch((error)=>{
            console.log(error);
        });
    }

    function fillOldInfo(ad){
        setFocusedAd(ad);
        setSubject(ad.subject);
        setPrice(ad.price);
        setLocation(ad.location);
        setMode(ad.mode);
        setEditView(true);
    }

    function editInfo(){
        return(
            <div className="edit-window">
                {/* <div className="form-holder"> */}
                    <Card heading="Edit Ad" showHeading={true} showBr={true}>
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
                                        Edit Ad
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button  variant="warning" onClick={closeInfo}>
                                        Cancel
                                    </Button>
                                </Form.Group>
                            </Form>
                        </div>
                    </Card>
                {/* </div> */}
            </div>
        )
    }




    function showInfo(){
        return(
            <div className="detail-window">
                <Card heading="Student's View" showHeading={true} showBr={true} >
                    <div className="detail-encap">
                        {/* div for placing details */}
                        <Card heading="How I Teach" showHeading={true} showBr={false}>
                            <p>Lorem ipsum dolor s in congue lorem mi nec erat. Etiam id condimentum massa, a eleifend tellus. Duis sit amet vestibulum magna.</p>
                            <p>Lorem ipsum dolor s in congue lorem mi nec erat. Etiam id condimentum massa, a eleifend tellus. Duis sit amet vestibulum magna.</p>
                            <p>Lorem ipsum dolor s in congue lorem mi nec erat. Etiam id condimentum massa, a eleifend tellus. Duis sit amet vestibulum magna.</p>
                        </Card>
                        {/* div for placing image and name and rating */}
                        <div className="image-holder">
                            <Crd className=" card-sz-siri">
                                <Crd.Img variant="top" src={focusedAd.img}/>
                                <Crd.Body>
                                    <Crd.Title>
                                        <span className="card-title-siri">
                                            {detailTeacher.name}
                                        </span>
                                    </Crd.Title>
                                    <Crd.Text>
                                        <span className="card-content-siri">
                                            Subject: {focusedAd.subject}<br/>
                                            Location: {focusedAd.location}<br/>
                                            Price: ₹{focusedAd.price}/hr
                                            {/* {props.content === "" ? "" : props.content} */}
                                            {/* {props.content === "" ? "Some quick example text to build on the card title and make up the bulk of the card's content." : props.content} */}
                                        </span>
                                    </Crd.Text>
                                    <Button variant="outline-primary">Send Request Button</Button>
                                </Crd.Body>
                            </Crd>
                        </div>

                        
                        
                    </div>
                </Card>

                <button className="close-details btn btn-outline-danger" onClick={closeInfo}> <AiOutlineCloseCircle size={30}/></button>
            </div>
        )
    }

    function closeInfo(){
        setFocusedAd({});
        setDetailedView(false);
        setEditView(false);
        setDetailTeacher({});

    }

    function deleteAd(id){
        if(window.confirm('Are you sure you want to delete this ad?')){
            axios.delete(`${process.env.REACT_APP_API}/advert/deletead/${id}`).then((respone)=>{
                console.log(respone);
                fillData();
            }).catch((error)=>{
                console.log(error);
            })
        }
    }

    function CardTemplate(arr){
        return (
            <div className="card-holder-siri">
                    {arr.map((ad,idx) => {
                        return(
                            <Crd className="profile-style-siri-search card-sz-siri" key={idx}>
                                {/* <Crd.Header>Header</Crd.Header> */}
                                <Crd.Img variant="top" src={ad.img} />
                                <button className="delete-btn btn btn-outline-danger"
                                    onClick={()=>{deleteAd(ad._id)}}>
                                    <AiOutlineDelete size={30} />
                                </button>

                                <button className="student-v-btn btn btn-outline-warning"
                                    onClick={()=>{getDetailedInfo(ad)}}>
                                    <AiOutlineEye size={30} />
                                </button>
                                
                                <button className="edit-btn btn btn-outline-info"
                                    onClick={(e)=>{fillOldInfo(ad)}}>
                                    <AiOutlineEdit size={30} />
                                </button>

                                <Crd.Body>
                                    <Crd.Title>
                                        <span className="card-title-siri">
                                            {ad.name}
                                        </span>
                                    </Crd.Title>
                                    <Crd.Text>
                                        <span className="card-content-siri">
                                            Subject: {ad.subject}<br/>
                                            Location: {ad.location}<br/>
                                            Price: ₹{ad.price}/hr
                                            {/* {props.content === "" ? "" : props.content} */}
                                            {/* {props.content === "" ? "Some quick example text to build on the card title and make up the bulk of the card's content." : props.content} */}
                                        </span>
                                    </Crd.Text>
                                </Crd.Body>
                            </Crd>
                        );
                    })}
            </div>
        );
    }

    function createNewAd(e){
        navigate("/createad")
    }

    return(
        <Card>
            <center><Button variant="success" onClick={createNewAd}><AiFillPlusSquare size={20} style={{margin:"0",padding:"0",}}/> Create New Advert</Button></center><br/>
            {CardTemplate(searchRes)}

            {/* if the users clicks on the i(info) button this component will be shown displaying details of the teacher*/}
            {loggedIn && detailedView && showInfo()}
            {loggedIn && editView && editInfo()}
        </Card>

        
    );
}

export default Myads;