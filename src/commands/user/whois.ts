import {
  ApplicationCommandType,
  ButtonStyle,
  ComponentType,
  GuildMember,
  TextInputStyle,
  TimestampStyles,
  UserContextMenuCommandInteraction,
  time,
} from "discord.js";
import { Client, Button, UserContextMenuCommand, InteractionButton } from "..";

export default class extends UserContextMenuCommand {
  constructor(name: string) {
    super({
      name,
      // type: ApplicationCommandType.User,
      async run(int: UserContextMenuCommandInteraction) {
        const target =
          int.guild?.members.cache.get(
            int.targetMember?.user.id ?? int.targetUser.id
          ) ?? int.targetUser;

        const targetUser = target instanceof GuildMember ? target.user : target;

        // this.components.find(component => component.customId == "change_nickname")?.placeholder
        await int
          .reply({
            ephemeral: true,
            embeds: [
              {
                description: target.toString(),
                thumbnail: {
                  url: target.displayAvatarURL(),
                },
                title: targetUser.tag,
                fields: [
                  {
                    name:
                      target instanceof GuildMember
                        ? "Joined " +
                          int.guild?.name +
                          time(Date.now(), TimestampStyles.RelativeTime)
                        : "\u200B",
                    value:
                      "Joined Discord " +
                      time(
                        targetUser.createdTimestamp,
                        TimestampStyles.RelativeTime
                      ),
                  },
                ],
              },
            ],
            components:
              target instanceof GuildMember
                ? [
                    {
                      type: ComponentType.ActionRow,
                      components: [
                        new InteractionButton({
                          custom_id: "remove_characters",
                          label: "Remove special characters",
                          style: ButtonStyle.Primary,
                          run: async (click) => console.log(click),
                        }).data,

                        new InteractionButton({
                          custom_id: "change_nickname",
                          label: "Change nickname",
                          style: ButtonStyle.Secondary,
                          run: async (click) => {
                            await click.showModal({
                              customId: "change_nickname_modal",
                              title: "Change nickname",
                              components: [
                                {
                                  type: ComponentType.ActionRow,
                                  components: [
                                    {
                                      type: ComponentType.TextInput,
                                      customId: "change_nickname_modal_input",
                                      label: "New nickname",
                                      placeholder:
                                        click.guild?.members.cache.find(
                                          (member) =>
                                            member.user.tag ==
                                            click.message.embeds[0].title
                                        )?.displayName ??
                                        Client.instance.users.cache.find(
                                          (user) =>
                                            user.tag ==
                                            click.message.embeds[0].title
                                        )?.displayName,
                                      style: TextInputStyle.Short,
                                      required: true,
                                    },
                                  ],
                                },
                              ],
                            });
                          },
                        }).data,
                      ],
                    },
                  ]
                : [],
          })
          .catch(console.error);
      },
    });
  }
}
