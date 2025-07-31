const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bom-kanal-sıfırla')
    .setDescription('Bom oyununu belirtilen kanalda sıfırlar.')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Sıfırlanacak bom oyunu kanalı')
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');
    const { activeGames } = require('../events/messageCreate.js');

    if (!activeGames.has(channel.id)) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Hata')
        .setDescription(`${channel} kanalında aktif bir bom oyunu bulunmamaktadır.`)
        .setColor('Red');

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    activeGames.delete(channel.id);

    const embed = new EmbedBuilder()
      .setTitle('✅ Başarılı')
      .setDescription(`${channel} kanalındaki bom oyunu başarıyla sıfırlandı.`)
      .setColor('Green');

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
