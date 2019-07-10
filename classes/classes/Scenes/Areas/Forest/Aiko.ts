import { BaseKitsune } from "./BaseKitsune";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { Vagina } from "../../../Vagina";
import { StatusEffects } from "../../../StatusEffects";
import { Appearance } from "../../../Appearance";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { rand, int } from "../../../Extra";
import { WeightedDrop } from "../../../internals/WeightedDrop";
import { Tail } from "../../../BodyParts/Tail";
import { Ears } from "../../../BodyParts/Ears";
import { PerkLib } from "../../../PerkLib";

export class Aiko extends BaseKitsune {
    private castIllusion: number = 0;

    public constructor() {
        super();
        this.init();
    }

    /**
     * Constructor code extracted into function to make use of the JIT compiler.
     * Code in the constructor is always interpreted.
     */
    private init(): void {
        this.a = "";
        this.short = "Aiko";
        this.imageName = "aiko";
        if (this.game.flags[kFLAGS.AIKO_CORRUPTION] < 50 || this.game.flags[kFLAGS.AIKO_CORRUPTION_ACTIVE] == 0)
            this.long = "Aiko stands before you, a little over 5’4 tall. She has a head of short silver-blond hair that ends above her shoulders, parted by two large, furry fox ears. " + (this.flags[kFLAGS.AIKO_BOSS_COMPLETE] > 0 ? "Eight" : "Seven") + " luxurious fox tails sway behind her, the silky fur shimmering as they move. She wears a set of revealing blue and white robes, neatly pressed and hung off her features with care, her D-cup breasts bound by a cloth chest wrap that is just a little too tight. She sports a number of red “tattoos” adorning her face and body; the most prominent of which are the spiral-shaped patterns on her palms and buttocks, and a stylized lotus flower on her lower back.  She wields a longbow almost as tall as she is that she can summon and dismiss with a snap of her fingers, and stares you down with a determined fire in her glittering blue eyes.";
        else
            this.long = "Aiko stands before you, a little over 5’4 tall. She has a head of short, unkempt silver-blond hair that ends above her shoulders, parted by two large, furry fox ears. " + (this.flags[kFLAGS.AIKO_BOSS_COMPLETE] > 0 ? "Eight" : "Seven") + " fox tails sway behind her, their fur shaggy and matted down. She wears a set of ragged, bloodied robes that show a lot of skin, her D-cup breasts haphazardly bound by a set of bandages in dire need of changing, and you can smell sex and violence on her even from here. She sports a number of red “tattoos” adorning her face and body; the most prominent of which are the spiral-shaped patterns on her palms and buttocks, and a stylized lotus flower on her lower back. She is wielding an over-sized bill-hook hatchet that she can summon and dismiss with a snap of her fingers, and stares you down with a maniacal fire in her crazed blue eyes.";
        this.race = "Kitsune";
        this.createVagina(false, Vagina.WETNESS_NORMAL, Vagina.LOOSENESS_TIGHT);
        this.createStatusEffect(StatusEffects.BonusVCapacity, 200, 0, 0, 0);
        this.createBreastRow(Appearance.breastCupInverse("D"));
        this.ass.analLooseness = Ass.LOOSENESS_VIRGIN;
        this.ass.analWetness = Ass.WETNESS_DRY;
        this.createStatusEffect(StatusEffects.BonusACapacity, 40, 0, 0, 0);
        this.tallness = 64;
        this.hips.rating = Hips.RATING_AMPLE;
        this.butt.rating = Butt.RATING_AVERAGE + 1;
        this.skin.tone = "light tan";			// might need to change to russet
        this.hair.color = "silver-blonde";
        this.hair.length = 10;
        this.initStrTouSpeInte(25, 30, 90, 100);
        this.initLibSensCor(40, 65, this.game.flags[kFLAGS.AIKO_CORRUPTION]);
        this.weaponName = (this.cor >= 50 && this.game.flags[kFLAGS.AIKO_CORRUPTION_ACTIVE] == 1 ? "bill-hook hatchet" : "longbow");
        this.weaponVerb = (this.cor >= 50 && this.game.flags[kFLAGS.AIKO_CORRUPTION_ACTIVE] == 1 ? "slash" : "shoot");
        this.armorName = (this.cor >= 50 && this.game.flags[kFLAGS.AIKO_CORRUPTION_ACTIVE] == 1 ? "ragged, bloodied robes" : "revealing blue and white robes");
        this.armorDef = 16;
        this.bonusHP = 350;
        this.lust = 25;
        this.lustVuln = 0.4;
        this.temperment = (this.cor >= 50 && this.game.flags[kFLAGS.AIKO_CORRUPTION_ACTIVE] == 1 ? Aiko.TEMPERMENT_LOVE_GRAPPLES : Aiko.TEMPERMENT_LUSTY_GRAPPLES);
        if (this.flags[kFLAGS.AIKO_BOSS_COMPLETE] > 0) {
            this.level = 28;
            this.tail.venom = 8;
        } else {
            this.level = 18;
            this.tail.venom = 7;
        }
        this.gems = rand(10) + 30;
        this.drop = new WeightedDrop(this.consumables.FOXJEWL, 1);
        this.tail.type = Tail.FOX;
        this.ears.type = Ears.FOX;
        this.checkMonster();
    }

