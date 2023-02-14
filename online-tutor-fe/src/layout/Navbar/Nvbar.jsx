import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import {FaUserAstronaut} from "react-icons/fa"
import 'bootstrap/dist/css/bootstrap.css';
import './navbar.css'
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import Logout from '../../pages/Logout';
import ico from "../../res/ico.png"


function Nvbar(props){

    const {loggedIn} = useContext(AuthContext);

    // console.log(props);
    return (
        <Router>
            <div className='navbar-holder-siri'>
                <Navbar className='navbar-siri' fixed="top">
                    <Container>
                        <Navbar.Brand className='navbar-brand-siri'>
                            <Link to={props.home.link} className='link-siri'>
                                <img 
                                alt=""
                                src={ico}
                                className="d-inline-block align-top logo-siri"/>
                            </Link>
                        </Navbar.Brand>
                        <Nav className="me-auto">
                            
                            <div className='nav-item-siri'><Nav.Link><Link to={props.home.link} className='link-siri'>Home</Link></Nav.Link></div>
                            <div className='nav-item-siri'><Nav.Link><Link to={props.contact.link} className='link-siri'>Contact</Link></Nav.Link></div>
                            {loggedIn && <div className='nav-item-siri'><Nav.Link><Link to={props.myAd.link} className='link-siri'>My Ads</Link></Nav.Link></div>}
                        </Nav>
                        <Nav>
                            {!loggedIn && <Nav.Link><Link to={props.login.link} className='link-siri'><Button variant="outline-info">Log In</Button></Link></Nav.Link>}
                            {!loggedIn && <Nav.Link><Link to={props.signin.link} className='link-siri'><Button variant="outline-warning">Register</Button></Link></Nav.Link>}
                            {loggedIn && <Nav.Link><Link to={props.profile.link} className='link-siri'><Button variant="warning"><FaUserAstronaut size={20} /></Button></Link></Nav.Link>}
                            {loggedIn && <Nav.Link><Logout /></Nav.Link>}
                        </Nav>
                    </Container>
                </Navbar>
                <div className='spacer-siri'></div>
            </div>

            <Routes>
                <Route path={props.home.link} element={props.home.ele} />
                <Route path={props.about.link} element={props.about.ele} />
                <Route path={props.contact.link} element={props.contact.ele} />
                {loggedIn && <Route path={props.myAd.link} element={props.myAd.ele} />}
                {loggedIn && <Route path={props.createAd.link} element={props.createAd.ele} />}
                {loggedIn && <Route path={props.editAd.link} element={props.editAd.ele} />}
                {loggedIn && <Route path={props.profile.link} element={props.profile.ele} />}
                {!loggedIn && <Route path={props.login.link} element={props.login.ele} />}
                {!loggedIn && <Route path={props.signin.link} element={props.signin.ele} />}
            </Routes>
        </Router>
    );
}

export default Nvbar;