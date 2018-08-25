import { GraphQLServer } from 'graphql-yoga'
import resolvers from './resolvers'

const server = new GraphQLServer({
  typeDefs: './src/schema/schema.graphql',
  resolvers
})

server.start({ playground: false }, () =>
  console.log('Server ready!. Visit https://ide.titan-suite.com/')
)