    private aikoBasic(): void {
        const damage: number = int(this.str) + rand(15);
        this.outputText("Aiko nocks an arrow and lets it fly");

        // 20% chance for double hit without block or evade chance
        if (rand(5) == 0) {
            this.outputText(", swiftly following it with another!  ");
            this.player.takeDamage(damage - rand(10), true);
            this.player.takeDamage(damage - rand(9), true);
            this.player.addCombatBuff("spe", -4);
            if (!this.player.hasStatusEffect(StatusEffects.IzmaBleed))
                this.player.createStatusEffect(StatusEffects.IzmaBleed, 2, 0, 0, 0);
            else (this.player.addStatusValue(StatusEffects.IzmaBleed, 1, 2));
        }
        // Determine if evaded
        else if (this.player.getEvasionRoll()) {
            this.outputText(", which disappears into the woods.");
        }
        // Armor blocked
        else if (this.player.armorDef > 4 && rand(3) == 0) {
            this.outputText("! You shrink away from the impending impact, but it strikes at an angle, glancing off your [armor] and tumbling into the woods.  ");
            this.player.takeDamage(int(damage) - (this.player.armorDef * 2), true);
        }
        // Direct hit
        else {
            this.outputText(" with deadly precision! It protrudes from your body painfully, making it somewhat difficult to move around.  ");
            this.player.takeDamage(damage, true);
            this.player.addCombatBuff("spe", -4);
            if (!this.player.hasStatusEffect(StatusEffects.IzmaBleed))
                this.player.createStatusEffect(StatusEffects.IzmaBleed, 2, 0, 0, 0);
            else
                this.player.addStatusValue(StatusEffects.IzmaBleed, 1, 1);
        }
        this.combatRoundOver();
    }

    private aikoFoxfire(): void {
        this.outputText("Aiko moves her fingers through the air in a circle, conjuring up a pale blue flame. As she thrusts her palm forward, it rockets toward you like a missile, bursting on impact! The flames burn intensely as they engulf you, at the same time filling your body with a crippling pleasure that makes your skin flush red.  ");
        let damage: number = 2 * (this.str + rand(30));
        damage = this.player.takeDamage(damage, true);
        // player.takeLustDamage(15 + player.sens / 5
        this.player.takeLustDamage(15 + this.player.sens / 5, true);
        this.combatRoundOver();
    }

    private aikoFireArrow(): void {
        this.outputText("Aiko nocks an arrow on her bow and lines up a shot, biting the end of her tongue as she focuses. As she lets it fly, the arrowhead sparks and then bursts into flame! The flaming obsidian tip pierces through your [armor] like a hot knife through butter, sinking into your flesh and forcing a pained cry from your throat.  ");
        this.player.takeDamage((this.hasStatusEffect(StatusEffects.AikoArcaneArcher) ? 2 * (this.str + rand(40)) : this.str + rand(40)) + 30, true);
        this.player.addCombatBuff("spe", -5);
        this.combatRoundOver();
    }

