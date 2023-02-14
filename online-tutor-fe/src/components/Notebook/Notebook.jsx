import axios from "axios";
import React, { useState } from "react";
import { Button, Card as Crd } from "react-bootstrap";
import {AiOutlineCloseCircle,AiFillCheckCircle,AiFillDelete,AiFillEye, AiOutlineInfo} from "react-icons/ai";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from "../Card/Card";
import PersonalInfo from "../PersonalInfo/PersonalInfo"
import "./notebook.css"

function Notebook(props){

    const [currTab,setCurrTab] = useState("");
    const [requests,setRequests] = useState([]);
    const [teachers,setTeachers] = useState([]);
    const [focusedTeacher,setFocusedTeacher] = useState(undefined);
    const [students,setStudents] = useState([]);
    const [focusedStudent,setFocusedStudent] = useState(undefined);
    const [rating,setRating] = useState(undefined);




    // handling and showing requests
    function fillRequest(){
        axios.get("http://127.0.0.1:6969/data/getmyrequests").then((response)=>{
            console.log(response.data);
            setRequests(response.data);
        }).catch((error)=>{
            window.alert(error.response.data.errorMessage);
        })
    }

    function drawRequest(requestArr){
        return (
            <div className="card-holder-siri">
                    {requestArr.map((request,idx) => {
                        return(
                            <Crd className="profile-style-siri-search card-sz-siri" key={idx}>
                                {/* <Crd.Header>Header</Crd.Header> */}
                                <Crd.Img variant="top" src={request.senderInfo.img} />
                                <button className="reject-btn btn btn-outline-danger"
                                    onClick={()=>{
                                        axios.delete(`http://127.0.0.1:6969/request/deletereq/${request.reqInfo._id}`).then((repsonse)=>{
                                            fillRequest();
                                        }).catch((error)=>{
                                            window.alert(error.response.data.errorMessage);
                                        })
                                    }}>
                                    <AiFillDelete size={30} />
                                </button>

                                {request.adInfo && !request.reqInfo.status && <>
                                <button className="student-info-btn btn btn-outline-warning"
                                    onClick={()=>{}}>
                                    <AiFillEye size={30} />
                                </button>
                                
                                <button className="accept-btn btn btn-outline-success"
                                    onClick={(e)=>{
                                        axios.post("http://127.0.0.1:6969/request/approved",{
                                            reqId: request.reqInfo._id
                                        }).then((response)=>{
                                            console.log(response);
                                            fillRequest();
                                        }).catch((error)=>{
                                            window.alert(error.response.data.errorMessage);
                                        })
                                    }}>
                                    <AiFillCheckCircle size={30} />
                                </button>
                                </>}
                                <Crd.Body>
                                    <Crd.Title>
                                        <span className="card-title-siri">
                                            {request.senderInfo.name}
                                        </span>
                                    </Crd.Title>
                                    <Crd.Text>
                                        <span className="card-content-siri">
                                            {
                                                request.adInfo &&
                                                <>
                                                    Subject: {request.adInfo.subject}
                                                </>
                                            }
                                            {
                                                !request.adInfo &&
                                                <>
                                                    Request Accepted!
                                                </>
                                            }
                                        </span>
                                    </Crd.Text>
                                </Crd.Body>
                            </Crd>
                        );
                    })}
            </div>
        );
    }

    //handling and showing teachers
    function fillTeachers(){
        axios.get("http://127.0.0.1:6969/data/getmyteachers").then((response)=>{
            console.log(response.data);
            setTeachers(response.data);
        }).catch((error)=>{
            window.alert(error.response.data.errorMessage);
        })
    }

    function closeInfo(){
        setFocusedTeacher(undefined);
        setFocusedStudent(undefined);
    }

    function showTeacherInfo(){
        return(
            <div className="detail-window">
                <Card heading="" showHeading={false} showBr={true} >
                    <div className="detail-encap">
                        {/* div for placing details */}
                        <Card heading="How I Teach" showHeading={true} showBr={false}>
                            <p>{focusedTeacher.teacherDetails.about}</p>
                            
                            <div>
                                {
                                    focusedTeacher.subject.map((subj,idx) => {
                                        return(
                                            <span key={idx} >Subject: {subj.subName} &nbsp;&nbsp;Price: ₹{subj.price}/hr<br/></span>
                                        );
                                    })
                                }
                            </div>
                            <div>
                                <InputGroup  className="mb-2 rate-field-siri">
                                    <Form.Select aria-label="Default select example" onChange={(e)=>{setRating(e.target.value)}}>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </Form.Select>
                                    <Button variant="outline-primary" id="button-addon2" onClick={(e)=>{
                                        axios.post("http://127.0.0.1:6969/entry/giverating",{
                                            rating: rating,
                                            tid: focusedTeacher.teacherDetails._id
                                        }).then((response)=>{
                                            console.log(response);
                                            window.alert("Done rating!");
                                            fillTeachers();
                                        }).catch((error)=>{
                                            window.alert(error.response.data.errorMessage);
                                        })
                                    }}>
                                        Rate
                                    </Button>
                                </InputGroup>
                            </div>
                            
                        </Card>
                        {/* div for placing image and name and rating */}
                        <div className="image-holder">
                            <Crd className=" card-sz-siri">
                                <Crd.Img variant="top" src={focusedTeacher.teacherDetails.img}/>
                                <Crd.Body>
                                    <Crd.Title>
                                        <span className="card-title-siri">
                                            {focusedTeacher.teacherDetails.name}<br/>
                                            Students: {focusedTeacher.teacherDetails.students}
                                        </span>
                                    </Crd.Title>
                                    <Crd.Text>
                                    </Crd.Text>
                                </Crd.Body>
                            </Crd>
                        </div>

                        
                        
                    </div>
                </Card>

                <button className="close-details-t btn btn-outline-danger" onClick={closeInfo}> <AiOutlineCloseCircle size={30}/></button>
            </div>
        )
    }

    function drawTeachers(teacherArr){
        return (
            <div className="card-holder-siri">
                    {teacherArr.map((teacher,idx) => {
                        return(
                            <Crd className="profile-style-siri-search card-sz-siri" key={idx}>
                                {/* <Crd.Header>Header</Crd.Header> */}
                                <Crd.Img variant="top" src={teacher.teacherDetails.img} />
                                <button className="inf-t btn btn-outline-info"
                                    onClick={()=>{
                                        setFocusedTeacher(teacher);
                                    }}>
                                    <AiOutlineInfo size={30} />
                                </button>
                                <Crd.Body>
                                    <Crd.Title>
                                        <span className="card-title-siri">
                                            {teacher.teacherDetails.name} {teacher.teacherDetails.rating + " ⭐"} 
                                        </span>
                                    </Crd.Title>
                                    <Crd.Text>
                                    </Crd.Text>
                                </Crd.Body>
                            </Crd>
                        );
                    })}
            </div>
        );
    }


    //handling and showing students
    function fillStudents(){
        axios.get("http://127.0.0.1:6969/data/getmystudents").then((response)=>{
            console.log(response.data);
            setStudents(response.data);
        }).catch((error)=>{
            window.alert(error.response.data.errorMessage);
        })
    }

    function showStudentInfo(){
        return(
            <div className="detail-window">
                <Card heading="" showHeading={false} showBr={true} >
                    <div className="detail-encap">
                        {/* div for placing details */}
                        <Card heading="How I Teach" showHeading={true} showBr={false}>
                            <p>{focusedStudent.studentDetails.about}</p>
                            
                            <div>
                                {
                                    focusedStudent.subject.map((subj,idx) => {
                                        return(
                                            <span>Subject: {subj.subName} &nbsp;&nbsp;Price: ₹{subj.price}/hr<br/></span>
                                        );
                                    })
                                }
                            </div>
                            
                            </Card>
                        {/* div for placing image and name and rating */}
                        <div className="image-holder">
                            <Crd className=" card-sz-siri">
                                <Crd.Img variant="top" src={focusedStudent.studentDetails.img}/>
                                <Crd.Body>
                                    <Crd.Title>
                                        <span className="card-title-siri">
                                            {focusedStudent.studentDetails.name}<br/>
                                        </span>
                                    </Crd.Title>
                                    <Crd.Text>
                                    </Crd.Text>
                                </Crd.Body>
                            </Crd>
                        </div>

                        
                        
                    </div>
                </Card>

                <button className="close-details btn btn-outline-danger" onClick={closeInfo}> <AiOutlineCloseCircle size={30}/></button>
            </div>
        )
    }

    function drawStudents(studentArr){
        return (
            <div className="card-holder-siri">
                    {studentArr.map((student,idx) => {
                        return(
                            <Crd className="profile-style-siri-search card-sz-siri" key={idx}>
                                {/* <Crd.Header>Header</Crd.Header> */}
                                <Crd.Img variant="top" src={student.studentDetails.img} />
                                <button className="inf-t btn btn-outline-info"
                                    onClick={()=>{
                                        setFocusedStudent(student);
                                    }}>
                                    <AiOutlineInfo size={30} />
                                </button>
                                <Crd.Body>
                                    <Crd.Title>
                                        <span className="card-title-siri">
                                            {student.studentDetails.name} {student.studentDetails.rating}
                                        </span>
                                    </Crd.Title>
                                    <Crd.Text>
                                    </Crd.Text>
                                </Crd.Body>
                            </Crd>
                        );
                    })}
            </div>
        );
    }


    return(
        // heading="Notebook" showCard={false} showHeading={false} showbr={false} topless={true}
        <div>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="info-tab" data-bs-toggle="tab" data-bs-target="#info" type="button" role="tab" aria-controls="info" aria-selected="true" onClick={(e)=>{setCurrTab(e.target.id)}}>All Info</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="request-tab" data-bs-toggle="tab" data-bs-target="#request" type="button" role="tab" aria-controls="request" aria-selected="false" onClick={(e)=>{fillRequest()}}>Requests</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="teacher-tab" data-bs-toggle="tab" data-bs-target="#teacher" type="button" role="tab" aria-controls="teacher" aria-selected="false" onClick={(e)=>{fillTeachers()}}> Teachers</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="student-tab" data-bs-toggle="tab" data-bs-target="#student" type="button" role="tab" aria-controls="student" aria-selected="false" onClick={(e)=>{fillStudents()}}> Students</button>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab"><PersonalInfo /></div>
                <div className="tab-pane fade" id="request" role="tabpanel" aria-labelledby="request-tab">{drawRequest(requests)}</div>
                <div className="tab-pane fade" id="teacher" role="tabpanel" aria-labelledby="teacher-tab">
                    {drawTeachers(teachers)}
                    {focusedTeacher && showTeacherInfo()}
                </div>
                <div className="tab-pane fade" id="student" role="tabpanel" aria-labelledby="student-tab">
                    {drawStudents(students)}
                    {focusedStudent && showStudentInfo()}
                </div>
            </div>
        </div>
    );
}

export default Notebook;
