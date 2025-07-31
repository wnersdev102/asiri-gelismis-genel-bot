const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../ayarlar.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hava-durumu')
    .setDescription('Belirtilen şehir için hava durumunu gösterir')
    .addStringOption(option =>
      option.setName('şehir')
        .setDescription('Hava durumu öğrenmek istediğin şehir')
        .setRequired(true)
    ),

  async execute(interaction) {
    const fetch = global.fetch || (await import('node-fetch')).default;
    const rawCity = interaction.options.getString('şehir');
    const city = rawCity.toLowerCase();

    try {
      await interaction.deferReply();

      const apiKey = '34665b47e23e329ce224450f488cd38e';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},TR&appid=${apiKey}&units=metric&lang=tr`;

      const response = await fetch(url);
      if (!response.ok) {
        return interaction.editReply({ content: '❌ Şehir bulunamadı. Lütfen geçerli bir Türk şehir adı girin.' });
      }

      const data = await response.json();

      const embed = new EmbedBuilder()
        .setTitle(`${data.name} için Hava Durumu`)
        .setDescription(data.weather[0].description)
        .setThumbnail(`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        .addFields(
          { name: '🌡️ Sıcaklık', value: `${data.main.temp} °C`, inline: true },
          { name: '🤒 Hissedilen', value: `${data.main.feels_like} °C`, inline: true },
          { name: '💧 Nem', value: `${data.main.humidity}%`, inline: true },
          { name: '🌬️ Rüzgar Hızı', value: `${data.wind.speed} m/s`, inline: true },
          { name: '🔽 Basınç', value: `${data.main.pressure} hPa`, inline: true },
        )
        .setColor('#00aaff')
        .setFooter({ text: 'OpenWeatherMap API ile alınmıştır.' });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: '❌ Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' });
      } else {
        await interaction.reply({ content: '❌ Bir hata oluştu. Lütfen daha sonra tekrar deneyin.', ephemeral: true });
      }
    }
  }
};
