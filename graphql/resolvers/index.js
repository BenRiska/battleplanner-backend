const tournamentsResolvers = require("./tournaments")
const usersResolvers = require("./users")



module.exports = {
    Query: {
        ...tournamentsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...tournamentsResolvers.Mutation
    }
}
