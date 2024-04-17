import { SlashCommandStringOption } from "discord.js";

export class Subcommand extends SlashCommandStringOption {
    constructor() {
        super();
        this.setAutocomplete(true);
    }
}