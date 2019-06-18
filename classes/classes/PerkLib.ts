import { PerkType } from "./PerkType";
import { AscensionDesiresPerk } from "./Perks/AscensionDesiresPerk";
import { AscensionEndurancePerk } from "./Perks/AscensionEndurancePerk";
import { AscensionFertilityPerk } from "./Perks/AscensionFertilityPerk";
import { AscensionFortunePerk } from "./Perks/AscensionFortunePerk";
import { AscensionMoralShifterPerk } from "./Perks/AscensionMoralShifterPerk";
import { AscensionMysticalityPerk } from "./Perks/AscensionMysticalityPerk";
import { AscensionTolerancePerk } from "./Perks/AscensionTolerancePerk";
import { AscensionVirilityPerk } from "./Perks/AscensionVirilityPerk";
import { AscensionWisdomPerk } from "./Perks/AscensionWisdomPerk";
import { RegenerationPerk } from "./Perks/RegenerationPerk";
import { Regeneration2Perk } from "./Perks/Regeneration2Perk";
import { PiercedCrimstonePerk } from "./Perks/PiercedCrimstonePerk";
import { PiercedIcestonePerk } from "./Perks/PiercedIcestonePerk";
import { PiercedFertitePerk } from "./Perks/PiercedFertitePerk";
import { PentUpPerk } from "./Perks/PentUpPerk";
import { SluttySeductionPerk } from "./Perks/SluttySeductionPerk";
import { WizardsEndurancePerk } from "./Perks/WizardsEndurancePerk";
import { WizardsFocusPerk } from "./Perks/WizardsFocusPerk";
import { SpellcastingAffinityPerk } from "./Perks/SpellcastingAffinityPerk";
import { MilkMaidPerk } from "./Perks/MilkMaidPerk";
import { ElvenBountyPerk } from "./Perks/ElvenBountyPerk";
import { ControlledBreathPerk } from "./Perks/ControlledBreathPerk";
import { CleansingPalmPerk } from "./Perks/CleansingPalmPerk";
import { EnlightenedPerk } from "./Perks/EnlightenedPerk";
import { Player } from "./Player";
import { StatusEffects } from "./StatusEffects";

/**
 * Created by aimozg on 26.01.14.
 */

export class PerkLib {

    // UNSORTED perks TODO these are mostly incorrect perks: tested but never created
    public static Buttslut = PerkLib.mk("Buttslut", "Buttslut",
        "");
    public static Focused = PerkLib.mk("Focused", "Focused",
        "");
    /* Never used, removed because it used a numbered event. Could be re-implemented differently if some new monster actually uses it
            public static  LastStrike = mk("Last Strike", "Last Strike",
                    "");
            public static  AnalFertility = mk("Anal Fertility", "Anal Fertility", //Not implemented
                    "Unlocks the ability to get anally pregnant other than Satyrs.");

    */
    // Player creation perks
    public static Fast = PerkLib.mk("Fast", "Fast",
        "Gains speed 25% faster.", undefined, true);
    public static Lusty = PerkLib.mk("Lusty", "Lusty",
        "Gains lust 25% faster.", undefined, true);
    public static Pervert = PerkLib.mk("Pervert", "Pervert",
        "Gains corruption 25% faster. Reduces corruption requirement for high-corruption variant of scenes.", undefined, true);
    public static Sensitive = PerkLib.mk("Sensitive", "Sensitive",
        "Gains sensitivity 25% faster.", undefined, true);
    public static Smart = PerkLib.mk("Smart", "Smart",
        "Gains intelligence 25% faster.", undefined, true);
    public static Strong = PerkLib.mk("Strong", "Strong",
        "Gains strength 25% faster.", undefined, true);
    public static Tough = PerkLib.mk("Tough", "Tough",
        "Gains toughness 25% faster.", undefined, true);
    // Female creation perks
    public static BigClit = PerkLib.mk("Big Clit", "Big Clit",
        "Allows your clit to grow larger more easily and faster.", undefined, true);
    public static BigTits = PerkLib.mk("Big Tits", "Big Tits",
        "Makes your tits grow larger more easily.", undefined, true);
    public static Fertile = PerkLib.mk("Fertile", "Fertile",
        "Makes you 15% more likely to become pregnant.", undefined, true);
    public static WetPussy = PerkLib.mk("Wet Pussy", "Wet Pussy",
        "Keeps your pussy wet and provides a bonus to capacity.", undefined, true);
    // Male creation perks
    public static BigCock = PerkLib.mk("Big Cock", "Big Cock",
        "Gains cock size 25% faster and with less limitations.", undefined, true);
    public static MessyOrgasms = PerkLib.mk("Messy Orgasms", "Messy Orgasms",
        "Produces 50% more cum volume.", undefined, true);

    // Ascension perks
    public static AscensionDesires = new AscensionDesiresPerk();
    public static AscensionEndurance = new AscensionEndurancePerk();
    public static AscensionFertility = new AscensionFertilityPerk();
    public static AscensionFortune = new AscensionFortunePerk();
    public static AscensionMoralShifter = new AscensionMoralShifterPerk();
    public static AscensionMysticality = new AscensionMysticalityPerk();
    public static AscensionTolerance = new AscensionTolerancePerk();
    public static AscensionVirility = new AscensionVirilityPerk();
    public static AscensionWisdom = new AscensionWisdomPerk();

    // History perks
    public static HistoryAlchemist = PerkLib.mk("History: Alchemist", "History: Alchemist",
        "Alchemical experience makes items more reactive to your body.", undefined, true);
    public static HistoryFighter = PerkLib.mk("History: Fighter", "History: Fighter",
        "A Past full of conflict increases physical damage dealt by 10%.", undefined, true);
    public static HistoryFortune = PerkLib.mk("History: Fortune", "History: Fortune",
        "Your luck and skills at gathering currency allows you to get 15% more gems from victories.", undefined, true);
    public static HistoryHealer = PerkLib.mk("History: Healer", "History: Healer",
        "Healing experience increases HP gains by 20%.", undefined, true);
    public static HistoryReligious = PerkLib.mk("History: Religious", "History: Religious",
        "Replaces masturbate with meditate when corruption less than or equal to 66. Reduces minimum libido slightly.", undefined, true);
    public static HistoryScholar = PerkLib.mk("History: Scholar", "History: Scholar",
        "Time spent focusing your mind makes spellcasting 20% less fatiguing.", undefined, true);
    public static HistorySlacker = PerkLib.mk("History: Slacker", "History: Slacker",
        "Regenerate fatigue 20% faster.", undefined, true);
    public static HistorySlut = PerkLib.mk("History: Slut", "History: Slut",
        "Sexual experience has made you more able to handle large insertions and more resistant to stretching.", undefined, true);
    public static HistorySmith = PerkLib.mk("History: Smith", "History: Smith",
        "Knowledge of armor and fitting increases armor effectiveness by roughly 10%.", undefined, true);
    public static HistoryWhore = PerkLib.mk("History: Whore", "History: Whore",
        "Seductive experience causes your tease attacks to be 15% more effective.", undefined, true);

