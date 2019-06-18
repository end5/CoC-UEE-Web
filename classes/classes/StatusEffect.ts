
	export class StatusEffect extends Utils
	{
		//constructor
		public  StatusEffect(stype:StatusEffectType)
		{
			this._stype = stype;
		}
		//data
		private  _stype:StatusEffectType;
		private  _host:Creature;
		public  value1: number = 0;
		public  value2: number = 0;
		public  value3: number = 0;
		public  value4: number = 0;
		public  dataStore: Record<string, any> = undefined;
		//MEMBER FUNCTIONS
		public  get stype():StatusEffectType
		{
			return _stype;
		}
		public  get host():Creature
		{
			return _host;
		}
		/**
		 * Returns undefined if host is not a Player
		 */
		public  get playerHost():Player {
			return _host as Player;
		}

		public  toString(): string
		{
			return "["+_stype+","+value1+","+value2+","+value3+","+value4+"]";
		}
		// ==============================
		// EVENTS - to be overridden in subclasses
		// ===============================

		/**
		 * Called when the effect is applied to the creature, after adding to its list of effects.
		 */
		public  onAttach(): void {
			// do nothing
		}
		/**
		 * Called when the effect is removed from the creature, after removing from its list of effects.
		 */
		public  onRemove(): void {
			// do nothing
		}
		/**
		 * Called after combat in player.clearStatuses()
		 */
		public  onCombatEnd(): void {
			// do nothing
		}
		/**
		 * Called during combat in combatStatusesUpdate() for player, then for monster
		 */
		public  onCombatRound(): void {
			// do nothing
		}
		public  remove(/*fireEvent: boolean = true*/): void {
			if (_host == undefined) return;
			_host.removeStatusEffectInstance(this/*,fireEvent*/);
			_host = undefined;
		}
		public  removedFromHostList(fireEvent: boolean): void {
			if (fireEvent) onRemove();
			_host = undefined;
		}
		public  addedToHostList(host:Creature,fireEvent: boolean): void {
			_host = host;
			if (fireEvent) onAttach();
		}
		public  attach(host:Creature/*,fireEvent: boolean = true*/): void {
			if (_host == host) return;
			if (_host != undefined) remove();
			_host = host;
			host.addStatusEffect(this/*,fireEvent*/);
		}

		protected static  register(id: string,statusEffectClass:Class,arity: number=0):StatusEffectType {
			return new StatusEffectType(id,statusEffectClass || StatusEffect,arity);
		}
		protected static  get game():CoC {
			return kGAMECLASS;
		}
	}

