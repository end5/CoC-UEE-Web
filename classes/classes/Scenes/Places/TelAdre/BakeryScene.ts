import { TelAdreAbstractContent } from "./TelAdreAbstractContent";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { rand } from "../../../Extra";
import { kGAMECLASS } from "../../../GlobalFlags/kGAMECLASS";
import { PerkLib } from "../../../PerkLib";

export class BakeryScene extends TelAdreAbstractContent {

    // LAST_EASTER_YEAR: number = 823;

    // [First time approach]
    public bakeryuuuuuu(): void {
        if (this.isEaster() && this.player.hasCock() && (this.flags[kFLAGS.LAST_EASTER_YEAR] < this.date.fullYear || rand(20) == 0)) {
            this.flags[kFLAGS.LAST_EASTER_YEAR] = this.date.fullYear;
            this.easterBakeSale();
            return;
        }
        if (rand(10) <= 1 && kGAMECLASS.shouldraFollower.followerShouldra() && this.player.gender > 0 && this.flags[kFLAGS.MADDIE_STATUS] == 4) {
            kGAMECLASS.shouldraFollower.shouldraBakeryIntro();
            return;
        }
        this.flags[kFLAGS.MINO_CHEF_BAKERY_PROC_COUNTER]++;
        this.flags[kFLAGS.MINO_CHEF_BAKERY_PROC_COUNTER] = Math.round(this.flags[kFLAGS.MINO_CHEF_BAKERY_PROC_COUNTER]);
        // Chef meetings
        if (this.flags[kFLAGS.MADDIE_STATUS] == 0 && this.flags[kFLAGS.MINO_CHEF_BAKERY_PROC_COUNTER] % 8 == 0) {
            this.telAdre.maddie.procMaddieOneIntro();
            return;
        }
        // Maddie Epilogue trigger!
        if (this.flags[kFLAGS.MADDIE_STATUS] == 3) {
            this.telAdre.maddie.bakeryEpilogue();
            return;
        }
        this.clearOutput();
        this.menu();
        // First time
        if (this.flags[kFLAGS.TIMES_VISITED_BAKERY] == 0) {
            this.outputText("You approach the bakery, but it appears to be sunk below the street level.  The entrance isn't even a set of doors – it's a double-wide ramp that takes you below ground level.  The passage leads directly into the bakery's interior, allowing unobstructed traffic to flow in and out from the cozy, underground building. The smell of yeasty bread, sweet treats, and fluffy snacks seems to even permeate the bricks of this place.  If it were shut down, you have no doubt it would smell delicious for weeks if not months.  You get in line and look at the menu while you wait.\n\n");
        }
        // [Repeat approach]
        else {
            // Kanga christmas!
            if (kGAMECLASS.xmas.xmasMisc.nieveHoliday()) {
                kGAMECLASS.xmas.xmasMisc.encounterKamiTheChristmasRoo();
                if (this.flags[kFLAGS.KAMI_ENCOUNTER] == 1) this.addButton(3, "Pudding", kGAMECLASS.xmas.xmasMisc.getWinterPudding);
            }
            // Normal repeats!
            else this.outputText("You step into the bakery's domed interior and inhale, treated to a symphony of pleasant smells and the cozy warmth that radiates from the baking ovens.  There are plenty of tables and chairs around for one to eat at, and you find yourself stepping into line while you glance at the menu.\n\n");
        }
        // Times visited!
        this.flags[kFLAGS.TIMES_VISITED_BAKERY]++;
        this.outputText("What do you do?");
        this.addButton(0, "Check Menu", this.checkBakeryMenu);
        this.addButton(1, "Talk", this.talkBakeryMenu);
        this.addButton(14, "Leave", this.telAdre.telAdreMenu);
    }

