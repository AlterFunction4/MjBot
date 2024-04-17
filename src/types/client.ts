import { ClientEvents, Client as DiscordClient } from "discord.js";
import { ApplicationCommands, MessageComponents } from ".";

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
