const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bir kullanıcıyı sunucudan yasaklar.')
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Banlanacak kullanıcıyı seçin')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Ban sebebini yazın')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('kullanıcı');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi.';
    const member = interaction.guild.members.cache.get(targetUser.id);

    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: '❌ Bu komutu kullanmak için **Üyeleri Yasakla** yetkisine sahip olmalısın.',
        ephemeral: true
      });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: '❌ Bu komutu uygulayabilmek için benim **Üyeleri Yasakla** yetkim olmalı.',
        ephemeral: true
      });
    }

    if (member && interaction.member.roles.highest.position <= member.roles.highest.position) {
      return interaction.reply({
        content: '❌ Seninle aynı veya daha yüksek role sahip birini banlayamazsın.',
        ephemeral: true
      });
    }

    if (member && !member.bannable) {
      return interaction.reply({
        content: '❌ Bu kullanıcıyı banlayamıyorum. Yetkisi benden yüksek olabilir.',
        ephemeral: true
      });
    }

    try {
      const dmEmbed = new EmbedBuilder()
        .setTitle('Yasaklandın!')
        .setDescription(`**${interaction.guild.name}** sunucusundan yasaklandın.`)
        .setColor(0xFF5555)
        .addFields(
          { name: '❓ Sebep', value: reason, inline: false },
          { name: '👮 Yasaklayan', value: interaction.user.tag, inline: false }
        )
        .setTimestamp();

      await targetUser.send({ embeds: [dmEmbed] }).catch(() => {
      });
      await interaction.guild.members.ban(targetUser.id, { reason });
      const embed = new EmbedBuilder()
        .setTitle('Kullanıcı Yasaklandı')
        .setColor(0xFF0000)
        .addFields(
          { name: '👤 Kullanıcı', value: `${targetUser.tag} (${targetUser.id})`, inline: false },
          { name: '📄 Sebep', value: reason, inline: false },
          { name: '👮 Yetkili', value: `${interaction.user.tag}`, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (err) {
      console.error('Ban hatası:', err);
      return interaction.reply({
        content: '❌ Bir hata oluştu. Kullanıcıyı banlayamadım.',
        ephemeral: true
      });
    }
  }
};