    // Ordinary (levelup) perks
    public static Acclimation = PerkLib.mk("Acclimation", "Acclimation",
        "Reduces lust gain by 15%.",
        "You choose the 'Acclimation' perk, making your body 15% more resistant to lust, up to a maximum of 75%.");
    public static Agility = PerkLib.mk("Agility", "Agility",
        "Boosts armor points by a portion of your speed on light/medium armors.",
        "You choose the 'Agility' perk, increasing the effectiveness of Light/Medium armors by a portion of your speed.");
    public static Archmage = PerkLib.mk("Archmage", "Archmage",
        "[if (player.inte>=75)" +
        "Increases base spell strength by 50%." +
        "|" +
        "<b>You are too dumb to gain benefit from this perk.</b>" +
        "]",
        "You choose the 'Archmage' perk, increasing base spell strength by 50%.");
    public static ArousingAura = PerkLib.mk("Arousing Aura", "Arousing Aura",
        "Exude a lust-inducing aura (Req's corruption of 70 or more)",
        "You choose the 'Arousing Aura' perk, causing you to radiate an aura of lust when your corruption is over 70.");
    public static Battlemage = PerkLib.mk("Battlemage", "Battlemage",
        "Start every battle with Might enabled, if you meet Black Magic requirements before it starts.",
        "You choose the 'Battlemage' perk. You start every battle with Might effect, as long as your Lust is sufficient to cast it before battle.");
    public static Berzerker = PerkLib.mk("Berzerker", "Berserker",
        "[if (player.str>=75)" +
        "Grants 'Berserk' ability." +
        "|" +
        "<b>You aren't strong enough to benefit from this anymore.</b>" +
        "]",
        "You choose the 'Berserker' perk, which unlocks the 'Berserk' magical ability.  Berserking increases attack and lust resistance but reduces physical defenses.");
    public static Blademaster = PerkLib.mk("Blademaster", "Blademaster",
        "Gain +5% to critical strike chance when wielding a sword and not using a shield.",
        "You choose the 'Blademaster' perk.  Your chance of critical hit is increased by 5% as long as you're wielding a sword and not using a shield.");
    public static Brawler = PerkLib.mk("Brawler", "Brawler",
        "Brawling experience allows you to make two unarmed attacks in a turn.",
        "You choose the 'Brawler' perk, allowing you to make two unarmed attacks in a turn!");
    public static BrutalBlows = PerkLib.mk("Brutal Blows", "Brutal Blows",
        "[if (player.str>=75)" +
        "Reduces enemy armor with each hit." +
        "|" +
        "<b>You aren't strong enough to benefit from this anymore.</b>" +
        "]",
        "You choose the 'Brutal Blows' perk, which reduces enemy armor with each hit.");
    public static Channeling = PerkLib.mk("Channeling", "Channeling",
        "Increases base spell strength by 50%.",
        "You choose the 'Channeling' perk, boosting the strength of your spellcasting!");
    public static ColdBlooded = PerkLib.mk("Cold Blooded", "Cold Blooded",
        "Reduces minimum lust by up to 20, down to min of 20. Caps min lust at 80.",
        "You choose the 'Cold Blooded' perk.  Thanks to increased control over your desires, your minimum lust is reduced! (Caps minimum lust at 80. Won't reduce minimum lust below 20 though.)");
    public static ColdFury = PerkLib.mk("Cold Fury", "Cold Fury",
        "Berserking halves your defense instead of reducing to zero.",
        "You choose the 'Cold Fury' perk, causing Berserking to only reduce your armor by half instead of completely reducing to zero.");
    public static CorruptedLibido = PerkLib.mk("Corrupted Libido", "Corrupted Libido",
        "Reduces lust gain by 10%.",
        "You choose the 'Corrupted Libido' perk.  As a result of your body's corruption, you've become a bit harder to turn on. (Lust gain reduced by 10%!)");
    public static DoubleAttack = PerkLib.mk("Double Attack", "Double Attack",
        "[if (player.spe<50)" +
        "<b>You're too slow to double attack!</b>" +
        "|[if (player.str<61)" +
        "Allows you to perform two melee attacks per round." +
        "|" +
        "<b>You are stronger than double attack allows.  To choose between reduced strength double-attacks and a single strong attack, access \"Dbl Options\" in the perks menu.</b>" +
        "]]",
        "You choose the 'Double Attack' perk.  This allows you to make two attacks so long as your strength is at 60 or below.  By default your effective strength will be reduced to 60 if it is too high when double attacking.  <b>You can enter the perks menu at any time to toggle options as to how you will use this perk.</b>");
    public static Evade = PerkLib.mk("Evade", "Evade",
        "Increases chances of evading enemy attacks.",
        "You choose the 'Evade' perk, allowing you to avoid enemy attacks more often!");
    public static FertilityMinus = PerkLib.mk("Fertility-", "Fertility-",
        "Decreases fertility rating by 15 and cum volume by up to 30%. (Req's libido of less than 25.)",
        "You choose the 'Fertility-' perk, making it harder to get pregnant.  It also decreases your cum volume by up to 30% (if appropriate)!");
    public static FertilityPlus = PerkLib.mk("Fertility+", "Fertility+",
        "Increases fertility rating by 15 and cum volume by up to 50%.",
        "You choose the 'Fertility+' perk, making it easier to get pregnant.  It also increases your cum volume by up to 50% (if appropriate)!");
    public static FocusedMind = PerkLib.mk("Focused Mind", "Focused Mind",
        "Black Magic is less likely to backfire and White Magic threshold is increased.",
        "You choose the 'Focused Mind' perk. Black Magic is less likely to backfire and White Magic threshold is increased.");
    public static HoldWithBothHands = PerkLib.mk("Hold With Both Hands", "Hold With Both Hands",
        "Gain +20% strength modifier with melee weapons when not using a shield.",
        "You choose the 'Hold With Both Hands' perk.  As long as you're wielding a melee weapon and you're not using a shield, you gain 20% strength modifier to damage.");
    public static HotBlooded = PerkLib.mk("Hot Blooded", "Hot Blooded",
        "Raises minimum lust by up to 20.",
        "You choose the 'Hot Blooded' perk.  As a result of your enhanced libido, your lust no longer drops below 20! (If you already have some minimum lust, it will be increased by 10)");
    public static ImmovableObject = PerkLib.mk("Immovable Object", "Immovable Object",
        "[if (player.tou>=75)" +
        "Grants 10% physical damage reduction.</b>" +
        "|" +
        "<b>You aren't tough enough to benefit from this anymore.</b>" +
        "]",
        "You choose the 'Immovable Object' perk, granting 10% physical damage reduction.</b>");
    public static ImprovedEndurance = PerkLib.mk("Improved Endurance", "Improved Endurance",
        "Increases maximum fatigue by 20.",
        "You choose the 'Improved Endurance' perk. Thanks to your physical conditioning, your maximum fatigue has been increased by 20!</b>");
    public static ImprovedEndurance2 = PerkLib.mk("Improved Endurance 2", "Improved Endurance 2",
        "Increases maximum fatigue by further 10.",
        "You choose the 'Improved Endurance 2' perk. Thanks to your improved physical conditioning, your maximum fatigue has been increased by further 10!</b>");
    public static ImprovedEndurance3 = PerkLib.mk("Improved Endurance 3", "Improved Endurance 3",
        "Increases maximum fatigue by further 10.",
        "You choose the 'Improved Endurance 2' perk. Thanks to your superior physical conditioning, your maximum fatigue has been increased by further 10!</b>");
    public static ImprovedSelfControl = PerkLib.mk("Improved Self-Control", "Improved Self-Control",
        "Increases maximum lust by 20.",
        "You choose the 'Improved Self-Control' perk. Thanks to your mental conditioning, your maximum lust has been increased by 20!</b>");
    public static ImprovedSelfControl2 = PerkLib.mk("Improved Self-Control 2", "Improved Self-Control 2",
        "Increases maximum lust by further 10.",
        "You choose the 'Improved Self-Control 2' perk. Thanks to your improved mental conditioning, your maximum lust has been increased by further 10!</b>");
    public static ImprovedSelfControl3 = PerkLib.mk("Improved Self-Control 3", "Improved Self-Control 3",
        "Increases maximum lust by further 10.",
        "You choose the 'Improved Self-Control 2' perk. Thanks to your superior mental conditioning, your maximum lust has been increased by further 10!</b>");
    public static ImprovedVision = PerkLib.mk("Improved Vision", "Improved Vision",
        "Improves your vision allowing you to see openings most wouldn't (+3% Crit)",
        "You've chosen the 'Improved Vision' perk, which raises your critical strike chance by 3%.");
    public static ImprovedVision2 = PerkLib.mk("Improved Vision 2", "Improved Vision 2",
        "Improves your vision allowing you to see openings most wouldn't (+7% Crit)",
        "You've chosen the 'Improved Vision 2' perk, which raises your critical strike chance by 7%.");
    public static ImprovedVision3 = PerkLib.mk("Improved Vision 3", "Improved Vision 3",
        "Improves your vision allowing you to see openings most wouldn't (+10% Crit)",
        "You've chosen the 'Improved Vision 3' perk, which raises your critical strike chance by 10%.");
    public static Indefatigable = PerkLib.mk("Indefatigable", "Indefatigable",
        "Can no longer lose by lust. Can still submit manually at maximum lust via Fantasize.",
        "You choose the 'Indefatigable' perk. Thanks to your sheer willpower, you can no longer lose when your lust reaches maximum. (Choosing Fantasize at maximum lust still allows you to submit.)");
    public static IronFists = PerkLib.mk("Iron Fists", "Iron Fists",
        "Hardens your fists to increase attack rating by 5.",
        "You choose the 'Iron Fists' perk, hardening your fists. This increases attack power of unarmed attacks by 5 and gauntlets by 2.");
    public static IronFists2 = PerkLib.mk("Iron Fists 2", "Iron Fists 2",
        "Further hardens your fists to increase attack rating by another 3.",
        "You choose the 'Iron Fists 2' perk, further hardening your fists. This increases attack power of unarmed attacks by another 3 and gauntlets by 1.");
    public static IronFists3 = PerkLib.mk("Iron Fists 3", "Iron Fists 3",
        "Even more hardens your fists to increase attack rating again by 3.",
        "You choose the 'Iron Fists 3' perk, even further hardening your fists. This increases attack power of unarmed attacks again by another 3 and gauntlets by 1.");
    public static IronMan = PerkLib.mk("Iron Man", "Iron Man",
        "Reduces the fatigue cost of physical specials by 50%.",
        "You choose the 'Iron Man' perk, reducing the fatigue cost of physical special attacks by 50%");
    public static Juggernaut = PerkLib.mk("Juggernaut", "Juggernaut",
        "When wearing heavy armor, you have extra 10 armor points and are immune to damage from being constricted/squeezed.",
        "You choose the 'Juggernaut' perk, granting extra 10 armor points when wearing heavy armor and immunity to damage from been constricted/squeezed.");
    public static LightningStrikes = PerkLib.mk("Lightning Strikes", "Lightning Strikes",
        "[if (player.spe>=60)" +
        "Increases the attack damage for non-heavy weapons.</b>" +
        "|" +
        "<b>You are too slow to benefit from this perk.</b>" +
        "]",
        "You choose the 'Lightning Strikes' perk, increasing the attack damage for non-heavy weapons.</b>");
    public static LungingAttacks = PerkLib.mk("Lunging Attacks", "Lunging Attacks",
        "[if (player.spe>=75)" +
        "Grants 50% armor penetration for standard attacks." +
        "|" +
        "<b>You are too slow to benefit from this perk.</b>" +
        "]",
        "You choose the 'Lunging Attacks' perk, granting 50% armor penetration for standard attacks.");
    public static Mage = PerkLib.mk("Mage", "Mage",
        "Increases base spell strength by 50%.",
        "You choose the 'Mage' perk.  You are able to focus your magical abilities even more keenly, boosting your base spell effects by 50%.");
    public static Masochist = PerkLib.mk("Masochist", "Masochist",
        "Take 20% less physical damage but gain lust when you take damage.",
        "You choose the 'Masochist' perk, reducing the damage you take but raising your lust each time!  This perk only functions while your libido is at or above 60!");
    public static Medicine = PerkLib.mk("Medicine", "Medicine",
        "Grants 15% chance per round of cleansing poisons/drugs from your body. Increases HP restoration on rest.",
        "You choose the 'Medicine' perk, giving you a chance to remove debilitating poisons automatically! Also, increases HP restoration on rest.");
    public static Nymphomania = PerkLib.mk("Nymphomania", "Nymphomania",
        "Raises minimum lust by up to 30.",
        "You've chosen the 'Nymphomania' perk.  Due to the incredible amount of corruption you've been exposed to, you've begun to live in a state of minor constant arousal.  Your minimum lust will be increased by as much as 30 (If you already have minimum lust, the increase is 10-15).");
    public static Parry = PerkLib.mk("Parry", "Parry",
        "[if (player.spe>=50)" +
        "Increases deflect chance by up to 10% while wielding a weapon. (Speed-based)." +
        "|" +
        "<b>You are not durable enough to gain benefit from this perk.</b>" +
        "]",
        "You choose the 'Parry' perk, giving you a chance to deflect blow with your weapon. (Speed-based).");
    public static Precision = PerkLib.mk("Precision", "Precision",
        "Reduces enemy armor by 10. (Req's 25+ Intelligence)",
        "You've chosen the 'Precision' perk.  Thanks to your intelligence, you're now more adept at finding and striking an enemy's weak points, reducing their damage resistance from armor by 10.  If your intelligence ever drops below 25 you'll no longer be smart enough to benefit from this perk.");
    public static RagingInferno = PerkLib.mk("Raging Inferno", "Raging Inferno",
        "Cumulative 20% damage increase for every subsequent fire spell without interruption.",
        "You choose the 'Raging Inferno' perk. Cumulative 20% damage increase for every subsequent fire spell without interruption.");
    public static Regeneration = new RegenerationPerk();
    public static Regeneration2 = new Regeneration2Perk();
    public static Resistance = PerkLib.mk("Resistance", "Resistance",
        "Reduces lust gain by 10%.",
        "You choose the 'Resistance' perk, reducing the rate at which your lust increases by 10%.");
    public static Resolute = PerkLib.mk("Resolute", "Resolute",
        "[if (player.tou>=75)" +
        "Grants immunity to stuns and some statuses.</b>" +
        "|" +
        "<b>You aren't tough enough to benefit from this anymore.</b>" +
        "]",
        "You choose the 'Resolute' perk, granting immunity to stuns and some statuses.</b>");
    public static Runner = PerkLib.mk("Runner", "Runner",
        "Increases chances of escaping combat.",
        "You choose the 'Runner' perk, increasing your chances to escape from your foes when fleeing!");
    public static Sadist = PerkLib.mk("Sadist", "Sadist",
        "Deal 20% more damage, but gain lust at the same time.",
        "You choose the 'Sadist' perk, increasing damage by 20 percent but causing you to gain lust from dealing damage.");
    public static Seduction = PerkLib.mk("Seduction", "Seduction",
        "Upgrades your tease attack, making it more effective.",
        "You choose the 'Seduction' perk, upgrading the 'tease' attack with a more powerful damage and a higher chance of success.");
    public static ShieldMastery = PerkLib.mk("Shield Mastery", "Shield Mastery",
        "[if (player.tou>=50)" +
        "Increases block chance by up to 10% while using a shield (Toughness-based)." +
        "|" +
        "<b>You are not durable enough to gain benefit from this perk.</b>" +
        "]",
        "You choose the 'Shield Mastery' perk, increasing block chance by up to 10% as long as you're wielding a shield (Toughness-based).");
    public static ShieldSlam = PerkLib.mk("Shield Slam", "Shield Slam",
        "Reduces shield bash diminishing returns by 50% and increases bash damage by 20%.",
        "You choose the 'Shield Slam' perk.  Stun diminishing returns is reduced by 50% and shield bash damage is increased by 20%.");
    public static SpeedyRecovery = PerkLib.mk("Speedy Recovery", "Speedy Recovery",
        "Regain fatigue 50% faster.",
        "You choose the 'Speedy Recovery' perk, boosting your fatigue recovery rate!");
    public static Spellpower = PerkLib.mk("Spellpower", "Spellpower",
        "Increases base spell strength by 50%.",
        "You choose the 'Spellpower' perk.  Thanks to your sizeable intellect and willpower, you are able to more effectively use magic, boosting base spell effects by 50%.");
    public static Spellsword = PerkLib.mk("Spellsword", "Spellsword",
        "Start every battle with Charge Weapon enabled, if you meet White Magic requirements before it starts.",
        "You choose the 'Spellsword' perk. You start every battle with Charge Weapon effect, as long as your Lust is not preventing you from casting it before battle.");
    public static Survivalist = PerkLib.mk("Survivalist", "Survivalist",
        "Slows hunger rate by 20%.",
        "You choose the 'Survivalist' perk.  With this perk, your hunger rate is reduced by 20%.");
    public static Survivalist2 = PerkLib.mk("Survivalist 2", "Survivalist 2",
        "Slows hunger rate by further 20%.",
        "You choose the 'Survivalist 2' perk.  With this perk, your hunger rate is reduced by another 20%.");
    public static StaffChanneling = PerkLib.mk("Staff Channeling", "Staff Channeling",
        "Basic attack with wizard's staff is replaced with ranged magic bolt.",
        "You choose the 'Staff Channeling' perk. Basic attack with wizard's staff is replaced with ranged magic bolt.");
    public static StrongBack = PerkLib.mk("Strong Back", "Strong Back",
        "Enables fourth item slot.",
        "You choose the 'Strong Back' perk, enabling a fourth item slot.");
    public static StrongBack2 = PerkLib.mk("Strong Back 2: Strong Harder", "Strong Back 2: Strong Harder",
        "Enables fifth item slot.",
        "You choose the 'Strong Back 2: Strong Harder' perk, enabling a fifth item slot.");
    public static Tactician = PerkLib.mk("Tactician", "Tactician",
        "[if (player.inte>=50)" +
        "Increases critical hit chance by 1% per 5 points intelligence above 50." +
        "|" +
        "<b>You are too dumb to gain benefit from this perk.</b>" +
        "]",
        "You choose the 'Tactician' perk, increasing critical hit chance by 1% per 5 points intelligence above 50.");
    public static Tank = PerkLib.mk("Tank", "Tank",
        "Raises max HP by 50.",
        "You choose the 'Tank' perk, giving you an additional 50 HP!");
    public static Tank2 = PerkLib.mk("Tank 2", "Tank 2",
        "+1 extra HP per point of toughness.",
        "You choose the 'Tank 2' perk, granting an extra maximum HP for each point of toughness.");
    public static Tank3 = PerkLib.mk("Tank 3", "Tank 3",
        "+5 extra HP per character level.",
        "You choose the 'Tank 3' perk, granting 5 extra maximum HP for each level.");
    public static TitanGrip = PerkLib.mk("Titan Grip", "Titan Grip",
        "Allows you to wield large weapons in one hand, granting shield usage.",
        "You choose the 'Titan Grip' perk. Thanks to your incredible strength, you can now wield large weapons with one hand!");
    public static ThunderousStrikes = PerkLib.mk("Thunderous Strikes", "Thunderous Strikes",
        "+20% 'Attack' damage while strength is at or above 80.",
        "You choose the 'Thunderous Strikes' perk, increasing normal damage by 20% while your strength is over 80.");
    public static Unhindered = PerkLib.mk("Unhindered", "Unhindered",
        "Increases chances of evading enemy attacks when you are naked. (Undergarments won't disable this perk.)",
        "You choose the 'Unhindered' perk, granting chance to evade when you are naked.");
    public static WeaponMastery = PerkLib.mk("Weapon Mastery", "Weapon Mastery",
        "[if (player.str>60)" +
        "Doubles damage bonus of weapons classified as 'Large'." +
        "|" +
        "<b>You aren't strong enough to benefit from this anymore.</b>" +
        "]",
        "You choose the 'Weapon Mastery' perk, doubling the effectiveness of large weapons.");
    public static WellAdjusted = PerkLib.mk("Well Adjusted", "Well Adjusted",
        "You gain half as much lust as time passes in Mareth.",
        "You choose the 'Well Adjusted' perk, reducing the amount of lust you naturally gain over time while in this strange land!");

