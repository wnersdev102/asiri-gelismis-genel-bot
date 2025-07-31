const { SlashCommandBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seviye-sistemi-sıfırla')
    .setDescription('Seviye sistemini sıfırlar.'),

  async execute(interaction) {
    const guildId = interaction.guild.id;

    db.deleteAll().filter(key => key.includes(guildId)).forEach(key => db.delete(key));
    await interaction.reply('❌ Seviye sistemi tamamen sıfırlandı.');
  }
};
