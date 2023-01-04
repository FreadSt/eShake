import React, {PureComponent} from 'react';
import CustomContainer from "../../components/customContainer";
import ArrowLeftIcon from '../../assets/agreement/arrow-left.png';
import {Link} from 'react-router-dom';
import './styles.scss'
import DescriptionBlock from "../../components/descriptionBlock";
import ClientBlock from "../../components/clientBlock";
import MilestoneCard from "../../components/milestoneCard";
import ButtonsGroup from "../../components/buttonsGroup";
import InfiniteScroll from "react-infinite-scroller";
import {graphQLApiClient} from "../../helpers/apiClient";
import {DISPUTE_MESSAGES} from "../../gqlQueries";
import {MessageComponent, MessageComponentOnlyContent} from "../../components/messageComponent";
import AttachedFile from "../../components/attachedFileComponent";
import moment from 'moment'
import CircularProgress from "@material-ui/core/CircularProgress";

class AgreementPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            toggleState: 'Description',
            messages: [],
            hasMore: true,
            messagesPage: 1,
        }
    }

    loadNextMessages = (page) => {
        const {disput} = this.props.location.state;
        const {messagesPage, messages} = this.state;
        const variables = {disputeId: disput._id, page: page, limit: 10}

        graphQLApiClient('POST', DISPUTE_MESSAGES, variables)
          .then(result => {
              if (!result?.data?.disputedThreadMessages?.results.length) this.setState({hasMore: false});
              let newMessages = [];
              result?.data?.disputedThreadMessages?.results.forEach(msg => {newMessages.push(msg)});
              this.setState({messages: [...messages, ...newMessages], messagesPage: messagesPage + 1});
          })
    }

    renderMessageComponent = (messages) => {
      let pId = null;
      const {disput} = this.props.location.state;

      return messages.map((msg) => {
        const contentOnly = msg.sentBy?.avatar?.userId === pId;
        pId = msg.sentBy?.avatar?.userId;
        const userType = msg.sentBy._id !== disput.agreement.provider._id ? 'CLIENT' : 'SERVICE PROVIDER';
        return contentOnly
          ? <MessageComponentOnlyContent key={msg._id} message={msg}/>
          : <MessageComponent userType={userType} key={msg._id} message={msg}/>;
       })
    }

    handleRenderMessages = () => {
      const sortedMessages = this.handleSortMessagesByDate();
      let dateKeysArray = Object.keys(sortedMessages);
      dateKeysArray.sort((a, b) => {
        return new Date(b) - new Date(a);
      });
      return dateKeysArray.reverse().map((dateKey) => {
        return (
          <>
            <div className={'date-message-block'}>{dateKey}</div>
            {this.renderMessageComponent(sortedMessages[dateKey])}
          </>
        )
      })
    }

    handleSortMessagesByDate = () => {
      const {messages} = this.state;
      let sortedMessages = {};
      messages && messages.forEach(msg => {
        const dateKey = moment(msg.createdAt).format('DD MMM YYYY')
        if (sortedMessages.hasOwnProperty(dateKey)) {
          sortedMessages[dateKey].push(msg);
        } else {
          sortedMessages[dateKey] = [msg];
        }
      })
      return sortedMessages;
    }

    renderToggleButtons = () => {
        const {toggleState} = this.state;
        const buttonClass = (type) => toggleState === type ? 'active-button' : 'inactive-button';
        return(
            <div className={'toggle-buttons'}>
                <button
                    className={`${buttonClass('Description')} common-styles`}
                    onClick={() => this.setState({toggleState: 'Description'})}
                >
                    Description
                </button>
                <button
                    className={`${buttonClass('Messages')} common-styles`}
                    onClick={() => this.setState({toggleState: 'Messages'})}
                >
                    Messages
                </button>
            </div>
        )
    }

    handleRenderAttachments = (agreement) => {
        if (agreement && !!agreement.attachedFiles.length) {
            return agreement.attachedFiles.map((item) => {
                return(
                    <AttachedFile file={item} key={item._id}/>
                )
            })
        }
    }

    handleRenderMilestones = (agreement) => {
        if(!!agreement.milestones.length)
        return agreement.milestones.map((milestone) => {
            return(
                <MilestoneCard agreementState={agreement.agreementState} key={milestone._id} milestone={milestone}/>
            )
        })
    }

    render() {
        const {toggleState, hasMore} = this.state;
        const {disput} = this.props.location.state;
        const {agreement} = disput;
        // console.log(`Agreement page is equal to ${disput.state}`);
        return (
            <CustomContainer>
                <div className={'agreement-page'}>
                    <div className={'title-block'}>
                        <div className={'title-wrapper'}>
                            <Link to={'/home'}>
                                <img
                                    src={ArrowLeftIcon}
                                    className={'arrow-icon'}
                                    alt="agreement title"
                                />
                            </Link>
                            <h1>{agreement.name} Details</h1>
                        </div>
                        {this.renderToggleButtons()}
                    </div>
                    <div className={'content-wrapper'}>
                        {toggleState !== 'Messages' ?
                            <div className={'description-wrapper'}>
                                <ClientBlock
                                    iconWidth={90}
                                    iconHeight={90}
                                    client={agreement.client}
                                />
                                <DescriptionBlock
                                    title={`Dispute reason: ${disput.reason}`}
                                    description={disput.otherReason || ''}
                                />
                                <DescriptionBlock
                                    title={'Agreement Description'}
                                    description={agreement.description}
                                />
                                <h3 className={'provider-title'}>Service Provider</h3>
                                <ClientBlock
                                    iconWidth={40}
                                    iconHeight={40}
                                    client={agreement.provider}
                                />
                                <div className={'custom-border'}/>
                                <h4 className={'info-title'}>Info</h4>
                                <div className={'info-item'}>
                                    <span className={'name'}>Total Price</span>
                                    <span className={'desc'}>{agreement.totalPrice}</span>
                                </div>
                                <div className={'info-item'}>
                                    <span className={'name'}>Milestones</span>
                                    <span className={'desc'}>{agreement.numberOfMilestones}</span>
                                </div>
                                <div className={'info-item'}>
                                    <span className={'name'}>Payment Method</span>
                                    <span className={'desc'}>Verified</span>
                                </div>
                                {!!agreement.attachedFiles.length &&
                                  <h4 className={'attachments-title'}>Attachments</h4>
                                }
                                {this.handleRenderAttachments(agreement)}
                                <h4 className={'milestones-title'}>Milestones</h4>
                                {this.handleRenderMilestones(agreement)}
                            </div> :
                            <div className={'description-wrapper'}>
                              <div className={'message-thread-wrapper'}>
                                <InfiniteScroll
                                  pageStart={0}
                                  loadMore={this.loadNextMessages}
                                  hasMore={hasMore}
                                  loader={
                                    <div key={0} style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                                      <CircularProgress />
                                    </div>
                                  }
                                  isReverse={true}
                                  useWindow={false}
                                >
                                  {this.handleRenderMessages()}
                                </InfiniteScroll>
                              </div>
                            </div>
                        }
                        <div className={'wrapper-buttons-group'}>
                            <ButtonsGroup
                                disputId={disput._id}
                                disputeState={disput.state}
                                userId={agreement.client._id}
                                providerId={agreement.provider._id}
                                agreementName={agreement.name}
                            />
                        </div>
                    </div>
                </div>
            </CustomContainer>
        );
    }
}

export default AgreementPage;
