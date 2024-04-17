import { Events } from "discord.js";
import { Event } from "..";

export default new (class extends Event<Events.Debug> {
  constructor() {
    super({
      name: Events.Debug,
      async run(message: string) {
        if (process.env.npm_lifecycle_event != "start")
          console.log("[DEBUG]", message);
      },
    });
  }
})();
