const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const leveling = require('discord-leveling')

module.exports = async(client, message) => {
  let prefix = 'bl!'
    if (message.channel.type === 'dm') return;

    if(message.channel.id === "791429124010016788"){
      if(!message.author.bot){return}
      if(message.author.id === client.user.id){return}
      message.channel.bulkDelete(2)
      message.channel.send(
        new Discord.MessageEmbed()
        .setColor("#282828")
        .setAuthor(`Nouvelle MàJ du bot ${message.author.tag}`, message.member.user.displayAvatarURL())
        .setDescription(message.content)
      )
    }

    if(message.author.bot) { return; }
    if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) { return; }
    if (!message.content.startsWith(prefix)) { return; }

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let commande = args.shift();
        let cmd = client.commands.get(commande);

        if (!cmd) { return; }
            cmd.run(client, message, args);
            let date = new Date();
            console.log(`${message.author.username} | ${date} | Commande : ${prefix}${commande} ${args.join(' ')}`)
};