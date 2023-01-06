import React, {PureComponent} from 'react';
import moment from "moment";
import ClientBlock from "../clientBlock";
import {withRouter} from 'react-router-dom';
import TerminatedIcon from '../../assets/terminated-icon.svg';
import ClosedIcon from '../../assets/closed-icon.svg';
import {START_PROCESSING_DISPUTE} from "../../gqlQueries";
import {graphQLApiClient} from "../../helpers/apiClient";
import './styles.scss';

class DisputCard extends PureComponent {

    truncate = (str, n) => {
        return (str.length > n) ? str.substr(0, n-1) + '...' : str;
    };

    handleToAgreement = async () => {
        const variables = {disputeId: this.props.disput._id};
        const state = this.props.disput?.state;
        if(state === 'STARTED'){
            try {
                // eslint-disable-next-line no-unused-vars
                const res = await graphQLApiClient('POST', START_PROCESSING_DISPUTE, variables);
                // console.log('Response for the start processing query is:' + JSON.stringify(res));
                this.props.disput.state = 'PROCESSING';
            } catch (error) {
                console.log('Error for the start processing query is:' + error);
            }
        }
        this.props.history.push('/agreement', {disput: this.props.disput})
    }

    render() {
        const {disput} = this.props;
        if (!disput) return null;
        return (
            <div
              className={`disput-card`}
              style={
                  {
                    borderWidth: disput.state === 'STARTED' ? 3 : 1,
                    borderColor: disput.state === 'STARTED' ? '#5BBEB0' : 'rgba(88, 150, 139, 0.3)'
                  }
              }
            >
                <div className={'client-block'}>
                    <ClientBlock
                      iconWidth={40}
                      iconHeight={40}
                      client={disput.agreement.client}
                    />
                    <div className={'client-text-block'}>
                        <h3 className={'title'}>{this.truncate(disput.reason, 30)}</h3>
                        <p className={'text'}>{this.truncate(disput.otherReason ? disput.otherReason : '', 70)}</p>
                    </div>
                </div>
                <div className={'agreement-block'}>
                    <div className={'agreement-status'}>
                        <div className={'name-block'}>
                            <h3 className={'agreement-name'} onClick={this.handleToAgreement}>{disput.agreement.name}</h3>
                            <span className={'agreement-cost'}>{disput.agreement.totalPrice}</span>
                        </div>
                        <div className={'date-block'}>
                            <span className={'date'}><i className="far fa-calendar-alt"/>
                            {moment(disput.agreement.createdAt).format('D.MM.YYYY')}
                            </span>
                            <span className={'milestones'}>
                                {disput.agreement.numberOfMilestones}
                                {disput.agreement.numberOfMilestones > 1 ? " milestones" : " milestone"}
                            </span>
                        </div>
                    </div>
                    {(disput.state !== 'CLOSED' && disput.state !== 'REFUNDED') &&
                    <div className={'agreement-text'}>
                        <p>{this.truncate(disput.agreement.description, 30)}</p>
                    </div>
                    }
                    {disput.state === 'CLOSED' &&
                        <div className={'dispute-status'}>
                            <div className={'warn-block'} style={{color: '#5BBEB0'}}>
                                <img src={ClosedIcon} alt="closed status"/>
                                Dispute closed
                            </div>
                            <div className={'desc-block'} style={{marginLeft: 23}}>
                                Agreement should be continued
                            </div>
                        </div>
                    }
                    {disput.state === 'REFUNDED' &&
                        <div className={'dispute-status'}>
                            <div className={'warn-block'} style={{color: '#FF6868'}}>
                                <img src={TerminatedIcon} alt="terminated status"/>
                                Agreement terminated
                            </div>
                            <div className={'desc-block'} style={{marginLeft: 32}}>
                                Funds returned to the client.
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(DisputCard);
