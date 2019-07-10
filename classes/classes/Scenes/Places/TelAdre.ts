import { BaseContent } from "../../BaseContent";
import { AuntNancy } from "./TelAdre/AuntNancy";
import { BakeryScene } from "./TelAdre/BakeryScene";
import { Brooke } from "./TelAdre/Brooke";
import { Cotton } from "./TelAdre/Cotton";
import { Dominika } from "./TelAdre/Dominika";
import { Edryn } from "./TelAdre/Edryn";
import { Frosty } from "./TelAdre/Frosty";
import { Gym } from "./TelAdre/Gym";
import { Heckel } from "./TelAdre/Heckel";
import { Ifris } from "./TelAdre/Ifris";
import { Jasun } from "./TelAdre/Jasun";
import { Katherine } from "./TelAdre/Katherine";
import { KatherineEmployment } from "./TelAdre/KatherineEmployment";
import { KatherineThreesome } from "./TelAdre/KatherineThreesome";
import { Library } from "./TelAdre/Library";
import { Loppe } from "./TelAdre/Loppe";
import { Lottie } from "./TelAdre/Lottie";
import { Maddie } from "./TelAdre/Maddie";
import { Niamh } from "./TelAdre/Niamh";
import { PabloScene } from "./TelAdre/PabloScene";
import { Rubi } from "./TelAdre/Rubi";
import { Scylla } from "./TelAdre/Scylla";
import { SexMachine } from "./TelAdre/SexMachine";
import { ValaScene } from "../Dungeons/DeepCave/ValaScene";
import { YvonneArmorShop } from "./TelAdre/YvonneArmorShop";
import { CarpentryShop } from "./TelAdre/CarpentryShop";
import { JewelryShop } from "./TelAdre/JewelryShop";
import { UmasShop } from "./TelAdre/UmasShop";
import { VictoriaTailorShop } from "./TelAdre/VictoriaTailorShop";
import { WeaponShop } from "./TelAdre/WeaponShop";
import { YaraPiercingStudio } from "./TelAdre/YaraPiercingStudio";
import { PregnancyProgression } from "../PregnancyProgression";
import { StatusEffects } from "../../StatusEffects";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { rand, int } from "../../Extra";
import { SpriteDb } from "../../display/SpriteDb";
import { ItemType } from "../../ItemType";
import { Consumable } from "../../Items/Consumable";
import { PregnancyStore } from "../../PregnancyStore";
import { kGAMECLASS } from "../../GlobalFlags/kGAMECLASS";

/**
 * The lovely town of Tel Adre
 * @author: ...
 */
export class TelAdre extends BaseContent {
    // Declare those NPCs
    public auntNancy: AuntNancy = new AuntNancy();
    public bakeryScene: BakeryScene = new BakeryScene();
    public brooke: Brooke = new Brooke();
    public cotton: Cotton;
    public dominika: Dominika = new Dominika();
    public edryn: Edryn = new Edryn();
    public frosty: Frosty = new Frosty();
    public gym: Gym = new Gym();
    public heckel: Heckel = new Heckel();
    public ifris: Ifris = new Ifris();
    public jasun: Jasun = new Jasun();
    public katherine: Katherine = new Katherine();
    public katherineEmployment: KatherineEmployment = new KatherineEmployment();
    public katherineThreesome: KatherineThreesome = new KatherineThreesome();
    public library: Library = new Library();
    public loppe: Loppe = new Loppe();
    public lottie: Lottie = new Lottie();
    public maddie: Maddie = new Maddie();
    public niamh: Niamh = new Niamh();
    public pablo: PabloScene = new PabloScene();
    public rubi: Rubi = new Rubi();
    public scylla: Scylla = new Scylla();
    public sexMachine: SexMachine = new SexMachine();
    public vala: ValaScene = new ValaScene();

    // Declare those shops
    public armourShop: YvonneArmorShop = new YvonneArmorShop();
    public carpentryShop: CarpentryShop = new CarpentryShop();
    public jewelryShop: JewelryShop = new JewelryShop();
    public umasShop: UmasShop = new UmasShop();
    public tailorShop: VictoriaTailorShop = new VictoriaTailorShop();
    public weaponShop: WeaponShop = new WeaponShop();
    public yarasShop: YaraPiercingStudio = new YaraPiercingStudio();

    public constructor(pregnancyProgression: PregnancyProgression) {
        super();
        this.cotton = new Cotton(pregnancyProgression);
    }

    public isDiscovered(): boolean {
        return this.player.hasStatusEffect(StatusEffects.TelAdre);
    }
    public isAllowedInto(): boolean {
        return this.player.statusEffectv1(StatusEffects.TelAdre) >= 1;
    }
    public setStatus(discovered: boolean, allowed: boolean): void {
        if (!discovered) {
            this.player.removeStatusEffect(StatusEffects.TelAdre);
        } else {
            if (!this.player.hasStatusEffect(StatusEffects.TelAdre)) {
                this.player.createStatusEffect(StatusEffects.TelAdre, allowed ? 1 : 0, 0, 0, 0);
            } else {
                this.player.changeStatusValue(StatusEffects.TelAdre, 1, allowed ? 1 : 0);
            }
        }
    }

    public discoverTelAdre(): void {
        this.clearOutput();
        if (!this.getGame().telAdre.isDiscovered()) {
            this.outputText("The merciless desert sands grind uncomfortably under your " + this.player.feet() + " as you walk the dunes, searching the trackless sands to uncover their mysteries.  All of a sudden, you can see the outline of a small city in the distance, ringed in sandstone walls.  Strangely it wasn't there a few moments before.  It's probably just a mirage brought on by the heat.  Then again, you don't have any specific direction you're heading, what could it hurt to go that way?");
            this.outputText("\n\nDo you investigate the city in the distance?");
        }
        else {
            this.outputText("While out prowling the desert dunes you manage to spy the desert city of Tel'Adre again.  You could hike over to it again, but some part of you fears being rejected for being 'impure' once again.  Do you try?");
        }
        this.doYesNo(this.encounterTelAdre, this.camp.returnToCampUseOneHour);
    }

