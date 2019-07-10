import { TelAdreAbstractContent } from "./TelAdreAbstractContent";
import { SpriteDb } from "../../../display/SpriteDb";
import { StatusEffects } from "../../../StatusEffects";
import { PerkLib } from "../../../PerkLib";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";

export class YaraPiercingStudio extends TelAdreAbstractContent {
    // TODO move to own classes?

    /**
     * 3 variables that define bonuses for piercing.
     */
    public static LOC_CLIT: number = 0;
    public static LOC_DICK: number = 1;
    public static LOC_EARS: number = 2;
    public static LOC_EYEBROW: number = 3;
    public static LOC_LIP: number = 4;
    public static LOC_NIPPLES: number = 5;
    public static LOC_NOSE: number = 6;
    public static LOC_TONGUE: number = 7;
    public static LOC_VULVA: number = 8;

    // {region PiercingVariables

    // 0) **Clit (+2 sens)
    // 1) **Dick (+2 lib) adds the word 'pierced' sometimes to the description
    // 2) **Ears
    // 3) **Eyebrow (-.5 def)
    // 4) **Lip (-.5 def)
    // 5) **Nipples (+1 sens, +1 lib)
    // 6) **Nose (+.5 attack)
    // 7) **Tongue (+1 sens)
    public static MAT_AMETHYST: number = 1;
    public static MAT_DIAMOND: number = 2;
    public static MAT_GOLD: number = 3;
    public static MAT_EMERALD: number = 4;
    public static MAT_JADE: number = 5;
    public static MAT_ONYX: number = 6;
    public static MAT_RUBY: number = 7;
    public static MAT_STEEL: number = 8;
    public static MAT_LETHITE: number = 9;
    public static MAT_FERRITE: number = 10;
    public static MAT_FURRITE: number = 11;
    public static MAT_CRIMSTONE: number = 12;
    public static MAT_ICESTONE: number = 13;
    public static TYPE_NONE: number = 0;
    // 1. Amethyst (+1 int, +1 lib)
    // 2. Diamond (+2 int, -1 cor)
    // 3. Gold (+1 int, +1 sens)
    // 4. Emerald (+1 spe)
    // 5. Jade (+1 spe, -.5 tou)
    // 6. Onyx (+1 tou, -1 spe)
    // 7. Ruby (+1 lib, +1 sens)
    // 8. Steel (+2 str, -2 int)
    // 9. Lethite (Demon Lure)
    // 10. Fertite (Fertility Booster)
    // 11. Furrite (Attracts Furries)
    // 12. Crimstone - + min lust
    // 13. Icestone (-Min Lust)
    public static TYPE_STUD: number = 1;
    public static TYPE_RING: number = 2;
    public static TYPE_LADDER: number = 3;
    public static TYPE_HOOP: number = 4;
    public static TYPE_CHAIN: number = 5;

    // }endregion

    // 1. Stud
    // 2. Ring (Called prince albert on dick)
    // 3. Jacobs Ladder (dick only)
    // 4. Hoop (ears/nipples/clit)
    // 5. Chain (nipples only)
    // 8) **Vulva (+1 sens)

    public piercingStudio(): void {
        this.spriteSelect(SpriteDb.s_yara);
        this.clearOutput();
        this.outputText("The interior of the piercing studio is earthy, leaving the stone floors and walls uncovered, though the windows are covered with woven blankets, sewn from multicolored threads.  There are a number of cushy chairs facing a wall of mirrors, along with a shelf covered in needles, piercings, and strong alcohols.  A brunette prowls about the place, tidying it up during a lull in business.  You dully notice that unlike everyone else in this town, she's mostly human.  Perhaps she came through a portal as well?  She approaches you, and you see a cat tail waving behind her, and a pair of fuzzy feline ears, both covered in piercings, perched atop her head.  Clearly she's been here long enough to pick up some of the local flavor.\n\n");
        this.outputText("She introduces herself, \"<i>Hello there " + this.player.mf("sir", "cutie") + ", my name is Yara.  Would you like to get a piercing?</i>\"");
        this.menu();
        this.addButton(0, "Pierce", this.pierceMenu);
        this.addButton(1, "Remove", this.piercingRemove);
        if (!this.player.hasStatusEffect(StatusEffects.Yara)) {
            this.addButton(2, "About Her", this.aboutYara);
        }
        this.addButton(14, "Leave", this.telAdre.telAdreMenu);
    }

    private aboutYara(): void {
        this.spriteSelect(63);
        this.player.createStatusEffect(StatusEffects.Yara, 0, 0, 0, 0);
        this.clearOutput();
        this.outputText("You introduce yourself and ask Yara about her past, noting that ");
        if (this.player.humanScore() <= 2) {
            this.outputText("you were once a human too.");
        } else {
            this.outputText("you haven't seen many other humans about.");
        }
        this.outputText("\n\nShe blushes a little when she answers, her tail curling about her protectively, \"<i>My home city was built around a portal, and the Baron that ruled it insisted that we send a sacrifice through every year.  We were raised believing that if we didn't sacrifice SOMEONE, the gods would become angry and bring our city to ruin.  Of course the whole thing was a sham, but the families of those sacrificed get compensation.  My father tried to whore me out first, but when that didn't work, the bastard had me drugged and sacrificed.  I woke up next to a lake, ate some weird fruit when I got hungry, and I... well, I changed.  Thankfully I found my way here before I ran into any demons, or who knows what would have happened to me!  Tel'Adre has been good to me, and I'm sure it'll be good to you.  Now, how about getting a piercing?</i>\"");
        this.dynStats("int", 2, "lus", -5, "cor", -1);
        this.doNext(this.piercingStudio);
    }

