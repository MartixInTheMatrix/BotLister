const Discord = require('discord.js');
const db = require('quick.db');
const moment = require('moment');



module.exports.run = async (client, message, args) => {

  let userBots = db.get(`userBots`);

  let hasRole = message.member.roles.cache.find(r => r.id === '770284620989202443 ' || '770966440525824021')
  if(!hasRole){
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTitle('<:no:770286379543822346> Un problème est apparu')
        .setColor('#800000')
        .setDescription(`Vous n'ètes pas un vérificateur, vous ne pouvez pas faire cette commande.`)
        .setFooter('Erreur: Missing permissions')
    )
  }

  if(!args[0]){
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTitle('<:no:770286379543822346> Un problème est apparu')
        .setColor('#800000')
        .setDescription(`Vous n'avez pas entrer l'identifiant du bot que vous souhaitez gérer.`)
        .setFooter('Erreur: Args missing')
    )
  }

  if(args[0]){
    client.users.fetch(args[0]).then(async (b) => {
      let bot = db.get(`userBots.${b.id}`);
      if(!bot){
        return message.channel.send(
          new Discord.MessageEmbed()
            .setTitle('<:no:770286379543822346> Un problème est apparu')
            .setColor('#800000')
            .setDescription(`Ce bot n'est pas dans la liste.`)
            .setFooter('Error: Unlisted bot')
        )
      }
      if(!b.bot){
        return message.channel.send(
          new Discord.MessageEmbed()
            .setTitle('<:no:770286379543822346> Un problème est apparu')
            .setColor('#800000')
            .setDescription(`Cet utilisateur n'est pas un bot.`)
            .setFooter('Erreur: User is not a bot')
        )
      }
      if(bot.isVerified){
        return message.channel.send(
          new Discord.MessageEmbed()
            .setTitle('<:no:770286379543822346> Un problème est apparu')
            .setColor('#800000')
            .setDescription(`Ce bot à déjà été validé.`)
            .setFooter('Erreur: Bot allready verified')
        )
      }
      let embed = await message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor("Manage " + b.tag, b.displayAvatarURL())
          .setColor("#2f3136")
          .setDescription(`Veuillez cocher les réactions en fonction du code ci-dessous :\n\n> <:verified:770286371990405161> - Valider le bot\n> <:no:770286379543822346> - Refuser le bot\n> <a:loading:770286388599717899> - Commencer la verification`)
          .addField(`Créateur`, '<@' + db.get(`userBots.${b.id}.ownerID`) + '>', true)
          .addField(`Ajouté`, moment(userBots[b.id].added).startOf('minutes').fromNow(), true)
      )

      let emoji_yes = client.emojis.cache.get('770286371990405161')
      let emoji_no = client.emojis.cache.get('770286379543822346')
      let emoji_loading = client.emojis.cache.get('770286388599717899')

      await embed.react(emoji_yes)
      await embed.react(emoji_no)
      await embed.react(emoji_loading)

      const filter = (reaction, user) => {
	      return [emoji_yes.name, emoji_no.name, emoji_loading.name].includes(reaction.emoji.name) && user.id === message.author.id;
      };

      embed.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] }).then(async (collected) => {
        const reaction = collected.first();

        embed.reactions.removeAll().catch(err => { console.log('Une erreur est apparue lors de la suppression des emojis')})
        if (reaction.emoji.name === emoji_yes.name) {
          embed.edit(
            new Discord.MessageEmbed()
              .setTitle('<:verified:770286371990405161> Succès')
              .setColor('DARK_GREEN')
              .setDescription(`Vous avez validé le bot \`${b.tag}\`.`)
              .setFooter('Succès: Bot validated')
          )

          db.set(`userBots.${b.id}.isVerified`, true)
          let botOwner = client.users.cache.get(db.get(`userBots.${b.id}.ownerID`))
          let serv = client.guilds.cache.get('770283222780215347')
          serv.channels.cache.get('770963772658548748').send(`<:verified:770286371990405161> Le bot \`${b.tag}\` de ${botOwner} vient d'êtré validé par ${message.author}.`)
          botOwner.send(
            new Discord.MessageEmbed()
            .setTitle('<:verified:770286371990405161> Bot accepté')
            .setColor('DARK_GREEN')
            .setDescription(`Vôtre bot à été validé.\n\n> **Vérificateur:** \`${message.author.tag}\``)
            .setFooter('Succès: Bot validated')
          ).catch(err => {
            console.log(`L'utilisateur ${botOwner.tag} à bloqué ses mp.`)
          })

        } else if(reaction.emoji.name === emoji_no.name){
          embed.edit(
            new Discord.MessageEmbed()
              .setAuthor("Manage " + b.tag, b.displayAvatarURL())
              .setColor("#2f3136")
              .setDescription(`Veuillez entrer la raison du refus du bot.`)
              .setFooter('Waiting for a reason...')
          )
          let error = false;
          let reason;
          await message.channel.awaitMessages(m => m.author.id === message.author.id, {
              max: 1,
              time: 240000,
              errors: ["time"]
          }).then(collected => {
              reason = collected.first().content;
              collected.first().delete();
          }).catch((err) => {
              error = true;
              mainMsg.edit(
                  new Discord.MessageEmbed()
                  .setTitle('ERREUR')
                  .setColor('#800000')
                  .setDescription("Vous n'avez pas entrer de raison. Annulation !")
                  .setTimestamp()
              );
              return;
          });
          if(error) return;
          embed.edit(
            new Discord.MessageEmbed()
              .setTitle('<:verified:770286371990405161> Succès')
              .setColor('DARK_GREEN')
              .setDescription(`Vous avez refusé le bot \`${b.tag}\` pour la raison ${reason}.`)
              .setFooter('Succès: Bot refused')
          )
          let botOwner = client.users.cache.get(db.get(`userBots.${b.id}.ownerID`))
          let serv = client.guilds.cache.get('770283222780215347')
          serv.channels.cache.get('770963772658548748').send(`<:no:770286379543822346> Le bot \`${b.tag}\` de ${botOwner} vient d'êtré refusé par ${message.author}.`)
          db.delete(`userBots.${b.id}`)
          botOwner.send(
            new Discord.MessageEmbed()
              .setTitle('<:no:770286379543822346> Bot refusé')
              .setColor('#800000')
              .setDescription(`Vôtre bot à été refusé.\n\n> **Raison:** ${reason}\n> **Vérificateur:** \`${message.author.tag}\``)
              .setFooter('Error: Bot refused')
          ).catch(err => {
            console.log(`L'utilisateur ${botOwner.tag} à bloqué ses mp.`)
          })
        } else if(reaction.emoji.name === emoji_loading.name){
          let botOwner = client.users.cache.get(db.get(`userBots.${b.id}.ownerID`))
          embed.edit(
            new Discord.MessageEmbed()
              .setTitle('<a:loading:770286388599717899> Succès')
              .setColor('DARK_GREEN')
              .setDescription(`Vous avez commencé la vérification du bot \`${b.tag}\` de ${botOwner}. Invite : [Clique](https://discord.com/oauth2/authorize?client_id=${b.id}&permissions=8&scope=bot)`)
              .setFooter('Succès: Verification started')
          )
          botOwner.send(
            new Discord.MessageEmbed()
              .setTitle('<a:loading:770286388599717899> Verification')
              .setColor("#2f3136")
              .setDescription(`La vérification de vôtre bot à commencée.\n\n> **Bot:** \`${b.tag}\`\n> **Vérificateur:** \`${message.author.tag}\` \n> **Invite :** [Clique](https://discord.com/oauth2/authorize?client_id=${b.id}&permissions=8&scope=bot)`)
              .setFooter('Succès: Verification started')
          ).catch(err => {
            console.log(`L'utilisateur ${botOwner.tag} à bloqué ses mp.`)
          })
          let serv = client.guilds.cache.get('770283222780215347')
          serv.channels.cache.get('770963772658548748').send(`<a:loading:770286388599717899> La vérification du bot \`${b.tag}\` de ${botOwner} vient de commencer. Vérificateur: ${message.author}.`)
        }
      })
    })
  }
}

module.exports.help = {
  name: 'manage'
}