    // player chose to approach the city in the distance
    private encounterTelAdre(): void {
        this.clearOutput();
        if (!this.getGame().telAdre.isDiscovered()) {
            this.outputText("You slog through the shifting sands for a long time, not really seeming to get that close.  Just when you're about to give up, you crest a large dune and come upon the walls of the city you saw before.  It's definitely NOT a mirage.  There are sandstone walls at least fifty feet tall ringing the entire settlement, and the only entrance you can see is a huge gate with thick wooden doors.  The entrance appears to be guarded by a female gray fox who's more busy sipping on something from a bottle than watching the desert.\n\n");
            this.outputText("As if detecting your thoughts, she drops the bottle and pulls out a halberd much longer than she is tall.\n\n");
            this.outputText("\"<i>Hold it!</i>\" barks the fox, her dark gray fur bristling in suspicion at your sudden appearance, \"<i>What's your business in the city of Tel'Adre?</i>\"\n\n");
            this.outputText("You shrug and explain that you know nothing about this town, and just found it while exploring the desert.  The girl stares at you skeptically for a moment and then blows a shrill whistle.  She orders, \"<i>No sudden moves.</i>\"\n\n");
            this.outputText("Deciding you've nothing to lose by complying, you stand there, awaiting whatever reinforcements this cute vulpine-girl has summoned.  Within the minute, a relatively large-chested centauress emerges from a smaller door cut into the gate, holding a massive bow with an arrow already nocked.\n\n");
            this.outputText("\"<i>What's the problem, Urta?  A demon make it through the barrier?</i>\" asks the imposing horse-woman.\n\nUrta the fox shakes her head, replying, \"<i>I don't think so, Edryn.  " + this.player.mf("He's", "She's") + " something else.  We should use the crystal and see if " + this.player.mf("he", "she") + "'s fit to be allowed entry to Tel'Adre.</i>\"\n\n");
            this.outputText("You watch the big centaur cautiously as she pulls out a pendant, and approaches you.  \"<i>Hold still,</i>\" she says, \"<i>this will do you no harm.</i>\"\n\n");
            this.outputText("She places one hand on your shoulder and holds the crystal in the other.  Her eyes close, but her brow knits as she focuses on something.  ");
            this.telAdreCrystal();
        }
        else {
            this.outputText("Once again you find the gray fox, Urta, guarding the gates.  She nods at you and whistles for her companion, Edryn once again.  The centauress advances cautiously, and you submit herself to her inspection as she once again produces her magical amulet.  ");
            this.telAdreCrystal();
        }
    }

    // Alignment crystal goooooo
    private telAdreCrystal(): void {
        if (!this.getGame().telAdre.isDiscovered()) this.setStatus(true, false);
        // -70+ corruption, or possessed by exgartuan
        if (this.player.hasStatusEffect(StatusEffects.Exgartuan) || !this.player.isPureEnough(70)) {
            this.outputText("The crystal pendant begins to vibrate in the air, swirling around and glowing dangerously black.  Edryn snatches her hand back and says, \"<i>I'm sorry, but you're too far gone to step foot into our city.  If by some miracle you can shake the corruption within you, return to us.</i>\"\n\n");
            this.outputText("You shrug and step back.  You could probably defeat these two, but you know you'd have no hope against however many friends they had beyond the walls.  You turn around and leave, a bit disgruntled at their hospitality.  After walking partway down the dune you spare a glance over your shoulder and discover the city has vanished!  Surprised, you dash back up the dune, flinging sand everywhere, but when you crest the apex, the city is gone.");
            this.doNext(this.camp.returnToCampUseOneHour);
            return;
        }
        // -50+ corruption or corrupted Jojo
        else if (!this.player.isPureEnough(50) || this.getGame().jojoScene.isJojoCorrupted()) {
            this.outputText("The crystal pendant shimmers, vibrating in place and glowing a purple hue.  Edryn steps back, watching you warily, \"<i>You've been deeply touched by corruption.  You balance on a razor's edge between falling completely and returning to sanity.  You may enter, but we will watch you closely.</i>\"\n\n");
        }
        // -25+ corruption or corrupted Marae
        else if (!this.player.isPureEnough(25) || this.flags[kFLAGS.FACTORY_SHUTDOWN] == 2) {
            this.outputText("The crystal pendant twirls in place, glowing a dull red.  Edryn takes a small step back and murmurs, \"<i>You've seen the darkness of this land first hand, but its hold on you is not deep.  You'll find sanctuary here.  The demons cannot find this place yet, and we promise you safe passage within the walls.</i>\"\n\n");
        }
        // -Low corruption/pure characters
        else {
            this.outputText("The crystal shines a pale white light.  Edryn steps back and smiles broadly at you and says, \"<i>You've yet to be ruined by the demonic taint that suffuses the land of Mareth.  Come, you may enter our city walls and find safety here, though only so long as the covenant's white magic protects us from the demons' lapdogs.</i>\"\n\n");
        }
        this.outputText("The vixen Urta gestures towards the smaller door and asks, \"<i>Would you like a tour of Tel'Adre, newcomer?</i>\"\n\n");
        this.outputText("You remember your etiquette and nod, thankful to have a quick introduction to such a new place.  Urta leaves Edryn to watch the gate and leads you inside.  You do notice her gait is a bit odd, and her fluffy fox-tail seems to be permanently wrapped around her right leg.  The door closes behind you easily as you step into the city of Tel'Adre...");
        this.doNext(this.telAdreTour);
    }

    private telAdreTour(): void {
        this.setStatus(true, true);
        this.clearOutput();
        kGAMECLASS.urta.urtaSprite();
        this.outputText("Urta leads you into the streets of Tel'Adre, giving you a brief run-down of her and her city, \"<i>You see, about two decades back, the demons were chewing their way through every settlement and civilization in Mareth.  The covenant, a group of powerful magic-users, realized direct confrontation was doomed to fail.  They hid us in the desert with their magic, and the demons can't corrupt what they can't find.  So we're safe, for now.</i>\"\n\n");
        this.outputText("The two of you find yourselves in the center of a busy intersection.  Urta explains that this is the main square of the city, and that, although the city is large, a goodly portion of it remains empty.  Much of the population left to assist other settlements in resisting the demons and was lost.  She brushes a lock of stray hair from her eye and guides you down the road, making sure to point out her favorite pub - \"The Wet Bitch\".  You ");
        if (this.player.cor < 25) this.outputText("blush");
        else this.outputText("chuckle");
        this.outputText(" at the rather suggestive name as Urta turns around and says, \"<i>With how things are, we've all gotten a lot more comfortable with our sexuality.  I hope it doesn't bother you.</i>\"\n\n");
        this.outputText("A bit further on, you're shown a piercing parlor, apparently another favorite of Urta's.  A cute human girl with cat-like ears peeks out the front and gives you both a friendly wave.  It's so strange to see so many people together in one place, doing things OTHER than fucking.  The whole thing makes you miss your hometown more than ever.  Tears come to your eyes unbidden, and you wipe them away, glad to at least have this one reminder of normalcy.  Urta politely pretends not to notice, though the tail she keeps wrapped around her leg twitches as she wraps up the tour.\n\n");
        this.outputText("She gives you a friendly punch on the shoulder and says, \"<i>Okay, gotta go!  Be good and stay out of trouble, alright?</i>\"\n\n");
        this.outputText("Before you can answer, she's taken off back down the street, probably stopping off at 'The Wet Bitch' for a drink.  Strange, her departure was rather sudden...");
        this.doNext(this.telAdreMenu);
    }

