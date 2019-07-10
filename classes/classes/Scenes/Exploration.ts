import { BaseContent } from "../BaseContent";
import { ExploreDebug } from "./Explore/ExploreDebug";
import { kFLAGS } from "../GlobalFlags/kFLAGS";
import { debug } from "console";
import { StatusEffects } from "../StatusEffects";
import { rand } from "../Extra";
import { PerkLib } from "../PerkLib";
import { Imp } from "./Monsters/Imp";
import { SpriteDb } from "../display/SpriteDb";
import { Goblin } from "./Monsters/Goblin";
import { CoC } from "../CoC";
import { FnHelpers } from "./API/FnHelpers";
import { Encounters } from "./API/Encounters";
import { room } from "../room";
import { kGAMECLASS } from "../GlobalFlags/kGAMECLASS";

/**
 * Created by aimozg on 05.01.14.
 */

export class Exploration extends BaseContent {
    public exploreDebug: ExploreDebug = new ExploreDebug();

    // const MET_OTTERGIRL: number = 777;
    // const HAS_SEEN_MINO_AND_COWGIRL: number = 892;
    // const EXPLORATION_PAGE: number = 1015;
    // const BOG_EXPLORED: number = 1016;
    public doExplore(): void {
        // Clear
        this.clearOutput();

        // Introductions to exploration //
        if (this.flags[kFLAGS.TIMES_EXPLORED] <= 0) {
            this.clearOutput();
            this.outputText(this.images.showImage("event-first-steps"));
            this.outputText("You tentatively step away from your campsite, alert and scanning the ground and sky for danger.  You walk for the better part of an hour, marking the rocks you pass for a return trip to your camp.  It worries you that the portal has an opening on this side, and it was totally unguarded...\n\n...Wait a second, why is your campsite in front of you? The portal's glow is clearly visible from inside the tall rock formation.   Looking carefully you see your footprints leaving the opposite side of your camp, then disappearing.  You look back the way you came and see your markings vanish before your eyes.  The implications boggle your mind as you do your best to mull over them.  Distance, direction, and geography seem to have little meaning here, yet your campsite remains exactly as you left it.  A few things click into place as you realize you found your way back just as you were mentally picturing the portal!  Perhaps memory influences travel here, just like time, distance, and speed would in the real world!\n\nThis won't help at all with finding new places, but at least you can get back to camp quickly.  You are determined to stay focused the next time you explore and learn how to traverse this gods-forsaken realm.");
            this.flags[kFLAGS.TIMES_EXPLORED]++;
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        } else if (this.flags[kFLAGS.TIMES_EXPLORED_FOREST] <= 0) {
            this.clearOutput();
            this.outputText(this.images.showImage("area-forest"));
            this.outputText("You walk for quite some time, roaming the hard-packed and pink-tinged earth of the demon-realm.  Rust-red rocks speckle the wasteland, as barren and lifeless as anywhere else you've been.  A cool breeze suddenly brushes against your face, as if gracing you with its presence.  You turn towards it and are confronted by the lush foliage of a very old looking forest.  You smile as the plants look fairly familiar and non-threatening.  Unbidden, you remember your decision to test the properties of this place, and think of your campsite as you walk forward.  Reality seems to shift and blur, making you dizzy, but after a few minutes you're back, and sure you'll be able to return to the forest with similar speed.\n\n<b>You have discovered the Forest!</b>");
            this.flags[kFLAGS.TIMES_EXPLORED]++;
            this.flags[kFLAGS.TIMES_EXPLORED_FOREST]++;
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }

        // Exploration Menu //
        this.outputText("You can continue to search for new locations, or explore your previously discovered locations.");

        /*if (flags[kFLAGS.EXPLORATION_PAGE] == 2) {
            explorePageII();
            return;
        }*/
        this.hideMenus();
        this.menu();
        this.addButton(0, "Explore", this.tryDiscover).hint("Explore to find new regions and visit any discovered regions.");
        if (this.flags[kFLAGS.TIMES_EXPLORED_FOREST] > 0) this.addButton(1, "Forest", kGAMECLASS.forest.explore).hint("Visit the lush forest. \n\nRecommended level: 1" + (this.player.level < 6 ? "\n\nBeware of Tentacle Beasts!" : "") + (debug ? "\n\nTimes explored: " + this.flags[kFLAGS.TIMES_EXPLORED_FOREST] : ""));
        if (this.flags[kFLAGS.TIMES_EXPLORED_LAKE] > 0) this.addButton(2, "Lake", kGAMECLASS.lake.explore).hint("Visit the lake and explore the beach. \n\nRecommended level: 1" + (debug ? "\n\nTimes explored: " + this.flags[kFLAGS.TIMES_EXPLORED_LAKE] : ""));
        if (this.flags[kFLAGS.TIMES_EXPLORED_DESERT] > 0) this.addButton(3, "Desert", kGAMECLASS.desert.explore).hint("Visit the dry desert. \n\nRecommended level: 2" + (debug ? "\n\nTimes explored: " + this.flags[kFLAGS.TIMES_EXPLORED_DESERT] : ""));

        if (this.flags[kFLAGS.TIMES_EXPLORED_MOUNTAIN] > 0) this.addButton(5, "Mountain", kGAMECLASS.mountain.explore).hint("Visit the mountain. \n\nRecommended level: 5" + (debug ? "\n\nTimes explored: " + this.flags[kFLAGS.TIMES_EXPLORED_MOUNTAIN] : ""));
        if (this.flags[kFLAGS.TIMES_EXPLORED_SWAMP] > 0) this.addButton(6, "Swamp", kGAMECLASS.swamp.explore).hint("Visit the wet swamplands. \n\nRecommended level: 12" + (debug ? "\n\nTimes explored: " + this.flags[kFLAGS.TIMES_EXPLORED_SWAMP] : ""));
        if (this.flags[kFLAGS.TIMES_EXPLORED_PLAINS] > 0) this.addButton(7, "Plains", kGAMECLASS.plains.explore).hint("Visit the plains. \n\nRecommended level: 10" + (debug ? "\n\nTimes explored: " + this.flags[kFLAGS.TIMES_EXPLORED_PLAINS] : ""));
        if (this.player.hasStatusEffect(StatusEffects.ExploredDeepwoods)) this.addButton(8, "Deepwoods", kGAMECLASS.deepWoods.explore).hint("Visit the dark, bioluminescent deepwoods. \n\nRecommended level: 5" + (debug ? "\n\nTimes explored: " + this.player.statusEffectv1(StatusEffects.ExploredDeepwoods) : ""));

        if (this.flags[kFLAGS.DISCOVERED_HIGH_MOUNTAIN] > 0) this.addButton(10, "High Mountain", kGAMECLASS.highMountains.explore).hint("Visit the high mountains where basilisks and harpies are found. \n\nRecommended level: 10" + (debug ? "\n\nTimes explored: " + this.flags[kFLAGS.DISCOVERED_HIGH_MOUNTAIN] : ""));
        if (this.flags[kFLAGS.BOG_EXPLORED] > 0) this.addButton(11, "Bog", kGAMECLASS.bog.explore).hint("Visit the dark bog. \n\nRecommended level: 14" + (debug ? "\n\nTimes explored: " + this.flags[kFLAGS.BOG_EXPLORED] : ""));
        if (this.flags[kFLAGS.DISCOVERED_GLACIAL_RIFT] > 0) this.addButton(12, "Glacial Rift", kGAMECLASS.glacialRift.explore).hint("Visit the chilly glacial rift. \n\nRecommended level: 16" + (debug ? "\n\nTimes explored: " + this.flags[kFLAGS.DISCOVERED_GLACIAL_RIFT] : ""));
        // if (flags[kFLAGS.DISCOVERED_VOLCANO_CRAG] > 0) addButton(13, "Volcanic Crag", kGAMECLASS.volcanicCrag.explore).hint("Visit the infernal volcanic crag. \n\nRecommended level: 20" + (debug ? "\n\nTimes explored: " + flags[kFLAGS.DISCOVERED_VOLCANO_CRAG] : ""));
        if (debug) this.addButton(9, "Debug", this.exploreDebug.doExploreDebug);
        // addButton(4, "Next", explorePageII);
        this.addButton(14, "Back", this.playerMenu);
    }