    private aikoIllusion(): void {
        if (this.castIllusion < 1) {
            this.outputText("Aiko whispers an incantation in a strange language, and reality seems to be twisting and warping around her. This is going to make it much harder to hit her!\n\n");
            this.castIllusion += 2;
        } else {
            this.outputText("Aiko whispers her incantation again, and your already distorted perception of your surroundings is compounded. Coupled with sudden shifts in gravity, her illusory magic has you stumbling around drunkenly, struggling to keep Aiko in your sights. It’s going to be nearly impossible to hit her like this!\n\n");
            this.castIllusion += 2;
        }
        if (this.player.hasStatusEffect(StatusEffects.Illusion))
            this.player.addCombatBuff("spe", -3);
        this.resistIllusion();
        this.combatRoundOver();
    }

    private resistIllusion(): void {
        // Resist: - successfully resisting deals small health & lust damage to Aiko
        let resist: number = 0;
        if (this.player.inte < (50 + this.player.level)) resist = Math.round(this.player.inte / 55 * 30);
        else resist = 25;
        if (this.player.hasPerk(PerkLib.Whispered)) resist += 15;
        if (this.player.hasPerk(PerkLib.HistoryReligious) && this.player.isPureEnough(20)) resist += 15 - this.player.corAdjustedDown();
        if (rand(100) < resist) {
            this.outputText("As the world around you begins to twist, you push back the influence of her illusions with your mind! She lets out a small cry of pain, clutching her forehead, and curses audibly as she realizes that you resisted her magic.\n\n");
            if (this.player.hasStatusEffect(StatusEffects.Illusion)) {
                this.player.removeStatusEffect(StatusEffects.Illusion);
                this.player.addCombatBuff("spe", 3);
            }
        } else {
            if (this.player.hasStatusEffect(StatusEffects.Illusion)) {
                this.player.addCombatBuff("spe", -1);
            } else {
                this.player.createStatusEffect(StatusEffects.Illusion, 0, 0, 0, 0);
                this.addCombatBuff("spe", -7);
            }
        }
    }

    // Corrupted Aiko Attacks
    private aikoCorruptBasic(): void {
        this.outputText("<i>\“Hack! Slash! Maim! Kill! Isn’t it the fucking greatest?!\”</i> Aiko yells with a psychotic laugh as she strikes out at you with reckless abandon. \n\n<i>“\Lacerate! Eviscerate! Mutilate!”</i> Aiko chants with each reckless swing. <i>“Ever notice how all the best words end in -ate?!\”\n\n\“You know I’d bleed for you!”</i> she yells, grinning crazily as she hacks at you with her billhook. <i>“Now you’ll do the SAME!”</i>  ");

        const dodge: number = this.player.speedDodge(this);
        if (dodge > 0) {
            this.outputPlayerDodged(dodge);
            const evasionResult: string = this.player.getEvasionReason(false);
            // Determine if evaded
            if (evasionResult === this.EVASION_EVADE) {
                this.outputText("<i>\“Just hold still, I promise to make it hurt good!”</i> Aiko yells as using your skills at evading attacks, you anticipate and sidestep her ferocious attacks.");
            }
            // ("Misdirection"
            else if (evasionResult === this.EVASION_MISDIRECTION) {
                this.outputText("<i>\“Just hold still, I promise to make it hurt good!”</i> Aiko yells as using Raphael's teachings, you anticipate and sidestep her ferocious attacks.");
            }
            // Determine if cat'ed
            else if (evasionResult === this.EVASION_FLEXIBILITY) {
                this.outputText("<i>\“Just hold still, I promise to make it hurt good!”</i> Aiko yells as with your incredible flexibility, you squeeze out of the way of her ferocious attacks.");
            }
            else if (evasionResult !== undefined) {
                this.outputText("<i>\“Just hold still, I promise to make it hurt good!”</i> Aiko yells as using your superior combat skills you dodge her ferocious attacks.\n");
            }
            // Parry with weapon
            else if (this.combatParry()) {
                this.outputText("<i>\“Just hold still, I promise to make it hurt good!”</i> Aiko yells as you parry her ferocious attacks with your [weapon].");
            }
            // Block with shield
            else if (this.combatBlock(true)) {
                this.outputText("<i>\“Just hold still, I promise to make it hurt good!”</i> Aiko yells as you block her ferocious attacks with your [shield].");
            }
        } else {
            const damage: number = int(this.str) + rand(15);
            this.player.takeDamage(damage, true);
            this.player.addCombatBuff("spe", -4);
            if (!this.player.hasStatusEffect(StatusEffects.IzmaBleed))
                this.player.createStatusEffect(StatusEffects.IzmaBleed, 2, 0, 0, 0);
            else (this.player.addStatusValue(StatusEffects.IzmaBleed, 1, 1));
        }

        this.combatRoundOver();
    }