    // Needlework perks
    public static ChiReflowAttack = PerkLib.mk("Chi Reflow - Attack", "Chi Reflow - Attack",
        "Regular attacks boosted, but damage resistance decreased.");
    public static ChiReflowDefense = PerkLib.mk("Chi Reflow - Defense", "Chi Reflow - Defense",
        "Passive damage resistance, but caps speed");
    public static ChiReflowLust = PerkLib.mk("Chi Reflow - Lust", "Chi Reflow - Lust",
        "Lust resistance and Tease are enhanced, but Libido and Sensitivity gains increased.");
    public static ChiReflowMagic = PerkLib.mk("Chi Reflow - Magic", "Chi Reflow - Magic",
        "Magic attacks boosted, but regular attacks are weaker.");
    public static ChiReflowSpeed = PerkLib.mk("Chi Reflow - Speed", "Chi Reflow - Speed",
        "Speed reductions are halved but caps strength");

    // Piercing perks
    public static PiercedCrimstone = new PiercedCrimstonePerk();
    public static PiercedIcestone = new PiercedIcestonePerk();
    public static PiercedFertite = new PiercedFertitePerk();
    public static PiercedFurrite = PerkLib.mk("Pierced: Furrite", "Pierced: Furrite",
        "Increases chances of encountering 'furry' foes.");
    public static PiercedLethite = PerkLib.mk("Pierced: Lethite", "Pierced: Lethite",
        "Increases chances of encountering demonic foes.");

