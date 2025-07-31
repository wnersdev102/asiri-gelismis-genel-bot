const { SlashCommandBuilder } = require('discord.js');
const db = require('croxydb');
const config = require('../ayarlar.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('karaliste-cıkar')
    .setDescription('Bir kullanıcıyı karalisteden çıkarır (sadece bot sahibine özel)')
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Karalisteden çıkarılacak kullanıcı')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.user.id !== config.sahipId) {
      return interaction.reply({ content: '❌ Bu komutu sadece bot sahibi kullanabilir!', ephemeral: true });
    }

    const user = interaction.options.getUser('kullanıcı');
    const karalistedeMi = db.get(`karaliste_${user.id}`);

    if (!karalistedeMi) {
      return interaction.reply({
        content: `⚠️ <@${user.id}> karalistede değil.`,
        ephemeral: true
      });
    }

    db.delete(`karaliste_${user.id}`);

    await interaction.reply({
      content: `✅ <@${user.id}> başarıyla karalisteden çıkarıldı.`,
      ephemeral: true
    });
  }
};
