import { BaseContent } from "../../../BaseContent";
import { StatusEffects } from "../../../StatusEffects";
import { rand } from "../../../Extra";

// Billie the Bunny Dickgirl

export class BillieScene extends BaseContent {

    public prisonCaptorBillieStatusText(): void {
        let billieMet: any;
        let happiness: any = this.prisonCaptorBillieHappiness();
        billieMet = this.prisonCaptorBillieMet();
        billieMet < 1;
    }

    public prisonCaptorBillieOptedOut(): boolean {
        let testVal: any;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyBillie)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyBillie, 0, 0, 0, 0);
        }
        testVal = this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyBillie);
        if (testVal < 0) {
            return true;
        }
        return false;
    }

    public prisonCaptorBillieMet(): number {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyBillie)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyBillie, 0, 0, 0, 0);
        }
        return this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyBillie);
    }

    public prisonCaptorBillieMetSet(newVal: number): void {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyBillie)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyBillie, 0, 0, 0, 0);
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyBillie, 1, newVal);
    }

    public prisonCaptorBillieMetChange(changeVal: number): void {
        let newVal: any;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyBillie)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyBillie, 0, 0, 0, 0);
        }
        newVal = this.player.statusEffectv1(StatusEffects.PrisonCaptorEllyBillie) + changeVal;
        if (newVal < 0) {
            newVal = 0;
        }
        if (newVal > 100) {
            newVal = 100;
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyBillie, 1, newVal);
    }

    public prisonCaptorBillieHappiness(): number {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyBillie)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyBillie, 0, 0, 0, 0);
        }
        return this.player.statusEffectv2(StatusEffects.PrisonCaptorEllyBillie);
    }

    public prisonCaptorBillieHappinessSet(newVal: number): void {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyBillie)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyBillie, 0, 0, 0, 0);
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyBillie, 2, newVal);
    }

    public prisonCaptorBillieHappinessChange(changeVal: number): void {
        let newVal: any;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyBillie)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyBillie, 0, 0, 0, 0);
        }
        newVal = this.player.statusEffectv2(StatusEffects.PrisonCaptorEllyBillie) + changeVal;
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyBillie, 2, newVal);
    }

    public prisonCaptorBillieEvent(): number {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyBillie)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyBillie, 0, 0, 0, 0);
        }
        return this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyBillie);
    }

    public prisonCaptorBillieEventSet(newVal: number): void {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyBillie)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyBillie, 0, 0, 0, 0);
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyBillie, 3, newVal);
    }

    public prisonCaptorBillieEventChange(changeVal: number): void {
        let newVal: number = 0;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyBillie)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyBillie, 0, 0, 0, 0);
        }
        newVal = this.player.statusEffectv3(StatusEffects.PrisonCaptorEllyBillie) + changeVal;
        if (newVal < 0) {
            newVal = 0;
        }
        if (newVal > 100) {
            newVal = 100;
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyBillie, 3, newVal);
    }

    public prisonCaptorBillieScratch(): number {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyBillie)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyBillie, 0, 0, 0, 0);
        }
        return this.player.statusEffectv4(StatusEffects.PrisonCaptorEllyBillie);
    }

    public prisonCaptorBillieScratchSet(newVal: number): void {
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyBillie)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyBillie, 0, 0, 0, 0);
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyBillie, 4, newVal);
    }

    public prisonCaptorBillieScratchChange(changeVal: number): void {
        let newVal: any;
        if (!this.player.hasStatusEffect(StatusEffects.PrisonCaptorEllyBillie)) {
            this.player.createStatusEffect(StatusEffects.PrisonCaptorEllyBillie, 0, 0, 0, 0);
        }
        newVal = this.player.statusEffectv4(StatusEffects.PrisonCaptorEllyBillie) + changeVal;
        if (newVal < 0) {
            newVal = 0;
        }
        if (newVal > 100) {
            newVal = 100;
        }
        this.player.changeStatusValue(StatusEffects.PrisonCaptorEllyBillie, 4, newVal);
    }

    public prisonCaptorBilliePityFuck(branchChoice: string = "choose"): void {
        this.hideMenus();
        let happiness: any;
        happiness = this.prisonCaptorBillieHappiness();
        if (branchChoice == "choose") {
            this.outputText(this.images.showImage("prison-billie"));
            this.outputText("(Placeholder) Billie sneaks into your cell and says that she heard you moaning, and was worried about you. Now that she's here, she completely understands -- you've been a bad [boy] and Mistress has is letting your desire teach you a lesson. Knowing all too well how challenging such a lesson can be, she feels quite badly for you.\n\n");
            if (happiness > 0) {
                this.outputText("(Placeholder) Since she likes you so much, though, she's willing to help you out. Just don't tell Mistress! She'll be very upset if she finds out Billie helped you come without permission.\n\n");
                this.outputText("Do you accept Billie's offer?\n\n");
                this.menu();
                this.addButton(0, "Accept", this.prisonCaptorBilliePityFuck, 1);
                this.addButton(1, "Decline", this.prisonCaptorBilliePityFuck, 2);
                return;
            }
            this.outputText("(Placeholder) She wishes she could help you, but she's afraid that you really do need to learn your manners. Still, she wants to offer you some comfort, and decides she's going to feed you.\n\n");
            if (this.prison.prisonRestraintMouthLevel() > 0 && !(this.prison.prisonRestraintMouthLevel() == 4)) {
                this.outputText("(Placeholder) Billie temporarily removes your gag.\n\n");
            }
            this.outputText("(Placeholder) Billie then squats in front of you and starts furiously jacking off in front of your face.\n\n");
            if (this.prison.prisonRestraintMouthLevel() == 4) {
                this.outputText("Thanks to the ring gag holding your mouth open you have no choice but to open wide and wait for her to feed you.\n\n");
            }
            else {
                this.outputText("How do you respond?\n\n");
            }
            this.menu();
            this.addButton(0, "Open Wide", this.prisonCaptorBilliePityFuck, 3);
            if (this.prison.prisonRestraintMouthLevel() != 4) {
                this.addButton(1, "Wait", this.prisonCaptorBilliePityFuck, 4);
            }
            return;
        }
        if (branchChoice == "1") {
            this.outputText(this.images.showImage("prison-billie-fuck"));
            this.outputText("(Placeholder) Billie rolls you onto your stomach and fucks you very sweetly in your [vagOrAss].\n\n");
            if (rand(2) == 1) {
                this.outputText("(Placeholder) You cannot help but moan loudly as she pounds you, and before long the door opens and Mistress Elly enters the room. Billie immediately freezes and begs her forgiveness for her actions. Mistress Elly says she understands why Billie tried to help you, but they will have to have a stern talk when they get back to her cell. In the meantime, though, she directs Billie to finish what she started. Billie is effusive in her gratitude, and begs your Mistress to let her start apologizing how. She sits back on her legs, picks you up and sets you in her lap facing her, hugs you tightly, and begins to fuck your [vagOrAss] again. She then gives your Mistress a look of longing and begins to kiss you deeply.\n\n");
                this.outputText("(Placeholder) Mistress Elly seems to accept her offering and walks over to where you and Billie sit locked together at the hips. She then takes a firm grasp on each of your heads, shoves her cock between your mouths, and begins to use your faces to pleasure herself. This sends Billie into a state of ecstasy, and she begins to fuck at your [vagOrAss] like a jackrabbit, quickly pulling you into a similar state. Before long Mistress Elly begins to squirt between your lips, and as she paints the two of you white Billie erupts within you, dragging you through a series of messy orgasms as well.\n\n");
            }
            this.prisonCaptorBillieHappinessSet(0);
            this.player.orgasm('VaginalAnal');
        }
        else if (branchChoice == "2") {
            this.outputText(this.images.showImage("prison-billie-wet"));
            this.outputText("(Placeholder) Billie is surprised, but proud of you. She assumes that you have decided to take responsibility for your actions and learn from your lesson, and so she gives you a wet kiss on the cheek and leaves you be.\n\n");
            this.prisonCaptorBillieHappinessSet(0);
            this.prison.changeEsteem(1, this.prison.inPrison);
        }
        else if (branchChoice == "3") {
            this.outputText(this.images.showImage("prison-billie-seeding"));
            if (this.prison.prisonRestraintMouthLevel() == 4) {
                this.outputText("(Placeholder) Thanks to your ring gag, your mouth hangs open awaiting her deposit, and it isn't long before Billie fills it with a load of her sperm. ");
            }
            else {
                this.outputText("(Placeholder) Either out of hunger or lust your mouth opens wide, and it isn't long before Billie fills it with a load of her sperm. ");
            }
            this.outputText("She then gives you deep, loving kiss, petting your hair and gently stroking your throat to coax you into swallowing her gift.\n\n");
            if (this.prison.prisonRestraintMouthLevel() > 0 && !(this.prison.prisonRestraintMouthLevel() == 4)) {
                this.outputText("(Placeholder) She then replaces your gag. ");
            }
            this.outputText("As she leaves, she wishes you luck learning your lessons in the future.\n\n");
            this.prisonCaptorBillieHappinessSet(1);
            this.prison.changeEsteem(-1, this.prison.inPrison);
            this.player.refillHunger(10);
        }
        else if (branchChoice == "4") {
            this.outputText(this.images.showImage("prison-billie-seeding"));
            this.outputText("(Placeholder) Billie quickly brings herself to orgasm, coating your face with her cum. She is surprised that you didn't want to be fed, but proud of you. She assumes that you have decided to take responsibility for your actions and learn from your lesson, and so she gives you a wet kiss on the cheek, then after briefly getting distracted licking her own seed from your face, leaves you be.\n\n");
            if (this.prison.prisonRestraintMouthLevel() > 0 && !(this.prison.prisonRestraintMouthLevel() == 4)) {
                this.outputText("(Placeholder) She replaces your gag before she leaves. ");
            }
            this.prisonCaptorBillieHappinessSet(1);
            this.prison.changeEsteem(1, this.prison.inPrison);
        }

        this.doNext(this.camp.returnToCampUseOneHour);
    }

    public prisonCaptorBilliePunishmentFuck(branchChoice: string = "choose"): void {
        this.hideMenus();
        this.clearOutput();
        if (branchChoice == "choose") {
            this.prisonCaptorBillieMetChange(1);
            this.outputText(this.images.showImage("prison-billie"));
            this.outputText("(Placeholder) You assume a submissive position, by your [captorTitle] says \"<i>Actually, I've changed my mind. Don't worry, you're still going to get fucked, but you're going to help me reward a much better behaved slave in the process.</i>\" [captorhe] leaves the room momentarily, then returns with a buxom platinum blond with bunny ears and tail. Although her body is model of feminity, she appears to only be endowed with male genitals, and is quite well endowed at that. \n\n");
            this.outputText("\"<i>This is Billie. She's one of Scruffy's favorites, despite the fact that she seems incapable of sprouting a cunt for him to fuck no matter how hard she tries. Today, though, she gets to fuck you.</i>\" As [captorTitle] [captorName] explains, the bunny girl seems to quickly loose interest in studying you and is distracted by the sight of your [captorTitle]'s erect shaft. She very daintily falls to her knees, grabs hold of the tip, and begins licking her way up and down the underside of the shaft.\n\n");
            this.outputText("\"<i>Isn't she the sweetest little thing? As you can see, she's willing and eager to treat you right. Behave yourself, and I'll allow her to.</i>\" Billie attentions have begun to make your [captorTitle] drip precum, and she makes an alluring show of drawing out strings of it with her tongue until they fall and drip luridly across her perky tits. \"<i>But if you fail to live up to her example of good behavior, I'll have to make her punish you. It will make her sad, but she'll know it's for your own good.</i>\" At that Billie turns to face you, her hand still squeezing at the tip of the cock and her lips still sliding along its side, and fixes you with a sincere, plaintive look.\n\n");
            this.outputText("\"<i>Now, slave, are you going to make little Billie happy? Or are you going to make her sad?</i>\"\n\n");
            this.outputText("\n\n");
            this.menu();
            this.addButton(0, "Happy", this.prisonCaptorBilliePunishmentFuck, "happy");
            this.addButton(1, "Sad", this.prisonCaptorBilliePunishmentFuck, "sad");
            return;
        }
        if (branchChoice == "happy") {
            this.prisonCaptorBillieHappinessChange(2);
            this.outputText(this.images.showImage("prison-billie-seeding"));
            this.outputText("(Placeholder) Choose happy and you go and assist in blowing your [captorTitle], then are instructed to 69 with you on the bottom. Billie teases you by giving you excellent head but preventing you from coming, and fucks your throat savagely while doing so. Once she gets going, [captorTitle] [captorName] takes a turn in your mouth for extra lubrication, then begins to fuck her ass directly above your [face]. [captorTitle] [captorName] comes in her ass several times, and after each time she takes a turn at plowing your throat to clean her cock before it returns to Billie's eager asshole. All the while, cum drips down from Billie's ass, over her tiny balls, and all over your nose, cheeks, and brow. Finally [captorTitle] [captorName] withdraws and tells Billie to make you come, and as you explode she finally does as well, pumping your stomach full of her seed. The muscle spasms from her orgasm force more of [captorTitle] [captorName]'s cum out of her ass, soaking your [hair]. She then turns around and gives you a long passionate kiss, and if you have a dick, feeds you the cum she ingested from your orgasm.\n\n");
            this.player.orgasm('Lips');
        }
        else if (branchChoice == "sad") {
            this.prisonCaptorBillieHappinessChange(-2);
            this.outputText(this.images.showImage("prison-billie-sosad"));
            this.outputText("(Placeholder) Choose sad and you don't go to help with the BJ. Once [captorTitle] [captorName] sees your hesitation, she quickly pins you on your back. Before you know it your hands are bound above your head and fastened to an eyelet in the floor, and your calves are bound to your thighs. Restrained in this way, your legs are naturally raised and spread leaving your crotch and ass exposed. She then instructs Billie to begin fucking your ass. She does so gently at first with a pouty look on her face, until [captorTitle] [captorName] admonishes her for not teaching you your lesson properly. At that she begins pounding you with ferocity, and her face becomes a mask of passion. Assuming you have a cock or a cunt, though, she uses her hands to skillfully arouse you so that you are quickly moaning uncontrollably with every stroke. Once you are lost in pleasure, [captorTitle] [captorName] smothers your [face] with her cunt and instructs you to service her, which you do without complaint. If you have large enough tits, she wraps them around her dick and fucks them while you bury your tongue in her slit. [captorTitle] [captorName] and Billie each come several times, but don't stop using your body until you lose all control and beg repeatedly for release through the folds of her lower lips.\n\n");
            this.player.buttChange(24, true, true, false);
            this.player.orgasm('Anal');
        }
        this.menu();
        this.prison.changeObey(1, this.prison.inPrison);
        this.doNext(this.camp.returnToCampUseOneHour);
    }

}
