const {ApolloServer} = require("apollo-server");
const mongoose = require("mongoose");

const {MONGODB} = require("./config");
const typeDefs = require("./graphql/typeDefs")
const resolvers = require("./graphql/resolvers")

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
};

const PORT = process.env.port || 5000

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req}),
    cors: corsOptions
})

mongoose.connect(MONGODB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(() => {
    console.log("MongoDB Connected")
    return server.listen({port: PORT})
}).then(res => {
    console.log(`Server running at ${res.url}`)
}).catch(err => {
    console.error(err)
})