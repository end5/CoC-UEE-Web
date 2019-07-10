import { BaseContent } from "../../BaseContent";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";
import { SpriteDb } from "../../display/SpriteDb";
import { ItemType } from "../../ItemType";
import { Consumable } from "../../Items/Consumable";

export class Lumi extends BaseContent {

    public lumiEncounter(): void {
        this.clearOutput();
        if (this.flags[kFLAGS.LUMI_MET] == 0) { // 1st time lumi meeting
            this.outputText(this.images.showImage("event-lumi"));
            // placeholder text for outside the cathedral
            this.outputText("You spot an anomaly in the barren wastes; a door that seems to be standing out in the middle of nowhere. Somehow, you figure that it must lead to some other part of the world, and the only reason it's here is because you can't get to where the door should be right now.\n\n");
            this.outputText("Do you open it?");
            this.doYesNo(this.lumiLabChoices, this.camp.returnToCampUseOneHour);
        }
        else {
            // placeholder text for outside the cathedral
            this.outputText("You spot the door standing in the middle of nowhere again, and you guess that it will lead you back to Lumi's laboratory.  It swings open easily...");
            this.doNext(this.lumiLabChoices);
        }	// end of placeholder text
    }

    public lumiLabChoices(): void {
        this.spriteSelect(SpriteDb.s_lumi);
        this.clearOutput();
        if (this.flags[kFLAGS.LUMI_MET] == 0) { // First time meeting
            this.flags[kFLAGS.LUMI_MET]++; // set Lumi met flag
            this.outputText(this.images.showImage("encounter-lumi"));
            this.outputText("You open the door and carefully check inside for any enemies that may be trying to ambush you. The room seems to be some kind of alchemical lab, with shelves full of apparatuses all along the walls, a desk on one side of the room, and a long table across the room from you that is full of alchemical experiments in progress, many give off lots of smoke, and others are bottles of bubbling fluids.  A goblin wearing an apron and some kind of headband is sitting on a tall, wheeled stool; she is otherwise nude and seems to be watching at least 3 experiments right now. She suddenly turns around and looks straight in your direction.  It's hard to tell thanks to the dark goggles that hide her eyes from view, but you're fairly certain she's watching you.  After a few seconds she yells \"<i>Cuths-tohmer!</i>\" in a thick lisp. She looks harmless enough, so you step inside while she fiddles with her experiments, reducing the bubbling smoke.  She jumps down from her stool, tears off her apron, bounds over to the desk, and scrambles on top of it.\n\n");
            this.outputText("She's about 3 feet tall, with yellow-green skin, and wears her orange hair in a long ponytail that reaches to her knees.  Her breasts are about B cup, with average nipples that have been colored orange. All of her nails have been painted orange to match. She doesn't seem to ever stop moving, and while the majority of her face looks cute, it's a little hard to be sure while she's wearing those thick goggles.  The solid black lenses of her goggles make her look quite unsettling, stifling any appeal her form could inspire in you.\n\n");
            this.outputText("\"<i>Stho, what can Lumi, Gobin Aochomist Extwaordinaire, do fo you today?</i>\" asks the unusual goblin.\n\n");
            this.outputText("You explain that it's a little hard to understand her.  She sticks her tongue out at you, showing a VERY large stud in the middle of it, instantly explaining her lisp.  Rather than pushing the point, you ask her what she can do for you.  She pulls open a hatch on the top of the desk and pulls out a bottle of something and shakes it, \"<i>Lumi can sell you some of her finely cwafted poetions fo a good pwice, ore, if you've alweady got some nice poetions or reagents, Lumi can make them even bettar. But tha cost a whole lot. If you were one of dee Followers, den maybe Lumi could make a special deal wit you; but the boss don't want me playin wit outsiders. Wat will it be?</i>\"\n\n");
        }
        else { // Repeat Meetings
            this.outputText(this.images.showImage("encounter-lumi-repeat"));
            this.outputText("Once more, you step into Lumi's lab.  She's still working on her experiments. Before you even have a chance to call out to her, she has already pivoted to watch you.  In a flash her apron hits the floor and she is standing on her desk, asking, \"<i>Stho, what can Lumi the Aochomist Extwaordinaire do fo you today?</i>\"");
        }
        this.menu();
        this.addButton(0, "Shop", this.lumiShop);
        this.addButton(1, "Enhance", this.lumiEnhance);
        this.addButton(14, "Leave", this.camp.returnToCampUseOneHour);
    }

