const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('oto-tag-sıfırla')
    .setDescription('Sunucuya gelen üyelere verilen otomatik tagı sıfırlar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const guildId = interaction.guild.id;

    const kontrol = croxydb.get(`otoTag_${guildId}`);
    if (!kontrol) {
      return interaction.reply({
        content: '🚫 Oto-tag sistemi zaten ayarlı değil.',
        ephemeral: true
      });
    }

    croxydb.delete(`otoTag_${guildId}`);

    return interaction.reply({
      content: '✅ Oto-tag başarıyla sıfırlandı. Artık yeni gelen üyelere otomatik tag verilmeyecek.',
      ephemeral: false
    });
  }
};
