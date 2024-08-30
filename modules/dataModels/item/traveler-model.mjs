import {CaravanItemModel} from "./caravan-item-model.js";

export class TravelerModel extends CaravanItemModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            subType: new fields.StringField({required: true, initial: "passenger"}),
            monthlyWage: new fields.NumberField({required: false, initial: 0}),
            description: new fields.SchemaField({
                value: new fields.StringField({required: true, initial: ""}),
            }),
            task: new fields.StringField(),
            actorId: new fields.StringField(),
            isNPC: new fields.BooleanField({required: false, initial: false}),
            changes: new fields.ArrayField(new fields.SchemaField({
                _id: new fields.StringField({required: true, initial: ""}),
                formula: new fields.StringField({initial: ""}),
                target: new fields.StringField({initial: ""}),
                type: new fields.StringField({initial: ""}),
                operator: new fields.StringField({required: false, initial: undefined}),
                priority: new fields.NumberField({required: false, initial: undefined}),
                continuous: new fields.BooleanField({required: false, initial: undefined}),
            })),
            contextNotes: new fields.ArrayField(new fields.SchemaField({
                target: new fields.StringField({initial: ""}),
                text: new fields.StringField({initial: ""})
            })),
        };
    }

    prepareDerivedData() {
        super.prepareDerivedData();

        this._mergeRoleDetails();

        if (this.actorId || this.onlyParty) {
            this.isNPC = true;
        }

        if(this.isNPC) {
            this.monthlyWage = 0;
            this.isHero = 0;
        }
    }

    _mergeRoleDetails() {
        if (this.roleDetailsMerged) {
            return;
        }
        this.roleDetailsMerged = true;

        const roleDetails = pf1.registry.travelerRoles.get(this.subType) ?? {};
        this._recurseAttach(this, roleDetails);

        if (roleDetails.tasks?.length) {
            if (!this.task) {
                this.task = roleDetails.tasks[0].id;
            }

            let task = null;
            for (const taskDetails of roleDetails.tasks || []) {
                if (taskDetails.id === this.task) {
                    task = taskDetails;
                    break;
                }
            }

            if (!task) {
                this.task = roleDetails.tasks[0].id;
                task = roleDetails.tasks[0];
            }

            this.taskName = task.name;
            this._recurseAttach(this, {
                changes: task.changes,
                contextNotes: task.contextNotes,
            })
        }
    }
}