import {
  APIButtonComponent,
  APIButtonComponentWithCustomId,
  APIButtonComponentWithURL,
  APIMessageActionRowComponent,
  APISelectMenuComponent,
  APIStringSelectComponent,
  APIUserSelectComponent,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  MappedComponentBuilderTypes,
  MappedInteractionTypes,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
  UserSelectMenuInteraction,
} from "discord.js";
import { Client, MessageComponentBaseData, OmitType } from "..";

export abstract class MessageComponent<C extends APIMessageActionRowComponent>
  implements MessageComponentBaseData<C>
{
  constructor(public readonly data: C) {}
  abstract readonly builder: MappedComponentBuilderTypes[C["type"]];
  abstract readonly run: (
    int: MappedInteractionTypes[C["type"]]
  ) => Promise<any>;
}

export abstract class SelectMenu<
  C extends APISelectMenuComponent
> extends MessageComponent<C> {}

export class StringSelectMenu extends SelectMenu<APIStringSelectComponent> {
  static builder(data: APIStringSelectComponent): StringSelectMenuBuilder {
    return StringSelectMenuBuilder.from(data);
  }
  builder: StringSelectMenuBuilder;
  constructor(
    data: OmitType<APIStringSelectComponent> & {
      run: (
        interaction: MappedInteractionTypes[ComponentType.StringSelect]
      ) => Promise<any>;
    }
  ) {
    super({ ...data, type: ComponentType.StringSelect });
    this.builder = StringSelectMenu.builder(this.data);
    this.run = data.run;
    Client.components.push(this);
  }
  readonly run: (
    int: MappedInteractionTypes[ComponentType.StringSelect]
  ) => Promise<any>;
}

export class UserSelectMenu extends SelectMenu<APIUserSelectComponent> {
  static builder(data: APIUserSelectComponent): UserSelectMenuBuilder {
    return UserSelectMenuBuilder.from(data);
  }
  builder: UserSelectMenuBuilder;
  constructor(
    data: APIUserSelectComponent & {
      run: (interaction: UserSelectMenuInteraction) => Promise<any>;
    }
  ) {
    super({ ...data, type: ComponentType.UserSelect });
    this.builder = UserSelectMenu.builder(this.data);
    this.run = data.run;
    Client.components.push(this);
  }
  readonly run: (int: UserSelectMenuInteraction) => Promise<any>;
}

export abstract class Button extends MessageComponent<APIButtonComponent> {
  constructor(
    data: APIButtonComponent & {
      run: (interaction: ButtonInteraction) => any;
    }
  ) {
    super(data);
    this.run = data.run;
    if (
      !Client.components.buttons.find(
        (button) =>
          button.data.style != ButtonStyle.Link &&
          data.style != ButtonStyle.Link &&
          button.data.custom_id === data.custom_id
      )
    )
      Client.components.push(this);
  }
  static builder(data: APIButtonComponent): ButtonBuilder {
    return ButtonBuilder.from(data);
  }
  private _builder?: ButtonBuilder;
  get builder(): ButtonBuilder {
    return this._builder
      ? this._builder
      : (this._builder = Button.builder(this.data));
  }
  readonly run: (interaction: ButtonInteraction) => any;
}

export class InteractionButton extends Button {
  constructor(
    data: OmitType<APIButtonComponentWithCustomId> & {
      run: (interaction: ButtonInteraction) => any;
    }
  ) {
    super({ ...data, type: ComponentType.Button });
  }
}

export class LinkButton extends Button {
  constructor(
    data: Omit<OmitType<APIButtonComponentWithURL>, "style"> & {
      run: (interaction: ButtonInteraction) => any;
    }
  ) {
    super({ ...data, type: ComponentType.Button, style: ButtonStyle.Link });
  }
}
