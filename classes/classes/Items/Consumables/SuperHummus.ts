import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { Hair } from "../../BodyParts/Hair";
import { Eyes } from "../../BodyParts/Eyes";
import { Antennae } from "../../BodyParts/Antennae";
import { Face } from "../../BodyParts/Face";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Wings } from "../../BodyParts/Wings";
import { Tail } from "../../BodyParts/Tail";
import { Tongue } from "../../BodyParts/Tongue";
import { Horns } from "../../BodyParts/Horns";
import { Ears } from "../../BodyParts/Ears";
import { Skin } from "../../BodyParts/Skin";
import { Gills } from "../../BodyParts/Gills";
import { StatusEffects } from "../../StatusEffects";

/**
 * Reset player character.
 */
export class SuperHummus extends Consumable {
    public constructor() {
        super("Hummus2", "S.Hummus", "a blob of cheesy-looking super hummus", ConsumableLib.DEFAULT_VALUE, "This pile of hummus doesn't look that clean, and you really don't remember where you got it from.  It looks bland.  So bland that you feel blander just by looking at it.");
    }

    public useItem(): boolean {
        const tfSource: string = "superHummus";
        this.clearOutput();
        if (this.game.debug) {
            this.outputText("You're about to eat the humus when you see it has bugs in it. Not wanting to eat bugged humus or try to debug it you throw it into the portal and find something else to eat.");
            const consumables = this.game.consumables;
            this.player.destroyItems(consumables.HUMMUS_, 1);
            return false;
        }
        this.outputText("You shovel the stuff into your face, not sure WHY you're eating it, but once you start, you just can't stop.  It tastes incredibly bland, and with a slight hint of cheese.");
        this.player.refillHunger(100);
        this.player.str = 30;
        this.player.spe = 30;
        this.player.tou = 30;
        this.player.inte = 30;
        this.player.sens = 20;
        this.player.lib = 25;
        this.player.cor = 5;
        this.player.lust = 10;
        this.player.hair.type = Hair.NORMAL;
        if (this.player.humanScore() > 4) {
            this.outputText("\n\nYou blink and the world twists around you.  You feel more like yourself than you have in a while, but exactly how isn't immediately apparent.  Maybe you should take a look at yourself?");
        }
        else {
            this.outputText("\n\nYou cry out as the world spins around you.  You're aware of your entire body sliding and slipping, changing and morphing, but in the sea of sensation you have no idea exactly what's changing.  You nearly black out, and then it's over.  Maybe you had best have a look at yourself and see what changed?");
        }
        this.player.arms.restore();
        this.player.eyes.type = Eyes.HUMAN;
        this.player.antennae.type = Antennae.NONE;
        this.player.face.type = Face.HUMAN;
        this.player.lowerBody.type = LowerBody.HUMAN;
        this.player.lowerBody.legCount = 2;
        this.player.wings.type = Wings.NONE;
        this.player.tail.type = Tail.NONE;
        this.player.tongue.type = Tongue.HUMAN;
        this.player.tail.recharge = 0;
        this.player.horns.value = 0;
        this.player.horns.type = Horns.NONE;
        this.player.ears.type = Ears.HUMAN;
        this.player.skin.type = Skin.PLAIN;
        this.player.skin.desc = "skin";
        this.player.skin.adj = "";
        this.player.underBody.restore();
        this.player.neck.restore();
        this.player.rearBody.restore();
        this.player.tongue.type = Tongue.HUMAN;
        this.player.eyes.type = Eyes.HUMAN;
        if (this.player.fertility > 15) this.player.fertility = 15;
        if (this.player.cumMultiplier > 50) this.player.cumMultiplier = 50;
        let virgin: boolean = false;
        // Clear cocks
        while (this.player.cocks.length > 0) {
            this.player.removeCock(0, 1);
        }
        // Reset dongs!
        if (this.player.gender === 1 || this.player.gender === 3) {
            this.player.createCock();
            this.player.cocks[0].cockLength = 6;
            this.player.cocks[0].cockThickness = 1;
            this.player.ballSize = 2;
            if (this.player.balls > 2) this.player.balls = 2;
        }
        // Non duders lose any nuts
        else {
            this.player.balls = 0;
            this.player.ballSize = 2;
        }
        // Clear vaginas
        while (this.player.vaginas.length > 0) {
            virgin = this.player.vaginas[0].virgin;
            this.player.removeVagina(0, 1);
        }
        // Reset vaginal virginity to correct state
        if (this.player.gender >= 2) {
            this.player.createVagina();
            this.player.vaginas[0].virgin = virgin;
        }
        this.player.setClitLength(.25);
        // Tighten butt!
        this.player.butt.rating = 2;
        this.player.hips.rating = 2;
        if (this.player.ass.analLooseness > 1) this.player.ass.analLooseness = 1;
        if (this.player.ass.analWetness > 1) this.player.ass.analWetness = 1;
        // Clear breasts
        this.player.breastRows = [];
        this.player.createBreastRow();
        this.player.nippleLength = .25;
        // Girls and herms get bewbs back
        if (this.player.gender > 2) {

            this.player.breastRows[0].breastRating = 2;
        }
        else this.player.breastRows[0].breastRating = 0;
        this.player.gills.type = Gills.NONE;
        this.player.removeStatusEffect(StatusEffects.Uniball);
        this.player.removeStatusEffect(StatusEffects.BlackNipples);
        this.player.vaginaType(0);
        this.mutations.updateOvipositionPerk(tfSource);

        return false;
    }
}