    private explorePageII(): void {
        this.flags[kFLAGS.EXPLORATION_PAGE] = 2;
        this.menu();
        if (debug) this.addButton(9, "Debug", this.exploreDebug.doExploreDebug);
        this.addButton(9, "Previous", this.goBackToPageI);
        this.addButton(14, "Back", this.playerMenu);
    }

    private goBackToPageI(): void {
        this.flags[kFLAGS.EXPLORATION_PAGE] = 1;
        this.doExplore();
    }

    public genericGobImpEncounters(even: boolean = false): void {
        if ((this.player.level >= 12 || this.getGame().time.days >= 110) && rand(4) == 0) { // If eligible, 1 in 4 chance to encounter demon soldiers instead.
            this.getGame().demonSoldierScene.encounterTheSoldierz();
            return;
        }

        let impGob: number = 5;
        if (!even) {
            if (this.player.totalCocks() > 0) impGob--;
            if (this.player.hasVagina()) impGob++;
            if (this.player.totalFertility() >= 30) impGob++;
            if (this.player.cumQ() >= 200) impGob--;
            if (this.player.findPerk(PerkLib.PiercedLethite) >= 0) {
                if (impGob <= 3) impGob += 2;
                else if (impGob < 7) impGob = 7;
            }
        }
        // Imptacular Encounter
        if (rand(10) < impGob) {
            let impChooser: number = rand(100);
            // Level modifier
            if (this.player.level < 20) impChooser += this.player.level;
            else impChooser += 20;
            // Limit chooser ranges
            if (impChooser > 100) impChooser = 100;
            if (this.player.level < 8 && impChooser >= 40) impChooser = 39;
            else if (this.player.level < 12 && impChooser >= 60) impChooser = 59;
            else if (this.player.level < 16 && impChooser >= 80) impChooser = 79;
            // Imp Lord
            if (impChooser >= 50 && impChooser < 70) {
                kGAMECLASS.impScene.impLordEncounter();
                return;
            }
            // Imp Warlord
            else if (impChooser >= 70 && impChooser < 90) {
                kGAMECLASS.impScene.impWarlordEncounter();
                return;
            }
            // Imp Overlord (Rare!)
            else if (impChooser >= 90) {
                kGAMECLASS.impScene.impOverlordEncounter();
                return;
            }
            else {
                if (rand(10) == 0) { // Two imps clashing, UTG stuff.
                    this.clearOutput();
                    this.outputText(this.images.showImage("monster-imp"));
                    this.outputText("A small imp bursts from behind a rock and buzzes towards you. You prepare for a fight, but it stays high and simply flies above you. Suddenly another imp appears from nowhere and attacks the first. In the tussle one of them drops an item, which you handily catch, as the scrapping demons fight their way out of sight. ");
                    switch (rand(3)) {
                        case 0:
                            this.inventory.takeItem(this.consumables.SUCMILK, this.camp.returnToCampUseOneHour);
                            break;
                        case 1:
                            this.inventory.takeItem(this.consumables.INCUBID, this.camp.returnToCampUseOneHour);
                            break;
                        case 2:
                            this.inventory.takeItem(this.consumables.IMPFOOD, this.camp.returnToCampUseOneHour);
                            break;
                        default:
                            this.camp.returnToCampUseOneHour(); // Failsafe
                    }
                }
                else {
                    this.clearOutput();
                    this.outputText("An imp wings out of the sky and attacks!");
                    this.startCombat(new Imp());
                    this.spriteSelect(SpriteDb.s_imp);
                }
                // Unlock if haven't already.
                this.unlockCodexEntry("Imps", kFLAGS.CODEX_ENTRY_IMPS);
            }
            return;
        }
        // Encounter Gobbalin!
        else {
            let goblinChooser: number = rand(100);
            // Level modifier
            goblinChooser += Math.min(this.player.level, 20);
            // Limit chooser range
            if (goblinChooser > 100) goblinChooser = 100;
            if (this.player.level < 8 && goblinChooser >= 30) goblinChooser = 29;
            else if (this.player.level < 14 && goblinChooser >= 80) goblinChooser = 79;
            // Goblin assassin!
            if (goblinChooser >= 30 && goblinChooser < 80) {
                kGAMECLASS.goblinSpecialScene.goblinSpecialEncounter();
                return;
            }
            // Goblin elder!
            else if (goblinChooser >= 80) {
                kGAMECLASS.goblinElderScene.goblinElderEncounter();
                return;
            }
            if (this.player.gender > 0) {
                this.clearOutput();
                this.outputText(this.images.showImage("monster-goblin"));
                this.outputText("A goblin saunters out of the bushes with a dangerous glint in her eyes.\n\nShe says, \"<i>Time to get fucked, " + this.player.mf("stud", "slut") + ".</i>\"");
                this.unlockCodexEntry("Goblins", kFLAGS.CODEX_ENTRY_GOBLINS);
                this.startCombat(new Goblin());
                this.spriteSelect(SpriteDb.s_goblin);
                return;
            }
            else {
                this.clearOutput();
                this.outputText("A goblin saunters out of the bushes with a dangerous glint in her eyes.\n\nShe says, \"<i>Time to get fuc-oh shit, you don't even have anything to play with!  This is for wasting my time!</i>\"");
                this.unlockCodexEntry("Goblins", kFLAGS.CODEX_ENTRY_GOBLINS);
                this.startCombat(new Goblin());
                this.spriteSelect(SpriteDb.s_goblin);
                return;
            }
        }
    }

