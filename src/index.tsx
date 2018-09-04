import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { createHttpLink } from 'apollo-link-http'
import Index from './pages/index'

const link = createHttpLink({
  uri: 'http://localhost:4000/'
})

const client = new ApolloClient({
  connectToDevTools: true,
  link,
  cache: new InMemoryCache()
})

const WrappedApp = (
  <ApolloProvider client={client}>
    <Index />
  </ApolloProvider>
)

ReactDOM.render(WrappedApp, document.querySelector('#root'))
