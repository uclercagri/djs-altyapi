const { expect } = require('chai');
const { Client, IntentsBitField } = require('discord.js');

describe('Bot Test', () => {
  let client;

  beforeEach(async () => {
    client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
      ],
    });
    await client.login(process.env.BOT_TOKEN);
  });

  afterEach(async () => {
    await client.destroy();
  });

  it('should log in to the Discord API', () => {
    expect(client.isReady()).to.be.true;
  });
});
