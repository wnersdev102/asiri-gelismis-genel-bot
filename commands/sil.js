const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sil')
    .setDescription('Belirtilen sayıda mesajı siler.')
    .addIntegerOption(option => 
      option.setName('mesaj_sayisi')
        .setDescription('Silinecek mesaj sayısını belirtin.')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)),
  async execute(interaction) {
    const mesajSayisi = interaction.options.getInteger('mesaj_sayisi');

    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply({
        content: '❌ Bu komutu kullanabilmek için "Mesajları Yönet" iznine sahip olmanız gerekmektedir.',
        ephemeral: true,
      });
    }

    try {
      await interaction.channel.bulkDelete(mesajSayisi, true);
      return interaction.reply({
        content: `✅ Başarıyla ${mesajSayisi} mesaj silindi!`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Mesajları silerken hata oluştu:', error);
      return interaction.reply({
        content: '⚠️ Mesajları silerken bir hata oluştu!',
        ephemeral: true,
      });
    }
  },
};
