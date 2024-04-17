import {
  Awaitable,
  MappedInteractionTypes,
  MappedComponentBuilderTypes,
  APIMessageActionRowComponent,
} from "discord.js";
import {
  Button,
  InteractionButton,
  LinkButton,
  StringSelectMenu,
  UserSelectMenu,
} from "..";

export type MessageComponentBaseData<
  Component extends APIMessageActionRowComponent
> = {
  readonly data: Component;
  get builder(): MappedComponentBuilderTypes[Component["type"]];
  readonly run: (
    int: MappedInteractionTypes[Component["type"]]
  ) => Awaitable<any>;
};

export type OmitType<T> = Omit<T, "type">;

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

export type MessageActionRowComponents =
  | Button
  | StringSelectMenu
  | UserSelectMenu;
