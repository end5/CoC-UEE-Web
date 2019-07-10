import { Monster } from "../../../Monster";
import { StatusEffects } from "../../../StatusEffects";
import { int, rand } from "../../../Extra";
import { PerkLib } from "../../../PerkLib";
import { AkbalSpeedDebuff } from "../../../StatusEffects/Combat/AkbalSpeedDebuff";
import { CockTypesEnum } from "../../../CockTypesEnum";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { Skin } from "../../../BodyParts/Skin";
import { WeightedDrop } from "../../../internals/WeightedDrop";
import { Tail } from "../../../BodyParts/Tail";

export class Akbal extends Monster {

    public eAttack(): void {
        // Chances to miss:
        let damage: number = 0;
        // Blind dodge change
        if (this.hasStatusEffect(StatusEffects.Blind)) {
            this.outputText(this.capitalA + this.short + " seems to have no problem guiding his attacks towards you, despite his blindness.\n");
        }
        // Determine if dodged!
        if (this.player.spe - this.spe > 0 && int(Math.random() * (((this.player.spe - this.spe) / 4) + 80)) > 80) {
            if (this.player.spe - this.spe < 8)
                this.outputText("You narrowly avoid " + this.a + this.short + "'s " + this.weaponVerb + "!");
            if (this.player.spe - this.spe >= 8 && this.player.spe - this.spe < 20)
                this.outputText("You dodge " + this.a + this.short + "'s " + this.weaponVerb + " with superior quickness!");
            if (this.player.spe - this.spe >= 20)
                this.outputText("You deftly avoid " + this.a + this.short + "'s slow " + this.weaponVerb + ".");
            this.game.combat.combatRoundOver();
            return;
        }
        // Determine if evaded
        if (this.player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 10) {
            this.outputText("Using your skills at evading attacks, you anticipate and sidestep " + this.a + this.short + "'s attack.");
            this.game.combat.combatRoundOver();
            return;
        }
        // Determine if flexibilitied
        if (this.player.findPerk(PerkLib.Flexibility) >= 0 && rand(100) < 10) {
            this.outputText("Using your cat-like agility, you twist out of the way of " + this.a + this.short + "'s attack.");
            this.game.combat.combatRoundOver();
            return;
        }
        // Determine damage - str modified by enemy toughness!
        // *Normal Attack A -
        if (rand(2) == 0) {
            // (medium HP damage)
            damage = int((this.str + this.weaponAttack) - Math.random() * (this.player.tou) - this.player.armorDef);
            if (damage <= 0) {
                this.outputText("Akbal lunges forwards but with your toughness");
                if (this.player.armorDef > 0)
                    this.outputText(" and " + this.player.armorName + ", he fails to deal any damage.");
                else
                    this.outputText(" he fails to deal any damage.");
            }
            else {
                this.outputText("Akbal rushes at you, his claws like lightning as they leave four red-hot lines of pain across your stomach.");
                this.player.takeDamage(damage);
            }
        } else { // *Normal Attack B
            // (high HP damage)
            damage = int((this.str + 25 + this.weaponAttack) - Math.random() * (this.player.tou) - this.player.armorDef);
            if (damage == 0) {
                this.outputText("Akbal lunges forwards but between your toughness ");
                if (this.player.armorDef > 0)
                    this.outputText("and " + this.player.armorName + ", he fails to deal any damage.");
            }
            else {
                this.outputText("Akbal snarls as he flies towards you, snapping his ivory teeth on your arm. You scream out in pain as you throw him off.");
                this.player.takeDamage(damage);
            }
        }
        this.game.combat.combatRoundOver();
    }

    public defeated(hpVictory: boolean): void {
        this.game.forest.akbalScene.akbalDefeated(hpVictory);
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        this.game.forest.akbalScene.akbalWon(hpVictory, pcCameWorms);
        this.game.combat.cleanupAfterCombat();
    }

    public akbalLustAttack(): void {
        // *Lust Attack -
        if (!this.player.hasStatusEffect(StatusEffects.Whispered)) {
            this.outputText("You hear whispering in your head. Akbal begins speaking to you as he circles you, telling all the ways he'll dominate you once he beats the fight out of you.");
            // (Lust increase)
            this.player.takeLustDamage(7 + (100 - this.player.inte) / 10, true);
            this.player.createStatusEffect(StatusEffects.Whispered, 0, 0, 0, 0);
        }
        // Continuous Lust Attack -
        else {
            this.outputText("The whispering in your head grows, many voices of undetermined sex telling you all the things the demon wishes to do to you. You can only blush.");
            // (Lust increase)
            const lustDmg: number = 12 + (100 - this.player.inte) / 10;
            this.player.takeLustDamage(lustDmg, true);
        }
        this.game.combat.combatRoundOver();
    }

