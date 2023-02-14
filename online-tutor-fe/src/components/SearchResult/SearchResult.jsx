import React, { useContext, useEffect, useState } from "react";
import { Card as Crd } from "react-bootstrap";
import {Button} from "react-bootstrap";
import './searchResult.css';
import AuthContext from  "../../context/AuthContext";
import {AiOutlineInfoCircle,AiOutlineCloseCircle} from "react-icons/ai";
import axios from "axios";
import Card from "../Card/Card";

function SearchResult(props){

    const [detailedView,setDetailedView] = useState(false);
    const [detailTeacher,setDetailTeacher] = useState({});
    const [focusedAd, setFocusedAd] = useState({});
    const {loggedIn,currentUser} = useContext(AuthContext);
    const [sent, setSent] = useState([]);


    
    function fillSent(){
        axios.get("http://127.0.0.1:6969/data/getmyreq").then((response)=>{
            setSent(response.data);
        }).catch((error)=>{
        })
    }

    useEffect(()=>{
        fillSent();
    },[]);

    function getDetailedInfo(ad){
        setFocusedAd(ad);
        axios.get(`http://127.0.0.1:6969/data/getuserinfo/${ad.tid}`).then((response)=>{
            setDetailedView(true);
            setDetailTeacher(response.data);
            console.log(response);
        }).catch((error)=>{
            window.alert(error.response.data.errorMessage);
            // console.log(error.response);
        });
    }

    function myAd(teachId){
        if(currentUser && currentUser._id === teachId)return true;
        return false;
    }

    function reqButton(ad){
        if(myAd(ad.tid)){
            return <Button variant="outline-success" disabled onClick={(e)=>{sendRequest(ad)}}>Your Ad</Button>
        }else{
            if(alreadySent(ad._id)) return(<Button disabled variant="outline-success" onClick={(e)=>{sendRequest(ad)}}>Request Sent</Button>);
            else return(<Button variant="outline-primary" onClick={(e)=>{sendRequest(ad)}}>Send Request</Button>);
        }
    }

    function showInfo(){
        return(
            <div className="detail-window">
                <Card heading="Details" showHeading={true} showBr={true} >
                    <div className="detail-encap">
                        {/* div for placing details */}
                        <Card heading="How I Teach" showHeading={true} showBr={false}>
                            <p>{detailTeacher.about}</p>
                        </Card>
                        {/* div for placing image and name and rating */}
                        <div className="image-holder">
                            <Crd className=" card-sz-siri-detail">
                                <Crd.Img variant="top" src={focusedAd.img}/>
                                <Crd.Body>
                                    <Crd.Title>
                                        <span className="card-title-siri">
                                            {detailTeacher.name} &nbsp;{detailTeacher.rating !== 0 && detailTeacher.rating + " ⭐"}
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
                                    {reqButton(focusedAd)}
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
        setDetailTeacher({});
    }

    function sendRequest(ad){
        axios.post("http://127.0.0.1:6969/request/approval",{
            to:ad.tid,
            adi:ad._id
        }).then((response)=>{
            console.log(response);
            fillSent();
        }).catch((error)=>{
            window.alert(error.response.data.errorMessage);
        })
    }

    function alreadySent(adid){
        if(sent.indexOf(adid) > -1){
            return true;
        }return false;
    }

    function CardTemplate(arr){
        return (
            <div className="card-holder-siri">
                    {arr.map((ad,idx) => {
                        return(
                            <Crd className="profile-style-siri-search card-sz-siri" key={idx}>
                                {/* <Crd.Header>Header</Crd.Header> */}
                                <Crd.Img variant="top" src={ad.img} />
                                <button className="info-btn btn btn-outline-info"
                                    onClick={()=>{getDetailedInfo(ad)}}
                                >
                                    <AiOutlineInfoCircle size={30} />
                                </button>
                                <Crd.Body>
                                    <Crd.Title>
                                        <span className="card-title-siri">
                                            {ad.name} &nbsp;{ad.rating !== 0 && ad.rating + " ⭐"}
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
                                    {reqButton(ad)}
                                </Crd.Body>
                            </Crd>
                        );
                    })}
            </div>
        );
    }

    return(
        <div className="card-body card-body-siri">
            {CardTemplate(props.resultsArr)}

            {/* if the users clicks on the i(info) button this component will be shown displaying details of the teacher*/}
            {loggedIn && detailedView && showInfo()}
        </div>
    );
}

export default SearchResult;