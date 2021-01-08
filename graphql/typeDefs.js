const gql = require("graphql-tag");

module.exports = gql`
    type Participant {
        name: String!
        status: Boolean!
    }
    type Tournament {
        name: String!
        rules: [String!]
        restrictions: [String!]
        participants: [Participant!]
    }
    type User {
        id: ID!
        username: String!
        token: String!
        email: String!
        createdAt: String!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    },
    type Query {
        getUsers: [User!]!
    }
    type Mutation {
        register(registerInput: RegisterInput!): User!
        login(username: String!, password: String!): User!
        createTournament(userId: String!): User!
        deleteTournament(userId: ID!, tournamentId: ID!): User!
    }
`