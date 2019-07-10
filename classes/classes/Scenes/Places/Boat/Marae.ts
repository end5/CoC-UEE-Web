import { Monster } from "../../../Monster";
import { rand } from "../../../Extra";
import { StatusEffects } from "../../../StatusEffects";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { Vagina } from "../../../Vagina";
import { Appearance } from "../../../Appearance";
import { Skin } from "../../../BodyParts/Skin";
import { PerkLib } from "../../../PerkLib";

export class Marae extends Monster {

    // Corrupted Marae's specials
    public tentacleAttack(): void {
        this.outputText("You spot barrage of tentacles coming your way! You attempt to dodge your way out ");
        const evade: string = this.player.getEvasionReason();
        if (evade == this.EVASION_SPEED) {
            this.outputText("and you successfully dodge her tentacles!");
        }
        else if (evade != undefined) {
            this.outputText("and you successfully dodge her tentacles thanks to your superior evasion!");
        }
        else {
            this.outputText("but you fail and get hit instead! The feel of the tentacles left your groin slightly warmer. ");
            let damage: number = ((this.str + 100) + rand(50));
            this.player.takeLustDamage(rand(5) + 5, true);
            damage = this.player.reduceDamage(damage);
            this.player.takeDamage(damage, true);
        }
        this.combatRoundOver();
    }

    public tentacleRape(): void {

        this.outputText("You spot barrage of tentacles coming your way! The tentacles are coming your way, aiming for your groin! ");
        const evade: string = this.player.getEvasionReason();
        if (evade == this.EVASION_SPEED) {
            this.outputText("You manage to successfully run from her tentacles! ");
        }
        else if (evade != undefined) {
            this.outputText("You manage to avoid her tentacles thanks to your superior evasion!");
        }
        else {
            this.outputText("You attempt to slap away the tentacles but it's too late! The tentacles tickle your groin and you can feel your [ass] being teased! \"<i>You know you want me!</i>\" Marae giggles. ");
            const lustDmg: number = (20 + rand(this.player.cor / 10) + rand(this.player.sens / 5) + rand(this.player.lib / 10) + rand(10)) * (this.player.lustPercent() / 100);
            this.player.takeLustDamage(lustDmg, true, false);

        }
        this.combatRoundOver();
    }

    // Pure Marae's specials
    public smite(): void {
        this.outputText("Marae mouths a chant. The clouds gather and quickly darkens. <b>It looks like a lightning might strike you!</b>");
        this.createStatusEffect(StatusEffects.Uber, 1, 0, 0, 0);
        this.combatRoundOver();
    }
    public smiteHit(): void {
        if (this.game.flags[kFLAGS.IN_COMBAT_USE_PLAYER_WAITED_FLAG] == 1) {
            this.outputText("You look up in the sky to see the lightning incoming! Thanks to your preparedness, you manage to leap away before the lightning hits you! ");
        }
        else {
            this.outputText("Without warning, the lightning hits you! Surge of electricity rushes through you painfully. ");
            if (this.player.cor >= 50) this.outputText("The intensity of the pain is unbearable. ");
            let damage: number = 100 + this.str + (this.player.corAdjustedDown() * 5);
            damage = this.player.reduceDamage(damage);
            this.player.takeDamage(damage, true);
        }
        if (this.hasStatusEffect(StatusEffects.Uber)) this.removeStatusEffect(StatusEffects.Uber);
        this.combatRoundOver();
    }

    public defeated(hpVictory: boolean): void {
        this.game.boat.marae.winAgainstMarae();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        this.game.boat.marae.loseAgainstMarae();
    }

    public doAI(): void {
        if (this.hasStatusEffect(StatusEffects.Stunned)) {
            this.outputText("Your foe is too dazed from your last hit to strike back!");
            if (this.hasStatusEffect(StatusEffects.Uber)) {
                this.outputText(" You've managed to interrupt her smite attack!");
                this.removeStatusEffect(StatusEffects.Uber);
            }
            if (this.statusEffectv1(StatusEffects.Stunned) <= 0) this.removeStatusEffect(StatusEffects.Stunned);
            else this.addStatusValue(StatusEffects.Stunned, 1, -1);
            this.combatRoundOver();
            return;
        }
        if (this.hasStatusEffect(StatusEffects.Fear)) {
            this.game.outputText("\"<i>You think I'm afraid of anything? Foolish mortal.</i>\" Marae snarls.\n\n");
            this.removeStatusEffect(StatusEffects.Fear);
        }
        const chooser: number = rand(10);
        if (this.hasStatusEffect(StatusEffects.Uber)) {
            this.smiteHit();
            return;
        }
        if (chooser < 4) {
            this.eAttack();
            return;
        }
        else if (this.game.flags[kFLAGS.FACTORY_SHUTDOWN] == 1) {
            if (chooser >= 4 && chooser < 7) this.eAttack();
            if (chooser >= 7 && chooser < 10) this.smite();
        }
        else if (this.game.flags[kFLAGS.FACTORY_SHUTDOWN] == 2) {
            if (chooser >= 4 && chooser < 7) this.tentacleAttack();
            if (chooser >= 7 && chooser < 10) this.tentacleRape();
        }
    }