    public telAdreMenu(): void {
        if (this.flags[kFLAGS.VALENTINES_EVENT_YEAR] < this.date.fullYear && this.player.balls > 0 && this.player.hasCock() && this.flags[kFLAGS.NUMBER_OF_TIMES_MET_SCYLLA] >= 4 && this.flags[kFLAGS.TIMES_MET_SCYLLA_IN_ADDICTION_GROUP] > 0 && this.isValentine()) {
            kGAMECLASS.valentines.crazyVDayShenanigansByVenithil();
            return;
        }
        if (!kGAMECLASS.urtaQuest.urtaBusy() && this.flags[kFLAGS.PC_SEEN_URTA_BADASS_FIGHT] == 0 && rand(15) == 0 && this.getGame().time.hours > 15) {
            this.urtaIsABadass();
            return;
        }
        if (!kGAMECLASS.urtaQuest.urtaBusy() && kGAMECLASS.urta.pregnancy.event > 5 && rand(30) == 0) {
            kGAMECLASS.urtaPregs.urtaIsAPregnantCopScene();
            return;
        }
        switch (this.flags[kFLAGS.KATHERINE_UNLOCKED]) {
            case -1:
            case 0: // Still potentially recruitable
                if (this.flags[kFLAGS.KATHERINE_RANDOM_RECRUITMENT_DISABLED] == 0 && this.player.gems > 34 && rand(25) == 0) {
                    if (this.flags[kFLAGS.KATHERINE_UNLOCKED] == 0)
                        this.katherine.ambushByVagrantKittyKats();
                    else this.katherine.repeatAmbushKatherineRecruitMent();
                    return;
                }
                break;
            case 1: // In alley behind Oswald's
            case 2: // You are training her
            case 3: // You and Urta are training her
                break;
            case 4: // Employed
                if (!this.katherine.isAt(Katherine.KLOC_KATHS_APT) && this.flags[kFLAGS.KATHERINE_TRAINING] >= 100) {
                    this.katherineEmployment.katherineGetsEmployed();
                    return;
                }
                break;
            default: // Has given you a spare key to her apartment
                if (this.getGame().time.hours < 10 && rand(12) == 0) { // If employed or housed she can sometimes be encountered while on duty
                    this.katherine.katherineOnDuty();
                    return;
                }
        }
        if (this.flags[kFLAGS.ARIAN_PARK] == 0 && rand(10) == 0 && this.flags[kFLAGS.NOT_HELPED_ARIAN_TODAY] == 0) {
            kGAMECLASS.arianScene.meetArian();
            return;
        }
        // Display Tel'adre menu options//
        // Special Delivery☼☼☼
        // Has a small-ish chance of playing when the PC enters Tel'Adre.
        // Must have Urta's Key.
        // Urta must be pregnant to trigger this scene.
        // Play this scene upon entering Tel'Adre.
        if (kGAMECLASS.urta.pregnancy.event > 2 && rand(4) == 0 && this.flags[kFLAGS.URTA_PREGNANT_DELIVERY_SCENE] == 0 && this.player.hasKeyItem("Spare Key to Urta's House") >= 0) {
            kGAMECLASS.urtaPregs.urtaSpecialDeliveries();
            return;
        }
        if (this.flags[kFLAGS.MADDIE_STATUS] == -1) {
            this.maddie.runAwayMaddieFollowup();
            return;
        }
        this.spriteSelect(undefined);
        this.outputText(this.images.showImage("location-teladre"));
        this.clearOutput();
        this.outputText("Tel'Adre is a massive city, though most of its inhabitants tend to hang around the front few city blocks.  It seems the fall of Mareth did not leave the city of Tel'Adre totally unscathed.  A massive tower rises up in the center of the city, shimmering oddly.  From what you overhear in the streets, the covenant's magic-users slave away in that tower, working to keep the city veiled from outside dangers.  There does not seem to be a way to get into the unused portions of the city, but you'll keep your eyes open.\n\n");
        this.outputText("A sign depicting a hermaphroditic centaur covered in piercings hangs in front of one of the sandstone buildings, and bright pink lettering declares it to be the 'Piercing Studio'.  You glance over and see the wooden facade of Urta's favorite bar, 'The Wet Bitch'.  How strange that those would be what she talks about during a tour.  In any event you can also spot some kind of wolf-man banging away on an anvil in a blacksmith's stand, and a foppishly-dressed dog-man with large floppy ears seems to be running some kind of pawnshop in his stand.  Steam boils from the top of a dome-shaped structure near the far end of the street, and simple lettering painted on the dome proclaims it to be a bakery.  Perhaps those shops will be interesting as well.");
        if (this.flags[kFLAGS.RAPHEAL_COUNTDOWN_TIMER] == -2 && !kGAMECLASS.raphael.RaphaelLikes()) {
            this.outputText("\n\nYou remember Raphael's offer about the Orphanage, but you might want to see about shaping yourself more to his tastes first.  He is a picky fox, after all, and you doubt he would take well to seeing you in your current state.");
        }
        this.telAdreMenuShow();
    }

