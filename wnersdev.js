const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const config = require('./ayarlar.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,

    // lazim olursa diye reis
  ],
});

client.commands = new Collection();
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log('Slash komutları global olarak yükleniyor...');

    await rest.put(Routes.applicationCommands(config.clientId), { body: commands });


    console.log(`✅ Slash komutları başarıyla yüklendi! Toplam komut sayısı: ${commands.length}`);
  } catch (error) {
    console.error('❌ Slash komut yüklemede hata:', error);
    if (error.code === 'TOKEN_INVALID') {
      console.error('❌ Geçersiz bot tokeni. Lütfen geçerli bir token girin.');
    }
  }
})();

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// seviye
require('./events/voiceStateUpdate')(client);

client.login(config.token)
  .then(() => {
    console.log('✅ Bot başarıyla giriş yaptı.');
  })
  .catch(err => {
    console.error('❌ Bot girişinde hata oluştu:', err);
  });
