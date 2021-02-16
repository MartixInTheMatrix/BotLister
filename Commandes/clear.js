const Discord = require('discord.js');
const db = require('quick.db');
const moment = require('moment');

module.exports.run = async (client, message, args) => {
    const amount = args.join(' '); // Amount of messages which should be deleted
    if (!amount) return msg.reply('You haven\'t given an amount of messages which should be deleted!'); // Checks if the `amount` parameter is given
    if (isNaN(amount)) return msg.reply('The amount parameter isn`t a number!'); // Checks if the `amount` parameter is a number. If not, the command throws an error
    if (amount > 100) return msg.reply('You can`t delete more than 100 messages at once!'); // Checks if the `amount` integer is bigger than 100
    if (amount < 1) return msg.reply('You have to delete at least 1 message!'); // Checks if the `amount` integer is smaller than 1
    await message.channel.messages.fetch({ limit: amount }).then(messages => { // Fetches the messages
        message.channel.bulkDelete(messages 
    ).catch(err => {
        message.channel.send('tu ne peux que supprimer des messages récents d\'au moins 14 jours')
    })
})

    let msgnext = await message.channel.send(`J'ai supprimé ${amount} messages`)

    setTimeout(() => {
     msgnext.delete()
    }, 5000 );
}
module.exports.help = {
    name: 'clear'
  }