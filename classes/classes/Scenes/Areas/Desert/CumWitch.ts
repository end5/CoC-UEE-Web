import { Monster } from "../../../Monster";
import { StatusEffects } from "../../../StatusEffects";
import { rand } from "../../../Extra";
import { DragonShellShield } from "../../../Items/Shields/DragonShellShield";
import { CockTypesEnum } from "../../../CockTypesEnum";
import { Vagina } from "../../../Vagina";
import { Appearance } from "../../../Appearance";
import { Ass } from "../../../Ass";
import { Hips } from "../../../BodyParts/Hips";
import { Butt } from "../../../BodyParts/Butt";
import { WeightedDrop } from "../../../internals/WeightedDrop";

export class CumWitch extends Monster {
    public cumWitchAI(): void {
        // Hurt!
        if (this.HPRatio() < .6 && this.fatigue100 <= 90) {
            this.sandWitchCuntHeals();
            return;
        }

        const choices: any[] = [];

        // Dicks only
        if (this.player.hasCock()) choices[choices.length] = this.cumMagicAttack;
        choices[choices.length] = this.bukkakeAttack;
        choices[choices.length] = this.cocknosisAttack;
        if (!this.hasStatusEffect(StatusEffects.Shell)) {
            choices[choices.length] = this.shellDefense;
            choices[choices.length] = this.shellDefense;
            choices[choices.length] = this.shellDefense;
        }
        // HERMS
        if (this.player.gender == 3) choices[choices.length] = this.genderConfusionAttack;
        // VAGOOZLES
        if (this.player.hasVagina()) choices[choices.length] = this.cumHungerAttack;
        choices[rand(choices.length)]();
    }

    // *Attack: Bukkake
    public bukkakeAttack(): void {
        // *Cum Witch hikes up her dress and bukkake's at PC.  Large # of chance for 'hits' for low individual damage.  Small reduction to sand witch lust.  Used more at high lust.
        this.outputText("The Cum Witch moans and daintily peels her robes away from her swollen cock-flesh.  A bubble of precum pops wetly from her urethra to splatter on the floor as her balls suddenly swell.  You look back up in time to see the telltale glow of magic surrounding her staff, but then she's thrusting her hips at you, lewdly humping the air as she unleashes rope after thick rope of potent jism in your direction!\n");
        let hits: number = 5 + rand(8);
        let bonus: number = 0;
        let damage: number = 0;
        while (hits > 0) {
            const evade: string = this.player.getEvasionReason();
            // Evade
            if (evade == this.EVASION_EVADE) this.outputText("\nYou roll away from some of the hermaphrodite spunk, easily evading it.");
            // Misdirect
            else if (evade == this.EVASION_MISDIRECTION) this.outputText("\nYou feint one direction and then move another, misdirecting like a pro and avoiding some of the sexual artillery.");
            // Flexibility
            else if (evade == this.EVASION_FLEXIBILITY) this.outputText("\nYou twist aside, making the most of your cat-like reflexes to avoid some of the stuff.");
            else if (evade == this.EVASION_SPEED || evade != undefined) { // failsafe
                // Miss1
                if (rand(3) == 0) this.outputText("\nA glob of her goo goes wide, over your shoulder!");
                else if (rand(2) == 0) this.outputText("\nOne wave of alabaster falls short, to splatter at your [feet].");
                else this.outputText("\nSome of the Cum Witch's cum nearly hits you, but you manage to step aside.");
            }
            // Dragon-shell shield
            else if (this.player.shield instanceof DragonShellShield && rand(2) == 0) this.outputText("\nYou ready your dragon-shell shield, letting the futa-cum hit your shield. Within a short span of time, the cum is absorbed into your shield.");
            else {
                const temp: number = rand(5);
                // Hit1
                if (temp == 0) this.outputText("\nA mass of jizz splatters into your [hair], soaking it with thick, salty goo.");
                else if (temp == 1) this.outputText("\nOne jet of thick witch-cum hits you in the [chest] before you can react.  You can feel it getting inside your [armor], squishing and sliding over your [nipples] as you try to fight.");
                else if (temp == 2) this.outputText("\nSome of the stuff spatters off your arm and soaks your hand, making it a slimy mess.");
                else if (temp == 3) this.outputText("\nA creamy deluge hits your [legs], though rather than running down, it seems to come up, flowing into your [armor] to squish wetly across your sensitive groin.");
                else {
                    this.outputText("\nSpunk nearly blinds you as the Cum Witch's virile fluids take you in the face.  You spit some of it out, the smell of the stuff making your head swim.");
                    // bonus damage!
                    bonus = 3;
                }
                damage += 2;
            }
            hits--;
        }
        this.player.takeLustDamage(damage + bonus, true);
        this.combatRoundOver();
    }

