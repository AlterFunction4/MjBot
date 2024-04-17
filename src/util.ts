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

// export class Unix extends null {
//   static timestamp(
//     timestamp: number,
//     style: UnixTimestampStyle = UnixTimestampStyle.Default
//   ): string {
//     const length = 10;
//     console.log(timestamp.toString().length);
//     if (timestamp.toString().length > length)
//       return this.timestamp(
//         Math.floor(
//           timestamp / Math.pow(10, timestamp.toString().length - length)
//         ),
//         style
//       );
//     return `<t:${timestamp}:${style}>`;
//   }
// }

// export enum UnixTimestampStyle {
//   Default = "f",
//   ShortTime = "t",
//   LongTime = "T",
//   ShortDate = "d",
//   LongDate = "D",
//   ShortDateTime = Default,
//   LongDateTime = "F",
//   Relative = "R",
// }