    // Try to find a new location - called from doExplore once the first location is found
    public tryDiscover(): void {
        this.clearOutput();
        this.flags[kFLAGS.TIMES_EXPLORED]++;
        this.normalExploreEncounter.execEncounter();
    }

    private _normalExploreEncounter: Encounter | undefined = undefined;
    public get normalExploreEncounter(): Encounter {
        const game: CoC = kGAMECLASS;
        const fn: FnHelpers = Encounters.fn;
        if (this._normalExploreEncounter == undefined) this._normalExploreEncounter =
            Encounters.group("explore", game.commonEncounters.withImpGob, {
                name: "grimdark_skip",
                call: game.commonEncounters.withImpGob.execEncounter,
                chance: Encounters.ALWAYS,
                when (): boolean {
                    return flags[kFLAGS.GRIMDARK_MODE] > 0;
                }
            }, {
                    name: "lake",
                    call: game.lake.discover,
                    when: fn.not(game.lake.isDiscovered),
                    chance: Encounters.ALWAYS
                }, {
                    name: "desert",
                    call: game.desert.discover,
                    when: fn.all(fn.not(game.desert.isDiscovered), game.lake.isDiscovered),
                    chance: 0.33
                }, {
                    name: "mountain",
                    call: game.mountain.discover,
                    when: fn.all(fn.not(game.mountain.isDiscovered), game.desert.isDiscovered),
                    chance: 0.33
                }, {
                    name: "plains",
                    call: game.plains.discover,
                    when: fn.all(fn.not(game.plains.isDiscovered), game.mountain.isDiscovered),
                    chance: 0.33
                }, {
                    name: "swamp",
                    call: game.swamp.discover,
                    when: fn.all(fn.not(game.swamp.isDiscovered), game.plains.isDiscovered),
                    chance: 0.33
                }, {
                    name: "glacial_rift",
                    call: game.glacialRift.discover,
                    when: fn.all(fn.not(game.glacialRift.isDiscovered), game.swamp.isDiscovered, fn.ifLevelMin(10)),
                    chance: 0.25
					/*}, { //This content is sealed away due to subpar quality.
						name  : "volcanic_crag",
						call  : game.volcanicCrag.discover,
						when  : fn.all(fn.not(game.volcanicCrag.isDiscovered), game.swamp.isDiscovered, fn.ifLevelMin(15)),
						chance: 0.25*/
                }, {
                    name: "cathedral",
                    call: this.gargoyle,
                    when (): boolean {
                        return flags[kFLAGS.FOUND_CATHEDRAL] == 0;
                    },
                    chance: 0.1
                }, {
                    name: "lumi",
                    call: game.lumi.lumiEncounter,
                    chance: 0.1
                }, {
                    name: "giacomo",
                    call: game.giacomoShop.giacomoEncounter,
                    chance: 0.2
                }, {
                    name: "prisonmod",
                    call: this.prisonFn,
                    when (): boolean {
                        return flags[kFLAGS.BAZAAR_ENTERED] == 0;
                    },
                    chance: 0.01
                }, {
                    name: "loleasteregg",
                    chance: 0.01,
                    call (): void {
                        // Easter egg!
                        outputText("You wander around, fruitlessly searching for new places.");
                        doNext(camp.returnToCampUseOneHour);
                    }
                });
        return this._normalExploreEncounter;
    }

