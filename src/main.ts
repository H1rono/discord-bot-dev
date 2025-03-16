import { createBot, Intents } from "@discordeno/bot";

function watchSignal(): Promise<void> {
    return new Promise((resolve) => {
        Deno.addSignalListener("SIGINT", () => {
            resolve();
        });
    });
}

function getToken(): string | undefined {
    return Deno.env.get("DISCORD_TOKEN") ?? (() => {
        console.error("No token provided");
        return undefined;
    })();
}

async function serve(token: string) {
    const bot = createBot({
        token,
        intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
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

const token = getToken() ?? Deno.exit(1);
await serve(token);
Deno.exit(0);
