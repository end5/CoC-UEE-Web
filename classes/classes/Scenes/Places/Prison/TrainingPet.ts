import { BaseContent } from "../../../BaseContent";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { StatusEffects } from "../../../StatusEffects";
import { ItemType } from "../../../ItemType";

export class TrainingPet extends BaseContent {

    public prisonCaptorPetStatusText(): void {
        let currentTier: number = 0;
        let currentEvent: number = 0;
        let petScore: number = 0;
        currentTier = this.prisonCaptorPetTier();
        currentEvent = this.prisonCaptorPetEvent();
        petScore = this.prisonCaptorPetScore();
        if (currentTier < 3) {
            return;
        }
        this.outputText("<b>Mistress Elly's Pet Status: </b>");
        switch (currentTier) {
            case 1:
                this.outputText("Curious\n");
                this.outputText("<b>Licked bowl: </b>" + currentEvent + " times\n");
                break;
            case 2:
                this.outputText("Dreaming\n");
                this.outputText("<b>Dream Progress: </b>");
                if (currentEvent == 0) {
                    this.outputText("none/teasing\n");
                }
                else if (currentEvent == 1) {
                    this.outputText("intro seen\n");
                }
                else if (currentEvent == 2) {
                    this.outputText("lazy seen\n");
                }
                else if (currentEvent == 3) {
                    this.outputText("modest seen\n");
                }
                else if (currentEvent == 4) {
                    this.outputText("excited seen\n");
                }
                else if (currentEvent == 5) {
                    this.outputText("had a chance to play\n");
                }
                else {
                    this.outputText("played " + (currentEvent - 5) + " times\n");
                }

                this.outputText("<b>Refused training offer: </b>");
                if (this.flags[kFLAGS.PRISON_TRAINING_REFUSED] > 0) {
                    this.outputText("yes\n");
                }
                else {
                    this.outputText("no\n");
                }
                break;
            case 3:
                this.outputText("In Training\n");
                break;
            case 4:
                this.outputText("Well Trained\n");
                break;
            default:
                this.outputText("Something else!\n");
        }
        this.outputText("<b>Current Pet Score: </b>" + petScore + " \n");
    }

