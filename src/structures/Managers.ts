import {
  ForumChannel,
  ChannelType,
  TextChannel,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  CategoryChannelType,
  MappedChannelCategoryTypes,
  ButtonStyle,
} from "discord.js";
import { readdirSync, statSync } from "fs";
import { dirname, join } from "path";
import {
  Button,
  ApplicationCommandTypes,
  ApplicationCommands,
  ButtonComponents,
  ClientTicketSystem,
  MessageActionRowComponents,
  MessageComponents,
  SelectMenuComponents,
} from "..";
import {
  Client,
  InteractionButton,
  JSONCache,
  LinkButton,
  MessageButton,
  MessageContextMenuCommand,
  SelectMenu,
  SlashCommand,
  StringSelectMenu,
  Ticket,
  UserContextMenuCommand,
  UserSelectMenu,
} from ".";

export class ApplicationCommandManager
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
}

export class MessageComponentManager
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
        (component): component is Button =>
          component instanceof InteractionButton ||
          component instanceof LinkButton
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
        (component): component is Exclude<MessageActionRowComponents, Button> =>
          component instanceof SelectMenu
      )
    );
  }
}

export class TicketManager implements ClientTicketSystem {
  constructor() {
    // this.buildTicketsFromJSONCache();
  }

  json = new JSONCache(join(process.cwd(), "data/tickets.json"));
  cache: Ticket[] = [];

  get forum(): ForumChannel | undefined {
    return this.getChannel(ChannelType.GuildForum);
  }

  get chats(): TextChannel | undefined {
    return this.getChannel(ChannelType.GuildText);
  }

  async add(int: ChatInputCommandInteraction | ModalSubmitInteraction) {
    return Ticket.build(int).then((ticket) => {
      this.cache.push(ticket);
      this.json.add([ticket.post?.id as string, ticket.thread?.id]);
      console.log(this.cache);
      return ticket;
    });
  }

  private getChannel<
    T extends Exclude<
      CategoryChannelType,
      | ChannelType.GuildVoice
      | ChannelType.GuildAnnouncement
      | ChannelType.GuildStageVoice
      | ChannelType.GuildMedia
    >
  >(type: T) {
    return Client.instance.guild?.channels.cache
      .filter(
        (channel): channel is MappedChannelCategoryTypes[T] =>
          channel.type === type
      )
      .find(({ name }) => name.endsWith("tickets"));
  }
}
