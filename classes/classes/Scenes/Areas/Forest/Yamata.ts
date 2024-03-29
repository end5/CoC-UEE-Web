import { BaseKitsune } from "./BaseKitsune";
import { Vagina } from "../../../Vagina";
import { StatusEffects } from "../../../StatusEffects";
import { Appearance } from "../../../Appearance";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { rand, int } from "../../../Extra";
import { WeightedDrop } from "../../../internals/WeightedDrop";
import { Tail } from "../../../BodyParts/Tail";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { PerkLib } from "../../../PerkLib";

export class Yamata extends BaseKitsune {
    public constructor() {
        super();
        this.init();
    }

    private init(): void {
        this.a = "";
        this.short = "Yamata";
        this.imageName = "yamata";
        this.long = "Yamata stands before you, grinning psychotically as her nine fox tails flare out behind her. Her jet black hair twists and writhes in the air, forming eight serpentine heads that snap at anything within reach. A pair of demonic horns curves up in front of her ears, and she is wielding a cursed black sword that resembles an oversized billhook bathed in demonic power. Just looking at her for too long causes strange thoughts to enter your mind, urging you to submit to her and become her loyal masochistic pet. You’ll have to keep your wits about you, or you might start enjoying the pain!";
        this.race = "Kitsune";
        this.createVagina(false, Vagina.WETNESS_WET, Vagina.LOOSENESS_LOOSE);
        this.createStatusEffect(StatusEffects.BonusVCapacity, 8000, 0, 0, 0);
        this.createBreastRow(Appearance.breastCupInverse("E"));
        this.ass.analLooseness = Ass.LOOSENESS_NORMAL;
        this.ass.analWetness = Ass.WETNESS_MOIST;
        this.createStatusEffect(StatusEffects.BonusACapacity, 200, 0, 0, 0);
        this.tallness = 69;
        this.hips.rating = Hips.RATING_AMPLE;
        this.butt.rating = Butt.RATING_AVERAGE + 1;
        this.skin.tone = "light tan";			// might need to change to russet
        this.hair.color = "black";
        this.hair.length = 22;
        this.initStrTouSpeInte(60, 70, 90, 100);
        this.initLibSensCor(60, 65, 100);
        this.weaponName = "Muramasa";
        this.weaponVerb = "slash";
        this.armorName = "tight chest wrap and baggy pants";
        this.armorDef = 16;
        this.bonusHP = 2400;
        this.lust = 25;
        this.bonusLust = 150;
        this.lustVuln = 0.35;
        this.temperment = Yamata.TEMPERMENT_LUSTY_GRAPPLES;
        this.level = 30;
        this.gems = rand(20) + 30;
        this.drop = new WeightedDrop(this.consumables.MYSTJWL, 1);
        this.tail.type = Tail.FOX;
        this.tail.venom = 9;
        this.checkMonster();
    }

    // Corrupted Yamata Attacks
    private yamataBasic(): void {
        const x: number = rand(4);
        let damage: number;
        if (x == 0) {
            this.outputText("Rushing toward you, Yamata drops down low, then leaps up into a wide swing. You flinch as you see the tip of her blade glide across your skin, but she dances away at the last second, leaving behind an angry red wound that hurts like hell, but is far from life-threatening. <i>“Oh yeah, scream for me baby!”</i> The realization that she’s toying with you is practically infuriating!  ");
            damage = int(this.str / 2) + rand(15);
        } else if (x == 1) {
            this.outputText("You back away as Yamata goes into the offensive, doing your best to dodge her attacks. The tip of her blade grazes you a few times, and the shallow wounds they leave behind hurt far worse than they really should. She raises the blade to her lips and gently licks it, grinning vindictively at you. You’re certain now that Yamata is just trying to inflict as much pain as possible before finishing you off.  ");
            damage = int(this.str / 2) + rand(35);
        } else if (x == 2) {
            this.outputText("Yamata digs her heels into the ground, taunting you with a crude gesture. Her serpentine hair suddenly lashes forward, morphing before your eyes into countless blades! Thankfully, she seems to purposely avoid anything vital, but the grazing cuts they leave behind hurt terribly. <i>“Ahahahaha! Doesn’t it just make you HARD?!”</i>  ");
            damage = int(this.str) - rand(25);
            this.player.takeLustDamage(7);
            this.flags[kFLAGS.YAMATA_MASOCHIST]++;
        } else {
            this.outputText("With a quick whipping motion, Yamata’s serpentine hair lashes toward you, splitting into thousands of thin strands that whip against your flesh. Pain lances through your body wherever they touch, but the intense tingling sends blood boiling to your loins involuntarily.  ");
            damage = int(this.str / 2) + rand(50);
            this.player.takeLustDamage(12);
            this.flags[kFLAGS.YAMATA_MASOCHIST]++;
        }

        this.player.takeDamage(damage, true);
        this.yamataSodomasochistApply(damage);
        if (!this.player.hasStatusEffect(StatusEffects.IzmaBleed))
            this.player.createStatusEffect(StatusEffects.IzmaBleed, 2, 0, 0, 0);
        else
            this.player.addStatusValue(StatusEffects.IzmaBleed, 1, 1);

        this.combatRoundOver();
    }

