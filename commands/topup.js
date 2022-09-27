const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
    name: "setup",
    description: "setup",
    run: async (client, interaction) => {
      const Embed = new Discord.EmbedBuilder()
      .setColor('Blue')
      .setTitle('🧧 เติมเงินด้วยซองอังเปา TrueWallet')
      .setImage('https://www.checkraka.com/uploaded/img/content/130026/aungpao_truewallet_01.jpg')
  const row = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
              .setCustomId('เติมเงิน')
              .setLabel('เติมเงิน')
              .setEmoji('🧧')
              .setStyle(Discord.ButtonStyle.Success)
        )
        .addComponents(
          new Discord.ButtonBuilder()
              .setCustomId('ช่วยเหลือ')
              .setLabel('ดูสินค้าทั้งหมด')
              .setEmoji('🛒')
              .setStyle(Discord.ButtonStyle.Primary)
        );
  await interaction.channel.send({ embeds: [Embed], components: [row]})
    },
};