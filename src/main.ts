import { createBot, Intents } from "@discordeno/bot";

function watchSignal(): Promise<void> {
    return new Promise((resolve) => {
        Deno.addSignalListener("SIGINT", () => {
            resolve();
        });
    });
}

async function serve() {
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
    console.debug("Bot started");
    await watchSignal();
    console.debug("Shutting down bot");
    await bot.shutdown();
}

await serve();
Deno.exit(0);
