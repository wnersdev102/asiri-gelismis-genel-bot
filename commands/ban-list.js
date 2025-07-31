const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban-list')
    .setDescription('Sunucudaki banlı kullanıcıları listeler.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),

  async execute(interaction) {
    const bans = await interaction.guild.bans.fetch();
    if (bans.size === 0) {
      return interaction.reply({ content: '❌ Sunucuda hiç banlı kullanıcı yok.', ephemeral: true });
    }

    const bannedUsers = [...bans.values()];
    const pageSize = 5;
    let page = 0;

    const getPageEmbed = (page) => {
      const start = page * pageSize;
      const end = start + pageSize;
      const current = bannedUsers.slice(start, end);

      const embed = new EmbedBuilder()
        .setTitle('Ban Listesi')
        .setColor(0xED4245)
        .setFooter({ text: `Sayfa ${page + 1} / ${Math.ceil(bannedUsers.length / pageSize)}` });

      current.forEach((ban, i) => {
        embed.addFields({
          name: `${start + i + 1}. ${ban.user.tag}`,
          value: `**ID:** ${ban.user.id}\n**Sebep:** ${ban.reason || 'Belirtilmedi'}`,
        });
      });

      return embed;
    };

    const getRow = (page) => {
      const totalPages = Math.ceil(bannedUsers.length / pageSize);
      return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('previous')
          .setLabel('Geri')
          .setEmoji('⏮️')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 0),

        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('İleri')
          .setEmoji('⏭️')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page >= totalPages - 1)
      );
    };

    const embed = getPageEmbed(page);
    const row = getRow(page);

    const reply = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000,
    });

    collector.on('collect', async (btn) => {
      if (btn.user.id !== interaction.user.id)
        return btn.reply({ content: '❌ Bu butonları sadece komutu kullanan kişi kullanabilir.', ephemeral: true });

      if (btn.customId === 'previous' && page > 0) page--;
      else if (btn.customId === 'next' && (page + 1) * pageSize < bannedUsers.length) page++;

      await btn.update({
        embeds: [getPageEmbed(page)],
        components: [getRow(page)],
      });
    });

    collector.on('end', async () => {
      try {
        await reply.edit({ components: [] });
      } catch (e) {
      }
    });
  },
};
