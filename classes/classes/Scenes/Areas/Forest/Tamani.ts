import { Goblin } from "../../Monsters/Goblin";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { rand } from "../../../Extra";
import { Vagina } from "../../../Vagina";
import { StatusEffects } from "../../../StatusEffects";
import { Appearance } from "../../../Appearance";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { WeightedDrop } from "../../../internals/WeightedDrop";

export class Tamani extends Goblin {

    protected goblinTeaseAttack(): void {
        if (this.flags[kFLAGS.TAMANI_TIMES_HYPNOTISED] > 0) {
            this.tamaniHypnoTease();
            return;
        }
        super.goblinTeaseAttack();
    }

    // New Tease option:
    public tamaniHypnoTease(): void {
        let selector: number = rand(3);
        // Choose 1 of 3 variations
        if (selector == 0) this.outputText("Tamani smiles and shifts her leather straps, pulling one into the puffy gash that is her vagina.  She groans out loud, sliding the studded leather band into her outer lips and sawing it along her clit.  Her whole body blushes as she pulls it free, running a fingertip up the now wet strip of leather, \"<i>Mmm, can't you see how much my pussy needs a man inside it?  Be a good husband and fuck Tamani full!  You know you want to.</i>\"\n\n");
        if (selector == 1) this.outputText("Tamani saunters up to you, sliding her fingers down to each side of her pussy and spreading them.  Your eyes are drawn to her honeyed tunnel, unable to look away she gets closer.  She whispers, \"<i>Your cock knows what it needs.  Just be a good husband and obey your dick, it KNOWS how badly you need mistress's pussy.</i>\"\n\n");
        if (selector == 2) this.outputText("Tamani turns around and bends down, pressing her hands into the dirt as she kicks her legs apart.  Your stare open-mouthed at her bouncy ass-cheeks and the tantalizingly wet entrance of her slit.  She smirks and offers, \"<i>You've cum so many times inside me, why resist when you can give in and feel that pleasure again today?  Come on husband, don't make Tamani beg...</i>\"\n\n");

        // REACTIONS
        // LOW HYPNO VALUE:
        if (this.flags[kFLAGS.TAMANI_TIMES_HYPNOTISED] < 5) {
            selector = rand(3);
            if (selector == 0) this.outputText("You reluctantly pull your stare away from the heavenly entrance between her legs.  There's an urge to walk over to her and plunge yourself inside her over and over, but you dismiss it.");
            if (selector == 1) this.outputText("You find it hard to pull your gaze from her inviting twat, but you manage.  You shake your head, clearing away thoughts of fertilizing your wife.  Her rhetoric must be getting to you.");
            if (selector == 2) this.outputText("No matter the case, her actions shifted a fair bit of your blood-flow to your groin.");
        }
        // MEDIUM HYPNO VALUE:
        else if (this.flags[kFLAGS.TAMANI_TIMES_HYPNOTISED] < 10) {
            selector = rand(2);
            if (selector == 0) {
                this.outputText("With effort you manage to wrench your eyes away from the inviting folds of Tamani's vagina.  ");
                if (this.player.totalCocks() > 1) this.outputText("Each of y");
                else this.outputText("Y");
                this.outputText("our " + this.player.multiCockDescriptLight());
                if (this.player.lust100 > 80) this.outputText(" drips pre-cum");
                else if (this.player.lust100 > 40) this.outputText(" grows harder");
                else this.outputText(" hardens");
                this.outputText(" from the sexual sight, and you feel a compulsion to rush to your wife and take her on the spot.  Obviously she's not really your wife, but after so many fuckings it kind of makes sense to think of her that way.");
                if (this.player.lust100 < 70) this.outputText("  Still, you don't want to fuck her right now!");
            }
            else {
                this.outputText("Struggling, you pull your eyes back into your head and away from Tamani's gorgeous slit.  You shudder, feeling ");
                if (this.player.totalCocks() > 1) this.outputText("each of ");
                this.outputText("your " + this.player.multiCockDescriptLight());
                if (this.player.lust100 <= 41) this.outputText(" thicken perceptibly");
                else if (this.player.lust100 <= 81) this.outputText(" twitch eagerly");
                else this.outputText("drip pre-cum");
                this.outputText(", responding to the overly sensual goblin's body.  You start to approach her, but stop yourself, realizing you were about to pick up your wife and fuck her on the spot.  You know she's not really your wife, but you have a hard time thinking of her as anything else, save for maybe your mistress.");
                if (this.player.lust100 < 70) this.outputText("  Regardless, you're resolute in your desire not to fuck her right now!");
            }
        }
        // HIGH HYPNO VALUE
        else {
            selector = rand(2);
            if (selector == 0) {
                this.outputText("You barely manage to step yourself from lunging forward to bury your mouth between your mistress's legs.  Hard and trembling between your legs, ");
                if (this.player.totalCocks() > 1) this.outputText("each of ");
                this.outputText("your " + this.player.multiCockDescriptLight() + " aches with need.  You battle with the compulsion to kneel before your short, stacked mistress and perform your duties as her breeder husband.");
            }
            else {
                this.outputText("You wrench your gaze from the juicy mound before you with great difficulty.  The desire to submit to your wife and fuck her on the spot rages through your body, melting your resistance into liquid lust and pooling it in your groin.  ");
                if (this.player.totalCocks() > 1) this.outputText("Each of y");
                else this.outputText("Y");
                this.outputText("our " + this.player.multiCockDescriptLight() + " pulses and dribbles pre-cum, aching to do its duty and fire load after load into Tamani's perfect pussy.");
            }
        }
        const lustDmg: number = rand(this.player.lib / 5) + 3 + (this.flags[kFLAGS.TAMANI_TIMES_HYPNOTISED]);
        this.player.takeLustDamage(lustDmg, true);
        this.combatRoundOver();
    }