    public prisonFn(): void {
        this.outputText(this.images.showImage("event-wagon"));
        if (this.flags[kFLAGS.PRISON_ENABLED] == true) {
            this.outputText("Your curiosity draws you towards the smoke of a campfire on the edges of the forest. In the gloom ahead you see what appears to be a cage wagon surrounded by several tents, and hear the sounds of guttural voices engaged in boisterous conversation. Inexplicably you find yourself struck by an unwholesome sense of foreboding. <b>Even from here that cage looks like it is designed to carry people off to somewhere very unpleasant, some place where your life could be turned upside down and the rules you have become accustomed to in this world may no longer apply.</b> You take a long moment to consider turning back. Do you throw caution to the wind and investigate further?");
            // outputText("\n\n(<b>NOTE:</b> Prisoner mod is currently under development and not all scenes are available.)");
            this.doYesNo(kGAMECLASS.prison.goDirectlyToPrisonDoNotPassGoDoNotCollect200Gems, this.camp.returnToCampUseOneHour);
        } else if (this.flags[kFLAGS.PRISON_ENABLED] == false) {
            this.clearOutput();
            this.outputText("Your curiosity draws you towards the smoke of a campfire on the edges of the forest. In the gloom ahead you see what appears to be a cage wagon surrounded by several tents, and hear the sounds of guttural voices engaged in boisterous conversation. Inexplicably you find yourself struck by an unwholesome sense of foreboding. Even from here that cage looks like it is designed to carry people off to somewhere very unpleasant, some place where your life could be turned upside down and the rules you have become accustomed to in this world may no longer apply. You take the wise decision of walking away.");
            this.menu();
            this.addButton(0, "Next", this.camp.returnToCampUseOneHour);
        }
    }

