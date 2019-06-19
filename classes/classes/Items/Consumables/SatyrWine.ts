import { Consumable } from "../Consumable";
import { StatusEffects } from "../../StatusEffects";
import { CockTypesEnum } from "../../CockTypesEnum";
import { Neck } from "../../BodyParts/Neck";
import { Skin } from "../../BodyParts/Skin";
import { Arms } from "../../BodyParts/Arms";
import { LowerBody } from "../../BodyParts/LowerBody";
import { Horns } from "../../BodyParts/Horns";
import { Face } from "../../BodyParts/Face";
import { Ears } from "../../BodyParts/Ears";
import { Antennae } from "../../BodyParts/Antennae";
import { Tail } from "../../BodyParts/Tail";
import { kFLAGS } from "../../GlobalFlags/kFLAGS";

/**
 * Satyr Wine, part of the Black Cock by Foxxling
 * @author Kitteh6660
 */
export class SatyrWine extends Consumable {

    public constructor() {
        super("SatyrWn", "SatyrWine", "a bottle of satyr wine", 30, "A dark bottle with a brilliant red liquid sloshing around inside. On the label there is a picture of a satyr playing pipes.");
    }

    public useItem(): boolean {
        const tfSource: string = "satyrTFs";
        this.outputText("Feeling parched you tug the cork from a bottle of wine. As you put the bottle to your lips and drink the rich, invigorating liquid you soon find yourself with an empty bottle and a smile. ");
        this.player.refillHunger(10);
        this.mutations.initTransformation(undefined, 3);
        // Stats and genital changes
        if (SatyrWine.rand(2) == 0) {
            this.outputText("\n\nHeat floods your loins as thoughts of tight round asses and dripping pussies flood your mind.");
            this.dynStats("lus", 25);
            if (this.player.lib100 < 100) {
                if (this.player.lib100 < 50) this.dynStats("lib", 1);
                this.dynStats("lib", 1);
            }
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.hasCock() && this.player.cocks[this.player.smallestCockIndex()].cockLength < 12) {
            this.outputText("\n\nHeat funnels into your cock as the alcohol flushes through you. Reaching down to inspect it, you find it has grown longer.");
            this.player.cocks[this.player.smallestCockIndex()].cockLength++;
            this.changes++;
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.hasCock() && this.player.cocks[this.player.smallestCockIndex()].cockThickness < 4) {
            this.outputText("\n\nYou cock feels warm. When you reach down to inspect it your suspicions are confirmed; it's gotten thicker.");
            this.player.cocks[this.player.smallestCockIndex()].cockThickness += 0.5;
            this.changes++;
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.balls > 0) {
            this.outputText("\n\nYou feel a warmth rising into your face along with a bubbling of alcohol tickling your nose. Once it's subsided, you notice your face has a more masculine, angular shape to it.");
            // player.modFem(0, 2 + rand(4));
            this.dynStats("lus", 20);
            if (this.player.cumMultiplier < 10) this.player.cumMultiplier += 1;
            if (this.player.cumMultiplier < 50) this.player.cumMultiplier += 0.5;
            this.changes++;
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.hasVagina() && this.player.hasStatusEffect(StatusEffects.BonusVCapacity)) {
            this.outputText("\n\nYou feel a tingling sensation in your vagina… that was weird.");
            if (this.player.statusEffectv1(StatusEffects.BonusVCapacity) >= 0) {
                this.player.addStatusValue(StatusEffects.BonusVCapacity, 1, -(SatyrWine.rand(5) + 5));
                if (this.player.statusEffectv1(StatusEffects.BonusVCapacity) <= 0) this.player.removeStatusEffect(StatusEffects.BonusVCapacity);
            }
            this.changes++;
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.hasVagina() && !this.player.hasCock()) {
            this.outputText("\n\nYour vagina begins to feel hot. Removing your [armor], you look down and watch your vagina shrinks to nothing, <b>while your clitoris enlarges to form a human dick</b>.");
            this.player.removeVagina();
            this.player.createCock(6, 1, CockTypesEnum.HUMAN);
            this.changes++;
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.hasCock() && this.player.balls <= 0) {
            this.outputText("Without warning your body begins to tremble as just below [eachCock] you feel a warm trickling sensation of fluid sliding down your body. Before you can check it, the sensation becomes overwhelming as [eachCock] grows hard and ejaculates " + this.player.clothedOrNaked("into your [armor]", "all over the ground") + ". Once you've recovered from your intense orgasm you " + this.player.clothedOrNakedLower("remove your [armor] to ") + "clean yourself and find a <b>new pair of balls</b> hanging just below [eachCock].");
            this.player.balls = 2;
            this.player.ballSize = 1;
            this.player.orgasm('Generic');
            this.changes++;
        }
        // Transformations
        // Neck restore
        if (this.player.neck.type != Neck.NORMAL && this.changes < this.changeLimit && SatyrWine.rand(4) == 0) this.mutations.restoreNeck(tfSource);
        // Rear body restore
        if (this.player.hasNonSharkRearBody() && this.changes < this.changeLimit && SatyrWine.rand(5) == 0) this.mutations.restoreRearBody(tfSource);
        // Ovi perk loss
        if (SatyrWine.rand(5) == 0) this.mutations.updateOvipositionPerk(tfSource);

        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.hasScales()) {
            this.outputText("\n\nYou feel an odd rolling sensation as your scales begin to shift, spreading and reforming as they grow and disappear, <b>becoming normal human skin</b>.");
            this.player.skin.type = Skin.PLAIN;
            this.player.underBody.restore();
            this.changes++;
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.arms.type != Arms.HUMAN) {
            this.outputText("\n\nYou feel a pleasant heat in your arms as smoke rises from them, <b>leaving normal human arms</b>.");
            this.player.arms.type = Arms.HUMAN;
            this.changes++;
        }
        if (SatyrWine.rand(4) == 0 && this.changes < this.changeLimit && this.player.lowerBody.type != LowerBody.CLOVEN_HOOFED) {
            this.outputText("\n\nYou feel an odd sensation in your lower region. Your [feet] shift and you hear bones cracking as they reform. Fur grows on your legs and soon you're looking at a <b>new pair of goat legs</b>.");
            this.player.lowerBody.type = LowerBody.CLOVEN_HOOFED;
            this.player.lowerBody.legCount = 2;
            this.changes++;
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.lowerBody.type == LowerBody.CLOVEN_HOOFED && this.player.horns.type == Horns.GOAT && this.player.face.type != Face.HUMAN) {
            this.outputText("\n\nYour face grows warm as suddenly your vision is engulfed in smoke, coughing and beating the smoke back you noticed a marked change in your features. Touching yourself you confirm you have a <b>normal human shaped face once again</b>.");
            this.player.face.type = Face.HUMAN;
            this.changes++;
        }
        if (SatyrWine.rand(4) == 0 && this.changes < this.changeLimit && !this.player.hasScales() && this.player.ears.type != Ears.ELFIN) {
            this.outputText("\n\nYou feel an odd shifting sensation on the side of your head and, reaching up to inspect it, find a <b>pair of fleshy pointed ears</b>. ");
            if (this.player.hasFur()) this.outputText("As you examine your new elvish ears you feel fur grow around them, matching the rest of you.");
            this.player.ears.type = Ears.ELFIN;
            this.changes++;
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.horns.type == Horns.NONE) {
            this.outputText("\n\nYou begin to feel a prickling sensation at the top of your head. Reaching up to inspect it, you find a pair of hard stubs. <b>You now have a pair of goat horns.</b>");
            this.player.horns.type = Horns.GOAT;
            this.changes++;
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.horns.type != Horns.GOAT) {
            this.outputText("\n\nYou begin to feel an odd itching sensation as you feel your horns repositioning. Once it's over, you reach up and find a pair of hard stubs. <b>You now have a pair of goat horns.</b>");
            this.player.horns.value = 1;
            this.player.horns.type = Horns.GOAT;
            this.changes++;
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.horns.type == Horns.GOAT && this.player.horns.value == 1) {
            this.outputText("\n\nYou feel heat blooming in your forehead. Confused you reach up to find your goat horns growing and thickening into a pair of horns with ridges and a slight curve. <b>You now have a pair of tall-standing goat horns.</b>");
            this.player.horns.value = 2;
            this.changes++;
        }
        if (SatyrWine.rand(4) == 0 && this.changes < this.changeLimit && this.player.antennae.type != Antennae.NONE) {
            this.mutations.removeAntennae();
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.cockTotal() == 1 && this.player.countCocksOfType(CockTypesEnum.HUMAN) == 0) {
            this.outputText("\n\nYou feel a stirring in your loins as your cock grows rock hard. You " + this.player.clothedOrNakedLower("pull it out from your [armor], to ") + "take a look. It seems you now <b>have a human dick again</b>.");
            this.player.cocks[0].cockType = CockTypesEnum.HUMAN;
            this.changes++;
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.cockTotal() > 1 && (this.player.cockTotal() - this.player.countCocksOfType(CockTypesEnum.HUMAN)) > 0) {
            this.outputText("\n\nOne of your penises begins to feel strange. You " + this.player.clothedOrNakedLower("pull it out from your [armor], releasing", "notice") + " a plume of thick smoke. When you look down you see it has <b>become a human dick</b>.");
            for (let i: number = 0; i < this.player.cockTotal(); i++) {
                if (this.player.cocks[i].cockType != CockTypesEnum.HUMAN) {
                    this.player.cocks[i].cockType = CockTypesEnum.HUMAN;
                    break;
                }
            }
            this.changes++;
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.tail.type == 0) {
            this.outputText("\n\nYou feel an odd itchy sensation just above your [ass]. Twisting around to inspect it you find a short stubby tail that wags when you're happy. <b>You now have a goat tail.</b>");
            this.player.tail.type = Tail.GOAT;
            this.changes++;
        }
        if (SatyrWine.rand(3) == 0 && this.changes < this.changeLimit && this.player.tail.type > 0 && this.player.tail.type != Tail.GOAT) {
            this.outputText("\n\nYou [tail] suddenly goes numb. Looking back you see it changing, twisting and reforming into a <b>short stubby goat-like tail</b>.");
            this.player.tail.type = Tail.GOAT;
            this.changes++;
        }
        // No changes?
        if (this.changes == 0) {
            this.outputText("\n\nAside from a mild buzz, the wine has no further effect.");
        }
        this.flags[kFLAGS.TIMES_TRANSFORMED] += this.changes;
        return false;
    }
}
