const {UserInputError, addResolveFunctionsToSchema} = require("apollo-server")

const Tournament = require("../../models/Tournament")

const checkAuth = require('../../utils/check-auth');


module.exports = {
    Query: {
        async getTournaments(_, {username}, context){

            // check user is authorized
            const user = checkAuth(context);

            // throw error if not authorized
           if(!user){
            throw new UserInputError("User not authorized")
            }

            const tournaments = await Tournament.find({username})

            return tournaments

        }
    },
    Mutation: {
        async createTournament(_, {tournamentName}, context){

             // check user is authorized
             const user = checkAuth(context);

            // throw error if not authorized
           if(!user){
            throw new UserInputError("User not authorized")
            }

            const existingTournament = await Tournament.findOne({name: tournamentName, username: user.username})

            if(existingTournament){
                throw new UserInputError(
                    "Tournament name already exists.")
            }

           const newTournament = new Tournament({
               username: user.username,
               name: tournamentName,
           })

            const tournament = await newTournament.save()

           console.log(tournament)

           return tournament

        },
        async deleteTournament(_, {tournamentName}, context){
             // check user is authorized
             const user = checkAuth(context);

            // throw error if not authorized
           if(!user){
            throw new UserInputError("User not authorized")
            }

            // check if tournament exists
            const tournament = await Tournament.findOne({name: tournamentName, username: user.username})

            // throw error if it doesn't
            if(!tournament){
                throw new UserInputError(
                    "Tournament doesn't exist.")
            }

            // delete tournament
            Tournament.deleteOne({name: tournamentName}, (err) => {
                if(err){
                    throw new UserInputError(
                        "Error contacting database.")
                }
            })

            // send confirmation response
            return {res: "Tournament deleted sucsessfully"}

        },
        async addRule(_, {tournamentName, rule }, context){

            // check user is authorized
            const user = checkAuth(context);

            // throw error if not authorized
           if(!user){
            throw new UserInputError("User not authorized")
            }

            const query = {username: user.username, name: tournamentName}

            // check if tournament exists
            let tournament = await Tournament.findOne(query)

            // throw error if it doesn't
            if(!tournament){
                throw new UserInputError(
                    "Tournament doesn't exist.")
            }

            //check if rule already exists
            if(tournament.rules.includes(rule)){
                throw new UserInputError(
                    "Rule already exists.")
            }

            // update tournament
            Tournament.findOneAndUpdate(query, {
                rules: [...tournament.rules, rule]
            }, (err) => {
                if(err){
                    throw new UserInputError("Problem connecting with database.")
                }
            });

            // get new tournament object
            tournament = await Tournament.findOne(query)

            // return tournament
            return tournament

        },
        async deleteRule(_, {tournamentName, rule}, context){

            // check user is authorized
            const user = checkAuth(context);

            // throw error if not authorized
           if(!user){
            throw new UserInputError("User not authorized")
            }

            const query = {username: user.username, name: tournamentName}

            // check if tournament exists
            let tournament = await Tournament.findOne(query)

            // throw error if it doesn't
            if(!tournament){
                throw new UserInputError(
                    "Tournament doesn't exist.")
            }

            //check if rule already exists
            if(!tournament.rules.includes(rule)){
                throw new UserInputError(
                    "Rule doesn't exists.")
            }

            // create new rules
            const newRules = tournament.rules.filter(r => r !== rule)

            //update rules in model
            Tournament.findOneAndUpdate(query, {
                rules: newRules
            }, (err) => {
                if(err){
                    throw new UserInputError("Problem connecting with database.")
                }
            });

            // get new tournament object
            tournament = await Tournament.findOne(query)

            // return tournament
            return tournament

        }, 
        async addRestriction(_, {tournamentName, restriction}, context){

            // check user is authorized
            const user = checkAuth(context);

            // throw error if not authorized
           if(!user){
            throw new UserInputError("User not authorized")
            }

            const query = {username: user.username, name: tournamentName}

            // check if tournament exists
            let tournament = await Tournament.findOne(query)

            // throw error if it doesn't
            if(!tournament){
                throw new UserInputError(
                    "Tournament doesn't exist.")
            }

            //check if restriction already exists
            if(tournament.restrictions.includes(restriction)){
                throw new UserInputError(
                    "Restriction already exists.")
            }

            // update tournament
            Tournament.findOneAndUpdate(query, {
                restrictions: [...tournament.restrictions, restriction]
            }, (err) => {
                if(err){
                    throw new UserInputError("Problem connecting with database.")
                }
            });

            // get new tournament object
            tournament = await Tournament.findOne(query)

            // return tournament
            return tournament

        },
        async deleteRestriction(_, {tournamentName, restriction}, context){

            // check user is authorized
            const user = checkAuth(context);

            // throw error if not authorized
           if(!user){
            throw new UserInputError("User not authorized")
            }

            const query = {username: user.username, name: tournamentName}

            // check if tournament exists
            let tournament = await Tournament.findOne(query)

            // throw error if it doesn't
            if(!tournament){
                throw new UserInputError(
                    "Tournament doesn't exist.")
            }

            //check if rule already exists
            if(!tournament.restrictions.includes(restriction)){
                throw new UserInputError(
                    "Restriction doesn't exist.")
            }

            // create new rules
            const newRestrictions = tournament.restrictions.filter(r => r !== restriction)

            //update rules in model
            tournament = Tournament.findOneAndUpdate(query, {
                restrictions: newRestrictions
            }, (err) => {
                if(err){
                    throw new UserInputError("Problem connecting with database.")
                }
            });

            return tournament

        },
        async addParticipant(_, {tournamentName, name, status}, context){

            // check user is authorized
            const user = checkAuth(context);

            // throw error if not authorized
           if(!user){
            throw new UserInputError("User not authorized")
            }

            const query = {username: user.username, name: tournamentName}
            const participant = {name, status}

            // check if tournament exists
            let tournament = await Tournament.findOne(query)

            // throw error if it doesn't
            if(!tournament){
                throw new UserInputError(
                    "Tournament doesn't exist.")
            }

            const target = tournament.participants.filter(p => p.name === participant.name)

            //check if rule already exists
            if(target.length > 0){
                throw new UserInputError(
                    "Participant already exists.")
            }

            // update tournament
            Tournament.findOneAndUpdate(query, {
                participants: [...tournament.participants, participant]
            }, (err) => {
                if(err){
                    throw new UserInputError("Problem connecting with database.")
                }
            });

            // get new tournament object
            tournament = await Tournament.findOne(query)

            // return tournament
            return tournament

        },
        async deleteParticipant(_, {tournamentName, name, status}, context){

            // check user is authorized
            const user = checkAuth(context);

            // throw error if not authorized
           if(!user){
            throw new UserInputError("User not authorized")
            }

            const query = {username: user.username, name: tournamentName}
            const participant = {name, status}

            // check if tournament exists
            let tournament = await Tournament.findOne(query)

            // throw error if it doesn't
            if(!tournament){
                throw new UserInputError(
                    "Tournament doesn't exist.")
            }

            const target = tournament.participants.filter(p => p.name === participant.name)

            //check if rule already exists
            if(target.length === 0){
                throw new UserInputError(
                    "Participant doesn't exist.")
            }

            // create new rules
            const newParticipants = tournament.participants.filter(p => p.name !== participant.name)

            //update rules in model
            tournament = Tournament.findOneAndUpdate(query, {
                participants: newParticipants
            }, (err) => {
                if(err){
                    throw new UserInputError("Problem connecting with database.")
                }
            });

            return tournament

        },
    }
}