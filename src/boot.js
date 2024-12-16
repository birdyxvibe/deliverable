const { REST } = require('discord.js');
const { Routes } = require('discord-api-types/v10');
const data = require('./commands.json');
require('dotenv').config();

const clientId = '1318033877884993556';

const rest = new REST({ version: '10' }).setToken(process.env.token);

(async () => {
    try {
        console.log(`📝 Refreshing ${data.length} commands...`);

        const cmds = await rest.put(
            Routes.applicationCommands(clientId),
            { body: data }
        );

        console.log(`📝 Refreshed ${cmds.length} commands!`);
    } catch (err) {
        console.error(err);
        console.log(`⚠️ Oops! Something went wrong, please try again!`);
    }
})();