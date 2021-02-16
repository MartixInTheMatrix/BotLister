const Discord = require('discord.js');
const db = require('quick.db');
const moment = require('moment');
const fs = require('fs')
const talkedRecently = new Set();

module.exports.run = async (client, message, args, member) => {

  let userBots = db.get(`userBots`);

  if(!args[0]){
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTitle('<:no:770286379543822346> Un problème est apparu')
        .setColor('#800000')
        .setDescription(`Veuillez entrer la commande comme dit ci-après : \`bl!bot <add/remove/info> <bot_id> [prefix]\``)
        .setFooter('<> - Obligatoire | [] - Optionnel | Ne pas mettre <> et []')
    )
  } else if(args[0] === 'add'){
    if(message.channel.id != '770627159986798602') {
      return message.channel.send('Cette commande ne peut pas être utiliser ici, rendez vous dans ce salon pour pouvoir utiliser cette commande : <#770627159986798602>.')
    }
    if(args[1]){
      client.users.fetch(args[1]).then(b => {
        if(!b.bot){
          return message.channel.send(
            new Discord.MessageEmbed()
              .setTitle('<:no:770286379543822346> Un problème est apparu')
              .setColor('#800000')
              .setDescription(`Vous ne pouvez pas ajouter un utilisateur en tant que bot. Veuillez entrer la commande comme dit ci-après : \`bl!bot add <bot_id> <prefix>\``)
              .setFooter('<> - Obligatoire | [] - Optionnel | Ne pas mettre <> et []')
          )
        }
        let isInList = db.get(`userBots.${b.id}.isInList`)
        if(isInList){
          return message.channel.send(
            new Discord.MessageEmbed()
              .setTitle('<:no:770286379543822346> Un problème est apparu')
              .setColor('#800000')
              .setDescription(`Le bot \`${b.tag}\` est déjà dans la liste.`)
              .setFooter('Error: Bot allready listed.')
          )
        }
        if(args[2]){
          message.channel.send(
            new Discord.MessageEmbed()
              .setTitle('<:verified:770286371990405161> Succès')
              .setColor('DARK_GREEN')
              .setDescription(`Vous avez ajouté le bot \`${b.tag}\` avec succès. Vous serez avertit lors du début de la vérification.`)
              .setFooter('Bot ajouté avec succès.')
          )
          db.set(`userBots.${b.id}.isInList`, true)
          db.set(`userBots.${b.id}.isVerified`, false)
          db.set(`userBots.${b.id}.ownerID`, message.author.id)
          db.set(`userBots.${b.id}.added`, new Date())
          let serv = client.guilds.cache.get('770283222780215347')
          serv.channels.cache.get('770963772658548748').send(`<a:loading:770286388599717899> ${message.author} à ajouté le bot \`${b.tag}\`. Le bot sera prochainement vérifié.`)
          let testserv = client.guilds.cache.get('770965861250367488')
          testserv.channels.cache.get('788072434121179156').send(
            new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('🆕__Bot ajouté__')
            .setDescription(`> \`${message.author.username}\` à ajouté le bot \`${b.tag}\`. \n> [clique ici](https://discord.com/oauth2/authorize?client_id=${b.id}&permissions=8&scope=bot) pour ajouter. \n> Prefixe \`${args[2]}\``)
            )
        
        } else {
          return message.channel.send(
            new Discord.MessageEmbed()
              .setTitle('<:no:770286379543822346> Un problème est apparu')
              .setColor('#800000')
              .setDescription(`Veuillez entrer la commande comme dit ci-après : \`bl!bot add <bot_id> <prefix>\``)
              .setFooter('<> - Obligatoire | [] - Optionnel | Ne pas mettre <> et []')
          )
        }
      })
    } else {
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle('<:no:770286379543822346> Un problème est apparu')
          .setColor('#800000')
          .setDescription(`Veuillez entrer la commande comme dit ci-après : \`bl!bot add <bot_id> <prefix>\``)
          .setFooter('<> - Obligatoire | [] - Optionnel | Ne pas mettre <> et []')
      )
    }
  } else if(args[0] === 'remove'){
    if(message.channel.id != '770627159986798602') {
      return message.channel.send('Cette commande ne peut pas être utiliser ici, rendez vous dans ce salon pour pouvoir utiliser cette commande : <#770627159986798602>')
    }
    if(!userBots) {
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle('<:no:770286379543822346> Un problème est apparu')
          .setColor('#800000')
          .setDescription(`Vous n'avez aucun bot dans nôtre liste.`)
          .setFooter('<> - Obligatoire | [] - Optionnel | Ne pas mettre <> et []')
      )
    }
    if(args[1]){
      client.users.fetch(args[1]).then(b => {
        if(!b.bot) {
          return message.channel.send(
            new Discord.MessageEmbed()
              .setTitle('<:no:770286379543822346> Un problème est apparu')
              .setColor('#800000')
              .setDescription(`Cet utilisateur n'est pas un bot. Veuillez entrer la commande comme dit ci-après : \`bl!bot remove <bot_id>\``)
              .setFooter('<> - Obligatoire | [] - Optionnel | Ne pas mettre <> et []')
          )
        }
        let isInList = db.get(`userBots.${b.id}.isInList`)
        if(!isInList){
          return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:no:770286379543822346> Un problème est apparu')
                .setColor('#800000')
                .setDescription(`Ce bot n'a pas été ajouté à nôtre liste.`)
                .setFooter('Bot non listé')
          )
        }
        let owner = db.get(`userBots.${b.id}.ownerID`)
        if(!message.author.id === owner){
          return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('<:no:770286379543822346> Un problème est apparu')
                .setColor('#800000')
                .setDescription(`Ce bot ne vous appartient pas.`)
                .setFooter('Bot non listé')
          )
        }
        message.channel.send(
          new Discord.MessageEmbed()
            .setTitle('<:verified:770286371990405161> Succès')
            .setColor('DARK_GREEN')
            .setDescription(`Vous avez retiré le bot \`${b.tag}\` de nôtre liste avec succès.`)
            .setFooter('Bot retiré avec succès.')
        )
        db.delete(`userBots.${b.id}`)
      }).catch(err => {
        return message.channel.send(
          new Discord.MessageEmbed()
              .setTitle('<:no:770286379543822346> Un problème est apparu')
              .setColor('#800000')
              .setDescription(`Aucun bot bot n'existe avec cet identifiant. Veuillez vérifier puis ré-essayer.`)
              .setFooter('Bot inconnu')
        )
      })
    } else {
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle('<:no:770286379543822346> Un problème est apparu')
          .setColor('#800000')
          .setDescription(`Veuillez entrer la commande comme dit ci-après : \`bl!bot remove <bot_id>\``)
          .setFooter('<> - Obligatoire | [] - Optionnel | Ne pas mettre <> et []')
      )
    }
  } else if(args[0] === 'info'){
    if(args[1]){
      client.users.fetch(args[1]).then(b => {
        if(!b.bot){
          return message.channel.send(
            new Discord.MessageEmbed()
              .setTitle('<:no:770286379543822346> Un problème est apparu')
              .setColor('#800000')
              .setDescription(`Cet utilisateur n'est pas un bot. Veuillez entrer la commande comme dit ci-après : \`bl!bot info <bot_id>\``)
              .setFooter('<> - Obligatoire | [] - Optionnel | Ne pas mettre <> et []')
          )
        }
        let owner = db.get(`userBots.${b.id}.ownerID`)
        owner = client.users.cache.get(message.guild.owner);
        message.channel.send(
          new Discord.MessageEmbed()
            .setAuthor(b.tag, b.displayAvatarURL())
            .setColor("#2f3136")
            .setDescription(`Voici les informations concernant le bot \`${b.tag}\`\n\n> ・**Vérifié**: ${userBots[b.id].isVerified}\n> ・**Date d'ajout**: ${moment(userBots[b.id].added).startOf('minutes').fromNow()}\n> ・**Créateur**: ${owner} \n> ・**Invitation**: [clique](https://discord.com/oauth2/authorize?client_id=${b.id}&permissions=8&scope=bot)`)
            .setFooter(`Informations sur le bot ${b.tag}`)
        )
      }).catch(err => {
        console.log(err)
        return message.channel.send(
          new Discord.MessageEmbed()
              .setTitle('<:no:770286379543822346> Un problème est apparu')
              .setColor('#800000')
              .setDescription(`Aucun bot bot n'existe avec cet identifiant dans nôtre liste. Veuillez vérifier que vous l'avez ajouté, puis ré-essayer.`)
              .setFooter('Bot inconnu')
        )
      })
    }
  }else if(args[0] === 'like'){
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("Il y a un cooldown de 12 heures pour cette commande.");
} else {
  const likes = JSON.parse(fs.readFileSync("./likes.json", "utf8"))

  client.users.fetch(args[1]).then(b => {
    if(!b.bot){
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle('<:no:770286379543822346> Un problème est apparu')
          .setColor('#800000')
          .setDescription(`Cet utilisateur n'est pas un bot. Veuillez entrer la commande comme dit ci-après : \`bl!bot info <bot_id>\``)
          .setFooter('<> - Obligatoire | [] - Optionnel | Ne pas mettre <> et []')
      )
    }
    let bot = db.get(`userBots.${b.id}`)
    message.channel.send(
      new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle('<:verified:770286371990405161> Bot liké !')
      .setDescription('Merci de votre avis ! ')
      .setTimestamp()
    )
    let likesch = client.channels.cache.get('805390890389602304')
    likesch.send(
      b.id,
      new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle(`❤️ Nouveau like de ${b.tag}`)
      .setDescription(`**Likes:** ${likes[b.id].likes}
      **Utilisateur:** ${message.author.tag}`)
      .setImage(b.displayAvatarURL())
    )
    if (!likes[b.id]) likes[b.id] = {
      likes: 0,
  }
  likes[b.id].likes++
  
  fs.writeFile('./likes.json', JSON.stringify(likes), (err) =>{
      if(err) console.log(err)
  })
})
  // Adds the user to the set so that they can't talk for a minute
  talkedRecently.add(message.author.id);
  setTimeout(() => {
    // Removes the user from the set after a minute
    talkedRecently.delete(msg.author.id);
  }, 43200000);
}



  }else if (args[0] === 'likes'){
  const likes = JSON.parse(fs.readFileSync("./likes.json", "utf8"))
  client.users.fetch(args[1]).then(b => {
    if(!b.bot){
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle('<:no:770286379543822346> Un problème est apparu')
          .setColor('#800000')
          .setDescription(`Cet utilisateur n'est pas un bot. Veuillez entrer la commande comme dit ci-après : \`bl!bot info <bot_id>\``)
          .setFooter('<> - Obligatoire | [] - Optionnel | Ne pas mettre <> et []')
      )
    }
  let bot = db.get(`userBots.${b.id}`)

  if(!likes[b.id]) likes[b.id] = {
    likes: 0,
  };

  const wembed = new Discord.MessageEmbed()
  .setColor("RED")
  .setTitle(`♥️ Likes de ${b.tag}`)
  .addField('Nombre de likes :', likes[`${b.id}`].likes)
  message.channel.send(wembed);
})
}
else if (args[0] === 'resetlikes'){
  const own = message.guild.roles.cache.get('770283401794027580')
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('Tu n\'as pas la premission de faire cette commande')
    
  fs.writeFileSync('./likes.json', JSON.stringify('{}'), (err) =>{
      if(err) console.log(err)
  })
  message.channel.send(
    new Discord.MessageEmbed()
    .setColor('GREEN')
    .setTitle('<:verified:770286371990405161> Succès')
    .setDescription(`Tous les likes de tous les bots ont été clear !`)
  )

}
}

module.exports.help = {
  name: 'bot'
}