    public gargoyle(): void {
        if (this.flags[kFLAGS.GAR_NAME] == 0) kGAMECLASS.gargoyle.gargoylesTheShowNowOnWBNetwork();
        else kGAMECLASS.gargoyle.returnToCathedral();
    }

    public configureRooms(): void {
        let tRoom: room;

        // Wasteland
        tRoom = new room();
        tRoom.RoomName = "wasteland";
        tRoom.NorthExit = "forest";
        tRoom.SouthExit = undefined;
        tRoom.WestExit = undefined;
        tRoom.EastExit = undefined;
        tRoom.RoomFunction = this.getGame().exploration.wastelandZoneFunc;
        this.getGame().dungeons.rooms[tRoom.RoomName] = tRoom;

        // Forest
        tRoom = new room();
        tRoom.RoomName = "forest";
        tRoom.NorthExit = "deepwoods";
        tRoom.NorthExitCondition = function(): boolean { return player.hasKeyItem("Gate Key - Deepwoods") >= 0; };
        tRoom.SouthExit = "wasteland";
        tRoom.WestExit = "desert";
        tRoom.WestExitCondition = function(): boolean { return player.hasKeyItem("Gate Key - Desert") >= 0; };
        tRoom.EastExit = "lake";
        tRoom.RoomFunction = this.getGame().exploration.forestZoneFunc;
        this.getGame().dungeons.rooms[tRoom.RoomName] = tRoom;

        // Deepwoods
        tRoom = new room();
        tRoom.RoomName = "deepwoods";
        tRoom.NorthExit = undefined;
        tRoom.SouthExit = "forest";
        tRoom.WestExit = undefined;
        tRoom.EastExit = undefined;
        tRoom.RoomFunction = this.getGame().exploration.deepwoodsZoneFunc;
        this.getGame().dungeons.rooms[tRoom.RoomName] = tRoom;

        // Lake
        tRoom = new room();
        tRoom.RoomName = "lake";
        tRoom.NorthExit = "mountains";
        tRoom.SouthExit = "swamp";
        tRoom.SouthExitCondition = function(): boolean { return player.hasKeyItem("Gate Key - Swamp") >= 0; };
        tRoom.WestExit = "forest";
        tRoom.EastExit = undefined;
        tRoom.RoomFunction = this.getGame().exploration.lakeZoneFunc;
        this.getGame().dungeons.rooms[tRoom.RoomName] = tRoom;

        // Desert
        tRoom = new room();
        tRoom.RoomName = "desert";
        tRoom.NorthExit = undefined;
        tRoom.SouthExit = "plains";
        tRoom.WestExit = undefined;
        tRoom.EastExit = "forest";
        tRoom.RoomFunction = this.getGame().exploration.desertZoneFunc;
        this.getGame().dungeons.rooms[tRoom.RoomName] = tRoom;

        // Mountain
        tRoom = new room();
        tRoom.RoomName = "mountains";
        tRoom.NorthExit = "highmountains";
        tRoom.NorthExitCondition = function(): boolean { return player.hasKeyItem("Gate Key - High Mountains") >= 0; };
        tRoom.SouthExit = "lake";
        tRoom.WestExit = undefined;
        tRoom.EastExit = "volcaniccrag";
        tRoom.EastExitCondition = function(): boolean { return player.hasKeyItem("Gate Key - Volcanic Crag") >= 0; };
        tRoom.RoomFunction = this.getGame().exploration.mountainZoneFunc;
        this.getGame().dungeons.rooms[tRoom.RoomName] = tRoom;

        // High Mountains
        tRoom = new room();
        tRoom.RoomName = "highmountains";
        tRoom.NorthExit = undefined;
        tRoom.SouthExit = "mountains";
        tRoom.WestExit = undefined;
        tRoom.EastExit = undefined;
        tRoom.RoomFunction = this.getGame().exploration.highmountainZoneFunc;
        this.getGame().dungeons.rooms[tRoom.RoomName] = tRoom;

        // Plains
        tRoom = new room();
        tRoom.RoomName = "plains";
        tRoom.NorthExit = "desert";
        tRoom.SouthExit = undefined;
        tRoom.WestExit = undefined; // "savannah";
        tRoom.EastExit = undefined;
        tRoom.RoomFunction = this.getGame().exploration.plainsZoneFunc;
        this.getGame().dungeons.rooms[tRoom.RoomName] = tRoom;

        // Swamp
        tRoom = new room();
        tRoom.RoomName = "swamp";
        tRoom.NorthExit = "lake";
        tRoom.SouthExit = "bog";
        tRoom.SouthExitCondition = function(): boolean { return player.hasKeyItem("Gate Key - Bog") >= 0; };
        tRoom.WestExit = undefined;
        tRoom.EastExit = undefined;
        tRoom.RoomFunction = this.getGame().exploration.swampZoneFunc;
        this.getGame().dungeons.rooms[tRoom.RoomName] = tRoom;

        // Bog
        tRoom = new room();
        tRoom.RoomName = "bog";
        tRoom.NorthExit = "swamp";
        tRoom.SouthExit = undefined;
        tRoom.WestExit = undefined;
        tRoom.EastExit = "glacialrift";
        tRoom.EastExitCondition = function(): boolean { return player.hasKeyItem("Gate Key - Glacial Rift") >= 0; };
        tRoom.RoomFunction = this.getGame().exploration.bogZoneFunc;
        this.getGame().dungeons.rooms[tRoom.RoomName] = tRoom;

        // Glacial Rift
        tRoom = new room();
        tRoom.RoomName = "glacialrift";
        tRoom.NorthExit = undefined;
        tRoom.SouthExit = undefined;
        tRoom.WestExit = "bog";
        tRoom.EastExit = undefined;
        tRoom.RoomFunction = this.getGame().exploration.glacialriftZoneFunc;
        this.getGame().dungeons.rooms[tRoom.RoomName] = tRoom;

        // Volcanic Crag
        tRoom = new room();
        tRoom.RoomName = "volcaniccrag";
        tRoom.NorthExit = undefined;
        tRoom.SouthExit = undefined;
        tRoom.WestExit = "mountains";
        tRoom.EastExit = undefined;
        tRoom.RoomFunction = this.getGame().exploration.volcaniccragZoneFunc;
        this.getGame().dungeons.rooms[tRoom.RoomName] = tRoom;
    }

