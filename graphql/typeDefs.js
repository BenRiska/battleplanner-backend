const gql = require("graphql-tag");

module.exports = gql`
    type Participant {
        name: String!
        status: Boolean!
    } 
    type deleteResponse {
        res: String!
    }
    type Tournament {
        name: String!
        username: String!
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
        getTournaments(username: String!): [Tournament!]!
    }
    type Mutation {
        register(registerInput: RegisterInput!): User!
        login(username: String!, password: String!): User!
        createTournament(tournamentName: ID!): Tournament!
        deleteTournament(tournamentName: ID!): deleteResponse!
        addRule(tournamentName: String!, rule: String!): Tournament!
        deleteRule(tournamentName: String!, rule: String!): Tournament!
        addRestriction(tournamentName: String!, restriction: String!): Tournament!
        deleteRestriction(tournamentName: String!, restriction: String!): Tournament!
        addParticipant(tournamentName: String!, name: String!, status: Boolean!): Tournament!
        deleteParticipant(tournamentName: String!, name: String!, status: Boolean!): Tournament!
    }
`