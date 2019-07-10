import { BaseContent } from "../../../BaseContent";
import { Monster } from "../../../Monster";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { StatusEffects } from "../../../StatusEffects";
import { rand } from "../../../Extra";
import { Imp } from "../../Monsters/Imp";
import { Goblin } from "../../Monsters/Goblin";
import { Gnoll } from "../../Areas/Plains/Gnoll";
import { GnollSpearThrower } from "../../Areas/Plains/GnollSpearThrower";
import { Minotaur } from "../../Areas/Mountain/Minotaur";
import { Satyr } from "../../Areas/Plains/Satyr";
import { WeightedDrop } from "../../../internals/WeightedDrop";

export class PrisonGuard extends BaseContent {
    private randomGuardList: any[] = ["imp", "goblin", "gnoll", "gnoll spear-thrower", "minotaur", "satyr"];

    public guardType: string;
    public guardPronoun1: string;
    public guardPronoun2: string;
    public guardPronoun3: string;
    public guardA: string;
    public guardCaptitalA: string;
    public guardCombatID: Monster;
    public guardEscapeSeduceBonus: number;
    public guardEscapeBribeBonus: number;
    public guardEscapeSneakBonus: number;

    public get guardNoiseDetectionChance(): number {
        return 10;
    }

    public prisonCaptorRandomEventAbuse(): boolean {
        this.hideMenus();
        this.clearOutput();
        if (this.flags[kFLAGS.PRISON_TRAINING_LEVEL] == 0 && this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyStatus) <= 1) {
            return this.prison.prisonCaptorRandomEventSounds();
        }
        this.prisonCaptorLoadGuard(true);
        this.outputText("You are startled by the sound of the door opening, and quickly find yourself wishing you hadn't heard it at all. " + this.guardCaptitalA + " " + this.guardType + " guard enters the room and quickly secures the door behind " + this.guardPronoun2 + ", then turns towards you with the clear intent of fucking you and showing you your place.\n\n");
        return this.prisonGuardAttack();
    }

    public prisonGuardAttack(): boolean {
        if (this.prison.prisonCanEscapeFight(false)) {
            this.outputText("It occurs to you that if you were to resist you just might get the better of your guard and make good an escape. ");
            if (rand(100) < this.player.obey - (this.player.level + this.player.esteem * 0.25)) {
                if (this.player.obey < 45) {
                    this.outputText("However, something deep inside you tells you that this is not the right moment to make a stand. Instead you cower meekly as your guard looms over you.\n");
                }
                else if (this.player.obey < 75) {
                    this.outputText("However, your conditioning gets the better of your desire for freedom and you fall to your knees submissively as the " + this.guardPronoun1 + " looms over you.\n");
                    this.dynStats("lus", 100);
                }
                else {
                    this.outputText("However, you have no desire to fight back; to the contrary, your only desire is to absorb every ounce of punishment " + this.guardPronoun1 + " has in mind, and you silently communicate as much by bending over and assuming the most secuctively submissive stance you can manage.\n");
                    this.dynStats("lus", 100);
                }

                this.prison.prisonEscapeFightAutoLose();
            }
            else {
                this.outputText("Do you make an escape attempt? " + this.prison.prisonWillCostDescript(15));
                this.outputText("\n");
                this.doYesNo(this.prisonGuardAttackFight, this.prisonGuardAttackSubmit);
                if (this.player.will >= this.prison.prisonWillCost(10)) {
                    this.outputText("\nYou could tell the " + this.guardType + " to fuck off and leave you alone. " + this.prison.prisonWillCostDescript(10));
                    this.addButton(2, "Fuck Off", this.giveGuardTheFinger);
                }
                return true;
            }
        }
        else {
            if (this.player.obey < 45) {
                this.outputText("Unfortunately for you,");
            }
            else if (this.player.obey < 75) {
                this.outputText("Something inside you is relieved that");
                this.dynStats("lus", 15);
            }
            else {
                this.outputText("It gives you pleasure when you realize that");
                this.dynStats("lus", 30);
            }

            this.outputText(" your restraints prevent you from putting up any significant fight");
            if (this.player.lust > 80) {
                this.outputText(" -- not that you'd last long in a fight with your current state of arousal anyway.  Seeing this fact written on your face, the " + this.guardType + " chuckles and temporarily removes your bindings.\n");
            }
            else {
                this.outputText(". As you struggle ineffectually, the " + this.guardType + " beats you senseless then temporarily removes your bindings.\n");
            }
            this.doNext(this.prison.prisonEscapeFightAutoLose);
            if (this.player.will >= this.prison.prisonWillCost(10)) {
                this.outputText("\nYou could tell the " + this.guardType + " to fuck off and leave you alone. " + this.prison.prisonWillCostDescript(10));
                this.addButton(2, "Fuck Off", this.giveGuardTheFinger);
            }
            return true;
        }
        this.doNext(this.playerMenu);
        return true;
    }

    public prisonGuardAttackFight(): void {
        if (this.player.will > this.prison.prisonWillCost(15)) {
            this.outputText("\n\nYou steel yourself for combat, feeling a sudden rush of self confidence.");
            this.prison.changeWill(-this.prison.prisonWillCost(15));
            this.prison.prisonEscapeFightStart();
        }
        else {
            this.outputText("\n\nYou make a valiant effort to prepare for combat, but ultimately your will gives out and you collapse in front of the advancing " + this.guardType + ".");
            this.prison.changeEsteem(2, this.prison.inPrison);
            this.prison.prisonEscapeFightAutoLose();
        }
    }

    public prisonGuardAttackSubmit(): void {
        this.outputText("\n\n");
        if (this.player.obey < 45) {
            this.outputText("Something deep inside you tells you that this is not the right moment to make a stand. Instead you cower meekly as the " + this.guardType + " looms over you.\n");
        }
        else if (this.player.obey < 75) {
            this.outputText("Your conditioning gets the better of your desire for freedom and you fall to your knees submissively as the " + this.guardType + " looms over you.\n");
            this.dynStats("lus", 100);
        }
        else {
            this.outputText("However, you have no desire to fight back; to the contrary, your only desire is to absorb every ounce of punishment this " + this.guardType + " has in mind, and you silently communicate as much bending over and assuming the most seductively submissive stance you can manage.\n");
            this.dynStats("lus", 100);
        }

        this.prison.changeObey(1, this.prison.inPrison);
        this.prison.prisonEscapeFightAutoLose();
    }

    public giveGuardTheFinger(): void {
        this.clearOutput();
        this.prison.changeWill(-this.prison.prisonWillCost(10));
        this.outputText("You flip the bird to the " + this.guardType + " to put a warning signal that you do not want " + this.guardPronoun2 + " to mess with you. You WANT Elly, not some random guards messing with your body.");
        this.outputText("\n\nThe " + this.guardType + " gets angry and storms off, leaving your cell and locking the cell door.");
        if (this.flags[kFLAGS.PRISON_DOOR_UNLOCKED] > 0) this.flags[kFLAGS.PRISON_DOOR_UNLOCKED] = 0;
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 1, 1);
        this.doNext(this.playerMenu);
    }

    public prisonCaptorLoadGuard(randomGuard: boolean, guardID: string = ""): void {
        if (randomGuard) {
            const guardID: string = this.randomGuardList[rand(this.randomGuardList.length)];
        }
        switch (guardID) {
            case "imp":
                this.guardType = "imp";
                this.guardPronoun1 = "he";
                this.guardPronoun2 = "him";
                this.guardPronoun3 = "his";
                this.guardA = "an";
                this.guardCaptitalA = "An";
                this.guardCombatID = new Imp();
                this.guardEscapeSeduceBonus = 15;
                this.guardEscapeBribeBonus = 15;
                this.guardEscapeSneakBonus = 5;
                break;
            case "goblin":
                this.guardType = "goblin";
                this.guardPronoun1 = "she";
                this.guardPronoun2 = "her";
                this.guardPronoun3 = "her";
                this.guardA = "a";
                this.guardCaptitalA = "A";
                this.guardCombatID = new Goblin();
                this.guardEscapeSeduceBonus = 15;
                this.guardEscapeBribeBonus = 15;
                this.guardEscapeSneakBonus = 5;
                break;
            case "gnoll":
                this.guardType = guardID;
                this.guardPronoun1 = "she";
                this.guardPronoun2 = "her";
                this.guardPronoun3 = "her";
                this.guardA = "a";
                this.guardCaptitalA = "A";
                this.guardCombatID = new Gnoll();
                this.guardEscapeSeduceBonus = 15;
                this.guardEscapeBribeBonus = 20;
                this.guardEscapeSneakBonus = 5;
                break;
            case "gnoll spear-thrower":
                this.guardType = guardID;
                this.guardPronoun1 = "she";
                this.guardPronoun2 = "her";
                this.guardPronoun3 = "her";
                this.guardA = "a";
                this.guardCaptitalA = "A";
                this.guardCombatID = new GnollSpearThrower();
                this.guardEscapeSeduceBonus = 15;
                this.guardEscapeBribeBonus = 20;
                this.guardEscapeSneakBonus = 5;
                break;
            case "minotaur":
                this.guardType = guardID;
                this.guardPronoun1 = "he";
                this.guardPronoun2 = "him";
                this.guardPronoun3 = "his";
                this.guardA = "a";
                this.guardCaptitalA = "A";
                this.guardCombatID = new Minotaur();
                this.guardEscapeSeduceBonus = 20;
                this.guardEscapeBribeBonus = 10;
                this.guardEscapeSneakBonus = 15;
                break;
            case "satyr":
                this.guardType = guardID;
                this.guardPronoun1 = "he";
                this.guardPronoun2 = "him";
                this.guardPronoun3 = "his";
                this.guardA = "a";
                this.guardCaptitalA = "A";
                this.guardCombatID = new Satyr();
                this.guardEscapeSeduceBonus = 20;
                this.guardEscapeBribeBonus = 10;
                this.guardEscapeSneakBonus = 15;
                break;
            default:
                this.guardType = guardID;
                this.guardPronoun1 = "he";
                this.guardPronoun2 = "him";
                this.guardPronoun3 = "his";
                this.guardA = "a";
                this.guardCaptitalA = "A";
                this.guardCombatID = new Minotaur();
                this.guardEscapeSeduceBonus = 20;
                this.guardEscapeBribeBonus = 10;
                this.guardEscapeSneakBonus = 15;
        }
        this.guardCombatID.drop = new WeightedDrop();
    }
}
