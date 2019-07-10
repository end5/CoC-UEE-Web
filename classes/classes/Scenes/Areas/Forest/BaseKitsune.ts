import { Monster } from "../../../Monster";
import { PerkLib } from "../../../PerkLib";
import { StatusEffects } from "../../../StatusEffects";
import { rand } from "../../../Extra";

/**
 * This class contains code and text that are shared between Aiko and Yamata.
 */
export class BaseKitsune extends Monster {
    protected static PHYSICAL_SKILL: string = "physical";
    protected static MAGICAL_SKILL: string = "magical";

    /**
     * Calculate the resist value for attacks. This is based on INT and modified by certain perks.
     * @return the calculated resist value
     */
    protected calculateAttackResist(): number {
        let resist: number = 0;

        if (this.player.inte < 30) {
            resist = Math.round(this.player.inte);
        } else {
            resist = 30;
        }

        if (this.player.findPerk(PerkLib.Whispered) >= 0) {
            resist += 20;
        }

        if (this.player.findPerk(PerkLib.HistoryReligious) >= 0 && this.player.isPureEnough(20)) {
            resist += 20 - this.player.corAdjustedDown();
        }

        return resist;
    }

    /**
     * Seal the player's attacks, rendering them unable to attack until it wears off.
     */
    protected sealPlayerAttack(): void {
        this.outputText("The kitsune playfully darts around you, grinning coyly.  She somehow slips in under your reach, and before you can react, draws a small circle on your chest with her fingertip.  As you move to strike again, the flaming runic symbol she left on you glows brightly, and your movements are halted mid-swing.");
        this.outputText("\n\n\"<i>Naughty naughty, you should be careful with that.</i>\"");

        this.outputText("\n\nDespite your best efforts, every time you attempt to attack her, your muscles recoil involuntarily and prevent you from going through with it.  <b>The kitsune's spell has sealed your attack!</b>  You'll have to wait for it to wear off before you can use your basic attacks.");
        this.player.createStatusEffect(StatusEffects.Sealed, 4, 0, 0, 0);
    }

    /**
     * Seal the players physical special attacks. Prints text and creates the matching status effect.
     */
    protected sealPlayerPhysicalSpecialSkills(): void {
        this.sealPlayerSpecial(BaseKitsune.PHYSICAL_SKILL);
    }

    /**
     * Seal the players magical special attacks. Prints text and creates the matching status effect.
     */
    protected sealPlayerMagicSpecialSkills(): void {
        this.sealPlayerSpecial(BaseKitsune.MAGICAL_SKILL);
    }

    /**
     * Seals the players special skill. Prints the matching text and applies a status effect.
     * @param	skillType the type of skill to seal (physical, magical)
     * @throws ArgumentError if the selected skill is invalid
     */
    private sealPlayerSpecial(skillType: string): void {
        this.outputText("You jump with surprise as the kitsune appears in front of you, grinning coyly.  As she draws a small circle on your forehead with her fingertip, you find that you suddenly can't remember how to use any of your " + skillType + " skills!");
        this.outputText("\n\n\"<i>Oh no darling, </i>I'm<i> the one with all the tricks here.</i>\"");
        this.outputText("\n\n<b>The kitsune's spell has sealed your " + skillType + " skills!</b>  You won't be able to use any of them until the spell wears off.");

        if (skillType === BaseKitsune.PHYSICAL_SKILL) {
            this.player.createStatusEffect(StatusEffects.Sealed, 4, 5, 0, 0);
        } else if (skillType === BaseKitsune.MAGICAL_SKILL) {
            this.player.createStatusEffect(StatusEffects.Sealed, 4, 6, 0, 0);
        } else {
            throw new ArgumentError("Invalid skill type!");
        }
    }

    /**
     * Seals the players ability to use the tease skill.
     */
    protected sealPlayerTease(): void {
        this.outputText("You are taken by surprise when the kitsune appears in front of you out of nowhere, trailing a fingertip down your chest.  She draws a small circle, leaving behind a glowing, sparking rune made of flames.  You suddenly find that all your knowledge of seduction and titillation escapes you.  <b>The kitsune's spell has sealed your ability to tease!</b>  Seems you won't be getting anyone hot and bothered until it wears off.");
        this.player.createStatusEffect(StatusEffects.Sealed, 4, 1, 0, 0);
    }

    /**
     * Seals the players ability to use items during combat.
     */
    protected sealPlayerItems(): void {
        this.outputText("\"<i>Tsk tsk, using items?  That's cheating!</i>\"  the kitsune says as she appears right in front of you, taking you off guard.  Her finger traces a small circle on your pouch, leaving behind a glowing rune made of crackling flames.  No matter how hard you try, you can't seem to pry it open.  <b>The kitsune's spell has sealed your item pouch!</b>  Looks like you won't be using any items until the spell wears off.");
        this.player.createStatusEffect(StatusEffects.Sealed, 4, 3, 0, 0);
    }

    /**
     * Seals the players spells, preventing them from using magic.
     */
    protected sealPlayerSpells(): void {
        this.outputText("\"<i>Oh silly, trying to beat me at my own game are you?</i>\"  the kitsune says with a smirk, surprising you as she appears right in front of you.  She traces a small circle around your mouth, and you find yourself stricken mute!  You try to remember the arcane gestures to cast your spell and find that you've forgotten them too.  <b>The kitsune's spell has sealed your magic!</b>  You won't be able to cast any spells until it wears off.");
        this.player.createStatusEffect(StatusEffects.Sealed, 4, 2, 0, 0);
    }

    /**
     * The player resists the seal attempt.
     */
    protected resistSeal(): void {
        this.outputText("\n\nUpon your touch, the seal dissipates, and you are free of the kitsune's magic!  She pouts in disappointment, looking thoroughly irritated, but quickly resumes her coy trickster facade.");
        this.player.removeStatusEffect(StatusEffects.Sealed);
    }

    /**
     * Seal the players movements, preventing them from escaping.
     */
    protected sealPlayerMovement(): void {
        this.outputText("\"<i>Tsk tsk, leaving so soon?</i>\"  the kitsune says, popping up in front of you suddenly as you attempt to make your escape.  Before you can react, she draws a small circle on your chest with her fingertip, leaving behind a glowing rune made of crackling blue flames.  You try to run the other way, but your " + this.player.legs() + " won't budge!\n\n\"<i>Sorry baby, you'll just have to stay and play~.</i>\" she says in a singsong tone, appearing in front of you again.  <b>The kitsune's spell prevents your escape!</b>  You'll have to tough it out until the spell wears off.");
        this.player.createStatusEffect(StatusEffects.Sealed, 4, 4, 0, 0);
    }

    /**
     * Cancels and disables whatever command the player uses this round. Lasts 3 rounds, cannot seal more than one command at a time.
     * PCs with "Religious" background and < 20 corruption have up to 20% resistance to sealing at 0 corruption, losing 1% per corruption.
     */
    protected kitsuneSealAttack(): void {
        const resist: number = this.calculateAttackResist();
        const select: number = rand(7);

        if (select == 0) {
            this.sealPlayerAttack();
        }
        else if (select == 1) {
            this.sealPlayerTease();
        }
        else if (select == 2) {
            this.sealPlayerSpells();
        }
        else if (select == 3) {
            this.sealPlayerItems();
        }
        else if (select == 4) {
            this.sealPlayerMovement();
        }
        else if (select == 5) {
            this.sealPlayerPhysicalSpecialSkills();
        }
        else {
            this.sealPlayerMagicSpecialSkills();
        }

        if (resist >= rand(100)) {
            this.resistSeal();
        }
        this.combatRoundOver();
    }
}
