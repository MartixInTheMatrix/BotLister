const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (client, message, args) => {
  let bots = db.get(`userBots`);
  let number = 1
  let temp = '__Voici la liste des bots dans la file d\'attente__ :\n'
  for(bot in bots){
    client.users.fetch(bot).then((b) => {
      let isVerified = bots[b.id].isVerified;
      if(!isVerified){
        temp = temp + `\n**#${number}** - ${b.tag} *(${b.id})* **Owner:** <@${bots[b.id].ownerID}>`
        number++;
      }
    })
  }
  setTimeout(() => {
    message.channel.send(
      new Discord.MessageEmbed()
        .setTitle('File d\'attente')
        .setColor("#2f3136")
        .setDescription(temp)
    )
  }, 500)
}

module.exports.help = {
  name: 'queue'
}