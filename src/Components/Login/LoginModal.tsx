import React, {Component, RefObject} from 'react';

import {TextField} from "@mui/material";
import {axiosPost} from "../../Utilities/HTTPClient";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

type LoginModalProps = {
    closeLoginModal: any
    visibility: boolean
}

type LoginState = {
    login: string;
    password: string;
}

type LoginRequest = {
    username: string;
    password: string;
}

class LoginModal extends Component<LoginModalProps, LoginState> {

    private passwordField: RefObject<HTMLInputElement>;

    constructor(props: LoginModalProps) {
        super(props);
        this.state = {
            login: "",
            password: ""
        }
        this.passwordField = React.createRef();
        this.submitLogin = this.submitLogin.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }

    requestLogin = async (body: LoginRequest) => axiosPost(`/admin/auth/login`, body)

    submitLogin() {
        this.requestLogin({
            username: this.state.login,
            password: this.state.password
        }).then(r => {
            localStorage.setItem("bearer", r.bearer)
            window.location.reload()
        }).catch(e => window.alert('Invalid login.'))
    }

    handleLogin(value: string) {
        this.setState({login: value})
    }

    handlePassword(value: string) {
        this.setState({password: value})
    }

    render() {
        return (
            <div className="Modal" style={{visibility: this.props.visibility ? 'visible': 'hidden'}}>
                <div className="ModalHeader">
                    <div className="Logo" onClick={() => this.props.closeLoginModal()}>
                        <img src={"/assets/logo.png"}/>
                    </div>
                    <div className="ModalCenter"/>
                    <div className="ModalAction" onClick={() => this.props.closeLoginModal()}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>

                <div className='login'>
                    <div>
                        <TextField
                            InputLabelProps={{className: "floatingLabelFocusStyle"}}
                            helperText="Please enter your email address."
                            variant="outlined"
                            label="Email"
                            type="text"
                            sx={{
                                width: "100%",
                                marginTop: 20,
                                marginBottom: 10,
                            }}
                            onKeyUp={e => { if (e.keyCode == 13) this.passwordField.current?.focus() }}
                            onChange={(e) => this.handleLogin(e.target.value)} value={this.state.login}
                        />
                    </div>
                    <div >
                        <TextField
                            InputLabelProps={{className: "floatingLabelFocusStyle"}}
                            helperText="Please enter your password."
                            variant="outlined"
                            label="Password"
                            type="password"
                            sx={{
                                width: "100%",
                                marginTop: 5,
                                marginBottom: 10
                            }}
                            onKeyUp={e => { if (e.keyCode == 13) this.submitLogin() }}
                            ref={this.passwordField} onChange={(e) => this.handlePassword(e.target.value)} value={this.state.password}
                        />
                    </div>
                </div>

                <button className="Alt">Don't have an account? Sign up now</button>
                <button onClick={() => {
                    this.submitLogin()
                }}>Login to your RuneLeague Account</button>

            </div>
        );
    }
}

export default LoginModal;