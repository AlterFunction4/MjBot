import { ActivityType, ChannelType, Events } from "discord.js";
import { Client, Event } from "..";

export default new (class extends Event<Events.ClientReady> {
  constructor() {
    super({
      name: Events.ClientReady,
      once: true,
      async run() {
        const guild = Client.instance.guilds.cache.get(
          process.env.DEFAULT_GUILD_ID as string
        );

        await guild?.members.fetch();
        await guild?.channels.fetch().then((channels) => {
          channels
            .filter((channel) => channel?.type != ChannelType.GuildCategory)
            .map(async (channel) => {});
        });

        await Client.instance.application?.commands.set(
          Client.commands.filter((c) => !c.disabled)
        );
        await Client.instance.guilds.cache
          .get(process.env.DEV_GUILD_ID as string)
          ?.commands.set(
            Client.commands.filter((command) => !command.disabled)
          );
        setInterval(async () => {
          Client.instance.user?.setActivity({
            type: ActivityType.Watching,
            name: guild?.members.cache.random()?.user.tag ?? "Error",
          });
        }, 10000);
        console.log("%s is ready", Client.instance.user?.tag);
      },
    });
  }
})();
