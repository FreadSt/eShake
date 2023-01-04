import {graphQLApiClient} from "../helpers/apiClient";

export const logInService = ({email, password}) => {
    const query = `mutation AdminLogin($email: EmailAddress! $password: String!) {
      adminLogin(input:{email: $email, password: $password}) {
        accessToken, refreshToken
      }
    }`;
    const variables = `{   
        "email": "${email}",
        "password": "${password}"
    }`;
    return graphQLApiClient('POST', query, variables)
}
