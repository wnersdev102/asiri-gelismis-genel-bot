const { SlashCommandBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seviyem')
    .setDescription('Kendi seviyeni veya etiketlediğin kişinin seviyesini gösterir.')
    .addUserOption(opt => opt.setName('kullanıcı').setDescription('Kimin seviyesine bakacaksın?')),

  async execute(interaction) {
    const target = interaction.options.getUser('kullanıcı') || interaction.user;
    const guildId = interaction.guild.id;
    const userId = target.id;

    const xp = db.get(`xp_${guildId}_${userId}`) || 0;
    const level = db.get(`level_${guildId}_${userId}`) || 1;
    const nextLevelXp = level * 100;

    await interaction.reply(`📊 ${target} kişisinin seviyesi:
✨ Seviye: \`${level}\`
🔹 XP: \`${xp} / ${nextLevelXp}\``);
  }
};
