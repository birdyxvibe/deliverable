require('dotenv').config();
const Discord = require('discord.js')
const { EmbedBuilder } = require('discord.js');
const fishList = require('./fishList.json')
const client = new Discord.Client({
    intents: []
})

client.once('ready', async () => {
    console.log("📨 Deliverable has loaded!")
})

client.on('interactionCreate', async interaction => {
    if(interaction.commandName == 'delivery'){

        let fishData = interaction.options.getString('input').replaceAll(' ', '')
        let fishDataArray = fishData.split(',')

        const numericatedFishDataArray = fishDataArray.map(item => {
            const match = item.match(/^(\d+)([a-zA-Z]+)$/);
            return match ? { qty: parseInt(match[1], 10), name: match[2] } : null;
        })

        if(numericatedFishDataArray.every(element => element === null)){
            return interaction.reply({ content: "`🛑` Your input was probably incorrect. Please try again...", ephemeral: true })
        }

        let finalFishArrays = {
            bronze: [],
            silver: [],
            gold: [],
            diamond: []
        }
        for(const inputObj of numericatedFishDataArray){
            let fishItem = fishList.find(item => item.id.toLowerCase() === inputObj.name.toLowerCase()) ?? null;
            if(!fishItem) continue;

            let existingFish = finalFishArrays[fishItem.rarity].find(item => item.name === fishItem.name);
            if(existingFish){
                existingFish.count += inputObj.qty;
            } else {
                finalFishArrays[fishItem.rarity].push({ name: fishItem.name, count: inputObj.qty })
            }
        }

        let embInfo = {
            bronze: { name: "`🟫` Bronze", color: "#CD7F32"},
            silver: { name: "`⚪` Silver", color: "#C0C0C0"},
            gold: { name: "`🟨` Gold", color: "#FFD700"},
            diamond: { name: "`💎` Diamond", color: "#00FFF7"}
        }

        let Embeds = []
        for(const arrayKey in finalFishArrays){
            let array = finalFishArrays[arrayKey]
            if(array.length == 0) continue;
            array.sort((a, b) => a.name.localeCompare(b.name));
            let emb = new EmbedBuilder()
            .setColor(embInfo[arrayKey].color)
            .setTitle(`${embInfo[arrayKey].name} Fish`)
            .setDescription(array.map(fish => `> * ${fish.name}: **${fish.count}**`).join('\n'))

            Embeds.push(emb)
        }

        if(Embeds.length == 0){
            return interaction.reply({ content: "`🛑` All your fish names were likely inaccurate. Please try again...", ephemeral: true })
        }

        Embeds[Embeds.length-1].setFooter({ text: 'Developed by @birdy.js / Biirdy' })

        interaction.reply({ embeds: Embeds })
    }
})


client.login(process.env.token);