const { Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute sistemi ile kullanıcıları susturmanıza olanak tanır.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('sistemi-ayarla')
        .setDescription('Mute sistemini yapılandırır.')
        .addRoleOption(option =>
          option.setName('mute-rol')
            .setDescription('Mute rolünü seçin.')
            .setRequired(true))
        .addRoleOption(option =>
          option.setName('yetkili-rol')
            .setDescription('Mute yetkilisini belirleyen rolü seçin.')
            .setRequired(true))
        .addChannelOption(option =>
          option.setName('mute-log')
            .setDescription('Mute log kanalı seçin.')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('sistemi-sıfırla')
        .setDescription('Mute sistemini sıfırlar.'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('ver')
        .setDescription('Bir kullanıcıyı mute eder.')
        .addUserOption(option => option.setName('kullanıcı').setDescription('Mute edilecek kullanıcı').setRequired(true))
        .addStringOption(option => option.setName('sebep').setDescription('Mute sebebini belirtin.').setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('al')
        .setDescription('Bir kullanıcının mute\'unu kaldırır.')
        .addUserOption(option => option.setName('kullanıcı').setDescription('Mute kaldırılacak kullanıcı').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'sistemi-ayarla') {
      const muteRol = interaction.options.getRole('mute-rol');
      const yetkiliRol = interaction.options.getRole('yetkili-rol');
      const muteLogKanal = interaction.options.getChannel('mute-log');

      db.set(`mute.${interaction.guild.id}`, {
        muteRol: muteRol.id,
        yetkiliRol: yetkiliRol.id,
        muteLogKanal: muteLogKanal.id
      });

      const embed = new EmbedBuilder()
        .setTitle('Mute Sistemi Başarıyla Ayarlandı!')
        .setDescription(`Mute rolü: ${muteRol.name}\nYetkili rolü: ${yetkiliRol.name}\nMute log kanalı: ${muteLogKanal.name}`)
        .setColor(0x57F287)
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === 'sistemi-sıfırla') {
      db.delete(`mute.${interaction.guild.id}`);
      const embed = new EmbedBuilder()
        .setTitle('Mute Sistemi Başarıyla Sıfırlandı!')
        .setColor(0xFF0000)
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === 'ver') {
      const user = interaction.options.getUser('kullanıcı');
      const sebep = interaction.options.getString('sebep') || 'Sebep belirtilmemiş';
      
      const muteData = db.get(`mute.${interaction.guild.id}`);
      if (!muteData) {
        return interaction.reply({ content: 'Mute sistemi ayarlanmamış!', ephemeral: true });
      }

      const muteRol = interaction.guild.roles.cache.get(muteData.muteRol);
      const yetkiliRol = interaction.guild.roles.cache.get(muteData.yetkiliRol);

      if (!interaction.member.roles.cache.has(yetkiliRol.id)) {
        return interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiniz yok!', ephemeral: true });
      }

      const member = await interaction.guild.members.fetch(user.id);
      await member.roles.add(muteRol);

      const logChannel = interaction.guild.channels.cache.get(muteData.muteLogKanal);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('Bir Kullanıcı Mute Edildi!')
          .setDescription(`${user.tag} kullanıcısı ${sebep} nedeniyle mute edildi.`)
          .setColor(0xFF0000)
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] });
      }

      const embed = new EmbedBuilder()
        .setTitle('Mute Verildi!')
        .setDescription(`${user.tag} kullanıcısı başarıyla mute edildi. Sebep: ${sebep}`)
        .setColor(0xFF0000)
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === 'al') {
      const user = interaction.options.getUser('kullanıcı');

      const muteData = db.get(`mute.${interaction.guild.id}`);
      if (!muteData) {
        return interaction.reply({ content: 'Mute sistemi ayarlanmamış!', ephemeral: true });
      }

      const muteRol = interaction.guild.roles.cache.get(muteData.muteRol);
      const member = await interaction.guild.members.fetch(user.id);

      await member.roles.remove(muteRol);

      const logChannel = interaction.guild.channels.cache.get(muteData.muteLogKanal);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('Bir Kullanıcı Mute\'dan Çıkarıldı!')
          .setDescription(`${user.tag} kullanıcısı mute'dan çıkarıldı.`)
          .setColor(0x57F287)
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] });
      }

      const embed = new EmbedBuilder()
        .setTitle('Mute Kaldırıldı!')
        .setDescription(`${user.tag} kullanıcısının mute'u başarıyla kaldırıldı.`)
        .setColor(0x57F287)
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }
  },
};
