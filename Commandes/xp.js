const Discord = require('discord.js');
const db = require('quick.db');
const moment = require('moment');
const fs = require('fs')
const leveling = require('discord-leveling')

module.exports.run = async (client, message, args, member) => {
    if(args[0] === 'profil'){
        var user = message.mentions.members.first() || message.member
 
    var output = await leveling.Fetch(user.id)
    message.channel.send(
        new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(`Profil de ${user.displayName}`)
        .setDescription(`> level(s): ${output.level} \n> xp: ${output.xp} xp`)
    )
    } else if(args[0] === 'setxp'){
        var amount = args[2]
        var user = message.mentions.members.first() || message.member
 
    var output = await leveling.SetXp(user.id, amount)
    message.channel.send(
        new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(`<:verified:770286371990405161> Succès`)
        .setDescription(`${user.displayName} à maintenant ${amount} xp`)
    )
    }else if(args[0] === 'setlevel'){
    var amount = args[1]
    var user = message.mentions.members.first() || message.member

    var output = await leveling.SetLevel(user.id, amount)
    message.channel.send(
        new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(`<:verified:770286371990405161> Succès`)
        .setDescription(`${user.displayName} à maintenant ${amount} levels`)
    )
    }else if(args[0] === 'leaderboard'){
        //If you put a mention behind the command it searches for the mentioned user in database and tells the position.
    if (message.mentions.users.first()) {
 
        var output = await leveling.Leaderboard({
          search: message.mentions.members.first().id
        })
        message.channel.send(
            new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle(`L'utilisateur ${user.displayName} est ${output.placement} dans le leaderboard!`)
        )
        //Searches for the top 3 and outputs it to the user.
      } else {
   
        leveling.Leaderboard({
          limit: 3 //Only takes top 3 ( Totally Optional )
        }).then(async uz => { //make sure it is async
   
          if (uz[0]) var firstplace = await client.users.fetch(uz[0].userid) //Searches for the user object in discord for first place
          if (uz[1]) var secondplace = await client.users.fetch(uz[1].userid) //Searches for the user object in discord for second place
          if (uz[2]) var thirdplace = await client.users.fetch(uz[2].userid) //Searches for the user object in discord for third place
   
          message.channel.send(
              new Discord.MessageEmbed()
              .setColor('BLUE')
              .setTitle(`Leaderboard:`)
            .setDescription(
            `> 1er - ${firstplace && firstplace.tag || 'Personne'} | ${uz[0] && uz[0].level + ' level'|| 'pas de level'} 
            \n> 2eme - ${secondplace && secondplace.tag || 'Personne'} | ${uz[1] && uz[1].level + ' level'|| 'pas de level'} 
            \n> 3eme - ${thirdplace && thirdplace.tag || 'Personne'} | ${uz[2] && uz[2].level + ' level'|| 'pas de level'} `)
          )
        })
   
      }

    }else if(args[0] === 'delete'){
        var user = message.mentions.members.first() || message.member
        if (!user) return message.channel.send(
        new Discord.MessageEmbed()
        .setTitle('<:no:770286379543822346> Un problème est apparu')
        .setColor('#800000')
        .setDescription(`Veuillez mettre un utilisateur a supprimer dans ma base de donées`)
    )

        if (!message.guild.me.hasPermission(`ADMINISTRATOR`)) return message.channel.send(new Discord.MessageEmbed()
        .setTitle('<:no:770286379543822346> Un problème est apparu')
        .setColor('#800000')
        .setDescription(`Tu dois etre Admin pour faire cela !`)
    )
     
        var output = await leveling.Delete(user.id)
        if (output.deleted == true) return message.channel.send(
            new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle(`<:verified:770286371990405161> Succès`)
            .setDescription(`${user.displayName} à bien été supprimé`)
        )
     
        message.reply('Error: Could not find the user in database.')
     
    }
}
module.exports.help = {
    name: 'xp'
  }