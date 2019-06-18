	
	/**
	 * Body lotions, courtesy of Foxxling.
	 * @author Kitteh6660
	 */
	export class BodyLotion extends Consumable 
	{
		private  _adj: string;
		
		public  BodyLotion(id: string, adj: string, longAdj: string) 
		{
			this._adj = adj.toLowerCase();
		var  shortName: string = adj + " Ltn";
		var  longName: string = "a flask of " + this._adj + " lotion"
		var  value: number = ConsumableLib.DEFAULT_VALUE;
		var  description: string = "A small wooden flask filled with a " + longAdj + " . A label across the front says, \"" + adj + " Lotion.\""
			super(id, shortName, longName, value, description);
		}
		
		private  liquidDesc(): string {
		var  phrase: string = "";
			switch(_adj) {
				case "smooth": phrase = randomChoice(["smooth liquid", "thick cream"]); break;
				case "rough":  phrase = randomChoice(["abrasive goop", "rough textured goop"]); break;
				case "sexy":   phrase = randomChoice(["smooth liquid", "attractive cream", "beautiful cream"]); break;
				case "clear":  phrase = randomChoice(["smooth liquid", "thick cream"]); break;
				default:       phrase = "cream"; //Failsafe
			}
			return phrase; 
		}
		
		public  useItem(): boolean {
			if (!game.player.hasUnderBody()) {
				lotionSkin();
				return true;
			}

			clearOutput();
			outputText("The skin on your underBody is different from the rest. Where do you want to apply the " + _adj + " body lotion?");

			kGAMECLASS.output.menu();
			kGAMECLASS.output.addButton(0, "Body", lotionSkin);
			kGAMECLASS.output.addButton(1, "Underbody", lotionUnderBodySkin);
			kGAMECLASS.output.addButton(4, "Nevermind", lotionCancel);
			return true;
		}

		public  lotionSkin(): void {
			if (game.player.skin.adj == _adj) {
				outputText("You " + game.player.clothedOrNaked("take a second to disrobe before uncorking the flask of lotion and rubbing", "uncork the flask of lotion and rub") + " the " + liquidDesc() + " across your body. Once you’ve finished you feel reinvigorated. ");
				player.HPChange(10, true);
			}
			else {
				if ([Skin.GOO, Skin.DRAGON_SCALES].indexOf(game.player.skin.type) == -1) { //If skin is goo or dragon scales, don't change.
					game.player.skin.adj = _adj != "clear" ? _adj : "";
				}
				switch (game.player.skin.type) {
					case Skin.PLAIN: //Plain
						outputText("You " + game.player.clothedOrNaked("take a second to disrobe before uncorking the flask of lotion and rubbing", "uncork the flask of lotion and rub") + " the " + liquidDesc() + " across your body. As you rub the mixture into your arms and [chest], your whole body begins to tingle pleasantly. ");
						switch(_adj) {
							case "smooth":
								outputText("Soon your skin is smoother but in a natural healthy way.");
								break;
							case "rough":
								outputText("Soon your skin is rougher as if you’ve just finished a long day’s work.");
								break;
							case "sexy":
								outputText("Soon your skin is so sexy you find it hard to keep your hands off yourself.");
								break;
							case "clear":
								outputText("Soon the natural beauty of your [skinFurScales] is revealed without anything extra or unnecessary.");
								break;
							default: //Failsafe
								outputText("<b>This text should not happen. Please let Kitteh6660 know.</b>");
						}
						break;
					case Skin.FUR: //Fur
						outputText("" + game.player.clothedOrNaked("Once you’ve disrobed you take the lotion and", "You take the lotion and") + " begin massaging it into your skin despite yourself being covered with fur. It takes little effort but once you’ve finished... nothing happens. A few moments pass and then your skin begins to tingle. ");
						switch(_adj) {
							case "smooth":
								outputText("Soon you part your fur to reveal smooth skin that still appears natural.");
								break;
							case "rough":
								outputText("Soon you part your fur to reveal rough skin that still appears natural.");
								break;
							case "sexy":
								outputText("Soon you part your fur to reveal sexy skin that makes you want to kiss yourself.");
								break;
							case "clear":
								outputText("Soon you part your fur to reveal the natural beauty of your skin.");
								break;
							default: //Failsafe
								outputText("<b>This text should not happen. Please let Kitteh6660 know.</b>");
						}
						break;
					case Skin.LIZARD_SCALES: //Scales
					case Skin.FISH_SCALES: //Scales
						outputText("You " + game.player.clothedOrNaked("take a second to disrobe before uncorking the flask of lotion and rubbing", "uncork the flask of lotion and rub") + " the " + liquidDesc() + " across your body. As you rub the mixture into your arms and [chest], your whole body begins to tingle pleasantly.");
						switch(_adj) {
							case "smooth":
								outputText("Soon your scales are smoother but in a natural healthy way.");
								break;
							case "rough":
								outputText("Soon your scales are rougher as if you’ve just finished a long day’s work.");
								break;
							case "sexy":
								outputText("Soon your scales are so sexy you find it hard to keep your hands off yourself.");
								break;
							case "clear":
								outputText("Soon the natural beauty of your [skinFurScales] is revealed without anything extra or unnecessary.");
								break;
							default: //Failsafe
								outputText("<b>This text should not happen. Please let Kitteh6660 know.</b>");
						}
						break;
					case Skin.GOO: //Goo
						outputText("You take the lotion and pour the " + liquidDesc() + " into yourself. The concoction dissolves, leaving your gooey epidermis unchanged. As a matter of fact nothing happens at all.");
						//No changes due to gooey skin.
						break;
					case Skin.DRAGON_SCALES: //Dragon scales
						outputText("You take the lotion and pour the " + liquidDesc() + " on your scales. The concoction dissolves, leaving your dragon scales unchanged. As a matter of fact nothing happens at all.");
						//No changes due to dragon scales.
						break;
					default:
						outputText("You " + game.player.clothedOrNaked("take a second to disrobe before uncorking the bottle of oil and rubbing", "uncork the bottle of oil and rub") + " the smooth liquid across your body. Even before you’ve covered your arms and [chest] your skin begins to tingle pleasantly all over. After your skin darkens a little, it begins to change until you have " + _adj + " skin.");
				}
			}
			game.inventory.itemGoNext();
		}

		public  lotionUnderBodySkin(): void {
			if (game.player.underBody.skin.adj == _adj) {
				outputText("You " + game.player.clothedOrNaked("take a second to disrobe before uncorking the flask of lotion and rubbing", "uncork the flask of lotion and rub") + " the " + liquidDesc() + " across your underbody. Once you’ve finished you feel reinvigorated. ");
				player.HPChange(10, true);
			}
			else {
				if (game.player.underBody.skin.type != Skin.GOO) { //If skin is goo, don't change.
					game.player.underBody.skin.adj = _adj != "clear" ? _adj : "";
				}
				switch (game.player.underBody.skin.type) {
					case Skin.PLAIN: //Plain
						outputText("You " + game.player.clothedOrNaked("take a second to disrobe before uncorking the flask of lotion and rubbing", "uncork the flask of lotion and rub") + " the " + liquidDesc() + " across your underbody. As you rub the mixture onto your [chest], it begins to tingle pleasantly. ");
						switch(_adj) {
							case "smooth":
								outputText("Soon your skin on your underbody is smoother but in a natural healthy way.");
								break;
							case "rough":
								outputText("Soon your skin on your underbody is rougher as if you’ve just finished a long day’s work.");
								break;
							case "sexy":
								outputText("Soon your skin on your underbody is so sexy you find it hard to keep your hands off yourself.");
								break;
							case "clear":
								outputText("Soon the natural beauty of your [underBody.skinFurScales] is revealed without anything extra or unnecessary.");
								break;
							default: //Failsafe
								outputText("<b>This text should not happen. Please let Kitteh6660 know.</b>");
						}
						break;
					case Skin.FUR: //Fur
						outputText("" + game.player.clothedOrNaked("Once you’ve disrobed you take the lotion and", "You take the lotion and") + " begin massaging it into your skin despite yourself being covered with fur. It takes little effort but once you’ve finished... nothing happens. A few moments pass and then your skin begins to tingle. ");
						switch(_adj) {
							case "smooth":
								outputText("Soon you part your fur on your underbody to reveal smooth skin that still appears natural.");
								break;
							case "rough":
								outputText("Soon you part your fur on your underbody to reveal rough skin that still appears natural.");
								break;
							case "sexy":
								outputText("Soon you part your fur on your underbody to reveal sexy skin that makes you want to kiss yourself.");
								break;
							case "clear":
								outputText("Soon you part your fur on your underbody to reveal the natural beauty of your skin.");
								break;
							default: //Failsafe
								outputText("<b>This text should not happen. Please let Kitteh6660 know.</b>");
						}
						break;
					case Skin.LIZARD_SCALES: //Scales
					case Skin.DRAGON_SCALES: //Dragon scales
					case Skin.FISH_SCALES: //Scales
						outputText("You " + game.player.clothedOrNaked("take a second to disrobe before uncorking the flask of lotion and rubbing", "uncork the flask of lotion and rub") + " the " + liquidDesc() + " across your underbody. As you rub the mixture into your arms and [chest], your whole body begins to tingle pleasantly.");
						switch(_adj) {
							case "smooth":
								outputText("Soon your scales on your underbody are smoother but in a natural healthy way.");
								break;
							case "rough":
								outputText("Soon your scales on your underbody are rougher as if you’ve just finished a long day’s work.");
								break;
							case "sexy":
								outputText("Soon your scales on your underbody are so sexy you find it hard to keep your hands off yourself.");
								break;
							case "clear":
								outputText("Soon the natural beauty of your [underBody.skinFurScales] is revealed without anything extra or unnecessary.");
								break;
							default: //Failsafe
								outputText("<b>This text should not happen. Please let Kitteh6660 know.</b>");
						}
						break;
					case Skin.GOO: //Goo
						outputText("You take the lotion and pour the " + liquidDesc() + " into yourself. The concoction dissolves, leaving your gooey epidermis unchanged. As a matter of fact nothing happens at all.");
						//No changes due to gooey skin.
						break;
					default:
						outputText("You " + game.player.clothedOrNaked("take a second to disrobe before uncorking the bottle of oil and rubbing", "uncork the bottle of oil and rub") + " the smooth liquid across your body. Even before you’ve covered your arms and [chest] your skin begins to tingle pleasantly all over. After your skin darkens a little, it begins to change until you have " + _adj + " skin on your underbody.");
				}
			}
			game.inventory.itemGoNext();
		}

		private  lotionCancel(): void {
			clearOutput();
			outputText("You put the body lotion away.\n\n");
			game.inventory.returnItemToInventory(this);
		}
	}

