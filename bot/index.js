import Discord from 'discord.js'
import ExtensionLoader from './extension_loader.js'
import ctx from './context.js'
import config from '../config.js'
import InternalLogger from './internal_logger.js'

const loader = new ExtensionLoader(ctx)
const logger = new InternalLogger('BOT')
const lilac = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILD_BANS
        , Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
        , Discord.Intents.FLAGS.GUILD_INTEGRATIONS
        , Discord.Intents.FLAGS.GUILD_INVITES
        , Discord.Intents.FLAGS.GUILD_MEMBERS
        , Discord.Intents.FLAGS.GUILD_MESSAGES
        , Discord.Intents.FLAGS.GUILD_PRESENCES
        , Discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS
        , Discord.Intents.FLAGS.GUILD_VOICE_STATES
        , Discord.Intents.FLAGS.GUILD_WEBHOOKS
        , Discord.Intents.FLAGS.GUILDS
    ]
})

/* initial load of modules, build cache, start bot */
const startBot = async () => {
    logger.log('Starting Lilac2 services...')
    await loader.loadDir(config.bot.extensionsDir)


    
    /* load the other portions of the bot */



    logger.log('All Lilac2 services online!', 'ok')
}

startBot()