    public defeated(hpVictory: boolean): void {
        this.clearOutput();
        if (hpVictory) {
            this.outputText("Tamani is defeated!");
        } else {
            this.outputText("Tamani gives up on defeating you and starts masturbating!");
        }
        this.game.forest.tamaniScene.tamaniVictoryMenu();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        this.clearOutput();
        if (hpVictory) {
            if (this.player.totalCocks() > 0) {
                if (rand(2) == 0) this.game.forest.tamaniScene.tamaniSexLost();
                else this.game.forest.tamaniScene.tamaniSexLetHer();
            } else {
                this.outputText("Tamani sighs as you begin to lose conscious, \"<i>You dummy, why'd you get rid of the fun parts?</i>\"");
                this.game.combat.cleanupAfterCombat();
            }
        } else {
            if (this.player.totalCocks() > 0) {
                // hypnoslut loss scene
                if (this.game.flags[kFLAGS.TAMANI_TIMES_HYPNOTISED] > 19 && rand(2) == 0) {
                    this.game.forest.tamaniScene.getRapedByTamaniYouHypnoSlut();
                } else if (rand(2) == 0) this.game.forest.tamaniScene.tamaniSexLost();
                else this.game.forest.tamaniScene.tamaniSexLetHer();
            } else {
                this.outputText("You give into your lusts and masturbate, but Tamani doesn't seem to care.  She kicks and punches you over and over, screaming, \"<i>You dummy, why'd you get rid of the fun parts?</i>\"");
                this.game.player.takeDamage(9999);
                this.game.combat.cleanupAfterCombat();
            }
        }
    }

    public constructor() {
        super(false);
        this.a = "";
        this.short = "Tamani";
        this.imageName = "tamani";
        this.long = "She keeps her arms folded across her " + this.game.forest.tamaniScene.tamaniChest() + " and glares at you.  The little thing is only about four feet tall, with pink and black dyed hair cut into a cute little 'do.  The greenish-gray skin of her breasts bulges out around her arms, supported by a few leather straps, amplifying her cleavage.  Her cunt lips are pierced multiple times, inflamed, and slightly parted.  There really isn't any clothing on her to hide them, just more of the ever-present straps wrapping around her thighs.";
        this.race = "Goblin";
        // this.plural = false;
        this.createVagina(false, Vagina.WETNESS_DROOLING, Vagina.LOOSENESS_NORMAL);
        this.createStatusEffect(StatusEffects.BonusVCapacity, 55, 0, 0, 0);
        this.createBreastRow(Appearance.breastCupInverse("E"));
        this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
        this.ass.analWetness = Ass.WETNESS_DRY;
        this.createStatusEffect(StatusEffects.BonusACapacity, 40, 0, 0, 0);
        this.tallness = 40;
        this.hips.rating = Hips.RATING_AMPLE + 2;
        this.butt.rating = Butt.RATING_LARGE;
        this.skin.tone = "greenish gray";
        this.hair.color = "pink and black";
        this.hair.length = 16;
        this.initStrTouSpeInte(32, 43, 55, 62);
        this.initLibSensCor(65, 65, 50);
        this.weaponName = "fists";
        this.weaponVerb = "tiny punch";
        this.armorName = "leather straps";
        this.bonusHP = 40;
        this.lust = 40;
        this.lustVuln = 0.9;
        this.temperment = Tamani.TEMPERMENT_RANDOM_GRAPPLES;
        this.level = 4;
        this.gems = rand(25) + 5;
        this.drop = new WeightedDrop().add(this.consumables.GOB_ALE, 4)
            .addMany(1,
                this.consumables.L_DRAFT,
                this.consumables.PINKDYE,
                this.consumables.BLUEDYE,
                this.consumables.ORANGDY,
                this.consumables.PURPDYE,
                this.consumables.INCUBID,
                this.consumables.REDUCTO,
                this.consumables.L_BLUEG,
                undefined);
        this.special1 = this.goblinDrugAttack;
        this.special2 = this.goblinTeaseAttack;
        this.checkMonster();
    }

}
