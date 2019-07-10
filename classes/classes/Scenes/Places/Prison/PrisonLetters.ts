import { BaseContent } from "../../../BaseContent";
import { kFLAGS } from "../../../GlobalFlags/kFLAGS";
import { PregnancyStore } from "../../../PregnancyStore";
import { rand } from "../../../Extra";
import { kGAMECLASS } from "../../../GlobalFlags/kGAMECLASS";

export class PrisonLetters extends BaseContent {

    public deliverChildWhileInPrison(): boolean {
        if (this.flags[kFLAGS.IN_PRISON] == 0) return false;
        if (this.player.vaginas.length == 0) {
            this.outputText(this.images.showImage("birth-prison"));
            this.outputText("\nYou feel a terrible pressure in your groin... then an incredible pain accompanied by the rending of flesh.  <b>You look down and behold a new vagina</b>.\n");
            this.player.createVagina();
        }
        this.outputText("\nIt's time! You " + this.player.clothedOrNakedLower("remove your [lowergarment] and ") + "sit down at one of the corners and spread your [legs]. A sudden gush of fluids erupt from your [pussy] - your water just broke. You grunt painfully as you feel wriggling and squirming inside your belly, muscle contractions forcing it downwards. ");
        // Various scenes
        if (this.player.pregnancyType == PregnancyStore.PREGNANCY_MARBLE) {
            this.outputText("\n\nEventually, a newborn cow-girl comes out of your womb and into your cell; Marble would love to see them. You call for Mistress Elly and she rushes to your cell to see the newborn sirens. \"<i>Don't worry. I promise your newborn cow-girl will be delivered to Marble. I've ordered two imps to carry her,</i>\" she says. Two imp guards come into your cell to take away the newborn cow-girl. Hopefully you'll receive a letter.");
            this.outputText("\n\n<b>Some time passes...</b>");
            this.letterFromMarbleAfterGivingBirth();
            this.flags[kFLAGS.MINERVA_CHILDREN] += 2;
        }
        if (this.player.pregnancyType == PregnancyStore.PREGNANCY_MINERVA) {
            this.outputText("\n\nEventually, the twin sirens come out of your womb and into your cell; Minerva would love to see them. You call for Mistress Elly and she rushes to your cell to see the newborn sirens. \"<i>Don't worry. I promise your newborn sirens will be delivered to Minerva. I've ordered two imps to carry them,</i>\" she says. Two imp guards come into your cell to take away the siren twins. Hopefully you'll receive a letter.");
            this.outputText("\n\n<b>Some time passes...</b>");
            this.letterFromMinervaAfterGivingBirth();
            this.flags[kFLAGS.MINERVA_CHILDREN] += 2;
        }
        if (this.player.pregnancyType == PregnancyStore.PREGNANCY_BEHEMOTH) {
            this.outputText("\n\nEventually, the purple creature comes out of your womb and into your cell; Behemoth would love to see him. You call for Mistress Elly and she rushes to your cell to see the newborn sirens. \"<i>Don't worry. I promise your newborn behemoth will be delivered to Behemoth. I've ordered two imps to carry him,</i>\" she says. Two imp guards come into your cell to take away the newborn behemoth. Hopefully you'll receive a letter.");
            this.outputText("\n\n<b>Some time passes...</b>");
            this.letterFromMinervaAfterGivingBirth();
            this.flags[kFLAGS.BEHEMOTH_CHILDREN]++;
            if (this.flags[kFLAGS.BEHEMOTH_CHILDREN] == 1) this.flags[kFLAGS.BEHEMOTH_CHILD_1_BIRTH_DAY] = this.getGame().time.days;
            if (this.flags[kFLAGS.BEHEMOTH_CHILDREN] == 2) this.flags[kFLAGS.BEHEMOTH_CHILD_2_BIRTH_DAY] = this.getGame().time.days;
            if (this.flags[kFLAGS.BEHEMOTH_CHILDREN] == 3) this.flags[kFLAGS.BEHEMOTH_CHILD_3_BIRTH_DAY] = this.getGame().time.days;
        }
        // Post-birthing
        if (this.player.hips.rating < 10) {
            this.player.hips.rating++;
            this.outputText("\n\nAfter the birth your " + this.player.armorName + " fits a bit more snugly about your " + this.player.hipDescript() + ".");
        }
        this.player.knockUpForce(); // CLEAR!
        return true;
    }

    public initialMessage(npcName: string): void {
        this.outputText("\nMistress Elly opens the door and hands you the letter. \"<i>This is for you, slave. It's from " + npcName + ",</i>\" she says as she walks out, leaving you in your cell with the letter. You open the letter and read. \n\n");
        this.outputText(this.images.showImage("item-letter"));
    }