    // Cock sock perks
    public static LustyRegeneration = PerkLib.mk("Lusty Regeneration", "Lusty Regeneration",
        "Regenerates 1% of HP per round in combat and 2% of HP per hour.");
    public static MidasCock = PerkLib.mk("Midas Cock", "Midas Cock",
        "Increases the gems awarded from victory in battle.");
    public static PentUp = new PentUpPerk();
    public static PhallicPotential = PerkLib.mk("Phallic Potential", "Phallic Potential",
        "Increases the effects of penis-enlarging transformations. This only affects cocks covered by scarlet cock-socks.");
    public static PhallicRestraint = PerkLib.mk("Phallic Restraint", "Phallic Restraint",
        "Reduces the effects of penis-enlarging transformations. This only affects cocks covered by cobalt cock-socks.");

    // Armor perks
    public static BloodMage = PerkLib.mk("Blood Mage", "Blood Mage",
        "Spellcasting now consumes health instead of fatigue!", undefined, true);
    public static SluttySeduction = new SluttySeductionPerk();
    public static WizardsEndurance = new WizardsEndurancePerk();
    public static WellspringOfLust = PerkLib.mk("Wellspring of Lust", "Wellspring of Lust",
        "At the beginning of combat, lust raises to black magic threshold if lust is below black magic threshold.");

