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
  JSONEncodable,
  MappedComponentBuilderTypes,
  MappedInteractionTypes,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
  UserSelectMenuInteraction,
} from "discord.js";
import {
  Client,
  InteractionButtonStyle,
  MessageComponentData,
  OmitType,
} from "..";

export abstract class MessageComponent<C extends APIMessageActionRowComponent>
  implements MessageComponentData<C>
{
  constructor(data: C | JSONEncodable<C>) {}
  abstract get data(): Partial<C>;
  // static builder(data: APIMessageActionRowComponent | JSONEncodable<APIMessageActionRowComponent>): MessageActionRowComponentBuilder
  abstract readonly builder: MappedComponentBuilderTypes[C["type"]];
  abstract readonly run: (
    int: MappedInteractionTypes[C["type"]]
  ) => Promise<any>;
}

export abstract class SelectMenu<
  C extends APISelectMenuComponent
> extends MessageComponent<C> {}

export class StringSelectMenu extends SelectMenu<APIStringSelectComponent> {
  get data() {
    return this.builder.data;
  }
  static builder(
    data: APIStringSelectComponent | JSONEncodable<APIStringSelectComponent>
  ): StringSelectMenuBuilder {
    return StringSelectMenuBuilder.from(data);
  }
  builder: StringSelectMenuBuilder;
  constructor(
    data: (
      | OmitType<APIStringSelectComponent>
      | JSONEncodable<APIStringSelectComponent>
    ) & {
      run: (
        interaction: MappedInteractionTypes[ComponentType.StringSelect]
      ) => Promise<any>;
    }
  ) {
    super({ ...data, type: ComponentType.StringSelect });
    this.builder = StringSelectMenu.builder({
      ...data,
      type: ComponentType.StringSelect,
    });
    this.run = data.run;
    Client.components.push(this);
  }
  readonly run: (
    int: MappedInteractionTypes[ComponentType.StringSelect]
  ) => Promise<any>;
}

export class UserSelectMenu extends SelectMenu<APIUserSelectComponent> {
  get data() {
    return this.builder.data;
  }

  static builder(
    data: APIUserSelectComponent | JSONEncodable<APIUserSelectComponent>
  ): UserSelectMenuBuilder {
    return UserSelectMenuBuilder.from(data);
  }
  builder: UserSelectMenuBuilder;
  constructor(
    data: (
      | OmitType<APIUserSelectComponent>
      | JSONEncodable<APIUserSelectComponent>
    ) & {
      run: (interaction: UserSelectMenuInteraction) => Promise<any>;
    }
  ) {
    super({ ...data, type: ComponentType.UserSelect });
    this.builder = UserSelectMenu.builder({
      ...data,
      type: ComponentType.UserSelect,
    });
    this.run = data.run;
    Client.components.push(this);
  }
  readonly run: (int: UserSelectMenuInteraction) => Promise<any>;
}

export abstract class MessageButton<
  Style extends ButtonStyle
> extends MessageComponent<APIButtonComponent> {
  readonly builder: ButtonBuilder;
  readonly run: (interaction: ButtonInteraction) => Promise<any>;
  // get data() {
  //   return this.builder.data as APIButtonComponentWithCustomId;
  // }
  static builder(
    data: APIButtonComponent | JSONEncodable<APIButtonComponent>
  ): ButtonBuilder {
    return ButtonBuilder.from(data);
  }

  constructor(
    data: (APIButtonComponent | JSONEncodable<APIButtonComponent>) & {
      run: (interaction: ButtonInteraction) => any;
    }
  ) {
    super(data);
    this.builder = MessageButton.builder(data);
    this.run = data.run;
  }
}

// export abstract class Buttonn extends MessageComponent<APIButtonComponent> {
//   // readonly builder: ButtonBuilder;

//   constructor(
//     data: (OmitType<APIButtonComponent> | JSONEncodable<APIButtonComponent>) & {
//       run: (interaction: ButtonInteraction) => any;
//     }
//   ) {
//     super({ ...data, type: ComponentType.Button });
//     // this.builder = Button.builder({...data, type : ComponentType.Button});
//     this.run = data.run;

//     if (
//       !Client.components.buttons.interaction.find(({ data }) => {
//         // const {style, custom_id} = data;

//         // if (
//         //   data.style != ButtonStyle.Link &&
//         //   this.data.style != ButtonStyle.Link
//         // ) {
//         return data.custom_id === this.data.custom_id;
//         // }
//       })
//     )
//       Client.components.push(this);
//   }
//   get data() {
//     return this.builder.data as APIButtonComponentWithCustomId;
//   }
//   static builder(
//     data: APIButtonComponent | JSONEncodable<APIButtonComponent>
//   ): ButtonBuilder {
//     return ButtonBuilder.from(data);
//   }
//   // builder: ButtonBuilder;
//   readonly run: (interaction: ButtonInteraction) => any;
// }

export class InteractionButton extends MessageButton<InteractionButtonStyle> {
  get data(): APIButtonComponentWithCustomId {
    return this.builder.data as APIButtonComponentWithCustomId;
  }

  constructor(
    data: (
      | OmitType<APIButtonComponentWithCustomId>
      | JSONEncodable<APIButtonComponentWithCustomId>
    ) & {
      run: (interaction: ButtonInteraction) => any;
    }
  ) {
    super({ ...data, type: ComponentType.Button });
    this.builder = MessageButton.builder({
      ...data,
      type: ComponentType.Button,
    });
  }
  builder: ButtonBuilder;
}

export class LinkButton extends MessageButton<ButtonStyle.Link> {
  get data(): APIButtonComponentWithURL {
    return this.builder.data as APIButtonComponentWithURL;
  }
  constructor(
    data: (
      | APIButtonComponentWithURL
      | JSONEncodable<APIButtonComponentWithURL>
    ) & {
      run: (interaction: ButtonInteraction) => any;
    }
  ) {
    super(data);
    this.builder = MessageButton.builder(data);
  }
  builder: ButtonBuilder;
}