    private checkBakeryMenu(): void {
        this.clearOutput();
        // var used for minotaur cum eclair in the menu
        let minoCum;
        let gcupcake;
        // Turn on cum eclairs if PC is an addict!
        if (this.player.findPerk(PerkLib.MinotaurCumAddict) >= 0 && this.flags[kFLAGS.MINOTAUR_CUM_ECLAIR_UNLOCKED] == 0) {
            this.flags[kFLAGS.MINOTAUR_CUM_ECLAIR_UNLOCKED]++;
            this.outputText("While you're in line, a shaking centauress glances at you and whispers, \"<i>You need some too, don't ya hun?</i>\"  You look on in confusion, not really sure what she's insinuating.  Her eyes widen and she asks, \"<i>Aren't you addicted?</i>\" You nod, dumbly, and she smiles knowingly.  \"<i>There's a minotaur that works here with a bit of a fetish... just order a special eclair and he'll fix you right up.  Just keep it on the hush hush and hope there's some left after I get my dozen.</i>\"  The centaur licks her lips and prances around impatiently.\n\n");
        }
        // (display menu)
        // Generic baked goods
        this.outputText("Rich Chocolate Brownies - 3 gems.\n");
        this.outputText("Fig Cookies - 4 gems.\n");
        this.outputText("Berry Cupcakes - 3 gems.\n");
        this.outputText("Doughnuts - 5 gems.\n");
        this.outputText("Pound Cake - 4 gems.\n");
        this.addButton(0, "Brownies", this.nomnomnom, "brownies", 3);
        this.addButton(1, "Cookies", this.nomnomnom, "cookies", 4);
        this.addButton(2, "Cupcakes", this.nomnomnom, "cupcakes", 3);
        this.addButton(3, "Doughnuts", this.nomnomnom, "doughnuts", 5);
        this.addButton(4, "Pound Cake", this.nomnomnom, "pound cake", 4);
        // Food for modes that have hunger enabled
        if (this.flags[kFLAGS.HUNGER_ENABLED] > 0) {
            this.outputText("Hard Biscuits - 5 gems (packed).\n");
            this.outputText("Trail Mix - 20 gems (packed).\n");
            this.addButton(5, "Hard Biscuits", this.buyHardBiscuits).hint(this.consumables.H_BISCU.description);
            this.addButton(6, "Trail Mix", this.buyTrailMix).hint(this.consumables.TRAILMX.description);
        }
        // Hummus available once a week
        if (this.getGame().time.days % 7 == 0) {
            this.outputText("Hummus - 100 gems (Weekly special only!).\n");
            this.addButton(7, "Hummus", this.buyHummus).hint(this.consumables.HUMMUS_.description);
        }
        // Special Eclair
        if (this.flags[kFLAGS.MINOTAUR_CUM_ECLAIR_UNLOCKED] > 0) {
            this.outputText("\'Special\' Eclair - 10 gems.\n");
            this.addButton(8, "SpecialEclair", this.nomnomnom, "eclair", 10);
        }
        // Giant Cupcake
        if (this.flags[kFLAGS.MADDIE_STATUS] >= 4) {
            this.outputText("Giant Chocolate Cupcake - 500 gems.\n");
            this.addButton(9, "GiantCupcake", this.buySlutCake);
        }
        this.outputText("\n");
        this.displayIngredients();
        this.outputText("\nWhat will you order?");
        // Ingredients and leave
        this.addButton(10, "Ingredients", this.ingredientsMenu);
        this.addButton(14, "Leave", this.bakeryuuuuuu);
    }

    private displayIngredients(): void {
        this.outputText("Also try our special ingredients in your own baking!\n");
        this.outputText("Fox Berry - 5 gems.\n");
        this.outputText("Ringtail Fig - 5 gems.\n");
        this.outputText("Mouse Cocoa - 10 gems.\n");
        this.outputText("Red River Root - 14 gems.\n");
        this.outputText("Ferret Fruit - 20 gems.\n");
    }

    public ingredientsMenu(): void {
        this.clearOutput();
        this.displayIngredients();
        this.menu();
        this.addButton(0, "Fox Berry", this.buyFoxBerry);
        this.addButton(1, "Ringtail Fig", this.buyFig);
        this.addButton(2, "Mouse Cocoa", this.buyCocoa);
        this.addButton(3, "R.Rvr Root", this.buyRoot);
        this.addButton(4, "Ferret Fruit", this.buyFerretFruit);
        this.addButton(14, "Back", this.checkBakeryMenu);
    }

    // [Bakery - Talk - Baker]
    private talkToBaker(): void {
        this.clearOutput();
        this.outputText("The minotaur snorts as you approach him, but waves you into the kitchen.  \"<i>What?</i>\" he asks, patiently watching you.  \"<i>Want to hear about baking?");
        // (Maddie 1 completed)
        if (this.flags[kFLAGS.MADDIE_STATUS] >= 4) this.outputText("  Or you want special order?");
        this.outputText("</i>\"");
        this.outputText("\n\nDespite his unrefined appearance and poor language ability, he seems eager to talk about his job.");

        // [Brownie][Cookie][Cupcake][Doughnut][Pound Cake][Fox Berry][Ringtail Fig][Mouse Cocoa][Nevermind]
        // [Nevermind] goes back to bakery main menu and is spacebar default
        // all purchases offered after talking should spacebar to [No] and go to normal purchase output if [Yes], returning to bakery main menu afterward
        this.menu();
        this.addButton(0, "Brownie", this.talkAboutBrownies);
        this.addButton(1, "Cookie", this.talkAboutCookies);
        this.addButton(2, "Cupcake", this.talkAboutCupcakes);
        this.addButton(3, "Doughnut", this.talkAboutDoughnuts);
        this.addButton(4, "Pound Cake", this.talkToBakerAboutPoundCake);
        this.addButton(5, "Fox Berry", this.talkAboutFoxBerry);
        this.addButton(6, "Ringtail Fig", this.talkAFig);
        this.addButton(7, "Mouse Cocoa", this.talkAboutMouseCocoa);
        this.addButton(8, "R.Rvr Root", this.talkAboutRoot);
        this.addButton(14, "Nevermind", this.talkBakeryMenu);
    }

    // [Bakery - Talk - Baker - Brownie]
    private talkAboutBrownies(): void {
        this.clearOutput();
        this.outputText("\"<i>Like our brownies?</i>\" the baker asks.  \"<i>Recipe been handed down from chef to chef for years.  Original maker invented it at an inn, for guests to carry in their lunchboxes.</i>\"");

        this.outputText("\n\nHe continues.  \"<i>Won't tell you full recipe.  Made with mouse cocoa, fresh egg, and sugar made from bee honey - heated and strained.  No transformations.  Pinch of salt, mix up, put in pan, bake.  Easy to make lots; popular.  Want one?  Three gems.</i>\"");

        // [Yes][No]
        this.menu();
        this.addButton(0, "Yes", this.nomnomnom, "brownies", 3);
        this.addButton(1, "No", this.talkToBaker);
    }