    private buildLocChoices(fun: any, inverse: boolean = false): boolean {
        let buttonsAdded: boolean = false;
        function check(toCheck: number): boolean {
            if (inverse) {
                return toCheck !== 0;
            }

            return toCheck === 0;
        }
        if (this.player.hasVagina()) {
            if (check(this.player.vaginas[0].clitPierced)) {
                this.addButton(0, "Clit", fun, YaraPiercingStudio.LOC_CLIT);
                buttonsAdded = true;
            }
        }
        if (this.player.totalCocks() > 0) {
            if (check(this.player.cocks[0].pierced)) {
                this.addButton(1, "Dick", fun, YaraPiercingStudio.LOC_DICK);
                buttonsAdded = true;
            }
        }
        if (check(this.player.earsPierced)) {
            this.addButton(2, "Ears", fun, YaraPiercingStudio.LOC_EARS);
            buttonsAdded = true;
        }
        if (check(this.player.eyebrowPierced)) {
            this.addButton(3, "Eyebrow", fun, YaraPiercingStudio.LOC_EYEBROW);
            buttonsAdded = true;
        }
        if (check(this.player.lipPierced)) {
            this.addButton(4, "Lip", fun, YaraPiercingStudio.LOC_LIP);
            buttonsAdded = true;
        }
        if (check(this.player.nipplesPierced)) {
            this.addButton(5, "Nipples", fun, YaraPiercingStudio.LOC_NIPPLES);
            buttonsAdded = true;
        }
        if (check(this.player.nosePierced)) {
            this.addButton(6, "Nose", fun, YaraPiercingStudio.LOC_NOSE);
            buttonsAdded = true;
        }
        if (check(this.player.tonguePierced)) {
            this.addButton(7, "Tongue", fun, YaraPiercingStudio.LOC_TONGUE);
            buttonsAdded = true;
        }
        if (this.player.hasVagina()) {
            if (check(this.player.vaginas[0].labiaPierced)) {
                this.addButton(8, "Labia", fun, YaraPiercingStudio.LOC_VULVA);
                buttonsAdded = true;
            }
        }
        this.addButton(14, "Back", this.piercingStudio);
        return buttonsAdded;
    }

    private pierceMenu(): void {
        this.menu();
        this.spriteSelect(63);
        this.hideUpDown();
        this.clearOutput();
        this.outputText("Yara asks, \"<i>Ok then, what would you like pierced " + this.player.mf("sir", "cutie") + "?  Just keep in mind my piercings are special - they're permanent and CAN'T be removed.</i>\"");
        if (!this.buildLocChoices(this.chooseLoc)) {
            this.outputText("\n\nYou give yourself a quick once-over and realize there's nowhere left for her to pierce you.  Oh well.");
            this.doNext(this.piercingStudio);
        }
    }

    private chooseLoc(loc: number): void {
        this.doNext(this.pierceMenu);
        if (loc === YaraPiercingStudio.LOC_DICK && !this.player.hasCock()) {
            this.outputText("You realize you don't have a dick to pierce.  Whoops!  Better pick something else...");
            return;
        }
        if ((loc === YaraPiercingStudio.LOC_CLIT || loc === YaraPiercingStudio.LOC_VULVA) && !this.player.hasVagina()) {
            this.outputText((loc === YaraPiercingStudio.LOC_CLIT ? "You realize you don't have a clit to pierce." : "You realize you don't have a pussy to pierce.")
                + "  Whoops!  Better pick something else...");
            return;
        }
        switch (loc) {
            case YaraPiercingStudio.LOC_CLIT:
                this.outputText("\"<i>Ohhh, that's going to be suckably cute!</i>\" exclaims Yara, blushing more than a little. \"<i>What kind of piercing would you like?</i>");
                break;
            case YaraPiercingStudio.LOC_DICK:
                this.outputText("\"<i>Ok, this is gonna hurt a LOT, but I've heard good things about it.  What kind of piercing do you want done?</i>\" Yara asks.");
                break;
            case YaraPiercingStudio.LOC_EARS:
                this.outputText("\"<i>Okay, just let me get my supplies and we can get started.  What kind of jewelry do you want in them?</i>\" asks Yara.");
                break;
            case YaraPiercingStudio.LOC_EYEBROW:
                this.outputText("\"<i>Ah, that's a good look!  What do you want there?</i>\" asks Yara.");
                break;
            case YaraPiercingStudio.LOC_LIP:
                this.outputText("\"<i>Oh my, that'll be HAWT!  What kind of jewelry do you want there?</i>\" asks Yara.");
                break;
            case YaraPiercingStudio.LOC_NIPPLES:
                this.outputText("\"<i>Yeah, sure I can do those!  What kind of jewelry do you want there?  I'm partial to nipple-chains myself,</i>\" admits Yara, blushing bright red.");
                break;
            case YaraPiercingStudio.LOC_NOSE:
                this.outputText("Yara wrinkles her nose in distaste, \"<i>Really?  Well ok, what do you want there?</i>\"");
                break;
            case YaraPiercingStudio.LOC_TONGUE:
                this.outputText("Yara happily purrs, \"<i>Oh my, I bet that'll be fun!  I'm afraid I can only put a stud there though, ok?</i>\"");
                break;
            case YaraPiercingStudio.LOC_VULVA:
                this.outputText("Yara explains, \"<i>This is gonna hurt a lot, but I think you'll love how it feels after.  I know I do!  Now what kind of jewelry do you want down-town?</i>\"");
                break;
            default:
            // This really shouldn't happen. Move along.
        }
        this.menu();
        this.addButton(0, "Stud", this.chooseMaterials, loc, YaraPiercingStudio.TYPE_STUD);
        if (loc !== YaraPiercingStudio.LOC_TONGUE) {
            this.addButton(1, "Ring", this.chooseMaterials, loc, YaraPiercingStudio.TYPE_RING);
        }

        if (loc === YaraPiercingStudio.LOC_DICK) {
            this.addButton(2, "Ladder", this.chooseMaterials, loc, YaraPiercingStudio.TYPE_LADDER);
        }

        if (loc === YaraPiercingStudio.LOC_EARS) {
            this.addButton(3, "Hoop", this.chooseMaterials, loc, YaraPiercingStudio.TYPE_HOOP);
        }

        if (loc === YaraPiercingStudio.LOC_NIPPLES) {
            this.addButton(4, "Chain", this.chooseMaterials, loc, YaraPiercingStudio.TYPE_CHAIN);
        }
    }

