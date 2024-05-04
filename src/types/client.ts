import {
  ClientEvents,
  Client as DiscordClient,
  ThreadChannel,
  User,
} from "discord.js";

export type ClientEvent<K extends keyof ClientEvents> = {
  name: K;
  once?: boolean;
  run(...meta: ClientEvents[K]): Promise<any>;
};

export type ClientApplicationIntegration = DiscordClient & {
  // commands: ApplicationCommands;
  // components: MessageComponents;
  tickets: ClientTicketSystem;
};

export interface ClientTicketSystem {
  // get chats(): Promise<TextChannel>;
  // get forum(): Promise<ForumChannel>;
}

export interface TicketData {
  // case: number;
  author?: User;
  subject?: string;
  description?: string;
  thread?: ThreadChannel;
  post?: ThreadChannel;
}
