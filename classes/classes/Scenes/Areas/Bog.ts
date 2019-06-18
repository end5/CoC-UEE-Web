/* Created by aimozg on 06.01.14 */

	use namespace kGAMECLASS;

	export class Bog extends BaseContent implements IExplorable {
		public  frogGirlScene:FrogGirlScene;
		public  chameleonGirlScene:ChameleonGirlScene = new ChameleonGirlScene();
		public  phoukaScene:PhoukaScene;
		public  lizanScene:LizanRogueScene = new LizanRogueScene();
		/* [INTERMOD:8chan]
		public  parasiteScene:ParasiteScene = new ParasiteScene();
		public  infestedChameleonGirlScene:InfestedChameleonGirlScene = new InfestedChameleonGirlScene();
		*/
		public  Bog(pregnancyProgression:PregnancyProgression, output: GuiOutput) {
			this.phoukaScene = new PhoukaScene(pregnancyProgression);
			this.frogGirlScene = new FrogGirlScene(pregnancyProgression, output);
		}
		
		public  isDiscovered(): boolean { return flags[kFLAGS.BOG_EXPLORED] > 0; }
		public  discover(): void {
			clearOutput();
			outputText(images.showImage("area-bog"));
			outputText("While exploring the swamps, you find yourself into a particularly dark, humid area of this already fetid biome.  You judge that you could find your way back here pretty easily in the future, if you wanted to.  With your newfound discovery fresh in your mind, you return to camp.\n\n(<b>Bog exploration location unlocked!</b>)");
			flags[kFLAGS.BOG_EXPLORED]++;
			doNext(camp.returnToCampUseOneHour);
		}

		private  _explorationEncounter:Encounter = undefined;
		public  get explorationEncounter():Encounter {
		const  game:CoC = kGAMECLASS;
		const  fn:FnHelpers = Encounters.fn;
			if (_explorationEncounter == undefined) _explorationEncounter =
					Encounters.group(game.commonEncounters, {
						name: "phoukahalloween",
						when: function (): boolean {
							//Must have met them enough times to know what they're called, have some idea of their normal behaviour
							return isHalloween()
								   && date.fullYear > flags[kFLAGS.TREACLE_MINE_YEAR_DONE] == 0
								   && flags[kFLAGS.PHOUKA_LORE] > 0;
						},
						call: phoukaScene.phoukaHalloween
					}, {
						name  : "chest",
						chance: 0.1,
						when  : function (): boolean {
							return player.hasKeyItem("Camp - Murky Chest") < 0;
						},
						call  : findMurkyChest
					}, {
						name: "froggirl",
						when: function (): boolean {
							return player.buttPregnancyIncubation == 0
						},
						call: frogGirlScene.findTheFrogGirl
					}, {
						name: "phouka",
						call: phoukaScene.phoukaEncounter
					}, {
						name: "chameleon",
						call: chameleonGirlScene.encounterChameleon
					}, {
						name: "lizan",
						call: lizanScene.lizanIntro
					}, {
					/* [INTERMOD: 8chan]
						name  : "parasite",
						when  : function (): boolean {
							return player.hasStatusEffect(StatusEffects.WormsOn)
								   && !player.hasStatusEffect(StatusEffects.ParasiteSlugMet);
						},
						chance: function (): number {
							return player.hasStatusEffect(StatusEffects.WormsHalf) ? 0.5 : 1
						},
						call  : parasiteScene.findParasite
					}, {
						name  : "inf_chameleon",
						when  : function (): boolean {
							return player.hasStatusEffect(StatusEffects.WormsOn)
								   && !player.hasStatusEffect(StatusEffects.ParasiteEel);
						},
						chance: function (): number {
							return player.hasStatusEffect(StatusEffects.WormsHalf) ? 0.5 : 1
						},
						call  : infestedChameleonGirlScene.encounterChameleon
					}, {
					*/
						name  : "walk",
						chance: 0.2,
						call  : walk
					});
			return _explorationEncounter;
		}
		public  explore(): void {
			explorationEncounter.execEncounter();
			flags[kFLAGS.BOG_EXPLORED]++;
		}

		public  walk(): void {
			clearOutput();
			outputText(images.showImage("area-bog"));
			outputText("You wander around through the humid muck, but you don't run into anything interesting.");
			doNext(camp.returnToCampUseOneHour);
		}

		public  findMurkyChest(): void {
		var  gemsFound: number = 200 + rand(300);
			outputText(images.showImage("item-chest"));
			outputText("While you're minding your own business, you spot a waterlogged chest. You wade in the murky waters until you finally reach the chest. As you open the chest, you find " + String(gemsFound) + " gems inside the chest! You pocket the gems and haul the chest home. It would make a good storage once you clean the inside of the chest.  ");
			player.createKeyItem("Camp - Murky Chest", 0, 0, 0, 0);
			for (var i: number = 0; i < 4; i++) inventory.createStorage();
			player.gems += gemsFound;
			statScreenRefresh();
			outputText("\n\n<b>You now have " + num2Text(inventory.itemStorageDirectGet().length) + " storage item slots at camp.</b>");
			doNext(camp.returnToCampUseOneHour);
		}
	}

