const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('çekiliş-başlat')
    .setDescription('Belirli ödül, süre ve katılımcı sayısı ile çekiliş başlatır.')
    .addStringOption(option =>
      option
        .setName('ödül')
        .setDescription('Çekiliş ödülü')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('süre')
        .setDescription('Çekiliş süresi (örn: 1m, 1h, 1d)')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('katılımcı-sayısı')
        .setDescription('Minimum katılımcı sayısı')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),

  async execute(interaction) {
    const ödül = interaction.options.getString('ödül');
    const süre = interaction.options.getString('süre');
    const minKatilimci = interaction.options.getInteger('katılımcı-sayısı');

    const zamanMs = ms(süre);
    if (!zamanMs || zamanMs < 10000) {
      return interaction.reply({
        content: '❌ Geçerli bir süre belirtmelisin (örn: `1m`, `1h`, `1d`).',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🎉 Yeni Çekiliş!')
      .setDescription(`**Ödül:** ${ödül}\n🕒 Süre: <t:${Math.floor((Date.now() + zamanMs) / 1000)}:R>\n🎯 Minimum Katılımcı: ${minKatilimci}`)
      .setColor('Random')
      .setFooter({ text: `Katılmak için 🎉 emojisine tıklayın!` });

    const mesaj = await interaction.channel.send({ embeds: [embed] });
    await mesaj.react('🎉');
    const katilanlar = new Set();
    const filter = (reaction, user) => reaction.emoji.name === '🎉' && !user.bot;

    const collector = mesaj.createReactionCollector({ filter, time: zamanMs });

    collector.on('collect', async (reaction, user) => {
      if (!katilanlar.has(user.id)) {
        katilanlar.add(user.id);
        try {
          await user.send(`🎉 ${ödül} çekilişine katıldın! Bol şans!`);
        } catch {
        }
      }
    });

    collector.on('end', async () => {
      if (katilanlar.size < minKatilimci) {
        mesaj.reply('❌ Yeterli katılımcı olmadığı için çekiliş iptal edildi.');
        return;
      }
      const kazananlarArray = Array.from(katilanlar);
      const kazananId = kazananlarArray[Math.floor(Math.random() * kazananlarArray.length)];
      const kazanan = await interaction.guild.members.fetch(kazananId).catch(() => null);

      mesaj.reply(`🎉 Tebrikler <@${kazananId}>! \`${ödül}\` ödülünü kazandın!`);

      if (kazanan) {
        try {
          await kazanan.send(`🎉 Tebrikler! \`${ödül}\` ödülünü kazandın!`);
        } catch {
        }
      }
    });

    return interaction.reply({ content: '✅ Çekiliş başlatıldı!', ephemeral: true });
  }
};