    private chooseMaterials(loc: number, type: number): void {
        this.menu();
        this.spriteSelect(63);
        this.clearOutput();
        this.outputText("Yara gathers up her materials and says, \"<i>Ok, now what type of material do you want it made from?  Don't worry about price, none of these are that rare, so the piercing will only be 100 gems.  Though I do have some rarer materials; you'll need 1,000 gems to spend if you want to check them out.</i>\"");
        if (this.player.gems < 100) {
            this.outputText("\n\nYou realize you don't have enough gems to get a piercing.");
            this.doNext(this.piercingStudio);
            return;
        }
        this.menu();
        this.addButton(0, "Amethyst", this.areYouSure, loc, type, YaraPiercingStudio.MAT_AMETHYST);
        this.addButton(1, "Diamond", this.areYouSure, loc, type, YaraPiercingStudio.MAT_DIAMOND);
        this.addButton(2, "Gold", this.areYouSure, loc, type, YaraPiercingStudio.MAT_GOLD);
        this.addButton(3, "Emerald", this.areYouSure, loc, type, YaraPiercingStudio.MAT_EMERALD);
        this.addButton(4, "Jade", this.areYouSure, loc, type, YaraPiercingStudio.MAT_JADE);
        this.addButton(5, "Onyx", this.areYouSure, loc, type, YaraPiercingStudio.MAT_ONYX);
        this.addButton(6, "Ruby", this.areYouSure, loc, type, YaraPiercingStudio.MAT_RUBY);
        this.addButton(7, "Steel", this.areYouSure, loc, type, YaraPiercingStudio.MAT_STEEL);
        if (this.player.gems >= 1000) {
            this.addButton(8, "Rare Menu", this.chooseAdvancedMaterials, loc, type);
        } else {
            this.addDisabledButton(8, "Rare Menu", "You can't afford this!");
        }
        this.addButton(14, "Back", this.piercingStudio);
    }

    private areYouSure(loc: number, type: number, mat: number): void {
        this.spriteSelect(63);
        this.clearOutput();
        this.outputText("Yara says, \"<i>Ok, last chance to back out, are you sure you want to go ahead with this?  Remember, once I put it in, it's permanent.</i>\"");
        this.doYesNo(YaraPiercingStudio.curry(this.normalPierceAssemble, loc, type, mat), this.piercingStudio);
    }

