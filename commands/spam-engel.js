const { SlashCommandBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spam-engel')
    .setDescription('Spam engelleme sistemini açıp kapatmanızı sağlar.')
    .addStringOption(option => 
      option.setName('durum')
        .setDescription('Spam engelleme durumunu ayarlayın.')
        .setRequired(true)
        .addChoices(
          { name: 'Açık', value: 'açık' },
          { name: 'Kapalı', value: 'kapalı' }
        )
    ),
  async execute(interaction) {
    const durum = interaction.options.getString('durum');

    if (!interaction.member.permissions.has('MANAGE_GUILD')) {
      return interaction.reply({
        content: 'Bu komutu kullanabilmek için `Sunucu Yönetici` yetkisine sahip olmalısınız.',
        ephemeral: true
      });
    }

    if (durum === 'açık') {
      db.set(`spamEngel_${interaction.guild.id}`, true);
      return interaction.reply({
        content: 'Spam engelleme sistemi **açıldı**!',
        ephemeral: true
      });
    }

    if (durum === 'kapalı') {
      db.set(`spamEngel_${interaction.guild.id}`, false);
      return interaction.reply({
        content: 'Spam engelleme sistemi **kapandı**!',
        ephemeral: true
      });
    }

    return interaction.reply({
      content: 'Lütfen geçerli bir durum girin: `açık` veya `kapalı`.',
      ephemeral: true
    });
  }
};
