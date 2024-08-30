import {CaravanItem} from "./caravan-item.mjs";

export class TravelerItem extends CaravanItem {
    getLabels({ actionId, rollData } = {}) {
        const labels = super.getLabels({ actionId, rollData });

        const travelerRole = pf1.registry.travelerRoles.get(this.system.subType);
        labels.travelerRole = travelerRole?.name ?? "";

        if(travelerRole?.tasks?.length && this.system.task) {
            const task = travelerRole.tasks.find(task => task.id === this.system.task);
            labels.task = task.name;
        }

        return labels;
    }
}