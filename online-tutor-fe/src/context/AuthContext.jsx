import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'
import Nvbar from '../layout/Navbar/Nvbar';
import About from '../pages/About';
import Contact from '../pages/Contact';
import CreateAd from '../pages/CreateAd';
import EditAd from '../pages/EditAd';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Myads from '../pages/Myads';
import Profile from '../pages/Profile';
import Register from '../pages/Register';

const AuthContext = createContext();

function AuthContextProvider(props){
    const [loggedIn, setLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState("");

    async function getLoggedIn(){
        const loggedInRes = await axios.get("http://127.0.0.1:6969/entry/loggedin");
        setLoggedIn(loggedInRes.data.isLoggedIn);
        setCurrentUser(loggedInRes.data.userInfo);
        console.log("Auth",loggedInRes.data);
    }

    useEffect(()=>{
        getLoggedIn();
    },[]);
    let loggedInUser = "admin";
    let loginState = true;


    let routeObj = {
        home :  {link: "/", ele: <Home userLoggedIn={loggedInUser} isLoggedIn={loginState} /> },
        about : {link: "/about", ele: <About /> },
        contact : {link: "/contact", ele: <Contact /> },
        login : {link: "/login", ele:<Login />},
        signin : {link: "/signin", ele:<Register />},
        myad: {link: "/myads", ele: <Myads />},
        createad: {link: "/createad", ele: <CreateAd />},
        editad: {link: "/editad", ele: <EditAd />},
        profile: {link: "/profile", ele: <Profile />}
    }

    

    return(
        <AuthContext.Provider value={{loggedIn, getLoggedIn, currentUser}}>
            {/* <h1>
                Hello World !
            </h1> */}
            {/* {props.children} */}
            <Nvbar home={ routeObj.home } 
                about={ routeObj.about } 
                contact={ routeObj.contact } 
                login={ routeObj.login }
                signin={ routeObj.signin }
                isLoggedIn={loginState}
                userLoggedIn={loggedInUser}
                myAd={routeObj.myad}
                createAd={routeObj.createad}
                editAd={routeObj.editad}
                profile={routeObj.profile}
            />
        </AuthContext.Provider>
    )
}

export default AuthContext;
export {AuthContextProvider};