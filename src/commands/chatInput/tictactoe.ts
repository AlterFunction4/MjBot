import {
  APIActionRowComponent,
  APIMessageActionRowComponent,
  ActionRow,
  ActionRowBuilder,
  ChatInputCommandInteraction,
  User,
} from "discord.js";
import { SlashCommand } from "../..";

export default class extends SlashCommand {
  constructor(name: string) {
    super({
      name,
      description: "Play a game of Tic Tac Toe with another server member",
    });
  }
  async run(int: ChatInputCommandInteraction) {
    const lines = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];

    const grid = ((): APIMessageActionRowComponent[][] => {
      var y = [];
      for (let a = 0; a < 3; a++) {
        for (let b = 0; b < 3; b++) {}
      }
      return [];
    })();

    const player1 = new (class extends Player {
      symbol = "x";
      user = int.user;
    })();
  }
}

abstract class Player {
  abstract symbol: string;
  abstract user: User;
}
