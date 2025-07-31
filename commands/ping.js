const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botun gecikme süresini gösterir.'),

  async execute(interaction) {
    const start = Date.now();
    await interaction.deferReply();

    const ping = Date.now() - start;
    const apiLatency = interaction.client.ws.ping;

    const embed = new EmbedBuilder()
      .setDescription('İşte botun güncel gecikme bilgileri 👇')
      .setColor(0x2F3136)
      .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: 'Mesaj Gecikmesi',
          value: `\`${ping}ms\``,
          inline: true,
        },
        {
          name: 'WebSocket Gecikmesi',
          value: `\`${apiLatency}ms\``,
          inline: true,
        },
        {
          name: 'Durum',
          value:
            ping < 100
              ? '`Mükemmel 🚀`'
              : ping < 200
              ? '`İyi`'
              : '`Yavaş`',
          inline: true,
        }
      )
      .setFooter({
        text: `${interaction.client.user.username} • Ping Sistemi`,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
  },
};
