const { SlashCommandBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('caps-engel')
    .setDescription('Sunucuda büyük harf kullanımı engelini açıp kapatır.')
    .addStringOption(option =>
      option.setName('durum')
        .setDescription('Büyük harf kullanımı engeli durumu')
        .setRequired(true)
        .addChoices(
          { name: 'Açık', value: 'açık' },
          { name: 'Kapalı', value: 'kapalı' }
        )
    ),

  async execute(interaction) {
    const durum = interaction.options.getString('durum');

    if (durum === 'açık') {
      croxydb.set(`capsEngel_${interaction.guild.id}`, true);
      return interaction.reply({ content: 'Büyük harf kullanımı engeli **açıldı**.', ephemeral: true }); // embeed olmasın
    } else {
      croxydb.set(`capsEngel_${interaction.guild.id}`, false);
      return interaction.reply({ content: 'Büyük harf kullanımı engeli **kapandı**.', ephemeral: true });
    }
  },
};