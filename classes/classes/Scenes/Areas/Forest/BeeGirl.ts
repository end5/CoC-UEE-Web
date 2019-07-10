import { Monster } from "../../../Monster";
import { StatusEffects } from "../../../StatusEffects";
import { int, rand } from "../../../Extra";
import { ParalyzeVenomDebuff } from "../../../StatusEffects/Combat/ParalyzeVenomDebuff";
import { Vagina } from "../../../Vagina";
import { Appearance } from "../../../Appearance";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { LowerBody } from "../../../BodyParts/LowerBody";
import { ChainedDrop } from "../../../internals/ChainedDrop";
import { Antennae } from "../../../BodyParts/Antennae";
import { Wings } from "../../../BodyParts/Wings";
import { Tail } from "../../../BodyParts/Tail";

export class BeeGirl extends Monster {

    public defeated(hpVictory: boolean): void {
        this.game.forest.beeGirlScene.beeGirlPCVictory(hpVictory);
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        if (pcCameWorms) {
            this.outputText("\n\nThe bee-girl goes white and backs away with a disgusted look on her face.\n\n");
            this.game.combat.cleanupAfterCombat();
        }
        else {
            this.game.forest.beeGirlScene.beeRapesYou();
        }
    }

    private beeStingAttack(): void {
        // Blind dodge change
        if (this.hasStatusEffect(StatusEffects.Blind)) {
            this.outputText(this.capitalA + this.short + " completely misses you with a blind sting!!");
            this.combatRoundOver();
            return;
        }
        // Determine if dodged!
        if (this.player.spe - this.spe > 0 && int(Math.random() * (((this.player.spe - this.spe) / 4) + 80)) > 80) {
            if (this.player.spe - this.spe < 8) this.outputText("You narrowly avoid " + this.a + this.short + "'s stinger!");
            if (this.player.spe - this.spe >= 8 && this.player.spe - this.spe < 20) this.outputText("You dodge " + this.a + this.short + "'s stinger with superior quickness!");
            if (this.player.spe - this.spe >= 20) this.outputText("You deftly avoid " + this.a + this.short + "'s slow attempts to sting you.");
            this.combatRoundOver();
            return;
        }
        // determine if avoided with armor.
        if (this.player.armorDef >= 10 && rand(4) > 0) {
            this.outputText("Despite her best efforts, " + this.a + this.short + "'s sting attack can't penetrate your armor.");
            this.combatRoundOver();
            return;
        }
        // Sting successful!  Paralize or lust?
        // Lust 50% of the time
        if (rand(2) == 0) {
            this.outputText("Searing pain lances through you as " + this.a + this.short + " manages to sting you!  You stagger back a step and nearly trip, flushing hotly.  ");
            this.outputText("Oh no!  You've been injected with some kind of aphrodisiac.  You've got to keep focused, you can't think about... fucking... ");
            if (this.player.gender == 1) this.outputText("or dripping honey-slicked cunts beckoning you. ");
            if (this.player.gender == 2) this.outputText("planting your aching sex over her face while you lick her sweet honeypot. ");
            if (this.player.gender == 3) this.outputText("or cocks, tits, and puffy nipples. ");
            const lustDmg: number = 25;
            this.player.takeLustDamage(lustDmg, true);
            if (this.player.lust100 > 60) {
                this.outputText(" You shake your head and struggle to stay focused,");
                if (this.player.gender == 1 || this.player.gender == 3) this.outputText(" but it's difficult with the sensitive bulge in your groin.");
                if (this.player.gender == 2) this.outputText(" but can't ignore the soaking wetness in your groin.");
                if (this.player.sens100 > 50) this.outputText("  The sensitive nubs of your nipples rub tightly under your " + this.player.armorName + ".");
            }
            else this.outputText(" You shake your head and clear the thoughts from your head, focusing on the task at hand.");
            if (!this.player.hasStatusEffect(StatusEffects.lustvenom)) this.player.createStatusEffect(StatusEffects.lustvenom, 0, 0, 0, 0);
        }
        // Paralise the other 50%!
        else {
            this.outputText("Searing pain lances through you as " + this.a + this.short + " manages to sting you!  You stagger back a step and nearly trip, finding it hard to move yourself.");
            let paralyze: ParalyzeVenomDebuff = this.player.statusEffectByType(StatusEffects.ParalyzeVenom) as ParalyzeVenomDebuff;
            if (paralyze) {
                this.outputText("  It's getting much harder to move, you're not sure how many more stings like that you can take!");
            } else {
                paralyze = new ParalyzeVenomDebuff();
                this.player.addStatusEffect(paralyze);
                this.outputText("  You've fallen prey to paralyzation venom!  Better end this quick!");
            }
            paralyze.increase();
        }
        if (this.player.lust >= this.player.maxLust())
            this.doNext(this.game.combat.endLustLoss);
        else this.doNext(this.game.playerMenu);
    }

    public constructor() {
        super();
        this.a = "a ";
        this.short = "bee-girl";
        this.imageName = "beegirl";
        this.long = "A bee-girl buzzes around you, filling the air with intoxicatingly sweet scents and a buzz that gets inside your head.  She has a humanoid face with small antennae, black chitin on her arms and legs that looks like shiny gloves and boots, sizable breasts, and a swollen abdomen tipped with a gleaming stinger.";
        this.race = "Bee-Morph";
        this.createVagina(false, Vagina.WETNESS_SLAVERING, Vagina.LOOSENESS_GAPING);
        this.createBreastRow(Appearance.breastCupInverse("DD"));
        this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
        this.ass.analWetness = Ass.WETNESS_NORMAL;
        this.tallness = rand(14) + 59;
        this.hips.rating = Hips.RATING_CURVY + 3;
        this.butt.rating = Butt.RATING_EXPANSIVE;
        this.lowerBody.type = LowerBody.BEE;
        this.skin.tone = "yellow";
        this.hair.color = BeeGirl.randomChoice("black", "black and yellow");
        this.hair.length = 6;
        this.initStrTouSpeInte(30, 30, 30, 20);
        this.initLibSensCor(60, 55, 0);
        this.weaponName = "chitin-plated fist";
        this.weaponVerb = "armored punch";
        this.armorName = "chitin";
        this.armorDef = 9;
        this.lust = 20 + rand(40);
        this.lustVuln = 0.9;
        this.temperment = BeeGirl.TEMPERMENT_LOVE_GRAPPLES;
        this.level = 4;
        this.gems = rand(15) + 1;
        this.drop = new ChainedDrop().add(this.consumables.OVIELIX, 1 / 10)
            .add(this.consumables.W__BOOK, 1 / 10)
            .add(this.consumables.BEEHONY, 1 / 2)
            .elseDrop(this.useables.B_CHITN);
        this.antennae.type = Antennae.BEE;
        this.wings.type = Wings.BEE_LIKE_SMALL;
        this.tail.type = Tail.BEE_ABDOMEN;
        this.tail.venom = 100;
        this.special1 = this.beeStingAttack;
        this.checkMonster();
    }

}
