import { Bot, createBot, Intents } from "@discordeno/bot";

function watchSignal(): Promise<void> {
    return new Promise((resolve) => {
        Deno.addSignalListener("SIGINT", () => {
            resolve();
        });
    });
}

async function loadBot(): Promise<Bot | undefined> {
    const token = Deno.env.get("DISCORD_TOKEN");
    if (!token) {
        console.error("No token provided");
        return;
    }
    const bot = createBot({
        token,
        intents: Intents.Guilds,
        events: {
            ready() {
                console.log("Bot is ready");
            },
        },
    });
    await bot.start();
    return bot;
}

async function serveBot(bot: Bot) {
    await watchSignal();
    console.debug("Shutting down bot");
    await bot.shutdown();
}

const bot = await loadBot() ?? Deno.exit(1);
console.debug("Bot loaded");
await serveBot(bot);
Deno.exit(0);