    public telAdreMenuShow(): void { // Just displays the normal Tel'Adre menu options, no special events, no description. Useful if a special event has already played
        let homes: boolean = false;
        if (this.flags[kFLAGS.RAPHEAL_COUNTDOWN_TIMER] == -2 && kGAMECLASS.raphael.RaphaelLikes())
            homes = true;
        else if (this.player.hasKeyItem("Spare Key to Urta's House") >= 0)
            homes = true;
        else if (this.flags[kFLAGS.KATHERINE_UNLOCKED] >= 5)
            homes = true;
        else if (this.flags[kFLAGS.ARIAN_PARK] >= 4 && !kGAMECLASS.arianScene.arianFollower())
            homes = true;
        this.menu();
        this.addButton(0, "Shops", this.armorShops).hint("Browse the shops and access their services.");
        this.addButton(1, "Bakery", this.bakeryScene.bakeryuuuuuu).hint("The bakery smells so good even from here! You could visit the bakery and see all sorts of delicious baked goods.");
        this.addButton(2, "Bar", this.enterBarTelAdre).hint("Visit 'The Wet Bitch' and meet all sorts of interesting people or have a drink.");
        this.addButton(3, "Gym", this.gym.gymDesc).hint("Visit the gym and engage in various exercises to improve your stats.");
        if (homes) this.addButton(4, "Homes", this.houses).hint("Visit the house of someone you know.");
        if (this.flags[kFLAGS.ARIAN_PARK] > 0 && this.flags[kFLAGS.ARIAN_PARK] < 4) this.addButton(5, "Park", kGAMECLASS.arianScene.visitThePark);
        this.addButton(6, "Pawn", this.oswaldPawn).hint("Visit the pawn shop and offload unwanted items for gems. The stock of items for sale change everyday so come back later.");
        this.addButton(7, "Tower", this.library.visitZeMagesTower).hint("Visit the massive tower in the heart of the city of Tel'Adre.");
        this.addButton(14, "Leave", this.camp.returnToCampUseOneHour);
        if (this.flags[kFLAGS.GRIMDARK_MODE] > 0) this.addButton(14, "Leave", this.leaveTelAdreGrimdark);
    }

    public leaveTelAdreGrimdark(): void {
        this.inRoomedDungeonResume = this.getGame().dungeons.resumeFromFight;
        this.getGame().dungeons._currentRoom = "desert";
        this.getGame().dungeons.move(this.getGame().dungeons._currentRoom);
    }

    private armorShops(): void {
        this.clearOutput();
        this.outputText("The shopping district of Tel’adre happens to be contained in a large dead end street, with a large set of doors at the entrance to protect it from thieves at night, you’d assume from a higher elevation it would look like a giant square courtyard. Due to the cities shopping area being condensed into one spot, most if not every visible wall has been converted into a store front, in the center of the area are some small stands, guess not everyone can afford a real store.");
        this.outputText("\n\nRight off the bat you see the ‘Piercing Studio’, its piercing covered centaur sign is a real eye catcher. You can also spot some kind of wolf-man banging away on an anvil in a blacksmith's stand. As well as other shops lining the walls, perhaps those shops will be interesting as well.");
        this.menu();
        this.addButton(0, "Armoursmith", this.armourShop.enter).hint("Visit the blacksmith and buy new armour or shields.");
        this.addButton(1, "Weaponsmith", this.weaponShop.enter).hint("Visit the weapons shop and buy or upgrade your weapons.");
        this.addButton(2, "Tailor", this.tailorShop.enter).hint("Visit the tailor and check out what clothes are available.");
        this.addButton(3, "Jewelry", this.jewelryShop.enter).hint("Pay the jewelry a visit and buy new rings.");
        this.addButton(4, "Carpenter", this.carpentryShop.enter).hint("Visit the carpentry shop and purchase tools for your construction projects.");
        this.addButton(5, "Piercing", this.yarasShop.piercingStudio).hint("Visit the piercing studio and get some new piercings.");
        this.addButton(6, "Clinic", this.umasShop.enterClinic).hint("Visit the massage clinic and see what massage and acpuncturing services are available.");
        this.addButton(14, "Back", this.telAdreMenu);
    }

    public houses(): void {
        this.clearOutput();
        this.outputText("Whose home will you visit?");
        let orphanage;
        if (this.flags[kFLAGS.RAPHEAL_COUNTDOWN_TIMER] == -2) {
            if (kGAMECLASS.raphael.RaphaelLikes()) {
                orphanage = kGAMECLASS.raphael.orphanageIntro;
            }
            else {
                this.outputText("\n\nYou remember Raphael's offer about the Orphanage, but you might want to see about shaping yourself more to his tastes first.  He is a picky fox, after all, and you doubt he would take well to seeing you in your current state.");
            }
        }
        this.menu();
        if (this.flags[kFLAGS.KATHERINE_UNLOCKED] >= 5) this.addButton(0, "Kath's Apt", this.katherine.visitAtHome);
        if (kGAMECLASS.urtaPregs.urtaKids() > 0 && this.player.hasKeyItem("Spare Key to Urta's House") >= 0)
            this.addButton(1, "Urta's House", (this.katherine.isAt(Katherine.KLOC_URTAS_HOME) ? this.katherine.katherineAtUrtas : kGAMECLASS.urtaPregs.visitTheHouse));
        if (this.flags[kFLAGS.ARIAN_PARK] >= 4 && !kGAMECLASS.arianScene.arianFollower()) this.addButton(2, "Arian's", kGAMECLASS.arianScene.visitAriansHouse);
        this.addButton(3, "Orphanage", orphanage);
        this.addButton(14, "Back", this.telAdreMenu);
    }

    public oswaldPawn(): void {
        this.spriteSelect(SpriteDb.s_oswald);
        this.clearOutput();
        if (!this.player.hasStatusEffect(StatusEffects.Oswald)) {
            this.outputText("Upon closer inspection, you realize the pawnbroker appears to be some kind of golden retriever.  He doesn't look entirely comfortable and he slouches, but he manages to smile the entire time.  His appearance is otherwise immaculate, including his classy suit-jacket and tie, though he doesn't appear to be wearing any pants.  Surprisingly, his man-bits are retracted.  ");
            if (this.player.cor < 75) this.outputText("Who would've thought that seeing someone NOT aroused would ever shock you?");
            else this.outputText("What a shame, but maybe you can give him a reason to stand up straight?");
            this.outputText("  His stand is a disheveled mess, in stark contrast to its well-groomed owner.  He doesn't appear to be selling anything at all right now.\n\n");
            this.outputText("The dog introduces himself as Oswald and gives his pitch, \"<i>Do you have anything you'd be interested in selling?  The name's Oswald, and I'm the best trader in Tel'Adre.</i>\"\n\n");
            this.outputText("(You can sell an item here, but Oswald will not let you buy them back, so be sure of your sales.)");
            this.player.createStatusEffect(StatusEffects.Oswald, 0, 0, 0, 0);
        }
        else {
            this.outputText("You see Oswald fiddling with a top hat as you approach his stand again.  He looks up and smiles, padding up to you and rubbing his furry hands together.  He asks, \"<i>Have any merchandise for me " + this.player.mf("sir", "dear") + "?</i>\"\n\n");
        }
        this.menu();
        this.addButton(0, "Buy", this.oswaldBuyMenu);
        this.addButton(1, "Sell", this.oswaldPawnMenu);
        switch (this.flags[kFLAGS.KATHERINE_UNLOCKED]) {
            case 1:
            case 2: this.addButton(2, "Kath's Alley", this.katherine.visitKatherine); break;
            case 3: this.addButton(2, "Safehouse", this.katherineEmployment.katherineTrainingWithUrta); break;
            case 4: this.addButton(2, "Kath's Alley", this.katherineEmployment.postTrainingAlleyDescription); break; // Appears until Kath gives you her housekeys
            default:
        }
        if (this.player.hasKeyItem("Carrot") < 0 && this.flags[kFLAGS.NIEVE_STAGE] == 3) {
            this.outputText("\n\nIn passing, you mention that you're looking for a carrot.\n\nOswald's tophat tips precariously as his ears perk up, and he gladly announces, \"<i>I happen to have come across one recently - something of a rarity in these dark times, you see.  I could let it go for 500 gems, if you're interested.</i>\"");
            if (this.player.gems < 500)
                this.outputText("\n\n<b>You can't afford that!</b>");
            else
                this.addButton(3, "Buy Carrot", this.buyCarrotFromOswald);
        }
        this.addButton(4, "Leave", this.telAdreMenu);
    }

