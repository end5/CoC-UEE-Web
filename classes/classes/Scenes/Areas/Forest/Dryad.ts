import { Monster } from "../../../Monster";
import { rand } from "../../../Extra";
import { DryadScene } from "./DryadScene";
import { Vagina } from "../../../Vagina";
import { StatusEffects } from "../../../StatusEffects";
import { Appearance } from "../../../Appearance";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { WeightedDrop } from "../../../internals/WeightedDrop";

/**
 * ...
 * @author melchi'is first attempt at making a monster
 * special thanks to ox and everyone for helping
 */

export class Dryad extends Monster {

    // Melee special
    public slash(): void {
        this.outputText("The dryad reaches for you with claw-like wooden hands!  As soon as she is close, she slashes with her claws ");
        if (this.player.getEvasionRoll()) {
            this.outputText("and you deftly avoid her claws!");
        }
        else {
            this.outputText("and tears into your flesh! ");
            // Get hit
            let damage: number = this.str + this.weaponAttack + rand(40);
            damage = this.player.reduceDamage(damage);
            if (damage < 10) damage = 10;
            this.player.takeDamage(damage, true);
        }
        this.combatRoundOver();
    }
    // lust special
    public pollen(): void {
        const lustDmg: number = this.player.lib / 10 + this.player.cor / 10 + 10;
        this.outputText("The dryad runs her hands through her leafy hair and spins around.   \n\n Yellow and pink sparkles of pollen gently float through the air in your direction. ");
        if (this.player.getEvasionRoll()) {
            this.outputText("You cover your mouth and nose and avoid breathing in most of the pollen!");
        }
        else {
            this.outputText("You take a deep breath of the pollen!\n ");
            this.outputText("Your mind becomes a haze as a hot wave of arousal washes over you.");
            this.player.takeLustDamage(lustDmg, true);
            if (this.player.lust >= this.player.maxLust())
                this.doNext(this.game.combat.endLustLoss);
            else this.doNext(this.game.playerMenu);
        }
        this.combatRoundOver();
    }

    public defeated(hpVictory: boolean): void {
        (new DryadScene()).winagainstdryad();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        (new DryadScene()).loseTodryad();
    }

    public constructor() {
        super();
        this.a = "the ";
        this.short = "Corrupted Dryad";
        this.imageName = "dryad";
        this.long = "The dryad before you is brimming with corruption, her hair is composed of dark brown leaves. Her skin looks to be made of corrupted wood, especially her fingers which are shaped like sharp claws. Her clothing is nothing more than leaves and straw put into a gown. Her eyes are a deep and hungry dark red. Her bark-like skin seeps a thick pink substance.  ";
        this.race = "Dryad";
        this.createVagina(false, Vagina.WETNESS_DRY, Vagina.LOOSENESS_NORMAL);
        this.createStatusEffect(StatusEffects.BonusVCapacity, 40, 0, 0, 0);
        this.createBreastRow(Appearance.breastCupInverse("C"));
        this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
        this.ass.analWetness = Ass.WETNESS_DRY;
        this.createStatusEffect(StatusEffects.BonusACapacity, 30, 0, 0, 0);
        this.tallness = 60;
        this.hips.rating = Hips.RATING_AMPLE + 2;
        this.butt.rating = Butt.RATING_LARGE;
        this.skin.tone = "birch-white";
        this.hair.color = "dark brown";
        this.hair.length = 4;
        this.initStrTouSpeInte(95, 75, 70, 100);
        this.initLibSensCor(55, 35, 45);
        this.weaponName = "claws";
        this.weaponVerb = "slash";
        this.weaponAttack = 25;
        this.armorName = "forest gown";
        this.armorDef = 24;
        this.fatigue = 0;
        this.bonusHP = 425;
        this.lust = 35;
        this.lustVuln = 0.4;
        this.level = 20;
        this.gems = rand(15) + 25;
        this.drop = new WeightedDrop().
            add(this.armors.FRSGOWN, 1);
        this.special1 = this.slash;
        this.special2 = this.pollen;

        this.checkMonster();
    }
}
