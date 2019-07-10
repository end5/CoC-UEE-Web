import { Imp } from "../Monsters/Imp";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { CockTypesEnum } from "../../CockTypesEnum";
import { Tail } from "../../BodyParts/Tail";
import { Wings } from "../../BodyParts/Wings";
import { StatusEffects } from "../../StatusEffects";
import { rand } from "../../Extra";

export class ImpGang extends Imp {
    public get capitalA(): string {
        return "gang of imps";
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        this.game.impScene.impGangabangaEXPLOSIONS(true);
    }

    public defeated(hpVictory: boolean): void {
        this.game.flags[kFLAGS.DEMONS_DEFEATED]++;
        this.game.impScene.impGangGetsWhooped();
    }

    public constructor() {
        super();
        this.a = "a ";
        this.short = "mob of imps";
        this.imageName = "impMob";
        this.plural = true;
        this.removeStatuses(false);
        this.removePerks();
        this.removeCock(0, this.cocks.length);
        this.removeVagina(0, this.vaginas.length);
        this.removeBreastRow(0, this.breastRows.length);
        this.createBreastRow();
        this.createCock(12, 1.5);
        this.createCock(25, 2.5);
        this.createCock(25, 2.5);
        this.cocks[2].cockType = CockTypesEnum.DOG;
        this.cocks[2].knotMultiplier = 2;
        this.balls = 2;
        this.ballSize = 3;
        this.tallness = 36;
        this.tail.type = Tail.DEMONIC;
        this.wings.type = Wings.IMP;
        this.skin.tone = "green";
        this.createStatusEffect(StatusEffects.GenericRunDisabled, 0, 0, 0, 0);
        this.long = "The imps stand anywhere from two to four feet tall, with scrawny builds and tiny demonic wings. Their red and orange skin is dirty, and their dark hair looks greasy. Some are naked, but most are dressed in ragged loincloths that do little to hide their groins. They all have a " + this.cockDescript(0) + " as long and thick as a man's arm, far oversized for their bodies."
        this.pronoun1 = "they";
        this.pronoun2 = "them";
        this.pronoun3 = "their";
        this.initStrTouSpeInte(70, 40, 75, 42);
        this.initLibSensCor(55, 35, 100);
        this.weaponName = "claws";
        this.weaponVerb = "claw";
        this.weaponAttack = 10;
        this.armorName = "leathery skin";
        this.armorDef = 3;
        this.bonusHP = 300;
        this.lust = 30;
        this.lustVuln = .65;
        this.temperment = ImpGang.TEMPERMENT_LUSTY_GRAPPLES;
        this.level = 10;
        this.gems = rand(15) + 25;
        this.drop = this.NO_DROP;
        this.special1 = this.lustMagicAttack;
        this.checkMonster();
    }

}
