import {gql} from "@apollo/client";

export const START_PROCESSING_DISPUTE = `
  mutation startProcessingDispute ($disputeId: ObjectID!) {
    startProcessingDispute (disputeId: $disputeId) {
      status
      errorMessage
    }  
  }
`

export const READ_ADMIN_MESSAGES = gql`
    mutation readAdminMessages ($input: ReadMessagesInput!) {
        readAdminMessages (input: $input) {
            status
            errorMessage
        }
    }
`

export const LOG_IN = gql`
  mutation AdminLogin($email: EmailAddress! $password: String!) {
      adminLogin(input:{email: $email, password: $password}) {
        accessToken, refreshToken
      }
    }
`;

export const CREATE_THREAD = `
mutation createThreadWithAdmin ($userId: ObjectID!) {
    createThreadWithAdmin (userId: $userId) {
        status
        errorMessage
    }
}
`

export const SEND_MESSAGE_ADMIN = gql`
mutation sendMessageFromAdmin ($input: SendMessageInput!) {
    sendMessageFromAdmin (input: $input) {
        result {
            _id
            threadId
            content
            sentBy {
                ... on UserForMention {
                    _id
                    fullName
                    avatar {
                        _id
                        userId
                        filename
                        path
                        type
                        createdAt
                        updatedAt
                    }
                    rating
                    numberOfReviews
                }
                ... on AdminForMention {
                    _id
                    fullName
                    lastSeenAt
                }
            }
            isRead
            isDelivered
            createdAt
            updatedAt
        }
        status
    }
}
`

export const ADMIN_MESSAGES = `
query adminMessages ($threadId: ObjectID!, $page: NonNegativeInt, $limit: NonNegativeInt) {
    adminMessages (threadId: $threadId, page: $page, limit: $limit) {
        results {
            _id
            threadId
            content
            files {
                ... on FileForUser {
                    _id
                    userId
                    filename
                    path
                    type
                    createdAt
                    updatedAt
                }
                ... on FileForAdmin {
                    _id
                    admin {
                        _id
                        fullName
                        lastSeenAt
                    }
                    filename
                    type
                    createdAt
                    updatedAt
                }
            }
            sentBy {
                ... on UserForMention {
                    _id
                    fullName
                    avatar {
                        _id
                        filename
                        path
                        type
                        createdAt
                        updatedAt
                    }
                    rating
                    numberOfReviews
                }
                ... on AdminForMention {
                    _id
                    fullName
                    lastSeenAt
                    avatar {
                        _id
                        filename
                        path
                        type
                        createdAt
                        updatedAt
                    }
                }
            }
            isRead
            isDelivered
            createdAt
            updatedAt
        }
        status
        errorMessage
    }
}
`

export const THREAD_WITH_ADMIN = gql`
query threadWithAdmin ($userId: ObjectID!) {
    threadWithAdmin (userId: $userId) {
        result {
            _id
            user1
            user2
            adminUser
            lastMessage
            unreadMessageCount
            createdAt
            updatedAt
        }
        status
    }
}
`

export const REFUND_DISPUTE = gql`
    mutation RefundDispute($disputeId: ObjectID!) {
        refundDispute(disputeId: $disputeId) {
            status
            errorMessage
        }
    }
`;

export const CLOSE_DISPUTE = gql`
    mutation CloseDispute($disputeId: ObjectID!) {
        closeDispute(disputeId: $disputeId) {
            status
            errorMessage
        }
    }
`;

export const ADMIN_THREADS = `
  query adminThreads ($page: PositiveInt, $limit: PositiveInt) {
    adminThreads (page: $page, limit: $limit) {
        results {
            _id
            adminUser {
                _id
                avatar {
                    _id
                    filename
                    path
                    type
                    createdAt
                    updatedAt
                }
                fullName
                lastSeenAt
            }
            user {
                _id
                fullName
                avatar {
                    _id
                    userId
                    filename
                    path
                    type
                    createdAt
                    updatedAt
                }
                rating
                numberOfReviews
            }
            lastMessage {
                _id
                threadId
                content
                sentBy {
                    ... on UserForMention {
                        _id
                        fullName
                        rating
                        numberOfReviews
                    }
                    ... on AdminForMention {
                        _id
                        fullName
                        lastSeenAt
                    }
                }
                isRead
                isDelivered
                createdAt
                updatedAt
            }
            unreadMessageCount
            createdAt
            updatedAt
        }
        status
    }
  }
`;

