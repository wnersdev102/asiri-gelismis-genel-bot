const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giriş-çıkış-sıfırla')
    .setDescription('Giriş ve çıkış kanallarını sıfırlayarak eski ayarları kaldırır.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    const girisCikisData = croxydb.get(`girisCikis.${interaction.guild.id}`);

    if (!girisCikisData) {
      return interaction.reply({ content: '❌ Giriş ve çıkış kanalları zaten ayarlanmamış.', ephemeral: true });
    }

    croxydb.delete(`girisCikis.${interaction.guild.id}`);

    // Başarı mesajı
    const embed = new EmbedBuilder()
      .setTitle('Giriş/Çıkış Kanalları Sıfırlandı')
      .setDescription('Giriş ve çıkış kanalları başarıyla sıfırlandı. Artık eski ayarlar geçerli değildir.')
      .setColor(0xFF0000)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
