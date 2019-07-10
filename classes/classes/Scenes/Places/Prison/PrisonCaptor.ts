import { BaseContent } from "../../../BaseContent";
import { StatusEffects } from "../../../StatusEffects";
import { rand } from "../../../Extra";

export class PrisonCaptor extends BaseContent {
    public roomEventOverride: any[] = [false, true, true, false, false];

    public get captorTitle(): string {
        return "Mistress";
    }

    public get captorName(): string {
        return "Elly";
    }

    public get captorPronoun1(): string {
        return "she";
    }
    public get captorPronoun2(): string {
        return "her";
    }
    public get captorPronoun3(): string {
        return "her";
    }

    public get submitFuckFunc() {
        return this.prison.prisonCaptorSubmitFuck;
    }
    public get resistFuckFunc() {
        return this.prison.prisonCaptorResistFuck;
    }

    /*public function prisonLoadCaptor(newPrisonTrainerID: string = "default") : void
    {
        prisonTrainerID = newPrisonTrainerID;
        prisonCaptor = new prisonTrainer();
        switch(newPrisonTrainerID)
        {
            case "test":
                captorTitle = "Master";
                captorName = "Testeroo";
                captorPronoun1 = "he";
                captorPronoun2 = "him";
                captorPronoun3 = "his";
                break;
            case "default":
        }
        prisonCaptor.updateNextRestraintCheckEvent(getGame().time.hours, getGame().time.days,rand(24));
        prisonCaptor.updateNextFeedingEvent(getGame().time.hours, getGame().time.days,rand(8));
    }*/

    public prisonCaptorScratch(valueNum: number): number {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScratch)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScratch, 0, 0, 0, 0);
        }
        return this.player["statusEffectv" + String(valueNum)](StatusEffects.PrisonCaptorEllyScratch);
    }

    public prisonCaptorScratchSet(valueNum: number, newVal: number): void {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScratch)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScratch, 0, 0, 0, 0);
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyScratch, valueNum, newVal);
    }

    public prisonCaptorScratchChange(valueNum: number, changeVal: number): void {
        let newVal: any;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScratch)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScratch, 0, 0, 0, 0);
        }
        newVal = this.player["statusEffectv" + String(valueNum)](StatusEffects.PrisonCaptorEllyScratch) + changeVal;
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyScratch, valueNum, newVal);
    }

    public selectPunishmentEvent(lightChance: number = 0): void {
        const lightOrHeavy: number = rand(100);
        const chooser: number = rand(6);
        if (lightOrHeavy < lightChance) { // Light
            if (chooser > 0) this.prison.prisonCaptorPunishmentRestrain();
            // else if (chooser == 4) prison.billieScene.prisonCaptorBilliePunishmentFuck();
            else this.prison.punishments.prisonCaptorPunishmentBJTrainer();
        }
        else { // Heavy
            if (chooser >= 2) this.prison.punishments.prisonCaptorPunishmentConfinement();
            else this.prison.punishments.prisonCaptorPunishmentStockades();
        }
    }

    /*public function restraintDescriptionsV1(): boolean {
        if (player.statusEffectv1(StatusEffects.PrisonRestraints) == 1) {
            return true;
        }
        else return false;
    }
    public  restraintDescriptionsV2(): boolean {
        if (player.statusEffectv2(StatusEffects.PrisonRestraints) == 1) {
            outputText("Your legs are fettered and chained securely to the wall.");
            return true;
        }
        else if (player.statusEffectv2(StatusEffects.PrisonRestraints) >= 2) {
            outputText("You are hogtied and chained to the wall. You find this demoralizing and fatiguing.");
            return true;
        }
        else return false;
    }
    public  restraintDescriptionsV3(): boolean {
        if (player.statusEffectv3(StatusEffects.PrisonRestraints) > 0) {
            outputText("Your arms are bound behind your back.");
            return true;
        }
        else return false;
    }
    public  restraintDescriptionsV4(): boolean {
        if (player.statusEffectv4(StatusEffects.PrisonRestraints) > 0) {
            return true;
        }
        else return false;
    }*/

    public updateNextWaitRandomEvent(hours: number, days: number): void {

    }

    public updateNextRoomRandomEvent(hours: number, days: number): void {

    }

    public updateNextFeedingEvent(hours: number, days: number): boolean {
        return this.prison.trainingFeed.prisonCaptorFeedingEvent();
    }

    public timeForWaitRandomEvent(hours: number, days: number, goal: number): boolean {
        const timesPassed: number = this.getGame().time.totalTime;
        if (timesPassed % goal == 0) return true;
        else return false;
    }
}
