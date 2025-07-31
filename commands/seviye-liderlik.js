const { SlashCommandBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seviye-liderlik')
    .setDescription('Sunucudaki en yüksek seviyedeki kişileri listeler.'),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const data = db.all().filter(x => x.ID.startsWith(`level_${guildId}_`));

    if (data.length === 0) return interaction.reply('📉 Henüz kimse XP kazanmadı.');

    const sıralı = data.sort((a, b) => b.data - a.data).slice(0, 10);
    const liste = sıralı.map((x, i) => {
      const userId = x.ID.split('_')[2];
      const level = x.data;
      const xp = db.get(`xp_${guildId}_${userId}`) || 0;
      return `\`${i + 1}.\` <@${userId}> - Seviye: \`${level}\` | XP: \`${xp}\``;
    });

    await interaction.reply({ content: `🏆 **Liderlik Tablosu:**\n${liste.join('\n')}` });
  }
};
