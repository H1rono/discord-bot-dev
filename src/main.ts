import { Bot, createBot } from "@discordeno/bot";

function watchSignal(): Promise<void> {
    console.log("Watching for SIGINT");
    return new Promise((resolve) => {
        Deno.addSignalListener("SIGINT", () => {
            console.log("Received SIGINT");
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
        intents: ["Guilds", "GuildMessages"],
    });
    return bot;
}

async function serveBot(bot: Bot) {
    const ctrl_c = watchSignal();
    const start = bot.start().then(() => {
        console.log("Bot start end");
    });
    await Promise.race([ctrl_c, start]);
    console.log("Shutting down bot");
    await bot.shutdown();
    console.log("Bot shutdown");
}

const bot = loadBot()!;
console.debug("Bot loaded");
await serveBot(bot);
Deno.exit(0);
