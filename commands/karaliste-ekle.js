const { SlashCommandBuilder } = require('discord.js');
const db = require('croxydb');
const config = require('../ayarlar.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('karaliste-ekle')
    .setDescription('Bir kullanıcıyı karalisteye ekler (sadece bot sahibine özel)')
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Karalisteye eklenecek kullanıcı')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.user.id !== config.sahipId) {
      return interaction.reply({ content: '❌ Bu komutu sadece bot sahibi kullanabilir!', ephemeral: true });
    }

    const user = interaction.options.getUser('kullanıcı');

    db.set(`karaliste_${user.id}`, true);

    await interaction.reply({
      content: `✅ <@${user.id}> başarıyla karalisteye eklendi.`,
      ephemeral: true
    });
  }
};
