import {
  ButtonBuilder,
  ButtonComponent,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  Message,
} from "discord.js";
import { Button, Client, SlashCommand, StringSelectMenu } from "..";

export default class extends SlashCommand {
  constructor(name: string) {
    super({
      name,
      description: "first time bot setup",
      async run(int: ChatInputCommandInteraction) {
        await int.reply({
          content: "test",
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                new StringSelectMenu({
                  custom_id: "testmenu",
                  options: [
                    {
                      label: "key",
                      value: "value",
                    },
                  ],
                  async run(int) {
                    console.log("this works");
                  },
                }).data,
              ],
            },
          ],
        });
      },
    });
  }
}
