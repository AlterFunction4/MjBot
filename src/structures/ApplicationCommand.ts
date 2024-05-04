import {
  ApplicationCommandData,
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  // ApplicationCommandType,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  MessageApplicationCommandData,
  PermissionResolvable,
  SlashCommandBuilder,
  UserApplicationCommandData,
} from "discord.js";
import {
  ApplicationCommandBaseData,
  Client,
  MappedApplicationCommandInteractionTypes,
  MessageActionRowComponents,
  OmitType,
  RequireFields,
} from "..";

export abstract class ApplicationCommand<
  Application extends RequireFields<ApplicationCommandData, "type">
> implements ApplicationCommandBaseData<Application>
{
  constructor(
    data: RequireFields<Application, "type"> & {
      disabled?: boolean;
      components?: MessageActionRowComponents[];
      // run: (
      //   interaction: MappedApplicationCommandInteractionTypes[Application["type"]]
      // ) => any;
    }
  ) {
    this.disabled = data.disabled ?? false;
    this.components = data.components ?? [];
    // this.run = data.run;

    Client.commands.push(this);
  }

  // abstract get data(): Application;
  abstract builder: Application["type"] extends ApplicationCommandType.ChatInput
    ? SlashCommandBuilder
    : ContextMenuCommandBuilder;

  readonly components: MessageActionRowComponents[];
  readonly disabled: boolean;
  abstract run(
    interaction: MappedApplicationCommandInteractionTypes[Application["type"]]
  ): any;
}

export abstract class SlashCommand extends ApplicationCommand<
  RequireFields<ChatInputApplicationCommandData, "type">
> {
  abstract run(interaction: ChatInputCommandInteraction): Promise<any>;

  static builder(data: ChatInputApplicationCommandData): SlashCommandBuilder {
    let builder = new SlashCommandBuilder()
      .setName(data.name)
      .setDescription(data.description)
      .setNSFW(data.nsfw ?? false)
      .setNameLocalizations(data.nameLocalizations ?? {})
      .setDescriptionLocalizations(data.descriptionLocalizations ?? {})
      .setDMPermission(data.dmPermission)
      .setDefaultMemberPermissions(
        data.defaultMemberPermissions?.toString() ?? 0
      );

    return SlashCommand.buildOptions(builder, data.options ?? []);
    // return builder;
  }

  // get data(): ChatInputApplicationCommandData {
  //   return {
  //     name: this.builder.name,
  //     description: this.builder.description,
  //     nameLocalizations: this.builder.name_localizations,
  //     descriptionLocalizations: this.builder.description_localizations,
  //     defaultMemberPermissions: this.builder.default_member_permissions as PermissionResolvable,
  //     dmPermission: this.builder.dm_permission,
  //     nsfw: this.builder.nsfw,
  //     options: this.builder.options.map(o => o.toJSON()),
  //     // type:
  //   };
  // }
  builder: SlashCommandBuilder;

  constructor(
    data: ChatInputApplicationCommandData & {
      disabled?: boolean;
      aliases?: string[];
      components?: MessageActionRowComponents[];
    }
  ) {
    super({ ...data, type: ApplicationCommandType.ChatInput });
    this.builder = SlashCommand.builder(data);
    console.log(this.builder);
  }
  private static buildOptions(
    builder: SlashCommandBuilder,
    options: readonly ApplicationCommandOptionData[]
  ): SlashCommandBuilder {
    options.forEach((option) => {
      switch (option.type) {
        case ApplicationCommandOptionType.Attachment:
          builder.addAttachmentOption((o) =>
            o
              .setName(option.name)
              .setDescription(option.description)
              .setNameLocalizations(option.nameLocalizations ?? {})
              .setDescriptionLocalizations(
                option.descriptionLocalizations ?? {}
              )
              .setRequired(option.required ?? false)
          );
          break;
        case ApplicationCommandOptionType.Boolean:
          builder.addBooleanOption((o) =>
            o
              .setName(option.name)
              .setDescription(option.description)
              .setNameLocalizations(option.nameLocalizations ?? {})
              .setDescriptionLocalizations(
                option.descriptionLocalizations ?? {}
              )
              .setRequired(option.required ?? false)
          );
          break;
        case ApplicationCommandOptionType.Channel:
          builder.addChannelOption((o) =>
            o
              .setName(option.name)
              .setDescription(option.description)
              .setNameLocalizations(option.nameLocalizations ?? {})
              .setDescriptionLocalizations(
                option.descriptionLocalizations ?? {}
              )
              .setRequired(option.required ?? false)
              .addChannelTypes(
                ...(option.channelTypes ?? option.channel_types ?? [])
              )
          );
          break;
        case ApplicationCommandOptionType.Integer:
          builder.addIntegerOption((o) =>
            o
              .setName(option.name)
              .setDescription(option.description)
              .setNameLocalizations(option.nameLocalizations ?? {})
              .setDescriptionLocalizations(
                option.descriptionLocalizations ?? {}
              )
              .setRequired(option.required ?? false)
              .setAutocomplete(option.autocomplete ?? false)
              .setMaxValue(option.maxValue ?? option.max_value ?? 0)
              .setMinValue(option.minValue ?? option.min_value ?? 0)
          );
          break;
        case ApplicationCommandOptionType.Mentionable:
          builder.addMentionableOption((o) =>
            o
              .setName(option.name)
              .setDescription(option.description)
              .setNameLocalizations(option.nameLocalizations ?? {})
              .setDescriptionLocalizations(
                option.descriptionLocalizations ?? {}
              )
              .setRequired(option.required ?? false)
          );
          break;
        case ApplicationCommandOptionType.Number:
          builder.addNumberOption((o) =>
            o
              .setName(option.name)
              .setDescription(option.description)
              .setNameLocalizations(option.nameLocalizations ?? {})
              .setDescriptionLocalizations(
                option.descriptionLocalizations ?? {}
              )
              .setRequired(option.required ?? false)
              .setAutocomplete(option.autocomplete ?? false)
              .setMaxValue(option.maxValue ?? option.max_value ?? 0)
              .setMinValue(option.minValue ?? option.max_value ?? 0)
          );
          break;
        case ApplicationCommandOptionType.Role:
          builder.addRoleOption((o) =>
            o
              .setName(option.name)
              .setDescription(option.description)
              .setNameLocalizations(option.nameLocalizations ?? {})
              .setDescriptionLocalizations(
                option.descriptionLocalizations ?? {}
              )
              .setRequired(option.required ?? false)
          );
          break;
        case ApplicationCommandOptionType.String:
          builder.addStringOption((o) =>
            o
              .setName(option.name)
              .setDescription(option.description)
              .setNameLocalizations(option.nameLocalizations ?? {})
              .setDescriptionLocalizations(
                option.descriptionLocalizations ?? {}
              )
              .setRequired(option.required ?? false)
              .setAutocomplete(option.autocomplete ?? false)
              .setMaxLength(option.maxLength ?? option.max_length ?? 0)
              .setMinLength(option.minLength ?? option.min_length ?? 0)
          );
          break;
        case ApplicationCommandOptionType.Subcommand:
          builder.addSubcommand(
            (s) =>
              s
                .setName(option.name)
                .setDescription(option.description)
                .setNameLocalizations(option.nameLocalizations ?? {})
                .setDescriptionLocalizations(
                  option.descriptionLocalizations ?? {}
                )
            // .setRequired(option.required ?? false)
          );
          break;
        case ApplicationCommandOptionType.SubcommandGroup:
          builder.addSubcommandGroup(
            (o) =>
              o
                .setName(option.name)
                .setDescription(option.description)
                .setNameLocalizations(option.nameLocalizations ?? {})
                .setDescriptionLocalizations(
                  option.descriptionLocalizations ?? {}
                )
            // .setRequired(option.required ?? false)
          );
          break;
        case ApplicationCommandOptionType.User:
          builder.addUserOption((o) =>
            o
              .setName(option.name)
              .setDescription(option.description)
              .setNameLocalizations(option.nameLocalizations ?? {})
              .setDescriptionLocalizations(
                option.descriptionLocalizations ?? {}
              )
              .setRequired(option.required ?? false)
          );
          break;
        default:
          throw "unexpected application command option type";
      }
    });
    return builder;
  }
}

