const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kurucu')
    .setDescription('Sunucu kurucusu hakkında bilgi verir.'),

  async execute(interaction) {
    const guild = interaction.guild;

    try {
      const owner = await guild.fetchOwner(); // Sunucu sahibini çekiyoruz

      const embed = new EmbedBuilder()
        .setTitle('👑 Sunucu Kurucusu')
        .setDescription(`Bu sunucunun sahibi **${owner.user.tag}**`)
        .addFields(
          { name: 'Kurucu', value: `<@${owner.id}>`, inline: true },
          { name: 'Kullanıcı ID', value: owner.id, inline: true }
        )
        .setThumbnail(owner.user.displayAvatarURL({ dynamic: true }))
        .setColor('#FFD700')
        .setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error('Kurucu bilgisi alınamadı:', error);
      await interaction.reply({ content: '❌ Sunucu sahibi bilgisi alınamadı.', ephemeral: true });
    }
  }
};