    private aikoDarkFoxfire(): void {
        this.outputText("Aiko moves her fingers through the air in a circle, conjuring up a corrupt purple flame. She twists her upper body into a batter’s stance and strikes it at you ferociously, making the fireball rocket toward you like a missile, bursting on impact! The flames burn intensely as they engulf you, but the more it burns, the more you start to LIKE it.  ");
        this.player.takeDamage(int(this.str / 2) + rand(15), true);
        // if masochist, take more damage
        (this.player.hasPerk(PerkLib.Masochist) ? this.player.takeLustDamage(15 + this.player.sens / 5) : this.player.takeLustDamage((10 + this.player.sens / 5) * 2));
        this.combatRoundOver();
    }

    private aikoTerrorize(): void {
        this.outputText("Aiko pauses and mutters an incantation, snapping her fingers in your direction. The edges of your vision blacken, and you suddenly find yourself beset on all sides by countless indescribable otherworldly horrors! Though your eyes cannot see them, your mind can somehow sense the eldritch abominations crowding in around you, threatening to engulf your very essence... ");
        // Resist: - successfully resisting deals small health & lust damage to Aiko
        let resist: number = 0;
        if (this.player.inte < (50 + this.player.level)) resist = Math.round(this.player.inte / 55 * 30);
        else resist = 25;
        if (this.player.findPerk(PerkLib.Whispered) >= 0) resist += 35;
        else this.outputText("Some small part of you knows this can’t be real, but you’re too terrified to act right now!");
        if (this.player.findPerk(PerkLib.HistoryReligious) >= 0 && this.player.isPureEnough(20)) resist += 15 - this.player.corAdjustedDown();
        if (rand(100) < resist) {
            this.outputText("\n\nAiko murmurs her incantation, but as the darkness begins to close in on you, you push back the influence of her illusions with your mind! She lets out a yelp of pain, clutching her forehead, but then grins madly. <i>\“Think you’re pretty clever, huh?\”</i>");
            if (this.player.hasStatusEffect(StatusEffects.Fear))
                this.player.removeStatusEffect(StatusEffects.Fear);
        } else {
            if (this.player.hasStatusEffect(StatusEffects.Fear))
                this.addCombatBuff("spe", -4);
            else
                this.createStatusEffect(StatusEffects.Fear, 0, 0, 0, 0);
            this.addCombatBuff("spe", -10);
        }

        this.combatRoundOver();
    }

    private aikoTomahawk(): void {
        if (rand(3) == 1 || this.player.speedDodge(this) > 0 || this.player.getEvasionRoll() || this.combatParry() || this.combatBlock(true)) {
            this.outputText("Aiko draws back and heaves her weapon at you with all her force! Thankfully, the shot goes wide, and the blade winds up lodged in a tree trunk instead of your chest. <i>“Don’t you fucking play hard to get with ME!”</i> she yells furiously, snapping her fingers and summoning the weapon back to her hands, still stomping the ground in anger.");
        } else {
            this.outputText("Aiko draws back and heaves her weapon at you with all her force! The wicked-looking blade scythes through the air, staggering you with the force of the hit! She laughs sadistically at your pained struggles to dislodge it, and with a snap of her fingers, it disappears in a puff of smoke, reappearing in her hand again.  ");
            this.player.takeDamage(int(this.str) + rand(15), true);
        }
        this.combatRoundOver();
    }

    /**
     * Prints a text message that the user should report a bug.
     *
     * @param bugId a string to help developers find whatever triggered the bug
     */
    private reportABug(bugId: string): void {
        this.outputText("This is probably a bug. Please open a issue so it can be fixed - " + bugId);
    }

