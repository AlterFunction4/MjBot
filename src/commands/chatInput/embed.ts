import {
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Client, SlashCommand, debug } from "../..";

export default class extends SlashCommand {
  constructor(name: string) {
    super({
      name,
      description: "Creata an embed and ublish it to a channel",
    });
  }
  async run(int: ChatInputCommandInteraction) {
    const modal1 = new ModalBuilder({
      custom_id: "ec_first_setup",
      title: "Create a new embed",
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            new TextInputBuilder({
              custom_id: "ec_fs_title",
              type: ComponentType.TextInput,
              label: "Embed title",
              placeholder: "Enter an embed title here (optional)",
              style: TextInputStyle.Short,
            }),
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            new TextInputBuilder({
              custom_id: "ec_fs_description",
              type: ComponentType.TextInput,
              label: "Embed description",
              placeholder: "Enter an embed description here (optional)",
              style: TextInputStyle.Paragraph,
            }),
          ],
        },
      ],
    });

    await int.showModal(modal1).then(async () => {
      await int
        .awaitModalSubmit({
          time: 30000,
        })
        .then(async (submit) => {
          const embed = new EmbedBuilder({
            title: submit.fields.getTextInputValue("ec_fs_title"),
            description: submit.fields.getTextInputValue("ec_fs_description"),
          });

          await submit.reply({
            ephemeral: true,
            embeds: [embed],
            components: [
              {
                type: ComponentType.ActionRow,
                components: [
                  {
                    type: ComponentType.Button,
                    custom_id: "ec_publish",
                    style: ButtonStyle.Primary,
                    label: "Publish",
                  },
                ],
              },
            ],
          });
          //   return embed;
        });
    });
  }
}
