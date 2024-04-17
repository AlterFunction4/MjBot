import {
  ApplicationCommandOptionData,
  ApplicationCommandType,
  BaseApplicationCommandData,
  // BaseApplicationCommandData as ApplicationCommandDataBase,
  PermissionResolvable,
  SlashCommandBuilder,
} from "discord.js";
import {
  ApplicationCommandBaseData,
  ApplicationCommandData,
  Client,
  MappedApplicationCommandInteractionTypes,
  MessageActionRowComponents,
  OmitType,
  // TypeOmitted,
} from "..";

export abstract class ApplicationCommand<Type extends ApplicationCommandType>
  implements ApplicationCommandBaseData<Type>
{
  //, ApplicationCommandDataBase
  constructor(data: ApplicationCommandData<Type>) {
    this.name = data.name;
    this.run = data.run;
    this.nsfw = data.nsfw ?? false;
    this.defaultMemberPermissions = data.defaultMemberPermissions ?? "0";
    this.dmPermission = data.dmPermission ?? false;

    this.disabled = data.disabled ?? false;
    this.components = data.components ?? [];
    Client.commands.push(this);
  }

  abstract readonly type: Type;
  readonly name: string;
  readonly nsfw: boolean;
  readonly dmPermission: boolean;
  readonly defaultMemberPermissions: PermissionResolvable;

  readonly components: MessageActionRowComponents[];
  readonly disabled: boolean;
  // readonly components: MessageCom/ponentTypes[];
  readonly run: (
    interaction: MappedApplicationCommandInteractionTypes[Type]
  ) => any;
}

export abstract class SlashCommand
  extends ApplicationCommand<ApplicationCommandType.ChatInput>
  implements ApplicationCommandData<ApplicationCommandType.ChatInput>
{
  constructor(
    data: ApplicationCommandData<ApplicationCommandType.ChatInput> & {
      aliases?: string[];
      components?: MessageActionRowComponents[];
    }
  ) {
    super({ ...data, type: ApplicationCommandType.ChatInput });
    this.options = data.options ?? [];
    this.description = data.description;
  }

  readonly description: string;
  readonly type = ApplicationCommandType.ChatInput;
  readonly options?: readonly ApplicationCommandOptionData[];
}

export abstract class MessageContextMenuCommand
  extends ApplicationCommand<ApplicationCommandType.Message>
  implements ApplicationCommandData<ApplicationCommandType.Message>
{
  constructor(
    data: OmitType<ApplicationCommandData<ApplicationCommandType.Message>>
  ) {
    super({ ...data, type: ApplicationCommandType.Message });

    // this.type = ApplicationCommandType.Message;
  }
  readonly type = ApplicationCommandType.Message;
}

export abstract class UserContextMenuCommand
  extends ApplicationCommand<ApplicationCommandType.User>
  implements ApplicationCommandData<ApplicationCommandType.User>
{
  constructor(
    data: OmitType<ApplicationCommandData<ApplicationCommandType.User>>
  ) {
    super({ ...data, type: ApplicationCommandType.User });

    // this.type = ApplicationCommandType.User;
  }
  readonly type = ApplicationCommandType.User;
}
