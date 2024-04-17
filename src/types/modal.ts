import { ModalComponentData, ModalSubmitInteraction } from "discord.js";

export type ModalDataWithCallback = ModalComponentData & {
  run: (interaction: ModalSubmitInteraction) => Promise<any>;
};
