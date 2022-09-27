const Discord = require('discord.js')
const client = new Discord.Client({
    intents: 32767
})
const tw = require('@fortune-inc/tw-voucher')
const config = require('./config.json')
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require('fs');


let commands = [];
fs.readdir('commands', (err, files) => {
    if (err) throw err;
    files.forEach(async (f) => {
        try {
            let props = require(`./commands/${f}`);
            commands.push({
                name: props.name,
                description: props.description,
                options: props.options
            });
        } catch (err) {
            console.log(err);
        }
    });
});
client.on('interactionCreate', async (interaction) => {
	if (interaction.type != 2) return;
    fs.readdir('commands', (err, files) => {
        if (err) throw err;
        files.forEach(async (f) => {
            let props = require(`./commands/${f}`);
            if (interaction.commandName.toLowerCase() === props.name.toLowerCase()) {
                try {
                    if ((props?.permissions?.length || [].length) > 0) {
                        (props?.permissions || [])?.map(perm => {
                            if (interaction.member.permissions.has(config.permissions[perm])) {
                                return props.run(client, interaction);
                            } else {
                                return interaction.reply({ content: `Missing permission: **${perm}**`, ephemeral: true });
                            }
                        })
                    } else {
                        return props.run(client, interaction);
                    }
                } catch (e) {
                    return interaction.reply({ content: `Something went wrong...\n\n\`\`\`${e.message}\`\`\``, ephemeral: true });
                }
            }
        });
    });
});
const rest = new REST({ version: "9" }).setToken(config.token);
client.once("ready", () => {
    (async () => {
        try {
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: await commands,
            });
            console.log(`Login : ${client.user.tag}`);
        } catch { };
    })();
});
client.login(config.token)

