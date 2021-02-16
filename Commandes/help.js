const Discord = require('discord.js');
const db = require('quick.db');
const moment = require('moment');
const { Menu } = require('discord.js-menu')

const { MessageEmbed } = require('discord.js');
module.exports.run = async (client, message, args) => {
  const embed = await message.channel.send(
          new Discord.MessageEmbed()
              .setTitle('__❓ Help__')
              .setColor('GREEN')
              .setDescription(`**__ prefixe __ : bl! ** \n > \`\`bot\`\` ❱ ajouter ou enlever un bot (🤖)\n> \`\`queue\`\` ❱voir la file d'attente de verification des bots(📋)\n> \`\`manage\`\` ❱ permet de modifier les informations d'un bot (📚) \n> \`\`like\`\` ❱ like un bot dans la liste (❤️)\n> \`\`xp\`\` ❱ commandes d'xp (🔰) \n\n Réagit à la reaction correspondante à chaque commande pour plus d'infos`)
              .setFooter('BotLister | help')
  )
  await embed.react('🤖')
  await embed.react('📋')
  await embed.react('📚')
  await embed.react('❤️')
  await embed.react('🔰')


  const filter = (reaction, user) => {
    return ['➕', '📋', '📚', '❤️', '🔰'].includes(reaction.emoji.name) && user.id === message.author.id;
};

let bool = false;
let prefix = 'bl!'
client.on('messageReactionAdd', (reaction, user) => {
  if (reaction.emoji.name === '🤖' || reaction.emoji.name === '📋' || reaction.emoji.name === '📚' || reaction.emoji.name === '❤️' || reaction.emoji.name === '🔰'&& user.id === message.author.id && user.id != client.user.id) {

      if(bool == true){
          return;
      }
      switch(reaction.emoji.name){
          case '🤖':
              if(bool === true) return;
              bool = true;
                  embed.edit(
                      new Discord.MessageEmbed()
                          .setTitle('\_\_Help bot\_\_')
                          .setColor('RANDOM')
                          .setDescription(`**Voici le menu aide de la commande bot: **\n\n> \`\`add\`\` ❱ ajoute un bot à la liste __bl!bot add <bot_id> <prefixe>__.\n> \`remove\` ❱ Enlève un bot de la liste pour annuler votre test et revenir une prochaine fois ! __bl!bot remove <bot_id>__ \n> \`\`info\`\` ❱ Regarde les infos d'un bot dans la liste __bl!bot info <bot_id>__.`)
                  )
              
          case '📋':
              if(bool === true) return;
              bool = true;
                  embed.edit(
                      new Discord.MessageEmbed()
                                  .setTitle('\_\_Help queue\_\_')
                                  .setColor('RANDOM')
                                  .setDescription(`**Voici le menu d'aide de la commande queue : ** \n\n> \`\` bl!queue \`\` ❱ Affiche la queue d'attente de verification `)
                      )

              case '📚':
                  if(bool === true) return;
                  bool = true;
                      embed.edit(
                          new Discord.MessageEmbed()
                                      .setTitle('\_\_Help manage\_\_')
                                      .setColor('GREEN')
                                      .setDescription(`** Voci le menu d'aide de la commande manage: ** \n \n> \`\` bl!manage \`\` ❱ Modifier / accepter / refuser /verifier un bot dans la liste __bl!manage <bot_id>__ \n\n **🚨 = BESOIN DES PERMISSIONS VERIFICATEUR POUR CETTE COMMANDE.**`)
                          )
                          case '🔰':
              if(bool === true) return;
              bool = true;
                  embed.edit(
                      new Discord.MessageEmbed()
                                  .setTitle('\_\_Help xp\_\_')
                                  .setColor('RANDOM')
                                  .setDescription(`**Voici le menu d'aide des commandes d'xp : ** \n\n> \`\` bl!xp profil \`\` ❱ Affiche ton niveau d'xp \n> \`\` bl!xp leaderboard \`\` ❱ Affiche le leaderboard des gens aillant le plus d'xp \n> \`\` bl!xp delete \`\` ❱ Remet un utilisateur a 0 \n> \`\` bl!xp setxp \`\` ❱ Met un utilisateur a un nombre d'xp precis __bl!xp setxp <mention> <nb d'xp>__ \n> \`\` bl!xp setlevel \`\`  ❱ Met un utilisateur a un niveau precis __bl!xp setlevel <mention> <level>__`)
                      )
                      case '❤️':
              if(bool === true) return;
              bool = true;
                  embed.edit(
                      new Discord.MessageEmbed()
                                  .setTitle('\_\_Help like\_\_')
                                  .setColor('RANDOM')
                                  .setDescription(`**Voici le menu d'aide des commandes like : ** \n\n> \`\` bl!bot like \`\` ❱ Permet de liker un bot __bl!bot like <bot_id> __ \n> \`\` bl!bot likes \`\` ❱ Affiche le nombre de likes d'un bot dans la liste __bl!bot likes <bot_id>__ \n> \`\` bl!bot resetlikes \`\` ❱ Supprime tous les likes de tous les bots`)
                      )

            }}})
          }
        
        module.exports.help = {
          name: 'help'
        }