    // Weapon perks
    public static WizardsFocus = new WizardsFocusPerk();

    // Achievement perks
    public static BroodMother = PerkLib.mk("Brood Mother", "Brood Mother",
        "Pregnancy moves twice as fast as a normal woman's.");
    public static SpellcastingAffinity = new SpellcastingAffinityPerk();

    // Mutation perks
    public static Androgyny = PerkLib.mk("Androgyny", "Androgyny",
        "No gender limits on facial masculinity or femininity.");
    public static BasiliskWomb = PerkLib.mk("Basilisk Womb", "Basilisk Womb",
        "Enables your eggs to be properly fertilized into basilisks of both genders!");
    public static BeeOvipositor = PerkLib.mk("Bee Ovipositor", "Bee Ovipositor",
        "Allows you to lay eggs through a special organ on your insect abdomen, though you need at least 10 eggs to lay.");
    public static BimboBody = PerkLib.mk("Bimbo Body", "Bimbo Body",
        "Gives the body of a bimbo.  Tits will never stay below a 'DD' cup, libido is raised, lust resistance is raised, and upgrades tease.");
    public static BimboBrains = PerkLib.mk("Bimbo Brains", "Bimbo Brains",
        "Now that you've drank bimbo liquer, you'll never, like, have the attention span and intelligence you once did!  But it's okay, 'cause you get to be so horny an' stuff!");
    public static BroBody = PerkLib.mk("Bro Body", "Bro Body",
        "Grants an ubermasculine body that's sure to impress.");
    public static BroBrains = PerkLib.mk("Bro Brains", "Bro Brains",
        "Makes thou... thin... fuck, that shit's for nerds.");
    public static BunnyEggs = PerkLib.mk("Bunny Eggs", "Bunny Eggs",
        "Laying eggs has become a normal part of your bunny-body's routine.");
    public static CorruptedNinetails = PerkLib.mk("Corrupted Nine-tails", "Corrupted Nine-tails",
        "The mystical energy of the nine-tails surges through you, filling you with phenomenal cosmic power!  Your boundless magic allows you to recover quickly after casting spells, but your method of attaining it has corrupted the transformation, preventing you from achieving true enlightenment.", undefined, true);
    public static Diapause = PerkLib.mk("Diapause", "Diapause",
        "Pregnancy does not advance normally, but develops quickly after taking in fluids.");
    public static Dragonfire = PerkLib.mk("Dragonfire", "Dragonfire",
        "Allows access to a dragon breath attack.");
    public static EnlightenedNinetails = PerkLib.mk("Enlightened Nine-tails", "Enlightened Nine-tails",
        "The mystical energy of the nine-tails surges through you, filling you with phenomenal cosmic power!  Your boundless magic allows you to recover quickly after casting spells.", undefined, true);
    public static Feeder = PerkLib.mk("Feeder", "Feeder",
        "Lactation does not decrease and gives a compulsion to breastfeed others.");
    public static Flexibility = PerkLib.mk("Flexibility", "Flexibility",
        "Grants cat-like flexibility.  Useful for dodging and 'fun'.");
    public static FutaFaculties = PerkLib.mk("Futa Faculties", "Futa Faculties",
        "It's super hard to think about stuff that like, isn't working out or fucking!");
    public static FutaForm = PerkLib.mk("Futa Form", "Futa Form",
        "Ensures that your body fits the Futa look (Tits DD+, Dick 8\"+, & Pussy).  Also keeps your lusts burning bright and improves the tease skill.");
    public static HarpyWomb = PerkLib.mk("Harpy Womb", "Harpy Womb",
        "Increases all laid eggs to large size so long as you have harpy legs and a harpy tail.");
    public static Incorporeality = PerkLib.mk("Incorporeality", "Incorporeality",
        "Allows you to fade into a ghost-like state and temporarily possess others.");
    public static Lustzerker = PerkLib.mk("Lustserker", "Lustserker",
        "Grants 'Lustserk' ability.");
    public static MilkMaid = new MilkMaidPerk();
    public static MinotaurCumAddict = PerkLib.mk("Minotaur Cum Addict", "Minotaur Cum Addict",
        "Causes you to crave minotaur cum frequently.  You cannot shake this addiction.");
    public static MinotaurCumResistance = PerkLib.mk("Minotaur Cum Resistance", "Minotaur Cum Resistance",
        "You can never become a Minotaur Cum Addict. Grants immunity to Minotaur Cum addiction.");
    public static Oviposition = PerkLib.mk("Oviposition", "Oviposition",
        "Causes you to regularly lay eggs when not otherwise pregnant.");
    public static PurityBlessing = PerkLib.mk("Purity Blessing", "Purity Blessing",
        "Reduces the rate at which your corruption, libido, and lust increase. Reduces minimum libido slightly.");
    public static RapierTraining = PerkLib.mk("Rapier Training", "Rapier Training",
        "After finishing of your training, increase attack power of any rapier you're using.");
    public static SatyrSexuality = PerkLib.mk("Satyr Sexuality", "Satyr Sexuality",
        "Thanks to your satyr biology, you now have the ability to impregnate both vaginas and asses. Also increases your virility rating. (Anal impregnation not implemented yet)");
    public static SlimeCore = PerkLib.mk("Slime Core", "Slime Core",
        "Grants more control over your slimy body, allowing you to go twice as long without fluids.");
    public static SpiderOvipositor = PerkLib.mk("Spider Ovipositor", "Spider Ovipositor",
        "Allows you to lay eggs through a special organ on your arachnid abdomen, though you need at least 10 eggs to lay.");
    public static ThickSkin = PerkLib.mk("Thick Skin", "Thick Skin",
        "Toughens your dermis to provide 2 points of armor.");
    public static TransformationResistance = PerkLib.mk("Transformation Resistance", "Transformation Resistance",
        "Reduces the likelihood of undergoing a transformation. Disables Bad Ends from transformative items.");

