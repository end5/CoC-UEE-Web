import { BaseContent } from "../../BaseContent";
import { TimeAwareInterface } from "../../TimeAwareInterface";
import { PrisonLetters } from "./Prison/PrisonLetters";
import { PrisonCaptor } from "./Prison/PrisonCaptor";
import { PrisonGuard } from "./Prison/PrisonGuard";
import { EllyScene } from "./Prison/EllyScene";
import { ScruffyScene } from "./Prison/ScruffyScene";
import { BillieScene } from "./Prison/BillieScene";
import { Punishments } from "./Prison/Punishments";
import { TrainingPet } from "./Prison/TrainingPet";
import { TrainingFeeding } from "./Prison/TrainingFeeding";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { CoC } from "../../CoC";
import { StatusEffects } from "../../StatusEffects";
import { rand } from "../../Extra";
import { debug } from "console";
import { Useable } from "../../Items/Useable";
import { Consumable } from "../../Items/Consumable";
import { Armor } from "../../Items/Armor";
import { Weapon } from "../../Items/Weapon";
import { Shield } from "../../Items/Shield";
import { ArmorLib } from "../../Items/ArmorLib";
import { WeaponLib } from "../../Items/WeaponLib";
import { ShieldLib } from "../../Items/ShieldLib";
import { kACHIEVEMENTS } from "../../GlobalFlags/kACHIEVEMENTS";
import { MainView } from "../../../coc/view/MainView";
import { PerkLib } from "../../PerkLib";
import { ItemType } from "../../ItemType";
import { Monster } from "../../Monster";
import { PregnancyStore } from "../../PregnancyStore";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

// Prisoner Mod WIP

export class Prison extends BaseContent implements TimeAwareInterface {
    // Link to class files.
    public prisonLetter: PrisonLetters = new PrisonLetters();
    // NPCs
    public prisonCaptor: PrisonCaptor = new PrisonCaptor();
    public prisonGuard: PrisonGuard = new PrisonGuard();
    public ellyScene: EllyScene = new EllyScene();
    public scruffyScene: ScruffyScene = new ScruffyScene();
    public billieScene: BillieScene = new BillieScene();
    // Punishments & Trainings
    public punishments: Punishments = new Punishments();
    public trainingPet: TrainingPet = new TrainingPet();
    public trainingFeed: TrainingFeeding = new TrainingFeeding();

    // Variables
    public prisonCombat: boolean = false;
    public prisonCombatAutoLose: boolean = false;
    public prisonCombatWinEvent: (() => void) | undefined = undefined;
    public prisonCombatLoseEvent: (() => void) | undefined = undefined;

    public prisonItemEventCheck: boolean = false;

    // Random events cooldowns
    private heardPrisonerScreamCooldown: number = 6;
    private randomCooldownRoomCheck: number = 6;
    private randomCooldownPunishment: number = 12;
    private randomCooldownRestraintCheck: number = 12;

    // Training
    private randomCooldownFeed: number = 4;
    private randomCooldownPet: number = 10;
    private randomCooldownPetDream: number = 4;

    // NPCs
    public randomCooldownScruffy: number = 10;
    private randomCooldownBillie: number = 10;
    private randomCooldownGuard: number = 12;

    public get inPrison(): boolean { return this.flags[kFLAGS.IN_PRISON] > 0; }

    public constructor() {
        super();
        CoC.timeAwareClassAdd(this);
    }

