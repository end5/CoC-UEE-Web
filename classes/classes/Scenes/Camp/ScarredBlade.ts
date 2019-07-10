import { Monster } from "../../Monster";
import { WeightedDrop } from "../../internals/WeightedDrop";

export class ScarredBlade extends Monster {
    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        this.game.sheilaScene.badEndScarredBlade();
    }

    public defeated(hpVictory: boolean): void {
        this.game.sheilaScene.breakScarredBlade();
    }

    public constructor() {
        super();
        this.a = "the ";
        this.short = "scarred blade";
        this.plural = false;
        this.createBreastRow();
        this.initedGenitals = true;
        this.balls = 0;
        this.ballSize = 0;
        this.tallness = 36;
        this.skin.tone = "metallic";
        this.long = "The sword you're fighting is a no ordinary sword. It's a lethicite-infused metal curved saber etched with scars. It seems to eagerly seek flesh.";
        this.pronoun1 = "it";
        this.pronoun2 = "it";
        this.pronoun3 = "its";
        this.initStrTouSpeInte(80, 100, 75, 50);
        this.initLibSensCor(0, 0, 100);
        this.weaponName = "scarred blade";
        this.weaponVerb = "slash";
        this.weaponAttack = 50;
        this.armorName = "lethicite";
        this.armorDef = 15;
        this.bonusHP = 400;
        this.lust = 0;
        this.lustVuln = 0;
        this.temperment = ScarredBlade.TEMPERMENT_LUSTY_GRAPPLES;
        this.level = 17;
        this.gems = 0;
        this.drop = new WeightedDrop(this.weapons.B_SCARB, 1);
        this.checkMonster();
    }

}
