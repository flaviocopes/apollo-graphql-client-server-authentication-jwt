import React from 'react'
import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'
import Cookies from 'js-cookie'
import { navigate } from '@reach/router'

const PrivateArea = () => {
  if (!Cookies.get('token')) {
    navigate('/')
  }

  return (
    <Query
      query={gql`
        {
          todos {
            id
            name
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>
        if (error) {
          navigate('/')
          return <p></p>
        }
        return <ul>{data.todos.map(item => <li key={item.id}>{item.name}</li>)}</ul>
      }}
    </Query>
  )
}

export default PrivateArea