import { Monster } from "../../../Monster";
import { StatusEffects } from "../../../StatusEffects";
import { CockTypesEnum } from "../../../CockTypesEnum";
import { Vagina } from "../../../Vagina";
import { Appearance } from "../../../Appearance";
import { Ass } from "../../../Ass";
import { rand } from "../../../Extra";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { Horns } from "../../../BodyParts/Horns";
import { Tail } from "../../../BodyParts/Tail";

export class Farmers extends Monster {
    protected performCombatAction(): void {
        this.createStatusEffect(StatusEffects.Attacks, 4, 0, 0, 0);
        this.eAttack();
        this.combatRoundOver();
    }

    public defeated(hpVictory: boolean): void {
        this.game.owca.beatUpOwca();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        this.game.owca.loseToOwca();
    }

    public constructor() {
        super();
        this.a = "the ";
        this.short = "farmers";
        this.imageName = "farmers";
        this.long = "This is a group of thirty angry villagers, almost all human-looking but for the tiny horn-like protrusions growing from their heads and the white fuzz that almost passes off as hair.  They are all armed with pitchforks or other crude farming tools they use in their everyday task.  Rebecc is staring from behind them with horrified eyes at the combat, paralyzed by the sudden turn of events.";
        this.race = "Humans?";
        this.plural = true;
        this.pronoun1 = "they";
        this.pronoun2 = "them";
        this.pronoun3 = "their";
        this.createCock(9, 2, CockTypesEnum.HUMAN);
        this.balls = 2;
        this.ballSize = 1;
        this.cumMultiplier = 3;
        // this.hoursSinceCum = 0;
        this.createVagina(false, Vagina.WETNESS_SLICK, Vagina.LOOSENESS_LOOSE);
        this.createBreastRow(Appearance.breastCupInverse("A"));
        this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
        this.ass.analWetness = Ass.WETNESS_SLIME_DROOLING;
        this.tallness = rand(8) + 70;
        this.hips.rating = Hips.RATING_AMPLE + 2;
        this.butt.rating = Butt.RATING_LARGE;
        this.skin.tone = "red";
        this.hair.color = "black";
        this.hair.length = 15;
        this.initStrTouSpeInte(40, 50, 99, 99);
        this.initLibSensCor(35, 35, 20);
        this.weaponName = "pitchforks";
        this.weaponVerb = "stab";
        this.armorName = "chitin";
        this.bonusHP = 500;
        this.lustVuln = 0;
        this.temperment = Farmers.TEMPERMENT_LOVE_GRAPPLES;
        this.level = 10;
        this.gems = rand(25) + 40;
        this.horns.type = Horns.DEMON;
        this.horns.value = 2;
        this.tail.type = Tail.DEMONIC;
        this.drop = this.NO_DROP;
        this.checkMonster();
    }

}
