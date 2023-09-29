import { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { Button } from "react-bootstrap";

import "./main.css";

import Home from "./home";
import Navbar from "./components/navbar";
import Search from "./search";
import Favourities from "./favourities";
import Playlists from "./playlists";
import PlayingSongContainer from "./components/playingSongContainer";
import {LoginServiceData} from "./components/loginService";
import SongsDataBaseService from "./components/SongsDataBaseService";
import { loginFormSubmitBackendCall, signUpFormSubmitBackendCall } from "./components/loginService";

function Main() {
    const [playingSongDetais, setPlayingSongDetais] = useState(SongsDataBaseService.playingSongDetail);
    const [showModalSignIn, setShowModalSignIn] = useState(true);
    const [secondaryPrimarySwitch, setSecondaryPrimarySwitch] = useState(true);
    const [unlockAllPage, setUnlockAllPage] = useState(false);
    const [loginFormUserEmail, setLoginFormUserEmail] = useState('');
    const [loginFormUserPassword, setLoginFormUserPassword] = useState('');
    const [signUPFormUserEmail, setSignUPFormUserEmail] = useState('');
    const [signUPFormUserName, setSignUPFormUserName] = useState('');
    const [signUPFormUserPassword, setSignUPFormUserPassword] = useState('');
    const [signUPFormUserRePassword, setSignUPFormUserRePassword] = useState('');
    const [userNotFound, setUserNotFound] = useState("");
    const [userRegisterModal, setUserRegisterModal] = useState("");

    const handleCloseModalSignIn = () => {
        setShowModalSignIn(false);
    };
    const handleShowModalSignIn = () => setShowModalSignIn(true);

    function signInFormSubmit() {
        // Code for SignIn
        setUserNotFound(""); 
        setUserRegisterModal("");
        if(signUPFormUserPassword !== signUPFormUserRePassword) {
           console.warn("Password mismatch");
           return;
        }
           
        signUpFormSubmitBackendCall(signUPFormUserName, signUPFormUserEmail, signUPFormUserPassword).then((res) => {
            if(res.errorStatus) {
                console.error(res.errorMessage);
                setUserRegisterModal(res.errorMessage);
            } else {
                setSecondaryPrimarySwitch(true);
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    function loginFormSubmit() {
        setUserNotFound(""); 
        setUserRegisterModal("");

        loginFormSubmitBackendCall(loginFormUserEmail, loginFormUserPassword).then((res) => {
            if(!res.errorStatus) {
                handleCloseModalSignIn();
                setUnlockAllPage(true);

                LoginServiceData.userName = res.data.userName;
                LoginServiceData.userEmail = res.data.userEmail;
                SongsDataBaseService.playListDataBackend = res.data.playListData;
                SongsDataBaseService.favouritiesSongsKey = res.data.favSongs;
            } else {
                console.error(res.errorMessage);
                setUserNotFound(res.errorMessage);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    useEffect(() => {
    }, []);

    function updateFunction() {
        setPlayingSongDetais(SongsDataBaseService.playingSongDetail);
    }

    return (
        <div>
            <div className="LoginSignInModal">
                {secondaryPrimarySwitch ?
                    <div className="LoginModal">
                        <Modal show={showModalSignIn} backdrop="static" centered onHide={handleCloseModalSignIn}>
                            <Modal.Header className="modal-header-imp" closeButton>
                                <Modal.Title className="signInModalHeading">Log In</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className='sign-in-form-details-all-input-wrapper'>
                                <input type='email' className="sign-in-form-details-input" value={loginFormUserEmail} onChange={event => {setLoginFormUserEmail(event.target.value)}} placeholder="Enter Your email here." />
                                <br />
                                <input type='password' className="sign-in-form-details-input" value={loginFormUserPassword} onChange={event => {setLoginFormUserPassword(event.target.value)}} placeholder="Enter Your password here." />
                            </Modal.Body>
                            <center style={{color: "red", fontWeight: "bold"}}>{userNotFound}</center>
                            <br/>
                            <Modal.Footer className="modal-footer-login-signin">
                                <Button className="modal-footer-login-signin-button" variant="secondary" onClick={() => { 
                                    setUserNotFound(""); 
                                    setUserRegisterModal("");
                                    setSecondaryPrimarySwitch(false);
                                    }}>
                                    Sign In
                                </Button>
                                <Button className="modal-footer-login-signin-button" variant="primary" onClick={loginFormSubmit}>
                                    Submit
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div> :
                    <div className="signInModal">
                        <Modal show={showModalSignIn} backdrop="static" centered onHide={handleCloseModalSignIn}>
                            <Modal.Header className="modal-header-imp" closeButton>
                                <Modal.Title className="signInModalHeading">Sign In</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className='sign-in-form-details-all-input-wrapper'>
                                <input type='text' className="sign-in-form-details-input" value={signUPFormUserName} onChange={event => {setSignUPFormUserName(event.target.value)}} placeholder="Enter Your Name here." />
                                <br />
                                <input type='email' className="sign-in-form-details-input" value={signUPFormUserEmail} onChange={event => {setSignUPFormUserEmail(event.target.value)}} placeholder="Enter Your email here." />
                                <br />
                                <input type='password' className="sign-in-form-details-input" value={signUPFormUserPassword} onChange={event => {setSignUPFormUserPassword(event.target.value)}} placeholder="Enter Your password here." />
                                <br />
                                <input type='password' className="sign-in-form-details-input" value={signUPFormUserRePassword} onChange={event => {setSignUPFormUserRePassword(event.target.value)}} placeholder="Re-enter Your password here." />
                            </Modal.Body>
                            <center style={{color: "red", fontWeight: "bold"}}>{userRegisterModal}</center>
                            <br/>
                            <Modal.Footer className="modal-footer-login-signin">
                                <Button className="modal-footer-login-signin-button" variant="success" onClick={() => { 
                                    setUserNotFound(""); 
                                    setUserRegisterModal("");
                                    setSecondaryPrimarySwitch(true); }}>
                                    Log In
                                </Button>
                                <Button className="modal-footer-login-signin-button" variant="primary" onClick={signInFormSubmit}>
                                    Submit
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                }
            </div>

            {unlockAllPage ? <>
                <Router>
                    <div className="mainComponentHomePage">
                        <div className="leftSideComponentHomePage">
                            <Navbar />
                        </div>
                        <div className="rightSideComponentHomePage">
                            <Routes>
                                <Route path="/" element={<Home updateFunction={updateFunction} />} ></Route>
                                <Route path="search" element={<Search updateFunction={updateFunction} />} ></Route>
                                <Route path="favourities" element={<Favourities updateFunction={updateFunction} />} ></Route>
                                <Route path="playlists" element={<Playlists updateFunction={updateFunction} />} ></Route>
                            </Routes>
                            {/* <Route path="*" element={<NoPage />} /> */}
                        </div>

                        {playingSongDetais.address ?
                            <PlayingSongContainer playingSongDetaisProps={playingSongDetais} /> : <></>}
                    </div>
                </Router>
            </> : <></>}
        </div>
    );
}

export default Main;
