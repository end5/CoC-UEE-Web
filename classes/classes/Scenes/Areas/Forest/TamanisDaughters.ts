import { Goblin } from "../../Monsters/Goblin";
import { rand, int } from "../../../Extra";
import { TamainsDaughtersScene } from "./TamainsDaughtersScene";
import { StatusEffects } from "../../../StatusEffects";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { Vagina } from "../../../Vagina";
import { Appearance } from "../../../Appearance";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { WeightedDrop } from "../../../internals/WeightedDrop";

export class TamanisDaughters extends Goblin {
    private midRoundMadness(): void {
        const selector: number = rand(4);
        if (selector == 0) {
            this.outputText("A slender hand reaches inside your " + this.player.armorName + " and gives your ");
            if (this.player.balls > 0) {
                if (rand(2) == 0) this.outputText(this.player.multiCockDescriptLight());
                else this.outputText(this.player.ballsDescriptLight());
            }
            else this.outputText(this.player.multiCockDescriptLight());
            this.outputText(" a gentle squeeze.  You twist away but your breathing gets a little heavier.\n\n");
        }
        else if (selector == 1) {
            this.outputText("A girl latches onto your " + this.player.legs() + " and begins caressing your body lovingly, humming happily.  You quickly shake her loose but the attention makes you blush a little more.\n\n");
        }
        else if (selector == 2) {
            this.outputText("One of your daughters launches onto your back and presses her hard, pierced nipples against your neck.  She whispers in your ear, \"<i>Twist my nipples dad!</i>\"\n\n");
            this.outputText("You reach back and throw her off, but her perverted taunts still leave you feeling a little hot under the collar.\n\n");
        }
        else this.outputText("A daughter lays down in front of you and starts jilling herself on the spot.  It's impossible to not glance down and see her or hear her pleasured moans.  You step away to remove the distraction but it definitely causes some discomfort in your " + this.player.armorName + ".\n\n");
        const lustDmg: number = 1 + this.player.lib / 15 + rand(this.player.cor / 30);
        this.player.takeLustDamage(lustDmg, true);
    }

    private tamaniShowsUp(): void {
        if (TamainsDaughtersScene.tamaniPresent) {
            if (rand(4) == 0) this.goblinDrugAttack(); // Tamani already there - chance of potion
        }
        else if (rand(6) == 0) {
            TamainsDaughtersScene.tamaniPresent = true;
            this.outputText("A high-pitched yet familiar voice calls out, \"<i><b>So this is where you skanks ran off to---wait a second.  Are you trying to poach Tamani's man!?</b></i>\"\n\n");
            this.outputText("You can see Tamani lurking around the rear of the goblin pack, visibly berating her daughters.  On one hand it sounds like she might help you, but knowing goblins, she'll probably forget about her anger and help them subdue you for more cum...\n\n");
            // (+5 mob strength)
            this.str += 5;
            // (+5 mob toughness)
            this.tou += 5;
            this.HP += 10;
            // (-20 mob lust)
            this.lust -= 20;
            // append combat desc
            this.long += " <b>Tamani lurks in the back of the crowd, curvier than her brood and watching with a mixture of amusement and irritation.  She runs a hand through her pink and black hair, waiting for an opportunity to get involved...</b>";
        }
    }

    protected performCombatAction(): void {
        let select: number = 1;
        // mid-round madness!
        this.midRoundMadness();
        this.tamaniShowsUp();

        if (this.special1 != undefined) select++;
        if (this.special2 != undefined) select++;
        if (this.special3 != undefined) select++;
        switch (rand(select)) {
            case 0:
                this.createStatusEffect(StatusEffects.Attacks, int(this.flags[kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS] / 20), 0, 0, 0); // Tamani's Daughters get multiattacks!
                if (this.statusEffectv1(StatusEffects.Attacks) > 20) this.addStatusValue(StatusEffects.Attacks, 1, -(this.statusEffectv1(StatusEffects.Attacks) - 20));
                this.eAttack();
                break;
            case 1:
                this.special1();
                break;
            case 2:
                this.special2();
                break;
            default:
                this.special3();
                break;
        }
        this.combatRoundOver();
    }

    public defeated(hpVictory: boolean): void {
        this.game.forest.tamaniScene.tamaniDaughtersScene.combatWinAgainstDaughters();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        if (pcCameWorms) {
            this.outputText("\n\nYour foes seem visibly disgusted and leave, telling you to, \"<i>quit being so fucking gross...</i>\"");
            this.game.combat.cleanupAfterCombat();
        } else {
            this.game.forest.tamaniScene.tamaniDaughtersScene.loseToDaughters();
        }
    }

    public constructor() {
        super(true);
        this.a = "the group of ";
        this.short = "Tamani's daughters";
        this.imageName = "tamanisdaughters";
        this.long = "A large grouping of goblin girls has gathered around you, surrounding you on all sides.  Most have varying shades of green skin, though a few have yellowish or light blue casts to their skin.  All are barely clothed, exposing as much of their flesh as possible in order to excite a potential mate.  Their hairstyles are as varied as their clothing and skin-tones, and the only things they seem to have in common are cute faces and curvy forms.  It looks like they want something from you.";
        this.race = "Goblins";
        this.plural = true;
        this.pronoun1 = "they";
        this.pronoun2 = "them";
        this.pronoun3 = "their";
        this.createVagina(false, Vagina.WETNESS_DROOLING, Vagina.LOOSENESS_TIGHT);
        this.createStatusEffect(StatusEffects.BonusVCapacity, 40, 0, 0, 0);
        this.createBreastRow(Appearance.breastCupInverse("D"));
        this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
        this.ass.analWetness = Ass.WETNESS_DRY;
        this.createStatusEffect(StatusEffects.BonusACapacity, 25, 0, 0, 0);
        this.tallness = 40;
        this.hips.rating = Hips.RATING_AMPLE + 1;
        this.butt.rating = Butt.RATING_NOTICEABLE + 1;
        this.skin.tone = "greenish gray";
        this.hair.color = "pink";
        this.hair.length = 16;
        this.initStrTouSpeInte(55, 30, 45, 50);
        this.initLibSensCor(70, 70, 50);
        this.weaponName = "fists";
        this.weaponVerb = "tiny punch";
        this.armorName = "leather straps";
        this.bonusHP = 50 + (int(this.flags[kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS] / 2) * 15);
        if (this.bonusHP > 3350) this.bonusHP = 3350;
        this.lust = 30;
        this.lustVuln = .65;
        this.temperment = TamanisDaughters.TEMPERMENT_RANDOM_GRAPPLES;
        this.level = 8 + (Math.floor(this.flags[kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS] / 20));
        if (this.level > 30) this.level = 30;
        this.gems = rand(15) + 5;
        this.drop = new WeightedDrop().
            add(this.consumables.GOB_ALE, 5).
            addMany(1, this.consumables.L_DRAFT,
                this.consumables.PINKDYE,
                this.consumables.BLUEDYE,
                this.consumables.ORANGDY,
                this.consumables.PURPDYE);
        this.special1 = this.goblinDrugAttack;
        this.special2 = this.goblinTeaseAttack;
        this.checkMonster();
    }

}