    private buyCarrotFromOswald(): void {
        this.player.gems -= 500;
        this.statScreenRefresh();
        this.player.createKeyItem("Carrot", 0, 0, 0, 0);
        this.clearOutput();
        this.outputText("Gems change hands in a flash, and you're now the proud owner of a bright orange carrot!\n\n(<b>Acquired Key Item: Carrot</b>)");
        this.menu();
        this.addButton(0, "Next", this.oswaldPawn);
    }

    private oswaldBuyMenu(): void {
        this.clearOutput();
        const buyMod: number = 2;
        this.outputText("You ask if Oswald has anything to sell. He nods and says, \"<i>Certainly. If you don't see anything that interests you, come back tomorrow. We get new stocks of merchandise all the time.</i>\"");
        this.outputText("\n\n<b><u>Oswald's Prices</u></b>");
        this.outputText("\n" + ItemType.lookupItem(this.flags[kFLAGS.BENOIT_1]).longName + ": " + Math.round(buyMod * ItemType.lookupItem(this.flags[kFLAGS.BENOIT_1]).value));
        this.outputText("\n" + ItemType.lookupItem(this.flags[kFLAGS.BENOIT_2]).longName + ": " + Math.round(buyMod * ItemType.lookupItem(this.flags[kFLAGS.BENOIT_2]).value));
        this.outputText("\n" + ItemType.lookupItem(this.flags[kFLAGS.BENOIT_3]).longName + ": " + Math.round(buyMod * ItemType.lookupItem(this.flags[kFLAGS.BENOIT_3]).value));
        this.menu();
        this.addButton(0, this.flags[kFLAGS.BENOIT_1], this.oswaldTransactBuy, 1);
        this.addButton(1, this.flags[kFLAGS.BENOIT_2], this.oswaldTransactBuy, 2);
        this.addButton(2, this.flags[kFLAGS.BENOIT_3], this.oswaldTransactBuy, 3);
        this.addButton(4, "Back", this.oswaldPawn);
    }

    private oswaldTransactBuy(slot: number = 1): void {
        this.clearOutput();
        let itype: ItemType;
        const buyMod: number = 2;
        if (slot == 1) itype = ItemType.lookupItem(this.flags[kFLAGS.BENOIT_1]);
        else if (slot == 2) itype = ItemType.lookupItem(this.flags[kFLAGS.BENOIT_2]);
        else itype = ItemType.lookupItem(this.flags[kFLAGS.BENOIT_3]);
        if (this.player.gems < Math.round(buyMod * itype.value)) {
            this.outputText("You consider making a purchase, but you lack the gems to go through with it.");
            this.doNext(this.oswaldBuyMenu);
            return;
        }
        this.outputText("After examining what you've picked out with his fingers, Oswald hands it over, names the price and accepts your gems with a curt nod.\n\n");
        this.player.gems -= Math.round(buyMod * itype.value);
        this.statScreenRefresh();

        if (this.flags[kFLAGS.SHIFT_KEY_DOWN] == 1 && itype instanceof Consumable) {
            (itype as Consumable).useItem();
            this.doNext(this.oswaldBuyMenu);
        } else this.inventory.takeItem(itype, this.oswaldBuyMenu);
    }

    private oswaldPawnMenu(returnFromSelling: boolean = false): void { // Moved here from Inventory.as
        this.clearOutput();
        this.spriteSelect(SpriteDb.s_oswald);
        this.outputText("You see Oswald fiddling with a top hat as you approach his stand again.  He looks up and smiles, padding up to you and rubbing his furry hands together.  He asks, \"<i>Have any merchandise for me " + this.player.mf("sir", "dear") + "?</i>\"\n\n");
        this.outputText("(You can sell an item here, but Oswald will not let you buy them back, so be sure of your sales.  You can shift-click to sell all items in a selected stack.)");
        this.outputText("\n\n<b><u>Oswald's Estimates</u></b>");
        this.menu();
        let totalItems: number = 0;
        for (let slot: number = 0; slot < 10; slot++) {
            if (this.player.itemSlots[slot].quantity > 0 && this.player.itemSlots[slot].itype.value >= 1) {
                this.outputText("\n" + int(this.player.itemSlots[slot].itype.value / 2) + " gems for " + this.player.itemSlots[slot].itype.longName + ".");
                this.addButton(slot, (this.player.itemSlots[slot].itype.shortName + " x" + this.player.itemSlots[slot].quantity), this.oswaldPawnSell, slot);
                totalItems += this.player.itemSlots[slot].quantity;
            }
        }
        if (totalItems > 1) this.addButton(12, "Sell All", this.oswaldPawnSellAll);
        this.addButton(14, "Back", this.oswaldPawn);
    }

    private oswaldPawnSell(slot: number): void { // Moved here from Inventory.as
        this.spriteSelect(SpriteDb.s_oswald);
        const itemValue: number = int(this.player.itemSlots[slot].itype.value / 2);
        this.clearOutput();
        if (this.flags[kFLAGS.SHIFT_KEY_DOWN] == 1) {
            if (itemValue == 0)
                this.outputText("You hand over " + TelAdre.num2Text(this.player.itemSlots[slot].quantity) + " " + this.player.itemSlots[slot].itype.shortName + " to Oswald.  He shrugs and says, “<i>Well ok, it isn't worth anything, but I'll take it.</i>”");
            else this.outputText("You hand over " + TelAdre.num2Text(this.player.itemSlots[slot].quantity) + " " + this.player.itemSlots[slot].itype.shortName + " to Oswald.  He nervously pulls out " + TelAdre.num2Text(itemValue * this.player.itemSlots[slot].quantity) + " gems and drops them into your waiting hand.");
            while (this.player.itemSlots[slot].quantity > 0) {
                this.player.itemSlots[slot].removeOneItem();
                this.player.gems += itemValue;
            }
        }
        else {
            if (itemValue == 0)
                this.outputText("You hand over " + this.player.itemSlots[slot].itype.longName + " to Oswald.  He shrugs and says, “<i>Well ok, it isn't worth anything, but I'll take it.</i>”");
            else this.outputText("You hand over " + this.player.itemSlots[slot].itype.longName + " to Oswald.  He nervously pulls out " + TelAdre.num2Text(itemValue) + " gems and drops them into your waiting hand.");
            this.player.itemSlots[slot].removeOneItem();
            this.player.gems += itemValue;
        }
        this.statScreenRefresh();
        this.doNext(this.createCallBackFunction(this.oswaldPawnMenu, true));
    }

