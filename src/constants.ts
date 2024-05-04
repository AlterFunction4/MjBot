import { ButtonStyle, Component, ComponentType } from "discord.js";
import { Button, Client, InteractionButton, MessageButton, debug } from ".";
import ticket from "./commands/chatInput/ticket";

export const Buttons: Record<string, InteractionButton> = {
  send_error: new InteractionButton({
    custom_id: "report_error",
    label: "Send error report",
    style: ButtonStyle.Primary,
    async run(click) {
      await click.message.edit({
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              MessageButton.builder(click.component)
                .setLabel("Error report sent")
                .setStyle(ButtonStyle.Success)
                .setDisabled(true),
            ],
          },
        ],
      });
      await click.deferUpdate();
    },
  }),
  claim_ticket: new InteractionButton({
    custom_id: "join_ticket",
    label: "Join ticket",
    style: ButtonStyle.Primary,
    async run(int) {
      const ticket = Client.instance.tickets.cache.find(
        (ticket) => ticket.post?.id === int.channel?.id
      );
      if (
        !(await ticket?.thread?.members.fetch())?.find(
          (member) => member.user?.id === int.user.id
        )
      ) {
        await ticket?.thread?.members.add(int.user);
        await int.deferUpdate();
        await int.channel?.send({
          content: int.user.username + " has joined the ticket thread.",
        });
      } else
        await int.reply({
          content: "You have already joined this ticket thread.",
          ephemeral: true,
        });
    },
  }),
  close_ticket: new InteractionButton({
    custom_id: "close_ticket",
    label: "Close ticket",
    style: ButtonStyle.Danger,
    async run(int) {
      const [_, channel] =
        int.message.embeds[0].url?.split("/").reverse() ?? [];
      const ticket = Client.instance.tickets.cache.find(
        (ticket) => ticket.post?.id === int.channel?.id
      );

      setTimeout(
        async () =>
          await ticket?.thread?.setLocked(
            true,
            "ticket closed by " + int.user.toString() + " 5 minutes ago."
          ),
        1000 * 60 * 5
      );

      await int.channel?.send({
        content: int.user.username + " has closed the ticket thread.",
      });

      await ticket?.thread?.send({
        embeds: [
          {
            title: "Ticket closed",
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              new InteractionButton({
                custom_id: "ticket_rate_good",
                style: ButtonStyle.Primary,
                emoji: { name: "👍" },
                async run(int) {},
              }).data,
              new InteractionButton({
                custom_id: "ticket_rate_bad",
                style: ButtonStyle.Primary,
                emoji: { name: "👎" },
                async run(int) {},
              }).data,
            ],
          },
        ],
      });
    },
  }),
};