    // *Attack: Cum Magic
    public cumMagicAttack(): void {
        // *Used on males only, casts spell that causes balls to temporarily swell and increase lust by a moderate amount.  Unavoidable.
        this.outputText("Gesticulating with her free hand, the Cum Witch utters impossible to pronounce words before closing her fingers tightly into a fist.  That same instant, you feel an onset of warmth in your [balls], a spreading heat that makes you tremble with growing lust.  A second later, [eachCock] is throbbing, and a runner of cum trickles from the [cockHead], a hint of your temporarily-enhanced virility.");
        // (15-30 lust, based on libido)
        this.player.takeLustDamage(5 + this.player.lib / 12, true);
        this.player.hoursSinceCum += 100;
        this.combatRoundOver();
    }
    // *Attack: Cum Hunger
    // *Used on vagoozles, spell that causes womb to literally thirst for sperm.  Unavoidable moderate lust gain.  Pregnant character's are immune.
    public cumHungerAttack(): void {
        this.outputText("Moaning luridly, the Cum Witch swivels her staff and opens her hand to spread her fingers wide.  At the same time, you feel her magic slam into your midsection, burrowing into your womb.  ");
        if (this.player.pregnancyIncubation > 0) {
            this.outputText("Yet, whatever she tries to do fails, as her otherworldly conjuration falls apart as soon as soon as it reaches you.");
            this.combatRoundOver();
            return;
        }
        this.outputText("It worms around your uterus, tickling it faintly before gently kneading your ovaries.  Your [legs] go weak as your womb throbs, hungering for something to fill it.  A trickle of wetness squirts from your [vagina] as the magic fades, and you squirm as your lust rises. If only something would make you pregnant!  Your eyes dart unbidden to the Witch's groin before you yank them away.");
        this.player.takeLustDamage(5 + this.player.lib / 12, true);
        this.combatRoundOver();
    }

    // *Attack: Gender Confusion
    public genderConfusionAttack(): void {
        // *Used on genderless and hermaphrodite characters.  Mental attack that draws on disharmony with standard gender types to stun for one round.  3 turn cooldown
        this.outputText("Touching her alabaster staff to her brow, just under the brim of her hat, the Cum Witch makes a brief incantation and fixes you with her gaze.  Her eyes flash blindingly white, and then you feel her inside you, rifling through your memories, digging up memories of your childhood, your past, and throwing them against you.  ");
        if (this.player.inte / 5 + rand(20) + this.player.level / 2 < 18) {
            this.outputText("She batters your consciousness with conflicting memories of your gender, utterly dazing you.  How can you fight when you can barely tell who you are anymore?");
            this.player.createStatusEffect(StatusEffects.Confusion, 0, 0, 0, 0);
        }
        else {
            this.outputText("You parse the flood of information with mental focus and expel the intruder from your mind with a clenching of your sizable intellect.");
        }
        this.combatRoundOver();
    }
    // *Attack: Shell
    public shellDefense(): void {
        // *Grants immunity to all magic-based attacks for the next two turns.
        this.outputText("The Cum Witch holds her staff in both hands and rotates it in a circle, chanting all the while.  Her voice rises in pitch and intensity until she's screaming out unwords of power.  With one final cry, she slams her staff down into the ground hard enough to kick up a puff of sandy dust.  It quickly settles, but the Cum Witch has some kind of glittering, reflective shield around herself now!");
        this.createStatusEffect(StatusEffects.Shell, 3, 0, 0, 0);
        this.combatRoundOver();
    }