    private oswaldPawnSellAll(): void {
        this.spriteSelect(SpriteDb.s_oswald);
        let itemValue: number = 0;
        this.clearOutput();
        for (let slot: number = 0; slot < 10; slot++) {
            if (this.player.itemSlots[slot].quantity > 0 && this.player.itemSlots[slot].itype.value >= 1) {
                itemValue += this.player.itemSlots[slot].quantity * int(this.player.itemSlots[slot].itype.value / 2);
                this.player.itemSlots[slot].quantity = 0;
            }
        }
        this.outputText("You lay out all the items you're carrying on the counter in front of Oswald.  He examines them all and nods.  Nervously, he pulls out " + TelAdre.num2Text(itemValue) + " gems and drops them into your waiting hand.");
        this.player.gems += itemValue;
        this.statScreenRefresh();
        this.doNext(this.createCallBackFunction(this.oswaldPawnMenu, true));
    }

    private anotherButton(button: number, nam: string, func: any, arg: any = -9000): number {
        if (button > 8) return 9;
        this.addButton(button, nam, func, arg);
        button++;
        return button;
    }
    private enterBarTelAdre(): void {
        if (this.isThanksgiving() && this.flags[kFLAGS.PIG_SLUT_DISABLED] == 0) kGAMECLASS.thanksgiving.pigSlutRoastingGreet();
        else this.barTelAdre();
    }

