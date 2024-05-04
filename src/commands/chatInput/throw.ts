import { ChatInputCommandInteraction } from "discord.js";
import { SlashCommand } from "..";

export default class extends SlashCommand {
  constructor(name: string) {
    super({
      name,
      description: "throw an intentional error",
    });
  }
  async run(int: ChatInputCommandInteraction) {
    throw "Intentional error";
  }
}
