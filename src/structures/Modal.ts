import {
  APIActionRowComponent,
  APITextInputComponent,
  ActionRowData,
  JSONEncodable,
  ModalActionRowComponentData,
  ModalSubmitInteraction,
} from "discord.js";
import { Client, ModalDataWithCallback } from "..";

export class Modal implements ModalDataWithCallback {
  constructor(data: ModalDataWithCallback) {
    this.customId = data.customId;
    this.title = data.title;
    this.components = data.components;
    this.run = data.run;

    if (!Client.modals.includes(this)) Client.modals.push(this);
    console.log(Client.modals);
  }
  customId: string;
  title: string;
  components: (
    | JSONEncodable<APIActionRowComponent<APITextInputComponent>>
    | ActionRowData<ModalActionRowComponentData>
  )[];
  run: (interaction: ModalSubmitInteraction) => Promise<any>;
}
