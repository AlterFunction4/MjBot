import {
  ApplicationCommandType,
  MessageContextMenuCommandInteraction,
  parseResponse,
} from "discord.js";
import { Client, MessageContextMenuCommand } from "..";
import fetch from "node-fetch";

export default class extends MessageContextMenuCommand {
  constructor(name: string) {
    super({
      name,
      // type: ApplicationCommandType.Message,
    });
  }
  async run(int: MessageContextMenuCommandInteraction) {
    const [message, channel, guild] =
      int.targetMessage.embeds[0].url?.split("/").reverse() ?? [];
    console.log(
      Client.instance.resolve(message),
      Client.instance.resolve(channel),
      Client.instance.resolve(guild)
    );
    // const res = await parseResponse(await fetch(int.targetMessage.embeds[0].url as unknown as URL));
  }
}