    private aikoTease(): void {
        const temp: number = rand(4);
        switch (temp) {
            case 0:
                this.outputText("Aiko turns around, brushing her tails to the side to expose her ample hindquarters, showing off the spiral-shaped tattoos on her juicy-looking cheeks and a lotus-flower tramp stamp. Her display sends blood rushing to your groin, making you lick your lips eagerly.  ");
                break;
            case 1:
                this.outputText("Aiko pauses for a moment, placing a hand on her taut abs and sliding her fingers downward slowly, coyly gazing deep into your eyes. Her tails fan out around her, curling around her limbs seductively, and she gives you a flirtatious leer as she watches your body tremble with desire.  ");
                break;
            case 2:
                this.outputText("Aiko takes a moment to stretch out her limber body, thrusting out her chest as she stretches her arms toward the sky. She spins girlishly, giving you a come-hither glare, and then bows forward to give you a good angle at her cleavage, packed tightly into her too-small chest wrap.  ");
                break;
            case 3:
                this.outputText("<i>“You know, we don’t have to fight... Wouldn’t you rather come pet my super fluffy tails?”</i> Aiko teases, running a hand along her tails and making them fan out around her seductively. You find yourself nodding before you can even think to stop yourself — yes, you <i>DO</i> want the fluffy tails!  ");
                break;

            default:
                this.reportABug("Aiko Tease");
                break;
        }

        const lustDmg: number = 8 + int(this.player.sens / 5);
        this.player.takeLustDamage(lustDmg);
        this.combatRoundOver();
    }

    private aikoIllusionLust(): void {
        const x: number = rand(6);
        const lustDmg: number = 11 + int(this.player.sens / 5);

        if (this.player.hasStatusEffect(StatusEffects.Illusion)) {
            this.outputText("A series of Aiko's illusions surround you! You try to find the real one but you're too slow! An arrow comes from the side, impaling you!  ");
            this.player.takeDamage(int(this.str / 2) + rand(15), true);

            if (x === 0) {
                this.outputText("\n\nYou attack Aiko, but her figure was just an illusion! She appears behind you and rapidly shoots an arrow, she got you! But.... what has she done?! You feel a tingling sensation in your groin, the arrow was poisoned with some kind of lust-inducing venom!  ");

                if (!this.player.hasStatusEffect(StatusEffects.lustvenom)) {
                    this.player.createStatusEffect(StatusEffects.lustvenom, 0, 0, 0, 0);
                }
            } else if (x === 1) {
                this.outputText("\n\n<i>“This is my realm... and in my realm... you get to feel good...”</i> her strange words entice you as you widen your eyes, you try to hit her but you always seem to miss. A mischievous grin comes from her figure as you feel something rubbing your crotch, is one of her tails! Oh damn, it feels so good!  ");
                this.player.takeLustDamage(lustDmg);

                if (this.player.hasStatusEffect(StatusEffects.Illusion)) {
                    this.player.addCombatBuff("spe", -3);
                } else {
                    this.player.createStatusEffect(StatusEffects.Illusion, 0, 0, 0, 0);
                    this.addCombatBuff("spe", -7);
                    this.castIllusion += 2;
                }
            } else {
                this.reportABug("Aiko Illusion");
            }
        }
        else if (x == 3) {
            this.outputText("Aiko turns around, brushing her tails to the side to expose her ample hindquarters, showing off the spiral-shaped tattoos on her juicy-looking cheeks and a lotus-flower tramp stamp. Her display sends blood rushing to your groin, making you lick your lips eagerly.\n\n"
                + "Aiko pauses for a moment, placing a hand on her taut abs and sliding her fingers downward slowly, coyly gazing deep into your eyes. Her tails fan out around her, curling around her limbs seductively, and she gives you a flirtatious leer as she watches your body tremble with desire.  ");
            this.player.takeLustDamage(lustDmg * 2);
        }
        else if (x == 4) {
            this.outputText("Aiko devilishly looks at you, you find yourself surrounded by many Aikos! <i>“Would you like a reverse gangbang, big boy?”</i> all of the Aikos' seductively grab one bound breast and lower their pants, the tatoo on their pubic mounds drawing your attention to their most private parts.\n\n"
                + "In your distraction you don't notice the illusion Aiko has cast over you!  ");
            this.player.takeLustDamage(lustDmg * 2);

            if (this.player.hasStatusEffect(StatusEffects.Illusion)) {
                this.player.addCombatBuff("spe", -3);
            } else {
                this.player.createStatusEffect(StatusEffects.Illusion, 0, 0, 0, 0);
                this.addCombatBuff("spe", -7);
            }
        } else {
            this.outputText("Aiko takes a moment to stretch out her limber body, thrusting out her chest as she stretches her arms toward the sky. She spins girlishly, giving you a come-hither glare, and then bows forward to give you a good angle at her cleavage, packed tightly into her too-small chest wrap."
                + "\n\n<i>“You know, we don’t have to fight... Wouldn’t you rather come pet my super fluffy tails?”</i> Aiko teases, running a hand along her tails and making them fan out around her seductively. You find yourself nodding before you can even think to stop yourself—yes, you DO want the fluffy tails!  ");
        }

        this.player.takeLustDamage(lustDmg);
        this.combatRoundOver();
    }