export const NEW_MESSAGES = gql`
  subscription adminNewMessages ($threadId: ObjectID!) {
    adminNewMessages (threadId: $threadId) {
        _id
        threadId
        content
        sentBy {
            ... on UserForMention {
                _id
                fullName
                avatar {
                    _id
                    userId
                    filename
                    path
                    type
                    createdAt
                    updatedAt
                }
                rating
                numberOfReviews
            }
            ... on AdminForMention {
                _id
                fullName
                lastSeenAt
            }
        }
        isRead
        isDelivered
        createdAt
        updatedAt
    }
  }
`;

export const DISPUTE_MESSAGES = `
query disputedThreadMessages ($disputeId: ObjectID!, $page: NonNegativeInt, $limit: NonNegativeInt) {
    disputedThreadMessages (disputeId: $disputeId, page: $page, limit: $limit) {
        results {
            _id
            threadId
            content
            sentBy {
                ... on UserForMention {
                    _id
                    fullName
                    avatar {
                        _id
                        userId
                        filename
                        path
                        type
                        createdAt
                        updatedAt
                    }
                    rating
                    numberOfReviews
                }
                ... on AdminForMention {
                    _id
                    fullName
                    lastSeenAt
                }
            }
            isRead
            isDelivered
            createdAt
            updatedAt
        }
        status
        errorMessage
    }
}
`;

export const DISPUTS = `
    query Disputes($page: PositiveInt! $limit: PositiveInt!) {
        disputes(page: $page, limit: $limit) {
            results{
                _id
                reason
                state
                otherReason
                milestoneId
                reason
                agreement{
                    description
                    name
                    totalPrice
                    agreementState
                    createdAt
                    numberOfMilestones
                    description
                    client{
                        _id
                        fullName
                        rating
                        numberOfReviews
                        avatar{
                            path
                            filename
                            type
                        }
                    }
                    provider{
                        _id
                        fullName
                        rating
                        numberOfReviews
                        avatar{
                            path
                            filename
                            type
                        }
                    }
                    attachedFiles{
                        _id
                        filename
                        path
                        type
                    }
                    milestones{
                        _id 
                        description
                        name
                        deadlineIn
                        dateRange
                        endDate
                        milestoneFiles {
                            _id
                            userId
                            filename
                            path
                            type
                            createdAt
                            updatedAt
                        }
                        finishComment
                        cost
                        milestoneState
                    }
                }
            }
        }
    }
`;

export const DISPUTE = gql`
query dispute ($disputeId: ObjectID!) {
    dispute (disputeId: $disputeId) {
        result {
            _id
            agreement {
                _id
                client {
                    _id
                    fullName
                    avatar {
                        _id
                        userId
                        filename
                        path
                        type
                        createdAt
                        updatedAt
                    }
                    rating
                    numberOfReviews
                }
                provider {
                    _id
                    fullName
                    avatar {
                        _id
                        userId
                        filename
                        path
                        type
                        createdAt
                        updatedAt
                    }
                    rating
                    numberOfReviews
                }
                createdBy
                attachedFiles {
                    _id
                    userId
                    filename
                    path
                    type
                    createdAt
                    updatedAt
                }
                name
                description
                milestones {
                    _id
                    name
                    deadlineIn
                    dateRange
                    endDate
                    cost
                    milestoneFiles {
                        _id
                        userId
                        filename
                        path
                        type
                        createdAt
                        updatedAt
                    }
                    finishComment
                    description
                    milestoneState
                }
                buffMilestones {
                    _id
                    name
                    deadlineIn
                    dateRange
                    endDate
                    cost
                    description
                    milestoneState
                }
                totalPrice
                progress
                numberOfMilestones
                agreementState
                dispute {
                    _id
                    agreement
                    milestoneId
                    admin
                    state
                    reason
                    otherReason
                    createdAt
                    updatedAt
                }
                createdAt
                updatedAt
            }
            milestoneId
            admin {
                _id
                avatar {
                    _id
                    filename
                    path
                    type
                    createdAt
                    updatedAt
                }
                fullName
                lastSeenAt
            }
            state
            reason
            otherReason
            createdAt
            updatedAt
        }
        status
    }
}`;
