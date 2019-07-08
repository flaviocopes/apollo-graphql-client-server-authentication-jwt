import React, { useState } from 'react'
import { navigate } from '@reach/router'

const url = 'http://localhost:3000/login'

const Form = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitForm = event => {
    event.preventDefault()

    const options = {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `email=${email}&password=${password}`
    }

    fetch(url, options)
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          alert('Email not found, please retry')
        }
        if (response.status === 401) {
          alert('Email and password do not match, please retry')
        }
      }
      return response
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.cookie = 'signedin=true'
        navigate('/private-area')
      }
    })
  }

  return (
    <div>
      <form onSubmit={submitForm}>
        <p>Email: <input type="text" onChange={event => setEmail(event.target.value)} /></p>
        <p>Password: <input type="password" onChange={event => setPassword(event.target.value)} /></p>
        <p><button type="submit">Login</button></p>
      </form>
    </div>
  )
}

export default Form