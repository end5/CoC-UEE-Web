import { Consumable } from "../Consumable";
import { ConsumableLib } from "../ConsumableLib";
import { Neck } from "../../BodyParts/Neck";
import { rand } from "../../Extra";
import { Wings } from "../../BodyParts/Wings";
import { RearBody } from "../../BodyParts/RearBody";
import { WeightedChoice } from "../../internals/WeightedChoice";
import { Hair } from "../../BodyParts/Hair";
import { ColorLists } from "../../lists/ColorLists";
import { Skin } from "../../BodyParts/Skin";
import { Arms } from "../../BodyParts/Arms";
import { Claws } from "../../BodyParts/Claws";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Vagina } from "../../Vagina";
import { StatusEffects } from "../../StatusEffects";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * Goo transformative item.
 */
export class WetCloth extends Consumable {
    public constructor() {
        super("WetClth", "WetClth", "a wet cloth dripping with slippery slime", ConsumableLib.DEFAULT_VALUE, "Dripping with a viscous slime, you've no doubt rubbing this cloth on your body would have some kind of strange effect.");
    }

    public useItem(): boolean {
        this.clearOutput();
        const tfSource: string = "gooGasmic";
        this.outputText("You take the wet cloth in hand and rub it over your body, smearing the strange slime over your " + this.player.skin.desc + " slowly.");
        // Stat changes
        // libido up to 80
        if (this.player.lib100 < 80) {
            this.dynStats("lib", (.5 + (90 - this.player.lib) / 10), "lus", this.player.lib / 2);
            this.outputText("\n\nBlushing and feeling horny, you make sure to rub it over your chest and erect nipples, letting the strange slimy fluid soak into you.");
        }
        // sensitivity moves towards 50
        if (this.player.sens100 < 50) {
            this.outputText("\n\nThe slippery slime soaks into your " + this.player.skin.desc + ", making it tingle with warmth, sensitive to every touch.");
            this.dynStats("sen", 1);
        }
        else if (this.player.sens100 > 50) {
            this.outputText("\n\nThe slippery slime numbs your " + this.player.skin.desc + " slightly, leaving behind only gentle warmth.");
            this.dynStats("sen", -1);
        }

        // Cosmetic changes based on 'goopyness'
        // Neck restore
        if (this.player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && rand(4) == 0) this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && rand(5) == 0) this.mutations.restoreRearBody(tfSource);
        // Ovi perk loss
        if (rand(5) === 0) {
            this.mutations.updateOvipositionPerk(tfSource);
        }
        // Remove wings and shark fin
        if (this.player.wings.type != Wings.NONE || this.player.rearBody.type == RearBody.SHARK_FIN) {
            if (this.player.rearBody.type == RearBody.SHARK_FIN) {
                this.outputText("\n\nYou sigh, feeling a hot wet tingling down your back.  It tickles slightly as you feel your fin slowly turn to"
                    + " sludge, dripping to the ground as your body becomes more goo-like.");
                this.player.rearBody.restore();
            } else {
                this.outputText("\n\nYou sigh, feeling a hot wet tingling down your back.  It tickles slightly as you feel your wings slowly turn to"
                    + " sludge, dripping to the ground as your body becomes more goo-like.");
            }
            this.player.wings.restore();
            return false;
        }
        const colorChoice = new WeightedChoice<string>()
            .add("green", 30)  // = ColorLists.GOO_MORPH[0]
            .add("purple", 20)  // = ColorLists.GOO_MORPH[1]
            .add("blue", 20)  // = ColorLists.GOO_MORPH[2]
            .add("cerulean", 20)  // = ColorLists.GOO_MORPH[3]
            .add("emerald", 10); // = ColorLists.GOO_MORPH[4]
        // Goopy hair
        if (this.player.hair.type !== Hair.GOO) {
            this.player.hair.type = Hair.GOO;
            // if bald
            if (this.player.hair.length <= 0) {
                this.outputText("\n\nYour head buzzes pleasantly, feeling suddenly hot and wet.  You instinctively reach up to feel the source of your wetness, and discover you've grown some kind of gooey hair.  From time to time it drips, running down your back to the crack of your " + this.player.buttDescript() + ".");
                this.player.hair.length = 5;
            }
            else {
                // if hair isnt rubbery or latexy
                if (this.player.hair.color.indexOf("rubbery") === -1 && this.player.hair.color.indexOf("latex-textured") === -1) {
                    this.outputText("\n\nYour head buzzes pleasantly, feeling suddenly hot and wet.  You instinctively reach up to feel the source of your wetness, and discover your hair has become a slippery, gooey mess.  From time to time it drips, running down your back to the crack of your " + this.player.buttDescript() + ".");
                }
                // Latexy stuff
                else {
                    this.outputText("\n\nYour oddly inorganic hair shifts, becoming partly molten as rivulets of liquid material roll down your back.  How strange.");
                }
            }
            if (ColorLists.GOO_MORPH.indexOf(this.player.hair.color) === -1) {
                this.outputText("  Stranger still, the hue of your semi-liquid hair changes to ");
                this.player.hair.color = colorChoice.choose()!;
                this.outputText(this.player.hair.color + ".");
            }
            this.dynStats("lus", 10);
            return false;
        }
        // 1.Goopy skin
        if (this.player.hair.type === Hair.GOO && (this.player.skin.type !== Skin.GOO || this.player.skin.desc !== "skin" || this.player.skin.adj !== "slimy")) {
            if (this.player.hasPlainSkin()) this.outputText("\n\nYou sigh, feeling your " + this.player.armorName + " sink into you as your skin becomes less solid, gooey even.  You realize your entire body has become semi-solid and partly liquid!");
            else if (this.player.hasFur()) this.outputText("\n\nYou sigh, suddenly feeling your fur become hot and wet.  You look down as your " + this.player.armorName + " sinks partway into you.  With a start you realize your fur has melted away, melding into the slime-like coating that now serves as your skin.  You've become partly liquid and incredibly gooey!");
            else if (this.player.hasScales()) this.outputText("\n\nYou sigh, feeling slippery wetness over your scales.  You reach to scratch it and come away with a slippery wet coating.  Your scales have transformed into a slimy goop!  Looking closer, you realize your entire body has become far more liquid in nature, and is semi-solid.  Your " + this.player.armorName + " has even sunk partway into you.");
            this.player.skin.type = Skin.GOO;
            this.player.skin.desc = "skin";
            this.player.skin.adj = "slimy";
            this.player.underBody.restore();
            if (ColorLists.GOO_MORPH.indexOf(this.player.skin.tone) === -1) {
                this.outputText("  Stranger still, your skintone changes to ");
                this.player.skin.tone = colorChoice.choose()!;
                this.outputText(this.player.skin.tone + "!");
                if (this.player.arms.type !== Arms.HUMAN || this.player.arms.claws.type !== Claws.NORMAL) {
                    this.mutations.restoreArms(tfSource);
                }
            }
            return false;
        }
        //// 1a.Make alterations to dick/vaginal/nippular descriptors to match
        // DONE EXCEPT FOR TITS & MULTIDICKS (UNFINISHED KINDA)
        // 2.Goo legs
        if (this.player.skin.type === Skin.GOO && this.player.skin.adj === "slimy" && this.player.skin.desc === "skin" && this.player.lowerBody.type !== LowerBody.GOO) {
            this.outputText("\n\nYour viewpoint rapidly drops as everything below your " + this.player.buttDescript() + " and groin melts together into an amorphous blob.  Thankfully, you discover you can still roll about on your new slimey undercarriage, but it's still a whole new level of strange.");
            this.player.tallness -= 3 + rand(2);
            if (this.player.tallness < 36) {
                this.player.tallness = 36;
                this.outputText("  The goo firms up and you return to your previous height.  It would truly be hard to get any shorter than you already are!");
            }
            this.player.lowerBody.type = LowerBody.GOO;
            this.player.lowerBody.legCount = 1;
            return false;
        }
        // 3a. Grow vagina if none
        if (!this.player.hasVagina()) {
            this.outputText("\n\nA wet warmth spreads through your slimey groin as a narrow gash appears on the surface of your groin.  <b>You have grown a vagina.</b>");
            this.player.createVagina();
            this.player.vaginas[0].vaginalWetness = Vagina.WETNESS_DROOLING;
            this.player.vaginas[0].vaginalLooseness = Vagina.LOOSENESS_GAPING;
            this.player.setClitLength(.4);
            return false;
        }
        // 3b.Infinite Vagina
        if (this.player.vaginalCapacity() < 9000) {
            if (!this.player.hasStatusEffect(StatusEffects.BonusVCapacity)) this.player.createStatusEffect(StatusEffects.BonusVCapacity, 9000, 0, 0, 0);
            else this.player.addStatusValue(StatusEffects.BonusVCapacity, 1, 9000);
            this.outputText("\n\nYour " + this.player.vaginaDescript(0) + "'s internal walls feel a tingly wave of strange tightness.  Experimentally, you slip a few fingers, then your hand, then most of your forearm inside yourself.  <b>It seems you're now able to accommodate just about ANYTHING inside your sex.</b>");
            return false;
        }
        else if (this.player.tallness < 100 && rand(3) <= 1) {
            this.outputText("\n\nYour gel-like body swells up from the intake of additional slime.  If you had to guess, you'd bet you were about two inches taller.");
            this.player.tallness += 2;
            this.dynStats("str", 1, "tou", 1);
        }
        // Big slime girl
        else {
            if (!this.player.hasStatusEffect(StatusEffects.SlimeCraving)) {
                this.outputText("\n\nYou feel a growing gnawing in your gut.  You feel... hungry, but not for food.  No, you need something wet and goopy pumped into you.  You NEED it.  You can feel it in your bones.  <b>If you don't feed that need... you'll get weaker and maybe die.</b>");
                this.player.createStatusEffect(StatusEffects.SlimeCraving, 0, 0, 0, 1); // Value four indicates this tracks strength and speed separately
            }
            else {
                this.outputText("\n\nYou feel full for a moment, but you know it's just a temporary respite from your constant need to be 'injected' with fluid.");
                this.player.changeStatusValue(StatusEffects.SlimeCraving, 1, 0);
            }
        }
        if (rand(2) === 0) this.outputText(this.player.modFem(85, 3));
        if (rand(2) === 0) this.outputText(this.player.modThickness(20, 3));
        if (rand(2) === 0) this.outputText(this.player.modTone(15, 5));
        this.game.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
        return false;
    }
}