    public barTelAdre(): void {
        // Dominka & Edryn both persist their sprites if you back out of doing anything with them -- I
        // I guess this is good a place as any to catch-all the sprite, because I don't think theres ever a case you get a sprite from just entering the bar?
        this.spriteSelect(-1);

        this.hideUpDown();
        let button: number = 0;
        this.clearOutput();
        if (this.flags[kFLAGS.LOPPE_DISABLED] == 0 && this.flags[kFLAGS.LOPPE_MET] == 0 && rand(10) == 0) {
            this.loppe.loppeFirstMeeting();
            return;
        }
        this.outputText(this.images.showImage("location-teladre-thewetbitch"));
        this.outputText("The interior of The Wet Bitch is far different than the mental picture its name implied.  It looks like a normal tavern, complete with a large central hearth, numerous tables and chairs, and a polished dark wood bar.  The patrons all seem to be dressed and interacting like normal people, that is if normal people were mostly centaurs and dog-morphs of various sub-species.  The atmosphere is warm and friendly, and ");
        if (this.player.humanScore() <= 3) this.outputText("despite your altered appearance, ");
        this.outputText("you hardly get any odd stares.  There are a number of rooms towards the back, as well as a stairway leading up to an upper level.");

        this.scylla.scyllaBarSelectAction(); // Done before anything else so that other NPCs can check scylla.action to see what she's doing
        // Thanks to this function and edryn.edrynHeliaThreesomePossible() the bar menu will always display the same possible options until the game time advances.
        // So it's safe to return to this menu, Helia or Urta can't suddenly disappear or appear just from leaving and re-entering the bar.

        this.menu();
        // AMILY!
        if (this.flags[kFLAGS.AMILY_VISITING_URTA] == 1) {
            button = this.anotherButton(button, "Ask4Amily", kGAMECLASS.followerInteractions.askAboutAmily);
        }
        // DOMINIKA
        if (this.getGame().time.hours > 17 && this.getGame().time.hours < 20 && this.flags[kFLAGS.DOMINIKA_STAGE] != -1) {
            button = this.anotherButton(button, "Dominika", this.dominika.fellatrixBarApproach);
        }
        // EDRYN!
        if (this.edryn.pregnancy.type != PregnancyStore.PREGNANCY_TAOTH) { // Edryn is unavailable while pregnant with Taoth
            if (this.edryn.edrynBar()) {
                if (this.edryn.pregnancy.isPregnant) {
                    if (this.flags[kFLAGS.EDRYN_PREGNANT_AND_NOT_TOLD_PC_YET] == 0) {
                        this.flags[kFLAGS.EDRYN_PREGNANT_AND_NOT_TOLD_PC_YET] = 1;
                        if (this.flags[kFLAGS.EDRYN_NUMBER_OF_KIDS] == 0) { // Edryn panic appearance! (First time mom)
                            this.outputText("\n\nEdryn smiles when she sees you and beckons you towards her.  Fear and some kind of frantic need are painted across her face, imploring you to come immediately.  Whatever the problem is, it doesn't look like it can wait.");
                            this.doNext(this.edryn.findOutEdrynIsPregnant);
                            return;
                        }
                        else { // Edryn re-preggers appearance!
                            this.outputText("\n\nEdryn smiles at you and yells, \"<i>Guess what " + this.player.short + "?  I'm pregnant again!</i>\"  There are some hoots and catcalls but things quickly die down.  You wonder if her scent will be as potent as before?");
                        }
                    }
                    else { // Mid-pregnancy appearance
                        this.outputText("\n\nEdryn is seated at her usual table, and chowing down with wild abandon.  A stack of plates is piled up next to her.  Clearly she has been doing her best to feed her unborn child.  She notices you and waves, blushing heavily.");
                    }
                }
                // Edryn just had a kid and hasn't talked about it!
                else if (this.flags[kFLAGS.EDRYN_NEEDS_TO_TALK_ABOUT_KID] == 1) {
                    this.outputText("\n\nEdryn the centaur isn't pregnant anymore!  She waves excitedly at you, beckoning you over to see her.  It looks like she's already given birth to your child!");
                }
                // Appearance changes if has had kids
                else if (this.flags[kFLAGS.EDRYN_NUMBER_OF_KIDS] > 0) {
                    this.outputText("\n\nEdryn is seated at her usual place, picking at a plate of greens and sipping a mug of the local mead.  She looks bored until she sees you.  Her expression brightens immediately, and Edryn fiddles with her hair and changes her posture slightly.  You aren't sure if she means to, but her cleavage is prominently displayed in an enticing manner.");
                }
                else if (this.player.statusEffectv1(StatusEffects.Edryn) < 3) {
                    this.outputText("\n\nEdryn, the centauress you met at the gate, is here, sitting down at her table alone and sipping on a glass of wine.  You suppose you could go talk to her a bit.");
                }
                else this.outputText("\n\nEdryn the centauress is here, sipping wine at a table by herself.  She looks up and spots you, her eyes lighting up with happiness.  She gives you a wink and asks if you'll join her.");
                button = this.anotherButton(button, "Edryn", this.edryn.edrynBarTalk);
            }
        }
        if (this.flags[kFLAGS.KATHERINE_LOCATION] == Katherine.KLOC_BAR) {
            if (this.flags[kFLAGS.KATHERINE_UNLOCKED] == 4) {
                this.katherine.barFirstEncounter();
                return;
            }
            if (this.flags[kFLAGS.KATHERINE_URTA_AFFECTION] == 31 && kGAMECLASS.urta.urtaAtBar() && !kGAMECLASS.urta.urtaDrunk() && this.flags[kFLAGS.URTA_ANGRY_AT_PC_COUNTDOWN] == 0) {
                this.katherine.barKathUrtaLoveAnnounce();
                return;
            }
            this.katherine.barDescription();
            button = this.anotherButton(button, "Katherine", this.katherine.barApproach);
        }
        // trace("HEL FOLLOWER LEVEL: " + flags[kFLAGS.HEL_FOLLOWER_LEVEL] + " HEL FUCKBUDDY: " + flags[kFLAGS.HEL_FUCKBUDDY] + " HARPY QUEEN DEFEATED: " + flags[kFLAGS.HEL_HARPY_QUEEN_DEFEATED]);
        // trace("REDUCED ENCOUNTER RATE (DISPLINED): " + flags[kFLAGS.HEL_REDUCED_ENCOUNTER_RATE]);
        // HELIA
        // 	if (player.gender > 0 && getGame().time.hours >= 14 && rand(2) == 0 && getGame().time.hours < 20 && (flags[kFLAGS.HEL_FUCKBUDDY] != 0 || kGAMECLASS.helFollower.followerHel()) && !(flags[kFLAGS.HEL_FOLLOWER_LEVEL] == 1 && flags[kFLAGS.HEL_HARPY_QUEEN_DEFEATED]== 0)) {
        if (this.edryn.edrynHeliaThreesomePossible()) {
            this.edryn.helAppearance();
            button = this.anotherButton(button, "Helia", this.edryn.approachHelAtZeBitch);
        }
        // NANCY
        if (this.auntNancy.auntNancy(false)) {
            this.auntNancy.auntNancy(true);
            if (this.flags[kFLAGS.NANCY_MET] > 0) button = this.anotherButton(button, "Nancy", this.auntNancy.interactWithAuntNancy);
            else button = this.anotherButton(button, "Barkeep", this.auntNancy.interactWithAuntNancy);
        }
        else this.outputText("\n\nIt doesn't look like there's a bartender working at the moment.");

        // NIAMH
        if (this.getGame().time.hours >= 8 && this.getGame().time.hours <= 16 && this.flags[kFLAGS.NIAMH_STATUS] == 0) {
            this.niamh.telAdreNiamh();
            if (this.flags[kFLAGS.MET_NIAMH] == 0) button = this.anotherButton(button, "Beer Cat", this.niamh.approachNiamh);
            else button = this.anotherButton(button, "Niamh", this.niamh.approachNiamh);
        }
        // ROGAR #1
        if (this.flags[kFLAGS.ROGAR_PHASE] == 3 && this.flags[kFLAGS.ROGAR_DISABLED] == 0 && this.flags[kFLAGS.ROGAR_FUCKED_TODAY] == 0) {
            button = this.anotherButton(button, "HoodedFig", kGAMECLASS.swamp.rogar.rogarThirdPhase);
            // Wet Bitch screen text when Ro'gar phase = 3:
            this.outputText("\n\nYou notice a cloaked figure at the bar, though you're quite unable to discern anything else as its back is turned to you.");
        }
        // ROGAR #2
        else if (this.flags[kFLAGS.ROGAR_PHASE] >= 4 && this.flags[kFLAGS.ROGAR_DISABLED] == 0 && this.flags[kFLAGS.ROGAR_FUCKED_TODAY] == 0) {
            button = this.anotherButton(button, "Rogar", kGAMECLASS.swamp.rogar.rogarPhaseFour);
            // Wet Bitch bar text when Ro'gar phase = 4:
            this.outputText("\n\nRo'gar is here with his back turned to the door, wearing his usual obscuring cloak.");
        }

        switch (this.scylla.action) { // Scylla - requires dungeon shut down
            case Scylla.SCYLLA_ACTION_FIRST_TALK:
                this.outputText("\n\nThere is one nun sitting in a corner booth who catches your eye.  She sits straight-backed against the dark, wood chair, her thin waist accentuating the supple curve of her breasts. She's dressed in a black robe that looks a few sizes too small for her hips and wears a black and white cloth over her head.");
                button = this.anotherButton(button, "Nun", this.scylla.talkToScylla);
                break;
            case Scylla.SCYLLA_ACTION_ROUND_TWO:
                this.scylla.scyllaRoundII();
                return;
            case Scylla.SCYLLA_ACTION_ROUND_THREE:
                this.scylla.scyllaRoundThreeCUM();
                return;
            case Scylla.SCYLLA_ACTION_ROUND_FOUR:
                this.scylla.scyllaRoundIVGo();
                return;
            case Scylla.SCYLLA_ACTION_MEET_CATS:
                this.outputText("\n\nIt looks like Scylla is here but getting ready to leave.  You could check and see what the misguided nun is up to.");
                button = this.anotherButton(button, "Scylla", this.scylla.Scylla6);
                break;
            case Scylla.SCYLLA_ACTION_ADICTS_ANON:
                this.outputText("\n\nYou see Scylla's white and black nun's habit poking above the heads of the other patrons.  The tall woman seems unaware of her effect on those around her, but it's clear by the way people are crowding she's acquired a reputation by now.  You're not sure what she's doing, but you could push your way through to find out.");
                button = this.anotherButton(button, "Scylla", this.scylla.scyllaAdictsAnonV);
                break;
            case Scylla.SCYLLA_ACTION_FLYING_SOLO:
                this.outputText("\n\nIt looks like Scylla is milling around here this morning, praying as she keeps an eye out for someone to 'help'.");
                button = this.anotherButton(button, "Scylla", this.scylla.scyllasFlyingSolo);
                break;
            default:
        }
        // Nun cat stuff!
        if (this.katherine.needIntroductionFromScylla()) {
            this.katherine.catMorphIntr();
            button = this.anotherButton(button, "ScyllaCats", this.katherine.katherineGreeting);
        }
        // URTA
        if (kGAMECLASS.urta.urtaAtBar()) {
            // Scylla & The Furries Foursome
            if (this.scylla.action == Scylla.SCYLLA_ACTION_FURRY_FOURSOME) {
                // trace("SCYLLA ACTION: " + scylla.action);
                this.outputText("\n\nScylla’s spot in the bar is noticeably empty. She’s usually around at this time of day, isn’t she? Urta grabs your attention with a whistle and points to a back room with an accompanying wink. Oh... that makes sense. Surely the nun won’t mind a little help with her feeding...");
                button = this.anotherButton(button, "Back Room", this.scylla.openTheDoorToFoursomeWivScyllaAndFurries);
            }
            // Urta X Scylla threesome
            if (this.scylla.action == Scylla.SCYLLA_ACTION_FUCKING_URTA) {
                if (this.flags[kFLAGS.TIMES_CAUGHT_URTA_WITH_SCYLLA] == 0)
                    this.outputText("\n\n<b>Though Urta would normally be here getting sloshed, her usual spot is completely vacant.  You ask around but all you get are shrugs and giggles.  Something isn't quite right here.  You see an empty bottle of one of her favorite brands of whiskey still rolling on her table, so she can't have been gone long.  Maybe she had guard business, or had to head to the back rooms for something?</b>");
                else
                    this.outputText("\n\nUrta's usual place is vacant, though her table still holds a half-drank mug of something potent and alcoholic.  If it's anything like the last time this happened, she's snuck into a back room with Scylla to relieve some pressure.  It might not hurt to join in...");
                this.flags[kFLAGS.URTA_TIME_SINCE_LAST_CAME] = 4;
                button = this.anotherButton(button, "Back Room", kGAMECLASS.urta.scyllaAndUrtaSittingInATree);
            }
            else if (kGAMECLASS.urta.urtaBarDescript()) {
                if (this.auntNancy.auntNancy(false) && this.flags[kFLAGS.URTA_INCUBATION_CELEBRATION] == 0 && kGAMECLASS.urta.pregnancy.type == PregnancyStore.PREGNANCY_PLAYER) {
                    kGAMECLASS.urtaPregs.urtaIsHappyAboutPregnancyAtTheBar();
                    return;
                }
                button = this.anotherButton(button, "Urta", kGAMECLASS.urta.urtaBarApproach);
            }
        }
        // VALA
        if (this.vala.purifiedFaerieBitchBar()) button = this.anotherButton(button, "Vala", this.vala.chooseValaInBar);

        this.addButton(14, "Leave", this.telAdreMenu);
    }