    // Quest, Event & NPC perks
    public static AChristmasCarol = PerkLib.mk("A Christmas Carol", "A Christmas Carol",
        "Grants year-round access to Christmas event. Note that some events are only accessible once per year.", undefined, true);
    public static BasiliskResistance = PerkLib.mk("Basilisk Resistance", "Basilisk Resistance",
        "Grants immunity to Basilisk's paralyzing gaze. Disables Basilisk Bad End.");
    public static BulgeArmor = PerkLib.mk("Bulge Armor", "Bulge Armor",
        "Grants a 5 point damage bonus to dick-based tease attacks.");
    public static Cornucopia = PerkLib.mk("Cornucopia", "Cornucopia",
        "Vaginal and Anal capacities increased by 30.", undefined, true);
    public static ElvenBounty = new ElvenBountyPerk();
    public static FerasBoonAlpha = PerkLib.mk("Fera's Boon - Alpha", "Fera's Boon - Alpha",
        "Increases the rate your cum builds up and cum production in general.", undefined, true);
    public static FerasBoonBreedingBitch = PerkLib.mk("Fera's Boon - Breeding Bitch", "Fera's Boon - Breeding Bitch",
        "Increases fertility and reduces the time it takes to birth young.", undefined, true);
    public static FerasBoonMilkingTwat = PerkLib.mk("Fera's Boon - Milking Twat", "Fera's Boon - Milking Twat",
        "Keeps your pussy from ever getting too loose and increases pregnancy speed.");
    public static FerasBoonSeeder = PerkLib.mk("Fera's Boon - Seeder", "Fera's Boon - Seeder",
        "Increases cum output by 1,000 mLs.", undefined, true);
    public static FerasBoonWideOpen = PerkLib.mk("Fera's Boon - Wide Open", "Fera's Boon - Wide Open",
        "Keeps your pussy permanently gaped and increases pregnancy speed.");
    public static FireLord = PerkLib.mk("Fire Lord", "Fire Lord",
        "Akbal's blessings grant the ability to breathe burning green flames.");
    public static Hellfire = PerkLib.mk("Hellfire", "Hellfire",
        "Grants a corrupted fire breath attack, like the hellhounds in the mountains.");
    public static LuststickAdapted = PerkLib.mk("Luststick Adapted", "Luststick Adapted",
        "Grants immunity to the lust-increasing effects of lust-stick and allows its use.");
    public static MagicalFertility = PerkLib.mk("Magical Fertility", "Magical Fertility",
        "10% higher chance of pregnancy and increased pregnancy speed.");
    public static MagicalVirility = PerkLib.mk("Magical Virility", "Magical Virility",
        "200 mLs more cum per orgasm and enhanced virility.");
    public static MaraesGiftButtslut = PerkLib.mk("Marae's Gift - Buttslut", "Marae's Gift - Buttslut",
        "Makes your anus provide lubrication when aroused.");
    public static MaraesGiftFertility = PerkLib.mk("Marae's Gift - Fertility", "Marae's Gift - Fertility",
        "Greatly increases fertility and halves base pregnancy speed.");
    public static MaraesGiftProfractory = PerkLib.mk("Marae's Gift - Profractory", "Marae's Gift - Profractory",
        "Causes your cum to build up at 3x the normal rate.");
    public static MaraesGiftStud = PerkLib.mk("Marae's Gift - Stud", "Marae's Gift - Stud",
        "Increases your cum production and potency greatly.");
    public static MarbleResistant = PerkLib.mk("Marble Resistant", "Marble Resistant",
        "Provides resistance to the addictive effects of bottled LaBova milk.");
    public static MarblesMilk = PerkLib.mk("Marble's Milk", "Marble's Milk",
        "Requires you to drink LaBova milk frequently or eventually die.  You cannot shake this addiction.");
    public static Misdirection = PerkLib.mk("Misdirection", "Misdirection",
        "Grants additional evasion chances while wearing Raphael's red bodysuit.");
    public static OmnibusGift = PerkLib.mk("Omnibus' Gift", "Omnibus' Gift",
        "Increases minimum lust but provides some lust resistance.");
    public static OneTrackMind = PerkLib.mk("One Track Mind", "One Track Mind",
        "Your constant desire for sex causes your sexual organs to be able to take larger insertions and disgorge greater amounts of fluid.", undefined, true);
    public static PilgrimsBounty = PerkLib.mk("Pilgrim's Bounty", "Pilgrim's Bounty",
        "Causes you to always cum as hard as if you had max lust.", undefined, true);
    public static PureAndLoving = PerkLib.mk("Pure and Loving", "Pure and Loving",
        "Your caring attitude towards love and romance makes you slightly more resistant to lust and corruption.", undefined, true);
    public static SensualLover = PerkLib.mk("Sensual Lover", "Sensual Lover",
        "Your sensual attitude towards love and romance makes your tease ability slightly more effective.", undefined, true);
    public static WarDance = PerkLib.mk("War Dance", "War Dance",
        "+15% Damage against enemies in hand to hand combat and -20% Evasion change for the enemy.");
    public static Whispered = PerkLib.mk("Whispered", "Whispered",
        "Akbal's blessings grant limited telepathy that can induce fear.");

