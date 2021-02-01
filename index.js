const Discord = require('discord.js');
const client = new Discord.Client()
client.commands = new Discord.Collection()
const fs = require('fs');
const message = require('./Events/message');
const leveling = require('discord-leveling')
const credits = JSON.parse(fs.readFileSync("./credits.json", "utf8"))
const prefix = 'bl!'

fs.readdir('./Commandes/', (error, f) => {
    if(error) return console.log(error);
    let commandes = f.filter(f => f.split('.').pop() === 'js');
    if(commandes.length <= 0) return console.log('Aucune commande n\'a été trouvée.')

    commandes.forEach((f) => {
        let commande = require(`./Commandes/${f}`);
        console.log(`${f}, commande chargée !`)
        client.commands.set(commande.help.name, commande);
    })
})

fs.readdir('./Events/', (error, f) => {
    if(error) return console.log(error);
    console.log(`${f.length} events chargé(s)`)

    f.forEach((f) => {
        let events = require(`./Events/${f}`);
        let event = f.split('.')[0];
        client.on(event, events.bind(null, client));
    })
})

const activities_list = [
    `vos bot`,
    `bl!help`,
    `Bot officiel BotLister`,
    `vos bot`,

  ];
  
  client.on("ready", () => {
    setInterval(() => {
      const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
      client.user.setActivity(activities_list[index], {
        status: "online",
        type: "STREAMING",
        url: "https://twitch.tv/durbin"
      });
    }, 20000);
    console.log(
      `${client.user.username} connecté ${client.users.cache.size} utilisateurs !`
    );

  });


client.on('guildMemberAdd', async (member) => {

    let bvn = member.guild.channels.cache.get("770607203035381780")
bvn.send(`→ <@${member.id}> a été intrigué par la tête du serveur. Fait un tour complet avant de poursuivre, n'oublie pas ces salons : \n → <#770624490023551016> et <#770295496853159985> \n> Bienvenue !`)

})

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////XP - LEVELS SYSTEME/////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
client.on('message', async(message) => {
  var profile = await leveling.Fetch(message.author.id)
  if(message.author.bot)return
  leveling.AddXp(message.author.id, 1)
  if (profile.xp + 1 > 50) {
    const credits = JSON.parse(fs.readFileSync("./credits.json", "utf8"))
    if (!credits[message.member.id]) credits[message.member.id] = {
      credits: 0,
    }
    credits[message.member.id].credits++
    fs.writeFileSync('./credits.json', JSON.stringify(credits), (err) =>{
      if(err) console.log(err)
    })
    await leveling.AddLevel(message.author.id, 1)
    await leveling.SetXp(message.author.id, 0)
    message.channel.send(
        new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(`Tu viens de monter au niveau ${profile.level + 1} ! gg`)
        .setDescription(`Tu viens donc de gagner **1** crédit à ta cagnote !`)
    )

  }
  }
)

client.login('Nzg3NzQ4NjMwMDA5MjE3MDc0.X9ZeFQ.eAk9RP2u_WkXAPkU6vAY_0e5R9g')