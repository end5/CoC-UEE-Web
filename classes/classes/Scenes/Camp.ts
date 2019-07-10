import { kGAMECLASS } from "../GlobalFlags/kGAMECLASS";
import { NPCAwareContent } from "./NPCs/NPCAwareContent";
import { ItemType } from "../ItemType";
import { CabinProgress } from "./Camp/CabinProgress";
import { Codex } from "./Codex";
import { kFLAGS } from "../GlobalFlags/kFLAGS";
import { MainView } from "../../coc/view/MainView";
import { StatusEffects } from "../StatusEffects";
import { PerkLib } from "../PerkLib";
import { rand, int } from "../Extra";
import { PregnancyStore } from "../PregnancyStore";
import { Gender } from "../lists/Gender";
import { IsabellaScene } from "./NPCs/IsabellaScene";
import { kACHIEVEMENTS } from "../GlobalFlags/kACHIEVEMENTS";
import { CockTypesEnum } from "../CockTypesEnum";
import { SpriteDb } from "../display/SpriteDb";
import { ArmorLib } from "../Items/ArmorLib";
import { WeaponLib } from "../Items/WeaponLib";
import { UndergarmentLib } from "../Items/UndergarmentLib";

export class Camp extends NPCAwareContent {
    protected set timeQ(value: number) { kGAMECLASS.timeQ = value; }
    private get campQ(): boolean { return kGAMECLASS.campQ; }
    private set campQ(value: boolean) { kGAMECLASS.campQ = value; }
    protected hasItemInStorage(itype: ItemType): boolean { return kGAMECLASS.inventory.hasItemInStorage(itype); }

    public constructor(campInitialize: any) {
        super();
        campInitialize(this.doCamp); // pass the doCamp function up to CoC. This way doCamp is private but the CoC class itself can call it
    }
    public cabinProgress: CabinProgress = new CabinProgress();
    public codex: Codex = new Codex();

    public returnToCamp(timeUsed: number): void {
        this.clearOutput();
        if (timeUsed == 1) this.outputText("An hour passes...\n");
        else this.outputText(Camp.Num2Text(timeUsed) + " hours pass...\n");
        if (!this.getGame().inCombat) this.spriteSelect(undefined);
        this.hideMenus();
        this.timeQ = timeUsed;
        this.goNext(timeUsed, false);
    }
    public returnToCampUseOneHour(): void { this.returnToCamp(1); } // Replacement for event number 13;
    public returnToCampUseTwoHours(): void { this.returnToCamp(2); } // Replacement for event number 14;
    public returnToCampUseFourHours(): void { this.returnToCamp(4); } // Replacement for event number 15;
    public returnToCampUseEightHours(): void { this.returnToCamp(8); } // Replacement for event number 16;

    // SLEEP_WITH: number = 701;
    // Used to determine scenes if you choose to play joke on them. Should the variables be moved to flags?
    protected izmaJoinsStream: boolean;
    protected marbleJoinsStream: boolean;
    protected heliaJoinsStream: boolean;
    protected amilyJoinsStream: boolean;