    public lumiShop(): void { // Set item handling to lumi shop
        this.spriteSelect(SpriteDb.s_lumi);
        this.clearOutput();
        this.outputText("You ask Lumi if you can see her potions.  She smiles at you and pulls out several bottles from her desk and shows them to you.\n\n\"<i>Gawantied qwality, made by Lumi herself,</i>\" she says proudly.\n\n");
        this.outputText("Lust Draft - 15 gems\nGoblin Ale - 20 gems\nOviposition Elixir - 45 gems\n");
        // The player is given a list of choices, clicking on one gives the description and the price, like Giacomo
        this.menu();
        if (this.player.gems >= 15)
            this.addButton(0, this.consumables.L_DRAFT.shortName, this.lumiLustDraftPitch);
        else this.addDisabledButton(0, this.consumables.L_DRAFT.shortName);
        if (this.player.gems >= 20)
            this.addButton(1, this.consumables.GOB_ALE.shortName, this.lumiPitchGobboAle);
        else this.addDisabledButton(1, this.consumables.GOB_ALE.shortName);
        if (this.player.gems >= 45)
            this.addButton(2, this.consumables.OVIELIX.shortName, this.lumiPitchOviElixer);
        else this.addDisabledButton(2, this.consumables.OVIELIX.shortName);
        this.addButton(14, "Back", this.lumiLabChoices);
    }
    // Lust Draft
    private lumiLustDraftPitch(): void {
        this.spriteSelect(SpriteDb.s_lumi);
        this.clearOutput();
        this.outputText(this.images.showImage("item-draft-lust"));
        this.outputText("You point at the bottle filled with bubble-gum pink fluid.\n\n\"<i>De lust dwaft? Always a favowite, with it you nevar have to worwy about not bein weady for sexy time; one of my fiwst creations. 15 gems each.</i>\"\n\n");
        this.outputText("Will you buy the lust draft?");
        this.menu();
        this.addButton(0, "Yes", Lumi.curry(this.lumiPurchase, this.consumables.L_DRAFT, 15));
        this.addButton(1, "No", this.lumiShop);
    }
    // Goblin Ale
    private lumiPitchGobboAle(): void {
        this.spriteSelect(SpriteDb.s_lumi);
        this.clearOutput();
        this.outputText(this.images.showImage("item-gAle"));
        this.outputText("You point at the flagon. \"<i>Oh? Oh thats Lumi's... actually no, dat tispsy stuff for 20 gems. You'll like if you want to be like Lumi. Do you like it?</i>\"\n\n");
        this.outputText("Will you buy the goblin ale?");
        this.menu();
        this.addButton(0, "Yes", Lumi.curry(this.lumiPurchase, this.consumables.GOB_ALE, 20));
        this.addButton(1, "No", this.lumiShop);
    }
    // Ovi Elixir
    private lumiPitchOviElixer(): void {
        this.spriteSelect(SpriteDb.s_lumi);
        this.clearOutput();
        this.outputText(this.images.showImage("item-oElixir"));
        this.outputText("You point at the curious hexagonal bottle. \"<i>De Oviposar Elixir? Made baithsed on da giant bee's special stuff dey give deir queen. It will help make de burfing go faster, an if you dwink it while you awen pweggy, iw will give you some eggs to burf later. More dwinks, eqwals more and biggar eggs. Lumi charges 45 gems for each dose.</i>\"\n\n");
        this.outputText("Will you buy the Ovi Elixir?");
        this.menu();
        this.addButton(0, "Yes", Lumi.curry(this.lumiPurchase, this.consumables.OVIELIX, 45));
        this.addButton(1, "No", this.lumiShop);
    }

    private lumiPurchase(itype: ItemType, cost: number): void { // After choosing, and PC has enough gems
        this.spriteSelect(SpriteDb.s_lumi);
        this.clearOutput();
        this.outputText("You pay Lumi the gems, and she hands you " + itype.longName + " saying, \"<i>Here ya go!</i>\"\n\n");
        this.player.gems -= cost;
        this.statScreenRefresh();
        if (this.flags[kFLAGS.SHIFT_KEY_DOWN] == 1 && itype instanceof Consumable) {
            (itype as Consumable).useItem();
            this.doNext(this.lumiLabChoices);
        }
        else this.inventory.takeItem(itype, this.lumiLabChoices);
    }

