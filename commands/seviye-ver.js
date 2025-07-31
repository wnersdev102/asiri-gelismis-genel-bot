const { SlashCommandBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seviye-ver')
    .setDescription('Belirli bir kullanıcıya XP ver.')
    .addUserOption(opt => opt.setName('kullanıcı').setDescription('Kime XP vereceksin?').setRequired(true))
    .addIntegerOption(opt => opt.setName('xp').setDescription('Ne kadar XP vereceksin?').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const amount = interaction.options.getInteger('xp');
    const guildId = interaction.guild.id;

    let xp = db.get(`xp_${guildId}_${user.id}`) || 0;
    let level = db.get(`level_${guildId}_${user.id}`) || 1;

    xp += amount;
    while (xp >= level * 100) {
      xp -= level * 100;
      level++;
    }

    db.set(`xp_${guildId}_${user.id}`, xp);
    db.set(`level_${guildId}_${user.id}`, level);

    await interaction.reply(`✅ ${user} kullanıcısına \`${amount}\` XP verildi. Şimdi seviye: ${level}`);
  }
};
