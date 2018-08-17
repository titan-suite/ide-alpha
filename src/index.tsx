import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { createHttpLink } from 'apollo-link-http'
import { split, from } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import Index from './pages/index'
import { DocumentNode } from 'graphql'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
  credentials: 'same-origin'
})

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true
  }
})

const link = split(
  // split based on operation type
  ({ query }) => {
    const {
      kind,
      operation
    }: {
      kind: string
      operation?: string
    } = getMainDefinition(query as DocumentNode)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  connectToDevTools: true,
  link: from([link]),
  cache: new InMemoryCache()
})

const WrappedApp = (
  <ApolloProvider client={client}>
    <Index />
  </ApolloProvider>
)

ReactDOM.render(WrappedApp, document.querySelector('#root'))
