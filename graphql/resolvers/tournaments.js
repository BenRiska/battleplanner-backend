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

        },
        async getTournament(_, {username, tournamentName}, context){

            // check user is authorized
            const user = checkAuth(context);

            // throw error if not authorized
           if(!user){
            throw new UserInputError("User not authorized")
            }

            const tournament = await Tournament.find({username, name: tournamentName})

            if(!tournament){
                throw new UserInputError("Tournament doesn't exist.")
            }

            return tournament[0]

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

           let newTournament = new Tournament({
               username: user.username,
               name: tournamentName,
               active: false,
               round: 0
           })

            const tournament = await newTournament.save()

            newTournament = await Tournament.findOne({name: tournamentName, username: user.username})

           return newTournament

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
        async addRule(_, {username, tournamentName, rule }, context){

            // check user is authorized
            const user = checkAuth(context);

            console.log("hit")

            // throw error if not authorized
           if(!user){
            throw new UserInputError("User not authorized")
            }

            const query = {username, name: tournamentName}

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
        async addParticipant(_, {tournamentName, name}, context){

            // check user is authorized
            const user = checkAuth(context);

            // throw error if not authorized
           if(!user){
            throw new UserInputError("User not authorized")
            }

            const query = {username: user.username, name: tournamentName}
            const participant = {name, status: true}


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
        async deleteParticipant(_, {tournamentName, name}, context){

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

            const target = tournament.participants.filter(p => p.name === name)

            //check if rule already exists
            if(target.length === 0){
                throw new UserInputError(
                    "Participant doesn't exist.")
            }

            // create new rules
            const newParticipants = tournament.participants.filter(p => p.name !== name)

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
        async endTournament(_, {winner, tournamentName}, context){

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

             //update rules in model
             tournament = Tournament.findOneAndUpdate(query, {
                winner,
                active: false
            }, (err) => {
                if(err){
                    throw new UserInputError("Problem connecting with database.")
                }
            });

            return tournament
        },
        async startGame(_, {tournamentName}, context){
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

            if(tournament.participants.length < 2){
                throw new UserInputError(
                    "Not enough participants")
            }

            if(tournament.winner){
                throw new UserInputError(
                    "Tournament has concluded")
            }

            let participantList = tournament.participants

            let fighterOneList = participantList.slice(0, (participantList.length / 2))

            let fighterTwoList = participantList.slice((participantList.length / 2), participantList.length)

            let matchups = []

            fighterOneList.forEach((fighter, index) => {
                matchups.push({
                    fighterOne: fighter.name, 
                    fighterTwo: fighterTwoList[index].name, 
                    concluded: false,
                    winner: ""
                })
            })

            let round = tournament.round + 1

            console.log(round, matchups)

            //update rules in model
            tournament = Tournament.findOneAndUpdate(query, {
                fights: matchups,
                round,
                active: true
            }, (err) => {
                if(err){
                    throw new UserInputError("Problem connecting with database.")
                }
            });

            
            return tournament
        },
        async endFight(_, {tournamentName, winner}, context){

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

            const fightList = tournament.fights.map(oldFight => {
                if(oldFight.fighterOne === winner ||
                   oldFight.fighterTwo === winner){
                    oldFight.concluded = true
                    oldFight.winner = winner
                }
                return oldFight
            })

            if(fightList.length < 2){
                //update rules in model
            tournament = Tournament.findOneAndUpdate(query, {
                fights: fightList,
                winner: fightList[0].winner
            }, (err) => {
                if(err){
                    throw new UserInputError("Problem connecting with database.")
                }
            });
            } else{
                //update rules in model
            tournament = Tournament.findOneAndUpdate(query, {
                fights: fightList
            }, (err) => {
                if(err){
                    throw new UserInputError("Problem connecting with database.")
                }
            });
            }


            return tournament

        },
        async startNextRound(_, {tournamentName}, context){

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

            let winners = tournament.fights.map(fight => fight.winner)

            let fighterOneList = winners.slice(0, (winners.length / 2))

            let fighterTwoList = winners.slice((winners.length / 2), winners.length)

            let matchups = []

            fighterOneList.forEach((fighter, index) => {
                matchups.push({
                    fighterOne: fighter, 
                    fighterTwo: fighterTwoList[index], 
                    concluded: false,
                    winner: ""
                })
            })

            let round = tournament.round + 1

             //update rules in model
             tournament = Tournament.findOneAndUpdate(query, {
                fights: matchups,
                round,
                active: true
            }, (err) => {
                if(err){
                    throw new UserInputError("Problem connecting with database.")
                }
            });

            return tournament

        }
    }
}