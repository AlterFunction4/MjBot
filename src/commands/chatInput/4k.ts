import { ChatInputCommandInteraction } from "discord.js";
import fetch from "node-fetch";
import { Client, SlashCommand } from "..";

export default class extends SlashCommand {
  constructor(name: string) {
    super({
      name,
      description: "caught in 4k",
      async run(int: ChatInputCommandInteraction) {
        // await fetch()
      },
    });
  }
}
