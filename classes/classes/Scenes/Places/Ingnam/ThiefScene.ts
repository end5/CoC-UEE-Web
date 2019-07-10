import { BaseContent } from "../../../BaseContent";
import { Thief } from "./Thief";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { ArmorLib } from "../../../Items/ArmorLib";
import { UndergarmentLib } from "../../../Items/UndergarmentLib";

export class ThiefScene extends BaseContent {

    public encounterThief(): void {
        this.clearOutput();
        this.outputText("You wander the village for Ingnam until you feel something pressing against your shoulder and you look around to see the thief. \"<i>Your money or your life,</i>\" he demands.");
        this.menu();
        this.addButton(0, "Fight", this.startCombatImmediate, new Thief());
        this.addButton(1, "Give Gems", this.giveGems);
    }

    private giveGems(): void {
        this.clearOutput();
        this.outputText("You reach into your gem pouch");
        if (this.player.gems <= 0) this.outputText(", only to find it empty and tell the thief that you're poor. \"<i>Damn! Looks like I've picked the wrong person,</i>\" the thief says with a grumbled look. He lets go of you and saunters off.");
        else if (this.player.gems > 0 && this.player.gems <= 5) {
            this.outputText(" and fish into the only gem" + (this.player.gems == 1 ? "" : "s") + " you have and give " + (this.player.gems == 1 ? "it" : "them") + " to the thief. \"<i>That's not much. Fine,</i>\" the thief grumbles and lets you go before he takes your only gem" + (this.player.gems == 1 ? "" : "s") + " and saunters off.");
            this.flags[kFLAGS.THIEF_GEMS] += this.player.gems;
            this.player.gems = 0;
        }
        else {
            this.outputText(" and take out five gems before handing them to the thief. The thief says, \"<i>Thanks, now scram!</i>\" before letting go of you and saunters off.");
            this.flags[kFLAGS.THIEF_GEMS] += 5;
            this.player.gems -= 5;
        }
        this.statScreenRefresh();
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public winAgainstThief(): void {
        this.clearOutput();
        this.outputText("The thief collapses from his " + (this.monster.lust >= this.monster.maxLust() ? "overwhelming desires" : "injuries") + ". You smile in satisfaction as you rummage through his gem pouch");
        if (this.flags[kFLAGS.THIEF_GEMS] > 0) this.outputText(", happily retrieving the gems the thief has taken from you");
        this.outputText(".");
        this.monster.gems += this.flags[kFLAGS.THIEF_GEMS];
        this.flags[kFLAGS.THIEF_GEMS] = 0;
        this.menu();
        if (this.player.lust >= 33 && this.flags[kFLAGS.SFW_MODE] <= 0) {
            this.outputText("\n\nYou could punish the thief if you want to. If so, which parts would you use?");
            if (this.player.hasCock()) {
                if (this.player.cockThatFits(this.monster.analCapacity()) >= 0) this.addButton(0, "Anal Fuck", this.rapeThiefAnally).hint("The thief definitely needs to learn a lesson not to mess with you. Buttfuck the thief.");
                else this.outputText(" <b>Your cock is too big to fit!</b>");
            }
            if (this.player.hasVagina()) this.addButton(1, "Get Licked", this.getLicked).hint("Punish the thief by having him lick your [vagina].");
            this.addButton(4, "Leave", this.combat.cleanupAfterCombat);
            return;
        }
        this.combat.cleanupAfterCombat();
    }

    private rapeThiefAnally(): void {
        const x: number = this.player.cockThatFits(this.monster.analCapacity());
        this.clearOutput();
        this.outputText("You drag the unconscious thief into one of the alleys and remove his leather pants so he's naked from the waist down. The thief wakes up, realizing what you're doing and says with a whimper, \"<i>Please don't put that in there. I've never had anything in there.</i>\"");
        this.outputText("\n\nYou " + (this.player.armor != ArmorLib.NOTHING || this.player.lowerGarment != UndergarmentLib.NOTHING ? "remove your " + this.player.armorName + ", " : "") + "get the thief into position and you slowly slide your " + this.player.cockDescript(x) + " into his rear hole. Despite the thief's protestations, he seems to find pleasure.");
        this.outputText("\n\n\"<i>Yes, fuck me! Please fuck me!</i>\" The thief yells. That's the only encouragement you need as you thrust back and forth, abusing his ass. You grab his shoulders to get more leverage and you continue to pound with reckless abandon.");
        this.outputText("\n\nEventually, you can hold back no more and you unload your seed into his depths. The thief achieves orgasm as well, cumming all over the ground before falling on ground, dazed. You slide your " + this.player.cockDescript(x) + " out with a pop" + this.player.clothedOrNaked(", redress yourself") + " and leave the ravaged thief to recover.");
        this.player.orgasm('Dick');
        this.combat.cleanupAfterCombat();
    }

    private getLicked(): void {
        this.clearOutput();
        this.outputText("You drag the unconscious thief into one of the alleys. The thief wakes up and realize what you're going to do. You " + (this.player.armor != ArmorLib.NOTHING || this.player.lowerGarment != UndergarmentLib.NOTHING ? "remove the bottom half of your " + this.player.armorName + "" : "") + " to reveal your " + this.player.vaginaDescript() + (this.player.hasCock() ? " and " + this.player.cockDescript() : "") + ".");
        this.outputText("\n\n\"<i>Now lick. I want it licked good!</i>\" you tell the thief. The thief lets out a sigh as he licks your [pussy]. You let out a moan in pleasure while he's tongue-fucking your [pussy].");
        this.outputText("\n\nEventually, you can hold back no more and your [pussy] spasms, launching femcum");
        if (this.player.hasCock()) this.outputText(" while your [cock] fires ropes of jism");
        this.outputText(" all over his face. Still disoriented, the thief collapses back on the ground. You " + this.player.clothedOrNaked("redress yourself") + " and make a hasty exit while the thief is recovering from his ordeal.");
        this.player.orgasm('Vaginal');
        this.combat.cleanupAfterCombat();
    }

}