    // Implementation of TimeAwareInterface
    public timeChange(): boolean {
        let needNext: boolean = false;
        // Show events
        if (this.flags[kFLAGS.IN_PRISON] > 0) {
            // Increment dirtiness level
            if (this.player.statusEffectv2(StatusEffects.PrisonCaptorEllyStatus) < 100) this.player.addStatusValue(StatusEffects.PrisonCaptorEllyStatus, 2, 1);
            // Tick cooldowns
            if (this.flags[kFLAGS.PRISON_EVENT_TIMEOUT] > 0) this.flags[kFLAGS.PRISON_EVENT_TIMEOUT]--;
            if (this.heardPrisonerScreamCooldown > 0) this.heardPrisonerScreamCooldown--;
            if (this.randomCooldownRoomCheck > 0) this.randomCooldownRoomCheck--;
            if (this.randomCooldownPunishment > 0) this.randomCooldownPunishment--;
            if (this.randomCooldownRestraintCheck > 0) this.randomCooldownRestraintCheck--;

            if (this.randomCooldownBillie > 0) this.randomCooldownBillie--;
            if (this.randomCooldownScruffy > 0) this.randomCooldownScruffy--;
            if (this.randomCooldownGuard > 0) this.randomCooldownGuard--;

            if (this.randomCooldownFeed > 0) this.randomCooldownFeed--;
            if (this.randomCooldownPet > 0) this.randomCooldownPet--;
            if (this.randomCooldownPetDream > 0) this.randomCooldownPetDream--;

            if (this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) > 0) this.player.addStatusValue(StatusEffects.PrisonCaptorEllyStatus, 3, -1);
            // Fire events
            if (this.heardPrisonerScreamCooldown <= 0 && rand(10) == 0) {
                this.heardPrisonerScreamCooldown = 9 + rand(4);
                this.prisonCaptorRandomEventSounds();
                needNext = true;
                return needNext;
            }
            if ((this.flags[kFLAGS.PRISON_DIRT_ENABLED] > 0 && this.getGame().time.hours == 16 && this.randomCooldownRoomCheck <= 0) || (this.player.statusEffectv2(StatusEffects.PrisonCaptorEllyStatus) >= 50 && this.flags[kFLAGS.PRISON_DIRT_ENABLED] == 0)) {
                this.randomCooldownRoomCheck = 6 + rand(18);
                this.prisonCaptorRandomEventCleaningCheck();
                needNext = true;
                return needNext;
            }
            if (this.randomCooldownRestraintCheck <= 0 && rand(10) == 0) {
                this.randomCooldownRestraintCheck = 4 + rand(8);
                this.prisonCaptorRestraintCheckEvent();
                needNext = true;
                return needNext;
            }
            this.prisonCaptorWaitEvents();
        }
        if (this.trainingFeed.prisonCaptorFeedingQuestTrainingExists()) {
            // Decrement quest timer
            if (this.player.statusEffectv2(StatusEffects.PrisonCaptorEllyQuest) > 0) this.player.addStatusValue(StatusEffects.PrisonCaptorEllyQuest, 2, -1);
        }
        this.prisonCombatAutoLose = false;
        // Tick
        return needNext;
    }

    public timeChangeLarge(): boolean {
        return this.prisonCaptorRoomEvents();
        // return false;
    }
    // End of Interface Implementation

    // ------------
    // STATS
    // ------------
    /**
     * Change the player's self-esteem.
     * @param	amount How much to add or deduct.
     */
    public changeEsteem(amount: number = 0, display: boolean = false): void {
        const oldEsteem: number = this.player.esteem;
        this.player.esteem += amount;
        if (this.player.esteem > 100) this.player.esteem = 100;
        if (this.player.esteem < 0) this.player.esteem = 0;
        // Bring up message.
        if (display) {
            if (oldEsteem >= 15 && this.player.esteem < 15) {
                this.outputText("\n<b>Your self-esteem is now extremely low. Your ability to recover your willpower is greatly diminished, your complete lack of self-worth makes you easily swayed by the criticisms and demands of others, and your ");
                if (this.player.cor < 20) this.outputText("rare");
                else if (this.player.cor >= 20 && this.player.cor < 40) this.outputText("occasional");
                else if (this.player.cor >= 40 && this.player.cor < 60) this.outputText("frequent");
                else if (this.player.cor >= 60 && this.player.cor < 80) this.outputText("near constant");
                else if (this.player.cor >= 80) this.outputText("constant");
                this.outputText(" corrupt thoughts inspire you to give up your pride and be more subservient to those who would dominate you.</b>\n");
            }
            if (oldEsteem >= 40 && this.player.esteem < 40 || oldEsteem < 15 && this.player.esteem >= 15) {
                this.outputText("\n<b>Your self-esteem is now low. Your ability to recover your willpower is somewhat diminished, your crumbling sense of self-worth makes you more susceptible to the criticisms and demands of others, and your ");
                if (this.player.cor < 20) this.outputText("rare");
                else if (this.player.cor >= 20 && this.player.cor < 40) this.outputText("occasional");
                else if (this.player.cor >= 40 && this.player.cor < 60) this.outputText("frequent");
                else if (this.player.cor >= 60 && this.player.cor < 80) this.outputText("near constant");
                else if (this.player.cor >= 80) this.outputText("constant");
                this.outputText(" corrupt thoughts increasingly linger on how good it feels to obey the directions of those who would dominate you.</b>\n");
            }
            if (oldEsteem >= 60 && this.player.esteem < 60 || oldEsteem < 40 && this.player.esteem >= 40) {
                this.outputText("\n<b>Your self-esteem is now normal. You recover your willpower at an average rate and your reactions to the criticisms and demands of others are reasonable.</b>\n");
            }
            if (oldEsteem >= 85 && this.player.esteem < 85 || oldEsteem < 60 && this.player.esteem >= 60) {
                this.outputText("\n<b>Your self-esteem is now high. Your ability to recover your willpower is somewhat increased, your strong sense of self-worth makes it easy to shrug off the criticisms and demands of others, and your intelligence slowly works to undo any submissive tendencies you may have.</b>\n");
            }
            if (oldEsteem < 85 && this.player.esteem >= 85) {
                this.outputText("\n<b>Your self-esteem is now very high. Your ability to recover your willpower is greatly increased, your powerful sense of self-worth makes ignoring the criticisms and demands of others second nature, and your intelligence greatly aids you in the process of unlearning any submissive tendencies you may have.</b>\n");
            }
        }
        if (this.player.esteem > oldEsteem) this.showStatUp("esteem");
        if (this.player.esteem < oldEsteem) this.showStatDown("esteem");
        this.dynStats("lus", 0, "scale", false);
        this.statScreenRefresh();
    }
    /**
     * Change the player's willpower.
     * @param	amount How much to add or deduct.
     */
    public changeWill(amount: number = 0, display: boolean = false): void {
        const oldWill: number = this.player.will;
        this.player.will += amount;
        if (this.player.will > 100) this.player.will = 100;
        if (this.player.will < 0) this.player.will = 0;
        if (this.player.will > oldWill) this.showStatUp("will");
        if (this.player.will < oldWill) this.showStatDown("will");
        this.dynStats("lus", 0, "scale", false);
        this.statScreenRefresh();
    }
    /**
     * Change the player's obedience.
     * @param	amount How much to add or deduct.
     */
    public changeObey(amount: number = 0, display: boolean = false): void {
        const oldObey: number = this.player.obey;
        this.player.obey += amount;
        // Constrain values.
        if (this.player.obey > 100) this.player.obey = 100;
        if (this.player.obey < 0) this.player.obey = 0;
        if (this.player.obey > 50 && this.player.obeySoftCap == true) this.player.obey = 50;
        // Bring up message.
        if (display) {
            if (oldObey >= 10 && this.player.obey < 10) {
                this.outputText("\n<b>You now have a strong ability to resist the demands of those who would dominate you.</b>\n");
            }
            if (oldObey >= 25 && this.player.obey < 25 || oldObey < 10 && this.player.obey >= 10) {
                this.outputText("\n<b>Your ability to resist the demands of those who would dominate you is now weakened. While you still have a strong innate distaste for being ordered around, you are are finding it hard to see the point in resisting the smaller things.  It's better to conserve your willpower to fight against the truly heinous and demeaning commands... isn't it?</b>\n");
            }
            if (oldObey >= 45 && this.player.obey < 45 || oldObey < 25 && this.player.obey >= 25) {
                this.outputText("\n<b>Your ability to resist the demands of those who would dominate you is now all but broken. The concept of being subservient to another being is still abhorrent to you, but in practice you are finding it far easier to swallow your pride and do as you are told than to face the consequences of resisting.</b>\n");
            }
            if (oldObey >= 70 && this.player.obey < 70 || oldObey < 45 && this.player.obey >= 45) {
                this.outputText("\n<b>Your ability to resist the demands of those who would dominate you is now essentially nonexistent. It still brings you great shame to give up agency over your actions, but you find yourself starting to crave that shame. While you manage to exert the willpower to resist an order from time to time, you are beginning to wonder if you are doing so out of a genuine desire for self determinance, or simply because the experience of being punished is becoming exciting to you.</b>\n");
            }
            if (oldObey >= 90 && this.player.obey < 90 || oldObey < 70 && this.player.obey >= 70) {
                this.outputText("\n<b>Your ability to resist the demands of those who would dominate you is now a faint memory. You understand that other people have the ability to determine their own fate, but you instead relish the sweet, shameful, all consuming simplicity of obedience. While you can manage to exert the willpower to resist an order from time to time, you know it is only so that you can experience the thrill of being put back in your rightful place.</b>\n");
            }
            if (oldObey < 90 && this.player.obey >= 90) {
                this.outputText("\n<b>The ability to resist the demands of those who would dominate you is now a foreign concept. You are a creature of submission and obedience that exists only to serve at the whim of your betters. On rare occasion you may exert the willpower to resist an order, but you only do so because you fear being forgotten by your masters. You crave the overwhelming rush of joy that comes when they punish you, reinforcing the shameful (delightful?) knowledge that you are nothing more than property, and that pleasure comes from being used.</b>\n");
            }
        }
        if (this.player.obey > oldObey) this.showStatUp("obey");
        if (this.player.obey < oldObey) this.showStatDown("obey");
        this.dynStats("lus", 0, "scale", false);
        this.statScreenRefresh();
    }

    public prisonWillCostDescript(baseVal: number): string {
        return "(requires " + Math.round(this.prisonWillCost(baseVal)) + " of your " + Math.round(this.player.will) + " willpower)";
        // return "(requires " + Math.round(prisonWillCost(baseVal)) + "; you have " + Math.round(player.will) + "/100 willpower)";
    }

    public prisonWillCost(baseVal: number): number {
        let retVal: number = 0;
        retVal = baseVal + this.player.obey * 0.015;
        retVal = retVal + this.player.cor * 0.01;
        if (this.player.esteem >= 50) {
            retVal = retVal - (this.player.esteem - 50) * 0.05;
        }
        else if (this.player.esteem < 50) {
            retVal = retVal - (this.player.esteem - 50) * 0.02;
        }

        retVal = retVal - this.player.inte * 0.005;
        retVal = retVal - this.player.tou * 0.005;
        return retVal;
    }

    // ------------
    // RESTRAINTS
    // ------------
    public prisonRestraintLevel(): number {
        let restraintLevel: number = 0;
        if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) > 0) {
            restraintLevel++;
        }
        else if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0) {
            restraintLevel = restraintLevel + this.player.statusEffectv2(StatusEffects.PrisonRestraints);
        }
        else if (this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 0) {
            restraintLevel = restraintLevel + this.player.statusEffectv3(StatusEffects.PrisonRestraints);
        }

        return restraintLevel;
    }

    public prisonRestraintMouthLevel(): number {
        let restraintLevel: number = 0;
        restraintLevel = this.player.statusEffectv4(StatusEffects.PrisonRestraints);
        return restraintLevel;
    }

    public prisonRestraintBodyLevel(): number {
        let restraintLevel: number = 0;
        restraintLevel = this.player.statusEffectv2(StatusEffects.PrisonRestraints);
        return restraintLevel;
    }

    public prisonRestraintArmLevel(): number {
        let restraintLevel: number = 0;
        restraintLevel = this.player.statusEffectv2(StatusEffects.PrisonRestraints);
        return restraintLevel;
    }

    public prisonRestraintReduction(reduceLevels: number = 1): void {
        while (reduceLevels > 0) {
            if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) > 0) {
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, 0);
            }
            else if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 1) {
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 1);
            }
            else if (this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 0) {
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 3, 0);
            }
            else if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0) {
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 0);
            }
            reduceLevels--;
        }
    }

    public prisonRestraintText(longOutput: boolean = false): void {
        // outputText("\n\n");
        /*if (prisonCaptor.restraintDescriptionsV1[player.statusEffectv1(StatusEffects.PrisonRestraints)])
        {
            outputText(prisonCaptor.restraintDescriptionsV1[player.statusEffectv1(StatusEffects.PrisonRestraints)],false);
        }
        else
        {
            outputText(prisonCaptor.restraintDescriptionsV1[1],false);
        }*/
        // Locked door
        if (this.flags[kFLAGS.PRISON_DOOR_UNLOCKED] == 0) {
            this.outputText("\n\nThe door is locked securely.");
        }
        // Body restraints
        if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0) {
            this.outputText("\n\n");
            if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) == 1) {
                this.outputText("Your legs are fettered and chained securely to the wall.");
            }
            else if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) >= 2) {
                this.outputText("You are hogtied and chained to the wall. ");
                if (longOutput) {
                    this.outputText(" You find this demoralizing and fatiguing");
                    if (this.player.cor > 40 || this.player.obey > 45) this.outputText(", but also arousing");
                    this.outputText(".");
                }
            }
        }
        // Legs restraints
        if (this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 0) {
            this.outputText("\n\n");
            this.outputText("Your arms are bound behind your back.");
        }
        // Mouth restraints
        if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) > 0) {
            this.outputText("\n\n");
            this.outputText("Your jaw is forced open by the large ring gag that is locked and fastened around your head. Your tongue lolls about obscenely, but at least you can still eat and drink.");
            if (longOutput) {
                if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) == 2) {
                    this.outputText(" You find this demoralizing");
                    if (this.player.cor > 40 || this.player.obey > 45) {
                        this.outputText(", but also arousing");
                    }
                    this.outputText(".");
                }
                if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) > 2) {
                    this.outputText(" You find this exceptionally demoralizing and fatiguing");
                    if (this.player.cor > 40 || this.player.obey > 45) {
                        this.outputText(", but also very arousing");
                    }
                    this.outputText(".");
                }
            }
        }
        // OLD CODE
        /*if (player.statusEffectv2(StatusEffects.PrisonRestraints) > 0)
        {
            if (longOutput)
            {
                outputText("\n");
            }
            if (prisonCaptor.restraintDescriptionsV2[player.statusEffectv2(StatusEffects.PrisonRestraints)])
            {
                outputText("\n" + prisonCaptor.restraintDescriptionsV2[player.statusEffectv2(StatusEffects.PrisonRestraints)],false);
            }
            else
            {
                outputText("\n" + prisonCaptor.restraintDescriptionsV2[1],false);
            }
        }
        if ((longOutput) && player.statusEffectv2(StatusEffects.PrisonRestraints) > 1)
        {
            outputText(" You find this demoralizing and fatiguing");
            if (player.cor > 40 || player.obey > 45)
            {
                outputText(", but also arousing");
            }
            outputText(".");
        }
        if (player.statusEffectv3(StatusEffects.PrisonRestraints) > 0)
        {
            if (longOutput)
            {
                outputText("\n");
            }
            if (prisonCaptor.restraintDescriptionsV3[player.statusEffectv3(StatusEffects.PrisonRestraints)])
            {
                outputText("\n" + prisonCaptor.restraintDescriptionsV3[player.statusEffectv3(StatusEffects.PrisonRestraints)],false);
            }
            else
            {
                outputText("\n" + prisonCaptor.restraintDescriptionsV3[1],false);
            }
        }
        if (player.statusEffectv4(StatusEffects.PrisonRestraints) > 0)
        {
            if (longOutput)
            {
                outputText("\n");
            }
            if (prisonCaptor.restraintDescriptionsV4[player.statusEffectv4(StatusEffects.PrisonRestraints)])
            {
                outputText("\n" + prisonCaptor.restraintDescriptionsV4[player.statusEffectv4(StatusEffects.PrisonRestraints)],false);
            }
            else
            {
                outputText("\n" + prisonCaptor.restraintDescriptionsV4[1],false);
            }
        }
        if ((longOutput) && player.statusEffectv4(StatusEffects.PrisonRestraints) == 2)
        {
            outputText(" You find this demoralizing");
            if (player.cor > 40 || player.obey > 45)
            {
                outputText(", but also arousing");
            }
            outputText(".");
        }
        if ((longOutput) && player.statusEffectv4(StatusEffects.PrisonRestraints) > 2)
        {
            outputText(" You find this exceptionally demoralizing and fatiguing");
            if (player.cor > 40 || player.obey > 45)
            {
                outputText(", but also very arousing");
            }
            outputText(".");
        }*/
    }

    public prisonIsRestrained(): boolean {
        if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0 || this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 0 || this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 0) {
            return true;
        }
        return false;
    }

    public prisonCanMasturbate(verbose: boolean = true): boolean {
        if (this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 1 || this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 1) {
            if (verbose) {
                this.outputText("Because of the way you are restrained you are unable to masturbate.");
            }
            return false;
        }
        return true;
    }

    public prisonCanRestraintBreakDoor(verbose: boolean = true): boolean {
        if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0) {
            if (verbose) {
                this.outputText("Because of the way you are restrained you are unable to reach the door.");
            }
            return false;
        }
        return true;
    }

    public prisonCanRestraintBreakMouth(verbose: boolean = true): boolean {
        if (this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 1 || this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0) {
            if (verbose) {
                this.outputText("Because of the way you are restrained you would be unable to reach your gag.");
            }
            return false;
        }
        return true;
    }

    public prisonRestraintsMenu(): void {
        this.clearOutput();
        if (this.player.statusEffectv1(StatusEffects.PrisonRestraints) == 0 && this.player.statusEffectv2(StatusEffects.PrisonRestraints) == 0 && this.player.statusEffectv3(StatusEffects.PrisonRestraints) == 0 && this.player.statusEffectv4(StatusEffects.PrisonRestraints) == 0) {
            this.outputText("You aren't restrained in any way.");
        }
        else {
            this.outputText("You consider whether you might be able to escape your restraints.");
        }
        this.prisonRestraintText(true);
        if (this.player.statusEffectv1(StatusEffects.PrisonRestraints) > 0 || this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0 || this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 0 || this.player.statusEffectv4(StatusEffects.PrisonRestraints) > 0) {
            this.outputText("\n\nDo you want to attempt to free yourself from any of your restraints? " + this.prisonWillCostDescript(10) + "\n\n");
        }
        // prisonRestraintChoices(choiceEvents, choiceTexts);
        this.menu();
        if (this.player.statusEffectv1(StatusEffects.PrisonRestraints) > 0) this.addButton(0, "Door", this.doPrisonRestraintsDoor);
        if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0) this.addButton(1, "Body", this.doPrisonRestraintsBody);
        if (this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 0) this.addButton(2, "Arms", this.doPrisonRestraintsArms);
        if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) > 0) this.addButton(3, "Mouth", this.doPrisonRestraintsMouth);
        this.addButton(14, "Back", this.playerMenu);
    }

    // Check restraints
    public doPrisonRestraintsDoor(): void {
        let nextNeeded: any = false;
        if (!debug && !this.prisonCanRestraintBreakDoor()) {
            this.doNext(this.playerMenu);
            return;
        }
        nextNeeded = true;
        this.outputText("You examine the door.\n\n");
        if (this.player.will > this.prisonWillCost(10)) {
            this.changeWill(-this.prisonWillCost(10));
            nextNeeded = this.prisonRestraintBreakDoor();
        }
        else {
            this.outputText("\n\nTry as you might you can't work up the resolve to tamper with it.");
        }

        if (nextNeeded) {
            this.doNext(this.camp.returnToCampUseOneHour);
        }
    }

    public doPrisonRestraintsBody(): void {
        let nextNeeded: any = false;
        nextNeeded = true;
        this.outputText("You inspect the restraints on your body.\n\n");
        if (debug) {
            if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) >= 2) {
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 0);
            }
            else {
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, this.player.statusEffectv2(StatusEffects.PrisonRestraints) + 1);
            }
        }
        else if (this.player.will > this.prisonWillCost(10)) {
            this.changeWill(-this.prisonWillCost(10));
            nextNeeded = this.prisonRestraintBreakBody();
        }
        else {
            this.outputText("\n\nTry as you might you can't work up the resolve to tamper with them.");
        }

        if (nextNeeded) {
            this.doNext(this.camp.returnToCampUseOneHour);
        }
    }

    public doPrisonRestraintsArms(): void {
        let nextNeeded: any = false;
        nextNeeded = true;
        this.outputText("You inspect the restraints on your arms.\n\n");
        if (debug) {
            if (this.player.statusEffectv3(StatusEffects.PrisonRestraints) >= 2) {
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 3, 0);
            }
            else {
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 3, this.player.statusEffectv3(StatusEffects.PrisonRestraints) + 1);
            }
        }
        else if (this.player.will > this.prisonWillCost(10)) {
            this.changeWill(-this.prisonWillCost(10));
            nextNeeded = this.prisonRestraintBreakArms();
        }
        else {
            this.outputText("\n\nTry as you might you can't work up the resolve to tamper with them.");
        }

        if (nextNeeded) {
            this.doNext(this.camp.returnToCampUseOneHour);
        }
    }

    public doPrisonRestraintsMouth(): void {
        let nextNeeded: any = false;
        nextNeeded = true;
        if (!debug && !this.prisonCanRestraintBreakMouth()) {
            this.doNext(this.playerMenu);
            return;
        }
        this.outputText("You inspect the gag in your mouth.\n\n");
        if (debug) {
            if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) >= 4) {
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, 0);
            }
            else {
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, this.player.statusEffectv4(StatusEffects.PrisonRestraints) + 1);
            }
        }
        else if (this.player.will > this.prisonWillCost(10)) {
            this.changeWill(-this.prisonWillCost(10));
            nextNeeded = this.prisonRestraintBreakMouth();
        }
        else {
            this.outputText("\n\nTry as you might you can't work up the resolve to tamper with it.");
        }

        if (nextNeeded) {
            this.doNext(this.camp.returnToCampUseOneHour);
        }
    }

    // Break restraints
    public prisonRestraintBreakDoor(): boolean {
        /*if (prisonCaptor.restraintBreakDoorFunc != "NOFUNC")
        {
            if (this[prisonCaptor.restraintBreakDoorFunc]())
            {
                return false;
            }
        }*/
        if (rand(100) < this.player.obey * 0.75 - this.player.esteem * 0.5) {
            this.outputText("You manage to work up the courage to approach the door and spend a few minutes of examining the lock. But before long you find yourself overwhelmed by the hopelessness of your situation and with fear of what your " + this.prisonCaptor.captorTitle + " would do if you were caught in the act of trying to escape. You quickly decide not to press your luck any further.");
            return true;
        }
        if (this.player.statusEffectv1(StatusEffects.PrisonRestraints) > 1) {
            this.outputText("Since the door is both locked and barred, you don't even attempt to pick the lock. ");
        }
        else if (this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 1) {
            this.outputText("Since your arms are bound in a way that makes your hands unusable, you don't even attempt to try to pick the lock. ");
        }
        else {
            this.outputText("You decide to try to pick the lock, ");
            if (rand(this.player.inte + this.player.spe + 40) > 120) {
                this.outputText("and after a great deal of trial and error your wits and dexterity prevail over the lock.");
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 1, 0);
                this.flags[kFLAGS.PRISON_DOOR_UNLOCKED] = 1;
                return true;
            }
            this.outputText("but no matter how you fumble at it your wits and dexterity are unable to conquer the lock. ");
            if (rand(100) < this.player.obey * 0.75 - this.player.esteem * 0.5) {
                this.outputText("You briefly consider trying to open the door with brute force, but before long you find yourself overwhelmed by the hopelessness of your situation and with fear of what your " + this.prisonCaptor.captorTitle + " would do if you were caught in the act of trying to escape. You quickly decide not to press your luck any further.");
                return true;
            }
            this.outputText("You grow more frustrated, but you aren't quite ready to give up yet. ");
        }

        this.outputText("Instead you decide to try to apply brute force, ");
        if (rand(100) < this.prisonGuard.guardNoiseDetectionChance) {
            this.prisonLoadGuard(true);
            this.outputText(" and begin hammering at the door, only to regret the decision instantly.\n\nAn enraged " + this.prisonGuard.guardType + " guard enters the room and quickly secures the door behind " + this.prisonGuard.guardPronoun2 + ", then turns towards you clearly meaning to punish you for your escape attempt.\n\n");
            this.prisonGuard.prisonGuardAttack();
            return false;
        }
        if (rand(this.player.tou + this.player.str + 60) > 120 + 10 * this.player.statusEffectv1(StatusEffects.PrisonRestraints)) {
            this.outputText("and after a great deal of pounding your power and endurance win out and the door breaks open.");
            this.player.changeStatusValue(StatusEffects.PrisonRestraints, 1, 0);
            this.flags[kFLAGS.PRISON_DOOR_UNLOCKED] = 1;
            return true;
        }
        this.outputText("but no matter how hammer yourself against the door it simply will not budge. ");
        return true;
    }

    public prisonRestraintBreakBody(): boolean {
        let successChance: number = 5 + rand(5);
        if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) == 1) {
            successChance += (this.player.str + this.player.tou) * 0.5;
            successChance -= (this.player.statusEffectv3(StatusEffects.PrisonRestraints) * 10);
        }
        else {
            successChance += (this.player.spe + this.player.tou) * 0.5;
            successChance -= (5 * this.player.statusEffectv2(StatusEffects.PrisonRestraints)) + (5 * this.player.statusEffectv3(StatusEffects.PrisonRestraints));
        }
        if (successChance < 5) successChance = 5;

        /*if (prisonCaptor.restraintBreakBodyFunc != "NOFUNC")
        {
            if (this[prisonCaptor.restraintBreakBodyFunc]())
            {
                return false;
            }
        }*/
        if (rand(100) < this.player.obey * 0.75 - this.player.esteem * 0.5) {
            this.outputText("You spend a few minutes struggling with your bindings, but before long you find yourself overwhelmed by the hopelessness of your situation and with fear of what your " + this.prisonCaptor.captorTitle + " would do if you were caught in the act of trying to escape. You quickly decide not to press your luck any further.");
            return true;
        }
        if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) == 1) {
            this.outputText("The only thing you can think to try to free your [legs] is brute force, ");
            if (rand(100) < this.prisonGuard.guardNoiseDetectionChance) {
                this.prisonLoadGuard(true);
                this.outputText(" and so you begin hammering at the your bindings, only to regret the decision instantly.\n\nAn enraged " + this.prisonGuard.guardType + " guard enters the room and quickly secures the door behind " + this.prisonGuard.guardPronoun2 + ", then turns towards you clearly meaning to punish you for your escape attempt. \n\n");
                this.prisonGuard.prisonGuardAttack();
                return false;
            }
            if (rand(100) < successChance) {
                this.outputText("and after a great deal of hammering and smashing and tearing your power and endurance win out and the restraints come free.");
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 0);
                return true;
            }
            this.outputText("but no matter how go about hammering at your restraints, they simply won't come free. ");
        }
        else {
            this.outputText("Your body is bound up in such a complex way that it's a bit overwhelming to even begin contemplating freeing yourself. For now, you decide to just focus on freeing your arms. ");
            if (rand(100) < successChance) {
                this.outputText(" It requires an almost supernatural feat of strength and dexterity, but somehow you manage to squirm free of your bindings. Now only your leg restraints and the chain to the wall remain.");
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 1);
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 3, 0);
                return true;
            }
            this.outputText(" Unfortunately, no matter how you twist and turn and struggle, your strength and dexterity just aren't up to the task of freeing yourself. ");
        }
        return true;
    }

    public prisonRestraintBreakArms(): boolean {
        let successChance: number = 5 + rand(5);
        successChance += (this.player.spe + this.player.str) * 0.5;
        successChance -= (5 * this.player.statusEffectv2(StatusEffects.PrisonRestraints)) + (5 * this.player.statusEffectv3(StatusEffects.PrisonRestraints));
        if (successChance < 5) successChance = 5;
        /*if (prisonCaptor.restraintBreakArmsFunc != "NOFUNC")
        {
            if (this[prisonCaptor.restraintBreakArmsFunc]())
            {
                return false;
            }
        }*/
        if (rand(100) < this.player.obey * 0.75 - this.player.esteem * 0.5) {
            this.outputText("You spend a few minutes struggling with your bindings, but before long you find yourself overwhelmed by the hopelessness of your situation and with fear of what your " + this.prisonCaptor.captorTitle + " would do if you were caught in the act of trying to escape. You quickly decide not to press your luck any further.");
            return true;
        }
        if (rand(100) < successChance) {
            this.outputText("It requires an almost supernatural feat of strength and dexterity, but somehow you manage to squirm free of your bindings.");
            if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 1) {
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 1);
            }
            this.player.changeStatusValue(StatusEffects.PrisonRestraints, 3, 0);
            return true;
        }
        this.outputText("No matter how you twist and turn and struggle, your strength and dexterity just aren't up to the task of freeing yourself. ");
        return true;
    }

    public prisonRestraintBreakMouth(): boolean {
        let successChance: number = 5 + rand(5);
        successChance += (this.player.inte + this.player.spe) * 0.5;
        if (successChance < 5) successChance = 5;
        /*if (prisonCaptor.restraintBreakMouthFunc != "NOFUNC")
        {
            if (this[prisonCaptor.restraintBreakMouthFunc]())
            {
                return false;
            }
        }*/
        if (rand(100) < this.player.obey * 0.75 - this.player.esteem * 0.5) {
            this.outputText("You spend a few minutes struggling with your gag, but before long you find yourself overwhelmed by the hopelessness of your situation and with fear of what your " + this.prisonCaptor.captorTitle + " would do if you were caught in the act of trying to escape. You quickly decide not to press your luck any further.");
            return true;
        }
        if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) == 1 && this.player.statusEffectv2(StatusEffects.PrisonRestraints) < 2 && this.player.statusEffectv3(StatusEffects.PrisonRestraints) < 2) {
            this.outputText("With your arms able to reach your mouth, it doesn't take too much effort to remove your simple gag.");
            this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, 0);
        }
        else if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) < 2 && this.player.statusEffectv3(StatusEffects.PrisonRestraints) < 2) {
            this.outputText("You fumble about at the complex locking straps and bindings that are holding your gag in place, ");
            if (rand(100) < successChance) {
                this.outputText("and after a great deal of trial and error your wits and dexterity prevail and you are able to remove it from your head.");
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, 0);
            }
            else {
                this.outputText("but no matter what you try your wits and dexterity are unable to remove it from your mouth. ");
            }
        }
        else {
            this.outputText("With your arms bound as they are, try as you might you are unable to find a way to ungag yourself.");
        }

        return true;
    }

    // ------------
    // ESCAPE
    // ------------
    public prisonCanEscapeFight(verbose: boolean = true): boolean {
        if (this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 0 || this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0) {
            if (verbose) {
                this.outputText("Because of the way you are restrained you would be unable to fight your guard.");
            }
            return false;
        }
        return true;
    }

    public prisonCanEscapeSeduce(): boolean {
        if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) > 0) {
            this.outputText("You consider trying to seduce your guard, but you realize you wouldn't be able to communicate gagged as you are.");
            return false;
        }
        return true;
    }

    public prisonCanEscapeBribe(): boolean {
        if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) > 0) {
            this.outputText("You consider trying to bribe your guard, but you realize you wouldn't be able to communicate gagged as you are.");
            return false;
        }
        return true;
    }

    public prisonCanEscapeSneak(): boolean {
        if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0) {
            this.outputText("Because of the way you are restrained you would be unable carry out a stealthy escape.");
            return false;
        }
        return true;
    }

    public prisonCanEscapeRun(): boolean {
        if (this.player.statusEffectv1(StatusEffects.PrisonRestraints) > 0) {
            this.outputText("The door is locked, so simply running is not an option.");
            return false;
        }
        if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0) {
            this.outputText("Even though the door is unlocked, without the free use of your legs simply running away is not an option.");
            return false;
        }
        return true;
    }

    public prisonCanTrainWorkout(): boolean {
        if (this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 0 || this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 1) {
            this.outputText("Without the free use of your arms, you are unable to do strength training.");
            return false;
        }
        return true;
    }

    public prisonCanTrainCardio(): boolean {
        if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0) {
            this.outputText("Without the free use of your [legs], you are unable to do cardio training.");
            return false;
        }
        return true;
    }

    public prisonCanUseItem(item: Useable): boolean {
        if (this.inPrison && (item instanceof Consumable) && !this.prisonCanEat()) {
            return false;
        }
        else if (this.inPrison && (item instanceof Useable)) {
            return true;
        }
        else if (this.inPrison && (item instanceof Armor || item instanceof Weapon || item instanceof Shield) && !this.prisonCanEquip()) {
            return false;
        }
        return true;
    }

    public prisonCanEat(): boolean {
        if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) > 0 && !(this.player.statusEffectv4(StatusEffects.PrisonRestraints) == 4)) {
            this.outputText("Because your mouth is gagged you are unable to eat at this time.");
            return false;
        }
        return true;
    }

    public prisonCanEquip(): boolean {
        if (this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 1 || this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 1) {
            this.outputText("Because of the way your arms are bound you are unable to equip items at this time.");
            return false;
        }
        return true;
    }

    // ------------
    // SCENES
    // ------------

    // Intro
    public goDirectlyToPrisonDoNotPassGoDoNotCollect200Gems(): void {
        this.clearOutput();
        this.outputText("You peer around the corner of a tent. You are unsurprised to see a collection of beast men around a cookfire, but you find yourself far more interested in the cage wagon beyond them. You become so wrapped up in trying to identify the lumpy shapes in the shadowy interior that the sound of twigs snapping behind you doesn't immediately trigger alarm bells in your mind, and before you can properly respond you are knocked unconscious by a brutal blow to the back of your head.");
        this.doNext(this.prisonIntro);
    }

    public goBackToPrisonBecauseQuestTimeIsUp(): void {
        this.outputText("\nSomething inside your mind tells you that you should return to the prison. Mistress Elly would probably get angry if you wander the realms and abandon her. ");
        if (this.camp.companionsCount() > 0) this.outputText("You leave a note in the camp to let anyone know that you're making your departure. ");
        this.menu();
        this.addButton(0, "Next", this.prisonIntro);
    }

    public prisonIntro(involuntary: boolean = true): boolean {
        // Set flags
        this.flags[kFLAGS.IN_PRISON] = 1;
        if (involuntary) this.flags[kFLAGS.PRISON_CAPTURE_COUNTER]++;
        this.player.createStatusEffect(StatusEffects.PrisonRestraints, 1, 0, 0, 0);
        // Scene GOOOOOOOOOOO!
        this.clearOutput();
        if (involuntary) {
            this.outputText("While you were unconscious you were captured by slavers, stripped of your items and equipment, and thrown into a locked cell.");
            if (this.prisonCaptor.captorName != "Elly") {
                this.outputText(this.images.showImage("item-Bread"));
                this.outputText("\n\nThe door opens and a guard tosses a pathetic piece of bread at your feet.");
                this.outputText("\n\n\"<i>" + this.prisonCaptor.captorTitle + " " + this.prisonCaptor.captorName + " sends " + this.prisonGuard.guardPronoun3 + " regards,</i>\" the guard says brusquely, and slams the door shut.\n\n");
                this.inventory.takeItem(this.consumables.P_BREAD, this.camp.returnToCampUseOneHour);
                return false;
            }
            this.outputText("\n\nShortly after you wake, the door opens and a captivating omnibus enters the room. While her physique is impressive -- long, shapely legs in laced, thigh-high, spike-heeled leather boots; a powerful, athletic but curvy frame; a pair of perky C-cups spilling out of a tight-fitting leather corset -- your eyes focus on her charismatic face. She is possessed of exotic and delicate features, enticingly framed by side swept bangs that have escaped the loosely bound ponytail atop her head. The striking contrast of her fire red hair against her smooth olive skin completes the effect, suggesting that her countenance could shift from intoxicatingly arousing to overwhelmingly intimidating to soft and comforting at any moment.");
            this.outputText("\n\nShe carries little evidence of demonic taint besides a pair of cute, curled horns sprouting from her temples and an agile, spade-tipped tail that flicks about above her muscular, heart-shaped ass. Her preternatural aura of poise, charm, and command, however, betray that she must be a very powerful demon indeed. She looks you over appraisingly while absentmindedly trailing her lithe fingers up and down her semi-erect but rather imposing cock. You notice that she wears long, laced leather sleeves, covering her shoulder to wrist. They strap around her middle fingers, but leave her hands conspicuously ungloved. It would seem that she prefers her subjects to feel her soft, silky skin when she touches them.");
        }
        else {
            this.outputText("You make your journey back to the prison. The guards give you a nod of approval as you walk into the prison entrance.");
            this.outputText("\n\nYou leave your belongings in a chest before you walk back to your cell. The familiar omnibus, Mistress Elly, enters the room.");
        }
        // Empty items
        if (this.player.armor != ArmorLib.NOTHING) this.flags[kFLAGS.PRISON_STORAGE_ARMOR] = this.player.armor.id; // prisonItemSlotArmor = player.armor;
        if (this.player.weapon != WeaponLib.FISTS) this.flags[kFLAGS.PRISON_STORAGE_WEAPON] = this.player.weapon.id; // prisonItemSlotWeapon = player.weapon;
        if (this.player.shield != ShieldLib.NOTHING) this.flags[kFLAGS.PRISON_STORAGE_SHIELD] = this.player.shield.id;
        this.player.setArmor(ArmorLib.NOTHING);
        this.player.setWeapon(WeaponLib.FISTS);
        this.player.setShield(ShieldLib.NOTHING);
        this.player.prisonItemSlots = [];
        for (let i: number = 0; i < 10; i++) {
            this.player.prisonItemSlots.push(this.player.itemSlot(i).itype.id);
            this.player.prisonItemSlots.push(this.player.itemSlot(i).quantity);
            // player.prisonItemSlots.push(new ItemSlot());
            // player.prisonItemSlots[i].setItemAndQty(player.itemSlot(i).itype, player.itemSlot(i).quantity);
            // trace(player.prisonItemSlots[i].itype);
            this.player.itemSlot(i).emptySlot();
        }
        this.flags[kFLAGS.PRISON_DOOR_UNLOCKED] = 0;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyStatus)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyStatus, 0, 0, 0, 0);
        }

        if ((this.trainingFeed.prisonCaptorFeedingQuestTrainingExists()) && ((this.trainingFeed.prisonCaptorFeedingQuestTrainingIsComplete()) || (this.trainingFeed.prisonCaptorFeedingQuestTrainingIsTimeUp()))) {
            this.outputText("\n\n(Placeholder) Mistress Elly welcomes you back from your slutty adventures in the outside world.\n\n");
            this.trainingFeed.prisonCaptorFeedingQuestTrainingResolve();
            return false;
        }
        if ((this.trainingFeed.prisonCaptorFeedingQuestTrainingExists()) && !this.trainingFeed.prisonCaptorFeedingQuestTrainingIsTimeUp()) {
            this.outputText(this.images.showImage("item-cBread"));
            this.outputText("\n\n(Placeholder) Mistress Elly enters the room and chastises you for not being out working on her quest.\n\n");
            this.inventory.takeItem(this.consumables.C_BREAD, this.camp.returnToCampUseOneHour);
            return true;
        }
        if (this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyStatus) > 0) {
            this.outputText("\n\nMomentarily she breaks her piercing stare and speaks. \"<i>Welcome back, slave</i>\" she intones in a voice every bit as beautiful and compelling as her face, \"<i>I take it your field education went well. Did you give yourself a lesson about fighting back by letting a few nice minotaurs rape you? Or maybe you went for some 'archery lessons' with that centaur fellow.</i>\" She leans in close to you gives your " + this.player.assDescript() + " a fierce but playful slap. \"<i>You could certainly learn some useful things from him.</i>\" She closes the distance further, and her natural, musky, alluring scent washes over you. For a moment you aren't sure if you want to fall to your knees and embrace her or cower pitifully in the shadow of her overpowering presence. Your gaze becomes transfixed on the mesmerizing movements of her deliciously pouty crimson lips.");
            this.outputText("\n\n\"<i>Whatever you may have been doing, I'm pleased that you've decided to come back and continue your formal education with me. I know you are eager for it to be complete, but remember it takes time to understand that you are...</i>\" Defying all reason, she somehow moves even closer to you.");
            this.outputText("\n\n\"<i>a pliable...</i>\" Her strawberry tongue traces the contours of her lips as she purrs the word, then darts out to tease yours. Shivers run down your spine.");
            this.outputText("\n\n\"<i>obedient...</i>\" The fingers of her right hand gently caress your " + this.player.chestDesc() + ".");
            this.outputText("\n\n\"<i>servile...</i>\" The fingers of her left hand forcefully probe your " + this.player.assholeDescript() + ".");
            this.outputText("\n\n\"<i>piece of flesh...</i>\" Her now fully erect cock grinds against your ");
            if (this.player.cocks.length == 0) {
                this.outputText(this.player.clitDescript() + ".");
            }
            else if (this.player.cocks.length == 1) {
                this.outputText(this.player.cockDescript(0) + ".");
            }
            else {
                this.outputText(this.player.multiCockDescriptLight() + ".");
            }

            this.outputText("\n\n\"<i>whose only reason to exist is to entertain and please others.</i>\" She abruptly shoves you to the ground, and in the sudden absence of her closeness ");
            if (this.player.obey < 45) {
                this.outputText("you are overcome by an unwelcome rush of desire to do whatever it takes to get it back. ");
            }
            else {
                this.outputText("you are filled with lament at its loss and a consuming desire to learn whatever lessons your Mistress wishes to teach you.");
            }
            this.outputText(this.images.showImage("item-cBread"));
            this.outputText("\n\nShe moves back towards the door. \"<i>Since you have been disobedient I shouldn't be giving you any food at all until you earn it. But I have a soft spot for you, little slave, so I suppose we can just think of this a homecoming gift of sorts.</i>\" Out of thin air she produces a pitiful loaf of bread and crumbles it into a bowl. With a smile of supreme satisfaction, she begins to milk her cock into it. Before long, the bowl is overflowing with her sticky seed. She sets it on the ground and gives you a playful wink before leaving you alone in the cell.\n\n");
            this.changeObey(3, true);
            this.inventory.takeItem(this.consumables.C_BREAD, this.camp.returnToCampUseOneHour);
            return false;
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 1, 1);
        // flags[kFLAGS.PRISON_TRAINING_LEVEL] = 0;
        this.outputText("\n\nAfter an uncomfortable period of being <i>examined</i>, you watch the demon's violet, almond eyes finally settle -- on your own. Her gaze is beyond piercing, seeming to both physically and mentally enfeeble you. You find yourself unable to escape it, and your fortitude steadily wanes. The moment begins to extend into a dense, stifling eternity, when suddenly -- she speaks. \"<i>Hello, Champion.</i>\" To your almost embarrassing surprise, her voice is every bit as beautiful and compelling as her face, and you barely notice that her eyes have moved on.  \"<i>I am your new owner. My name is Elly, but <b>you</b> will call me Mistress.</i>\" She says it with impartial conviction, as if it were a trivial matter of fact, and for an eerie moment, your mind absorbs it as truth. ");
        this.outputText("\n\n\"<i>By now, any number of monsters and demons must have tried to make you their property, so you no doubt assume that my intentions are the same. In one sense they surely are. The others wanted to own your body, as I now do.</i>\" She emphasizes this point by kicking you onto your back and resting her spiked boot on your [chest]. \"<i>The difference is that where they aim to merely destroy your mind so they can claim your body, I will instead own your mind and you will willingly give me your body. The process of you learning that you are my property will be slow, subtle, and humiliating... but when it is complete, you will beg me to let you experience it again.</i>\" Smiling wickedly, she slides her foot down your torso and begins using her boot covered toe to gently caress your ");
        if (this.player.cocks.length == 0) {
            this.outputText(this.player.clitDescript() + ".");
        }
        else if (this.player.cocks.length == 1) {
            this.outputText(this.player.cockDescript(0) + ".");
        }
        else {
            this.outputText(this.player.multiCockDescriptLight() + ".");
        }

        this.outputText("\n\n\"<i>But you <b>will</b> learn.</i>\"");
        this.outputText("\n\n\"<i>You will dream about every time one of my guards taught you a lesson in obedience by raping you, and you will wake up masturbating.</i>\"");
        this.outputText("\n\n\"<i>You will salivate at the very thought of licking a pool of jizz off your cell floor, and consider every drop of cum deposited in or on your body to be a gift you are unworthy of.</i>\"");
        this.outputText("\n\n\"<i>You will feel jealousy every time you hear the screams of another slave being taught their place. You will envy the fact that they will soon enjoy the wonderful epiphany of understanding what they really are. And, quite likely, you will stage fake rebellions simply to enjoy the rush of having your bad behavior corrected.</i>\"");
        this.outputText("\n\n\"<i>Finally, you will think back on the times when you genuinely tried to resist your true nature -- a pliable, obedient, servile piece of flesh whose only reason to exist is to entertain and please others -- and you will feel grateful that your kind Mistress found you and saved you from your foolish ways.</i>\"");
        this.outputText("\n\nShe emphasizes this final point by turning and walking to the door, then adding, almost as an afterthought, \"<i>Please do resist all you like, by the way, and even escape if you can. Don't worry, it usually doesn't take long catch you again, and more often than not you'll just come back to me on your own. In any case, your resistance creates useful, teachable moments. You can only learn how wrong you are about yourself if you have the opportunity to have your behaviors corrected, after all.</i>\"");
        this.outputText(this.images.showImage("item-Bread"));
        this.outputText("\n\n\"<i>Here, a special meal to help you get comfortable. Remember how good it tastes, since you'll need to earn it in the future.</i>\" She throws a pitiful looking loaf of bread on the floor next to you, and abruptly leaves you alone in your cell. ");
        if (this.player.obey < 45 && this.player.cor < 70) {
            this.outputText("You find yourself unsettled by ");
        }
        else {
            this.outputText("You find yourself aroused and compelled by ");
        }
        this.outputText("how long Mistress Elly's arresting presence lingers in your mind, and by the depth of the effect her words seemed to have on your psyche.\n\n");
        this.changeObey(2, true);
        if (this.flags[kFLAGS.PRISON_CAPTURE_COUNTER] == 0) {
            this.player.obeySoftCap = true;
            this.player.obey = 0;
            this.player.esteem = 50;
            this.player.will = 80;
        }
        this.awardAchievement("Prisoner", kACHIEVEMENTS.GENERAL_PRISONER, true);
        this.inventory.takeItem(this.consumables.P_BREAD, this.camp.returnToCampUseOneHour);
        return false;
    }

    // ------------
    // PRISON ACTIONS
    // ------------
    public prisonRoom(allowsEvents: boolean = true): void {
        // Workaround to force update prison door. The old prison code surely was messy.
        if (this.player.statusEffectv1(StatusEffects.PrisonRestraints) > 0) this.flags[kFLAGS.PRISON_DOOR_UNLOCKED] = 0;
        else this.flags[kFLAGS.PRISON_DOOR_UNLOCKED] = 1;
        // Start!
        this.hideUpDown();
        this.showStats();
        this.clearOutput();
        this.credits.modContent = true;
        this.credits.authorText = "FeiFongWong";
        this.outputText(this.images.showImage("prison-cell"));
        switch (this.flags[kFLAGS.PRISON_PUNISHMENT]) {
            case 0: // Default cell
                this.outputText("You are in a dimly lit but spacious cell. However, the size of the room is little comfort to you as it is filled with all manner of restraints and torture devices. Eyelets, metal rings, bars and hooks are scattered around the ceiling, floor and walls providing a near endless variety of ways to restrain a person. A wooden stockade is installed in the center of the room, a whipping post and a rack stand in one corner, and in another there is a large and ominous floor to ceiling stone box. \n\n");
                break;
            case 1: // Stockades
                this.outputText("You are in a dimly lit but spacious cell. However, the size of the room is little comfort to you as it is filled with all manner of restraints and torture devices. Eyelets, metal rings, bars and hooks are scattered around the ceiling, floor and walls providing a near endless variety of ways to restrain a person. A whipping post and a rack stand in one corner, and in another there is a large and ominous floor to ceiling stone box. \n\n");
                this.outputText("You are confined to the stockades as part of your lesson. A hollow plug has been forced into your ass, curving upward in a hook-like shape and attached to the ceiling. You are bound in such a way that should your [legs] go slack even the slightest bit, the entire weight of your torso would be suspended by your asshole. \n\n");
                break;
            case 2: // Confinement
                this.outputText("You are confined in a dark stone box. You can't move more than an inch in either direction, but you can stand up or sit down. A collection of monstrous dildos extend from the horizontal bar directly underneath you, doing their best to demoralize you. A small slit in the panel allows you to see the cell. \n\n");
                break;
            case 3: // BJ Trainer
                this.outputText("You are in a dimly lit but spacious cell. However, the size of the room is little comfort to you as it is filled with all manner of restraints and torture devices. Eyelets, metal rings, bars and hooks are scattered around the ceiling, floor and walls providing a near endless variety of ways to restrain a person. A wooden stockade is installed in the center of the room, a whipping post and a rack stand in one corner, and in another there is a large and ominous floor to ceiling stone box. \n\n");
                this.punishments.prisonCaptorPunishmentBJTrainerDescribeStatus(true);
                break;
            case 4: // Training Crate
                this.outputText("(Placeholder) You are confined to the training crate as part of your lesson.");
                break;
            default:
                this.outputText("You are in a dimly lit but spacious cell. However, the size of the room is little comfort to you as it is filled with all manner of restraints and torture devices. Eyelets, metal rings, bars and hooks are scattered around the ceiling, floor and walls providing a near endless variety of ways to restrain a person. A wooden stockade is installed in the center of the room, a whipping post and a rack stand in one corner, and in another there is a large and ominous floor to ceiling stone box. \n\n");
        }
        if (this.getGame().time.hours >= 6 && this.getGame().time.hours <= 20) this.outputText("Mercifully, fresh air and sunlight can enter the room through narrow slit windows opposite the door.");
        else this.outputText("You can see the blood-red moon contrasting against black sky through the narrow slit windows.");
        this.prisonRestraintText();
        if (this.flags[kFLAGS.PRISON_DIRT_ENABLED] > 0) {
            this.outputText("\n\nThe room is ");
            const cleanlinessLevel: number = Math.floor(this.player.statusEffectv2(StatusEffects.PrisonCaptorEllyStatus) / 25);
            switch (cleanlinessLevel) {
                case 0:
                    this.outputText("about as clean as it is going to get.");
                    break;
                case 1:
                    this.outputText("a bit messy.");
                    break;
                case 2:
                    this.outputText("<b>unpleasantly dirty</b>.");
                    break;
                case 3:
                case 4:
                default:
                    this.outputText("<b>extremely filthy</b>.");
            }
        }
        if (kGAMECLASS.timeQ > 0) {
            /*if (!kGAMECLASS.campQ)
            {
                outputText("More time passes...\n");
                goNext(kGAMECLASS.timeQ);
                return;
            }*/
            if (this.getGame().time.hours < 6 || this.getGame().time.hours > 20) {
                this.camp.doSleep();
                return;
            }
            this.camp.rest();
            return;
        }
        // Expire punishment.
        if (this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) <= 0) {
            if (this.flags[kFLAGS.PRISON_PUNISHMENT] == 1) {
                this.punishments.prisonCaptorPunishmentStockadesFreedom();
                return;
            }
            if (this.flags[kFLAGS.PRISON_PUNISHMENT] == 2) {
                this.punishments.prisonCaptorPunishmentConfinementFreedom();
                return;
            }
            if (this.flags[kFLAGS.PRISON_PUNISHMENT] == 3) {
                this.punishments.prisonCaptorPunishmentBJTrainerTimesup();
                return;
            }
        }

        // Random events
        if (this.flags[kFLAGS.PRISON_EVENT_TIMEOUT] == 0 && this.getGame().time.hours >= 8) {
            this.flags[kFLAGS.PRISON_EVENT_TIMEOUT] = 2;
            let petPlayRarity: number = 10;
            petPlayRarity -= (this.trainingPet.prisonCaptorPetScore() - 25) / 5;
            if (petPlayRarity < 2) petPlayRarity = 2;
            const chooser: number = rand(8);
            switch (chooser) {
                case 1:
                    if (this.randomCooldownScruffy <= 0 && !this.scruffyScene.prisonCaptorScruffyOptedOut()) {
                        this.randomCooldownScruffy = 6 + rand(6);
                        this.scruffyScene.prisonCaptorRandomEventJizzJanitor();
                        return;
                    }
                    break;
                case 2:
                    if (this.randomCooldownGuard <= 0) {
                        this.randomCooldownGuard = 12 + rand(60);
                        this.prisonGuard.prisonCaptorRandomEventAbuse();
                        return;
                    }
                    break;
                case 3:
                case 4:
                    if (this.randomCooldownFeed <= 0 && this.player.hunger < 80) {
                        this.randomCooldownFeed = 4 + rand(4);
                        this.trainingFeed.prisonCaptorFeedingEvent();
                        return;
                    }
                    break;
                case 5:
                case 6:
                    if (this.randomCooldownPet <= 0 && rand(petPlayRarity) == 0 && !this.trainingPet.prisonCaptorPetOptedOut()) {
                        this.randomCooldownPet = 4 + rand(4);
                        this.trainingPet.prisonCaptorPetEvent();
                        return;
                    }
                    break;
                case 7:
                    if (this.randomCooldownPet <= 0 && rand(petPlayRarity) == 0 && this.trainingPet.prisonCaptorPetScore() >= 30 && !this.trainingPet.prisonCaptorPetOptedOut()) {
                        this.randomCooldownPet = 6 + rand(4);
                        if (this.trainingPet.prisonCaptorPetTier() == 2) this.trainingPet.prisonCaptorPetTrainingOffer();
                        else if (this.trainingPet.prisonCaptorPetTier() == 3) this.trainingPet.prisonCaptorPetTrainingDemand();
                        return;
                    }
                    break;
                default:
                    break;
            }
        }
        // if (prisonRoomEvents())
        // {
        // 	return;
        // }
        this.mainView.showMenuButton(MainView.MENU_NEW_MAIN);
        this.mainView.showMenuButton(MainView.MENU_DATA);
        this.mainView.showMenuButton(MainView.MENU_STATS);
        this.mainView.showMenuButton(MainView.MENU_PERKS);
        this.mainView.showMenuButton(MainView.MENU_APPEARANCE);
        this.mainView.setMenuButton(MainView.MENU_NEW_MAIN, "Main Menu", kGAMECLASS.mainMenu.mainMenu);
        this.mainView.newGameButton.hint("Return to main menu.", "Main Menu");
        // Level up
        if (this.camp.setLevelButton()) return;
        this.mainView.statsView.hideLevelUp();
        // Set menus
        this.menu();
        this.addButton(0, "Train", this.prisonTrainMenu).hint("Train to improve your body.");
        this.addButton(1, "Study", this.prisonStudyMenu).hint("Study to improve your mind.");
        this.addButton(2, "Restraints", this.prisonRestraintsMenu).hint("Try to break free from restraints if you have any.");
        if (this.flags[kFLAGS.PRISON_DIRT_ENABLED] > 0) this.addButton(3, "Clean", this.prisonCaptorCleanRoom).hint("Clean the cell.");
        if (this.flags[kFLAGS.PRISON_DOOR_UNLOCKED] > 0) this.addButton(4, "Escape", this.prisonEscapeMenu).hint("Make an escape attempt.");
        // addButton(5, "Trigger Billie", billieScene.prisonCaptorBilliePunishmentFuck);
        this.addButton(7, "Inventory", this.inventory.inventoryMenu);
        // Check lust
        if (this.player.lust >= 30) {
            if (this.player.lust >= this.player.maxLust()) {
                this.outputText("\n\n<b>You are debilitatingly aroused, and can think of doing nothing other than masturbating.</b>");
                this.removeButton(0);
                this.removeButton(4);
            }
            this.getGame().masturbation.setMasturbateButton();
            if (((this.player.findPerk(PerkLib.HistoryReligious) >= 0 && this.player.cor <= 66) || (this.player.findPerk(PerkLib.Enlightened) >= 0 && this.player.cor < 10)) && !(this.player.hasStatusEffect(StatusEffects.Exgartuan) && this.player.statusEffectv2(StatusEffects.Exgartuan) == 0) || this.flags[kFLAGS.SFW_MODE] >= 1) this.addButton(8, "Meditate", this.getGame().masturbation.masturbateMenu);
        }
        // Alter menu depending on punishment.
        if (this.flags[kFLAGS.PRISON_PUNISHMENT] == 1) {
            this.menu();
            this.addButton(5, "Call Out", this.punishments.prisonCaptorPunishmentStockadesCallout).hint("Call for someone to get to you.");
            this.addButton(7, "Break Stockade", this.punishments.prisonCaptorPunishmentStockadeBreak).hint("Attempt to break the stockade.\n\n" + this.prisonWillCostDescript(10));
        }
        if (this.flags[kFLAGS.PRISON_PUNISHMENT] == 2) {
            this.punishments.prisonCaptorPunishmentConfinementDescribeStatus();
            this.menu();
            this.addButton(5, "Stand Up", this.punishments.prisonCaptorPunishmentConfinementStandup).hint("Try to stand up while inside the box.");
            this.addButton(6, "Rest Legs", this.punishments.prisonCaptorPunishmentConfinementRestlegs).hint("Try to rest your legs while inside the box.");
            this.addButton(7, "Break Box", this.punishments.prisonCaptorPunishmentConfinementBreak).hint("Attempt to break the box.\n\n" + this.prisonWillCostDescript(10));
            if (this.player.lust >= 30) this.addButton(8, "Masturbate", this.punishments.prisonCaptorPunishmentConfinementMasturbate).hint("Attempt to masturbate inside the box.");
        }
        if (this.flags[kFLAGS.PRISON_PUNISHMENT] == 3) {
            this.outputText("\n\n");
            this.addButton(5, "Suck Dildo", this.punishments.prisonCaptorPunishmentBJTrainerSuck).hint("Suck on the dildo and try to fill the basin to get the key.");
        }
        if (this.flags[kFLAGS.PRISON_PUNISHMENT] == 4) {
            this.menu();
            this.addButton(0, "Behave", this.trainingPet.prisonCaptorPetTrainingCrateBehave);
            if (this.player.will >= this.prisonWillCost(10)) this.addButton(1, "Misbehave", this.trainingPet.prisonCaptorPetTrainingCrateMisbehave).hint(this.prisonWillCostDescript(10));
            this.addButton(2, "Call Out", this.trainingPet.prisonCaptorPetTrainingCrateCallOut);
            this.addButton(3, "Leash", this.trainingPet.prisonCaptorPetTrainingCrateLeash);
            // addButton(7, "Break Cage", trainingPet.prisonCaptorPetTrainingCrateBreak).hint("Attempt to break the cage?\n\n" + prisonWillCostDescript(10));
            if (this.player.lust >= 70) this.addButton(8, "Masturbate", this.trainingPet.prisonCaptorPetTrainingCrateMasturbate).hint("Attempt to masturbate inside the cage.");
        }
        // Show wait/rest/sleep depending on conditions.
        this.addButton(9, "Wait", this.camp.doWait);
        if (this.player.fatigue > 40 || this.player.HP / this.player.maxHP() <= .9) this.addButton(9, "Rest", this.getGame().camp.rest);
        if (this.getGame().time.hours >= 21 || this.getGame().time.hours < 6) {
            this.removeButton(0);
            this.removeButton(1);
            this.removeButton(2);
            this.removeButton(3);
            this.addButton(9, "Sleep", this.getGame().camp.doSleep);
        }
    }

    // ------------
    // TRAIN
    // ------------
    private prisonTrainMenu(): void {
        this.hideMenus();
        this.clearOutput();
        this.outputText("You consider ways to use your time to improve your body.\n\n");
        this.menu();
        this.addButton(0, "Workout", this.doPrisonTrainWorkout).hint("Do some workout to improve your strength and toughness.");
        this.addButton(1, "Cardio", this.doPrisonTrainCardio).hint("Do some exercise to improve your toughness and speed.");
        if (this.flags[kFLAGS.PRISON_TRAIN_SELF_CONTROL_UNLOCKED] > 0) this.addButton(5, "Self-Control", this.prisonCaptorTrainSelfControl).hint("Improve your self-control.");
        if (this.flags[kFLAGS.PRISON_TRAIN_ANAL_CAPACITY_UNLOCKED] > 0) this.addButton(6, "Anal Capacity", this.prisonCaptorTrainAnalCapcity).hint("Train to increase your anal capacity.");
        if (this.flags[kFLAGS.PRISON_TRAIN_PUPPY_TRICKS_UNLOCKED] > 0) this.addButton(7, "Puppy Tricks", this.prisonCaptorTrainPuppyTricks).hint("Practice behaving like a dog.");
        this.addButton(14, "Back", this.prisonRoom);
    }

    private doPrisonTrainWorkout(): void {
        this.clearOutput();
        if (!this.prisonCanTrainWorkout()) {
            this.doNext(this.playerMenu);
            return;
        }
        this.outputText(this.images.showImage("prison-workout"));
        if (this.player.fatigue > this.player.maxFatigue() - 25) {
            this.outputText("<b>There's no way you could exercise right now - you're exhausted!</b>  ");
            this.doNext(this.playerMenu);
            return;
        }
        this.player.changeFatigue(25);
        this.outputText("You decide to pass the time with a workout regimen of pushups, situps, makeshift pull ups and other activities to improve your strength and endurance. ");
        if (this.player.str < 25) {
            this.outputText("You only manage a few reps of each, but even so, you manage to work up a good burn and a modest sweat.");
        }
        else if (this.player.str < 40) {
            this.outputText("You push yourself a bit harder than you expected to.  It doesn't take you long to work up a sweat, but you push on through a variety of exercises that leave your body feeling sore and exhausted.");
        }
        else if (this.player.str < 60) {
            this.outputText("You smile when you lose track of your reps while doing your fourth set of pushups.  With a start, you realize you're probably stronger now than Ingnam's master blacksmith, Ben.  Wow!  This realization fuels you to push yourself even harder, and you spend nearly two hours doing various strength-building exercises.");
        }
        else if (this.player.str < 80) {
            this.outputText("You confidently push your way through set after set of strength-building exercises.  It doesn't take long for you to work up a lather of sweat and feel the burn thrumming through your slowly tiring form.  The workout takes about two hours, but you feel you made some good progress today.");
        }
        else if (this.player.str < 90) {
            this.outputText("You find yourself losing track of both reps and sets as you push yourself beyond your limits.  Standing up, you flex and marvel at yourself – you could probably arm wrestle a minotaur or two and come out victorious!");
        }
        else {
            this.outputText("There is really no challenge left to be had in your regimen, but you power your way through anyway.  By the time two hours have passed, you've worked up a good sweat, but without some other method of exercise you probably won't get any stronger.");
        }
        // Increase strength.
        if (this.player.str < 20) this.dynStats("str", 0.5);
        if (this.player.str < 40) this.dynStats("str", 0.4);
        if (this.player.str < 60) this.dynStats("str", 0.3);
        if (this.player.str < 80) this.dynStats("str", 0.2);
        if (this.player.str < 90) this.dynStats("str", 0.1);
        // Increase toughness
        if (this.player.tou < 20) this.dynStats("tou", 0.5);
        if (this.player.tou < 40) this.dynStats("tou", 0.4);
        if (this.player.tou < 60) this.dynStats("tou", 0.3);
        if (this.player.tou < 80) this.dynStats("tou", 0.2);
        if (this.player.tou < 90) this.dynStats("tou", 0.1);
        // Increase muscles.
        if (this.player.tone < 60) this.outputText(this.player.modTone(85, 5 + rand(5)));
        else this.outputText(this.player.modTone(85, 1 + rand(4)));
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private doPrisonTrainCardio(): void {
        this.clearOutput();
        if (!this.prisonCanTrainCardio()) {
            this.doNext(this.playerMenu);
            return;
        }
        this.outputText(this.images.showImage("prison-cardio"));
        if (this.player.fatigue > this.player.maxFatigue() - 30) {
            this.outputText("<b>There's no way you could exercise right now - you're exhausted!</b>  ");
            this.doNext(this.playerMenu);
            return;
        }
        this.player.changeFatigue(30);
        this.outputText("You decide to pass the time with a cardio training regimen of jumping jacks, jogging in circles, and other calisthenics to improve your speed and endurance ");
        if (this.player.tou < 25) {
            this.outputText("but you get so winded you have to stop after a few minutes.  Determined to improve, you force yourself to jog a few more laps around the room.");
        }
        else if (this.player.tou < 40) {
            this.outputText("but your performance isn't that great.  You nearly stop jogging a few times but manage to push through until you're completely exhausted.");
        }
        else if (this.player.tou < 60) {
            this.outputText("and you do quite well.  You jog around for nearly an hour, working up a healthy lather of sweat, then run though an exhaustive regimen of calisthenics.  Even your " + this.player.legs() + " tingle and burn with exhaustion.");
        }
        else if (this.player.tou < 80) {
            this.outputText("and it doesn't faze you in the slightest.  You lose count of the number of jumping jacks you've done and then run in circles for just as long, working yourself until you're soaked with sweat and fairly tired.");
        }
        else if (this.player.tou < 90) {
            this.outputText("and you have a terrific time.  You can keep yourself working out at a fever pitch the entire time, though you work up a huge amount of sweat in the process.");
        }
        else {
            this.outputText("and it barely challenges you.  No matter how many jumping jacks you do or circles you run around the room you never tire out.  Still, you do manage to burn a lot of calories.");
        }
        // Increase toughness
        if (this.player.tou < 20) this.dynStats("tou", 0.5);
        if (this.player.tou < 40) this.dynStats("tou", 0.4);
        if (this.player.tou < 60) this.dynStats("tou", 0.3);
        if (this.player.tou < 80) this.dynStats("tou", 0.2);
        if (this.player.tou < 90) this.dynStats("tou", 0.1);
        // Increase speed.
        if (this.player.spe < 20) this.dynStats("spe", 0.5);
        if (this.player.spe < 40) this.dynStats("spe", 0.4);
        if (this.player.spe < 60) this.dynStats("spe", 0.3);
        if (this.player.spe < 80) this.dynStats("spe", 0.2);
        if (this.player.spe < 90) this.dynStats("spe", 0.1);
        // Decrease thickness.
        if (this.player.thickness > 40) this.outputText(this.player.modThickness(1, 5 + rand(2)));
        else this.outputText(this.player.modThickness(1, 2 + rand(2)));
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Special training
    public prisonCaptorTrainSelfControl(): void {
        if (this.player.gender == 3) this.outputText(this.images.showImage("prison-selfcontrol-herm"));
        else if (this.player.gender == 2) this.outputText(this.images.showImage("prison-selfcontrol-female"));
        else this.outputText(this.images.showImage("prison-selfcontrol-male"));
        this.outputText("(Placeholder) You decide to spend some time working on your sexual self control -- i.e., masturbating without orgasming. \n\nVarious scenes will play out depending on your esteem, obedience, and corruption, as well as randomized factors, and you will receive stat boosts as appropriate to the scene. For now, this placeholder just gives you a small increase to your obedience, a small hit to your self esteem,.and an increase to lust.\n\n");
        this.dynStats("lus", 20);
        this.changeObey(1, this.inPrison);
        this.changeEsteem(-1, this.inPrison);
        this.doNext(this.camp.returnToCampUseTwoHours);
    }

    public prisonCaptorTrainAnalCapcity(): void {
        const lustChange: number = 0;
        this.outputText(this.images.showImage("masti-dDildo-anal"));
        this.outputText("(Placeholder) You decide to spend some time working on your anal capacity and endurance -- i.e., working fingers, hands, and other props into yourself to increase your ability to perform anal sex. \n\nVarious scenes will play out depending on your esteem, obedience, and corruption, as well as randomized factors, and you will receive stat boosts as appropriate to the scene. For now, this placeholder just gives you a small increase to your obedience, a small hit to your self esteem, and an increase to lust.\n\n");
        this.dynStats("lus", 20);
        this.changeObey(1, this.inPrison);
        this.changeEsteem(-1, this.inPrison);
        if (!this.player.hasStatusEffect(StatusEffects.BonusACapacity)) {
            this.player.createStatusEffect(StatusEffects.BonusACapacity, 2, 0, 0, 0);
        }
        else {
            if (this.player.statusEffectv1(StatusEffects.BonusACapacity) < 20) {
                this.player.addStatusValue(StatusEffects.BonusACapacity, 1, 2);
            }
            else if (this.player.statusEffectv1(StatusEffects.BonusACapacity) < 35) {
                this.player.addStatusValue(StatusEffects.BonusACapacity, 1, 1);
            }
            else if (this.player.statusEffectv1(StatusEffects.BonusACapacity) < 50) {
                this.player.addStatusValue(StatusEffects.BonusACapacity, 1, 0.5);
            }
        }
        this.doNext(this.camp.returnToCampUseTwoHours);
    }

    public prisonCaptorTrainPuppyTricks(): void {
        this.outputText(this.images.showImage("prison-doggie"));
        this.outputText("(Placeholder) You decide to practice behaving like a dog -- crawling, sitting, begging, posing as if in heat with high corruption. \n\nVarious scenes will play out depending on your esteem, obedience, and corruption, as well as your state of restraint and other random factors, and you will receive stat boosts as appropriate to the scene. For now, this placeholder just gives you a small increase to your obedience and a small boost to your self esteem.\n");
        this.changeObey(1, this.inPrison);
        this.changeEsteem(1, this.inPrison);
        this.doNext(this.camp.returnToCampUseTwoHours);
    }

    // ------------
    // STUDY
    // ------------
    public prisonStudyMenu(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("prison-cell"));
        this.outputText("You consider ways to use your time to improve your mind.\n\n");
        this.menu();
        this.addButton(0, "Inner Peace", this.doPrisonStudyInnerpeace).hint("Calm your nerves and bring balance to your emotions to improve your self esteem.");
        this.addButton(1, "Determination", this.doPrisonStudyDetermination).hint("Improve your determination and hone your intelligence.");
        this.addButton(2, "Self Pity", this.doPrisonStudySelfpity).hint("Attempt to calm your nerves.");
        this.addButton(3, "Discipline", this.doPrisonStudyDiscipline).hint("Attempt to improve your determination and increase your obedience.");
        if (this.flags[kFLAGS.PRISON_STUDY_MANNERS_UNLOCKED] > 0) this.addButton(5, "Manners", this.prisonCaptorStudyManners).hint("Improve your manners.");
        if (this.flags[kFLAGS.PRISON_STUDY_BREATHING_UNLOCKED] > 0) this.addButton(6, "Breathing", this.prisonCaptorStudyBreathing).hint("Work on holding your breath.");
        this.addButton(14, "Back", this.prisonRoom);
    }

    public doPrisonStudyInnerpeace(): void {
        this.outputText(this.images.showImage("prison-selfesteem"));
        this.outputText("You turn your thoughts inward in an attempt to calm your nerves and bring balance to your emotions.\n");
        if (this.player.lust > 60) {
            this.dynStats("lus", -3);
        }
        if (this.player.lib > 40) {
            this.dynStats("lib", -0.5);
        }
        this.changeEsteem(5, this.inPrison);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public doPrisonStudyDetermination(): void {
        this.outputText(this.images.showImage("prison-determination"));
        this.outputText("You turn your thoughts inward in an attempt to improve your determination and strength of will.\n");
        if (this.player.cor > 50) {
            this.dynStats("cor", -0.3);
        }
        if (this.player.inte < 60) {
            this.dynStats("inte", 0.5);
        }
        if (this.silly() && this.player.inte >= 60 && this.player.cor <= 50) this.outputText("You are filled with DETERMINATION.");
        this.changeObey(-5, this.inPrison);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public doPrisonStudySelfpity(): void {
        this.outputText(this.images.showImage("prison-selfcontrol-female"));
        this.outputText("You turn your thoughts inward in an attempt to calm your nerves and bring balance to your emotions, but end up wallowing in self pity over your hopeless situation instead.\n");
        this.changeEsteem(-5, this.inPrison);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public doPrisonStudyDiscipline(): void {
        this.outputText(this.images.showImage("prison-workout"));
        this.outputText("You turn your thoughts inward in an attempt to improve your determination, but end up daydreaming about how pleasant it is to be told what to do rather than having to think for yourself.\n");
        this.changeObey(5, this.inPrison);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Special study
    public prisonCaptorStudyManners(): void {
        this.outputText(this.images.showImage("prison-maiden"));
        this.outputText("(Placeholder) You decide to spend some time working on your manners -- i.e., conditioning yourself to think of your captor as [captorTitle] and to use the proper form of address when speaking to her. \n\n Various scenes will play out depending on your esteem, obedience, and corruption, as well as randomized factors, and you will receive stat boosts as appropriate to the scene. For now, this placeholder just gives you a small increase to your obedience and a small hit to your self esteem.\n\n");
        this.changeObey(1, this.inPrison);
        this.changeEsteem(-1, this.inPrison);
        this.doNext(this.camp.returnToCampUseTwoHours);
    }

    public prisonCaptorStudyBreathing(): void {
        this.outputText(this.images.showImage("prison-selfcontrol"));
        this.outputText("(Placeholder) You decide to spend some time working on your breathing -- i.e., working on holding your breath, practicing rhythmic breathing, and if corruption is high enough and props are available (the dildo bat weapon, the dildo rack, or your own very long penis), using said props to aid in this endeavor. \n\nVarious scenes will play out depending on your esteem, obedience, and corruption, as well as randomized factors, and you will receive stat boosts as appropriate to the scene. For now, this placeholder just gives you a small increase to your obedience and a small boost to your self esteem.\n\n");
        this.changeObey(1, this.inPrison);
        this.changeEsteem(1, this.inPrison);
        this.doNext(this.camp.returnToCampUseTwoHours);
    }

    public prisonCaptorCleanRoom(): void {
        this.clearOutput();
        let newCleanliness: number = 0;
        this.outputText(this.images.showImage("prison-maiden"));
        this.outputText("You decide to spend some time cleaning your cell, fearing what your " + this.prisonCaptor.captorTitle + " might do if you let it get too messy.");
        newCleanliness = this.player.statusEffectv2(StatusEffects.PrisonCaptorEllyStatus) - 5;
        if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 1) {
            this.outputText(" Since you can barely move and are forced to find creative ways to mash the sponge around the floor, you hardly achieve anything at all. On top of that, you feel particularly undignified while making the attempt.");
            this.changeEsteem(-1, this.inPrison);
        }
        else if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0 || this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 1) {
            this.outputText(" Since your range of motion is somewhat restricted, you don't manage to clean nearly as much as you had hoped to.");
            newCleanliness = newCleanliness - 10;
        }
        else {
            newCleanliness = newCleanliness - 20;
        }

        if (this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyStatus) > 2 && rand(this.player.lust + this.player.cor - this.player.esteem) > 125 || this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyStatus) > 4 && rand(this.player.lust + this.player.cor - this.player.esteem) > 75) {
            this.outputText("\n\n(Placeholder) You encounter a pool of cum on the floor, and you can't help but feel aroused daydreaming about how it came to be there. A thought strikes you: your " + this.prisonCaptor.captorTitle + " wouldn't be pleased if you wasted it by simply mopping it up with your sponge, and before your mind can react your instincts kick in and you find yourself licking the pool of cum off the floor");
            this.player.slimeFeed();
            this.changeEsteem(-3, this.inPrison);
            this.changeObey(1, this.inPrison);
        }
        if (newCleanliness < 0) {
            newCleanliness = 0;
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 2, newCleanliness);
        this.changeObey(0.2, this.inPrison);
        this.doNext(this.camp.returnToCampUseTwoHours);
    }

    // ------------
    // ESCAPE
    // ------------
    public prisonEscapeMenu(): void {
        const fight = this.doPrisonEscapeFight;
        const seduce = this.doPrisonEscapeSeduce;
        let bribe: (() => void) | undefined = this.doPrisonEscapeBribe;
        const sneak = this.doPrisonEscapeSneak;
        const run = this.doPrisonEscapeRun;
        let quest: (() => void) | undefined = this.doPrisonEscapeQuestRun;
        this.clearOutput();
        this.outputText("You look around you and think about how you might be able to free yourself from captivity.\n\n");
        if (this.player.gems < 500) {
            bribe = undefined;
        }
        if (!this.trainingFeed.prisonCaptorFeedingQuestTrainingExists()) {
            quest = undefined;
        }
        /*prisonEscapeChoices(choiceEvents,choiceTexts);
    var  i: number = 1;
        while(i < 10)
        {
            if (choiceEvents[i] != 0)
            {
                choiceFound = true;
                switch(choiceTexts[i])
                {
                    case "Fight":
                        outputText("You think you might be able to win if you fought your guard. " + prisonWillCostDescript(20) + "\n");
                        break;
                    case "Seduce":
                        outputText("It occurs to you that if you seduce your guard you could get away afterwards. " + prisonWillCostDescript(10) + "\n");
                        break;
                    case "Bribe":
                        outputText("Given that your sizable stack of gems is probably with your gear you consider trying to pay for your freedom. " + prisonWillCostDescript(10) + "\n");
                        break;
                    case "Sneak":
                        outputText("If you were quick and quiet enough you think you might be able to sneak out when a guard enters the room. " + prisonWillCostDescript(15) + "\n");
                        break;
                    case "Run":
                        outputText("Maybe you could just walk out the door? " + prisonWillCostDescript(5) + "\n");
                        break;
                    case "Do Quest":
                        outputText("You've been given a task to do, so you can just walk out the door. \n");
                        break;
                }
            }
            i++;
        }*/
        if (fight != undefined) this.outputText("You think you might be able to win if you fought your guard. " + this.prisonWillCostDescript(20) + "\n");
        if (seduce != undefined) this.outputText("It occurs to you that if you seduce your guard you could get away afterwards. " + this.prisonWillCostDescript(10) + "\n");
        if (bribe != undefined) this.outputText("Given that your sizable stack of gems is probably with your gear you consider trying to pay for your freedom. " + this.prisonWillCostDescript(10) + "\n");
        if (sneak != undefined) this.outputText("If you were quick and quiet enough you think you might be able to sneak out when a guard enters the room. " + this.prisonWillCostDescript(15) + "\n");
        if (run != undefined) this.outputText("Maybe you could just walk out the door? " + this.prisonWillCostDescript(5) + "\n");
        if (quest != undefined) this.outputText("You've been given a task to do, so you can just walk out the door. \n");

        // if (choiceFound)
        // {
        this.outputText("\n\nWill you make an escape attempt?");
        this.menu();
        this.addButton(0, "Fight", fight);
        this.addButton(1, "Seduce", seduce);
        this.addButton(2, "Bribe", bribe);
        this.addButton(3, "Sneak", sneak);
        this.addButton(4, "Run", run);
        this.addButton(5, "Quest", quest);
        this.addButton(14, "Nevermind", this.playerMenu);
        /*}
        else
        {
            outputText("\n\nSince no viable options present themselves, you decide to forget about escape for now.");
            doNext(playerMenu);
        }*/
    }

    public doPrisonEscapeFight(): void {
        if (!this.prisonCanEscapeFight()) {
            this.doNext(this.playerMenu);
            return;
        }
        this.outputText("");
        if (this.player.will < this.prisonWillCost(20)) {
            this.outputText("You simply don't have the willpower to try to fight your way to freedom right now.");
            this.doNext(this.playerMenu);
            return;
        }
        this.changeWill(-this.prisonWillCost(20));
        this.prisonEscapeFight();
    }

    public doPrisonEscapeFightLoss(): void {
        this.outputText("\n\nYou'll probably come to your senses in eight hours or so, and when you do you'll have an increased understanding of the futility of challenging the power of your captors.");
        this.changeEsteem(-4, this.inPrison);
        this.changeObey(1, this.inPrison);
    }

    public doPrisonEscapeFightWin(): void {
        this.outputText("\n\nYou step over the unconscious body of your former guard and head towards the door.\n");
        this.changeEsteem(1, this.inPrison);
        this.changeObey(-3, this.inPrison);
        this.prisonEscapeSuccessText();
        this.prisonEscapeFinalePart1();
        // doYesNo(prisonEscapeFinalePart1, playerMenu);
    }

    public doPrisonEscapeSeduce(): void {
        if (!this.prisonCanEscapeSeduce()) {
            this.doNext(this.playerMenu);
            return;
        }
        this.outputText("");
        if (this.player.will < this.prisonWillCost(10)) {
            this.outputText("You simply don't have the willpower to try to seduce your guard right now.");
            this.doNext(this.playerMenu);
            return;
        }
        this.changeWill(-this.prisonWillCost(10));
        this.prisonEscapeSeduce();
    }

    public doPrisonEscapeBribe(): void {
        if (!this.prisonCanEscapeBribe()) {
            this.doNext(this.playerMenu);
            return;
        }
        this.outputText("");
        if (this.player.will < this.prisonWillCost(10)) {
            this.outputText("You find that you don't have the willpower needed to try to bribe your way free.");
            this.doNext(this.playerMenu);
            return;
        }
        this.changeWill(-this.prisonWillCost(10));
        this.prisonEscapeBribe();
    }

    public doPrisonEscapeSneak(): void {
        if (!this.prisonCanEscapeSneak()) {
            this.doNext(this.playerMenu);
            return;
        }
        this.outputText("");
        if (this.player.will < this.prisonWillCost(15)) {
            this.outputText("The subterfuge needed to sneak past your guard requires more willpower to execute than you have right now.");
            this.doNext(this.playerMenu);
            return;
        }
        this.changeWill(-this.prisonWillCost(15));
        this.prisonEscapeSneak();
    }

    public doPrisonEscapeRun(): void {
        if (!this.prisonCanEscapeRun()) {
            this.doNext(this.playerMenu);
            return;
        }
        this.outputText("");
        if (this.player.will < this.prisonWillCost(5)) {
            this.outputText("You don't even have enough willpower at the moment to stand up and walk out the door.");
            this.doNext(this.playerMenu);
            return;
        }
        this.changeWill(-this.prisonWillCost(5));
        this.prisonEscapeRun();
    }

    public doPrisonEscapeQuestRun(): void {
        if (!this.prisonCanEscapeRun()) {
            this.doNext(this.playerMenu);
            return;
        }
        this.outputText("");
        this.outputText("Knowing you have a task to complete, you work up the courage to take advantage of your completely unrestrained state and cautiously slip out the door when no one is watching.\n");
        this.prisonEscapeSuccessText();
        this.doNext(this.prisonEscapeFinalePart1);
    }

    public prisonEscapeFight(): void {
        /*if (prisonCaptor.escapeFightFunc != "NOFUNC")
        {
            if (this[prisonCaptor.escapeFightFunc]())
            {
                return;
            }
        }*/
        if (rand(100) < this.player.obey * 0.75 - this.player.esteem * 0.5) {
            this.outputText("You spend a few minutes trying to steel yourself for your escape attempt but before long you find yourself overwhelmed by the hopelessness of your situation and with fear of what your " + this.prisonCaptor.captorTitle + " would do if you were caught in the act. You quickly decide not to press your luck any further.");
            return;
        }
        this.prisonLoadGuard(true);
        this.outputText("You pound on the door for what feels like an eternity.  Just as you are beginning to lose hope that anyone will hear you, the sound of footsteps comes echoing down the hallway.\n\n");
        this.outputText(this.prisonGuard.guardCaptitalA + " " + this.prisonGuard.guardType + " bursts through the door but before " + this.prisonGuard.guardPronoun1 + " can react you jump at " + this.prisonGuard.guardPronoun2 + " in rage.\n");
        this.prisonEscapeFightStart();
    }

    public prisonEscapeSeduce(): void {
        let sexyScore: number = 0;
        /*if (prisonCaptor.escapeSeduceFunc != "NOFUNC")
        {
            if (this[prisonCaptor.escapeSeduceFunc]())
            {
                return;
            }
        }*/
        if (rand(100) < this.player.obey * 0.75 - this.player.esteem * 0.5) {
            this.outputText("You spend a few minutes trying to steel yourself for your escape attempt but before long you find yourself overwhelmed by the hopelessness of your situation and with fear of what your " + this.prisonCaptor.captorTitle + " would do if you were caught in the act. You quickly decide not to press your luck any further.");
            return;
        }
        this.prisonLoadGuard(true);
        this.outputText("You call out for your guard for what feels like an eternity.  Just as you are beginning to lose hope that anyone will hear you, the sound of footsteps comes echoing down the hallway.\n\n");
        this.outputText("As the " + this.prisonGuard.guardType + " enters the room, " + this.prisonGuard.guardPronoun1 + " sees you kneeling on all fours presenting your " + this.player.buttDescript() + " to him like a bitch in heat. As seductively as you can, you ask " + this.prisonGuard.guardPronoun2 + " how long it has been since " + this.prisonGuard.guardPronoun1 + " had a good fuck and offer " + this.prisonGuard.guardPronoun2 + " one in exchange for your freedom.\n\n");
        sexyScore = rand(100);
        sexyScore = sexyScore + this.prisonGuard.guardEscapeSeduceBonus;
        sexyScore = sexyScore + this.player.cor * 0.25;
        sexyScore = sexyScore + this.player.lib * 0.25;
        sexyScore = sexyScore + rand(this.player.lust * 0.5);
        sexyScore = sexyScore + rand(this.player.inte * 0.1);
        if (sexyScore > 100) {
            this.outputText("Overcome with arousal by your display the " + this.prisonGuard.guardType + " communicates " + this.prisonGuard.guardPronoun3 + " agreement with a nod and approaches confidently.");
            this.dynStats("lus", 25);
            this.prisonEscapeSuccessText();
            this.doNext(this.prisonEscapeFinalePart1);
        }
        else if (sexyScore > 50) {
            this.outputText("Obviously aroused by your display the " + this.prisonGuard.guardType + " definitely seems interested in fucking you, but less so in letting such a pliable slave out of " + this.prisonGuard.guardPronoun3 + " charge. You brace yourself for punishment as " + this.prisonGuard.guardPronoun1 + " approaches menacingly.");
            this.dynStats("lus", 100);
            this.prisonEscapeFightAutoLose();
        }
        else {
            this.outputText("The " + this.prisonGuard.guardType + " seems completely uninterested in your offer, and walks back out the door.");
            this.doNext(this.playerMenu);
        }

    }

    public prisonEscapeBribe(): void {
        let charmScore: any = NaN;
        let bribeCost: any = NaN;
        /*if (prisonCaptor.escapeBribeFunc != "NOFUNC")
        {
            if (this[prisonCaptor.escapeBribeFunc]())
            {
                return;
            }
        }*/
        if (rand(100) < this.player.obey * 0.75 - this.player.esteem * 0.5) {
            this.outputText("You spend a few minutes trying to steel yourself for your escape attempt but before long you find yourself overwhelmed by the hopelessness of your situation and with fear of what your " + this.prisonCaptor.captorTitle + " would do if you were caught in the act. You quickly decide not to press your luck any further.");
            return;
        }
        this.prisonLoadGuard(true);
        this.outputText("You call out for your guard for what feels like an eternity.  Just as you are beginning to lose hope that anyone will hear you, the sound of footsteps comes echoing down the hallway.\n\n");
        this.outputText("As the " + this.prisonGuard.guardType + " enters the room, you quickly start talking. As cleverly as you can, you point out that there is a large sum of gems sitting with your gear somewhere just outside the door, and offer " + this.prisonGuard.guardPronoun2 + " as much as " + this.prisonGuard.guardPronoun1 + " wants in exchange for your freedom.\n\n");
        charmScore = rand(100);
        charmScore = charmScore + this.prisonGuard.guardEscapeBribeBonus;
        charmScore = charmScore + this.player.cor * 0.25;
        charmScore = charmScore + this.player.inte * 0.75;
        if (charmScore > 100) {
            bribeCost = 1000 + Math.round((this.player.gems - 1000) / 2);
            this.player.gems = this.player.gems - bribeCost;
            this.outputText("Overcome with greed, the " + this.prisonGuard.guardType + " communicates " + this.prisonGuard.guardPronoun3 + " agreement with a nod and leaves the room. When " + this.prisonGuard.guardPronoun1 + " returns " + this.prisonGuard.guardPronoun1 + " has a bag that contains somewhere around " + bribeCost + " of your gems. Keeping up " + this.prisonGuard.guardPronoun3 + " end of the bargain " + this.prisonGuard.guardPronoun1);
            if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0 || this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 0 || this.player.statusEffectv4(StatusEffects.PrisonRestraints) > 0) {
                this.outputText(" removes your restraints and ");
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 0);
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 3, 0);
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, 0);
            }
            this.outputText(" gives you a key, then leaves you to your own devices.");
            this.prisonEscapeSuccessText();
            this.doNext(this.prisonEscapeFinalePart1);
        }
        else if (charmScore > 50) {
            this.player.gems = this.player.gems - 100;
            this.outputText("The " + this.prisonGuard.guardType + " definitely seems interested in your gems, but more so in teaching you a lesson for thinking you could subvert the " + this.prisonCaptor.captorTitle + "'s power with mere bribery. You suspect that the " + this.prisonGuard.guardType + " will probably take some (100) of your gems anyway, but instead of freeing you " + this.prisonGuard.guardPronoun1 + "'s going to fuck you in trade. You brace yourself for punishment as " + this.prisonGuard.guardPronoun1 + " approaches menacingly.");
            this.prisonEscapeFightStart();
        }
        else {
            this.outputText("The " + this.prisonGuard.guardType + " seems completely uninterested in your offer, and walks back out the door.");
            this.doNext(this.playerMenu);
        }

    }

    public prisonEscapeSneak(): void {
        let stealthScore: number = 0;
        /*if (prisonCaptor.escapeSneakFunc != "NOFUNC")
        {
            if (this[prisonCaptor.escapeSneakFunc]())
            {
                return;
            }
        }*/
        this.prisonLoadGuard(true);
        if (rand(100) < this.player.obey * 0.75 - this.player.esteem * 0.5) {
            this.outputText("You spend a few minutes trying to steel yourself for your escape attempt but before long you find yourself overwhelmed by the hopelessness of your situation and with fear of what your " + this.prisonCaptor.captorTitle + " would do if you were caught in the act. You quickly decide not to press your luck any further.");
            return;
        }
        this.outputText("You pound on the door for what feels like an eternity.  Just as you are beginning to lose hope that anyone will hear you, the sound of footsteps comes echoing down the hallway.\n\n");
        this.outputText(this.prisonGuard.guardCaptitalA + " " + this.prisonGuard.guardType + " bursts through the door and briefly looks around in confusion.\n\n");
        stealthScore = rand(100);
        stealthScore = stealthScore + this.prisonGuard.guardEscapeSneakBonus;
        stealthScore = stealthScore + this.player.spe * 0.25;
        stealthScore = stealthScore + this.player.inte * 0.25;
        if (stealthScore > 140) {
            this.outputText("When " + this.prisonGuard.guardPronoun1 + " doesn't see you, " + this.prisonGuard.guardPronoun1 + " walks further into the room leaving the door open in " + this.prisonGuard.guardPronoun3 + " befuddlement. You take this opportunity to quickly and quietly slip out of the shadowed corner where you were hiding and pull the door shut behind you, locking the " + this.prisonGuard.guardType + " inside. ");
            this.prisonEscapeSuccessText();
            this.doNext(this.prisonEscapeFinalePart1);
        }
        else if (stealthScore > 50) {
            this.outputText("When " + this.prisonGuard.guardPronoun1 + " doesn't see you, he takes a step further into the room continuing to search for " + this.prisonGuard.guardPronoun3 + " seemingly missing charge. Seeing that the door is still open behind " + this.prisonGuard.guardPronoun2 + " you decide this is your moment to slip past, and crawl from the shadowed corner where you were hiding. The " + this.prisonGuard.guardType + " hears you immediately and you brace yourself for punishment as " + this.prisonGuard.guardPronoun1 + " approaches menacingly.");
            this.prisonEscapeFightStart();
        }
        else {
            this.outputText("The " + this.prisonGuard.guardType + " immediately sees you crouching stupidly in a corner, and assumes you are cowering in fear. Perplexed, " + this.prisonGuard.guardPronoun1 + " turns around and leaves the room");
            this.doNext(this.playerMenu);
        }

    }

    public prisonEscapeRun(): void {
        /*if (prisonCaptor.escapeRunFunc != "NOFUNC")
        {
            if (this[prisonCaptor.escapeRunFunc]())
            {
                return;
            }
        }*/
        this.prisonLoadGuard(true);
        if (rand(100) < this.player.obey * 0.75 - this.player.esteem * 0.5) {
            this.outputText("You spend a few minutes trying to steel yourself for your escape attempt but before long you find yourself overwhelmed by the hopelessness of your situation and with fear of what your " + this.prisonCaptor.captorTitle + " would do if you were caught in the act. You quickly decide not to press your luck any further.");
            return;
        }
        this.outputText("You work up the courage to take advantage of your completely unrestrained state and cautiously slip out the door when no one is watching.\n");
        this.prisonEscapeSuccessText();
        this.doNext(this.prisonEscapeFinalePart1);
    }

    public prisonEscapeSuccessText(): void {
        this.outputText("\n\nAs you leave your former cell, ");
        if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) > 0 || this.player.statusEffectv3(StatusEffects.PrisonRestraints) > 0 || this.player.statusEffectv4(StatusEffects.PrisonRestraints) > 0) {
            this.outputText("you hastily remove your remaining restraints. Nearby ");
        }
        this.outputText("you notice a conspicuous looking chest. Upon opening it you are relieved to see that it contains your old items and gear, which you reclaim.\n\n");
    }

    public prisonEscapeFinalePart1(): void {
        const textArray: any[] = [];
        this.player.removeStatusEffect(StatusEffects.PrisonRestraints);
        this.prisonItemsRetrieve();
        if (this.flags[kFLAGS.PRISON_STORAGE_ARMOR] != 0) {
            textArray.push(this.prisonArmorRetrieve());
            // return;
        }
        if (this.flags[kFLAGS.PRISON_STORAGE_WEAPON] != 0) {
            textArray.push(this.prisonWeaponRetrieve());
            // return;
        }
        if (this.flags[kFLAGS.PRISON_STORAGE_SHIELD] != 0) {
            textArray.push(this.prisonShieldRetrieve());
            // return;
        }
        if (textArray.length > 0) this.outputText("You equip your " + Prison.formatStringArray(textArray) + ".\n\n");
        this.prisonEscapeFinalePart2();
        return;
    }

    public prisonEscapeFinalePart2(): void {
        this.flags[kFLAGS.IN_PRISON] = 0;
        this.outputText("Having retrieved your old items, you quietly make your way out of your captor's stronghold and head back towards your camp.");
        if (!this.flags[kFLAGS.PRISON_CAPTURE_CHANCE] || this.flags[kFLAGS.PRISON_CAPTURE_CHANCE] <= 0) {
            this.doNext(this.captorChanceChoose);
        }
        else {
            this.doNext(this.camp.returnToCampUseOneHour);
        }
        return;
    }

    // Retrieval
    public prisonItemsRetrieve(): void {
        for (let i: number = 0; i < 10; i++) {
            if (this.player.prisonItemSlots[i * 2] != undefined) {
                this.player.itemSlot(i).setItemAndQty(ItemType.lookupItem(this.player.prisonItemSlots[i * 2]), this.player.prisonItemSlots[(i * 2) + 1]);
            }
        }
        this.player.prisonItemSlots = []; // CLEAR!
    }
    public prisonArmorRetrieve(): string {
        let temp: string = "";
        if (this.flags[kFLAGS.PRISON_STORAGE_ARMOR] != 0) {
            const tempArmor: any = ItemType.lookupItem(this.flags[kFLAGS.PRISON_STORAGE_ARMOR]);
            if (tempArmor != undefined) this.player.setArmor(tempArmor);
            temp = this.player.armorName;
            // inventory.takeItem(ItemType.lookupItem(flags[kFLAGS.PRISON_STORAGE_ARMOR]), prisonEscapeFinalePart1);
        }
        this.flags[kFLAGS.PRISON_STORAGE_ARMOR] = 0;
        return temp;
    }
    public prisonWeaponRetrieve(): string {
        let temp: string = "";
        if (this.flags[kFLAGS.PRISON_STORAGE_WEAPON] != 0) {
            const tempWeapon: any = ItemType.lookupItem(this.flags[kFLAGS.PRISON_STORAGE_WEAPON]);
            if (tempWeapon != undefined) this.player.setWeapon(tempWeapon);
            temp = this.player.weaponName;
            // inventory.takeItem(ItemType.lookupItem(flags[kFLAGS.PRISON_STORAGE_WEAPON]), prisonEscapeFinalePart1);
        }
        this.flags[kFLAGS.PRISON_STORAGE_WEAPON] = 0;
        return temp;
    }
    public prisonShieldRetrieve(): string {
        let temp: string = "";
        if (this.flags[kFLAGS.PRISON_STORAGE_SHIELD] != 0) {
            const tempShield: any = ItemType.lookupItem(this.flags[kFLAGS.PRISON_STORAGE_SHIELD]);
            if (tempShield != undefined) this.player.setShield(tempShield);
            temp = this.player.shieldName;
            // inventory.takeItem(ItemType.lookupItem(flags[kFLAGS.PRISON_STORAGE_SHIELD]), prisonEscapeFinalePart1);
        }
        this.flags[kFLAGS.PRISON_STORAGE_SHIELD] = 0;
        return temp;
    }

    // Conclusion
    public captorChanceChoose(): void {
        this.clearOutput();
        this.outputText("As you make your way back to camp, you can't help but think about how easy it is to find yourself knocked unconscious and left helpless in the wilderness of Mareth. While slave hunters have never plucked you off the ground in such a state before, now that you've bumbled into being captured by them you consider that they might come hunting for you now that you've escaped. You give it a moment's thought. Are you now in danger of being recaptured should you be defeated in combat?");
        this.menu();
        this.addButton(0, "Likely", this.chooseLikelyChance);
        this.addButton(1, "Maybe", this.chooseMaybeChance);
        this.addButton(2, "Never", this.chooseNeverChance);
    }

    public chooseLikelyChance(): void {
        this.outputText("\n\nYou realize that " + this.prisonCaptor.captorTitle + " " + this.prisonCaptor.captorName + " isn't going to be happy about losing " + this.prisonCaptor.captorPronoun3 + " new toy, and that if you don't pick and choose your battles wisely it will only be a matter of time before you are back in " + this.prisonCaptor.captorPronoun3 + " dungeons.");
        if (this.player.obey < 10) {
            this.outputText(" The thought of it chills you to the bone.");
        }
        else if (this.player.obey < 25) {
            this.outputText(" The thought of it unsettles you.");
        }
        else if (this.player.obey < 45) {
            this.outputText(" The thought of it fills you with an uncomfortable mixture of terror and anticipation.");
        }
        else if (this.player.obey < 70) {
            this.outputText(" The thought of it is actually exciting and comforting.");
        }
        else {
            this.outputText(" The thought of it fills you with a desire to run to the mountains and let the minotaurs beat and fuck you over and over again. It would serve you right for daring to defy your " + this.prisonCaptor.captorTitle + ", and it would hasten your inevitable return to " + this.prisonCaptor.captorPronoun3 + " dominion.");
        }
        this.outputText("\n\n<b>Of course, you could always return to the prison anytime from the Places menu.</b>");
        this.flags[kFLAGS.PRISON_CAPTURE_CHANCE] = 50;
        this.doNext(this.camp.returnToCampUseOneHour);
        return;
    }
    public chooseMaybeChance(): void {
        this.outputText("\n\nWhile " + this.prisonCaptor.captorTitle + " " + this.prisonCaptor.captorName + " isn't going to be happy about losing " + this.prisonCaptor.captorPronoun3 + " new toy, Mareth is a big place. If you don't pick and choose your battles wisely you might find yourself back in " + this.prisonCaptor.captorPronoun3 + " dungeons, but depending on your luck you might just avoid being found by slave hunters.");
        if (this.player.obey < 10) {
            this.outputText(" Still, the thought of being caught again chills you to the bone.");
        }
        else if (this.player.obey < 25) {
            this.outputText(" Still, the thought of being caught again unsettles you.");
        }
        else if (this.player.obey < 45) {
            this.outputText(" Still, the thought of being caught again fills you with an uncomfortable mixture of terror and anticipation.");
        }
        else if (this.player.obey < 70) {
            this.outputText(" Still, the thought of being caught again is actually exciting and comforting.");
        }
        else {
            this.outputText(" Still, the thought of being caught again fills you with a desire to run to the mountains and let the minotaurs beat and fuck you over and over again. It would serve you right for daring to defy your " + this.prisonCaptor.captorTitle + ", and it would hasten your inevitable return to " + this.prisonCaptor.captorPronoun3 + " dominion.");
        }
        this.outputText("\n\n<b>Of course, you could always return to the prison anytime from the Places menu.</b>");
        this.flags[kFLAGS.PRISON_CAPTURE_CHANCE] = 15;
        this.doNext(this.camp.returnToCampUseOneHour);
        return;
    }
    public chooseNeverChance(): void {
        this.outputText("\n\n" + this.prisonCaptor.captorTitle + " " + this.prisonCaptor.captorName + " definitely isn't going to be happy about losing " + this.prisonCaptor.captorPronoun3 + " new toy, but you doubt that " + this.prisonCaptor.captorPronoun1 + " really cares enough to devote resources to hunting you down.");
        if (this.player.obey < 25) {
            this.outputText(" As long as you avoid dark alleys in unsavory places, you will never have to see the inside of that dungeon again.");
        }
        else if (this.player.obey < 45) {
            this.outputText(" You are discomforted to realize that a good part of you is disappointed by this fact, and somewhere in the back of your mind you find yourself considering exploring a few dark alleys the next time you visit the more unsavory corners of Mareth.");
        }
        else if (this.player.obey < 70) {
            this.outputText(" Suddenly you are overcome with disappointment by this fact, and you find yourself actively fantasizing about exploring dark alleys the next time you visit the more unsavory corners of Mareth.");
        }
        else {
            this.outputText(" This horrifies you, and you already crave punishment for daring to defy your " + this.prisonCaptor.captorTitle + ". Perhaps submitting to the whims of every monster you encounter might begin to suffice, but you know that sooner or later you're just going to have to seek out the slavers again and throw yourself at their mercy. Perhaps you can begin by exploring a few dark alleys the next time you visit one of the more unsavory corners of Mareth.");
        }
        this.outputText("\n\n<b>Of course, you could always return to the prison anytime from the Places menu.</b>");
        this.flags[kFLAGS.PRISON_CAPTURE_CHANCE] = -1;
        this.doNext(this.camp.returnToCampUseOneHour);
        return;
    }

    public prisonEscapeFightStart(combatID?: Monster): void {
        if (!combatID) {
            combatID = this.prisonGuard.guardCombatID;
        }
        this.prisonCombat = true;
        this.prisonCombatLoseEvent = this.doPrisonEscapeFightLoss;
        this.prisonCombatWinEvent = this.doPrisonEscapeFightWin;
        this.startCombat(combatID);
    }

    public prisonEscapeFightAutoLose(combatID?: Monster): void {
        if (!combatID) {
            combatID = this.prisonGuard.guardCombatID;
        }
        this.prisonCombat = true;
        this.prisonCombatAutoLose = true;
        this.prisonCombatLoseEvent = this.doPrisonEscapeFightLoss;
        this.prisonCombatWinEvent = this.doPrisonEscapeFightWin;
        this.startCombat(combatID);
    }

    public prisonEscapeSeduceAutoLose(combatID?: Monster): void {
        if (!combatID) {
            combatID = this.prisonGuard.guardCombatID;
        }
        this.prisonCombat = true;
        this.prisonCombatAutoLose = true;
        this.prisonCombatLoseEvent = this.doPrisonEscapeFightLoss;
        this.prisonCombatWinEvent = this.doPrisonEscapeFightWin;
        this.startCombat(combatID);
    }

    public prisonCaptorWaitRestraintStatChange(): boolean {
        let fatigueChange: number = 0;
        let willChange: number = 0;
        let lustChange: number = 0;
        const needNext: boolean = false;
        if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) < 1) {
            willChange = willChange - (0.3 - this.player.obey * 0.005);
            if (this.player.cor > 40) {
                lustChange = lustChange + 0.3;
            }
            if (this.player.obey > 45) {
                lustChange = lustChange + this.player.obey * 0.005;
            }
        }
        if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) < 2) {
            willChange = willChange - 0.2;
            if (this.player.obey > 70) {
                lustChange = lustChange + this.player.obey * 0.005;
            }
            fatigueChange = fatigueChange + 0.01;
        }
        if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) < 1) {
            willChange = willChange - (0.3 - this.player.obey * 0.005);
            if (this.player.cor > 40) {
                lustChange = lustChange + 0.3;
            }
            if (this.player.obey > 45) {
                lustChange = lustChange + this.player.obey * 0.005;
            }
            fatigueChange = fatigueChange + 0.01;
        }
        this.changeWill(willChange);
        this.player.changeFatigue(fatigueChange);
        this.dynStats("lus", lustChange);
        return needNext;
    }

    public prisonCaptorWaitUpdates(): boolean {
        const needNext: boolean = false;
        let newVal: number = 0;
        let newCleanliness: number = 0;
        let statusVal: number = 0;
        if (this.flags[kFLAGS.PRISON_DIRT_ENABLED] > 0) {
            newCleanliness = this.player.statusEffectv2(StatusEffects.PrisonCaptorEllyStatus) + 1;
            if (newCleanliness > 100) {
                newCleanliness = 100;
            }
            this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 2, newCleanliness);
        }
        if (this.flags[kFLAGS.PRISON_PUNISHMENT] > 0 && this.flags[kFLAGS.PRISON_PUNISHMENT] <= 3) {
            newVal = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) - 1;
            if (newVal < 0) {
                newVal = 0;
            }
            this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 3, newVal);
        }
        if (this.flags[kFLAGS.PRISON_PUNISHMENT] == 4) {
            newVal = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus);
            if (newVal < 0) {
                newVal++;
            }
            else if (newVal > 0) {
                newVal--;
            }

            this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 3, newVal);
        }
        if (this.flags[kFLAGS.PRISON_PUNISHMENT] == 2) {
            statusVal = this.player.statusEffectv4(StatusEffects.PrisonCaptorEllyStatus);
            if (statusVal <= 3) {
                this.player.changeFatigue((20 - statusVal) * 0.35);
            }
            else if (statusVal <= 7) {
                this.player.changeFatigue(statusVal * 0.4);
                this.dynStats("lus", statusVal * 0.2);
            }
            else if (statusVal <= 17) {
                this.player.changeFatigue(statusVal * 0.4);
                this.dynStats("lus", statusVal * 0.4);
            }
            else {
                this.player.changeFatigue(statusVal * 0.4);
                this.dynStats("lus", statusVal * 0.5);
            }

        }
        return needNext;
    }

    public prisonCaptorWaitEvents(): boolean {
        let eventOccurred: any;
        eventOccurred = false;
        if (this.flags[kFLAGS.PRISON_PUNISHMENT] == 1) {
            if (rand(8) == 0) {
                this.prisonCaptor.updateNextWaitRandomEvent(this.getGame().time.hours, this.getGame().time.days);
                this.punishments.prisonCaptorPunishmentStockadesVisitor();
                return true;
            }
        }
        if (this.flags[kFLAGS.PRISON_PUNISHMENT] == 2) {
            if (rand(100) + this.player.fatigue * 0.5 + this.player.lust * 0.5 - (this.player.str + this.player.tou) * 0.2 > 50) {
                this.prisonCaptor.updateNextWaitRandomEvent(this.getGame().time.hours, this.getGame().time.days);
                this.outputText("\n\nYour [legs] give in to lust and fatigue and you impale yourself a bit further on the dildos below you. ");
                this.punishments.prisonCaptorPunishmentConfinementRestlegs();
                return true;
            }
        }
        if (this.randomCooldownPetDream <= 0 && rand(100) < 30 + this.trainingPet.prisonCaptorPetScore() && this.prison.trainingPet.prisonCaptorPetTier() >= 2 && !this.prisonCaptor.roomEventOverride[this.flags[kFLAGS.PRISON_PUNISHMENT]] && !this.prison.trainingPet.prisonCaptorPetOptedOut()) {
            eventOccurred = this.trainingPet.prisonCaptorPetDreamStart();
            if (eventOccurred) {
                this.prisonCaptor.updateNextWaitRandomEvent(this.getGame().time.hours, this.getGame().time.days);
            }
        }
        return eventOccurred;
    }

    public prisonCaptorRandomEventSounds(): boolean {
        this.outputText("\nThe muffled screams and moans of one of your fellow prisoners being punished penetrate the thick walls of your cell and echo in the air.");
        if (this.player.obey > 45) {
            if (this.player.obey > 70) {
                this.outputText(" You are consumed with jealousy and arousal ");
                this.dynStats("lus", 10);
            }
            else {
                this.outputText(" To your great shame you can't help but feel aroused ");
                this.dynStats("lus", 5);
            }
            this.outputText("wishing that it was you being subjected to whatever treatment is eliciting that response.");
            this.changeEsteem(-1, this.inPrison);
            this.changeWill(-10);
        }
        else if (this.player.cor > 50) {
            this.outputText(" The sound is so deliciously exciting that you can't help but wish you were the one being tortured.");
            this.dynStats("lus", 5);
            this.changeWill(-5);
            this.changeObey(1, this.inPrison);
        }
        else {
            this.outputText(" The sound reminds you of the hopelessness of your situation.");
            this.changeWill(-15);
        }

        this.outputText("\n");
        this.doNext(this.playerMenu);
        return true;
    }

    public prisonCaptorRoomEvents(): boolean {
        if (this.flags[kFLAGS.IN_PRISON] == 0) return false; // Make sure events don't proc!
        const eventOccurred: boolean = false;
        if ((this.flags[kFLAGS.PRISON_PUNISHMENT] == 0 || this.flags[kFLAGS.PRISON_PUNISHMENT] == 3) && this.player.lust >= this.player.maxLust() && rand(3) == 0) {
            // prisonCaptor.updateNextRoomRandomEvent(getGame().time.hours, getGame().time.days);
            // Wild Dildo Rack appears!
            if (rand(2) == 1 && !this.prisonCanMasturbate(false) && this.flags[kFLAGS.PRISON_DILDO_RACK] == 0) {
                this.outputText(this.prisonCaptor.captorTitle + " " + this.prisonCaptor.captorName + " enters the room to find you writhing on the floor with unmanageable lust and is clearly amused by your pathetic state of affairs. After a moment's thought " + this.prisonCaptor.captorPronoun1 + " comes to a decision and says, \"<i>Even naughty " + this.player.mf("boy", "girl") + "s deserve to have a special friend at times like this, and I happen to have a friend that should help you learn the value of good behavior while solving your current dilemma.</i>\" A wry smirk crosses " + this.prisonCaptor.captorPronoun3 + " face as " + this.prisonCaptor.captorPronoun1 + " leaves the room. A few minutes later an imp guard drags a strange object into the room, sets it beside you, then leaves you to ponder it alone.\n\n");
                this.outputText("Your new \"friend\" appears to be a four foot tall round post with a wide variety of dildos sticking out at every imaginable height and angle. While the tower and its appendages are made of some sort of slick black latex-like material, the entire construction radiates a strange energy, almost as though it could come alive at any moment. It occurs to you that in an odd way it resembles a pine tree, since the dildos become progressively larger the closer they are to the ground. You are puzzled for a second, then suddenly you understand.\n\n");
                this.outputText("A horny slave who was able to move about freely could reach the most pleasant and appealing looking dongs near the top: modestly sized, generally human looking phalluses with mild ribs, bumps and other features designed to give extra pleasure to the user. You notice that there are even several metal rings hanging from the ceiling above the post which could facilitate more creative positions for using the highest of the dildos.\n\n");
                this.outputText("A mildly restrained slave who could still stand or squat, however, would only be able to reach the middle tier of simulated cocks. While none of these look too unpleasant, they are all of a size that would challenge even a well-practiced pussy or asshole. Many of them look like oversized dog and cat dicks, but others have more esoteric shapes and designs, with shocking twists, bumps, and spurs that would make fucking them a bit of an adventure, to say the least.\n\n");
                this.outputText("Finally, a slave whose bad behavior had earned them restraints that kept them from doing more than kneeling or crawling would have no choice but to impale themself on the world shattering monstrosities near the base of the dildo rack if they wanted to relieve their pent up sexual energy. The sight of these tremendous equine members, frightening demonic rods, and other indescribable oversized shafts leaves no uncertainty about what kind of lessons your " + this.prisonCaptor.captorTitle + " expects you to learn from your new cellmate.\n\n");
                if (this.player.obey > 45) {
                    this.outputText("An overwhelming need to subject yourself to this new form of punishment as soon as possible washes over you.");
                }
                else if (this.player.cor > 50) {
                    this.outputText("You can't help but feel a sense of gratitude to your captor for giving you such an exciting new toy, and look forward to making use of it.");
                }
                else {
                    this.outputText("You aren't sure what is more demoralizing: the fact that you now have to share you living space with this unholy thing, or the fact that you almost certainly will be making use of it given your current state of arousal and restraint.");
                }

                this.flags[kFLAGS.PRISON_DILDO_RACK] = 1;
                return true;
            }
            // Wild Billie appears!
            if (this.billieScene.prisonCaptorBillieMet() > 0 && rand(5) < this.billieScene.prisonCaptorBillieEvent()) {
                this.billieScene.prisonCaptorBillieEventSet(1);
                this.billieScene.prisonCaptorBilliePityFuck();
                return true;
            }
            this.billieScene.prisonCaptorBillieEventChange(1);
            this.outputText(this.images.showImage("prison-elly"));
            this.outputText(this.prisonCaptor.captorTitle + " " + this.prisonCaptor.captorName + " enters the room to find you writhing on the floor with unmanageable lust and is clearly amused by your pathetic state of affairs. After a moment's thought " + this.prisonCaptor.captorPronoun1 + " comes to a decision and says, \"<i>Beg me to fuck you, and I might take pity on you.</i>\"\n\n");
            this.outputText("Do you give in to your lust and beg your " + this.prisonCaptor.captorTitle + " to fuck you, or do you try to resist? " + this.prisonWillCostDescript(15));
            this.menu();
            this.addButton(0, "Beg", this.prisonCaptorBegSubmit);
            this.addButton(1, "Resist", this.prisonCaptorBegResist);
            return true;
        }
        // Pet dreams
        let petDreamRarity: number = 8;
        petDreamRarity -= this.trainingPet.prisonCaptorPetScore() / 5;
        if (petDreamRarity < 2) petDreamRarity = 2;
        if (this.randomCooldownPetDream <= 0 && rand(petDreamRarity) == 0 && !this.trainingPet.prisonCaptorPetOptedOut()) {
            this.randomCooldownPetDream = 8 + rand(8);
            if (this.trainingPet.prisonCaptorPetScore() == 0) this.trainingPet.prisonCaptorPetDreamIntro();
            else if (this.trainingPet.prisonCaptorPetScore() < 5) this.trainingPet.prisonCaptorPetDreamLazy();
            else if (this.trainingPet.prisonCaptorPetScore() < 10) this.trainingPet.prisonCaptorPetDreamModest();
            else if (this.trainingPet.prisonCaptorPetScore() < 25) this.trainingPet.prisonCaptorPetDreamExcited();
            else this.trainingPet.prisonCaptorPetPlayOffer();
            return true;
        }
        // Punishments
        if (this.flags[kFLAGS.PRISON_PUNISHMENT] == 1) {
            if (this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) == 0) {
                this.punishments.prisonCaptorPunishmentStockadesFreedom();
                return true;
            }
        }
        if (this.flags[kFLAGS.PRISON_PUNISHMENT] == 2) {
            if (this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) == 0) {
                this.punishments.prisonCaptorPunishmentConfinementFreedom();
                return true;
            }
        }
        if (this.flags[kFLAGS.PRISON_PUNISHMENT] == 3) {
            if (this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) == 0) {
                this.punishments.prisonCaptorPunishmentBJTrainerTimesup();
                return true;
            }
        }
        return eventOccurred;
    }

    public prisonCaptorRandomEventCleaningCheck(): void {
        this.hideMenus();
        this.clearOutput();
        let cleanlinessLevel: number = 0;
        this.outputText(this.images.showImage("prison-elly"));
        this.outputText(this.prisonCaptor.captorTitle + " " + this.prisonCaptor.captorName + " enters the room and begins to inspect its level of cleanliness. ");
        if (this.flags[kFLAGS.PRISON_DIRT_ENABLED] == 0) {
            this.outputText("\"<i>A worthless piece of meat such as yourself has no reason to care if they live in filth -- you should simply be grateful to have a roof over your head and a " + this.prisonCaptor.captorTitle + " to give you a purpose in life. However, you should certainly be concerned with offending your " + this.prisonCaptor.captorTitle + " with that filth.</i>\" As the words fill the room, " + this.prisonCaptor.captorPronoun3 + " displeasure is almost palpable.");
            this.outputText("\n\n\"<i>Mark my words, slave: you <b>will</b> keep this room clean.</i>\" Nothing more needs to be said for you to understand that there will be consequences if you don't.");
            this.outputText("\n\n<b>From now on, Elly will check your cell every day at 4pm.</b>");
            this.flags[kFLAGS.PRISON_DIRT_ENABLED] = 1;
            this.prisonCaptorTrainingStatusUpdate();
            this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 2, 51);
            this.doNext(this.playerMenu);
            return;
        }
        this.outputText("From the look on " + this.prisonCaptor.captorPronoun3 + " face you know immediately that ");
        cleanlinessLevel = Math.floor(this.player.statusEffectv2(StatusEffects.PrisonCaptorEllyStatus) / 25);
        switch (cleanlinessLevel) {
            case 0:
                this.outputText(this.prisonCaptor.captorPronoun1 + " is satisfied with what [captorhe] sees.");
                this.doNext(this.playerMenu);
                return;
            case 1:
                this.outputText(this.prisonCaptor.captorPronoun1 + " is a bit annoyed with what [captorhe] sees, but not overly upset.\n\n");
                this.prisonPunishment(100);
                return;
            case 2:
                this.outputText(this.prisonCaptor.captorPronoun1 + " is furious over what [captorhe] sees, and that you are in trouble.\n\n");
                this.prisonPunishment(50);
                return;
            case 3:
            case 4:
            default:
                this.outputText("you are about to suffer [captorhis] wrath.\n\n");
                this.prisonPunishment(0);
                return;
        }
        this.doNext(this.playerMenu);
    }

    public prisonCaptorPunishmentRestrain(): void {
        if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) == 0) {
            this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 1);
        }
        else if (this.player.statusEffectv3(StatusEffects.PrisonRestraints) < 2) {
            this.player.changeStatusValue(StatusEffects.PrisonRestraints, 3, this.player.statusEffectv2(StatusEffects.PrisonRestraints) + 1);
        }
        else if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) == 0) {
            this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, 0);
        }
        else if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) < 2) {
            this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 2);
        }
        else if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) < 3) {
            this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, this.player.statusEffectv4(StatusEffects.PrisonRestraints) + 1);
        }
        else {
            this.prisonPunishment(0);
            return;
        }

        this.outputText("(Placeholder) [captorTitle] [captorName] reaches a decision. \"<i>Perhaps having your freedoms a bit more restricted for a while will help you show some respect,</i>\" " + this.prisonCaptor.captorPronoun1 + " says as " + this.prisonCaptor.captorPronoun1 + " adjusts your restraints.");
        this.doNext(this.playerMenu);
    }

    public prisonCaptorRestraintCheckEvent(): boolean {
        this.outputText(this.images.showImage("prison-elly"));
        if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) == 0 && this.player.statusEffectv3(StatusEffects.PrisonRestraints) == 0 && this.player.statusEffectv4(StatusEffects.PrisonRestraints) == 0) {
            if (this.player.obey >= 95 && this.player.statusEffectv1(StatusEffects.PrisonRestraints) > 0) {
                this.outputText("\nYour " + this.prisonCaptor.captorTitle + " enters the room and looks pensive for a moment, then " + this.prisonCaptor.captorPronoun1 + " declares decisively, \"<i>I don't think we need to bother keeping the door locked anymore. Even if you do somehow work up the nerve to walk out the door, you'll soon find your way back to where you know you belong.</i>\"\n");
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 1, 0);
                this.flags[kFLAGS.PRISON_DOOR_UNLOCKED] = 1;
                this.doNext(this.playerMenu);
                return true;
            }
            return false;
        }
        if (true || !(this.prisonCaptor.captorName == "Elly")) {
            this.outputText("\n" + this.prison.prisonCaptor.captorTitle + " " + this.prisonCaptor.captorName + " enters the room and looks pensive for a moment, then " + this.prisonCaptor.captorPronoun1 + " declares decisively, \"<i>I think you might be learning your lesson. As a reward, I'll loosen your bindings a bit.</i>\"\n");
            this.prisonRestraintReduction(1);
            this.doNext(this.playerMenu);
            return true;
        }
        return false;
    }

    public prisonLoadGuard(randomGuard: boolean, guardID: string = "default"): void {
        this.prisonGuard.prisonCaptorLoadGuard(randomGuard, guardID);
    }

    public prisonPunishment(lightChance: number): void {
        this.prisonCaptor.selectPunishmentEvent(lightChance);
    }

    public prisonCaptorBegSubmit(): void {
        this.clearOutput();
        this.outputText("Unable to control yourself, you grovel on the floor begging your " + this.prisonCaptor.captorTitle + " to fuck you.\n\n");
        this.prisonCaptorSubmitFuck();
    }

    public prisonCaptorBegResist(): void {
        this.clearOutput();
        if (this.player.will < this.prisonWillCost(15)) {
            this.outputText("While you'd like to preserve a bit of your dignity, you simply don't have the willpower to resist right now. \n\n");
            this.changeEsteem(2, this.inPrison);
            this.prisonCaptorSubmitFuck();
            return;
        }
        this.outputText("(Placeholder) You manage to resist the urge to beg your " + this.prisonCaptor.captorTitle + " to fuck you for now, but you aren't sure how much longer you can hold out.");
        this.changeEsteem(5, this.inPrison);
        this.changeObey(-1, this.inPrison);
        this.changeWill(-this.prisonWillCost(15));
        this.doNext(this.playerMenu);
    }

    public prisonCaptorSubmitFuck(): void {
        let selector: any;
        selector = 0;
        if (this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyStatus) < 3) {
            selector = rand(3);
        }
        else {
            selector = rand(10);
            if (this.player.hasStatusEffect(StatusEffects.Heat)) {
                selector = 6;
            }
        }
        if (this.player.gender == 3) this.outputText(this.images.showImage("prison-elly-herm"));
        else if (this.player.gender == 2) this.outputText(this.images.showImage("prison-elly-female"));
        else this.outputText(this.images.showImage("prison-elly-male"));
        switch (selector) {
            case 0:
            case 1:
            case 2:
                this.ellyScene.getFistedWREKT();
                break;
            case 3:
            case 4:
            case 5:
                this.billieScene.prisonCaptorBilliePunishmentFuck("choose");
                break;
            case 6:
                this.ellyScene.getBredByElly();
                break;
            case 7:
            case 8:
            case 9:
            default:
                this.ellyScene.getAnallyStuffedByElly();
        }
        this.player.slimeFeed();
        this.changeObey(1, this.inPrison);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public prisonCaptorResistFuck(): void {
        if (this.player.gender == 3) this.outputText(this.images.showImage("prison-elly-herm"));
        else if (this.player.gender == 2) this.outputText(this.images.showImage("prison-elly-female"));
        else this.outputText(this.images.showImage("prison-elly-male"));
        let selector: any;
        selector = 0;
        if (this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyStatus) < 3) {
            selector = rand(3);
        }
        else {
            selector = rand(10);
            if (this.player.hasStatusEffect(StatusEffects.Heat)) {
                selector = 6;
            }
        }
        switch (selector) {
            case 0:
            case 1:
            case 2:
                if (this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyStatus) < 3) {
                    this.outputText("(Placeholder) \"<i>You haven't yet earned the privilege of getting fucked by my cock.");
                }
                else {
                    this.outputText("(Placeholder) \"<i>Being fucked by my cock would be too much of a reward given your recent behavior.");
                }
                this.outputText(" Perhaps you will be worthy of it next time. But don't worry, we'll still have plenty of fun.</i>\" She directs you to grab hold of a ring hanging from the ceiling, but you petulantly remain seated. This angers her, and she quickly binds your hands above your head and hangs you from a hook. She then expertly teases your erogenous zones with her skillful hands until you become weak in the knees and find yourself trying to support your weight any way you can. She allows you to struggle for a bit, then coerces you into begging for help. \n\n");
                this.outputText("When you do, she wraps straps around your knees, fastens then to nearby hooks, and draws them up so that you are half reclined with your legs drawn upward and outward beside your torso and you swing uncomfortably from your three supports. With you completely at her mercy, she begins to works the fingers of one hand into your [asshole] while teasing your genitals with the other. \n\n");
                if (this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyStatus) > 2 && rand(2) == 1) {
                    this.outputText("With four fingers in your bum and you teetering on the agonizing edge of orgasm, she decides to give you a second chance. She gives you a chance to beg her for her cock, and you take it. She then stands between your legs, replaces the fingers in your ass with the tip of her enormous cock. However, instead of fucking you, she tells you that you will need to show your contrition and fuck yourself. Overwhelmed by lust, you immediately respond, clumsily shifting your weight forward and backward until you find your self swinging wildly, stuffing yourself brutally with her fleshy shaft. Before long your exertion pays off and you orgasm.\n\n");
                    this.player.buttChange(32, true, true, false);
                    this.player.orgasm('Anal');
                }
                else {
                    this.outputText("Eventually she squeezes her entire hand inside. She holds it still, and begins to push your body back and forth so that the swinging motion forces her fist in and out of your sphincter, all the while continuing to expertly hold you at the edge of orgasm. Only after minutes of this agonizing treatment does she allow you to orgasm.");
                    // buttChange(20,true,true,false); //Must have phallus for anal virginity! Therefore this doesn't count.
                    this.player.orgasm('Generic');
                }
                if (this.player.hasCock()) {
                    this.outputText(" Thanks to her stimulation of your prostate you cum buckets, painting your [fullChest] and [face] with your sticky goo.");
                }
                if ((this.player.hasVagina()) && this.player.wetness() >= 4) {
                    if (this.player.hasCock()) {
                        this.outputText(" At the same time, your");
                    }
                    else {
                        this.outputText(" Your");
                    }
                    this.outputText(" abdomen is wracked with spasms of pleasure as a fountain of clear, viscous fluid erupts from your [cunt] and coats your Mistress' head and torso. She allows herself to indulge in a moment of ecstasy, rubbing your juices into her firm, shapely tits with her left hand while using them to massage her dick with her right. Despite being lost in your own pleasure, you cannot help but feel gratified watching her face, eyes closed, head tilted back, mouth agape, fiery red bangs haphazardly scattered across her face in sticky strands. Then the moment passes, and she speaks.");
                }
                this.outputText("\" <i>Do you understand now, slave? Your body craves my abuse. Embrace it -- once you do, your life will become an unending river of pleasure</i>\"");
                break;
            case 3:
            case 4:
            case 5:
            case 6:
                if (this.player.hasVagina()) {
                    this.outputText("(Placeholder) \"<i>You're going to get a special treat today, [boy], but first you need to beg me to put a baby in your dirty [cunt].</i>\" You petulantly refuse, ");
                    if (this.player.hasStatusEffect(StatusEffects.Heat)) {
                        this.outputText("but she simply laughs, walks up to you, and begins to stroke her dick in your face. In a matter of seconds your raging hormones get the better of you and you coyly acquiesce, and ask her to fuck your [pussy]. She makes you present yourself like a bitch in heat while continuing to beg. Finally she gives you want you want, and fills your womb with her potent seed.\n\n");
                    }
                    else {
                        this.outputText(" and in response she binds your arms tightly behind your back, affixes a wide spreader bar between your knees, and shove your [face] to the floor. \"<i>You misunderstand, slave. You have no choice. I will be filling your sweet little baby hole with cum, but first you <b>will</b> beg me to do it.</i>\" She then begins to finger your [clit], quickly filling you with unmanageable lust. [if (esteem < 40) \"It's not long before your willpower drains\"][if (esteem >= 40) \"You hold out as long as you can, but eventually you cave to your lust\"] and beg her to fuck your [pussy] and make you her breeder bitch. She does so, and you cum explosively the moment you feel her warm juices begin to fill your womb.");
                    }
                    this.player.cuntChange(32, true, true, false);
                    this.player.knockUp(PregnancyStore.PREGNANCY_IMP, 350, 70);
                    this.player.orgasm('Vaginal');
                    break;
                }
                break;
            case 7:
            case 8:
            case 9:
            default:
                this.outputText("(Placeholder) She directs you to lie down and spread your legs for her but you refuse. Before you know it you are face down bent over the rack, arms tied to the wheel at the far end and ankles bound wide to the legs of the table. She then pounds at your [asshole] mercilessly until you orgasm from the shameful stimulation. \"<i>Do you understand now, slave? I don't even have to touch your ");
                if (this.player.hasCock()) {
                    this.outputText("pathetic cock");
                }
                else if (this.player.hasVagina()) {
                    this.outputText("dirty cunt");
                }
                else {
                    this.outputText("silly little mound");
                }

                this.outputText(" to make you spurt. Your body wants to be used by my dick and filled with my seed. You are a cocksucking, anal loving, cum-slut. Accept it.</i>\"");
                this.player.buttChange(32, true, true, false);
                this.player.orgasm('Anal');
        }
        this.outputText("(Placeholder) Afterwards, " + this.prisonCaptor.captorPronoun1 + " leaves you hogtied to help you remember to obey in the future. ");
        this.player.slimeFeed();
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 2);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public prisonCaptorPunishmentFuck(): void {
        this.outputText(this.images.showImage("prison-elly"));
        this.outputText("[captorTitle] [captorName] wears a beguiling half smile while studying you intently with [captorhis] piercing eyes, then reaches a decision. \"<i>A good fucking should suffice; whether you try to resist or not, your own body is going to correct your bad behavior today. Either way we're both going to enjoy this, so the only question is how hard you want to make it for yourself?</i>\"[if (lust > 75) \" You wonder if [captorhe] can see just how horny you currently are as you consider how to respond.\"]\n\n");
        this.outputText("Do you give in and take your punishment submissively, or do you make an effort to resist?");
        this.menu();
        this.addButton(0, "Submit", this.prisonCaptorPunishmentFuckSubmit);
        this.addButton(1, "Resist", this.prisonCaptorPunishmentFuckResist);
    }

    public prisonCaptorPunishmentFuckSubmit(): void {
        this.outputText("You decide to submit to whatever sexual activity your [captorTitle] has in mind[if (lust > 75) \"-- you are just too aroused to do otherwise\"].\n\n");
        this[this.prisonCaptor.submitFuckFunc]();
    }

    public prisonCaptorPunishmentFuckResist(): void {
        this.outputText("You decide to do your best to resist whatever sexual activity your [captorTitle] has in store for you[if (lust > 75) \", in spite of the lust currently burning within you\"].\n\n");
        this[this.prisonCaptor.resistFuckFunc]();
    }

    /*public function prisonItemSpecialEvent(item:Useable, previousEvent): boolean
    {
        if (item == consumables.C_BREAD && trainingPet.prisonCaptorPetTier() > 0 && !trainingPet.prisonCaptorPetOptedOut())
        {
            trainingPet.prisonCaptorPetLickCumBowl("choose", previousEvent);
            return true;
        }
        return false;
    }*/

    public prisonItemBread(cumBread: boolean, lickPrompt: boolean = true): void {
        this.clearOutput();

        if (cumBread) {
            this.outputText(this.images.showImage("item-cBread"));
            if (lickPrompt && this.trainingPet.prisonCaptorPetTier() > 0 && !this.trainingPet.prisonCaptorPetOptedOut()) {
                this.trainingPet.prisonCaptorPetLickCumBowl("choose");
                return;
            }
            this.outputText("You look at the bowl full of cum with bits of soggy bread floating in it. ");
            if (this.player.obey < 25) {
                this.outputText("The thought of consuming such a thing ");
                if (this.player.cor < 50) {
                    this.outputText("disgusts and horrifies you, but ");
                }
                else {
                    this.outputText("is disgusting but also a bit arousing. In any case, ");
                    this.dynStats("lus", 10);
                }
                this.outputText("you know you must eat if it you are going to keep your strength and willpower reserves up. It fills you with shame, but you slowly consume the sticky soup.");
            }
            else if (this.player.obey < 45) {
                this.outputText("You know you are expected to eat it without complaint ");
                if (this.player.cor < 50) {
                    this.outputText("but you still find the experience disgusting. ");
                }
                else {
                    this.outputText("but you can't help feeling an uncomfortable mixture of disgust and arousal at the thought. ");
                    this.dynStats("lus", 10);
                }
                this.outputText("In any case, you must eat if it you are going to keep your strength and willpower reserves up. It fills you with shame, but you dutifully consume the sticky soup.");
            }
            else if (this.player.obey < 70) {
                this.outputText("You know you are expected to eat it without complaint and it is almost second nature to do so despite the foul ");
                if (this.player.cor < 50) {
                    this.outputText("");
                }
                else {
                    this.outputText("yet arousing ");
                    this.dynStats("lus", 10);
                }
                this.outputText("experience of doing so.  You are filled with a welcome shame as you dutifully consume the sticky soup");
            }
            else {
                this.outputText("You know you are expected to eat it without complaint and your only desire is to relish the humiliation of doing so. You are filled with a wonderful mixture of arousal and shame as you dutifully consume the sticky soup.");
                this.dynStats("lus", 10);
            }
            this.prisonItemBreadHeatEffect();
            this.changeEsteem(-2, this.inPrison);
            if (rand(100) < this.player.cor || rand(50) > this.player.esteem) {
                this.outputText("\n\nAfterwards you find yourself overcome by ");
                if (this.player.obey < 45) {
                    this.outputText("an uncomfortable ");
                }
                else {
                    this.outputText("a familiar ");
                }
                this.outputText("sense of satisfaction at having committed the submissive and demeaning act.");
                this.changeObey(1, this.inPrison);
            }
            this.player.refillHunger(20);
        }
        else {
            this.outputText("You eat the stale, flavorless brick of bread. It satisfies your hunger, but not much else.");
            this.player.refillHunger(40);
        }
        this.doNext(this.inventory.inventoryMenu);
    }

    public prisonItemBreadHeatEffect(bonusResist: number = 0): void {
        if ((!(this.player.race == "human") || this.player.catScore() > 1 || this.player.dogScore() > 1 || this.player.foxScore() > 1 || this.player.horseScore() > 1 || this.player.minoScore() > 1 || this.player.cowScore() > 4 || this.player.bunnyScore() > 1 || this.player.kangaScore() > 1) && rand(this.player.obey) > 20 + bonusResist) {
            this.outputText("\n\nAs you eat, the submissive nature of the act stirs an animalistic response in your mutated body. ");
            if (this.player.hasVagina()) {
                if (this.player.pregnancyIncubation == 0) {
                    if (this.player.hasStatusEffect(StatusEffects.Heat)) {
                        this.outputText("Your mind clouds as your " + this.player.vaginaDescript(0) + " moistens.  Despite already being in heat, the desire to copulate constantly grows even larger.");
                        if (this.player.statusEffectv1(StatusEffects.Heat) < 100) this.player.addStatusValue(StatusEffects.Heat, 1, 10);
                        if (this.player.statusEffectv2(StatusEffects.Heat) < 100) this.player.addStatusValue(StatusEffects.Heat, 2, 10);
                        if (this.player.statusEffectv3(StatusEffects.Heat) < 720) this.player.addStatusValue(StatusEffects.Heat, 3, 96);
                        this.dynStats("lib", 10);
                    }
                    if (!this.player.hasStatusEffect(StatusEffects.Heat)) {
                        this.outputText("Your mind clouds as your " + this.player.vaginaDescript(0) + " moistens.  Your hands begin stroking your body from top to bottom, your sensitive skin burning with desire.  Fantasies about bending over and presenting your needy pussy to a male overwhelm you as you realize <b>you have gone into heat</b>!");
                        this.player.createStatusEffect(StatusEffects.Heat, 20, 20, 96, 0);
                        this.dynStats("sens", 10);
                    }
                }
                else {
                    this.outputText("You feel a stirring in your belly, and you are overcome by a queer feeling of contentedness.");
                }
            }
            else {
                this.outputText("Strange fantasies about bending over and presenting a needy pussy to a male overwhelm you, and for a moment you find yourself wishing you had the proper equipment to act them out.");
            }
        }
    }

    public prisonCaptorTrainingStatusUpdate(): void {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyStatus)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyStatus, 1, 0, 0, 0);
        }
        switch (this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyStatus)) {
            case 0:
            case 1:
            case 2:
                if (this.player.obey < 10) {
                    this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 1, 1);
                    if (this.flags[kFLAGS.PRISON_TRAINING_LEVEL] > 0) {
                        this.flags[kFLAGS.PRISON_TRAINING_LEVEL] = -1;
                    }
                    else {
                        this.flags[kFLAGS.PRISON_TRAINING_LEVEL] = 4;
                    }
                }
                break;
            case 3:
                if (this.player.obey < 25) {
                    this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 1, 2);
                    if (this.flags[kFLAGS.PRISON_TRAINING_LEVEL] > 0) {
                        this.flags[kFLAGS.PRISON_TRAINING_LEVEL] = -1;
                    }
                    else {
                        this.flags[kFLAGS.PRISON_TRAINING_LEVEL] = 5;
                    }
                }
                break;
            case 4:
                if (this.player.obey < 45) {
                    this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 1, 3);
                    if (this.flags[kFLAGS.PRISON_TRAINING_LEVEL] > 0) {
                        this.flags[kFLAGS.PRISON_TRAINING_LEVEL] = -1;
                    }
                    else {
                        this.flags[kFLAGS.PRISON_TRAINING_LEVEL] = 5;
                    }
                }
                break;
            case 5:
                if (this.player.obey < 70) {
                    this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 1, 4);
                    if (this.flags[kFLAGS.PRISON_TRAINING_LEVEL] > 0) {
                        this.flags[kFLAGS.PRISON_TRAINING_LEVEL] = -1;
                    }
                    else {
                        this.flags[kFLAGS.PRISON_TRAINING_LEVEL] = 5;
                    }
                }
                break;
            case 6:
                if (this.player.obey < 90) {
                    this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 1, 5);
                    if (this.flags[kFLAGS.PRISON_TRAINING_LEVEL] > 0) {
                        this.flags[kFLAGS.PRISON_TRAINING_LEVEL] = -1;
                    }
                    else {
                        this.flags[kFLAGS.PRISON_TRAINING_LEVEL] = 5;
                    }
                }
                break;
            default:
        }
    }

    public displayPrisonStats(): void {
        let trainingLevelCounter: any;
        if (this.flags[kFLAGS.IN_PRISON] > 0) {
            this.outputText("\n<b><u>Mental State</u></b>\n");
            this.outputText("<b>Willpower:</b> " + Math.round(this.player.will) + " / 100\n");
            // outputText("<b>Hunger:</b> " + Math.round(player.hunger) + " / 100\n"); //Shows in Body Stats
            this.outputText("<b>Self-Esteem:</b> " + Math.round(this.player.esteem) + " / 100 (");
            if (this.player.esteem < 15) {
                this.outputText("Very Low");
            }
            else if (this.player.esteem < 40) {
                this.outputText("Low");
            }
            else if (this.player.esteem < 60) {
                this.outputText("Normal");
            }
            else if (this.player.esteem < 85) {
                this.outputText("High");
            }
            else {
                this.outputText("Very High");
            }
            this.outputText(")\n");
            this.outputText("<b>Obedience:</b> " + Math.round(this.player.obey) + " / " + (this.player.obeySoftCap ? 50 : 100) + " (");
            if (this.player.obey < 10) {
                this.outputText("Strong Willed");
            }
            else if (this.player.obey < 25) {
                this.outputText("Agreeable");
            }
            else if (this.player.obey < 45) {
                this.outputText("Submissive");
            }
            else if (this.player.obey < 70) {
                this.outputText("Highly Submissive");
            }
            else if (this.player.obey < 90) {
                this.outputText("Willing Slave");
            }
            else {
                this.outputText("Perfect Slave");
            }
            if (this.player.obey >= 50 && this.player.obeySoftCap == true) {
                this.outputText(") (Growth halted)\n");
            }
            else {
                this.outputText(")\n");
            }
        }
        if (this.flags[kFLAGS.PRISON_CAPTURE_COUNTER] > 0) {
            this.outputText("\n");
            this.outputText("<b><u>Prisoner Stats</u></b>\n");
            this.outputText("<b>Times Captured by Slavers: </b>" + this.flags[kFLAGS.PRISON_CAPTURE_COUNTER] + "\n");
            this.outputText("<b>Capture After Combat Loss Chance: </b>");
            if (this.flags[kFLAGS.PRISON_CAPTURE_CHANCE] <= 0) {
                this.outputText("None");
            }
            else if (this.flags[kFLAGS.PRISON_CAPTURE_CHANCE] < 30) {
                this.outputText("Low");
            }
            else {
                this.outputText("Normal");
            }
            this.outputText("\n");
            if (this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyStatus)) {
                this.outputText("<b>Mistress Elly Training Level: </b>" + this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyStatus) + " (");
                switch (this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyStatus)) {
                    case 0:
                    case 1:
                        this.outputText("Untrained");
                        break;
                    case 2:
                        this.outputText("Respectful");
                        break;
                    case 3:
                        this.outputText("Cock Sucker");
                        break;
                    case 4:
                        this.outputText("Orgasm Toy");
                        break;
                    case 5:
                        this.outputText("Anal Slut");
                        break;
                    case 6:
                    default:
                        this.outputText("Elly's Bitch");
                }
                this.outputText(")\n");
            }
            trainingLevelCounter = this.flags[kFLAGS.PRISON_TRAINING_LEVEL] - 1;
            if (trainingLevelCounter > 0) {
                switch (this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyStatus)) {
                    case 0:
                    case 1:
                        this.outputText("<b>Displayed Manners: </b>");
                        break;
                    case 2:
                        this.outputText("<b>Given head willingly: </b>");
                        break;
                    case 3:
                        this.outputText("<b>Orgasmed on command: </b>");
                        break;
                    case 4:
                        this.outputText("<b>Accepted anal sex: </b>");
                        break;
                    case 5:
                        this.outputText("<b>Performed quests willingly: </b>");
                        break;
                    case 6:
                    default:
                        this.outputText("<b>Performed quests without question: </b>");
                }
                this.outputText(trainingLevelCounter + " time");
                if (trainingLevelCounter == 1) {
                    this.outputText("\n");
                }
                else {
                    this.outputText("s\n");
                }

                this.billieScene.prisonCaptorBillieStatusText();
            }
            if (this.trainingPet.prisonCaptorPetTier() > 0 && !this.trainingPet.prisonCaptorPetOptedOut())
                this.trainingPet.prisonCaptorPetStatusText();
            if (this.trainingFeed.prisonCaptorFeedingQuestTrainingExists())
                this.trainingFeed.prisonCaptorFeedingQuestTrainingStatusText();
            if (this.trainingFeed.prisonCaptorFeedingQuestOptedOut())
                this.outputText("<b>Quests Disabled</b>\n");
            this.outputText("");
        }
    }

}