client.on("interactionCreate", async (interaction) => {

    if (interaction.isButton()) {
        if (interaction.customId == "เติมเงิน") {
            const modal = new Discord.ModalBuilder()
                .setCustomId('topup')
                .setTitle('ซองอังเปา(ไม่มีการคืนเงิน)');
            const codeInput = new Discord.TextInputBuilder()
                .setCustomId('codeInput')
                .setLabel("ลิ้งค์ซองอังเปา")
                .setPlaceholder('https://gift.truemoney.com/campaign/?v=xxxxxxxxxxxxxxx')
                .setStyle(Discord.TextInputStyle.Short);
            const codeInputActionRow = new Discord.ActionRowBuilder().addComponents(codeInput);
            modal.addComponents(codeInputActionRow);
            await interaction.showModal(modal);
        }
    }
    if (interaction.isButton()) {
        if (interaction.customId == "ช่วยเหลือ") {
            await interaction.reply({ embeds: [new Discord.EmbedBuilder().setColor("Green").setTitle("ราคาทั้งหมด").setDescription(`เติมเงิน 20บาท จะได้ยศ\n-> <@&${config.role20}>\nเติมเงิน 30บาท จะได้ยศ\n-> <@&${config.role30}>\nเติมเงิน 40บาท จะได้ยศ\n-> <@&${config.role40}>\nเติมเงิน 70บาท จะได้ยศ\n-> <@&999009802925658172> <@&998999975029649469> <@&997495539606233118> <@&998878828606787644>`)], ephemeral: true})
        }
    }
    if (interaction.type === 5){
        if (interaction.customId === "topup") {
            const codeInput =  interaction.fields.getTextInputValue('codeInput')
            console.log(`URL:${codeInput}   DISCORD-ID:${interaction.user.id}`)
            if(!codeInput.includes("https://gift.truemoney.com/campaign/?v")) return await interaction.reply({ embeds: [
                new Discord.EmbedBuilder()
                .setColor("Red")
                .setDescription('เติมเงินไม่สำเร็จ : ลิ้งค์รับเงินแล้ว/ลิ้งค์ผิด')
            ], ephemeral: true})

            tw(config.phone, codeInput).then(async re => {
                switch  (re.amount) {
                        case 20:
                            if(interaction.member.roles.cache.has(config.role20)){
                                await interaction.reply({ embeds: [new Discord.EmbedBuilder().setColor("Green").setDescription("เติมเงินสำเร็จ : คุณมียศอยู่แล้ว")], ephemeral: true})
                                await interaction.guild.channels.cache.get(config.channellog).send({ embeds: [
                                    new Discord.EmbedBuilder()
                                    .setDescription(`เติมเงินสำเร็จ ${re.amount} โดย <@${interaction.user.id}>`)
                                    .addFields({
                                        name: `คุณได้รับยศ`,
                                        value: `• <@&${config.role20}>`
                                    })
                                    .setColor("Green")
                                ]})
                            }else{
                                await interaction.member.roles.add(config.role20)
                                await interaction.reply({ embeds: [new Discord.EmbedBuilder().setColor("Green").setDescription("เติมเงินสำเร็จ")], ephemeral: true})
                                await interaction.guild.channels.cache.get(config.channellog).send({ embeds: [
                                    new Discord.EmbedBuilder()
                                    .setDescription(`เติมเงินสำเร็จ ${re.amount} โดย <@${interaction.user.id}>`)
                                    .addFields({
                                        name: `คุณได้รับยศ`,
                                        value: `• <@&${config.role20}>`
                                    })
                                    .setColor("Green")
                                ]})
                            }

                        break;
                            case 30:
                                if(interaction.member.roles.cache.has(config.role30)){
                                    await interaction.reply({ embeds: [new Discord.EmbedBuilder().setColor("Green").setDescription("เติมเงินสำเร็จ : คุณมียศอยู่แล้ว")], ephemeral: true})
                                    await interaction.guild.channels.cache.get(config.channellog).send({ embeds: [
                                        new Discord.EmbedBuilder()
                                        .setDescription(`เติมเงินสำเร็จ ${re.amount} โดย <@${interaction.user.id}>`)
                                        .addFields({
                                            name: `คุณได้รับยศ`,
                                            value: `• <@&${config.role30}>`
                                        })
                                        .setColor("Green")
                                    ]})
                                }else{
                                    await interaction.member.roles.add(config.role30)
                                    await interaction.reply({ embeds: [new Discord.EmbedBuilder().setColor("Green").setDescription("เติมเงินสำเร็จ")], ephemeral: true})
                                    await interaction.guild.channels.cache.get(config.channellog).send({ embeds: [
                                        new Discord.EmbedBuilder()
                                        .setDescription(`เติมเงินสำเร็จ ${re.amount} โดย <@${interaction.user.id}>`)
                                        .addFields({
                                            name: `คุณได้รับยศ`,
                                            value: `• <@&${config.role30}>`
                                        })
                                        .setColor("Green")
                                    ]})
                                }

     
                            break;
                                case 40:
                                    if(interaction.member.roles.cache.has(config.role40)){
                                        await interaction.reply({ embeds: [new Discord.EmbedBuilder().setColor("Green").setDescription("เติมเงินสำเร็จ : คุณมียศอยู่แล้ว")], ephemeral: true})
                                        await interaction.guild.channels.cache.get(config.channellog).send({ embeds: [
                                            new Discord.EmbedBuilder()
                                            .setDescription(`เติมเงินสำเร็จ ${re.amount} โดย <@${interaction.user.id}>`)
                                            .addFields({
                                                name: `คุณได้รับยศ`,
                                                value: `• <@&${config.role40}>`
                                            })
                                            .setColor("Green")
                                        ]})
                                    }else{
                                        await interaction.member.roles.add(config.role40)
                                        await interaction.reply({ embeds: [new Discord.EmbedBuilder().setColor("Green").setDescription("เติมเงินสำเร็จ")], ephemeral: true})
                                        await interaction.guild.channels.cache.get(config.channellog).send({ embeds: [
                                            new Discord.EmbedBuilder()
                                            .setDescription(`เติมเงินสำเร็จ ${re.amount} โดย <@${interaction.user.id}>`)
                                            .addFields({
                                                name: `คุณได้รับยศ`,
                                                value: `• <@&${config.role40}>`
                                            })
                                            .setColor("Green")
                                        ]})
                                    }
                                break;
                                    case 70:
                                        await interaction.member.roles.add('999009802925658172')
                                        await interaction.member.roles.add('998999975029649469')
                                        await interaction.member.roles.add('997495539606233118')
                                        await interaction.member.roles.add('998878828606787644')
                                        await interaction.reply({ embeds: [new Discord.EmbedBuilder().setColor("Green").setDescription("เติมเงินสำเร็จ")], ephemeral: true})
                                        await interaction.guild.channels.cache.get(config.channellog).send({ 
                                            embeds: [
                                                new Discord.EmbedBuilder()
                                                .setDescription(`เติมเงินสำเร็จ ${re.amount} โดย <@${interaction.user.id}>`)
                                                .addFields({
                                                    name: `คุณได้รับยศ`,
                                                    value: " •<@&999009802925658172>\n •<@&998999975029649469>\n •<@&997495539606233118>\n •<@&998878828606787644>\n"
                                                })
                                                .setColor("Green")
                                            ]})
                                    break;
                    default:
                        break;
                }
            }).catch(async e => {
                await interaction.reply({ embeds: [new Discord.EmbedBuilder().setColor("Red").setDescription("ลิงค์ผิดหรืออาจมีคนใช้ไปแล้ว")], ephemeral: true})
            })
        }
    };
})