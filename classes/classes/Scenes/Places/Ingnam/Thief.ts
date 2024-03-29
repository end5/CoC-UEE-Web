import { Monster } from "../../../Monster";
import { Appearance } from "../../../Appearance";
import { Ass } from "../../../Ass";
import { rand } from "../../../Extra";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { WeightedDrop } from "../../../internals/WeightedDrop";

export class Thief extends Monster {

    public defeated(hpVictory: boolean): void {
        this.game.ingnam.thiefScene.winAgainstThief();
    }

    public constructor() {
        super();
        this.a = "the ";
        this.short = "thief";
        this.imageName = "thief";
        this.long = "The thief standing before you is a human.  His skin is fairly pale and his hair is brown.  He's wearing a set of leather armor and wielding a dagger in his right hand.  He's intent on knocking you out so he can take your gems.";
        this.race = "Human";
        // this.plural = false;
        this.createCock();
        this.createBreastRow(Appearance.breastCupInverse("flat"));
        this.ass.analLooseness = Ass.LOOSENESS_NORMAL;
        this.ass.analWetness = Ass.WETNESS_NORMAL;
        this.tallness = 5 * 12 + 5 + rand(4);
        this.hips.rating = Hips.RATING_BOYISH;
        this.butt.rating = Butt.RATING_TIGHT;
        this.skin.tone = "light";
        this.hair.color = "brown";
        this.hair.length = 4;
        this.initStrTouSpeInte(17, 16, 16, 17);
        this.initLibSensCor(20, 15, 20);
        this.weaponName = "knife";
        this.weaponVerb = "slash";
        this.weaponAttack = 4;
        this.armorName = "leather armor";
        this.lust = 25;
        this.temperment = Thief.TEMPERMENT_LOVE_GRAPPLES;
        this.level = 1;
        this.gems = 5 + rand(10);
        this.drop = new WeightedDrop().add(this.weapons.DAGGER0, 1)
            .add(this.armors.LEATHRA, 1)
            .add(undefined, 8);
        this.checkMonster();
    }

}
