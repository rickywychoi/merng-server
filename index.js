require('dotenv').config()
const { ApolloServer, PubSub } = require('apollo-server')
const typeDefs = require('./graphql/typeDefs')
const { resolvers } = require('./graphql/resolvers/index')

const mongoose = require('mongoose')

const pubsub = new PubSub()

const PORT = process.env.PORT || 5000

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
})

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB connected')
    return server.listen({ port: PORT })
  })
  .then(res => {
    console.log(`Server running at ${res.url}`)
  })
  .catch(err => {
    console.error(err)
  })