    private chooseAdvancedMaterials(loc: number, type: number): void {
        this.menu();
        this.spriteSelect(63);
        this.clearOutput();
        this.outputText("Yara goes back into the back and comes out with a gilded tray full of exotic materials.  She hands you a brochure and asks, \"<i>Ok, now what am I going to be working with?</i>\"");
        this.outputText("\n\nThere's a number of materials listed here:");
        this.outputText("\n1. Lethite - Fake lethicite.  While beautiful, it's known to attract demons.");
        this.outputText("\n2. Fertite - A green gem sometimes fished up from the bottom of Mareth's great lake, it is said to enhance the fertility of both genders.");
        this.outputText("\n3. Furrite - This beautiful purple gem is actually crystalized from materials used in hunting lures.  It is said to enhance the wearer's appeal to beast-people.");
        this.outputText("\n4. Crimstone - Crimstone is said to be formed from volcanic fires, and to keep the fires of one's desires burning brightly.");
        this.outputText("\n5. Icestone - Found from the Glacial Rift, this rare gem is said to counter the effects of Crimstone and quell ever-burning desires. This will annihilate some of crimstone magic. Due to its rarity, this costs 2000 gems instead.");
        this.outputText("\n\n<b>DISCLAIMER</b>: Yara's Piercing Studio is not responsible if the piercee's body absorbs any residual magic of these stones, and is not required to resolve any issues if the effects persist beyond removal.</b>");
        this.addButton(0, "Lethite", this.areYouSure, loc, type, YaraPiercingStudio.MAT_LETHITE);
        this.addButton(1, "Fertite", this.areYouSure, loc, type, YaraPiercingStudio.MAT_FERRITE);
        this.addButton(2, "Furrite", this.areYouSure, loc, type, YaraPiercingStudio.MAT_FURRITE);
        this.addButton(3, "Crimstone", this.areYouSure, loc, type, YaraPiercingStudio.MAT_CRIMSTONE);
        if (this.player.gems >= 2000) {
            this.addButton(4, "Icestone", this.areYouSure, loc, type, YaraPiercingStudio.MAT_ICESTONE);
        }
        // Unsure if this common mats button will work
        // addButton(8, "Common Mats", chooseMaterials,loc,type);
        this.addButton(14, "Back", this.piercingStudio);
    }

