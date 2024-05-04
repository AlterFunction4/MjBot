import {
  Events,
  Interaction,
  InteractionType,
  ComponentType,
  ApplicationCommandType,
  Colors,
  ButtonStyle,
} from "discord.js";
import { Buttons, Client, Event, InteractionButton, debug } from "..";

export default new (class extends Event<Events.InteractionCreate> {
  constructor() {
    super({
      name: Events.InteractionCreate,
      async run(int: Interaction) {
        try {
          switch (int.type) {
            case InteractionType.ApplicationCommandAutocomplete:
              console.log(int);
              // await Client.instance.commands
              //   .find((c) => c.name.startsWith(int.commandName.split('-')[0]))
              //   ?.autocomplete(client, int)
              break;
            case InteractionType.MessageComponent:
              debug(Client.components);
              switch (int.componentType) {
                case ComponentType.Button:
                  await Client.components.buttons.interaction
                    .find(
                      (component) =>
                        // component.data.style != ButtonStyle.Link &&
                        component.data.custom_id == int.customId
                    )
                    ?.run(int);
                  break;
                case ComponentType.StringSelect:
                  await Client.components.selectMenus.string
                    .find(
                      (component) => component.data.custom_id === int.customId
                    )
                    ?.run(int);
                  break;
                case ComponentType.UserSelect:
                  await Client.components.selectMenus.user
                    .find((c) => c.data.custom_id === int.customId)
                    ?.run(int);
                  break;
                default:
                  throw "Unexpected interaction component type";
              }
              break;
            case InteractionType.ModalSubmit:
              debug("here at Events.intCreate");
              await Client.modals
                .find((modal) => modal.customId === int.customId)
                ?.run(int);
              break;
            default:
              switch (int.commandType) {
                case ApplicationCommandType.ChatInput:
                  const cmd = Client.commands.chatInput.find((command) =>
                    command.builder.name.startsWith(int.commandName)
                  );
                  console.log(cmd);
                  await cmd?.run(int);
                  break;
                case ApplicationCommandType.Message:
                  await Client.commands.message
                    .find((command) =>
                      command.builder.name.startsWith(int.commandName)
                    )
                    ?.run(int);
                  break;
                case ApplicationCommandType.User:
                  await Client.commands.user
                    .find((command) =>
                      command.builder.name.startsWith(int.commandName)
                    )
                    ?.run(int);
              }
          }
        } catch (error: any) {
          console.error(error);
          let eastereggs = [
            "...for like the 1000th fucking time now",
            "i am so tired pls fucking help me",
            "this is error number 100000000000000000e15",
          ];
          await int.channel?.send({
            embeds: [
              {
                title:
                  ":sparkles:" +
                  Client.instance.user?.username +
                  " broke again:sparkles:",
                description:
                  eastereggs[Math.floor(Math.random() * eastereggs.length)],
                fields: [{ name: "Context", value: error.toString() }],
                color: Colors.Red,
              },
            ],
            components: [
              {
                type: ComponentType.ActionRow,
                components: [Buttons.send_error.data],
              },
            ],
          });
        }
      },
    });
  }
})();
