const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { activeGiveaways } = require('../utils/giveawayManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('çekiliş-iptal')
    .setDescription('Aktif çekilişi iptal eder.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const active = activeGiveaways.get(guildId);
    if (!active) {
      return interaction.reply({ content: '❌ Bu sunucuda aktif bir çekiliş yok.', ephemeral: true });
    }
    active.collector.stop('İptal edildi');
    activeGiveaways.delete(guildId);
    await interaction.reply('✅ Aktif çekiliş iptal edildi.');
  }
};