    // [Bakery - Talk - Baker - Cookie]
    private talkAboutCookies(): void {
        this.clearOutput();
        this.outputText("The baker nods at you.  \"<i>Cookies good.  Cookies easy, only need butter, sugar, flour, egg, and fig.  Mix batter and put in little circles, mash up figs, put figs in centers of circles, put other circle on top.  Cook cookie.  Also able to just put whatever into batter and make chocolate cookie or anything else, but fig most popular and cheapest.</i>\"  He smiles proudly and gestures toward the four-gem cookie display.  Do you buy one?");
        // [Yes][No]
        this.menu();
        this.addButton(0, "Yes", this.nomnomnom, "cookies", 4);
        this.addButton(1, "No", this.talkToBaker);
    }

    // [Bakery - Talk - Baker - Cupcake]
    private talkAboutCupcakes(): void {
        this.clearOutput();
        this.outputText("\"<i>Cupcakes take work,</i>\" the baker intones, tilting his long face downward.  \"<i>Need butter, sugar, flour, and eggs for batter; gotta mix long time and add stuff slowly.  Candied berries get cut up, put inside batter in little pieces.  Bake batter in a special pan.</i>\"");

        this.outputText("\n\n\"<i>Then,</i>\" he sighs, \"<i>make icing.  Soften butter, add milk and sugar and berry juice, beat mixture.  Beat a long time.  Beat until arm tired.  Spread on cupcakes when they come out.</i>\"");

        this.outputText("\n\n\"<i>Too popular, too cheap.  Always making cupcakes, no time to experiment on recipes.  Want to raise price but cupcakes are best seller and customers get mad.</i>\"  A bell rings.  Sighing again, he walks over to the oven and opens it, then pulls out a tray of un-iced cupcakes.  \"<i>See?  Making now.  You buying one?  Four... no, still three gems I guess.</i>\"");
        // [Yes][No]
        this.menu();
        this.addButton(0, "Yes", this.nomnomnom, "cupcakes", 3);
        this.addButton(1, "No", this.talkToBaker);
    }

    // [Bakery - Talk - Baker - Doughnut]
    private talkAboutDoughnuts(): void {
        this.clearOutput();
        this.outputText("\"<i>Doughnuts are fun,</i>\" the gruff baker smiles.  \"<i>Make mix of wet yeast, milk, sugar, eggs, little salt, and shortening.  Sometimes cocoa too.  Pound dough until smooth, work out frustration from making cupcakes all day.  Then let sit in covered bowl to rise.  Roll it small and cut if plain, or make circles if jam doughnut; cover to rise again.</i>\"  He mimes bringing a string's ends together and traces a circle, respectively.");

        this.outputText("\n\n\"<i>Fry in hot oil until brown and delicious, lift out with spatula.  Penetrate jam doughnuts with pastry bag and squirt jam like cum into breeding cow... sorry.</i>\"  He frowns.  \"<i>Take longer to make than other things, even cupcakes.  Can't make batches as big because so many kinds.  So doughnuts cost more - five gems.  Still, lots of fun to pound and fry and stuff.  Sell lots when watch shifts change; watchmen come in and clean out doughnut trays.  Want to buy one before next rush starts?</i>\"");
        // [Yes][No]
        this.menu();
        this.addButton(0, "Yes", this.nomnomnom, "doughnuts", 5);
        this.addButton(1, "No", this.talkToBaker);
    }

    // [Bakery - Talk - Baker - Pound Cake]
    private talkToBakerAboutPoundCake(): void {
        this.clearOutput();
        this.outputText("The minotaur snorts again, \"<i>'Baker's Special' pound cake is easy... mix butter and shortening, then sugar and eggs.  Put in little salt and whatever dry stuff needed, like fruits or chocolate.  Add milk too.  Put in narrow pan, bake long time.  Can't make batter in bulk though, got to have lots of varieties since not one is more popular than others.  So costs four gems; not as cheap as batch items.  Want a piece?</i>\"");
        // [Yes][No]
        this.menu();
        this.addButton(0, "Yes", this.nomnomnom, "pound cake", 4);
        this.addButton(1, "No", this.talkToBaker);
    }

    // [Bakery - Talk - Baker - Fox Berry]
    private talkAboutFoxBerry(): void {
        this.clearOutput();
        this.outputText("\"<i>Don't even know where these came from,</i>\" the baker admits.  \"<i>Shipper just showed up one day, showed me how to prepare and sell them.  Very fruity, but popular.  Candy or cook them right and eat them all day, never grow anything.  Eat them raw instead, get fox parts, look like guard captain lady and guy at whorehouse.  Still want one for five gems?</i>\"");

        // [Yes][No]
        this.menu();
        this.addButton(0, "Yes", this.buyFoxBerry);
        this.addButton(1, "No", this.talkToBaker);
    }

    // [Bakery - Talk - Baker - Ringtail Fig]
    private talkAFig(): void {
        this.clearOutput();
        this.outputText("\"<i>Fig tree?  From border of swamp,</i>\" the baker explains.  \"<i>Grows in crevices on other garbage tree, slowly covers it up until other tree is sealed inside and dies.  Bushrangers traded dried figs to us, then we grew our own from seeds when demons attacked and they stopped coming around.  Rocky start, but they stand up to desert now.  Good to eat.  Campfire not good for preparation - cook it in oven long time or you grow stripey tail and sly-looking mask and watchmen will all be suspicious of you and follow you around.  Saw it happen.  Five gems to buy.</i>\"");
        // figjam marker here: once next phase of fig use is written, then if figjam flag <= 1, set figjam flag = 1 at end of this talk
        // [Yes][No]
        // [Yes][No]
        this.menu();
        this.addButton(0, "Yes", this.buyFig);
        this.addButton(1, "No", this.talkToBaker);
    }

