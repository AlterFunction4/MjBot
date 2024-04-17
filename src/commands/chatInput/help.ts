import { ChatInputCommandInteraction } from "discord.js";
import { Client, SlashCommand, debug } from "../..";

export default class extends SlashCommand {
  constructor(name: string) {
    super({
      name,
      description:
        "Help with " + Client.instance.user?.username ??
        process.env.npm_package_name,
      async run(int: ChatInputCommandInteraction) {
        debug("helping");
      },
    });
  }
}