    // ------------
    // GRIMDARK DESC
    // ------------
    public wastelandZoneFunc(): boolean {
        this.clearOutput();
        this.outputText("<b><u>Wasteland</u></b>\n");
        this.outputText("The wasteland is what you would expect. The landscape is marred with remnants from the war, littered with corpses of various creatures and dotted with dried blood and semen puddles.");
        this.outputText("\n\nTall wrought iron walls separate each of the zones so it looks like the only way to travel between zones is through the gates.");
        this.outputText("\n\nTo the north is the gateway to forest. Behind you is the village Ingnam, which was mysteriously transported to Mareth.");
        this.addButton(0, "Explore", this.tryDiscover);
        this.addButton(1, "Ingnam", this.visitIngnam);
        return false;
    }

    public forestZoneFunc(): boolean {
        this.clearOutput();
        this.outputText("<b><u>Forest</u></b>\n");
        this.outputText("In spite of the grim nature of Mareth, the forest retains a portion its lush foliage, with plants and trees and some not even familiar to you. Some of the trees have scratch marks on them and a few are pierced with arrows. A segment of the forest is ruined with burnt and dead plants and trees.");
        this.outputText("\n\nTo the north is the path to the Deepwoods, separated by a wall of huge tree trunks though the knot-hole like opening had a " + (this.player.hasKeyItem("Gate Key - Deepwoods") >= 0 ? "gate installed but it's now open. " : "<b>locked gate installed to keep you from entering</b>."));
        this.outputText("\n\nTo the west is the path to desert " + (this.player.hasKeyItem("Gate Key - Desert") >= 0 ? "which is now unlocked since you have the key. " : "though <b>there's a locked gate</b>.") + "");
        this.outputText("\n\nTo the south is the path to the wasteland where Ingnam is located. To the east is the path to the lake.");
        this.addButton(0, "Explore", kGAMECLASS.forest.explore);
        return false;
    }

