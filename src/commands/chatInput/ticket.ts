import {
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  PermissionFlagsBits,
  TextInputStyle,
} from "discord.js";
import { Client, Modal, SlashCommand } from "..";

export default class extends SlashCommand {
  constructor(name: string) {
    super({
      name,
      description: "ticket system",
      defaultMemberPermissions: PermissionFlagsBits.UseApplicationCommands,
      components: [],
      async run(int: ChatInputCommandInteraction) {
        await int.showModal(
          new Modal({
            customId: "ticket_modal",
            title: "Create a staff ticket",
            components: [
              {
                type: ComponentType.ActionRow,
                components: [
                  {
                    type: ComponentType.TextInput,
                    customId: "ticket_subject",
                    placeholder: "Write your query subject",
                    label: "Ticket subject",
                    style: TextInputStyle.Short,
                    required: true,
                  },
                ],
              },
              {
                type: ComponentType.ActionRow,
                components: [
                  {
                    type: ComponentType.TextInput,
                    customId: "ticket_description",
                    placeholder: "Write a short description of your query",
                    label: "Ticket description",
                    style: TextInputStyle.Paragraph,
                    required: true,
                  },
                ],
              },
            ],
            async run(submit) {
              await submit.deferReply({
                ephemeral: true,
              });
              await Client.instance.tickets
                .create(submit)
                .then(async (thread) => {
                  await submit.followUp({
                    embeds: [
                      new EmbedBuilder({
                        description:
                          "Ticket created in " + thread?.channel.toString(),
                      }),
                    ],
                  });
                });
            },
          })
        );
      },
    });
  }
}
