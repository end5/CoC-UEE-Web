import { BaseContent } from "../BaseContent";
import { FnHelpers } from "./API/FnHelpers";
import { Encounters } from "./API/Encounters";
import { PerkLib } from "../PerkLib";
import { kFLAGS } from "../GlobalFlags/kFLAGS";
import { Imp } from "./Monsters/Imp";
import { SpriteDb } from "../display/SpriteDb";
import { Goblin } from "./Monsters/Goblin";
import { Appearance } from "../Appearance";
import { Vagina } from "../Vagina";
import { rand } from "../Extra";
import { kGAMECLASS } from "../GlobalFlags/kGAMECLASS";
import { Encounter } from "./API/Encounter";

/**
 * Created by aimozg on 26.03.2017.
 */

export class CommonEncounters extends BaseContent implements Encounter {

    // This could be moved to ImpScene class
    private _impEncounter: Encounter | undefined = undefined;
    public get impEncounter(): Encounter {
        const fn: FnHelpers = Encounters.fn;
        return this._impEncounter = this._impEncounter || Encounters.build({
            chance: this.impEncounterBaseChance,
            mods: [this.lethiteMod],
            call: Encounters.complex(1, "imps",
                {
                    name: "twoimpsclash",
                    chance: fn.lineByLevel(1, 20, 0.1, 0.01), // x0.1 at level 1, x0.01 at level 20+
                    call: this.twoImpsClashing
                }, {
                    name: "imp",
                    chance: fn.lineByLevel(1, 20, 1.0, 0.5), // x1 at level 1, x0.5 at level 20+
                    call: this.impCombatEncounter
                }, {
                    name: "implord",
                    call: kGAMECLASS.impScene.impLordEncounter,
                    when: fn.ifLevelMin(8),
                    chance: fn.lineByLevel(8, 16, 0.5, 2.0) // x0.5 at level 8, x2 at level 16+
                }, {
                    name: "impwarlord",
                    call: kGAMECLASS.impScene.impWarlordEncounter,
                    when: fn.ifLevelMin(12),
                    chance: fn.lineByLevel(12, 20, 0.5, 3.0) // x0.5 at level 12, x3 at level 20+
                }, {
                    name: "impoverlord",
                    call: kGAMECLASS.impScene.impOverlordEncounter,
                    when: fn.ifLevelMin(16),
                    chance: fn.lineByLevel(16, 20, 0.5, 4.0) // x0.5 at level 16, x4 at level 20+
                }
            )
        });
    }

    private _goblinEncounter: Encounter | undefined = undefined;
    public get goblinEncounter(): Encounter {
        const fn: FnHelpers = Encounters.fn;
        return this._goblinEncounter = this._goblinEncounter || Encounters.build({
            chance: 0.5,
            call: Encounters.complex(1, "goblins", {
                name: "goblin",
                chance: fn.lineByLevel(1, 20, 1.0, 0.5), // x1 at level 1, x0.5 at level 20+
                call: this.goblinCombatEncounter
            }, {
                    name: "gobass",
                    call: CommonEncounters.curry(kGAMECLASS.goblinSpecialScene.goblinSpecialEncounter, 0),
                    when: fn.ifLevelMin(10),
                    chance: fn.lineByLevel(10, 14, 0.5, 2.0) // x0.5 at level 10, x2 at level 16+
                }, {
                    name: "gobwar",
                    call: CommonEncounters.curry(kGAMECLASS.goblinSpecialScene.goblinSpecialEncounter, 1),
                    when: fn.ifLevelMin(12),
                    chance: fn.lineByLevel(12, 18, 0.5, 3.0) // x0.5 at level 12, x3 at level 18+
                }, {
                    name: "gobsha",
                    call: CommonEncounters.curry(kGAMECLASS.goblinSpecialScene.goblinSpecialEncounter, 2),
                    when: fn.ifLevelMin(12),
                    chance: fn.lineByLevel(12, 18, 0.5, 3.0) // x0.5 at level 12, x3 at level 18+
                }, {
                    name: "gobeld",
                    call: kGAMECLASS.goblinElderScene.goblinElderEncounter,
                    when: fn.ifLevelMin(16),
                    chance: fn.lineByLevel(16, 20, 0.5, 4.0) // x0.5 at level 16, x4 at level 20+
                })
        });
    }

