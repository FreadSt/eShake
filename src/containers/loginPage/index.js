import React, {useEffect} from 'react';
import LoginLogo from '../../assets/login/loginLogo.png';
import EnvelopeIcon from '../../assets/login/envelope.svg';
import LockIcon from '../../assets/login/lock.svg';
import ArrowRightIcon from '../../assets/login/arrow-right.png';
import { reduxForm, Field } from 'redux-form';
import CustomInput from "../../components/customInput";
import {validate} from "./validation";
import { useMutation } from '@apollo/client';
import { useHistory } from "react-router-dom";
import { LOG_IN } from "../../gqlQueries";
import './styles.scss';

const LoginPage = ({handleSubmit}) => {
    const [handleLogin, { data, error }] = useMutation(LOG_IN, {errorPolicy: 'all'});
    const history = useHistory();

    useEffect(() => {
        if (data?.adminLogin) {
            localStorage.setItem('access-token', data?.adminLogin?.accessToken);
            history.push('/home')
        }
    }, [data, history])

    const submitLogin = (values) => {
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
                <img
                    src={LoginLogo}
                    alt="app logo"
                    className={'app-logo'}
                />
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
                <button className={'login-button'} onClick={handleSubmit(submitLogin)}>
                    Log In
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

export default reduxForm({
    form: 'login',
    validate: validate
})(LoginPage);
