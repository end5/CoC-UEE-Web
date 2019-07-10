import { Shop } from "./Shop";
import { Inventory } from "../../Inventory";
import { ItemType } from "../../../ItemType";

/**
 * Updated strings
 * @ContentAuthor Starglider
 */
export class JewelryShop extends Shop {
    private firstEntry: boolean = true;

    public enter(): void {
        this.spriteSelect(this.sprite);
        this.clearOutput();
        if (this.firstEntry) {
            this.outputText("Among the many markets of Tel'Adre, one oddity manages to snare " +
                "your attention. A simple stall with an askew sign reading 'Jewels!' in calamitous cursive. Its wares are " +
                "mostly shrouded by a hole-riddled awning, though small rays of desert sun make use of the tears to " +
                "playfully dazzle a collection of tarnished treasures. Metal-laced glassware, necklaces, rings, baubles, " +
                "clasps and more are haphazardly hung from the latticed walls.\n\n" +
                "In the uneven glow of glinting glassware sits a short figure, no more than 4 feet tall. His appearance is " +
                "shrouded by the hood and wraps of an all-concealing shawl, the opaque fabric patterned with distant " +
                "dunes and trimmed in a glimmer of gold-threaded tassles.\n\n" +
                "Your staring is interrupted by a passerby eclipsing your vision, and before you can even consider the " +
                "interruption you notice the one manning the stall is gone. Not a blink of the eye later and your wrist is " +
                "grasped by spindly fingers covered in a ratty, dirty gauze, the slightest hint of emerald scales revealing " +
                "themselves through cracks and tears. Despite the initial urge to stand your ground, the cloaked figure's " +
                "two-handed grip is surprisingly overbearing for such a short man. \"<i>Ah! Don't be ssshy! Don't be ssshy... " +
                "I could sssee your interesst, a [man] with a sssharp eye for beauty!</i>\" He waffles disarmingly as he " +
                "drags you to the stall, his short, strained movements causing his impressive collection of bangles to " +
                "clatter together noisily. Once getting you off the street, he hops onto the rackety counter, which " +
                "miraculously doesn't fall apart.\n\n" +
                "He gestures around to the multitude of adornments hanging in the stall. \"<i>Beautiful baubless and " +
                "gleaming gemstoness, only the finesst jewelry for the presstigious patron! Keheh!</i>\" The merchant " +
                "cackles as he grinds his gauzy gloves together, creating a rather discomforting, scratchy sound");
            this.firstEntry = false;
        } else {
            this.outputText("The jewelry merchant perks his head up a little as he sees you " +
                "approach, hailing your visit with a welcoming wave. \"<i>Kehehehe! Greetingss again, traveler. " +
                "Ssscrounged up the gemss to adorn yoursself with my waress? Let uss hope sso...</i>\" He goes silent, " +
                "knitting his gauzed fingers together as he observes your perusal.");
        }

        this.doNext(this.inside);
    }

    protected inside(): void {
        this.clearOutput();
        this.outputText("\"<i>So what will it be?</i>\"");
        this.menu();
        this.addButton(0, "Normal rings", this.normalRings);
        this.addButton(1, "Special rings", this.specialRings);
        this.addButton(2, "Enchanted rings", this.enchantedRings);
        this.addButton(5, "Jewelry box", JewelryShop.curry(this.confirmBuy, undefined, 500, Inventory.STORAGE_JEWELRY_BOX));
        this.addButton(14, "Leave", this.telAdre.telAdreMenu);
    }
    protected confirmBuy(itype: ItemType, priceOverride: number = -1, keyItem: string = ""): void {
        this.clearOutput();
        if (this.isJewelryBox(keyItem)) {
            if (this.player.hasKeyItem(Inventory.STORAGE_JEWELRY_BOX) >= 0) {
                this.outputText("<b>You already own a jewelry box!</b>");
                this.doNext(this.inside);
                return;
            }
            this.outputText("Your eyes rest on the shelf beyond the merchant, this one stocked with small " +
                "wooden boxes. The merchant, following your eyes with greed in his own, snatches a box off the shelf " +
                "and strokes its surface gently, producing a light hum \"<i>Ah! Keen again, what proud jewelry owner " +
                "would be without ssafe sstorage for their pricelesss gemss? Not you, not for a ssmall fee! Yess, with " +
                "one of thesse lockboxess, no marauder or ssilly fox in tightss wielding a kebab will ssnatch from you " +
                "your preciouss accesssoriess. If only chasstity beltss were as sstrong as my boxess... Ah, wouldn't be " +
                "much fun, though, would it? Keheheheh! 500 gemss!</i>\"");
        } else {
            this.outputText("The merchant stares at your hands as you point out the item with an almost " +
                "palpable excitement. \"<i>Ah, excellent choice!</i>\" He scoops up the accessory and hefts it a couple times in " +
                "his palm, \"<i>Keheh, I'd be willing to part with it for, ssay, " + itype.value + " gems?</i>\"");
        }
        super.confirmBuy(itype, priceOverride, keyItem);
    }

