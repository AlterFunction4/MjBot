import { APIActionRowComponent, APIMessageActionRowComponent, APIModalActionRowComponent } from 'discord.js'

export type MessageActionRowPresets = Record<string, APIActionRowComponent<APIMessageActionRowComponent>>
export type ModalActionRowPresets = Record<string, APIActionRowComponent<APIModalActionRowComponent>>
