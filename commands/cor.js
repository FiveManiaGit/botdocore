function getLetters() { return ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]; }
exports.aliases = ["cor", "color", "cores"];
exports.description = "Te dá uma cor para enfeitar o seu nome.";
exports.run = (Discord, bot, message, args) => {
    var guildMember = message.guild.members.get(message.author.id);
    if (message.channel.type == "dm") return;
    var rolesCollection = message.guild.roles.filter(role => role.name.split(" ")[0] == "Cor" && !role.name.includes("(Ex)")).array();
    var letters = getLetters();
    var embedToSend = new Discord.MessageEmbed()
        .setTitle("Escreva no chat a letra da cor que deseja para si mesmo.")
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setDescription("Para remover uma cor de si mesmo, apenas escreva a letra correspondente. Ela será removida automaticamente." + (guildMember.roles.has(bot.config.sponsorsRole) ? "\n\nPara ver as cores exclusivas de patrocinador, use `g.pcor`." : ""));
    for (var i = 0; i < rolesCollection.length; i++) {
        embedToSend.addField(":regional_indicator_" + letters.shift() + (guildMember.roles.some(role => role.id == rolesCollection[i].id) ? ": __" : ": ") + rolesCollection[i].name.split(" ").slice(1).join(" ") + (guildMember.roles.some(role => role.id == rolesCollection[i].id) ? "__" : ""), "_ _", true);
    }
    message.channel.send(embedToSend).then(botMessage => {
        let filter = m => m.author.id == message.author.id;
        message.channel.awaitMessages(filter, { time: 15000, max: 1, errors: ["time"] })
            .then(collected => {
                var messageCollected = collected.first().content;
                if (messageCollected.length > 1) {
                    message.channel.send(bot.utils.mention(message.author.id) + "Escreva apenas uma letra. Utilize o comando denovo pra tentar novamente.");
                    botMessage.delete();
                } else if (!getLetters().some(a => a == messageCollected.toLowerCase()) || getLetters().findIndex(a => a == messageCollected.toLowerCase()) > rolesCollection.length) {
                    message.channel.send(bot.utils.mention(message.author.id) + "Escreva uma das letras apresentadas. Utilize o comando denovo pra tentar novamente.");
                    botMessage.delete();
                } else {
                    if (guildMember.roles.has(rolesCollection[getLetters().findIndex(a => a == messageCollected.toLowerCase())].id)) { guildMember.roles.remove(rolesCollection[getLetters().findIndex(a => a == messageCollected.toLowerCase())]); } else { guildMember.roles.add(rolesCollection[getLetters().findIndex(a => a == messageCollected.toLowerCase())]) }
                    message.channel.send(bot.utils.mention(message.author.id) + "Cor **" + rolesCollection[getLetters().findIndex(a => a == messageCollected.toLowerCase())].name.toLowerCase().split(" ").slice(1).join(" ") + "** " + (guildMember.roles.some(role => role.id == rolesCollection[getLetters().findIndex(a => a == messageCollected.toLowerCase())].id) ? "removida" : "adicionada") + ".");
                    botMessage.delete();
                }
            })
            .catch(e => {
                message.channel.send(bot.utils.mention(message.author.id) + "Tempo esgotado. Utilize o comando denovo pra tentar novamente.");
                botMessage.delete();
            });
    });
};