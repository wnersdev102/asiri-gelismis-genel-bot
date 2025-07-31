const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sunucu-bilgi')
    .setDescription('Sunucuya dair bilgileri gösterir.'),

  async execute(interaction) {
    const guild = interaction.guild;

    const totalMembers = guild.memberCount;
    const totalChannels = guild.channels.cache.size;
    const totalRoles = guild.roles.cache.size;
    const createdAt = guild.createdAt.toLocaleDateString('tr-TR');
    const owner = await guild.fetchOwner();
    const region = guild.preferredLocale;

    const serverIconURL = guild.iconURL({ dynamic: true, size: 2048 });

    const embed = new EmbedBuilder()
      .setTitle(`${guild.name} Sunucu Bilgileri`)
      .setThumbnail(serverIconURL)
      .addFields(
        { name: 'Sunucu Sahibi', value: owner.user.tag, inline: true },
        { name: 'Sunucu Bölgesi', value: region, inline: true },
        { name: 'Üye Sayısı', value: `${totalMembers} üye`, inline: true },
        { name: 'Kanal Sayısı', value: `${totalChannels} kanal`, inline: true },
        { name: 'Rol Sayısı', value: `${totalRoles} rol`, inline: true },
        { name: 'Sunucu Kuruluş Tarihi', value: createdAt, inline: true },
      )
      .setColor(0x00AEFF)
      .setTimestamp()
      .setFooter({
        text: 'Sunucu Bilgisi',
        iconURL: interaction.client.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};
