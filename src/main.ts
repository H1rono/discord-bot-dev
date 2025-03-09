import { Bot, createBot, Intents } from "@discordeno/bot";

function watchSignal(): Promise<void> {
    return new Promise((resolve) => {
        Deno.addSignalListener("SIGINT", () => {
            resolve();
        });
    });
}

function loadBot(): Bot | undefined {
    const token = Deno.env.get("DISCORD_TOKEN");
    if (!token) {
        console.error("No token provided");
        return;
    }
    const bot = createBot({
        token,
        intents: [Intents.Guilds, Intents.GuildMessages, Intents.GuildPresences],
    });
    return bot;
}

async function serveBot(bot: Bot) {
    const ctrl_c = watchSignal();
    const start = bot.start();
    await Promise.race([ctrl_c, start]);
    await bot.shutdown();
}

const bot = loadBot() ?? Deno.exit(1);
console.debug("Bot loaded");
await serveBot(bot);
Deno.exit(0);