    private normalPierceAssemble(loc: number, type: number, mat: number): void {
        this.spriteSelect(63);
        this.clearOutput();
        this.outputText("Yara makes you comfortable and has you look away while she uses her piercing tools.  It hurts, but she's skilled and before you know it, your piercing is done!");
        let shortP: string = "";
        let longP: string = "";
        this.player.gems -= 100;
        if (mat > 8) {
            this.player.gems -= 900;
        }
        if (mat === 13) {
            this.player.gems -= 1000;
        }
        this.statScreenRefresh();
        // set up material description
        switch (mat) {
            case YaraPiercingStudio.MAT_AMETHYST:
                shortP += "amethyst ";
                this.dynStats("int", 1, "lib", 1);
                longP += "Amethyst ";
                break;
            case YaraPiercingStudio.MAT_DIAMOND:
                shortP += "diamond ";
                this.dynStats("int", 2, "cor", -1);
                longP += "Diamond ";
                break;
            case YaraPiercingStudio.MAT_GOLD:
                shortP += "gold ";
                this.dynStats("int", 1, "sen", 1);
                longP += "Gold ";
                break;
            case YaraPiercingStudio.MAT_EMERALD:
                shortP += "emerald ";
                this.dynStats("spe", 1);
                longP += "Emerald ";
                break;
            case YaraPiercingStudio.MAT_JADE:
                shortP += "jade ";
                this.dynStats("tou", -.5, "int", 1, "cor", -1);
                longP += "Jade ";
                break;
            case YaraPiercingStudio.MAT_ONYX:
                shortP += "onyx ";
                this.dynStats("tou", 1, "spe", -1);
                longP += "Onyx ";
                break;
            case YaraPiercingStudio.MAT_RUBY:
                shortP += "ruby ";
                this.dynStats("lib", 1, "sen", 1);
                longP += "Ruby ";
                break;
            case YaraPiercingStudio.MAT_STEEL:
                shortP += "steel ";
                this.dynStats("str", 2, "int", -2);
                longP += "Steel ";
                break;
            case YaraPiercingStudio.MAT_LETHITE:
                shortP += "lethite ";
                if (this.player.findPerk(PerkLib.PiercedLethite) < 0) {
                    this.player.createPerk(PerkLib.PiercedLethite, 0, 0, 0, 0);
                }
                longP += "Lethite ";
                break;
            case YaraPiercingStudio.MAT_FERRITE:
                shortP += "fertite ";
                if (this.player.findPerk(PerkLib.PiercedFertite) < 0) {
                    this.player.createPerk(PerkLib.PiercedFertite, 5, 0, 0, 0);
                } else {
                    this.player.addPerkValue(PerkLib.PiercedFertite, 1, 5);
                }
                longP += "Fertite ";
                break;
            case YaraPiercingStudio.MAT_FURRITE:
                shortP += "furrite ";
                if (this.player.findPerk(PerkLib.PiercedFurrite) < 0) {
                    this.player.createPerk(PerkLib.PiercedFurrite, 0, 0, 0, 0);
                }
                longP += "Furrite ";
                break;
            case YaraPiercingStudio.MAT_CRIMSTONE:
                shortP += "crimstone ";
                if (this.player.findPerk(PerkLib.PiercedIcestone) >= 0) {
                    this.player.addPerkValue(PerkLib.PiercedIcestone, 1, -5);
                    if (this.player.perkv1(PerkLib.PiercedIcestone) <= 0) {
                        this.player.removePerk(PerkLib.PiercedIcestone);
                    }
                }
                else {
                    if (this.player.findPerk(PerkLib.PiercedCrimstone) <= 0) {
                        this.player.createPerk(PerkLib.PiercedCrimstone, 5, 0, 0, 0);
                    } else {
                        this.player.addPerkValue(PerkLib.PiercedCrimstone, 1, 5);
                    }
                }
                longP += "Crimstone ";
                break;
            case YaraPiercingStudio.MAT_ICESTONE:
                shortP += "icestone ";
                if (this.player.findPerk(PerkLib.PiercedCrimstone) >= 0) {
                    this.player.addPerkValue(PerkLib.PiercedCrimstone, 1, -5);
                    if (this.player.perkv1(PerkLib.PiercedCrimstone) <= 0) {
                        this.player.removePerk(PerkLib.PiercedCrimstone);
                    }
                }
                else {
                    if (this.player.findPerk(PerkLib.PiercedIcestone) <= 0) {
                        this.player.createPerk(PerkLib.PiercedIcestone, 5, 0, 0, 0);
                    } else {
                        this.player.addPerkValue(PerkLib.PiercedIcestone, 1, 5);
                    }
                }
                longP += "Icestone ";
                break;
            default:
            // This really shouldn't happen.
        }
        switch (loc) {
            case YaraPiercingStudio.LOC_CLIT:
                shortP += "clit-";
                longP += "clit-";
                this.dynStats("sen", 2);
                break;
            case YaraPiercingStudio.LOC_DICK:
                if (type === 3) {
                    break;
                }
                shortP += "cock-";
                longP += "cock-";
                this.dynStats("lib", 2);
                break;
            case YaraPiercingStudio.LOC_EARS:
                shortP += "ear";
                longP += "ear";
                break;
            case YaraPiercingStudio.LOC_EYEBROW:
                this.dynStats("tou", -.5);
                shortP += "eyebrow-";
                longP += "eyebrow-";
                break;
            case YaraPiercingStudio.LOC_LIP:
                this.dynStats("tou", -.5);
                shortP += "lip-";
                longP += "lip-";
                break;
            case YaraPiercingStudio.LOC_NIPPLES:
                this.dynStats("lib", 1, "sen", 1);
                shortP += "nipple-";
                longP += "nipple-";
                break;
            case YaraPiercingStudio.LOC_NOSE:
                this.dynStats("str", .5);
                shortP += "nose-";
                longP += "nose-";
                break;
            case YaraPiercingStudio.LOC_TONGUE:
                this.dynStats("sen", 1);
                shortP += "tongue-";
                longP += "tongue-";
                break;
            case YaraPiercingStudio.LOC_VULVA:
                this.dynStats("sen", 1);
                shortP += "labia-";
                longP += "labia-";
                break;
            default:
            // This really shouldn't happen. Move along.
        }
        switch (type) {
            // studs
            case YaraPiercingStudio.TYPE_STUD:
                // multiples
                if (loc === 2 || loc === 5 || loc === 8) {
                    shortP += "studs";
                    longP += "studs";
                }
                else {
                    shortP += "stud";
                    longP += "stud";
                }
                break;
            // 2. Ring (Called prince albert on dick)
            case YaraPiercingStudio.TYPE_RING:
                // multiples
                if (loc === 2 || loc === 5 || loc === 8) {
                    shortP += "rings";
                    longP += "rings";
                }
                else {
                    shortP += "ring";
                    longP += "ring";
                }
                break;
            // 3. Jacobs Ladder (dick only)
            case YaraPiercingStudio.TYPE_LADDER:
                shortP += "jacob's ladder";
                longP += "jacob's ladder";
                break;
            // 4. Hoop (ears/nipples/clit)
            case YaraPiercingStudio.TYPE_HOOP:
                // multiples
                if (loc === 2 || loc === 5 || loc === 8) {
                    shortP += "hoops";
                    longP += "hoops";
                }
                else {
                    shortP += "hoop";
                    longP += "hoop";
                }
                break;
            // 5. Chain (nipples only)
            case YaraPiercingStudio.TYPE_CHAIN:
                shortP += "chain";
                longP += "chain";
                break;
            default:
            // This really shouldn't happen. Move along.
        }
        // Actually assign values to their real storage locations
        this.applyPiercing(loc, type, shortP, longP);
        // Girls
        if (loc === 8 || loc === 0) {
            this.yaraSex(true);
            return;
        }
        // Dudes
        else if (loc === 1 && (this.player.cockThatFits(36) >= 0 || this.flags[kFLAGS.HYPER_HAPPY])) {
            this.yaraSex(false);
            return;
        }
        // Piercing shop main menu
        this.doNext(this.piercingStudio);
    }

    private applyPiercing(loc: number, type: number = YaraPiercingStudio.TYPE_NONE, shortP: string = "", longP: string = ""): void {
        switch (loc) {
            case YaraPiercingStudio.LOC_CLIT:
                this.player.vaginas[0].clitPierced = type;
                this.player.vaginas[0].clitPShort = shortP;
                this.player.vaginas[0].clitPLong = longP;
                break;
            case YaraPiercingStudio.LOC_DICK:
                this.player.cocks[0].pierced = type;
                this.player.cocks[0].pShortDesc = shortP;
                this.player.cocks[0].pLongDesc = longP;
                break;
            case YaraPiercingStudio.LOC_EARS:
                this.player.earsPierced = type;
                this.player.earsPShort = shortP;
                this.player.earsPLong = longP;
                break;
            case YaraPiercingStudio.LOC_EYEBROW:
                this.player.eyebrowPierced = type;
                this.player.eyebrowPShort = shortP;
                this.player.eyebrowPLong = longP;
                break;
            case YaraPiercingStudio.LOC_LIP:
                this.player.lipPierced = type;
                this.player.lipPShort = shortP;
                this.player.lipPLong = longP;
                break;
            case YaraPiercingStudio.LOC_NIPPLES:
                this.player.nipplesPierced = type;
                this.player.nipplesPShort = shortP;
                this.player.nipplesPLong = longP;
                break;
            case YaraPiercingStudio.LOC_NOSE:
                this.player.nosePierced = type;
                this.player.nosePShort = shortP;
                this.player.nosePLong = longP;
                break;
            case YaraPiercingStudio.LOC_TONGUE:
                this.player.tonguePierced = type;
                this.player.tonguePShort = shortP;
                this.player.tonguePLong = longP;
                break;
            case YaraPiercingStudio.LOC_VULVA:
                this.player.vaginas[0].labiaPierced = type;
                this.player.vaginas[0].labiaPShort = shortP;
                this.player.vaginas[0].labiaPLong = longP;
                break;
            default:
            // This really shouldn't happen. Move along.
        }
    }

