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
    .setName('forcaban')
    .setDescription('Bir kullanıcıyı zorla yasaklar.')
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Zorla yasaklanacak kullanıcıyı seçin')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Zorla yasaklama sebebini belirtin (isteğe bağlı)')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';

    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: '❌ Bu komutu kullanmak için **Üyeleri Yasakla** yetkisine sahip olmalısın.',
        ephemeral: true,
      });
    }

    const dmEmbed = new EmbedBuilder()
      .setTitle('Banlandın!')
      .setDescription(`**${interaction.guild.name}** sunucusunda yasağınız kaldırıldı.`)
      .addFields(
        { name: 'Sebep', value: reason },
        { name: 'Yetkili', value: interaction.user.tag }
      )
      .setColor(0xED4245)
      .setTimestamp();

    try {
      await user.send({ embeds: [dmEmbed] }).catch(() => {});
    } catch (e) {
    }
    try {
      await interaction.guild.members.ban(user.id, { reason: reason });
      const embed = new EmbedBuilder()
        .setTitle('Kullanıcı Zorla Banlandı')
        .setColor(0xED4245)
        .addFields(
          { name: '👤 Kullanıcı', value: `${user.tag} (${user.id})` },
          { name: '❓ Sebep', value: reason },
          { name: '👮 Yetkili', value: interaction.user.tag }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error('Forcaban hatası:', err);
      return interaction.reply({
        content: '❌ Kullanıcıyı zorla yasaklama işlemi sırasında bir hata oluştu.',
        ephemeral: true,
      });
    }
  },
};
