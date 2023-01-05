import React, {useEffect} from 'react';
import LoginLogo from '../../assets/login/LoginPageLogo.png';
import EnvelopeIcon from '../../assets/login/envelope.svg';
import LockIcon from '../../assets/login/lock.svg';
import ArrowRightIcon from '../../assets/login/rigtharrow.png';
import { reduxForm, Field, formValueSelector} from 'redux-form';
import CustomInput from "../../components/customInput";
import {validate} from "./validation";
import { useMutation } from '@apollo/client';
import { useHistory } from "react-router-dom";
import { LOG_IN } from "../../gqlQueries";
import './styles.scss';
import { connect } from 'react-redux';

let LoginPage = ({handleSubmit, email, password}) => {
    const [handleLogin, { data, error }] = useMutation(LOG_IN, {errorPolicy: 'all'});
    const history = useHistory();

    useEffect(() => {
        if (data?.adminLogin) {
            localStorage.setItem('access-token', data?.adminLogin?.accessToken);
            history.push('/home')
        }
    }, [data, history])

    console.log(email, password, "props")
    
    const checkValidValues = () => {
        if (!email) {
            return true
        }
        if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            return true
        }
        if (!password) {
            return true
        }
        if (password && password.length < 3) {
            return true
        }
        return false
    }

    const submitLogin = (values) => {
        console.log("handle");
        const {email, password} = values;
        handleLogin({variables: {email, password}});
    }
    if (localStorage.getItem('access-token')) {
        history.push('/home');
        history.goBack();
    };
    return (
        <div className={'login-page'}>
            <div className={'login-block'}>
                <div className={'text-logo'}>
                    <img
                        src={LoginLogo}
                        alt="app logo"
                        className={'app-logo'}
                    />
                    <h1 className={'title-logo'}>eShake</h1>
                    <span className={'suptitle-logo'}>THE TRUSTED HANDSHAKE</span>
                </div>
                <Field
                    name={'email'}
                    label={'Email'}
                    component={CustomInput}
                    type={'text'}
                    iconName={EnvelopeIcon}
                />
                <div className={'custom-margin'}/>
                <Field
                    name={'password'}
                    label={'Password'}
                    component={CustomInput}
                    type={'password'}
                    iconName={LockIcon}
                />
                {error &&
                    <div className={'restore-block'}>
                        <span className={'error-block'}>We cannot find this Email and Pass combination</span>
                        {/*<Link className={'restore-link'} to={'/restore-password'}>Restore Password</Link>*/}
                    </div>
                }
                <button className={!checkValidValues() ? 'login-button' : "login-button-disabled"} onClick={handleSubmit(submitLogin)} disabled={checkValidValues()}>
                    Sign In
                    <img
                        src={ArrowRightIcon}
                        alt="login icon"
                        className={'right-icon'}
                    />
                </button>
            </div>
        </div>
    )
}

LoginPage = reduxForm({form: 'login', validate: validate})(LoginPage)

const selector = formValueSelector('login')
LoginPage = connect(state => {
    const email = selector(state, 'email')
    const password = selector(state, 'password')
    return{
        email, password
    }
})(LoginPage)

export default LoginPage;