    private arcaneArcherActivate(): void {
        this.outputText("<i>“I'll show you my training as a guardian... can you stand my magic and my bow? Let's find out.”</i> she says. You almost take her words as a joke, but you can clearly see her determination, and she has the power to back up her demeanor!\n\nYou see her body enveloped by a golden aura, and sparks of yellow-white arc out from her from time to time, she looks a little frightening!\n\n");

        this.createStatusEffect(StatusEffects.AikoArcaneArcher, 0, 0, 0, 0);
        this.addCombatBuff("str", 10);
        this.addCombatBuff("spe", 10);
    }

    private splinterLightningArrow(): void {
        this.outputText("Aiko summons her magic inside her bow and shoots to you a lighting arrow that splits into a multitude of dangerous sparks! They are too many and have too irregular movements, you can't dodge them! You are hit!\n\n"
            + "You fall to the ground, your legs giving in once the initial shock lets up.  ");
        this.player.addCombatBuff('str', -10);
        this.player.addCombatBuff('spe', -10);
        this.player.takeDamage(45 + 25 / (rand(3) + 1), true);

        if (!this.player.hasStatusEffect(StatusEffects.AikoLightningArrow))
            this.player.createStatusEffect(StatusEffects.AikoLightningArrow, 4, 0, 0, 0);
        else
            this.player.addStatusValue(StatusEffects.AikoLightningArrow, 1, 3);

        this.combatRoundOver();
    }

    private lightArrowCage(): void {
        this.outputText("Aiko groans with effort with her mouth closed and summons an incredible amount of arrows made of pure light! There are so many of 'em, you grit your teeth as you see you are completely surrounded by a cage of arrows ready to get you!\nThey all strike at once, converging on you at the center!  ");

        if (this.player.isCorruptEnough(40)) {
            this.outputText("\n\nDue to your high corruption, the light sears your skin and burns incredibly.  ");
            this.player.takeDamage(2 * (80 + this.player.cor), true);
        } else {
            this.player.takeDamage(1.2 * (80 + this.player.cor), true);
        }

        this.removeStatusEffect(StatusEffects.AikoArcaneArcher);
        this.combatRoundOver();
    }

    private iceArrow(): void {
        this.outputText("Aiko rapidly shoots a flurry of arrow in an arc motion before her, they are made of pure ice, they leave a big trail of ice behind them, and as such are twice as dangerous!\n\n");

        if (this.getEvasionRoll()) {
            this.outputText("You narrowly avoid the barrage of arrows and watch as the last one whizzes past and embeds itself with a great thunk in a tree on the opposite end of the clearing, instantly freezing half the tree.");
        } else {
            this.outputText("You are hit by one of the frozen arrows, frost rapidly spreading over the skin surrounding the arrow [if (player.armor != ArmorLib.NOTHING)and chilling your armor]  ");
            this.player.addCombatBuff("spe", -15);
            this.player.takeDamage(this.str * 2 + rand(40), true);
        }
        this.combatRoundOver();
    }

    private arrowRain(): void {
        const arrows: number = rand(4) + 2;
        this.outputText("Aiko nocks a series of arrows made of pure light and shoots them into the air! The hailstorm of bolts come crashing down, impaling you " + arrows + " times! The arrows luckily are purely magical and vanish soon after.\n");
        for (let i: number = 0; i < arrows; i++) {
            this.player.takeDamage((this.str + rand(15)), true);
            this.outputText(" ");
        }
        this.combatRoundOver();
    }

