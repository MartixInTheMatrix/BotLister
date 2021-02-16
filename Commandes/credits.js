const Discord = require('discord.js');
const fs = require('fs')


module.exports.run = async (client, message, args, member) => {
  if(args[0] === 'add'){
    const credits = JSON.parse(fs.readFileSync("../credits.json", "utf8"))
    const membre = message.mentions.members.first() || message.member
    if(!membre) return message.channel.send(
      new Discord.MessageEmbed()
      .setTitle('<:no:770286379543822346> Un problème est apparu')
      .setColor('#800000')
      .setDescription(`Veuillez entrer la commande comme dit ci-après : \`bl!credit add <mention> <credit>\``)
      .setFooter('<> - Obligatoire | [] - Optionnel | Ne pas mettre <> et []')
    )

    var amount = args[2]
    if(!amount) return message.channel.send(
      new Discord.MessageEmbed()
      .setTitle('<:no:770286379543822346> Un problème est apparu')
      .setColor('#800000')
      .setDescription(`Veuillez entrer la commande comme dit ci-après : \`bl!credit add <mention> <credit>\``)
      .setFooter('<> - Obligatoire | [] - Optionnel | Ne pas mettre <> et []')
    )

if (!credits[membre.id]) credits[membre.id] = {
    credits: 0,
  }
console.log(amount)
  credits[membre.id].credits =+ amount;

  fs.writeFile('../credits.json', JSON.stringify(credits), (err) =>{
    if(err) console.log(err)
  })
  message.channel.send(new Discord.MessageEmbed()
  .setColor('GREEN')
  .setTitle(`<:verified:770286371990405161> Succès`)
  .setDescription(`${membre.displayName} à bien gagné \`${amount}\` credit`))
}else if(args[0] === 'profil'){
  const credits = JSON.parse(fs.readFileSync('./credits.json', "utf8"))
  const membre = message.mentions.members.first() || message.member
  
  if (!credits[membre.id]) credits[membre.id] = {
    credits: 0,
  }

  const wembed = new Discord.MessageEmbed()
  .setColor("RED")
  .setAuthor(`Credits de ${membre.displayName}`, membre.user.displayAvatarURL())
  .addField('Nombre de crédits :', credits[membre.id].credits)
  message.channel.send(wembed);
}else if(args[0] === 'remove'){
  const credits = JSON.parse(fs.readFileSync("../credits.json", "utf8"))
  const membre = message.mentions.members.first() || message.member
  if(!membre) return message.channel.send(
    new Discord.MessageEmbed()
    .setTitle('<:no:770286379543822346> Un problème est apparu')
    .setColor('#800000')
    .setDescription(`Veuillez entrer la commande comme dit ci-après : \`bl!credit add <mention> <credit>\``)
    .setFooter('<> - Obligatoire | [] - Optionnel | Ne pas mettre <> et []')
  )

  const amount = args[2]
  if(!amount) return message.channel.send(
    new Discord.MessageEmbed()
    .setTitle('<:no:770286379543822346> Un problème est apparu')
    .setColor('#800000')
    .setDescription(`Veuillez entrer la commande comme dit ci-après : \`bl!credit remove <mention> <credit>\``)
    .setFooter('<> - Obligatoire | [] - Optionnel | Ne pas mettre <> et []')
  )

if (!credits[membre.id]) credits[membre.id] = {
  credits: 0,
}
console.log(amount)
credits[membre.id].credits-= amount;

fs.writeFile('../credits.json', JSON.stringify(credits), (err) =>{
  if(err) console.log(err)
})
message.channel.send(
  new Discord.MessageEmbed()
  .setColor('GREEN')
  .setTitle(`<:verified:770286371990405161> Succès`)
  .setDescription(`${membre.displayName} à bien perdu \`${amount}\` credit`)
)
}else if(args[0] === 'reset'){
  const credits = JSON.parse(fs.readFileSync("../credits.json", "utf8"))
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
if (!credits[user.id]) credits[user.id] = {
  credits: 0,
}
credits[user.id].credits-=credits;

fs.writeFile('../credits.json', JSON.stringify(credits), (err) =>{
  if(err) console.log(err)
})
message.channel.send(
  new Discord.MessageEmbed()
  .setColor('GREEN')
  .setTitle(`<:verified:770286371990405161> Succès`)
  .setDescription(`${user.displayName} à bien perdu tous ses credits`)
)

}

}
module.exports.help = {
  name: 'credit'
}