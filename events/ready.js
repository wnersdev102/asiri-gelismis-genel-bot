const { ActivityType } = require('discord.js');
const { aktifChannel, aktivite } = require('../ayarlar.json');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ ${client.user.tag} başarıyla giriş yaptı.`);

    client.user.setActivity(aktivite, { type: ActivityType.Playing }); // istersen değiştir playing'i

    const channel = await client.channels.fetch(aktifChannel).catch(() => null);
    if (channel && channel.isTextBased()) {
      channel.send(`✅ **${client.user.tag}** aktif!`);
    } else {
      console.warn(`Aktif kanal bulunamadı: ${aktifChannel}`);
    }
  },
};
