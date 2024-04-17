import { ClientEvents } from "discord.js";
import { Client, ClientEvent } from "..";

export abstract class Event<K extends keyof ClientEvents>
  implements ClientEvent<K>
{
  constructor(readonly data: ClientEvent<K>) {
    this.name = data.name;
    this.once = data.once ?? false;
    this.run = data.run;

    Client.instance[this.once ? "once" : "on"](
      this.name,
      async (...meta) => await this.run(...meta)
    );
  }
  name: K;
  once: boolean;
  run: (...meta: ClientEvents[K]) => Promise<any>;
}
