const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uyarı')
    .setDescription('Kullanıcıya uyarı ekler veya sistem ayarlarını yapar.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('sistemi-ayarla')
        .setDescription('Uyarı sistemini ayarlayın.')
        .addRoleOption(option =>
          option.setName('yetkili-rol')
            .setDescription('Uyarıları yönetebilecek yetkili rolü seçin.')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option.setName('uyarı-rol')
            .setDescription('Uyarı alacak kullanıcılar için rol seçin.')
            .setRequired(true)
        )
        .addChannelOption(option =>
          option.setName('uyarı-log')
            .setDescription('Uyarıların kaydedileceği log kanalını seçin.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('sistemi-sıfırla')
        .setDescription('Uyarı sistemini sıfırlar.')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('ver')
        .setDescription('Bir kullanıcıya uyarı verir.')
        .addUserOption(option =>
          option.setName('kullanıcı')
            .setDescription('Uyarı verilecek kullanıcıyı seçin.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('al')
        .setDescription('Bir kullanıcının uyarısını siler.')
        .addUserOption(option =>
          option.setName('kullanıcı')
            .setDescription('Uyarısını sileceğiniz kullanıcıyı seçin.')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'sistemi-ayarla') {
      const yetkiliRol = interaction.options.getRole('yetkili-rol');
      const uyarıRol = interaction.options.getRole('uyarı-rol');
      const uyarıLog = interaction.options.getChannel('uyarı-log');

    
      if (!interaction.member.permissions.has('MANAGE_GUILD')) {
        return interaction.reply({
          content: 'Bu komutu kullanabilmek için `Sunucu Yönetici` yetkisine sahip olmalısınız.',
          ephemeral: true
        });
      }

      db.set(`uyarıYetkiliRol_${interaction.guild.id}`, yetkiliRol.id);
      db.set(`uyarıRol_${interaction.guild.id}`, uyarıRol.id);
      db.set(`uyarıLog_${interaction.guild.id}`, uyarıLog.id);

      return interaction.reply({
        content: `Uyarı sistemi başarıyla ayarlandı!\nYetkili Rol: ${yetkiliRol.name}\nUyarı Rol: ${uyarıRol.name}\nUyarı Log Kanalı: ${uyarıLog.name}`,
        ephemeral: true
      });
    }

    if (subcommand === 'sistemi-sıfırla') {
      db.delete(`uyarıYetkiliRol_${interaction.guild.id}`);
      db.delete(`uyarıRol_${interaction.guild.id}`);
      db.delete(`uyarıLog_${interaction.guild.id}`);

      return interaction.reply({
        content: 'Uyarı sistemi başarıyla sıfırlandı!',
        ephemeral: true
      });
    }

    // ---------------------- Uyarı Verme ---------------------- //
    if (subcommand === 'ver') {
      const kullanıcı = interaction.options.getUser('kullanıcı');
      let uyarılar = db.get(`uyarılar_${kullanıcı.id}_${interaction.guild.id}`) || 0;

      // Uyarıyı artırma
      uyarılar += 1;
      db.set(`uyarılar_${kullanıcı.id}_${interaction.guild.id}`, uyarılar);

      // Rol verme
      const uyarıRol = interaction.guild.roles.cache.get(db.get(`uyarıRol_${interaction.guild.id}`));
      if (uyarıRol) {
        const member = await interaction.guild.members.fetch(kullanıcı.id);
        member.roles.add(uyarıRol);
      }

      // Uyarı log kanalına bildirim gönderme
      const logChannel = await interaction.guild.channels.fetch(db.get(`uyarıLog_${interaction.guild.id}`));
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('YELLOW')
          .setTitle('Yeni Uyarı')
          .setDescription(`${kullanıcı.tag} adlı kullanıcıya uyarı verildi. Uyarı sayısı: ${uyarılar}`)
          .addFields(
            { name: 'Uyarı Sayısı', value: uyarılar.toString() },
            { name: 'Verilen Yetkili', value: interaction.user.tag }
          )
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] });
      }

      // Uyarı sayısına göre ceza
      if (uyarılar >= 4) {
        const member = await interaction.guild.members.fetch(kullanıcı.id);
        if (uyarılar === 4) {
          await member.send('3 uyarı aldınız, bu nedenle kick edildiniz!');
          await member.kick();
        } else if (uyarılar >= 5) {
          await member.send('4 uyarı aldınız, bu nedenle banlandınız!');
          await member.ban();
        }
      }

      // DM üzerinden bilgilendirme
      try {
        await kullanıcı.send(`Merhaba, **${interaction.guild.name}** sunucusunda **${uyarılar}** uyarı aldınız.`);
      } catch (err) {
        console.log(`DM atılamadı: ${err}`);
      }

      return interaction.reply({
        content: `${kullanıcı.tag} adlı kullanıcıya uyarı verildi! Uyarı Sayısı: ${uyarılar}`,
        ephemeral: true
      });
    }

    // ---------------------- Uyarı Silme ---------------------- //
    if (subcommand === 'al') {
      const kullanıcı = interaction.options.getUser('kullanıcı');
      let uyarılar = db.get(`uyarılar_${kullanıcı.id}_${interaction.guild.id}`) || 0;

      // Uyarıyı azaltma
      if (uyarılar > 0) {
        uyarılar -= 1;
        db.set(`uyarılar_${kullanıcı.id}_${interaction.guild.id}`, uyarılar);
      }

      // Uyarı sayısına göre ceza kontrolü
      if (uyarılar < 1) {
        const uyarıRol = interaction.guild.roles.cache.get(db.get(`uyarıRol_${interaction.guild.id}`));
        if (uyarıRol) {
          const member = await interaction.guild.members.fetch(kullanıcı.id);
          member.roles.remove(uyarıRol);
        }
      }

      // Log kanalı bilgilendirme
      const logChannel = await interaction.guild.channels.fetch(db.get(`uyarıLog_${interaction.guild.id}`));
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('GREEN')
          .setTitle('Uyarı Silindi')
          .setDescription(`${kullanıcı.tag} adlı kullanıcının uyarısı silindi. Uyarı sayısı: ${uyarılar}`)
          .addFields(
            { name: 'Uyarı Sayısı', value: uyarılar.toString() },
            { name: 'Silinen Yetkili', value: interaction.user.tag }
          )
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] });
      }

      return interaction.reply({
        content: `${kullanıcı.tag} adlı kullanıcının uyarısı silindi. Uyarı Sayısı: ${uyarılar}`,
        ephemeral: true
      });
    }
  }
};
