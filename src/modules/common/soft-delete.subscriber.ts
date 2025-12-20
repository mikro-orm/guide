import type { EventSubscriber, FlushEventArgs } from '@mikro-orm/core';
import { ChangeSetType } from '@mikro-orm/core';

export class SoftDeleteSubscriber implements EventSubscriber {

  async onFlush(args: FlushEventArgs): Promise<void> {
    const changeSets = args.uow.getChangeSets();

    for (const cs of changeSets) {
      if (cs.type !== ChangeSetType.DELETE) {
        continue;
      }

      // only soft-delete entities that have a `deletedAt` property
      if (!cs.meta.properties.deletedAt) {
        continue;
      }

      // convert the DELETE to an UPDATE that sets `deletedAt`
      cs.entity.deletedAt = new Date();
      args.uow.computeChangeSet(cs.entity, ChangeSetType.UPDATE);
    }
  }

}