    // *Attack: Cocknosis
    // *Intelligence dependant attack with possibility of very high lust gain.
    public cocknosisAttack(): void {
        this.outputText("Lifting her robes enticingly, the Cum Witch reveals her ");
        if (this.lust100 < 50) this.outputText("half-hard");
        else if (this.lust100 < 70) this.outputText("hard");
        else if (this.lust100 < 85) this.outputText("throbbing");
        else this.outputText("hard, dripping");
        this.outputText(" cock.  She gently begins to sway her hips, bouncing back and forth with near-mechanical precision, her softly bobbing cock catching your eyes with its metronome-like precision.  She softly begins to speak, enunciating each word to the time and tune of her movements.");

        this.outputText("\n\n\"<i>See my cock?  See the glistening thickness of it?  Watch how it sways and bobs for you, moving with such smooth and easy grace.  Can you feel your eyes following it, locking onto it and never letting go?</i>\"\n\n");

        if (this.player.inte / 20 + rand(20) >= 13) {
            this.outputText("You chuckle at her crude attempt to hypnotize you with her member.  She stomps her foot in irritation and drops her robes back into place.");
        }
        else {
            this.outputText("The Witch smirks, though you're too focused on her cock to see, and she continues, \"<i>Good " + this.player.mf("boy", "girl") + ".  Watch it sway.  You're so focused on my cock now that the world is just falling away around it, sinking into nothingness, leaving only that wonderful cock behind for you to watch.  And since it's filling your view, you can feel it filling your mind as well, can't you?</i>\"");
            this.outputText("\n\nYou nod, your view rigidly attached to her equally rigid tool as you utterly and completely fixate on her penis, admiring its curves, its thickness, and the way it seems to pulsate happily for you whenever you look at it just right.  The Witch keeps talking, but it's her dick that's important.  You start to drool as your [skin] flushes and your body heats.  Gods, her cock is gorgeous.  Reaching down, you begin to masturbate without thinking.  You don't know why, but it just feels like the right thing to do.");
            this.game.dynStats("lus", 20);
            if (this.player.lust100 <= 99) this.outputText("\n\nYou bump against something, startling yourself out of the cocknosis before you can completely fall for it.  Still, you keep seeing her dick every time you close your eyes, and your body is very turned on from how you were touching yourself.");
            else this.outputText("\n\nYou play with yourself until you're on the very edge of orgasm.  At that moment, a loud *SNAP* startles you back to wakefulness, and as you look down at the cock bobbing just a few inches away, you realize it's hopeless.  You can't fight this.");
            this.outputText("\n\nThe witch smiles knowingly.");
        }
        this.combatRoundOver();
    }

    // *Attack: Heal
    // *Restores one third of her HP.
    public sandWitchCuntHeals(): void {
        this.outputText("The Witch smirks at you and holds her free hand under her robes.  When she pulls it out, you realize she's gathered a handful of her cum.  She holds it up and exhales over it, the air making a slight whistle as it blows through her parted lips.  The ebony sorceress then smears the goop over her wounds, which seem to drink in the cum and vanish before your eyes.  She scolds, \"<i>Physical damage?  How artless.</i>\"");
        this.addHP(this.maxHP() * 0.33);
        this.fatigue += 10;
        this.combatRoundOver();
    }

    protected performCombatAction(): void {
        this.cumWitchAI();
    }

    public defeated(hpVictory: boolean): void {
        this.game.dungeons.desertcave.cumWitchDefeated();
    }

    public won(hpVictory: boolean, pcCameWorms: boolean): void {
        this.game.dungeons.desertcave.defeatedByCumWitch();
    }

    public constructor() {
        super();
        this.a = "the ";
        this.short = "Cum Witch";
        this.imageName = "cumwitch";
        this.long = "The Cum Witch is a moderately tall woman, almost six feet in height.  Her dark ebony skin is nearly as black as pitch, though it glitters with sweat from her recent sexual activities and the fight.  She has plump lips and long, smooth blonde hair, though much of it is hidden behind a pointed, wide-brimmed hat.  Her robes are even blacker than she is, but she wields an alabaster staff that fairly sizzles with magical might.  Of course, her garments don't do much to conceal her gigantic breasts.  Though there are only two, they're large enough to dwarf the four tits most sand witches are packing.";
        this.race = "Human?";
        this.createCock(12, 2, CockTypesEnum.HUMAN);
        this.balls = 0;
        this.ballSize = 0;
        this.cumMultiplier = 3;
        this.hoursSinceCum = 20;
        this.createVagina(false, Vagina.WETNESS_WET, Vagina.LOOSENESS_LOOSE);
        this.createStatusEffect(StatusEffects.BonusVCapacity, 20, 0, 0, 0);
        this.createBreastRow(Appearance.breastCupInverse("E"));
        this.ass.analLooseness = Ass.LOOSENESS_TIGHT;
        this.ass.analWetness = Ass.WETNESS_NORMAL;
        this.tallness = rand(12) + 55;
        this.hips.rating = Hips.RATING_CURVY;
        this.butt.rating = Butt.RATING_LARGE;
        this.skin.tone = "black";
        this.hair.color = "sandy-blonde";
        this.hair.length = 15;
        this.initStrTouSpeInte(35, 35, 35, 85);
        this.initLibSensCor(55, 40, 30);
        this.weaponName = "fists";
        this.weaponVerb = "punches";
        this.armorName = "robes";
        this.bonusHP = 100;
        this.lust = 30;
        this.lustVuln = .8;
        this.temperment = CumWitch.TEMPERMENT_RANDOM_GRAPPLES;
        this.level = 6;
        this.gems = rand(15) + 5;
        this.drop = new WeightedDrop().addMany(1,
            this.consumables.TSCROLL,
            this.consumables.OVIELIX,
            this.consumables.LACTAID,
            this.consumables.LABOVA_,
            this.consumables.W__BOOK,
            this.consumables.B__BOOK,
            undefined);
        this.checkMonster();
    }

}
