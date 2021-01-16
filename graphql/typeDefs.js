const gql = require("graphql-tag");

module.exports = gql`
    type Participant {
        name: String!
        status: Boolean!
    } 
    type Fight {
        fighterOne: String!
        fighterTwo: String!
        concluded: Boolean!
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
        active: Boolean!
        fights: [Fight!]
        round: Int
        winner: String
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
        getTournament(username: String!, tournamentName: String!): Tournament!
    }
    type Mutation {
        register(registerInput: RegisterInput!): User!
        login(username: String!, password: String!): User!
        createTournament(tournamentName: String!): Tournament!
        deleteTournament(tournamentName: String!): deleteResponse!
        addRule(username: String!, tournamentName: String!, rule: String!): Tournament!
        deleteRule(tournamentName: String!, rule: String!): Tournament!
        addRestriction(tournamentName: String!, restriction: String!): Tournament!
        deleteRestriction(tournamentName: String!, restriction: String!): Tournament!
        addParticipant(tournamentName: String!, name: String!): Tournament!
        deleteParticipant(tournamentName: String!, name: String!): Tournament!
        endTournament(winner: String!, tournamentName: String!): Tournament!
        startRound(tournamentName: String!): Tournament!
    }
`