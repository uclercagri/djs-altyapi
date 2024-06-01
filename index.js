const { Client, GatewayIntentBits, REST, Routes, Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const mongo = require('./database/mongo');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

client.once('ready', async () => {
  console.log('Bot is online!');

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }

  mongo().then(() => {
    console.log('Connected to MongoDB');
  }).catch(console.error);

  client.user.setPresence({
    activities: [{ name: 'I am being developed', type: ActivityType.Playing }],
    status: 'idle',
  });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