    public static ControlledBreath = new ControlledBreathPerk();
    public static CleansingPalm = new CleansingPalmPerk();
    public static Enlightened = new EnlightenedPerk();

    // Monster perks
    public static Acid = PerkLib.mk("Acid", "Acid", "");

    private static mk(id: string, name: string, desc: string, longDesc?: string, keepOnAscension: boolean = false) {
        return new PerkType(id, name, desc, longDesc, keepOnAscension);
    }
    public static initRequirements(): void {
        // ------------
        // STRENGTH
        // ------------
        PerkLib.StrongBack.requireStr(25);
        PerkLib.StrongBack2.requireStr(25)
            .requirePerk(PerkLib.StrongBack);
        // Tier 1 Strength Perks
        // Thunderous Strikes - +20% basic attack damage while str > 80.
        PerkLib.ThunderousStrikes.requireStr(80)
            .requireLevel(6);
        // Weapon Mastery - Doubles weapon damage bonus of 'large' type weapons. (Minotaur Axe, M. Hammer, etc)
        PerkLib.WeaponMastery.requireStr(60)
            .requireLevel(6);
        PerkLib.BrutalBlows.requireStr(75)
            .requireLevel(6);
        PerkLib.IronFists.requireStr(50)
            .requireLevel(6);
        PerkLib.IronFists2.requireStr(65)
            .requireLevel(6)
            .requirePerk(PerkLib.IronFists);
        PerkLib.Parry.requireStr(50)
            .requireSpe(50)
            .requireLevel(6);
        // Tier 2 Strength Perks
        PerkLib.Berzerker.requireStr(75)
            .requireLevel(12);
        PerkLib.HoldWithBothHands.requireStr(80)
            .requireLevel(12);
        PerkLib.ShieldSlam.requireStr(80)
            .requireTou(60)
            .requireLevel(12);
        PerkLib.IronFists3.requireStr(80)
            .requireLevel(12)
            .requireNGPlus(1)
            .requirePerk(PerkLib.IronFists2);
        // Tier 3 Strength Perks
        PerkLib.ColdFury.requireStr(75)
            .requireLevel(18)
            .requirePerk(PerkLib.Berzerker)
            .requirePerk(PerkLib.ImprovedSelfControl);
        PerkLib.TitanGrip.requireStr(90)
            .requireLevel(18)
            .requirePerk(PerkLib.StrongBack);
        // ------------
        // TOUGHNESS
        // ------------
        // slot 2 - toughness perk 1
        PerkLib.Tank.requireTou(25);
        // slot 2 - regeneration perk
        PerkLib.Regeneration.requireTou(50)
            .requirePerk(PerkLib.Tank);
        PerkLib.ImprovedEndurance.requireStr(50)
            .requireTou(50);
        // Tier 1 Toughness Perks
        PerkLib.Tank2.requireTou(60)
            .requireLevel(6)
            .requirePerk(PerkLib.Tank);
        PerkLib.Regeneration2.requireTou(70)
            .requireLevel(6)
            .requirePerk(PerkLib.Regeneration);
        PerkLib.ImmovableObject.requireTou(75)
            .requireLevel(6);
        PerkLib.ShieldMastery.requireTou(50)
            .requireLevel(6);
        PerkLib.ImprovedEndurance2.requireLevel(6)
            .requireStr(60)
            .requireTou(60)
            .requirePerk(PerkLib.ImprovedEndurance);
        // Tier 2 Toughness Perks
        PerkLib.Tank3.requireTou(80)
            .requireLevel(12)
            .requireNGPlus(1)
            .requirePerk(PerkLib.Tank2);
        PerkLib.Resolute.requireTou(75)
            .requireLevel(12);
        PerkLib.Juggernaut.requireTou(75)
            .requireLevel(12);
        PerkLib.IronMan.requireTou(60)
            .requireLevel(12);
        PerkLib.ImprovedEndurance3.requireLevel(12)
            .requireStr(70)
            .requireTou(70)
            .requireNGPlus(1)
            .requirePerk(PerkLib.ImprovedEndurance2);
        // ------------
        // SPEED
        // ------------
        // slot 3 - speed perk
        PerkLib.Evade.requireSpe(25);
        // slot 3 - run perk
        PerkLib.Runner.requireSpe(25);
        // slot 3 - Double Attack perk
        PerkLib.DoubleAttack.requireSpe(50)
            .requirePerk(PerkLib.Evade)
            .requirePerk(PerkLib.Runner);

        // Tier 1 Speed Perks
        // Speedy Recovery - Regain Fatigue 50% faster speed.
        PerkLib.SpeedyRecovery.requireSpe(60)
            .requireLevel(6)
            .requirePerk(PerkLib.Evade);
        // Agility - A small portion of your speed is applied to your defense rating when wearing light armors.
        PerkLib.Agility.requireSpe(75)
            .requireLevel(6)
            .requirePerk(PerkLib.Runner);
        PerkLib.Unhindered.requireSpe(75)
            .requireLevel(6)
            .requirePerk(PerkLib.Evade)
            .requirePerk(PerkLib.Agility);
        PerkLib.LightningStrikes.requireSpe(60)
            .requireLevel(6);
        /*
         Brawler.requireStr(60).requireSpe(60);
         */ // Would it be fitting to have Urta teach you?
        // Tier 2 Speed Perks
        PerkLib.LungingAttacks.requireSpe(75)
            .requireLevel(12);
        PerkLib.Blademaster.requireStr(60)
            .requireSpe(80)
            .requireLevel(12);
        // ------------
        // INTELLIGENCE
        // ------------
        // Slot 4 - precision - -10 enemy toughness for damage calc
        PerkLib.Precision.requireInt(25);
        // Spellpower - boosts spell power
        PerkLib.Spellpower.requireInt(50);
        PerkLib.Mage.requireInt(50)
            .requirePerk(PerkLib.Spellpower);
        // Tier 1 Intelligence Perks
        PerkLib.Tactician.requireInt(50)
            .requireLevel(6);
        PerkLib.Channeling.requireInt(60)
            .requireLevel(6)
            .requirePerk(PerkLib.Spellpower)
            .requirePerk(PerkLib.Mage)
            .requireCustomFunction((player: Player): boolean => {
                return player.spellCount() > 0;
            }, "Any Spell");
        PerkLib.Medicine.requireInt(60)
            .requireLevel(6);
        PerkLib.StaffChanneling.requireInt(60)
            .requireLevel(6)
            .requirePerk(PerkLib.Channeling);
        // Tier 2 Intelligence perks
        PerkLib.Archmage.requireInt(75)
            .requireLevel(12)
            .requirePerk(PerkLib.Mage);
        PerkLib.FocusedMind.requireInt(75)
            .requireLevel(12)
            .requirePerk(PerkLib.Mage);

        PerkLib.RagingInferno.requireInt(75)
            .requireLevel(12)
            .requirePerk(PerkLib.Archmage)
            .requirePerk(PerkLib.Channeling)
            .requireCustomFunction((player: Player): boolean => {
                return player.hasStatusEffect(StatusEffects.KnowsWhitefire)
                    || player.hasStatusEffect(StatusEffects.KnowsBlackfire)
                    || player.hasPerk(PerkLib.FireLord)
                    || player.hasPerk(PerkLib.Hellfire)
                    || player.hasPerk(PerkLib.EnlightenedNinetails)
                    || player.hasPerk(PerkLib.CorruptedNinetails);
            }, "Any Fire Spell");
        // Tier 3 Intelligence perks
        PerkLib.Indefatigable.requireInt(90)
            .requireLevel(18)
            .requirePerk(PerkLib.ImprovedSelfControl3)
            .requireNGPlus(1);
        // Spell-boosting perks
        // Battlemage: auto-use Might
        PerkLib.Battlemage.requireInt(80)
            .requireLevel(12)
            .requirePerk(PerkLib.Channeling)
            .requireStatusEffect(StatusEffects.KnowsMight, "Might Spell");
        // Spellsword: auto-use Charge Weapon
        PerkLib.Spellsword.requireInt(80)
            .requireLevel(12)
            .requirePerk(PerkLib.Channeling)
            .requireStatusEffect(StatusEffects.KnowsCharge, "Charge Weapon Spell");

        // ------------
        // LIBIDO
        // ------------
        // slot 5 - libido perks

        // Slot 5 - Fertile+ increases cum production and fertility (+15%)
        PerkLib.FertilityPlus.requireLib(25);
        PerkLib.FertilityPlus.defaultValue1 = 15;
        PerkLib.FertilityPlus.defaultValue2 = 1.75;
        PerkLib.ImprovedSelfControl.requireInt(50).requireLib(25);
        // Slot 5 - minimum libido
        PerkLib.ColdBlooded.requireMinLust(20);
        PerkLib.ColdBlooded.defaultValue1 = 20;
        PerkLib.HotBlooded.requireLib(50);
        PerkLib.HotBlooded.defaultValue1 = 20;
        // Tier 1 Libido Perks
        // Slot 5 - minimum libido
        // Slot 5 - Fertility- decreases cum production and fertility.
        PerkLib.FertilityMinus.requireLevel(6)
            .requireLibLessThan(25);
        PerkLib.FertilityMinus.defaultValue1 = 15;
        PerkLib.FertilityMinus.defaultValue2 = 0.7;
        PerkLib.WellAdjusted.requireLevel(6).requireLib(60);
        PerkLib.ImprovedSelfControl2.requireLevel(6)
            .requireInt(60)
            .requireLib(50)
            .requirePerk(PerkLib.ImprovedSelfControl);
        // Slot 5 - minimum libido
        PerkLib.Masochist.requireLevel(6).requireLib(60).requireCor(50);
        // Tier 2 Libido Perks
        PerkLib.ImprovedSelfControl3.requireLevel(12)
            .requireInt(70)
            .requireLib(75)
            .requireNGPlus(1)
            .requirePerk(PerkLib.ImprovedSelfControl2);
        // ------------
        // SENSITIVITY
        // ------------
        // Nope.avi
        // ------------
        // CORRUPTION
        // ------------
        // Slot 7 - Corrupted Libido - lust raises 10% slower.
        PerkLib.CorruptedLibido.requireCor(25);
        PerkLib.CorruptedLibido.defaultValue1 = 20;
        // Slot 7 - Seduction (Must have seduced Jojo
        PerkLib.Seduction.requireCor(50);
        // Slot 7 - Nymphomania
        PerkLib.Nymphomania.requirePerk(PerkLib.CorruptedLibido)
            .requireCor(75);
        // Slot 7 - UNFINISHED :3
        PerkLib.Acclimation.requirePerk(PerkLib.CorruptedLibido)
            .requireMinLust(20)
            .requireCor(50);
        // Tier 1 Corruption Perks - acclimation over-rides
        PerkLib.Sadist.requireLevel(6)
            .requirePerk(PerkLib.CorruptedLibido)
            .requireCor(60);
        PerkLib.ArousingAura.requireLevel(6)
            .requirePerk(PerkLib.CorruptedLibido)
            .requireCor(70);
        // Tier 1 Misc Perks
        PerkLib.Resistance.requireLevel(6);
        PerkLib.Survivalist.requireLevel(6)
            .requireHungerEnabled();
        // Tier 2 Misc Perks
        PerkLib.Survivalist2.requireLevel(12)
            .requirePerk(PerkLib.Survivalist)
            .requireHungerEnabled();
        // Other Misc Perks
        PerkLib.ImprovedVision.requireLevel(30)
            .requirePerk(PerkLib.Tactician);
        PerkLib.ImprovedVision2.requireLevel(60)
            .requirePerk(PerkLib.ImprovedVision);
        PerkLib.ImprovedVision3.requireLevel(90)
            .requirePerk(PerkLib.ImprovedVision2);
    }
}

PerkLib.initRequirements();