    private piercingRemove(): void {
        this.spriteSelect(63);
        this.hideUpDown();
        const doRemove = (loc: number) => {
            this.clearOutput();
            this.outputText("Yara gives you something to drink and you swiftly black out.  You awake about an hour later, sore and weak, though thankfully not bleeding.");
            this.applyPiercing(loc);
            this.dynStats("tou", -5);
            this.player.gems -= 100;
            this.statScreenRefresh();
            this.doNext(this.piercingStudio);
        };
        if (!this.buildLocChoices(doRemove, true)) {
            this.clearOutput();
            this.outputText("Yara giggles, \"<i>You don't have any piercings, silly!</i>\"");
            this.doNext(this.piercingStudio);
            return;
        }
        this.clearOutput();
        this.outputText("\"<i>Really?</i>\" asks Yara, \"<i>I told you those piercings are permanent!  Well, I suppose they CAN be removed, but you're gonna hurt like hell afterwards.  If you really want me to, I can remove something, but it'll cost you 100 gems for the painkillers and labor.</i>\"");
        if (this.player.gems < 100) {
            this.outputText("\n\n<b>You do not have enough gems.</b>");
            this.doNext(this.piercingStudio);
            return;
        }
        if (this.player.tou <= 5.5) {
            this.clearOutput();
            this.outputText("Yara looks you up and down before refusing you outright, \"<i>You don't look so good [name].  I don't think your body could handle it right now.</i>\"");
            this.doNext(this.piercingStudio);
        }

    }

    private yaraSex(girl: boolean): void {
        this.spriteSelect(63);
        this.clearOutput();
        this.outputText("Yara makes you comfortable and has you look away while she uses her piercing tools.  It hurts, but she's skilled. Before you know it, your piercing is done!  You move to rise, retaining a bit of modesty");
        if (this.flags[kFLAGS.PC_FETISH] > 0) {
            this.outputText(" despite the guilty thrill");
        }
        this.outputText(".  \"<i>Hold it,</i>\" Yara commands softly, pressing her hand against your " + this.player.chestDesc() + " and pushing you back in your chair.  \"<i>Do you think I'll let you get away without some... field testing?</i>\"\n\n");
        this.outputText("She seems intent on getting some loving - would you like to turn her down, or will you let nature run its course?");
        // [not at all] [yeah baby]
        this.menu();
        this.addButton(0, "Turn down", this.piercingStudio);
        this.addButton(1, "Oh yeah!", this.letsDoYaraSex, girl);
    }