    private _demonEncounter: Encounter | undefined = undefined;
    public get demonEncounter(): Encounter {
        const fn: FnHelpers = Encounters.fn;
        return this._demonEncounter = this._demonEncounter || Encounters.build({
            name: "demonsoldier",
            call: kGAMECLASS.demonSoldierScene.encounterTheSoldierz,
            when: fn.ifLevelMin(14),
            chance: fn.lineByLevel(14, 22, 0.5, 2.0) // x0.5 at level 14, x2 at level 22+
        });
    }

    public encounterChance(): number {
        return this.theCommonEncounters.encounterChance();
    }

    public execEncounter(): void {
        this.theCommonEncounters.execEncounter();
    }

    public encounterName(): string {
        return "common";
    }

    /**
     * Imp, Goblin, Helia sex ambush
     */
    public get withImpGob(): Encounter {
        return this._withImpGob = this._withImpGob || Encounters.group("common",
            this.impEncounter,
            this.goblinEncounter,
            this.demonEncounter,
            this.theCommonEncounters);
    }

    private _withImpGob: Encounter | undefined = undefined;
    /* Alternative version:
     public  withImpGob2:Encounter = new LateinitEncounter(this,function():Encounter{
     return Encounters.group("common",impEncounter,
     goblinEncounter,
     theCommonEncounters);
     });*/

    /**
     * Helia sex ambush
     */
    public get theCommonEncounters(): Encounter {
        return this._tce = this._tce || Encounters.group("common",
            kGAMECLASS.helScene.helSexualAmbushEncounter);
    }

    private _tce: Encounter | undefined = undefined;

    public furriteMod(): number {
        return this.furriteFnGen()();
    }

    public lethiteMod(): number {
        return this.lethiteFnGen()();
    }

    public furriteFnGen(iftrue: number = 3, iffalse: number = 1) {
        return () => {
            return this.player.findPerk(PerkLib.PiercedFurrite) >= 0 ? iftrue : iffalse;
        };
    }

    public lethiteFnGen(iftrue: number = 3, iffalse: number = 1) {
        return () => {
            return this.player.findPerk(PerkLib.PiercedLethite) >= 0 ? iftrue : iffalse;
        };
    }

    public impEncounterBaseChance(): number {
        let impch: number = 5;
        if (this.player.totalCocks() > 0) impch--;
        if (this.player.hasVagina()) impch++;
        if (this.player.totalFertility() >= 30) impch++;
        if (this.player.cumQ() >= 200) impch--;
        return impch / 10;
    }

    private unlockCodexImps(): void {
        // Unlock if haven't already.
        this.unlockCodexEntry("Imps", kFLAGS.CODEX_ENTRY_IMPS);
    }

    private twoImpsClashing(): void {
        // Two imps clashing, UTG stuff.
        this.clearOutput();
        this.outputText("A small imp bursts from behind a rock and buzzes towards you. You prepare for a fight, but it stays high and simply flies above you. Suddenly another imp appears from nowhere and attacks the first. In the tussle one of them drops an item, which you handily catch, as the scrapping demons fight their way out of sight. ");
        this.unlockCodexImps();
        this.inventory.takeItem(CommonEncounters.randomChoice(this.consumables.SUCMILK, this.consumables.INCUBID,
            this.consumables.IMPFOOD), this.camp.returnToCampUseOneHour);
    }

    private impCombatEncounter(): void {
        this.clearOutput();
        this.outputText("An imp wings out of the sky and attacks!");
        this.unlockCodexImps();
        this.doNext(this.playerMenu);
        this.startCombat(new Imp());
        this.spriteSelect(SpriteDb.s_imp);
    }

    public goblinCombatEncounter(): void {
        // counters.mGoblin.encountered++; <- call this on non-combat encounters
        if (this.player.gender > 0) {
            this.clearOutput();
            this.outputText("A goblin saunters out of the bushes with a dangerous glint in her eyes.\n\nShe says, \"<i>Time to get fucked, " + this.player.mf("stud", "slut") + ".</i>\"");
        } else {
            this.clearOutput();
            this.outputText("A goblin saunters out of the bushes with a dangerous glint in her eyes.\n\nShe says, \"<i>Time to get fuc-oh shit, you don't even have anything to play with!  This is for wasting my time!</i>\"");
        }
        this.unlockCodexEntry("Goblins", kFLAGS.CODEX_ENTRY_GOBLINS);
        this.startCombat(new Goblin());
        this.spriteSelect(SpriteDb.s_goblin);
    }