    private yamataDarkFoxfire(): void {
        this.outputText("Yamata moves her fingers through the air in a circle, conjuring up a corrupted purple flame. She twists her upper body into a batter’s stance and strikes it with the flat of her blade, making the fireball rocket toward you like a missile, bursting on impact! The flames burn intensely as they engulf you, but the more it burns, the more you start to LIKE it.  ");
        this.player.takeDamage(int(this.str / 2) + rand(15), true);
        // if masochist, take more damage
        (this.player.hasPerk(PerkLib.Masochist) ? this.player.takeLustDamage(15 + this.player.sens / 10) : this.player.takeLustDamage((10 + this.player.sens / 10) * 2));
        this.flags[kFLAGS.YAMATA_MASOCHIST]++;
        this.combatRoundOver();
    }

    private yamataNightmare(): void {
        this.outputText("You can hear a whispering voice clouding the edges of your mind, and begin to shrink back as darkness begins to close in on you. As the all-consuming blackness fills your field of vision, you are beset on all sides by unimaginable horrors too terrifying to describe! You feel yourself falling deeper and deeper into a void of despair, but somehow you know that you could end all the suffering if you would only submit yourself to Yamata...  ");
        // Resist: - successfully resisting deals small health & lust damage to Yamata
        let resist: number = 0;
        resist = (this.player.inte < 80 ? Math.round(this.player.inte / 70 * 25) : 25);
        if (this.player.findPerk(PerkLib.Whispered) >= 0)
            resist += 30;
        else
            this.outputText("Some small part of you knows this can’t be real, but you’re too terrified to act right now! ");
        if (this.player.findPerk(PerkLib.HistoryReligious) >= 0 && this.player.isPureEnough(20))
            resist += 15 - this.player.corAdjustedDown();
        if (rand(100) < resist) {
            this.outputText("\n\nSummoning up every last ounce of courage you have, you push back the illusions with your mind! Yamata reels a bit, clutching her forehead in pain, but only grins at you. <i>“That all you got, hero?”</i>");
            if (this.player.hasStatusEffect(StatusEffects.Fear))
                this.player.removeStatusEffect(StatusEffects.Fear);
        } else {
            this.outputText("You know that none of this could be real, but you are too terrified to act this round!");
            if (this.player.hasStatusEffect(StatusEffects.Fear))
                this.addCombatBuff("spe", -12);
            else
                this.createStatusEffect(StatusEffects.Fear, 0, 0, 0, 0);
            this.addCombatBuff("spe", -18);
        }

        this.combatRoundOver();
    }

