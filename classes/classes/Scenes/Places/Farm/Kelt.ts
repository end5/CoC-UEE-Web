import { Monster } from "../../../Monster";
import { rand, int } from "../../../Extra";
import { StatusEffects } from "../../../StatusEffects";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { CockTypesEnum } from "../../../CockTypesEnum";
import { Appearance } from "../../../Appearance";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { LowerBody } from "../../../BodyParts/LowerBody";
import { Tail } from "../../../BodyParts/Tail";

export class Kelt extends Monster {
    // Trample - once every five turns
    private keltTramplesJoo(): void {
        this.outputText("Before you know what's what, Kelt is galloping toward you, kicking up a cloud of dust in his wake.  He's trying to trample you!  ");
        // Miss:
        if (this.player.getEvasionRoll()) {
            this.outputText("You roll out of the way at the last moment, avoiding his dangerous hooves.");
            this.combatRoundOver();
            return;
        }

        // Determine damage - str modified by enemy toughness!
        let damage: number = Math.round((this.str + this.weaponAttack) - rand(this.player.tou) - this.player.armorDef);

        // Block:
        if (damage <= 0) {
            this.outputText("Incredibly, you brace yourself and dig in your [feet].  Kelt slams into you, but you grind his momentum to a half.  His mouth flaps uncomprehendingly for a moment before he backs up, flushing from being so close to you.");
            this.lust += 5;
        }
        // Hit:
        else {
            this.outputText("You can't get out of the way in time, and you're knocked down!  Kelt tramples overtop of you!  ");
        }
        if (damage > 0) damage = this.player.takeDamage(damage, true);
        this.combatRoundOver();
    }

    // Arrow Attack
    private keltShootBow(): void {
        this.createStatusEffect(StatusEffects.BowCooldown, 3, 0, 0, 0);
        this.outputText("Kelt knocks and fires an arrow almost faster than you can track.  He's lost none of his talent with a bow, even after everything you've put him through.  ");

        // Miss:
        if (this.player.getEvasionRoll()) {
            this.outputText("You manage to avoid the missile by the skin of your teeth!");
            this.combatRoundOver();
            return;
        }

        let damage: number = 0;
        damage = int((20 + this.str / 3 + 100) + this.spe / 3 - rand(this.player.tou) - this.player.armorDef);
        if (damage < 0) damage = 0;
        if (damage == 0) {
            this.outputText("You deflect the hit, preventing it from damaging you.");
            this.combatRoundOver();
            return;
        }
        // Hit:

        this.outputText("The arrow bites into you before you can react. ");
        damage = this.player.takeDamage(damage, true);
        this.combatRoundOver();
    }

    // Aura Arouse
    private KellyuraAttack(): void {
        const select: number = rand(3);
        // (1)
        if (select == 0) this.outputText("Kelt flashes his cockiest smile and gestures downward.  \"<i>Did you forget why you're here, slut?  Taking me by surprise once doesn't make you any less of a whore.</i>\"");
        // (2)
        else if (select == 2) this.outputText("Grinning, Kelt runs by, trailing a cloud of his musk and pheremones behind you.  You have to admit, they get you a little hot under the collar...");
        // (3)
        else {
            this.outputText("Kelt snarls, \"<i>Why don't you just masturbate like the slut that you are until I come over there and punish you?</i>\"  ");
            if (this.player.lust100 >= 80) this.outputText("Your hand moves towards your groin seemingly of its own volition.");
            else this.outputText("Your hands twitch towards your groin but you arrest them.  Still, the idea seems to buzz at the back of your brain, exciting you.");
        }
        this.player.takeLustDamage(this.player.lib / 5 + rand(10), true);
        this.combatRoundOver();
    }

    // Attacks as normal + daydream "attack"
    // DayDream "Attack"
    private dayDreamKelly(): void {
        if (rand(2) == 0) this.outputText("Kelt pauses mid-draw, looking you up and down.  He licks his lips for a few moments before shaking his head to rouse himself from his lusty stupor.  He must miss the taste of your sperm.");
        else this.outputText("Flaring 'his' nostrils, Kelt inhales deeply, his eyelids fluttering closed as he gives a rather lady-like moan.   His hands roam over his stiff nipples, tweaking them slightly before he recovers.");
        this.lust += 5;
        this.combatRoundOver();
    }

