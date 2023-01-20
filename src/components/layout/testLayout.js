import React, {PureComponent, useState, useEffect} from 'react';
import HomeIcon from '../../assets/layout/home.svg';
import ToggleIcon from '../../assets/layout/Logout.png';
import chatactive from "../../assets/layout/chatactive.png";
import statsactive from "../../assets/layout/statsactive.png";
import chatdis from "../../assets/layout/chatdis.png";
import statsdis from "../../assets/layout/statsdis.png";
import {Link, withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import './styles.scss';
import {handleGetAvatarFile} from "../../helpers/methods";
import DefaultIcon from "../../assets/default-avatar.png";
import {getAdminData} from "../../redux/reducers/home";
import { useLocation } from 'react-router-dom';


const Layout = () => {
    const location = useLocation()
    const [avatarImg, setAvatarImg] = useState('')

    const handleLogOut = () => {
        localStorage.removeItem('access-token');
    }

    if (location.pathname === '/admin/login' || location.pathname === '/restore-password') {
        return null;
    }

    return(
        <div className={'layout'}>
            <img
                alt="avatar"
                className={'avatar'}
                src={avatarImg ? avatarImg : DefaultIcon}
            />
            <div className={'actions-block'}>
                <Link to={'/'}>
                    <img src={chatdis}/>
                </Link>

                <Link to={'/'}>
                    <img src={statsdis}/>
                </Link>

                {/* <Link to={'/settings'} className={'settings-icon'}>
                    <img
                        src={SettingsIcon}
                        alt="settings page"
                    />
                </Link>
                <img src={HelpIcon} alt="help page"/> 
                    <Link to={'/home'}>
                    <img src={HomeIcon} alt="home page"/>
                </Link>
                */}
                </div>
            <img
                src={ToggleIcon}
                alt="log out button"
                className={'log-out-button'}
            />
        </div>
    )
}

const mapStateToProps = store => {
    return {
        admin: store.homeReducer.admin
    }
}

export default withRouter(connect(mapStateToProps, {getAdminData})(Layout));