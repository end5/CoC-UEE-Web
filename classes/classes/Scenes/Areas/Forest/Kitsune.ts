import { BaseKitsune } from "./BaseKitsune";
import { rand } from "../../../Extra";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { CockTypesEnum } from "../../../CockTypesEnum";
import { Vagina } from "../../../Vagina";
import { StatusEffects } from "../../../StatusEffects";
import { Appearance } from "../../../Appearance";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { WeightedDrop } from "../../../internals/WeightedDrop";
import { Tail } from "../../../BodyParts/Tail";

export class Kitsune extends BaseKitsune {
    public constructor(hairColor: 'blonde' | 'black' | 'red') {
        super();
        this.init(hairColor);
    }

    private init(hairColor: 'blonde' | 'black' | 'red'): void {
        if (rand(3) != 2) this.game.flags[kFLAGS.redheadIsFuta] = 1;
        this.a = "a ";
        this.short = "kitsune";
        this.imageName = "kitsune";
        this.long = "A kitsune stands in front of you, about five and a half feet tall.  She has a head of " + ({
            blonde: "long flaxen",
            black: "lustrous, ass-length black",
            red: "unkempt, shoulder-length reddish"
        }[hairColor]) +
            " hair.  She appears mostly human, except for a pair of large, furry ears poking through her hair and six luxurious silky tails swaying in the air behind her.  Her robes are revealing but comfortable-looking, hugging her voluptuous curves and exposing large swaths of tattooed skin.  A layer of ornate tattoos covers patches of her exposed flesh, accentuating her feminine curves nicely, and each movement brings a pleasant jiggle from her plump backside and large breasts.";
        this.race = "Kitsune";

        if (hairColor == "red" && this.game.flags[kFLAGS.redheadIsFuta] == 1) {
            this.createCock(rand(13) + 14, 1.5 + rand(20) / 2, CockTypesEnum.HUMAN);
            this.balls = 2;
            this.ballSize = 2 + rand(13);
            this.cumMultiplier = 1.5;
            this.hoursSinceCum = this.ballSize * 10;
        }
        this.createVagina(false, Vagina.WETNESS_SLICK, Vagina.LOOSENESS_NORMAL);
        this.createStatusEffect(StatusEffects.BonusVCapacity, 20, 0, 0, 0);
        this.createBreastRow(Appearance.breastCupInverse("D"));
        this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
        this.ass.analWetness = Ass.WETNESS_NORMAL;
        this.createStatusEffect(StatusEffects.BonusACapacity, 20, 0, 0, 0);
        this.tallness = rand(24) + 60;
        this.hips.rating = Hips.RATING_AMPLE;
        this.butt.rating = Butt.RATING_AVERAGE + 1;
        this.skin.tone = "pale";
        this.hair.color = hairColor;
        this.hair.length = 13 + rand(20);
        this.initStrTouSpeInte(35, 45, 90, 95);
        this.initLibSensCor(60, 65, 45);
        this.weaponName = "claws";
        this.weaponVerb = "punch";
        this.armorName = "skin";
        this.bonusHP = 120;
        this.lust = 20;
        this.lustVuln = 0.9;
        this.temperment = Kitsune.TEMPERMENT_LUSTY_GRAPPLES;
        this.level = 6;
        this.gems = rand(10) + 10;
        this.drop = new WeightedDrop(this.consumables.FOXJEWL, 1);
        this.tail.type = Tail.FOX;
        this.checkMonster();
    }

    // Combat Abilities:
    // the kitsune are an almost purely magical mob, relying mainly on tease attacks and spells that raise lust.
    // Entwine:
    private kitsuneEntwine(): void {
        this.outputText("The kitsune closes in on you with a mischievous glint in her eyes.  You raise your guard, keeping your eyes trained on her to ensure that she doesn't try to pull anything.  Suddenly, you feel something coiling around your " + this.player.leg() + ", and let out a yelp as you are suddenly lifted into the air, entangled in the kitsune's tails!");
        this.outputText("\n\nYour limbs are bound tightly while coils of delightfully soft fur caress you on all sides.  You can do little besides struggle against your furry bonds as the constant writhing of her tails sends shudders flying up and down your spine.");
        this.createStatusEffect(StatusEffects.PCTailTangle, 0, 0, 0, 0);
        const lustDmg: number = 10 + this.player.sens / 8;
        this.player.takeLustDamage(lustDmg, true);
        this.combatRoundOver();
    }

    // Struggle - event 5077 in combat.as
    public kitsuneStruggle(): void {
        this.clearOutput();
        // Struggle:
        this.outputText("You struggle against the kitsune's tails with all your might, desperately trying to free yourself before she has her way with you.");
        // Success
        if (rand(20) + this.player.str / 20 + this.statusEffectv1(StatusEffects.PCTailTangle) >= 12) {
            this.outputText("  Summoning up reserves of strength you didn't know you had, you wrench yourself free of her tails, pushing her away.\n\n");
            this.removeStatusEffect(StatusEffects.PCTailTangle);
            this.doAI();
        }
        // Failure - +5-10 LUST
        else {
            this.outputText("  Despite your valiant efforts, your wriggling only serves to get you deeper entangled in the fluffy tails, eliciting an amused giggle from the kitsune.");
            this.outputText("\n\nShe licks her lips, running her hands along you wherever she can find exposed flesh.  Her fingertips leave small trails of dazzling blue that make you flush with lust - you must escape her grasp soon or else you will be like putty in her hands!");
            const lustDmg: number = 5 + this.player.sens / 10;
            this.player.takeLustDamage(lustDmg, true);
            this.addStatusValue(StatusEffects.PCTailTangle, 1, 3);
            this.combatRoundOver();
        }
    }

