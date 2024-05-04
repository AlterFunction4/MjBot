import {
  Client as DiscordClient,
  GatewayIntentBits,
  Guild,
  Partials,
  Snowflake,
  WebhookClient,
} from "discord.js";
import { config } from "dotenv";
import { dirname, join } from "path";
import {
  ApplicationCommandManager,
  MessageComponentManager,
  Modal,
  TicketManager,
} from ".";
import {
  ApplicationCommands,
  ClientApplicationIntegration,
  MessageComponents,
} from "..";

export class Client
  extends DiscordClient
  implements ClientApplicationIntegration
{
  static instance = new this({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
    partials: [
      Partials.Channel,
      Partials.GuildMember,
      Partials.Message,
      Partials.User,
    ],
  });

  get guild() {
    return (
      this.guilds.cache.get(process.env.DEFAULT_GUILD_ID as string) ??
      this.guilds.cache.get(process.env.DEV_GUILD_ID as string)
    );
  }

  static commands: ApplicationCommands = new ApplicationCommandManager();
  static components: MessageComponents = new MessageComponentManager();
  static modals = new (class extends Array<Modal> {})();

  tickets = new TicketManager();

  webhook = new WebhookClient(
    {
      url: "https://discord.com/api/webhooks/858337191410401300/kdShqAXeUAjm7NWGu9Fxo0IvtyQJ8VqwIJbCtTYVNDpzZy_nWgvcwGtFdGn_8HmPCn6u",
    },
    {
      allowedMentions: { parse: [] },
    }
  );

  static async start() {
    return await this.instance.start();
  }

  private async start(): Promise<void> {
    config();
    await import(join(dirname(__dirname), "events", "index"));
    await Client.commands.import();
    await this.login(process.env.BOT_TOKEN);
  }

  resolve(id: Snowflake) {
    return (
      this.guilds.resolve(id) ??
      this.users.resolve(id) ??
      this.channels.resolve(id)
    );
  }

  async fetch(id: Snowflake) {
    return (
      (await this.guilds.fetch(id)) ??
      (await this.users.fetch(id)) ??
      (await this.channels.fetch(id))
    );
  }
}

export function debug(message: any) {
  Client.instance.emit("debug", message);
}

void Client.start();
