import React, {PureComponent} from 'react';
import Tick from '../../assets/messages/got.svg';
import DoubleTick from '../../assets/messages/readed.svg';
import DefaultIcon from '../../assets/default-avatar.png'
import moment from 'moment';
import {handleGetAvatarFile} from "../../helpers/methods";
import './styles.scss';

class LatestMessage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      avatarImg: ''
    }
  }

  componentDidMount() {
    const {message} = this.props;
    if (message?.user?.avatar?.type && message?.user?.avatar?.filename) {
      handleGetAvatarFile(message?.user?.avatar?.type, message.user.avatar.filename)
        .then((url) => {
          this.setState({avatarImg: url})
        })

    }
  }

  render() {
    const {message, isUnreadForAdmin} = this.props;
    const {avatarImg} = this.state;
    if (!message) return null;
      return (
          <div className={'latest-message'}
          /* 
          style={{
              borderWidth: isUnreadForAdmin ? 3 : 1,
              borderColor: isUnreadForAdmin ? '#5DB9FF' : 'rgba(88, 150, 139, 0.3)'
            }}
          */
          >
              <div className={'message-content'}>
                  <img src={avatarImg ? avatarImg : DefaultIcon} alt="avatar user" className={'avatar'}/>
                  <div className={'message-text-block'}>
                      <span className={'name'}>{message.user.fullName}</span>
                      <span className={'text'}>{message.lastMessage.content}</span>
                  </div>
              </div>
              <div className={'time-block'}>
                  <span className={'time'}>
                      {message.lastMessage.isRead ?
                          <img src={DoubleTick} alt="read message"/> :
                          <img src={Tick} alt="read message"/>
                      }
                      {moment(message.lastMessage.createdAt).format('  hh:mm')}
                  </span>
                  {message.adminUser._id !== message.lastMessage.sentBy._id &&
                    <div className={'count-of-messages'}>{message.unreadMessageCount}</div>
                  }
              </div>
          </div>
      );
  }
}

export default LatestMessage;
