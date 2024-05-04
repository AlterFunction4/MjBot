import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Client, SlashCommand } from "..";

export default class extends SlashCommand {
  constructor(name: string) {
    super({
      name,
      description: "Complementary slash command for the bruh menu command",
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "settings",
          description: "/bruh context menu settings",
        },
      ],
    });
  }
  async run(int: ChatInputCommandInteraction) {
    switch (int.options.getSubcommand()) {
      case "settings":
        await int.reply({
          embeds: [
            new EmbedBuilder({
              author: {
                name: "bruh settings",
              },
            }),
          ],
        });
        break;
      default:
        throw "unexpected subcommand";
    }
  }
}