    private yamataLustAttack(): void {
        this.outputText("Before your eyes, Yamata dives to the ground, her hair lengthening and wrapping around her lower body in a slick serpentine shape. Like black lightning she rears up, spiralling around you like a crazed serpent. As she winds her way around your body, she drags her nails along your flesh, running her tongue over the fresh scratches as she snaps away from you. You shudder a little, equal parts disturbed and aroused.\n\n"
            + "The eight serpents that make up Yamata’s hair suddenly slam into you, latching onto you with their fangs and lifting you into the air. As you squirm in their grip, one of them dives into your [armor], and with a look of horror you feel it "
            + (this.player.hasCock() ? "engulfing your [cock] whole, sinking fangs into the base and filling your groin with corrupted fire!" + (this.player.hasVagina() ? " Another of her snakes impale your [vagina], filling your womb with corrupted fire!" : "") : "impaling your [vagina], filling your womb with corrupted fire!")
            + "\n\nShe roughly tosses you to the ground, smirking as you struggle to your feet, lust burning in your loins.  ");

        const lustDmg: number = 15 + this.player.sens / 3 + this.player.lib / 5;
        this.player.takeLustDamage(lustDmg, true);
        if (this.player.hasCock()) this.player.dynStats("cor", 1);
        if (this.player.hasVagina()) this.player.dynStats("cor", 1);
        this.player.takeDamage(15 + rand(26), true);
        this.yamataSodomasochistApply(lustDmg + 5);
        this.flags[kFLAGS.YAMATA_MASOCHIST]++;
        this.combatRoundOver();
    }

    private yamataIllusionLust(): void {
        let lustDmg: number = 10 + this.player.sens / 5;
        this.outputText("Yamata splits herself into a series of illusions that quickly surround you! You try to find the real one but you're too slow! A fireball comes from the side, blasting you with broiling corrupted flames!  ");
        this.player.takeDamage(int(this.str / 2) + rand(15), true);
        if (this.player.hasStatusEffect(StatusEffects.Fear))
            switch (rand(3)) {
                case 0:
                    this.outputText("\n\nYou attack Yamata, but her figure was just an illusion! She appears behind you and her hair lengthens rapidly, one of the snake-hair serpents lashes out and bites into your ankle, injecting a burst of corrupted flames directly into you!");
                    lustDmg += 4;
                    this.player.dynStats("cor", 1);
                    this.flags[kFLAGS.YAMATA_MASOCHIST]++;
                    break;
                case 1:
                    this.outputText("\n\n<i>“This is my realm... and in my realm... you get to feel good...”</i> her strange words entice you as you widen your eyes, you try to hit her but you always seem to miss. A mischievous grin comes from her figure as you feel something rubbing your crotch, is one of her tails! Oh damn, it feels so good!  ");
                    this.player.takeLustDamage(lustDmg);
                    break;
                case 2:
                    this.outputText("\n\nYamata turns around, brushing her tails to the side to expose her ample hindquarters, showing off her juicy-looking cheeks. Her display sends blood rushing to your groin, making you lick your lips eagerly.\n\n"
                        + "Yamata pauses for a moment, placing a hand on her taut abs and sliding her fingers downward slowly, gazing deep into your eyes. Her tails fan out around her, curling around her limbs seductively, and she gives you a flirtatious leer as she watches your body tremble with desire.  ");
                    this.player.takeLustDamage(lustDmg * 2);
                    break;

                default:
                    this.outputText("This is a bug, please report it - yamataIllusionLust");
                    break;
            }
        this.outputText("\n\nYamata takes a moment to stretch out her limber body, thrusting out her bound chest as she stretches her arms toward the sky. She twirls around, head slightly askew, and then bows forward to give you a good angle at her cleavage, packed tightly into her chest wrap, all the while with a sickly grin on her face.\n\n"
            + "<i>“Why dont you just surrender already? We can have so much fun in my torture devices, it will feel so good! We might even have some fun on the side if you scream prettily enough, hehehe.”</i> Yamata whispers sultrily, running a hand along her tails and making them fan out around her seductively.\n\n");
        if (this.flags[kFLAGS.YAMATA_MASOCHIST] > 60) {
            this.outputText("You find yourself giving it a moments thought before pulling yourself beck to the present. What is she doing to you?!  ");
            lustDmg += 5;
        }
        if (this.flags[kFLAGS.YAMATA_MASOCHIST] > 80) {
            this.outputText(" Though come to think of it, her proposition might not be so bad...  ");
            lustDmg += 3;
            this.flags[kFLAGS.YAMATA_MASOCHIST]++;
        }
        this.player.takeLustDamage(lustDmg, true);
        this.combatRoundOver();
    }

