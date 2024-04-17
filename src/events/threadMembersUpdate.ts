import {
  Events,
  Collection,
  ThreadMember,
  PartialThreadMember,
  AnyThreadChannel,
} from "discord.js";
import { Event } from "..";

export default new (class extends Event<Events.ThreadMembersUpdate> {
  constructor() {
    super({
      name: Events.ThreadMembersUpdate,
      async run(
        addedMembers: Collection<string, ThreadMember<boolean>>,
        removedMembers: Collection<
          string,
          ThreadMember<boolean> | PartialThreadMember
        >,
        thread: AnyThreadChannel
      ) {
        console.log(thread);
      },
    });
  }
})();
