import {graphQLApiClient} from "../helpers/apiClient";

export const getAdminDataService = () => {
    const query = `
        query admin {
    admin {
        _id
        avatar {
            _id
            userId
            adminId
            filename
            path
            type
            createdAt
            updatedAt
        }
        fullName
        isVerified
        lastSeenAt
    }
}
    `
    return graphQLApiClient('POST', query)
}
