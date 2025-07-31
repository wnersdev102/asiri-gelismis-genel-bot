const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('davetlerim')
    .setDescription('Kendi davetlerinizi sayfalı şekilde gösterir'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const invites = croxydb.get(`davetler_${guildId}_${userId}`) || [];

    if (invites.length === 0) {
      return interaction.reply({ content: '❌ Henüz davetin yok.', ephemeral: true });
    }

    const itemsPerPage = 5;
    let page = 0;
    const totalPages = Math.ceil(invites.length / itemsPerPage);

    const generateEmbed = (page) => {
      const current = invites.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

      return new EmbedBuilder()
        .setTitle(`${interaction.user.username} - Davetlerin (${page + 1}/${totalPages})`)
        .setColor('#0099ff')
        .setDescription(current.map((inv, i) => `\`${page * itemsPerPage + i + 1}.\` Davet Kodu: \`${inv.code}\`, Kullanım: \`${inv.uses}\``).join('\n'));
    };

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('geri')
          .setLabel('◀️ Geri')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === 0),
        new ButtonBuilder()
          .setCustomId('ileri')
          .setLabel('İleri ▶️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === totalPages - 1)
      );

    await interaction.reply({ embeds: [generateEmbed(page)], components: [row], ephemeral: true });

    const filter = i => i.user.id === userId && ['geri', 'ileri'].includes(i.customId);
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      if (i.customId === 'geri' && page > 0) page--;
      else if (i.customId === 'ileri' && page < totalPages - 1) page++;

      const newRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('geri')
            .setLabel('◀️ Geri')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 0),
          new ButtonBuilder()
            .setCustomId('ileri')
            .setLabel('İleri ▶️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === totalPages - 1)
        );

      await i.update({ embeds: [generateEmbed(page)], components: [newRow] });
    });

    collector.on('end', async () => {
      const disabledRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('geri')
            .setLabel('◀️ Geri')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('ileri')
            .setLabel('İleri ▶️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)
        );

      if (!interaction.replied) return;
      await interaction.editReply({ components: [disabledRow] });
    });
  },
};