    // ------------
    // HELIA
    // ------------
    // Helia gives birth
    public letterFromHelia1(): void {
        const randomNames: any[] = ["Helara", "Helspawn", "Jayne", "Hesper", "Syn", "Chara"];
        const name: string = randomNames[rand(randomNames.length)];
        this.initialMessage("Helia");
        this.outputText("\"<i>Hey lover! Sorry you have to miss out on me giving birth to my daughter. She's beautiful. I've named her \"" + name + "\". I've drawn something to describe what she looks like. I would save you but I can't find the prison.  -Helia</i>\"");
        if (this.flags[kFLAGS.HELSPAWN_DADDY] == 0) this.outputText("\n\nLooking at the drawing, you notice that " + name + " has mostly the traits of Helia except that she has your eye colour.");
        else if (this.flags[kFLAGS.HELSPAWN_DADDY] == 1) this.outputText("\n\nLooking at the drawing, you notice that " + name + " isn't <b>quite</b> a salamander, though. The little girl has the same shape as her mothers, a body covered in leather scales and a brightly-flaming tail... but her scales are a midnight black, the same color as a spider's chitin.");
        else if (this.flags[kFLAGS.HELSPAWN_DADDY] == 2) this.outputText("\n\nLooking at the drawing, you notice that " + name + " isn't <b>quite</b> a salamander, though. The little girl looks mostly like her mother, with a full body of red scales and pale flesh, and a brightly flaming tail; but atop her head, rather than finned reptilian ears are a pair of perky, puppy-dog like ears.");
        this.outputText(" You chuckle and scratch your head. If only you've went there to witness the birth. Oh well!");
        this.flags[kFLAGS.HELSPAWN_NAME] = name;
        kGAMECLASS.helSpawnScene.helSpawnsSetup();
    }
    // No choices for you!
    public noControlOverHelspawn(): void {
        this.flags[kFLAGS.HELSPAWN_PERSONALITY] += 10;
        this.flags[kFLAGS.HELSPAWN_FUCK_INTERRUPTUS] = 1;
        this.outputText("\nYou have a feeling that " + (this.flags[kFLAGS.HELSPAWN_DADDY] == 0 ? "your" : "Hel's") + " daughter is making a slut out of herself. She is beyond your control as long as you're confined in this prison.\n");
    }

    // ------------
    // IZMA
    // ------------
    public letterFromIzma(): void {
        this.initialMessage("Izma");
        this.outputText("\"<i>Hello, my Alpha. Today I gave birth to a ");
        if (rand(100) <= 59) {
            this.outputText("shark-girl");
            this.flags[kFLAGS.IZMA_CHILDREN_SHARKGIRLS]++;
        }
        else {
            this.outputText("tigershark");
            this.flags[kFLAGS.IZMA_CHILDREN_TIGERSHARKS]++;
        }
        this.outputText("daughter and you should come. She has already grew up quite a bit.  -Izma.</i>\"");
    }