    // [Bakery - Talk - Baker - Ringtail Fig]
    private talkAboutRoot(): void {
        this.clearOutput();
        this.outputText("[say: Red River root is a root, but not red. Little merchants bring them from a river far away, that they call ‘Civappu’."
            + " Good for making beer, but too spicy if left aging. Used for food, then. If eaten raw will make you dizzy,"
            + " and make you red and fluffy. From far lands, so a bit more expensive.]");
        this.menu();
        this.addButton(0, "Yes", this.buyRoot);
        this.addButton(1, "No", this.talkToBaker);
        if (this.flags[kFLAGS.MINO_CHEF_TALKED_RED_RIVER_ROOT] < 0) {
            this.flags[kFLAGS.MINO_CHEF_TALKED_RED_RIVER_ROOT] = 0;
        }
        this.flags[kFLAGS.MINO_CHEF_TALKED_RED_RIVER_ROOT]++;
    }

    // [Bakery - Talk - Baker - Mouse Cocoa]
    private talkAboutMouseCocoa(): void {
        this.clearOutput();
        this.outputText("\"<i>Mouse cocoa comes from warm side of the lake, by forest border.  Like the name says, mouse people used to grow and eat a lot of it.  No mice left, though... hard to get now and expensive.  Have to buy it from the farmer at the lake; she sends out gathering parties.  Same one we get milk from.  Less and less every year... going to have to raise prices soon.  Ten gems for one handful, now.</i>\"");
        // [Yes][No]
        this.menu();
        this.addButton(0, "Yes", this.buyCocoa);
        this.addButton(1, "No", this.talkToBaker);
    }

    private buyCocoa(): void {
        this.clearOutput();
        if (this.player.gems < 10) {
            this.outputText("You can't afford one of those!");
            this.menu();
            this.addButton(0, "Next", this.ingredientsMenu);
            return;
        }
        this.outputText("You pay ten gems for some cocoa.  ");
        this.player.gems -= 10;
        this.statScreenRefresh();

        if (this.flags[kFLAGS.SHIFT_KEY_DOWN] == 1) {
            this.consumables.MOUSECO.useItem();
            this.doNext(this.ingredientsMenu);
        } else this.inventory.takeItem(this.consumables.MOUSECO, this.ingredientsMenu);
    }

    private buyFerretFruit(): void {
        this.clearOutput();
        if (this.player.gems < 20) {
            this.outputText("You can't afford one of those!");
            this.menu();
            this.addButton(0, "Next", this.ingredientsMenu);
            return;
        }
        this.outputText("You pay twenty gems for a single ferret fruit.  ");
        this.player.gems -= 20;
        this.statScreenRefresh();

        if (this.flags[kFLAGS.SHIFT_KEY_DOWN] == 1) {
            this.consumables.FRRTFRT.useItem();
            this.doNext(this.ingredientsMenu);
        } else this.inventory.takeItem(this.consumables.FRRTFRT, this.ingredientsMenu);
    }

    private buyFig(): void {
        this.clearOutput();
        if (this.player.gems < 5) {
            this.outputText("You can't afford one of those!");
            this.menu();
            this.addButton(0, "Next", this.ingredientsMenu);
            return;
        }
        this.outputText("You pay five gems for a fig.  ");
        this.player.gems -= 5;
        this.statScreenRefresh();

        if (this.flags[kFLAGS.SHIFT_KEY_DOWN] == 1) {
            this.consumables.RINGFIG.useItem();
            this.doNext(this.ingredientsMenu);
        } else this.inventory.takeItem(this.consumables.RINGFIG, this.ingredientsMenu);
    }

    private buyRoot(): void {
        this.clearOutput();
        if (this.player.gems < 14) {
            this.outputText("You can't afford one of those!");
            this.menu();
            this.addButton(0, "Next", this.ingredientsMenu);
            return;
        }
        this.outputText("You pay fourteen gems for the root.  ");
        this.player.gems -= 14;
        this.statScreenRefresh();

        if (this.flags[kFLAGS.SHIFT_KEY_DOWN] == 1) {
            this.consumables.RDRROOT.useItem();
            this.doNext(this.ingredientsMenu);
        } else this.inventory.takeItem(this.consumables.RDRROOT, this.ingredientsMenu);
    }