    public lumiEnhance(): void {
        this.spriteSelect(SpriteDb.s_lumi);
        this.clearOutput();
        this.outputText("\"<i>Yay! Lumi loves to do enhancement, what you want to be bettar?</i>\"");
        this.menu();
        let btn: number = 0;
        if (this.player.hasItem(this.consumables.FOXBERY))
            this.addButton(btn++, this.consumables.FOXBERY.shortName, this.lumiEnhanceGo, this.consumables.FOXBERY, undefined, undefined);
        else this.addDisabledButton(btn++, this.consumables.FOXBERY.shortName);
        if (this.player.hasItem(this.consumables.FOXJEWL))
            this.addButton(btn++, this.consumables.FOXJEWL.shortName, this.lumiEnhanceGo, this.consumables.FOXJEWL, undefined, undefined);
        else this.addDisabledButton(btn++, this.consumables.FOXJEWL.shortName);
        if (this.player.hasItem(this.consumables.GLDSEED))
            this.addButton(btn++, this.consumables.GLDSEED.shortName, this.lumiEnhanceGo, this.consumables.GLDSEED, undefined, undefined);
        else this.addDisabledButton(btn++, this.consumables.GLDSEED.shortName);
        if (this.player.hasItem(this.consumables.KANGAFT))
            this.addButton(btn++, this.consumables.KANGAFT.shortName, this.lumiEnhanceGo, this.consumables.KANGAFT, undefined, undefined);
        else this.addDisabledButton(btn++, this.consumables.KANGAFT.shortName);
        if (this.player.hasItem(this.consumables.L_DRAFT))
            this.addButton(btn++, this.consumables.L_DRAFT.shortName, this.lumiEnhanceGo, this.consumables.L_DRAFT, undefined, undefined);
        else this.addDisabledButton(btn++, this.consumables.L_DRAFT.shortName);
        if (this.player.hasItem(this.consumables.LABOVA_))
            this.addButton(btn++, this.consumables.LABOVA_.shortName, this.lumiEnhanceGo, this.consumables.LABOVA_, undefined, undefined);
        else this.addDisabledButton(btn++, this.consumables.LABOVA_.shortName);
        if (this.player.hasItem(this.consumables.OVIELIX))
            this.addButton(btn++, this.consumables.OVIELIX.shortName, this.lumiEnhanceGo, this.consumables.OVIELIX, undefined, undefined);
        else this.addDisabledButton(btn++, this.consumables.OVIELIX.shortName);
        if (this.player.hasItem(this.consumables.SDELITE))
            this.addButton(btn++, this.consumables.SDELITE.shortName, this.lumiEnhanceGo, this.consumables.SDELITE, undefined, undefined);
        else this.addDisabledButton(btn++, this.consumables.SDELITE.shortName);
        if (this.player.hasItem(this.consumables.PIGTRUF))
            this.addButton(btn++, this.consumables.PIGTRUF.shortName, this.lumiEnhanceGo, this.consumables.PIGTRUF, undefined, undefined);
        else this.addDisabledButton(btn++, this.consumables.PIGTRUF.shortName);
        if (this.player.hasItem(this.consumables.PURHONY))
            this.addButton(btn++, this.consumables.PURHONY.shortName, this.lumiEnhanceGo, this.consumables.PURHONY, undefined, undefined);
        else this.addDisabledButton(btn++, this.consumables.PURHONY.shortName);
        this.addButton(14, "Back", this.lumiLabChoices);
    }

