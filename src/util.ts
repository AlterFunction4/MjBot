import { time } from "discord.js";

export class Util extends null {
  static capitalize(str: string, lower = false): string {
    return (lower ? str.toLowerCase() : str)?.replace(
      /(?:^|\s|["'([{])+\S/g,
      (match) => match.toUpperCase()
    );
  }

  static pluralize(
    str: string,
    count: number,
    inclusive = false,
    prefix = "s"
  ): string {
    return inclusive
      ? `${count} ${count === 1 ? str : (str += prefix)}`
      : count === 1
      ? str
      : (str += prefix);
  }
}

export class Logger extends console.Console {
  constructor() {
    super(process.stdout, process.stderr);
  }
}

export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OmitType<T> = Omit<T, "type">;
