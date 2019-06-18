/**
 * Created by aimozg on 10.01.14.
 */

	export class DragonShellShield extends Shield {
		
		public  DragonShellShield(upgraded: boolean) {
		var  id: string = upgraded ? "RDgnShl" : "DrgnShl";
		var  sname: string = upgraded ? "RDgnShl" : "DrgnShl";
		var  ename: string = upgraded ? "runed dragon-shell shield" : "dragon-shell shield";
		var  lname: string = upgraded ? "a dragon-shell shield with rune markings" : "a dragon-shell shield";
		var  tier: number = upgraded ? 1 : 0;
			this.weightCategory = Shield.WEIGHT_MEDIUM;
			super(id, sname, ename, lname, 14, 1500, "", Shield.PERK_ABSORPTION);
		}
		
		public  get shortName(): string { //Don't display +1 for runed shield.
			return _shortName;
		}
		
		public  get description(): string {
		var  desc: string = game.flags[kFLAGS.EMBER_HATCHED] > 0 ? "A durable shield that has been forged from the dragon eggshell Ember gave you for maxing out " + game.emberScene.emberMF("his", "her") + " affection." : "A durable shield that has been forged from the remains of the dragon egg you found in the swamp.";
			desc += " Absorbs any fluid attacks you can catch, rendering them useless.";
			if (tier > 0) desc += " This shield has since been enhanced and now intricate glowing runes surround the edges in addition to more imposing spiky appearance.";
			//Type
			desc += "\n\nType: Shield";
			//Block Rating
			desc += "\nBlock: " + String(block);
			//Value
			desc += "\nBase value: " + String(value);
			return desc;
		}
		
		public  useText(): void { //Produces any text seen when equipping the armor normally
			if (game.flags[kFLAGS.TIMES_EQUIPPED_EMBER_SHIELD] == 0) {
				clearOutput();
				outputText("Turning the sturdy shield over in inspection, you satisfy yourself as to its craftsmanship and adjust the straps to fit your arm snugly.  You try a few practice swings, but find yourself overbalancing at each one due to the deceptive lightness of the material.  Eventually, though, you pick up the knack of putting enough weight behind it to speed it through the air while thrusting a leg forward to stabilize yourself, and try bashing a nearby rock with it.  You smile with glee as ");
				if (game.player.str < 80) outputText("bits and pieces from the surface of the");
				else outputText("huge shards of the shattered");
				outputText(" rock are sent flying in all directions.");
				outputText("\n\nAfter a few more practice bashes and shifts to acquaint yourself with its weight, you think you're ready to try facing an enemy with your new protection.  One last thing... taking off the shield and turning it straps-down, you spit onto the surface.  Satisfyingly, the liquid disappears into the shell as soon as it touches.");
			}
			else {
				outputText("You equip " + this.longName + ".  ");
			}
			game.flags[kFLAGS.TIMES_EQUIPPED_EMBER_SHIELD]++;
		}
		
	}