    private talkBakeryMenu(): void {
        this.clearOutput();
        this.outputText("Who will you talk to?\n");
        let rubiT: string = "Waitress";
        if (this.flags[kFLAGS.RUBI_INTRODUCED] > 0) rubiT = "Rubi";
        this.menu();
        this.addButton(0, "Baker", this.talkToBaker);

        // rubiIntros returns 0 if you've driven rubi away
        // I'm actually not sure how this was *supposed* to work, since it would just call eventParser with a event of 0
        // I guess it just wouldn't do anything?
        // FWIW, the flag that has to be set to get rubiIntros to return zero is set in a function that has the comment:
        // (Will no longer encounter Rubi at the bakery.)
        const rubiB = this.telAdre.rubi.rubiIntros();
        if (rubiB != undefined) this.addButton(1, rubiT, rubiB);

        if (kGAMECLASS.xmas.xmasMisc.nieveHoliday()) {
            if (this.flags[kFLAGS.KAMI_ENCOUNTER] > 0) {
                this.outputText("\nYou could 'burn off some steam' with Kami during her lunch break, since you already know how that'll end up!\n");
                this.addButton(2, "Kami", kGAMECLASS.xmas.xmasMisc.approachKamiTheChristmasRoo);
            }
            else {
                this.outputText("\nYou could summon the curvaceous kangaroo waitress you ran into earlier - perhaps you can win her over.\n");
                this.addButton(2, "Kangaroo", kGAMECLASS.xmas.xmasMisc.approachKamiTheChristmasRoo);
            }
        }
        this.outputText("\nYou see a bubblegum-pink girl at the bakery, walking around and eagerly trying to hand out fliers to people. Her “uniform” is more like a yellow bikini with frills circling the waist of the bottom half. If this didn’t make her stand out from the crowd then her hair certainly would; it’s a big, poofy, curly, dark pink mess that reaches down to her ass with a huge cupcake hat sitting on top.\n");
        if (this.flags[kFLAGS.MET_FROSTY] != 0) this.addButton(3, "Frosty", kGAMECLASS.telAdre.frosty.approachFrosty);
        else this.addButton(3, "PinkGirl", kGAMECLASS.telAdre.frosty.approachFrosty);
        this.addButton(14, "Leave", this.bakeryuuuuuu);
    }

    public nomnomnom(name: string, price: number): void {
        this.flags[kFLAGS.TEMP_STORAGE_PASTRY_NAME] = name;
        this.flags[kFLAGS.TEMP_STORAGE_PASTRY_PRICE] = price;
        this.clearOutput();
        if (this.player.gems < this.flags[kFLAGS.TEMP_STORAGE_PASTRY_PRICE]) {
            this.outputText("You don't have enough gems to order that!");
            // doNext(bakeryuuuuuu);
            this.menu();
            this.addButton(0, "Next", this.checkBakeryMenu);
            return;
        }
        this.player.gems -= this.flags[kFLAGS.TEMP_STORAGE_PASTRY_PRICE];
        this.statScreenRefresh();
        if (this.flags[kFLAGS.TEMP_STORAGE_PASTRY_NAME] == "eclair") {
            this.outputText("You hand over 10 gems and ask for the 'special eclair'.  The centaur working the counter smirks ");
            if (this.player.tallness <= 52) this.outputText("down ");
            else if (this.player.tallness >= 84) this.outputText("up ");
            this.outputText("at you gives pulls a cream-filled pastry from a box concealed behind the counter.  It's warm... so very warm, and you try to steady your hands as you walk off to towards a table, sniffing in deep lungfuls of its 'special' scent.  The first bite is heaven, sating a craving you didn't even know you had.  You can't stop yourself from moaning with delight as you drain every drop and finish off the sweet doughnut shell.  The minotaur goo is all over your fingers, but you don't mind licking them all clean.  With the lust now you now feel burning inside you, you even try to make a show of it.  Though you make a few ");
            if (this.player.femininity >= 75) this.outputText("males fill their pants");
            else if (this.player.femininity <= 25) this.outputText("females squirm");
            else this.outputText("other patrons squirm and fill out their pants");
            this.outputText(", none of them tries to make a move.  Pity.");
            this.dynStats("lus", (20 + this.player.lib / 10));
            this.player.minoCumAddiction(10);
            this.player.refillHunger(20);
        }
        else {
            this.outputText("You hand over " + BakeryScene.num2Text(this.flags[kFLAGS.TEMP_STORAGE_PASTRY_PRICE]) + " gems and get your " + this.flags[kFLAGS.TEMP_STORAGE_PASTRY_NAME] + ".  A moment later you're at a table, licking the sugary residue from your fingertips and wondering just how they make the food so damned good.");
            if (this.flags[kFLAGS.TEMP_STORAGE_PASTRY_NAME] == "doughnuts") {
                this.outputText(this.player.modTone(0, 2));
                this.outputText(this.player.modThickness(100, 1));
                if (rand(3) == 0 && this.player.butt.rating < 15 && (this.player.hunger > 25 || this.flags[kFLAGS.HUNGER_ENABLED] <= 0)) {
                    this.outputText("\n\nWhen you stand back up your " + this.player.buttDescript() + " jiggles a little bit more than you'd expect.");
                    this.player.butt.rating++;
                }
                if (rand(3) == 0 && this.player.hips.rating < 15 && (this.player.hunger > 25 || this.flags[kFLAGS.HUNGER_ENABLED] <= 0)) {
                    this.outputText("\n\nAfter finishing, you find your gait has changed.  Did your hips widen?");
                    this.player.hips.rating++;
                }
                this.player.refillHunger(25);
            }
            else if (this.flags[kFLAGS.TEMP_STORAGE_PASTRY_NAME] == "cookies") {
                this.outputText(this.player.modTone(0, 1));
                this.outputText(this.player.modThickness(100, 2));
                if (rand(3) == 0 && this.player.hips.rating < 20 && (this.player.hunger > 25 || this.flags[kFLAGS.HUNGER_ENABLED] <= 0)) {
                    this.outputText("\n\nAfter finishing, you find your gait has changed.  Did your hips widen?");
                    this.player.hips.rating++;
                }
                this.player.refillHunger(20);
            }
            else if (this.flags[kFLAGS.TEMP_STORAGE_PASTRY_NAME] == "brownies") {
                this.outputText(this.player.modThickness(100, 4));
                if (rand(2) == 0 && this.player.hips.rating < 30 && (this.player.hunger > 25 || this.flags[kFLAGS.HUNGER_ENABLED] <= 0)) {
                    this.outputText("\n\nAfter finishing, you find your gait has changed.  Your " + this.player.hipDescript() + " definitely got wider.");
                    this.player.hips.rating += 2;
                }
                this.player.refillHunger(20);
            }
            else if (this.flags[kFLAGS.TEMP_STORAGE_PASTRY_NAME] == "cupcakes") {
                this.outputText(this.player.modTone(0, 4));
                if (rand(2) == 0 && this.player.butt.rating < 30 && (this.player.hunger > 25 || this.flags[kFLAGS.HUNGER_ENABLED] <= 0)) {
                    this.outputText("\n\nWhen you stand back up your " + this.player.buttDescript() + " jiggles with a good bit of extra weight.");
                    this.player.butt.rating += 2;
                }
                this.player.refillHunger(20);
            }
            else if (this.flags[kFLAGS.TEMP_STORAGE_PASTRY_NAME] == "pound cake") {
                this.outputText(this.player.modTone(0, 2));
                this.outputText(this.player.modThickness(100, 2));
                if (rand(3) == 0 && this.player.butt.rating < 25 && (this.player.hunger > 25 || this.flags[kFLAGS.HUNGER_ENABLED] <= 0)) {
                    this.outputText("\n\nWhen you stand back up your " + this.player.buttDescript() + " jiggles a little bit more than you'd expect.");
                    this.player.butt.rating++;
                }
                if (rand(3) == 0 && this.player.hips.rating < 25 && (this.player.hunger > 25 || this.flags[kFLAGS.HUNGER_ENABLED] <= 0)) {
                    this.outputText("\n\nAfter finishing, you find your gait has changed.  Did your " + this.player.hipDescript() + " widen?");
                    this.player.hips.rating++;
                }
                this.player.refillHunger(50);
            }
        }
        // doNext(bakeryuuuuuu);
        this.menu();
        this.addButton(0, "Next", this.checkBakeryMenu);
    }
    /*[doughnuts] – some thickness, lots of – tone. (+hips and butt!)
    [cookies] – thickness and a little – tone (+hips)
    [brownies] – lots of thickness (chance of +butt)
    [cupcakes] – lots of – tone (chance of +hips)
    [pound cake] – even split of + thickness and – tone.  (+butt)
    [mino cum eclair] – helps your cravings and – tone!, LUST!*/

