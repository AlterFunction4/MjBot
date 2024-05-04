import {
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Client, SlashCommand } from "..";

export default class extends SlashCommand {
  constructor(name: string) {
    super({
      name,
      description: "cope bitch",
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "member",
          description: "Member of the server to cope on",
          required: true,
        },
      ],
    });
  }
  async run(int: ChatInputCommandInteraction) {
    await Client.instance.tickets.add(int);
  }
}
