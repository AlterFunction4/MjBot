import {
  Awaitable,
  MappedInteractionTypes,
  MappedComponentBuilderTypes,
  APIMessageActionRowComponent,
  ButtonStyle,
  JSONEncodable,
} from "discord.js";
import {
  InteractionButton,
  LinkButton,
  MessageComponent,
  StringSelectMenu,
  UserSelectMenu,
} from "..";

export interface MessageComponentData<
  Component extends APIMessageActionRowComponent
> {
  // new (data: Component | JSONEncodable<Component>): MessageComponent<Component>;
  get data(): Partial<Component>;
  builder: MappedComponentBuilderTypes[Component["type"]];
  readonly run: (
    int: MappedInteractionTypes[Component["type"]]
  ) => Awaitable<any>;
}

export interface MessageComponents extends Array<MessageActionRowComponents> {
  get buttons(): ButtonComponents;
  get selectMenus(): SelectMenuComponents;
}

export interface ButtonComponents extends Array<Button> {
  get interaction(): InteractionButton[];
  get link(): LinkButton[];
}

export interface SelectMenuComponents
  extends Array<Exclude<MessageActionRowComponents, Button>> {
  get string(): StringSelectMenu[];
  get user(): UserSelectMenu[];
}

export type Button = InteractionButton | LinkButton;

export type MessageActionRowComponents =
  | Button
  | StringSelectMenu
  | UserSelectMenu;

export type InteractionButtonStyle = Exclude<ButtonStyle, ButtonStyle.Link>;