    private arrowBarrage(): void {
        const arrows: number = rand(3) + 3;
        this.outputText("Aiko lets loose a barrage of arrows and they strike you with the speed of a machine gun! You barely have the time to react, damn, she's fast! ");
        for (let i: number = 0; i < arrows; i++) {
            this.player.takeDamage((this.str + rand(10)), true);
            this.outputText(" ");
            this.player.addCombatBuff("spe", -2);
            if (!this.player.hasStatusEffect(StatusEffects.IzmaBleed))
                this.player.createStatusEffect(StatusEffects.IzmaBleed, 2, 0, 0, 0);
            else (this.player.addStatusValue(StatusEffects.IzmaBleed, 1, 1));
        }
        this.combatRoundOver();
    }

    private hyperAttack1(): void {
        this.outputText("You notice Aiko is not attacking and seems to be preparing for something big! She bows her head over her bow, muttering an incantation below her breath, completely ignoring you for the moment.");
        this.createStatusEffect(StatusEffects.AikoHyper, 0, 0, 0, 0);
        this.combatRoundOver();
    }

    private hyperAttack2(): void {
        this.outputText("You see Aiko gathering up an enormous amount of energy, she pulls back on the string of her bow, and as her golden aura extends outward, her tattoos begin to glow in an eerie light. She's up to something really dangerous as she aims at you. You can hear a faint whisper as she slowly draws the bow to it's absolute limit, <i>“With an arrow the focus of my heart, I cast away all mundane thoughts, and with this shaft of light in my hands...”</i> An arrow of the purest light you have ever seen materializes, nocked and ready to loose! \n\n");

        if (this.flags[kFLAGS.IN_COMBAT_USE_PLAYER_WAITED_FLAG] == 1) {
            this.outputText("<i>“I'll punish every demon in this world!”</i> As she finishes her incantation, she releases the string of her arrow and unleashes an immense beam of golden white light directly at you! It was a wise choice to stand back to see what was going on! You narrowly manage to dodge the attack by rolling away as you see the forest behind you completely obliterated. Aiko stands speechless before you, she clearly did not expected you to dodge her attack.");
        } else {
            this.outputText("<i>“I'll punish every demon in this world!”</i> As she finishes her incantation, she releases the string of her arrow and unleashes an immense beam of golden white light directly at you! Oh shit! You barely have the time to widen your eyes as you get blasted away by the enormous mass of energy who seems to obliterate you as you come crashing down to the floor, all of your body smoking.  ");
            this.player.addCombatBuff("spe", -20);
            this.player.addCombatBuff("str", -15);
            if (this.player.isPureEnough(20))
                this.player.takeDamage(250, true);
            else
                this.player.takeDamage(350, true);
            if (this.player.HP > 0)
                this.outputText("You barely manage to survive the blast, and find Aiko standing gaping at you.\n\n<i>“How did you... No way that is possible!!!”</i>\n\n[if (player.isPureEnough(20))Unless you truly are pure of heart, that should have obliterated you!]");
        }

        this.removeStatusEffect(StatusEffects.AikoArcaneArcher);
        this.removeStatusEffect(StatusEffects.AikoHyper);
        this.combatRoundOver();
    }

    protected kitsuneSealAttack(): void {
        const resist: number = this.calculateAttackResist();
        const select: number = rand(5);

        if (select == 0) {
            this.sealPlayerAttack();
        } else if (select == 1) {
            this.sealPlayerTease();
        } else if (select == 2) {
            this.sealPlayerItems();
        } else if (select == 3) {
            this.sealPlayerMovement();
        }
        else {
            this.sealPlayerPhysicalSpecialSkills();
        }

        if (resist >= rand(100)) {
            this.resistSeal();
        }

        this.combatRoundOver();
    }

    private kitsuneSealMagic(): void {
        const resist: number = this.calculateAttackResist();
        const select: number = rand(3);

        if (select == 0) {
            this.sealPlayerSpells();
        } else if (select == 1) {
            this.sealPlayerMovement();
        } else {
            this.sealPlayerMagicSpecialSkills();
        }

        if (resist >= rand(100)) {
            this.resistSeal();
        }

        this.combatRoundOver();
    }