    private doCamp(): void { // only called by playerMenu
        if (this.player.slotName != "VOID" && this.mainView.getButtonText(0) != "Game Over" && this.flags[kFLAGS.HARDCORE_MODE] > 0) // Force autosave on HARDCORE MODE! And level-up
            this.getGame().saves.saveGame(this.player.slotName);
        // Make sure gameState is cleared if coming from combat or giacomo
        this.getGame().inCombat = false;
        this.mainView.endCombatView();
        // There were some problems with buttons not being overwritten and bleeding into other scenes
        // No scenes should involve a button from a previous scene with a camp scene in the middle
        this.mainView.clearBottomButtons();
        this.mainView.showMenuButton(MainView.MENU_NEW_MAIN);
        // Prioritize clearing before setting room
        if (this.player.hasStatusEffect(StatusEffects.PostAkbalSubmission)) {
            this.player.removeStatusEffect(StatusEffects.PostAkbalSubmission);
            this.getGame().forest.akbalScene.akbalSubmissionFollowup();
            return;
        }
        if (this.player.hasStatusEffect(StatusEffects.PostAnemoneBeatdown)) {
            this.player.HPChange(Math.round(this.player.maxHP() / 2), false);
            this.player.removeStatusEffect(StatusEffects.PostAnemoneBeatdown);
        }
        this.flags[kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID] = ""; // clear out Izma's saved loot status
        if (this.flags[kFLAGS.HISTORY_PERK_SELECTED] == 0) { // history perk backup
            this.flags[kFLAGS.HISTORY_PERK_SELECTED] = 2;
            this.hideMenus();
            this.getGame().charCreation.chooseHistory();
            return;
        }
        this.fixFlags();
        // Update saves
        if (this.flags[kFLAGS.ERLKING_CANE_OBTAINED] == 0 && this.player.hasKeyItem("Golden Antlers") >= 0) {
            this.clearOutput();
            this.outputText(this.images.showImage("item-gAntlers"));
            this.outputText("Out of nowhere, a cane appears on your " + this.bedDesc() + ". It looks like it once belonged to the Erlking. Perhaps the cane has been introduced into the game and you've committed a revenge on the Erlking? Regardless, you take it anyway. ");
            this.flags[kFLAGS.ERLKING_CANE_OBTAINED] = 1;
            this.inventory.takeItem(this.weapons.HNTCANE, this.doCamp);
            return;
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] < kGAMECLASS.modSaveVersion) {
            this.promptSaveUpdate();
            return;
        }
        // Put player back in Ingnam, prison, or specific zones
        if (this.ingnam.inIngnam) { // Ingnam
            this.getGame().ingnam.menuIngnam();
            return;
        }
        if (this.prison.inPrison && this.flags[kFLAGS.PRISON_ENABLED] == true) { // prison
            this.getGame().prison.prisonRoom(true);
            return;
        }
        else if (this.prison.inPrison && this.flags[kFLAGS.PRISON_ENABLED] == false) {
            this.flags[kFLAGS.IN_PRISON] = 0;
            this.getGame().camp.returnToCamp(0); // just drop ya in camp I guess)
            return;
        }
        if (this.flags[kFLAGS.GRIMDARK_MODE] > 0) {
            this.getGame().dungeons.move(this.getGame().dungeons._currentRoom);
            return;
        }
        if (!this.marbleScene.marbleFollower()) {
            if (this.flags[kFLAGS.MARBLE_LEFT_OVER_CORRUPTION] == 1 && this.player.isPureEnough(40)) {
                this.hideMenus();
                this.marblePurification.pureMarbleDecidesToBeLessOfABitch();
                return;
            }
        }
        if (this.marbleScene.marbleFollower()) {
            // Cor < 50 / No corrupt: Jojo, Amily, or Vapula / Purifying Murble
            if (this.player.isPureEnough(50) && !this.campCorruptJojo() && !this.amilyScene.amilyCorrupt() && !this.vapulaSlave() && this.flags[kFLAGS.MARBLE_PURIFICATION_STAGE] == 0 && this.flags[kFLAGS.MARBLE_COUNTUP_TO_PURIFYING] >= 200 && this.player.findPerk(PerkLib.MarblesMilk) < 0) {
                this.hideMenus();
                this.marblePurification.BLUHBLUH();
                return;
            }
            if (this.flags[kFLAGS.MARBLE_PURIFICATION_STAGE] >= 5) {
                if (this.flags[kFLAGS.MARBLE_WARNED_ABOUT_CORRUPTION] == 0 && !this.player.isPureEnough(50)) {
                    this.hideMenus();
                    this.marblePurification.marbleWarnsPCAboutCorruption();
                    return;
                }
                if (this.flags[kFLAGS.MARBLE_WARNED_ABOUT_CORRUPTION] == 1 && this.flags[kFLAGS.MARBLE_LEFT_OVER_CORRUPTION] == 0 && !this.player.isPureEnough(60)) {
                    this.hideMenus();
                    this.marblePurification.marbleLeavesThePCOverCorruption();
                    return;
                }
            }
            if (this.flags[kFLAGS.MARBLE_RATHAZUL_COUNTER_1] == 1 && (this.time.hours == 6 || this.time.hours == 7)) {
                this.hideMenus();
                this.marblePurification.rathazulsMurbelReport();
                return;
            }
            if (this.flags[kFLAGS.MARBLE_RATHAZUL_COUNTER_2] == 1) {
                this.hideMenus();
                this.marblePurification.claraShowsUpInCampBECAUSESHESACUNT();
                return;
            }
        }
        if (this.arianFollower() && this.flags[kFLAGS.ARIAN_MORNING] == 1) {
            this.hideMenus();
            this.arianScene.wakeUpAfterArianSleep();
            return;
        }
        if (this.arianFollower() && this.flags[kFLAGS.ARIAN_EGG_EVENT] >= 30) {
            this.hideMenus();
            this.arianScene.arianEggingEvent();
            return;
        }
        if (this.arianFollower() && this.flags[kFLAGS.ARIAN_EGG_COUNTER] >= 24 && this.flags[kFLAGS.ARIAN_VAGINA] > 0) {
            this.hideMenus();
            this.arianScene.arianLaysEggs();
            return;
        }
        if (this.flags[kFLAGS.JOJO_BIMBO_STATE] >= 3 && this.flags[kFLAGS.JOY_NIGHT_FUCK] == 1) {
            this.joyScene.wakeUpWithJoyPostFuck();
            return;
        }
        if (this.flags[kFLAGS.EMBER_MORNING] > 0 && ((this.flags[kFLAGS.BENOIT_CLOCK_BOUGHT] > 0 && this.getGame().time.hours >= this.flags[kFLAGS.BENOIT_CLOCK_ALARM]) || (this.flags[kFLAGS.BENOIT_CLOCK_BOUGHT] <= 0 && this.getGame().time.hours >= 6))) {
            this.hideMenus();
            this.emberScene.postEmberSleep();
            return;
        }
        if (this.flags[kFLAGS.JACK_FROST_PROGRESS] > 0) {
            this.hideMenus();
            kGAMECLASS.xmas.jackFrost.processJackFrostEvent();
            return;
        }
        if (this.player.hasKeyItem("Super Reducto") < 0 && this.milkSlave() && this.player.hasStatusEffect(StatusEffects.CampRathazul) && this.player.statusEffectv2(StatusEffects.MetRathazul) >= 4) {
            this.hideMenus();
            this.milkWaifu.ratducto();
            return;
        }
        if (kGAMECLASS.xmas.xmasMisc.nieveHoliday() && this.getGame().time.hours == 6) {
            if (this.player.hasKeyItem("Nieve's Tear") >= 0 && this.flags[kFLAGS.NIEVE_STAGE] != 5) {
                kGAMECLASS.xmas.xmasMisc.returnOfNieve();
                this.hideMenus();
                return;
            }
            else if (this.flags[kFLAGS.NIEVE_STAGE] == 0) {
                this.hideMenus();
                kGAMECLASS.xmas.xmasMisc.snowLadyActive();
                return;
            }
            else if (this.flags[kFLAGS.NIEVE_STAGE] == 4) {
                this.hideMenus();
                kGAMECLASS.xmas.xmasMisc.nieveComesToLife();
                return;
            }
        }
        if (kGAMECLASS.helScene.followerHel()) {
            if (this.helFollower.isHeliaBirthday() && this.flags[kFLAGS.HEL_FOLLOWER_LEVEL] >= 2 && this.flags[kFLAGS.HELIA_BIRTHDAY_OFFERED] == 0) {
                this.hideMenus();
                this.helFollower.heliasBirthday();
                return;
            }
            if (kGAMECLASS.helScene.pregnancy.isPregnant) {
                switch (kGAMECLASS.helScene.pregnancy.eventTriggered()) {
                    case 2: this.hideMenus();
                            this.helSpawnScene.bulgyCampNotice();
                            return;
                    case 3: this.hideMenus();
                            this.helSpawnScene.heliaSwollenNotice();
                            return;
                    case 4: this.hideMenus();
                            this.helSpawnScene.heliaGravidity();
                            return;
                    default:
                        if (kGAMECLASS.helScene.pregnancy.incubation == 0 && (this.getGame().time.hours == 6 || this.getGame().time.hours == 7)) {
                            this.hideMenus();
                            this.helSpawnScene.heliaBirthtime();
                            return;
                        }
                }
            }
        }
        if (this.flags[kFLAGS.HELSPAWN_AGE] == 1 && this.flags[kFLAGS.HELSPAWN_GROWUP_COUNTER] >= 7) {
            this.hideMenus();
            this.helSpawnScene.helSpawnGraduation();
            return;
        }
        if (this.getGame().time.hours >= 10 && this.getGame().time.hours <= 18 && (this.getGame().time.days % 20 == 0 || this.getGame().time.hours == 12) && this.flags[kFLAGS.HELSPAWN_DADDY] == 2 && this.helSpawnScene.helspawnFollower()) {
            this.hideMenus();
            this.helSpawnScene.maiVisitsHerKids();
            return;
        }
        if (this.getGame().time.hours == 6 && this.flags[kFLAGS.HELSPAWN_DADDY] == 1 && this.getGame().time.days % 30 == 0 && this.flags[kFLAGS.SPIDER_BRO_GIFT] == 0 && this.helSpawnScene.helspawnFollower()) {
            this.hideMenus();
            this.helSpawnScene.spiderBrosGift();
            return;
        }
        if (this.getGame().time.hours >= 10 && this.getGame().time.hours <= 18 && (this.getGame().time.days % 15 == 0 || this.getGame().time.hours == 12) && this.helSpawnScene.helspawnFollower() && this.flags[kFLAGS.HAKON_AND_KIRI_VISIT] == 0) {
            this.hideMenus();
            this.helSpawnScene.hakonAndKiriComeVisit();
            return;
        }
        if (this.flags[kFLAGS.HELSPAWN_AGE] == 2 && this.flags[kFLAGS.HELSPAWN_DISCOVER_BOOZE] == 0 && (rand(10) == 0 || this.flags[kFLAGS.HELSPAWN_GROWUP_COUNTER] == 6)) {
            this.hideMenus();
            this.helSpawnScene.helspawnDiscoversBooze();
            return;
        }
        if (this.flags[kFLAGS.HELSPAWN_AGE] == 2 && this.flags[kFLAGS.HELSPAWN_WEAPON] == 0 && this.flags[kFLAGS.HELSPAWN_GROWUP_COUNTER] >= 3 && this.getGame().time.hours >= 10 && this.getGame().time.hours <= 18) {
            this.hideMenus();
            this.helSpawnScene.helSpawnChoosesAFightingStyle();
            return;
        }
        if (this.flags[kFLAGS.HELSPAWN_AGE] == 2 && (this.getGame().time.hours == 6 || this.getGame().time.hours == 7) && this.flags[kFLAGS.HELSPAWN_GROWUP_COUNTER] >= 7 && this.flags[kFLAGS.HELSPAWN_FUCK_INTERRUPTUS] == 1) {
            this.helSpawnScene.helspawnAllGrownUp();
            return;
        }
        if ((this.sophieFollower() || this.bimboSophie()) && this.flags[kFLAGS.SOPHIE_DAUGHTER_MATURITY_COUNTER] == 1) {
            this.flags[kFLAGS.SOPHIE_DAUGHTER_MATURITY_COUNTER] = 0;
            this.sophieBimbo.sophieKidMaturation();
            this.hideMenus();
            return;
        }
        if (this.bimboSophie() && this.flags[kFLAGS.SOPHIE_BROACHED_SLEEP_WITH] == 0 && this.sophieScene.pregnancy.event >= 2) {
            this.hideMenus();
            this.sophieBimbo.sophieMoveInAttempt(); // Bimbo Sophie Move In Request!
            return;
        }
        if (!kGAMECLASS.xmas.xmasMisc.nieveHoliday() && this.getGame().time.hours == 6 && this.flags[kFLAGS.NIEVE_STAGE] > 0) {
            kGAMECLASS.xmas.xmasMisc.nieveIsOver();
            return;
        }
        if (this.flags[kFLAGS.PC_PENDING_PREGGERS] == 1) {
            kGAMECLASS.amilyScene.postBirthingEndChoices(); // Amily followup!
            this.flags[kFLAGS.PC_PENDING_PREGGERS] = 2;
            return;
        }
        if (this.timeQ > 0) {
            if (!this.campQ) {
                this.clearOutput();
                this.outputText("More time passes...\n");
                this.goNext(this.timeQ, false);
                return;
            }
            else {
                if (this.getGame().time.hours < 6 || this.getGame().time.hours > 20) this.doSleep();
                else this.rest();
                return;
            }
        }
        if (this.flags[kFLAGS.FUCK_FLOWER_KILLED] == 0 && this.flags[kFLAGS.CORRUPT_MARAE_FOLLOWUP_ENCOUNTER_STATE] > 0 && (this.flags[kFLAGS.IN_PRISON] == 0 && this.flags[kFLAGS.IN_INGNAM] == 0)) {
            if (this.flags[kFLAGS.FUCK_FLOWER_LEVEL] == 0 && this.flags[kFLAGS.FUCK_FLOWER_GROWTH_COUNTER] >= 8) {
                this.holliScene.getASprout();
                this.hideMenus();
                return;
            }
            if (this.flags[kFLAGS.FUCK_FLOWER_LEVEL] == 1 && this.flags[kFLAGS.FUCK_FLOWER_GROWTH_COUNTER] >= 7) {
                this.holliScene.fuckPlantGrowsToLevel2();
                this.hideMenus();
                return;
            }
            if (this.flags[kFLAGS.FUCK_FLOWER_LEVEL] == 2 && this.flags[kFLAGS.FUCK_FLOWER_GROWTH_COUNTER] >= 25) {
                this.holliScene.flowerGrowsToP3();
                this.hideMenus();
                return;
            }
            if (this.flags[kFLAGS.FUCK_FLOWER_LEVEL] == 3 && this.flags[kFLAGS.FUCK_FLOWER_GROWTH_COUNTER] >= 40) {
                this.holliScene.treePhaseFourGo(); // level 4 growth
                this.hideMenus();
                return;
            }
        }
        if (this.flags[kFLAGS.FUCK_FLOWER_LEVEL] >= 4 && this.flags[kFLAGS.FUCK_FLOWER_KILLED] == 0 && this.player.hasStatusEffect(StatusEffects.PureCampJojo) && this.flags[kFLAGS.JOJO_BIMBO_STATE] < 3) {
            this.holliScene.JojoTransformAndRollOut(); // Jojo treeflips!
            this.hideMenus();
            return;
        }
        if (this.amilyScene.amilyFollower() && !this.amilyScene.amilyCorrupt() && this.flags[kFLAGS.FUCK_FLOWER_LEVEL] >= 4 && this.flags[kFLAGS.FUCK_FLOWER_KILLED] == 0) {
            this.holliScene.amilyHatesTreeFucking(); // Amily flips out
            this.hideMenus();
            return;
        }
        if (this.flags[kFLAGS.FUCK_FLOWER_KILLED] == 1 && this.flags[kFLAGS.AMILY_TREE_FLIPOUT] == 1 && !this.amilyScene.amilyFollower() && this.flags[kFLAGS.AMILY_VISITING_URTA] == 0) {
            this.holliScene.amilyComesBack();
            this.flags[kFLAGS.AMILY_TREE_FLIPOUT] = 2;
            this.hideMenus();
            return;
        }
        if (this.player.hasStatusEffect(StatusEffects.CampAnemoneTrigger)) {
            this.player.removeStatusEffect(StatusEffects.CampAnemoneTrigger);
            this.anemoneScene.anemoneKidBirthPtII(); // anemone birth followup!
            this.hideMenus();
            return;
        }
        if (this.player.statusEffectv1(StatusEffects.Exgartuan) == 1 && (this.player.cockArea(0) < 100 || this.player.cocks.length == 0)) {
            this.exgartuanCampUpdate(); // Exgartuan clearing
            return;
        }
        else if (this.player.statusEffectv1(StatusEffects.Exgartuan) == 2 && this.player.biggestTitSize() < 12) {
            this.exgartuanCampUpdate(); // Exgartuan clearing
            return;
        }
        if (this.isabellaFollower() && this.flags[kFLAGS.ISABELLA_MILKED_YET] >= 10 && this.player.hasKeyItem("Breast Milker - Installed At Whitney's Farm") >= 0) {
            this.isabellaFollowerScene.milktasticLacticLactation(); // Izzys tits asplode
            this.hideMenus();
            return;
        }
        if (this.isabellaFollower() && this.flags[kFLAGS.VALARIA_AT_CAMP] > 0 && this.flags[kFLAGS.ISABELLA_VALERIA_SPARRED] == 0) {
            this.valeria.isabellaAndValeriaSpar(); // Isabella and Valeria sparring
            return;
        }
        if (this.flags[kFLAGS.ISABELLA_MURBLE_BLEH] == 1 && this.isabellaFollower() && this.player.hasStatusEffect(StatusEffects.CampMarble)) {
            this.isabellaFollowerScene.angryMurble(); // Marble meets follower izzy when moving in
            this.hideMenus();
            return;
        }
        if (this.player.pregnancyIncubation <= 280 && this.player.pregnancyType == PregnancyStore.PREGNANCY_COTTON && this.flags[kFLAGS.COTTON_KNOCKED_UP_PC_AND_TALK_HAPPENED] == 0 && (this.getGame().time.hours == 6 || this.getGame().time.hours == 7)) {
            kGAMECLASS.telAdre.cotton.goTellCottonShesAMomDad(); // Cotton preg freakout
            this.hideMenus();
            return;
        }
        if (this.bimboSophie() && this.hasItemInStorage(this.consumables.OVIELIX) && rand(5) == 0 && this.flags[kFLAGS.TIMES_SOPHIE_HAS_DRUNK_OVI_ELIXIR] == 0 && this.player.gender > 0) {
            this.sophieBimbo.sophieEggApocalypse(); // Bimbo Sophie finds ovi elixer in chest!
            this.hideMenus();
            return;
        }
        if (!kGAMECLASS.urtaQuest.urtaBusy() && this.flags[kFLAGS.AMILY_VISITING_URTA] == 0 && rand(10) == 0 && this.flags[kFLAGS.URTA_DRINK_FREQUENCY] >= 0 && this.flags[kFLAGS.URTA_BANNED_FROM_SCYLLA] == 0 && this.flags[kFLAGS.AMILY_NEED_TO_FREAK_ABOUT_URTA] == 1 && this.amilyScene.amilyFollower() && this.flags[kFLAGS.AMILY_FOLLOWER] == 1 && !this.amilyScene.pregnancy.isPregnant) {
            this.finter.amilyUrtaReaction(); // Amily + Urta freakout!
            this.hideMenus();
            return;
        }
        if (this.flags[kFLAGS.JOJO_FIXED_STATUS] == 1 && this.flags[kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO] == 0) {
            this.finter.findJojosNote(); // find jojo's note!
            this.hideMenus();
            return;
        }
        if (this.player.hasStatusEffect(StatusEffects.PureCampJojo) && this.inventory.hasItemInStorage(this.consumables.BIMBOLQ) && this.flags[kFLAGS.BIMBO_LIQUEUR_STASH_COUNTER_FOR_JOJO] >= 72 && this.flags[kFLAGS.JOJO_BIMBO_STATE] == 0) {
            this.joyScene.jojoPromptsAboutThief(); // Bimbo Jojo warning
            this.hideMenus();
            return;
        }
        if (this.player.hasStatusEffect(StatusEffects.PureCampJojo) && this.flags[kFLAGS.BIMBO_LIQUEUR_STASH_COUNTER_FOR_JOJO] >= 24 && this.flags[kFLAGS.JOJO_BIMBO_STATE] == 2) {
            this.joyScene.jojoGetsBimbofied(); // Jojo gets bimbo'ed!
            this.hideMenus();
            return;
        }
        if (this.flags[kFLAGS.JOJO_BIMBO_STATE] >= 3 && this.jojoScene.pregnancy.type == PregnancyStore.PREGNANCY_PLAYER && this.jojoScene.pregnancy.incubation == 0) {
            this.joyScene.joyGivesBirth(); // Joy gives birth!
            return;
        }
        if (this.flags[kFLAGS.RATHAZUL_CORRUPT_JOJO_FREAKOUT] == 0 && rand(5) == 0 && this.player.hasStatusEffect(StatusEffects.CampRathazul) && this.campCorruptJojo()) {
            this.finter.rathazulFreaksOverJojo(); // Rathazul freaks out about jojo
            this.hideMenus();
            return;
        }
        if (this.flags[kFLAGS.IZMA_MARBLE_FREAKOUT_STATUS] == 1) {
            this.izmaScene.newMarbleMeetsIzma(); // Izma/Marble freakout - marble moves in
            this.hideMenus();
            return;
        }
        if (this.flags[kFLAGS.IZMA_AMILY_FREAKOUT_STATUS] == 1) {
            this.izmaScene.newAmilyMeetsIzma(); // Izma/Amily freakout - Amily moves in
            this.hideMenus();
            return;
        }
        if (this.flags[kFLAGS.AMILY_NOT_FREAKED_OUT] == 0 && this.player.hasStatusEffect(StatusEffects.CampMarble) && this.flags[kFLAGS.AMILY_FOLLOWER] == 1 && this.amilyScene.amilyFollower() && this.marbleScene.marbleAtCamp()) {
            this.finter.marbleVsAmilyFreakout(); // Amily/Marble Freakout
            this.hideMenus();
            return;
        }
        // Amily and/or Jojo freakout about Vapula!!
        if (this.vapulaSlave() && ((this.player.hasStatusEffect(StatusEffects.PureCampJojo) && this.flags[kFLAGS.KEPT_PURE_JOJO_OVER_VAPULA] <= 0) || (this.amilyScene.amilyFollower() && !this.amilyScene.amilyCorrupt() && this.flags[kFLAGS.KEPT_PURE_AMILY_OVER_VAPULA] <= 0))) {
            if ((this.player.hasStatusEffect(StatusEffects.PureCampJojo)) && !(this.amilyScene.amilyFollower() && !this.amilyScene.amilyCorrupt()) && this.flags[kFLAGS.KEPT_PURE_JOJO_OVER_VAPULA] == 0) // Jojo but not Amily (Must not be bimbo!)
                this.vapula.mouseWaifuFreakout(false, true);
            else if ((this.amilyScene.amilyFollower() && !this.amilyScene.amilyCorrupt()) && !this.player.hasStatusEffect(StatusEffects.PureCampJojo) && this.flags[kFLAGS.KEPT_PURE_AMILY_OVER_VAPULA] == 0) // Amily but not Jojo
                this.vapula.mouseWaifuFreakout(true, false);
            else // Both
                this.vapula.mouseWaifuFreakout(true, true);
            this.hideMenus();
            return;
        }
        if (this.followerKiha() && this.flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] == 144) {
            this.kihaFollower.kihaTellsChildrenStory();
            return;
        }
        if (this.flags[kFLAGS.HEL_FOLLOWER_LEVEL] == 2 && kGAMECLASS.helScene.followerHel() && this.flags[kFLAGS.HEL_INTROS_LEVEL] == 0) {
            this.helFollower.helFollowersIntro(); // go through Helia's first time move in interactions if you haven't yet
            this.hideMenus();
            return;
        }
        if (this.flags[kFLAGS.HEL_INTROS_LEVEL] > 9000 && kGAMECLASS.helScene.followerHel() && this.isabellaFollower() && this.flags[kFLAGS.HEL_ISABELLA_THREESOME_ENABLED] == 0) {
            this.helFollower.angryHelAndIzzyCampHelHereFirst(); // if you've gone through Hel's first time actions and Issy moves in without being okay with threesomes
            this.hideMenus();
            return;
        }
        // Reset
        this.flags[kFLAGS.CAME_WORMS_AFTER_COMBAT] = 0;
        this.campQ = false;
        if (this.player.hasStatusEffect(StatusEffects.SlimeCravingOutput)) // clear stuff
            this.player.removeStatusEffect(StatusEffects.SlimeCravingOutput);
        this.flags[kFLAGS.PC_CURRENTLY_LUSTSTICK_AFFECTED] = 0; // reset luststick display status (see event parser)
        // Display Proper Buttons
        this.mainView.showMenuButton(MainView.MENU_APPEARANCE);
        this.mainView.showMenuButton(MainView.MENU_PERKS);
        this.mainView.showMenuButton(MainView.MENU_STATS);
        this.mainView.showMenuButton(MainView.MENU_DATA);
        this.showStats();
        // Change settings of new game buttons to go to main menu
        this.mainView.setMenuButton(MainView.MENU_NEW_MAIN, "Main Menu", kGAMECLASS.mainMenu.mainMenu);
        this.mainView.newGameButton.hint("Return to main menu.", "Main Menu");
        this.hideUpDown(); // clear up/down arrows
        if (this.setLevelButton()) return; // level junk
        // Build main menu
        this.clearOutput();
        this.updateAchievements();
        // Player's camp image
        if (this.flags[kFLAGS.CAMP_BUILT_CABIN] > 0) this.outputText(this.images.showImage("camp-cabin"));
        else this.outputText(this.images.showImage("camp-tent"));
        if (this.isabellaFollower()) // Isabella upgrades camp level!
            this.outputText("Your campsite got a lot more comfortable once Isabella moved in.  Carpets cover up much of the barren ground, simple awnings tied to the rocks provide shade, and hand-made wooden furniture provides comfortable places to sit and sleep.  ");
        else { // live in-ness
            if (this.getGame().time.days < 10) this.outputText("Your campsite is fairly simple at the moment.  Your tent and bedroll are set in front of the rocks that lead to the portal.  You have a small fire pit as well.  ");
            if (this.getGame().time.days >= 10 && this.getGame().time.days < 20) this.outputText("Your campsite is starting to get a very 'lived-in' look.  The fire-pit is well defined with some rocks you've arranged around it, and your bedroll and tent have been set up in the area most sheltered by rocks.  ");
            if (this.getGame().time.days >= 20) {
                if (!this.isabellaFollower()) this.outputText("Your new home is as comfy as a camp site can be.  ");
                this.outputText("The fire-pit ");
                if (this.flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] > 0) this.outputText("is ");
                else this.outputText("and tent are both ");
                this.outputText("set up perfectly, and in good repair.  ");
            }
        }
        if (this.getGame().time.days >= 20) this.outputText("You've even managed to carve some artwork into the rocks around the camp's perimeter.\n\n");
        if (this.flags[kFLAGS.CAMP_CABIN_PROGRESS] == 7) this.outputText("There's an unfinished wooden structure. As of right now, it's just frames nailed together.\n\n");
        if (this.flags[kFLAGS.CAMP_CABIN_PROGRESS] == 8) this.outputText("There's an unfinished cabin. It's currently missing windows and door.\n\n");
        if (this.flags[kFLAGS.CAMP_CABIN_PROGRESS] == 9) this.outputText("There's a nearly-finished cabin. It looks complete from the outside but inside, it's missing flooring.\n\n");
        if (this.flags[kFLAGS.CAMP_CABIN_PROGRESS] >= 10) this.outputText("Your cabin is situated near the edge of camp.\n\n");
        if (this.flags[kFLAGS.CLARA_IMPRISONED] > 0) this.marblePurification.claraCampAddition();
        // Nursery
        if (this.flags[kFLAGS.MARBLE_NURSERY_CONSTRUCTION] == 100 && this.player.hasStatusEffect(StatusEffects.CampMarble)) {
            this.outputText("Marble has built a fairly secure nursery amongst the rocks to house your ");
            if (this.flags[kFLAGS.MARBLE_KIDS] == 0) this.outputText("future children");
            else {
                this.outputText(Camp.num2Text(this.flags[kFLAGS.MARBLE_KIDS]) + " child");
                if (this.flags[kFLAGS.MARBLE_KIDS] > 1) this.outputText("ren");
            }
            this.outputText(".\n\n");
        }
        // HARPY ROOKERY
        if (this.flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] > 0) {
            // Small (1 mature daughter)
            if (this.flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] == 1) this.outputText("There's a smallish harpy nest that your daughter has built up with rocks piled high near the fringes of your camp.  It's kind of pathetic, but she seems proud of her accomplishment.  ");
            // Medium (2-3 mature daughters)
            else if (this.flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] <= 3) this.outputText("There's a growing pile of stones built up at the fringes of your camp.  It's big enough to be considered a small hill by this point, dotted with a couple small harpy nests just barely big enough for two.  ");
            // Big (4 mature daughters)
            else if (this.flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] <= 4) this.outputText("The harpy rookery at the edge of camp has gotten pretty big.  It's taller than most of the standing stones that surround the portal, and there's more nests than harpies at this point.  Every now and then you see the four of them managing a boulder they dragged in from somewhere to add to it.  ");
            // Large (5-10 mature daughters)
            else if (this.flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] <= 10) this.outputText("The rookery has gotten quite large.  It stands nearly two stories tall at this point, dotted with nests and hollowed out places in the center.  It's surrounded by the many feathers the assembled harpies leave behind.  ");
            // Giant (11-20 mature daughters)
            else if (this.flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] <= 20) this.outputText("A towering harpy rookery has risen up at the fringes of your camp, filled with all of your harpy brood.  It's at least three stories tall at this point, and it has actually begun to resemble a secure structure.  These harpies are always rebuilding and adding onto it.  ");
            // Massive (21-50 mature daughters)
            else if (this.flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] <= 50) this.outputText("A massive harpy rookery towers over the edges of your camp.  It's almost entirely built out of stones that are fit seamlessly into each other, with many ledges and overhangs for nests.  There's a constant hum of activity over there day or night.  ");
            // Immense (51+ Mature daughters)
            else this.outputText("An immense harpy rookery dominates the edge of your camp, towering over the rest of it.  Innumerable harpies flit around it, always working on it, assisted from below by the few sisters unlucky enough to be flightless.  ");
            this.outputText("\n\n");
        }
        // Traps
        if (this.player.hasStatusEffect(StatusEffects.DefenseCanopy)) this.outputText("A thorny tree has sprouted near the center of the camp, growing a protective canopy of spiky vines around the portal and your camp.  ");
        if (this.flags[kFLAGS.CAMP_WALL_PROGRESS] >= 20 && this.flags[kFLAGS.CAMP_WALL_PROGRESS] < 100) {
            if (this.flags[kFLAGS.CAMP_WALL_PROGRESS] / 20 == 0) this.outputText("A thick wooden wall has been erected to provide a small amount of defense.  ");
            else this.outputText("Thick wooden walls have been erected to provide some defense.  ");
        }
        else if (this.flags[kFLAGS.CAMP_WALL_PROGRESS] >= 100) {
            this.outputText("Thick wooden walls have been erected; they surround one half of your camp perimeter and provide good defense, leaving the another half open for access to the stream.  ");
            if (this.flags[kFLAGS.CAMP_WALL_GATE] > 0) this.outputText("A gate has been constructed in the middle of the walls; it gets closed at night to keep any invaders out.  ");
            if (this.flags[kFLAGS.CAMP_WALL_SKULLS] > 0) {
                if (this.flags[kFLAGS.CAMP_WALL_SKULLS] == 1) this.outputText("A single imp skull has been mounted near the gateway");
                else if (this.flags[kFLAGS.CAMP_WALL_SKULLS] >= 2 && this.flags[kFLAGS.CAMP_WALL_SKULLS] < 5) this.outputText("Few imp skulls have been mounted near the gateway");
                else if (this.flags[kFLAGS.CAMP_WALL_SKULLS] >= 5 && this.flags[kFLAGS.CAMP_WALL_SKULLS] < 15) this.outputText("Several imp skulls have been mounted near the gateway");
                else this.outputText("Many imp skulls decorate the gateway and wall, some even impaled on wooden spikes");
                this.outputText(" to serve as deterrence.  ");
                if (this.flags[kFLAGS.CAMP_WALL_SKULLS] == 1) this.outputText("There is currently one skull.  ");
                else this.outputText("There are currently " + Camp.num2Text(this.flags[kFLAGS.CAMP_WALL_SKULLS]) + " skulls.  ");
            }
            if (this.flags[kFLAGS.CAMP_WALL_STATUES] > 0) {
                if (this.flags[kFLAGS.CAMP_WALL_STATUES] == 1) this.output.text("Looking around the perimeter of your camp you spy a single marble imp statue.  ");
                else this.output.text("Dotted around and on the wall that surrounds your camp you spy " + Camp.num2Text(this.flags[kFLAGS.CAMP_WALL_STATUES]) + " marble imp statues.  ");
            }
            this.outputText("\n\n");
        }
        else this.outputText("You have a number of traps surrounding your makeshift home, but they are fairly simple and may not do much to deter a demon.  ");
        this.outputText("The portal shimmers in the background as it always does, looking menacing and reminding you of why you came.");
        if (this.flags[kFLAGS.ANT_KIDS] > 1000) this.outputText(" Really close to it there is a small entrance to the underground maze created by your ant children. And due to Phylla wish from time to time one of your children coming out this entrance to check on the situation near portal. You feel a little more safe now knowing that it will be harder for anyone to go near the portal without been noticed or...if someone came out of the portal.");
        this.outputText("\n\n");
        if (this.flags[kFLAGS.EMBER_CURRENTLY_FREAKING_ABOUT_MINOCUM] == 1) { // Ember's anti-minotaur crusade!
            // Modified Camp Description
            this.outputText("Since Ember began " + this.emberMF("his", "her") + " 'crusade' against the minotaur population, skulls have begun to pile up on either side of the entrance to " + this.emberScene.emberMF("his", "her") + " den.  There're quite a lot of them.\n\n");
        }
        if (this.flags[kFLAGS.FUCK_FLOWER_LEVEL] >= 4 && this.flags[kFLAGS.FUCK_FLOWER_KILLED] == 0) // dat tree!
            this.outputText("On the outer edges, half-hidden behind a rock, is a large, very healthy tree.  It grew fairly fast, but seems to be fully developed now.  Holli, Marae's corrupt spawn, lives within.\n\n");
        this.campFollowers(true); // display NPCs
        // MOUSEBITCH
        if (this.amilyScene.amilyFollower() && this.flags[kFLAGS.AMILY_FOLLOWER] == 1) {
            if (this.flags[kFLAGS.FUCK_FLOWER_LEVEL] >= 4 && this.flags[kFLAGS.FUCK_FLOWER_KILLED] == 0) this.outputText("Amily has relocated her grass bedding to the opposite side of the camp from the strange tree; every now and then, she gives it a suspicious glance, as if deciding whether to move even further.\n\n");
            else this.outputText("A surprisingly tidy nest of soft grasses and sweet-smelling herbs has been built close to your " + (this.flags[kFLAGS.CAMP_BUILT_CABIN] > 0 ? "cabin" : "bedroll") + ". A much-patched blanket draped neatly over the top is further proof that Amily sleeps here. She changes the bedding every few days, to ensure it stays as nice as possible.\n\n");
        }
        this.campLoversMenu(true); // display Lovers
        this.campSlavesMenu(true); // display Slaves
        if (this.flags[kFLAGS.HUNGER_ENABLED] > 0 && this.player.hunger < 25) { // hunger check!
            this.outputText("<b>You have to eat something; your stomach is growling " + (this.player.hunger < 1 ? "painfully" : "loudly") + ". </b>");
            if (this.player.hunger < 10) this.outputText("<b>You are getting thinner and you're losing muscles. </b>");
            if (this.player.hunger <= 0) this.outputText("<b>You are getting weaker due to starvation. </b>");
            this.outputText("\n\n");
        }
        if (this.player.lust >= this.player.maxLust()) { // the uber horny
            if (this.player.hasStatusEffect(StatusEffects.Dysfunction)) this.outputText("<b>You are debilitatingly aroused, but your sexual organs are so numbed the only way to get off would be to find something tight to fuck or get fucked...</b>\n\n");
            else if (this.flags[kFLAGS.UNABLE_TO_MASTURBATE_BECAUSE_CENTAUR] > 0 && this.player.isTaur()) this.outputText("<b>You are delibitatingly aroused, but your sex organs are so difficult to reach that masturbation isn't at the forefront of your mind.</b>\n\n");
            else {
                this.outputText("<b>You are debilitatingly aroused, and can think of doing nothing other than masturbating.</b>\n\n");
                // This once disabled the ability to rest, sleep or wait, but ir hasn't done that for many many builds
            }
        }
        // Set up rest stuff
        if (this.getGame().time.hours < 6 || this.getGame().time.hours > 20) { // night
            if (this.flags[kFLAGS.GAME_END] == 0) this.outputText("It is dark out, made worse by the lack of stars in the sky.  A blood-red moon hangs in the sky, seeming to watch you, but providing little light. It's far too dark to leave camp.\n\n"); // Lethice not defeated
            else { // Lethice defeated, proceed with weather
                switch (this.flags[kFLAGS.CURRENT_WEATHER]) {
                    case 0:
                    case 1: this.outputText("It is dark out. Stars dot the night sky. A blood-red moon hangs in the sky, seeming to watch you, but providing little light. It's far too dark to leave camp.\n\n"); break;
                    case 2: this.outputText("It is dark out. The sky is covered by clouds and you could faintly make out the red spot in the clouds which is presumed to be the moon. It's far too dark to leave camp.\n\n"); break;
                    case 3: this.outputText("It is dark out. The sky is covered by clouds raining water upon the ground. It's far too dark to leave camp.\n\n"); break;
                    case 4: this.outputText("It is dark out. The sky is covered by clouds raining water upon the ground and occasionally the sky flashes with lightning. It's far too dark to leave camp.\n\n"); break;
                    default: this.outputText("It is dark out. Stars dot the night sky. A blood-red moon hangs in the sky, seeming to watch you, but providing little light. It's far too dark to leave camp.\n\n");
                }
            }
            if (this.companionsCount() > 0 && !(this.getGame().time.hours > 4 && this.getGame().time.hours < 23))
                this.outputText("Your camp is silent as your companions are sleeping right now.\n");
        }
        else { // day time!
            if (this.flags[kFLAGS.GAME_END] > 0) { // Lethice defeated
                switch (this.flags[kFLAGS.CURRENT_WEATHER]) {
                    case 0: this.outputText("The sun shines brightly, illuminating the now-blue sky. "); break;
                    case 1: this.outputText("The sun shines brightly, illuminating the now-blue sky. Occasional clouds dot the sky, appearing to form different shapes. "); break;
                    case 2: this.outputText("The sky is light gray as it's covered by the clouds. "); break;
                    case 3: this.outputText("The sky is fairly dark as it's covered by the clouds that rain water upon the lands. "); break;
                    case 4: this.outputText("The sky is dark as it's thick with dark grey clouds that rain and occasionally the sky flashes with lightning. "); break;
                    default: this.outputText("The sky is black and flashing green 0's and 1's, seems like the weather is broken! "); break;
                }
            }
            if (this.getGame().time.hours == 19) {
                if (this.flags[kFLAGS.CURRENT_WEATHER] < 2) this.outputText("The sun is close to the horizon, getting ready to set. ");
                else this.outputText("Though you cannot see the sun, the sky near the horizon began to glow orange. ");
            }
            if (this.getGame().time.hours == 20) {
                if (this.flags[kFLAGS.CURRENT_WEATHER] < 2) this.outputText("The sun has already set below the horizon. The sky glows orange. ");
                else this.outputText("Even with the clouds, the sky near the horizon is glowing bright orange. The sun may have already set at this point. ");
            }
            this.outputText("It's light outside, a good time to explore and forage for supplies with which to fortify your camp.\n");
        }
        // Weather!
        if (this.flags[kFLAGS.CAMP_CABIN_PROGRESS] <= 0 && this.getGame().time.days >= 14) {
            this.flags[kFLAGS.CAMP_CABIN_PROGRESS] = 1; // unlock cabin
            this.clearOutput();
            this.outputText(this.images.showImage("camp-dream"));
            this.outputText("You realize that you have spent two weeks sleeping in tent every night. You think of something so you can sleep nicely and comfortably. Perhaps a cabin will suffice?");
            this.doNext(this.playerMenu);
            return;
        }
        if (this.flags[kFLAGS.NEW_GAME_PLUS_BONUS_UNLOCKED_HERM] == 0) {
            if (this.player.gender == Gender.HERM) {
                this.flags[kFLAGS.NEW_GAME_PLUS_BONUS_UNLOCKED_HERM] = 1; // unlock something in character creation
                this.outputText("\n\n<b>Congratulations! You have unlocked hermaphrodite option on character creation, accessible from New Game Plus!</b>");
                kGAMECLASS.saves.savePermObject(false);
            }
        }
        this.dynStats(); // workaround for #484 'statbars do not fit in their place'
        this.menu(); // menu
        this.addButton(0, "Explore", this.getGame().exploration.doExplore).hint("Explore to find new regions and visit any discovered regions.");
        this.addButton(1, "Places", this.places).hint("Visit any places you have discovered so far.").disableIf(this.placesKnown() <= 0, "You haven't discovered any places yet...");
        this.addButton(2, "Inventory", this.inventory.inventoryMenu).hint("The inventory allows you to use an item.  Be careful as this leaves you open to a counterattack when in combat.");
        this.addButton(3, "Stash", this.inventory.stash).hint("The stash allows you to store your items safely until you need them later.").disableIf(!this.inventory.showStash(), "You currently don't have any form of storage with you.");
        this.addButton(4, "Camp Actions", this.campActions).hint("Interact with the camp surroundings and also read your codex.");
        if (this.followersCount() > 0) this.addButton(5, "Followers", this.campFollowers).hint("Check up on any followers or companions who are joining you in or around your camp.  You'll probably just end up sleeping with them.");
        if (this.loversCount() > 0) this.addButton(6, "Lovers", this.campLoversMenu).hint("Check up on any lovers you have invited so far to your camp and interact with them.");
        if (this.slavesCount() > 0) this.addButton(7, "Slaves", this.campSlavesMenu).hint("Check up on any slaves you have received and interact with them.");
        const canFap: boolean = !this.player.hasStatusEffect(StatusEffects.Dysfunction) && (this.flags[kFLAGS.UNABLE_TO_MASTURBATE_BECAUSE_CENTAUR] == 0 && !this.player.isTaur());
        this.getGame().masturbation.setMasturbateButton();
        this.addButton(9, "Wait", this.doWait).hint("Wait for four hours.\n\nShift-click to wait until the night comes.");
        if (this.player.fatigue > 40 || this.player.HP / this.player.maxHP() <= .9) this.addButton(9, "Rest", this.rest).hint("Rest for four hours.\n\nShift-click to rest until fully healed or night comes.");
        if (this.getGame().time.hours >= 21 || this.getGame().time.hours < 6) this.addButton(9, "Sleep", this.doSleep).hint("Turn yourself in for the night.");
        if (this.isAprilFools())
            this.addButton(12, "Cash Shop", this.getGame().aprilFools.pay2WinSelection).hint("Need more gems? Want to buy special items to give you the edge? Purchase with real money!");
        // Remove buttons according to conditions
        if (this.getGame().time.hours >= 21 || this.getGame().time.hours < 6) {
            this.addDisabledButton(0, kGAMECLASS.output.getButtonText(0), "It's too dark outside. It wouldn't be a good idea to explore when danger lurks in every corner of darkness."); // Explore
            this.addDisabledButton(1, kGAMECLASS.output.getButtonText(1), "It's too dark outside. It wouldn't be a good idea to explore when danger lurks in every corner of darkness."); // Explore
            if (this.getGame().time.hours >= 23 || this.getGame().time.hours < 5) {
                this.addDisabledButton(4, kGAMECLASS.output.getButtonText(4), "You are too tired to perform any camp actions. All you can do right now is to sleep until morning."); // Camp Actions
                if (this.followersCount() > 0) this.addDisabledButton(5, kGAMECLASS.output.getButtonText(5), "Your followers are sleeping at the moment."); // Followers
                if (this.loversCount() > 0) this.addDisabledButton(6, kGAMECLASS.output.getButtonText(6), "Your lovers are sleeping at the moment."); // Followers
                if (this.slavesCount() > 0) this.addDisabledButton(7, kGAMECLASS.output.getButtonText(7), "Your slaves are sleeping at the moment. Even slaves need their sleepy times to recuperate."); // Followers
            }
        }
        if (this.player.lust >= this.player.maxLust() && canFap) {
            this.addDisabledButton(0, "Explore", "You are too aroused to consider leaving the camp. It wouldn't be a good idea to explore with all that tension bottled up inside you!"); // Explore
            this.addDisabledButton(1, "Places", "You are too aroused to consider leaving the camp. It wouldn't be a good idea to explore with all that tension bottled up inside you!"); // Explore
        }
        if (this.flags[kFLAGS.HUNGER_ENABLED] >= 1 && this.player.ballSize > (18 + (this.player.str / 2) + (this.player.tallness / 4))) {
            this.badEndGIANTBALLZ(); // Massive Balls Bad End (Realistic Mode only)
            return;
        }
        if (this.flags[kFLAGS.HUNGER_ENABLED] > 0 && this.player.hunger <= 0) {
            if (this.player.HP <= 0 && (this.player.str + this.player.tou) < 30) { // bad end at 0 HP!
                this.badEndHunger(); // Hunger Bad End
                return;
            }
        }
        if (this.player.minLust() >= this.player.maxLust() && !this.flags[kFLAGS.SHOULDRA_SLEEP_TIMER] <= 168 && !this.player.eggs() >= 20 && !this.player.hasStatusEffect(StatusEffects.BimboChampagne) && !this.player.hasStatusEffect(StatusEffects.Luststick) && this.player.jewelryEffectId != 1) {
            this.badEndMinLust(); // Min Lust Bad End (Must not have any removable/temporary min lust)
            return;
        }
    }

    public hasCompanions(): boolean { return this.companionsCount() > 0; }
    public companionsCount(): number { return this.followersCount() + this.slavesCount() + this.loversCount(); }
    public followersCount(): number {
        let counter: number = 0;
        if (this.emberScene.followerEmber()) counter++;
        if (this.flags[kFLAGS.VALARIA_AT_CAMP] == 1 || this.player.armor == this.armors.GOOARMR) counter++;
        if (this.player.hasStatusEffect(StatusEffects.PureCampJojo)) counter++;
        if (this.player.hasStatusEffect(StatusEffects.CampRathazul)) counter++;
        if (this.followerShouldra()) counter++;
        if (this.sophieFollower() && this.flags[kFLAGS.FOLLOWER_AT_FARM_SOPHIE] == 0) counter++;
        if (this.helspawnFollower()) counter++;
        return counter;
    }

    public slavesCount(): number {
        let counter: number = 0;
        if (this.latexGooFollower() && this.flags[kFLAGS.FOLLOWER_AT_FARM_LATEXY] == 0) counter++;
        if (this.vapulaSlave() && this.flags[kFLAGS.FOLLOWER_AT_FARM_VAPULA] == 0) counter++;
        if (this.campCorruptJojo() && this.flags[kFLAGS.FOLLOWER_AT_FARM_JOJO] == 0) counter++;
        if (this.amilyScene.amilyFollower() && this.amilyScene.amilyCorrupt() && this.flags[kFLAGS.FOLLOWER_AT_FARM_AMILY] == 0) counter++;
        if (this.bimboSophie() && this.flags[kFLAGS.FOLLOWER_AT_FARM_SOPHIE] == 0) counter++; // Bimbo Sophie
        if (this.ceraphIsFollower()) counter++;
        if (this.milkSlave() && this.flags[kFLAGS.FOLLOWER_AT_FARM_BATH_GIRL] == 0) counter++;
        return counter;
    }

    public loversCount(): number {
        let counter: number = 0;
        if (this.arianScene.arianFollower()) counter++;
        if (this.followerHel()) counter++;
        if (this.flags[kFLAGS.IZMA_FOLLOWER_STATUS] == 1 && this.flags[kFLAGS.FOLLOWER_AT_FARM_IZMA] == 0) counter++; // Izma!
        if (this.isabellaFollower() && this.flags[kFLAGS.FOLLOWER_AT_FARM_ISABELLA] == 0) counter++;
        if (this.player.hasStatusEffect(StatusEffects.CampMarble) && this.flags[kFLAGS.FOLLOWER_AT_FARM_MARBLE] == 0) counter++;
        if (this.amilyScene.amilyFollower() && !this.amilyScene.amilyCorrupt()) counter++;
        if (this.followerKiha()) counter++;
        if (this.flags[kFLAGS.NIEVE_STAGE] == 5) counter++;
        if (this.flags[kFLAGS.ANT_WAIFU] > 0) counter++;
        return counter;
    }
    // ----------------- COMPANIONS -----------------
    public campLoversMenu(descOnly: boolean = false): void {
        if (!descOnly) {
            this.hideMenus();
            this.spriteSelect(undefined);
            this.clearOutput();
            this.getGame().inCombat = false;
            this.menu();
        }
        if (this.isAprilFools() && this.flags[kFLAGS.DLC_APRIL_FOOLS] == 0 && !descOnly) {
            this.outputText(this.images.showImage("event-dlc"));
            this.getGame().aprilFools.DLCPrompt("Lovers DLC", "Get the Lovers DLC to be able to interact with them and have sex! Start families! The possibilities are endless!", "$4.99", this.doCamp);
            return;
        }
        // AMILY
        if (this.amilyScene.amilyFollower() && this.flags[kFLAGS.AMILY_FOLLOWER] == 1 && this.flags[kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO] == 0 && !descOnly) {
            this.outputText("Amily is currently strolling around your camp, ");
            this.temp = rand(6);
            if (this.temp == 0) {
                this.outputText("dripping water and stark naked from a bath in the stream");
                if (this.player.hasStatusEffect(StatusEffects.CampRathazul)) this.outputText(".  Rathazul glances over and immediately gets a nosebleed");
            }
            else if (this.temp == 1) this.outputText("slouching in the shade of some particularly prominent rocks, whittling twigs to create darts for her blowpipe");
            else if (this.temp == 2) this.outputText("dipping freshly-made darts into a jar of something that looks poisonous");
            else if (this.temp == 3) this.outputText("eating some of your supplies");
            else if (this.temp == 4) this.outputText("and she flops down on her nest to have a rest");
            else this.outputText("peeling the last strips of flesh off of an imp's skull and putting it on a particularly flat, sun-lit rock to bleach as a trophy");
            this.outputText(".\n\n");
            this.addButton(0, "Amily", this.amilyScene.amilyFollowerEncounter);
        }
        else if (this.flags[kFLAGS.AMILY_VISITING_URTA] == 1 || this.flags[kFLAGS.AMILY_VISITING_URTA] == 2) // Amily out freaking Urta?
            this.outputText("Amily's bed of grass and herbs lies empty, the mouse-woman still absent from her sojourn to meet your other lover.\n\n");
        // Arian
        if (this.arianScene.arianFollower()) {
            this.outputText("Arian's tent is here, if you'd like to go inside.\n\n");
            this.addButton(1, "Arian", this.arianScene.visitAriansHouse);
        }
        // Helia
        if (kGAMECLASS.helScene.followerHel()) {
            if (this.flags[kFLAGS.HEL_FOLLOWER_LEVEL] == 2) {
                // Hel @ Camp: Follower Menu
                if (this.getGame().time.hours <= 7) // 6-7
                    this.outputText("Hel is currently sitting at the edge of camp, surrounded by her scraps of armor, sword, and a few half-empty bottles of vodka.  By the way she's grunting and growling, it looks like she's getting ready to flip her shit and go running off into the plains in her berserker state.\n\n");
                else if (this.getGame().time.hours <= 17) // 8a-5p
                    this.outputText("Hel's out of camp at the moment, adventuring on the plains.  You're sure she'd be on hand in moments if you needed her, though.\n\n");
                else if (this.getGame().time.hours <= 19) // 5-7
                    this.outputText("Hel's out visiting her family in Tel'Adre right now, though you're sure she's only moments away if you need her.\n\n");
                else // 7+
                    this.outputText("Hel is fussing around her hammock, checking her gear and sharpening her collection of blades.  Each time you glance her way, though, the salamander puts a little extra sway in her hips and her tail wags happily.\n\n");
            }
            else if (this.flags[kFLAGS.HEL_FOLLOWER_LEVEL] == 1) {
                if (this.flags[kFLAGS.HEL_HARPY_QUEEN_DEFEATED] == 1) this.outputText("Hel has returned to camp, though for now she looks a bit bored.  Perhaps she is waiting on something.\n\n");
                else this.outputText("<b>You see the salamander Helia pacing around camp, anxiously awaiting your departure to the harpy roost. Seeing you looking her way, she perks up, obviously ready to get underway.</b>\n\n");
            }
            this.addButton(2, "Helia", this.helFollower.heliaFollowerMenu);
        }
        // Isabella
        if (this.isabellaFollower() && this.flags[kFLAGS.FOLLOWER_AT_FARM_ISABELLA] == 0) {
            if (this.getGame().time.hours >= 21 || this.getGame().time.hours <= 5) this.outputText("Isabella is sound asleep in her bunk and quietly snoring.");
            else if (this.getGame().time.hours == 6) this.outputText("Isabella is busy eating some kind of grain-based snack for breakfast.  The curly-haired cow-girl gives you a smile when she sees you look her way.");
            else if (this.getGame().time.hours == 7) this.outputText("Isabella, the red-headed cow-girl, is busy with a needle and thread, fixing up some of her clothes.");
            else if (this.getGame().time.hours == 8) this.outputText("Isabella is busy cleaning up the camp, but when she notices you looking her way, she stretches up and arches her back, pressing eight bullet-hard nipples into the sheer silk top she prefers to wear.");
            else if (this.getGame().time.hours == 9) this.outputText("Isabella is out near the fringes of your campsite.  She has her massive shield in one hand and appears to be keeping a sharp eye out for intruders or demons.  When she sees you looking her way, she gives you a wave.");
            else if (this.getGame().time.hours == 10) this.outputText("The cow-girl warrioress, Isabella, is sitting down on a chair and counting out gems from a strange pouch.  She must have defeated someone or something recently.");
            else if (this.getGame().time.hours == 11) this.outputText("Isabella is sipping from a bottle labelled 'Lactaid' in a shaded corner.  When she sees you looking she blushes, though dark spots appear on her top and in her skirt's middle.");
            else if (this.getGame().time.hours == 12) this.outputText("Isabella is cooking a slab of meat over the fire.  From the smell that's wafting this way, you think it's beef.  Idly, you wonder if she realizes just how much like her chosen food animal she has become.");
            else if (this.getGame().time.hours == 13) {
                this.outputText("Isabella ");
                const izzyCreeps: any[] = [];
                // Build array of choices for izzy to talk to
                if (this.player.hasStatusEffect(StatusEffects.CampRathazul)) izzyCreeps[izzyCreeps.length] = 0;
                if (this.player.hasStatusEffect(StatusEffects.PureCampJojo)) izzyCreeps[izzyCreeps.length] = 1;
                if (this.amilyScene.amilyFollower() && this.flags[kFLAGS.AMILY_FOLLOWER] == 1 && this.flags[kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO] == 0) izzyCreeps[izzyCreeps.length] = 2;
                if (this.amilyScene.amilyFollower() && this.flags[kFLAGS.AMILY_FOLLOWER] == 2 && this.flags[kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO] == 0 && this.flags[kFLAGS.FOLLOWER_AT_FARM_AMILY] == 0) izzyCreeps[izzyCreeps.length] = 3;
                if (this.flags[kFLAGS.IZMA_FOLLOWER_STATUS] == 1 && this.flags[kFLAGS.FOLLOWER_AT_FARM_IZMA] == 0) izzyCreeps[izzyCreeps.length] = 4;
                // Base choice - book
                izzyCreeps[izzyCreeps.length] = 5;
                // Select!
                const choice: number = rand(izzyCreeps.length);
                if (izzyCreeps[choice] == 0) this.outputText("is sitting down with Rathazul, chatting amiably about the weather.");
                else if (izzyCreeps[choice] == 1) this.outputText("is sitting down with Jojo, smiling knowingly as the mouse struggles to keep his eyes on her face.");
                else if (izzyCreeps[choice] == 2) this.outputText("is talking with Amily, sharing stories of the fights she's been in and the enemies she's faced down.  Amily seems interested but unimpressed.");
                else if (izzyCreeps[choice] == 3) this.outputText("is sitting down chatting with Amily, but the corrupt mousette is just staring at Isabella's boobs and masturbating.  The cow-girl is pretending not to notice.");
                else if (izzyCreeps[choice] == 4) this.outputText("is sitting down with Izma and recounting some stories, somewhat nervously.  Izma keeps flashing her teeth in a predatory smile.");
                else this.outputText("is sitting down and thumbing through a book.");
            }
            else if (this.getGame().time.hours == 14) this.outputText("Isabella is working a grindstone and sharpening her tools.  She even hones the bottom edge of her shield into a razor-sharp cutting edge.  The cow-girl is sweating heavily, but it only makes the diaphanous silk of her top cling more alluringly to her weighty chest.");
            else if (this.getGame().time.hours == 15) this.outputText("The warrior-woman, Isabella is busy constructing dummies of wood and straw, then destroying them with vicious blows from her shield.  Most of the time she finishes by decapitating them with the sharp, bottom edge of her weapon.  She flashes a smile your way when she sees you.");
            else if (this.getGame().time.hours == 16) this.outputText("Isabella is sitting down with a knife, the blade flashing in the sun as wood shavings fall to the ground.  Her hands move with mechanical, practiced rhythm as she carves a few hunks of shapeless old wood into tools or art.");
            else if (this.getGame().time.hours == 17) this.outputText("Isabella is sitting against one of the large rocks near the outskirts of your camp, staring across the wasteland while idly munching on what you assume to be a leg of lamb.  She seems lost in thought, though that doesn't stop her from throwing a wink and a goofy food-filled grin toward you.");
            else if (this.getGame().time.hours == 18) this.outputText("The dark-skinned cow-girl, Isabella, is sprawled out on a carpet and stretching.  She seems surprisingly flexible for someone with hooves and oddly-jointed lower legs.");
            else if (this.getGame().time.hours == 19) {
                if (this.flags[kFLAGS.ISABELLA_MILKED_YET] == -1) // Izzy Milked Yet flag = -1
                    this.outputText("Isabella has just returned from a late visit to Whitney's farm, bearing a few filled bottles and a small pouch of gems.");
                else this.outputText("Isabella was hidden behind a rock when you started looking for her, but as soon as you spot her in the darkness, she jumps, a guilty look flashing across her features.  She turns around and adjusts her top before looking back your way, her dusky skin even darker from a blush.  The cow-girl gives you a smile and walks back to her part of camp.  A patch of white decorates the ground where she was standing - is that milk?  Whatever it is, it's gone almost as fast as you see it, devoured by the parched, wasteland earth.");
            }
            else if (this.getGame().time.hours == 20) this.outputText("Your favorite chocolate-colored cowgirl, Isabella, is moving about, gathering all of her scattered belongings and replacing them in her personal chest.  She yawns more than once, indicating her readiness to hit the hay, but her occasional glance your way lets you know she wouldn't mind some company before bed.");
            else this.outputText("Isabella looks incredibly bored right now.");
            if (this.isabellaScene.totalIsabellaChildren() > 0) {
                const babiesList: any[] = [];
                if (this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_BOYS) > 0) babiesList.push((this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_BOYS) == 1 ? "a" : Camp.num2Text(this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_BOYS))) + " human son" + (this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_BOYS) == 1 ? "" : "s"));
                if (this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_GIRLS) > 0) babiesList.push((this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_GIRLS) == 1 ? "a" : Camp.num2Text(this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_GIRLS))) + " human daughter" + (this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_GIRLS) == 1 ? "" : "s"));
                if (this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_HERMS) > 0) babiesList.push((this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_HERMS) == 1 ? "a" : Camp.num2Text(this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_HERMS))) + " human herm" + (this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_HERMS) == 1 ? "" : "s"));
                if (this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWGIRLS) > 0) babiesList.push((this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWGIRLS) == 1 ? "a" : Camp.num2Text(this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWGIRLS))) + " cow girl" + (this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWGIRLS) == 1 ? "" : "s"));
                if (this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWFUTAS) > 0) babiesList.push((this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWFUTAS) == 1 ? "a" : Camp.num2Text(this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWFUTAS))) + " cow herm" + (this.isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWFUTAS) == 1 ? "" : "s"));
                this.outputText("  Isabella has set up a small part of her \"corner\" in the camp as a nursery. She has sawn a " + (Math.ceil(this.isabellaScene.totalIsabellaChildren() / 2) == 1 ? "barrel" : "number of barrels") + " in half and lined " + (Math.ceil(this.isabellaScene.totalIsabellaChildren() / 2) == 1 ? "it" : "them") + " with blankets and pillows to serve as rocking cribs. ");
                this.outputText("You have " + Camp.formatStringArray(babiesList) + " with her, all living here; unlike native Marethians, they will need years and years of care before they can go out into the world on their own.");
            }
            this.outputText("\n\n");
            this.addButton(3, "Isabella", this.isabellaFollowerScene.callForFollowerIsabella);
        }
        // Izma
        if (this.izmaFollower() && this.flags[kFLAGS.FOLLOWER_AT_FARM_IZMA] == 0) {
            if (this.flags[kFLAGS.IZMA_BROFIED] > 0) {
                if (rand(6) == 0 && this.camp.vapulaSlave() && this.flags[kFLAGS.VAPULA_HAREM_FUCK] > 0) this.outputText("Izmael is standing a short distance away with an expression of unadulterated joy on his face, Vapula knelt in front of him and fellating him with noisy enthusiasm.  The shark morph dreamily opens his eyes to catch you staring, and proceeds to give you a huge grin and two solid thumbs up.");
                else if (this.getGame().time.hours >= 6 && this.getGame().time.hours <= 12) this.outputText("You keep hearing the sound of objects hitting water followed by peals of male laughter coming from the stream. It sounds as if Izmael is throwing large rocks into the stream and finding immense gratification from the results. In fact, you’re pretty sure that’s exactly what he’s doing.");
                else if (this.getGame().time.hours <= 16) this.outputText("Izmael is a short distance away doing squat thrusts, his body working like a piston, gleaming with sweat. He keeps bobbing his head up to see if anybody is watching him.");
                else if (this.getGame().time.hours <= 19) this.outputText("Izmael is sat against his book chest, masturbating furiously without a care in the world. Eyes closed, both hands pumping his immense shaft, there is an expression of pure, childish joy on his face.");
                else if (this.getGame().time.hours <= 22) this.outputText("Izmael has built a fire and is flopped down next to it. You can’t help but notice that he’s used several of his books for kindling. His eyes are locked on the flames, mesmerized by the dancing light and heat.");
                else this.outputText("Izmael is currently on his bedroll, sleeping for the night.");
                this.outputText("\n\n");
                this.addButton(4, "Izmael", this.izmaScene.izmaelScene.izmaelMenu);
            }
            else {
                this.outputText("Neatly laid near the base of your own is a worn bedroll belonging to Izma, your tigershark lover. It's a snug fit for her toned body, though it has some noticeable cuts and tears in the fabric. Close to her bed is her old trunk, almost as if she wants to have it at arms length if anyone tries to rob her in her sleep.\n\n");
                switch (rand(3)) {
                    case 0: this.outputText("Izma's lazily sitting on the trunk beside her bedroll, reading one of the many books from inside it. She smiles happily when your eyes linger on her, and you know full well she's only half-interested in it."); break;
                    case 1: this.outputText("You notice Izma isn't around right now. She's probably gone off to the nearby stream to get some water. Never mind, she comes around from behind a rock, still dripping wet."); break;
                    case 2: this.outputText("Izma is lying on her back near her bedroll. You wonder at first just why she isn't using her bed, but as you look closer you notice all the water pooled beneath her and the few droplets running down her arm, evidence that she's just returned from the stream."); break;
                    default: // This line shouldn't happen, move along!
                }
                this.outputText("\n\n");
                this.addButton(4, "Izma", this.izmaScene.izmaFollowerMenu);
            }
        }
        // Kiha!
        if (this.followerKiha()) {
            if (this.getGame().time.hours < 7) // 6-7
                this.outputText("Kiha is sitting near the fire, her axe laying across her knees as she polishes it.\n\n");
            else if (this.getGame().time.hours < 19) {
                if (this.kihaFollower.totalKihaChildren() > 0 && this.flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] > 160 && (this.flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] % 3 == 0 || this.getGame().time.hours == 17)) this.outputText("Kiha is breastfeeding her offspring right now.\n\n");
                else if (this.kihaFollower.totalKihaChildren() > 0 && this.flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] > 80 && this.flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] <= 160 && (this.flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] % 7 == 0 || this.getGame().time.hours == 17)) this.outputText("Kiha is telling stories to her draconic child" + (this.kihaFollower.totalKihaChildren() == 1 ? "" : "ren") + " right now.\n\n");
                else this.outputText("Kiha's out right now, likely patrolling for demons to exterminate.  You're sure a loud call could get her attention.\n\n");
            }
            else {
                if (this.kihaFollower.totalKihaChildren() > 0 && this.flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] > 160 && (this.flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] % 3 == 0 || this.getGame().time.hours == 20)) this.outputText("Kiha is breastfeeding her offspring right now.\n\n");
                else if (this.kihaFollower.totalKihaChildren() > 0 && this.flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] > 80 && this.flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] <= 160 && (this.flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] % 7 == 0 || this.getGame().time.hours == 20)) this.outputText("Kiha is telling stories to her draconic child" + (this.kihaFollower.totalKihaChildren() == 1 ? "" : "ren") + " right now.\n\n");
                else if (this.kihaFollower.totalKihaChildren() > 0 && this.flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] <= 80 && (this.flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] % 3 == 0 || this.getGame().time.hours == 20)) {
                    this.outputText("Kiha is training her " + (this.kihaFollower.totalKihaChildren() == 1 ? "child to become a strong warrior" : "children to become strong warriors") + ". ");
                    if (rand(2) == 0) this.outputText("Right now, she's teaching various techniques.\n\n");
                    else this.outputText("Right now, she's teaching her child" + (this.kihaFollower.totalKihaChildren() == 1 ? "" : "ren") + " how to make use of axes.\n\n");
                }
                else {
                    this.outputText("Kiha is utterly decimating a set of practice dummies she's set up out on the edge of camp.  All of them have crudely drawn horns. ");
                    if (this.kihaFollower.totalKihaChildren() > 0 && (this.kihaFollower.totalKihaChildren() >= 2 || this.flags[kFLAGS.KIHA_CHILD_MATURITY_COUNTER] <= 60)) this.outputText("Some of them are saved for her child" + (this.kihaFollower.totalKihaChildren() == 1 ? "" : "ren") + " to train on. ");
                    this.outputText("Most of them are on fire.\n\n");
                }
            }
            this.addButton(5, "Kiha", this.kihaScene.encounterKiha);
        }
        // MARBLE
        if (this.player.hasStatusEffect(StatusEffects.CampMarble) && this.flags[kFLAGS.FOLLOWER_AT_FARM_MARBLE] === 0) {
            this.temp = rand(5);
            this.outputText("A second bedroll rests next to yours; a large two handed hammer sometimes rests against it, depending on whether or not its owner needs it at the time.  ");
            if (this.flags[kFLAGS.MARBLE_PURIFICATION_STAGE] === 4) // normal Murbles
                this.outputText("Marble isn’t here right now; she’s still off to see her family.");
            else if (this.flags[kFLAGS.MARBLE_KIDS] >= 1 && (this.getGame().time.hours === 19 || this.getGame().time.hours === 20)) { // requires at least 1 kid, time is just before sunset, this scene always happens at this time if the PC has at least one kid
                this.outputText("Marble herself is currently in the nursery, putting your ");
                if (this.flags[kFLAGS.MARBLE_KIDS] == 1) this.outputText("child");
                else this.outputText("children");
                this.outputText(" to bed.");
            }
            else if (this.getGame().time.hours === 6 || this.getGame().time.hours === 7) // at 6-7 in the morning, scene always displays at this time
                this.outputText("Marble is off in an open area to the side of your camp right now.  She is practicing with her large hammer, going through her daily training.");
            else if (this.getGame().time.hours >= 21 && !this.player.hasStatusEffect(StatusEffects.Infested)) { // after nightfall, scene always displays at this time unless PC is wormed
                this.outputText("Marble is hanging around her bedroll waiting for you to come to bed.  However, sometimes she lies down for a bit, and sometimes she paces next to it.");
                if (this.flags[kFLAGS.MARBLE_LUST] > 30) this.outputText("  She seems to be feeling antsy.");
            }
            else if (this.flags[kFLAGS.MARBLE_KIDS] > 0 && this.getGame().time.hours < 19 && this.getGame().time.hours > 7) {
                if (rand(2) === 0 && this.flags[kFLAGS.MARBLE_KIDS] > 5) // requires at least 6 kids, and no other parental characters in camp
                    this.outputText("Marble is currently tending to your kids, but she looks a bit stressed out right now.  It looks like " + Camp.num2Text(this.flags[kFLAGS.MARBLE_KIDS]) + " might just be too many for her to handle on her own...");
                else if (rand(3) === 0 && this.flags[kFLAGS.MARBLE_KIDS] > 3) // requires at least 4 kids
                    this.outputText("Marble herself is in the camp right now, telling a story about her travels around the world to her kids as they gather around her.  The children are completely enthralled by her words.  You can't help but smile.");
                else if (rand(3) === 0 && this.flags[kFLAGS.MARBLE_BOYS] > 1) // requires 2 boys
                    this.outputText("Marble herself is currently refereeing a wrestling match between two of your sons.  It seems like it's a contest to see which one of them gets to go for a ride between her breasts in a game of <i>Bull Blasters</i>, while the loser has to sit on her shoulders.");
                // requires at least 2 kids
                else if (rand(3) === 0 && this.flags[kFLAGS.MARBLE_KIDS] - this.flags[kFLAGS.MARBLE_BOYS] > 1) this.outputText("Marble herself is involved in a play fight with two of your kids brandishing small sticks.  It seems that the <i>mommy monster</i> is terrorising the camp and needs to be stopped by the <i>Mighty Moo and her sidekick Bovine Lass</i>.");
                else if (rand(3) === 0 && this.flags[kFLAGS.MARBLE_KIDS] > 1) this.outputText("Marble herself is out right now; she's taken her kids to go visit Whitney.  You're sure though that she'll be back within the hour, so you could just wait if you needed her.");
                // requires at least 1 kid
                else {
                    if (rand(2) === 0) {
                        this.outputText("Marble herself is nursing ");
                        if (this.flags[kFLAGS.MARBLE_KIDS] > 1) this.outputText("one of your cow-girl children");
                        else this.outputText("your cow-girl child");
                        this.outputText(" with a content look on her face.");
                    }
                    else {
                        this.outputText("Marble herself is watching your kid");
                        if (this.flags[kFLAGS.MARBLE_KIDS] > 0) this.outputText("s");
                        this.outputText(" playing around the camp right now.");
                    }
                }
            }
            // Choose one of these at random to display each hour
            else if (this.temp == 0) this.outputText("Marble herself has gone off to Whitney's farm to get milked right now.");
            else if (this.temp == 1) this.outputText("Marble herself has gone off to Whitney's farm to do some chores right now.");
            else if (this.temp == 2) this.outputText("Marble herself isn't at the camp right now; she is probably off getting supplies, though she'll be back soon enough.");
            else if (this.temp == 3) this.outputText("Marble herself is resting on her bedroll right now.");
            else if (this.temp == 4) this.outputText("Marble herself is wandering around the camp right now.");

            if (this.temp < 3) this.outputText("  You're sure she'd be back in moments if you needed her.");
            else this.outputText("Marble is out in the wilderness right now, searching for a relative."); // out getting family
            this.outputText("\n\n");
            if (this.flags[kFLAGS.MARBLE_PURIFICATION_STAGE] !== 4) this.addButton(6, "Marble", this.marbleScene.interactWithMarbleAtCamp).hint("Go to Marble the cowgirl for talk and companionship.");
        }
        // Nieve
        if (this.flags[kFLAGS.NIEVE_STAGE] == 5) {
            kGAMECLASS.xmas.xmasMisc.nieveCampDescs();
            this.outputText("\n\n");
            this.addButton(7, "Nieve", this.getGame().xmas.xmasMisc.approachNieve);
        }
        // Phylla
        if (this.flags[kFLAGS.ANT_WAIFU] > 0) {
            this.outputText("You see Phylla's anthill in the distance.  Every now and then you see");
            // If PC has children w/ Phylla:
            if (this.flags[kFLAGS.ANT_KIDS] > 0 && this.flags[kFLAGS.ANT_KIDS] <= 250) this.outputText(" one of your children exit the anthill to unload some dirt before continuing back down into the colony.  It makes you feel good knowing your offspring are so productive.");
            if (this.flags[kFLAGS.ANT_KIDS] > 250 && this.flags[kFLAGS.ANT_KIDS] <= 1000) this.outputText(" few of your many children exit the anthill to unload some dirt before vanishing back inside.  It makes you feel good knowing your offspring are so productive.");
            if (this.flags[kFLAGS.ANT_KIDS] > 1000) this.outputText(" some of your children exit the anthill using main or one of the additionally entrances to unload some dirt. Some of them instead of unloading dirt coming out to fulfill some other task that their mother gave them.  You feel a little nostalgic seeing how this former small colony grown to such a magnificent size.");
            else this.outputText(" Phylla appears out of the anthill to unload some dirt.  She looks over to your campsite and gives you an excited wave before heading back into the colony.  It makes you feel good to know she's so close.");
            this.outputText("\n\n");
            this.addButton(8, "Phylla", this.getGame().desert.antsScene.introductionToPhyllaFollower);
        }
        this.addButton(14, "Back", this.playerMenu);
    }

    public campSlavesMenu(descOnly: boolean = false): void {
        if (!descOnly) {
            this.hideMenus();
            this.spriteSelect(undefined);
            this.clearOutput();
            this.getGame().inCombat = false;
            this.menu();
        }
        if (this.isAprilFools() && this.flags[kFLAGS.DLC_APRIL_FOOLS] == 0 && !descOnly) {
            this.outputText(this.images.showImage("event-dlc"));
            this.getGame().aprilFools.DLCPrompt("Slaves DLC", "Get the Slaves DLC to be able to interact with them. Show them that you're dominating!", "$4.99", this.doCamp);
            return;
        }
        if (this.latexGooFollower() && this.flags[kFLAGS.FOLLOWER_AT_FARM_LATEXY] == 0) {
            this.outputText(this.flags[kFLAGS.GOO_NAME] + " lurks in a secluded section of rocks, only venturing out when called for or when she needs to gather water from the stream.\n\n");
            this.addButton(0, this.flags[kFLAGS.GOO_NAME], this.latexGirl.approachLatexy);
        }
        if (this.milkSlave() && this.flags[kFLAGS.FOLLOWER_AT_FARM_BATH_GIRL] == 0) {
            this.outputText("Your well-endowed, dark-skinned milk-girl is here.  She flicks hopeful eyes towards you whenever she thinks she has your attention.\n\n");
            this.addButton(1, this.flags[kFLAGS.MILK_NAME], this.milkWaifu.milkyMenu);
        }
        // Ceraph
        if (this.ceraphIsFollower()) this.addButton(5, "Ceraph", this.ceraphFollowerScene.ceraphFollowerEncounter);
        // Vapula
        if (this.vapulaSlave() && this.flags[kFLAGS.FOLLOWER_AT_FARM_VAPULA] == 0) {
            this.vapula.vapulaSlaveFlavorText();
            this.outputText("\n\n");
            this.addButton(6, "Vapula", this.vapula.callSlaveVapula);
        }
        // Modified Camp/Follower List Description:
        if (this.amilyScene.amilyFollower() && this.flags[kFLAGS.AMILY_FOLLOWER] == 2 && this.flags[kFLAGS.AMILY_BLOCK_COUNTDOWN_BECAUSE_CORRUPTED_JOJO] == 0 && this.flags[kFLAGS.FOLLOWER_AT_FARM_AMILY] == 0) {
            this.outputText("Sometimes you hear a faint moan from not too far away. No doubt the result of your slutty toy mouse playing with herself.\n\n");
            this.addButton(10, "Amily", this.amilyScene.amilyFollowerEncounter);
        }
        // JOJO
        if (this.campCorruptJojo() && this.flags[kFLAGS.FOLLOWER_AT_FARM_JOJO] == 0) { // if Jojo is corrupted, add him to the masturbate menu.
            this.outputText("From time to time you can hear movement from around your camp, and you routinely find thick puddles of mouse semen.  You are sure Jojo is here if you ever need to sate yourself.\n\n");
            this.addButton(11, "Jojo", this.jojoScene.corruptCampJojo).hint("Call your corrupted pet into camp in order to relieve your desires in a variety of sexual positions?  He's ever so willing after your last encounter with him.");
        }
        // Bimbo Sophie
        if (this.bimboSophie() && this.flags[kFLAGS.FOLLOWER_AT_FARM_SOPHIE] == 0) {
            this.sophieBimbo.sophieCampLines();
            this.addButton(12, "Sophie", this.sophieBimbo.approachBimboSophieInCamp);
        }
        this.addButton(14, "Back", this.playerMenu);
    }

    public campFollowers(descOnly: boolean = false): void {
        if (!descOnly) {
            this.hideMenus();
            this.spriteSelect(undefined);
            this.clearOutput();
            this.getGame().inCombat = false;
            // ADD MENU FLAGS/INDIVIDUAL FOLLOWER TEXTS
            this.menu();
        }
        // Ember
        if (this.emberScene.followerEmber()) {
            this.emberScene.emberCampDesc();
            this.addButton(0, "Ember", this.emberScene.emberCampMenu).hint("Check up on Ember the dragon-" + (this.flags[kFLAGS.EMBER_ROUNDFACE] == 0 ? "morph" : this.flags[kFLAGS.EMBER_GENDER] == 1 ? "boy" : "girl") + "");
        }
        // Sophie
        if (this.sophieFollower() && this.flags[kFLAGS.FOLLOWER_AT_FARM_SOPHIE] == 0) {
            if (rand(5) == 0) this.outputText("Sophie is sitting by herself, applying yet another layer of glittering lip gloss to her full lips.\n\n");
            else if (rand(4) == 0) this.outputText("Sophie is sitting in her nest, idly brushing out her feathers.  Occasionally, she looks up from her work to give you a sultry wink and a come-hither gaze.\n\n");
            else if (rand(3) == 0) this.outputText("Sophie is fussing around in her nest, straightening bits of straw and grass, trying to make it more comfortable.  After a few minutes, she flops down in the middle and reclines, apparently satisfied for the moment.\n\n");
            else if (rand(2) == 0 || this.flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] == 0) {
                if (this.flags[kFLAGS.SOPHIE_BIMBO] > 0) this.outputText("Your platinum-blonde harpy, Sophie, is currently reading a book - a marked change from her bimbo-era behavior.  Occasionally, though, she glances up from the page and gives you a lusty look.  Some things never change....\n\n");
                else this.outputText("Your pink harpy, Sophie, is currently reading a book.  She seems utterly absorbed in it, though you question how she obtained it.  Occasionally, though, she'll glance up from the pages to shoot you a lusty look.\n\n");
            }
            else {
                this.outputText("Sophie is sitting in her nest, ");
                if (this.flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] < 5) {
                    this.outputText("across from your daughter");
                    if (this.flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] > 1) this.outputText("s");
                }
                else this.outputText("surrounded by your daughters");
                this.outputText(", apparently trying to teach ");
                if (this.flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] == 1) this.outputText("her");
                else this.outputText("them");
                this.outputText(" about hunting and gathering techniques.  Considering their unusual upbringing, it can't be as easy for them...\n\n");
            }
            this.addButton(1, "Sophie", this.sophieFollowerScene.followerSophieMainScreen).hint("Check up on Sophie the harpy.");
        }
        // Pure Jojo
        if (this.player.hasStatusEffect(StatusEffects.PureCampJojo)) {
            if (this.flags[kFLAGS.JOJO_BIMBO_STATE] >= 3) {
                this.outputText("Joy's tent is set up in a quiet corner of the camp, close to a boulder. Inside the tent, you can see a chest holding her belongings, as well as a few clothes and books spread about her bedroll. ");
                if (this.flags[kFLAGS.JOJO_LITTERS] > 0 && this.getGame().time.hours >= 16 && this.getGame().time.hours < 19) this.outputText("You spot the little mice you had with Joy playing about close to her tent.");
                else this.outputText("Joy herself is nowhere to be found, she's probably out frolicking about or sitting atop the boulder.");
                this.outputText("\n\n");
                this.addButton(2, "Joy", this.joyScene.approachCampJoy).hint("Go find Joy around the edges of your camp and meditate with her or have sex with her.");
            }
            else {
                this.outputText("There is a small bedroll for Jojo near your own");
                if (this.flags[kFLAGS.CAMP_BUILT_CABIN] > 0) this.outputText(" cabin");
                if (!(this.getGame().time.hours > 4 && this.getGame().time.hours < 23)) this.outputText(" and the mouse is sleeping on it right now.\n\n");
                else this.outputText(", though the mouse is probably hanging around the camp's perimeter.\n\n");
                this.addButton(2, "Jojo", this.jojoScene.jojoCamp).hint("Go find Jojo around the edges of your camp and meditate with him or talk about watch duty.");
            }
        }
        if (this.helspawnFollower()) // Helspawn
            this.addButton(3, this.flags[kFLAGS.HELSPAWN_NAME], this.helSpawnScene.helspawnsMainMenu);
        // RATHAZUL
        if (this.player.hasStatusEffect(StatusEffects.CampRathazul)) { // if rathazul has joined the camp
            if (this.flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] <= 1) {
                this.outputText("Tucked into a shaded corner of the rocks is a bevy of alchemical devices and equipment.  ");
                if (!(this.getGame().time.hours > 4 && this.getGame().time.hours < 23)) this.outputText("The alchemist is absent from his usual work location. He must be sleeping right now.");
                else this.outputText("The alchemist Rathazul looks to be hard at work with his chemicals, working on who knows what.");
                if (this.flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] == 1) this.outputText("  Some kind of spider-silk-based equipment is hanging from a nearby rack.  <b>He's finished with the task you gave him!</b>");
                this.outputText("\n\n");
            }
            else this.outputText("Tucked into a shaded corner of the rocks is a bevy of alchemical devices and equipment.  The alchemist Rathazul looks to be hard at work on the silken equipment you've commissioned him to craft.\n\n");
            this.addButton(4, "Rathazul", kGAMECLASS.rathazul.returnToRathazulMenu).hint("Visit with Rathazul to see what alchemical supplies and services he has available at the moment.");
        }
        else {
            if (this.flags[kFLAGS.RATHAZUL_SILK_ARMOR_COUNTDOWN] == 1) {
                this.outputText("There is a note on your ");
                if (this.flags[kFLAGS.CAMP_BUILT_CABIN] > 0) this.outputText("bed inside your cabin.");
                else this.outputText("bedroll");
                this.outputText(". It reads: \"<i>Come see me at the lake. I've finished your spider-silk ");
                switch (this.flags[kFLAGS.RATHAZUL_SILK_ARMOR_TYPE]) {
                    case 1: this.outputText("armor"); break;
                    case 2: this.outputText("robes"); break;
                    case 3: this.outputText("bra"); break;
                    case 4: this.outputText("panties"); break;
                    case 5: this.outputText("loincloth"); break;
                    default: this.outputText("robes");
                }
                this.outputText(". -Rathazul</i>\".\n\n");
            }
        }
        if (this.followerShouldra()) // Shouldra
            this.addButton(5, "Shouldra", this.shouldraFollower.shouldraFollowerScreen).hint("Talk to Shouldra. She is currently residing in your body.");
        // Valeria
        if (this.flags[kFLAGS.VALARIA_AT_CAMP] == 1) this.addButton(6, "Valeria", this.valeria.valeriaFollower).hint("Visit Valeria the goo-girl. You can even take and wear her as goo armor if you like.");
        if (this.player.armor == this.armors.GOOARMR) this.addButtonDisabled(6, "Valeria", "You are currently wearing Valeria. Unequip from your Inventory menu if you want to interact with her.");
        this.addButton(14, "Back", this.playerMenu);
    }
    // ----------------- CAMP ACTIONS -----------------
    private campActions(): void {
        this.hideMenus();
        this.menu();
        this.clearOutput();
        this.outputText(this.images.showImage("camp-campfire"));
        this.outputText("What would you like to do?");
        this.addButton(0, "SwimInStream", this.swimInStream).hint("Swim in stream and relax to pass time.", "Swim In Stream");
        this.addButton(1, "ExaminePortal", this.examinePortal).hint("Examine the portal. This scene is placeholder.", "Examine Portal"); // Examine portal
        if (this.getGame().time.hours == 19) this.addButton(2, "Watch Sunset", this.watchSunset).hint("Watch the sunset and relax."); // Relax and watch at the sunset
        else if (this.getGame().time.hours >= 20 && this.flags[kFLAGS.LETHICE_DEFEATED] > 0) this.addButton(2, "Stargaze", this.watchStars).hint("Look at the starry night sky."); // Stargaze. Only available after Lethice is defeated
        else this.addButtonDisabled(2, "Watch Sky", "The option to watch sunset is available at 7pm.");

        if (this.flags[kFLAGS.CAMP_CABIN_PROGRESS] > 0 && this.flags[kFLAGS.CAMP_CABIN_PROGRESS] < 10) this.addButton(3, "Build Cabin", this.cabinProgress.initiateCabin).hint("Work on your cabin."); // Work on cabin
        if (this.flags[kFLAGS.CAMP_CABIN_PROGRESS] >= 10 || this.flags[kFLAGS.CAMP_BUILT_CABIN] >= 1) this.addButton(3, "Enter Cabin", this.cabinProgress.initiateCabin).hint("Enter your cabin."); // Enter cabin for furnish
        this.addButton(4, "Read Codex", this.codex.accessCodexMenu).hint("Read any codex entries you have unlocked.");
        if (this.player.hasKeyItem("Carpenter's Toolbox") >= 0 && this.flags[kFLAGS.CAMP_WALL_PROGRESS] < 100 && this.getCampPopulation() >= 4) this.addButton(5, "Build Wall", this.buildCampWallPrompt).hint("Build a wall around your camp to defend from the imps." + (this.flags[kFLAGS.CAMP_WALL_PROGRESS] >= 20 ? "\n\nProgress: " + (this.flags[kFLAGS.CAMP_WALL_PROGRESS] / 20) + "/5 complete" : "") + "");
        if (this.player.hasKeyItem("Carpenter's Toolbox") >= 0 && this.flags[kFLAGS.CAMP_WALL_PROGRESS] >= 100 && this.flags[kFLAGS.CAMP_WALL_GATE] <= 0) this.addButton(5, "Build Gate", this.buildCampGatePrompt).hint("Build a gate to complete your camp defense.");
        if (this.flags[kFLAGS.CAMP_WALL_PROGRESS] >= 100 && this.player.hasItem(this.useables.IMPSKLL, 1)) this.addButton(6, "AddImpSkull", this.promptHangImpSkull).hint("Add an imp skull to decorate the wall and to serve as deterrent for imps.", "Add Imp Skull");
        if (this.flags[kFLAGS.LETHICE_DEFEATED] > 0) this.addButton(7, "Ascension", this.promptAscend).hint("Perform an ascension? This will restart your adventures with your levels, items, and gems carried over. The game will also get harder.");
        this.addButton(14, "Back", this.playerMenu);
    }

    private swimInStream(): void {
        let izmaJoinsStream: boolean = false;
        let marbleJoinsStream: boolean = false;
        let heliaJoinsStream: boolean = false;
        let amilyJoinsStream: boolean = false;
        let emberJoinsStream: boolean = false;
        let rathazulJoinsStream: boolean = false; // rare, 10% chance
        const prankChooser: number = rand(3);
        this.clearOutput();
        this.outputText("You ponder over the nearby stream that's flowing. Deciding you'd like a dip, ");
        if (this.player.armorName == "slutty swimwear") this.outputText("you are going to swim while wearing just your swimwear. ");
        else this.outputText("you strip off your [armor] until you are completely naked. ");
        if (this.player.hasCock() && this.player.hasVagina()) this.outputText(this.images.showImage("camp-stream-herm"));
        else if (this.player.hasVagina()) this.outputText(this.images.showImage("camp-stream-female"));
        else this.outputText(this.images.showImage("camp-stream-male"));
        this.outputText("You step into the flowing waters. You shiver at first but you step in deeper. Incredibly, it's not too deep. ");
        if (this.player.tallness < 60) this.outputText("Your feet aren't even touching the riverbed. ");
        if (this.player.tallness >= 60 && this.player.tallness < 72) this.outputText("Your feet are touching the riverbed and your head is barely above the water. ");
        if (this.player.tallness >= 72) this.outputText("Your feet are touching touching the riverbed and your head is above water. You bend down a bit so you're at the right height. ");
        this.outputText("\n\nYou begin to swim around and relax. ");
        if (rand(2) == 0 && this.camp.izmaFollower()) {
            this.outputText("\n\nYour tiger-shark beta, Izma, joins you. You are frightened at first when you saw the fin protruding from the water and the fin approaches you! ");
            this.outputText("As the fin approaches you, the familiar figure comes up. \"<i>I was going to enjoy my daily swim, alpha,</i>\" she says.");
            izmaJoinsStream = true; // Izma!
        }
        if (rand(2) == 0 && this.camp.followerHel() && this.flags[kFLAGS.HEL_CAN_SWIM]) {
            this.outputText("\n\nHelia, your salamander lover, joins in for a swim. \"<i>Hey, lover mine!</i>\" she says. As she enters the waters, the water seems to become warmer until it begins to steam like a sauna.");
            heliaJoinsStream = true; // Helia!
        }
        if (rand(2) == 0 && this.camp.marbleFollower() && this.flags[kFLAGS.MARBLE_PURIFICATION_STAGE] != 4) {
            this.outputText("\n\nYour cow-girl lover Marble strips herself naked and joins you. \"<i>Sweetie, you enjoy swimming, don't you?</i>\" she says.");
            marbleJoinsStream = true; // Marble!
        }
        if (rand(2) == 0 && this.camp.amilyFollower() && this.flags[kFLAGS.AMILY_FOLLOWER] == 1 && this.flags[kFLAGS.AMILY_OWNS_BIKINI] > 0) {
            this.outputText("\n\nYour mouse-girl lover Amily is standing at the riverbank. She looks flattering in her bikini");
            if (this.flags[kFLAGS.AMILY_WANG_LENGTH] > 0) this.outputText(", especially when her penis is exposed");
            this.outputText(". She walks into the waters and swims.  ");
            amilyJoinsStream = true; // Amily! (Must not be corrupted and must have given Slutty Swimwear)
        }
        if (rand(4) == 0 && this.camp.followerEmber()) {
            this.outputText("\n\nYou catch a glimpse of Ember taking a daily bath.");
            emberJoinsStream = true; // Ember
        }
        if (rand(10) == 0 && this.player.hasStatusEffect(StatusEffects.CampRathazul)) {
            this.outputText("\n\nYou spot Rathazul walking into the shallow section of stream, most likely taking a bath to get rid of the smell.");
            rathazulJoinsStream = true; // Rathazul (RARE)
        }
        if (prankChooser == 0 && (this.camp.izmaFollower() || (this.camp.followerHel() && this.flags[kFLAGS.HEL_CAN_SWIM]) || this.camp.marbleFollower() || (this.camp.amilyFollower() && this.flags[kFLAGS.AMILY_FOLLOWER] == 1 && this.flags[kFLAGS.AMILY_OWNS_BIKINI] > 0))) {
            this.outputText("\n\nYou could play some pranks by making the water curiously warm. Do you?");
            this.doYesNo(this.swimInStreamPrank1, this.swimInStreamFinish); // Pranks!
            return;
        }
        else {
            this.doNext(this.swimInStreamFinish);
        }
    }

    private swimInStreamPrank1(): void {
        let pranked: boolean = false;
        let prankRoll: number = 1;
        // How many people joined!
        if (this.izmaJoinsStream) prankRoll++;
        if (this.marbleJoinsStream) prankRoll++;
        if (this.heliaJoinsStream) prankRoll++;
        if (this.amilyJoinsStream) prankRoll++;
        if (prankRoll > 4) prankRoll = 4;
        // Play joke on them!
        this.clearOutput();
        this.outputText("You look around to make sure no one is looking then you smirk and you can feel yourself peeing. When you're done, you swim away.  ");
        if (rand(prankRoll) == 0 && this.camp.izmaFollower() && pranked == false && this.izmaJoinsStream == true) {
            this.outputText("\n\nIzma just swims over, unaware of the warm spot you just created. \"<i>Who've pissed in the stream?</i>\" she growls. You swim over to her and tell her that you admit you did pee in the stream. \"<i>Oh, alpha! What a naughty alpha you are,</i>\" she grins, her shark-teeth clearly visible.");
            pranked = true;
        }
        if (rand(prankRoll) == 0 && (this.camp.followerHel() && this.flags[kFLAGS.HEL_CAN_SWIM]) && pranked == false && this.heliaJoinsStream == true) {
            this.outputText("\n\nHelia swims around until she hits the warm spot you just created. \"<i>Heyyyyyyy,</i>\" the salamander yells towards you. She comes towards you and asks \"<i>Did you just piss in the stream?</i>\" after which you sheepishly chuckle and tell her that you admit it. Yes, you've done it. \"<i>I knew it! Oh, you're naughty, lover mine!</i>\" she says.");
            pranked = true;
        }
        if (rand(prankRoll) == 0 && this.camp.marbleFollower() && pranked == false && this.marbleJoinsStream == true) {
            this.outputText("\n\nMarble is oblivious to the warm spot and when she swims over, she yells \"<i>Hey, sweetie! Did you just urinate in the stream?</i>\" You sheepishly smile and admit that yes, you did it. She says, \"<i>You're naughty, you know, sweetie!</i>\"");
            pranked = true;
        }

        if (pranked == false) this.outputText("  No one managed to swim past where you left the warm spot before it dissipated. You feel a bit disappointed and just go back to swimming.");
        else this.outputText("  You feel accomplished from the prank and resume swimming. ");
        this.awardAchievement("Urine Trouble", kACHIEVEMENTS.GENERAL_URINE_TROUBLE);
        this.doNext(this.swimInStreamFinish);
    }

    private swimInStreamFap(): void {
        this.clearOutput();
        this.doNext(this.swimInStreamFinish);
    }

    private swimInStreamFinish(): void {
        this.clearOutput();
        if (this.flags[kFLAGS.FACTORY_SHUTDOWN] == 2 && this.player.cor < 50) {
            this.outputText("You feel a bit dirtier after swimming in the tainted waters. \n\n");
            this.dynStats("cor", 0.5); // Blown up factory? Corruption gains
            this.dynStats("lust", 15, "scale", true);
        }
        this.outputText("Eventually, you swim back to the riverbank and dry yourself off");
        if (this.player.armorName != "slutty swimwear") this.outputText(" before you re-dress yourself in your " + this.player.armorName);
        this.outputText(".");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private examinePortal(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("camp-portal"));
        if (this.flags[kFLAGS.CAMP_PORTAL_PROGRESS] <= 0) {
            this.outputText("You walk over to the portal, reminded by how and why you came. You wonder if you can go back to Ingnam. You start by picking up a small pebble and throw it through the portal. It passes through the portal. As you walk around the portal, you spot the pebble at the other side. Seems like you can't get back right now.");
            this.flags[kFLAGS.CAMP_PORTAL_PROGRESS] = 1;
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }
        else this.outputText("You walk over to the portal, reminded by how and why you came. You let out a sigh, knowing you can't return to Ingnam.");
        this.doNext(this.playerMenu);
    }

    private watchSunset(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("camp-watch-sunset"));
        this.outputText("You pick a location where the sun is clearly visible from that particular spot and sit down. The sun is just above the horizon, ready to set. It's such a beautiful view. \n\n");
        const randText: number = rand(3);
        // Childhood nostalgia GO!
        if (randText == 0) {
            if (this.player.cor < 33) {
                this.outputText("A wave of nostalgia washes over you as you remember your greatest moments from your childhood.");
                this.dynStats("cor", -1, "lib", -1, "lust", -30, "scale", false);
            }
            if (this.player.cor >= 33 && this.player.cor < 66) {
                this.outputText("A wave of nostalgia washes over you as you remember your greatest moments from your childhood. Suddenly, your memories are somewhat twisted from some of the perverted moments. You shake your head and just relax.");
                this.dynStats("cor", -0.5, "lib", -1, "lust", -20, "scale", false);
            }
            if (this.player.cor >= 66) {
                this.outputText("A wave of nostalgia washes over you as you remember your greatest moments from your childhood. Suddenly, your memories twist into some of the dark and perverted moments. You chuckle at that moment but you shake your head and focus on relaxing.");
                this.dynStats("cor", 0, "lib", -1, "lust", -10, "scale", false);
            }
        }
        // Greatest moments GO!
        if (randText == 1) {
            if (this.player.cor < 33) {
                this.outputText("You reflect back on your greatest adventures and how curiosity got the best of you. You remember some of the greatest places you discovered.");
                this.dynStats("lust", -30, "scale", false);
            }
            if (this.player.cor >= 33 && this.player.cor < 66) {
                this.outputText("You reflect back on your greatest adventures. Of course, some of them involved fucking and getting fucked by the denizens of Mareth. You suddenly open your eyes from the memory and just relax, wondering why you thought of that in the first place.");
                this.dynStats("lust", -20, "scale", false);
            }
            if (this.player.cor >= 66) {
                this.outputText("You reflect back on your greatest adventures. You chuckle at the moments you were dominating and the moments you were submitting. You suddenly open your eyes from the memory and just relax.");
                this.dynStats("lust", -10, "scale", false);
            }
        }
        // Greatest moments GO!
        if (randText >= 2) {
            this.outputText("You think of what you'd like to ");
            if (rand(2) == 0) this.outputText("do");
            else this.outputText("accomplish");
            this.outputText(" before you went through the portal. You felt a bit sad that you didn't get to achieve your old goals.");
            this.dynStats("lust", -30, "scale", false);

        }
        this.outputText("\n\nAfter the thought, you spend a good while relaxing and watching the sun setting. By now, the sun has already set below the horizon. The sky is glowing orange after the sunset. It looks like you could explore more for a while.");
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private watchStars(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("camp-watch-stars"));
        this.outputText("You pick a location not far from your " + this.homeDesc() + " and lay on the ground, looking up at the starry night sky.");
        this.outputText("\n\nEver since the fall of Lethice, the stars are visible.");
        this.outputText("\n\nYou relax and point at various constellations.");
        const consellationChoice: number = rand(4);
        switch (consellationChoice) {
            case 0: this.outputText("\n\nOne of them even appears to be phallic. You blush at the arrangement."); break;
            case 1: this.outputText("\n\nOne of them even appears to be arranged like breasts. You blush at the arrangement."); break;
            case 2: this.outputText("\n\nOne of the constellations have the stars arranged to form the shape of a centaur. Interesting."); break;
            case 3: this.outputText("\n\nAh, the familiar Big Dipper. Wait a minute... you remember that constellation back in Ingnam. You swear the star arrangements are nearly the same."); break;
            default: this.outputText("\n\nSomehow, one of them spells out \"ERROR\". Maybe you should let Kitteh6660 know?");
        }
        this.outputText("\n\nYou let your mind wander and relax.");
        this.dynStats("lus", -15, "scale", false);
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // ----------------- REST -----------------
    public rest(): void {
        this.campQ = true;
        this.clearOutput();
        let multiplier: number = 1.0;
        const fatRecovery: number = 4; // fatigue recovery
        let hpRecovery: number = 10;

        if (this.player.findPerk(PerkLib.Medicine) >= 0) hpRecovery *= 1.5;
        if (this.flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] > 0 && !this.prison.inPrison && !this.ingnam.inIngnam) multiplier += 0.5;
        if (this.player.hasStatusEffect(StatusEffects.MarbleWithdrawl)) // Marble withdrawal
            multiplier /= 2;
        if (this.flags[kFLAGS.HUNGER_ENABLED] > 0 && this.player.hunger < 25) // hungry
            multiplier /= 2;
        if (this.timeQ == 0) {
            const hpBefore: number = this.player.HP;
            if (this.flags[kFLAGS.SHIFT_KEY_DOWN] > 0) { // rest until fully healed, midnight or hunger wake
                while (this.player.HP < this.player.maxHP() || this.player.fatigue > 0) {
                    this.timeQ += 1;
                    this.player.HPChange(hpRecovery * multiplier, false); // no display since it is meant to be full rest anyway
                    this.player.changeFatigue(-fatRecovery * multiplier);
                    if (this.timeQ + this.getGame().time.hours == 24 || this.flags[kFLAGS.HUNGER_ENABLED] > 0 && this.player.hunger < 5) break;
                }
                if (this.timeQ == 0) this.timeQ = 1;
                if (this.timeQ > 21 - this.getGame().time.hours) this.timeQ = 21 - this.getGame().time.hours;
            }
            else {
                this.timeQ = Math.min(4, 21 - this.getGame().time.hours);
                this.player.HPChange(this.timeQ * hpRecovery * multiplier, false);
                this.player.changeFatigue(this.timeQ * -fatRecovery * multiplier);
            }
            if (this.flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] > 0 && !this.prison.inPrison && !this.ingnam.inIngnam) {
                if (this.timeQ != 1) this.outputText("You head into your cabin to rest. You lie down on your bed to rest for " + Camp.num2Text(this.timeQ) + " hours.\n");
                else this.outputText("You head into your cabin to rest. You lie down on your bed to rest for an hour.\n");
            }
            else {
                if (this.timeQ != 1) this.outputText("You lie down to rest for " + Camp.num2Text(this.timeQ) + " hours.\n");
                else this.outputText("You lie down to rest for an hour.\n");
            }
            if (this.player.hasStatusEffect(StatusEffects.MarbleWithdrawl)) { // Marble withdrawal
                this.outputText("\nYour rest is very troubled, and you aren't able to settle down.  You get up feeling tired and unsatisfied, always thinking of Marble's milk.\n");
                this.dynStats("tou", -.1, "int", -.1);
            }
            if (this.player.hasCock() && this.player.cocks[0].cockType == CockTypesEnum.BEE) // bee cock
                this.outputText("\nThe desire to find the bee girl that gave you this cursed " + this.player.cockDescript(0) + " and have her spread honey all over it grows with each passing minute\n");
            if (this.player.armor == this.armors.GOOARMR && this.flags[kFLAGS.VALERIA_FLUIDS] <= 0 && this.valeria.valeriaFluidsEnabled()) // starved goo armor
                this.outputText("\nYou feel the fluid-starved goo rubbing all over your groin as if Valeria wants you to feed her.\n");
            if (this.flags[kFLAGS.HUNGER_ENABLED] > 0 && this.player.hunger < 25) // hungry
                this.outputText("\nYou have difficulty resting as you toss and turn with your stomach growling.\n");
            this.player.HPChangeNotify(this.player.HP - hpBefore);
        }
        else {
            this.clearOutput();
            this.outputText(this.images.showImage("camp-resting"));
            if (this.timeQ != 1) this.outputText("You continue to rest for " + Camp.num2Text(this.timeQ) + " more hours.\n");
            else this.outputText("You continue to rest for another hour.\n");
        }
        this.goNext(this.timeQ, true);
    }
    // ----------------- WAIT -----------------
    public doWait(): void {
        this.campQ = true;
        this.clearOutput();
        this.outputText(this.images.showImage("camp-waiting"));
        // Fatigue recovery
        let fatRecovery: number = 2;

        if (this.player.findPerk(PerkLib.SpeedyRecovery) >= 0) fatRecovery *= 1.5;
        if (this.player.findPerk(PerkLib.ControlledBreath) >= 0) fatRecovery *= 1.1;
        if (this.timeQ == 0) {
            this.timeQ = 4;
            if (this.flags[kFLAGS.SHIFT_KEY_DOWN] > 0) this.timeQ = 21 - this.getGame().time.hours;
            this.outputText("You wait " + Camp.num2Text(this.timeQ) + " hours...\n");
            if (this.player.hasStatusEffect(StatusEffects.MarbleWithdrawl)) { // Marble withdrawl
                this.outputText("\nYour time spent waiting is very troubled, and you aren't able to settle down.  You get up feeling tired and unsatisfied, always thinking of Marble's milk.\n");
                // Fatigue
                fatRecovery /= 2;
                this.player.changeFatigue(-fatRecovery * this.timeQ);
            }
            if (this.player.hasCock() && this.player.cocks[0].cockType == CockTypesEnum.BEE) // bee cock
                this.outputText("\nThe desire to find the bee girl that gave you this cursed " + this.player.cockDescript(0) + " and have her spread honey all over it grows with each passing minute\n");
            if (this.player.armor == this.armors.GOOARMR && this.flags[kFLAGS.VALERIA_FLUIDS] <= 0) // starved goo armor
                this.outputText("\nYou feel the fluid-starved goo rubbing all over your groin as if Valeria wants you to feed her.\n");
            // REGULAR HP/FATIGUE RECOVERY
            else this.player.changeFatigue(-fatRecovery * this.timeQ); // fatigue
        }
        else {
            if (this.timeQ != 1) this.outputText("You continue to wait for " + Camp.num2Text(this.timeQ) + " more hours.\n");
            else this.outputText("You continue to wait for another hour.\n");
        }
        this.goNext(this.timeQ, true);
    }
    // ----------------- SLEEP -----------------
    public doSleep(clrScreen: boolean = true): void {
        if (kGAMECLASS.urta.pregnancy.incubation == 0 && kGAMECLASS.urta.pregnancy.type == PregnancyStore.PREGNANCY_PLAYER && this.getGame().time.hours >= 20 && this.getGame().time.hours < 2) {
            this.urtaPregs.preggoUrtaGivingBirth();
            return;
        }
        this.campQ = true;
        if (this.timeQ == 0) {
            this.getGame().time.minutes = 0;
            let wakeTime: number = 6;
            if (this.flags[kFLAGS.BENOIT_CLOCK_ALARM] > 0 && this.flags[kFLAGS.IN_PRISON] === 0 && (this.flags[kFLAGS.SLEEP_WITH] === "Ember" || this.flags[kFLAGS.SLEEP_WITH] === 0)) wakeTime += (this.flags[kFLAGS.BENOIT_CLOCK_ALARM] - 6);
            this.timeQ = this.calculateHoursUntilHour(wakeTime);
            if (this.player.slotName != "VOID" && this.player.autoSave && this.mainView.getButtonText(0) != "Game Over") // autosave stuff
                this.getGame().saves.saveGame(this.player.slotName);
            if (clrScreen) this.clearOutput(); // clear screen
            if (this.prison.inPrison) {
                this.outputText("You curl up on a slab, planning to sleep for " + Camp.num2Text(this.timeQ) + " hour");
                if (this.timeQ > 1) this.outputText("s");
                this.outputText(". ");
                this.sleepRecovery(true);
                this.goNext(this.timeQ, true);
                return;
            }
            /******************************************************************/
            /*						ONE TIME SPECIAL EVENTS					  */
            /******************************************************************/
            // HEL SLEEPIES!
            if (this.helFollower.helAffection() >= 70 && this.flags[kFLAGS.HEL_REDUCED_ENCOUNTER_RATE] == 0 && this.flags[kFLAGS.HEL_FOLLOWER_LEVEL] == 0) {
                this.getGame().dungeons.heltower.heliaDiscovery();
                this.sleepRecovery(false);
                return;
            }
            // Shouldra xgartuan fight
            if (this.player.hasCock() && this.followerShouldra() && this.player.statusEffectv1(StatusEffects.Exgartuan) == 1) {
                if (this.flags[kFLAGS.SHOULDRA_EXGARTUDRAMA] == 0) {
                    this.shouldraFollower.shouldraAndExgartumonFightGottaCatchEmAll();
                    this.sleepRecovery(false);
                    return;
                }
                else if (this.flags[kFLAGS.SHOULDRA_EXGARTUDRAMA] == 3) {
                    this.shouldraFollower.exgartuMonAndShouldraShowdown();
                    this.sleepRecovery(false);
                    return;
                }
            }
            if (this.player.hasCock() && this.followerShouldra() && this.flags[kFLAGS.SHOULDRA_EXGARTUDRAMA] == -0.5) {
                this.shouldraFollower.keepShouldraPartIIExgartumonsUndeatH();
                this.sleepRecovery(false);
                return;
            }
            /******************************************************************/
            /*						SLEEP WITH SYSTEM GOOOO					  */
            /******************************************************************/
            if (this.flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] > 0 && (this.flags[kFLAGS.SLEEP_WITH] == "" || this.flags[kFLAGS.SLEEP_WITH] == "Marble")) this.outputText("You enter your cabin to turn yourself in for the night. ");
            // Marble Sleepies
            if (this.marbleScene.marbleAtCamp() && this.player.hasStatusEffect(StatusEffects.CampMarble) && this.flags[kFLAGS.SLEEP_WITH] == "Marble" && this.flags[kFLAGS.FOLLOWER_AT_FARM_MARBLE] == 0) {
                this.outputText(this.images.showImage("camp-sleep-marble"));
                if (this.marbleScene.marbleNightSleepFlavor()) {
                    this.sleepRecovery(false);
                    return;
                }
            }
            else if (this.flags[kFLAGS.SLEEP_WITH] == "Arian" && this.arianScene.arianFollower()) {
                this.outputText(this.images.showImage("camp-sleep-arian"));
                this.arianScene.sleepWithArian();
                return;
            }
            else if (this.flags[kFLAGS.SLEEP_WITH] == "Ember" && this.flags[kFLAGS.EMBER_AFFECTION] >= 75 && this.followerEmber()) {
                if (this.flags[kFLAGS.TIMES_SLEPT_WITH_EMBER] > 3) {
                    if (this.flags[kFLAGS.EMBER_GENDER] == 2) this.outputText(this.images.showImage("camp-sleep-ember-female"));
                    else this.outputText(this.images.showImage("camp-sleep-ember-male"));
                    this.outputText("You curl up next to Ember, planning to sleep for " + Camp.num2Text(this.timeQ) + " hour. Ember drapes one of " + this.emberScene.emberMF("his", "her") + " wing over you, keeping you warm. ");
                }
                else {
                    this.emberScene.sleepWithEmber();
                    return;
                }
            }
            else if (this.flags[kFLAGS.JOJO_BIMBO_STATE] >= 3 && this.jojoScene.pregnancy.isPregnant && this.jojoScene.pregnancy.event == 4 && this.player.hasCock() && this.flags[kFLAGS.SLEEP_WITH] == 0) {
                this.joyScene.hornyJoyIsPregnant();
                return;
            }
            else if (this.flags[kFLAGS.SLEEP_WITH] == "Sophie" && (this.bimboSophie() || this.sophieFollower()) && this.flags[kFLAGS.FOLLOWER_AT_FARM_SOPHIE] == 0) {
                // Night Time Snuggle Alerts!*
                this.outputText(this.images.showImage("camp-sleep-sophie"));
                // (1)
                if (rand(4) == 0) {
                    this.outputText("You curl up next to Sophie, planning to sleep for " + Camp.num2Text(this.timeQ) + " hour");
                    if (this.timeQ > 1) this.outputText("s");
                    this.outputText(".  She wraps her feathery arms around you and nestles her chin into your shoulder.  Her heavy breasts cushion flat against your back as she gives you a rather chaste peck on the cheek and drifts off towards dreamland...");
                }
                // (2)
                else if (rand(3) == 0) {
                    this.outputText("While you're getting ready for bed, you see that Sophie has already beaten you there.  She's sprawled out on her back with her arms outstretched, making little beckoning motions towards the valley of her cleavage.  You snuggle in against her, her pillowy breasts supporting your head and her familiar heartbeat drumming you to sleep for " + Camp.num2Text(this.timeQ) + " hour");
                    if (this.timeQ > 1) this.outputText("s");
                    this.outputText(".");
                }
                // (3)
                else if (rand(2) == 0) {
                    this.outputText("As you lay down to sleep for " + Camp.num2Text(this.timeQ) + " hour");
                    if (this.timeQ > 1) this.outputText("s");
                    this.outputText(", you find the harpy-girl, Sophie, snuggling herself under her blankets with you.  She slips in between your arms and guides your hands to her enormous breasts, her backside already snug against your loins.  She whispers, \"<i>Something to think about for next morning...  Sweet dreams.</i>\" as she settles in for the night.");
                }
                // (4)
                else {
                    this.outputText("Sophie climbs under the sheets with you when you go to sleep, planning on resting for " + Camp.num2Text(this.timeQ) + " hour");
                    if (this.timeQ > 1) this.outputText("s");
                    this.outputText(".  She sleeps next to you, just barely touching you.  You rub her shoulder affectionately before the two of you nod off.");
                }
                this.outputText("\n");
            }
            else {
                if (this.flags[kFLAGS.SLEEP_WITH] == "Helia" && kGAMECLASS.helScene.followerHel()) {
                    this.outputText(this.images.showImage("camp-sleep-helia"));
                    this.outputText("You curl up next to Helia, planning to sleep for " + Camp.num2Text(this.timeQ) + " ");
                }
                // Normal sleep message
                else this.outputText("You curl up, planning to sleep for " + Camp.num2Text(this.timeQ) + " ");
                if (this.timeQ == 1) this.outputText("hour.\n");
                else this.outputText("hours.\n");
            }
            this.sleepRecovery(true);
        }
        else {
            this.clearOutput();
            if (this.timeQ != 1) this.outputText("You lie down to resume sleeping for the remaining " + Camp.num2Text(this.timeQ) + " hours.\n");
            else this.outputText("You lie down to resume sleeping for the remaining hour.\n");
        }
        this.goNext(this.timeQ, true);
    }
    // For shit that breaks normal sleep processing
    public sleepWrapper(): void {
        let wakeTime: number = 6;
        if (this.flags[kFLAGS.BENOIT_CLOCK_ALARM] > 0 && (this.flags[kFLAGS.SLEEP_WITH] === "Ember" || this.flags[kFLAGS.SLEEP_WITH] === 0)) wakeTime += (this.flags[kFLAGS.BENOIT_CLOCK_ALARM] - 6);
        this.timeQ = this.calculateHoursUntilHour(wakeTime);
        this.clearOutput();
        if (this.timeQ != 1) this.outputText("You lie down to resume sleeping for the remaining " + Camp.num2Text(this.timeQ) + " hours.\n");
        else this.outputText("You lie down to resume sleeping for the remaining hour.\n");
        this.sleepRecovery(true);
        this.goNext(this.timeQ, true);
    }

    public calculateHoursUntilHour(targetHour: number): number {
        let currentHour: number = this.getGame().time.hours;
        let amount: number = 0;
        while (currentHour != targetHour) {
            currentHour++;
            amount++;
            if (currentHour >= 24) currentHour = 0;
        }
        return amount;
    }
    public sleepRecovery(display: boolean = false): void {
        let multiplier: number = 1.0;
        const fatRecovery: number = 20;
        const hpRecovery: number = 20;
        if (this.flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] > 0 && (this.flags[kFLAGS.SLEEP_WITH] == "" || this.flags[kFLAGS.SLEEP_WITH] == "Marble"))
            multiplier += 0.5;
        if (this.flags[kFLAGS.HUNGER_ENABLED] > 0) {
            if (this.player.hunger < 25) {
                this.outputText("\nYou have difficulty sleeping as your stomach is growling loudly.\n");
                multiplier *= 0.5;
            }
        }
        if (this.player.hasStatusEffect(StatusEffects.MarbleWithdrawl)) { // Marble withdrawl
            if (display) this.outputText("\nYour sleep is very troubled, and you aren't able to settle down.  You get up feeling tired and unsatisfied, always thinking of Marble's milk.\n");
            multiplier *= 0.5;
            this.dynStats("tou", -.1, "int", -.1);
        }
        else if (this.flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] == 3) { // Mino withdrawal
            if (display) this.outputText("\nYou spend much of the night tossing and turning, aching for a taste of minotaur cum.\n");
            multiplier *= 0.75;
        }
        if (this.player.hasCock() && this.player.cocks[0].cockType == CockTypesEnum.BEE) // bee cock
            this.outputText("\nThe desire to find the bee girl that gave you this cursed " + this.player.cockDescript(0) + " and have her spread honey all over it grows with each passing minute\n");
        if (this.player.armor == this.armors.GOOARMR && this.flags[kFLAGS.VALERIA_FLUIDS] <= 0) // Starved goo armor
            this.outputText("\nYou feel the fluid-starved goo rubbing all over your groin as if Valeria wants you to feed her.\n");
        this.player.HPChange(this.timeQ * hpRecovery * multiplier, display); // REGULAR HP/FATIGUE RECOVERY
        this.player.changeFatigue(-(this.timeQ * fatRecovery * multiplier)); // Fatigue
    }
    // Bad End if your balls are too big. Only happens in Realistic Mode
    public badEndGIANTBALLZ(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("badend-hBalls"));
        this.outputText("You suddenly fall over due to your extremely large " + this.player.ballsDescriptLight() + ".  You struggle to get back up but the size made it impossible.  Panic spreads throughout your mind and your heart races.\n\n");
        this.outputText("You know that you can't move and you're aware that you're going to eventually starve to death.");
        this.menu();
        if (this.player.hasItem(this.consumables.REDUCTO, 1)) {
            this.outputText("\n\nFortunately, you have some Reducto.  You can shrink your balls and get back to your adventures!");
            this.addButton(1, "Reducto", this.applyReductoAndEscapeBadEnd);
        }
        if (this.player.hasStatusEffect(StatusEffects.CampRathazul)) {
            this.outputText("\n\nYou could call for Rathazul to help you.");
            this.addButton(2, "Rathazul", this.callRathazulAndEscapeBadEnd);
        }
        if (this.shouldraFollower.followerShouldra()) {
            this.outputText("\n\nYou could call for Shouldra to shrink your monstrous balls.");
            this.addButton(3, "Shouldra", this.shouldraFollower.shouldraReductosYourBallsUpInsideYa, true);
        }
        else this.getGame().gameOver();
    }
    private applyReductoAndEscapeBadEnd(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("item-reducto"));
        this.outputText("You smear the foul-smelling paste onto your " + this.player.sackDescript() + ".  It feels cool at first but rapidly warms to an uncomfortable level of heat.\n\n");
        this.player.ballSize -= (4 + rand(6));
        if (this.player.ballSize < 1) this.player.ballSize = 1;
        if (this.player.ballSize > 18 + (this.player.str / 2) + (this.player.tallness / 4))
            this.player.ballSize = 17 + (this.player.str / 2) + (this.player.tallness / 4);
        this.outputText("You feel your scrotum shift, shrinking down along with your " + this.player.ballsDescriptLight() + ".  ");
        this.outputText("Within a few seconds the paste has been totally absorbed and the shrinking stops.  ");
        this.dynStats("lib", -2, "lus", -10);
        this.player.consumeItem(this.consumables.REDUCTO, 1);
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    private callRathazulAndEscapeBadEnd(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("rathazul-himself"));
        this.outputText("You shout as loud as you can to call Rathazul.  Your call is answered as the alchemist walks up to you.\n\n");
        this.outputText("\"<i>My, my... Look at yourself! Don't worry, I can help, </i>\" he says.  He rushes to his alchemy equipment and mixes ingredients.  He returns to you with a Reducto.\n\n");
        this.outputText("He rubs the paste all over your massive balls. It's incredibly effective. \n\n");
        this.player.ballSize -= (4 + rand(6));
        if (this.player.ballSize < 1) this.player.ballSize = 1;
        if (this.player.ballSize > 18 + (this.player.str / 2) + (this.player.tallness / 4)) this.player.ballSize = 16 + (this.player.str / 2) + (this.player.tallness / 4);
        this.outputText("You feel your scrotum shift, shrinking down along with your " + this.player.ballsDescriptLight() + ".  ");
        this.outputText("Within a few seconds the paste has been totally absorbed and the shrinking stops.  ");
        this.outputText("\"<i>Try not to make your balls bigger. If it happens, make sure you have Reducto,</i>\" he says.  He returns to his alchemy equipment, working on who knows what.\n\n");
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    // Bad End if you starved to death
    public badEndHunger(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("badend-starve"));
        this.player.hunger = 0.1; // for Easy Mode/Debug Mode
        this.outputText("Too weak to be able to stand up, you collapse onto the ground. Your vision blurs as the world around you finally fades to black. ");
        if (this.companionsCount() > 0) {
            this.outputText("\n\n");
            if (this.companionsCount() > 1) this.outputText("Your companions gather to mourn over your passing.");
            else this.outputText("Your fellow companion mourns over your passing.");
        }
        this.player.HP = 0;
        this.getGame().gameOver();
        this.removeButton(1); // can't continue, you're dead!
    }
    // Bad End if you have 100 min lust
    public badEndMinLust(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("badend-masti"));
        this.outputText("The thought of release overwhelms you. You frantically remove your " + this.player.armorName + " and begin masturbating furiously.  The first orgasm hits you but the desire persists.  You continue to masturbate but unfortunately, no matter how hard or how many times you orgasm, your desires will not go away.  Frustrated, you keep masturbating furiously but you are unable to stop.  Your minimum lust is too high.  No matter how hard you try, you cannot even satisfy your desires.");
        this.outputText("\n\nYou spend the rest of your life masturbating, unable to stop.");
        this.player.orgasm('Generic');
        this.getGame().gameOver();
        this.removeButton(1); // can't wake up, must load
    }

    public allNaturalSelfStimulationBeltContinuation(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("masti-stimBelt-allNatural"));
        this.outputText("In shock, you scream as you realize the nodule has instantly grown into a massive, organic dildo. It bottoms out easily and rests against your cervix as you recover from the initial shock of its penetration. As the pangs subside, the infernal appendage begins working itself. It begins undulating in long, slow strokes. It takes great care to adjust itself to fit every curve of your womb. Overwhelmed, your body begins reacting against your conscious thought and slowly thrusts your pelvis in tune to the thing.\n\n");
        this.outputText("As suddenly as it penetrated you, it shifts into a different phase of operation. It buries itself as deep as it can and begins short, rapid strokes. The toy hammers your insides faster than any man could ever hope to do. You orgasm immediately and produce successive climaxes. Your body loses what motor control it had and bucks and undulates wildly as the device pistons your cunt without end. You scream at the top of your lungs. Each yell calls to creation the depth of your pleasure and lust.\n\n");
        this.outputText("The fiendish belt shifts again. It buries itself as deep as it can go and you feel pressure against the depths of your womanhood. You feel a hot fluid spray inside you. Reflexively, you shout, \"<b>IT'S CUMMING! IT'S CUMMING INSIDE ME!</b>\" Indeed, each push of the prodding member floods your box with juice. It cums... and cums... and cums... and cums...\n\n");
        this.outputText("An eternity passes, and your pussy is sore. It is stretched and filled completely with whatever this thing shoots for cum. It retracts itself from your hole and you feel one last pang of pressure as your body now has a chance to force out all of the spunk that it cannot handle. Ooze sprays out from the sides of the belt and leaves you in a smelly, sticky mess. You feel the belt's tension ease up as it loosens. The machine has run its course. You immediately pass out.");
        this.player.slimeFeed();
        this.player.orgasm('Vaginal');
        this.dynStats("lib", 1, "sen", (-0.5));
        this.doNext(this.camp.returnToCampUseOneHour);
    }
    public allNaturalSelfStimulationBeltBadEnd(): void {
        this.spriteSelect(SpriteDb.s_giacomo);
        this.clearOutput();
        this.outputText(this.images.showImage("badend-stimBelt"));
        this.outputText("Whatever the belt is, whatever it does, it no longer matters to you.  The only thing you want is to feel the belt and its creature fuck the hell out of you, day and night.  You quickly don the creature again and it begins working its usual lustful magic on your insatiable little box.  An endless wave of orgasms take you.  All you now know is the endless bliss of an eternal orgasm.\n\n");
        this.outputText("Your awareness hopelessly compromised by the belt and your pleasure, you fail to notice a familiar face approach your undulating form.  It is the very person who sold you this infernal toy.  The merchant, Giacomo.\n\n");
        this.outputText("\"<i>Well, well,</i>\" Giacomo says.  \"<i>The Libertines are right.  The creature's fluids are addictive. This poor " + this.player.mf("man", "woman") + " is a total slave to the beast!</i>\"\n\n");
        this.outputText("Giacomo contemplates the situation as you writhe in backbreaking pleasure before him.  His sharp features brighten as an idea strikes him.\n\n");
        this.outputText("\"<i>AHA!</i>\" the hawkish purveyor cries.  \"<i>I have a new product to sell! I will call it the 'One Woman Show!'</i>\"\n\n");
        this.outputText("Giacomo cackles smugly at his idea.  \"<i>Who knows how much someone will pay me for a live " + this.player.mf("man", "woman") + " who can't stop cumming!</i>\"\n\n");
        this.outputText("Giacomo loads you up onto his cart and sets off for his next sale.  You do not care.  You do not realize what has happened.  All you know is that the creature keeps cumming and it feels... sooooo GODDAMN GOOD!");
        this.getGame().gameOver();
    }
    // Returns true as soon as any known dungeon is found
    private dungeonFound(): boolean {
        if (this.flags[kFLAGS.DISCOVERED_DUNGEON_2_ZETAZ] > 0) return true;
        if (this.flags[kFLAGS.FACTORY_FOUND] > 0) return true;
        if (this.flags[kFLAGS.DISCOVERED_WITCH_DUNGEON] > 0) return true;
        if (this.flags[kFLAGS.D3_DISCOVERED] > 0) return true;
        if (kGAMECLASS.dungeons.checkPhoenixTowerClear()) return true;
        return false;
    }

    private farmFound(): boolean {
        // Returns true as soon as any known dungeon is found
        if (this.player.hasStatusEffect(StatusEffects.MetWhitney) && this.player.statusEffectv1(StatusEffects.MetWhitney) > 1) {
            if (this.flags[kFLAGS.FARM_DISABLED] == 0) return true;
            if (this.player.isCorruptEnough(70) && this.player.level >= 12 && this.getGame().farm.farmCorruption.corruptFollowers() >= 2 && this.flags[kFLAGS.FARM_CORRUPTION_DISABLED] == 0) return true;
        }
        if (this.flags[kFLAGS.FARM_CORRUPTION_STARTED]) return true;
        return false;
    }
    // ----------------- PLACES MENU -----------------
    private placesKnown(): boolean {
        if (this.placesCount() > 0) return true; // returns true as soon as any known place is found
        return false;
    }

    public placesCount(): number {
        let places: number = 0;
        if (this.flags[kFLAGS.BAZAAR_ENTERED] > 0) places++;
        if (this.player.hasStatusEffect(StatusEffects.BoatDiscovery)) places++;
        if (this.flags[kFLAGS.FOUND_CATHEDRAL] > 0) places++;
        if (this.flags[kFLAGS.FACTORY_FOUND] > 0 || this.flags[kFLAGS.DISCOVERED_DUNGEON_2_ZETAZ] > 0 || this.flags[kFLAGS.DISCOVERED_WITCH_DUNGEON] > 0) places++;
        if (this.farmFound()) places++;
        if (this.flags[kFLAGS.OWCA_UNLOCKED] > 0) places++;
        if (this.player.hasStatusEffect(StatusEffects.HairdresserMeeting)) places++;
        if (this.player.statusEffectv1(StatusEffects.TelAdre) >= 1) places++;
        if (this.flags[kFLAGS.AMILY_VILLAGE_ACCESSIBLE] > 0) places++;
        if (this.flags[kFLAGS.MET_MINERVA] >= 4) places++;
        if (this.flags[kFLAGS.PRISON_CAPTURE_COUNTER] > 0) places++;
        return places;
    }
    // All cleaned up!
    public places(): boolean {
        this.hideMenus();
        this.clearOutput();
        this.outputText(this.images.showImage("camp-pathfinder"));
        this.outputText("Which place would you like to visit?");

        this.menu(); // build menu
        if (this.flags[kFLAGS.BAZAAR_ENTERED] > 0) this.addButton(0, "Bazaar", kGAMECLASS.bazaar.enterTheBazaar).hint("Visit the Bizarre Bazaar where the demons and corrupted beings hang out.");
        if (this.player.hasStatusEffect(StatusEffects.BoatDiscovery)) this.addButton(1, "Boat", kGAMECLASS.boat.boatExplore).hint("Get on the boat and explore the lake. \n\nRecommended level: 4");
        if (this.flags[kFLAGS.FOUND_CATHEDRAL] > 0) {
            if (this.flags[kFLAGS.GAR_NAME] === 0) this.addButton(2, "Cathedral", kGAMECLASS.gargoyle.gargoylesTheShowNowOnWBNetwork).hint("Visit the ruined cathedral you've recently discovered.");
            else this.addButton(2, "Cathedral", kGAMECLASS.gargoyle.returnToCathedral).hint("Visit the ruined cathedral where " + this.flags[kFLAGS.GAR_NAME] + " resides.");
        }
        if (this.dungeonFound()) this.addButton(3, "Dungeons", this.dungeons).hint("Delve into dungeons.");
        if (this.flags[kFLAGS.AIKO_TIMES_MET] > 3) this.addButton(4, "Great Tree", kGAMECLASS.forest.aikoScene.encounterAiko).hint("Visit the Great Tree in the Deep Woods where Aiko lives.");
        if (this.farmFound()) this.addButton(5, "Farm", kGAMECLASS.farm.farmExploreEncounter).hint("Visit Whitney's farm.");
        if (this.flags[kFLAGS.OWCA_UNLOCKED] === 1) this.addButton(6, "Owca", kGAMECLASS.owca.gangbangVillageStuff).hint("Visit the sheep village of Owca, known for its pit where a person is hung on the pole weekly to be gang-raped by the demons.");
        if (this.flags[kFLAGS.MET_MINERVA] >= 4) this.addButton(7, "Oasis Tower", kGAMECLASS.highMountains.minervaScene.encounterMinerva).hint("Visit the ruined tower in the high mountains where Minerva resides.");
        if (this.player.hasStatusEffect(StatusEffects.HairdresserMeeting)) this.addButton(8, "Salon", kGAMECLASS.mountain.salon.salonGreeting).hint("Visit the salon for hair services.");
        if (this.player.statusEffectv1(StatusEffects.TelAdre) >= 1) this.addButton(9, "Tel'Adre", kGAMECLASS.telAdre.telAdreMenu).hint("Visit the city of Tel'Adre in desert, easily recognized by the massive tower.");
        if (this.flags[kFLAGS.AMILY_VILLAGE_ACCESSIBLE] > 0) this.addButton(10, "Town Ruins", kGAMECLASS.townRuins.exploreVillageRuin).hint("Visit the village ruins.");
        if (this.flags[kFLAGS.PRISON_CAPTURE_COUNTER] > 0) this.addButton(11, "Prison", kGAMECLASS.prison.prisonIntro, false, undefined, undefined, "Return to the prison and continue your life as Elly's slave.");
        if (this.debug) this.addButton(12, "Ingnam", kGAMECLASS.ingnam.returnToIngnam).hint("Return to Ingnam for debugging purposes. Night-time event weirdness might occur. You have been warned!");
        if (this.achievements[kACHIEVEMENTS.STORY_FINALBOSS] > 0 && (this.getGame().achievementList.achievementsEarned / this.getGame().achievementList.achievementsTotal) >= 0.6 && this.debug) this.addButton(13, "Beta Zone", this.getGame().betaZone.betaZoneEntry).hint("Enter the secret Beta Zone, home of the cut, unfinished and subpar content.\n\nNote: Contains a lot of metaness and fourth wall-breaking moments.");
        this.addButton(14, "Back", this.playerMenu);
        return true;
    }

    private dungeons(): void {
        this.menu();
        if (this.flags[kFLAGS.FACTORY_FOUND] > 0) // turn on dungeon 1
            this.addButton(0, "Factory", this.getGame().dungeons.factory.enterDungeon).hint("Visit the demonic factory in the mountains." + (this.flags[kFLAGS.FACTORY_SHUTDOWN] > 0 ? "\n\nYou've managed to shut down the factory." : "The factory is still running. Marae wants you to shut down the factory!") + (kGAMECLASS.dungeons.checkFactoryClear() ? "\n\nCLEARED!" : ""));
        if (this.flags[kFLAGS.DISCOVERED_DUNGEON_2_ZETAZ] > 0) // turn on dungeon 2
            this.addButton(1, "Deep Cave", this.getGame().dungeons.deepcave.enterDungeon).hint("Visit the cave you've found in the Deepwoods." + (this.flags[kFLAGS.DEFEATED_ZETAZ] > 0 ? "\n\nYou've defeated Zetaz, your old rival." : "") + (kGAMECLASS.dungeons.checkDeepCaveClear() ? "\n\nCLEARED!" : ""));
        if (this.flags[kFLAGS.D3_DISCOVERED] > 0) // turn on dungeon 3
            this.addButton(2, "Stronghold", kGAMECLASS.lethicesKeep.enterD3).hint("Visit the stronghold in the high mountains that belongs to Lethice, the demon queen." + (this.flags[kFLAGS.LETHICE_DEFEATED] > 0 ? "\n\nYou have defeated Lethice and put an end to the demonic threats. Congratulations, you've beaten the main story!" : "") + (kGAMECLASS.dungeons.checkLethiceStrongholdClear() ? "\n\nCLEARED!" : ""));
        // Side dungeons
        if (this.flags[kFLAGS.DISCOVERED_WITCH_DUNGEON] > 0) this.addButton(5, "Desert Cave", this.getGame().dungeons.desertcave.enterDungeon).hint("Visit the cave you've found in the desert." + (this.flags[kFLAGS.SAND_WITCHES_COWED] + this.flags[kFLAGS.SAND_WITCHES_FRIENDLY] > 0 ? "\n\nFrom what you've known, this is the source of the Sand Witches." : "") + (kGAMECLASS.dungeons.checkSandCaveClear() ? "\n\nCLEARED!" : ""));
        if (kGAMECLASS.dungeons.checkPhoenixTowerClear()) this.addButton(6, "Phoenix Tower", this.getGame().dungeons.heltower.returnToHeliaDungeon).hint("Re-visit the tower you went there as part of Helia's quest." + (kGAMECLASS.dungeons.checkPhoenixTowerClear() ? "\n\nYou've helped Helia in the quest and resolved the problems. \n\nCLEARED!" : ""));
        // Fetish Church?
        // if (debug) addButton(7, "H.Hound Cmplx", getGame().dungeons.hellcomplex.enterDungeonDev).hint("For testing purposes only.", "Hellhound Complex");
        // Non-hostile dungeons
        if (this.flags[kFLAGS.ANZU_PALACE_UNLOCKED] > 0) this.addButton(10, "Anzu's Palace", this.getGame().dungeons.palace.enterDungeon).hint("Visit the palace in the Glacial Rift where Anzu the avian deity resides.");
        this.addButton(14, "Back", this.places);
    }
    // Update Exgartuan stuff
    private exgartuanCampUpdate(): void {
        if (this.player.hasStatusEffect(StatusEffects.Exgartuan)) {
            if (this.player.statusEffectv1(StatusEffects.Exgartuan) == 1 && (this.player.cockArea(0) < 100 || this.player.cocks.length == 0)) {
                this.clearOutput();
                this.outputText(this.images.showImage("camp-exgartuan-urine"));
                this.outputText("<b>You suddenly feel the urge to urinate, and stop over by some bushes.  It takes wayyyy longer than normal, and once you've finished, you realize you're alone with yourself for the first time in a long time.");
                if (this.player.hasCock()) this.outputText("  Perhaps you got too small for Exgartuan to handle?</b>\n");
                else this.outputText("  It looks like the demon didn't want to stick around without your manhood.</b>\n");
                this.player.removeStatusEffect(StatusEffects.Exgartuan); // if too small dick, remove him
                this.awardAchievement("Urine Trouble", kACHIEVEMENTS.GENERAL_URINE_TROUBLE, true);
            }
            else if (this.player.statusEffectv1(StatusEffects.Exgartuan) == 2 && this.player.biggestTitSize() < 12) {
                this.clearOutput();
                this.outputText(this.images.showImage("camp-exgartuan-milk"));
                this.outputText("<b>Black milk dribbles from your " + this.player.nippleDescript(0) + ".  It immediately dissipates into the air, leaving you feeling alone.  It looks like you became too small for Exgartuan!\n</b>");
                this.player.removeStatusEffect(StatusEffects.Exgartuan); // tit removal
            }
        }
        this.doNext(this.playerMenu);
    }
    // Wake up from a bad end
    public wakeFromBadEnd(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("camp-nightmare"));
        this.outputText("No, it can't be.  It's all just a dream!  You've got to wake up!");
        this.outputText("\n\nYou wake up and scream.  You pull out a mirror and take a look at yourself.  Yep, you look normal again.  That was the craziest dream you ever had.");
        if (this.flags[kFLAGS.TIMES_BAD_ENDED] >= 2) // FOURTH WALL BREAKER
            this.outputText("\n\nYou mumble to yourself \"<i>Another goddamn bad-end.</i>\"");
        if (this.marbleFollower()) this.outputText("\n\n\"<i>Are you okay, sweetie?</i>\" Marble asks.  You assure her that you're fine; you've just had a nightmare.");
        if (this.flags[kFLAGS.HUNGER_ENABLED] > 0) this.player.hunger = 40;
        if (this.flags[kFLAGS.HUNGER_ENABLED] >= 1 && this.player.ballSize > (18 + (this.player.str / 2) + (this.player.tallness / 4))) {
            this.outputText("\n\nYou realize the consequences of having oversized balls and you NEED to shrink it right away. Reducto will do.");
            this.player.ballSize = (14 + (this.player.str / 2) + (this.player.tallness / 4));
        }
        if (this.flags[kFLAGS.EASY_MODE_ENABLE_FLAG] > 0 || this.debug) this.outputText("\n\n\nYou get up, still feeling confused from the nightmares.");
        else this.outputText("\n\n\nYou get up, still feeling traumatized from the nightmares.");
        this.getGame().time.days++; // skip time forward
        if (this.flags[kFLAGS.BENOIT_CLOCK_BOUGHT] > 0) this.getGame().time.hours = this.flags[kFLAGS.BENOIT_CLOCK_ALARM];
        else this.getGame().time.hours = 6;
        // Set so you're in camp
        this.inDungeon = false;
        this.inRoomedDungeon = false;
        this.inRoomedDungeonResume = undefined;
        this.combat.clearStatuses();
        this.getGame().inCombat = false;
        // Restore stats
        this.player.HP = this.player.maxHP();
        this.player.fatigue = 0;
        this.statScreenRefresh();
        // PENALTY!
        let penaltyMultiplier: number = 1;
        penaltyMultiplier += this.flags[kFLAGS.GAME_DIFFICULTY] * 0.5;
        if (this.flags[kFLAGS.EASY_MODE_ENABLE_FLAG] > 0 || this.debug) penaltyMultiplier = 0;
        // Deduct XP and gems
        this.player.gems -= int((this.player.gems / 10) * penaltyMultiplier);
        this.player.XP -= int((this.player.level * 10) * penaltyMultiplier);
        if (this.player.gems < 0) this.player.gems = 0;
        if (this.player.XP < 0) this.player.XP = 0;
        // Deduct attributes
        if (this.player.str100 > 20) this.dynStats("str", Math.ceil(-this.player.str * 0.02) * penaltyMultiplier);
        if (this.player.tou100 > 20) this.dynStats("tou", Math.ceil(-this.player.tou * 0.02) * penaltyMultiplier);
        if (this.player.spe100 > 20) this.dynStats("spe", Math.ceil(-this.player.spe * 0.02) * penaltyMultiplier);
        if (this.player.inte100 > 20) this.dynStats("inte", Math.ceil(-this.player.inte * 0.02) * penaltyMultiplier);
        this.menu();
        this.addButton(0, "Next", this.playerMenu);
    }
    // Camp wall
    private buildCampWallPrompt(): void {
        this.clearOutput();
        if (this.flags[kFLAGS.CAMP_WALL_PROGRESS] <= 20) this.outputText(this.images.showImage("camp-wall-partI"));
        else if (this.flags[kFLAGS.CAMP_WALL_PROGRESS] <= 40) this.outputText(this.images.showImage("camp-wall-partII"));
        else if (this.flags[kFLAGS.CAMP_WALL_PROGRESS] <= 60) this.outputText(this.images.showImage("camp-wall-partIII"));
        else this.outputText(this.images.showImage("camp-wall-partIV"));
        if (this.player.fatigue >= this.player.maxFatigue() - 50) {
            this.outputText("You are too exhausted to work on your camp wall!");
            this.doNext(this.doCamp);
            return;
        }
        if (this.flags[kFLAGS.CAMP_WALL_PROGRESS] == 0) {
            this.outputText("A feeling of unrest grows within you as the population of your camp is growing. Maybe it's time you build a wall to secure the perimeter?\n\n");
            this.flags[kFLAGS.CAMP_WALL_PROGRESS] = 1;
        }
        else {
            if (this.flags[kFLAGS.CAMP_WALL_PROGRESS] <= 20)
                this.outputText("You can continue work on building the wall that surrounds your camp.\n\n");
            this.outputText("Segments complete: " + Math.floor(this.flags[kFLAGS.CAMP_WALL_PROGRESS] / 20) + "/5\n\n");
        }
        kGAMECLASS.camp.cabinProgress.checkMaterials();
        this.outputText("\n\nIt will cost 50 nails, 50 stones and 100 wood to work on a segment of the wall.\n\n");
        if (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] >= 100 && this.player.keyItemv1("Carpenter's Toolbox") >= 50 && this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] >= 50) this.doYesNo(this.buildCampWall, this.doCamp);
        else {
            this.outputText("\n<b>Unfortunately, you do not have sufficient resources.</b>");
            this.doNext(this.doCamp);
        }
    }

    private buildCampWall(): void {
        let helpers: number = 0;
        const helperArray: any[] = [];
        if (this.marbleFollower()) {
            helperArray.push("Marble");
            helpers++;
        }
        if (this.followerHel()) {
            helperArray.push("Helia");
            helpers++;
        }
        if (this.followerKiha()) {
            helperArray.push("Kiha");
            helpers++;
        }
        this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] -= 50;
        this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] -= 100;
        this.player.addKeyValue("Carpenter's Toolbox", 1, -50);
        this.clearOutput();
        if (this.flags[kFLAGS.CAMP_WALL_PROGRESS] == 1) {
            this.outputText(this.images.showImage("item-carpentersBook"));
            this.outputText("You pull out a book titled \"Carpenter's Guide\" and flip pages until you come across instructions on how to build a wall. You spend minutes looking at the instructions and memorize the procedures.");
            this.flags[kFLAGS.CAMP_WALL_PROGRESS] = 20;
        }
        else {
            this.outputText("You remember the procedure for building a wall.");
            this.flags[kFLAGS.CAMP_WALL_PROGRESS] += 20;
        }
        this.outputText("\n\nYou dig four holes, six inches deep and one foot wide each, before putting up wood posts, twelve feet high and one foot thick each. You take the wood from supplies, saw the wood and cut them into planks before nailing them to the wooden posts.");
        if (helpers > 0) {
            this.outputText("\n\n" + Camp.formatStringArray(helperArray));
            this.outputText(" " + (helpers == 1 ? "assists" : "assist") + " you with building the wall, helping to speed up the process and make construction less fatiguing.");
        }
        // Gain fatigue
        let fatigueAmount: number = 100;
        fatigueAmount -= this.player.str / 5;
        fatigueAmount -= this.player.tou / 10;
        fatigueAmount -= this.player.spe / 10;
        if (this.player.findPerk(PerkLib.IronMan) >= 0) fatigueAmount -= 20;
        fatigueAmount /= (helpers + 1);
        if (fatigueAmount < 15) fatigueAmount = 15;
        this.player.changeFatigue(fatigueAmount);
        if (helpers >= 2) {
            this.outputText("\n\nThanks to your assistants, the construction takes only one hour!");
            this.doNext(this.camp.returnToCampUseOneHour);
        }
        else if (helpers == 1) {
            this.outputText("\n\nThanks to your assistant, the construction takes only two hours.");
            this.doNext(this.camp.returnToCampUseTwoHours);
        }
        else {
            this.outputText("\n\nIt's " + (fatigueAmount >= 75 ? "a daunting" : "an easy") + " task but you eventually manage to finish building a segment of the wall for your camp!");
            this.doNext(this.camp.returnToCampUseFourHours);
        }
        if (this.flags[kFLAGS.CAMP_WALL_PROGRESS] >= 100) {
            this.outputText("\n\n<b>Well done! You have finished the wall! You can build a gate and decorate wall with imp skulls to further deter whoever might try to come and rape you.</b>");
            this.output.flush();
        }
    }
    // Camp gate
    private buildCampGatePrompt(): void {
        this.clearOutput();
        if (this.player.fatigue >= this.player.maxFatigue() - 50) {
            this.outputText("You are too exhausted to work on your camp wall!");
            this.doNext(this.doCamp);
            return;
        }
        this.outputText(this.images.showImage("camp-wall-gate"));
        this.outputText("You can build a gate to further secure your camp by having it closed at night.\n\n");
        kGAMECLASS.camp.cabinProgress.checkMaterials();
        this.outputText("\n\nIt will cost 100 nails, 100 stones and 100 wood to build a gate.\n\n");
        if (this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] >= 100 && this.player.keyItemv1("Carpenter's Toolbox") >= 100 && this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] >= 100)
            this.doYesNo(this.buildCampGate, this.doCamp);
        else {
            this.outputText("\n<b>Unfortunately, you do not have sufficient resources.</b>");
            this.doNext(this.doCamp);
        }
    }

    private buildCampGate(): void {
        let helpers: number = 0;
        const helperArray: any[] = [];
        if (this.marbleFollower()) {
            helperArray.push("Marble");
            helpers++;
        }
        if (this.followerHel()) {
            helperArray.push("Helia");
            helpers++;
        }
        if (this.followerKiha()) {
            helperArray.push("Kiha");
            helpers++;
        }
        this.flags[kFLAGS.CAMP_CABIN_STONE_RESOURCES] -= 100;
        this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] -= 100;
        this.player.addKeyValue("Carpenter's Toolbox", 1, -100);
        this.clearOutput();
        this.outputText(this.images.showImage("item-carpentersBook"));
        this.outputText("You pull out a book titled \"Carpenter's Guide\" and flip pages until you come across instructions on how to build a gate that can be opened and closed. You spend minutes looking at the instructions and memorize the procedures.");
        this.flags[kFLAGS.CAMP_WALL_GATE] = 1;
        this.outputText("\n\nYou take the wood from supplies, saw the wood and cut them into planks before nailing them together. ");
        if (helpers > 0) {
            this.outputText("\n\n" + Camp.formatStringArray(helperArray));
            this.outputText(" " + (helpers == 1 ? "assists" : "assist") + " you with building the gate, helping to speed up the process and make construction less fatiguing. ");
        }
        this.outputText("\n\nYou eventually finish building the gate.");
        // Gain fatigue
        let fatigueAmount: number = 100;
        fatigueAmount -= this.player.str / 5;
        fatigueAmount -= this.player.tou / 10;
        fatigueAmount -= this.player.spe / 10;
        if (this.player.findPerk(PerkLib.IronMan) >= 0) fatigueAmount -= 20;
        fatigueAmount /= (helpers + 1);
        if (fatigueAmount < 15) fatigueAmount = 15;
        this.player.changeFatigue(fatigueAmount);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    private promptHangImpSkull(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("item-impSkull"));
        if (this.flags[kFLAGS.CAMP_WALL_SKULLS] >= 100) {
            this.outputText("There is no room; you have already hung a total of 100 imp skulls! No imp shall dare approaching you at night!");
            this.doNext(this.doCamp);
            return;
        }
        this.outputText("Would you like to hang the skull of an imp onto wall? ");
        if (this.flags[kFLAGS.CAMP_WALL_SKULLS] > 0) this.outputText("There " + (this.flags[kFLAGS.CAMP_WALL_SKULLS] == 1 ? "is" : "are") + " currently " + Camp.num2Text(this.flags[kFLAGS.CAMP_WALL_SKULLS]) + " imp skull" + (this.flags[kFLAGS.CAMP_WALL_SKULLS] == 1 ? "" : "s") + " hung on the wall, serving to deter any imps who might try to rape you.");
        this.doYesNo(this.hangImpSkull, this.doCamp);
    }

    private hangImpSkull(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("camp-wall-skull"));
        this.outputText("You hang the skull of an imp on the wall. ");
        this.player.consumeItem(this.useables.IMPSKLL, 1);
        this.flags[kFLAGS.CAMP_WALL_SKULLS]++;
        this.outputText("There " + (this.flags[kFLAGS.CAMP_WALL_SKULLS] == 1 ? "is" : "are") + " currently " + Camp.num2Text(this.flags[kFLAGS.CAMP_WALL_SKULLS]) + " imp skull" + (this.flags[kFLAGS.CAMP_WALL_SKULLS] == 1 ? "" : "s") + " hung on the wall, serving to deter any imps who might try to rape you.");
        this.doNext(this.doCamp);
    }

    public homeDesc(): string {
        let textToChoose: string;
        if (this.flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] > 0) textToChoose = "cabin";
        else textToChoose = "tent";
        return textToChoose;
    }
    public bedDesc(): string {
        let textToChoose: string;
        if (this.flags[kFLAGS.CAMP_BUILT_CABIN] > 0 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] > 0) textToChoose = "bed";
        else textToChoose = "bedroll";
        return textToChoose;
    }

    private promptAscend(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("event-question"));
        this.outputText("Are you sure you want to ascend? This will restart the game and put you into ");
        if (this.flags[kFLAGS.NEW_GAME_PLUS_LEVEL] == 0) this.outputText("<b>New Game+</b>");
        else if (this.flags[kFLAGS.NEW_GAME_PLUS_LEVEL] == 1) this.outputText("<b>New Game++</b>");
        else if (this.flags[kFLAGS.NEW_GAME_PLUS_LEVEL] == 2) this.outputText("<b>New Game+++</b>");
        else this.outputText("<b>New Game+" + (this.flags[kFLAGS.NEW_GAME_PLUS_LEVEL] + 1) + "</b>");
        this.outputText(". Your items, level, and attributes except Corruption will be carried over into new playthrough. You'll revert back to human completely but you'll get to keep ears, horns, and tail transformations, if any. You'll also retain your name and gender.");
        this.outputText("\n\n<b>Proceed?</b>");
        this.doYesNo(this.ascendForReal, this.campActions);
    }
    // Sorted alphabetically
    private totalChildrenForAscension(): number {
        let amount: number = 0;
        amount += this.flags[kFLAGS.AMILY_BIRTH_TOTAL] + this.flags[kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS]; // Amily
        amount += this.flags[kFLAGS.BEHEMOTH_CHILDREN]; // Behemoth
        amount += this.flags[kFLAGS.BENOIT_EGGS] + this.flags[kFLAGS.FEMOIT_EGGS_LAID]; // Benoit(e)
        amount += this.flags[kFLAGS.COTTON_KID_COUNT]; // Cotton
        amount += this.flags[kFLAGS.EDRYN_NUMBER_OF_KIDS]; // Edryn
        amount += this.emberScene.emberChildren(); // Ember
        amount += this.isabellaScene.totalIsabellaChildren(); // Isabella
        amount += this.izmaScene.totalIzmaChildren(); // Izma
        amount += this.joyScene.getTotalLitters(); // Jojo/Joy
        amount += this.flags[kFLAGS.KELLY_KIDS]; // Kelly
        amount += this.kihaFollower.totalKihaChildren(); // Kiha
        amount += this.flags[kFLAGS.LOPPE_KIDS]; // Loppe
        amount += this.flags[kFLAGS.LYNNETTE_BABY_COUNT]; // Lynnette
        amount += this.flags[kFLAGS.MARBLE_KIDS]; // Marble
        amount += this.flags[kFLAGS.MINERVA_CHILDREN]; // Minerva
        amount += Math.pow(this.flags[kFLAGS.ANT_KIDS] + this.flags[kFLAGS.PHYLLA_DRIDER_BABIES_COUNT], 0.4); // Phylla, at 5000 ant children it would count as 30 other kids
        amount += this.flags[kFLAGS.SHEILA_JOEYS] + this.flags[kFLAGS.SHEILA_IMPS]; // Sheila
        amount += this.sophieBimbo.sophieChildren(); // Sophie
        amount += (this.flags[kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS] / 4); // Tamani
        amount += this.urtaPregs.urtaKids(); // Urta
        return amount;
    }
    private ascendForReal(): void {
        // Check performance!
        let performancePoints: number = 0;
        performancePoints += this.companionsCount(); // companions
        // Dungeons
        if (kGAMECLASS.dungeons.checkFactoryClear()) performancePoints++;
        if (kGAMECLASS.dungeons.checkDeepCaveClear()) performancePoints++;
        if (kGAMECLASS.dungeons.checkLethiceStrongholdClear()) performancePoints++;
        if (kGAMECLASS.dungeons.checkSandCaveClear()) performancePoints++;
        if (kGAMECLASS.dungeons.checkPhoenixTowerClear()) performancePoints += 2;
        // Quests
        if (this.flags[kFLAGS.MARBLE_PURIFIED] > 0) performancePoints += 2;
        if (this.flags[kFLAGS.MINERVA_PURIFICATION_PROGRESS] >= 10) performancePoints += 2;
        if (this.flags[kFLAGS.URTA_QUEST_STATUS] > 0) performancePoints += 2;
        if (this.player.findPerk(PerkLib.Enlightened) >= 0) performancePoints += 1;
        if (this.flags[kFLAGS.CORRUPTED_MARAE_KILLED] > 0 || this.flags[kFLAGS.PURE_MARAE_ENDGAME] >= 2) performancePoints += 1;
        performancePoints += Math.sqrt(this.totalChildrenForAscension()); // children
        this.player.ascensionPerkPoints += performancePoints; // sum up ascension perk points!
        this.player.knockUpForce(); // clear pregnancy
        // Scene GO!
        this.clearOutput();
        if (this.marbleFollower() && this.flags[kFLAGS.MARBLE_KIDS] >= 7) this.outputText(this.images.showImage("camp-ascending-marble"));
        else if (this.flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] >= 7) this.outputText(this.images.showImage("camp-ascending-sophie"));
        else if (this.flags[kFLAGS.AMILY_BIRTH_TOTAL] + this.flags[kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS] > 12) this.outputText(this.images.showImage("camp-ascending-amily"));
        else if (this.urtaPregs.urtaKids() >= 7) this.outputText(this.images.showImage("camp-ascending-urta"));
        else if (this.player.cor >= 75) this.outputText(this.images.showImage("camp-ascending-corrupt"));
        else if (this.flags[kFLAGS.MET_OTTERGIRL] >= 12 && this.player.hasCock()) this.outputText(this.images.showImage("camp-ascending-callu"));
        else this.outputText(this.images.showImage("camp-watch-stars"));
        this.outputText("It's time for you to ascend. You walk to the center of the camp, announce that you're going to ascend to a higher plane of existence, and lay down. ");
        if (this.companionsCount() == 1) this.outputText("\n\nYour fellow companion comes to witness.");
        else if (this.companionsCount() > 1) this.outputText("\n\nYour fellow companions come to witness.");
        this.outputText("\n\nYou begin to glow; you can already feel yourself leaving your body and you announce your departure.");
        if (this.marbleFollower()) this.outputText("\n\n\"<i>Sweetie, I'm going to miss you. See you in the next playthrough,</i>\" Marble says, tears leaking from her eyes.");
        this.outputText("\n\nThe world around you slowly fades to black and stars dot the endless void. <b>You have ascended.</b>");
        this.doNext(kGAMECLASS.charCreation.ascensionMenu);
    }

    public setLevelButton(): boolean {
        if ((this.player.XP >= this.player.requiredXP() && this.player.level < kGAMECLASS.levelCap) || this.player.perkPoints > 0 || this.player.statPoints > 0) {
            if (this.player.XP < this.player.requiredXP() || this.player.level >= kGAMECLASS.levelCap) {
                if (this.player.statPoints > 0) {
                    this.mainView.setMenuButton(MainView.MENU_LEVEL, "Stat Up");
                    this.mainView.levelButton.toolTipTextInstance = "Distribute your stats points. \n\nYou currently have " + String(this.player.statPoints) + ".";
                }
                else {
                    this.mainView.setMenuButton(MainView.MENU_LEVEL, "Perk Up");
                    this.mainView.levelButton.toolTipTextInstance = "Spend your perk points on a new perk. \n\nYou currently have " + String(this.player.perkPoints) + ".";
                }
            }
            else {
                this.mainView.setMenuButton(MainView.MENU_LEVEL, "Level Up");
                this.mainView.levelButton.toolTipTextInstance = "Level up to increase your maximum HP by 15 and gain 5 attribute points and 1 perk points.";
                if (this.flags[kFLAGS.AUTO_LEVEL] > 0) {
                    kGAMECLASS.playerInfo.levelUpGo();
                    return true; // true indicates that you should be routed to level-up
                }
            }
            this.mainView.showMenuButton(MainView.MENU_LEVEL);
            this.mainView.statsView.showLevelUp();
            if (this.player.str >= this.player.getMaxStats("str") && this.player.tou >= this.player.getMaxStats("tou") && this.player.inte >= this.player.getMaxStats("int") && this.player.spe >= this.player.getMaxStats("spe") && (this.player.perkPoints <= 0 || kGAMECLASS.playerInfo.buildPerkList().length <= 0) && (this.player.XP < this.player.requiredXP() || this.player.level >= kGAMECLASS.levelCap))
                this.mainView.statsView.hideLevelUp();
        }
        else {
            this.mainView.hideMenuButton(MainView.MENU_LEVEL);
            this.mainView.statsView.hideLevelUp();
        }
        return false;
    }
    // ------------ Camp population ------------
    public getCampPopulation(): number {
        let pop: number = 0; // once you enter Mareth, this will increase to 1
        if (this.flags[kFLAGS.IN_INGNAM] <= 0) pop++; // you count toward the population!
        pop += this.companionsCount();
        // Misc check!
        if (this.ceraphIsFollower()) pop--; // Ceraph doesn't stay in your camp
        if (this.player.armorName == "goo armor") pop++; // include Valeria if you're wearing her
        if (this.flags[kFLAGS.CLARA_IMPRISONED] > 0) pop++;
        if (this.flags[kFLAGS.ANEMONE_KID] > 0) pop++;
        if (this.flags[kFLAGS.FUCK_FLOWER_LEVEL] >= 4) pop++;
        // 						 Children check!
        /******************************************************************/
        /*							Followers							  */
        /******************************************************************/
        if (this.followerEmber() && this.emberScene.emberChildren() > 0) pop += this.emberScene.emberChildren();
        // Jojo's offsprings don't stay in your camp; they will join with Amily's litters as well
        if (this.sophieFollower()) {
            if (this.flags[kFLAGS.SOPHIE_DAUGHTER_MATURITY_COUNTER] > 0) pop++;
            if (this.flags[kFLAGS.SOPHIE_ADULT_KID_COUNT]) pop += this.flags[kFLAGS.SOPHIE_ADULT_KID_COUNT];
        }
        /******************************************************************/
        /*							Lovers								  */
        /******************************************************************/
        // Amily's offsprings don't stay in your camp
        // Helia can only have 1 child: Helspawn. She's included in companions count
        if (this.isabellaFollower() && this.isabellaScene.totalIsabellaChildren() > 0) pop += this.isabellaScene.totalIsabellaChildren();
        if (this.izmaFollower() && this.izmaScene.totalIzmaChildren() > 0) pop += this.izmaScene.totalIzmaChildren();
        if (this.followerKiha() && this.kihaFollower.totalKihaChildren() > 0) pop += this.kihaFollower.totalKihaChildren();
        if (this.marbleFollower() && this.flags[kFLAGS.MARBLE_KIDS] > 0) pop += this.flags[kFLAGS.MARBLE_KIDS];
        if (this.flags[kFLAGS.ANT_WAIFU] > 0 && (this.flags[kFLAGS.ANT_KIDS] > 0 || this.flags[kFLAGS.PHYLLA_DRIDER_BABIES_COUNT] > 0)) pop += (this.flags[kFLAGS.ANT_KIDS] + this.flags[kFLAGS.PHYLLA_DRIDER_BABIES_COUNT]);
        return pop; // return number!
    }

    private fixFlags(): void {
        if (this.player.hasStatusEffect(StatusEffects.MetMarae)) {
            this.flags[kFLAGS.MET_MARAE] = 1; // Marae
            this.player.removeStatusEffect(StatusEffects.MetMarae);
        }
        if (this.player.hasStatusEffect(StatusEffects.MaraesQuestStart)) {
            this.flags[kFLAGS.MARAE_QUEST_START] = 1;
            this.player.removeStatusEffect(StatusEffects.MaraesQuestStart);
        }
        if (this.player.hasStatusEffect(StatusEffects.MaraeComplete)) {
            this.flags[kFLAGS.MARAE_QUEST_COMPLETE] = 1;
            this.player.removeStatusEffect(StatusEffects.MaraeComplete);
        }
        if (this.player.hasStatusEffect(StatusEffects.MaraesLethicite)) {
            this.player.createKeyItem("Marae's Lethicite", 3, 0, 0, 0);
            this.player.removeStatusEffect(StatusEffects.MaraesLethicite);
        }
        if (this.player.hasStatusEffect(StatusEffects.FactorySuccubusDefeated)) {
            this.flags[kFLAGS.FACTORY_SUCCUBUS_DEFEATED] = 1; // Factory Demons
            this.player.removeStatusEffect(StatusEffects.FactorySuccubusDefeated);
        }
        if (this.player.hasStatusEffect(StatusEffects.FactoryIncubusDefeated)) {
            this.flags[kFLAGS.FACTORY_OMNIBUS_DEFEATED] = 1;
            this.player.removeStatusEffect(StatusEffects.FactoryIncubusDefeated);
        }
        if (this.player.hasStatusEffect(StatusEffects.FactoryOmnibusDefeated)) {
            this.flags[kFLAGS.FACTORY_OMNIBUS_DEFEATED] = 1;
            this.player.removeStatusEffect(StatusEffects.FactoryOmnibusDefeated);
        }
        if (this.player.hasStatusEffect(StatusEffects.FoundFactory)) {
            this.flags[kFLAGS.FACTORY_FOUND] = 1; // Factory Variables
            this.player.removeStatusEffect(StatusEffects.FoundFactory);
        }
        if (this.player.hasStatusEffect(StatusEffects.IncubusBribed)) {
            this.flags[kFLAGS.FACTORY_INCUBUS_BRIBED] = 1;
            this.player.removeStatusEffect(StatusEffects.IncubusBribed);
        }
        if (this.player.hasStatusEffect(StatusEffects.DungeonShutDown)) {
            this.flags[kFLAGS.FACTORY_SHUTDOWN] = 1;
            this.player.removeStatusEffect(StatusEffects.DungeonShutDown);
        }
        if (this.player.hasStatusEffect(StatusEffects.FactoryOverload)) {
            this.flags[kFLAGS.FACTORY_SHUTDOWN] = 2;
            this.player.removeStatusEffect(StatusEffects.FactoryOverload);
        }
        if (this.player.hasStatusEffect(StatusEffects.TakenLactaid)) {
            this.flags[kFLAGS.FACTORY_TAKEN_LACTAID] = 5 - (this.player.statusEffectv1(StatusEffects.TakenLactaid));
            this.player.removeStatusEffect(StatusEffects.TakenLactaid);
        }
        if (this.player.hasStatusEffect(StatusEffects.TakenGroPlus)) {
            this.flags[kFLAGS.FACTORY_TAKEN_GROPLUS] = 5 - (this.player.statusEffectv1(StatusEffects.TakenGroPlus));
            this.player.removeStatusEffect(StatusEffects.TakenGroPlus);
        }
        if (kGAMECLASS.dungeons.checkPhoenixTowerClear()) this.flags[kFLAGS.CLEARED_HEL_TOWER] = 1;
    }
    private promptSaveUpdate(): void {
        this.clearOutput();
        this.outputText(this.images.showImage("event-floppy"));
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] < 2) {
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 2;
            this.outputText("<b><u>CAUTION</u></b>\n");
            this.outputText("It appears that you are importing your save from vanilla CoC.");
            this.outputText("\n\nIf you're planning to save over your original save file, please stop to think. If you overwrite the save file from original game, it will no longer be backwards compatible with the original CoC.");
            this.outputText("\n\nI suggest you create separate save files. I recommend you use slots 10-14 for saving your progress in this mod.");
            this.outputText("\n\nWithout further ado, enjoy everything CoC: Unofficial Expanded Edition has to offer!");
            this.doNext(this.doCamp);
            return;
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] == 2) {
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 3;
            this.outputText("Starting in version 0.8 of this mod, achievements are now awarded. To ensure that you don't have to go through scenes again on new savefile, achievements will be awarded depending on flags.");
            this.outputText("\n\nSome achievements, however, will require you to do it again.");
            this.updateAchievements();
            this.outputText("\n\nAchievements are saved in a special savefile so no matter what savefile you're on, any earned achievements will be added to that special savefile.");
            this.doNext(this.doCamp);
            return;
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] == 3) {
            // Reclaim flags for future use
            this.flags[kFLAGS.GIACOMO_MET] = 0;
            this.flags[kFLAGS.GIACOMO_NOTICES_WORMS] = 0;
            this.flags[kFLAGS.PHOENIX_ENCOUNTERED] = 0;
            this.flags[kFLAGS.PHOENIX_WANKED_COUNTER] = 0;
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 4;
            this.doCamp();
            return;
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] == 4) {
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 5;
            if (this.flags[kFLAGS.KELT_KILLED] > 0 && this.player.statusEffectv1(StatusEffects.Kelt) <= 0) {
                this.clearOutput();
                this.outputText("Due to a bug where your bow skill got reset after you've slain Kelt, your bow skill got reset. Fortunately, this is now fixed. As a compensation, your bow skill is now instantly set to 100!");
                if (this.player.statusEffectv1(StatusEffects.Kelt) <= 0) this.player.createStatusEffect(StatusEffects.Kelt, 100, 0, 0, 0);
                this.doNext(this.doCamp);
                return;
            }
            this.doCamp();
            return;
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] == 5) {
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 6;
            if (this.player.armorName == "revealing fur loincloths" || this.player.armorName == "comfortable underclothes" || this.player.weaponName == "dragon-shell shield") {
                this.clearOutput();
                this.outputText("Due to a bit of restructing regarding equipment, any reclassified equipment (eggshell shield and fur loincloth) that was equipped are now unequipped.");
                if (this.player.armorName == "comfortable underclothes") this.player.setArmor(ArmorLib.NOTHING);
                if (this.player.armorName == "revealing fur loincloths") this.inventory.takeItem(this.player.setArmor(ArmorLib.COMFORTABLE_UNDERCLOTHES), this.promptSaveUpdate);
                if (this.player.weaponName == "dragon-shell shield") this.inventory.takeItem(this.player.setWeapon(WeaponLib.FISTS), this.promptSaveUpdate);
                this.doNext(this.doCamp);
                return;
            }
            this.doCamp();
            return;
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] == 6) {
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 7;
            this.flags[kFLAGS.D1_OMNIBUS_KILLED] = this.flags[kFLAGS.CORRUPTED_GLADES_DESTROYED];
            this.flags[kFLAGS.CORRUPTED_GLADES_DESTROYED] = 0; // reclaimed
            if (this.player.armor == this.armors.GOOARMR) this.flags[kFLAGS.VALERIA_FLUIDS] = 100;
            this.doCamp();
            return;
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] == 7) {
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 8;
            // Move and reclaim flag
            this.flags[kFLAGS.LETHICITE_ARMOR_TAKEN] = this.flags[kFLAGS.JOJO_ANAL_CATCH_COUNTER];
            this.flags[kFLAGS.JOJO_ANAL_CATCH_COUNTER] = 0;
            this.doCamp();
            return;
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] == 8) {
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 9;
            if (!this.player.hasFur()) {
                this.doCamp(); // No fur? Return to camp
                return;
            }
            this.clearOutput();
            this.outputText("Starting in version 1.3 of the mod, fur colour is now separate from hair colour. So as a one-time offer, you can now choose fur colour!");
            this.furColorSelection1(); // update fur
            return;
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] == 9) {
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 10;
            if (this.flags[kFLAGS.MARAE_LETHICITE] > 0 && this.player.hasKeyItem("Marae's Lethicite") >= 0) {
                this.player.removeKeyItem("Marae's Lethicite"); // remove the old
                this.player.createKeyItem("Marae's Lethicite", this.flags[kFLAGS.MARAE_LETHICITE], 0, 0, 0);
                this.flags[kFLAGS.MARAE_LETHICITE] = 0; // reclaim the flag
            }
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] == 10) {
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 11;
            if (this.flags[kFLAGS.EMBER_SPAR_VICTORIES] > 0) {
                this.outputText("Due to the official release of Lethice, you can now fight her again! Be prepared to face Drider Incubus and Minotaur King beforehand!");
                this.flags[kFLAGS.EMBER_SPAR_VICTORIES] = 0; // reclaim the flag and display message
                this.doNext(this.doCamp);
                return;
            }
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] == 11) {
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 12;
            this.flags[kFLAGS.GRIMDARK_MODE] = 0;
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] == 12) {
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 13;
            if (this.flags[kFLAGS.CAMP_CABIN_PROGRESS] > 5) // decrement by 2 so that values 6 and 7 are used and progress ends at 10, not 12
                this.flags[kFLAGS.CAMP_CABIN_PROGRESS] -= 2;
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] == 13) {
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 14;
            this.flags[kFLAGS.SANDWITCH_SERVICED] = this.flags[2295];
            this.flags[kFLAGS.JOJO_STATUS] = this.flags[2296];
            // Reclaim those flags
            this.flags[2295] = 0;
            this.flags[2296] = 0;
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] == 14) {
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 15;
            // Reclaim those flags
            this.flags[2194] = 0;
            this.flags[254] = 0;
            this.flags[255] = 0;
        }
        if (this.flags[kFLAGS.MOD_SAVE_VERSION] == 15) {
            this.flags[kFLAGS.MOD_SAVE_VERSION] = 16;
        }
        this.doCamp();
    }

    private furColorSelection1(): void {
        this.menu();
        this.addButton(0, "Brown", this.chooseFurColorSaveUpdate, "brown");
        this.addButton(1, "Chocolate", this.chooseFurColorSaveUpdate, "chocolate");
        this.addButton(2, "Auburn", this.chooseFurColorSaveUpdate, "auburn");
        this.addButton(3, "Orange", this.chooseFurColorSaveUpdate, "orange");
        this.addButton(4, "Next", this.furColorSelection2); // next
        this.addButton(5, "Caramel", this.chooseFurColorSaveUpdate, "caramel");
        this.addButton(6, "Peach", this.chooseFurColorSaveUpdate, "peach");
        this.addButton(7, "Sandy Brown", this.chooseFurColorSaveUpdate, "sandy brown");
        this.addButton(8, "Golden", this.chooseFurColorSaveUpdate, "golden");
    }
    private furColorSelection2(): void {
        this.menu();
        this.addButton(0, "Midnight black", this.chooseFurColorSaveUpdate, "midnight black");
        this.addButton(1, "Black", this.chooseFurColorSaveUpdate, "black");
        this.addButton(2, "Dark gray", this.chooseFurColorSaveUpdate, "dark gray");
        this.addButton(3, "Gray", this.chooseFurColorSaveUpdate, "gray");

        this.addButton(5, "Light gray", this.chooseFurColorSaveUpdate, "light gray");
        this.addButton(6, "Silver", this.chooseFurColorSaveUpdate, "silver");
        this.addButton(7, "White", this.chooseFurColorSaveUpdate, "white");
        this.addButton(9, "Previous", this.furColorSelection1); // previous
        this.addButton(10, "Orange&White", this.chooseFurColorSaveUpdate, "orange and white");
        this.addButton(11, "Brown&White", this.chooseFurColorSaveUpdate, "brown and white");
        this.addButton(12, "Black&White", this.chooseFurColorSaveUpdate, "black and white");
        this.addButton(13, "Gray&White", this.chooseFurColorSaveUpdate, "gray and white");
    }

    private chooseFurColorSaveUpdate(color: string): void {
        this.clearOutput();
        this.outputText("You now have " + color + " fur. You will be returned to your camp now and you can continue your usual gameplay.");
        this.player.skin.furColor = color;
        this.doNext(this.doCamp);
    }
    // Updates save. Done to ensure your save doesn't get screwed up
    private updateSaveFlags(): void {
        this.flags[kFLAGS.MOD_SAVE_VERSION] = kGAMECLASS.modSaveVersion;
        const startOldIds: number = 1195;
        const startNewIds: number = 2001;
        let current: number = 0;
        const target: number = 65;
        while (current < target) {
            // trace(flags[startOldIds + current])
            if (this.flags[startOldIds + current] != 0) {
                this.flags[startNewIds + current] = this.flags[startOldIds + current];
                this.flags[startOldIds + current] = 0;
            }
            current++;
        }
        if (this.player.ass.analLooseness > 0 && this.flags[kFLAGS.TIMES_ORGASMED] <= 0) this.flags[kFLAGS.TIMES_ORGASMED] = 1;
        this.clearOutput();
        this.outputText(this.images.showImage("event-floppy"));
        this.outputText("Your save file has been updated by changing the variables used in this mod from old flag position to new flag position.\n\n");
        this.outputText("As you know, the base game update tends to change flags and that may screw up saves when mod gets updated.\n\n");
        this.outputText("Unfortunately, I can't guarantee if every flags are retained. You may have lost some furniture or may have lost cabin. I'm sorry if this happens. Your codex entries are still unlocked, don't worry. And if your cabin is built, don't worry, it's still intact and you can re-construct furniture again.\n\n");
        if (this.flags[kFLAGS.CAMP_BUILT_CABIN] > 0) {
            this.outputText("As a compensation, here's 50 wood and 150 nails to re-construct your furniture.\n\n");
            this.flags[kFLAGS.CAMP_CABIN_WOOD_RESOURCES] += 50;
            if (this.player.hasKeyItem("Carpenter's Toolbox") >= 0) this.player.addKeyValue("Carpenter's Toolbox", 1, 150);
        }
        this.outputText("Don't worry. Just save the game and you're good to go. I, Kitteh6660, will work out the bugs from time to time, while also bringing in cool new stuff!");
        this.doNext(this.doCamp);
    }

    // Unique NPCs killed
    public getUniqueKills(): number {
        let count: number = 0;
        if (this.flags[kFLAGS.D1_OMNIBUS_KILLED] > 0) count++;
        if (this.flags[kFLAGS.ZETAZ_DEFEATED_AND_KILLED] > 0) count++;
        if (this.flags[kFLAGS.HARPY_QUEEN_EXECUTED] > 0) count++;
        if (this.flags[kFLAGS.KELT_KILLED] > 0) count++;
        if (this.flags[kFLAGS.JOJO_DEAD_OR_GONE] == 2) count++;
        if (this.flags[kFLAGS.CORRUPTED_MARAE_KILLED] > 0) count++;
        if (this.flags[kFLAGS.FUCK_FLOWER_KILLED] > 0) count++;
        if (this.flags[kFLAGS.TAMANI_BAD_ENDED] > 0) count++;
        // Lethice Keep encounters
        if (this.flags[kFLAGS.D3_GARDENER_DEFEATED] == 3) count++;
        if (this.flags[kFLAGS.D3_CENTAUR_DEFEATED] == 1) count++;
        if (this.flags[kFLAGS.D3_MECHANIC_FIGHT_RESULT] == 1) count++;
        if (this.flags[kFLAGS.DRIDERINCUBUS_KILLED] > 0) count++;
        if (this.flags[kFLAGS.MINOTAURKING_KILLED] > 0) count++;
        if (this.flags[kFLAGS.LETHICE_KILLED] > 0) count++;
        return count;
    }

    // Total NPCs killed
    public getTotalKills(): number {
        let count: number = 0;
        count += this.getUniqueKills();
        count += this.flags[kFLAGS.IMPS_KILLED];
        count += this.flags[kFLAGS.GOBLINS_KILLED];
        count += this.flags[kFLAGS.TENTACLE_BEASTS_KILLED];
        count += this.flags[kFLAGS.HELLHOUNDS_KILLED];
        count += this.flags[kFLAGS.MINOTAURS_KILLED];
        count += this.flags[kFLAGS.WORMS_MASS_KILLED];
        return count;
    }

    private updateAchievements(): void {
        // Story
        this.awardAchievement("Newcomer", kACHIEVEMENTS.STORY_NEWCOMER);
        if (this.flags[kFLAGS.MARAE_QUEST_COMPLETE] > 0) this.awardAchievement("Marae's Savior", kACHIEVEMENTS.STORY_MARAE_SAVIOR);
        if (this.player.hasKeyItem("Zetaz's Map") >= 0) this.awardAchievement("Revenge at Last", kACHIEVEMENTS.STORY_ZETAZ_REVENGE);
        if (this.flags[kFLAGS.LETHICE_DEFEATED] > 0) this.awardAchievement("Demon Slayer", kACHIEVEMENTS.STORY_FINALBOSS);
        // Areas
        if (this.flags[kFLAGS.TIMES_EXPLORED_FOREST] > 0 && this.flags[kFLAGS.TIMES_EXPLORED_LAKE] > 0 && this.flags[kFLAGS.TIMES_EXPLORED_DESERT] > 0 && this.flags[kFLAGS.TIMES_EXPLORED_MOUNTAIN] > 0 && this.flags[kFLAGS.TIMES_EXPLORED_PLAINS] > 0 && this.flags[kFLAGS.TIMES_EXPLORED_SWAMP] > 0 && this.player.hasStatusEffect(StatusEffects.ExploredDeepwoods) && this.flags[kFLAGS.DISCOVERED_HIGH_MOUNTAIN] > 0 && this.flags[kFLAGS.BOG_EXPLORED] > 0 && this.flags[kFLAGS.DISCOVERED_GLACIAL_RIFT] > 0)
            this.awardAchievement("Explorer", kACHIEVEMENTS.ZONE_EXPLORER);
        if (this.placesCount() >= 10) this.awardAchievement("Sightseer", kACHIEVEMENTS.ZONE_SIGHTSEER);
        if (this.flags[kFLAGS.TIMES_EXPLORED] >= 1) this.awardAchievement("Where am I?", kACHIEVEMENTS.ZONE_WHERE_AM_I);
        if (this.flags[kFLAGS.TIMES_EXPLORED_DESERT] >= 100) this.awardAchievement("Dehydrated", kACHIEVEMENTS.ZONE_DEHYDRATED);
        if (this.flags[kFLAGS.TIMES_EXPLORED_FOREST] >= 100) this.awardAchievement("Forest Ranger", kACHIEVEMENTS.ZONE_FOREST_RANGER);
        if (this.flags[kFLAGS.TIMES_EXPLORED_LAKE] >= 100) this.awardAchievement("Vacationer", kACHIEVEMENTS.ZONE_VACATIONER);
        if (this.flags[kFLAGS.TIMES_EXPLORED_MOUNTAIN] >= 100) this.awardAchievement("Mountaineer", kACHIEVEMENTS.ZONE_MOUNTAINEER);
        if (this.flags[kFLAGS.TIMES_EXPLORED_PLAINS] >= 100) this.awardAchievement("Rolling Hills", kACHIEVEMENTS.ZONE_ROLLING_HILLS);
        if (this.flags[kFLAGS.TIMES_EXPLORED_SWAMP] >= 100) this.awardAchievement("Wet All Over", kACHIEVEMENTS.ZONE_WET_ALL_OVER);
        if (this.player.statusEffectv1(StatusEffects.ExploredDeepwoods) >= 100) this.awardAchievement("We Need to Go Deeper", kACHIEVEMENTS.ZONE_WE_NEED_TO_GO_DEEPER);
        if (this.flags[kFLAGS.DISCOVERED_HIGH_MOUNTAIN] >= 100) this.awardAchievement("Light-headed", kACHIEVEMENTS.ZONE_LIGHT_HEADED);
        if (this.flags[kFLAGS.BOG_EXPLORED] >= 100) this.awardAchievement("All murky", kACHIEVEMENTS.ZONE_ALL_MURKY);
        if (this.flags[kFLAGS.DISCOVERED_GLACIAL_RIFT] >= 100) this.awardAchievement("Frozen", kACHIEVEMENTS.ZONE_FROZEN);
        if (this.flags[kFLAGS.DISCOVERED_VOLCANO_CRAG] >= 100) this.awardAchievement("Roasted", kACHIEVEMENTS.ZONE_ROASTED);
        // Places
        if (this.player.statusEffectv1(StatusEffects.BoatDiscovery) >= 15) this.awardAchievement("Sea Legs", kACHIEVEMENTS.ZONE_SEA_LEGS);
        if (this.player.statusEffectv1(StatusEffects.MetWhitney) >= 30) this.awardAchievement("Farmer", kACHIEVEMENTS.ZONE_FARMER);
        if (this.flags[kFLAGS.AMILY_VILLAGE_EXPLORED] >= 15) this.awardAchievement("Archaeologist", kACHIEVEMENTS.ZONE_ARCHAEOLOGIST);
        // Levels
        if (this.player.level >= 2) this.awardAchievement("Level up!", kACHIEVEMENTS.LEVEL_LEVEL_UP);
        if (this.player.level >= 5) this.awardAchievement("Novice", kACHIEVEMENTS.LEVEL_NOVICE);
        if (this.player.level >= 10) this.awardAchievement("Apprentice", kACHIEVEMENTS.LEVEL_APPRENTICE);
        if (this.player.level >= 15) this.awardAchievement("Journeyman", kACHIEVEMENTS.LEVEL_JOURNEYMAN);
        if (this.player.level >= 20) this.awardAchievement("Expert", kACHIEVEMENTS.LEVEL_EXPERT);
        if (this.player.level >= 30) this.awardAchievement("Master", kACHIEVEMENTS.LEVEL_MASTER);
        if (this.player.level >= 45) this.awardAchievement("Grandmaster", kACHIEVEMENTS.LEVEL_GRANDMASTER);
        if (this.player.level >= 60) this.awardAchievement("Illustrious", kACHIEVEMENTS.LEVEL_ILLUSTRIOUS);
        if (this.player.level >= 90) this.awardAchievement("Overlord", kACHIEVEMENTS.LEVEL_OVERLORD);
        if (this.player.level >= 120) this.awardAchievement("Are you a god?", kACHIEVEMENTS.LEVEL_ARE_YOU_A_GOD);
        // Population
        if (this.getCampPopulation() >= 2) this.awardAchievement("My First Companion", kACHIEVEMENTS.POPULATION_FIRST);
        if (this.getCampPopulation() >= 5) this.awardAchievement("Hamlet", kACHIEVEMENTS.POPULATION_HAMLET);
        if (this.getCampPopulation() >= 10) this.awardAchievement("Village", kACHIEVEMENTS.POPULATION_VILLAGE);
        if (this.getCampPopulation() >= 25) this.awardAchievement("Town", kACHIEVEMENTS.POPULATION_TOWN);
        if (this.getCampPopulation() >= 100) this.awardAchievement("City", kACHIEVEMENTS.POPULATION_CITY);
        if (this.getCampPopulation() >= 250) this.awardAchievement("Metropolis", kACHIEVEMENTS.POPULATION_METROPOLIS);
        if (this.getCampPopulation() >= 500) this.awardAchievement("Megalopolis", kACHIEVEMENTS.POPULATION_MEGALOPOLIS);
        if (this.getCampPopulation() >= 1000) this.awardAchievement("City-State", kACHIEVEMENTS.POPULATION_CITY_STATE);
        if (this.getCampPopulation() >= 2500) this.awardAchievement("Kingdom", kACHIEVEMENTS.POPULATION_KINGDOM);
        if (this.getCampPopulation() >= 5000) this.awardAchievement("Empire", kACHIEVEMENTS.POPULATION_EMPIRE);
        // Time
        if (this.getGame().time.days >= 30) this.awardAchievement("It's been a month", kACHIEVEMENTS.TIME_MONTH);
        if (this.getGame().time.days >= 180) this.awardAchievement("Half-year", kACHIEVEMENTS.TIME_HALF_YEAR);
        if (this.getGame().time.days >= 365) this.awardAchievement("Annual", kACHIEVEMENTS.TIME_ANNUAL);
        if (this.getGame().time.days >= 730) this.awardAchievement("Biennial", kACHIEVEMENTS.TIME_BIENNIAL);
        if (this.getGame().time.days >= 1095) this.awardAchievement("Triennial", kACHIEVEMENTS.TIME_TRIENNIAL);
        if (this.getGame().time.days >= 1825) this.awardAchievement("In for the long haul", kACHIEVEMENTS.TIME_LONG_HAUL);
        if (this.getGame().time.days >= 3650) this.awardAchievement("Decade", kACHIEVEMENTS.TIME_DECADE);
        if (this.getGame().time.days >= 36500) this.awardAchievement("Century", kACHIEVEMENTS.TIME_CENTURY);
        // Dungeons
        let dungeonsCleared: number = 0;
        if (kGAMECLASS.dungeons.checkFactoryClear()) {
            this.awardAchievement("Shut Down Everything", kACHIEVEMENTS.DUNGEON_SHUT_DOWN_EVERYTHING);
            dungeonsCleared++;
        }
        if (kGAMECLASS.dungeons.checkDeepCaveClear()) {
            this.awardAchievement("You're in Deep", kACHIEVEMENTS.DUNGEON_YOURE_IN_DEEP);
            dungeonsCleared++;
        }
        if (kGAMECLASS.dungeons.checkSandCaveClear()) {
            this.awardAchievement("Friend of the Sand Witches", kACHIEVEMENTS.DUNGEON_SAND_WITCH_FRIEND);
            dungeonsCleared++;
        }
        if (kGAMECLASS.dungeons.checkLethiceStrongholdClear()) {
            this.awardAchievement("End of Reign", kACHIEVEMENTS.DUNGEON_END_OF_REIGN);
            dungeonsCleared++;
        }
        if (kGAMECLASS.dungeons.checkPhoenixTowerClear()) {
            this.awardAchievement("Fall of the Phoenix", kACHIEVEMENTS.DUNGEON_PHOENIX_FALL);
            dungeonsCleared++;
            if (this.flags[kFLAGS.TIMES_ORGASMED] <= 0 && this.flags[kFLAGS.MOD_SAVE_VERSION] == kGAMECLASS.modSaveVersion)
                this.awardAchievement("Extremely Chaste Delver", kACHIEVEMENTS.DUNGEON_EXTREMELY_CHASTE_DELVER);
        }
        if (dungeonsCleared >= 1) this.awardAchievement("Delver", kACHIEVEMENTS.DUNGEON_DELVER);
        if (dungeonsCleared >= 3) this.awardAchievement("Delver Apprentice", kACHIEVEMENTS.DUNGEON_DELVER_APPRENTICE);
        if (dungeonsCleared >= 5) this.awardAchievement("Delver Master", kACHIEVEMENTS.DUNGEON_DELVER_MASTER);
        // Fashion
        if (this.player.armor == this.armors.W_ROBES && this.player.weapon == this.weapons.W_STAFF)
            this.awardAchievement("Wannabe Wizard", kACHIEVEMENTS.FASHION_WANNABE_WIZARD);
        if (this.player.previouslyWornClothes.length >= 10)
            this.awardAchievement("Cosplayer", kACHIEVEMENTS.FASHION_COSPLAYER);
        if ((this.player.armor == this.armors.RBBRCLT || this.player.armor == this.armors.BONSTRP || this.player.armor == this.armors.NURSECL) && (this.player.weapon == this.weapons.RIDING0 || this.player.weapon == this.weapons.WHIP__0 || this.player.weapon == this.weapons.SUCWHIP || this.player.weapon == this.weapons.L_WHIP))
            this.awardAchievement("Dominatrix", kACHIEVEMENTS.FASHION_DOMINATRIX);
        if (this.player.armor != ArmorLib.NOTHING && this.player.lowerGarment == UndergarmentLib.NOTHING && this.player.upperGarment == UndergarmentLib.NOTHING)
            this.awardAchievement("Going Commando", kACHIEVEMENTS.FASHION_GOING_COMMANDO);
        if (this.player.jewelry.value >= 1000)
            this.awardAchievement("Bling Bling", kACHIEVEMENTS.FASHION_BLING_BLING);
        // Wealth
        if (this.player.gems >= 1000) this.awardAchievement("Rich", kACHIEVEMENTS.WEALTH_RICH);
        if (this.player.gems >= 10000) this.awardAchievement("Hoarder", kACHIEVEMENTS.WEALTH_HOARDER);
        if (this.player.gems >= 100000) this.awardAchievement("Gem Vault", kACHIEVEMENTS.WEALTH_GEM_VAULT);
        if (this.player.gems >= 1000000) this.awardAchievement("Millionaire", kACHIEVEMENTS.WEALTH_MILLIONAIRE);
        // Combat
        if (this.player.hasStatusEffect(StatusEffects.KnowsCharge) && this.player.hasStatusEffect(StatusEffects.KnowsBlind) && this.player.hasStatusEffect(StatusEffects.KnowsWhitefire) && this.player.hasStatusEffect(StatusEffects.KnowsArouse) && this.player.hasStatusEffect(StatusEffects.KnowsHeal) && this.player.hasStatusEffect(StatusEffects.KnowsMight))
            this.awardAchievement("Wizard", kACHIEVEMENTS.COMBAT_WIZARD);
        // Realistic
        if (this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_FASTING] >= 168 && this.flags[kFLAGS.HUNGER_ENABLED] > 0) this.awardAchievement("Fasting", kACHIEVEMENTS.REALISTIC_FASTING);
        // Holidays
        if (this.flags[kFLAGS.NIEVE_STAGE] == 5) this.awardAchievement("The Lovable Snowman", kACHIEVEMENTS.HOLIDAY_CHRISTMAS_III);
        if (this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_EGG_HUNTER] >= 10) this.awardAchievement("Egg Hunter", kACHIEVEMENTS.HOLIDAY_EGG_HUNTER);
        // General
        if (this.flags[kFLAGS.DEMONS_DEFEATED] >= 25 && this.getGame().time.days >= 10) this.awardAchievement("Portal Defender", kACHIEVEMENTS.GENERAL_PORTAL_DEFENDER);
        if (this.flags[kFLAGS.LETHICE_KILLED] == 2) this.awardAchievement("Off With Her Head!", kACHIEVEMENTS.GENERAL_OFF_WITH_HER_HEAD);
        // Check how many NPCs got bad-ended
        if (this.getUniqueKills() >= 3) this.awardAchievement("Bad Ender", kACHIEVEMENTS.GENERAL_BAD_ENDER);
        // Transformations
        if (this.flags[kFLAGS.TIMES_TRANSFORMED] >= 1) this.awardAchievement("What's Happening to Me?", kACHIEVEMENTS.GENERAL_WHATS_HAPPENING_TO_ME);
        if (this.flags[kFLAGS.TIMES_TRANSFORMED] >= 10) this.awardAchievement("Transformer", kACHIEVEMENTS.GENERAL_TRANSFORMER);
        if (this.flags[kFLAGS.TIMES_TRANSFORMED] >= 25) this.awardAchievement("Shapeshifty", kACHIEVEMENTS.GENERAL_SHAPESHIFTY);
        if (this.flags[kFLAGS.TIMES_MASTURBATED] >= 1) this.awardAchievement("Fapfapfap", kACHIEVEMENTS.GENERAL_FAPFAPFAP);
        if (this.flags[kFLAGS.TIMES_MASTURBATED] >= 10) this.awardAchievement("Faptastic", kACHIEVEMENTS.GENERAL_FAPTASTIC);
        if (this.flags[kFLAGS.TIMES_MASTURBATED] >= 100) this.awardAchievement("Master-bation", kACHIEVEMENTS.GENERAL_FAPSTER);
        // Usual stuff
        if (this.player.armorName == "goo armor") this.awardAchievement("Goo Armor", kACHIEVEMENTS.GENERAL_GOO_ARMOR);
        if (this.helspawnFollower()) this.awardAchievement("Helspawn", kACHIEVEMENTS.GENERAL_HELSPAWN);
        if (this.flags[kFLAGS.URTA_KIDS_MALES] + this.flags[kFLAGS.URTA_KIDS_FEMALES] + this.flags[kFLAGS.URTA_KIDS_HERMS] > 0) this.awardAchievement("Urta's True Lover", kACHIEVEMENTS.GENERAL_URTA_TRUE_LOVER);
        if (this.flags[kFLAGS.CORRUPTED_MARAE_KILLED] > 0) this.awardAchievement("Godslayer", kACHIEVEMENTS.GENERAL_GODSLAYER);
        if (this.followersCount() >= 7) this.awardAchievement("Follow the Leader", kACHIEVEMENTS.GENERAL_FOLLOW_THE_LEADER);
        if (this.loversCount() >= 8) this.awardAchievement("Gotta Love 'Em All", kACHIEVEMENTS.GENERAL_GOTTA_LOVE_THEM_ALL);
        if (this.slavesCount() >= 4) this.awardAchievement("Meet Your " + this.player.mf("Master", "Mistress"), kACHIEVEMENTS.GENERAL_MEET_YOUR_MASTER);
        if (this.followersCount() + this.loversCount() + this.slavesCount() >= 19) this.awardAchievement("All Your People are Belong to Me", kACHIEVEMENTS.GENERAL_ALL_UR_PPLZ_R_BLNG_2_ME);
        if (this.flags[kFLAGS.MANSION_VISITED] >= 3) this.awardAchievement("Freeloader", kACHIEVEMENTS.GENERAL_FREELOADER);
        if (this.player.perks.length >= 20) this.awardAchievement("Perky", kACHIEVEMENTS.GENERAL_PERKY);
        if (this.player.perks.length >= 35) this.awardAchievement("Super Perky", kACHIEVEMENTS.GENERAL_SUPER_PERKY);
        if (this.player.perks.length >= 50) this.awardAchievement("Ultra Perky", kACHIEVEMENTS.GENERAL_ULTRA_PERKY);
        if (this.player.str >= 50 && this.player.tou >= 50 && this.player.spe >= 50 && this.player.inte >= 50) this.awardAchievement("Jack of All Trades", kACHIEVEMENTS.GENERAL_STATS_50);
        if (this.player.str >= 100 && this.player.tou >= 100 && this.player.spe >= 100 && this.player.inte >= 100) this.awardAchievement("Incredible Stats", kACHIEVEMENTS.GENERAL_STATS_100);
        if (this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_SCHIZOPHRENIA] >= 4) this.awardAchievement("Schizophrenic", kACHIEVEMENTS.GENERAL_SCHIZO);
        if (this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_CLEAN_SLATE] >= 2) this.awardAchievement("Clean Slate", kACHIEVEMENTS.GENERAL_CLEAN_SLATE);
        if (this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_IM_NO_LUMBERJACK] >= 100) this.awardAchievement("I'm No Lumberjack", kACHIEVEMENTS.GENERAL_IM_NO_LUMBERJACK);
        if (this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_DEFORESTER] >= 100) this.awardAchievement("Deforester", kACHIEVEMENTS.GENERAL_DEFORESTER);
        if (this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_HAMMER_TIME] >= 300) this.awardAchievement("Hammer Time", kACHIEVEMENTS.GENERAL_HAMMER_TIME);
        if (this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_SCAVENGER] >= 200) this.awardAchievement("Nail Scavenger", kACHIEVEMENTS.GENERAL_NAIL_SCAVENGER);
        if (this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_YABBA_DABBA_DOO] >= 100) this.awardAchievement("Yabba Dabba Doo", kACHIEVEMENTS.GENERAL_YABBA_DABBA_DOO);
        if (this.flags[kFLAGS.ACHIEVEMENT_PROGRESS_ANTWORKS] >= 200) this.awardAchievement("AntWorks", kACHIEVEMENTS.GENERAL_ANTWORKS);
        if (this.flags[kFLAGS.CAMP_CABIN_FURNITURE_BED] >= 1 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_NIGHTSTAND] >= 1 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_DRESSER] >= 1 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_TABLE] >= 1 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_CHAIR1] >= 1 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_CHAIR2] >= 1 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_BOOKSHELF] >= 1 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_DESK] >= 1 && this.flags[kFLAGS.CAMP_CABIN_FURNITURE_DESKCHAIR] >= 1)
            this.awardAchievement("Home Sweet Home", kACHIEVEMENTS.GENERAL_HOME_SWEET_HOME);
        if (this.flags[kFLAGS.CAMP_WALL_GATE] > 0) this.awardAchievement("Make Mareth Great Again", kACHIEVEMENTS.GENERAL_MAKE_MARETH_GREAT_AGAIN);
        if (this.flags[kFLAGS.CAMP_WALL_STATUES] >= 100) this.awardAchievement("Terracotta Impy", kACHIEVEMENTS.GENERAL_TERRACOTTA_IMPY);
        if (Math.ceil(this.player.tallness) >= 132) this.awardAchievement("Up to Eleven", kACHIEVEMENTS.GENERAL_UP_TO_11);
        if (this.player.hasStatusEffect(StatusEffects.PureCampJojo)) this.awardAchievement("Up to Eleven", kACHIEVEMENTS.GENERAL_JOJOS_BIZARRE_ADVENTURE);
        // Check how many NPCs are dedicked
        let NPCsDedicked: number = 0;
        if (this.flags[kFLAGS.IZMA_NO_COCK] > 0) NPCsDedicked++;
        if (this.flags[kFLAGS.CERAPH_HIDING_DICK] > 0) NPCsDedicked++;
        if (this.flags[kFLAGS.RUBI_ADMITTED_GENDER] > 0 && this.flags[kFLAGS.RUBI_COCK_SIZE] <= 0) NPCsDedicked++;
        if (this.flags[kFLAGS.BENOIT_STATUS] == 1 || this.flags[kFLAGS.BENOIT_STATUS] == 2) NPCsDedicked++;
        if (this.flags[kFLAGS.ARIAN_HEALTH] > 0 && this.flags[kFLAGS.ARIAN_COCK_SIZE] <= 0) NPCsDedicked++;
        if (this.flags[kFLAGS.KATHERINE_UNLOCKED] > 0 && this.flags[kFLAGS.KATHERINE_DICK_COUNT] <= 0) NPCsDedicked++;
        if (this.flags[kFLAGS.MET_KITSUNES] > 0 && this.flags[kFLAGS.redheadIsFuta] == 0) NPCsDedicked++;
        if (this.flags[kFLAGS.KELT_BREAK_LEVEL] == 4) NPCsDedicked++;
        if (NPCsDedicked >= 3) this.awardAchievement("Dick Banisher", kACHIEVEMENTS.GENERAL_DICK_BANISHER);
        if (NPCsDedicked >= 7) this.awardAchievement("You Bastard!", kACHIEVEMENTS.GENERAL_YOU_BASTARD); // take that, dedickers!
    }

}
