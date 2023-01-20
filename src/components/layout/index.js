import React, {PureComponent} from 'react';
import ToggleIcon from '../../assets/layout/Login.png';
import chatactive from "../../assets/layout/newchatactive.png";
import statsactive from "../../assets/layout/newstatsactive.png";
import chatdis from "../../assets/layout/newchatdis.png";
import statsdis from "../../assets/layout/newstatsdis.png";
import {Link, withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import './styles.scss';
import {handleGetAvatarFile} from "../../helpers/methods";
import DefaultIcon from "../../assets/default-avatar.png";
import {getAdminData} from "../../redux/reducers/home";

class Layout extends PureComponent {
    
    constructor(props) {
        super(props);
        this.state = {
            avatarImg: '',
            openChat: true,
            openStat: false,
        }
    }

    async componentDidMount() {
        await this.props.getAdminData();
        const {admin} = this.props;
        if (admin?.avatar?.type && admin?.avatar?.filename) {
            handleGetAvatarFile(admin.avatar.type, admin.avatar.filename)
                .then((url) => {
                    this.setState({avatarImg: url})
                })
        }
    }

    handleToggleChat = () => {
        this.setState({openChat: !this.state.openChat, openStat: false})
    }
    
    handleToggleStat = () => {
        this.setState({openChat: false, openStat: !this.state.openStat})
    }

    handleLogOut = () => {
        localStorage.removeItem('access-token');
        this.props.history.push('/login');
    }

    handleLocationDashboard = () => {
        this.props.history.push('/dashboard')
    }
    handleLocationChat = () => {
        this.props.history.push('/')
    }

    render() {
      if (this.props.location.pathname === '/admin/login' || this.props.location.pathname === '/restore-password') {
          return null;
      }
      const {avatarImg} = this.state;
      
      return (
          <div className={'layout'}>
            <Link to={'/'}> 
                <img
                  src={avatarImg ? avatarImg : DefaultIcon}
                  alt="avatar"
                  className={'avatar'}
                />
            </Link>
              <div className={'actions-block'}>

                <Link to={'/'} onClick={this.handleToggleChat}>
                    <img src={this.props.location.pathname === '/' ? chatactive : chatdis} alt=""/>
                </Link>

                <Link to={'/dashboard'} onClick={this.handleToggleStat}>
                    <img src={this.props.location.pathname ==='/dashboard' ? statsactive : statsdis} alt=""/>
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
                onClick={this.handleLogOut}
                src={ToggleIcon}
                alt="log out button"
                className={'log-out-button'}
              />
          </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        admin: store.homeReducer.admin
    }
}

export default withRouter(connect(mapStateToProps, {getAdminData})(Layout));