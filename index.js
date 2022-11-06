require('dotenv').config()
const ffmpeg = require("ffmpeg");
const { Client, GatewayIntentBits, VoiceChannel, Partials, messageLink , EmbedBuilder, ButtonBuilder } = require('discord.js');
const TOKEN = process.env['TOKEN']
const { joinVoiceChannel,  createAudioPlayer,  createAudioResource, entersState, StreamType,  AudioPlayerStatus,  VoiceConnectionStatus } = require("@discordjs/voice");const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [
        Partials.Channel,
        Partials.User,
        Partials.Role,
        Partials.Emoji,
        Partials.Invite,
        Partials.Message,
        Partials.GuildMember,
        Partials.ThreadMember,
        Partials.StageInstance,
        Partials.ThreadChannel,
    ]
})

client.on('ready', () =>{
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageCreate', async message =>{
    const { prefix } = require('./config.json')
    
    if (message.content.toLowerCase().startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(' ')
        const cmd = args.shift().toLowerCase()
        if (cmd === 'ping') message.reply(`🏓 Pong !!! Your ping is *${client.ws.ping}*`)
        else if (cmd === 'say'){
            if (message.deletable) message.delete()
            message.channel.send(args.join(' '))
        }
        else if (cmd === 'avatar'){
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
            const avatarURL = member.displayAvatarURL({
                format : 'png',
                size : 4096,
                dynamic : true,
            })
            const embed = new EmbedBuilder()
                .setImage(avatarURL)
                .setTitle(`Here is what you want, onii-chan`)
                .setColor('Green')
            message.reply({ embeds : [embed] })
        }
        else if (cmd === 'play'){
            const string = args.join(' ')
            if (!string) return message.react('❌') && message.channel.send(`\`Please enter a song url or query to search.\``)
                client.distube.play(message.member.voice.channel, string, {
                    member: message.member,
                    textChannel: message.channel,
                    message
                })
            }
            else if (cmd === 'sound'){
                const Player = createAudioPlayer();
                const file = message.attachments.first();
                const channel = message.member.voice.channel;
                const Embed = new EmbedBuilder()
                
                .addFields(
                    {
                    name: "Usege",
                    value: `*sound (file)`,
                    inline: true
                    },
                    {
                    name: "Examples",
                    value: `*sound ...`,
                    inline: true
                    })
                .setDescription("music command: play songs");

                if (!channel || !file) return message.channel.send({ embeds: [Embed] });
                const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
                });

                try {
                connection;
                connection.subscribe(Player);

                const resource = createAudioResource(file.url, {
                    inputType: StreamType.Arbitrary
                });

                Player.play(resource);
                message.channel.send({
                    content: "> playing: `" + file.name + "`, size: `" + file.size + "B`"
                });
                } catch (error) {
                message.channel.send({ content: error.message || "Error" });
                }
                
            }
    }
})

client.login(TOKEN)