    public akbalSpecial(): void {
        // *Special Attack A -
        if (rand(2) == 0 && this.player.spe > 20) {
            this.outputText("Akbal's eyes fill with light, and a strange sense of fear begins to paralyze your limbs.");
            // (Speed decrease)
            const ase: AkbalSpeedDebuff = this.player.createOrFindStatusEffect(StatusEffects.AkbalSpeed) as AkbalSpeedDebuff;
            ase.increase();
        }
        // *Special Attack B -
        else {
            this.outputText("Akbal releases an ear-splitting roar, hurling a torrent of emerald green flames towards you.\n");
            // (high HP damage)
            // Determine if dodged!
            if (this.player.spe - this.spe > 0 && int(Math.random() * (((this.player.spe - this.spe) / 4) + 80)) > 80) {
                if (this.player.spe - this.spe < 8)
                    this.outputText("You narrowly avoid " + this.a + this.short + "'s fire!");
                if (this.player.spe - this.spe >= 8 && this.player.spe - this.spe < 20)
                    this.outputText("You dodge " + this.a + this.short + "'s fire with superior quickness!");
                if (this.player.spe - this.spe >= 20)
                    this.outputText("You deftly avoid " + this.a + this.short + "'s slow fire-breath.");
                this.game.combat.combatRoundOver();
                return;
            }
            // Determine if evaded
            if (this.player.findPerk(PerkLib.Evade) >= 0 && rand(100) < 20) {
                this.outputText("Using your skills at evading attacks, you anticipate and sidestep " + this.a + this.short + "'s fire-breath.");
                this.game.combat.combatRoundOver();
                return;
            }
            // Determine if flexibilitied
            if (this.player.findPerk(PerkLib.Flexibility) >= 0 && rand(100) < 10) {
                this.outputText("Using your cat-like agility, you contort your body to avoid " + this.a + this.short + "'s fire-breath.");
                this.game.combat.combatRoundOver();
                return;
            }
            this.outputText("You are burned badly by the flames! (" + this.player.takeDamage(40) + ")");
        }
        this.game.combat.combatRoundOver();
    }

    // *Support ability -
    public akbalHeal(): void {
        if (this.HPRatio() >= 1)
            this.outputText("Akbal licks himself, ignoring you for now.");
        else
            this.outputText("Akbal licks one of his wounds, and you scowl as the injury quickly heals itself.");
        this.addHP(30);
        this.lust += 10;
        this.game.combat.combatRoundOver();
    }

    public constructor() {
        super();
        // trace("Akbal Constructor!");
        this.a = "";
        this.short = "Akbal";
        this.imageName = "akbal";
        this.long = "Akbal, 'God of the Terrestrial Fire', circles around you. His sleek yet muscular body is covered in tan fur, with dark spots that seem to dance around as you look upon them.  His mouth holds two ivory incisors that glint in the sparse sunlight as his lips tremble to the sound of an unending growl.  Each paw conceals lethal claws capable of shredding men and demons to ribbons.  His large and sickeningly alluring bright green eyes promise unbearable agony as you look upon them.";
        this.race = "Demon";
        // this.plural = false;
        this.createCock(15, 2.5, CockTypesEnum.DOG);
        this.balls = 2;
        this.ballSize = 4;
        this.cumMultiplier = 6;
        this.hoursSinceCum = 400;
        this.createBreastRow();
        this.createBreastRow();
        this.createBreastRow();
        this.createBreastRow();
        this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
        this.ass.analWetness = Ass.WETNESS_NORMAL;
        this.tallness = 4 * 12;
        this.hips.rating = Hips.RATING_SLENDER;
        this.butt.rating = Butt.RATING_TIGHT;
        this.skin.tone = "spotted";
        this.skin.setType(Skin.FUR);
        this.hair.color = "black";
        this.hair.length = 5;
        this.initStrTouSpeInte(55, 53, 50, 75);
        this.initLibSensCor(50, 50, 100);
        this.weaponName = "claws";
        this.weaponVerb = "claw-slash";
        this.weaponAttack = 5;
        this.armorName = "shimmering pelt";
        this.armorDef = 5;
        this.bonusHP = 20;
        this.lust = 30;
        this.lustVuln = 0.8;
        this.temperment = Akbal.TEMPERMENT_LUSTY_GRAPPLES;
        this.level = 6;
        this.gems = 15;
        this.drop = new WeightedDrop().
            add(this.consumables.INCUBID, 4).
            add(this.consumables.W_FRUIT, 3).
            add(this.consumables.AKBALSL, 2).
            add(this.weapons.PIPE, 1);
        this.special1 = this.akbalLustAttack;
        this.special2 = this.akbalSpecial;
        this.special3 = this.akbalHeal;
        this.tail.type = Tail.DOG;
        this.checkMonster();
    }

}
