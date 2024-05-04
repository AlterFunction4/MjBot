import {
  APIButtonComponent,
  ChannelType,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  ModalSubmitInteraction,
  ThreadChannel,
  User,
} from "discord.js";
import { Buttons, Client, TicketData } from "..";

export class Ticket implements TicketData {
  thread?: ThreadChannel;
  post?: ThreadChannel;
  author?: User;
  subject?: string;
  description?: string;

  private constructor(data: Partial<TicketData>, public id: number) {
    this.thread = data.thread;
    this.post = data.post;
    this.author = data.author;
    this.subject = data.subject;
    this.description = data.description;

    if (!this.thread || !this.post)
      throw "Ticket.thread or Ticket.post is undefined";
    // Client.instance.tickets.cache.add(this.post?.id, this.thread?.id);
  }

  private static get manager() {
    return Client.instance.tickets;
  }

  private static async createThreadChannel() {
    return await this.manager.chats?.threads.create({
      type: ChannelType.PrivateThread,
      name: "Case #" + this.manager.cache.length,
    });
  }

  private static async createForumThread(
    thread?: ThreadChannel,
    ...tags: string[]
  ) {
    return await this.manager.forum?.threads.create({
      name: "#" + this.manager.cache.length,
      message: {
        embeds: [
          {
            ...thread?.lastMessage?.embeds[0].data,
            url: thread?.url,
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              Buttons.claim_ticket.data,
              Buttons.close_ticket.data,
            ] as APIButtonComponent[],
          },
        ],
      },
      appliedTags: this.manager.forum.availableTags
        .filter((tag) => tags.includes(tag.name))
        .map((tag) => tag.id),
    });
  }

  static buildFromJSONCache() {
    this.manager.json.forEach(async ([p, t]) => {
      const post = Client.instance.tickets.forum?.threads.cache.get(p);
      const message = await post?.fetchStarterMessage();

      let data = {
        post: post,
        thread: Client.instance.tickets.chats?.threads.cache.get(t),
        author: Client.instance.users.cache.find(
          (user) => user.tag === message?.embeds[0].author?.name
        ),
        subject: message?.embeds[0].fields[0].value,
        description: message?.embeds[0].fields[1].value,
      };

      Client.instance.tickets.cache.push(
        new this(data, parseInt(post?.name as string))
      );
    });
  }

  private static buildFromModal(int: ModalSubmitInteraction) {
    return {
      author: int.user,
      subject: int.fields.getTextInputValue("ticket_subject"),
      description: int.fields.getTextInputValue("ticket_description"),
    };
  }

  private static buildFromSlashCommand(int: ChatInputCommandInteraction) {
    return {
      author: int.options.getUser("member", true),
      subject: "You are in jail",
      description: "do not attempt to leave",
    };
  }

  static async build(
    int: ChatInputCommandInteraction | ModalSubmitInteraction
  ) {
    let data: TicketData = {
      ...(int.isModalSubmit()
        ? this.buildFromModal(int)
        : this.buildFromSlashCommand(int)),
      thread: await this.createThreadChannel(),
    };

    await data.thread?.send({
      embeds: [
        new EmbedBuilder({
          author: {
            name: data.author?.tag as string,
            iconURL: data.author?.displayAvatarURL(),
          },
          title: "This is ticket number " + this.manager.cache.length,
          description:
            "This thread will handle your ticket query. Please wait for a staff member to join the thread and deal with your query. You may write any additional information related to your ticket in this thread.",
          fields: [
            {
              name: "Ticket subject",
              value: data.subject as string,
            },
            {
              name: "Ticket description",
              value: data.description as string,
            },
          ],
        }),
      ],
    });

    data.post = await this.createForumThread(
      data.thread,
      int.isModalSubmit()
        ? TicketSystemForumTags.Ticket
        : TicketSystemForumTags.Cope
    );

    await data.thread?.members.add(data.author?.id as string);
    if (int.isChatInputCommand()) await data.thread?.members.add(int.user);

    return new this(data, this.manager.cache.length);
  }
}

enum TicketSystemForumTags {
  Cope = "/cope",
  Ticket = "/ticket",
  Resolved = "resolved",
}

enum ClientFeatures {
  Tickets = 0,
  Cope = 1,
  Bruh = 2,
  Embeds = 3,
  TicTacToe = 4,
}

enum TicketSystemForumTagEmojis {
  Cope = "🤣",
  Ticket = "🎟️",
}
