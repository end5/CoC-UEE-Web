import { BaseContent } from "../../../BaseContent";
import { SpriteDb } from "../../../display/SpriteDb";
import { Dryad } from "./Dryad";

// Dryad Scene

export class DryadScene extends BaseContent {

    public encounterdryad(): void {
        this.clearOutput();
        // rustle in the bushes
        this.outputText("While walking through the  glade you notice a rustling in the bushes.   Do you investigate?\n\n");
        this.doYesNo(this.fightagainstdryad, this.camp.returnToCampUseOneHour);

    }
    public fightagainstdryad(): void {
        this.spriteSelect(SpriteDb.s_dryad);
        this.outputText("Walking up to where you heard the rustling, you notice what looks like a tree.   This tree appears to be wearing a dress made of leaves and straw.  You take a step closer and notice the tree has the silhouette of a slender woman.   Taking yet another step closer, you see this tree looks more like a person than a tree.   Her hair is thin vines with leaves growing off of them and she has a human-like face,  mouth, wooden arms, hands with claw-like fingers, legs and feet.   Before you can decide what to think her eyes pop open, glowing red, hungry eyes. . . Her lips curl into a wicked smile and she lunges at you! ");
        this.startCombat(new Dryad());
    }
    public winagainstdryad(): void {
        this.clearOutput();
        this.outputText("The dryad creaks like old wood as she collapses to the ground, too [if (monster.HP <= 0)injured|aroused] to continue fighting. ");
        if (this.player.hasCock() && this.player.lust >= 33) {
            this.outputText("\n\nWhile gazing on her prone figure carnal desire wells up inside you.   Do you have your way with her? ");
            this.doYesNo(this.winAgainstdryadRape, this.combat.cleanupAfterCombat);
        }
        else {
            this.combat.cleanupAfterCombat();
        }
    }

    public winAgainstdryadRape(): void {
        this.clearOutput();

        if (this.player.hasCock()) {
            this.outputText("Crouching down beside her, you run your hands up her legs pulling her dress up while doing so.   Seeing her girly parts exposed, you remove your armor and whip out your member.  You roll her onto her stomach and place both hands on her hips.   Throwing caution into the wind, you roughly plow her and immediately regret it.   Your [cock] receives numerous splinters and pull out receiving even more.   You stagger from the pain and limp back to camp. ");
        }
        else
            this.outputText("You saunter over to the defeated dryad and roughly grab her by the hair.  \n  'Lick it!' you demand and she she complies.   You keep her licking until you are satisfied then toss her aside and head back to camp smelling of tree sap.");
        this.dynStats("lib", -2, "cor", 3);
        this.combat.cleanupAfterCombat();
    }

    public loseTodryad(fromBattle: boolean = true): void {
        this.clearOutput();
        if (fromBattle) this.outputText("Too badly " + (this.player.HP <= 0 ? "injured" : "aroused") + " by the dryad, you give in  and let her she wants to you.\n\n");
        if (this.player.hasCock()) {
            this.outputText("The dryad rushes towards you and wraps her arms around you.   Her bark-like skin is cold and rough.   Your bodies entangle as her sap rubs onto your person.    She places a hand behind your head and locks eyes with you.   Her glowing red eyes burn desire into your skull.   Her lips part and she frenchs you deeply.\n\n");
            this.outputText("Seeing you suitably aroused, she tears into your clothing until your [cock]  is exposed.\n");
            this.outputText("'Pollinate me' !  she demands hungrily.");
            this.outputText("She places her hand on your [cock] and sticky sap oozes from her palm lubricates your member.\n");
            this.outputText("Greedily, her hand jerks your member until you feel like you are about to burst.   She senses this and kneels in front of your [cock].   Her leaf hair falls down in front of her face as you spray all over her hair and face.\n");
            this.outputText("Satisfied, she stands up and looks at you one last time 'I will to shed a thousand seeds.'   As she steps away her leaf-hair seems to brighten and flowers start to bud from her locks.\n");
            this.outputText("You wake up several hours later wondering what just happened.\n");
        } else {
            this.outputText("The dryad sees that you no longer have the ability to fight.   You open your mouth to say something but she kisses you to keep you from talking.    Thus, your words come out as a surprised squeaking sounds.   She works her way around your body kissing and groping as she goes.   She continues working away until you are a shuddering mess in her arms");
        }
        this.player.orgasm('Generic');
        this.dynStats("lib", -2, "cor", 3);
        if (fromBattle)
            this.combat.cleanupAfterCombat();
        else
            this.doNext(this.camp.returnToCampUseTwoHours);
    }
}
