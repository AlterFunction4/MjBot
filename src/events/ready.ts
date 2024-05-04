import { ActivityType, Events, Guild } from "discord.js";
import { Client, Event, Ticket, TicketManager, debug } from "..";

export default new (class extends Event<Events.ClientReady> {
  constructor() {
    super({
      name: Events.ClientReady,
      once: true,
      async run() {
        Object.assign(Guild.prototype, { tickets: new TicketManager() });

        await Client.instance.guild?.members.fetch();
        await Client.instance.guild?.channels.fetch();

        // Client.instance.guild?.tickets;

        Ticket.buildFromJSONCache();
        debug(Client.instance.tickets.cache);

        await Client.instance.application?.commands.set(
          Client.commands.filter((c) => !c.disabled).map((c) => c.builder)
        );
        await Client.instance.guilds.cache
          .get(process.env.DEV_GUILD_ID as string)
          ?.commands.set(
            Client.commands
              .filter((command) => !command.disabled)
              .map((c) => c.builder)
          );
        setInterval(async () => {
          Client.instance.user?.setActivity({
            type: ActivityType.Watching,
            name:
              Client.instance.guild?.members.cache.random()?.user.tag ??
              "Error",
          });
        }, 10000);
        console.log("%s is ready", Client.instance.user?.tag);
      },
    });
  }
})();
