import { SlashCommand } from "..";

export default class extends SlashCommand {
  constructor(name: string) {
    super({
      name,
      description: "throw an intentional error",
      run(int) {
        throw "Intentional error";
      },
    });
  }
}