    private urtaIsABadass(): void {
        this.flags[kFLAGS.PC_SEEN_URTA_BADASS_FIGHT] = 1;
        this.clearOutput();
        this.outputText("There's a commotion in the streets of Tel'Adre.  A dense crowd of onlookers has formed around the center of the street, massed together so tightly that you're unable to see much, aside from the backs the other onlookers' heads.  The sound of blows impacting on flesh can be heard over the crowd's murmuring, alerting you of the fight at the gathering's core.");
        this.menu();
        this.addButton(0, "Investigate", this.watchUrtaBeABadass);
        this.addButton(1, "Who cares?", this.telAdreMenu);
    }

    // [Invetigate]
    private watchUrtaBeABadass(): void {
        this.clearOutput();
        kGAMECLASS.urta.urtaSprite();
        this.outputText("You shoulder past the bulky centaurs, ignore the rough fur of the nearby wolves and hounds as it brushes against you, and press your way through to the center of the crowd.  Eventually the throng parts, revealing the embattled combatants.  A snarling wolf, nearly eight feet tall, towers over Urta.  The comparatively diminutive fox-woman is girded in light leather armor and dripping with sweat.  The larger wolf-man is staggering about, and his dark brown fur is matted with blood.\n\n");

        this.outputText("The bigger canid charges, snarling, with his claws extended.  Urta sidesteps and pivots, her momentum carrying her foot around in a vicious kick.  Her foot hits the side of the beast's knee hard enough to buckle it, and the wolf goes down on his knees with an anguished cry.  Urta slips under his arm and twists, turning his slump into a fall.  A cloud of dust rises from the heavy thud of the beast's body as it slams into the cobblestone street.\n\n");

        this.outputText("Now that it's immobile, you get can get a better look at the defeated combatant, and you're ");
        if (this.player.hasStatusEffect(StatusEffects.Infested)) this.outputText("aroused");
        else if (this.player.cor < 50) this.outputText("horrified");
        else this.outputText("confused");
        this.outputText(" by what you see.  A pair of thick, demonic horns curve back over the beast's head, piercing through the bottoms of its wolf-like ears.  Its entire body is covered in rippling muscle, leaving you in no doubt of its strength.  Even with a broken knee, the wolf-man is clearly aroused: protruding from a bloated sheath, his massive dog-dick is fully erect, solid black in color, with an engorged knot.  Small white worms crawl over the surface of his penis, wriggling out of the tip and crawling down the length, leaving trails of slime behind them.\n\n");

        this.outputText("Urta kneels down onto the corrupted wolf's throat, cutting off its air as it foams and struggles under her.  With grim determination, she holds the weakening, demonically-tainted wolf underneath her, leaning all of her body-weight into her knee to keep it down.  It struggles for what seems like ages, but eventually the tainted wolf's eyes roll closed.  Urta nods and rises, watching closely as the beast's breathing resumes.\n\n");

        this.outputText("She barks, \"<i>Get this one outside the walls before he wakes.  I won't have this corrupted filth in our city, and make sure you get the wards updated.  If he manages to find his way back, you sorry excuses for guards will be going out with him.</i>\"\n\n");
        this.outputText("A few dog-morphs in similar armor to Urta approach and lash ropes around the wolf's legs.  They hand a line to a centaur, and together the party begins dragging the unconscious body away.  With the action over, the crowd begins dispersing.  More than a few males nod to Urta respectfully.  She keeps her expression neutral and excuses herself to resume her rounds, wiping her hands off on her armor-studded skirt as she leaves.");
        this.doNext(this.telAdreMenu);
    }

}