    public buySlutCake(): void {
        this.clearOutput();
        if (this.player.gems < 500) {
            this.outputText("You don't have enough gems for one of those!");
            // doNext(bakeryuuuuuu);
            this.menu();
            this.addButton(0, "Next", this.checkBakeryMenu);
            return;
        }
        this.outputText("The minotaur chef emerges from the backroom bearing a box that contains your cupcake.  It's too big to scarf down immediately.\n\n");
        this.player.gems -= 500;
        this.statScreenRefresh();
        this.inventory.takeItem(this.consumables.CCUPCAK, this.bakeryuuuuuu);
    }

    private buyFoxBerry(): void {
        this.clearOutput();
        if (this.player.gems < 5) {
            this.outputText("You can't afford one of those!");
            this.menu();
            this.addButton(0, "Next", this.ingredientsMenu);
            return;
        }
        this.outputText("You pay five gems for a fox berry.  ");
        this.player.gems -= 5;
        this.statScreenRefresh();

        if (this.flags[kFLAGS.SHIFT_KEY_DOWN] == 1) {
            this.consumables.FOXBERY.useItem();
            this.doNext(this.ingredientsMenu);
        } else this.inventory.takeItem(this.consumables.FOXBERY, this.ingredientsMenu);
    }

    private buyHardBiscuits(): void {
        this.clearOutput();
        if (this.player.gems < 5) {
            this.outputText("You can't afford one of those!");
            this.doNext(this.checkBakeryMenu);
            return;
        }
        this.outputText("You pay five gems for a pack of hard biscuits.  ");
        this.player.gems -= 5;
        this.statScreenRefresh();

        if (this.flags[kFLAGS.SHIFT_KEY_DOWN] == 1) {
            this.consumables.H_BISCU.useItem();
            this.doNext(this.checkBakeryMenu);
        } else this.inventory.takeItem(this.consumables.H_BISCU, this.checkBakeryMenu);
    }

    private buyTrailMix(): void {
        this.clearOutput();
        if (this.player.gems < 20) {
            this.outputText("You can't afford one of those!");
            this.doNext(this.checkBakeryMenu);
            return;
        }
        this.outputText("You pay twenty gems for a pack of trail mix.  ");
        this.player.gems -= 20;
        this.statScreenRefresh();

        if (this.flags[kFLAGS.SHIFT_KEY_DOWN] == 1) {
            this.consumables.TRAILMX.useItem();
            this.doNext(this.checkBakeryMenu);
        } else this.inventory.takeItem(this.consumables.TRAILMX, this.checkBakeryMenu);
    }

