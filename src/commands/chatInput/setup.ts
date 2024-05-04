import {
  ApplicationCommandType,
  ButtonBuilder,
  ButtonComponent,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  Message,
} from "discord.js";
import {
  Button,
  Buttons,
  Client,
  InteractionButton,
  SlashCommand,
  StringSelectMenu,
} from "..";

export default class extends SlashCommand {
  constructor(name: string) {
    super({
      name,
      description: "first time bot setup",
    });
  }

  async run(int: ChatInputCommandInteraction) {
    await int.reply({
      content: "test",
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            new StringSelectMenu({
              custom_id: "setup_command_types",
              options: [
                {
                  label: "Slash commands",
                  value: "slashcommand",
                },
                {
                  label: "Message context menu commands",
                  value: "messagecommand",
                },
                {
                  label: "User context menu commands",
                  value: "usercommand",
                },
                {
                  label: "extra features",
                  value: "extras",
                },
              ],
              async run(int) {},
            }).builder,
          ],
        },
        // {
        //   type: ComponentType.ActionRow,
        //   components: [
        //     new StringSelectMenu({
        //       custom_id: "setup_commands_menu",
        //       options: [
        //         {
        //           label: "/ticket",
        //           value: "tickets",
        //         },
        //         {
        //           label: "/cope",
        //           value: "cope",
        //         },
        //       ],
        //       async run(int) {
        //         console.log(int.values);
        //       },
        //     }).data,
        //   ],
        // },
      ],
    });
  }
}
