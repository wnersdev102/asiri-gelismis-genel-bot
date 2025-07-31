const { SlashCommandBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('karaliste-kontrol')
    .setDescription('Bir kullanıcının karalistede olup olmadığını kontrol eder')
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Karaliste durumu kontrol edilecek kullanıcı')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const karaMi = db.get(`karaliste_${user.id}`);

    if (karaMi) {
      return interaction.reply({
        content: `⛔ <@${user.id}> karalistede.`,
        ephemeral: false
      });
    } else {
      return interaction.reply({
        content: `✅ <@${user.id}> karalistede **değil**.`,
        ephemeral: false
      });
    }
  }
};
