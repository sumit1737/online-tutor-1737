import React from "react"
import { Card as Crd } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {Button} from "react-bootstrap";
import './card.css';
import av1 from "../../res/avatar-4.png";

function Card(props){
    function CardTemplate(arr){
        return (
            <div className="card-holder-siri">
                    {arr.map((card,idx) => {
                        return(
                            <Crd className="profile-style-siri card-sz-siri" key={idx}>
                                <Crd.Img variant="top" src={av1} />
                                <Crd.Body>
                                    <Crd.Title><span className="card-title-siri">Sumit Saini</span></Crd.Title>
                                    <Crd.Text>
                                        <span className="card-content-siri">
                                            {/* {props.content === "" ? "" : props.content} */}
                                            {props.content === "" ? "Some quick example text to build on the card title and make up the bulk of the card's content." : props.content}
                                        </span>
                                    </Crd.Text>
                                    <Button variant="outline-primary">Go somewhere</Button>
                                </Crd.Body>
                            </Crd>
                        );
                    })}
            </div>
        );
    }

    return(
        <div className={ (props.topless ? "card card-siri top-less" : "card card-siri") + " " + (props.showShadow ? "show-shadow" : "")}>
            <div className="card-body card-body-siri">
                {props.showHeading && <div><h1 className="heading">{props.heading}</h1></div>}
                {/* {props.showCard && CardTemplate(props.images)} */}
                {props.showHeading && props.showBr && <br />}
                {props.children}
            </div>
        </div>
        
    );
}

Card.defaultProps = {
    showBr: true,
    content: "",
    topless: false,
    showShadow: false,
}


export default Card;