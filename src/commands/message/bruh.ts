import {
  ButtonBuilder,
  ButtonComponent,
  ButtonInteraction,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  MessageContextMenuCommandInteraction,
  NewsChannel,
  TimestampStyles,
  time,
} from "discord.js";
import { Button, InteractionButton, MessageContextMenuCommand } from "..";

export default class extends MessageContextMenuCommand {
  // constructor must contain the "name" string variable and be passed into the super or the command will not be registered to Discord by the client.
  constructor(name: string) {
    super({
      name,
    });
  }
  async run(int: MessageContextMenuCommandInteraction) {
    function bruh(
      int: MessageContextMenuCommandInteraction | ButtonInteraction
    ) {
      return int.guild?.channels.cache
        .filter(
          (channel): channel is NewsChannel => channel instanceof NewsChannel
        )
        ?.find((channel) => channel.name.endsWith("bruh"));
    }
    const {
      attachments,
      author,
      channel,
      content,
      createdTimestamp,
      embeds,
      url,
    } = int.targetMessage;

    // let bruh =
    //   int.guild?.channels.cache
    //     .filter(
    //       (c): c is NewsChannel => c.type === ChannelType.GuildAnnouncement
    //     )
    //     .find((c) => c.name.endsWith("bruh")) ||
    //   (await int.guild?.channels.create({
    //     name: "bruh",
    //     type: ChannelType.GuildAnnouncement,
    //   }));

    await int
      .reply({
        content: "Do you want to add this message to " + bruh(int)?.toString(),
        embeds: [
          new EmbedBuilder({
            author: {
              name: author.globalName ?? author.tag,
              icon_url: author.displayAvatarURL(),
            },
            title: "See original message",
            url: url,
            description: [
              content,
              embeds.length || attachments.size
                ? [
                    "*Includes",
                    attachments.size + " attachments,",
                    embeds.length + " embeds",
                    "*",
                  ].join(" ")
                : null,
            ]
              .filter((str): str is string => str != null)
              .join("\n"),
            timestamp: createdTimestamp,
          }),
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              new InteractionButton({
                custom_id: "publish",
                label: "Publish",
                style: ButtonStyle.Primary,
                async run(click) {
                  // console.log(await default.bruh(int).fetchWebhooks());
                  await (
                    (
                      await bruh(click)?.fetchWebhooks()
                    )?.find((w) => w.name === "bruh") ??
                    (await bruh(click)?.createWebhook({
                      name: "bruh",
                      reason: "required for bruh channel",
                    }))
                  )
                    ?.send({
                      username: author.globalName ?? author.tag,
                      avatarURL: author.displayAvatarURL(),
                      content: content,
                      embeds: [
                        ...embeds.values(),
                        new EmbedBuilder({
                          title: "See original message",
                          url: url,
                          description: [
                            "bruhed by",
                            int.user.toString(),
                            "in",
                            channel.toString(),
                            time(Date.now(), TimestampStyles.RelativeTime),
                          ].join(" "),
                          timestamp: createdTimestamp,
                        }),
                      ],
                      files: [...attachments.values()],
                    })
                    .catch(console.error);
                },
              }).data,
              new InteractionButton({
                custom_id: "cancel",
                label: "Cancel",
                style: ButtonStyle.Danger,
                async run(click) {
                  console.log("cancelled");
                },
              }).data,
            ],
          },
        ],
        ephemeral: true,
        fetchReply: true,
      })
      .then(async (reply) => {
        await reply
          .awaitMessageComponent({
            filter: (click) => click.user.id === int.user.id,
            time: 60000,
          })
          .catch(async () => {
            // this.components.map((c) => (c.disabled = true));
            await int.editReply({
              content: "Timed out",
              components: [
                {
                  type: ComponentType.ActionRow,
                  components: [
                    ...reply.components[0].components
                      .filter(
                        (c): c is ButtonComponent =>
                          c instanceof ButtonComponent
                      )
                      .map((c) => ButtonBuilder.from(c).setDisabled()),
                  ],
                },
              ],
            });
          });
        await int.editReply({
          content: "published to " + bruh(int)?.toString(),
          components: [
            // {
            //   type: ComponentType.ActionRow,
            //   components: [],
            // },
            // }),
          ],
        });
      });
  }
}