    private letsDoYaraSex(girl: boolean = true): void {
        this.spriteSelect(63);
        this.clearOutput();
        let x: number = this.player.cockThatFits(36);
        if (this.flags[kFLAGS.HYPER_HAPPY]) {
            x = this.player.cockThatFits(50000);
        }
        else if ((x == -1) && !girl)  // No cock that fits
        {
            if (this.player.hasVagina()) // But the PC has a vagoo! Swap over to female mode"
            {
                this.outputText("\"<i>Oh dear, cutie. There is no way I could take that huge cock of yours!</i>\" she says, looking rather crestfallen at your enormous member. \"<i>Oh well</i>\", she sighs. \"<i>I guess I'll just have to explore your feminine side instead</i>\"\n");
                girl = true;
            }
            else {
                this.outputText("\"<i>I'm sorry, cutie. There is no way I could take that huge cock of yours!</i>\" she says, looking rather crestfallen at your enormous member. Maybe come back after you've shrunk it down to a reasonable size?");
                return;
            }
        }
        this.outputText("Her eyes widen as you begin to ");
        if (this.player.lust < 50) {
            this.outputText("protest");
        } else {
            this.outputText("speak");
        }
        this.outputText(", neatly silencing you with the lust-filled fires simmering in her eyes.  \"<i>Call it quality testing,</i>\" she purrs.  Her free hand runs up and down your inner thigh, the ticklish teasing nearly making your head spin.  Licking her lips in anticipation, Yara wiggles out of her clothes and clambers onto the chair, kneeling on the armrests.  Due to her awkward posture, you find your gaze drifting to her wide-spread legs.  Nestled there, twinkling with a radiant luster, is a golden ring, looped through her already-throbbing clit.  A blush darkens her cheeks as she notices your stare, but she seems almost empowered by it.\n\n");
        this.outputText("Yara's free hand slides down her belly - past the stud in her navel - down to her box.  Using two fingers, she spreads her lips apart, giving you a great view of both her glistening button-piercing and the fleshy recesses past it.  She bites her bottom lip gently");
        if (!girl && this.player.hasCock()) {
            this.outputText(" as your " + this.player.cockDescript(x) + " rises to attention, her eyes fixed upon the stiffened tool.  You resist the urge to grab her thin-yet-girlish hips and power into her right then and there, curious enough to allow her teasing.");
        } else {
            this.outputText(" as a growing puddle of love stains the cushioned chair.  It takes most of your power to not drag her down and force her face into your box.");
        }
        this.outputText("\n\n");
        this.outputText("She leans forward, planting you with a wet and lingering kiss.  She moves lower, kissing ");
        if (this.player.biggestTitSize() < 1) {
            this.outputText("your chest");
        } else {
            this.outputText("your nipples, one at a time");
        }
        this.outputText(" and smooching your belly.  Even with her racially characteristic flexibility, however, she's not able to get any lower from that angle.  \"<i>Hold this, dear,</i>\" she says somewhat snarkily, pivoting around and resting her ass against your " + this.player.chestDesc() + ".  In this new posture, Yara can easily have her way with your junk, and by the way her wagging tail keeps bopping you in the face you can tell she's excited.\n\n");
        this.outputText("Not content with simple penetration, it seems, the cat girl gets to work.");
        if (this.player.balls > 0) {
            this.outputText("  Her dexterous fingertips brush against your [balls], light and fluttery strokes that send shivers coursing through you.  The near-lack of contact is at least as titillating as the less-subtle Marethians you've come across.");
        }
        this.outputText("  She scoots forward a bit, dragging her soaking cunt down your chest in an effort to reach your crotch.\n\n");

        // male
        if (!girl && this.player.hasCock()) {
            this.outputText("Yara's pursed lips touch down upon your cockhead, her head tilting from side to side as she vexingly and repeatedly kisses your " + this.player.cockDescript(x) + ".  However, she abruptly pauses, glancing sidelong at you expectantly.  When you don't immediately respond, she huffs a sigh - onto your dick - and raises her hips level with your nose.  After momentarily getting lost in the bouncing of her tight-yet-jiggly cheeks, you get the message, leaning forward and giving her puffy sex a long and lingering lick.  You're rewarded with a low-pitched and very satisfied groan.  Though you go in for another taste, the shining ring looped through her joy-buzzer attracts your oral attention like a magnet.  Gently as a newborn kitten, your teeth close down on the clit-embedded trinket.  Yara goes absolutely stiff as you begin to softly tug the piercing around, neatly paralyzed by the sensitivity.  Indistinguishable mewling tumbles from her mouth as she attempts to attune herself to your yanking antics.  Her lithe frame spasms in ecstasy, forcing you to release your grip on her, lest something unfortunate happen to her undercarriage.\n\n");
            this.outputText("As soon as you release her from the mind-numbing grasp, she whips her hips forward - spattering your [armor] with her downpour of girlcum in the process - and leaning back, hastily lining herself up with your " + this.player.cockDescript(x) + ".  Only hesitating for a second to leak a bit of lubricant onto your eager shaft, she plummets downwards, not stopping until her ass slams against your pelvis.\n\n");
            this.outputText("Yara takes total control, her death-grip on the armrests giving her full coital maneuverability.  Despite the easy entry, you can't believe how well her sopping-wet folds squeeze against you.  For a long while the only sounds heard are the slapping of her cheeks and the studded-up cat girl's halting pants of pleasure.  \"<i>I wanna say... your new piercing... works like a charm,</i>\" she mutters between throaty groans.\n\n");
            this.outputText("Before you're even allowed to respond, Yara's pace quickens, her finish line in sight.  More than eager to help spur her on, your hands wrap around her slender waist.  She purrs in appreciation of your assistance.  It's not long before, with a victorious and primal scream, she throws all her weight downwards, splattering the mixture of pre-cum and femspunk and actually stinging you a bit with the force of her descent.\n\n");
            this.outputText("The powerful motion is all the motivation your body needs.  Before either of you can even consider the ramifications of an internal ejaculation, your bodies seize up, caught in the familiar grasp of orgasmic bliss.  ");
            // ([cum quantity time, normal L/M/H/S quantities {IT'S A MARVEL REFERENCE} <no new paragraph>]
            // light and medium
            if (this.player.cumQ() < 500) {
                this.outputText("Yara's entire frame spasms as your load paints her private passage with snowy-white seed.  The cat girl writhes happily, arching her spine so far back your eyes nearly meet.\n\nYara dismounts your dick and hops to the ground in one fluid movement.");
            }// heavy
            else if (this.player.cumQ() <= 1500) {
                this.outputText("Yara's belly visibly plumps with the quantity of cum you pour into her, the extra weight bending her over to rest heavily against your [leg].  She purrs happily, patting her distended gut even while the tremors of her own orgasm run through her.\n\nYara lifts herself off you, pressing a hand against her tummy as she somewhat ungracefully steps off the chair.");
            }// special (super-big)
            else {
                this.outputText("Her low-pitched ecstatic moans swiftly escalate to piercing shrieks as her taut belly quickly balloons to roughly beach ball-sized in moments.    With a huge effort, she manages to haul herself off your semen-pumping staff, falling back against you.  Sighing contentedly, Yara nestles herself into your " + this.player.chestDesc() + ", getting comfortable despite the seed drizzling from her overstuffed nethers.  You just sit there for a few minutes, waiting patiently as your ejaculatory rampage ceases.\n\nYara makes a noble attempt to rise that is ultimately thwarted by her huge fluid-filled belly.  Casting a sidelong sheepish grin at you, she giggles nervously.  \"<i>Mind helping me out here, friend?</i>\" she says after a moment's hesitation.  With your assistance, she rises and stands on wobbling feet.  She tries her best to compose herself with your cum still streaming down her thighs, the flow only intensifying as she impatiently presses against the bloated belly.");
            }
            this.outputText("\n\n\"<i>Works like a charm,</i>\" she concludes as you both redress");
            if (this.player.cumQ() > 1500) {
                this.outputText(", Yara trying her best to fit her clothes over the bump in her midsection");
            }
            this.outputText(".  \"<i>Come back whenever, okay?  I'm sure we can arrange another... appointment!</i>\"");
            // ZA ENDO
        }
        // female
        else {
            this.outputText("A duo of errant forefingers run along the perimeter of your feminine fortress, your signal to prepare for a siege.  Yara reaches down off the side of your seat, pushing on a lever that sends the back of the chair down to about a 30º angle.  She grasps for the armrests of the chair next, promptly lifting her body up and going into what looks like a forward somersault.  Before you can complement the feat, her legs fly up either side of your head.  The only things to have made contact were her nimble feet, gently stroking their way up from your belly, past your chest, off of your shoulders and soaring beyond the back of the chair.  The feline acrobat calls for you to lay your hands open at the sides of the chair, an order you fulfill with due haste.  She wastes no time in seizing your upper arms, causing her body to slide forward off of you.  You return the favor by clasping onto her as well in the same manner, stopping her descent.\n\n");
            this.outputText("Trying to parse out the scene at play here is a fool's errand.  Yara must have done this before as your two sprawled out bodies have stopped in just the right fashion to make both of your fleshy orifices in plain view of one another's faces.  Air escapes your pursed lips as the \"<i>quality testing</i>\" commences on your " + this.player.vaginaDescript() + ", your kitty comrade going in tongue first towards your silken fringes.  ");
            if (this.player.wetness() >= 3) {
                this.outputText("She may as well be licking a melting popsicle with how wet your snatch is.");
            } else {
                this.outputText("Your relatively dry perimeter makes for an easy target.");
            }
            this.outputText("  Not to be outdone, your ambitious tongue moves in as if it has everything to prove, mirroring your partner's efforts. Both of your lapping endeavors are periodically interrupted by moaning or slight gasps, your grasps on one another only growing more tense.\n\n");
            this.outputText("Yara looks up - down in her case - at your " + this.player.clitDescript() + ", your feminine fragrance riling her up as if it were catnip. Your work on her box is interrupted as your pleasure buzzer gets the oral shebang of a lifetime, eliciting a knowing laugh from deep within your teammate's throat.  Yara's lucky you redouble your clamp on her arms rather than sending the poor woman sliding to the ground as your body writhes in satisfaction.  But this is war, and you'll be damned if you're weak enough to go straight for the crown jewel as she has. No, you go to town, redefining what it means to eat out a pussy.  Your laborious toil is rewarded as the kitten's assault on your button eases up.  Her hold begins to waver, however, forcing you to yank your prey towards you.  The movement pierces through her contentment, her armlock strengthening as the air fills with the sound of a duo of muffled moans.\n\n");
            this.outputText("Judging by the contortionist's wobbly embrace, you decide it's the perfect time to go in for the kill.  Yara stands no chance as you pounce for her pierced clit, your tongue lodging itself between the loop and her love-button.  It takes all of her willpower to maintain the offensive on your nub nexus while standing firm in her grasp on your arms.  Your oral tugging and teasing proves to be the victor, however, marked by the femspunk making its way right onto your face.  The cocktail combined with the orgasmic-enhanced last ditch effort by Yara on your nether regions triggers your own satisfying outburst.  The chain reaction ends in both your couplings faltering, sending the feline sliding headfirst for the floor.\n\n");
            this.outputText("Her head stops short, though.  Through your gasping relief, you managed to lock onto her legs.  \"<i>Nice... nice catch,</i>\" is about all Yara manages to share before resuming her purring contentment upside down, limp arms spread across the floor.  After a minute or so, the two of you regain some sort of composure, but the spectacular gymnast from before can only bare to slink around on the ground as she reorients herself.  The most you need to do is fix the back of your chair, lifting it to a more comfortable height.  \"<i>Can you spare one more helping hand here, friend?</i>\" Yara requests, now having at least managed to at least sit up straight.  The two of you exchange a knowing glance as you lift the metal-worker back to her feet.");
        }
        this.player.orgasm();
        this.doNext(this.piercingStudio);
    }
}
