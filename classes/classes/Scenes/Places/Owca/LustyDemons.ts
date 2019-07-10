import { Monster } from "../../../Monster";
import { StatusEffects } from "../../../StatusEffects";
import { CockTypesEnum } from "../../../CockTypesEnum";
import { Vagina } from "../../../Vagina";
import { Ass } from "../../../Ass";
import { rand } from "../../../Extra";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { Tail } from "../../../BodyParts/Tail";
import { Horns } from "../../../BodyParts/Horns";

/**
 * Created by aimozg on 26.12.13.
 */

export class LustyDemons extends Monster {

    protected performCombatAction(): void {
        this.str = 40;
        this.weaponAttack = 10;
        this.createStatusEffect(StatusEffects.Attacks, 4, 0, 0, 0);
        this.eAttack();
        this.str = 80;
        this.weaponAttack = 40;
        this.eAttack();
        this.combatRoundOver();
    }

    public defeated(hpVictory: boolean): void {
        this.game.owca.defeetVapulasHorde();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        if (pcCameWorms) {
            this.outputText("\n\nThe demons smile to one at another as they watch your display, then close in...");
            this.doNext(this.game.combat.endLustLoss);
        } else {
            this.game.owca.loseOrSubmitToVapula();
        }
    }

    public teased(lustDelta: number): void {
        if (lustDelta > 0 && lustDelta < 5) this.outputText("  The demons lessen somewhat in the intensity of their attack, and some even eye up your assets as they strike at you. Vapula has trouble giving her orders.");
        if (lustDelta >= 5 && lustDelta < 10) this.outputText("  The demons are obviously avoiding damaging anything you might use to fuck and they're starting to leave their hands on you just a little longer after each blow.  Some are copping quick feels and you can smell the demonic lust on the air.  Vapula is starting to get frustrated as her minions are more and more reluctant to attack you, preferring to caress each other instead.");
        if (lustDelta >= 10) this.outputText("  The demons are decreasingly willing to hit you and more and more willing to just stroke their hands sensuously over you.  Vapula is uncontrollably aroused herself and shivers even as she tries to maintain some semblance of offense, but most of the demons are visibly uncomfortable and some just lie on the ground, tamed by their own lust.");
        this.applyTease(lustDelta);
    }

    public constructor() {
        super();
        this.a = "the ";
        this.short = "lusty demons";
        this.imageName = "demonmob";
        this.long = "You're facing a group of thirty demons of various kinds.  Imps, incubi and succubi of all sizes and colors are encircling you, doing their best to show their genitals or their gigantic rows of breasts, often both.  You can see an impressive number of towering cocks, drooling pussies, and jiggling tits wiggle around as they move.  Most of the genitalia are monstrous, ridiculously disproportionate to the actual demons sporting them - to say nothing of the imps!  Some of the succubi are winking at you, blowing invisible kisses as they dance in circles around your pole.  Among them, you can easily spot the tallest demoness of the horde, Vapula; her perfect purple-skinned body, big perky boobs, luscious buttocks, fleshy lips, and seductive stare draw your attention like a magnet.  She's sporting a pair of magnificent wings and her abundant hair gives her face a fierce, lion-like appearance.  While her eyes ravage you with an insatiable hunger, she gives orders with the assurance of a well-established dominatrix.";
        this.race = "Demons";
        this.plural = true;
        this.pronoun1 = "they";
        this.pronoun2 = "them";
        this.pronoun3 = "their";
        this.createCock(18, 2);
        this.createCock(18, 2, CockTypesEnum.DEMON);
        this.balls = 2;
        this.ballSize = 1;
        this.cumMultiplier = 3;
        // this.hoursSinceCum = 0;
        this.createVagina(false, Vagina.WETNESS_SLICK, Vagina.LOOSENESS_LOOSE);
        this.createBreastRow(0);
        this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
        this.ass.analWetness = Ass.WETNESS_SLIME_DROOLING;
        this.tallness = rand(8) + 70;
        this.hips.rating = Hips.RATING_AMPLE + 2;
        this.butt.rating = Butt.RATING_LARGE;
        this.skin.tone = "red";
        this.hair.color = "black";
        this.hair.length = 15;
        this.initStrTouSpeInte(80, 10, 10, 5);
        this.initLibSensCor(50, 60, 100);
        this.weaponName = "claws";
        this.weaponVerb = "claw";
        this.armorName = "demonic skin";
        // 6 attacks: 5 from demons (10 damage each), 1 from Vapula (80 damage), 200 gems, 200 xp, 700 hp*/
        this.bonusHP = 680;
        this.lust = 30;
        this.lustVuln = .3;
        this.temperment = LustyDemons.TEMPERMENT_LOVE_GRAPPLES;
        this.level = 14;
        this.gems = 150 + rand(100);
        this.special1 = this.game.combat.packAttack;
        this.special2 = this.game.combat.lustAttack;
        this.tail.type = Tail.DEMONIC;
        this.horns.type = Horns.DEMON;
        this.horns.value = 2;
        this.drop = this.NO_DROP;
        this.createStatusEffect(StatusEffects.Vapula, 0, 0, 0, 0);
        this.checkMonster();
    }
}
