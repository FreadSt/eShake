import React, {PureComponent} from 'react';
import './styles.scss';
import {handleGetAvatarFile} from "../../helpers/methods";
import DefaultIcon from "../../assets/default-avatar.png";
import moment from 'moment';
import AttachedFile from "../attachedFileComponent";


export class MessageComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      avatarImg: ''
    }
  }

  componentDidMount() {
    const {message} = this.props;
    if (message?.sentBy?.avatar?.type && message?.sentBy?.avatar?.filename) {
      handleGetAvatarFile(message.sentBy.avatar.type, message.sentBy.avatar.filename)
        .then((url) => {
          this.setState({avatarImg: url})
        })

    }
  }
  handleMessageRenderAttachments = (message) => {
    if (message && message?.files?.length) {
      console.log("We're actually handling a file");
        return message?.files?.map((item) => {
            return(
                <AttachedFile file={item} key={item._id}/>
            );
        })
    }
}

  render() {
    const {message, userType, isNewMsg} = this.props;
    // console.log('Message is ' + JSON.stringify(message));
    const {avatarImg} = this.state;
    return (
      <div className={'custom-message-component'} style={{marginTop: 20}}>
        <div className={'avatar-block'}>
          <img
            className={'avatar-img'}
            src={avatarImg ? avatarImg : DefaultIcon}
            alt="Sender Avatar"
          />
        </div>
        <div className={'description-block'}>
          <div className={'sender-name'}>
            {message.sentBy.fullName}
            <span className={'user-type'} style={{right: userType === 'CLIENT' ? -55 : -132}}>{userType}</span>
          </div>
          <div className={'message-content'} style={{marginTop: 5}}>
            {message.content}
          </div>
          {this.handleMessageRenderAttachments(message)}
        </div>
        <div className={'time-block'}>
            {isNewMsg &&
                <span className={'new-msg'}>new</span>
            }
          {moment(message.createdAt).format('HH:mm')}
        </div>
      </div>
    );
  }
}

export class MessageComponentOnlyContent extends PureComponent {
  render() {
    const {message, isNewMsg} = this.props;
    return (
      <div className={'custom-message-component'} style={{marginTop: 10}}>
        <div className={'avatar-block'}/>
        <div className={'description-block'}>
          <div className={'message-content'}>
            {message.content}
          </div>
        </div>
        <div className={'time-block'}>
            {isNewMsg &&
                <span className={'new-msg'}>new</span>
            }
          {moment(message.createdAt).format('HH:mm')}
        </div>
      </div>
    );
  }
}

