import { ApolloClient, InMemoryCache } from '@apollo/client';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import {SubscriptionClient} from "subscriptions-transport-ws";
import { SERVER_URL, WS_URL } from "../constants"

const token = localStorage.getItem('access-token');

const httpLink = new HttpLink({
    uri: `${SERVER_URL}/graphql`,
    headers: {
        'access-token': token ? token : '',
    }
});

const wsLink = new SubscriptionClient(WS_URL,{
    connectionParams: {
        'access-token': token ? token : '',
    },
        reconnect: true
});

const splitLink = split(
  ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
});

export const graphQLApiClient = (requestType, requestQuery, variables = null) => {
    const token = localStorage.getItem('access-token');
    const options = {
        method: `${requestType}`,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'access-token': token && token,
            Accept: '/',
            'Cache-Control': 'no-cache'
        },
        credentials: 'same-origin',
        body: JSON.stringify({query: requestQuery, variables})
    };
    return fetch(`${SERVER_URL}/graphql`, options)
        .then(result => {
            return result.json();
        })
        .then(data => {
            if (data && !!data.errors) {
                data.errors.forEach(error => {
                    throw error.message;
                })
            }
            return data;
        })
        .catch(error => {
            throw error;
        })
}