    // ------------
    // KIHA
    // ------------
    // Kiha gives birth to egg.
    public letterFromKiha1(eggCounter: number): void {
        this.initialMessage("Kiha");
        // Increment children with Kiha.
        let maleCount: number = 0;
        let femaleCount: number = 0;
        let hermCount: number = 0;
        let genderChooser: number;
        const childList: any[] = [];
        for (let i: number = 0; i < eggCounter; i++) {
            genderChooser = rand(100);
            if (genderChooser < 20) maleCount++;
            else if (genderChooser < 40) femaleCount++;
            else hermCount++;
        }
        if (maleCount > 0) {
            childList.push(PrisonLetters.num2Text(maleCount) + " " + (maleCount > 1 ? "boys" : "boy"));
            this.flags[kFLAGS.KIHA_CHILDREN_BOYS] += maleCount;
        }
        if (femaleCount > 0) {
            childList.push(PrisonLetters.num2Text(femaleCount) + " " + (femaleCount > 1 ? "girls" : "girl"));
            this.flags[kFLAGS.KIHA_CHILDREN_GIRLS] += femaleCount;
        }
        if (hermCount > 0) {
            childList.push(PrisonLetters.num2Text(hermCount) + " " + (hermCount > 1 ? "hermaphrodites" : "hermaphrodite"));
            this.flags[kFLAGS.KIHA_CHILDREN_HERMS] += hermCount;
        }
        this.outputText("\"<i>How are you doing, Doofus? I laid a clutch of " + PrisonLetters.num2Text(eggCounter) + " fertilized eggs today and I wanted you to see me but you couldn't. The eggs hatched quickly and there are " + PrisonLetters.formatStringArray(childList) + ". I'm going to train them when they grow a bit more. I could have saved you but I don't know where you're imprisoned.  -Kiha</i>\"");
    }
    // Kiha's egg hatches. (Not used anymore due to overhaul)
    /*public function letterFromKiha2(): void {
        initialMessage("Kiha");
        outputText("\"<i>How are you doing, Doofus? The egg hatched and I wanted you to see but you couldn't. ");
    var  genderChooser: number = rand(100);
        //Male!
        if (genderChooser < 40) {
            outputText("It's a beautiful boy ");
            flags[kFLAGS.KIHA_CHILD_LATEST_GENDER] = 1;
            flags[kFLAGS.KIHA_CHILDREN_BOYS]++;
        }
        //Female!
        else if (genderChooser < 80) {
            outputText("It's a beautiful girl ");
            flags[kFLAGS.KIHA_CHILD_LATEST_GENDER] = 2;
            flags[kFLAGS.KIHA_CHILDREN_GIRLS]++;
        }
        //Hermaphrodite!
        else {
            outputText("It's a beautiful hermaphrodite ");
            flags[kFLAGS.KIHA_CHILD_LATEST_GENDER] = 3;
            flags[kFLAGS.KIHA_CHILDREN_HERMS]++;
        }
        outputText(" and " + (genderChooser < 40 ? "he" : "she") + " will definitely make a great warrior. I hope you'll come someday.  -Kiha</i>\"");
    }*/
    // Kiha tells story.
    public letterFromKiha3(): void {
        this.initialMessage("Kiha");
        this.outputText("\"<i>How are you doing, Doofus? I told my kids about the story and they were excited. They miss you and they want to see you. Please come back. You're my one and only Idiot.  -Kiha</i>\"");
    }
    // Kiha's child grows up.
    public letterFromKiha4(): void {
        this.initialMessage("Kiha");
        this.outputText("\"<i>How are you doing, Doofus? My children is quite the warrior now. I've taught them my fighting techniques and they put on quite the flame show! It's too bad you didn't get to see them. They miss you and they wants to see you. Please come back. You're my one and only Idiot.  -Kiha</i>\"");
    }

    // ------------
    // MARBLE
    // ------------
    public letterFromMarble(): void {
        this.initialMessage("Marble");
        let boyOrGirl: boolean; // true for boy, false for girl.
        if (this.flags[kFLAGS.MARBLE_PURIFIED] > 0 && rand(2) == 0) {
            this.flags[kFLAGS.MARBLE_BOYS]++;
            boyOrGirl = true;
        }
        else {
            boyOrGirl = false;
        }
        this.outputText("\"<i>Sweetie, I'm sorry you could not come here. I've gave birth recently and I'd love you to come and see our new " + (boyOrGirl ? "son" : "daughter") + ". I don't know where the prison is so you're on your own until you can escape. I'm really sorry, sweetie.  -Marble</i>\"");
        this.flags[kFLAGS.MARBLE_KIDS]++;
    }

    public letterFromMarbleAfterGivingBirth(): void {
        this.initialMessage("Marble");
        let boyOrGirl: boolean; // true for boy, false for girl.
        if (this.flags[kFLAGS.MARBLE_PURIFIED] > 0 && rand(2) == 0) {
            this.flags[kFLAGS.MARBLE_BOYS]++;
            boyOrGirl = true;
        }
        else {
            boyOrGirl = false;
        }
        this.outputText("\"<i>Sweetie, thank you for caring for my " + (boyOrGirl ? "son" : "daughter") + ". I don't know where the prison is so you're on your own until you can escape. I'm really sorry, sweetie.  -Marble</i>\"");
    }
    // ------------
    // SOPHIE
    // ------------

    // ------------
    // URTA
    // ------------

    // ------------
    // BEHEMOTH
    // ------------
    public letterFromBehemothAfterGivingBirth(): void {
        this.initialMessage("Behemoth");
        this.outputText("\"<i>Thank you " + this.player.mf("dude", "chick") + ". I have a new son now and he's helping to keep me company. I could save you but I don't know where the prison is. It's awfully hidden even though I've explored Mareth.  -Behemoth</i>\"");
    }

    // ------------
    // MINERVA
    // ------------
    public letterFromMinerva(): void {
        this.initialMessage("Minerva");
        this.outputText("\"<i>Darling, I gave birth to a twin today. They're little and beautiful! They want to see you. Sorry I can't come to save you as I have to look after my daughters.  -Minerva</i>\"");
    }

    public letterFromMinervaAfterGivingBirth(): void {
        this.initialMessage("Minerva");
        this.outputText("\"<i>Thank you darling for taking good care. I feel like a mother again even though I got you pregnant. I would love to come and save you but I have daughters to look after. They want to see you. Sorry I can't come.  -Minerva</i>\"");
    }
}
