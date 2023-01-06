import React, {PureComponent} from 'react';
import CustomContainer from "../../components/customContainer";
import DisputCard from "../../components/disputCard";
import LatestMessage from "../../components/latestMessage";
import { DISPUTS, ADMIN_THREADS } from "../../gqlQueries";
import ComponentInfiniteScroll from 'react-infinite-scroll-component';
import './styles.scss';
import {getAdminData} from "../../redux/reducers/home";
import {connect} from 'react-redux';
import {graphQLApiClient} from "../../helpers/apiClient";
import CircularProgress from '@material-ui/core/CircularProgress';
import Layout from '../../components/layout';
import pic1 from '../../assets/disputs/pic1.png';
import pic2 from '../../assets/disputs/pic2.png';
import pic3 from '../../assets/disputs/pic3.png';
import rate from '../../assets/disputs/rate.png';

const avatarArr = [pic1, pic2, pic3];

class HomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      toggleState: 'Relevant',
      disputes: [],
      hasMore: true,
      messagesPage: 1,
      hasMessageMore: true,
      messages: [],
      disputesPage: 1,
    }
  }

  async componentDidMount() {
    this.props.getAdminData();
    await this.loadNextMessages();
    await this.loadNextRelevantDisputes();
  }

  loadNextRelevantDisputes = async () => {
    const {disputesPage} = this.state;
    let variables = {page: disputesPage, limit: 8}

    await graphQLApiClient('POST', DISPUTS, variables)
      .then(result => {
        if (!result?.data?.disputes?.results.length) this.setState({hasMore: false});
        // console.log('Disputes length = ' + result?.data?.disputes?.results.length);
        let newDisputes = [];
        let allResolved = true;
        result?.data?.disputes?.results.forEach(disput => {
          if (disput?.state === "STARTED" || disput?.state === "PROCESSING") allResolved = false;
          newDisputes.push(<DisputCard key={disput._id} disput={disput}/>)
        })
        if(allResolved) this.setState({hasMore: false});
        let allDisputes = [...this.state.disputes, ...newDisputes];
        this.setState({disputes: this.handleGetOnlyUniqElementsFromArray(allDisputes),disputesPage: disputesPage + 1})
      })
  }

  handleGetOnlyUniqElementsFromArray = (msgArray) => {
    return Array.from(new Set(msgArray.map(a => a.props.disput._id))).map(id => {
      return msgArray.find(a => a.props.disput._id === id)
    })
  }

  loadNextMessages = async () => {
    const {messagesPage, messages} = this.state;
    let messageVariables = {page: messagesPage, limit: 10}
    await graphQLApiClient('POST', ADMIN_THREADS, messageVariables)
      .then(result => {
        if (!result?.data?.adminThreads?.results.length) this.setState({hasMessageMore: false});
        let newMessages = [];
        result?.data?.adminThreads?.results.forEach(message => {
          if (message?.lastMessage) {
            const isUnreadForAdmin = message.lastMessage.sentBy._id !== message.adminUser._id && !message.lastMessage.isRead;
            newMessages.push(<LatestMessage isUnreadForAdmin={isUnreadForAdmin} key={message._id} message={message}/>)
          }
        })
        this.setState({messages: [...messages, ...newMessages], messagesPage: messagesPage + 1})
      });
  }

  renderToggleButtons = () => {
    const {toggleState} = this.state;
    const buttonClass = (type) => toggleState === type ? 'active-button' : 'inactive-button';
    return(
      <div className={'toggle-buttons'}>
        <button
          className={`${buttonClass('Relevant')} common-styles`}
          onClick={() => this.setState({toggleState: 'Relevant'})}
        >
          Relevant
        </button>
        <button
          className={`${buttonClass('Resolved')} common-styles`}
          onClick={() => this.setState({toggleState: 'Resolved'})}
        >
          Resolved
        </button>
      </div>
    )
  };

  handleFilterDisputes = () => {
    const {disputes, toggleState} = this.state;
    let filteredDisputes = []
    if (toggleState === 'Relevant') {
      disputes.forEach(item => {
        if (item.props.disput.state === 'STARTED' || item.props.disput.state === 'PROCESSING')
          filteredDisputes.push(item);
      })
    } else {
      disputes.forEach(item => {
        if (item.props.disput.state === 'REFUNDED' || item.props.disput.state === 'CLOSED')
          filteredDisputes.push(item);
      })
    }
    return filteredDisputes;
  }

  render() {
    const {hasMore, messages, hasMessageMore, disputes} = this.state;
    // console.log('Has more = ' + hasMore);
    const {admin} = this.props;
    return (
      <CustomContainer>
        <Layout/>
        <div className={'home'}>
          <div className={'title-block'}>
            <h1>Welcome back, {admin.fullName}</h1>
          </div>
          <div className={'content-block'}>
            <div className={'disputs-block'}>
              <div className={'sub-header'}>
                <h2>Latest Disputs</h2>
                {this.renderToggleButtons()}
              </div>
              <ComponentInfiniteScroll
                dataLength={disputes.length}
                next={this.loadNextRelevantDisputes}
                hasMore={hasMore}
                loader={
                  <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <CircularProgress />
                  </div>
                }
              >
                {this.handleFilterDisputes()}
              </ComponentInfiniteScroll>
            </div>
            <div className={'messages-block'}>
              <h1 className={'title'}>Latest Messages</h1>
              <div className={'message-items-wrap'}>
                <ComponentInfiniteScroll
                  dataLength={messages.length}
                  next={this.loadNextMessages}
                  hasMore={hasMessageMore}
                  loader={
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                      <CircularProgress />
                    </div>
                  }
                >
                  {messages}
                </ComponentInfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </CustomContainer>
    )
  }
}

const mapStateToProps = store => {
    return {
        admin: store.homeReducer.admin
    }
}

export default connect(mapStateToProps, {getAdminData})(HomePage);
