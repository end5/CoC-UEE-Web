import { BaseContent } from "../../../BaseContent";
import { StatusEffects } from "../../../StatusEffects";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { rand } from "../../../Extra";
import { PregnancyStore } from "../../../PregnancyStore";
import { Scruffy } from "./Scruffy";

// Scruffy the Imp Janitor

export class ScruffyScene extends BaseContent {

    public prisonCaptorScruffyStatusText(): void {
        let scruffyMet: any;
        const happiness: any = this.prisonCaptorScruffyHappiness();
        scruffyMet = this.prisonCaptorScruffyMet();
        scruffyMet < 1;
    }

    public prisonCaptorScruffyOptedOut(): boolean {
        let testVal: any;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScruffy)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScruffy, 0, 0, 0, 0);
        }
        testVal = this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyScruffy);
        if (testVal < 0) {
            return true;
        }
        return false;
    }

    public prisonCaptorScruffyMet(): number {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScruffy)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScruffy, 0, 0, 0, 0);
        }
        return this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyScruffy);
    }

    public prisonCaptorScruffyMetSet(newVal: number): void {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScruffy)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScruffy, 0, 0, 0, 0);
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyScruffy, 1, newVal);
    }

    public prisonCaptorScruffyMetChange(changeVal: number): void {
        let newVal: any;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScruffy)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScruffy, 0, 0, 0, 0);
        }
        newVal = this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyScruffy) + changeVal;
        if (newVal < 0) {
            newVal = 0;
        }
        if (newVal > 100) {
            newVal = 100;
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyScruffy, 1, newVal);
    }

    public prisonCaptorScruffyHappiness(): number {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScruffy)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScruffy, 0, 0, 0, 0);
        }
        return this.player.statusEffectv2(StatusEffects.PrisonCaptorEllyScruffy);
    }

    public prisonCaptorScruffyHappinessSet(newVal: number): void {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScruffy)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScruffy, 0, 0, 0, 0);
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyScruffy, 2, newVal);
    }

    public prisonCaptorScruffyHappinessChange(changeVal: number): void {
        let newVal: any;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScruffy)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScruffy, 0, 0, 0, 0);
        }
        newVal = this.player.statusEffectv2(StatusEffects.PrisonCaptorEllyScruffy) + changeVal;
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyScruffy, 2, newVal);
    }

    public prisonCaptorScruffyEvent(): number {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScruffy)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScruffy, 0, 0, 0, 0);
        }
        return this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyScruffy);
    }

    public prisonCaptorScruffyEventSet(newVal: number): void {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScruffy)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScruffy, 0, 0, 0, 0);
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyScruffy, 3, newVal);
    }

    public prisonCaptorScruffyEventChange(changeVal: number): void {
        let newVal: any;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScruffy)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScruffy, 0, 0, 0, 0);
        }
        newVal = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyScruffy) + changeVal;
        if (newVal < 0) {
            newVal = 0;
        }
        if (newVal > 100) {
            newVal = 100;
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyScruffy, 3, newVal);
    }

    public prisonCaptorScruffyScratch(): number {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScruffy)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScruffy, 0, 0, 0, 0);
        }
        return this.player.statusEffectv4(StatusEffects.PrisonCaptorEllyScruffy);
    }

    public prisonCaptorScruffyScratchSet(newVal: number): void {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScruffy)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScruffy, 0, 0, 0, 0);
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyScruffy, 4, newVal);
    }

    public prisonCaptorScruffyScratchChange(changeVal: number): void {
        let newVal: any;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyScruffy)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyScruffy, 0, 0, 0, 0);
        }
        newVal = this.player.statusEffectv4(StatusEffects.PrisonCaptorEllyScruffy) + changeVal;
        if (newVal < 0) {
            newVal = 0;
        }
        if (newVal > 100) {
            newVal = 100;
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyScruffy, 4, newVal);
    }

    public prisonCaptorRandomEventJizzJanitor(): boolean {
        this.hideMenus();
        this.clearOutput();
        this.outputText(this.images.showImage("monster-scruffy"));
        let newCleanliness: number = 0;
        let refuse: (() => void) | undefined = this.prisonCaptorRandomEventJizzJanitorRefuse;
        let accept: (() => void) | undefined = this.prisonCaptorRandomEventJizzJanitorAccept;
        let reject: (() => void) | undefined = this.prisonCaptorRandomEventJizzJanitorReject;
        let perform: (() => void) | undefined = this.prisonCaptorRandomEventJizzJanitorPerform;
        this.outputText("You look up as the door squeaks open and see a skinny imp enter the room with a mop and a bucket.  He's wearing a janitor's scrub top with a nametag that reads \"Scruffy\" but you doubt it originally belonged to him since it is about five sizes too large and he is very noticeably not wearing the matching scrub pants that should go with it. He flatly ignores you as he begins the unenviable task of cleaning your cell, but after a few minutes of lackadaisical cleaning he turns and seems to notice your presence for the first time. ");
        this.outputText("\n\n\"<i>Well, aren't you a tasty little thing?  The " + this.prison.prisonCaptor.captorTitle + " sure knows how to pick em'.</i>\" he growls, looking you up and down appraisingly. You notice his not insubstantial cock begin to stir and start to get a sinking feeling.\n\n");
        this.outputText("\"<i>Anyway, don't ever let me hear you complainin' about " + this.prison.prisonCaptor.captorPronoun2 + ", 'cause ");
        if (this.flags[kFLAGS.PRISON_DIRT_ENABLED] > 0) {
            this.outputText(this.prison.prisonCaptor.captorPronoun1 + "'s givin' you a break today sending me in to help clean out this pigsty of a cell that you seem to be content to live in.");
            newCleanliness = this.player.statusEffectv2(StatusEffects.PrisonCaptorEllyStatus) - 50;
            if (newCleanliness < 0) {
                newCleanliness = 0;
            }
            this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 2, newCleanliness);
        }
        else {
            this.outputText(this.prison.prisonCaptor.captorPronoun1 + " makes most of the cum-dumpsters in training clean up their own filth. Clearly " + this.prison.prisonCaptor.captorPronoun1 + " thinks you're something special though, sending me in to do your dirty work for you. ");
        }
        this.outputText("Seriously, I'll never understand the way you ungrateful little sluts disrespect " + this.prison.prisonCaptor.captorPronoun2 + ".</i>\" As he finishes the sentence he seems to drift off in a cloud of love and reverence, but he soon comes back down to earth and turns his attention back to you.");
        this.outputText("\n\n\"<i>Speaking of respect and gratitude,</i>\" he says with a lecherous grin,\"<i>");
        if (this.player.hunger < 20) {
            this.outputText("You look absolutely famished ");
        }
        else {
            this.outputText("I know good meals can be few and far between in this place ");
        }
        this.outputText("and I just happen to have some extra food I'd be willing to share with you if you were to show me some, ahem --</i>\" he pauses to lewdly and intricately pantomime giving a blowjob, complete with creating a bulge in one cheek with his tongue, \"<i>respect and gratitude for the great efforts I'm putting into making your cell a little more habitable.</i>\"\n\n");
        this.outputText("You consider how you should respond to Scruffy's offer.\n\n");
        if (this.player.hunger <= 0 && (this.player.esteem < 40 || this.player.esteem < 60 && this.player.obey > 10)) {
            this.outputText("\nYou are simply too hungry to turn the offer down.\n");
            refuse = undefined;
            reject = undefined;
        }
        else {
            this.outputText("You could politely refuse " + this.prison.prisonWillCostDescript(5));
            if (this.player.esteem < 20 || this.player.esteem < 40 && this.player.obey > 25) {
                this.outputText(" but you don't think you could manage any stronger a rebuke to someone trying to show you kindness due to your your obvious powerlessness and insignificance.");
                reject = undefined;
            }
            else {
                this.outputText(" or you could angrily reject the offer " + this.prison.prisonWillCostDescript(15) + ".");
            }
        }
        if (this.player.hunger > 0 && (this.player.esteem > 90 || this.player.esteem > 70 && this.player.obey < 10)) {
            this.outputText("\n\nYou have too much dignity to accept, regardless of the fact that it seems like his intention was to help you, even if it was in his own perverted way.\n");
            accept = undefined;
            perform = undefined;
        }
        else {
            this.outputText("\n\nYou could accept Scruffy's charity, ");
            if (this.player.esteem > 60 || this.player.esteem > 40 && this.player.obey < 25) {
                this.outputText("but you have too much dignity to really put your heart into it.\n");
                perform = undefined;
            }
            else {
                this.outputText("or you could really show your gratitude and perform above and beyond what he's asked for. \n");
            }
        }
        this.menu();
        this.addButton(0, "Refuse", refuse);
        this.addButton(1, "Accept", accept);
        this.addButton(5, "Reject", reject);
        this.addButton(6, "Perform", perform);
        if (this.prisonCaptorScruffyScratch() >= 2) this.addButton(7, "FIGHT!", this.fightScruffy);
        return true;
    }

    public prisonCaptorRandomEventJizzJanitorRefuse(): void {
        this.clearOutput();
        if (this.player.will < this.prison.prisonWillCost(5)) {
            this.outputText("While you'd like to preserve a bit of your dignity and politely turn down the offer, you simply don't have the willpower to resist Scruffy's advances right now. ");
            if (rand(this.player.esteem * 3) > this.player.obey + this.player.lust + this.player.cor) {
                this.prison.changeEsteem(2, this.prison.inPrison);
                this.outputText("\n\n");
                this.prisonCaptorRandomEventJizzJanitorAccept();
            }
            else {
                this.outputText(" In fact, while a second ago you thought you had the desire to resist him, now the thought of debasing yourself for his approval and the sight of his girthy dick are filling you with an overwhelming desire to do the exact opposite and show him just how grateful you are for his kindness.\n\n");
                this.prisonCaptorRandomEventJizzJanitorPerform();
            }
        }
        else {
            this.outputText("You realize that this was probably the closest thing to a friendly gesture you are likely to encounter in this place, so you ");
            if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) == 0) {
                this.outputText("politely but firmly turn down the offer. ");
            }
            else {
                this.outputText("assume a friendly posture and communicate your refusal by shaking your head. ");
            }
            this.outputText(this.images.showImage("prison-scruffy-fuck"));
            this.outputText("\n\nBefore you can even begin to react, you see his face turn to a mask of rage as he hammers you over the head with the bucket he was so recently using to clean up your filth. You momentarily black out, and when you come to you realize that he has bound your hands behind your back and used them to hang you by a chain to an eyelet in the ceiling. Your body is suspended in a fashion such that your back is arched suggestively, your head is hanging at knee height, and your feet are only touching the ground with the tips of your toes. [if (isBiped = true) \"What's more, he has used his mop as a makeshift spreader bar to hold your ankles as far apart as they will go leaving your [vagOrAss] completely exposed between the parted cheeks of your [ass]\"][if (isBiped = false) \"With your [legs] hanging as they are your [vagOrAss] is completely exposed between the cheeks of your [ass]\"].");
            this.outputText("\n\n(Placeholder) Scruffy then fucks your [vagOrAss], makes you lick up the cum pool to 'feed' you, leaves you hogtied with a stern warning to improve your behavior.");
            if (this.player.hasVagina()) {
                this.player.cuntChange(20, true, true, false);
                this.player.knockUp(PregnancyStore.PREGNANCY_IMP, PregnancyStore.INCUBATION_IMP);
            }
            else {
                this.player.buttChange(20, true, true, false);
            }
            this.player.slimeFeed();
            this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 2);
            this.player.changeStatusValue(StatusEffects.PrisonRestraints, 3, 2);
            this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, 0);
            this.player.refillHunger(10);
            this.prison.changeEsteem(5, this.prison.inPrison);
            this.prison.changeObey(-1, this.prison.inPrison);
            this.prison.changeWill(-this.prison.prisonWillCost(5));
            this.prisonCaptorScruffyScratchChange(1);
            this.doNext(this.playerMenu);
        }
    }

    public prisonCaptorRandomEventJizzJanitorAccept(): void {
        this.clearOutput();
        this.outputText("Acknowledging how true it is that a good meal is hard to come by in your current situation, you decide that it wouldn't hurt to (as the imp put it) show a bit of gratitude in exchange for some extra food, especially considering that relative to your other experiences in this place Scruffy's offer was downright good natured. ");
        this.outputText("Your mind made up, you assume a subservient posture and meeky communicate your acceptance ");
        if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) == 0) {
            this.outputText("with a mumbled word. ");
        }
        else {
            this.outputText("by nodding your head. ");
        }
        this.outputText(this.images.showImage("prison-scruffy"));
        this.outputText("\n\n(Placeholder)  Scruffy puts on/switches you to an open mouth gag because he doesn't want you biting but removes other bindings, doesn't find your performance good enough and fucks your [face]. He leaves you telling you to improve your performance, and your body via the item he gives you.");
        this.outputText("\n\n\"<i>Well, at least you show you understand that you are only here to be used by your betters. Put some effort into it next time and maybe I'll give you a little something extra as well. Be sure to eat what I have given you, though -- it'll help make your body more pleasing to old Scruffy the next time I come around.</i>\"");
        this.player.slimeFeed();
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 0);
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 3, 0);
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, 4);
        this.prison.changeEsteem(-5, this.prison.inPrison);
        this.outputText("\n\n");
        this.inventory.takeItem(this.consumables.SUCMILK, this.camp.returnToCampUseOneHour);
    }

    public prisonCaptorRandomEventJizzJanitorReject(): void {
        this.clearOutput();
        if (this.player.will < this.prison.prisonWillCost(15)) {
            this.outputText("While you'd love nothing more than to outright reject the humiliating offer, you simply don't have the willpower to resist Scruffy's advances right now. ");
            if (rand(this.player.esteem * 3) > this.player.obey + this.player.lust + this.player.cor) {
                this.prison.changeEsteem(3, this.prison.inPrison);
                this.outputText("\n\n");
                this.prisonCaptorRandomEventJizzJanitorAccept();
            }
            else {
                this.outputText(" In fact, while a second ago you thought you had the desire to resist him, now the thought of debasing yourself for his approval and the sight of his girthy dick are filling you with an overwhelming desire to do the exact opposite and show him just how grateful you are for his kindness.\n\n");
                this.prisonCaptorRandomEventJizzJanitorPerform();
            }
        }
        else {
            this.outputText("An attempt at kindness or not, the offer is humiliating in a way you aren't willing to accept at the moment. Gathering your courage, ");
            if (this.player.statusEffectv4(StatusEffects.PrisonRestraints) == 0) {
                this.outputText("you unleash a verbal stream of pent up aggression on the scrawny imp janitor, flatly rejecting his deal. ");
            }
            else {
                this.outputText("you assume a defensive posture and scream your rejection of the deal through your gag. ");
            }
            this.outputText("\n\nBefore you can even begin to react, you see his face turn to a mask of rage as he hammers you over the head with the bucket he was so recently using to clean up your filth. You momentarily black out, and when you come to you realize that ");
            if (this.player.statusEffectv2(StatusEffects.PrisonRestraints) != 2) {
                this.outputText("he has hogtied you. ");
            }
            else {
                this.outputText("he has savagely tightened your bindings. ");
            }
            this.outputText(this.images.showImage("prison-scruffy"));
            this.outputText("You also notice that his dick has gone limp and wonder how that bodes for your fortunes. The answer comes quickly enough.\n\n ");
            this.outputText("\"<i>You ungrateful little bitch. Normally I'd teach you a lesson in humility and obedience more directly, but somehow you've managed to kill my mood.</i>\" He punctuates the sentence by delivering a swift kick to your ribs, and then dramatically draws the largest dildo gag you've ever seen from behind his back. \"<i>Well, I suppose this will have to suffice for your reeducation today. Perhaps the next time you see me you'll remember how much better off you would have been with my prick in your mouth instead.</i>\"");
            this.outputText("\n\nAnd with that he forces the monstrous rubber phallus into your mouth, locks the straps behind your head, grabs his mop and bucket and leaves the room in an exaggerated huff. You manage to take some solace in the fact that you stood up for yourself and avoided servicing the little jizz janitor, but you are unsure if the price was worth it.\n");
            this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 2);
            this.player.changeStatusValue(StatusEffects.PrisonRestraints, 3, 2);
            this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, 3);
            this.prison.changeEsteem(10, this.prison.inPrison);
            this.prison.changeObey(-2, this.prison.inPrison);
            this.prison.changeWill(-this.prison.prisonWillCost(15));
            this.prisonCaptorScruffyScratchChange(1);
            this.doNext(this.playerMenu);
        }
    }

    public prisonCaptorRandomEventJizzJanitorPerform(): void {
        this.clearOutput();
        const freeitemslots: number = this.inventory.getMaxSlots() - this.inventory.getOccupiedSlots();
        this.outputText(this.images.showImage("prison-scruffy"));
        this.outputText("(Placeholder) Scruffy puts on/switches you to an open mouth gag because he doesn't want you biting but removes other bindings, you give a super hot BJ including a titfuck if you have tits, and he leaves giving you praise for being a good slave, but tells you to improve your body with the items he gives you.");
        this.outputText("\n\n\"<i>Well, it certainly is nice to see that you've been taking your lessons to heart and know how you are expected to behave. In fact, ");
        if (freeitemslots > 1) {
            this.outputText(" I think that quality of performance deserves extra rewards. Now be a good little cum-dumpster and be sure to eat it all -- it'll help make your body more pleasing to old Scruffy the next time I come around.");
        }
        else {
            this.outputText(" I'd be inclined to give you something extra if you didn't have such a stash of goodies saved up already. Be sure to eat what I have given you you, though -- it'll help make your body more pleasing to old Scruffy the next time I come around.");
        }
        this.outputText("</i>\"");
        this.player.slimeFeed();
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 0);
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 3, 0);
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, 4);
        this.prison.changeEsteem(-7, this.prison.inPrison);
        this.prison.changeObey(1, this.prison.inPrison);
        this.outputText("\n\n");
        this.inventory.takeItem(this.consumables.SUCMILK, this.camp.returnToCampUseOneHour);
        if (freeitemslots > 1) {
            this.outputText("\n\n");
            this.inventory.takeItem(this.consumables.NPNKEGG, this.camp.returnToCampUseOneHour);
        }
        if (freeitemslots > 2) {
            this.outputText("\n\n");
            this.inventory.takeItem(this.consumables.PINKEGG, this.camp.returnToCampUseOneHour);
        }
    }

    public fightScruffy(): void {
        this.clearOutput();
        this.outputText("How dare he keeps coming. If you refuse even in the slightest manner, he would flip out and punish you. Time to teach him a lesson.");
        this.prison.prisonCombatWinEvent = undefined;
        this.startCombat(new Scruffy());
    }

    public prisonCaptorRandomEventJizzJanitorBeatenUp(): void {
        this.clearOutput();
        if (this.monster.HP <= 0) this.outputText("Scruffy collapses from his injuries.");
        else this.outputText("Scruffy collapses from his overwhelming arousal.");
        this.outputText("\n\nYou drag him out the door. Hopefully he won't bother you for a while.");
        this.prison.randomCooldownScruffy += 12 + rand(36);
        this.combat.cleanupAfterCombat();
    }

    public prisonCaptorRandomEventJizzJanitorLoss(): void {
        this.clearOutput();
        if (this.player.HP <= 0) this.outputText("<b>Scruffy has knocked you off your feet.</b>");
        else this.outputText("<b>You are too aroused to continue fighting. You give in.</b>");
        this.outputText(this.images.showImage("prison-scruffy"));
        this.outputText("\n\n\"<i>You ungrateful little bitch. Normally I'd teach you a lesson in humility and obedience more directly, but somehow you've managed to kill my mood.</i>\" He punctuates the sentence by delivering a swift kick to your ribs, and then dramatically draws the largest dildo gag you've ever seen from behind his back. \"<i>Well, I suppose this will have to suffice for your reeducation today. Perhaps the next time you see me you'll remember how much better off you would have been with my prick in your mouth instead.</i>\"");
        this.outputText("\n\nAnd with that he forces the monstrous rubber phallus into your mouth, locks the straps behind your head, grabs his mop and bucket and leaves the room in an exaggerated huff. You manage to take some solace in the fact that you stood up for yourself and avoided servicing the little jizz janitor, but you are unsure if the price was worth it.\n");
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 2);
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 3, 2);
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, 3);
        this.combat.cleanupAfterCombat();
    }
}
