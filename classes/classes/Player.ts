
	use namespace kGAMECLASS;

	/**
	 * ...
	 * @author Yoffy
	 */
	export class Player extends PlayerHelper implements Serializable {
		private static  LOGGER:ILogger = LoggerFactory.getLogger(Player);
		
		private static  SERIALIZATION_VERSION: number = 1;
		private static  NUMBER_OF_ITEMSLOTS: number = 10;
		
		public  Player() {
			itemSlots = new Vector.<classes.ItemSlot>();
			initializeItemSlots();
		}
		
		private  initializeItemSlots(): void
		{
			for (var i: number = 0; i < NUMBER_OF_ITEMSLOTS; i++) {
				itemSlots.push(new ItemSlot());
			}
			
			itemSlot(0).unlocked = true;
			itemSlot(1).unlocked = true;
			itemSlot(2).unlocked = true;
		}
		
		protected  outputText(text: string): void
		{
			game.outputText(text);
		}
		
		public  startingRace: string = "human";
		
		//Autosave
		public  slotName: string = "VOID";
		public  autoSave: boolean = false;

		//Lust vulnerability
		//TODO: Kept for backwards compatibility reasons but should be phased out.
		public  lustVuln: number = 1;

		//Teasing attributes
		public  teaseLevel: number = 0;
		public  teaseXP: number = 0;
		
		//Prison stats
		public  hunger: number = 0; //Also used in survival and realistic mode
		public  obey: number = 0;
		public  esteem: number = 0;
		public  will: number = 0;
		
		public  obeySoftCap: boolean = true;
		
		//Perks used to store 'queued' perk buys
		public  perkPoints: number = 0;
		public  statPoints: number = 0;
		public  ascensionPerkPoints: number = 0;
		
		public  tempStr: number = 0;
		public  tempTou: number = 0;
		public  tempSpe: number = 0;
		public  tempInt: number = 0;

		//Player pregnancy variables and functions
		public  pregnancyUpdate(): boolean {
			return game.pregnancyProgress.updatePregnancy(); //Returns true if we need to make sure pregnancy texts aren't hidden
		}
		
		public  itemSlots:Vector.<ItemSlot>;
		
		public  prisonItemSlots: any[] = [];
		public  previouslyWornClothes:/*String*/Array = []; //For tracking achievement.
		
		private  _weapon:Weapon = WeaponLib.FISTS;
		private  _armor:Armor = ArmorLib.COMFORTABLE_UNDERCLOTHES;
		private  _jewelry:Jewelry = JewelryLib.NOTHING;
		//private var _jewelry2:Jewelry = JewelryLib.NOTHING;
		private  _shield:Shield = ShieldLib.NOTHING;
		private  _upperGarment:Undergarment = UndergarmentLib.NOTHING;
		private  _lowerGarment:Undergarment = UndergarmentLib.NOTHING;
		private  _modArmorName: string = "";
		public  get hunger100(): number { return 100*hunger/maxHunger(); }

		//override public function set armors
		public  set armorValue(value: number): void
		{
			CoC_Settings.error("ERROR: attempt to directly set armorValue.");
		}

		public  set armorName(value: string): void
		{
			CoC_Settings.error("ERROR: attempt to directly set armorName.");
		}

		public  set armorDef(value: number): void
		{
			CoC_Settings.error("ERROR: attempt to directly set armorDef.");
		}

		public  set armorPerk(value: string): void
		{
			CoC_Settings.error("ERROR: attempt to directly set armorPerk.");
		}

		//override public function set weapons
		public  set weaponName(value: string): void
		{
			CoC_Settings.error("ERROR: attempt to directly set weaponName.");
		}

		public  set weaponVerb(value: string): void
		{
			CoC_Settings.error("ERROR: attempt to directly set weaponVerb.");
		}

		public  set weaponAttack(value: number): void
		{
			CoC_Settings.error("ERROR: attempt to directly set weaponAttack.");
		}

		public  set weaponPerk(value: string): void
		{
			CoC_Settings.error("ERROR: attempt to directly set weaponPerk.");
		}

		public  set weaponValue(value: number): void
		{
			CoC_Settings.error("ERROR: attempt to directly set weaponValue.");
		}

		//override public function set jewelries
		public  set jewelryName(value: string): void
		{
			CoC_Settings.error("ERROR: attempt to directly set jewelryName.");
		}
		
		public  set jewelryEffectId(value: number): void
		{
			CoC_Settings.error("ERROR: attempt to directly set jewelryEffectId.");
		}
		
		public  set jewelryEffectMagnitude(value: number): void
		{
			CoC_Settings.error("ERROR: attempt to directly set jewelryEffectMagnitude.");
		}
				
		public  set jewelryPerk(value: string): void
		{
			CoC_Settings.error("ERROR: attempt to directly set jewelryPerk.");
		}
		
		public  set jewelryValue(value: number): void
		{
			CoC_Settings.error("ERROR: attempt to directly set jewelryValue.");
		}

		//override public function set shields
		public  set shieldName(value: string): void
		{
			CoC_Settings.error("ERROR: attempt to directly set shieldName.");
		}
		
		public  set shieldBlock(value: number): void
		{
			CoC_Settings.error("ERROR: attempt to directly set shieldBlock.");
		}
		
		public  set shieldPerk(value: string): void
		{
			CoC_Settings.error("ERROR: attempt to directly set shieldPerk.");
		}
		
		public  set shieldValue(value: number): void
		{
			CoC_Settings.error("ERROR: attempt to directly set shieldValue.");
		}
		
		//override public function set undergarments
		public  set upperGarmentName(value: string): void
		{
			CoC_Settings.error("ERROR: attempt to directly set upperGarmentName.");
		}
		
		public  set upperGarmentPerk(value: string): void
		{
			CoC_Settings.error("ERROR: attempt to directly set upperGarmentPerk.");
		}
		
		public  set upperGarmentValue(value: number): void
		{
			CoC_Settings.error("ERROR: attempt to directly set upperGarmentValue.");
		}

		public  set lowerGarmentName(value: string): void
		{
			CoC_Settings.error("ERROR: attempt to directly set lowerGarmentName.");
		}
		
		public  set lowerGarmentPerk(value: string): void
		{
			CoC_Settings.error("ERROR: attempt to directly set lowerGarmentPerk.");
		}
		
		public  set lowerGarmentValue(value: number): void
		{
			CoC_Settings.error("ERROR: attempt to directly set lowerGarmentValue.");
		}
		
		
		public  get modArmorName(): string
		{
			if (_modArmorName == undefined) _modArmorName = "";
			return _modArmorName;
		}

		public  set modArmorName(value: string): void
		{
			if (value == undefined) value = "";
			_modArmorName = value;
		}

		//override public function get armors
		public  get armorName(): string {
			if (_modArmorName.length > 0) return modArmorName;
			else if (_armor.name == "nothing" && lowerGarmentName != "nothing") return lowerGarmentName;
			else if (_armor.name == "nothing" && lowerGarmentName == "nothing") return "gear";
			return _armor.name;
		}
		public  get armorDef(): number {
		var  armorDef: number = _armor.def;
			armorDef += upperGarment.armorDef;
			armorDef += lowerGarment.armorDef;
			//Blacksmith history!
			if (armorDef > 0 && hasPerk(PerkLib.HistorySmith)) {
				armorDef = Math.round(armorDef * 1.1);
				armorDef += 1;
			}
			//Skin armor perk
			if (hasPerk(PerkLib.ThickSkin)) {
				armorDef += 2;
			}
			//Stacks on top of Thick Skin perk.
			if (hasFur()) armorDef += 1;
			if (hasReptileScales()) armorDef += 3;
			if (hasDragonScales()) armorDef += 3;
			//'Thick' dermis descriptor adds 1!
			if (skin.adj == "smooth") armorDef += 1;
			//Bonus defense
			if (arms.type == Arms.SPIDER) armorDef += 2;
			if (lowerBody.type == LowerBody.CHITINOUS_SPIDER_LEGS || lowerBody.type == LowerBody.BEE) armorDef += 2;
			//Bonus when being a samurai
			if (armor == game.armors.SAMUARM && weapon == game.weapons.KATANA0) {
				armorDef += 2;
			}
			//Agility boosts armor ratings!
		var  speedBonus: number = 0;
			if (hasPerk(PerkLib.Agility)) {
				if (armorPerk == "Light" || armorPerk == "Adornment" || _armor.name == "nothing") speedBonus += Math.round(spe/8);
				else if (armorPerk == "Medium") speedBonus += Math.round(spe/13);
				if (speedBonus > 15) speedBonus = 15;
			}
			if (hasPerk(PerkLib.Juggernaut) && tou >= 75 && armorPerk == "Heavy") {
				speedBonus += 10;
			}
			armorDef += speedBonus
			//Acupuncture effect
			if (hasPerk(PerkLib.ChiReflowDefense)) armorDef *= UmasShop.NEEDLEWORK_DEFENSE_DEFENSE_MULTI;
			if (hasPerk(PerkLib.ChiReflowAttack)) armorDef *= UmasShop.NEEDLEWORK_ATTACK_DEFENSE_MULTI;
			//Berzerking removes armor
			if (hasStatusEffect(StatusEffects.Berzerking)) {
				if (!hasPerk(PerkLib.ColdFury))
					armorDef = 0;
				else
					armorDef /= 2;
			}
			if (kGAMECLASS.monster.hasStatusEffect(StatusEffects.TailWhip)) {
				armorDef -= kGAMECLASS.monster.statusEffectv1(StatusEffects.TailWhip);
				if (armorDef < 0) armorDef = 0;
			}
			armorDef = Math.round(armorDef);
			return armorDef;
		}
		public  get armorBaseDef(): number {
			return _armor.def;
		}
		public  get armorPerk(): string {
			return _armor.perk;
		}
		public  get armorValue(): number {
			return _armor.value;
		}
		//override public function get weapons
		public  get weaponName(): string {
			return _weapon.name;
		}
		public  get weaponVerb(): string {
			return _weapon.verb;
		}
		public  get weaponAttack(): number {
		var  attack: number = _weapon.attack;
			if (hasPerk(PerkLib.WeaponMastery) && weaponPerk == "Large" && str > 60)
				attack *= 2;
			if (hasPerk(PerkLib.LightningStrikes) && spe >= 60 && weaponPerk != "Large") {
				attack += Math.round((spe - 50) / 3);
			}
			//Iron fists bonus!
			if (hasPerk(PerkLib.IronFists) && str >= 50 && weaponName == "fists")
				attack += 5;
			if (hasPerk(PerkLib.IronFists2) && str >= 65 && weaponName == "fists")
				attack += 3;
			if (hasPerk(PerkLib.IronFists3) && str >= 80 && weaponName == "fists")
				attack += 3;
			//Bonus for being samurai!
			if (armor == game.armors.SAMUARM && weapon == game.weapons.KATANA0)
				attack += 2;
			//Berserking bonus!
			if (hasStatusEffect(StatusEffects.Berzerking)) attack += 30;
			if (hasStatusEffect(StatusEffects.Lustzerking)) attack += 30;
			attack += statusEffectv1(StatusEffects.ChargeWeapon);
			return attack;
		}
		public  get weaponBaseAttack(): number {
			return _weapon.attack;
		}
		public  get weaponPerk(): string {
			return _weapon.perk || "";
		}
		public  get weaponValue(): number {
			return _weapon.value;
		}
		
		//override public function get jewelries.
		public  get jewelryName(): string {
			return _jewelry.name;
		}
		public  get jewelryEffectId(): number {
			return _jewelry.effectId;
		}
		public  get jewelryEffectMagnitude(): number {
			return _jewelry.effectMagnitude;
		}
		public  get jewelryPerk(): string {
			return _jewelry.perk;
		}
		public  get jewelryValue(): number {
			return _jewelry.value;
		}
		
		//override public function get shields
		public  get shieldName(): string {
			return _shield.name;
		}
		public  get shieldBlock(): number {
		var  block: number = _shield.block;
			return block;
		}
		public  get shieldPerk(): string {
			return _shield.perk;
		}
		public  get shieldValue(): number {
			return _shield.value;
		}
		public  get shield():Shield
		{
			return _shield;
		}

		//override public function get undergarment
		public  get upperGarmentName(): string {
			return _upperGarment.name;
		}
		public  get upperGarmentPerk(): string {
			return _upperGarment.perk;
		}
		public  get upperGarmentValue(): number {
			return _upperGarment.value;
		}
		public  get upperGarment():Undergarment
		{
			return _upperGarment;
		}
		
		public  get lowerGarmentName(): string {
			return _lowerGarment.name;
		}
		public  get lowerGarmentPerk(): string {
			return _lowerGarment.perk;
		}
		public  get lowerGarmentValue(): number {
			return _lowerGarment.value;
		}
		public  get lowerGarment():Undergarment
		{
			return _lowerGarment;
		}
		
		public  get armor():Armor
		{
			return _armor;
		}
		
		public  setArmor(newArmor:Armor):Armor {
			//Returns the old armor, allowing the caller to discard it, store it or try to place it in the player's inventory
			//Can return undefined, in which case caller should discard.
		var  oldArmor:Armor = _armor.playerRemove(); //The armor is responsible for removing any bonuses, perks, etc.
			if (newArmor == undefined) {
				CoC_Settings.error(short + ".armor is set to undefined");
				newArmor = ArmorLib.COMFORTABLE_UNDERCLOTHES;
			}
			_armor = newArmor.playerEquip(); //The armor can also choose to equip something else - useful for Ceraph's trap armor
			return oldArmor;
		}
		
		/*
		public  set armor(value:Armor): void
		{
			if (value == undefined){
				CoC_Settings.error(short+".armor is set to undefined");
				value = ArmorLib.COMFORTABLE_UNDERCLOTHES;
			}
			value.equip(this, false, false);
		}
		*/

		// in case you don't want to call the value.equip
		public  setArmorHiddenField(value:Armor): void
		{
			this._armor = value;
		}

		public  get weapon():Weapon
		{
			return _weapon;
		}

		public  setWeapon(newWeapon:Weapon):Weapon {
			//Returns the old weapon, allowing the caller to discard it, store it or try to place it in the player's inventory
			//Can return undefined, in which case caller should discard.
		var  oldWeapon:Weapon = _weapon.playerRemove(); //The weapon is responsible for removing any bonuses, perks, etc.
			if (newWeapon == undefined) {
				CoC_Settings.error(short + ".weapon is set to undefined");
				newWeapon = WeaponLib.FISTS;
			}
			_weapon = newWeapon.playerEquip(); //The weapon can also choose to equip something else
			return oldWeapon;
		}
		
		/*
		public  set weapon(value:Weapon): void
		{
			if (value == undefined){
				CoC_Settings.error(short+".weapon is set to undefined");
				value = WeaponLib.FISTS;
			}
			value.equip(this, false, false);
		}
		*/

		// in case you don't want to call the value.equip
		public  setWeaponHiddenField(value:Weapon): void
		{
			this._weapon = value;
		}
		
		//Jewelry, added by Kitteh6660
		public  get jewelry():Jewelry
		{
			return _jewelry;
		}

		public  setJewelry(newJewelry:Jewelry):Jewelry {
			//Returns the old jewelry, allowing the caller to discard it, store it or try to place it in the player's inventory
			//Can return undefined, in which case caller should discard.
		var  oldJewelry:Jewelry = _jewelry.playerRemove(); //The armor is responsible for removing any bonuses, perks, etc.
			if (newJewelry == undefined) {
				CoC_Settings.error(short + ".jewelry is set to undefined");
				newJewelry = JewelryLib.NOTHING;
			}
			_jewelry = newJewelry.playerEquip(); //The jewelry can also choose to equip something else - useful for Ceraph's trap armor
			return oldJewelry;
		}
		// in case you don't want to call the value.equip
		public  setJewelryHiddenField(value:Jewelry): void
		{
			this._jewelry = value;
		}
		
		public  setShield(newShield:Shield):Shield {
			//Returns the old shield, allowing the caller to discard it, store it or try to place it in the player's inventory
			//Can return undefined, in which case caller should discard.
		var  oldShield:Shield = _shield.playerRemove(); //The shield is responsible for removing any bonuses, perks, etc.
			if (newShield == undefined) {
				CoC_Settings.error(short + ".shield is set to undefined");
				newShield = ShieldLib.NOTHING;
			}
			_shield = newShield.playerEquip(); //The shield can also choose to equip something else.
			return oldShield;
		}
		
		// in case you don't want to call the value.equip
		public  setShieldHiddenField(value:Shield): void
		{
			this._shield = value;
		}

		public  setUndergarment(newUndergarment:Undergarment, typeOverride: number = -1):Undergarment {
			//Returns the old undergarment, allowing the caller to discard it, store it or try to place it in the player's inventory
			//Can return undefined, in which case caller should discard.
		var  oldUndergarment:Undergarment = UndergarmentLib.NOTHING;
			if (newUndergarment.type == UndergarmentLib.TYPE_UPPERWEAR || typeOverride == 0) { 
				oldUndergarment = _upperGarment.playerRemove(); //The undergarment is responsible for removing any bonuses, perks, etc.
				if (newUndergarment == undefined) {
					CoC_Settings.error(short + ".upperGarment is set to undefined");
					newUndergarment = UndergarmentLib.NOTHING;
				}
				_upperGarment = newUndergarment.playerEquip(); //The undergarment can also choose to equip something else.
			}
			else if (newUndergarment.type == UndergarmentLib.TYPE_LOWERWEAR || typeOverride == 1) { 
				oldUndergarment = _lowerGarment.playerRemove(); //The undergarment is responsible for removing any bonuses, perks, etc.
				if (newUndergarment == undefined) {
					CoC_Settings.error(short + ".lowerGarment is set to undefined");
					newUndergarment = UndergarmentLib.NOTHING;
				}
				_lowerGarment = newUndergarment.playerEquip(); //The undergarment can also choose to equip something else.
			}
			return oldUndergarment;
		}
		
		// in case you don't want to call the value.equip
		public  setUndergarmentHiddenField(value:Undergarment, type: number): void
		{
			if (type == UndergarmentLib.TYPE_UPPERWEAR) this._upperGarment = value;
			else this._lowerGarment = value;
		}
		
		public  reduceDamage(damage: number): number {
		var  damageMultiplier: number = 1;
			//EZ MOAD half damage
			if (flags[kFLAGS.EASY_MODE_ENABLE_FLAG] == 1) damageMultiplier /= 2;
			//Difficulty modifier flags.
			if (flags[kFLAGS.GAME_DIFFICULTY] == 1) damageMultiplier *= 1.15;
			else if (flags[kFLAGS.GAME_DIFFICULTY] == 2) damageMultiplier *= 1.3;
			else if (flags[kFLAGS.GAME_DIFFICULTY] >= 3) damageMultiplier *= 1.5;

			
			//Opponents can critical too!
		var  crit: boolean = false
			if (rand(100) <= 4 || (kGAMECLASS.monster.hasPerk(PerkLib.Tactician) && kGAMECLASS.monster.inte >= 50 && (kGAMECLASS.monster.inte - 50)/5 > rand(100))) {
				crit = true;
				damage *= 1.75;
				flags[kFLAGS.ENEMY_CRITICAL] = 1;
			}
			if (hasStatusEffect(StatusEffects.Shielding)) {
				damage -= 30;
				if (damage < 1) damage = 1;
			}
			//Apply damage resistance percentage.
			damage *= damagePercent() / 100;
			if (damageMultiplier < 0.2) damageMultiplier = 0;
			return int(damage * damageMultiplier);
		}

		public override function takeDamage(damage: number, display: boolean = false): number{
			//Round
			damage = Math.round(damage);
			// we return "1 damage received" if it is in (0..1) but deduce no HP
		var  returnDamage: number = (damage>0 && damage<1)?1:damage;
			if (damage>0){
				//player.HPChange(-damage, display);
				HP -= damage;
				if (display) game.output.text(game.combat.getDamageText(damage));
				game.mainView.statsView.showStatDown('hp');
				game.dynStats("lus", 0); //Force display arrow.
				if (flags[kFLAGS.MINOTAUR_CUM_REALLY_ADDICTED_STATE] > 0) {
					game.dynStats("lus", int(damage / 2));
				}
				if (flags[kFLAGS.YAMATA_MASOCHIST]>1 && flags[kFLAGS.AIKO_BOSS_COMPLETE] < 1) {
					game.dynStats("lus", int(damage / 8));
				}
				//Prevent negatives
				if (HP<=0){
					HP = 0;
					//This call did nothing. There is no event 5010: if (game.inCombat) kGAMECLASS.output.doNext(5010);
				}
			}
			if (damage > 0 && display) {
				flags[kFLAGS.ACHIEVEMENT_PROGRESS_DAMAGE_SPONGE] += damage;
				if (flags[kFLAGS.ACHIEVEMENT_PROGRESS_DAMAGE_SPONGE] >= 10000) kGAMECLASS.awardAchievement("Damage Sponge", kACHIEVEMENTS.COMBAT_DAMAGE_SPONGE, true, true, true);
			}
			return returnDamage;
		}

		public override function takeLustDamage(lustDmg: number, display: boolean = true, applyRes: boolean = true): number{
			//Round
			lustDmg = Math.round(lustDmg);
		var  lust: number = game.player.lust;
			// we return "1 damage received" if it is in (0..1) but deduce no Lust
		var  returnlustDmg: number = (lustDmg>0 && lustDmg<1)?1:lustDmg;
			if (lustDmg>0){
				//game.lustChange(-lustDmg, display, "scale", applyRes);
				game.dynStats("lus", lustDmg, "scale", applyRes);
				lust = game.player.lust - lust;
				if (display) game.output.text(" <b>(<font color=\"#ff00ff\">" + lust + "</font>)</b> ");
				game.mainView.statsView.showStatUp('lust');
			}
			return returnlustDmg;
		}

		/**
		 * @return 0: did not avoid; 1-3: avoid with varying difference between
		 * speeds (1: narrowly avoid, 3: deftly avoid)
		 */
		public  speedDodge(monster:Monster): number{
		var  diff: number = spe - monster.spe;
		var  rnd: number = int(Math.random() * ((diff / 4) + 80));
			if (rnd<=80) return 0;
			else if (diff<8) return 1;
			else if (diff<20) return 2;
			else return 3;
		}
		
		public  getEvasionChance(): number 
		{
		var  chance: number = super.getEvasionChance();
			if (hasPerk(PerkLib.Unhindered) && (armor == ArmorLib.NOTHING || armor.perk == "Adornment")) chance += Math.max(10 - upperGarment.armorDef - lowerGarment.armorDef, 0);
			return chance;
		}
		
		public  getEvasionReason(useMonster: boolean = true, attackSpeed: number = int.MIN_VALUE): string 
		{
		var  inherented: string = super.getEvasionReason(useMonster, attackSpeed);
			if (inherented != undefined) return inherented;
			// evasionRoll is a field from Creature superclass
			if (hasPerk(PerkLib.Unhindered) && InCollection(armorName, "nothing") && ((evasionRoll = evasionRoll - (10 - Math.max(10 - upperGarment.armorDef - lowerGarment.armorDef, 0))) < 0)) return "Unhindered";
			return undefined;
		}

		//Body Type
		public  bodyType(): string
		{
		var  desc: string = "";
			//OLD STUFF
			//SUPAH THIN
			if (thickness < 10)
			{
				//SUPAH BUFF
				if (tone > 90)
					desc += "a lithe body covered in highly visible muscles";
				else if (tone > 75)
					desc += "an incredibly thin, well-muscled frame";
				else if (tone > 50)
					desc += "a very thin body that has a good bit of muscle definition";
				else if (tone > 25)
					desc += "a lithe body and only a little bit of muscle definition";
				else
					desc += "a waif-thin body, and soft, forgiving flesh";
			}
			//Pretty thin
			else if (thickness < 25)
			{
				if (tone > 90)
					desc += "a thin body and incredible muscle definition";
				else if (tone > 75)
					desc += "a narrow frame that shows off your muscles";
				else if (tone > 50)
					desc += "a somewhat lithe body and a fair amount of definition";
				else if (tone > 25)
					desc += "a narrow, soft body that still manages to show off a few muscles";
				else
					desc += "a thin, soft body";
			}
			//Somewhat thin
			else if (thickness < 40)
			{
				if (tone > 90)
					desc += "a fit, somewhat thin body and rippling muscles all over";
				else if (tone > 75)
					desc += "a thinner-than-average frame and great muscle definition";
				else if (tone > 50)
					desc += "a somewhat narrow body and a decent amount of visible muscle";
				else if (tone > 25)
					desc += "a moderately thin body, soft curves, and only a little bit of muscle";
				else
					desc += "a fairly thin form and soft, cuddle-able flesh";
			}
			//average
			else if (thickness < 60)
			{
				if (tone > 90)
					desc += "average thickness and a bevy of perfectly defined muscles";
				else if (tone > 75)
					desc += "an average-sized frame and great musculature";
				else if (tone > 50)
					desc += "a normal waistline and decently visible muscles";
				else if (tone > 25)
					desc += "an average body and soft, unremarkable flesh";
				else
					desc += "an average frame and soft, untoned flesh with a tendency for jiggle";
			}
			else if (thickness < 75)
			{
				if (tone > 90)
					desc += "a somewhat thick body that's covered in slabs of muscle";
				else if (tone > 75)
					desc += "a body that's a little bit wide and has some highly-visible muscles";
				else if (tone > 50)
					desc += "a solid build that displays a decent amount of muscle";
				else if (tone > 25)
					desc += "a slightly wide frame that displays your curves and has hints of muscle underneath";
				else
					desc += "a soft, plush body with plenty of jiggle";
			}
			else if (thickness < 90)
			{
				if (tone > 90)
					desc += "a thickset frame that gives you the appearance of a wall of muscle";
				else if (tone > 75)
					desc += "a burly form and plenty of muscle definition";
				else if (tone > 50)
					desc += "a solid, thick frame and a decent amount of muscles";
				else if (tone > 25)
					desc += "a wide-set body, some soft, forgiving flesh, and a hint of muscle underneath it";
				else
				{
					desc += "a wide, cushiony body";
					if (gender >= 2 || biggestTitSize() > 3 || hips.rating > 7 || butt.rating > 7)
						desc += " and plenty of jiggle on your curves";
				}
			}
			//Chunky monkey
			else
			{
				if (tone > 90)
					desc += "an extremely thickset frame and so much muscle others would find you harder to move than a huge boulder";
				else if (tone > 75)
					desc += "a very wide body and enough muscle to make you look like a tank";
				else if (tone > 50)
					desc += "an extremely substantial frame packing a decent amount of muscle";
				else if (tone > 25)
				{
					desc += "a very wide body";
					if (gender >= 2 || biggestTitSize() > 4 || hips.rating > 10 || butt.rating > 10)
						desc += ", lots of curvy jiggles,";
					desc += " and hints of muscle underneath";
				}
				else
				{
					desc += "a thick";
					if (gender >= 2 || biggestTitSize() > 4 || hips.rating > 10 || butt.rating > 10)
						desc += ", voluptuous";
					desc += " body and plush, ";
					if (gender >= 2 || biggestTitSize() > 4 || hips.rating > 10 || butt.rating > 10)
						desc += " jiggly curves";
					else
						desc += " soft flesh";
				}
			}
			return desc;
		}
		
		public  get race(): string
		{
			//Determine race type:
		var  race: string = "human";
			if (catScore() >= 4) 
			{
				if (isTaur() && lowerBody.type == LowerBody.CAT) {
					race = "cat-taur";
					if (face.type === Face.HUMAN || (hasCatFace() && !isFurryOrScaley()))
						race = "sphinx-morph"; // no way to be fully feral anyway
				}
				else {
					race = "cat-morph";
					if (face.type === Face.HUMAN || (hasCatFace() && !isFurryOrScaley()))
						race = "cat-" + mf("boy", "girl");
				}
			}
			if (lizardScore() >= 4)
			{
				if (hasDragonWingsAndFire())
					race = isBasilisk() ? "dracolisk" : "dragonewt";
				else
					race = isBasilisk() ? "basilisk"  : "lizan";
				if (isTaur())
					race += "-taur";
				if (lizardScore() >= 9)
					return race; // High lizardScore? always return lizan-race
			}
			if (dragonScore() >= 6)
			{
				race = "dragon-morph";
				if (face.type == 0)
					race = "dragon-" + mf("man", "girl");
				if (isTaur())
					race = "dragon-taur";
			}
			if (cockatriceScore() >= 4)
			{
				race = "cockatrice-morph";
				if (cockatriceScore() >= 8)
					race = "cockatrice";
				if (face.type == 0)
					race = "cockatrice-" + mf("boy", "girl");
				if (isTaur())
					race = "cockatrice-taur";
			}
			if (redPandaScore() >= 4)
			{
				race = "red-panda-morph";
				if (face.type === Face.HUMAN)
					race = "red-panda-" + mf("boy", "girl");
				if (isTaur())
					race = "red-panda-taur";
			}
			if (raccoonScore() >= 4)
			{
				race = "raccoon-morph";
				if (balls > 0 && ballSize > 5)
					race = "tanuki-morph";
				if (isTaur())
					race = "raccoon-taur";
			}
			if (sheepScore() >= 4) {
				if (lowerBody.legCount == 4 && lowerBody.type == 21) {
					race = "sheep-taur";
				}
				else if (gender == 0 || gender == 3) {
					race = "sheep-morph";
				}
				else if (gender == 1 && horns.type == 10) {
					race = "ram-morph";
				}
				else {
					race = "sheep-" +mf("boy","girl");
				}
			}
			if (wolfScore() >= 4) {
				if (hasFur() || gender == 0 || gender == 3) {
					race = "wolf-morph";
				}
				else {
					race = "wolf-" +mf("boy","girl");
				}
			}
			if (dogScore() >= 4)
			{
				if (isTaur() && lowerBody.type == LowerBody.DOG)
					race = "dog-taur";
				else {
					race = "dog-morph";
					if (face.type == 0)
						race = "dog-" + mf("man", "girl");
				}
			}
			if (foxScore() >= 4)
			{
				if (isTaur() && lowerBody.type == LowerBody.FOX)
					race = "fox-taur";
				else if (hasFur())
					race = "fox-morph";
				else
					race = "fox-" + mf("morph", "girl");
			}
			if (ferretScore() >= 4)
			{
				if (hasFur())
					race = "ferret-morph";
				else
					race = "ferret-" + mf("morph", "girl");
			}
			if (kitsuneScore() >= 4)
			{
				race = "kitsune";
			}
			if (horseScore() >= 3)
			{
				if (isTaur())
					race = "centaur-morph";
				else
					if (horns.type == Horns.UNICORN) {
						if (wings.type == Wings.FEATHERED_LARGE)
							race = "alicorn";
						else
							race = "unicorn-morph";
					} else {
						if (wings.type == Wings.FEATHERED_LARGE)
							race = "pegasus";
						else
							race = "equine-morph";
					}
			}
			if (mutantScore() >= 5 && race == "human")
				race = "corrupted mutant";
			if (minoScore() >= 4)
				race = "minotaur-morph";
			if (cowScore() > 5)
			{
				race = "cow-";
				race += mf("morph", "girl");
			}
			if (beeScore() >= 5)
				race = "bee-morph";
			if (goblinScore() >= 5)
				race = "goblin";
			if (humanScore() >= 5 && race == "corrupted mutant")
				race = "somewhat human mutant";
			if (demonScore() > 4)
				race = "demon-morph";
			if (sharkScore() >= 3)
				race = "shark-morph";
			if (bunnyScore() >= 4) {
				race = "bunny-" + mf("boy", "girl");
				if (horns.type == Horns.ANTLERS && horns.value > 0) race = "jackalope-" + mf("boy", "girl");
			}
			if (harpyScore() >= 4)
			{
				if (gender >= 2)
					race = "harpy";
				else
					race = "avian";
			}
			if (spiderScore() >= 4)
			{
				if (gender == 0 || gender == 3) {
					race = "spider-morph";
				} else {
					race = "spider-" + mf("boy", "girl");
				}
				if (isDrider())
					race = "drider";
			}
			if (kangaScore() >= 4)
				race = "kangaroo-morph";
			if (mouseScore() >= 3)
			{
				if (face.type != 16)
					race = "mouse-" + mf("boy", "girl");
				else
					race = "mouse-morph";
			}
			if (salamanderScore() >= 4)
			{
				if (isTaur()) race = "salamander-taur";
				else race = "salamander-" + mf("boy", "girl");
			}
			//<mod>
			if (pigScore() >= 4) 
			{
				race = "pig-morph";
				if (face.type == 0)
					race = "pig-" + mf("boy", "girl");
				if (face.type == 20)
					race = "boar-morph";
			}
			if (satyrScore() >= 4)
			{
				race = "satyr";
			}
			if (dryadScore() >= 3)
			{
				race = "dryad";
			}
			if (rhinoScore() >= 4)
			{
				race = "rhino-morph";
				if (face.type == 0) race = "rhino-" + mf("boy", "girl");
			}
			if (echidnaScore() >= 4)
			{
				race = "echidna-morph";
				if (face.type == 0) race = "echidna-" + mf("boy", "girl");
			}
			if (deerScore() >= 4)
			{
				if (isTaur()) race = "deer-taur";
				else {
					race = "deer-morph";
					if (face.type == 0) race = "deer-" + mf("boy", "girl");
				}
			}
			//Special, bizarre races
			if (dragonneScore() >= 6)
			{
				if (isTaur()) race = "dragonne-taur";
				else {
					race  = "dragonne-morph";
					if (face.type == 0)
						race = "dragonne-" + mf("boy", "girl");
				}
			}
			if (manticoreScore() >= 6)
			{
				race = "manticore-morph"
				if (face.type == 0)
					race = "manticore-" + mf("boy", "girl");
			}
			if (sirenScore() >= 4)
			{
				race = "siren";
			}
			//</mod>
			if (lowerBody.type == 3)
				race = "naga";

			if (lowerBody.type == LowerBody.HOOFED && isTaur()) {
				if (wings.type == Wings.FEATHERED_LARGE) {
					if (horns.type == Horns.UNICORN)
						race = "alicorn-taur";
					else
						race = "pegataur";
				} else {
					if (horns.type == Horns.UNICORN)
						race = "unicorn-taur";
					else {
						if (horseScore() >= 5)
							race = "equitaur";
						else if (minoScore() >= 4)
							race = "mino-centaur";
						else
							race = "centaur";
					}
				}
			}

			if (lowerBody.type == LowerBody.PONY)
				race = "pony-kin";

			if (gooScore() >= 3)
			{
				race = "goo-";
				race += mf("boy", "girl");
			}
			
			if (impScore() >= 4) {
				race = "imp";
			}
			
			return race;
		}

		//red-panda rating
		public  redPandaScore(): number
		{
		var  redPandaCounter: number = 0;
			if (ears.type === Ears.RED_PANDA)
				redPandaCounter++;
			if (tail.type === Tail.RED_PANDA)
				redPandaCounter++;
			if (arms.type === Arms.RED_PANDA)
				redPandaCounter++;
			if (face.type === Face.RED_PANDA)
				redPandaCounter += 2;
			if (lowerBody.type === LowerBody.RED_PANDA)
				redPandaCounter++;
			if (redPandaCounter >= 2) {
				if (hasFur())
					redPandaCounter++;
				if (hasFurryUnderBody())
					redPandaCounter++;
			}
			return redPandaCounter;
		}

		//cockatrice rating
		public  cockatriceScore(): number
		{
		var  cockatriceCounter: number = 0;
			if (ears.type == Ears.COCKATRICE)
				cockatriceCounter++;
			if (tail.type == Tail.COCKATRICE)
				cockatriceCounter++;
			if (lowerBody.type == LowerBody.COCKATRICE)
				cockatriceCounter++;
			if (face.type == Face.COCKATRICE)
				cockatriceCounter++;
			if (eyes.type == Eyes.COCKATRICE)
				cockatriceCounter++;
			if (arms.type == Arms.COCKATRICE)
				cockatriceCounter++;
			if (antennae.type == Antennae.COCKATRICE)
				cockatriceCounter++;
			if (neck.type == Neck.COCKATRICE)
				cockatriceCounter++;
			if (cockatriceCounter > 2) {
				if (tongue.type == Tongue.LIZARD)
					cockatriceCounter++;
				if (wings.type == Wings.FEATHERED_LARGE)
					cockatriceCounter++;
				if (skin.type == Skin.LIZARD_SCALES)
					cockatriceCounter++;
				if (underBody.type == UnderBody.COCKATRICE)
					cockatriceCounter++;
				if (lizardCocks() > 0)
					cockatriceCounter++;
			}
			return cockatriceCounter;
		}

		//imp rating
		public  impScore(): number
		{
		var  impCounter: number = 0;
			if (ears.type == Ears.IMP)
				impCounter++;
			if (tail.type == Tail.IMP)
				impCounter++;
			if (wings.type == Wings.IMP)
				impCounter++;
			if (wings.type == Wings.IMP_LARGE)
				impCounter += 2;
			if (lowerBody.type == LowerBody.IMP)
				impCounter++;
			if (hasPlainSkin() && ["red", "orange"].indexOf(skin.tone) != -1)
				impCounter++;
			if (horns.type == Horns.IMP)
				impCounter++;
			if (arms.type == Arms.PREDATOR && arms.claws.type == Claws.IMP)
				impCounter++;
			if (tallness <= 42)
				impCounter++;
			if (tallness > 42)
				impCounter--;
			if (biggestTitSize() > 0)
				impCounter--;
			if (bRows() == 2) //Each extra row takes off a point
				impCounter--;
			if (bRows() == 3)
				impCounter -= 2;
			if (bRows() == 4) //If you have more than 4 why are trying to be an imp
				impCounter -= 3;
			return impCounter;
		}

		//determine demon rating
		public  demonScore(): number
		{
		var  demonCounter: number = 0;
			if (horns.type == Horns.DEMON && horns.value > 0)
				demonCounter++;
			if (horns.type == Horns.DEMON && horns.value > 4)
				demonCounter++;
			if (tail.type == Tail.DEMONIC)
				demonCounter++;
			if (hasBatLikeWings())
				demonCounter++;
			if (hasPlainSkin() && cor > 50)
				demonCounter++;
			if (face.type == 0 && cor > 50)
				demonCounter++;
			if (lowerBody.type == LowerBody.DEMONIC_HIGH_HEELS || lowerBody.type == LowerBody.DEMONIC_CLAWS)
				demonCounter++;
			if (countCocksOfType(CockTypesEnum.DEMON) > 0)
				demonCounter++;
			return demonCounter;
		}

		//Determine Human Rating
		public  humanScore(): number
		{
		var  humanCounter: number = 0;
			if (face.type == Face.HUMAN)
				humanCounter++;
			if (skin.type == Skin.PLAIN)
				humanCounter++;
			if (horns.type == Horns.NONE)
				humanCounter++;
			if (tail.type == Tail.NONE)
				humanCounter++;
			if (wings.type == Wings.NONE)
				humanCounter++;
			if (lowerBody.type == LowerBody.HUMAN)
				humanCounter++;
			if (countCocksOfType(CockTypesEnum.HUMAN) == 1 && cocks.length == 1)
				humanCounter++;
			if (breastRows.length == 1 && skin.type == Skin.PLAIN)
				humanCounter++;
			return humanCounter;
		}

		//Determine minotaur rating
		public  minoScore(): number
		{
		var  minoCounter: number = 0;
			if (face.type == Face.COW_MINOTAUR)
				minoCounter++;
			if (ears.type == Ears.COW)
				minoCounter++;
			if (tail.type == Tail.COW)
				minoCounter++;
			if (horns.type == Horns.COW_MINOTAUR)
				minoCounter++;
			if (lowerBody.type == LowerBody.HOOFED && minoCounter > 0)
				minoCounter++;
			if (tallness > 80 && minoCounter > 0)
				minoCounter++;
			if (cocks.length > 0 && minoCounter > 0)
			{
				if (countCocksOfType(CockTypesEnum.HORSE) > 0)
					minoCounter++;
			}
			if (vaginas.length > 0)
				minoCounter--;
			return minoCounter;
		}

		public  get minotaurScore(): number
		{
			return this.minoScore();
		}

		//Determine cow rating
		public  cowScore(): number
		{
		var  minoCounter: number = 0;
			if (ears.type == Ears.COW)
				minoCounter++;
			if (tail.type == Tail.COW)
				minoCounter++;
			if (horns.type == Horns.COW_MINOTAUR)
				minoCounter++;
			if (face.type == Face.HUMAN && minoCounter > 0)
				minoCounter++;
			if (face.type == Face.COW_MINOTAUR)
				minoCounter--;
			if (lowerBody.type == LowerBody.HOOFED && minoCounter > 0)
				minoCounter++;
			if (tallness >= 73 && minoCounter > 0)
				minoCounter++;
			if (vaginas.length > 0 && minoCounter > 0)
				minoCounter++;
			if (biggestTitSize() > 4 && minoCounter > 0)
				minoCounter++;
			if (biggestLactation() > 2 && minoCounter > 0)
				minoCounter++;
			return minoCounter;
		}

		public  sandTrapScore(): number
		{
		var  counter: number = 0;
			if (hasStatusEffect(StatusEffects.BlackNipples))
				counter++;
			if (hasStatusEffect(StatusEffects.Uniball))
				counter++;
			if (hasVagina() && vaginaType() == 5)
				counter++;
			if (eyes.type == Eyes.BLACK_EYES_SAND_TRAP)
				counter++;
			if (wings.type == Wings.GIANT_DRAGONFLY)
				counter++;
			if (hasStatusEffect(StatusEffects.Uniball))
				counter++;
			return counter;
		}

		//Determine Bee Rating
		public  beeScore(): number
		{
		var  beeCounter: number = 0;
			if (hair.color == "shiny black")
				beeCounter++;
			if (hair.color == "black and yellow")
				beeCounter += 2;
			if (antennae.type == Antennae.BEE)
			{
				beeCounter++;
				if (face.type == Face.HUMAN)
					beeCounter++;
			}
			if (arms.type == Arms.BEE)
				beeCounter++;
			if (lowerBody.type == LowerBody.BEE)
			{
				beeCounter++;
				if (vaginas.length == 1)
					beeCounter++;
			}
			if (tail.type == Tail.BEE_ABDOMEN)
				beeCounter++;
			if (wings.type == Wings.BEE_LIKE_SMALL)
				beeCounter++;
			if (wings.type == Wings.BEE_LIKE_LARGE)
				beeCounter++;
			return beeCounter;
		}
		//Determine Ferret Rating!
		public  ferretScore(): number
		{
		var  ferretCounter: number = 0;
			if (face.type === Face.FERRET_MASK)
				ferretCounter++;
			if (face.type === Face.FERRET)
				ferretCounter += 2;
			if (ears.type === Ears.FERRET)
				ferretCounter++;
			if (tail.type === Tail.FERRET)
				ferretCounter++;
			if (lowerBody.type === LowerBody.FERRET)
				ferretCounter++;
			if (arms.type === Arms.FERRET)
				ferretCounter++;
			if (ferretCounter >= 2 && hasFur())
				ferretCounter += 2;
			return ferretCounter;
		}
		//Wolf Score
		public  wolfScore(): number
		{
		var  wolfCounter: number = 0;
			if (face.type == Face.WOLF)
				wolfCounter++;
			if (wolfCocks() > 0)
				wolfCounter++;
			if (ears.type == Ears.WOLF)
				wolfCounter++;
			if (tail.type == Tail.WOLF)
				wolfCounter++;
			if (lowerBody.type == LowerBody.WOLF)
				wolfCounter++;
			if (eyes.type == Eyes.WOLF)
				wolfCounter+=2;
			if (hasFur() && wolfCounter > 0) //Only counts if we got wolf features
				wolfCounter++;
			if (wolfCounter >= 2) {
				if (breastRows.length > 1)
					wolfCounter++;
				if (breastRows.length == 4)
					wolfCounter++;
				if (breastRows.length > 4)
					wolfCounter--;
			}
			return wolfCounter;
		}
		//Determine Dog Rating
		public override function dogScore(): number
		{
		var  dogCounter: number = 0;
			if (face.type == Face.DOG)
				dogCounter++;
			if (ears.type == Ears.DOG)
				dogCounter++;
			if (tail.type == Tail.DOG)
				dogCounter++;
			if (lowerBody.type == LowerBody.DOG)
				dogCounter++;
			if (arms.type == Arms.DOG)
				dogCounter++;
			if (dogCocks() > 0)
				dogCounter++;
			//Fur only counts if some canine features are present
			if (hasFur() && dogCounter > 0)
				dogCounter++;
			if (dogCounter >= 2) {
				if (breastRows.length > 1)
					dogCounter++;
				if (breastRows.length == 3)
					dogCounter++;
				if (breastRows.length > 3)
					dogCounter--;
			}
			return dogCounter;
		}

		public  mouseScore(): number
		{
		var  coonCounter: number = 0;
			if (ears.type == Ears.MOUSE)
				coonCounter++;
			if (tail.type == Tail.MOUSE)
				coonCounter++;

			if (face.type == Face.BUCKTEETH)
				coonCounter++;
			if (face.type == Face.MOUSE)
				coonCounter += 2;
			//Fur only counts if some canine features are present
			if (hasFur() && coonCounter > 0)
				coonCounter++;

			if (tallness < 55 && coonCounter > 0)
				coonCounter++;
			if (tallness < 45 && coonCounter > 0)
				coonCounter++;
			return coonCounter;
		}

		public  raccoonScore(): number
		{
		var  coonCounter: number = 0;
			if (face.type == Face.RACCOON_MASK)
				coonCounter++;
			if (face.type == Face.RACCOON)
				coonCounter += 2;
			if (ears.type == Ears.RACCOON)
				coonCounter++;
			if (tail.type == Tail.RACCOON)
				coonCounter++;
			if (lowerBody.type == LowerBody.RACCOON)
				coonCounter++;
			if (coonCounter > 0 && balls > 0)
				coonCounter++;
			//Fur only counts if some canine features are present
			if (hasFur() && coonCounter > 0)
				coonCounter++;
			return coonCounter;
		}

		//Determine Fox Rating
		public override function foxScore(): number
		{
		var  foxCounter: number = 0;
			if (face.type == Face.FOX)
				foxCounter++;
			if (ears.type == Ears.FOX)
				foxCounter++;
			if (tail.type == Tail.FOX)
				foxCounter++;
			if (lowerBody.type == LowerBody.FOX)
				foxCounter++;
			if (arms.type == Arms.FOX)
				foxCounter++;
			if (dogCocks() > 0 && foxCounter > 0)
				foxCounter++;
			if (breastRows.length > 1 && foxCounter > 0)
				foxCounter++;
			if (breastRows.length == 3 && foxCounter > 0)
				foxCounter++;
			if (breastRows.length == 4 && foxCounter > 0)
				foxCounter++;
			//Fur only counts if some canine features are present
			if (hasFur() && foxCounter > 0)
				foxCounter++;
			return foxCounter;
		}

		//Determine cat Rating
		public  catScore(): number
		{
		var  catCounter: number = 0;
			if (hasCatFace())
				catCounter++;
			if (tongue.type == Tongue.CAT)
				catCounter++;
			if (ears.type == Ears.CAT)
				catCounter++;
			if (tail.type == Tail.CAT)
				catCounter++;
			if (lowerBody.type == LowerBody.CAT)
				catCounter++;
			if (arms.type == Arms.CAT)
				catCounter++;
			if (countCocksOfType(CockTypesEnum.CAT) > 0)
				catCounter++;
			if (breastRows.length > 1 && catCounter > 0)
				catCounter++;
			if (breastRows.length == 3 && catCounter > 0)
				catCounter++;
			if (breastRows.length > 3)
				catCounter -= 2;
			//Fur only counts if some canine features are present
			if (hasFur() && catCounter > 0)
				catCounter++;
			return catCounter;
		}

		//Determine lizard rating
		public  lizardScore(): number
		{
		var  lizardCounter: number = 0;
			if (face.type == Face.LIZARD)
				lizardCounter++;
			if (ears.type == Ears.LIZARD)
				lizardCounter++;
			if (tail.type == Tail.LIZARD)
				lizardCounter++;
			if (lowerBody.type == LowerBody.LIZARD)
				lizardCounter++;
			if (hasDragonHorns())
				lizardCounter++;
			if (hasDragonHorns(true))
				lizardCounter++;
			if (arms.type == Arms.PREDATOR && arms.claws.type == Claws.LIZARD)
				lizardCounter++;
			if (lizardCounter > 2) {
				if ([Tongue.LIZARD, Tongue.SNAKE].indexOf(tongue.type) != -1)
					lizardCounter++;
				if (lizardCocks() > 0)
					lizardCounter++;
				if ([Eyes.LIZARD, Eyes.BASILISK].indexOf(eyes.type) != -1)
					lizardCounter++;
				if (hasReptileScales())
					lizardCounter++;
			}
			return lizardCounter;
		}

		public  spiderScore(): number
		{
		var  score: number = 0;
			if (eyes.type == Eyes.SPIDER && eyes.count == 4)
				score += 2;
			else if (eyes.type == Eyes.SPIDER)
				score++;
			if (face.type == Face.SPIDER_FANGS)
				score++;
			if (arms.type == Arms.SPIDER)
				score++;
			if ([LowerBody.CHITINOUS_SPIDER_LEGS, LowerBody.DRIDER].indexOf(lowerBody.type) != -1)
				score += 2;
			else if (score > 0)
				score--;
			if (tail.type == Tail.SPIDER_ABDOMEN)
				score += 2;
			if (!hasPlainSkin() && score > 0)
				score--;
			return score;
		}

		//Determine Horse Rating
		public  horseScore(): number
		{
		var  horseCounter: number = 0;
			if (face.type == Face.HORSE)
				horseCounter++;
			if (ears.type == Ears.HORSE)
				horseCounter++;
			if (tail.type == Tail.HORSE)
				horseCounter++;
			if (countCocksOfType(CockTypesEnum.HORSE) > 0)
				horseCounter++;
			if (lowerBody.type == LowerBody.HOOFED)
				horseCounter++;
			//Fur only counts if some equine features are present
			if (hasFur() && horseCounter > 0)
				horseCounter++;
			return horseCounter;
		}

		//Determine kitsune Rating
		public  kitsuneScore(): number
		{
		var  kitsuneCounter: number = 0;
			//If the character has fox ears, +1
			if (ears.type == Ears.FOX)
				kitsuneCounter++;
			//If the character has a fox tail, +1
			if (tail.type == Tail.FOX)
				kitsuneCounter++;
			//If the character has two or more fox tails, +2
			if (tail.type == Tail.FOX && tail.venom >= 2)
				kitsuneCounter += 2;
			//If the character has tattooed skin, +1
			//9999
			//If the character has a 'vag of holding', +1
			if (vaginalCapacity() >= 8000)
				kitsuneCounter++;
			//If the character's kitsune score is greater than 0 and:
			//If the character has a normal face, +1
			if (kitsuneCounter > 0 && (face.type == Face.HUMAN || face.type == Face.FOX))
				kitsuneCounter++;
			//If the character's kitsune score is greater than 1 and:
			//If the character has "blonde","black","red","white", or "silver" hair, +1
			if (kitsuneCounter > 0 && (InCollection(hairOrFurColors, convertMixedToStringArray(ColorLists.BASIC_KITSUNE_HAIR)) || InCollection(hairOrFurColors, ColorLists.ELDER_KITSUNE)))
				kitsuneCounter++;
			//If the character's femininity is 40 or higher, +1
			if (kitsuneCounter > 0 && femininity >= 40)
				kitsuneCounter++;
			//If the character has fur, scales, or gooey skin, -1
			if (hasFur() && !InCollection(hairOrFurColors, convertMixedToStringArray(ColorLists.BASIC_KITSUNE_FUR)) && !InCollection(hairOrFurColors, ColorLists.ELDER_KITSUNE))
				kitsuneCounter--;
			if (hasScales())
				kitsuneCounter -= 2;
			if (hasGooSkin())
				kitsuneCounter -= 3;
			//If the character has abnormal legs, -1
			if (lowerBody.type != LowerBody.HUMAN && lowerBody.type != LowerBody.FOX)
				kitsuneCounter--;
			//If the character has a nonhuman face, -1
			if (face.type != Face.HUMAN && face.type != Face.FOX)
				kitsuneCounter--;
			//If the character has ears other than fox ears, -1
			if (ears.type != Ears.FOX)
				kitsuneCounter--;
			//If the character has tail(s) other than fox tails, -1
			if (tail.type != Tail.FOX)
				kitsuneCounter--;

			return kitsuneCounter;

		}

		//Determine Dragon Rating
		public  dragonScore(): number
		{
		var  dragonCounter: number = 0;
			if (face.type == Face.DRAGON)
				dragonCounter++;
			if (ears.type == Ears.DRAGON)
				dragonCounter++;
			if (tail.type == Tail.DRACONIC)
				dragonCounter++;
			if (tongue.type == Tongue.DRACONIC)
				dragonCounter++;
			if (dragonCocks() > 0)
				dragonCounter++;
			if (hasDragonWings())
				dragonCounter++;
			if (lowerBody.type == LowerBody.DRAGON)
				dragonCounter++;
			if (hasDragonScales() && dragonCounter > 0)
				dragonCounter++;
			if (hasDragonHorns())
				dragonCounter++;
			if (horns.type == Horns.DRACONIC_X4_12_INCH_LONG)
				dragonCounter++;
			if (hasDragonfire())
				dragonCounter++;
			if (arms.type == Arms.PREDATOR && arms.claws.type == Claws.DRAGON)
				dragonCounter++;
			if (eyes.type == Eyes.DRAGON)
				dragonCounter++;
			if (hasDragonNeck())
				dragonCounter++;
			if (hasDragonRearBody())
				dragonCounter++;
			return dragonCounter;
		}

		//Goblinscore
		public  goblinScore(): number
		{
		var  horseCounter: number = 0;
			if (ears.type == Ears.ELFIN)
				horseCounter++;
			if (ColorLists.GOBLIN_SKIN.indexOf(skin.tone) !== -1)
				horseCounter++;
			if (horseCounter > 0)
			{
				if (face.type == Face.HUMAN)
					horseCounter++;
				if (tallness < 48)
					horseCounter++;
				if (hasVagina())
					horseCounter++;
				if (lowerBody.type == LowerBody.HUMAN)
					horseCounter++;
			}
			return horseCounter;
		}

		//Gooscore
		public  gooScore(): number
		{
		var  gooCounter: number = 0;
			if (hair.type == Hair.GOO)
				gooCounter++;
			if (skin.adj == "slimy")
				gooCounter++;
			if (lowerBody.type == LowerBody.GOO)
				gooCounter++;
			if (vaginalCapacity() > 9000)
				gooCounter++;
			if (hasStatusEffect(StatusEffects.SlimeCraving))
				gooCounter++;
			return gooCounter;
		}

		//Nagascore
		public  nagaScore(): number
		{
		var  nagaCounter: number = 0;
			if (face.type == Face.SNAKE_FANGS)
				nagaCounter++;
			if (tongue.type == Tongue.SNAKE)
				nagaCounter++;
			if (nagaCounter > 0 && antennae.type == Antennae.NONE)
				nagaCounter++;
			if (nagaCounter > 0 && wings.type == Wings.NONE)
				nagaCounter++;
			return nagaCounter;
		}

		//Bunnyscore
		public  bunnyScore(): number
		{
		var  bunnyCounter: number = 0;
			if (face.type == Face.BUNNY)
				bunnyCounter++;
			if (tail.type == Tail.RABBIT)
				bunnyCounter++;
			if (ears.type == Ears.BUNNY)
				bunnyCounter++;
			if (lowerBody.type == LowerBody.BUNNY)
				bunnyCounter++;
			//More than 2 balls reduces bunny score
			if (balls > 2 && bunnyCounter > 0)
				bunnyCounter--;
			//Human skin on bunmorph adds
			if (hasPlainSkin() && bunnyCounter > 1)
				bunnyCounter++;
			//No wings and antennae a plus
			if (bunnyCounter > 0 && antennae.type == Antennae.NONE)
				bunnyCounter++;
			if (bunnyCounter > 0 && wings.type == Wings.NONE)
				bunnyCounter++;
			return bunnyCounter;
		}

		//Harpyscore
		public  harpyScore(): number
		{
		var  harpy: number = 0;
			if (arms.type == Arms.HARPY)
				harpy++;
			if (hair.type == Hair.FEATHER)
				harpy++;
			if (wings.type == Wings.FEATHERED_LARGE)
				harpy++;
			if (tail.type == Tail.HARPY)
				harpy++;
			if (lowerBody.type == LowerBody.HARPY)
				harpy++;
			if (harpy >= 2 && face.type == Face.HUMAN)
				harpy++;
			if (harpy >= 2 && [Ears.HUMAN, Ears.ELFIN].indexOf(ears.type) != -1)
				harpy++;
			return harpy;
		}

		//Kangascore
		public  kangaScore(): number
		{
		var  kanga: number = 0;
			if (countCocksOfType(CockTypesEnum.KANGAROO) > 0)
				kanga++;
			if (ears.type == Ears.KANGAROO)
				kanga++;
			if (tail.type == Tail.KANGAROO)
				kanga++;
			if (lowerBody.type == LowerBody.KANGAROO)
				kanga++;
			if (face.type == Face.KANGAROO)
				kanga++;
			if (kanga >= 2 && hasFur())
				kanga++;
			return kanga;
		}

		//Sheep score
		public  sheepScore(): number
		{
		var  sheepCounter: number = 0;
			if (ears.type == Ears.SHEEP)
				sheepCounter++;
			if (horns.type == Horns.SHEEP)
				sheepCounter++;
			if (horns.type == Horns.RAM)
				sheepCounter++;
			if (tail.type == Tail.SHEEP)
				sheepCounter++;
			if (lowerBody.type == LowerBody.CLOVEN_HOOFED && lowerBody.legCount == 2)
				sheepCounter++;
			if (hair.type == Hair.WOOL)
				sheepCounter++;
			if (hasWool())
				sheepCounter++;
			return sheepCounter;
		}

		//sharkscore
		public  sharkScore(): number
		{
		var  sharkCounter: number = 0;
			if (face.type == Face.SHARK_TEETH)
				sharkCounter++;
			if (gills.type == Gills.FISH)
				sharkCounter++;
			if (rearBody.type == RearBody.SHARK_FIN)
				sharkCounter++;
			if (tail.type == Tail.SHARK)
				sharkCounter++;
			//skin counting only if PC got any other shark traits
			if (hasPlainSkin() && sharkCounter > 0)
				sharkCounter++;
			return sharkCounter;
		}

		//Determine Mutant Rating
		public  mutantScore(): number
		{
		var  mutantCounter: number = 0;
			if (face.type != Face.HUMAN)
				mutantCounter++;
			if (tail.type != Tail.NONE)
				mutantCounter++;
			if (cocks.length > 1)
				mutantCounter++;
			if (hasCock() && hasVagina())
				mutantCounter++;
			if (hasFuckableNipples())
				mutantCounter++;
			if (breastRows.length > 1)
				mutantCounter++;
			if (mutantCounter > 1 && hasPlainSkin())
				mutantCounter++;
			if (face.type == Face.HORSE)
			{
				if (hasFur())
					mutantCounter--;
				if (tail.type == Tail.HORSE)
					mutantCounter--;
			}
			if (face.type == Face.DOG)
			{
				if (hasFur())
					mutantCounter--;
				if (tail.type == Tail.DOG)
					mutantCounter--;
			}
			return mutantCounter;
		}
		
		//Salamander score
		public  salamanderScore(): number
		{
		var  salamanderCounter: number = 0;
			if (arms.type == Arms.SALAMANDER)
				salamanderCounter++;
			if (lowerBody.type == LowerBody.SALAMANDER)
				salamanderCounter++;
			if (tail.type == Tail.SALAMANDER)
				salamanderCounter++;
			if (hasPerk(PerkLib.Lustzerker))
				salamanderCounter++;
			if (salamanderCounter >= 2) {
				if (countCocksOfType(CockTypesEnum.LIZARD) > 0)
					salamanderCounter++;
				if (face.type == 0)
					salamanderCounter++;
				if (ears.type == 0)
					salamanderCounter++;
			}
			return salamanderCounter;
		}
		
		//------------
		// Mod-Added
		//------------
		
	    //dryad score
		public  dryadScore(): number
		{
		var  dryad: number = 0;
			if (hasCock())
				dryad--;
			if (arms.type != Arms.HUMAN)
				dryad--;
			if (hair.type == Hair.LEAF)
				dryad++;
			if (dryad >= 1 && ears.type == Ears.ELFIN)
				dryad++;
			if (skin.type == Skin.BARK)
				dryad++;
			
			return dryad;
		}

		public  sirenScore(): number 
		{
		var  sirenCounter: number = 0;
			if (face.type == Face.SHARK_TEETH && tail.type == Tail.SHARK && wings.type == Wings.FEATHERED_LARGE && arms.type == Arms.HARPY)
				sirenCounter+= 4;
			if (sirenCounter > 0 && hasVagina())
				sirenCounter++;
			//if (hasCock() && findFirstCockType(CockTypesEnum.ANEMONE) >= 0)
			//	sirenCounter++;
			return sirenCounter;
		}
		
		public  pigScore(): number
		{
		var  pigCounter: number = 0;
			if (ears.type == Ears.PIG)
				pigCounter++;
			if (tail.type == Tail.PIG)
				pigCounter++;
			if ([Face.PIG, Face.BOAR].indexOf(face.type) != -1)
				pigCounter++;
			if (lowerBody.type == LowerBody.CLOVEN_HOOFED)
				pigCounter += 2;
			if (countCocksOfType(CockTypesEnum.PIG) > 0)
				pigCounter++;
			return pigCounter;
		}
		
		public  satyrScore(): number
		{
		var  satyrCounter: number = 0;
			if (lowerBody.type == LowerBody.CLOVEN_HOOFED)
				satyrCounter++;
			if (tail.type == Tail.GOAT)
				satyrCounter++;
			if (satyrCounter >= 2) {
				if (ears.type == Ears.ELFIN)
					satyrCounter++;
				if (face.type == Face.HUMAN)
					satyrCounter++;
				if (countCocksOfType(CockTypesEnum.HUMAN) > 0)
					satyrCounter++;
				if (balls > 0 && ballSize >= 3)
					satyrCounter++;
			}
			return satyrCounter;
		}
		
		public  rhinoScore(): number
		{
		var  rhinoCounter: number = 0;
			if (ears.type == Ears.RHINO)
				rhinoCounter++;
			if (tail.type == Tail.RHINO)
				rhinoCounter++;
			if (face.type == Face.RHINO)
				rhinoCounter++;
			if (horns.type == Horns.RHINO)
				rhinoCounter++;
			if (rhinoCounter >= 2 && skin.tone == "gray")
				rhinoCounter++;
			if (rhinoCounter >= 2 && hasCock() && countCocksOfType(CockTypesEnum.RHINO) > 0)
				rhinoCounter++;
			return rhinoCounter;
		}
		
		public  echidnaScore(): number
		{
		var  echidnaCounter: number = 0;
			if (ears.type == Ears.ECHIDNA)
				echidnaCounter++;
			if (tail.type == Tail.ECHIDNA)
				echidnaCounter++;
			if (face.type == Face.ECHIDNA)
				echidnaCounter++;
			if (tongue.type == Tongue.ECHIDNA)
				echidnaCounter++;
			if (lowerBody.type == LowerBody.ECHIDNA)
				echidnaCounter++;
			if (echidnaCounter >= 2 && hasFur())
				echidnaCounter++;
			if (echidnaCounter >= 2 && countCocksOfType(CockTypesEnum.ECHIDNA) > 0)
				echidnaCounter++;
			return echidnaCounter;
		}
		
		public  deerScore(): number
		{
		var  deerCounter: number = 0;
			if (ears.type == Ears.DEER)
				deerCounter++;
			if (tail.type == Tail.DEER)
				deerCounter++;
			if (face.type == Face.DEER)
				deerCounter++;
			if (lowerBody.type == LowerBody.CLOVEN_HOOFED)
				deerCounter++;
			if (horns.type == Horns.ANTLERS && horns.value >= 4)
				deerCounter++;
			if (deerCounter >= 2 && hasFur())
				deerCounter++;
			if (deerCounter >= 3 && countCocksOfType(CockTypesEnum.HORSE) > 0)
				deerCounter++;
			return deerCounter;
		}
		
		//Dragonne
		public  dragonneScore(): number
		{
		var  dragonneCounter: number = 0;
			if (face.type == Face.CAT)
				dragonneCounter++;
			if (ears.type == Ears.CAT)
				dragonneCounter++;
			if (tail.type == Tail.CAT)
				dragonneCounter++;
			if (tongue.type == Tongue.DRACONIC)
				dragonneCounter++;
			if (hasDragonWings())
				dragonneCounter++;
			if (lowerBody.type == LowerBody.CAT)
				dragonneCounter++;
			if (hasReptileScales() && dragonneCounter > 0)
				dragonneCounter++;
			return dragonneCounter;
		}
		
		//Manticore
		public  manticoreScore(): number
		{
		var  catCounter: number = 0;
			if (hasCatFace())
				catCounter++;
			if (ears.type == Ears.CAT)
				catCounter++;
			if (tail.type == Tail.SCORPION)
				catCounter += 2;
			if (lowerBody.type == LowerBody.CAT)
				catCounter++;
			if (catCounter >= 4) {
				if (horns.type == Horns.DEMON || hasDragonHorns())
					catCounter++;
				if (hasLeatheryWings())
					catCounter++;
				if (hasLeatheryWings(true))
					catCounter++;
			}
			//Fur only counts if some canine features are present
			if (hasFur() && catCounter >= 6)
				catCounter++;
			return catCounter;
		}
		public  bimboScore() : number  
		{
			
		var  bimboCounter: number = 0;
			if (hasVagina()) {
				bimboCounter += 2; 
				if (vaginas[0].vaginalWetness >= Vagina.WETNESS_SLICK) 
					bimboCounter++;
			}
			if (hasCock()) 
				bimboCounter -= 2;
			if (armorName == "bimbo skirt") 
				bimboCounter += 1;
			if (hasPerk(PerkLib.BimboBrains)) 
				bimboCounter += 2;
			if (hasPerk(PerkLib.BimboBody)) 
				bimboCounter += 2;
			if (flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST] > 25) 
				bimboCounter++;
			if (flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST] > 10) 
				bimboCounter++;				
			if (biggestTitSize() >= 5) 
				bimboCounter++;
			else 
				bimboCounter += biggestTitSize() / 5.0;
				
			if (biggestTitSize() >= 10) 
				bimboCounter++;
			else 
				bimboCounter += biggestTitSize() / 10.0;
				
			if (hips.rating >= 8) 
				bimboCounter++;
			else 
				bimboCounter += hips.rating / 8.0;
			
			if (butt.rating > 8)
				bimboCounter++;
			else 
				bimboCounter += butt.rating / 8.0;
			
			if (tone < 15) 
				bimboCounter++;
			if (femininity > 80) 
				bimboCounter++;
			else if (femininity < 20) 
				bimboCounter--;
			else 
				bimboCounter += (femininity - 50.0) / 30.0;
			
			if (hair.color == "platinum blonde") 
				bimboCounter++;
			if (hair.length > 10) 
				bimboCounter++;
			if (inte < 20) 
				bimboCounter++;
			if (bimboCounter < 0)  bimboCounter = 0;
			if (bimboCounter > 20) bimboCounter = 20;

			return bimboCounter;
		}
		
		public  lactationQ(): number
		{
			if (biggestLactation() < 1)
				return 0;
			//(Milk production TOTAL= breastSize x 10 * lactationMultiplier * breast total * milking-endurance (1- default, maxes at 2.  Builds over time as milking as done)
			//(Small – 0.01 mLs – Size 1 + 1 Multi)
			//(Large – 0.8 - Size 10 + 4 Multi)
			//(HUGE – 2.4 - Size 12 + 5 Multi + 4 tits)
			
		var  total: number = 0;
			if (!hasStatusEffect(StatusEffects.LactationEndurance))
				createStatusEffect(StatusEffects.LactationEndurance, 1, 0, 0, 0);
			
		var  counter: number = breastRows.length;
			while (counter > 0) {
				counter--;
				total += 10 * breastRows[counter].breastRating * breastRows[counter].lactationMultiplier * breastRows[counter].breasts * statusEffectv1(StatusEffects.LactationEndurance);
				
			}
			if (hasPerk(PerkLib.MilkMaid))
				total += 200 + (perkv1(PerkLib.MilkMaid) * 100);
			if (statusEffectv1(StatusEffects.LactationReduction) >= 48)
				total = total * 1.5;
			if (total > int.MAX_VALUE)
				total = int.MAX_VALUE;
			return total;
		}
		
		public  isLactating(): boolean
		{
			if (lactationQ() > 0) return true;
			return false;
		}

		/**
		 * Attempt to stretch the players cunt. The chance for stretching is based on how close the cock size is to the players vagina capacity.
		 * In case of a stretching an appropriate message will be displayed. If the player was a virgin, the appropriate message will be displayed.
		 * If display is disabled, no messages will be displayed.
		 * 
		 * @param	cArea the area of the cock, will be checked againt vagina capacity
		 * @param	display if true, output messages else do not display anything
		 * @param	spacingsF add spaces at the front of the text?
		 * @param	spacingsB add spaces at the back of the text?
		 * @return true if a vagina stretch was performed
		 */
		public  cuntChange(cArea: number, display: boolean, spacingsF: boolean = false, spacingsB: boolean = true): boolean {
			if (vaginas.length==0) return false;
		var  wasVirgin: boolean = vaginas[0].virgin;
		var  stretched: boolean = cuntChangeNoDisplay(cArea);
		var  devirgined: boolean = wasVirgin && !vaginas[0].virgin;
			
			if (display && devirgined){
				if (spacingsF) outputText("  ");
				outputText("<b>Your hymen is torn, robbing you of your virginity.</b>");
				if (spacingsB) outputText("  ");
			}
			
			//STRETCH SUCCESSFUL - begin flavor text if outputting it!
			if (display && stretched) {
				//Virgins get different formatting
				if (devirgined) {
					//If no spaces after virgin loss
					if (!spacingsB) outputText("  ");
				}
				//Non virgins as usual
				else if (spacingsF) outputText("  ");
				if (vaginas[0].vaginalLooseness == Vagina.LOOSENESS_LEVEL_CLOWN_CAR) outputText("<b>Your " + Appearance.vaginaDescript(this,0)+ " is stretched painfully wide, large enough to accommodate most beasts and demons.</b>");
				if (vaginas[0].vaginalLooseness == Vagina.LOOSENESS_GAPING_WIDE) outputText("<b>Your " + Appearance.vaginaDescript(this,0) + " is stretched so wide that it gapes continually.</b>");
				if (vaginas[0].vaginalLooseness == Vagina.LOOSENESS_GAPING) outputText("<b>Your " + Appearance.vaginaDescript(this,0) + " painfully stretches, the lips now wide enough to gape slightly.</b>");
				if (vaginas[0].vaginalLooseness == Vagina.LOOSENESS_LOOSE) outputText("<b>Your " + Appearance.vaginaDescript(this,0) + " is now very loose.</b>");
				if (vaginas[0].vaginalLooseness == Vagina.LOOSENESS_NORMAL) outputText("<b>Your " + Appearance.vaginaDescript(this,0) + " is now a little loose.</b>");
				if (vaginas[0].vaginalLooseness == Vagina.LOOSENESS_TIGHT) outputText("<b>Your " + Appearance.vaginaDescript(this,0) + " is stretched out to a more normal size.</b>");
				if (spacingsB) outputText("  ");
			}
			return stretched;
		}

		public  buttChange(cArea: number, display: boolean, spacingsF: boolean = true, spacingsB: boolean = true): boolean
		{
		var  stretched: boolean = buttChangeNoDisplay(cArea);
			//STRETCH SUCCESSFUL - begin flavor text if outputting it!
			if (stretched && display) {
				if (spacingsF) outputText("  ");
				buttChangeDisplay();
				if (spacingsB) outputText("  ");
			}
			return stretched;
		}

		/**
		 * Refills player's hunger. 'amnt' is how much to refill, 'nl' determines if new line should be added before the notification.
		 * @param	amnt
		 * @param	nl
		 */
		public  refillHunger(amnt: number = 0, nl: boolean = true): void {
			if (flags[kFLAGS.HUNGER_ENABLED] > 0 || flags[kFLAGS.IN_PRISON] > 0)
			{
				
			var  oldHunger: number = hunger;
			var  weightChange: number = 0;
				
				hunger += amnt;
				if (hunger > maxHunger())
				{
					while (hunger > 110 && !game.prison.inPrison) {
						weightChange++;
						hunger -= 10;
					}
					modThickness(100, weightChange);
					hunger = maxHunger();
				}
				if (hunger > oldHunger && flags[kFLAGS.USE_OLD_INTERFACE] == 0) kGAMECLASS.mainView.statsView.showStatUp('hunger');
				//game.dynStats("lus", 0, "scale");
				if (nl) outputText("\n");
				//Messages
				if (hunger < 10) outputText("<b>You still need to eat more. </b>");
				else if (hunger >= 10 && hunger < 25) outputText("<b>You are no longer starving but you still need to eat more. </b>");
				else if (hunger >= 25 && hunger100 < 50) outputText("<b>The growling sound in your stomach seems to quiet down. </b>");
				else if (hunger100 >= 50 && hunger100 < 75) outputText("<b>Your stomach no longer growls. </b>");
				else if (hunger100 >= 75 && hunger100 < 90) outputText("<b>You feel so satisfied. </b>");
				else if (hunger100 >= 90) outputText("<b>Your stomach feels so full. </b>");
				if (weightChange > 0) outputText("<b>You feel like you've put on some weight. </b>");
				kGAMECLASS.awardAchievement("Tastes Like Chicken ", kACHIEVEMENTS.REALISTIC_TASTES_LIKE_CHICKEN);
				if (oldHunger < 1 && hunger >= 100) kGAMECLASS.awardAchievement("Champion Needs Food Badly ", kACHIEVEMENTS.REALISTIC_CHAMPION_NEEDS_FOOD);
				if (oldHunger >= 90) kGAMECLASS.awardAchievement("Glutton ", kACHIEVEMENTS.REALISTIC_GLUTTON);
				if (hunger > oldHunger) kGAMECLASS.mainView.statsView.showStatUp("hunger");
				game.dynStats("lus", 0, "scale", false);
				kGAMECLASS.output.statScreenRefresh();
			}
		}
		
		/**
		 * Damages player's hunger. 'amnt' is how much to deduct.
		 * @param	amnt
		 */
		public  damageHunger(amnt: number = 0): void {
		var  oldHunger: number = hunger;
			hunger -= amnt;
			if (hunger < 0) hunger = 0;
			if (hunger < oldHunger && flags[kFLAGS.USE_OLD_INTERFACE] == 0) kGAMECLASS.mainView.statsView.showStatDown('hunger');
			game.dynStats("lus", 0, "scale", false);
		}
		
		public override function corruptionTolerance(): number {
		var  temp: number = perkv1(PerkLib.AscensionTolerance) * 5 * (1 - perkv2(PerkLib.AscensionTolerance));
			if (flags[kFLAGS.MEANINGLESS_CORRUPTION] > 0) temp += 100;
			return temp;
		}

		public  buttChangeDisplay(): void
		{	//Allows the test for stretching and the text output to be separated
			if (ass.analLooseness == 5) outputText("<b>Your " + Appearance.assholeDescript(this) + " is stretched even wider, capable of taking even the largest of demons and beasts.</b>");
			if (ass.analLooseness == 4) outputText("<b>Your " + Appearance.assholeDescript(this) + " becomes so stretched that it gapes continually.</b>");
			if (ass.analLooseness == 3) outputText("<b>Your " + Appearance.assholeDescript(this) + " is now very loose.</b>");
			if (ass.analLooseness == 2) outputText("<b>Your " + Appearance.assholeDescript(this) + " is now a little loose.</b>");
			if (ass.analLooseness == 1) outputText("<b>You have lost your anal virginity.</b>");
		}

		public  slimeFeed(): void{
			if (hasStatusEffect(StatusEffects.SlimeCraving)) {
				//Reset craving value
				changeStatusValue(StatusEffects.SlimeCraving,1,0);
				//Flag to display feed update and restore stats in event parser
				if (!hasStatusEffect(StatusEffects.SlimeCravingFeed)) {
					createStatusEffect(StatusEffects.SlimeCravingFeed,0,0,0,0);
				}
			}
			if (hasPerk(PerkLib.Diapause)) {
				flags[kFLAGS.DIAPAUSE_FLUID_AMOUNT] += 3 + rand(3);
				flags[kFLAGS.DIAPAUSE_NEEDS_DISPLAYING] = 1;
			}

		}

		public  minoCumAddiction(raw: number = 10): void {
			//Increment minotaur cum intake count
			flags[kFLAGS.MINOTAUR_CUM_INTAKE_COUNT]++;
			//Fix if variables go out of range.
			if (flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] < 0) flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] = 0;
			if (flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] < 0) flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] = 0;
			if (flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] > 120) flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] = 120;

			//Turn off withdrawal
			//if (flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] > 1) flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] = 1;
			//Reset counter
			flags[kFLAGS.TIME_SINCE_LAST_CONSUMED_MINOTAUR_CUM] = 0;
			//If highly addicted, rises slower
			if (flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] >= 60) raw /= 2;
			if (flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] >= 80) raw /= 2;
			if (flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] >= 90) raw /= 2;
			if (hasPerk(PerkLib.MinotaurCumResistance)) raw *= 0;
			//If in withdrawl, readdiction is potent!
			if (flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] == 3) raw += 10;
			if (flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] == 2) raw += 5;
			raw = Math.round(raw * 100)/100;
			//PUT SOME CAPS ON DAT' SHIT
			if (raw > 50) raw = 50;
			if (raw < -50) raw = -50;
			if (flags[kFLAGS.ADDICTIONS_ENABLED] <= 0) { //Disables addiction if set to OFF.
				flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] = 1;
				raw = 0; 
			}
			flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] += raw;
			//Recheck to make sure shit didn't break
			if (hasPerk(PerkLib.MinotaurCumResistance)) flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] = 0; //Never get addicted!
			if (flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] > 120) flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] = 120;
			if (flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] < 0) flags[kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER] = 0;
		}
		
		public  hasSpells(): boolean
		{
			return spellCount() > 0;
		}

		public  spellCount(): number
		{
			return [StatusEffects.KnowsArouse, StatusEffects.KnowsHeal, StatusEffects.KnowsMight, StatusEffects.KnowsCharge, StatusEffects.KnowsBlind, StatusEffects.KnowsWhitefire, StatusEffects.KnowsBlackfire].filter(function(item:StatusEffectType, index: number, array: any[]): boolean {
						return this.hasStatusEffect(item); }, this).length;
		}

		public  spellCost(mod: number): number {
			//Addiditive mods
		var  costPercent: number = 100;
			if (hasPerk(PerkLib.SpellcastingAffinity)) costPercent -= perkv1(PerkLib.SpellcastingAffinity);
			if (hasPerk(PerkLib.WizardsEndurance)) costPercent -= perkv1(PerkLib.WizardsEndurance);
			
			//Limiting it and multiplicative mods
			if (hasPerk(PerkLib.BloodMage) && costPercent < 50) costPercent = 50;
			
			mod *= costPercent/100;
			
			if (hasPerk(PerkLib.HistoryScholar)) {
				if (mod > 2) mod *= .8;
			}
			if (hasPerk(PerkLib.BloodMage) && mod < 5) mod = 5;
			else if (mod < 2) mod = 2;
			
			mod = Math.round(mod * 100)/100;
			return mod;
		}
		
		public  physicalCost(mod: number): number {
		var  costPercent: number = 100;
			if (hasPerk(PerkLib.IronMan)) costPercent -= 50;
			mod *= costPercent/100;
			return mod;
		}
		
		//Modify fatigue
		//types:
		//  0 - normal
		//	1 - magic
		//	2 - physical
		//	3 - non-bloodmage magic
		public  changeFatigue(mod: number,type: number  = 0): void {
			//Spell reductions
			if (type == 1) {
				mod = spellCost(mod);
				
				//Blood mages use HP for spells
				if (hasPerk(PerkLib.BloodMage)) {
					takeDamage(mod);
					return;
				}                
			}
			//Physical special reductions
			if (type == 2) {
				mod = physicalCost(mod);
			}
			if (type == 3) {
				mod = spellCost(mod);
			}
			if (fatigue >= maxFatigue() && mod > 0) return;
			if (fatigue <= 0 && mod < 0) return;
			//Fatigue restoration buffs!
			if (mod < 0) {
			var  multi: number = 1;
				
				if (hasPerk(PerkLib.HistorySlacker)) multi *= 1.2;
				if (hasPerk(PerkLib.ControlledBreath) && isPureEnough(30)) multi *= 1.1;
				if (hasPerk(PerkLib.SpeedyRecovery)) multi *= 1.5;
				
				mod *= multi;
			}
			fatigue += mod;
			if (mod > 0) {
				game.mainView.statsView.showStatUp( 'fatigue' );
				// fatigueUp.visible = true;
				// fatigueDown.visible = false;
			}
			if (mod < 0) {
				game.mainView.statsView.showStatDown( 'fatigue' );
				// fatigueDown.visible = true;
				// fatigueUp.visible = false;
			}
			kGAMECLASS.dynStats("lus", 0, "scale", false); //Force display fatigue up/down by invoking zero lust change.
			if (fatigue > maxFatigue()) fatigue = maxFatigue();
			if (fatigue < 0) fatigue = 0;
			kGAMECLASS.output.statScreenRefresh();
		}
		
		public  armorDescript(nakedText: string = "gear"): string
		{
		var  textArray: any[] = [];
		var  text: string = "";
			//if (armor != ArmorLib.NOTHING) text += armorName;
			//Join text.
			if (armor != ArmorLib.NOTHING) textArray.push(armor.name);
			if (upperGarment != UndergarmentLib.NOTHING) textArray.push(upperGarmentName);
			if (lowerGarment != UndergarmentLib.NOTHING) textArray.push(lowerGarmentName);
			if (textArray.length > 0) text = formatStringArray(textArray);
			//Naked?
			if (upperGarment == UndergarmentLib.NOTHING && lowerGarment == UndergarmentLib.NOTHING && armor == ArmorLib.NOTHING) text = nakedText;
			return text;
		}
		
		public  clothedOrNaked(clothedText: string, nakedText: string = ""): string
		{
			return (armorDescript() != "gear" ? clothedText : nakedText);
		}
		
		public  clothedOrNakedLower(clothedText: string, nakedText: string = ""): string
		{
			return (armorName != "gear" && (armorName != "lethicite armor" && lowerGarmentName == "nothing") && !isTaur() ? clothedText : nakedText);
		}
		
		public  addToWornClothesArray(armor:Armor): void {
			for (var i: number = 0; i < previouslyWornClothes.length; i++) {
				if (previouslyWornClothes[i] == armor.shortName) return; //Already have?
			}
			previouslyWornClothes.push(armor.shortName);
		}
		
		public  shrinkTits(ignore_hyper_happy: boolean=false): void
		{
			if (flags[kFLAGS.HYPER_HAPPY] && !ignore_hyper_happy)
			{
				return;
			}
			if (breastRows.length == 1) {
				if (breastRows[0].breastRating > 0) {
					//Shrink if bigger than N/A cups
				var  temp: number;
					temp = 1;
					breastRows[0].breastRating--;
					//Shrink again 50% chance
					if (breastRows[0].breastRating >= 1 && rand(2) == 0 && !hasPerk(PerkLib.BigTits)) {
						temp++;
						breastRows[0].breastRating--;
					}
					if (breastRows[0].breastRating < 0) breastRows[0].breastRating = 0;
					//Talk about shrinkage
					if (temp == 1) outputText("\n\nYou feel a weight lifted from you, and realize your breasts have shrunk!  With a quick measure, you determine they're now " + breastCup(0) + "s.");
					if (temp == 2) outputText("\n\nYou feel significantly lighter.  Looking down, you realize your breasts are much smaller!  With a quick measure, you determine they're now " + breastCup(0) + "s.");
				}
			}
			else if (breastRows.length > 1) {
				//multiple
				outputText("\n");
				//temp2 = amount changed
				//temp3 = counter
			var  temp2: number = 0;
			var  temp3: number = breastRows.length;
				while(temp3 > 0) {
					temp3--;
					if (breastRows[temp3].breastRating > 0) {
						breastRows[temp3].breastRating--;
						if (breastRows[temp3].breastRating < 0) breastRows[temp3].breastRating = 0;
						temp2++;
						outputText("\n");
						if (temp3 < breastRows.length - 1) outputText("...and y");
						else outputText("Y");
						outputText("our " + breastDescript(temp3) + " shrink, dropping to " + breastCup(temp3) + "s.");
					}
					if (breastRows[temp3].breastRating < 0) breastRows[temp3].breastRating = 0;
				}
				if (temp2 == 2) outputText("\nYou feel so much lighter after the change.");
				if (temp2 == 3) outputText("\nWithout the extra weight you feel particularly limber.");
				if (temp2 >= 4) outputText("\nIt feels as if the weight of the world has been lifted from your shoulders, or in this case, your chest.");
			}
		}

		public  growTits(amount: number, rowsGrown: number, display: boolean, growthType: number): void
		{
			if (breastRows.length == 0) return;
			//GrowthType 1 = smallest grows
			//GrowthType 2 = Top Row working downward
			//GrowthType 3 = Only top row
		var  temp2: number = 0;
		var  temp3: number = 0;
			//Chance for "big tits" perked characters to grow larger!
			if (hasPerk(PerkLib.BigTits) && rand(3) == 0 && amount < 1) amount=1;

			// Needs to be a number, since uint will round down to 0 prevent growth beyond a certain point
		var  temp: number = breastRows.length;
			if (growthType == 1) {
				//Select smallest breast, grow it, move on
				while(rowsGrown > 0) {
					//Temp = counter
					temp = breastRows.length;
					//Temp2 = smallest tits index
					temp2 = 0;
					//Find smallest row
					while(temp > 0) {
						temp--;
						if (breastRows[temp].breastRating < breastRows[temp2].breastRating) temp2 = temp;
					}
					//Temp 3 tracks total amount grown
					temp3 += amount;
					//trace("Breastrow chosen for growth: " + String(temp2) + ".");
					//Reuse temp to store growth amount for diminishing returns.
					temp = amount;
					if (!flags[kFLAGS.HYPER_HAPPY])
					{
						//Diminishing returns!
						if (breastRows[temp2].breastRating > 3)
						{
							if (!hasPerk(PerkLib.BigTits))
								temp /=1.5;
							else
								temp /=1.3;
						}

						// WHy are there three options here. They all have the same result.
						if (breastRows[temp2].breastRating > 7)
						{
							if (!hasPerk(PerkLib.BigTits))
								temp /=2;
							else
								temp /=1.5;
						}
						if (breastRows[temp2].breastRating > 9)
						{
							if (!hasPerk(PerkLib.BigTits))
								temp /=2;
							else
								temp /=1.5;
						}
						if (breastRows[temp2].breastRating > 12)
						{
							if (!hasPerk(PerkLib.BigTits))
								temp /=2;
							else
								temp  /=1.5;
						}
					}

					//Grow!
					//trace("Growing breasts by ", temp);
					breastRows[temp2].breastRating += temp;
					rowsGrown--;
				}
			}

			if (!flags[kFLAGS.HYPER_HAPPY])
			{
				//Diminishing returns!
				if (breastRows[0].breastRating > 3) {
					if (!hasPerk(PerkLib.BigTits)) amount/=1.5;
					else amount/=1.3;
				}
				if (breastRows[0].breastRating > 7) {
					if (!hasPerk(PerkLib.BigTits)) amount/=2;
					else amount /= 1.5;
				}
				if (breastRows[0].breastRating > 12) {
					if (!hasPerk(PerkLib.BigTits)) amount/=2;
					else amount /= 1.5;
				}
			}
			/*if (breastRows[0].breastRating > 12) {
				if (hasPerk("Big Tits") < 0) amount/=2;
				else amount /= 1.5;
			}*/
			if (growthType == 2) {
				temp = 0;
				//Start at top and keep growing down, back to top if hit bottom before done.
				while(rowsGrown > 0) {
					if (temp+1 > breastRows.length) temp = 0;
					breastRows[temp].breastRating += amount;
					//trace("Breasts increased by " + amount + " on row " + temp);
					temp++;
					temp3 += amount;
					rowsGrown--;
				}
			}
			if (growthType == 3) {
				while(rowsGrown > 0) {
					rowsGrown--;
					breastRows[0].breastRating += amount;
					temp3 += amount;
				}
			}
			//Breast Growth Finished...talk about changes.
			//trace("Growth amount = ", amount);
			if (display) {
				if (growthType < 3) {
					if (amount <= 2)
					{
						if (breastRows.length > 1) outputText("Your rows of " + breastDescript(0) + " jiggle with added weight, growing a bit larger.");
						if (breastRows.length == 1) outputText("Your " + breastDescript(0) + " jiggle with added weight as they expand, growing a bit larger.");
					}
					else if (amount <= 4)
					{
						if (breastRows.length > 1) outputText("You stagger as your chest gets much heavier.  Looking down, you watch with curiosity as your rows of " + breastDescript(0) + " expand significantly.");
						if (breastRows.length == 1) outputText("You stagger as your chest gets much heavier.  Looking down, you watch with curiosity as your " + breastDescript(0) + " expand significantly.");
					}
					else
					{
						if (breastRows.length > 1) outputText("You drop to your knees from a massive change in your body's center of gravity.  Your " + breastDescript(0) + " tingle strongly, growing disturbingly large.");
						if (breastRows.length == 1) outputText("You drop to your knees from a massive change in your center of gravity.  The tingling in your " + breastDescript(0) + " intensifies as they continue to grow at an obscene rate.");
					}

				}
				else
				{
					if (amount <= 2) {
						if (breastRows.length > 1) outputText("Your top row of " + breastDescript(0) + " jiggles with added weight as it expands, growing a bit larger.");
						if (breastRows.length == 1) outputText("Your row of " + breastDescript(0) + " jiggles with added weight as it expands, growing a bit larger.");
					}
					if (amount > 2 && amount <= 4) {
						if (breastRows.length > 1) outputText("You stagger as your chest gets much heavier.  Looking down, you watch with curiosity as your top row of " + breastDescript(0) + " expand significantly.");
						if (breastRows.length == 1) outputText("You stagger as your chest gets much heavier.  Looking down, you watch with curiosity as your " + breastDescript(0) + " expand significantly.");
					}
					if (amount > 4) {
						if (breastRows.length > 1) outputText("You drop to your knees from a massive change in your body's center of gravity.  Your top row of " + breastDescript(0) + " tingle strongly, growing disturbingly large.");
						if (breastRows.length == 1) outputText("You drop to your knees from a massive change in your center of gravity.  The tingling in your " + breastDescript(0) + " intensifies as they continue to grow at an obscene rate.");
					}
				}
			}
			// Nipples
			if (biggestTitSize() >= 8.5 && nippleLength < 2) 
			{
				if (display) outputText("  A tender ache starts at your [nipples] as they grow to match your burgeoning breast-flesh.");
				nippleLength = 2;
			}
			if (biggestTitSize() >= 7 && nippleLength < 1)
			{
				if (display) outputText("  A tender ache starts at your [nipples] as they grow to match your burgeoning breast-flesh.");
				nippleLength = 1;
			}
			if (biggestTitSize() >= 5 && nippleLength < .75)
			{
				if (display) outputText("  A tender ache starts at your [nipples] as they grow to match your burgeoning breast-flesh.");
				nippleLength = .75;
			}
			if (biggestTitSize() >= 3 && nippleLength < .5)
			{
				if (display) outputText("  A tender ache starts at your [nipples] as they grow to match your burgeoning breast-flesh.");
				nippleLength = .5;
			}
		}

		public override function minLib(): number {
		var  minLib: number = 0;

			if (gender > 0) minLib = 15;
			else minLib = 10;

			if (armorName == "lusty maiden's armor") {
				if (minLib < 50)
				{
					minLib = 50;
				}
			}
			if (minLib < (minLust() * 2 / 3))
			{
				minLib = (minLust() * 2 / 3);
			}
			if (jewelryEffectId == JewelryLib.PURITY)
			{
				minLib -= jewelryEffectMagnitude;
			}
			if (findPerk(PerkLib.PurityBlessing) >= 0) {
				minLib -= 2;
			}
			if (findPerk(PerkLib.HistoryReligious) >= 0) {
				minLib -= 2;
			}
			return minLib;
		}
		//Determine minimum lust
		public override function minLust(): number
		{
		var  min: number = 0;
		var  minCap: number = 100;
			//Bimbo body boosts minimum lust by 40
			if (hasStatusEffect(StatusEffects.BimboChampagne) || findPerk(PerkLib.BimboBody) >= 0 || findPerk(PerkLib.BroBody) >= 0 || findPerk(PerkLib.FutaForm) >= 0) {
				if (min > 40) min += 10;
				else if (min >= 20) min += 20;
				else min += 40;
				if (armorName == "bimbo skirt") min += flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST] / 4;
			}
			else if (kGAMECLASS.bimboProgress.ableToProgress()) {
				if (min > 40) min += flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST] / 4;
				else if (min >= 20 ) min += flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST] / 2;
				else min += flags[kFLAGS.BIMBOSKIRT_MINIMUM_LUST];
			}
			//Omnibus' Gift
			if (hasPerk(PerkLib.OmnibusGift)) {
				if (min > 40) min += 10;
				else if (min >= 20) min += 20;
				else min += 35;
			}
			//Nymph perk raises to 30
			if (hasPerk(PerkLib.Nymphomania)) {
				if (min >= 40) min += 10;
				else if (min >= 20) min += 15;
				else min += 30;
			}
			//Oh noes anemone!
			if (hasStatusEffect(StatusEffects.AnemoneArousal)) {
				if (min >= 40) min += 10;
				else if (min >= 20) min += 20;
				else min += 30;
			}
			//Hot blooded perk raises min lust!
			if (hasPerk(PerkLib.HotBlooded)) {
				if (min > 0) min += perk(findPerk(PerkLib.HotBlooded)).value1 / 2;
				else min += perk(findPerk(PerkLib.HotBlooded)).value1;
			}
			if (hasPerk(PerkLib.LuststickAdapted)) {
				if (min < 50) min += 10;
				else min += 5;
			}
			if (hasStatusEffect(StatusEffects.Infested)) {
				if (min < 50) min = 50;
			}
			//Add points for Crimstone
			min += perkv1(PerkLib.PiercedCrimstone);
			//Subtract points for Icestone!
			min -= perkv1(PerkLib.PiercedIcestone);
			min += perkv1(PerkLib.PentUp);
			//Cold blooded perk reduces min lust, to a minimum of 20! Takes effect after piercings. This effectively caps minimum lust at 80.
			if (hasPerk(PerkLib.ColdBlooded)) {
				if (min >= 20) {
					if (min <= 40) min -= (min - 20);
					else min -= 20;
				}
				minCap -= 20;
			}
			//Harpy Lipstick status forces minimum lust to be at least 50.
			if (min < 50 && hasStatusEffect(StatusEffects.Luststick)) min = 50;
			//SHOULDRA BOOSTS
			//+20
			if (flags[kFLAGS.SHOULDRA_SLEEP_TIMER] <= -168 && flags[kFLAGS.URTA_QUEST_STATUS] != 0.75) {
				min += 20;
				if (flags[kFLAGS.SHOULDRA_SLEEP_TIMER] <= -216)
					min += 30;
			}
			//SPOIDAH BOOSTS
			if (eggs() >= 20) {
				min += 10;
				if (eggs() >= 40) min += 10;
			}
			//Jewelry effects
			if (jewelryEffectId == JewelryLib.MODIFIER_MINIMUM_LUST)
			{
				min += jewelryEffectMagnitude;
				if (min > (minCap - jewelryEffectMagnitude) && jewelryEffectMagnitude < 0)
				{
					minCap += jewelryEffectMagnitude;
				}
			}
			if (min < 30 && armorName == "lusty maiden's armor") min = 30;
			if (min < 20 && armorName == "tentacled bark armor") min = 20;
			//Constrain values
			if (min < 0) min = 0;
			if (min > 95) min = 95;
			if (min > minCap) min = minCap;
			return min;
		}

		public  modStats(dstr: number, dtou: number, dspe: number, dinte: number, dlib: number, dsens: number, dlust: number, dcor: number, scale: boolean, max: boolean): void {

			//Set original values to begin tracking for up/down values if
			//they aren't set yet.
			//These are reset when up/down arrows are hidden with
			//hideUpDown();
			//Just check str because they are either all 0 or real values
		var  oldStats: Record<string, any> = kGAMECLASS.oldStats;
			if (oldStats.oldStr == 0) {
				oldStats.oldStr = str;
				oldStats.oldTou = tou;
				oldStats.oldSpe = spe;
				oldStats.oldInte = inte;
				oldStats.oldLib = lib;
				oldStats.oldSens = sens;
				oldStats.oldCor = cor;
				oldStats.oldHP = HP;
				oldStats.oldLust = lust;
				oldStats.oldFatigue = fatigue;
				oldStats.oldHunger = hunger;
			}
			//MOD CHANGES FOR PERKS
			//Bimbos learn slower
			if (scale) {
				//Easy mode cuts lust gains!
				if (flags[kFLAGS.EASY_MODE_ENABLE_FLAG] == 1 && dlust > 0 && scale) dlust /= 2;

				if (findPerk(PerkLib.FutaFaculties) >= 0 || findPerk(PerkLib.BimboBrains) >= 0 || findPerk(PerkLib.BroBrains) >= 0) {
					if (dinte > 0) dinte /= 2;
					if (dinte < 0) dinte *= 2;
				}
				if (findPerk(PerkLib.FutaForm) >= 0 || findPerk(PerkLib.BimboBody) >= 0 || findPerk(PerkLib.BroBody) >= 0) {
					if (dlib > 0) dlib *= 2;
					if (dlib < 0) dlib /= 2;
				}

				// Uma's Perkshit
				if (findPerk(PerkLib.ChiReflowSpeed) >= 0 && dspe < 0) dspe *= UmasShop.NEEDLEWORK_SPEED_SPEED_MULTI;
				if (findPerk(PerkLib.ChiReflowLust) >= 0 && dlib > 0) dlib *= UmasShop.NEEDLEWORK_LUST_LIBSENSE_MULTI;
				if (findPerk(PerkLib.ChiReflowLust) >= 0 && dsens > 0) dsens *= UmasShop.NEEDLEWORK_LUST_LIBSENSE_MULTI;

				//Apply lust changes in NG+.
				if (scale) dlust *= 1 + (newGamePlusMod() * 0.2);

				//lust resistance
				if (dlust > 0 && scale) dlust *= lustPercent() / 100;
				if (dlib > 0 && findPerk(PerkLib.PurityBlessing) >= 0) dlib *= 0.75;
				if (dcor > 0 && findPerk(PerkLib.PurityBlessing) >= 0) dcor *= 0.5;
				if (dcor > 0 && findPerk(PerkLib.PureAndLoving) >= 0) dcor *= 0.75;
				if (dcor > 0 && weapon == kGAMECLASS.weapons.HNTCANE) dcor *= 0.5;
				if (findPerk(PerkLib.AscensionMoralShifter) >= 0) dcor *= 1 + (perkv1(PerkLib.AscensionMoralShifter) * 0.2);
				if (sens > 50 && dsens > 0) dsens/=2;
				if (sens > 75 && dsens > 0) dsens/=2;
				if (sens > 90 && dsens > 0) dsens/=2;
				if (sens > 50 && dsens < 0) dsens*=2;
				if (sens > 75 && dsens < 0) dsens*=2;
				if (sens > 90 && dsens < 0) dsens*=2;
				//Bonus gain for perks!
				if (findPerk(PerkLib.Strong) >= 0 && dstr >= 0) dstr*=1+perk(findPerk(PerkLib.Strong)).value1;
				if (findPerk(PerkLib.Tough) >= 0 && dtou >= 0) dtou*=1+perk(findPerk(PerkLib.Tough)).value1;
				if (findPerk(PerkLib.Fast) >= 0 && dspe >= 0) dspe*=1+perk(findPerk(PerkLib.Fast)).value1;
				if (findPerk(PerkLib.Smart) >= 0 && dinte >= 0) dinte*=1+perk(findPerk(PerkLib.Smart)).value1;
				if (findPerk(PerkLib.Lusty) >= 0 && dlib >= 0) dlib*=1+perk(findPerk(PerkLib.Lusty)).value1;
				if (findPerk(PerkLib.Sensitive) >= 0 && dsens >= 0) dsens*= 1+ perk(findPerk(PerkLib.Sensitive)).value1;
			}
			super.modStats(dstr, dtou, dspe, dinte, dlib, dsens, dlust, dcor, false, max);
			game.output.showUpDown();
			kGAMECLASS.output.statScreenRefresh();
		}


		public override function getMaxStats(stats: string): number {
		var  obj: Record<string, any> = getAllMaxStats();
			if (stats == "str" || stats == "strength") return obj.str;
			else if (stats == "tou" || stats == "toughness") return obj.tou;
			else if (stats == "spe" || stats == "speed") return obj.spe;
			else if (stats == "inte" || stats == "int" || stats == "intelligence") return obj.inte;
			/* [INTERMOD: xianxia]
			 else if (stats == "wis" || stats == "wisdom") return obj.wis;
			 else if (stats == "lib" || stats == "libido") return obj.lib;
			 */
			else return 100;
		}
		/**
		 * @return keys: str, tou, spe, inte
		 */
		public override function getAllMaxStats(): Record<string, any> {
		var  maxStr: number = 100;
		var  maxTou: number = 100;
		var  maxSpe: number = 100;
		var  maxInt: number = 100;
			/* [INTERMOD: xianxia]
		var  maxWis: number = 100;
		var  maxLib: number = 100;
		var  newGamePlusMod: number = this.newGamePlusMod();
			 */

			//Alter max speed if you have oversized parts. (Realistic mode)
			if (flags[kFLAGS.HUNGER_ENABLED] >= 1)
			{
				//Balls
			var  tempSpeedPenalty: number = 0;
			var  lim: number = isTaur() ? 9 : 4;
				if (ballSize > lim && balls > 0) tempSpeedPenalty += Math.round((ballSize - lim) / 2);
				//Breasts
				lim = isTaur() ? BreastCup.I : BreastCup.G;
				if (hasBreasts() && biggestTitSize() > lim) tempSpeedPenalty += ((biggestTitSize() - lim) / 2);
				//Cocks
				lim = isTaur() ? 72 : 24;
				if (biggestCockArea() > lim) tempSpeedPenalty += ((biggestCockArea() - lim) / 6)
				//Min-cap
			var  penaltyMultiplier: number = 1;
				penaltyMultiplier -= str * 0.1;
				penaltyMultiplier -= (tallness - 72) / 168;
				if (penaltyMultiplier < 0.4) penaltyMultiplier = 0.4;
				tempSpeedPenalty *= penaltyMultiplier;
				maxSpe -= tempSpeedPenalty;
				if (maxSpe < 50) maxSpe = 50;
			}
			//Perks ahoy
			if (hasPerk(PerkLib.BasiliskResistance) && !canUseStare())
			{
				maxSpe -= 5;
			}
			//Uma's Needlework affects max stats. Takes effect BEFORE racial modifiers and AFTER modifiers from body size.
			//Caps strength from Uma's needlework. 
			if (hasPerk(PerkLib.ChiReflowSpeed))
			{
				if (maxStr > UmasShop.NEEDLEWORK_SPEED_STRENGTH_CAP)
				{
					maxStr = UmasShop.NEEDLEWORK_SPEED_STRENGTH_CAP;
				}
			}
			//Caps speed from Uma's needlework.
			if (hasPerk(PerkLib.ChiReflowDefense))
			{
				if (maxSpe > UmasShop.NEEDLEWORK_DEFENSE_SPEED_CAP)
				{
					maxSpe = UmasShop.NEEDLEWORK_DEFENSE_SPEED_CAP;
				}
			}
			if (flags[kFLAGS.LEGACY_RACIAL_STATS_ENABLED] === 1) {
				//Alter max stats depending on race
				if (impScore() >= 4) {
					maxSpe += 10;
					maxInt -= 5;
				}
				if (sheepScore() >= 4) {
					maxSpe += 10;
					maxInt -= 10;
					maxTou += 10;
				}
				if (wolfScore() >= 4) {
					maxSpe -= 10;
					maxInt += 5;
					maxTou += 10;
					maxStr += 5;
				}
				if (minoScore() >= 4) {
					maxStr += 20;
					maxTou += 10;
					maxInt -= 10;
				}
				if (lizardScore() >= 4) {
					maxInt += 10;
					if (isBasilisk()) {
						// Needs more balancing, especially other races, since dracolisks are quite OP right now!
						maxTou += 5;
						maxInt += 5;
					}
				}
				if (ferretScore() >= 8) {
					maxStr += 15;
					maxSpe += 25;
				} else if (ferretScore() >= 4) {
					maxStr += 5;
					maxSpe += 15;
				}
				if (redPandaScore() >= 8) {
					maxInt += 10;
					maxSpe += 25;
					maxStr += 5;
				} else if (redPandaScore() >= 4) {
					maxInt += 5;
					maxSpe += 15;
				}
				if (cockatriceScore() >= 8) {
					maxStr += 5;
					maxSpe += 25;
					maxInt += 15;
				} else if (cockatriceScore() >= 6) {
					maxSpe += 20;
					maxInt += 5;
				} else if (cockatriceScore() >= 4) {
					maxStr -= 5;
					maxSpe += 10;
					maxInt += 5;
				}
				if (dragonScore() >= 4) {
					maxStr += 5;
					maxTou += 10;
					maxInt += 10;
				}
				if (dogScore() >= 4) {
					maxSpe += 10;
					maxInt -= 10;
				}
				if (foxScore() >= 4) {
					maxStr -= 10;
					maxSpe += 5;
					maxInt += 5;
				}
				if (catScore() >= 4) {
					maxSpe += 5;
				}
				if (bunnyScore() >= 4) {
					maxSpe += 10;
				}
				if (raccoonScore() >= 4) {
					maxSpe += 15;
				}
				if (horseScore() >= 4 && !isTaur() && !isNaga()) {
					maxSpe += 15;
					maxTou += 10;
					maxInt -= 10;
				}
				if (gooScore() >= 3) {
					maxTou += 10;
					maxSpe -= 10;
				}
				if (kitsuneScore() >= 4) {
					if (tail.type == Tail.FOX) {
						if (tail.venom == 1) {
							maxStr -= 2;
							maxSpe += 2;
							maxInt += 1;
						}
						else if (tail.venom >= 2 && tail.venom < 9) {
							maxStr -= tail.venom + 1;
							maxSpe += tail.venom + 1;
							maxInt += (tail.venom/2) + 0.5;
						}
						else if (tail.venom >= 9) {
							maxStr -= 10;
							maxSpe += 10;
							maxInt += 5;
						}
					}
				}
				if (beeScore() >= 4) {
					maxSpe += 5;
					maxTou += 5;
				}
				if (spiderScore() >= 4) {
					maxInt += 15;
					maxTou += 5;
					maxStr -= 10;
				}
				if (sharkScore() >= 4) {
					maxStr += 10;
					maxSpe += 5;
					maxInt -= 5;
				}
				if (harpyScore() >= 4) {
					maxSpe += 15;
					maxTou -= 10;
				}
				if (sirenScore() >= 4) {
					maxStr += 5;
					maxSpe += 20;
					maxTou -= 5;
				}
				if (demonScore() >= 4) {
					maxSpe += 5;
					maxInt += 5;
				}
				if (rhinoScore() >= 4) {
					maxStr += 15;
					maxTou += 15;
					maxSpe -= 10;
					maxInt -= 10;
				}
				if (satyrScore() >= 4) {
					maxStr += 5;
					maxSpe += 5;
				}
				if (salamanderScore() >= 4) {
					maxStr += 5;
					maxTou += 5;
				}
				if (isNaga()) maxSpe += 10;
				if (isTaur() || isDrider()) maxSpe += 20;
			}
			//Apply New Game+
			maxStr *= 1 + ascensionFactor(0.25);
			maxTou *= 1 + ascensionFactor(0.25);
			maxSpe *= 1 + ascensionFactor(0.25);
			maxInt *= 1 + ascensionFactor(0.25);
			//Might
			if (hasStatusEffect(StatusEffects.Might)) {
				maxStr += statusEffectv1(StatusEffects.Might);
				maxTou += statusEffectv2(StatusEffects.Might);
			}
			if (hasStatusEffect(StatusEffects.AndysSmoke)) {
				maxSpe -= statusEffectv2(StatusEffects.AndysSmoke);
				maxInt += statusEffectv3(StatusEffects.AndysSmoke);
			}
			return {
				str:maxStr,
				tou:maxTou,
				spe:maxSpe,
				inte:maxInt
				/* [INTERMOD: xianxia]
				wis:maxWis,
				lib:maxLib
				*/
			};
		}
		
		public  requiredXP(): number {
		var  temp: number = level * 100;
			if (temp > 9999) temp = 9999;
			return temp;
		}
		
		public  minotaurAddicted(): boolean {
			return flags[kFLAGS.ADDICTIONS_ENABLED] > 0 && !hasPerk(PerkLib.MinotaurCumResistance) && (hasPerk(PerkLib.MinotaurCumAddict) || flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] >= 1);
		}
		public  minotaurNeed(): boolean {
			return flags[kFLAGS.ADDICTIONS_ENABLED] > 0 && !hasPerk(PerkLib.MinotaurCumResistance) && flags[kFLAGS.MINOTAUR_CUM_ADDICTION_STATE] > 1;
		}

		public  clearStatuses(): void
		{
			if (kGAMECLASS.monster.hasStatusEffect(StatusEffects.TwuWuv)) {
				inte += kGAMECLASS.monster.statusEffectv1(StatusEffects.TwuWuv);
				kGAMECLASS.output.statScreenRefresh();
				kGAMECLASS.mainView.statsView.showStatUp( 'inte' );
			}
			if (hasStatusEffect(StatusEffects.Disarmed)) {
				removeStatusEffect(StatusEffects.Disarmed);
				if (weapon == WeaponLib.FISTS) {
//					weapon = ItemType.lookupItem(flags[kFLAGS.PLAYER_DISARMED_WEAPON_ID]) as Weapon;
//					(ItemType.lookupItem(flags[kFLAGS.PLAYER_DISARMED_WEAPON_ID]) as Weapon).doEffect(this, false);
					setWeapon(ItemType.lookupItem(flags[kFLAGS.PLAYER_DISARMED_WEAPON_ID]) as Weapon);
				}
				else {
					flags[kFLAGS.BONUS_ITEM_AFTER_COMBAT_ID] = flags[kFLAGS.PLAYER_DISARMED_WEAPON_ID];
				}
			}
			for (var a:/*StatusEffect*/Array=statusEffects.slice(),n: number=a.length,i: number=0;i<n;i++) {
				// Using a copy of array in case effects are removed/added in handler
				if (statusEffects.indexOf(a[i])>=0) a[i].onCombatEnd();
			}
		}

		public  consumeItem(itype:ItemType, amount: number = 1): boolean {
			if (!hasItem(itype, amount)) {
				CoC_Settings.error("ERROR: consumeItem attempting to find " + amount + " item" + (amount > 1 ? "s" : "") + " to remove when the player has " + itemCount(itype) + ".");
				return false;
			}
			//From here we can be sure the player has enough of the item in inventory
		var  slot:ItemSlot;
			while (amount > 0) {
				slot = getLowestSlot(itype); //Always draw from the least filled slots first
				if (slot.quantity > amount) {
					slot.quantity -= amount;
					amount = 0;
				}
				else { //If the slot holds the amount needed then amount will be zero after this
					amount -= slot.quantity;
					slot.emptySlot();
				}
			}
			return true;
/*			
		var  consumed: boolean = false;
		var  slot:ItemSlot;
			while (amount > 0)
			{
				if (!hasItem(itype,1))
				{
					CoC_Settings.error("ERROR: consumeItem in items.as attempting to find an item to remove when the has none.");
					break;
				}
				trace("FINDING A NEW SLOT! (ITEMS LEFT: " + amount + ")");
				slot = getLowestSlot(itype);
				while (slot != undefined && amount > 0 && slot.quantity > 0)
				{
					amount--;
					slot.quantity--;
					if (slot.quantity == 0) slot.emptySlot();
					trace("EATIN' AN ITEM");
				}
				//If on slot 5 and it doesn't have any more to take, break out!
				if (slot == undefined) amount = -1

			}
			if (amount == 0) consumed = true;
			return consumed;
*/
		}

		public  getLowestSlot(itype:ItemType):ItemSlot
		{
		var  minslot:ItemSlot = undefined;
			for each (var slot:ItemSlot in itemSlots) {
				if (slot.itype == itype) {
					if (minslot == undefined || slot.quantity < minslot.quantity) {
						minslot = slot;
					}
				}
			}
			return minslot;
		}
		
		public  hasItem(itype:ItemType, minQuantity: number = 1): boolean {
			return itemCount(itype) >= minQuantity;
		}
		
		public  itemCount(itype:ItemType): number {
		var  count: number = 0;
			for each (var itemSlot:ItemSlot in itemSlots){
				if (itemSlot.itype == itype) count += itemSlot.quantity;
			}
			return count;
		}

		// 0..5 or -1 if no
		public  roomInExistingStack(itype:ItemType): number {
			for (var i: number = 0; i<itemSlots.length; i++){
				if (itemSlot(i).itype == itype && itemSlot(i).quantity != 0 && itemSlot(i).quantity < itype.getMaxStackSize())
					return i;
			}
			return -1;
		}

		public  itemSlot(idx: number):ItemSlot
		{
			return itemSlots[idx];
		}

		// 0..5 or -1 if no
		public  emptySlot(): number {
		    for (var i: number = 0; i<itemSlots.length;i++){
				if (itemSlot(i).isEmpty() && itemSlot(i).unlocked) return i;
			}
			return -1;
		}


		public  destroyItems(itype:ItemType, numOfItemToRemove: number): boolean
		{
			for (var slotNum: number = 0; slotNum < itemSlots.length; slotNum += 1)
			{
				if (itemSlot(slotNum).itype == itype)
				{
					while(itemSlot(slotNum).quantity > 0 && numOfItemToRemove > 0)
					{
						itemSlot(slotNum).removeOneItem();
						numOfItemToRemove--;
					}
				}
			}
			return numOfItemToRemove <= 0;
		}

		public  lengthChange(temp2: number, ncocks: number): void {

			if (temp2 < 0 && flags[kFLAGS.HYPER_HAPPY])  // Early return for hyper-happy cheat if the call was *supposed* to shrink a cock.
			{
				return;
			}
			//DIsplay the degree of length change.
			if (temp2 <= 1 && temp2 > 0) {
				if (cocks.length == 1) outputText("Your " + cockDescript(0) + " has grown slightly longer.");
				if (cocks.length > 1) {
					if (ncocks == 1) outputText("One of your " + multiCockDescriptLight() + " grows slightly longer.");
					if (ncocks > 1 && ncocks < cocks.length) outputText("Some of your " + multiCockDescriptLight() + " grow slightly longer.");
					if (ncocks == cocks.length) outputText("Your " + multiCockDescriptLight() + " seem to fill up... growing a little bit larger.");
				}
			}
			if (temp2 > 1 && temp2 < 3) {
				if (cocks.length == 1) outputText("A very pleasurable feeling spreads from your groin as your " + cockDescript(0) + " grows permanently longer - at least an inch - and leaks pre-cum from the pleasure of the change.");
				if (cocks.length > 1) {
					if (ncocks == cocks.length) outputText("A very pleasurable feeling spreads from your groin as your " + multiCockDescriptLight() + " grow permanently longer - at least an inch - and leak plenty of pre-cum from the pleasure of the change.");
					if (ncocks == 1) outputText("A very pleasurable feeling spreads from your groin as one of your " + multiCockDescriptLight() + " grows permanently longer, by at least an inch, and leaks plenty of pre-cum from the pleasure of the change.");
					if (ncocks > 1 && ncocks < cocks.length) outputText("A very pleasurable feeling spreads from your groin as " + num2Text(ncocks) + " of your " + multiCockDescriptLight() + " grow permanently longer, by at least an inch, and leak plenty of pre-cum from the pleasure of the change.");
				}
			}
			if (temp2 >=3){
				if (cocks.length == 1) outputText("Your " + cockDescript(0) + " feels incredibly tight as a few more inches of length seem to pour out from your crotch.");
				if (cocks.length > 1) {
					if (ncocks == 1) outputText("Your " + multiCockDescriptLight() + " feel incredibly tight as one of their number begins to grow inch after inch of length.");
					if (ncocks > 1 && ncocks < cocks.length) outputText("Your " + multiCockDescriptLight() + " feel incredibly number as " + num2Text(ncocks) + " of them begin to grow inch after inch of added length.");
					if (ncocks == cocks.length) outputText("Your " + multiCockDescriptLight() + " feel incredibly tight as inch after inch of length pour out from your groin.");
				}
			}
			//Display LengthChange
			if (temp2 > 0) {
				if (cocks[0].cockLength >= 8 && cocks[0].cockLength-temp2 < 8){
					if (cocks.length == 1) outputText("  <b>Most men would be overly proud to have a tool as long as yours.</b>");
					if (cocks.length > 1) outputText("  <b>Most men would be overly proud to have one cock as long as yours, let alone " + multiCockDescript() + ".</b>");
				}
				if (cocks[0].cockLength >= 12 && cocks[0].cockLength-temp2 < 12) {
					if (cocks.length == 1) outputText("  <b>Your " + cockDescript(0) + " is so long it nearly swings to your knee at its full length.</b>");
					if (cocks.length > 1) outputText("  <b>Your " + multiCockDescriptLight() + " are so long they nearly reach your knees when at full length.</b>");
				}
				if (cocks[0].cockLength >= 16 && cocks[0].cockLength-temp2 < 16) {
					if (cocks.length == 1) outputText("  <b>Your " + cockDescript(0) + " would look more at home on a large horse than you.</b>");
					if (cocks.length > 1) outputText("  <b>Your " + multiCockDescriptLight() + " would look more at home on a large horse than on your body.</b>");
					if (biggestTitSize() >= BreastCup.C) {
						if (cocks.length == 1) outputText("  You could easily stuff your " + cockDescript(0) + " between your breasts and give yourself the titty-fuck of a lifetime.");
						if (cocks.length > 1) outputText("  They reach so far up your chest it would be easy to stuff a few cocks between your breasts and give yourself the titty-fuck of a lifetime.");
					}
					else {
						if (cocks.length == 1) outputText("  Your " + cockDescript(0) + " is so long it easily reaches your chest.  The possibility of autofellatio is now a foregone conclusion.");
						if (cocks.length > 1) outputText("  Your " + multiCockDescriptLight() + " are so long they easily reach your chest.  Autofellatio would be about as hard as looking down.");
					}
				}
				if (cocks[0].cockLength >= 20 && cocks[0].cockLength-temp2 < 20) {
					if (cocks.length == 1) outputText("  <b>As if the pulsing heat of your " + cockDescript(0) + " wasn't enough, the tip of your " + cockDescript(0) + " keeps poking its way into your view every time you get hard.</b>");
					if (cocks.length > 1) outputText("  <b>As if the pulsing heat of your " + multiCockDescriptLight() + " wasn't bad enough, every time you get hard, the tips of your " + multiCockDescriptLight() + " wave before you, obscuring the lower portions of your vision.</b>");
					if (cor > 40 && cor <= 60) {
						if (cocks.length > 1) outputText("  You wonder if there is a demon or beast out there that could take the full length of one of your " + multiCockDescriptLight() + "?");
						if (cocks.length ==1) outputText("  You wonder if there is a demon or beast out there that could handle your full length.");
					}
					if (cor > 60 && cor <= 80) {
						if (cocks.length > 1) outputText("  You daydream about being attacked by a massive tentacle beast, its tentacles engulfing your " + multiCockDescriptLight() + " to their hilts, milking you dry.\n\nYou smile at the pleasant thought.");
						if (cocks.length ==1) outputText("  You daydream about being attacked by a massive tentacle beast, its tentacles engulfing your " + cockDescript(0) + " to the hilt, milking it of all your cum.\n\nYou smile at the pleasant thought.");
					}
					if (cor > 80) {
						if (cocks.length > 1) outputText("  You find yourself fantasizing about impaling nubile young champions on your " + multiCockDescriptLight() + " in a year's time.");
					}
				}
			}
			//Display the degree of length loss.
			if (temp2 < 0 && temp2 >= -1) {
				if (cocks.length == 1) outputText("Your " + multiCockDescriptLight() + " has shrunk to a slightly shorter length.");
				if (cocks.length > 1) {
					if (ncocks == cocks.length) outputText("Your " + multiCockDescriptLight() + " have shrunk to a slightly shorter length.");
					if (ncocks > 1 && ncocks < cocks.length) outputText("You feel " + num2Text(ncocks) + " of your " + multiCockDescriptLight() + " have shrunk to a slightly shorter length.");
					if (ncocks == 1) outputText("You feel " + num2Text(ncocks) + " of your " + multiCockDescriptLight() + " has shrunk to a slightly shorter length.");
				}
			}
			if (temp2 < -1 && temp2 > -3) {
				if (cocks.length == 1) outputText("Your " + multiCockDescriptLight() + " shrinks smaller, flesh vanishing into your groin.");
				if (cocks.length > 1) {
					if (ncocks == cocks.length) outputText("Your " + multiCockDescriptLight() + " shrink smaller, the flesh vanishing into your groin.");
					if (ncocks == 1) outputText("You feel " + num2Text(ncocks) + " of your " + multiCockDescriptLight() + " shrink smaller, the flesh vanishing into your groin.");
					if (ncocks > 1 && ncocks < cocks.length) outputText("You feel " + num2Text(ncocks) + " of your " + multiCockDescriptLight() + " shrink smaller, the flesh vanishing into your groin.");
				}
			}
			if (temp2 <= -3) {
				if (cocks.length == 1) outputText("A large portion of your " + multiCockDescriptLight() + "'s length shrinks and vanishes.");
				if (cocks.length > 1) {
					if (ncocks == cocks.length) outputText("A large portion of your " + multiCockDescriptLight() + " recedes towards your groin, receding rapidly in length.");
					if (ncocks == 1) outputText("A single member of your " + multiCockDescriptLight() + " vanishes into your groin, receding rapidly in length.");
					if (ncocks > 1 && cocks.length > ncocks) outputText("Your " + multiCockDescriptLight() + " tingles as " + num2Text(ncocks) + " of your members vanish into your groin, receding rapidly in length.");
				}
			}
		}

		public  killCocks(deadCock: number): void
		{
			//Count removal for text bits
		var  removed: number = 0;
		var  temp: number;
			//Holds cock index
		var  storedCock: number = 0;
			//Less than 0 = PURGE ALL
			if (deadCock < 0) {
				deadCock = cocks.length;
			}
			//Double loop - outermost counts down cocks to remove, innermost counts down
			while (deadCock > 0) {
				//Find shortest cock and prune it
				temp = cocks.length;
				while (temp > 0) {
					temp--;
					//If anything is out of bounds set to 0.
					if (storedCock > cocks.length - 1) storedCock = 0;
					//If temp index is shorter than stored index, store temp to stored index.
					if (cocks[temp].cockLength <= cocks[storedCock].cockLength) storedCock = temp;
				}
				//Smallest cock should be selected, now remove it!
				removeCock(storedCock, 1);
				removed++;
				deadCock--;
				if (cocks.length == 0) deadCock = 0;
			}
			//Texts
			if (removed == 1) {
				if (cocks.length == 0) {
					outputText("<b>Your manhood shrinks into your body, disappearing completely.</b>");
					if (hasStatusEffect(StatusEffects.Infested)) outputText("  Like rats fleeing a sinking ship, a stream of worms squirts free from your withering member, slithering away.");
				}
				if (cocks.length == 1) {
					outputText("<b>Your smallest penis disappears, shrinking into your body and leaving you with just one " + cockDescript(0) + ".</b>");
				}
				if (cocks.length > 1) {
					outputText("<b>Your smallest penis disappears forever, leaving you with just your " + multiCockDescriptLight() + ".</b>");
				}
			}
			if (removed > 1) {
				if (cocks.length == 0) {
					outputText("<b>All your male endowments shrink smaller and smaller, disappearing one at a time.</b>");
					if (hasStatusEffect(StatusEffects.Infested)) outputText("  Like rats fleeing a sinking ship, a stream of worms squirts free from your withering member, slithering away.");
				}
				if (cocks.length == 1) {
					outputText("<b>You feel " + num2Text(removed) + " cocks disappear into your groin, leaving you with just your " + cockDescript(0) + ".</b>");
				}
				if (cocks.length > 1) {
					outputText("<b>You feel " + num2Text(removed) + " cocks disappear into your groin, leaving you with " + multiCockDescriptLight() + ".</b>");
				}
			}
			//remove infestation if cockless
			if (cocks.length == 0) removeStatusEffect(StatusEffects.Infested);
			if (cocks.length == 0 && balls > 0) {
				outputText("  <b>Your " + sackDescript() + " and " + ballsDescriptLight() + " shrink and disappear, vanishing into your groin.</b>");
				balls = 0;
				ballSize = 1;
			}
		}
		public  modCumMultiplier(delta: number): number
		{
			//trace("modCumMultiplier called with: " + delta);
		
			if (delta == 0) {
				//trace( "Whoops! modCumMuliplier called with 0... aborting..." );
				return delta;
			}
			else if (delta > 0) {
				//trace("and increasing");
				if (hasPerk(PerkLib.MessyOrgasms)) {
					//trace("and MessyOrgasms found");
					delta *= 1.5
				}
			}
			else if (delta < 0) {
				//trace("and decreasing");
				if (hasPerk(PerkLib.MessyOrgasms)) {
					//trace("and MessyOrgasms found");
					delta *= 0.5
				}
			}

			//trace("and modifying by " + delta);
			cumMultiplier += delta;
			return delta;
		}

		public  increaseCock(cockNum: number, lengthDelta: number): number
		{
		var  bigCock: boolean = false;
	
			if (hasPerk(PerkLib.BigCock))
				bigCock = true;

			return cocks[cockNum].growCock(lengthDelta, bigCock);
		}
		
		public  increaseEachCock(lengthDelta: number): number
		{
		var  totalGrowth: number = 0;
			
			for (var i: number = 0; i < cocks.length; i++) {
				//trace( "increaseEachCock at: " + i);
				totalGrowth += increaseCock(i as Number, lengthDelta);
			}
			
			return totalGrowth;
		}
		
		/**
		 * Attempts to put the player in heat (or deeper in heat).
		 * The player cannot go into heat if she is already pregnant or is a he.
		 * @param	output if true, output standard text
		 * @param	intensity multiplier that can increase the duration and intensity. Defaults to 1.
		 * @return true if successful
		 */
		public  goIntoHeat(output: boolean, intensity: number = 1): boolean {
			if (!hasVagina() || pregnancyIncubation != 0) {
				// No vagina or already pregnant, can't go into heat.
				return false;
			}
			
			//Already in heat, intensify further.
			if (inHeat) {
				if (output) {
					outputText("\n\nYour mind clouds as your " + vaginaDescript(0) + " moistens.  Despite already being in heat, the desire to copulate constantly grows even larger.");
				}
			const  effect:StatusEffect = statusEffectByType(StatusEffects.Heat);
				effect.value1 += 5 * intensity;
				effect.value2 += 5 * intensity;
				effect.value3 += 48 * intensity;
				game.dynStats("lib", 5 * intensity, "scale", false);
			}
			//Go into heat.  Heats v1 is bonus fertility, v2 is bonus libido, v3 is hours till it's gone
			else {
				if (output) {
					outputText("\n\nYour mind clouds as your " + vaginaDescript(0) + " moistens.  Your hands begin stroking your body from top to bottom, your sensitive skin burning with desire.  Fantasies about bending over and presenting your needy pussy to a male overwhelm you as <b>you realize you have gone into heat!</b>");
				}
				createStatusEffect(StatusEffects.Heat, 10 * intensity, 15 * intensity, 48 * intensity, 0);
				game.dynStats("lib", 15 * intensity, "scale", false);
			}
			return true;
		}
		
		// Attempts to put the player in rut (or deeper in heat).
		// Returns true if successful, false if not.
		// The player cannot go into heat if he is a she.
		// 
		// First parameter: boolean indicating if function should output standard text.
		// Second parameter: numberensity, an integer multiplier that can increase the 
		// duration and intensity. Defaults to 1.
		public  goIntoRut(output: boolean, intensity: number = 1): boolean {
			if (!hasCock()) {
				// No cocks, can't go into rut.
				return false;
			}
			
			//Has rut, intensify it!
			if (inRut) {
				if (output) {
					outputText("\n\nYour " + cockDescript(0) + " throbs and dribbles as your desire to mate intensifies.  You know that <b>you've sunken deeper into rut</b>, but all that really matters is unloading into a cum-hungry cunt.");
				}
				
				addStatusValue(StatusEffects.Rut, 1, 100 * intensity);
				addStatusValue(StatusEffects.Rut, 2, 5 * intensity);
				addStatusValue(StatusEffects.Rut, 3, 48 * intensity);
				game.dynStats("lib", 5 * intensity, "scale", false);
			}
			else {
				if (output) {
					outputText("\n\nYou stand up a bit straighter and look around, sniffing the air and searching for a mate.  Wait, what!?  It's hard to shake the thought from your head - you really could use a nice fertile hole to impregnate.  You slap your forehead and realize <b>you've gone into rut</b>!");
				}
				
				//v1 - bonus cum production
				//v2 - bonus libido
				//v3 - time remaining!
				createStatusEffect(StatusEffects.Rut, 150 * intensity, 5 * intensity, 100 * intensity, 0);
				game.dynStats("lib", 5 * intensity, "scale", false);
			}
			
			return true;
		}

		public  setFurColor(colorArray: any[], underBodyProps: Record<string, any> = undefined, doCopySkin: boolean = false, restoreUnderBody: boolean = true): void
		{
			_setSkinFurColor("fur", colorArray, underBodyProps, doCopySkin, restoreUnderBody);
		}

		public  setSkinTone(colorArray: any[], underBodyProps: Record<string, any> = undefined, doCopySkin: boolean = false, restoreUnderBody: boolean = true): void
		{
			_setSkinFurColor("skin", colorArray, underBodyProps, doCopySkin, restoreUnderBody);
		}

		protected  _setSkinFurColor(what: string, colorArray: any[], underBodyProps: Record<string, any> = undefined, doCopySkin: boolean = false, restoreUnderBody: boolean = true): void
		{
		var  choice: any = colorArray[rand(colorArray.length)];

			if (restoreUnderBody)
				underBody.restore();

			if (what == "fur")
				skin.furColor = (choice is Array) ? choice[0] : choice;
			else
				skin.tone = (choice is Array) ? choice[0] : choice;

			if (doCopySkin)
				copySkinToUnderBody();

			if (choice is Array)
				if (what == "fur")
					underBody.skin.furColor = choice[1];
				else
					underBody.skin.tone = choice[1];

			if (underBodyProps != undefined)
				underBody.setProps(underBodyProps);
		}
		
		public  set HP(value: number): void {
			super.HP = value;
			game.mainView.statsView.refreshStats(game);
		}
		public  set lust(value: number): void {
			super.lust = value;
			game.mainView.statsView.refreshStats(game);
		}
		public  set fatigue(value: number): void {
			super.fatigue = value;
			game.mainView.statsView.refreshStats(game);
		}
		
		/**
		 * Alters player's HP.
		 * @param	changeNum The amount to damage (negative) or heal (positive).
		 * @param	display Show the damage or heal taken.
		 * @return  effective delta
		 */
		public  HPChange(changeNum: number, display: boolean): number
		{
		var  before: number = HP;
			
			if (changeNum === 0) {
				return 0;
			}
			
			if (changeNum > 0) {
				if (findPerk(PerkLib.HistoryHealer) >= 0) {
					changeNum *= 1.2; //Increase by 20%!
				}
				
				if (armor.name === "skimpy nurse's outfit") {
					changeNum *= 1.1; //Increase by 10%!
				}
				
				if (HP + int(changeNum) > maxHP()) {
					if (HP >= maxHP()) {
						if (display) {
							HPChangeNotify(changeNum);
						}
						
						return HP - before;
					}
					
					if (display) {
						HPChangeNotify(changeNum);
					}
					
					restoreHP();
				}
				else
				{
					if (display) {
						HPChangeNotify(changeNum);
					}
					
					HP += int(changeNum);
					kGAMECLASS.mainView.statsView.showStatUp( 'hp' );
				}
			}
			//Negative HP
			else
			{
				if (HP + changeNum <= 0) {
					if (display) {
						HPChangeNotify(changeNum);
					}
					
					HP = 0;
					kGAMECLASS.mainView.statsView.showStatDown( 'hp' );
				}
				else {
					if (display) {
						HPChangeNotify(changeNum);
					}
					
					HP += changeNum;
					kGAMECLASS.mainView.statsView.showStatDown( 'hp' );
				}
			}
			
			dynStats("lust", 0, "scale", false); //Workaround to showing the arrow.
			kGAMECLASS.output.statScreenRefresh();
			return HP - before;
		}

		public  HPChangeNotify(changeNum: number): void {
			if (changeNum === 0) {
				if (HP >= maxHP()) {
					outputText("You're as healthy as you can be.\n");
				}
			} else if (changeNum > 0) {
				if (HP >= maxHP()) {
					outputText("Your HP maxes out at " + maxHP() + ".\n");
				} else {
					outputText("You gain <b><font color=\"#008000\">" + int(changeNum) + "</font></b> HP.\n");
				}
			} else {
				if (HP <= 0) {
					outputText("You take <b><font color=\"#800000\">" + int(changeNum*-1) + "</font></b> damage, dropping your HP to 0.\n");
				} else {
					outputText("You take <b><font color=\"#800000\">" + int(changeNum*-1) + "</font></b> damage.\n");
				}
			}
		}
		
		public  serialize(relativeRootObject: any): void 
		{
			super.serialize(relativeRootObject);
			
			relativeRootObject.itemSlots = SerializationUtils.serializeVector(this.itemSlots as Vector.<*>);
		}
		
		public  deserialize(relativeRootObject: any): void 
		{
			super.deserialize(relativeRootObject);
			
			// reset vagina to human if it is an unsupported type
			if (hasVagina() && vaginaType() !== Vagina.BLACK_SAND_TRAP && vaginaType() !== Vagina.HUMAN) {
				LOGGER.warn("Player vagina type is {0}, resetting to human {1}.", vaginaType(), Vagina.HUMAN);
				vaginaType(Vagina.HUMAN);
			}
			
			// Force the creation of the default breast row onto the player if it's no longer present
			if (breastRows.length === 0) {
				LOGGER.warn("Player has no breast row, this is an invalid state. Creating breast row...");
				createBreastRow();
			}
			
			this.itemSlots.length = 0;
			if (this.itemSlots as Vector.<*> != undefined && relativeRootObject.itemSlots != undefined) {
				SerializationUtils.deserializeVector(this.itemSlots as Vector.<*>, relativeRootObject.itemSlots, ItemSlot);
			}
			else { //Messy workaround.

			}
		}
		
		public  upgradeSerializationVersion(relativeRootObject: any, serializedDataVersion: number): void 
		{
			switch (serializedDataVersion) {
				case 0:
					upgradeLegacyItemSlots(relativeRootObject);
					
				default:
					/*
					 * The default block is left empty intentionally,
					 * this switch case operates by using fall through behavior.
					 */
			}
		}
		
		private  upgradeLegacyItemSlots(relativeRootObject: any): void
		{
			LOGGER.info("Upgrading legacy item slots...");
			LOGGER.info("Checking if save contains new data structure...");
			
			// Fix issues that were created by version 1 serialization code
			if (relativeRootObject.itemSlots !== undefined) {
				LOGGER.warn("New itemslot data structure present, aborting upgrade!");
				return;
			} else {
				LOGGER.info("New itemslot data structure not present, performing upgrade...");
			}
			
		var  slots:Vector.<ItemSlot> = new Vector.<classes.ItemSlot>();
			
		var  slotname: string = "itemSlot";
			
			for (var i: number = 1; i < 11; i++) {
			var  slot: string = slotname + i;
				
				slots.push(legacyItemSlotFromSave(relativeRootObject, slot));
			}
			
			relativeRootObject.itemSlots = SerializationUtils.serializeVector(slots as Vector.<*>);
			LOGGER.info("Finished upgrading legacy item slots!");
		}
		
		private  legacyItemSlotFromSave(relativeRootObject: any, slotName: string):ItemSlot
		{
		var  itemSlot:ItemSlot = new ItemSlot();
			
			if (relativeRootObject[slotName] !== undefined) {
				SerializationUtils.deserialize(relativeRootObject[slotName], itemSlot);
				delete relativeRootObject[slotName];
			}
			
			return itemSlot;
		}
		
		public  currentSerializationVerison(): number 
		{
			return SERIALIZATION_VERSION;
		}
	}