    private yamataEntwine(): void {
        this.outputText("Yamata’s hair whips toward you with a blinding speed, each of the snakes sinking its fangs into a different part of you and lifting you into the air. <I>“You’re MINE!”</I> she yells, bringing you in close as her hair begins to constrict around you. You can feel the bite wounds begin to tingle, and look in horror as you see that each of the snakes is injecting her corrupted purple flames directly into your body! If you can’t escape soon, you’ll be reduced to a gibbering masochistic heap in no time!\n\n"
            + "You are bound by Yamata’s snake-like hair. The only thing you can do is try to struggle free!\n\n"
            + "As the venomous flames course through your system, you start to become more and more turned on by the thought of being abused and degraded...  ");

        this.player.dynStats("cor", 2);
        this.player.addCombatBuff('str', -10);
        this.player.addCombatBuff('spe', -10);
        const damage: number = 40 + 25 / (rand(3) + 1);
        this.player.takeLustDamage(rand(6) + 10, true);
        this.player.takeDamage(damage, true);
        this.yamataSodomasochistApply(damage);
        this.createStatusEffect(StatusEffects.YamataEntwine, 0, 0, 0, 0);
        this.combatRoundOver();
    }

    public entwineStruggle(): void {
        this.clearOutput();
        this.outputText("You struggle against Yamata’s grip with every ounce of strength you can muster, desperately trying to free yourself.\n\n");
        let brokeFree: boolean = false;
        if ((rand(this.player.str) > (this.str / 4) * 3) || rand(5) == 0) {
            brokeFree = true;
        }

        if (brokeFree) {
            this.entwineEscape();
            this.combatRoundOver();
        } else {
            this.outputText("You thrash about fruitlessly, your struggles only getting you even more entangled in her serpentine hair. Yamata cackles evilly, reaching out to drag her nails across your chest, crooning about all the myriad torments she’ll subject you to when you’re her loyal slave. Still fighting against her");
            if (this.player.str < 90)
                this.outputText(" immense");
            else
                this.outputText(" impressive");
            this.outputText(" strength, in an attempt to free yourself from her corrupting embrace, without success.");
            const damage: number = 25 + rand(15);
            this.player.takeDamage(damage, true);
            this.yamataSodomasochistApply(damage);
            this.player.takeLustDamage(rand(6) + 10, true);
            this.player.dynStats("cor", 1);
            this.performCombatAction();
        }
    }

    private entwineEscape(): void {
        this.outputText("You lash out with reserves of strength you didn’t know you had, tearing yourself away from her with a few stray hairs clinging to your body still as you tumble away. As you move back into a defensive stance, Yamata looks incredulously at the frayed clump of hair where you broke free from her, then shouts, “You fucking did it now! I’m gonna carve you to ribbons!” In spite of her threats, her hair seems to repair itself, easily growing back into its monstrous snake form.\n\n");
        this.player.removeStatusEffect(StatusEffects.YamataEntwine);
        this.outputText("<b>You feel relief as Yamata's serpents finally release their hold, though you can still feel their corruption pulsing in your veins.</b>\n\n");
    }

    public entwineWait(): void {
        this.clearOutput();
        this.outputText("You don't see the point of struggling against such a powerful foe, letting Yamata have her fun. The snakes entangling you continue to pump their foul fires into you and it is turning you on just watching them do so! The pain bocomes more pleasurable the longer you are subjected to it!");
        this.player.dynStats("cor", 1);
        this.flags[kFLAGS.YAMATA_MASOCHIST] += 2;
        this.performCombatAction();
        this.combatRoundOver();
    }

    private foxfireCanon1(): void {
        this.outputText("Yamata’s hair snakes begin to fan themselves out, curling toward you with their jaws unhinged and open wide. They seem to be drawing in energy as bright balls of purple flame begin to build up in each of their mouths. It looks like Yamata is charging up for something big!");
        this.createStatusEffect(StatusEffects.YamataCanon, 0, 0, 0, 0);
        this.combatRoundOver();
    }

