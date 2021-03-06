const gql = require("graphql-tag");

module.exports = gql`
    type Participant {
        id: ID!
        name: String!
        status: Boolean!
    } 
    type Fight {
        id: ID!
        fighterOne: String!
        fighterTwo: String!
        concluded: Boolean!
        winner: String
    }
    type deleteResponse {
        res: String!
    }
    type Tournament {
        id: ID!
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
        getTournament(tournamentName: String!): Tournament!
    }
    type Mutation {
        register(registerInput: RegisterInput!): User!
        login(username: String!, password: String!): User!
        createTournament(tournamentName: String!): Tournament!
        deleteTournament(tournamentName: String!): [Tournament!]!
        addRule(tournamentName: String!, rule: String!): Tournament!
        deleteRule(tournamentName: String!, rule: String!): Tournament!
        addRestriction(tournamentName: String!, restriction: String!): Tournament!
        deleteRestriction(tournamentName: String!, restriction: String!): Tournament!
        addParticipant(tournamentName: String!, name: String!): Tournament!
        deleteParticipant(tournamentName: String!, name: String!): Tournament!
        endTournament(winner: String!, tournamentName: String!): Tournament!
        startGame(tournamentName: String!): Tournament!
        endFight(tournamentName: String!, winner: String!): Tournament!
        startNextRound(tournamentName: String!): Tournament!
    }
`