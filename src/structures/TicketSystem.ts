import {
  CategoryChannelType,
  ChannelType,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  MappedChannelCategoryTypes,
  Message,
  ModalSubmitInteraction,
} from "discord.js";
import { Buttons, Client, ClientTicketSystem } from "..";

export class TicketSystem implements ClientTicketSystem {
  constructor() {}
  id = 0;
  get forum() {
    return this.get(ChannelType.GuildForum);
  }
  get chats() {
    return this.get(ChannelType.GuildText);
  }

  async post(
    int: ChatInputCommandInteraction | ModalSubmitInteraction,
    thread: Message | undefined,
    ...tags: string[]
  ) {
    await (
      await this.forum
    )?.threads.create({
      name: "#" + this.id,
      message: {
        // content: (int instanceof ChatInputCommandInteraction
        //   ? int.options.getUser("member", true)
        //   : int.user
        // ).toString(),
        embeds: [
          {
            ...thread?.embeds[0].data,
            url: thread?.url,
          },
        ],
        components:
          int instanceof ModalSubmitInteraction
            ? [
                {
                  type: ComponentType.ActionRow,
                  components: [
                    Buttons.claim_ticket.data,
                    Buttons.close_ticket.data,
                  ],
                },
              ]
            : [],
      },
      appliedTags: tags,
    });
  }

  async create(int: ChatInputCommandInteraction | ModalSubmitInteraction) {
    this.id++;
    const user =
      int instanceof ChatInputCommandInteraction
        ? int.options.getUser("member", true)
        : int.user;

    return await (
      await this.chats
    )?.threads
      .create({
        type: ChannelType.PrivateThread,
        name: "Case #" + this.id,
      })
      .then(async (thread) => {
        let message = await thread?.send({
          embeds: [
            new EmbedBuilder({
              author: {
                name: user.tag,
                icon_url: user.displayAvatarURL(),
              },
              title:
                int instanceof ChatInputCommandInteraction
                  ? "You are in jail"
                  : "This is ticket number " + this.id,
              description:
                int instanceof ChatInputCommandInteraction
                  ? ""
                  : "This thread will handle your ticket query. Please wait for a staff member to join the thread and deal with your query. You may write any additional information related to your ticket in this thread.",
              fields:
                int instanceof ChatInputCommandInteraction
                  ? []
                  : [
                      {
                        name: "Ticket subject",
                        value: int.fields.getTextInputValue("ticket_subject"),
                      },
                      {
                        name: "Ticket description",
                        value:
                          int.fields.getTextInputValue("ticket_descriprion"),
                      },
                    ],
            }),
          ],
        });
        await Client.instance.tickets.post(
          int,
          message,
          (
            await this.forum
          )?.availableTags.find((t) =>
            t.name.endsWith(
              int instanceof ChatInputCommandInteraction ? "cope" : "ticket"
            )
          )?.id as string
        );
        await thread.members.add(
          int instanceof ChatInputCommandInteraction
            ? int.options.getUser("member", true)
            : int.user
        );

        if (int instanceof ChatInputCommandInteraction)
          await thread.members.add(int.user);
        return message;
      });
  }

  private async get<
    T extends Exclude<
      CategoryChannelType,
      | ChannelType.GuildVoice
      | ChannelType.GuildAnnouncement
      | ChannelType.GuildStageVoice
      | ChannelType.GuildMedia
    >
  >(type: T) {
    return (
      Client.instance.guilds.cache
        .get(process.env.DEV_GUILD_ID as string)
        ?.channels.cache.filter(
          (channel): channel is MappedChannelCategoryTypes[T] =>
            channel.type === type
        )
        .find(({ name }) => name.endsWith("tickets")) ??
      (await Client.instance.guilds.cache
        .get(process.env.DEV_GUILD_ID as string)
        ?.channels.create<T>({
          type: type,
          name: "tickets",
          availableTags: [
            {
              name: "/ticket",
              emoji: {
                id: null,
                name: "🎟️",
              },
            },
            {
              name: "/cope",
              emoji: {
                id: null,
                name: "🤣",
              },
            },
            {
              name: "resolved",
            },
          ],
        }))
    );
  }
}
