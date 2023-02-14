import React, { useEffect, useState } from "react";
import Card from "../components/Card/Card";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from "axios";
import SearchResult from "../components/SearchResult/SearchResult";
import "./css/home.css";

function Home(props){

    const [subject, setSubject] = useState("");
    const [location, setLocation] = useState("");
    const [searchRes, setSearchRes] = useState([]);
    const [sortKey, setSortKey] = useState("");
    const [order, setOrder] = useState("");

    const fillData = async () => {
        axios.get("http://127.0.0.1:6969/advert/getallads").then((response)=>{
            setSearchRes(response.data);
        });
    }


    useEffect(()=>{
        fillData();
    },[]);


    const onSearch = async () => {
        let finalAds = [];
        
        if(subject === "" && location === ""){
            console.log("here");
            await fillData();
            return;
        }
        else if(subject !== "" && location !== ""){
            for(let i=0; i<searchRes.length; ++i){
                if(searchRes[i].subject.toUpperCase() === subject.toUpperCase() && searchRes[i].location.toUpperCase() === location.toUpperCase())
                    finalAds.push(searchRes[i]);
            }
        }else if(location === ""){
            for(let i=0; i<searchRes.length; ++i) 
                if(searchRes[i].subject.toUpperCase() === subject.toUpperCase())
                    finalAds.push(searchRes[i]);
            
        }
        setSearchRes(finalAds);
    }

    const onFilter = async () => {
        let or;
        if(order.toLowerCase() === "inc")or = -1;
        else if(order.toLowerCase() === "dec")or = 1;

        if(sortKey.toLowerCase() === "price"){
            let finalAds = [];
            searchRes.sort(function(a, b) {
                var keyA = a.price,
                keyB = b.price;
                // Compare the 2 dates
                if (keyA < keyB) return or;
                if (keyA > keyB) return -or;
                return 0;
            });
            for(let i=0; i<searchRes.length; ++i)finalAds.push(searchRes[i]);
            setSearchRes(finalAds);
            return;
        }

        if(sortKey.toLowerCase() === "rating"){
            let finalAds = [];
            searchRes.sort(function(a, b) {
                var keyA = a.rating,
                keyB = b.rating;
                // Compare the 2 dates
                if (keyA < keyB) return or;
                if (keyA > keyB) return -or;
                return 0;
                
            });
            for(let i=0; i<searchRes.length; ++i)finalAds.push(searchRes[i]);
            setSearchRes(finalAds);
            return;
        }
    }

    return(
        <div>
            <Card heading="search bar" showCard={false} content="" showHeading={false} showBr={true}>
                <div className="search-bar-holder">
                    <InputGroup className="mb-2 search-field-siri">
                        <Form.Control
                            placeholder="Subject"
                            aria-label="Subject"
                            aria-describedby="basic-addon2"
                            value={subject}
                            onChange={(e)=>{setSubject(e.target.value)}}
                        />
                        <Form.Control
                            placeholder="Location"
                            aria-label="Location"
                            aria-describedby="basic-addon2"
                            value={location}
                            onChange={(e)=>{setLocation(e.target.value)}}
                        />
                        <Button variant="success" id="button-addon2" onClick={(e)=>{onSearch(e)}}>
                            Search
                        </Button>
                    </InputGroup>
                    <InputGroup  className="mb-2 search-field-siri">
                        <Form.Select aria-label="Default select example" onChange={(e)=>{setSortKey(e.target.value)}}>
                            <option value="">Filter by</option>
                            <option value="price">Price</option>
                            <option value="rating">Rating</option>
                        </Form.Select>
                        <Form.Select aria-label="Default select example" onChange={(e)=>{setOrder(e.target.value)}}>
                            <option value="" >Order</option>
                            <option value="inc">Increase</option>
                            <option value="dec">Decrease</option>
                        </Form.Select>
                        <Button variant="primary" id="button-addon2" onClick={(e)=>{onFilter(e)}}>
                            Sort
                        </Button>
                    </InputGroup>
                </div>
                <Card heading={searchRes.length+" Results"} showHeading={true} showBr={false}>
                    <SearchResult resultsArr={searchRes} content=""/>
                    {/* <p>The process of ricing is typically done on Linux operating systems, however it can be on any operating system. However, Linux systems are typically used because of their ease of customizability, and due to the fact that they are open source. Ricing can be done on other systems, such as Mac and Windows, however, they are usually more difficult to rice than Linux systems.</p>
                    <p>Just as any operating system can be riced, any Linux distribution can also be riced. However, there are some Linux distros that are easier to rice than others. Generally, more simplistic distros, such as Arch Linux, are used as they come with less defaults and allow for more easy customization than other distros.</p> */}
                </Card>
            </Card>
        </div>
    );
}

export default Home;