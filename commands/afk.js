const { SlashCommandBuilder } = require('discord.js');
const db = require('croxydb');
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Kendinizi afk olarak işaretler.')
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('afk olma sebebinizi belirtin')
        .setRequired(false)),
  async execute(interaction) {
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi.';
    const userId = interaction.user.id;
    db.set(`afk_${userId}`, { reason, timestamp: Date.now() });

    await interaction.reply({
      content: `Başarıyla AFK oldunuz! Sebep: ${reason}`,
      ephemeral: true
    });
  },
};
