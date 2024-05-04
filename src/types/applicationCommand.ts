import {
  ApplicationCommandType,
  AutocompleteInteraction,
  Awaitable,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  MessageApplicationCommandData,
  MessageContextMenuCommandInteraction,
  UserApplicationCommandData,
  UserContextMenuCommandInteraction,
  ApplicationCommandData,
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
} from "discord.js";
import {
  ApplicationCommand,
  Client,
  MessageActionRowComponents,
  MessageContextMenuCommand,
  RequireFields,
  SlashCommand,
  UserContextMenuCommand,
} from "..";

export type ApplicationCommandBaseData<
  Application extends RequireFields<ApplicationCommandData, "type">
> = {
  // get data(): Application;
  components: MessageActionRowComponents[];
  disabled: boolean;
  builder: Application["type"] extends ApplicationCommandType.ChatInput
    ? SlashCommandBuilder
    : ContextMenuCommandBuilder;
  readonly run: (
    interaction: MappedApplicationCommandInteractionTypes[Application["type"]]
  ) => any;
};

// export type ApplicationCommandData<Type extends ApplicationCommandType> =
//   ApplicationCommandBaseData<Type> & MappedApplicationCommandDataTypes[Type];

// export interface MappedApplicationCommandDataTypes {
//   [ApplicationCommandType.ChatInput]: ChatInputApplicationCommandData;
//   [ApplicationCommandType.Message]: MessageApplicationCommandData;
//   [ApplicationCommandType.User]: UserApplicationCommandData;
// }

export interface MappedApplicationCommandInteractionTypes {
  [ApplicationCommandType.ChatInput]: ChatInputCommandInteraction;
  [ApplicationCommandType.Message]: MessageContextMenuCommandInteraction;
  [ApplicationCommandType.User]: UserContextMenuCommandInteraction;
}

export interface ApplicationCommandCategory {
  name: string;
  commands: SlashCommand[];
}

export interface Autocomplete {
  autocomplete: (
    client: Client,
    int: AutocompleteInteraction
  ) => Awaitable<void>;
}

export type ApplicationCommandTypes =
  | SlashCommand
  | UserContextMenuCommand
  | MessageContextMenuCommand;

export interface ApplicationCommands extends Array<ApplicationCommand<any>> {
  get chatInput(): SlashCommand[];
  get message(): MessageContextMenuCommand[];
  get user(): UserContextMenuCommand[];
  import<C extends ApplicationCommandTypes>(dir?: string): Promise<C[]>;
  populate(): Promise<ApplicationCommandTypes[]>;
}
