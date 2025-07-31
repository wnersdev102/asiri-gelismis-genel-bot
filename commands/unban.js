const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Banlanan bir kullanıcının yasağını kaldırır.')
    .addStringOption(option =>
      option.setName('id')
        .setDescription('Banı kaldırılacak kullanıcının kullanıcı IDsi')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Unban sebebi')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),

  async execute(interaction) {
    const userId = interaction.options.getString('id');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi.';

    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: '❌ Bu komutu kullanmak için **Üyeleri Yasakla** yetkisine sahip olmalısın.',
        ephemeral: true,
      });
    }

    try {
      const bannedUsers = await interaction.guild.bans.fetch();
      const bannedUser = bannedUsers.get(userId);

      if (!bannedUser) {
        return interaction.reply({
          content: '❌ Bu ID ile banlı bir kullanıcı bulunamadı.',
          ephemeral: true,
        });
      }
      const dmEmbed = new EmbedBuilder()
        .setTitle('Banın Kaldırıldı!')
        .setDescription(`**${interaction.guild.name}** sunucusundaki yasağın kaldırıldı.`)
        .addFields(
          { name: '❓ Sebep', value: reason },
          { name: '👮 Affeden Yetkili', value: interaction.user.tag }
        )
        .setColor(0x57F287)
        .setTimestamp();

      await bannedUser.user.send({ embeds: [dmEmbed] }).catch(() => {
    
      });

      await interaction.guild.members.unban(userId, reason);

      const embed = new EmbedBuilder()
        .setTitle('Kullanıcının Banı Kaldırıldı')
        .setColor(0x57F287)
        .addFields(
          { name: '👤 Kullanıcı', value: `${bannedUser.user.tag} (${userId})`, inline: false },
          { name: '📄 Sebep', value: reason, inline: false },
          { name: '👮 Yetkili', value: interaction.user.tag, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (err) {
      console.error('Unban hatası:', err);
      return interaction.reply({
        content: '❌ Bir hata oluştu. ID yanlış olabilir ya da kullanıcı zaten banlı değil.',
        ephemeral: true,
      });
    }
  },
};
