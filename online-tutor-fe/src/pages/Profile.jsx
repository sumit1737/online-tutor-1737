import React from "react";
import Card from "../components/Card/Card";
import Notebook from "../components/Notebook/Notebook";
import "./css/profile.css";


function Profile(){

    return(
        <div className="profile-holder">
            <Card heading="Your Profile" showHeading={true} showBr={false}>
                <Notebook />
            </Card>
        </div>
    );
}


export default Profile;