    public prisonCaptorPetOptedOut(): boolean {
        let testVal: any;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyPet)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyPet, 0, 0, 0, 0);
        }
        testVal = this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyPet);
        if (testVal < 0) {
            return true;
        }
        return false;
    }

    public prisonCaptorPetScore(): number {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyPet)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyPet, 0, 0, 0, 0);
        }
        return this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyPet);
    }

    public prisonCaptorPetScoreSet(newVal: number): void {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyPet)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyPet, 0, 0, 0, 0);
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyPet, 1, newVal);
    }

    public prisonCaptorPetScoreChange(changeVal: number): void {
        let newVal: any;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyPet)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyPet, 0, 0, 0, 0);
        }
        newVal = this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyPet) + changeVal;
        if (newVal < 0) {
            newVal = 0;
        }
        if (newVal > 100) {
            newVal = 100;
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyPet, 1, newVal);
    }

    public prisonCaptorPetTier(): number {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyPet)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyPet, 0, 0, 0, 0);
        }
        return this.player.statusEffectv2(StatusEffects.PrisonCaptorEllyPet);
    }

    public prisonCaptorPetTierSet(newVal: number): void {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyPet)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyPet, 0, 0, 0, 0);
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyPet, 2, newVal);
    }

    public prisonCaptorPetTierUpdate(forceUpdate: boolean = false): void {
        let currentTier: number = 0;
        let currentEvent: number = 0;
        let petScore: number = 0;
        currentTier = this.prisonCaptorPetTier();
        currentEvent = this.prisonCaptorPetEvent();
        petScore = this.prisonCaptorPetScore();
        switch (currentTier) {
            case 0:
                this.prisonCaptorPetTierSet(1);
                this.prisonCaptorPetEventSet(0);
                break;
            case 1:
                if (petScore >= 5 && currentEvent > 0 && this.player.hasKeyItem("Mistress Elly's Slave Collar") >= 0 && this.player.esteem < 30 && this.player.cor < 15) {
                    this.prisonCaptorPetTierSet(2);
                    this.prisonCaptorPetEventSet(0);
                }
                break;
            case 2:
                if (forceUpdate) {
                    this.prisonCaptorPetTierSet(3);
                    this.prisonCaptorPetEventSet(0);
                    this.prisonCaptorPetScoreSet(0);
                    this.flags[kFLAGS.PRISON_TRAINING_REFUSED] = 0;
                }
                break;
            case 3:
            case 4:
                break;
            default:
        }
    }

    public prisonCaptorPetEvent(): number {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyPet)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyPet, 0, 0, 0, 0);
        }
        return this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyPet);
    }

    public prisonCaptorPetEventSet(newVal: number): void {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyPet)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyPet, 0, 0, 0, 0);
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyPet, 3, newVal);
    }

    public prisonCaptorPetEventChange(changeVal: number): void {
        let newVal: any;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyPet)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyPet, 0, 0, 0, 0);
        }
        newVal = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyPet) + changeVal;
        if (newVal < 0) {
            newVal = 0;
        }
        if (newVal > 100) {
            newVal = 100;
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyPet, 3, newVal);
    }

    public prisonCaptorPetScratch(): number {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyPet)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyPet, 0, 0, 0, 0);
        }
        return this.player.statusEffectv4(StatusEffects.PrisonCaptorEllyPet);
    }

    public prisonCaptorPetScratchSet(newVal: number): void {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyPet)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyPet, 0, 0, 0, 0);
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyPet, 4, newVal);
    }

    public prisonCaptorPetScratchChange(changeVal: number): void {
        let newVal: any;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyPet)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyPet, 0, 0, 0, 0);
        }
        newVal = this.player.statusEffectv4(StatusEffects.PrisonCaptorEllyPet) + changeVal;
        if (newVal < 0) {
            newVal = 0;
        }
        if (newVal > 100) {
            newVal = 100;
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyPet, 4, newVal);
    }

    public prisonCaptorPetLickCumBowl(branchChoice: string, previousEvent?: any): void {
        let currentScore: number = 0;
        let itemEvent;

        if (branchChoice == "choose") {
            this.clearOutput();
            this.outputText("You look at the bowl full of cum with bits of soggy bread floating in it, and take a moment to decide whether you should eat it normally, or set the bowl on the ground and lick it clean using just your tongue.");
            this.outputText("\n\n");
            this.prison.prisonItemEventCheck = false;
            // prison.trainingPet.prisonCaptorPetScratchSet(previousEvent);
            this.menu();
            this.addButton(0, "Lick", this.prisonCaptorPetLickCumBowl, "lick");
            this.addButton(1, "Eat", this.prison.prisonItemBread, true, false);
            return;
        }
        if (branchChoice == "afterlick") {
            this.outputText("(Placeholder) Afterward, you find yourself overcome with an odd sensation of tranquility. ");
            this.prisonCaptorPetScratchSet(0);
            this.doNext(this.inventory.inventoryMenu);
            this.player.refillHunger(20);
            return;
        }
        this.outputText("(Placeholder) You place the bowl on the floor, get down on all fours, and lick the bowl clean using only your tongue. \n\n");
        this.prison.prisonItemBreadHeatEffect(15);
        if (this.prisonCaptorPetTier() == 1) {
            this.prisonCaptorPetEventChange(1);
        }
        currentScore = this.prisonCaptorPetScore();
        if (currentScore < 10) {
            this.prisonCaptorPetScoreChange(1);
        }
        else if (currentScore < 20) {
            this.prisonCaptorPetScoreChange(0.5);
        }
        this.prisonCaptorPetTierUpdate();
        // itemEvent = prisonCaptorPetScratch();
        this.prisonCaptorPetScratchSet(-1);
        this.prisonCaptorPetLickCumBowl("afterlick");
        this.doNext(this.playerMenu);
    }

    public prisonCaptorPetDreamStart(branchChoice: string = "choose"): boolean {
        // var _loc8_: any = undefined;
        const currentTier: any = this.prisonCaptorPetTier();
        const currentEvent: any = this.prisonCaptorPetEvent();
        const petScore: any = this.prisonCaptorPetScore();
        const demandFlagged: any = this.flags[kFLAGS.PRISON_TRAINING_REFUSED];
        return false;
    }

    public prisonCaptorPetDreamTeaser(branchChoice: string = "choose"): void {
        this.outputText("(Placeholder) (Teaser dream) Convince player to lose their corruption/esteem so that they can do pet content.\n\n");
        this.doNext(this.playerMenu);
    }

    public prisonCaptorPetDreamIntro(branchChoice: string = "choose"): void {
        let currentTier: any;
        let corChange: any;
        currentTier = this.prisonCaptorPetTier();
        if (branchChoice == "choose") {
            if (currentTier == 2) {
                this.prisonCaptorPetEventSet(1);
            }
            this.prisonCaptorPetScoreSet(5);
            this.outputText("\n\n");
            this.outputText("(Placeholder) (Intro dream) PC imagines lying in grass on a cloudy day, his arms under his cheek and his legs curled up. [He]'s naked save a collar, but it feels strangely comfortable. A woman's voice greets him, but as [he] looks up the sun blurs [his] vision a moment before she pushes his head back down, ruffling his hair with a giggle. PC feels a sudden warmth, and wakes up flushed.\n\n");
            this.outputText("How do you feel about that?  (Probably should telegraph that 'outraged' is an optout.)\n\n");
            this.outputText("\n\n");
            this.menu();
            this.addButton(0, "Good", this.prisonCaptorPetDreamIntro, 1);
            this.addButton(1, "Unsure...", this.prisonCaptorPetDreamIntro, 2);
            this.addButton(2, "Outraged", this.prisonCaptorPetDreamIntro, 3);
            return;
        }
        if (branchChoice == "1") {
            this.clearOutput();
            this.outputText("(Placeholder) (Intro dream) PC decides he liked it, giving his petScore an initial bump to make the randomized dreams more frequent.\n\n");
            this.prisonCaptorPetScoreChange(3);
            this.prison.changeEsteem(-1, this.prison.inPrison);
            this.prison.changeWill(10);
            corChange = -1;
            this.dynStats("cor", corChange);
        }
        else if (branchChoice == "2") {
            this.clearOutput();
            this.outputText("(Placeholder) (Intro dream) PC is unsure and decides to figure it out later. Event proceeds as normal, but the dreams will be less frequent and he'll have to indulge a few extra to reach the next Tier.\n\n");
        }
        else if (branchChoice == "3") {
            this.clearOutput();
            this.outputText("(Placeholder) (Intro dream) Text indicating that the PC resolves to never enjoy being treated like a dog and will probably never such dreams again.\n\n");
            this.prisonCaptorPetScoreSet(-1);
        }

        this.doNext(this.playerMenu);
    }

    public prisonCaptorPetDreamLazy(branchChoice: string = "choose"): void {
        const currentTier: number = this.prisonCaptorPetTier();
        const currentEvent: number = this.prisonCaptorPetEvent();
        let previousDreamValue: number = 0;
        let dreamValue: number = 0;
        let dreamSelect: number = 0;
        let corChange: number = 0;
        const petScore: number = this.prisonCaptorPetScore();
        previousDreamValue = this.prisonCaptorPetScratch();
        const demandFlagged: number = this.flags[kFLAGS.PRISON_TRAINING_REFUSED];
        if (branchChoice == "choose") {
            if (currentTier == 2 && currentEvent < 2) {
                this.prisonCaptorPetEventSet(2);
            }
            this.outputText("\n\n");
            this.outputText("(Placeholder) (Lazy dream) PC imagines something similar to the intro dream, as well as other passive facets of being a pet. There would probably be a few variations, but they would mostly be short snippets of him being coddled or resting or played with.\n\n");
            dreamValue = 0;
            dreamSelect = 0;
            do {
                dreamSelect = TrainingPet.rand(3);
                dreamValue = 10 + dreamSelect;
            }
            while (previousDreamValue == dreamValue);

            this.prisonCaptorPetScratchSet(dreamValue);
            switch (dreamSelect) {
                case 0:
                    this.outputText("(Placeholder) (Lazy dream) Variation 0. \n\n");
                    break;
                case 1:
                    this.outputText("(Placeholder) (Lazy dream) Variation 1. \n\n");
                    break;
                case 2:
                    this.outputText("(Placeholder) (Lazy dream) Variation 2. \n\n");
                    break;
                default:
                    this.outputText("You shouldn't see this text.");
            }
            this.outputText("How do you react to this unexpected reverie?\n\n");
            this.outputText("\n\n");
            this.menu();
            this.addButton(0, "Enjoy It", this.prisonCaptorPetDreamLazy, 1);
            this.addButton(1, "Wake Up", this.prisonCaptorPetDreamLazy, 2);
            return;
        }
        if (branchChoice == "1") {
            this.clearOutput();
            this.outputText("(Placeholder) (Lazy dream) PC decides to see the dream through, getting a cute conclusion and increasing his petScore.\n\n");
            this.prisonCaptorPetScoreChange(1);
            this.prison.changeEsteem(-1, this.prison.inPrison);
            this.prison.changeWill(10);
            corChange = -0.25;
            this.dynStats("cor", corChange);
        }
        else if (branchChoice == "2") {
            this.clearOutput();
            this.outputText("(Placeholder) (Lazy dream) PC decides to stop the dream for whatever reason, reducing his petScore.\n\n");
            this.prisonCaptorPetScoreChange(-1);
        }

        this.doNext(this.playerMenu);
    }

    public prisonCaptorPetDreamModest(branchChoice: string = "choose"): void {
        let currentTier: any;
        let currentEvent: any;
        let previousDreamValue: any;
        let dreamValue: any;
        let dreamSelect: any;
        let corChange: any;
        currentTier = this.prisonCaptorPetTier();
        currentEvent = this.prisonCaptorPetEvent();
        const petScore: any = this.prisonCaptorPetScore();
        previousDreamValue = this.prisonCaptorPetScratch();
        const demandFlagged: any = this.flags[kFLAGS.PRISON_TRAINING_REFUSED];
        if (branchChoice == "choose") {
            if (currentTier == 2 && currentEvent < 3) {
                this.prisonCaptorPetEventSet(3);
            }
            this.outputText("\n\n");
            this.outputText("(Placeholder) (Modest dream) PC has dreams involving behavior more associated with being a dog rather than just being comforted. Could be training for simple tricks, being fed or walked, etc. Now the PC has some agency in the dream, and can either play along or wake up\n\n");
            dreamValue = 0;
            dreamSelect = 0;
            do {
                dreamSelect = TrainingPet.rand(3);
                dreamValue = 20 + dreamSelect;
            }
            while (previousDreamValue == dreamValue);

            this.prisonCaptorPetScratchSet(dreamValue);
            switch (dreamSelect) {
                case 0:
                    this.outputText("(Placeholder) (Modest dream) Variation 0. \n\n");
                    break;
                case 1:
                    this.outputText("(Placeholder) (Modest dream) Variation 1. \n\n");
                    break;
                case 2:
                    this.outputText("(Placeholder) (Modest dream) Variation 2. \n\n");
                    break;
                default:
                    this.outputText("You shouldn't see this text.");
            }
            this.outputText("How do you react to this unexpected reverie?\n\n");
            this.outputText("\n\n");
            this.outputText("\n\n");
            this.outputText("\n\n");
            this.menu();
            this.addButton(0, "Play Along", this.prisonCaptorPetDreamModest, 1);
            this.addButton(1, "Wake Up", this.prisonCaptorPetDreamModest, 2);
            return;
        }
        if (branchChoice == "1") {
            this.clearOutput();
            this.outputText("(Placeholder) (Modest dream) PC decides to progress the dream, seeing the cute conclusion and increasing his petScore.\n\n");
            this.prisonCaptorPetScoreChange(1);
            this.prison.changeEsteem(-1, this.prison.inPrison);
            this.prison.changeWill(10);
            corChange = -0.25;
            this.dynStats("cor", corChange);
        }
        else if (branchChoice == "2") {
            this.clearOutput();
            this.outputText("(Placeholder) (Modest dream) PC decides to stop the dream for whatever reason, reducing his petScore.\n\n");
            this.prisonCaptorPetScoreChange(-1);
        }

        this.doNext(this.playerMenu);
    }

    public prisonCaptorPetDreamExcited(branchChoice: string = "choose"): void {
        let currentTier: any;
        let currentEvent: any;
        let petScore: any;
        let previousDreamValue: any;
        let dreamValue: any;
        let dreamSelect: any;
        let corChange: any;
        currentTier = this.prisonCaptorPetTier();
        currentEvent = this.prisonCaptorPetEvent();
        petScore = this.prisonCaptorPetScore();
        previousDreamValue = this.prisonCaptorPetScratch();
        const demandFlagged: number = this.flags[kFLAGS.PRISON_TRAINING_REFUSED];
        if (branchChoice == "choose") {
            if (currentTier == 2 && currentEvent < 4) {
                this.prisonCaptorPetEventSet(4);
            }
            this.outputText("\n\n");
            this.outputText("(Placeholder) (Excited dream) PC has dreams where he is very lucid, perhaps revisiting scenarios from the Lazy/Modest variants or having some new ones. At some point, the PC will feel an instinct to bark. He can either indulge it or stop himself and wake up.\n\n");
            dreamValue = 0;
            dreamSelect = 0;
            do {
                dreamSelect = TrainingPet.rand(3);
                dreamValue = 20 + dreamSelect;
            }
            while (previousDreamValue == dreamValue);

            this.prisonCaptorPetScratchSet(dreamValue);
            switch (dreamSelect) {
                case 0:
                    this.outputText("(Placeholder) (Excited dream) Variation 0. \n\n");
                    break;
                case 1:
                    this.outputText("(Placeholder) (Excited dream) Variation 1. \n\n");
                    break;
                case 2:
                    this.outputText("(Placeholder) (Excited dream) Variation 2. \n\n");
                    break;
                default:
                    this.outputText("You shouldn't see this text.");
            }
            this.outputText("How do you react to this unexpected reverie?\n\n");
            this.outputText("\n\n");
            this.outputText("\n\n");
            this.outputText("\n\n");
            this.menu();
            this.addButton(0, "Woof!", this.prisonCaptorPetDreamExcited, 1);
            this.addButton(1, "Enough!", this.prisonCaptorPetDreamExcited, 2);
            return;
        }
        if (branchChoice == "1") {
            this.clearOutput();
            this.outputText("(Placeholder) (Excited dream) PC barks, having fun with his indulgence, seeing the cute conclusion and increasing his petScore.\n\n");
            this.prisonCaptorPetScoreChange(1);
            this.prison.changeEsteem(-1, this.prison.inPrison);
            this.prison.changeWill(10);
            corChange = -0.25;
            this.dynStats("cor", corChange);
            if (petScore >= 20) {
                this.outputText("(Placeholder) (Excited dream) Smooth transition to play offer event. \"...suddenly you feel your belly being rubbed.\"\n\n");
                this.menu();
                this.addButton(0, "Enjoy it!", this.prisonCaptorPetPlayOffer);
                return;
            }
            this.outputText("(Placeholder) (Excited dream) If you need to have a smooth ending instead of transitioning to play offer, it goes here.\n\n");
        }
        else if (branchChoice == "2") {
            this.clearOutput();
            this.outputText("(Placeholder) (Excited dream) PC decides to stop the dream for whatever reason, reducing his petScore by 2).\n\n");
            this.prisonCaptorPetScoreChange(-2);
        }

        this.doNext(this.playerMenu);
    }

    public prisonCaptorPetPlayOffer(branchChoice: string = "choose"): void {
        let currentTier: any;
        let currentEvent: any;
        let petScore: any;
        let corChange: any;
        currentTier = this.prisonCaptorPetTier();
        currentEvent = this.prisonCaptorPetEvent();
        petScore = this.prisonCaptorPetScore();
        const previousDreamValue: any = this.prisonCaptorPetScratch();
        const demandFlagged: number = this.flags[kFLAGS.PRISON_TRAINING_REFUSED];
        corChange = 0;
        if (this.prisonCaptorPetEvent() < 5 && currentTier == 2) {
            this.prisonCaptorPetEventSet(5);
        }
        if (branchChoice == "choose") {
            this.clearOutput();
            this.outputText("(Placeholder) (Play offer) PC is thoroughly enjoying his little dream, his owner doing something above/away from him while he feels his belly being rubbed. Rolling over to enjoy it, it faintly occurs to him that the sensation is coming from...nowhere? His reverie slowly fades away and his eyes flutter open to see Mistress Elly rubbing his belly while he yaps and paddles his limbs playfully in the air. Assuming he survives the heart attack...\n\n");
            this.outputText("\"<i>Having fun, [boy]?</i>\"...and your cheeks turn bright enough to light the solar system.\n\n");
            this.outputText("Before PC has time to freak out too much, Elly simply offers to play with him. Maybe pulls out a leash to really get the point across for the intro scene.\n\n");
            this.outputText("How do you react to this offer?\n\n");
            this.outputText("\n\n");
            this.menu();
            this.addButton(0, "Eagerly", this.prisonCaptorPetPlayOffer, 1);
            this.addButton(1, "Shyly", this.prisonCaptorPetPlayOffer, 2);
            this.addButton(2, "Decline", this.prisonCaptorPetPlayOffer, 3);
            if (currentTier == 2) {
                this.addButton(3, "Never!", this.prisonCaptorPetPlayOffer, 4);
            }
            return;
        }
        if (branchChoice == "1") {
            this.clearOutput();
            this.outputText("(Placeholder) (Play offer) PC dives right in and does the equivalent of a \"Perform\" for Elly.\n\n");
            this.prisonCaptorPetScoreChange(3);
            if (currentTier == 2) {
                this.prisonCaptorPetEventChange(1);
            }
            this.prison.changeEsteem(-1, this.prison.inPrison);
            this.prison.changeWill(10);
            corChange = -0.25;
            this.dynStats("cor", corChange);
            if (petScore >= 30 && currentTier == 2 && currentEvent >= 7) {
                this.outputText("(Placeholder) (Play offer) Smooth transition to training offer event. \"As you begin to tire out, Mistress Elly gives you a calculating glance.\"\n\n");
                this.menu();
                this.addButton(0, "Woof?", this.prisonCaptorPetTrainingOffer);
                return;
            }
            this.outputText("(Placeholder) (Play offer) If you need to have a smooth ending instead of transitioning to training offer, it goes here.\n\n");
        }
        else if (branchChoice == "2") {
            this.clearOutput();
            this.outputText("(Placeholder) (Play offer) PC decides to give it a try for reasons left ambiguous. The text would probably hint that he is either legitimately shy but interested or simply too startled to mount a refusal.\n\n");
            this.prisonCaptorPetScoreChange(2);
            if (currentTier == 2) {
                this.prisonCaptorPetEventChange(1);
            }
            corChange = -0.25;
            this.dynStats("cor", corChange);
            if (petScore >= 30 && currentTier == 2 && currentEvent >= 7) {
                this.outputText("(Placeholder) (Play offer) Smooth transition to training offer event. \"As you begin to tire out, Mistress Elly gives you a calculating glance.\"\n\n");
                this.menu();
                this.addButton(0, "Woof?", this.prisonCaptorPetTrainingOffer);
                return;
            }
            this.outputText("(Placeholder) (Play offer) If you need to have a smooth ending instead of transitioning to training offer, it goes here.\n\n");
        }
        else {
            if (branchChoice == "3") {
                this.clearOutput();
                this.outputText("(Placeholder) (Play offer) PC politely declines. Elly coaxes him by offering a treat.\n\n");
                this.outputText("\n\n");
                this.outputText("\n\n");
                this.outputText("\n\n");
                this.menu();
                this.addButton(0, "Alright...", this.prisonCaptorPetPlayOffer, 5);
                if (currentTier == 2) {
                    this.addButton(1, "No!", this.prisonCaptorPetPlayOffer, 6);
                }
                return;
            }
            if (branchChoice == "4") {
                this.clearOutput();
                this.outputText("(Placeholder) (Play offer) PC does the equivalent of a \"Reject\", Elly gets mad and decides to remind him what he is if he's not willing to be her pet. Box/Stockades/Etc.\n\n");
                this.prisonCaptorPetScoreSet(-1);
                this.prison.prisonPunishment(0);
                return;
            }
            if (branchChoice == "5") {
                this.clearOutput();
                this.outputText("(Placeholder) (Play offer) Transitions into \"Shyly\", which should give a treat anyway but I suppose would be made to if necessary.\n\n");
                this.prisonCaptorPetScoreChange(1);
                if (currentTier == 2) {
                    this.prisonCaptorPetEventChange(1);
                }
                corChange = -0.25;
                this.dynStats("cor", corChange);
                if (petScore >= 30 && currentTier == 2 && currentEvent >= 7) {
                    this.outputText("(Placeholder) (Play offer) Smooth transition to training offer event. \"As you begin to tire out, Mistress Elly gives you a calculating glance.\"\n\n");
                    this.menu();
                    this.addButton(0, "Woof?", this.prisonCaptorPetTrainingOffer);
                    return;
                }
                this.outputText("(Placeholder) (Play offer) If you need to have a smooth ending instead of transitioning to training offer, it goes here.\n\n");
            }
            else if (branchChoice == "6") {
                this.clearOutput();
                this.outputText("(Placeholder) (Play offer) Elly makes fun of the PC and teases him for being reluctant, but does not force the issue. Might make a chance for \"punish\" reluctant puppies if I can think of any compelling scenes that would fit this tier.\n\n");
                this.prisonCaptorPetScoreSet(20);
                corChange = -0.25;
                this.dynStats("cor", corChange);
            }

        }

        this.doNext(this.playerMenu);
    }

    public prisonCaptorPetTrainingOffer(branchChoice: string = "choose"): void {
        let currentTier: any;
        let corChange: any;
        currentTier = this.prisonCaptorPetTier();
        const currentEvent: any = this.prisonCaptorPetEvent();
        const petScore: any = this.prisonCaptorPetScore();
        const previousDreamValue: any = this.prisonCaptorPetScratch();
        const demandFlagged: number = this.flags[kFLAGS.PRISON_TRAINING_REFUSED];
        corChange = 0;
        if (branchChoice == "choose") {
            this.outputText("\n\n");
            this.outputText("(Placeholder) (Training offer) Elly tells the PC they could have much more fun if he were more proficient and says she should start \"training\" him to be a proper puppy.\n\n");
            this.outputText("How do you react to this offer?\n\n");
            this.outputText("\n\n");
            this.menu();
            this.addButton(0, "Accept", this.prisonCaptorPetTrainingOffer, 1);
            this.addButton(1, "Decline", this.prisonCaptorPetTrainingOffer, 2);
            return;
        }
        if (branchChoice == "1") {
            this.clearOutput();
            this.outputText("(Placeholder) (Training offer) PC accepts her offer to be trained; she's very happy and gives the player a treat.\n\n");
            this.prisonCaptorPetTierUpdate(true);
            this.prisonCaptorPetScoreChange(15);
            this.prison.changeEsteem(-1, this.prison.inPrison);
            this.prison.changeWill(10);
            this.player.refillHunger(40);
            corChange = -0.25;
            this.dynStats("cor", corChange);
            this.menu();
            this.addButton(0, "Continue...", this.prisonCaptorPetTrainingAcceptedIntro, 0);
            return;
        }
        if (branchChoice == "2") {
            this.clearOutput();
            this.outputText("(Placeholder) (Training offer) PC politely declines. Implies he's not comfortable with being \"trained\" even if he enjoys this a bit. Elly eggs him on.\n\n");
            this.outputText("\n\n");
            this.menu();
            this.addButton(0, "Alright...", this.prisonCaptorPetTrainingOffer, 3);
            this.addButton(1, "No!", this.prisonCaptorPetTrainingOffer, 4);
            return;
        }
        if (branchChoice == "3") {
            this.clearOutput();
            this.outputText("(Placeholder) (Training offer) Transitions into a shy version of \"Accept\" scene.\n\n");
            this.prisonCaptorPetTierUpdate(true);
            this.prisonCaptorPetScoreChange(10);
            corChange = -0.25;
            this.dynStats("cor", corChange);
            this.menu();
            this.addButton(0, "Continue...", this.prisonCaptorPetTrainingAcceptedIntro, 1);
            return;
        }
        if (branchChoice == "4") {
            this.clearOutput();
            this.outputText("(Placeholder) (Training offer) PC refuses training more forcefully. Elly warns him that she's not going to play with him if he can't be a good boy.\n\n");
            this.prisonCaptorPetScoreSet(30);
            if (currentTier == 2) {
                this.prisonCaptorPetEventSet(5);
            }
            this.flags[kFLAGS.PRISON_TRAINING_REFUSED] = 1;
            corChange = -0.25;
            this.dynStats("cor", corChange);
        }
        this.doNext(this.playerMenu);
    }

    public prisonCaptorPetTrainingDemand(branchChoice: string = "choose"): void {
        let corChange: any;
        const currentTier: any = this.prisonCaptorPetTier();
        const currentEvent: any = this.prisonCaptorPetEvent();
        const petScore: any = this.prisonCaptorPetScore();
        const previousDreamValue: any = this.prisonCaptorPetScratch();
        const demandFlagged: number = this.flags[kFLAGS.PRISON_TRAINING_REFUSED];
        corChange = 0;
        if (branchChoice == "choose") {
            this.outputText("\n\n");
            this.outputText("(Placeholder) (Training Demand!) Elly informs the PC that since he clearly wants to be her puppy, but is too shy / rambunctious to accept being trained, she's no longer giving him the choice. Probably apologizes for giving him the choice to begin with and comforts that she won't put that burden on him ever again. Probably brings a leash, too...\n\n");
            this.outputText("How do you react?\n\n");
            this.outputText("\n\n");
            this.menu();
            this.addButton(0, "Submit", this.prisonCaptorPetTrainingDemand, 1);
            this.addButton(1, "Refuse", this.prisonCaptorPetTrainingDemand, 2);
            return;
        }
        if (branchChoice == "1") {
            this.clearOutput();
            this.outputText("(Placeholder) (Training Demand!) PC displays his submission; she's very happy and puts a leash on him.\n\n");
            this.prisonCaptorPetTierUpdate(true);
            this.prisonCaptorPetScoreChange(10);
            this.prison.changeEsteem(-1, this.prison.inPrison);
            this.prison.changeWill(10);
            corChange = -0.25;
            this.dynStats("cor", corChange);
            this.menu();
            this.addButton(0, "Continue...", this.prisonCaptorPetTrainingAcceptedIntro, 1);
            return;
        }
        if (branchChoice == "2") {
            this.clearOutput();
            this.outputText("(Placeholder) (Training Demand!) PC politely declines. Elly informs him that she is not asking and tells him to stay still so she can leash him.\n\n");
            this.outputText("How do you react?\n\n");
            this.outputText("\n\n");
            this.menu();
            this.addButton(0, "Let her", this.prisonCaptorPetTrainingDemand, 3);
            this.addButton(1, "Resist", this.prisonCaptorPetTrainingDemand, 4);
            return;
        }
        if (branchChoice == "3") {
            this.clearOutput();
            this.outputText("(Placeholder) (Training Demand!) Transitions into a shy version of \"Submit\" scene.\n\n");
            this.prisonCaptorPetTierUpdate(true);
            this.prisonCaptorPetScoreChange(7);
            corChange = -0.25;
            this.dynStats("cor", corChange);
            this.menu();
            this.addButton(0, "Continue...", this.prisonCaptorPetTrainingAcceptedIntro, 2);
            return;
        }
        if (branchChoice == "4") {
            this.clearOutput();
            this.outputText("(Placeholder) (Training Demand!) PC backs away. Elly forcefully warns him that he is going to learn his lessons and his only choice is whether he wants it to be hard or easy.\n\n");
            this.outputText("How do you react?\n\n");
            this.outputText("\n\n");
            this.menu();
            this.addButton(0, "Easy...", this.prisonCaptorPetTrainingDemand, 5);
            this.addButton(1, "Never!", this.prisonCaptorPetTrainingCrateIntro);
            return;
        }
        if (branchChoice == "5") {
            this.clearOutput();
            this.outputText("(Placeholder) (Training Demand!) Transitions into a shy version of \"Submit\" with additional text of Elly apologizing for having to be so forceful but being proud of him for recognizing his place.\n\n");
            this.prisonCaptorPetTierUpdate(true);
            this.prisonCaptorPetScoreChange(5);
            corChange = -0.25;
            this.dynStats("cor", corChange);
            this.menu();
            this.addButton(0, "Continue...", this.prisonCaptorPetTrainingAcceptedIntro, 2);
            return;
        }
        this.doNext(this.playerMenu);
    }

    public prisonCaptorPetTrainingCrateIntro(branchChoice: string = "choose"): void {
        let currentTier: any;
        currentTier = this.prisonCaptorPetTier();
        const currentEvent: any = this.prisonCaptorPetEvent();
        const petScore: any = this.prisonCaptorPetScore();
        const previousDreamValue: any = this.prisonCaptorPetScratch();
        this.clearOutput();
        if (branchChoice == "choose") {
            this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 4, 0);
            this.prison.changeEsteem(20, this.prison.inPrison);
        }
        else {
            this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 4, 1);
        }
        this.outputText("(Placeholder) (Training Crate Intro) PC opts-out -- oops too late. Elly laments that she needs to begin with such a harsh lesson, but tells the PC [he] needs to learn to behave if they're ever going to get anywhere.\n\n");
        this.outputText("(Placeholder) (Training Crate Intro) Mistress Elly snaps her fingers, and within moments the door opens and two imps enter the room hauling a sizeable rectangular cage between them -- apparently she was well prepared for your resistance. Once the imps have set it up in the corner of your cell and departed, she hauls you roughly by your collar towards the open door on the cage's broad side. It appears as though it was designed to house a large dog, being roughly twice as long as it is wide and tall, and as she ushers you inside with a stern spank on your [ass] you find that there is only barely enough room for you to turn about, and space enough for you to rise to your hands and knees, but no higher. Thankfully the cage is furnished with a large, soft pad, allowing you to rest comfortably within. It is also equipped with a water dish and a food bowl, although the latter is notably empty.\n\n");
        this.outputText("(Placeholder) (Training Crate Intro) Once you are locked inside, Mistress Elly explains that you will remain inside your crate until you are willing to accept what you are and show your submission by putting on your leash, picking it up in your mouth, and begging for your Mistress to train you as she <i>so kindly</i> offered to do before you rudely refused her help.\n\n");
        if (currentTier == 2) {
            this.prisonCaptorPetTierUpdate(true);
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 3, 0);
        if (this.player.hasKeyItem("Training Crate - Installed In Prison Cell") < 0) {
            this.player.createKeyItem("Training Crate - Installed In Prison Cell", 0, 0, 0, 0);
        }
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 1, 2);
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 0);
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 3, 0);
        this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, 0);
        this.flags[kFLAGS.PRISON_PUNISHMENT] = 4;
        this.doNext(this.playerMenu);
    }

    public prisonCaptorPetTrainingCrateBehave(branchChoice: string = "choose"): void {
        let behaviorCounter: number = 0;
        behaviorCounter = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) + 1;
        if (this.player.fatigue > this.player.maxFatigue() - 20) {
            this.outputText("(Placeholder) (Training Crate Behave) You pass an hour trying to behave but are too cramped and fatigued to get comfortable, and end up wallowing and whining instead.\n\n");
            this.player.damageHunger(5);
        }
        else if (this.player.hunger < 20) {
            this.outputText("(Placeholder) (Training Crate Behave) You pass an hour trying to behave but are too hungry to settle down, and end up wallowing and whining instead.\n\n");
            this.player.changeFatigue(7);
        }
        else if (this.player.lust > 90) {
            this.outputText("(Placeholder) (Training Crate Behave) You pass an hour trying to behave but are too horny to settle down, and end up wallowing and whining instead.\n\n");
            this.player.changeFatigue(7);
        }
        else {
            this.outputText("(Placeholder) (Training Crate Behave) You pass an hour on your best behavior, sitting quietly on your bed and occasionally lapping water from your bowl.\n\n");
            this.prison.changeEsteem(-1);
            behaviorCounter++;
        }

        this.player.changeFatigue(7);
        this.outputText("(Placeholder) new behavior value is " + behaviorCounter + "\n\n");
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 3, behaviorCounter);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public prisonCaptorPetTrainingCrateMisbehave(branchChoice: string = "choose"): void {
        let behaviorCounter: any;
        this.outputText("(Placeholder) (Training Crate Misbehave) Tired, hungry, horny and upset, you thrash about in your cage alternating between screaming angrily and crying for help.\n\n");
        if (this.player.will < 10) {
            this.outputText("(Placeholder) (Training Crate Misbehave) Being low on willpower, your tantrum is especially pathetic.");
            this.player.changeFatigue(20);
            this.prison.changeEsteem(1);
        }
        else {
            this.player.changeFatigue(15);
            this.prison.changeEsteem(2);
        }
        this.prison.changeWill(-10);
        behaviorCounter = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) - 2;
        this.outputText("(Placeholder) new behavior value is " + behaviorCounter + "\n\n");
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 3, behaviorCounter);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public prisonCaptorPetTrainingCrateMasturbate(branchChoice: string = "choose"): void {
        let behaviorCounter: number;
        this.outputText("(Placeholder) (Training Crate Masturbate) Overwhelmed with desire, you sheepishly masturbate, staining your bedding with your fluids.\n\n");
        this.player.orgasm('Generic');
        behaviorCounter = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) - 2;
        this.outputText("(Placeholder) new behavior value is " + behaviorCounter + "\n\n");
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 3, behaviorCounter);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public prisonCaptorPetTrainingCrateCallOut(branchChoice: string = "choose"): void {
        let corChange: any;
        let lustChange: any;
        let behaviorCounter: any;
        corChange = 0;
        lustChange = 0;
        behaviorCounter = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus);
        if (branchChoice == "choose") {
            this.outputText("(Placeholder) (Training Crate Callout) Politely as you can, you call out for  Mistress Elly. She comes to see you, makes some comments about your current state of esteem, lust, hunger, and fatigue, as well as your recent behavior. She then asks \"<i>What's wrong [boy]?</i>\"\n\n");
            this.outputText("How do you respond?\n\n");
            this.outputText("\n\n");
            this.outputText("\n\n");
            this.outputText("\n\n");
            this.menu();
            if (this.player.lust < this.player.maxLust()) {
                this.addButton(0, "Food", this.prisonCaptorPetTrainingCrateCallOut, 1);
                this.addButton(1, "Release", this.prisonCaptorPetTrainingCrateCallOut, 2);
            }
            if (this.player.lust >= 70) {
                this.addButton(2, "\"Release\"", this.prisonCaptorPetTrainingCrateCallOut, 5);
            }
            if (this.player.esteem < 3) {
                this.addButton(3, "Submit", this.prisonCaptorPetTrainingCrateLeash, 0);
            }
            if (this.player.lust < this.player.maxLust()) {
                this.addButton(4, "Nothing", this.prisonCaptorPetTrainingCrateCallOut, 6);
            }
            return;
        }
        if (branchChoice == "1") {
            this.clearOutput();
            this.outputText("(Placeholder) (Training Crate Callout) You indicate that you are hungry. Depending on your recent behavior and your hunger level, she might feed you.\n\n");
            if (this.player.hunger > 60) {
                this.outputText("(Placeholder) (Training Crate Callout) She chides you for begging for food when you aren't really hungry.\n\n");
            }
            else if (this.player.hunger > 40 && behaviorCounter < 0) {
                this.outputText("(Placeholder) (Training Crate Callout) She says that perhaps a little hunger will inspire you to behave better.\n\n");
            }
            else {
                this.outputText("(Placeholder) (Training Crate Callout) She feeds you, but probably with variations based on recent behavior.\n\n");
                behaviorCounter = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) + 1;
                this.outputText("(Placeholder) new behavior value is " + behaviorCounter + "\n\n");
                this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 3, behaviorCounter);
                this.prison.changeEsteem(-1, this.prison.inPrison);
                this.player.refillHunger(50);
            }

            corChange = -0.25;
            this.dynStats("cor", corChange);
        }
        else {
            if (branchChoice == "2") {
                this.clearOutput();
                this.outputText("(Placeholder) (Training Crate Callout) You indicate that you are are restless, and need to move around. She will offer you a chance to walk around the room, but only if you allow her to leash you.\n\n");
                this.outputText("How do you respond?\n\n");
                this.outputText("\n\n");
                this.menu();
                this.addButton(0, "Accept", this.prisonCaptorPetTrainingCrateCallOut, 3);
                if (this.player.fatigue < this.player.maxFatigue() - 20) {
                    this.addButton(1, "Nevermind", this.prisonCaptorPetTrainingCrateCallOut, 4);
                }
                return;
            }
            if (branchChoice == "3") {
                this.clearOutput();
                this.outputText("(Placeholder) (Training Crate Callout) You allow her to leash you, and she walks you around your cell so that you can stretch and work the cramps out of your muscles.\n\n");
                this.prison.changeEsteem(-2, this.prison.inPrison);
                this.player.changeFatigue(-50);
                behaviorCounter = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) + 2;
                this.outputText("(Placeholder) new behavior value is " + behaviorCounter + "\n\n");
                this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 3, behaviorCounter);
                corChange = -0.25;
                this.dynStats("cor", corChange);
            }
            else if (branchChoice == "4") {
                this.clearOutput();
                this.outputText("(Placeholder) (Training Crate Callout) You decline her offer. She chastises you, and leaves you to continue to stew in your cage. \n\n");
                this.prison.changeEsteem(1, this.prison.inPrison);
                behaviorCounter = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) - 1;
                this.outputText("(Placeholder) new behavior value is " + behaviorCounter + "\n\n");
                this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 3, behaviorCounter);
                corChange = -0.25;
                this.dynStats("cor", corChange);
            }
            else if (branchChoice == "5") {
                this.clearOutput();
                this.outputText("(Placeholder) (Training Crate Callout) You indicate that you are horny, and don't want to make a mess of your bed.'.\n\n");
                if (behaviorCounter < 0) {
                    this.outputText("(Placeholder) (Training Crate Callout) You haven't behaved well enough to be able to leave your cage, so she instructs you to get on your hands and knees, put your food/water bowl below you, and then she gets you off with her tail, with most of the mess getting in your bowls instead of on your bedding.\n\n");
                }
                else {
                    this.outputText("(Placeholder) (Training Crate Callout) She allows you to exit your cage and masturbate at her feet.\n\n");
                }
                this.prison.changeEsteem(-1, this.prison.inPrison);
                behaviorCounter = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) + 1;
                this.outputText("(Placeholder) new behavior value is " + behaviorCounter + "\n\n");
                this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 3, behaviorCounter);
                this.player.orgasm('Generic');
                corChange = -0.25;
                this.dynStats("cor", corChange);
            }
            else if (branchChoice == "6") {
                this.clearOutput();
                this.outputText("(Placeholder) (Training Crate Callout) You sheepishly say you don't need anything.\n\n");
                if (behaviorCounter < 0) {
                    this.outputText("(Placeholder) (Training Crate Callout) Bad dog! Bad!.\n\n");
                }
                else {
                    this.outputText("(Placeholder) (Training Crate Callout) Aww, you just wanted to see me that badly, eh? Still, a good dog doesn't bother [his] owner.\n\n");
                }
                behaviorCounter = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) - 1;
                this.outputText("(Placeholder) new behavior value is " + behaviorCounter + "\n\n");
                this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 3, behaviorCounter);
            }

        }
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public prisonCaptorPetTrainingCrateLeash(branchChoice: string = "choose"): void {
        let corChange: number = 0;
        let behaviorCounter: number = 0;
        let trainingSource: number = 0;
        let entryPath: number = 0;
        behaviorCounter = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus);
        trainingSource = this.player.statusEffectv4(StatusEffects.PrisonCaptorEllyStatus);
        entryPath = this.prisonCaptorPetScratch();
        if (!(entryPath == 1) && !(entryPath == 2)) {
            entryPath = 1;
        }
        if (branchChoice == "choose") {
            this.prisonCaptorPetScratchSet(1);
            this.outputText("(Placeholder) (Training Crate Leash) You examine the leash that Mistress Elly has left for you.\n\n");
            this.outputText("You consider what to do with the leash");
            if (this.player.esteem > 15) {
                this.outputText(" but you find you still have too much dignity to anything but put it back down");
            }
            this.outputText(".\n\n");
            this.outputText("\n\n");
            this.menu();
            if (this.player.esteem < 15) {
                this.addButton(0, "Fasten", this.prisonCaptorPetTrainingCrateLeash, 1);
            }
            this.addButton(1, "Put Down", this.prisonCaptorPetTrainingCrateLeash, 2);
            return;
        }
        if (branchChoice == "0") {
            this.clearOutput();
            this.prisonCaptorPetScratchSet(2);
            this.outputText("(Placeholder) (Training Crate Leash) Mistress Elly points at your leash.\n\n");
            this.outputText("\n\n");
            this.menu();
            this.addButton(0, "Fasten", this.prisonCaptorPetTrainingCrateLeash, 1);
            return;
        }
        if (branchChoice == "1") {
            this.clearOutput();
            this.outputText("(Placeholder) (Training Crate Leash) You attach the leash to the ring on the back of your collar.\n\n");
            if (entryPath == 2) {
                this.outputText("(Placeholder) (Training Crate Leash) Mistress Elly watches with approval.\n\n");
            }
            this.outputText("What do you do next?\n\n");
            this.outputText("\n\n");
            this.prison.changeEsteem(-0.25, this.prison.inPrison);
            corChange = -0.25;
            this.dynStats("cor", corChange);
            this.menu();
            this.addButton(0, "Bite Leash", this.prisonCaptorPetTrainingCrateLeash, 3);
            return;
        }
        if (branchChoice == "2") {
            this.clearOutput();
            this.outputText("(Placeholder) (Training Crate Leash) You can't bring yourself to go any farther at the moment. Perhaps if you focus on behaving like a good dog, you might be able to get your ego in check enough to ask her to train you.\n\n");
            this.prison.changeEsteem(0.5, this.prison.inPrison);
            behaviorCounter = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyStatus) - 1;
            this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 3, behaviorCounter);
        }
        else {
            if (branchChoice == "3") {
                this.clearOutput();
                this.outputText("(Placeholder) (Training Crate Leash) You pick the leash up with your mouth.\n\n");
                this.outputText("What do you do next?\n\n");
                this.outputText("\n\n");
                this.prison.changeEsteem(-0.25, this.prison.inPrison);
                corChange = -0.25;
                this.dynStats("cor", corChange);
                this.menu();
                if (entryPath == 2) {
                    this.addButton(0, "Beg", this.prisonCaptorPetTrainingCrateLeash, 6);
                }
                else {
                    if (this.player.esteem < 5) {
                        this.addButton(0, "Call Out", this.prisonCaptorPetTrainingCrateLeash, 4);
                        this.addButton(1, "Wait Patiently", this.prisonCaptorPetTrainingCrateLeash, 5);
                    }
                    if (this.player.esteem > 2) {
                        this.addButton(2, "Nevermind", this.prisonCaptorPetTrainingCrateLeash, 2);
                    }
                }
                return;
            }
            if (branchChoice == "4" || branchChoice == "5") {
                this.clearOutput();
                if (branchChoice == "4") {
                    this.outputText("(Placeholder) (Training Crate Leash) You bark around the leather strap in your mouth, and Mistress Elly appears. She is quite pleased to see you wearing your leash and prepared to give it to her.\n\n");
                    this.prisonCaptorPetScoreChange(1);
                }
                else {
                    this.outputText("(Placeholder) (Training Crate Leash) You decide to wait patiently, and Mistress Elly appears. She is quite pleased to see you wearing your leash and prepared to give it to her, and even more pleased that you waited deferentially until she was ready to see you.\n\n");
                    this.prisonCaptorPetScoreChange(3);
                }
                this.outputText("(Placeholder) (Training Crate Leash) She lets you out of your cage and looks at you expectantly.\n\n");
                this.outputText("What do you do next?\n\n");
                this.outputText("\n\n");
                corChange = -0.25;
                this.dynStats("cor", corChange);
                this.menu();
                this.addButton(0, "Beg", this.prisonCaptorPetTrainingCrateLeash, 6);
                return;
            }
            if (branchChoice == "6") {
                this.clearOutput();
                if (entryPath == 2) {
                    this.outputText("(Placeholder) (Training Crate Leash) Transition directly from bite leash for players who submit.\n\n");
                }
                this.outputText("(Placeholder) (Training Crate Leash) You make an appealing show of begging like a dog, and she congratulates you for being such a good [boy] in accepting what you are...\n\n");
                this.prisonCaptorPetScoreChange(3);
                this.prison.changeEsteem(-5, this.prison.inPrison);
                corChange = -2;
                this.dynStats("cor", corChange);
                this.prisonCaptorPetScratchSet(0);
                this.prison.prisonCaptor.updateNextWaitRandomEvent(this.getGame().time.hours, this.getGame().time.days);
                this.prison.prisonCaptor.updateNextRoomRandomEvent(this.getGame().time.hours, this.getGame().time.days);
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 1, 2);
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 2, 0);
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 3, 0);
                this.player.changeStatusValue(StatusEffects.PrisonRestraints, 4, 0);
                this.flags[kFLAGS.PRISON_PUNISHMENT] = 0;
                this.flags[kFLAGS.PRISON_TRAINING_REFUSED] = 1;
                this.menu();
                if (trainingSource == 0) {
                    this.addButton(0, "Continue...", this.prisonCaptorPetTrainingAcceptedIntro, 3);
                }
                else {
                    this.addButton(0, "Continue...", this.camp.returnToCampUseOneHour);
                }
                return;
            }
        }
        this.prisonCaptorPetScratchSet(0);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public prisonCaptorPetTrainingAcceptedIntro(branchChoice: number = -1): void {
        this.clearOutput();
        this.outputText("(Placeholder) (Training Accepted Intro) Now that you've agreed to be trained as a dog, Elly explains what this means and what is expected of you.\n\n");
        switch (branchChoice) {
            case 0:
                this.outputText("Eager variation\n\n");
                break;
            case 1:
                this.outputText("Reluctant variation\n\n");
                break;
            case 2:
                this.outputText("Very reluctant variation\n\n");
                break;
            case 3:
                this.outputText("Crate broken variation\n\n");
                break;
            default:
                this.outputText("You shouldn't see this text.");
        }
        this.flags[kFLAGS.PRISON_TRAIN_PUPPY_TRICKS_UNLOCKED] = 1;
        this.doNext(this.playerMenu);
    }

    public prisonCaptorPetCrateDescribe(): void {
        this.outputText("\n\nYour training crate sits in the corner of the room, complete with comfortable bedding, your water dish, and your food bowl.");
    }

    public prisonCaptorPetCrateRest(): void {
        this.menu();
        if (this.getGame().time.hours < 6 || this.getGame().time.hours > 20) {
            this.outputText("You crawl into your training crate, curl up on your bedding, and go to sleep for the night.");
            this.addButton(0, "Sleep", this.camp.doSleep);
        }
        else {
            this.outputText("You crawl into your training crate, curl up on your bedding, and rest for a while.");
            this.addButton(0, "Rest", this.camp.rest);
        }
        this.prisonCaptorPetScoreChange(0.25);
    }

    public prisonCaptorPetDreamFailure(branchChoice: string = "choose"): void {
        this.outputText("(Placeholder) (Dream Failure) Replace with actual code when it's complete!");
        this.doNext(this.playerMenu);
    }

    public prisonCaptorFeedingBJTrainingPerformPuppyFinale(branchChoice: string): void {
        const lustChange: number = 75;
        let shortName: ItemType;
        this.prisonCaptorPetTierUpdate();
        if (branchChoice == "complain") {
            this.outputText("\"<i>B-but...</i>\" you whisper almost silently, mouth still hanging open. As she doesn't even seem to notice, you can't help but release a mournful whimper, too overcome with shame and arousal to muster much else.\n\n");
            this.outputText("At that, the light clicking of her departure ceases, and you see her turn. Her expression is difficult to make out through your misty eyes, but another light chuckle betrays an amused curiosity. \"<i>Why, whatever's the matter, dear?</i>\" As you timidly lower your eyes to the bowl of soup before you, she gives a short, sympathetic breath of understanding.\n\n");
            this.outputText("\"<i>Oh, you didn't want it in a bowl? But...however would you manage a loaf when all you seem to know how to use is that cute little tongue?</i>\" She sounds genuinely considerate, but the words still sting. You bite your lip to avoid crying any more and look even deeper at the floor as she continues: \"<i>Could you even hold it with those, ah, 'hands' of yours?</i>\"\n\n");
            this.outputText("Your eyes can't help but flicker to your arms at her implication, where you find that even now your fingers remain half-curled into a semblance of paws. Starting to tremble with insecurity over her utterly debasing analysis, you try to blink the tears from your eyes and look back to her with a hopeless, pleading expression -- your heartbreak even more obvious than perhaps you wanted. She merely absorbs your gaze for a time, maintaining the cool, considerate countenance that doubtless carried her incisive rationale. It slowly warms, though, into sympathy, and then pity.\n\n");
            this.outputText("\"<i>Well...</i>\" she muses in a solemn, pondering tone, before her eyes roll dramatically and she blows a bang from her face with a sarcastic huff of feigned resignation. \"<i>I suppose I <b>did</b> promise you a treat.</i>\" Out of thin air she produces...\n\n");
            this.outputText("<i>...oh...</i>\n\n");
            this.outputText("A mischievous grin spreads across Mistress Elly's face as she reveals a modest chunk of bread. It's nothing special, but it looks a little better than the pitiful slabs you're used to. \"<i>Is...<b>this</b>...is what you wanted?</i>\" she asks, plucking off a piece and gently slipping it between her lips. A modest grunt of delight escapes a moment later. Fixed on the soft, fluffy inside that her tease revealed, you merely bob your head in answer, your eyes widening with excitement. \"<i>Well then,</i>\" she concludes, turning the prize in her hands to give you a better view, \"<i>if you want it so much...</i>\"\n\n");
            this.outputText("\"<i>Show me.</i>\" She abruptly draws her arms behind her back, hiding your treat from view. You look at her blankly for a moment, unsure of how to respond; your enthusiasm certainly <i>felt</i> well showcased... but after you take no further action she fixes you with a firm but gentle expression.\n\n");
            this.outputText("\"<i>Come, now... if you really want your treat, be a good [boy] and ask for it properly. You remember how to be a good [boy], don't you?</i>\" She tilts her head and raises an eyebrow expectantly.\n\n");
            this.outputText("Your throat knots and your heart skips a beat as you realize what she wants from you. You <i>did</i> do it once already... but that was different, and the tranquility you felt playing for her before is a faint memory beside the heat in your loins and the spunk coating your upper torso. Still, you <i>earned</i> that chunk of bread and it hurts to let it go. As you begin to tremble again, your Mistress crosses her arms and awaits your answer.\n\n");
            this.outputText("You could give in and play her dog again. It should earn you your real meal, but might also give Mistress Elly the impression that you enjoy this treatment.\n\n");
            this.outputText("On the other hand, you still have your bowl of soup to keep you fed, and merely seeing her other offer has sated your hunger a little. It's tough to let your reward go, but even you know that what she's asking just isn't fair for a bit of plain bread.\n\n");
            this.outputText("And if you do refuse her, you could proclaim your resolve to <b>never allow yourself to be treated this way</b> to discourage her from trying to put you in such a position in the future.\n\n");
            this.outputText("\n\n");
            this.prison.changeEsteem(1, this.prison.inPrison);
            this.menu();
            this.addButton(0, "Beg...", this.prisonCaptorFeedingBJTrainingPerformPuppyFinale, "beg");
            this.addButton(1, "Nevermind...", this.prisonCaptorFeedingBJTrainingPerformPuppyFinale, "nevermind");
            this.addButton(2, "Never again", this.prisonCaptorFeedingBJTrainingPerformPuppyFinale, "optout");
            return;
        }
        if (branchChoice == "letgo") {
            this.outputText("You decide there's not much point trying to convince her and watch your [if (obey < 20) captor\"][if (obey >= 20) \"Mistress\"] depart. As you look down at your reward, you can't help but admit that your performance <i>was</i> asking for this a little -- and even though her suggestion was a tease, the thought of lapping up your meal on all fours makes your heart flutter for a moment.\n\n");
            this.outputText("You figure that if you want to avoid being treated like an animal, you should probably avoid acting like one.\n\n");
            shortName = this.consumables.C_BREAD;
        }
        else if (branchChoice == "beg") {
            this.outputText("You give your Mistress a faint nod. She responds with a delighted smile, giving another encouraging show of your treat, and you close your eyes. You begin a deep breath in an attempt to compose yourself, but your lungs stagger under the battering sensations of the heat in your loins, the hole in your heart, and the chill creeping down your torso in slow, viscous rivulets. As you give up -- swallowing the rest of your breath in an apprehensive gulp -- you lower your head, let your vision seep back, and look upon your half-curled hands...\n\n");
            this.outputText("…with no idea how you managed to do this in a single movement before. Not only do you find your limbs numb with embarrassment at the thought of it, but the practical considerations alone are disorienting. You <i>did</i> do it once, though...\n\n");
            this.outputText("Deciding to take it in pieces, you begin with your paws, hesitantly raising your left off the floor and holding it before your eyes like some sort of foreign object. You repeat the motion with your right, and then look painfully between them as you try to arrange them in front of your face at some approximation of equal height, depth, and distance. Now and then you flick your eyes to your Mistress in a meek attempt to measure her expression, and each time her lips widen for a moment in approval.\n\n");
            this.outputText("Finally satisfied with the placement of your paws, you lean back and begin shifting your legs. They're almost asleep from how long you've been sitting on them, but after some ineffectual squirming they begin to wake and you shudder with dread as a tingling sensation begins creeping through you. You don't think you'll be able to do this with <i>another</i> distraction.\n\n");
            this.outputText("In a rush of panic, you decide to end this and get your treat before your body can betray you any further. Rising up on your haunches a little, you confirm the position of your paws and fix Mistress Elly with a submissive, doe-eyed expression.\n\n");
            this.outputText("\"<i>That's all?</i>\" she says plainly, her lips curling into a curious smirk. You feel your eyes welling at her plain disappointment as she walks over to you, her expression fading into thoughtful concern. \"<i>What's wrong, [boy]?</i>\" she asks, searching your misty gaze as though there was nothing behind it. \"<i>You did it so well before...</i>\"\n\n");
            this.outputText("You shut your eyes and sink into your shoulders, cowering away from her appraisal as you try to determine what you did wrong. Were your hands off balance? Was your head too low? Did you forget to straighten your back? Your legs still feel far away -- had they not actually moved?\n\n");
            this.outputText("\"<i>Stop,</i>\" a voice whispers sharply in your ear. It's not harsh, but it gets your attention.\n");
            this.outputText("\"<i>Open your eyes and look at me.</i>\" You do as you're told, shyly lifting your head just enough to meet the violet orbs lying in wait. They glow with what seems like genuine sympathy.\n");
            this.outputText("\"<i>You're thinking too much,</i>\" she whispers playfully, as if letting you in on some clever secret.\n");
            this.outputText("\"<i>Or at least...</i>\" she adds, breaking your gaze as she leans to the side, \"<i>...thinking about the wrong things.</i>\" You feel a smooth digit on your left, downturned palm.\n\n");
            this.outputText("\"<i>Raise your paw,</i>\" she orders gently, pressing just enough to make it clear which she's referring to. You glance over to determine how much, but find your eyes drifting the other way as golden-brown blur passes in front of them. \"<i>Wouldn't you rather focus on this right now..?</i>\"\n\n");
            this.outputText("Your mouth drops open and you forget all about your hand as she holds the crisp, smooth chunk of bread only inches from your face. It was palatable from afar, but up close... and the smell... your nostrils twitch as you slowly inhale, teary eyes glazing over as you imagine how it must <i>taste</i>. \"<i>Or...ah, <b>this</b>?</i>\"\n\n");
            this.outputText("Your heart skips and your body jumps as a velvet spade ");
            if (this.player.hasCock()) {
                this.outputText("briefly flicks across the length of your cock, bringing it back to full attention and");
            }
            else if (this.player.hasVagina()) {
                this.outputText("gives a fierce but playful flick at your [clit]");
            }
            else {
                this.outputText("prods playfully at your [asshole]");
            }

            this.outputText(" inducing another deluge of need. You feel your hips buck at the air, raising your stance a little farther as they chase her departing tail. You begin sobbing in earnest, then, a stream of tears washing a path down your sticky face. You tell yourself you've done your best, but you know you're just not strong enough to endure being teased and humiliated and denied like  Desperate to fulfill at least <i>one</i> of your cravings, you lean forward and bite at your prize with a needy whine.\n\n");
            this.outputText("\"<i>Uh-uh,</i>\" Mistress Elly chides, retracting her hand as your mouth, too, catches only air and you let your gaze drop to the floor with a sniffle. \"<i>Don't pout, [boy],</i>\" she comforts with feigned admonishment. \"<i>You're already doing <b>much</b> better.</i>\" Curious of her unexpected compliment in spite of your embarrassment, you can't help but look up as you feel another tap on your palm and find her gently holding your left hand. You feel as though your center of gravity has shifted, and realize with a quiet, unbidden gasp that while distracting you with her teasing she actually improved your posture tremendously.\n\n");
            this.outputText("You know you should probably be angry about how she's treating you, but can't help feeling something closer to guilt as you dwell on her sly assistance. As your eyes drift back to her, you find yourself offering an abashed, apologetic expression. She responds with no more than a knowing, absolving wink, but it lights a spark in your heart and you feel your guilt turn to gratitude.\n\n");
            this.outputText("\"<i>Now the rest,</i>\" she says, letting your hand go as her violet gaze darts over your kneeling form, \"<i>you need to do on your own. But I know you can do that, can't you [boy]?</i>\" she asks, her eyes meeting yours in invitation; while you're still not particularly confident, <i>she</i> seems to be, and you find yourself trusting in that as you answer her with a timid nod. \"<i>Well then,</i>\" she chimes, cupping her chin as she gently tilts her head in appraisal, \"<i>Right paw up.</i>\"\n\n");
            this.outputText("You blink, a little surprised by the flat tone of the order, but quickly eye your right hand and lift it to the level that she had placed your left. You look down your arm to make sure your elbows align, when her tail sharply whips your [ass]. \"<i>Back straight.</i>\" Your shoulders jolt back from the harmless but startling strike, and you hear the light tapping of boots as Mistress Elly begins circling you.\n\n");
            this.outputText("\"<i>Part your legs. Relax your wrists. <b>Just</b> your wrists -- left paw back up; that's it...</i>\" You can't help but feel pathetic, shifting your body to her whims like a marionette, and with each command you follow, buds of deep, warm blush speckle your face, then your torso, then even your limbs. But even if she's toying with you, you find yourself a little proud as her criticisms become smaller and she takes more time between them. As her commands become more esoteric, you even have some fun determining how to obey them with the most speed and elegance. You keep your eyes closed to concentrate, but as her voice becomes more affectionate and she even begins chuckling a little between the odd order, you nearly forget there's a demon only inches away and some of the buds on your torso begin to blossom.\n\n");
            this.outputText("\"<i>There now,</i>\" your Mistress coaxes, her voice coming from in from in front of you. \"<i>Feeling better, [boy]?</i>\" It's hard to deny that you do, a soft, soothing heat seeming to follow wherever your flush skin starts to flourish. You shiver with ticklish delight as the sensation mixes with the cool air of your cell and bite your lip to avoid giggling as a trail of her seed slips into your navel. At that, some of the flowers on your face begin to bloom.\n\n");
            this.outputText("\"<i>I thought so,</i>\" she says knowingly. \"<i>Alright, up off your haunches...</i>\" Despite the physical strain, you find your legs relaxing as warmth winds its way through them and they bask in the same glow quickly overtaking the rest of you. As you reach your peak, you take another long, staggered breath -- only this time shake by excitement.\n\n");
            this.outputText("\"<i>Chin up.</i>\" You obey, faintly smiling as you imagine your pleased owner right in front of you.\n");
            this.outputText("\"<i>Mouth open.</i>\" You obey, your ears perking up at the sound of a few soft clicks.\n");
            this.outputText("\"<i>Tongue out.</i>\" You obey, letting your chest fall in a relaxed breath.\n");
            this.outputText("\"<i>Good [boy].</i>\" What few flush buds remain on your skin unravel as your body fills with radiance and your eyes flutter open with an expression of warm, docile serenity.\n\n");
            this.outputText("You blink, feeling a soft weight hit the back of your tongue. Mistress Elly, now standing a few meters away, quickly raises something held between her thumb and forefinger before giving a playful wink and flicking her hand. A small object gently arcs through the air towards you, and when it begins curving to your left, you lean to the side and intercept it it your open mouth on sheer reflex.\n\n");
            this.outputText("\"<i>Oh~ <b>very</b> good [boy]!</i>\" she coos. You're glad she's excited; hopefully that means you'll <i>finally</i> get your treat. And sliding your tongue back as a delightful taste suggests what she just tossed you, you're not sure you'll be able to save it for very long. The flavor, while fairly plain, is still rich and filling, but the <i>texture</i>! Until your prospects turned to stale husks and seed soup, you never imagined how good a piece of soft, fluffy bread could feel.\n\n");
            this.outputText("\"<i>The tricks I could teach that mouth of yours...</i>\" she muses to herself, closing the distance again. You look up at her expectantly, unfazed by the comment, and she smiles back down with a glint in her eye. \"<i>But right now you've earned a treat, haven't you?</i>\" she asks, again revealing your well-baked reward. You nod fervently. While the humiliation of being made to beg like a dog still smolders somewhere in the back of your mind, it's difficult to notice behind the bright glow of pride at having performed the physical feat and anticipation of the prize it's won.\n\n");
            this.outputText("She plucks off a piece and holds it in front of you. Looking it over hungrily, you give her another nod, unsure of how else to close this \"deal.\" With a titter, she raises an eyebrow and looks at <i>you</i> expectantly. \"<i>You need to open your mouth, [boy],</i>\" she says instructively, as if you're merely being slow. You lose some of your luster as you realize her intentions, your brow furrowing into a recalcitrant pout. You know how precarious it is to resist her and really aren't trying to upset her, but she promised to feed you, not <i>feed</i> you.\n\n");
            this.outputText("Fortunately, Mistress Elly's smile merely widens, her features taking a skeptical slant. You're relieved at first, but your \"hard\" eyes begin to wilt as you realize how quaint your \"defiance\" must look in the midst of your overwhelmingly submissive posture. Suddenly feeling very shy, you find your eyes searching the room for anything that isn't violet.\n\n");
            this.outputText("\"<i>Didn't we go over this?</i>\" she asks, not even addressing your insignificant rebellion as her hand lowers the bite beneath the edge of your vision, \"<i>How are you going to eat it yourself without your little paws making a mess of things? You have to keep your room clean, remember?</i>\" You purse your lips in an indignant huff at that. You know she's being unfair; she could crumble it into a bowl for you like other bread, after all. \"<i>And honestly?</i>\" she adds in a sincere, almost pitying whisper, \"<i>if the state of your face is any indication, you'll be lucky to handle the soup.</i>\"\n\n");
            this.outputText("You wouldn't have thought you could flush any further, but the entire shade wreathing your body deepens at her implication. \"<i>Now say 'aaah~'</i>\" she orders again, but before you can contemplate obeying or refusing her, you feel a ");
            if (this.player.hasCock()) {
                this.outputText("velvet loop around your cock");
            }
            else if (this.player.hasVagina()) {
                this.outputText("velvet spade flick at the entrance to your [vagina]");
            }
            else {
                this.outputText("velvet spade tickle at your [asshole]");
            }

            this.outputText(" and a soft pressure against your belly-button; they pull upward in unison.\n\n");
            this.outputText(" \"<i>Aaaaah!</i>\" you moan with an undignified lilt, your jaw dropping as you shudder from the mix of sensations. The bite of your treat returns to your face, though now it appears coated like a proper pastry. \"<i>Aah!</i>\" you cry in refusal as you realize the nature of the frosting, but by then she's already pressed it hard to your tongue. \"<i>A-ah-uuh...uhh...</i>\"\n\n");
            this.outputText("Mistress Elly fixes you with a gaze of casual, almost indifferent triumph -- as if she's used to constantly proving you wrong about yourself. You feel <i>yourself</i> getting frightfully used to it, too, but seeing it mean so little to her very nearly breaks your luminous reverie. But before you have time to reflect, she slowly closes her own mouth, shifts her jaw around to imitate chewing, and slowly withdraws her fingers, teasing out a long strand of saliva before flicking it over your nose and lips. Your will to struggle with this heartbreaking charade any further finally and thoroughly devastated, you feel your quivering jaw repeat her motions, the cum-coated bread crumbling and soaking into your mouth, and then a knot in your throat.\n\n");
            this.outputText("It's delicious. Her seed did nothing to the dense, fluffy texture, but the <i>flavor</i>. What was once a simple, filling snack now tastes like a lush, cinnamon delicacy. It hurts to admit it, but as your throat relaxes you manage to swallow and the delectable sensation travels all the way down your gullet, you want <b>more</b>.\n\n");
            this.outputText("Your Mistress merely smirks at your dazed expression, rising and again stepping around to your side. As she does so, she plucks off another piece, swirls it affectionately on your cheek for a moment, then places it against your lips, which immediately open to accept her deposit. You feel your hair being ruffled as the click of her steps ceases directly behind you. A soft brush swipes under your drippy chin, then pulls up, tilting your head back to see your Mistress looking down at you with predatory delight.\n\n");
            this.outputText("\"<i>You know,</i>\" she says, holding another succulent morsel before your lips.\n");
            this.outputText("\"<i>I really did think you were only pretending.</i>\" You open your mouth to accept, your ravenous eyes imploring her with suppliant innocence.\n");
            this.outputText("\"<i>And well, maybe you <b>were</b>, in one way.</i>\" She does not lower the bread, and as you strain a little more to clutch it, she lifts it slightly farther.\n");
            this.outputText("\"<i>Maybe you still will, when we're done here.</i>\" You faintly realize you must have been slouching, because as you stretch upwards your legs give out. Whether it's due to the burning in your muscles or the burning in your loins, you see no option but to stick out your tongue and hope your owner indulges your begging.\n\n");
            this.outputText("\"<i>But now, at least... I see you're finally being honest with yourself.</i>\" With a wink to your effort, she lets the makeshift cinnamon bun fall into your mouth. And after a long, soft stroke snakes across your chest and under your jaw, you see her hold up what appears to be the remainder of your treat, now amply flavored.\n\n");
            this.outputText("\"<i>And I'm so, <b>so</b> proud of you!</i>\" She holds it to your mouth, and you voraciously devour the tasty block, then begin nibbling her palm and licking through her fingers for the crumbs.\n\n");
            this.outputText("\"<i>So proud, in fact, that my good [boy] gets <b>another</b> reward.</i>\" Her velvet tail stirs again and you shudder as the surge of need grants you a moment of lucidity. Startled and still reeling from what has transpired, your shyness overcomes your arousal and you fumble an awkward attempt to push away from her, but ultimately fall back into your compromised position and resume your fevered lapping -- desperately trying to clean her hand of both bread and frosting -- as your mind and body scramble to sort out exactly what it wants and what it needs.\n\n");
            this.outputText("\"<i>There, there...</i>\" she chimes, almost as an aside, as her free hand clutches your throat with surprising force. Her tail quickens and your limbs begin to writhe, and as you lose your balance she tugs you backward into a soft embrace. \"<i>You don't have to pretend any more...</i>\"\n\n");
            this.outputText("\"<i>Just let go and accept how much you want to be a docile...</i>\" Your tongue seizes up, finally ceasing to chase her fingers, your jaw begins to shake uncontrollably, and your entire body tenses as her velvet ministrations build to a frenzied pace.\n\n");
            this.outputText("\"<i>Obedient...</i>\" Every flush flowered across your body seems as though they're blossoming all over again, your skin feeling hot enough against the air and stone to steam.\n\n");
            this.outputText("\"<i>Pet.</i>\" Your eyes roll skyward and your hips buck against her tail as you climax, ");
            if (this.player.hasCock()) {
                this.outputText("your own ample seed adding to the contents of the bowl in front of you.");
            }
            else if (this.player.hasVagina()) {
                this.outputText("an explosion of fluid coating your thighs and seasoning the contents of the bowl in front of you.");
            }
            else {
                this.outputText("[asshole] spasming with need.");
            }

            this.outputText(" A long whine slips through your lips, an undulating harmonic of fear, shame, and relief, before your body finally overwhelms you and your dainty pose collapses. You immediately follow, plummeting forward, nearly landing your soup, before your owner tilts you to the side and gently sets your head down beside it instead.\n\n");
            this.outputText("\"<i>Or am I wrong?</i>\" she whispers in your ear, her voice quieter than the breath that carries it. You have no time to contemplate, your consciousness quickly fading as your ");
            if (this.player.tail.type > 0) {
                this.outputText("tail");
            }
            else {
                this.outputText("leg");
            }
            this.outputText(" twitches in the wake of your pleasure.\n\n");
            this.outputText("You should come to in about an hour, having learned a profound lesson about the potential rewards -- and consequences -- of behaving too convincingly as an animal in Mistress Elly's presence.\n\n");
            this.prison.changeEsteem(-1, this.prison.inPrison);
            this.prison.changeWill(10);
            this.player.refillHunger(40);
            this.prisonCaptorPetScoreChange(2);
            this.player.orgasm('Lips');
            this.prisonCaptorPetTierUpdate();
            shortName = this.consumables.C_BREAD;
        }
        else if (branchChoice == "optout") {
            this.outputText("This is outrageous! You know you can't stop her from refusing you your meal, but your performance is <i>over</i> and you're not going to let yourself be treated this way <b>ever</b> again.\n\n");
            this.outputText("\"<i>I'm not your damn <b>DOG</b>!</i>\" you yell viciously, tears clouding your eyes as your body strains against your show of rebellion. A stone seems to settle in your stomach as you realize what you've done, and your enraged expression goes blank as you blink away the dampness to find that Mistress Elly isn't there anymore.\n\n");
            this.outputText("\"<i>No,</i>\" you hear a voice seethe behind you. \"<i>I suppose you're not.</i>\"\n\n");
            this.outputText("As you turn, your vision blurs again as a deafening impact fills your right ear. You feel your left cheek meet the floor, and next you know your head is pounding as a pressure on your shoulder rolls you onto your back. Your vision is still unfocused, but you can make out the who's standing above you well enough. Her arms are crossed admonishingly, but her expression appears somewhat... delighted?\n\n");
            this.outputText("\"<i>You're my <b>slave</b>,</i>\" she declares strangely quietly, her lips opening wide as she mouths the words. \"<i>So remember your manners.</i>\"\n\n");
            this.outputText("With a far away giggle, she steps away and you faintly hear your cell door close with a thud. Well, a knuckle-sandwich wasn't the meal you had in mind, but you do feel a bit less hungry and you think you still got your point across. Your hearing should return to normal within the hour.\n\n");
            this.prisonCaptorPetScoreSet(-1);
            this.player.refillHunger(15);
            this.prison.changeEsteem(3, this.prison.inPrison);
            shortName = this.consumables.C_BREAD;
        }
        else if (branchChoice == "nevermind") {
            this.outputText("You look away from her indecisively and finally lift your hands from the floor. When you unravel your paws and cross your arms in a meek show of reticence, she lets slip an affectionate laugh.\n\n");
            this.outputText("\"<i>You're a bit late to play shy, dear, but alright. Enjoy your bowl, okay?</i>\" She finishes with expected sincerity, and you can't help but glance back at her as she turns to depart. There's a violet glint as she gives you a parting wink, and you feel yourself blush as you look down at your reward.\n\n");
            this.outputText("It still stings to have been denied your prize, but maybe your performance <i>was</i> asking for this a little -- and even though her suggestion was a tease, the thought of lapping up your meal on all fours makes your heart flutter for a moment.\n\n");
            this.outputText("You figure that if you want to avoid being treated like an animal, you should probably avoid acting like one.\n\n");
            this.player.refillHunger(5);
            this.prison.changeEsteem(1, this.prison.inPrison);
            shortName = this.consumables.C_BREAD;
        }

        this.player.slimeFeed();
        this.player.refillHunger(5);
        this.dynStats("lus", lustChange);
        this.prison.changeEsteem(-5, this.prison.inPrison);
        this.prison.changeObey(2, this.prison.inPrison);
        this.flags[kFLAGS.PRISON_TRAINING_LEVEL]++;
        if (this.flags[kFLAGS.PRISON_TRAINING_LEVEL] > 4 && this.player.obey > 25 + TrainingPet.rand(3)) {
            this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyStatus, 1, 3);
            this.flags[kFLAGS.PRISON_TRAINING_LEVEL] = 0;
        }
        this.inventory.takeItem(shortName, this.camp.returnToCampUseOneHour);
    }

}
