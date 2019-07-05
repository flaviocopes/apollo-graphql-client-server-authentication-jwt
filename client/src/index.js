import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { setContext } from 'apollo-link-context'
import { Router } from '@reach/router'
import { navigate } from '@reach/router'
import Cookies from 'js-cookie'
import Form from './Form'
import PrivateArea from './PrivateArea'

const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' })

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('token')

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`
    }
  }
})
const link = authLink.concat(httpLink)

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
})

if (Cookies.get('token')) {
  navigate('/private-area')
}


ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <Form path="/" />
      <PrivateArea path="/private-area" />
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
)