    public getAscensionHP(hp: number): number {
        return hp * (1 + this.player.ascensionFactor(0.55)); // +55% per NG+-level --> = +2640 per level then
    }

    public constructor() {
        super();
        // A brief summary of the opponent.
        this.a = "";
        this.short = "Marae";
        this.imageName = "marae";
        if (this.game.flags[kFLAGS.FACTORY_SHUTDOWN] == 2) {
            this.long = "This being is known as the goddess of Mareth. She is corrupted due to the aftermath of the factory valves being blown up. She's white all over and textured with bark. The \"flower\" below her belly button resembles more of a vagina than a flower. Her G-cup sized breasts jiggle with every motion.";
            this.createVagina(false, Vagina.WETNESS_DROOLING, Vagina.LOOSENESS_NORMAL);
            this.createBreastRow(Appearance.breastCupInverse("G"));
        }
        else {
            this.long = "This being is known as the goddess of Mareth. She is no longer corrupted thanks to your actions at the factory. She's white all over and textured with bark. Her breasts are modestly sized.";
            this.createVagina(false, Vagina.WETNESS_WET, Vagina.LOOSENESS_NORMAL);
            this.createBreastRow(Appearance.breastCupInverse("DD"));
        }
        // Declare appearance.
        this.race = "Deity";
        this.ass.analLooseness = 1;
        this.ass.analWetness = 1;
        this.tallness = 10 * 12;
        this.hips.rating = 10;
        this.butt.rating = 8;
        this.skin.tone = "white";
        this.skin.setType(Skin.PLAIN);
        this.hair.color = "green";
        this.hair.length = 36;
        // Set stats.
        this.level = 85;
        this.initStrTouSpeInte(200, 150, 100, 150);
        this.initLibSensCor(25, 25, 0);
        this.weaponName = "fists";
        this.weaponVerb = "wrathful punch";
        this.weaponAttack = 50;
        this.weaponPerk = "";
        this.weaponValue = 25;
        this.armorName = "bark";
        this.armorDef = 30;
        this.bonusHP = 4750;
        this.bonusLust = 100;
        this.lust = 30;
        this.lustVuln = .07;
        this.temperment = Marae.TEMPERMENT_RANDOM_GRAPPLES;
        this.additionalXP = 2500;
        this.drop = this.NO_DROP;
        this.gems = 1000;
        // Alter Marae's stats based on factory shutdown method.
        if (this.game.flags[kFLAGS.FACTORY_SHUTDOWN] == 2) {
            this.level -= 10;
            this.str -= 50;
            this.spe -= 30;
            this.inte -= 40;
            this.lib += 45;
            this.cor = 100;
            this.weaponName = "tentacles";
            this.weaponVerb = "slap";
            this.weaponAttack -= 10;
        }
        if (this.game.flags[kFLAGS.FACTORY_SHUTDOWN] == 1) {
            this.bonusHP += 2700;
            this.additionalXP += 500;
            if (this.game.flags[kFLAGS.MINERVA_TOWER_TREE] > 0) {
                this.level += 14;
                this.bonusHP += 1000;
                this.weaponAttack += 10;
                this.tou += 25;
                this.inte += 25;
            }
        }
        this.level += this.player.newGamePlusMod() * 30; // New Game+ tier increments levels by 60 as opposed to 30.
        if (this.game.flags[kFLAGS.FACTORY_SHUTDOWN] == 1) {
            this.additionalXP += 500;
        }
        if (this.game.flags[kFLAGS.FACTORY_SHUTDOWN] == 1) {
            this.special1 = this.smite;
        }
        if (this.game.flags[kFLAGS.FACTORY_SHUTDOWN] == 2) {
            this.special1 = this.tentacleAttack;
            this.special2 = this.tentacleRape;
        }
        this.createPerk(PerkLib.Tank, 0, 0, 0, 0);
        this.createPerk(PerkLib.Tank2, 0, 0, 0, 0);
        this.createPerk(PerkLib.ImprovedSelfControl, 0, 0, 0, 0);
        this.checkMonster();
    }

}
