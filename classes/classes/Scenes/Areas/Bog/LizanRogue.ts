import { Monster } from "../../../Monster";
import { StatusEffects } from "../../../StatusEffects";
import { LizanBlowpipeDebuff } from "../../../StatusEffects/Combat/LizanBlowpipeDebuff";
import { rand } from "../../../Extra";
import { Skin } from "../../../BodyParts/Skin";
import { Appearance } from "../../../Appearance";
import { CockTypesEnum } from "../../../CockTypesEnum";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { WeightedDrop } from "../../../internals/WeightedDrop";
import { PerkLib } from "../../../PerkLib";

export class LizanRogue extends Monster {
    // 1 - str
    // 2 - tou
    // 3 - spe
    // 4 - sens
    public blowGun(): void {
        if (this.player.getEvasionRoll()) {
            this.outputText("The lizan flings himself back.  In the air he puts a blowgun to his lips.  You move just in time to avoid the tiny dart.");
        }
        else {
            this.outputText("The lizan flings himself back.  In the air he puts his blowgun to his lips and fires a single dart into your neck.  As you pull it out your limbs begin to feel like wet noodles, it appears you’ve been poisoned.");
            (this.player.createOrFindStatusEffect(StatusEffects.LizanBlowpipe) as LizanBlowpipeDebuff).debuffStrSpe();
        }
        this.combatRoundOver();
    }

    public immaHurtYouBadly(): void {
        if (this.player.getEvasionRoll()) {
            this.outputText("The lizan Rushes at you.  As you raise your [weapon] to defend yourself he dives to the side, using a blowgun to fire a single dart at you.  You somehow manage to dodge it.");
        }
        else {
            this.outputText("The lizan rushes at you.  As you raise your [weapon] to defend yourself he dives to the side, using his blowgun to fire a single stinging dart into your neck.  You pull out the dart and your skin begins to feel hypersensitive, you’re going to have trouble defending yourself");
            this.game.dynStats("tou", -5, "sens", 5);
            (this.player.createOrFindStatusEffect(StatusEffects.LizanBlowpipe) as LizanBlowpipeDebuff).debuffTouSens();
        }
        this.combatRoundOver();
    }

    public wingstickThrow(): void {
        if (this.player.getEvasionRoll()) {
            this.outputText("The lizan zips to the side and you hear the whistle of something being thrown. You sidestep just in time to see a wingstick fly past.");
        }
        else {
            this.outputText("The lizan zips to the side and as you move to follow you feel something sharp cut across your body. He must have thrown something. ");
            const damage: number = 40 + rand(60);
            this.player.takeDamage(damage, true);
        }
        this.combatRoundOver();
    }

    public tongueAttack(): void {
        if (this.player.getEvasionRoll()) {
            this.outputText("All you see is a flash of pink and without even thinking you twist out of its way and watch the lizan’s long tongue snap back into his mouth.");
        }
        else {
            this.outputText("All you see is a flash of pink as the lizan’s long tongue hits your eyes. Some kind of chemical reaction causes your eyes to burn, you’ve been blinded!");
            if (!this.player.hasStatusEffect(StatusEffects.Blind)) this.player.createStatusEffect(StatusEffects.Blind, 1 + rand(2), 0, 0, 0);
        }
        this.combatRoundOver();
    }

    protected chooseBlowpipe(): void {
        if (rand(2) == 0) this.blowGun();
        else this.immaHurtYouBadly();
    }

    public defeated(hpVictory: boolean): void {
        this.game.bog.lizanScene.winAgainstLizan();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        this.game.bog.lizanScene.loseToLizan();
    }

    private SKIN_VARIATIONS: any[] = ["emerald", "azure", "scarlet", "violet", "obsidian", "amber", "silver"];

    public constructor() {
        super();
        const skinToneAdj: string = LizanRogue.randomChoice(this.SKIN_VARIATIONS);
        this.skin.tone = skinToneAdj;
        this.skin.setType(Skin.LIZARD_SCALES);
        this.a = "the ";
        this.short = "lizan rogue";
        this.imageName = "lizanrogue";
        this.long = "A rogue lizan male stands before you, watching your every move with quick yellow eyes. His slim body is covered in glistening " + this.skin.tone + " scales. His strong tail swings back and forth as he shifts his weight, a fluid movement that hints at his speed.  He wears a simple loincloth to protect his modesty to which a small pack is belted.";
        this.race = "Lizan";
        // this.plural = false;
        this.createBreastRow(Appearance.breastCupInverse("flat"));
        this.createCock(8, 3, CockTypesEnum.LIZARD);
        this.createCock(8, 3, CockTypesEnum.LIZARD);
        this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
        this.ass.analWetness = Ass.WETNESS_MOIST;
        this.tallness = 60 + rand(10);
        this.hips.rating = Hips.RATING_BOYISH;
        this.butt.rating = Butt.RATING_TIGHT;
        this.skin.desc = "skin";
        this.hair.color = "black";
        this.hair.length = 15;
        this.initStrTouSpeInte(60, 70, 80, 55);
        this.initLibSensCor(20, 10, 0);
        this.weaponName = "claws";
        this.weaponVerb = "claw";
        this.weaponAttack = 30;
        this.armorName = "loincloth";
        this.armorDef = 8;
        this.bonusHP = 350;
        this.lust = 20;
        this.lustVuln = .7;
        this.temperment = LizanRogue.TEMPERMENT_LOVE_GRAPPLES;
        this.level = 16;
        this.gems = 10 + rand(50);
        this.drop = new WeightedDrop().add(this.consumables.REPTLUM, 5)
            .add(this.consumables.SMALL_EGGS, 2)
            .add(this.consumables.OVIELIX, 2)
            .add(this.consumables.W_STICK, 1);
        this.createPerk(PerkLib.Evade, 0, 0, 0, 0);
        this.createPerk(PerkLib.Precision, 0, 0, 0, 0);
        this.createPerk(PerkLib.Resistance, 0, 0, 0, 0);
        this.createPerk(PerkLib.Tactician, 0, 0, 0, 0);
        this.special1 = this.chooseBlowpipe;
        this.special2 = this.wingstickThrow;
        this.special3 = this.tongueAttack;
        this.checkMonster();
    }

}
