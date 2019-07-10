import { Imp } from "../../Monsters/Imp";
import { CockTypesEnum } from "../../../CockTypesEnum";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { rand } from "../../../Extra";
import { Wings } from "../../../BodyParts/Wings";

export class Scruffy extends Imp {
    public defeated(hpVictory: boolean): void {
        this.game.prison.scruffyScene.prisonCaptorRandomEventJizzJanitorBeatenUp();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        this.game.prison.scruffyScene.prisonCaptorRandomEventJizzJanitorLoss();
    }

    public constructor() {
        super();
        this.a = "";
        this.short = "Scruffy";
        this.imageName = "scruffy";
        this.long = "Scruffy is a skinny imp. He has the typical features of an imp: red skin, curved horns, bat-like wings, and spaded tail. He's wearing a janitor's scrub top with a nametag that reads \"Scruffy\" and he's naked from the waist down, his large cock flopping freely. He's wielding his mop as a weapon.";
        this.race = "Imp";
        // this.plural = false;
        this.createCock(11, 2.5, CockTypesEnum.DEMON);
        this.balls = 2;
        this.ballSize = 1;
        this.createBreastRow(0);
        this.ass.analLooseness = Ass.LOOSENESS_STRETCHED;
        this.ass.analWetness = Ass.WETNESS_NORMAL;
        this.tallness = 40;
        this.hips.rating = Hips.RATING_BOYISH;
        this.butt.rating = Butt.RATING_TIGHT;
        this.skin.tone = "red";
        this.hair.color = "black";
        this.hair.length = 5;
        this.initStrTouSpeInte(40, 35, 25, 28);
        this.initLibSensCor(45, 45, 90);
        this.weaponName = "mop";
        this.weaponVerb = "thwack";
        this.weaponAttack = 6;
        this.armorName = "leathery skin";
        this.lust = 40;
        this.temperment = Scruffy.TEMPERMENT_LUSTY_GRAPPLES;
        this.level = 7;
        this.gems = rand(5) + 25;
        this.drop = this.NO_DROP;
        this.special1 = this.lustMagicAttack;
        this.wings.type = Wings.IMP;
        this.checkMonster();
    }

}
