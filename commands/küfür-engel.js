const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('küfür-engel')
    .setDescription('Sunucuda küfür engel sistemini açar veya kapatır.')
    .addStringOption(option =>
      option
        .setName('durum')
        .setDescription('Küfür engel sistemini aç veya kapat')
        .setRequired(true)
        .addChoices(
          { name: 'Açık', value: 'açık' },
          { name: 'Kapalı', value: 'kapalı' }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    const durum = interaction.options.getString('durum');
    const guildId = interaction.guild.id;

    if (durum === 'açık') {
      db.set(`kufurEngel_${guildId}`, true);
      const embed = new EmbedBuilder()
        .setTitle('Küfür Engel Sistemi Aktif!')
        .setDescription('Sunucuda artık küfür içerikleri otomatik olarak engellenecek.')
        .setColor(0x57F287);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (durum === 'kapalı') {
      db.delete(`kufurEngel_${guildId}`);
      const embed = new EmbedBuilder()
        .setTitle('Küfür Engel Sistemi Devre Dışı!')
        .setDescription('Sunucuda artık küfür içerikleri engellenmeyecek.')
        .setColor(0xED4245);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