    private buyHummus(): void {
        this.clearOutput();
        if (this.player.gems < 100) {
            this.outputText("You can't afford one of those!");
            this.doNext(this.checkBakeryMenu);
            return;
        }
        this.outputText("You pay twenty gems for a pack of hummus.  ");
        this.player.gems -= 100;
        this.statScreenRefresh();

        if (this.flags[kFLAGS.SHIFT_KEY_DOWN] == 1) {
            this.consumables.HUMMUS_.useItem();
            this.doNext(this.checkBakeryMenu);
        } else this.inventory.takeItem(this.consumables.HUMMUS_, this.checkBakeryMenu);
    }

    private easterBakeSale(): void {
        this.clearOutput();
        this.outputText("You make your way to the bakery only to find that it's so full you can barely squeeze inside.  ");
        if (this.telAdre.rubi.rubiAffection() >= 40) this.outputText("An extremely busy Rubi can only manage a wave in your direction before going back to attending customers.  ");
        this.outputText("Seeing all of the holiday bustle hits you with a pang of homesickness, remembering times from Ingnam.  Shaking these feelings off, you make your way to the front of the queue determined to see what the fuss is about.  The normally absent minotaurus chef greets you, adding fuel to your notion that they are understaffed.");
        this.outputText("\n\n\"<i>Hello.  You come here often?  We busy.  Will try to do good.</i>\"");
        // [Check Menu] [Offer Help]
        this.menu();
        this.addButton(3, "Check Menu", this.checkBakeryMenu);
        this.addButton(0, "Offer Help", this.easterBakeSaleHelp);
        this.addButton(4, "Leave", this.telAdre.telAdreMenu);
    }

    private easterBakeSaleHelp(): void {
        this.clearOutput();
        // [Offer Help]
        this.outputText("Determined to see if there is anything you can help with, you offer your assistance to the chef.  He responds to you in his usual briskness, \"<i>You help.  Go in back.  Make pastries.</i>\"  You ask if he'd rather you help with the chocolate eggs that are flying out of his door, but he declines and almost laughs at you.  \"<i>No.  I make eggs.  No one else.</i>\"");
        this.outputText("\n\nYou head into the back and take a seat while you wait for the chef to come give you directions.  After what seems like an age in the sweltering heat given off by the ovens, the chef finds a moment to pop in to direct you.  Pointing out the equipment you'll need, he lays out some ingredients you recognise.  However, to your horror he doesn't leave out any milk!  Upon questioning this he laughs and points to you, \"<i>You make milk.  Other milk not so good.</i>\"");
        this.outputText("\n\nExasperated but decided on helping out, ideas race through your mind as to how you can get enough milk for the pastries.  Seeing the panic on your face, the minotaur once again laughs.  Among the ingredients he put out for you is a small jar of a blue fluid that seems to be constantly boiling.  He picks this up and hands it to you, evidently expecting you to know what it is because afterwards he turns around and goes back to the front.");
        this.outputText("\n\nStill unsure exactly what to do, you sit where you are in disbelief at your situation before your curiosity gets the better of you, deciding you must examine these eggs for yourself.  Walking over to one of the few that are left in the back, you pick it up to find it is innately warm.  It takes all your composure not to drop it at this, but you press onwards.  Not only does it feel warm, it seems to be taking the heat out of your hands.  A lewd thought passes in your mind, imagining a chocolate person coming out of the egg, tendrils dripping off of them like sticky aftersex.  Surprised at your own audacity, you put the egg down again wondering where the thought came from.  Remembering why you are back here, your dilemma returns to the forefront of your mind with pressing urgency.  You walk over and pick up the jar of blue liquid; it is far more viscous than you imagined.  Taking everything into consideration, you're helping out here.  There would be no reason for the minotaur to give you something with hostile intent, so you decide to trust your gut and to drink the strange elixir.  Not wanting to down the whole thing, you quickly find a measuring cup to use for your drink and pour yourself some.  Bottoms up...");
        this.outputText("\n\nA euphoric wave passes through you, emanating from the drink slowly filling your stomach.  The drink fills you with, if nothing else, the newfound fury of a madman for solving your problem.  Lurching forward, you are certain that if nothing else, the solution to your impasse must be contained within.  ");
        // (If the player has tits)
        if (this.player.biggestTitSize() >= 1) this.outputText("Your [fullChest] bounce at the vigor of your movement.  ");
        this.outputText("Going over the egg like an elaborate puzzle with its secrets only limited by your ability to unlock them, you are delighted to feel a stir of movement from within.  The heat is leaving not only your hands, but the entire room now, bringing the bristling heat down until you're sure it's cooler in here than outside with the swarm of customers.");
        this.outputText("\n\nThe egg you've been holding in your hands begins to almost shake; you set it down to avoid the risk of you dropping it.  It turns out you put it down just in time, as a chocolate eruption sprays out of the egg towards the ceiling with more force than a geyser.  Climbing from the remains of the egg, a voluptuously bodied chocolate herm emerges, intents obvious from the equipment already erect and slavering.  You can't help but size her up, noting her full DD cup breasts and a dick you judge to be about 14 inches.  Her sensual gait as she makes her way over to you is nothing short of evil in the way it brings heat to your crotch, ");
        // (if the pc is male)
        if (this.player.gender == 1) this.outputText("[eachCock] jumps to full hardness.");
        // (if the pc is female)
        else if (this.player.hasVagina()) this.outputText("your nipples stiffening noticeably, while your [vagina] prepares for what's to come.");
        // (if the pc is a herm)
        else this.outputText("[eachCock jumping to full hardness, your nipples and [vagina] not far behind in getting ready for your encounter.");
        this.outputText("\n\nThe euphoria from your earlier drink fades, replaced by a more animalistic need.");
        this.menu();
        this.addButton(0, "Next", this.malesHelpOutWithEaster);
    }

