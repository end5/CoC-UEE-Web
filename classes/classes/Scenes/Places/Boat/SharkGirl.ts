import { Monster } from "../../../Monster";
import { SpriteDb } from "../../../display/SpriteDb";
import { rand } from "../../../Extra";
import { Vagina } from "../../../Vagina";
import { StatusEffects } from "../../../StatusEffects";
import { Appearance } from "../../../Appearance";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { WeightedDrop } from "../../../internals/WeightedDrop";

export class SharkGirl extends Monster {
    // Lust-based attacks:
    private sharkTease(): void {
        this.game.spriteSelect(SpriteDb.s_sharkgirl);
        if (rand(2) == 0) {
            this.outputText("You charge at the shark girl, prepared to strike again, but stop dead in your tracks when she bends over and wiggles her toned ass towards you. It distracts you long enough for her tail to swing out and smack you to the ground. She coos, \"<i>Aw... You really do like me!</i>\" ");
            // (Small health damage, medium lust build).
            this.player.takeDamage(4 + rand(4), true);
            this.player.takeLustDamage(10 + (this.player.lib / 20), true);
        }
        else {
            this.outputText("You pull your " + this.player.weaponName + " back, getting a running start to land another attack. The Shark girl smirks and pulls up her bikini top, shaking her perky breasts in your direction. You stop abruptly, aroused by the sight just long enough for the shark girl to kick you across the face and knock you to the ground.  She teases, \"<i>Aw, don't worry baby, you're gonna get the full package in a moment!</i>\" ");
            // (Small health damage, medium lust build)
            this.player.takeDamage(4 + rand(4), true);
            this.player.takeLustDamage(5 + (this.player.lib / 10), true);
        }
        this.combatRoundOver();
    }
    public defeated(hpVictory: boolean): void {
        this.game.boat.sharkGirlScene.sharkWinChoices();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        if (pcCameWorms) {
            this.outputText("\n\nYour foe doesn't seem disgusted enough to leave...");
            this.doNext(this.game.combat.endLustLoss);
        } else {
            this.game.boat.sharkGirlScene.sharkLossRape();
        }
    }

    public constructor() {
        super();
        // trace("SharkGirl Constructor!");
        this.a = "the ";
        this.short = "shark-girl";
        this.imageName = "sharkgirl";
        this.long = "The shark girl stands just over 5'5\", with grey skin shimmering from water droplets catching the sunlight and slender muscles built for swimming.  Her shoulder-length silver hair brushes past her pretty face and her eyes are a striking shade of red. She has rows of intimidating sharp teeth glinting in the light. A fish-like tail protrudes from her backside, wrapping around her toned legs at every opportunity. She's wearing a rather skimpy black bikini, strings done in such a way that they move around her fin; though the swimwear itself barely covers her perky breasts and tight snatch.";
        this.race = "Shark-Morph";
        // this.plural = false;
        this.createVagina(false, Vagina.WETNESS_DROOLING, Vagina.LOOSENESS_NORMAL);
        this.createStatusEffect(StatusEffects.BonusVCapacity, 15, 0, 0, 0);
        this.createBreastRow(Appearance.breastCupInverse("D"));
        this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
        this.ass.analWetness = Ass.WETNESS_DRY;
        this.createStatusEffect(StatusEffects.BonusACapacity, 40, 0, 0, 0);
        this.tallness = 5 * 12 + 5;
        this.hips.rating = Hips.RATING_AMPLE + 2;
        this.butt.rating = Butt.RATING_LARGE;
        this.skin.tone = "gray";
        this.hair.color = "silver";
        this.hair.length = 16;
        this.initStrTouSpeInte(40, 40, 55, 42);
        this.initLibSensCor(75, 35, 40);
        this.weaponName = "shark teeth";
        this.weaponVerb = "bite";
        this.weaponAttack = 3;
        this.armorName = "tough skin";
        this.armorDef = 5;
        this.bonusHP = 20;
        this.lust = 40;
        this.lustVuln = .9;
        this.temperment = SharkGirl.TEMPERMENT_RANDOM_GRAPPLES;
        this.level = 4;
        this.gems = rand(15) + 5;
        this.drop = new WeightedDrop().
            add(this.consumables.L_DRAFT, 3).
            add(this.armors.S_SWMWR, 1).
            add(this.consumables.SHARK_T, 5).
            add(undefined, 1);
        this.special1 = this.sharkTease;
        this.special2 = this.sharkTease;
        this.checkMonster();
    }

}
