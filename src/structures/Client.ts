import {
  APIButtonComponent,
  APISelectMenuComponent,
  APIStringSelectComponent,
  APIUserSelectComponent,
  ButtonStyle,
  ComponentType,
  Client as DiscordClient,
  GatewayIntentBits,
  Partials,
  SelectMenuType,
  Snowflake,
  UserSelectMenuComponent,
  WebhookClient,
} from "discord.js";
import { config } from "dotenv";
import { readdirSync, statSync } from "fs";
import { dirname, join } from "path";
import {
  Button,
  Config,
  InteractionButton,
  LinkButton,
  MessageComponent,
  MessageContextMenuCommand,
  Modal,
  SlashCommand,
  StringSelectMenu,
  TicketSystem,
  UserContextMenuCommand,
  UserSelectMenu,
} from ".";
import {
  ApplicationCommandTypes,
  ApplicationCommands,
  ButtonComponents,
  ClientApplicationIntegration,
  MessageActionRowComponents,
  MessageComponents,
  SelectMenu,
  SelectMenuComponents,
} from "..";

export class Client
  extends DiscordClient
  implements ClientApplicationIntegration
{
  static config = new Config();
  static modals = new (class extends Array<Modal> {})();

  static commands: ApplicationCommands = new (class
    extends Array<ApplicationCommandTypes>
    implements ApplicationCommands
  {
    get chatInput(): SlashCommand[] {
      return this.filter(
        (application): application is SlashCommand =>
          application instanceof SlashCommand
      );
    }

    get message() {
      return this.filter(
        (application): application is MessageContextMenuCommand =>
          application instanceof MessageContextMenuCommand
      );
    }

    get user() {
      return this.filter(
        (application): application is UserContextMenuCommand =>
          application instanceof UserContextMenuCommand
      );
    }

    async populate(): Promise<ApplicationCommandTypes[]> {
      return this.splice(0, this.length, ...(await this.import()));
    }

    async import<C extends ApplicationCommandTypes>(
      dir: string = join(dirname(__dirname), "commands")
    ): Promise<C[]> {
      return await Promise.all(
        readdirSync(dir)
          .filter((folder) => statSync(join(dir, folder)).isDirectory())
          .map((folder) =>
            readdirSync(join(dir, folder))
              .filter((file) => file.endsWith(".js"))
              .map((file) => ({
                dir,
                folder,
                file,
              }))
          )
          .flatMap((paths) =>
            paths.map(
              async ({ dir, folder, file }) =>
                await import(join(dir, folder, file))
                  .then(({ default: Module }) => {
                    console.log(file);
                    return new Module(file.split(".")[0]);
                  })
                  .catch((err) => {
                    throw err;
                  })
            )
          )
      );
    }
  })();

  static components: MessageComponents = new (class
    extends Array<MessageActionRowComponents>
    implements MessageComponents
  {
    get buttons(): ButtonComponents {
      return new (class extends Array<Button> {
        get interaction() {
          return this.filter(
            (b): b is InteractionButton => b instanceof InteractionButton
          );
        }
        get link() {
          return this.filter((b): b is LinkButton => b instanceof LinkButton);
        }
      })(
        ...this.filter(
          (component): component is Button => component instanceof Button
        )
      );
    }

    get selectMenus(): SelectMenuComponents {
      return new (class extends Array<
        Exclude<MessageActionRowComponents, Button>
      > {
        get string() {
          return this.filter(
            (menu): menu is StringSelectMenu => menu instanceof StringSelectMenu
          );
        }
        get user() {
          return this.filter(
            (menu): menu is UserSelectMenu => menu instanceof UserSelectMenu
          );
        }
      })(
        ...this.filter(
          (
            component
          ): component is Exclude<MessageActionRowComponents, Button> =>
            component instanceof SelectMenu
        )
      );
    }
  })();

  static instance = new this({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [
      Partials.Channel,
      Partials.GuildMember,
      Partials.Message,
      Partials.User,
    ],
  });

  tickets = new TicketSystem();

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

void Client.start().then(() => {
  Client.config.test4 = 123;
  console.log(Client.config);
  Client.config.save();
});
