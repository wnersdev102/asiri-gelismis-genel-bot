const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const croxydb = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('durum-rol')
    .setDescription('Belirli durumda kullanıcıya rol ver, log at, DM bildirimi yap.')
    .addStringOption(opt =>
      opt.setName('durum')
         .setDescription('Kullanıcının alacağı veya kaybedeceği durum')
         .setRequired(true)
    )
    .addRoleOption(opt =>
      opt.setName('rol')
         .setDescription('Durum rolü (verilecek veya alınacak rol)')
         .setRequired(true)
    )
    .addChannelOption(opt =>
      opt.setName('log-kanal')
         .setDescription('Logların gönderileceği metin kanalı')
         .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const { options, guild } = interaction;
    const durum = options.getString('durum').trim();
    const rol = options.getRole('rol');
    const logKanal = options.getChannel('log-kanal');

    if (!logKanal.isTextBased()) {
      return interaction.reply({ content: '❌ Lütfen geçerli bir metin kanalı seçin.', ephemeral: true });
    }

    croxydb.set(`durumRol_${guild.id}_${durum}`, {
      rolId: rol.id,
      logKanalId: logKanal.id
    });

    return interaction.reply({
      content: `✅ Başarıyla **"${durum}"** durumunda kullanıcıya **${rol}** rolü verilecek ve loglar ${logKanal} kanalına atılacak.`,
      ephemeral: true
    });
  }
};
