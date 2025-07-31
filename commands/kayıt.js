const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kayıt')
    .setDescription('Kayıt sistemi işlemleri')
    .addSubcommand(sub =>
      sub.setName('sistemi-ayarla')
        .setDescription('Kayıt sistemini ayarlarsınız.')
        .addChannelOption(opt =>
          opt.setName('kayıt-kanal').setDescription('Kayıt kanalı').setRequired(true))
        .addRoleOption(opt =>
          opt.setName('kayıt-yetkili').setDescription('Kayıt yetkilisi').setRequired(true))
        .addRoleOption(opt =>
          opt.setName('kız-rol').setDescription('Kız rolü').setRequired(true))
        .addRoleOption(opt =>
          opt.setName('erkek-rol').setDescription('Erkek rolü').setRequired(true))
        .addRoleOption(opt =>
          opt.setName('kayıtsız-rol').setDescription('Kayıtsız rol').setRequired(true))
        .addChannelOption(opt =>
          opt.setName('kayıt-log').setDescription('Kayıt log kanalı').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('sistemi-sıfırla')
        .setDescription('Kayıt sistemini sıfırlar.'))
    .addSubcommand(sub =>
      sub.setName('erkek')
        .setDescription('Bir kullanıcıyı erkek olarak kaydedersiniz.')
        .addUserOption(opt =>
          opt.setName('kullanıcı').setDescription('Kaydedilecek kullanıcı').setRequired(true))
        .addStringOption(opt =>
          opt.setName('isim').setDescription('Kullanıcının ismi').setRequired(true))
        .addStringOption(opt =>
          opt.setName('yaş').setDescription('Kullanıcının yaşı').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('kız')
        .setDescription('Bir kullanıcıyı kız olarak kaydedersiniz.')
        .addUserOption(opt =>
          opt.setName('kullanıcı').setDescription('Kaydedilecek kullanıcı').setRequired(true))
        .addStringOption(opt =>
          opt.setName('isim').setDescription('Kullanıcının ismi').setRequired(true))
        .addStringOption(opt =>
          opt.setName('yaş').setDescription('Kullanıcının yaşı').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const ayar = db.get(`kayıtSistemi_${guildId}`);

    if (sub === 'sistemi-ayarla') {
      db.set(`kayıtSistemi_${guildId}`, {
        kanal: interaction.options.getChannel('kayıt-kanal').id,
        yetkili: interaction.options.getRole('kayıt-yetkili').id,
        kız: interaction.options.getRole('kız-rol').id,
        erkek: interaction.options.getRole('erkek-rol').id,
        kayıtsız: interaction.options.getRole('kayıtsız-rol').id,
        log: interaction.options.getChannel('kayıt-log').id
      });
      return interaction.reply({ content: '✅ Kayıt sistemi başarıyla ayarlandı!', ephemeral: true });
    }

    if (sub === 'sistemi-sıfırla') {
      db.delete(`kayıtSistemi_${guildId}`);
      return interaction.reply({ content: '🗑️ Kayıt sistemi sıfırlandı!', ephemeral: true });
    }

    if (!ayar) {
      return interaction.reply({ content: '⚠️ Kayıt sistemi ayarlanmamış!', ephemeral: true });
    }

    const member = interaction.guild.members.cache.get(interaction.options.getUser('kullanıcı')?.id);
    const isim = interaction.options.getString('isim');
    const yaş = interaction.options.getString('yaş');

    if (!interaction.member.roles.cache.has(ayar.yetkili)) {
      return interaction.reply({ content: '🚫 Bu komutu kullanmak için yetkin yok!', ephemeral: true });
    }

    if (!member) {
      return interaction.reply({ content: '❌ Kullanıcı bulunamadı.', ephemeral: true });
    }

    const logChannel = interaction.guild.channels.cache.get(ayar.log);

    if (sub === 'erkek') {
      await member.setNickname(`${isim} | ${yaş}`).catch(() => {});
      await member.roles.add(ayar.erkek).catch(() => {});
      await member.roles.remove(ayar.kayıtsız).catch(() => {});
      if (logChannel) logChannel.send(`👨 ${member} adlı kullanıcı erkek olarak kayıt edildi.`);
      return interaction.reply({ content: `✅ ${member} adlı kullanıcı erkek olarak kaydedildi.` });
    }

    if (sub === 'kız') {
      await member.setNickname(`${isim} | ${yaş}`).catch(() => {});
      await member.roles.add(ayar.kız).catch(() => {});
      await member.roles.remove(ayar.kayıtsız).catch(() => {});
      if (logChannel) logChannel.send(`👩 ${member} adlı kullanıcı kız olarak kayıt edildi.`);
      return interaction.reply({ content: `✅ ${member} adlı kullanıcı kız olarak kaydedildi.` });
    }
  }
};
