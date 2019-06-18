	
	/**
	 * The new home of Stats and Perks
	 * @author Kitteh6660
	 */
	export class PlayerInfo extends BaseContent
	{	
		public  PlayerInfo() {}
		
		private  pane:LevelUpPane = new LevelUpPane();
		
		//------------
		// STATS
		//------------
		public  displayStats(): void {
			spriteSelect(undefined);
			clearOutput();
			displayHeader("Stats");
			// Begin Combat Stats
		var  combatStats: string = "";
			
			if (player.hasKeyItem("Bow") >= 0 || player.hasKeyItem("Kelt's Bow") >= 0)
				combatStats += "<b>Bow Skill:</b> " + Math.round(player.statusEffectv1(StatusEffects.Kelt)) + " / 100\n";
				
			combatStats += "<b>Critical Hit Chance:</b> " + Math.round(combat.getCritChance()) + "%\n";	
				
			combatStats += "<b>Dodge Chance:</b> " + Math.round(player.getEvasionChance()) + "% (W/o speed-based)\n";	
			
			combatStats += "<b>Damage Resistance:</b> " + (100 - Math.round(player.damagePercent(true))) + "-" + (100 - Math.round(player.damagePercent(true) - player.damageToughnessModifier(true))) + "% (Higher is better.)\n";

			combatStats += "<b>Lust Resistance:</b> " + (100 - Math.round(player.lustPercent())) + "% (Higher is better.)\n";
			
			combatStats += "<b>Spell Effect Multiplier:</b> " + Math.round(100 * player.spellMod()) + "%\n";
			
			combatStats += "<b>Spell Cost:</b> " + player.spellCost(100) + "%\n";
			
			if (flags[kFLAGS.RAPHAEL_RAPIER_TRANING] > 0)
				combatStats += "<b>Rapier Skill:</b> " + flags[kFLAGS.RAPHAEL_RAPIER_TRANING] + " / 4\n";
			
			if (player.teaseLevel < 5)
				combatStats += "<b>Tease Skill:</b>  " + player.teaseLevel + " / 5 (Exp: " + player.teaseXP + " / "+ (10 + (player.teaseLevel + 1) * 5 * (player.teaseLevel + 1))+ ")\n";
			else
				combatStats += "<b>Tease Skill:</b>  " + player.teaseLevel + " / 5 (Exp: MAX)\n";	
				
			if (combatStats != "")
				outputText("<b><u>Combat Stats</u></b>\n" + combatStats);
			// End Combat Stats
			
			if (prison.inPrison || flags[kFLAGS.PRISON_CAPTURE_COUNTER] > 0) prison.displayPrisonStats();
			
			// Begin Children Stats
		var  childStats: string = "";
			
			if (player.statusEffectv1(StatusEffects.Birthed) > 0)
				childStats += "<b>Times Given Birth:</b> " + player.statusEffectv1(StatusEffects.Birthed) + "\n";
				
			if (flags[kFLAGS.AMILY_MET] > 0)
				childStats += "<b>Litters With Amily:</b> " + (flags[kFLAGS.AMILY_BIRTH_TOTAL] + flags[kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS]) + "\n";

			if (flags[kFLAGS.BEHEMOTH_CHILDREN] > 0)
				childStats += "<b>Children With Behemoth:</b> " + flags[kFLAGS.BEHEMOTH_CHILDREN] + "\n";

			if (flags[kFLAGS.BENOIT_EGGS] > 0)
				childStats += "<b>Benoit Eggs Laid:</b> " + flags[kFLAGS.BENOIT_EGGS] + "\n";
			if (flags[kFLAGS.FEMOIT_EGGS_LAID] > 0)
				childStats += "<b>Benoite Eggs Produced:</b> " + flags[kFLAGS.FEMOIT_EGGS_LAID] + "\n";
				
			if (flags[kFLAGS.COTTON_KID_COUNT] > 0)
				childStats += "<b>Children With Cotton:</b> " + flags[kFLAGS.COTTON_KID_COUNT] + "\n";
			
			if (flags[kFLAGS.EDRYN_NUMBER_OF_KIDS] > 0)
				childStats += "<b>Children With Edryn:</b> " + flags[kFLAGS.EDRYN_NUMBER_OF_KIDS] + "\n";
				
			if (flags[kFLAGS.EMBER_CHILDREN_MALES] > 0)
				childStats += "<b>Ember Offspring (Males):</b> " + flags[kFLAGS.EMBER_CHILDREN_MALES] + "\n";
			if (flags[kFLAGS.EMBER_CHILDREN_FEMALES] > 0)
				childStats += "<b>Ember Offspring (Females):</b> " + flags[kFLAGS.EMBER_CHILDREN_FEMALES] + "\n";
			if (flags[kFLAGS.EMBER_CHILDREN_HERMS] > 0)
				childStats += "<b>Ember Offspring (Herms):</b> " + flags[kFLAGS.EMBER_CHILDREN_HERMS] + "\n";
			if (getGame().emberScene.emberChildren() > 0)
				childStats += "<b>Total Children With Ember:</b> " + (getGame().emberScene.emberChildren()) + "\n";
			
			if (flags[kFLAGS.EMBER_EGGS] > 0)
				childStats += "<b>Ember Eggs Produced:</b> " + flags[kFLAGS.EMBER_EGGS] + "\n";
				
			if (getGame().isabellaScene.totalIsabellaChildren() > 0) {
				if (getGame().isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_BOYS) > 0)
					childStats += "<b>Children With Isabella (Human, Males):</b> " + getGame().isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_BOYS) + "\n";
				if (getGame().isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_GIRLS) > 0)
					childStats += "<b>Children With Isabella (Human, Females):</b> " + getGame().isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_GIRLS) + "\n";
				if (getGame().isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_HERMS) > 0)
					childStats += "<b>Children With Isabella (Human, Herms):</b> " + getGame().isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_HUMAN_HERMS) + "\n";
				if (getGame().isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWGIRLS) > 0)
					childStats += "<b>Children With Isabella (Cowgirl, Females):</b> " + getGame().isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWGIRLS) + "\n";
				if (getGame().isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWFUTAS) > 0)
					childStats += "<b>Children With Isabella (Cowgirl, Herms):</b> " + getGame().isabellaScene.getIsabellaChildType(IsabellaScene.OFFSPRING_COWFUTAS) + "\n";
				childStats += "<b>Total Children With Isabella:</b> " + getGame().isabellaScene.totalIsabellaChildren() + "\n"
			}
				
				
			if (flags[kFLAGS.IZMA_CHILDREN_SHARKGIRLS] > 0)
				childStats += "<b>Children With Izma (Sharkgirls):</b> " + flags[kFLAGS.IZMA_CHILDREN_SHARKGIRLS] + "\n";
			if (flags[kFLAGS.IZMA_CHILDREN_TIGERSHARKS] > 0)
				childStats += "<b>Children With Izma (Tigersharks):</b> " + flags[kFLAGS.IZMA_CHILDREN_TIGERSHARKS] + "\n";
			if (flags[kFLAGS.IZMA_CHILDREN_SHARKGIRLS] > 0 && flags[kFLAGS.IZMA_CHILDREN_TIGERSHARKS] > 0)
				childStats += "<b>Total Children with Izma:</b> " + (flags[kFLAGS.IZMA_CHILDREN_SHARKGIRLS] + flags[kFLAGS.IZMA_CHILDREN_TIGERSHARKS]) + "\n";
				
			if (getGame().joyScene.getTotalLitters() > 0)
				childStats += "<b>Litters With " + (flags[kFLAGS.JOJO_BIMBO_STATE] >= 3 ? "Joy" : "Jojo") + ":</b> " + getGame().joyScene.getTotalLitters() + "\n";
				
			if (flags[kFLAGS.KELLY_KIDS_MALE] > 0)
				childStats += "<b>Children With Kelly (Males):</b> " + flags[kFLAGS.KELLY_KIDS_MALE] + "\n";
			if (flags[kFLAGS.KELLY_KIDS] - flags[kFLAGS.KELLY_KIDS_MALE] > 0)
				childStats += "<b>Children With Kelly (Females):</b> " + (flags[kFLAGS.KELLY_KIDS] - flags[kFLAGS.KELLY_KIDS_MALE]) + "\n";
			if (flags[kFLAGS.KELLY_KIDS] > 0)
				childStats += "<b>Total Children With Kelly:</b> " + flags[kFLAGS.KELLY_KIDS] + "\n";
			//if (getGame().kihaFollower.pregnancy.isPregnant) This was originally a debug.
			//	childStats += "<b>Kiha's Pregnancy:</b> " + getGame().kihaFollower.pregnancy.incubation + "\n";
			if (flags[kFLAGS.KIHA_CHILDREN_BOYS] > 0)
				childStats += "<b>Kiha Offspring (Males):</b> " + flags[kFLAGS.KIHA_CHILDREN_BOYS] + "\n";
			if (flags[kFLAGS.KIHA_CHILDREN_GIRLS] > 0)
				childStats += "<b>Kiha Offspring (Females):</b> " + flags[kFLAGS.KIHA_CHILDREN_GIRLS] + "\n";
			if (flags[kFLAGS.KIHA_CHILDREN_HERMS] > 0)
				childStats += "<b>Kiha Offspring (Herms):</b> " + flags[kFLAGS.KIHA_CHILDREN_HERMS] + "\n";
			if (getGame().kihaFollower.totalKihaChildren() > 0)
				childStats += "<b>Total Children With Kiha:</b> " + getGame().kihaFollower.totalKihaChildren() + "\n";
				
			if (getGame().mountain.salon.lynnetteApproval() != 0)
				childStats += "<b>Lynnette Children:</b> " + flags[kFLAGS.LYNNETTE_BABY_COUNT] + "\n";
				
			if (flags[kFLAGS.MARBLE_KIDS] > 0)
				childStats += "<b>Children With Marble:</b> " + flags[kFLAGS.MARBLE_KIDS] + "\n";
				
			if (flags[kFLAGS.MINERVA_CHILDREN] > 0)
				childStats += "<b>Children With Minerva:</b> " + flags[kFLAGS.MINERVA_CHILDREN] + "\n";
				
			if (flags[kFLAGS.ANT_KIDS] > 0)
				childStats += "<b>Ant Children With Phylla:</b> " + flags[kFLAGS.ANT_KIDS] + "\n";
			if (flags[kFLAGS.PHYLLA_DRIDER_BABIES_COUNT] > 0)
				childStats += "<b>Drider Children With Phylla:</b> " + flags[kFLAGS.PHYLLA_DRIDER_BABIES_COUNT] + "\n";
			if (flags[kFLAGS.ANT_KIDS] > 0 && flags[kFLAGS.PHYLLA_DRIDER_BABIES_COUNT] > 0)
				childStats += "<b>Total Children With Phylla:</b> " + (flags[kFLAGS.ANT_KIDS] + flags[kFLAGS.PHYLLA_DRIDER_BABIES_COUNT]) + "\n";
				
			if (flags[kFLAGS.SHEILA_JOEYS] > 0)
				childStats += "<b>Children With Sheila (Joeys):</b> " + flags[kFLAGS.SHEILA_JOEYS] + "\n";
			if (flags[kFLAGS.SHEILA_IMPS] > 0)
				childStats += "<b>Children With Sheila (Imps):</b> " + flags[kFLAGS.SHEILA_IMPS] + "\n";
			if (flags[kFLAGS.SHEILA_JOEYS] > 0 && flags[kFLAGS.SHEILA_IMPS] > 0)
				childStats += "<b>Total Children With Sheila:</b> " + (flags[kFLAGS.SHEILA_JOEYS] + flags[kFLAGS.SHEILA_IMPS]) + "\n";
				
			if (flags[kFLAGS.SOPHIE_ADULT_KID_COUNT] > 0 || flags[kFLAGS.SOPHIE_DAUGHTER_MATURITY_COUNTER] > 0) 
			{
				childStats += "<b>Children With Sophie:</b> ";
			var  sophie: number = 0;
				if (flags[kFLAGS.SOPHIE_DAUGHTER_MATURITY_COUNTER] > 0) sophie++;
				sophie += flags[kFLAGS.SOPHIE_ADULT_KID_COUNT];
				if (flags[kFLAGS.SOPHIE_CAMP_EGG_COUNTDOWN] > 0) sophie++;
				childStats += sophie + "\n";
			}
			
			if (flags[kFLAGS.SOPHIE_EGGS_LAID] > 0)
				childStats += "<b>Eggs Fertilized For Sophie:</b> " + (flags[kFLAGS.SOPHIE_EGGS_LAID] + sophie) + "\n";
				
			if (flags[kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS] > 0)
				childStats += "<b>Children With Tamani:</b> " + flags[kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS] + " (after all forms of natural selection)\n";
				
			if (getGame().urtaPregs.urtaKids() > 0)
				childStats += "<b>Children With Urta:</b> " + getGame().urtaPregs.urtaKids() + "\n";
				
			//Mino sons
			if (flags[kFLAGS.ADULT_MINOTAUR_OFFSPRINGS] > 0)
				childStats += "<b>Number of Adult Minotaur Offspring:</b> " + flags[kFLAGS.ADULT_MINOTAUR_OFFSPRINGS] + "\n";
			
			if (childStats != "")
				outputText("\n<b><u>Children</u></b>\n" + childStats);
			// End Children Stats

			// Begin Body Stats
		var  bodyStats: string = "";

			if (flags[kFLAGS.HUNGER_ENABLED] > 0 || flags[kFLAGS.IN_PRISON] > 0)
			{
				bodyStats += "<b>Satiety:</b> " + Math.floor(player.hunger) + " / 100 (";
				if (player.hunger <= 0) bodyStats += "<font color=\"#ff0000\">Dying</font>";
				if (player.hunger > 0 && player.hunger < 10) bodyStats += "<font color=\"#C00000\">Starving</font>";
				if (player.hunger >= 10 && player.hunger < 25) bodyStats += "<font color=\"#800000\">Very hungry</font>";
				if (player.hunger >= 25 && player.hunger100 < 50) bodyStats += "Hungry";
				if (player.hunger100 >= 50 && player.hunger100 < 75) bodyStats += "Not hungry";
				if (player.hunger100 >= 75 && player.hunger100 < 90) bodyStats += "<font color=\"#008000\">Satiated</font>";
				if (player.hunger100 >= 90 && player.hunger100 < 100) bodyStats += "<font color=\"#00C000\">Full</font>";
				if (player.hunger100 >= 100) bodyStats += "<font color=\"#00C000\">Very full</font>";
				bodyStats += ")\n";
			}

			bodyStats += "<b>Anal Capacity:</b> " + Math.round(player.analCapacity()) + "\n";
			bodyStats += "<b>Anal Looseness:</b> " + Math.round(player.ass.analLooseness) + "\n";
			
			bodyStats += "<b>Fertility (Base) Rating:</b> " + Math.round(player.fertility) + "\n";
			bodyStats += "<b>Fertility (With Bonuses) Rating:</b> " + Math.round(player.totalFertility()) + "\n";
			
			if (player.cumQ() > 0) {
				bodyStats += "<b>Virility Rating:</b> " + Math.round(player.virilityQ() * 100) + "\n";
				if (flags[kFLAGS.HUNGER_ENABLED] >= 1) bodyStats += "<b>Cum Production:</b> " + addComma(Math.round(player.cumQ())) + " / " + addComma(Math.round(player.cumCapacity())) + "mL (" + Math.round((player.cumQ() / player.cumCapacity()) * 100) + "%) \n";
				else bodyStats += "<b>Cum Production:</b> " + addComma(Math.round(player.cumQ())) + "mL\n";
			}
			if (player.lactationQ() > 0)
				bodyStats += "<b>Milk Production:</b> " + addComma(Math.round(player.lactationQ())) + "mL\n";
			
			if (player.hasStatusEffect(StatusEffects.Feeder)) {
				bodyStats += "<b>Hours Since Last Time Breastfed Someone:</b>  " + player.statusEffectv2(StatusEffects.Feeder);
				if (player.statusEffectv2(StatusEffects.Feeder) >= 72)
					bodyStats += " (Too long! Sensitivity Increasing!)";
				
				bodyStats += "\n";
			}
			
			bodyStats += "<b>Pregnancy Speed Multiplier:</b> ";
		var  preg: number = 1;
			if (player.findPerk(PerkLib.Diapause) >= 0)
				bodyStats += "? (Variable due to Diapause)\n";
			else {
				if (player.findPerk(PerkLib.MaraesGiftFertility) >= 0) preg++;
				if (player.findPerk(PerkLib.BroodMother) >= 0) preg++;
				if (player.findPerk(PerkLib.FerasBoonBreedingBitch) >= 0) preg++;
				if (player.findPerk(PerkLib.MagicalFertility) >= 0) preg++;
				if (player.findPerk(PerkLib.FerasBoonWideOpen) >= 0 || player.findPerk(PerkLib.FerasBoonMilkingTwat) >= 0) preg++;
				bodyStats += preg + "\n";
			}
			
			if (player.cocks.length > 0) {
				bodyStats += "<b>Total Cocks:</b> " + player.cocks.length + "\n";

			var  totalCockLength: number = 0;
			var  totalCockGirth: number = 0;
				
				for (var i: number = 0; i < player.cocks.length; i++) {
						totalCockLength += player.cocks[i].cockLength;
						totalCockGirth += player.cocks[i].cockThickness
				}
						
				bodyStats += "<b>Total Cock Length:</b> " + Math.round(totalCockLength) + " inches\n";
				bodyStats += "<b>Total Cock Girth:</b> " + Math.round(totalCockGirth) + " inches\n";
				
			}
			
			if (player.vaginas.length > 0)
				bodyStats += "<b>Vaginal Capacity:</b> " + Math.round(player.vaginalCapacity()) + "\n" + "<b>Vaginal Looseness:</b> " + Math.round(player.looseness()) + "\n";

			if (player.findPerk(PerkLib.SpiderOvipositor) >= 0 || player.findPerk(PerkLib.BeeOvipositor) >= 0)
				bodyStats += "<b>Ovipositor Total Egg Count: " + player.eggs() + "\nOvipositor Fertilized Egg Count: " + player.fertilizedEggs() + "</b>\n";
				
			if (player.hasStatusEffect(StatusEffects.SlimeCraving)) {
				if (player.statusEffectv1(StatusEffects.SlimeCraving) >= 18)
					bodyStats += "<b>Slime Craving:</b> Active! You are currently losing strength and speed.  You should find fluids.\n";
				else {
					if (player.findPerk(PerkLib.SlimeCore) >= 0)
						bodyStats += "<b>Slime Stored:</b> " + ((17 - player.statusEffectv1(StatusEffects.SlimeCraving)) * 2) + " hours until you start losing strength.\n";
					else
						bodyStats += "<b>Slime Stored:</b> " + (17 - player.statusEffectv1(StatusEffects.SlimeCraving)) + " hours until you start losing strength.\n";
				}
			}
			
			if (bodyStats != "")
				outputText("\n<b><u>Body Stats</u></b>\n" + bodyStats);
			// End Body Stats
			
			
			// Begin Racial Scores display -Foxwells
		var  raceScores: string = "";
			
			if (player.humanScore() > 0) {
				raceScores += "<b>Human Score:</b> " + player.humanScore() + "\n";
			}
			if (player.mutantScore() > 0) {
				raceScores += "<b>Mutant Score:</b> " + player.mutantScore() + "\n";
			}
			if (player.demonScore() > 0) {
				raceScores += "<b>Demon Score:</b> " + player.demonScore() + "\n";
			}
			if (player.goblinScore() > 0) {
				raceScores += "<b>Goblin Score:</b> " + player.goblinScore() + "\n";
			}
			if (player.gooScore() > 0) {
				raceScores += "<b>Goo Score:</b> " + player.gooScore() + "\n";
			}
			if (player.cowScore() > 0) {
				raceScores += "<b>Cow Score:</b> " + player.cowScore() + "\n";
			}
			if (player.minoScore() > 0) {
				raceScores += "<b>Minotaur Score:</b> " + player.minoScore() + "\n";
			}
			if (player.catScore() > 0) {
				raceScores += "<b>Cat Score:</b> " + player.catScore() + "\n";
			}
			if (player.dragonneScore() > 0) {
				raceScores += "<b>Dragonne Score:</b> " + player.dragonneScore() + "\n";
			}
			if (player.manticoreScore() > 0) {
				raceScores += "<b>Manticore Score:</b> " + player.manticoreScore() + "\n";
			}
			if (player.lizardScore() > 0) {
				raceScores += "<b>Lizard Score:</b> " + player.lizardScore() + "\n";
			}
			if (player.salamanderScore() > 0) {
				raceScores += "<b>Salamander Score:</b> " + player.salamanderScore() + "\n";
			}
			if (player.dragonScore() > 0) {
				raceScores += "<b>Dragon Score:</b> " + player.dragonScore() + "\n";
			}
			if (player.nagaScore() > 0) {
				raceScores += "<b>Naga Score:</b> " + player.nagaScore() + "\n";
			}
			if (player.sandTrapScore() > 0) {
				raceScores += "<b>Sand Trap Score:</b> " + player.sandTrapScore() + "\n";
			}
			if (player.harpyScore() > 0) {
				raceScores += "<b>Avian Score:</b> " + player.harpyScore() + "\n";
			}
			if (player.sharkScore() > 0) {
				raceScores += "<b>Shark Score:</b> " + player.sharkScore() + "\n";
			}
			if (player.sirenScore() > 0) {
				raceScores += "<b>Siren Score:</b> " + player.sirenScore() + "\n";
			}
			if (player.dogScore() > 0) {
				raceScores += "<b>Dog Score:</b> " + player.dogScore() + "\n";
			}
			if (player.wolfScore() > 0) {
				raceScores += "<b>Wolf Score:</b> " + player.wolfScore() + "\n";
			}
			if (player.foxScore() > 0) {
				raceScores += "<b>Fox Score:</b> " + player.foxScore() + "\n";
			}
			if (player.kitsuneScore() > 0) {
				raceScores += "<b>Kitsune Score:</b> " + player.kitsuneScore() + "\n";
			}
			if (player.echidnaScore() > 0) {
				raceScores += "<b>Echidna Score:</b> " + player.echidnaScore() + "\n";
			}
			if (player.mouseScore() > 0) {
				raceScores += "<b>Mouse Score:</b> " + player.mouseScore() + "\n";
			}
			if (player.ferretScore() > 0) {
				raceScores += "<b>Ferret Score:</b> " + player.ferretScore() + "\n";
			}
			if (player.raccoonScore() > 0) {
				raceScores += "<b>Raccoon Score:</b> " + player.raccoonScore() + "\n";
			}
			if (player.bunnyScore() > 0) {
				raceScores += "<b>Bunny Score:</b> " + player.bunnyScore() + "\n";
			}
			if (player.kangaScore() > 0) {
				raceScores += "<b>Kangaroo Score:</b> " + player.kangaScore() + "\n";
			}
			if (player.horseScore() > 0) {
				raceScores += "<b>Horse Score:</b> " + player.horseScore() + "\n";
			}
			if (player.deerScore() > 0) {
				raceScores += "<b>Deer Score:</b> " + player.deerScore() + "\n";
			}
			if (player.satyrScore() > 0) {
				raceScores += "<b>Satyr Score:</b> " + player.satyrScore() + "\n";
			}
			if (player.rhinoScore() > 0) {
				raceScores += "<b>Rhino Score:</b> " + player.rhinoScore() + "\n";
			}
			if (player.spiderScore() > 0) {
				raceScores += "<b>Spider Score:</b> " + player.spiderScore() + "\n";
			}
			if (player.pigScore() > 0) {
				raceScores += "<b>Pig Score:</b> " + player.pigScore() + "\n";
			}
			if (player.beeScore() > 0) {
				raceScores += "<b>Bee Score:</b> " + player.beeScore() + "\n";
			}
			if (player.cockatriceScore() > 0) {
				raceScores += "<b>Cockatrice Score:</b> " + player.cockatriceScore() + "\n";
			}
			if (player.redPandaScore() > 0) {
				raceScores += "<b>Red-Panda Score:</b> " + player.redPandaScore() + "\n";
			}
			
			if (raceScores != "")
				outputText("\n<b><u>Racial Scores</u></b>\n" + raceScores);
			// End Racial Scores display -Foxwells

			// Begin Misc Stats
		var  miscStats: string = "";

			if (camp.getCampPopulation() > 0)
				miscStats += "<b>Camp Population:</b> " + camp.getCampPopulation() + "\n";
			
			if (flags[kFLAGS.CORRUPTED_GLADES_DESTROYED] > 0) {
				if (flags[kFLAGS.CORRUPTED_GLADES_DESTROYED] < 100)
					miscStats += "<b>Corrupted Glades Status:</b> " + (100 - flags[kFLAGS.CORRUPTED_GLADES_DESTROYED]) + "% remaining\n";
				else 
					miscStats += "<b>Corrupted Glades Status:</b> Extinct\n";
			}
				
			if (flags[kFLAGS.EGGS_BOUGHT] > 0)
				miscStats += "<b>Eggs Traded For:</b> " + flags[kFLAGS.EGGS_BOUGHT] + "\n";
			
			if (flags[kFLAGS.TIMES_AUTOFELLATIO_DUE_TO_CAT_FLEXABILITY] > 0)
				miscStats += "<b>Times Had Fun with Feline Flexibility:</b> " + flags[kFLAGS.TIMES_AUTOFELLATIO_DUE_TO_CAT_FLEXABILITY] + "\n";
			
			if (flags[kFLAGS.FAP_ARENA_SESSIONS] > 0)
				miscStats += "<b>Times Circle Jerked in the Arena:</b> " + flags[kFLAGS.FAP_ARENA_SESSIONS] + "\n<b>Victories in the Arena:</b> " + flags[kFLAGS.FAP_ARENA_VICTORIES] + "\n";
			
			if (flags[kFLAGS.SPELLS_CAST] > 0)
				miscStats += "<b>Spells Cast:</b> " + flags[kFLAGS.SPELLS_CAST] + "\n";
			
			if (flags[kFLAGS.TIMES_BAD_ENDED] > 0)
				miscStats += "<b>Times Bad-Ended:</b> " + flags[kFLAGS.TIMES_BAD_ENDED] + "\n";
			
			if (flags[kFLAGS.TIMES_ORGASMED] > 0)
				miscStats += "<b>Times Orgasmed:</b> " + flags[kFLAGS.TIMES_ORGASMED] + "\n";
				
			if (getGame().bimboProgress.ableToProgress()) {
				if (flags[kFLAGS.TIMES_ORGASM_DICK] > 0) 
					miscStats += "<i>Dick tension:</i> " + flags[kFLAGS.TIMES_ORGASM_DICK] + "\n";
				if (flags[kFLAGS.TIMES_ORGASM_ANAL] > 0) 
					miscStats += "<i>Butt tension:</i> " + flags[kFLAGS.TIMES_ORGASM_ANAL] + "\n";
				if (flags[kFLAGS.TIMES_ORGASM_VAGINAL] > 0) 
					miscStats += "<i>Pussy tension:</i> " + flags[kFLAGS.TIMES_ORGASM_VAGINAL] + "\n";
				if (flags[kFLAGS.TIMES_ORGASM_TITS] > 0) 
					miscStats += "<i>Tits tension:</i> " + flags[kFLAGS.TIMES_ORGASM_TITS] + "\n";
				if (flags[kFLAGS.TIMES_ORGASM_LIPS] > 0) 
					miscStats += "<i>Lips tension:</i> " + flags[kFLAGS.TIMES_ORGASM_LIPS] + "\n";
				miscStats += "<i>Bimbo score:</i> " + Math.round(player.bimboScore() * 10) + "\n";
			}

			
			if (miscStats != "")
				outputText("\n<b><u>Miscellaneous Stats</u></b>\n" + miscStats);
			// End Misc Stats
			
			// Begin Addition Stats
		var  addictStats: string = "";
			//Marble Milk Addition
			if (player.statusEffectv3(StatusEffects.Marble) > 0) {
				addictStats += "<b>Marble Milk:</b> ";
				if (player.findPerk(PerkLib.MarbleResistant) < 0 && player.findPerk(PerkLib.MarblesMilk) < 0)
					addictStats += Math.round(player.statusEffectv2(StatusEffects.Marble)) + "%\n";
				else if (player.findPerk(PerkLib.MarbleResistant) >= 0)
					addictStats += "0%\n";
				else
					addictStats += "100%\n";
			}
			
			// Corrupted Minerva's Cum Addiction
			if (flags[kFLAGS.MINERVA_CORRUPTION_PROGRESS] >= 10 && flags[kFLAGS.MINERVA_CORRUPTED_CUM_ADDICTION] > 0) {
				addictStats += "<b>Minerva's Cum:</b> " + (flags[kFLAGS.MINERVA_CORRUPTED_CUM_ADDICTION] * 20) + "%";
			}
			
			// Mino Cum Addiction
			if (flags[kFLAGS.MINOTAUR_CUM_INTAKE_COUNT] > 0 || flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] > 0 || player.findPerk(PerkLib.MinotaurCumAddict) >= 0 || player.findPerk(PerkLib.MinotaurCumResistance) >= 0) {
				if (player.findPerk(PerkLib.MinotaurCumAddict) < 0)
					addictStats += "<b>Minotaur Cum:</b> " + Math.round(flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] * 10)/10 + "%\n";
				else if (player.findPerk(PerkLib.MinotaurCumResistance) >= 0)
					addictStats += "<b>Minotaur Cum:</b> 0% (Immune)\n";
				else
					addictStats += "<b>Minotaur Cum:</b> 100+%\n";
			}
			
			if (addictStats != "")
				outputText("\n<b><u>Addictions</u></b>\n" + addictStats);
			// End Addition Stats
			
			// Begin Interpersonal Stats
		var  interpersonStats: string = "";
			
			if (getGame().dungeons.palace.anzuScene.anzuRelationshipLevel() > 0) {
				interpersonStats += "<b>Anzu's Affection:</b> " + flags[kFLAGS.ANZU_AFFECTION] + "%\n";
				interpersonStats += "<b>Anzu's Relationship Level:</b> " + (flags[kFLAGS.ANZU_RELATIONSHIP_LEVEL] == 1 ? "Acquaintances" : flags[kFLAGS.ANZU_RELATIONSHIP_LEVEL] == 2 ? "Friend" : flags[kFLAGS.ANZU_RELATIONSHIP_LEVEL] == 3 ? "Close Friend" : flags[kFLAGS.ANZU_RELATIONSHIP_LEVEL] == 4 ? "Lover" : "Undefined") + "\n";
			}
			
			if (flags[kFLAGS.ARIAN_PARK] > 0)
				interpersonStats += "<b>Arian's Health:</b> " + Math.round(getGame().arianScene.arianHealth()) + "\n";
				
			if (flags[kFLAGS.ARIAN_VIRGIN] > 0)
				interpersonStats += "<b>Arian Sex Counter:</b> " + Math.round(flags[kFLAGS.ARIAN_VIRGIN]) + "\n";
			
			if (getGame().bazaar.benoit.benoitAffection() > 0)
				interpersonStats += "<b>" + getGame().bazaar.benoit.benoitMF("Benoit", "Benoite") + " Affection:</b> " + Math.round(getGame().bazaar.benoit.benoitAffection()) + "%\n";
			
			if (flags[kFLAGS.BROOKE_MET] > 0)
				interpersonStats += "<b>Brooke's Affection:</b> " + Math.round(getGame().telAdre.brooke.brookeAffection()) + "\n";
				
			if (flags[kFLAGS.CERAPH_DICKS_OWNED] + flags[kFLAGS.CERAPH_PUSSIES_OWNED] + flags[kFLAGS.CERAPH_TITS_OWNED] > 0)
				interpersonStats += "<b>Body Parts Taken By Ceraph:</b> " + (flags[kFLAGS.CERAPH_DICKS_OWNED] + flags[kFLAGS.CERAPH_PUSSIES_OWNED] + flags[kFLAGS.CERAPH_TITS_OWNED]) + "\n";
				
			if (getGame().emberScene.emberAffection() > 0)
				interpersonStats += "<b>Ember's Affection:</b> " + Math.round(getGame().emberScene.emberAffection()) + "%\n";
			if (getGame().emberScene.emberSparIntensity() > 0)
				interpersonStats += "<b>Ember Spar Intensity:</b> " + getGame().emberScene.emberSparIntensity() + "\n";
				
			if (getGame().helFollower.helAffection() > 0)
				interpersonStats += "<b>Helia's Affection:</b> " + Math.round(getGame().helFollower.helAffection()) + "%\n";
			if (getGame().helFollower.helAffection() >= 100)
				interpersonStats += "<b>Helia Bonus Points:</b> " + Math.round(flags[kFLAGS.HEL_BONUS_POINTS]) + "\n";
			if (getGame().helFollower.followerHel())
				interpersonStats += "<b>Helia Spar Intensity:</b> " + getGame().helScene.heliaSparIntensity() + "\n";
			if (getGame().helSpawnScene.helspawnSparIntensity() > 0)
				interpersonStats += "<b>" + getGame().flags[kFLAGS.HELSPAWN_NAME] + " Spar Intensity:</b> " + getGame().helSpawnScene.helspawnSparIntensity() + "\n";
			
			if (flags[kFLAGS.ISABELLA_AFFECTION] > 0) {
				interpersonStats += "<b>Isabella's Affection:</b> ";
				
				if (!getGame().isabellaFollowerScene.isabellaFollower())
					interpersonStats += Math.round(flags[kFLAGS.ISABELLA_AFFECTION]) + "%\n", false;
				else
					interpersonStats += "100%\n";
			}
			if (getGame().isabellaScene.isabellaSparIntensity() > 0)
				interpersonStats += "<b>Isabella Spar Intensity:</b> " + getGame().isabellaScene.isabellaSparIntensity() + "\n";
			
			if (flags[kFLAGS.JOJO_BIMBO_STATE] >= 3) {
				interpersonStats += "<b>Joy's Intelligence:</b> " + flags[kFLAGS.JOY_INTELLIGENCE];
				if (flags[kFLAGS.JOY_INTELLIGENCE] >= 50) interpersonStats += " (MAX)"
				interpersonStats += "\n";
			}
			
			if (flags[kFLAGS.KATHERINE_UNLOCKED] >= 4) {
				interpersonStats += "<b>Katherine's Submissiveness:</b> " + getGame().telAdre.katherine.submissiveness() + "\n";
			}

			if (player.hasStatusEffect(StatusEffects.Kelt) && flags[kFLAGS.KELT_BREAK_LEVEL] == 0 && flags[kFLAGS.KELT_KILLED] == 0) {
				if (player.statusEffectv2(StatusEffects.Kelt) >= 130)
					interpersonStats += "<b>Submissiveness To Kelt:</b> " + 100 + "%\n";
				else
					interpersonStats += "<b>Submissiveness To Kelt:</b> " + Math.round(player.statusEffectv2(StatusEffects.Kelt) / 130 * 100) + "%\n";
					
			}
			
			if (flags[kFLAGS.ANEMONE_KID] > 0)
				interpersonStats += "<b>Kid A's Confidence:</b> " + getGame().anemoneScene.kidAXP() + "%\n";

			if (flags[kFLAGS.KIHA_AFFECTION_LEVEL] >= 2 || getGame().kihaFollower.followerKiha()) {
				if (getGame().kihaFollower.followerKiha())
					interpersonStats += "<b>Kiha's Affection:</b> " + 100 + "%\n";
				else
					interpersonStats += "<b>Kiha's Affection:</b> " + Math.round(flags[kFLAGS.KIHA_AFFECTION]) + "%\n";
				interpersonStats += "<b>Kiha Spar Intensity:</b> " + getGame().kihaScene.kihaSparIntensity() + "\n";
			}
			//Lottie stuff
			if (flags[kFLAGS.LOTTIE_ENCOUNTER_COUNTER] > 0)
				interpersonStats += "<b>Lottie's Encouragement:</b> " + getGame().telAdre.lottie.lottieMorale() + " (higher is better)\n" + "<b>Lottie's Figure:</b> " + getGame().telAdre.lottie.lottieTone() + " (higher is better)\n";
			
			if (getGame().mountain.salon.lynnetteApproval() != 0)
				interpersonStats += "<b>Lynnette's Approval:</b> " + getGame().mountain.salon.lynnetteApproval() + "\n";
			
			if (player.statusEffectv1(StatusEffects.Marble) > 0)
				interpersonStats += "<b>Marble's Affection:</b> " + player.statusEffectv1(StatusEffects.Marble) + "%\n";
				
			if (flags[kFLAGS.MINERVA_SPAR_VICTORIES] > 0)
				interpersonStats += "<b>Minerva Spar Intensity:</b> " + getGame().highMountains.minervaScene.minervaSparIntensity() + "\n";
				
			if (flags[kFLAGS.OWCAS_ATTITUDE] > 0)
				interpersonStats += "<b>Owca's Attitude:</b> " + flags[kFLAGS.OWCAS_ATTITUDE] + "\n";

			if (getGame().telAdre.pablo.pabloAffection() > 0)
				interpersonStats += "<b>Pablo's Affection:</b> " + flags[kFLAGS.PABLO_AFFECTION] + "%\n";
				
			if (getGame().telAdre.rubi.rubiAffection() > 0)
				interpersonStats += "<b>Rubi's Affection:</b> " + Math.round(getGame().telAdre.rubi.rubiAffection()) + "%\n" + "<b>Rubi's Orifice Capacity:</b> " + Math.round(getGame().telAdre.rubi.rubiCapacity()) + "%\n";

			if (flags[kFLAGS.SHEILA_XP] != 0) {
				interpersonStats += "<b>Sheila's Corruption:</b> " + getGame().sheilaScene.sheilaCorruption();
				if (getGame().sheilaScene.sheilaCorruption() > 100)
					interpersonStats += " (Yes, it can go above 100)";
				interpersonStats += "\n";
			}
			
			if (getGame().valeria.valeriaFluidsEnabled()) {
				interpersonStats += "<b>Valeria's Fluid:</b> " + flags[kFLAGS.VALERIA_FLUIDS] + "%\n"
			}
			if (flags[kFLAGS.MINERVA_SPAR_VICTORIES] > 0)
				interpersonStats += "<b>Valeria Spar Intensity:</b> " + getGame().valeria.valeriaSparIntensity() + "\n";
			
			if (flags[kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY] != 0) {
				if (getGame().urta.urtaLove()) {
					if (flags[kFLAGS.URTA_QUEST_STATUS] == -1) interpersonStats += "<b>Urta's Status:</b> <font color=\"#800000\">Gone</font>\n";
					if (flags[kFLAGS.URTA_QUEST_STATUS] == 0) interpersonStats += "<b>Urta's Status:</b> Lover\n";
					if (flags[kFLAGS.URTA_QUEST_STATUS] == 1) interpersonStats += "<b>Urta's Status:</b> <font color=\"#008000\">Lover+</font>\n";
				}
				else if (flags[kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY] == -1)
					interpersonStats += "<b>Urta's Status:</b> Ashamed\n";
				else if (flags[kFLAGS.URTA_PC_AFFECTION_COUNTER] < 30)
					interpersonStats += "<b>Urta's Affection:</b> " + Math.round(flags[kFLAGS.URTA_PC_AFFECTION_COUNTER] * 3.3333) + "%\n";
				else
					interpersonStats += "<b>Urta's Status:</b> Ready To Confess Love\n";
			}
			
			if (flags[kFLAGS.AIKO_TIMES_MET] > 0) {
				interpersonStats  += "<b>Aiko affection</b>: "+flags[kFLAGS.AIKO_AFFECTION]+"\n";
				if (flags[kFLAGS.AIKO_CORRUPTION_ACTIVE] > 0)
					interpersonStats  += "<b>Aiko corruption</b>: "+flags[kFLAGS.AIKO_CORRUPTION]+"\n";
			}
			
			if (interpersonStats != "")
				outputText("\n<b><u>Interpersonal Stats</u></b>\n" + interpersonStats);
			// End Interpersonal Stats
			
			// Begin Ongoing Stat Effects
		var  statEffects: string = "";
			
			if (player.inHeat)
				statEffects += "Heat - " + Math.round(player.statusEffectv3(StatusEffects.Heat)) + " hours remaining\n";
				
			if (player.inRut)
				statEffects += "Rut - " + Math.round(player.statusEffectv3(StatusEffects.Rut)) + " hours remaining\n";
				
			if (player.statusEffectv1(StatusEffects.Luststick) > 0)
				statEffects += "Luststick - " + Math.round(player.statusEffectv1(StatusEffects.Luststick)) + " hours remaining\n";
				
			if (player.statusEffectv1(StatusEffects.LustStickApplied) > 0)
				statEffects += "Luststick Application - " + Math.round(player.statusEffectv1(StatusEffects.LustStickApplied)) + " hours remaining\n";
				
			if (player.statusEffectv1(StatusEffects.LustyTongue) > 0)
				statEffects += "Lusty Tongue - " + Math.round(player.statusEffectv1(StatusEffects.LustyTongue)) + " hours remaining\n";
				
			if (player.statusEffectv1(StatusEffects.BlackCatBeer) > 0)
				statEffects += "Black Cat Beer - " + player.statusEffectv1(StatusEffects.BlackCatBeer) + " hours remaining (Lust resistance 20% lower, physical resistance 25% higher.)\n";

			if (player.statusEffectv1(StatusEffects.AndysSmoke) > 0)
				statEffects += "Andy's Pipe Smoke - " + player.statusEffectv1(StatusEffects.AndysSmoke) + " hours remaining (Speed temporarily lowered, intelligence temporarily increased.)\n";
				
			if (player.statusEffectv1(StatusEffects.IzumisPipeSmoke) > 0) 
				statEffects += "Izumi's Pipe Smoke - " + player.statusEffectv1(StatusEffects.IzumisPipeSmoke) + " hours remaining. (Speed temporarily lowered.)\n";

			if (player.statusEffectv1(StatusEffects.UmasMassage) > 0) 
				statEffects += "Uma's Massage - " + player.statusEffectv3(StatusEffects.UmasMassage) + " hours remaining.\n";
				
			if (player.statusEffectv1(StatusEffects.Dysfunction) > 0) 
				statEffects += "Dysfunction - " + player.statusEffectv1(StatusEffects.Dysfunction) + " hours remaining. (Disables masturbation)\n";

			if (statEffects != "")
				outputText("\n<b><u>Ongoing Status Effects</u></b>\n" + statEffects);
			// End Ongoing Stat Effects
			menu();
			addButton(0, "Next", playerMenu);
			if (player.statPoints > 0) {
				outputText("\n\n<b>You have " + num2Text(player.statPoints) + " attribute point" + (player.statPoints == 1 ? "" : "s") + " to distribute.</b>");
				addButton(1, "Stat Up", attributeMenu);
			}
		}
		
		//------------
		// PERKS
		//------------
		public  displayPerks(): void {
			clearOutput();
			displayHeader("Perks");
			for (var i: number = 0; i < player.perks.length; i++) {
				outputText("<b>" + player.perks[i].perkName + "</b> - " + player.perks[i].perkDesc + "\n");
			}
			menu();
		var  button: number = 0;
			addButton(button++, "Next", playerMenu);
			if (player.perkPoints > 0) {
				outputText("\n<b>You have " + num2Text(player.perkPoints) + " perk point");
				if (player.perkPoints > 1) outputText("s");
				outputText(" to spend.</b>");
				addButton(button++, "Perk Up", perkBuyMenu);
			}
			if (player.findPerk(PerkLib.DoubleAttack) >= 0) {
				outputText("\n<b>You can adjust your double attack settings.</b>");
				addButton(button++,"Dbl Options",doubleAttackOptions);
			}
		
			if (player.findPerk(PerkLib.AscensionTolerance) >= 0){
				outputText("\n<b>You can adjust your Corruption Tolerance threshold.</b>");
				addButton(button++,"Tol. Options",ascToleranceOption).hint("Set whether or not Corruption Tolerance is applied.");
			}
			addButton(9, "Database", perkDatabase);
		}

		public  doubleAttackOptions(): void {
			clearOutput();
			menu();
			if (flags[kFLAGS.DOUBLE_ATTACK_STYLE] == 0) {
				outputText("You will currently always double attack in combat.  If your strength exceeds sixty, your double-attacks will be done at sixty strength in order to double-attack.");
				outputText("\n\nYou can change it to double attack until sixty strength and then dynamically switch to single attacks.");
				outputText("\nYou can change it to always single attack.");
			}
			else if (flags[kFLAGS.DOUBLE_ATTACK_STYLE] == 1) {
				outputText("You will currently double attack until your strength exceeds sixty, and then single attack.");
				outputText("\n\nYou can choose to force double attacks at reduced strength (when over sixty, it makes attacks at a strength of sixty.");
				outputText("\nYou can change it to always single attack.");
			}
			else {
				outputText("You will always single attack your foes in combat.");
				outputText("\n\nYou can choose to force double attacks at reduced strength (when over sixty, it makes attacks at a strength of sixty.");
				outputText("\nYou can change it to double attack until sixty strength and then switch to single attacks.");
			}
			if (flags[kFLAGS.DOUBLE_ATTACK_STYLE] != 0) addButton(0, "All Double", doubleAttackForce);
			if (flags[kFLAGS.DOUBLE_ATTACK_STYLE] != 1) addButton(1, "Dynamic", doubleAttackDynamic);
			if (flags[kFLAGS.DOUBLE_ATTACK_STYLE] != 2) addButton(2, "Single", doubleAttackOff);
			addButton(4, "Back", displayPerks);
		}

		public  doubleAttackForce(): void {
			flags[kFLAGS.DOUBLE_ATTACK_STYLE] = 0;
			doubleAttackOptions();
		}
		public  doubleAttackDynamic(): void {
			flags[kFLAGS.DOUBLE_ATTACK_STYLE] = 1;
			doubleAttackOptions();
		}
		public  doubleAttackOff(): void {
			flags[kFLAGS.DOUBLE_ATTACK_STYLE] = 2;
			doubleAttackOptions();
		}
		
		public  ascToleranceOption(): void{
			clearOutput();
			menu();
			if (player.perkv2(PerkLib.AscensionTolerance) == 0){
				outputText("Corruption Tolerance is under effect, giving you " + player.corruptionTolerance() + " tolerance on most corruption events." +
				"\n\nYou can disable this perk's effects at any time.<b>Some camp followers may leave you immediately after doing this. Save beforehand!</b>");
				addButton(0, "Disable", disableTolerance);
			}else addButtonDisabled(0, "Disable", "The perk is already disabled.");
			if (player.perkv2(PerkLib.AscensionTolerance) == 1){
				outputText("Ascension Tolerance is not under effect. You may enable it at any time.");
				addButton(1, "Enable", enableTolerance);
			}else addButtonDisabled(1, "Enable", "The perk is already enabled.");
			addButton(4, "Back", displayPerks);
		}
		
		public  disableTolerance(): void{
			player.setPerkValue(PerkLib.AscensionTolerance, 2, 1);
			ascToleranceOption();
		}
		public  enableTolerance(): void{
			player.setPerkValue(PerkLib.AscensionTolerance, 2, 0);
			ascToleranceOption();
		}

		public  perkDatabase(page: number=0, count: number=20): void {
		var  allPerks: any[] = PerkTree.obtainablePerks();
			clearOutput();
		var  perks: any[] = allPerks.slice(page*count,(page+1)*count);
			displayHeader("All Perks ("+(1+page*count)+"-"+(page*count+perks.length)+
					"/"+allPerks.length+")");
			for each (var ptype:PerkType in perks) {
			var  pclass:Perk = player.perk(player.findPerk(ptype));

			var  color: string;
				if (pclass) color='#000000'; // has perk
				else if (ptype.available(player)) color='#228822'; // can take on next lvl
				else color='#aa8822'; // requirements not met

				outputText("<font color='" +color +"'><b>"+ptype.name+"</b></font>: ");
				outputText(pclass?ptype.desc(pclass):ptype.longDesc);
				if (!pclass && ptype.requirements.length>0) {
				var  reqs: any[] = [];
					for each (var cond: Record<string, any> in ptype.requirements) {
						if (cond.fn(player)) color='#000000';
						else color='#aa2222';
						reqs.push("<font color='"+color+"'>"+cond.text+"</font>");
					}
					outputText("<ul><li><b>Requires:</b> " + reqs.join(", ")+".</li></ul>");
				} else {
					outputText("\n");
				}
			}
			if (page>0) addButton(0,"Prev",perkDatabase,page-1);
			else addButtonDisabled(0,"Prev");
			if ((page+1)*count<allPerks.length) addButton(1,"Next",perkDatabase,page+1);
			else addButtonDisabled(1,"Next");
			addButton(9, "Back", playerMenu);
		}
		
		//------------
		// LEVEL UP
		//------------
		public  levelUpGo(): void {
			clearOutput();
			hideMenus();
			//First thing first...
			if (!pane.initialized) {
				pane.configureLevelUpMenu();
			}
			//Level up
			if (player.XP >= player.requiredXP() && player.level < getGame().levelCap) {
				player.XP -= player.requiredXP();
				player.level++;
				player.perkPoints++;
				player.statPoints += 5;
				if (player.level % 2 == 0) player.ascensionPerkPoints++;
				(pane.getElementByName("LevelMessage") as TextField).htmlText = "You are now level " + player.level + "!";
				pane.getElementByName("LevelMessage").visible = true;
				attributeMenu();
			}
			//Spend attribute points
			else if (player.statPoints > 0) {
				pane.getElementByName("LevelMessage").visible = false;
				attributeMenu();
			}
			//Spend perk points
			else if (player.perkPoints > 0) {
				perkBuyMenu();
			}
			else {
				outputText("<b>ERROR.  LEVEL UP PUSHED WHEN PC CANNOT LEVEL OR GAIN PERKS.  PLEASE REPORT THE STEPS TO REPRODUCE THIS BUG TO FENOXO@GMAIL.COM OR THE FENOXO.COM BUG REPORT FORUM.</b>");
				doNext(playerMenu);
			}
		}

		//Attribute menu
		private  attributeMenu(): void {
			clearOutput();
			mainView.mainText.visible = false;
			mainView.addChild(pane);
			(pane.getElementByName("AttributeMessage") as TextField).htmlText = "You have <b>" + (player.statPoints > 0 ? player.statPoints : "no") + "</b> point" + (player.statPoints == 1 ? "" : "s") + " left to spend.";
			//Those arrays work in parallel ways.
		var  attributes: any[] = [player.str, player.tou, player.spe, player.inte];
		var  attributeTemps: any[] = [player.tempStr, player.tempTou, player.tempSpe, player.tempInt];
		var  attributeStrings: any[] = ["Str", "Tou", "Spe", "Int"];
			//Run through the loop for a total of four times.
			for (var i: number = 0; i < 4; i++) {
				(pane.getElementByName("Number" + attributeStrings[i]) as TextField).htmlText = (Math.floor(attributes[i])).toString();
				(pane.getElementByName("Number" + attributeStrings[i] + "Mod") as TextField).htmlText = "+" + attributeTemps[i];
				(pane.getElementByName("Number" + attributeStrings[i] + "Mod") as TextField).alpha = (attributeTemps[i] > 0 ? 1 : 0.3);
				(pane.getElementByName("Number" + attributeStrings[i] + "Rslt") as TextField).htmlText = "→" + (Math.floor(attributes[i] + attributeTemps[i])).toString();
				//Addition & Subtraction buttons
				(pane.getElementByName("Button" + attributeStrings[i] + "Plus") as CoCButton).disableIf(attributes[i] + attributeTemps[i] >= player.getMaxStats(attributeStrings[i].toLowerCase()) || player.statPoints <= 0);
				(pane.getElementByName("Button" + attributeStrings[i] + "Minus") as CoCButton).disableIf(attributeTemps[i] <= 0);
			}
			menu();
			addButton(1, "Reset", resetAttributes);
			addButton(3, "Done", finishAttributes);
		}

		public  addAttribute(attribute: string): void {
			switch(attribute) {
				case "str":
					player.tempStr++;
					break;
				case "tou":
					player.tempTou++;
					break;
				case "spe":
					player.tempSpe++;
					break;
				case "int":
					player.tempInt++;
					break;
				default:
					player.statPoints++; //Failsafe
			}
			player.statPoints--;
			attributeMenu();
		}
		public  subtractAttribute(attribute: string): void {
			switch(attribute) {
				case "str":
					player.tempStr--;
					break;
				case "tou":
					player.tempTou--;
					break;
				case "spe":
					player.tempSpe--;
					break;
				case "int":
					player.tempInt--;
					break;
				default:
					player.statPoints--; //Failsafe
			}
			player.statPoints++;
			attributeMenu();
		}
		private  resetAttributes(): void {
			//Increment unspent attribute points.
			player.statPoints += player.tempStr;
			player.statPoints += player.tempTou;
			player.statPoints += player.tempSpe;
			player.statPoints += player.tempInt;
			//Reset temporary attributes to 0.
			player.tempStr = 0;
			player.tempTou = 0;
			player.tempSpe = 0;
			player.tempInt = 0;
			//DONE!
			attributeMenu();
		}
		private  finishAttributes(): void {
			mainView.removeChild(pane);
			mainView.mainText.visible = true;
			clearOutput();
			if (player.tempStr > 0)
			{
				if (player.tempStr >= 3) outputText("Your muscles feel significantly stronger from your time adventuring.\n");
				else outputText("Your muscles feel slightly stronger from your time adventuring.\n");
			}
			if (player.tempTou > 0)
			{
				if (player.tempTou >= 3) outputText("You feel tougher from all the fights you have endured.\n");
				else outputText("You feel slightly tougher from all the fights you have endured.\n");
			}
			if (player.tempSpe > 0)
			{
				if (player.tempSpe >= 3) outputText("Your time in combat has driven you to move faster.\n");
				else outputText("Your time in combat has driven you to move slightly faster.\n");
			}
			if (player.tempInt > 0)
			{
				if (player.tempInt >= 3) outputText("Your time spent fighting the creatures of this realm has sharpened your wit.\n");
				else outputText("Your time spent fighting the creatures of this realm has sharpened your wit slightly.\n");
			}
			if (player.tempStr + player.tempTou + player.tempSpe + player.tempInt <= 0 || player.statPoints > 0)
			{
				outputText("\nYou may allocate your remaining stat points later.");
			}
			dynStats("str", player.tempStr, "tou", player.tempTou, "spe", player.tempSpe, "int", player.tempInt, "scale", false);
			player.tempStr = 0;
			player.tempTou = 0;
			player.tempSpe = 0;
			player.tempInt = 0;
			if (player.perkPoints > 0)
				doNext(perkBuyMenu);
			else
				doNext(playerMenu);
		}
		public  boxPerks:ComboBox;
		//Perk menu
		private  perkBuyMenu(): void {
			clearOutput();
		var  preList: any[] = [];
			preList = buildPerkList();
			if (preList.length == 0) {
				outputText(images.showImage("event-cross"));
				outputText("<b>You do not qualify for any perks at present.  </b>In case you qualify for any in the future, you will keep your " + num2Text(player.perkPoints) + " perk point");
				if (player.perkPoints > 1) outputText("s");
				outputText(".");
				doNext(playerMenu);
				return;
			}
			outputText(images.showImage("event-arrow-up"));
			outputText("Please select a perk from the drop-down list, then click 'Okay'.  You can press 'Skip' to save your perk point for later.\n\n\n");
			boxPerks = new ComboBox();
			boxPerks.width = 200; 
			boxPerks.scaleY = 1.1;
			boxPerks.defaultLabel = "Select a perk";
			boxPerks.x = 210;
			boxPerks.y = 112;
			boxPerks.items = preList;
			mainView.addChild(boxPerks);
			boxPerks.visible = true;
			menu();
			boxPerks.addEventListener(Event.SELECT, changeHandler);
			addButton(1, "Skip", perkSkip);
		}
		private  perkSelect(selected:Perk): void {
			mainView.stage.focus = undefined;
			if (boxPerks.parent != undefined) {
				mainView.removeChild(boxPerks);
				applyPerk(selected);
			}
		}
		private  perkSkip(): void {
			mainView.stage.focus = undefined;
			if (boxPerks != undefined) {
				mainView.removeChild(boxPerks);
				playerMenu();
			}
		}

		public  changeHandler(event:Event): void {
			//Store perk name for later addition
			clearOutput();
		var  selected:Perk = ComboBox(event.target).selectedItem.perk;
			boxPerks.move(210, 85);
			outputText("You have selected the following perk:\n\n\n");
			outputText("<b>" + selected.perkName + ":</b> " + selected.perkLongDesc);
		var  unlocks: any[] = kGAMECLASS.perkTree.listUnlocks(selected.ptype);
			if (unlocks.length>0){
				outputText("\n\n<b>Unlocks:</b> <ul>");
				for each (var pt:PerkType in unlocks) outputText("<li><b>"+pt.name+"</b> ("+pt.longDesc+")</li>");
				outputText("</ul>");
			}
			outputText("\n\nIf you would like to select this perk, click <b>Okay</b>.  Otherwise, select a new perk, or press <b>Skip</b> to make a decision later.");
			menu();
			addButton(0, "Okay", perkSelect, selected);
			addButton(1, "Skip", perkSkip);
		}

		public  buildPerkList(): any[] {
		var  player:Player  = kGAMECLASS.player;
		var  perks: any[] = PerkTree.availablePerks(player);
		var  perkList: any[] = [];
			for each(var perk:PerkType in perks) {
			var  p:Perk = new Perk(perk,
						perk.defaultValue1, perk.defaultValue2, perk.defaultValue3, perk.defaultValue4);
				perkList.push({label: p.perkName, perk: p});
			}
			return perkList;
		}
		public  applyPerk(perk:Perk): void {
			clearOutput();
			player.perkPoints--;
			//Apply perk here.
			outputText("<b>" + perk.perkName + "</b> gained!");
			player.createPerk(perk.ptype, perk.value1, perk.value2, perk.value3, perk.value4);
			if (perk.ptype == PerkLib.StrongBack2) player.itemSlot(4).unlocked = true;
			if (perk.ptype == PerkLib.StrongBack) player.itemSlot(3).unlocked = true;
			if (perk.ptype == PerkLib.Tank2) {
				player.HPChange(player.tou, false);
				statScreenRefresh();
			}
			doNext(playerMenu);
		}
	}


