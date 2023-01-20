/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {ADMIN_MESSAGES, NEW_MESSAGES, READ_ADMIN_MESSAGES, THREAD_WITH_ADMIN, SEND_MESSAGE_ADMIN, CREATE_THREAD, DISPUTE, STATS} from "../../gqlQueries";
import {useSubscription, useQuery, useMutation} from "@apollo/client";
import CustomContainer from "../../components/customContainer";
import {useParams, useHistory} from 'react-router-dom';
import './styles.scss';
import ArrowLeftIcon from "../../assets/agreement/arrow-left.png";
import ButtonsGroup from "../../components/buttonsGroup";
import InfiniteScroll from "react-infinite-scroller";
import {graphQLApiClient} from "../../helpers/apiClient";
import moment from "moment";
import {connect} from 'react-redux';
import {MessageComponent, MessageComponentOnlyContent} from "../../components/messageComponent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Layout from '../../components/layout';

const AccuseParty = ({admin}) => {
  const history = useHistory();
  const {disputId} = history.location.state;
  const {type, name, id} = useParams();
  const [hasMore, setHasMore] = useState(true);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState('');

  const {loading: loadingThread, error: errorThread, data: dataThread, refetch} = useQuery(THREAD_WITH_ADMIN, {variables: {userId: id}})
  const {data:test} = useQuery(STATS)
  console.log(test, "test")
  const {loading: loadingDispute, error: errorDispute, data: dataDispute, refetch: refetchDispute} = useQuery(DISPUTE, {variables: {disputeId: disputId}})
  const dispt = dataDispute?.dispute?.result?.state;
  const [sendMessage, {loading, }] = useMutation(SEND_MESSAGE_ADMIN, {errorPolicy: 'all'});
  // const [createThread] = useMutation(CREATE_THREAD, {errorPolicy: 'all'});
  const [readAdminMessages] = useMutation(READ_ADMIN_MESSAGES, {errorPolicy: 'all'})
  const { data: subsData, loading: subsLoading, error: subsError } = useSubscription(NEW_MESSAGES,
      {
        variables: {threadId: dataThread?.threadWithAdmin?.result._id},
        onSubscriptionData: ({ subscriptionData: { data } }) => handlerOnSubscriptionData(data)
      });
  useEffect(() => {
    if (errorThread?.message === 'Thread not found') {
      // createThread({variables: {userId: id}});
      graphQLApiClient('POST', CREATE_THREAD, {userId: id})
        .then(() => {
          return refetch()
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }, [errorThread, id, refetch])
  if (loadingDispute) {
    return (<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
    <CircularProgress />
    </div>
    );
  }
  const handlerOnSubscriptionData = (newMessage) => {
    setMessages([...messages, newMessage.adminNewMessages])
    const div = document.getElementsByClassName('message-thread-wrapper')[0];
    div.scrollTop = div.scrollHeight;
  }

  const loadNextMessages = (page) => {
    const variables = {threadId: dataThread?.threadWithAdmin?.result._id, page: page, limit: 10}
    graphQLApiClient('POST', ADMIN_MESSAGES, variables)
      .then(result => {
        if (!result?.data?.adminMessages?.results.length) setHasMore(false);
        let newMessages = [];
        let unreadMessagesIds = [];
        result?.data?.adminMessages?.results.forEach(msg => {
          newMessages.push(msg)
          if (!msg.isRead && msg.sentBy._id !== admin._id) unreadMessagesIds.push(msg._id)
        });
        let allMessages = [...messages, ...newMessages];
        setMessages(handleGetOnlyUniqElementsFromArray(allMessages));
        if (!!unreadMessagesIds.length) {
          readAdminMessages({variables: {
              input: {
                threadId: dataThread?.threadWithAdmin?.result._id,
                messageIds: unreadMessagesIds
              }
            }})
        }
      })
      .catch(e => console.log(e))
  }

  const handleGetOnlyUniqElementsFromArray = (msgArray) => {
    return Array.from(new Set(msgArray.map(a => a._id))).map(id => {
        return msgArray.find(a => a._id === id)
      })
  }

  const handleSortMessagesByDate = () => {
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

  const renderMessageComponent = (messages) => {
    let pId = null;
    let isNoRead = false;
    messages.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }).reverse();

    return messages.map((msg) => {
      const contentOnly = msg.sentBy._id === pId;
      pId = msg.sentBy._id;
      isNoRead = msg.sentBy._id !== admin._id && !msg.isRead;
      let userType = null;
      if (msg.sentBy._id !== admin._id) {
        userType = type === 'provider' ? 'SERVICE PROVIDER' : 'CLIENT';
      }
      return contentOnly
        ? <MessageComponentOnlyContent isNewMsg={isNoRead} key={msg._id} message={msg}/>
        : <MessageComponent  userType={userType} isNewMsg={isNoRead}  key={msg._id} message={msg}/>;
    })
  }

  const handleRenderMessages = () => {
    const sortedMessages = handleSortMessagesByDate();
    let dateKeysArray = Object.keys(sortedMessages);
    dateKeysArray.sort((a, b) => {
      return new Date(b) - new Date(a);
    });
    return dateKeysArray.reverse().map((dateKey) => {
      return (
        <div className={'date-box'}>
          <div className={'date-message-block'}>{dateKey}</div>
          {renderMessageComponent(sortedMessages[dateKey])}
        </div>
      )
    })
  }

  const handleSendMessage = async(event) => {
    const check = {
      input: {
        threadId: dataThread?.threadWithAdmin?.result._id,
        content: msgText
      }
    }
    if(event.keyCode === 13 && !!msgText && !loading) {
      try {
        await sendMessage({variables: check})
      } catch (error) {
        console.log("Message wasn't sent!" + error.message);
      }
      setMsgText('')
    }
  }

  return (
    <CustomContainer>
      <Layout/>
      <div className={'accuse-party-container'}>
        <div className={'header-block'}>
          <h1 className={'header-title'}>
            <img
              onClick={history.goBack}
              src={ArrowLeftIcon}
              className={'arrow-icon'}
              alt="agreement title"
            />
            {name} {type === 'user' ? 'Accusing Party' : 'Accused Party'}</h1>
        </div>
          <div className={'content-wrapper'}>
            <div className="description-wrapper">
              <div className={'message-thread-wrapper'}>
                {dataThread?.threadWithAdmin?.result ?
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={loadNextMessages}
                    hasMore={hasMore}
                    loader={
                      <div key={0} style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <CircularProgress />
                      </div>
                    }
                    isReverse={true}
                    useWindow={false}
                  >
                    {handleRenderMessages()}
                  </InfiniteScroll> :
                  <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <CircularProgress />
                  </div>
                }
              </div>
              <input
                value={msgText}
                className={'message-input'}
                onChange={e => setMsgText(e.target.value)} type="text"
                onKeyDown={handleSendMessage}
                placeholder={'Your message...'}
              />
            </div>
            <div className={'wrapper-buttons-group'}>
              <ButtonsGroup
                accuseType={type}
                disputeState={dispt}
                disputId={history.location.state.disputId}
                userId={history.location.state.userId}
                providerId={history.location.state.providerId}
                agreementName={name}
              />
            </div>
          </div>
        </div>
    </CustomContainer>
  );
}

const mapStateToProps = store => {
  return {
    admin: store.homeReducer.admin
  }
}

export default connect(mapStateToProps, {})(AccuseParty);
