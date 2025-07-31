const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mod-log-sıfırla')
    .setDescription('Mod log kanal ayarını sıfırlar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const modLog = croxydb.get(`modLog_${interaction.guild.id}`);

    if (!modLog) {
      return interaction.reply({ content: '❌ Mod log kanalı zaten ayarlı değil.', ephemeral: true });
    }

    croxydb.delete(`modLog_${interaction.guild.id}`);

    const embed = new EmbedBuilder()
      .setTitle('✅ Mod Log Kanal Ayarı Sıfırlandı')
      .setDescription('Mod log kanalı başarıyla sıfırlandı.')
      .setColor('#FF0000')
      .setTimestamp()
      .setFooter({ text: `Mod-Log Sistemi | ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
