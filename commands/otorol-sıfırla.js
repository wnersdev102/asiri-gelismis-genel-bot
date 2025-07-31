const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('otorol-sıfırla')
    .setDescription('Sunucudaki otorol ayarlarını sıfırlar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const otorolData = croxydb.get(`otorol.${guildId}`);
    if (!otorolData) {
      return interaction.reply({
        content: '❌ Otorol ayarları zaten sıfırlanmış.',
        ephemeral: true,
      });
    }

    croxydb.delete(`otorol.${guildId}`);

    const embed = new EmbedBuilder()
      .setTitle('Otorol Ayarları Başarıyla Sıfırlandı')
      .setDescription('Otorol ayarları başarıyla sıfırlandı. Artık yeni üye katıldığında otomatik rol verilmeyecek.')
      .setColor(0xFF0000)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