    protected noBuyOption(itype: ItemType, keyItem: string = ""): void {
        this.clearOutput();
        if (this.isJewelryBox(keyItem)) {
            this.outputText("You decline with a firm hand and a shake of your head, prompting the " +
                "merchant to whisper a growl. \"<i>Bah, fine! You'd besst have a good hiding place, then.</i>\" He leans a little " +
                "beyond the counter on his spindly arms, taking a look at your [butt]. He's stoic at first, " +
                "but he settles down to the tune of a chuckle.");
        } else {
            this.outputText("You decline the offer, causing the merchant to scoff and cross his arms. " +
                "\"<i>Mmn, dissappointing. Kehehehe, ssuit yourself!</i>\"");
        }
        this.doNext(this.inside);
    }

    protected debit(itype: ItemType, priceOverride: number = -1, keyItem: string = ""): void {
        if (this.isJewelryBox(keyItem)) {
            this.outputText("You nod a bit skeptically, but hand over the 500 gems. It's worth the " +
                "organizational value. You reach out to take the box from the counter, but he hisses rather alarmingly, " +
                "moving an arm to block you. Taken aback, you watch on as the odd little merchant checks the gem's " +
                "authenticity with dice-rolling and tapping. \"<i>Sseemsss all's in order. Thank you kindly! Keheheh...</i>\"\n\n" +
                "More carefully, you pick up the box without hassle and stow it away as the merchant does the same " +
                "with your gems");
        } else {
            this.outputText("The minute you finish counting out your gems, he snatches them from " +
                "your hand and replaces it with your purchase, quietly snickering to himself as he cradles the gems in " +
                "both hands.");
        }
        super.debit(itype, priceOverride, keyItem);
    }

