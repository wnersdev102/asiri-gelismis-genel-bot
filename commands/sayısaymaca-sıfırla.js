const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sayısaymaca-sıfırla')
    .setDescription('Sayısaymaca kanal ayarını sıfırlar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const key = `sayisaymacaKanal_${guildId}`;

    if (!db.has(key)) {
      return interaction.reply({ content: 'Sayısaymaca kanalı zaten ayarlı değil.', ephemeral: true });
    }

    db.delete(key);
    return interaction.reply({ content: 'Sayısaymaca kanalı başarıyla sıfırlandı.', ephemeral: true });
  }
};