    private foxfireCanon2(): void {
        let totaldmg: number = 0;
        if (this.flags[kFLAGS.IN_COMBAT_USE_PLAYER_WAITED_FLAG] == 1) {
            this.outputText("The air is suddenly filled with missiles of corrupted flame as each of the eight snake heads launches its own projectile at you! Thankfully you were prepared for it, and easily dip, duck, and dive through all of the flaming missiles, emerging unscathed.");
        } else {
            const hits: number = rand(9);
            this.outputText("The air is suddenly filled with missiles of corrupted flame as each of the eight snake heads launches its own projectile at you! You do your best to block or dodge them all, but your previous actions this round have put you at a slight disadvantage.\n\n");
            if (hits == 0) {
                this.outputText("You somehow manage to emerge unscathed, but the effort of avoiding or deflecting them all has put a strain on your muscles!");
                this.player.changeFatigue(10);
            } else {
                this.outputText(hits + (hits > 1 ? " fireballs rocket" : " fireball rockets") + " into you with deadly force! As the corrupted flames wash over you, you start to enjoy the pain, gripping yourself in masochistic pleasure!  ");
                for (let i: number = 0; i < hits; i++) {
                    const x: number = rand(10) + 5;
                    this.player.dynStats("cor", 1);
                    this.player.takeDamage(x * 2, true);
                    this.player.takeLustDamage(x / 2, true);
                    totaldmg += x * 2;
                }
            }
        }
        if (totaldmg > 0)
            this.yamataSodomasochistApply(totaldmg);

        this.removeStatusEffect(StatusEffects.YamataCanon);
        this.combatRoundOver();
    }

    private yamataMiss(): void {
        this.outputText("You neatly dodge Yamata’s wild attack, backing up and holding up your [weapon] defensively. <i>“Haha! I love it when my prey has some fight in them!”</i>");
        this.combatRoundOver();
    }

    private yamataSodomasochistApply(dmg: number): void {
        this.outputText("\n\nYamata delights in the pain being caused...  ");
        this.takeLustDamage(int(dmg / 2), true);
        this.dynStats("str", dmg / 25, "spe", -dmg / 30);
    }

    // <Masochism Aura> Passive ability
    // Due to her heavily-corrupted state, Yamata emits an aura that subtly influences anyone who fights against her to become a masochist, causing their lust to rise every time they are hurt. This effect is compounded even more if the PC is already a masochist.

    // <Frenzy> Passive ability
    // Yamata’s Lust has a direct effect on her combat effectiveness. As her Lust rises, she receives a %increase to her Strength while incurring a %penalty to her Speed, representing an increase in her recklessness and lack of self-control.

    protected handleFear(): boolean {
        this.removeStatusEffect(StatusEffects.Fear);
        this.outputText("Yamata shudders in delight for a moment, then looks your way with a clear head.  \"<i>I love that! You should do it more often!</i>\"\n");
        return true;
    }

    protected handleBlind(): boolean {
        this.outputText("<i>“Your fancy tricks wont work on me Champion, I see right through them.”</i> Your blinding attack simply fades away before her magic.");
        return true;
    }

    protected performCombatAction(): void {

        // basic attack has 2x chance unless arcane archer active
        let moves: any[];
        moves = [this.yamataBasic, this.yamataDarkFoxfire, this.yamataNightmare, this.yamataBasic, this.yamataIllusionLust, this.yamataLustAttack, this.kitsuneSealAttack];
        if (this.player.getEvasionRoll()) {
            moves = [this.yamataMiss];
        }

        if (this.hasStatusEffect(StatusEffects.YamataCanon)) {
            this.foxfireCanon2();
        }
        else if (rand(15) == 0) {
            this.foxfireCanon1();
        }
        else if (rand(10) == 0) {
            if (!this.hasStatusEffect(StatusEffects.YamataEntwine)) {
                this.yamataEntwine();
            }
        } else {
            moves[rand(moves.length)]();
        }
    }

    public defeated(hpVictory: boolean): void {
        this.game.forest.aikoScene.yamataLoses();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        this.game.forest.aikoScene.yamataWins();
    }
}
