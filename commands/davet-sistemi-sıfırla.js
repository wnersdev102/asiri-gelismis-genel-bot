const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('davet-sistemi-sıfırla')
    .setDescription('Davet sistemi log kanal ayarını sıfırlar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({ content: '🚫 Bu komutu kullanmak için **Sunucuyu Yönet** yetkisine sahip olmalısın!', ephemeral: true });
    }

    const mevcut = croxydb.get(`davetLog_${interaction.guild.id}`);
    if (!mevcut) {
      return interaction.reply({ content: '⚠️ Davet sistemi log kanalı zaten ayarlı değil.', ephemeral: true });
    }

    croxydb.delete(`davetLog_${interaction.guild.id}`);

    await interaction.reply({ content: '✅ Davet sistemi log kanalı ayarı başarıyla sıfırlandı.', ephemeral: false });
  }
};