    protected handleFear(): boolean {
        if (this.game.flags[kFLAGS.AIKO_CORRUPTION] >= 50) {
            this.removeStatusEffect(StatusEffects.Fear);
            this.outputText("Aiko shudders in delight for a moment, then looks your way with a clear head.  <i>“I love that! You should do it more often!</i>”\n");
            return true;
        } else if (rand(3) == 0) {
            this.removeStatusEffect(StatusEffects.Fear);
            this.outputText("Aiko shudders for a moment, then looks your way with a clear head and a frown.  <i>“I sure am glad for my training now... That was really scary!”</i>\n");
            return true;
        } else {
            return false;
        }
    }

    protected handleBlind(): boolean {
        this.outputText("<i>“Your fancy tricks wont work on me Champion, I see right through them.”</i> Your blinding attack simply fades away before her magic.");
        return true;
    }

    protected performCombatAction(): void {
        this.castIllusion--;
        if (this.player.hasStatusEffect(StatusEffects.lustvenom)) {
            this.player.takeLustDamage(5 + this.player.sens / 5);
            this.outputText("  You feel slightly more flushed from the poisoned arrow.\n\n");
        }
        if (this.player.hasStatusEffect(StatusEffects.Illusion))
            this.resistIllusion();

        if ((rand(12) == 0) && (!this.hasStatusEffect(StatusEffects.AikoArcaneArcher))) {
            this.arcaneArcherActivate();
        }

        // basic attack has 2x chance unless arcane archer active
        let moves: any[] = [];
        if (this.game.flags[kFLAGS.AIKO_CORRUPTION] < 50 || this.game.flags[kFLAGS.AIKO_CORRUPTION_ACTIVE] == 0) {
            moves = [this.aikoBasic, this.aikoFoxfire, this.aikoFireArrow, this.aikoIllusion, this.aikoIllusionLust, this.aikoTease];
            if (this.hasStatusEffect(StatusEffects.AikoArcaneArcher)) {
                moves.push(this.splinterLightningArrow, this.lightArrowCage, this.iceArrow, this.arrowRain, this.arrowBarrage, this.kitsuneSealAttack);
            } else {
                moves.push(this.aikoBasic);
            }
            if (this.player.hasStatusEffect(StatusEffects.Illusion)) {
                moves.push(this.kitsuneSealMagic);
            }

        } else {
            moves = [this.aikoCorruptBasic, this.aikoDarkFoxfire, this.aikoTerrorize, this.aikoTomahawk, this.aikoIllusionLust, this.aikoTease];
            if (this.hasStatusEffect(StatusEffects.AikoArcaneArcher)) {
                moves.push(this.splinterLightningArrow, this.iceArrow, this.arrowRain, this.arrowBarrage, this.kitsuneSealAttack);
            } else {
                moves.push(this.aikoCorruptBasic);
            }
            if (this.player.hasStatusEffect(StatusEffects.Illusion)) {
                moves.push(this.kitsuneSealMagic);
            }
        }

        if (this.hasStatusEffect(StatusEffects.AikoHyper))
            this.hyperAttack2();
        else if (rand(15) == 0 && this.hasStatusEffect(StatusEffects.AikoArcaneArcher))
            this.hyperAttack1();
        else
            moves[rand(moves.length)]();
    }

    public defeated(hpVictory: boolean): void {
        if (this.player.hasStatusEffect(StatusEffects.lustvenom))
            this.player.removeStatusEffect(StatusEffects.lustvenom);
        if (this.player.hasStatusEffect(StatusEffects.Spar)) {
            this.game.forest.aikoScene.sparWithAikoWin();
        } else if (this.player.hasStatusEffect(StatusEffects.DomFight)) {
            this.game.forest.aikoScene.pcWinsDomFight();
        } else {
            this.game.forest.aikoScene.aikoLosesIntro();
        }
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        if (this.player.hasStatusEffect(StatusEffects.lustvenom))
            this.player.removeStatusEffect(StatusEffects.lustvenom);
        if (this.player.hasStatusEffect(StatusEffects.Spar)) {
            this.game.forest.aikoScene.sparWithAikoLose(this.lust100);
        } else if (this.player.hasStatusEffect(StatusEffects.DomFight)) {
            this.game.forest.aikoScene.pcLosesDomFight();
        } else {
            this.game.forest.aikoScene.aikoWinsIntro();
        }
    }
}