    public kitsuneWait(): void {
        this.clearOutput();
        this.outputText("Happily, you slump deeper into the fluffy tails, eliciting an amused giggle from the kitsune.");
        if (this.game.silly()) this.outputText("  You're so glad you got to touch fluffy tail.");
        this.outputText("\n\nShe licks her lips, running her hands along you wherever she can find exposed flesh.  Her fingertips leave small trails of dazzling blue that make you flush with lust - you must escape her grasp soon or else you will be like putty in her hands!");
        const lustDmg: number = 5 + this.player.sens / 10;
        this.player.takeLustDamage(lustDmg, true);
        this.combatRoundOver();
    }

    // Fox Fire: - Low piercing damage, +10-15 LUST
    private foxFireAttack(): void {
        this.outputText("The kitsune makes a small circle in the air with her fingers, conjuring up a pale blue flame into her palm with the sound of flint striking against steel.  Pursing her lips, she blows it toward you with a kiss.");
        this.outputText("\n\nThe flames burn furiously, but leave you with an incredibly pleasant tingling sensation all over your body.  Your skin flushes with excitement, and you can feel blood rushing to your extremities, making you shudder with pleasure. ");
        let damage: number = 5 + rand(20);
        damage = this.player.takeDamage(damage, true);
        this.game.dynStats("lus", 15 + this.player.sens / 10);
        this.combatRoundOver();
    }

    // Illusion: - Raises enemy evasion, but can be resisted.
    // Factors affecting resist: INT (1% per point, max 70%), "Whispered" perk (20% flat bonus), "Religious" background and < 20 corruption (20% bonus at 0, losing 1% per point of corruption.)
    // Success:
    private illusionKitsuneAttack(): void {
        this.outputText("You struggle to keep your eyes on the kitsune, ghostly laughter echoing all around you as you turn to and fro, trying to track her movements.  It almost seems like the edges of reality are blurring around her, severely distorting your perceptions and making it hard to follow her.  It's going to be much harder to hit her if she keeps this up!");
        // Resist: - successfully resisting deals small health & lust damage to kitsune
        const resist: number = this.calculateAttackResist();

        if (rand(100) < resist) {
            this.outputText("\n\nThe kitsune seems to melt away before your eyes for a moment, as though the edges of reality are blurring around her.  You tighten your focus, keeping your eyes trained on her, and she suddenly reels in pain, clutching her forehead as she is thrust back into view.  She lets out a frustrated huff of disappointment, realizing that you have resisted her illusions.");
        }
        else {
            this.createStatusEffect(StatusEffects.Illusion, 0, 0, 0, 0);
            this.spe += 20;
        }
        this.combatRoundOver();
    }

    // Tease Texts:
    private kitSuneTeases(): void {
        let select: number = rand(3);
        if (this.hair.color == "red" && rand(2) == 0) select = 3;
        if (select == 0) this.outputText("You rub your eyes, suddenly seeing triple as you find yourself in the midst of a crowd of kitsune doppelgangers.  They run their hands all over you, teasing and doting on you as their tails caress every inch of your body.  Taken by surprise, you forget to fight back until they have already dispersed, blending back into a single fox-woman.");
        else if (select == 1) this.outputText("Bending forward, the kitsune runs her hands down over her breasts, jiggling them enticingly and squeezing them together.  Hooking a finger in her robes, she slides it down, tugging them aside until her nipples are just barely covered, and with a teasing smirk, pulls them back up, leaving you wanting.");
        else if (select == 2) this.outputText("Turning her back to you, the kitsune fans out her tails, peering back as she lifts the hem of her robe to expose her plump hindquarters.  Her tails continually shift and twist, blocking your view, but it only serves to make you want it even <i>more</i>, licking your lips in anticipation.");
        // Redhead only:
        else this.outputText("The kitsune sways her hips enticingly as she appears in front of you abruptly, rubbing up against your side.  Her teasing caresses make you shiver with arousal, and you can feel something thick and warm pressing against your [hips].  She gives you a wry grin as she breaks away from you, sporting an obvious tent in her robes.  \"<i>Just you wait...</i>\"");
        const lustDmg: number = 5 + this.player.sens / 7;
        this.player.takeLustDamage(lustDmg, true);
        this.combatRoundOver();
    }

    protected performCombatAction(): void {
        const moves: any[] = [this.foxFireAttack, this.foxFireAttack, this.kitSuneTeases, this.kitSuneTeases];
        if (!this.player.hasStatusEffect(StatusEffects.Sealed)) moves.push(this.kitsuneSealAttack);
        if (!this.player.hasStatusEffect(StatusEffects.Sealed)) moves.push(this.kitsuneSealAttack);
        if (!this.hasStatusEffect(StatusEffects.PCTailTangle)) moves.push(this.kitsuneEntwine);
        if (!this.hasStatusEffect(StatusEffects.Illusion)) moves.push(this.illusionKitsuneAttack);
        moves[rand(moves.length)]();
    }

    public defeated(hpVictory: boolean): void {
        this.game.forest.kitsuneScene.defeatTheKitsunes();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        if (pcCameWorms) {
            this.outputText("\n\nThe kitsune recoils before running off, no longer interested in you...");
            this.game.combat.cleanupAfterCombat();
        } else {
            this.game.forest.kitsuneScene.loseToKitsunes();
        }
    }
}