    public bigJunkChance(): number {
        return (this.player.longestCockLength() >= this.player.tallness
            && this.player.totalCockThickness() >= 12)
            ? 1 + (this.player.longestCockLength() - this.player.tallness) / 24
            : 0;
    }

    // TODO merge
    // [RANDOM SCENE IF CHARACTER HAS AT LEAST ONE COCK LARGER THAN THEIR HEIGHT, AND THE TOTAL COMBINED WIDTH OF ALL THEIR COCKS IS TWELVE INCHES OR GREATER]
    public bigJunkForestScene(lake: boolean = false): void {
        this.clearOutput();
        const x: number = this.player.longestCock();

        // PARAGRAPH 1
        this.outputText("Walking along the ");
        if (lake) this.outputText("grassy and muddy shores of the lake");
        else this.outputText("various paths of the forest");
        this.outputText(", you find yourself increasingly impeded by the bulk of your " + this.player.cockDescript(x) + " dragging along the ");
        if (lake) this.outputText("wet ground behind you.");
        else this.outputText("earth behind you.");
        if (this.player.cocks.length == 1) {
            if (lake) this.outputText("  As it drags through the lakeside mud, the sensation forces you to imagine the velvety folds of a monstrous pussy sliding along the head of your " + Appearance.cockNoun(this.player.cocks[x].cockType) + ", gently attempting to suck it off.");
            else this.outputText("  As it drags across the grass, twigs, and exposed tree roots, the sensation forces you to imagine the fingers of a giant hand sliding along the head of your " + Appearance.cockNoun(this.player.cocks[x].cockType) + ", gently jerking it off.");
        }
        else if (this.player.cocks.length >= 2) {
            if (lake) this.outputText("  With all of your " + this.player.multiCockDescriptLight() + " dragging through the mud, they begin feeling as if the lips of " + CommonEncounters.num2Text(this.player.cockTotal()) + " different cunts were slobbering over each one.");
            else this.outputText("  With all of your " + this.player.multiCockDescriptLight() + " dragging across the grass, twigs, and exposed tree roots, they begin feeling as if the rough fingers of " + CommonEncounters.num2Text(this.player.cockTotal()) + " different monstrous hands were sliding over each shaft, gently jerking them off.");
        }
        this.outputText("\n\n");

        // PARAGRAPH 2
        // FOR NON-CENTAURS]
        if (!this.player.isTaur()) {
            this.outputText("The impending erection can't seem to be stopped.  Your sexual frustration forces stiffness into your " + this.player.multiCockDescriptLight() + ", which forces your torso to the ground.  Normally your erection would merely raise itself skyward, but your genitals have grown too large and heavy for your " + this.player.hipDescript() + " to hold them aloft.  Instead, you feel your body forcibly pivoting at the hips until your torso is compelled to rest face down atop your " + this.player.multiCockDescriptLight() + ".");
            // IF CHARACTER HAS GIANT BREASTS ADD SENTENCE
            if (this.player.biggestTitSize() >= 35) {
                if (lake) this.outputText("  Your " + this.player.chestDesc() + " hang lewdly off your torso to rest in the lakeside mud, covering much of the ground to either side of you.  Their immense weight anchors your body, further preventing your torso from lifting itself up.  Mud cakes against their undersides and coats your " + this.player.nippleDescript(0) + "s.");
                else this.outputText("  Your " + this.player.chestDesc() + " hang lewdly off your torso to rest on the twings and dirt, covering up much of the ground to either side of you.  Their immense weight anchors your body, further preventing your torso from lifting itself up.  The rough texture of the bark on various tree roots teases your " + this.player.nippleDescript(0) + "s mercilessly.");
            }
            // IF CHARACTER HAS A BALLS ADD SENTENCE
            if (this.player.balls > 0) {
                this.outputText("  Your " + this.player.skin.tone + " " + this.player.sackDescript() + " rests beneath your raised " + this.player.buttDescript() + ".  Your " + this.player.ballsDescriptLight() + " pulse with the need to release their sperm through your " + this.player.multiCockDescriptLight() + " and ");
                if (lake) this.outputText("into the waters of the nearby lake.");
                else this.outputText("onto the fertile soil of the forest.");
            }
            // IF CHARACTER HAS A VAGINA ADD SENTENCE
            if (this.player.vaginas.length >= 1) {
                this.outputText("  Your " + this.player.vaginaDescript() + " and " + this.player.clitDescript() + " are thoroughly squashed between the bulky flesh where your male genitals protrude from between your hips and the " + this.player.buttDescript() + " above.");
                // IF CHARACTER HAS A DROOLING PUSSY ADD SENTENCE
                if (this.player.vaginas[0].vaginalWetness >= Vagina.WETNESS_DROOLING) {
                    this.outputText("  Juices stream from your womanhood and begin pooling on the dirt and twigs beneath you.  ");
                    if (lake) this.outputText("The drooling fem-spunk only makes the ground more muddy.");
                    else this.outputText("The sticky fem-spunk immediately soaks down into the rich soil.");
                }
            }
        }
        // FOR CENTAURS
        else if (this.player.isTaur()) {
            this.outputText("  The impending erection can't seem to be stopped.  Your sexual frustration forces stiffness into your " + this.player.multiCockDescriptLight() + ", which forces the barrel of your bestial torso to the ground.  Normally your erection would merely hover above the ground in between your legs, but your genitals have grown too large and heavy for your " + this.player.hipDescript() + " to hold them aloft.  Instead, you feel your body being forcibly pulled down at your hind legs until your bestial body is resting on top of your " + this.player.multiCockDescriptLight() + ".");
            // IF CHARACTER HAS GIANT BREASTS ADD SENTENCE
            if (this.player.biggestTitSize() >= 35) {
                if (lake) this.outputText("  Your " + this.player.chestDesc() + " pull your human torso forward until it also is forced to face the ground, obscured as it is in boob-flesh.  Your tits rest on the wet earth to either side of you.  Their immense weight anchors you, further preventing any part of your equine body from lifting itself up.  Mud cakes their undersides and coats your " + this.player.nippleDescript(0) + "s.");
                else this.outputText("  Your " + this.player.chestDesc() + " pull your human torso forward until it also is forced to face the ground, obscured as it is in boob-flesh.  Your tits rest on the dirt and twigs to either side of you.  Their immense weight anchors you, further preventing any part of your equine body from lifting itself up.  The rough texture of the bark on various tree roots teases your " + this.player.nippleDescript(0) + "s mercilessly.");
            }
            // IF CHARACTER HAS A BALLS ADD SENTENCE
            if (this.player.balls > 0) {
                this.outputText("  Your " + this.player.skin.tone + this.player.sackDescript() + " rests beneath your raised " + this.player.buttDescript() + ".  Your " + this.player.ballsDescriptLight() + " pulse with the need to release their sperm through your " + this.player.multiCockDescriptLight() + " and ");
                if (lake) this.outputText("into the waters of the nearby lake.");
                else this.outputText("onto the fertile soil of the forest floor.");
            }
            // IF CHARACTER HAS A VAGINA ADD SENTENCE
            if (this.player.vaginas.length >= 1) {
                this.outputText("  Your " + this.player.vaginaDescript() + " and " + this.player.clitDescript() + " are thoroughly squashed between the bulky flesh where your male genitals protrude from between your hips and the " + this.player.buttDescript() + " above.");
                // IF CHARACTER HAS A DROOLING PUSSY ADD SENTENCE
                if (this.player.vaginas[0].vaginalWetness >= Vagina.WETNESS_DROOLING) {
                    if (lake) this.outputText("  A leaf falls from a tree and lands on the wet lips of your cunt, its light touch teasing your sensitive skin.  Like a mare or cow in heat, your juices stream from your womanhood and pool in the mud beneath you.  The sloppy fem-spunk only makes the ground more muddy.");
                    else this.outputText("  A leaf falls from a tree and lands on the wet lips of your cunt, its light touch teasing your sensitive skin.  Like a mare or cow in heat, your juices stream from your womanhood and pool in the dirt and twigs beneath you.");
                }
            }
        }
        this.outputText("\n\n");
        // PARAGRAPH 3
        this.outputText("You realize you are effectively trapped here by your own body.");
        // CORRUPTION BASED CHARACTER'S VIEW OF SITUATION
        if (this.player.cor < 33) this.outputText("  Panic slips into your heart as you realize that if any dangerous predator were to find you in this state, you'd be completely defenseless.  You must find a way to regain your mobility immediately!");
        else if (this.player.cor < 66) this.outputText("  You realize that if any dangerous predator were to find you in this state, you'd be completely defenseless!  You must find a way to regain your mobility... yet there is a certain appeal to imagining how pleasurable it would be for a sexual predator to take advantage of your obscene body.");
        else this.outputText("  Your endowments have rendered you completely helpless should any predators find you.  Somewhere in your heart, you find this prospect almost exhilarating.  The idea of being a helpless fucktoy for a wandering beast is unusually inviting to you.  Were it not for the thought that you might starve to death, you'd be incredibly tempted to remain right where you are.");

        if (lake) {
            // SCENE END = IF CHARACTER HAS FULL WINGS ADD SENTENCE
            if (this.player.canFly()) this.outputText("  You extend your wings and flap as hard as you can until at last, you manage to lighten the bulk of your body.  It helps just enough to let you drag your genitals out of the mud and back to camp.  The ordeal takes nearly an hour for you to return and deal with.");
            // Taurs
            else if (this.player.isTaur()) this.outputText("  You struggle and work your multiple legs against the wet ground.  Your " + this.player.feet() + " have consistent trouble finding footing as the mud fails to provide enough leverage to lift your bulk.  You breath in deeply and lean side to side, trying to find some easier vertical leverage beneath your feet.  Eventually, with a crude crawl, your legs manages to push the bulk of your body onto more solid ground.  With great difficulty, you spend the next hour shuffling your genitals back to camp.");
            // SCENE END = FOR ALL OTHER CHARACTERS
            else this.outputText("  You struggle and push with your " + this.player.legs() + " as hard as you can, but it's no use.  You do the only thing you can and begin stroking your " + this.player.multiCockDescriptLight() + " with as much vigor as you can muster.  Eventually, your body tenses and a light load of jizz erupts from your body, but the orgasm is truly mild compared to what you need.  You're far too weary from struggling to give yourself the masturbation you truly need, but you continue to try.  Nearly an hour later, " + this.player.sMultiCockDesc() + " has softened enough to allow you to stand again, and you make your way back to camp, still dragging your genitals through the mud.");
        }
        else {
            // SCENE END = IF CHARACTER HAS FULL WINGS ADD SENTENCE
            if (this.player.canFly()) this.outputText("  You extend your wings and flap as hard as you can, until at last, you manage to lighten the bulk of your body.  It helps just enough to let you drag your genitals out of the forest and back to camp.  The ordeal takes nearly an hour for you to return and deal with.");
            // SCENE END IF CHARACTER HAS CENTAUR BODY
            else if (this.player.isTaur()) this.outputText("  You struggle and work your multiple legs against the soft dirt.  Your " + this.player.feet() + " have consistent trouble finding footing as the ground fails to provide enough leverage to lift your bulk.  You breath in deeply and lean side to side, until eventually, your feet brace against the various roots of the trees around you.  With a crude crawl, your legs manage to shuffle your body and genitals out of the forest and back to camp.");
            // SCENE END = FOR ALL OTHER CHARACTERS
            else this.outputText("  You struggle and push with your " + this.player.legs() + " as hard as you can, but it's no use.  You do the only thing you can and begin stroking your " + this.player.multiCockDescriptLight() + " with as much vigor as you can muster.  Eventually, your body tenses and a light load of jizz erupts from your loins, but the orgasm is truly mild compared to what you need.  You're far too weary from struggling to give yourself the masturbation you truly need, but you continue to try.  Nearly an hour later, " + this.player.sMultiCockDesc() + " has softened enough to allow you to stand again, and you make your way back to camp, still dragging your genitals across the forest floor.");
        }
        this.dynStats("lus", 25 + rand(this.player.cor / 5), "scale", false);
        this.player.changeFatigue(5);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    // Massive bodyparts scene
    // [DESERT]
    // [RANDOM SCENE IF CHARACTER HAS AT LEAST ONE COCK LARGER THAN THEIR HEIGHT,
    // AND THE TOTAL COMBINED WIDTH OF ALL THEIR COCKS IS TWELVE INCHES OR GREATER]
    public bigJunkDesertScene(): void {
        this.clearOutput();
        const x: number = this.player.longestCock();
        // PARAGRAPH 1
        this.outputText("Walking along the sandy dunes of the desert you find yourself increasingly impeded by the bulk of your " + this.player.cockDescript(x) + " dragging along the sandscape behind you.  The incredibly hot surface of the desert causes your loins to sweat heavily and fills them with relentless heat.");

        if (this.player.cocks.length == 1) this.outputText("  As it drags along the dunes, the sensation forces you to imagine the rough textured tongue of a monstrous animal sliding along the head of your " + Appearance.cockNoun(this.player.cocks[x].cockType) + ".");
        else if (this.player.cocks.length >= 2) this.outputText("  With all of your " + this.player.multiCockDescriptLight() + " dragging through the sands they begin feeling as if the rough textured tongues of " + CommonEncounters.num2Text(this.player.cockTotal()) + " different monstrous animals were slobbering over each one.");
        this.outputText("\n\n");

        // PARAGRAPH 2

        // FOR NON-CENTAURS]
        if (!this.player.isTaur()) {
            this.outputText("The impending erection can't seem to be stopped.  Your sexual frustration forces stiffness into your " + this.player.multiCockDescriptLight() + ", which forces your torso to the ground.  Normally your erection would merely raise itself skyward but your genitals have grown too large and heavy for your " + this.player.hipDescript() + " to hold them aloft.  Instead you feel your body forcibly pivoting at the hips until your torso is compelled to rest face down on top of your obscene " + this.player.multiCockDescriptLight() + ".");

            // IF CHARACTER HAS GIANT BREASTS ADD SENTENCE
            if (this.player.biggestTitSize() >= 35) this.outputText("  Your " + this.player.allBreastsDescript() + " hang lewdly off your torso to rest on the desert sands, seeming to bury the dunes on either side of you.  Their immense weight anchors your body, further preventing your torso from lifting itself up.  The burning heat of the desert teases your " + this.player.nippleDescript(0) + "s mercilessly as they grind in the sand.");
            // IF CHARACTER HAS A BALLS ADD SENTENCE
            if (this.player.balls > 0) this.outputText("  Your " + this.player.skin.tone + this.player.sackDescript() + " rests beneath your raised " + this.player.buttDescript() + ".  The fiery warmth of the desert caresses it, causing your " + this.player.ballsDescriptLight() + " to pulse with the need to release their sperm through your " + this.player.multiCockDescriptLight() + ".");
            // IF CHARACTER HAS A VAGINA ADD SENTENCE
            if (this.player.vaginas.length >= 1) {
                this.outputText("  Your " + this.player.vaginaDescript() + " and " + this.player.clitDescript() + " are thoroughly squashed between the bulky flesh where your male genitals protrude from between your hips and the " + this.player.buttDescript() + " above.");
                // IF CHARACTER HAS A DROOLING PUSSY ADD SENTENCE
                if (this.player.vaginas[0].vaginalWetness >= Vagina.WETNESS_DROOLING) this.outputText("  Juices stream from your womanhood and begin pooling on the hot sand beneath you.  Wisps of steam rise up into the air only to tease your genitals further.  ");
            }
        }
        // FOR CENTAURS
        else {
            this.outputText("The impending erection can't seem to be stopped.  Your sexual frustration forces stiffness into your " + this.player.multiCockDescriptLight() + ", which forces the barrel of your horse-like torso to the ground.  Normally your erection would merely hover above the ground in between your centaurian legs, but your genitals have grown too large and heavy for your " + this.player.hipDescript() + " to hold them aloft.  Instead, you feel your body being forcibly pulled down at your hindquarters until you rest atop your " + this.player.multiCockDescriptLight() + ".");
            // IF CHARACTER HAS GIANT BREASTS ADD SENTENCE
            if (this.player.biggestTitSize() >= 35) this.outputText("  Your " + this.player.allBreastsDescript() + " pull your human torso forward until it also is forced to rest facedown, just like your horse half.  Your tits rest, pinned on the desert sand to either side of you.  Their immense weight anchors you, further preventing any part of your equine body from lifting itself up.  The burning heat of the desert teases your " + this.player.nippleDescript(0) + "s incessantly.");
            // IF CHARACTER HAS A BALLS ADD SENTENCE
            if (this.player.balls > 0) this.outputText("  Your " + this.player.skin.tone + this.player.sackDescript() + " rests beneath your raised " + this.player.buttDescript() + ".  The airy warmth of the desert teases it, causing your " + this.player.ballsDescriptLight() + " pulse with the need to release their sperm through your " + this.player.multiCockDescriptLight() + ".");
            // IF CHARACTER HAS A VAGINA ADD SENTENCE
            if (this.player.vaginas.length >= 1) {
                this.outputText("  Your " + this.player.vaginaDescript() + " and " + this.player.clitDescript() + " are thoroughly squashed between the bulky flesh where your male genitals protrude from between your hips and the " + this.player.buttDescript() + " above.");
                // IF CHARACTER HAS A DROOLING PUSSY ADD SENTENCE
                if (this.player.vaginas[0].vaginalWetness >= Vagina.WETNESS_DROOLING) this.outputText("  The desert sun beats down on your body, its fiery heat inflaming the senses of your vaginal lips.  Juices stream from your womanhood and begin pooling on the hot sand beneath you.");
            }
        }
        this.outputText("\n\n");
        // PARAGRAPH 3
        this.outputText("You realize you are effectively trapped here by your own body.");
        // CORRUPTION BASED CHARACTER'S VIEW OF SITUATION
        if (this.player.cor < 33) this.outputText("  Panic slips into your heart as you realize that if any dangerous predator were to find you in this state, you'd be completely defenseless.  You must find a way to regain your mobility immediately!");
        else if (this.player.cor < 66) this.outputText("  You realize that if any dangerous predator were to find you in this state you'd be completely defenseless.  You must find a way to regain your mobility... yet there is a certain appeal to imagining how pleasurable it would be for a sexual predator to take advantage of your obscene body.");
        else this.outputText("  Your endowments have rendered you completely helpless should any predators find you.  Somewhere in your heart, you're exhilarated at the prospect.  The idea of being a helpless fucktoy for a wandering beast is unusually inviting to you.  Were it not for the thought that you might die of thirst in the desert, you'd be incredibly tempted to remain right where you are.");

        // SCENE END = IF CHARACTER HAS FULL WINGS ADD SENTENCE
        if (this.player.canFly()) this.outputText("  You extend your wings and flap as hard as you can, until at last you manage to lighten the bulk of your body somewhat - enough to allow yourself to drag your genitals across the hot sands and back to camp.  The ordeal takes nearly an hour.");
        // SCENE END IF CHARACTER HAS CENTAUR BODY
        else if (this.player.isTaur()) this.outputText("  You struggle and work your equine legs against the surface of the dune you are trapped on.  Your " + this.player.feet() + " have consistent trouble finding footing, the soft sand failing to provide enough leverage to lift your bulk.  You breath in deeply and lean from side to side, trying to find some easier vertical leverage.  Eventually, with a crude crawl, your legs manage to push the bulk of your body onto more solid ground.  With great difficulty, you spend the next hour shuffling your genitals across the sandscape and back to camp.");
        // SCENE END = FOR ALL OTHER CHARACTERS
        else this.outputText("  You struggle and push with your " + this.player.legs() + " as hard as you can, but it's no use.  You do the only thing you can and begin stroking your " + this.player.multiCockDescriptLight() + " with as much vigor as you can muster.  Eventually your body tenses and a light load of jizz erupts from your body, but the orgasm is truly mild compared to what you need.  You're simply too weary from struggling to give yourself the masturbation you truly need, but you continue to try.  Nearly an hour later " + this.player.sMultiCockDesc() + " softens enough to allow you to stand again, and you make your way back to camp, still dragging your genitals across the warm sand.");
        this.dynStats("lus", 25 + rand(this.player.cor / 5), "scale", false);
        this.player.changeFatigue(5);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

}
