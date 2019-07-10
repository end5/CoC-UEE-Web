import { BaseContent } from "../../../BaseContent";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { kGAMECLASS } from "../../../GlobalFlags/kGAMECLASS";
import { rand } from "../../../Extra";
import { PerkLib } from "../../../PerkLib";

export class IngnamFarm extends BaseContent {

    // Farm
    public menuFarm(): void {
        this.hideMenus();
        this.clearOutput();
        this.outputText(this.images.showImage("location-ingnam-farm"));
        this.outputText("As you make your way up the dirt road to the farm, you immediately see the vast bountiful acres of crops ripe for harvest and dairy cows idly grazing in the fields by a large weather-worn barn. A wooden windmill creaks quietly nearby a quaint two-storey homestead.");
        if (this.flags[kFLAGS.INGNAM_FARMER_MET] <= 0) {
            this.outputText("\n\nYou hear a rustling from the swaying cornfield and instinctively tense up for a fight. To your relief it is the farm's owner who emerges. The farmer is woman of average build and she is modestly garbed in overalls. Wiping away her sweaty blond locks from her flushed face walks up to greet you with a warm smile.");
            this.outputText("\n\n\"<i>I heard rumors that you're going to be the Champion of Ingnam, is that true [name]?.</i>\" the young farmer asks nervously. You affirm somberly, yes, you are the next Champion. Tears start to well up in her eyes as her voice begins to crack with emotion \"<i>I've known you since we were kids, I can't believe I won't be seeing you again [name]... This has to be some mistake.</i>\"");
            this.outputText("\n\nYou embrace her and tell the shaking farmer that it is for the good of the village. Her tears start to roll down her reddened cheeks, you stroke her hair soothing, whispering that everything will be fine.");
            this.outputText("\n\nAfter talking about your upcoming task, the farming girl calms down and offers you some gems, \"<i>You can still work here to get some gems. I'll pay you five gems for each hour you work. This should help you out while on your journey...</i>\"");
            this.flags[kFLAGS.INGNAM_FARMER_MET] = 1;
        }
        this.outputText("\n\nYou could help out the farmer with some work for gems.");
        this.menu();
        this.addButton(0, "Work", this.workAtFarm).hint("Work at the farm for gems.");
        this.addButton(14, "Leave", kGAMECLASS.ingnam.menuIngnam);
    }

    public workAtFarm(): void { // Job at the farm.
        this.clearOutput();
        if (this.player.fatigue + 20 > this.player.maxFatigue()) {
            this.outputText("You are too exhausted to work at the farm!");
            this.doNext(this.menuFarm);
            return;
        }
        const chooser: number = rand(3);
        this.outputText("You let the farmer know that you're here to work for the farm.");
        if (chooser == 0) {
            this.outputText("\n\n\"<i>Great! The stable needs cleaning. I understand it's not for the faint of the heart but I promise you'll be rewarded,</i>\" the farmer says. She guides you to the stables and hands you the shovel for cleaning" + (this.silly() ? " and a clothespin to clip your nose shut" : "") + ".");
            this.outputText("\n\nYou spend half an hour cleaning the muck out of the stable. When you're finished cleaning the muck, the farmer comes back at you and instructs you to change the straw pile. You do as she instructs, sweeping all the old straw piles into one large pile. Finally, you spend the rest of the hour laying a new layer of straw for the horses to lay on.");
            this.outputText("\n\n\"<i>I'll take care of these from there. Thank you for helping me. You've taken some of the load off my burden. Here's your payment,</i>\" she says. She hands you five gems.");
            if (this.player.str100 < 25 && rand(2) == 0) {
                this.outputText("\n\nYou feel a bit stronger from all the hard work you've done.");
                this.dynStats("str", 1);
            }
            if (this.player.tou100 < 25 && rand(2) == 0) {
                this.outputText("\n\nYour efforts have helped to improve your stamina.");
                this.dynStats("tou", 1);
            }
            this.player.changeFatigue(20);
        }
        else if (chooser == 1) {
            this.outputText("\n\n\"<i>Great! I could use a hand harvesting crops,</i>\" she says, \"<i>We need five full baskets of crops.</i>\"");
            this.outputText("\n\nShe escorts you to the field where the crops grow. She hands you the basket so you can collect the crops. \"<i>We'll harvest the crops. You only need to fill five, I'll take care of the rest,</i>\" she says.");
            this.outputText("\n\nYou pick the corn from the plant one by one and put them into basket. This continues until the basket gets full after which you switch to another empty basket. You get back to harvesting and repeat until all the baskets are full. The farmer comes to see that you've filled all the baskets. \"<i>Good work! I'll take care of things from there. Here's your payment,</i>\" she says. She hands you the five gems.");
            if (this.player.str100 < 25 && rand(2) == 0) {
                this.outputText("\n\nYou feel a bit stronger from all the hard work you've done.");
                this.dynStats("str", 1);
            }
            if (this.player.tou100 < 25 && rand(2) == 0) {
                this.outputText("\n\nYour efforts have helped to improve your stamina.");
                this.dynStats("tou", 1);
            }
            this.player.changeFatigue(20);
        }
        else {
            this.outputText("\n\n\"<i>Great! The cows need to be milked. It should be a simple task,</i>\" she says. She escorts you to the cow pen and says, \"<i>Fill as much buckets as you can but make sure all the cows are milked. When you're done, we'll haul the buckets. I have things to attend. Good luck!</i>\"");
            this.outputText("\n\nYou place the bucket under one of the cows' udders. You gently squeeze the udders. Milk squirts from its udders and into the bucket. When the milk flow stops, you move on to the next cow. You repeat the process, cow after cow.");
            this.outputText("\n\nBy the time you've finished milking all the cows, you are left with ten full buckets of milk. The farmer comes back and says, \"<i>Did you milk all these cows?</i>\" You give her a nod and show her the full buckets of milk. \"<i>Thank you. You know what? You've deserved some free milk! Now would be a good time for some break,</i>\" She says happily. She fills a cup with milk and gives it to you. You promptly drink the milk. Wow, this stuff is delicious when it's freshly milked! After a good drink, you strike up some conversation with her.");
            this.player.refillHunger(20);
            this.player.HP += 50;
            this.player.changeFatigue(-10);
            this.outputText("\n\nAfter a few minutes of chatting, the break is over and you help her with hauling the buckets to her farmhouse, four at a time. After three trips, she gives you a final task of filling the milk bottles. You carefully pour the milk through a funnel into the bottle and when you manage to fill it, you move on to the next bottle. You repeat the process until the buckets are empty. \"<i>Good work! You have finished your work! Here's your payment,</i>\" she says as she hands you the five gems you deserve.");
            if (this.player.str100 < 25 && rand(2) == 0) {
                this.outputText("\n\nYou feel a bit stronger from all the hard work you've done.");
                this.dynStats("str", 1);
            }
            if (this.player.tou100 < 25 && rand(2) == 0) {
                this.outputText("\n\nYour efforts have helped to improve your stamina.");
                this.dynStats("tou", 1);
            }
            this.player.changeFatigue(10);
        }
        if (this.player.findPerk(PerkLib.HistorySlacker) >= 0) this.player.changeFatigue(-5);
        this.outputText("\n\nYou walk back to Ingnam.");
        this.player.gems += 5;
        this.statScreenRefresh();
        this.doNext(this.camp.returnToCampUseOneHour);
    }
}