export abstract class ContextMenuCommand extends ApplicationCommand<
  MessageApplicationCommandData | UserApplicationCommandData
> {
  constructor(
    data: MessageApplicationCommandData | UserApplicationCommandData
  ) {
    super(data);
    this.builder = ContextMenuCommand.builder(data);
  }

  get data() {
    return this.builder;
  }

  static builder(
    data: MessageApplicationCommandData | UserApplicationCommandData
  ): ContextMenuCommandBuilder {
    return new ContextMenuCommandBuilder()
      .setName(data.name)
      .setNameLocalizations(data.nameLocalizations ?? {})
      .setType(data.type)
      .setDMPermission(data.dmPermission)
      .setDefaultMemberPermissions(
        data.defaultMemberPermissions?.toString() ?? null
      );

    // data.nameLocalizations?.
  }

  builder: ContextMenuCommandBuilder;
}

export abstract class MessageContextMenuCommand extends ContextMenuCommand {
  // implements ApplicationCommandData<ApplicationCommandType.Message>
  constructor(data: OmitType<MessageApplicationCommandData>) {
    super({ ...data, type: ApplicationCommandType.Message });

    // this.type = ApplicationCommandType.Message;
  }
  // readonly type = ApplicationCommandType.Message;
}

export abstract class UserContextMenuCommand extends ContextMenuCommand {
  // implements ApplicationCommandData<ApplicationCommandType.User>
  constructor(data: OmitType<UserApplicationCommandData>) {
    super({ ...data, type: ApplicationCommandType.User });

    // this.type = ApplicationCommandType.User;
  }
  // readonly type = ApplicationCommandType.User;
}