    private lumiEnhanceGo(itype: ItemType): void {
        this.spriteSelect(SpriteDb.s_lumi);
        if (this.player.gems < 100) { // if player has less than 100 gems
            this.outputText("\"<i>Do you have 100 gems for de enhancement?</i>\" asks Lumi.\n\nYou shake your head no, and Lumi gives you a disappointed look and says, \"<i>Den Lumi can do no enhancement for you. Anyfing else?</i>\"\n\n");
            this.doNext(this.lumiLabChoices); // return to main Lumi menu
            return;
        }
        let nextItem: ItemType = ItemType.NOTHING;
        if (itype == this.consumables.LABOVA_) nextItem = this.consumables.PROBOVA;
        else if (itype == this.consumables.KANGAFT) nextItem = this.consumables.MGHTYVG;
        else if (itype == this.consumables.SDELITE) nextItem = this.consumables.S_DREAM;
        else if (itype == this.consumables.OVIELIX) nextItem = this.consumables.OVI_MAX;
        else if (itype == this.consumables.L_DRAFT) nextItem = this.consumables.F_DRAFT;
        else if (itype == this.consumables.GLDSEED) nextItem = this.consumables.MAGSEED;
        else if (itype == this.consumables.FOXBERY) nextItem = this.consumables.VIXVIGR;
        else if (itype == this.consumables.FOXJEWL) nextItem = this.consumables.MYSTJWL;
        else if (itype == this.consumables.PIGTRUF) nextItem = this.consumables.BOARTRU;
        else if (itype == this.consumables.PURHONY) nextItem = this.consumables.SPHONEY;
        this.player.gems -= 100;
        this.statScreenRefresh();
        this.player.consumeItem(itype);
        this.clearOutput();
        this.outputText("Lumi grabs the item from you and runs over to her table, stopping for only a second to put her apron on.  ");
        // start list of possible enhancement texts
        this.temp = Lumi.rand(3);
        if (itype == this.consumables.GLDSEED) this.outputText("She fiddles with it, coating it in exotic powders before she tosses the whole mess onto a hotplate.  It explodes, knocking the goblin flat on her ass.  She sits bolt upright and snatches up the now-glowing seed with a gloved hand.\n\n");
        else if (itype == this.consumables.FOXJEWL) this.outputText("Lumi stares wide-eyed into the fathoms of its depths.  She remains like that for several moments before you clear your throat, and then hurries off to work.  Flitting back and forth between the various beakers and test tubes that litter the workshop, she mixes chemicals seemingly at random, many of which bubble or explode rather violently.\n\nAfter several minutes of this, she pours all of the reagents into a large beaker over an open flame.  The contents boil up through the neck of the flask and drip slowly down the condenser.  A ponderously large drop of black liquid builds up at the tip of the condenser, wobbling precipitously for a moment before finally falling onto the jewel with a splash.\n\nThe jewel soaks up the black fluid like a sponge, veins of sickening purple spreading across the surface like a spider's web.  A few moments later, the jewel is entirely purple, the mystic flames inside glowing a bright violet.\n\nYou reach out hesitantly and place the mystically enhanced teardrop-shaped jewel into your pouch.\n\n");
        else if (itype == this.consumables.KANGAFT) this.outputText("She fiddles with it, coating it in exotic powders before she tosses the whole mess onto a hotplate.  It explodes, knocking the goblin flat on her ass.  She sits bolt upright and snatches up the now-glowing fruit with a gloved hand.\n\n");
        else if (this.temp == 0) this.outputText("She starts grabbing things from around the table, seemingly at random, and adds them to " + itype.longName + ".  To your alarm, there is soon a large cloud of smoke coming off it! There is a strong smell to the smoke and it makes it hard to breathe.  Lumi grabs a mask out of a drawer and puts it on, continuing with her work unperturbed.  She suddenly stops and you wonder if she is done, but she takes off her mask and inhales deeply of the smoke, then keels over!  As you go over to help her she suddenly stands up, waves away some of the smoke, and says, \"<i>All dun!</i>\"\n\n");
        else if (this.temp == 1) this.outputText("Taking hold of one of the bottles that were sitting where she put the tray, she seems to think for a moment before tossing the bottle into one of the corners of the room.  It shatters just behind the table, and a small puff of smoke goes up into the air.  You're a little nervous about that bottle, but before you have a chance to say anything, two more bottles fly off and join it; this time causing a small explosion. You ask her what she is thinking tossing those aside, and she simply responds, \"<i>Dey were in my way.</i>\"\n\n\"<i>What?!  So you just toss things that explode to the side?</i>\"\n\n<i>\"Don worry, I'll put counter agents in dere at de end of de day.  An I never throw stuff da'll do any damage.  Done!</i>\"\n\n");
        else if (this.temp == 2) this.outputText("She adds a few things to the tray before moving down the table.  She adds some reagents to a bubbling chemical reaction, and then adds some more ingredients to that.  You wonder why she just left " + itype.longName + " there to work on something else.  Then Lumi moves back across the table, past where " + itype.longName + " sits, to start adding things to something else.  Before you have a chance to complain, she moves back to " + itype.longName + " and continues.  You decide that it's probably best not to ask about her work ethic and just let her do her thing; she has more experience than you, after all.\n\nPOP! You look over in surprise as the first thing she worked on makes a small explosion.  POW! Now the second experiment has blown up!  You start to move in alarm, wondering if Lumi really knows what she's doing; just before " + itype.longName + " seems to explode with an incredible BOOM.  Lumi stops moving for a moment, looking straight ahead before saying, \"<i>Dat was a gud one, Lumi dun!</i>\"\n\n");
        this.inventory.takeItem(nextItem, this.lumiEnhance, this.lumiLabChoices);
    }
}