    protected performCombatAction(): void {
        if (this.statusEffectv1(StatusEffects.BowCooldown) > 0) {
            this.addStatusValue(StatusEffects.BowCooldown, 1, -1);
            if (this.statusEffectv1(StatusEffects.BowCooldown) <= 0) this.removeStatusEffect(StatusEffects.BowCooldown);
        }
        else {
            if (rand(2) == 0 && this.flags[kFLAGS.KELT_BREAK_LEVEL] >= 2) this.dayDreamKelly();
            else this.keltShootBow();
        }
        const select: number = rand(5);
        if (select <= 1) this.eAttack();
        else if (select <= 3) this.KellyuraAttack();
        else this.keltTramplesJoo();
    }

    public defeated(hpVictory: boolean): void {
        if (this.game.flags[kFLAGS.KELT_KILL_PLAN] == 1) {
            if (hpVictory) {
                this.game.farm.keltScene.fightToBeatKeltVictoryHP();
            } else {
                this.game.farm.keltScene.fightToBeatKeltVictoryLust();
            }
        }
        else {
            if (this.game.flags[kFLAGS.KELT_BREAK_LEVEL] == 1) this.game.farm.kelly.defeatKellyNDBREAKHIM();
            else this.game.farm.kelly.breakingKeltNumeroThree();
        }
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        if (pcCameWorms) {
            this.outputText("\n\nKelt recoils for a moment before assuming a look of superiority...");
            this.doNext(this.game.combat.endLustLoss);
        } else {
            this.game.farm.kelly.keltFucksShitUp();
        }
    }

    public constructor() {
        super();
        const breakLevel2: boolean = this.game.flags[kFLAGS.KELT_BREAK_LEVEL] == 2;
        this.a = "";
        this.short = "Kelt";
        this.imageName = "kelt";
        this.long = "Kelt has changed for the worse since your first meeting.  Gone is his muscular, barrel chest.  In its place is a softer frame, capped with tiny boobs - remnants of your last treatment.  His jaw is fairly square and chiselled (though less than before).  From the waist down, he has the body of a horse, complete with a fairly large pair of balls and a decent-sized dong.  Both are smaller than they used to be, however.  He has his bow strung and out, clearly intent on defending himself from your less than gentle touches." + (breakLevel2 ? "Kelt is looking less and less like the burly centaur from before, and more and more like a woman.  He looks more like an odd, androgynous hybrid than the beautiful woman you had turned him into.  He currently sports roughly B-cup breasts and a smallish, miniature horse-cock.  There's barely any hair on his human body, aside from a long mane of hair.  Each treatment seems to be more effective than the last, and you can't wait to see what happens after you tame him THIS time." : "");
        this.race = "Centaur";
        // this.plural = false;
        this.createCock(breakLevel2 ? 12 : 24, 3.5, CockTypesEnum.HORSE);
        this.balls = 2;
        this.ballSize = 2 + rand(13);
        this.cumMultiplier = 1.5;
        this.hoursSinceCum = this.player.ballSize * 10;
        this.createBreastRow(Appearance.breastCupInverse(breakLevel2 ? "B" : "A"));
        this.ass.analLooseness = Ass.LOOSENESS_NORMAL;
        this.ass.analWetness = Ass.WETNESS_DRY;
        this.createStatusEffect(StatusEffects.BonusACapacity, 50, 0, 0, 0);
        this.tallness = 84;
        this.hips.rating = Hips.RATING_AVERAGE;
        this.butt.rating = Butt.RATING_AVERAGE + 1;
        this.lowerBody.type = LowerBody.HOOFED;
        this.lowerBody.legCount = 4;
        this.skin.tone = "tan";
        this.hair.color = Kelt.randomChoice("black", "brown");
        this.hair.length = 3;
        this.initStrTouSpeInte(60, 70, 40, 20);
        this.initLibSensCor(40, 25, 55);
        this.weaponName = "fist";
        this.weaponVerb = "punch";
        this.weaponAttack = 10;
        this.armorName = "tough skin";
        this.armorDef = 4;
        this.bonusHP = 200;
        this.lust = 40;
        this.lustVuln = 0.83;
        this.temperment = Kelt.TEMPERMENT_LUSTY_GRAPPLES;
        this.level = 6;
        this.gems = rand(5) + 5;
        this.tail.type = Tail.HORSE;
        this.drop = this.NO_DROP;
        this.checkMonster();
    }

}