    public deepwoodsZoneFunc(): boolean {
        this.clearOutput();
        this.outputText("<b><u>Deepwoods</u></b>\n");
        this.outputText("This zone seems to be relatively untouched by the previous war. The Deepwoods is densely packed with trees, even more than the forest. Glowing moss and fungus dimly light the deepwoods, ensuring that you'll always be able to see even at night.");
        this.outputText("\n\nTo the south is the way back to the forest.");
        this.addButton(0, "Explore", kGAMECLASS.deepWoods.explore);
        if (this.flags[kFLAGS.DISCOVERED_DUNGEON_2_ZETAZ] > 0) this.addButton(1, "Deep Cave", this.getGame().dungeons.deepcave.enterDungeon);
        return false;
    }

    public lakeZoneFunc(): boolean {
        this.clearOutput();
        this.outputText("<b><u>Lake</u></b>\n");
        this.outputText("The lake is so big that you can't see the shoreline at the other side and the water is tinted red with the blood of the casualties from the war. The occasional trees show signs of recent war, with scratch marks from swords, arrow protruding from trunk and blood stains. Mounds of rotting and skeletal corpses dot the landscape.");
        this.outputText("\n\nTo the north is the path leading to the mountains.");
        this.outputText("\n\nTo the south is the path leading to the swamp " + (this.player.hasKeyItem("Gate Key - Swamp") >= 0 ? "which is now unlocked since you have the key. " : "though <b>there's a locked gate in the way</b>.") + "");
        this.outputText("\n\nTo the west is the path back to the forest.");
        this.addButton(0, "Explore", kGAMECLASS.lake.explore);
        if (this.player.hasStatusEffect(StatusEffects.BoatDiscovery)) this.addButton(1, "Boat", kGAMECLASS.boat.boatExplore);
        return false;
    }

