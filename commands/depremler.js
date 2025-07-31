const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('depremler')
    .setDescription('Son Türkiye ve çevresindeki depremleri gösterir.'),

  async execute(interaction) {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

    await interaction.deferReply();

    try {
      const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=' + 
                  new Date(Date.now() - 24*60*60*1000).toISOString() + 
                  '&minlatitude=35&maxlatitude=43&minlongitude=25&maxlongitude=45&limit=10&orderby=time';

      const response = await fetch(url);
      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        return interaction.editReply('Son 24 saatte Türkiye ve çevresinde deprem gözlemlenmedi.');
      }

      const embed = new EmbedBuilder()
        .setTitle('🌍 Son Depremler - Türkiye ve Çevresi')
        .setColor('#FF4D4D')
        .setTimestamp()
        .setFooter({ text: 'Veri kaynağı: USGS' });

      data.features.forEach((quake, index) => {
        const { mag, place, time } = quake.properties;
        const date = new Date(time);
        const coord = quake.geometry.coordinates;
        const urlMap = `https://www.google.com/maps?q=${coord[1]},${coord[0]}`;

        embed.addFields({
          name: `${index + 1}. 🔥 ${mag} büyüklüğünde`,
          value: `📍 ${place}\n🕒 <t:${Math.floor(date.getTime()/1000)}:F>\n[Haritada Göster](${urlMap})`,
          inline: false
        });
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Deprem verisi alınırken hata:', error);
      interaction.editReply('Deprem verileri alınırken bir hata oluştu.');
    }
  }
};
