import React, {PureComponent} from 'react';
import HomeIcon from '../../assets/layout/home.svg';
import ToggleIcon from '../../assets/layout/toggle.svg';
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
            avatarImg: ''
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

    handleLogOut = () => {
        localStorage.removeItem('access-token');
        this.props.history.push('/login');
    }

    render() {
      if (this.props.location.pathname === '/admin/login' || this.props.location.pathname === '/restore-password') {
          return null;
      }
      const {avatarImg} = this.state;
      return (
          <div className={'layout'}>
              <img
                  src={avatarImg ? avatarImg : DefaultIcon}
                  alt="avatar"
                  className={'avatar'}
              />
              <div className={'actions-block'}>
                  <Link to={'/home'}>
                      <img src={HomeIcon} alt="home page"/>
                  </Link>
                  {/* <Link to={'/settings'} className={'settings-icon'}>
                      <img
                          src={SettingsIcon}
                          alt="settings page"
                      />
                  </Link>
                  <img src={HelpIcon} alt="help page"/> */}
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
