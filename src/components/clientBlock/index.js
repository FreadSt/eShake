import React, {Component} from 'react';
import './styles.scss';
import DefaultIcon from '../../assets/default-avatar.png';
import {handleGetAvatarFile} from "../../helpers/methods";
import Rating from "@material-ui/lab/Rating";

class ClientBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarImg: ''
        }
    }

    componentDidMount() {
        const {client} = this.props;
        if (client.avatar?.type && client.avatar?.filename) {
            handleGetAvatarFile(client.avatar.type, client.avatar.filename)
              .then((url) => {
                  this.setState({avatarImg: url})
              })
        }
    }

    render() {
        const {iconWidth, iconHeight, client} = this.props;
        const {avatarImg} = this.state;
        return (
            <div className={'custom-client-wrapper'}>
                <img
                    width={iconWidth}
                    height={iconHeight}
                    src={avatarImg ? avatarImg : DefaultIcon}
                    alt="Client Icon"
                    className={'client-icon'}
                />
                <div className={'client-description'}>
                    <div className={'name-block'}>
                        <p className={'name'}>{client.fullName}</p>
                        <span className={'status'}>CLIENT</span>
                    </div>
                    <div className={'rating-wrapper'}>
                        <Rating
                            name="read-only"
                            value={client.rating}
                            readOnly
                            precision={0.1}
                            icon={<i className="fas fa-star filled-icon"/>}
                            emptyIcon={<i className="fas fa-star empty-icon"/>}
                        />
                        <span className={'number-of-rating'}>{client.rating}</span>
                        <span className={'number-of-votes'}>({client.numberOfReviews})</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default ClientBlock;
