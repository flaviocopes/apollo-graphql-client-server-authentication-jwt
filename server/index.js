const express = require('express')
const {
  ApolloServer,
  gql,
  AuthenticationError,
} = require('apollo-server-express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const todos = [
  {
    id: 1,
    user: 1,
    name: 'Do something'
  },
  {
    id: 2,
    user: 1,
    name: 'Do something else'
  },
  {
    id: 3,
    user: 2,
    name: 'Bark'
  }
]

const users = [
  {
    id: 1,
    name: 'Test user',
    email: 'your@email.com',
    password: '$2b$10$ahs7h0hNH8ffAVg6PwgovO3AVzn1izNFHn.su9gcJnUWUzb2Rcb2W' //ssseeeecrreeet
  }
]

const SECRET_KEY = 'secret!'

const app = express()
app.use(cors())

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    password: String!
  }

  type Todo {
    id: ID!
    user: Int!
    name: String!
  }

  type Query {
    todos: [Todo]
  }
`

const resolvers = {
  Query: {
    todos: (root, args) => {
      return todos.filter(todo => todo.user === id)
    }
  }
}

const context = ({ req }) => {
  const token = req.headers.authorization || ''

  try {
    return { id, email } = jwt.verify(token.split(' ')[1], SECRET_KEY)
  } catch (e) {
    throw new AuthenticationError(
      'Authentication token is invalid, please log in',
    )
  }
}

const server = new ApolloServer({ typeDefs, resolvers, context })
server.applyMiddleware({ app })

app.use(express.urlencoded({extended: true}))
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = users.find(user => user.email === email)

  if (!user) {
    res.status(404).send({
      success: false,
      message: `Could not find account: ${email}`,
    })
    return
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    res.status(401).send({
      success: false,
      message: 'Incorrect credentials',
    })
    return
  }

  const token = jwt.sign(
    { email: user.email, id: user.id },
    SECRET_KEY,
  )

  res.send({
    success: true,
    token: token,
  })
})

app.listen(3000, () =>
  console.log(
      `🔥🔥🔥 GraphQL + Express auth tutorial listening on port 3000!`,
  ),
)