    // [Male]
    private malesHelpOutWithEaster(): void {
        this.clearOutput();
        this.outputText("An idea crosses your mind; why not have the molten girl help you with your problem?  As if reading your mind, the girl continues her way to you, making her way with her eyes locked on your [cock biggest].  She is upon you now, flaccid streams drooling off her hand as she makes to grab your cock.  A heated pressure envelopes your shaft");
        if (this.player.balls > 0) this.outputText(", sticky drops of chocolate trailing down your [balls]");
        this.outputText(", each movement a not unpleasant sensation as the warmth infuses you.  The center of the pressure loosens, and your chocolate partner takes it upon herself to pin you to the floor, her warmness surrounding you.  Almost immediately you feel a similar pressure to the previous upon your groin, pulsating now as if stroking your cock in earnest.  You work out that she has enveloped your rod in what you assume is a vagina.  As if to confirm your suspicions, your captor lets out a small moan, increasing the fervor with which she rings out your dong.");
        this.outputText("\n\nUnable now to contain your own lust, you start idly pumping into her velvety depths, the extreme warmth of which does nothing to discourage you.  Delighted by your newfound vigor, the mass riding you lets a sound out halfway between a squeal and a moan, increasing the vehemence of her own ministrations.  You pull your hand free from its prison only to thrust it higher up, gripping the highly malleable breast of the buxom girl.  Increasing the intensity of your pelvic endeavor, you elicit another moan from the bodacious vixen's lips, only adding fuel to your frenzied motions.  Jamming into her depths, intense heat assaults your body.  As if setting a spark to kindling, a torrid wave sweeps through you before you realize you are towards your limit.");
        this.outputText("\n\nDecided on making your mate peak before you, your attention turns to bringing pleasure from your awkward thrusts into her depths.  Finding your current position lacking the dominance you need for your vision, you struggle out from beneath the heated woman, leaving her confused with her ass in the air.  Satisfied with your new arrangement, you take up position behind her and push your hand into her pussy, testing its plasticity.  Wasting no more time, you line up your [cock biggest] with the woman's opening and administer your entire length in a quick thrust.  The woman openly moans from your treatment of her depths.  Still remembering your goal, you bring your hand down and find a harder globule of chocolate that must be her clitoris.  While passively administering jabs into her pussy, you concentrate your fingers on her love button, rubbing with both tenderness and vigor.  Moaning openly now, the girl lets out a keening wail that puts you dangerously close to the edge yourself.  With a final burst of energy you aren't sure you can afford, you begin plunging into her silky breach with near desperation.");

        this.outputText("\n\nYour chocolate counterpart is now screaming with a passion unmatched by even yourself, while you ram as fast as your [legs] will allow.  The girl's other equipment is also reaching its limit, convulsing as if about to burst.  The shriek the woman emits is nothing short of ear-shattering as she cums, chocolate raining down on you.  ");
        // [SILLYMODE]
        if (this.silly()) this.outputText("You regret not bringing your umbrella for this Chocolate Rain, so that you could be like those that stay dry rather than those who feel the pain.  ");
        this.outputText("Her rod is only seconds behind, emitting a stream of what appears to be white chocolate at least three feet into the air, sputtering three or four strands before calming down.  The girl collapses in a heap, bringing your conjoined genitals down as well.  You are not quite done, your own rod deep into her folds, quickly bringing yourself to your own orgasm.");
        // (small cum vol)
        if (this.player.cumQ() < 250) this.outputText("\n\nYour cock spits out a few streams into her expanse, thick cords of aftersex connecting you and your partner even as you pull away.");
        // (med cum vol)
        else if (this.player.cumQ() < 500) this.outputText("\n\nYour cock shoots out several significant streams of seed, filling your partner's deepness while a small amount dribbles out.");
        // (large cum vol)
        else if (this.player.cumQ() < 1000) this.outputText("Your cock spews out a significant amount of seed, filling your partners deepness quickly while a small volume shoots out with some force.  You are happy to see that she seems to have gained a little weight from your baby-batter.");
        // (very large cum vol)
        else if (this.player.cumQ() < 5000) this.outputText("Your cock spews into your partner's deepness, filling it almost instantly while a significant volume splatters out.  You are happy to see she seems to have gained a little weight from your baby-batter.");
        else this.outputText("Your cock opens like a river, streaming into your partner with such force that her belly distends.  A spew begins to erupt from her vagina, empting the significant amount she could not take on to the floor.  You are happy to see she has gained some weight from your baby-batter.");
        this.outputText("  It's about all you can do to get to the floor before passing out.  So much for helping.  In the back of your mind you picture the minotaur with a smug grin as your consciousness fades.");
        this.outputText("\n\n<b>Later...</b>");
        this.outputText("\nYou stumble back to camp, still somewhat out of it from your experience.");
        this.player.orgasm('Dick');
        this.dynStats("lib", 1);
        this.player.cumMultiplier += 2;
        this.doNext(this.camp.returnToCampUseOneHour);
    }
}