    private normalRings(): void {
        this.clearOutput();
        this.outputText("A standard collection of jewelry hangs from small pegs on the left side of the " +
            "stall, gemmed and set in all manner of colors. The merchant taps his fingers together impatiently as you " +
            "peruse, giddily whispering to himself. ");
        this.menu();
        let button: number = 0;
        this.addButton(button++, this.jewelries.SILVRNG.shortName, this.confirmBuy, this.jewelries.SILVRNG);
        this.addButton(button++, this.jewelries.GOLDRNG.shortName, this.confirmBuy, this.jewelries.GOLDRNG);
        this.addButton(button++, this.jewelries.PLATRNG.shortName, this.confirmBuy, this.jewelries.PLATRNG);
        this.addButton(button++, this.jewelries.DIAMRNG.shortName, this.confirmBuy, this.jewelries.DIAMRNG);
        this.addButton(14, "Back", this.inside);
    }
    private specialRings(): void {
        this.clearOutput();
        this.outputText(" On the far wall is a shelf of rings hidden behind an out of place cabinet of " +
            "glass. Tags of papyrus paper stricken with odd arcane symbols are plastered all over the transparent " +
            "surface, almost concealing the collection within.\n\n" +
            "The merchant notices your staring and cackles, motioning to the display. \"<i>Ahh! An eye as sssharp as a " +
            "blade! You've picked the most intriguing dissplay in my sstore! Not that the resst of my waress aren't " +
            "intriguing. Thiss little duo hass a different story, however.</i>\" He taps the glass on the side before one of " +
            "the rings, a familiar dark stone stricken with cracks of red. \"<i>They're part of a sset, remnantss of a " +
            "tragedy you ssee. Legend hass it thesse rings were once beautiful maidenss! Thiss one here, jealouss of " +
            "itss counterpart, a bride to be. Before the ceremony, the lecherouss and jealouss maiden asssailed the " +
            "groom and sstole hiss purity. The bride to be, obsesssed with purity, sssacrificed hersself for a cursse, " +
            "turning both of their sssoulss to sstone. And so, this one here is the bride.</i>\" His hand moves a few " +
            "inches and taps the glass again, a contrastingly smooth stone of pearly white just beside it. " +
            "\"<i>Keheheheh... I wouldn't sssell a sssoul for cheap, would you? Let's start at 3,000.</i>\"");
        this.menu();
        let button: number = 0;
        this.addButton(button++, this.jewelries.LTHCRNG.shortName, this.confirmBuy, this.jewelries.LTHCRNG);
        this.addButton(button++, this.jewelries.PURERNG.shortName, this.confirmBuy, this.jewelries.PURERNG);
        this.addButton(14, "Back", this.inside);
    }
    private enchantedRings(): void {
        this.clearOutput();
        this.outputText("Frankly, it's just a collection of tarnished silver and scratchy  " +
            "gold. You'd probably find better jewelry on corpses. The peddler catches on, swatting a hanging " +
            "necklace away from his wrapped snout. \"<i>Bah! Of coursse, of coursse... Nothing in the dissplay ssstock " +
            "would sssuit you!</i>\" He reaches beneath the counter and pauses for a dramatic speech. \"<i>You're a traveler " +
            "of much mysstery and power, I can smell it on you. Sssorceriess sssurely ressonate with your sssoul!</i>\" " +
            "He delivers a small wooden box to the surface.\n\n" +
            "The box actually looks better than the jewelry you saw before. The wood is stained a brilliant color, and " +
            "laquered smooth like glass. The golden hinges are outlined in silver and shine brilliantly, the matching " +
            "locks in the front forming three identical sundials. With a single wrapped finger, the peculiar merchant " +
            "adjusts the dials, and with a subtle 'click' the box opens on its own. All the tiny drawers within unfold " +
            "like a pop-up book, revealing a small collection of rings. Their craftsmanship and elegance alone are " +
            "jaw-dropping, but there's something less tangibly appealing about them.\n\n" +
            "Seeing your expression, the shrouded man wheezes and glides a hand over the specialty wares. \"<i>The " +
            "powerful are invigorated by thesse ssstoness, but do not be brassh! Thesse jewelss compliment their " +
            "bearer in wayss you may not be expecting! Kehehehehe...</i>\" He fades into a bit of a cough, his reptillian " +
            "eyes revealed for but a moment.\n\n" +
            "Which tier of ring are you looking for?");
        this.menu();
        this.addButton(0, "Tier 1 rings", this.tieredRings, 1);

        if (this.player.level >= 10 || this.getGame().time.days >= 100) {
            this.addButton(1, "Tier 2 rings", this.tieredRings, 2);
        }

        if (this.player.level >= 20 || this.getGame().time.days >= 200) {
            this.addButton(2, "Tier 3 rings", this.tieredRings, 3);
        }

        this.addButton(14, "Back", this.inside);
    }
    private tieredRings(tier: number): void {
        this.menu();
        let button: number = 0;
        this.addButton(button++, this.jewelries["CRIMRN" + tier].shortName, this.confirmBuy, this.jewelries["CRIMRN" + tier]);
        this.addButton(button++, this.jewelries["FERTRN" + tier].shortName, this.confirmBuy, this.jewelries["FERTRN" + tier]);
        this.addButton(button++, this.jewelries["ICE_RN" + tier].shortName, this.confirmBuy, this.jewelries["ICE_RN" + tier]);
        this.addButton(button++, this.jewelries["CRITRN" + tier].shortName, this.confirmBuy, this.jewelries["CRITRN" + tier]);
        this.addButton(button++, this.jewelries["REGNRN" + tier].shortName, this.confirmBuy, this.jewelries["REGNRN" + tier]);
        this.addButton(button++, this.jewelries["LIFERN" + tier].shortName, this.confirmBuy, this.jewelries["LIFERN" + tier]);
        this.addButton(button++, this.jewelries["MYSTRN" + tier].shortName, this.confirmBuy, this.jewelries["MYSTRN" + tier]);
        this.addButton(button++, this.jewelries["POWRRN" + tier].shortName, this.confirmBuy, this.jewelries["POWRRN" + tier]);
        this.addButton(14, "Back", this.enchantedRings);

    }

    /**
     * Check if the passed key item is a Jewelry Box
     * @return true if a Jewelry Box
     */
    private isJewelryBox(keyItem: string): boolean {
        return keyItem === Inventory.STORAGE_JEWELRY_BOX;
    }
}