    public desertZoneFunc(): boolean {
        this.clearOutput();
        this.outputText("<b><u>Desert</u></b>\n");
        this.addButton(0, "Explore", kGAMECLASS.desert.explore);
        if (this.player.hasStatusEffect(StatusEffects.TelAdre)) this.addButton(1, "Tel'Adre", this.visitTelAdre);
        if (this.flags[kFLAGS.DISCOVERED_WITCH_DUNGEON] > 0) this.addButton(2, "Desert Cave", kGAMECLASS.dungeons.desertcave.enterDungeon);
        return false;
    }

    public mountainZoneFunc(): boolean {
        this.clearOutput();
        this.outputText("<b><u>Mountain</u></b>\n");
        this.addButton(0, "Explore", kGAMECLASS.mountain.explore);
        if (this.flags[kFLAGS.FACTORY_FOUND] > 0) this.addButton(1, "Factory", this.getGame().dungeons.factory.enterDungeon);
        return false;
    }

    public highmountainZoneFunc(): boolean {
        this.clearOutput();
        this.outputText("<b><u>High Mountain</u></b>\n");
        this.addButton(0, "Explore", kGAMECLASS.highMountains.explore);
        return false;
    }

    public plainsZoneFunc(): boolean {
        this.clearOutput();
        this.outputText("<b><u>Plains</u></b>\n");
        this.addButton(0, "Explore", kGAMECLASS.plains.explore);
        return false;
    }

    public swampZoneFunc(): boolean {
        this.clearOutput();
        this.outputText("<b><u>Swamp</u></b>\n");
        this.addButton(0, "Explore", kGAMECLASS.swamp.explore);
        return false;
    }

    public bogZoneFunc(): boolean {
        this.clearOutput();
        this.outputText("<b><u>Bog</u></b>\n");
        this.addButton(0, "Explore", kGAMECLASS.bog.explore);
        return false;
    }

    public glacialriftZoneFunc(): boolean {
        this.clearOutput();
        this.outputText("<b><u>Glacial Rift</u></b>\n");
        this.addButton(0, "Explore", kGAMECLASS.glacialRift.explore);
        return false;
    }

    public volcaniccragZoneFunc(): boolean {
        this.clearOutput();
        this.outputText("<b><u>Volcanic Crag</u></b>\n");
        this.addButton(0, "Explore", kGAMECLASS.volcanicCrag.explore);
        return false;
    }

    // Enter town/city
    public visitIngnam(): void {
        this.inRoomedDungeonResume = kGAMECLASS.ingnam.menuIngnam;
        this.inRoomedDungeonResume();
    }

    public visitTelAdre(): void {
        this.inRoomedDungeonResume = kGAMECLASS.telAdre.telAdreMenu;
        this.inRoomedDungeonResume();
    }

    public visitBizarreBazaar(): void {
        this.inRoomedDungeonResume = kGAMECLASS.bazaar.enterTheBazaarAndMenu;
        this.inRoomedDungeonResume();
    }

    public visitOwca(): void {
        this.inRoomedDungeonResume = kGAMECLASS.owca.gangbangVillageStuff;
        this.inRoomedDungeonResume();
    }
}
