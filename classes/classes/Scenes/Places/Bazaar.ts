
	export class Bazaar extends BaseContent 
	{
		// JOEY_OFFERED_MILKER: number = 466;
		// OWN_MAIDEN_BIKINI: number = 770;
		// COUNTDOWN_TO_NIGHT_RAPE: number = 872;
		// SOCK_COUNTER: number = 895;
		// SOCK_HOLDING: number = 896;
		// FOUND_SOCKS: number = 897;
		// SOCKS_BOUGHT: number = 898;
		// GILDED_JERKED: number = 899;
		//Set Up With The Travelling, Tainted Bazaar
		public  Bazaar(){}
		
		private  rng:RandomNumberGenerator = new ActionScriptRNG();

		public  blackCock:BlackCock = new BlackCock();
		public  benoit:Benoit = new Benoit();
		public  cinnabar:Cinnabar = new Cinnabar();
		public  fapArena:FapArena = new FapArena();
		public  lilium:Lilium = new Lilium();
		public  roxanne:Roxanne = new Roxanne(rng);
		
		//Declare shops
		public  chillySmith:ChillySmith = new ChillySmith();
		public  gretasGarments:GretasGarments = new GretasGarments();
		public  slipperySqueeze:SlipperySqueeze = new SlipperySqueeze();

		//[Find Travelling Bazaar]
		public  findBazaar(): void {
			clearOutput();
			if (flags[kFLAGS.BAZAAR_ENCOUNTERED] == 0) {
				flags[kFLAGS.BAZAAR_ENCOUNTERED]++;
				outputText("Warm, earthy breezes drift by as you explore the wind-blown grasses of the plains. Though it seems you can see for miles, with the grasses subtly shifting between a few feet and over a dozen feet tall, it's impossible to tell what you'll stumble into next. You trust your ears and your nose as much as your oft-blocked vision at this point, and before long you catch a whiff of blackened meat and aromatic spices. There's some kind of camp not far away!\n\n");
				
				outputText("You raise your " + player.weaponName + " and cautiously creep through the towering vegetation, trying not to give your position away until you've ascertained just what type of people inhabit this camp. Bright light flickers through the grass in front of you, and you part it to peek from between the blowing stalks. There's a ring of brightly colored wagons set up here, with a tall, picketed fence erected around them. Smoke curls up from the camp's center, twisting in the air like a viper in the grass. Each of the wagons appears to be expanded, deployed into a small, self-contained structure. Clearly this is some kind of traveling caravan or bazaar.\n\n");
				
				outputText("There's only one gap in the fence – a narrow gate watched by a ten-foot tall man with red skin and a pale, almost sky-blue turban. He has a pair of scimitars that hang from a simple, leather belt. The crimson-skinned man's clothing is a simple tunic and loose-fitting pants, but neither can conceal his obviously well-muscled frame. He looks alert and attentive – a good sign since demons would have little need to post guards.");
			}
			else {
				outputText("Once again you smell a campfire through the tall grass, and as you close the distance you hear the familiar sounds of the traveling bazaar. You peek through the weeds and behold the caravan's gate-keeper - a red-skinned, muscular giant of a man.");
			}
			outputText("\n\nDo you approach?");
			//[YES] [NOOOO]
			doYesNo(approachBazaarGuard,camp.returnToCampUseOneHour);
		}



		//[FUCK YES I WILL PUT IT IN YOUR BIZARRE ANUS]
		private  approachBazaarGuard(): void {
			clearOutput();
			outputText("You step from concealment and walk up to the strange man, calling out in greeting. He folds his arms across his chest and looks you up and down, peering at you with intense, black eyes. They aren't solid onyx, but his irises are just as dark as the seemingly bottomless depths of his pupils. His appraising gaze watches you, unblinking as second after second ticks by. Just when you start to wonder if he speaks your language, he interrupts you by saying, ");
			if (!player.isCorruptEnough(33)) {
				outputText("\"<i>Leave at once. You are not yet ready for the wonders of the Bazaar.</i>\"");
				menu();
				addButton(0, "FIGHT!", initiateFightGuard).hint("Fight the guard to forcibly gain entry into the bazaar.");
			} else {
				outputText("\"<i>Welcome to the Bizarre Bazaar. Enter, but be mindful of your actions within.</i>\"");
				menu();
				addButton(0, "Enter", enterTheBazaar).hint("Enter the Bizarre Bazaar and take a good look around.");
			}
			addButton(4, "Leave", camp.returnToCampUseOneHour);
		}

		public  enterTheBazaar(): void {
			if (getGame().time.hours == 19 || getGame().time.hours == 20) {
				flags[kFLAGS.COUNTDOWN_TO_NIGHT_RAPE]++;
				if (flags[kFLAGS.COUNTDOWN_TO_NIGHT_RAPE] % 4 == 0 && (player.gender == 1 || (player.gender == 3 && player.mf("m", "f") == "m"))) {
					nightBazaarButtfuck();
					return;
				}
			}
			enterTheBazaarAndMenu();
		}

		//Pure? You'll have to fight!
		public  initiateFightGuard(): void {
			clearOutput();
			outputText("You ready your " + player.weaponName + " and assume a combat stance! He grabs his dual scimitars! It's a fight!");
			startCombat(new BazaarGatekeeper());
		}	

		public  winAgainstGuard(): void {
			clearOutput();
			outputText("With the gatekeeper defeated, you walk right past the unconscious guard and enter...");
			combat.cleanupAfterCombat(enterTheBazaarAndMenu);
		}

		//[Enter]
		public  enterTheBazaarAndMenu(demons: boolean = true): void {
			clearOutput();
			spriteSelect(undefined);
			outputText(images.showImage("location-bazaar"));
			//Make sure flags to allow entrance is set.
			if (flags[kFLAGS.BAZAAR_ENTERED] == 0) flags[kFLAGS.BAZAAR_ENTERED] = 1;
			outputText("You breeze past the crimson guard and enter the interior of the Bizarre Bazaar. The ground is hard-packed, trampled as if walked over by hundreds of hooves, paws, and feet. A massive bonfire rages in the center of the clearing, crackling and popping as it consumes its fuel gluttonously. Surrounding the blazing behemoth are tiny, wheeled food-carts with vendors hawking everything from sausage to something called a 'marshmallow'. Huge wagons ring the clearing, many set up to display exotic wares or services. You can see everything from dancing centaurs to demons browsing the wares, but it seems an uneasy truce of sorts reigns here. Then again, maybe the demons have just not had the chance to openly attack this place yet.");
			outputText("\n\nOne of the wagons proudly proclaims itself to be \"Greta's Garments,\" though both 'G's are emphasized with cute, stylized devil horns, and the 'S' is shaped in the form of a spaded, demonic tail. Obviously it must some kind of clothing shop.");
			chillySmith.smithButton();
			roxanne.RoxanneAppearance();
			benoit.setBenoitShop();
			fapArena.fapAppearance();
			blackCock.blackCockDescription();
			//Set menu. The top row is always available.
			menu();
			addButton(0, "Shops", shopMenu).hint("Browse the shops and access their services.");
			addButton(1, (flags[kFLAGS.FAP_ARENA_RULES_EXPLAINED] > 0 ? "Fap Arena" : "Tent"), fapArena.fapArenaGOOOO).hint(flags[kFLAGS.FAP_ARENA_RULES_EXPLAINED] > 0 ? "Visit the tent that is also known as 'Fap Arena' to many of the well-hung guys." : "Investigate the large tent. What could it even be?");
			addButton(2, "Food Tent", blackCock.enterTheBlackCock).hint("The incredible smell seems to come from that tent.", "The Black Cock");
			if (flags[kFLAGS.PRISON_ENABLED] == true) {
				addButton(4, "Back Alley", investigateBackAlley).hint("That back alley looks suspicious. Do you dare investigate?");
			} else {
				addButton(4, "Back Alley", investigateBackAlleyNoPrison).hint("That back alley looks suspicious. Do you dare investigate?");
			}
			//Cinnabar
			if (getGame().time.hours >= 15 && getGame().time.hours <= 20) addButton(5, (flags[kFLAGS.CINNABAR_NUMBER_ENCOUNTERS] > 0 ? "Cinnabar" : "Rat"), cinnabar.cinnabarAppearance(false));
			//Griping Demons
			if (flags[kFLAGS.BAZAAR_DEMONS_LISTENED_IN] == 0 && rand(4) == 0 && demons) {
				overHearDemonsAboutSyrena();
				return;
			}
			if ((flags[kFLAGS.BAZAAR_DEMONS_LISTENED_IN] == 1 || flags[kFLAGS.BAZAAR_DEMONS_LISTENED_IN] == 2) && demons && rand(10) == 0) {
				//[Repeat Variant]
				outputText("\n\n<b>The familiar sounds of the two griping demons can be heard nearby. Do you listen in again?</b>");
				addButton(6, "GripingDemons", overHearDemonsAboutSyrena).hint("Overhear the conversation of the two griping demons.", "Griping Demons");
			}
			//Lilium
			if (lilium.LiliumText(false) != undefined) {
				addButton(7, (flags[kFLAGS.LILIUM_TIMES_TALKED] > 0 ? "Lilium" : "Demon"), lilium.LiliumText(false));
			}
			//Roxanne
			addButton(8, (flags[kFLAGS.ROXANNE_MET] > 0 ? "Roxanne" : "Lizans"), (flags[kFLAGS.ROXANNE_MET] > 0 ? roxanne.RoxanneChooseApproachOrRepeat : roxanne.Roxanne1stApproach));
			//Bimbo Niamh
			if (flags[kFLAGS.NIAMH_STATUS] > 0 && flags[kFLAGS.NIAMH_MOVED_OUT_COUNTER] == -1) {
				if (flags[kFLAGS.NIAMH_STATUS] == 2) outputText("\n\nThe sounds of voices raised in song and girlish laughter makes it obvious where Niamh is holding a perpetual party.");
				addButton(9, "Niamh", getGame().telAdre.niamh.bazaarNiamh);
			}
			addButton(14, "Leave", camp.returnToCampUseOneHour);
			if (flags[kFLAGS.GRIMDARK_MODE] > 0) addButton(14, "Leave", leaveBazaarGrimdark);
		}

				public  leaveBazaarGrimdark(): void {
					inRoomedDungeonResume = getGame().dungeons.resumeFromFight;
					getGame().dungeons._currentRoom = "plains";
					getGame().dungeons.move(getGame().dungeons._currentRoom);
				}

		private  shopMenu(): void {
			menu();
			benoit.setBenoitShop(true);
			addButton(1, "G. Garments", gretasGarments.gretasGarments).hint(flags[kFLAGS.FOUND_SOCKS] > 0 ? "Visit 'Greta's Garments' run by the succubus which is a shop stocked with cock-socks of varying colours." : "From the look of the sign, it's probably a clothing shop. Investigate the shop?", "Greta's Garments");
			addButton(2, "S. Squeeze", slipperySqueeze.theSlipperySqueeze).hint(flags[kFLAGS.BAZAAR_SLIPPERY_SQUEEZE_VISITED] > 0 ? "Visit 'The Slippery Squeeze' which is a massage parlour run by Joey the bunny." : "If the sign is of any indication, it's probably a massage parlour. Investigate the parlour?", "Slippery Squeeze");
			chillySmith.smithButton(true);
			addButton(4, "Back", enterTheBazaarAndMenu);
		}

		private  overHearDemonsAboutSyrena(): void {
			clearOutput();
			if (flags[kFLAGS.BAZAAR_DEMONS_LISTENED_IN] == 0) {
				outputText("A whisper of conversation catches your ear while you're wandering the bazaar, and overcome by curiosity, you veer towards it.\n\n");
				outputText("As you're closing in on the voices, the dialogue grows clear enough to understand.\n\n");
				outputText("\"<i>-old him if he doesn't finish this week's experiments, she's going to drop him into a submission tank instead of the champion!</i>\" exclaims the first voice, sounding quite feminine.\n\n");
				outputText("A baritone response rings out, \"<i>You're shitting me! Syrena's off her fucking rocker if she thinks Lethice will let her turn another of our researchers into a gibbering slut. We've got enough of those.</i>\"\n\n");
				outputText("\"<i>Well, what do you expect? She's more shark than demon... I'm amazed she gets anything done at all, with as much time as she spends fucking me. Don't get me wrong, that double-thick dick makes my cunny fuckin' drool, ya know? But, at the same time, if I could just get some more information on her research, I could have her job. Then she'd be serving MY desires... yum,</i>\" trails off the sultry, seductive tone.\n\n");
				outputText("The male laughs and says, \"<i>You belong underneath a fat dick, bitch. Look at you, you've got strings of lube trailing on the ground behind you. You're too busy slutting it up to accomplish anything. I'm thinking I had better head back to the lab, though. I don't want to wind up looking like one of the escaped factory rejects - gotta keep this perfect bod, ya know?</i>\"\n\n");
				outputText("You get a good look at the two when the crowd parts, and wow, that incubus is right. He's a curly-haired, chiseled Adonis of a man, with a bulge as over-the-top of the rest of him straining at his fashionable pants. The demon fiddles with his collar, popping it up, and he turns to leave. The other commiserating devil is a busty succubus in a lab coat... nothing else. She's even wetter than her companion's words would indicate, painting a thick trail of slippery girl-slime in her wake as she moves. The succubus' nipples are like two hard bullets, soaking two glorious wet patches into her coat as she argues back.\n\n");
				outputText("\"<i>S-shut up. That cunt tested some of her prototype compounds on me, remember? That stuff turned my pussy into an insatiable furnace. If I can get some free time... I'll... I'll... oh screw it, let's go rent a room and fuck a few times before we go back. I'll want to be thinking clearly when I face her. Syrena won't get to gloat about me jumping on her fat... juicy... mmm... cock... this time!</i>\" The succubus takes the incubus' hand and drags him away in a hurry.\n\n");
				outputText("Well, that explains a lot. The demons seem to have an active research department, though the one called Syrena does not seem to please her underlings very much. Then again, you doubt any demonic servants are pleased with their bosses. You can't wait to put a stop to their labors, but for now, there's nothing to do but use the bazaar or go home.\n\n");
			}
			//[Listen in repeat]
			else if (flags[kFLAGS.BAZAAR_DEMONS_LISTENED_IN] == 1) {
				outputText("Just as before, you spot the collar-popping incubus and his lab coat-clad lover complaining about their boss.\n\n");
				outputText("\"<i>-still sore! I can't believe she did that to me!</i>\" groans the male.\n\n");
				outputText("Smiling cruelly, the slick-pussied succubus says, \"<i>You deserved it. Honestly, you turned in cum-stained reports to your boss, and you're surprised that she took your ass for a ride as punishment? If you ask me, you planned all this. Who do you think had to clean up the huge mess you left on the floor?</i>\"\n\n");
				outputText("For once, the incubus seems speechless. He mutters, \"<i>Well, I didn't plan it. I-I was just having fun with one of the new slaves - for inspiration - while I finished up the paperwork.</i>\" He looks over and punches the leering female's arm. \"<i>Besides, I thought you liked cleaning up my cum? I've never seen you complain before.</i>\"\n\n");
				outputText("The succubus laughs and slaps his ass as she answers, \"<i>Don't worry, you taste great... just not as good as the boss. I dunno what concoction she made that did it, but her spunk is heavenly. I could just... mmm... swallow that delicious cream all day long. Do ya think she's part minotaur?</i>\"\n\n");
				outputText("\"<i>Babe, you're sliming everywhere again. Why don't we go blow off some steam?</i>\" The two horny demons run off and disappear.\n\n");
			}
			//[Listen in Repeat 2]  
			else if (flags[kFLAGS.BAZAAR_DEMONS_LISTENED_IN] >= 2) {
				outputText("This time, the two chatty demons are seated near the fire, and the reason for their altered location seems clear. The succubus' belly is gravid to an unusual degree, utterly packed with some kind of corrupted offspring. She's rubbing both her hands over the stretched skin-dome and moaning in discomfort, the packed womb squirming beneath her touches.\n\n");
				outputText("Meanwhile, the male incubus is knocking back a beer, grumbling, \"<i>Could you take it down a notch? It isn't like this is the first time you've had to lug around a load of imps - don't be so melodramatic.</i>\"\n\n");
				outputText("His pregnant companion growls and tugs at her undersized labcoat, failing to conceal the blueberry-colored bulge of her belly from him as she retorts, \"<i>You didn't have to get all these fucked into you, now did you? Hell, she even shot me up with fertility-plus first! It feels like there's two dozen of the little bastards packed in there! I figure in another day or two I won't even be able to walk.</i>\"\n\n");
				outputText("\"<i>So does that mean you won't mind if I stop by whilst you're laid up? I mean you can't get any more pregnant with imps, and it might pass the time,</i>\" suggests the well-muscled male.\n\n");
				outputText("Smirking, the demoness retorts, \"<i>Sure, but next time you fuck up, I'm loaning Syrena some of my girly stuff to make you suffer just like this.</i>\" Her hands both point at the imp-engorged skin of her midsection for emphasis.\n\n");
				outputText("The incubus rises and taunts, \"<i>If I fucked up as often as you did, I'd be feeding the furnace in a factory somewhere or fed to the hellhounds. Come on, let's get you home before I have to roll you back.</i>\"\n\n");
				outputText("Unwilling to allow herself to be helped, the succubus staggers up and begins waddling away. The incubus keeps his distance, wearing a predatory grin.\n\n");
			}
			//enterTheBazaarAndMenu(false);
			doNext(enterTheBazaar);
			flags[kFLAGS.BAZAAR_DEMONS_LISTENED_IN]++;
		}

		//Visit the Bizarre Bazaar at night.
		public  nightBazaarButtfuck(): void {
			clearOutput();
			outputText("While wandering the bazaar at night you feel an unease growing in your stomach. As you walk your dimly lit path, you pause and notice a rather dark pathway that you haven't seen before. Curiosity sparks in your wandering mind and you can't help but wonder how long it has been here and where it leads. Should you wander down this dark path despite the thoughts bubbling in your head that it's a bad idea?");
			outputText("\n\nDismissing that nagging feeling in the back of your mind, you head down the unlit path toward adventures unknown. You comfort yourself with the prospects of adventure and the excitement of exploration. Your ever-optimistic mind is lost in wonder when a flap of a large tent to your side suddenly bursts open. \"<i>Fine! I'm goin', I'm goin'! Put a fuckin' cock in it!</i>\"");
			
			outputText("\n\nYou turn your head to find the source of the gruff, yelling voice and find a large figure storming from the tent. As you squint in the darkness to make out the figure, you think you see them fumble with the pockets of their pants. You realize the figure has noticed you when two glowing, green eyes lock onto you. \"<i>Why, hello there...</i>\" The guttural voice utters slowly. They draw closer, and soon the only sound in the alley that you can focus on is your heartbeat and the figure's shuffling footsteps over the dirty trail. Your heart pounds as your mind races to figure out what to do. In this isolated, dark pathway you can't help but feel the figure is going to try and take advantage of you. Your back presses to the cold trunk of the adjacent tree as the figure drunkenly swaggers toward you.");

			outputText("\n\nThe figure finally comes before you. Now that you're closer you can make him out better. \"<i>What you doin' here?</i>\" The large feline asks, a growl to his voice that leaves you wondering if he's annoyed or upset. You do your best to calm yourself down and explain how you were just exploring the bazaar. To match the glowing eyes, a glinting grin of jagged teeth forms between the figure's black lips. \"<i>I was just headin' there myself. We should go together. It's not safe to wander around at night, even for a big guy like me.</i>\" A raspy snicker follows as a strong grip wraps around your shoulder. \"<i>Let me just get some more cash and I'll treat ya.</i>\" The feline purrs a generous offer as you feel him pulling you towards the tent he just exited from. Your eyes peer around as the feline starts to drag you. No one is around to help you. The trail is completely vacant. An uneasy feeling quickly grows in the pit of your stomach. Something is wrong.");
			//open options [Escape][Wait][Assault]
			menu();
			addButton(0, "Escape", escapeFromCertainRape).hint("Book it and make a dash! Run like the wind back to the safety of the public space!");
			addButton(1, "Wait", waitOnStuff).hint("Do nothing and wait instead. However, you have a feeling this might lead to a certain rape.");
			addButton(2, "Assault", assaultYoRapistYo).hint("Turn the tables against the burly tiger. Nobody is taking you today!");
		}

		//<Option 1 Escape>
		private  escapeFromCertainRape(): void {
			clearOutput();
			outputText("You tear yourself away from the feline. Wide, surprised eyes stare at you as you make a break for it. You run as quickly as your legs can carry you, the echoes of the feline's feet padding behind you urging you to run faster. You flee through the trees mindlessly, darting down whatever path you see first. In your panic, though, you quickly wear yourself out. How far did you run? Where are you now? You lean against a trunk and pant for breath. Thankfully no one seems to be around, including your pursuer. You pat yourself off as you notice the bright lights of the bazaar nearby and retreat back to the well-lit collection of tents.");
			//gtfo
			menu();
			addButton(0,"Next", enterTheBazaarAndMenu);
		}

		//<Option 2 Wait>
		private  waitOnStuff(): void {
			clearOutput();
			outputText("Uncertainty plagues you as you wait to see what happens. The large feline reaches the entrance of the large tent. His free hand grips the tent and, as you let out a loud yelp, you are shoved forcefully through.");
			//Pass go and collect 200 rape
			menu();
			addButton(0,"Next",collectSomeButtSmex);
		}

		//<Option 3 Assault>
		private  assaultYoRapistYo(): void {
			clearOutput();
			//Strength Check
			//[(If strength is less than 50)
			if (player.str + rand(30) < 50) {
				outputText("Intending to turn the tables, you grip the feline man's wrists and pull as hard as you can to wrest yourself away from the strange figure. Your muscles fail you, though, and the feline quickly pins your arms behind your back. Though you strain against them, the stronger hands hold you in place. You spit silent curses at yourself for not spending more time at the gym. \"<i>Nice try. It was almost... Cute.</i>\" You hear the figure snicker again behind you before you are promptly shoved through the entrance to the large tent.");
				//Pass go collect 200 rape
				menu();
				addButton(0,"Next",collectSomeButtSmex);
			}
			//<Option 3 Assault>
			//Strength Check
			//[(If strength is 50 or more)
			else {
				outputText("You huff your breath as the weaker figure tries to force you to cooperate. You shake your head before quickly overpowering the figure. Your strong grip clenches him around the wrists, his fur soft under your fingers. With a sharp grunt you bend them over and push their face into the dirt. The feline snarls and attempts to yank his arms from your grasp as you hold both wrists in one hand. You lean down to look him over, the light peeking through the nearby tent to reveal his orange fur with black stripes. You have a large, burly tiger man pinned under you. What do you do with him?");
				//open options [Leave][Abuse ass(70 or more corruption)]
				menu();
				addButton(4, "Leave", assaultWinAndLeave);
				if (player.isCorruptEnough(50) || player.hasPerk(PerkLib.Sadist)) addButton(0, "Abuse Ass", abuseHisAss);
			}
		}

		//<Option 1 Leave>
		private  assaultWinAndLeave(): void {
			clearOutput();
			outputText("You shove the large tiger man across the dirt. His annoyed growls are muffled by the dirt his face is sliding across. You issue a warning about picking fights with those stronger than he is and leave him lying in the dirt, his pride battered and bruised. The dirt under your heel grinds in the darkness as you turn and casually continue down the path until you find yourself back in the bazaar.");
			//gtfo
			menu();
			addButton(0, "Next", enterTheBazaarAndMenu);
		}
			
		//<Option 2 Abuse Ass(Visible with 70 or more corruption)>
		private  abuseHisAss(): void {
			clearOutput();
			outputText("Your tongue flicks from your lips at all the possibilities that course through your mind. \"<i>Lemme go!</i>\" The feline barks out from under you, though you have better ideas. You move your free hand back and roughly pull down his pants, exposing his muscled rump to the cool, night air. Feeling a firm cheek beneath your hand, you rub and squeeze it almost affectionately before swatting the cheek roughly, coaxing a strained grunt from the tiger man's mouth.");
			
			//[(If player doesn't have cock)
			if (!player.hasCock()) {
				outputText("\n\nDeciding to humiliate the poor fool, you begin to spank your hand against the tiger man's rear. Your swats grow steadily more forceful and your slaps begin to grow louder and louder, filling the night air with the sound of your hand slapping firm cheeks. You reduce the defiant growls uttered by the tiger man to soft whimpers and he slowly ceases his struggles and submits. Your hand grips a cheek firmly, fingers digging into the abused flesh and feeling the warmth of the sting you've inflicted. Tilting your head over, you can't help but smirk as the tiger's erect manhood juts out between his legs.");
				
				outputText("\n\n\"<i>What's that racket?</i>\" You turn your head, hearing a low voice shout from inside the nearby tent. With a snicker you shove the humiliated tiger to the ground and leave him exposed and aroused as the occupants of the tent pour out. By the time they surround him you are long gone and back to the well-lit collection of tents in the bazaar.");
				//gtfo
				menu();
				addButton(0,"Next", enterTheBazaarAndMenu);
				return;
			}
			//[[[(If player does have cock)
			outputText("\n\nYou decide to have a little fun with the muscular ass in front of you. You hold the struggling tiger's wrists with one hand and fish out your " + player.multiCockDescriptLight()  + " free from your [armor]. Your eyes drink in how the burly tiger man writhes under you. He's completely at your mercy.");
			//[(If multicock)
			if (player.cockTotal() > 1) outputText(" Your hand strokes along your " + player.multiCockDescriptLight()  + " and press them to the warm cheeks exposed before you.");
			else outputText(" You pump your " + player.multiCockDescriptLight() + " and milk a pearl of pre-cum out to drip onto the enticing ass before you.");
			outputText(" \"<i>O-OI!</i>\" The tiger man shouts out, his head turning to try to see behind him. With a grin on your lips you grip the hilt of [oneCock] and slap its length over the tiger's rump. You can see the tint to the tiger man's cheek as he hears and feels your dick smacking his exposed ass. Pre-cum drips down [oneCock] as you line yourself up, jamming it between the tiger's lovely mounds. He gives a surprised shout as your cockhead presses to his tiny, puckered hole.");
			
			//Cocksize check
			//[[If smallest cock is over 16 inches)
			if (player.smallestCockLength() >= 16) {
				outputText("\n\nYour lips part to let out a grunt of frustration. Your cockhead is unable to break through the tiger man's tight resistance. His struggles start to die down as [eachCock] continues to drool over his muscled rear.");
				if (player.totalCocks() == 1) outputText(" You squeeze your " + player.multiCockDescriptLight() + " between his warm ass cheeks, stroking yourself with his exposed bottom. The tiger whimpers meekly under you.");
				else outputText(" Your fattest cock grinds between the tiger man's rear, dripping spunk over his back and clothing while your other cocks make a sloppy mess of his ass.");
				outputText(" The tiger man's muscled butt is soon glazed with your pre-cum. Wet, slapping noises echo out into the alley as you grind your hips into his rear. You can't help but think in the back of your head that the noise is stirring people inside the tent he came out of.");
			}
			//[[(If largest cock is smaller than 16)
			else {
				outputText("\n\nYou jam your cockhead into the tiger man's tight ring. He groans in displeasure under you as your persistent force pushes past his resistance.");
				//[(If multicock)
				if (player.cockTotal() > 1) outputText(" One of your cocks slips into his hot, constricting confines, the remaining lengths pressed fast to the tiger man's rear and leaving glistening trails of eager fluids like markings on a bitch's ass.");
				else outputText(" Your " + player.multiCockDescriptLight()  + " pushes in, your pre-cum-slicked length sliding in with a wet noise.");
				outputText(" The burly man under you whimpers in protest as you begin to rock against his fine ass. His firm rear dimples and twitches under your hips, each slam");
				if (player.balls > 0) outputText(" swatting your " + player.ballsDescriptLight()  + " against him,");
				outputText(" making him shout out in discomfort. Your " + player.multiCockDescriptLight()  + " stretching him out");
				if (player.cockTotal() > 1) outputText(" while beating his rear");
				outputText(". All his shouting stirs whoever resides in the tent he came out of.");
			}
			//(combine cock size paths)
			outputText("\n\nAs you continue to use the burly tiger man pinned beneath you, three figures exit from the tent. Two of the figures are large and bulky and are joined by a third, slender man. They watch as you abuse the tiger under you. You glance over at them and can't help but notice smiles on their faces.");
			
			outputText("\n\n\"<i>Good for you, mate, making friends while getting us booze.</i>\" One of them calls out. The three of them laugh out loud at the joke, and as they laugh your senses are assaulted with the aroma of alcohol wafting from them. From the way the trio sways you can tell they've been hitting the bottle hard. They make no movement to stop you, though, so you ignore them. The tiger under you stares in their direction, embarrassment burning crimson in his cheeks while you use and abuse him. The scene is proving too much for you, though, and soon your " + player.multiCockDescriptLight()  + " unloads your pent up spunk over the tiger and coats him in thick, musky spooge in front of his 'friends'.");
			
			outputText("\n\n\"<i>He's even enjoying himself!</i>\" One of the figures bellows out. You tilt your head to peer between the tiger's spread legs and, sure enough, the barbed cock throbs between his legs with each beat of his heart. Without further ceremony you roll the abused tiger man on his cum-soaked back and tuck your " + player.multiCockDescriptLight()  + " back into your [armor]. The trio are too drunk to stop you as you leave. Turning your head back to glance at the tiger, you see the three figures surrounding the victim and your lips curl into a pleased smile. Within moments you return to the lights of the Bazaar.");
			//gtfo
			menu();
			addButton(0,"Next", enterTheBazaarAndMenu);
		}

		//((If waited, or failed assault  //Pass go collect 200 rape))
		private  collectSomeButtSmex(): void {
			clearOutput();
			outputText("Your body crashes into a wooden table and you choke, feeling the wind knocked out of you. You struggle to lift your head and catch your breath, only to find yourself laying in... poker chips?");
			outputText("\n\n\"<i>The fuck ya doin'? This isn't booze!</i>\" A voice shouts.");
			outputText("\n\n\"<i>Might be better though.</i>\"");
			outputText("\n\n\"<i>Shut yer traps!</i>\"");
			
			outputText("\n\nVoices surround you as you look around yourself. A light hangs over you, the heat of the light bearing down on your body from overhead. You shift and continue to disarray the poker table, moving chips and scattering playing cards across the table and onto the floor. Your nose is assaulted with the stench of smoke and alcohol as you strain your sight on the figures around you. A large bear, covered in brown fur from head to toe, barks out. \"<i>What are you pulling?</i>\"");
			
			outputText("\n\nYou follow his gaze to see the feline figure walking into the light, revealing his features to be a cross of a man and a tiger. His face looks humanoid but his body is covered in orange fur with dark stripes. \"<i>Found it hanging around outside.</i>\" The tiger growls back.");
			
			outputText("\n\n\"<i>Nice, was getting tired of card games anyway.</i>\" Behind you, a low tone sounds. You spin your head to catch the sight of a burly, green male. A tusked head sits atop muscular, bulky shoulders and torso. You furrow your brows at all of these strange men. Upon further inspection, you realize that they all must be regulars at the gym, since each shirtless torso is stacked with bulging and formidable muscles. There isn't a single shirt in sight.");
			
			outputText("\n\n\"<i>I said shut yer traps!</i>\" A commanding voice boomed out, making everyone (including you) fall silent and look in the speaker's direction. A leanly built creature rises from his seat - another humanoid, with long, furred legs like a goat's. Large curled horns protrude from his mass of curly brown hair. Beneath them, silver eyes look you over carefully and size you up.");
			
			outputText("\n\n\"<i>What are you doing?</i>\" the shirtless satyr asked with a demanding tone, his eyes fixed on the tiger man.");
			
			outputText("\n\n\"<i>He's my payment. Worth more than a few drinks,</i>\" the tiger growls. Your head is swamped with confusion as you wonder just what is going on.");
			
			outputText("\n\n\"<i>Not enough to cover all of it, too. You'll have to do better than this.</i>\" the satyr says with a sigh. \"<i>But... it's a start.</i>\" You glance to the satyr just as he snaps his fingers and raises his hand in the air. Before you can ask any questions or object, the orc's hands wrap around your wrists while the bear grips your ankles. You struggle and try to flail your limbs, though the bear and orc are too strong.");
			
			outputText("\n\n\"<i>I suggest you try and relax, little chip.</i>\" The satyr speaks while he uncorks a bottle of lust draft. \"<i>And also to avoid dark pathways, but it's a little late for that.</i>\" The satyr grins wickedly as his fingers clench around your nose. Knowing what is coming, you hold your breath futilely. Soon, you gasp and choke as the pink liquid is forced down your throat. In moments your body begins to succumb to its effect. Heat grows under your clothing and soon all four men are looking you over with hungry eyes.");
			
			outputText("\n\nYour [armor] is quickly disposed of, putting your body on display for the four men. Every breath is a whimpering pant as the effects of the lust draft take over your body. Your eyes strain to remain focused. The warmth and tingling floods your senses and washes down your skin to your loins, causing them to ache.");
			if (player.hasCock()) {
				outputText(" [EachCock] grows stiff as everyone watches. You wince to try and fight off the draft, but soon you're dripping pearls of pre-cum.");
			}
			if (player.hasVagina()) outputText(" Your " + player.vaginaDescript(0)  + " grows slick in your excitement.");
			if (player.gender == 0) outputText(" Your skin heats and tingles, sweat wetting its surface.");
			outputText(" The satyr runs his hand along your body and sizes you up with a lewd gaze and gentle touch, making you shudder under his fingertips from the effects of the draft. \"<i>Not bad I suppose. You could have done better, though.</i>\" The satyr turns his head to the tiger man as the satyr's words strike at your pride, though the rebuttal on your lips is quickly silenced as his fingers");
			if (player.hasCock()) outputText(" wrap around your " + player.multiCockDescriptLight()  + ".");
			else outputText(" rub over your " + player.assholeDescript()  + ".");
			outputText(" His hand teases your body as the pair of muscled men holds you down in place. You can only gasp out and wiggle your hips at the touch. You turn your head and look pleadingly at your captors. The large green man holding your wrists looks like an oversized goblin with yellow eyes. His olive skin is stretched tight over his bulging muscles. His bulky frame looks as powerful as he is tall, standing perhaps seven feet tall. The equally built man holding down your lower body looks much like a bear man with piercing green eyes, shorter and stockier than the green orc by far. The pair of 'gym bunnies' have matching bulges swelling in their pants as their eyes fix over your nude body");
			if (player.hasCock()) outputText(" and hard shaft");
			if (player.cockTotal() > 1) outputText("s");
			outputText(".");
			
			//[(If muticock 3 or more)
			if (player.cockTotal() >= 3) outputText("\n\nNot to be left out, each of the two men take a hand off of your limbs and grip one of your " + player.multiCockDescriptLight()  + ". Your head swings back onto the table you're laid out on, mouth open wide as you moan and arch your back. Each hand goes at an individual rhythm as sex overwhelms your thoughts. The hands pinning you down are gone, though you're unable to focus on escaping.");
			
			//(if cock(s)
			if (player.hasCock()) outputText("\n\nThe satyr pumps your length in his hand. Your hips buck madly as the hand spreads your own pre-cum over your shaft with lewd schlicking noises.");
			else outputText("\n\nHis fingers slip past your puckered flesh and dip into your " + player.assholeDescript()  + " and spread apart, loosening you for what feels like ages.");
			outputText(" Without warning the hand is gone");
			if (player.cockTotal() > 1) outputText(" and your " + player.multiCockDescriptLight()  + " wetly slaps your stomach with need");
			outputText(". A whimper escapes your lips. \"<i>This should be fine...</i>\" The cool, collected voice of the satyr murmurs.");
			
			outputText("\n\n\"<i>I'm going to use the hole.</i>\" The gruff voice behind you grunts out. You turn to see the burly orc fumbling with his pants. The size of his bulge sends a chill down your spine of ");
			if (player.lib < 50) outputText("fear");
			else outputText("excitement");
			outputText(".");
			
			outputText("\n\n\"<i>No.</i>\" The satyr slaps his hand against the Orc's pectoral, making the pec jiggle faintly. \"<i>If you go first you'll ruin it for the rest of us. I'll go first.</i>\" The group of captors hesitate a moment, then all nod in agreement.");
			if (player.isBiped()) outputText(" The bear shifts where he stands, grabbing your ankles and spreading your limbs almost painfully wide. You wince from the sting of the strain on your leg muscles.");
			outputText(" You hear the clopping of hooves on the floor as the satyr moves over to your " + player.buttDescript()  + ". His hands grip over your " + player.hipDescript()  + " and drags you closer to the edge of the table so that your " + player.buttDescript()  + " hangs over the side of the table. You raise your head to watch with a ");
			if (player.lib < 50) outputText("horrified");
			else outputText("excited");
			outputText(" expression as the satyr's hand strokes over his hard length. It looks at least eight inches long, smooth like a human's cock and protruding from a forest of curly, brown fur. The satyr lines himself up and rubs his stiff cockhead over your " + player.assholeDescript()  + ".");
			
			outputText("\n\nThe effects of the draft still fresh in your system, you moan out as your sensitive " + player.assholeDescript()  + " is poked and prodded. The slick, hot satyr spunk clings to your pucker and eases your entrance open with his bulbous cockhead. The satyr calmly takes his time until your hole is dripping and ready for him. The seemingly endless torture has erstwhile driven you mad, seeming like the satyr has waited hours before finally deciding to plunge into you. Once satisfied, the satyr shoves his hips forward and stuffs his cock into you roughly. You wince at the sting and bite your lower lip, trying to keep from giving them the satisfaction of hearing your whimpers. You shut your eyes and utter out a groan regardless, the feeling of the member pulsing against your silken walls making you utter a low moan");
			if (player.hasCock()) outputText(" while [eachCock] twitches and leaks generously over your " + player.skinFurScales());
			outputText(".");
			
			outputText("\n\nYou gasp as something hot and wet presses to your face. You open your eyes to be greeted with a stiff cock pressed against your cheek, the tiger man from before looming over you and rubbing his barbed, drooling shaft over your face. \"<i>Should be obvious.</i>\" The tiger rumbles. \"<i>But no biting, lest you want to be beaten and left outside this tent to lick your wounds.</i>\" The tiger man growls as he insistently rubs his cock over your face.");
			
			outputText("\n\n\"<i>Get your dick off'a him. This is your payment to us.</i>\" The bear bellows in a low tone. You turn your head to see a thick bear cock dueling for the use of your face. The orc remains out of sight behind you, though you hear noises of the brute moving around. The bear and tiger continue to bicker as their cocks press to each side of your face forcefully, the rods sliding against each other and your lips to drool thick pre-cum over your skin. They wet your lips with a taste of what is to come.");
			
			outputText("\n\nAll of this transpires as your " + player.buttDescript()  + " is slapped over and over by the low-hanging satyr balls. The satyr lets out a pleased groan every now and then as your body shivers and trembles from his length hilting in you over and over and over. He doesn't look like he'll stop anytime soon, though. You turn your head to see the tiger's barbed, nine inch cock. The stubby barbs make your skin tingle with each graze across your cheek. On the other hand, the bear's cock looks shorter, about seven inches though by far the thickest meat in the bunch. The massive girth would most likely hurt your jaw if you tried to wrap your mouth around it. What do you do?");
			//open menu of options [Suck tiger] [Suck bear] [Suck none]
			menu();
			addButton(0,"Suck Tiger",suckOffATiger).hint("Focus on sucking the tiger's barbed cock off.");
			addButton(1,"Suck Bear",suckOffABear).hint("Focus on sucking the bear's fat cock off.");
			addButton(2,"Suck None",suckOffNone).hint("Don't suck any of the mens' cock. Stroke them instead.");
		}

		//<option 1 Suck tiger>
		private  suckOffATiger(): void {
			clearOutput();
			outputText("You go with the barbed length. You quickly take it into your mouth and suckle on the barbed tip. The tiger's face melts from argument to pleasure. \"<i>Looks like he likes mine better than your short sausage.</i>\" The tiger gloats, the bear growling low and angrily. Not to invite a fight over your face, you grip the bear's cock with one hand and begin to stroke over the thickness, though your fingers are unable to wrap all the way around it. The pair give out pleased moans of resignation as you pleasure them. The satyr still pounds away at your " + player.buttDescript()  + " as you suck off the tiger, his hands gripping your head as he throatfucks your eager mouth. You slither your tongue under his shaft and let out a muffled moan as the barbs tingle over your throat, lips, and tongue. With a rough thrust he buries your face into his furred groin, making his heavy sack slap your cheek. The tiger man fucks your face furiously as you feel the satyr finishing in your ass. Thick tiger cock continues to pound down your throat as warmth spreads within your gut, satyr cum flooding your inner walls.");
			//bumpy road
			finalGayFinallee(0);
		}

		//<option 2 Suck bear>
		private  suckOffABear(): void {
			clearOutput();
			outputText("You turn your head and open wide, slowly squeezing the hefty bear cock past your lips. Your jaw stretches to its limit around it and you suckle with wet, slurping noises. You lavish all the attention you can on the fat rod in your mouth, using your tongue to lick and slurp the constant drool of pre-cum. You flick your nimble tongue over the swollen cockhead and hear a low, pleased grunt from the bear. Overhead, the tiger stares jealously.");
			
			outputText("\n\n\"<i>Bitches know the better cock when they see it.</i>\" The bear lords over the tiger, making the angry feline snarl. Thinking quickly, you reach up a hand and begin to stroke along the barbed member while pushing the massive bear girth further past your lips, suppressing gags while the fat cockhead blunts against the back of your throat. A hand grips the back of your head as the bear's hips begin to rock in and out of your wet mouth. Soon, your lips are wet with the combination of saliva and copious bearspunk. The hand on your head pushes you against the bear's groin, nestling your face in his furred, musky crotch while burying every inch of his fat cock down your mouth and plugging your throat. Your eyes begin to water from the strain on your jaw and throat as the fat bear cock pulses, filling your mouth and pouring pre-cum straight down your gullet. The bear begins to fuck your face, giving you a chance to gasp for breath every now and then. This goes on for some time before you feel the satyr's cock pulse in your ass, spooge quickly filling you up. Thick bear-cock pounds down your throat and distracts you from the satyr, though you can't help but feel the warmth of cum spreading deep within your gut and flooding your inner walls.");
			
			//crazy steel jaw
			finalGayFinallee(1);
		}

		//<Option 3 Suck none>
		private  suckOffNone(): void {
			clearOutput();
			outputText("Unwilling to wrap your lips around either of their lengths, you reach up with your hands and start to stroke the pair of arguing men off. Each ceases their bickering to look down at you in confusion. Their dazed expressions don't last long, quickly melting into pleasured, half-lidded gazes and moans. Their drooling cockheads glaze your cheeks white with their pre-cum, making you reek of their strong, salty musk. They seem eager for more and press their hard dicks over your face, prodding your closed lips with hot, pre-slicked cockheads. You shut your eyes, one hand from each of them pressing the back of your head more into their needy cocks. Your lips part just enough to taste their copious pre-cum, moans escaping your parted lips quietly as the satyr begins ramming his hips against you hard while his pent-up balls unload in your ass and paint your lower body with cum.");
			//no furry plx
			finalGayFinallee(2);
		}

		//all options lead to here for now
		private  finalGayFinallee(road: number = 0): void {
			outputText("\n\nWith a wet pop, the satyr pulls his spent manhood from your " + player.assholeDescript()  + ". He smears his softening cock over your " + player.buttDescript()  + " and leaves a white streak of cum across your cheeks. He huffs a content breath and moves over to the side. \"<i>I'm good, you guys decide who gets to fuck the slut next.</i>\" You look up at the tiger and bear men. Their eyes light up a moment before turning to look at your " + player.buttDescript()  + " with hungry lust. Your spine shivers under their gaze, but before they can move a green blur runs past them.");
			
			outputText("\n\n\"<i>Zug want hole!</i>\" The large green orc runs to your behind, slapping his massive foot-long against your " + player.buttDescript()  + " as if to call 'dibs!'. You bite your lips at the sight of the throbbing twelve inches sawing your ass cheeks apart, the dark olive flesh glistening with a thick layer of prespunk and slick, cool lubricant. The orc's bulky muscles twitch menacingly as he stares the tiger and bear down. The two of them stay where they are and, after a few moments, the orc grunts. He looks down and lines himself up with your hole. His thick, orcish girth presses against your " + player.assholeDescript()  + ", pushing in forcefully as the satyr's cum and rough pounding opened you just wide enough for the orc to slide in with little pain.");
			
			outputText("\n\nYou give a muffled groan as the giant orc cock impales you, the stiff erection grinding over your stretched-out, silken walls. His fat orc sack swats your upturned " + player.buttDescript()  + ". It coaxes whimpers from your lips as the green cock pulls out and slams back in, the brute of an orc focusing on getting further into you as his massive phallus plunges deeper and deeper with each thrust. The colossal girth rides on the satyr's cum trails and pushes past it, stuffing you full to bursting with his orc meat. His hands grip your hips and he roughly yanks you into a good angle as he begins to abuse your " + player.buttDescript()  + " with long, pummeling lunges. He lets out guttural groans as his hefty cock drools orc cream, mixing it with the satyr's spooge as your hole begins to resemble a used condom.");
			player.buttChange(30,true,true,false);
			outputText("\n\nYou can barely focus on pleasuring the two cocks in your hands as your lower body receives a slut's treatment. \"<i>Ragh! Hole so tight around orc cock! Make good orc bitch!</i>\" The large green man groans and you feel his heavy sack clench against your cheeks. Your eyes go wide as you're suddenly flooded with orc spunk, the sensation and sound of the cum overflowing from your hole to splatter against the Orc's balls and thighs overwhelming your senses. The Orc lets out a \"<i>Wrahhg!</i>\" as he pins your hips, hilting his orc cock as he continues to unload his thick, fertile seed into you. Your belly soon distends and bulges from the amount of cum shooting up your ass. The orc man pants over you as you feel your " + player.assholeDescript()  + " dripping orc spunk like a leaking dam.");
			//now it's time for the choice before to matter, we got three endings here, one for each choice.
			//((Ending 1 , suck tiger, //bumpy road))
			if (road == 0) {
				outputText("\n\nYou are hardly able to focus on the barbed cock in your mouth, moaning around the hard cock as you look at the small bump on your belly. With your hands servicing the bear as the tiger fills your mouth, the two men haven't left either side of your head. With a wet pop, the tiger man pulls his saliva-coated prick from your mouth and he moves to the orc, shoving him aside with a grunt. \"<i>My turn now.</i>\" He grins impishly as he lines himself up with your hole, your " + player.assholeDescript()  + " looking like a well-used cum dump. He rams in with ease and begins to pound away inside of you, making you moan with your mouth open wide.");
				outputText("\n\nThe bear takes advantage of this, shoving his impossibly thick cock between your open lips. Your lips vibrate around his shaft as you moan. The bear climbs onto the table and begins to fuck your face while your " + player.assholeDescript()  + " is used for the third time in a row. Your jaw stretches painfully around the girth of the bear's pride, your hands gripping at his legs as you look up at him with pleading eyes. He only grins down at you as he watches his fat length slipping past your lips and bulging inside your throat. Your throat constricts with gags and vibrates with moans as you involuntarily milk the bear's cock. Each time the feline cock drills into you, the barbs leave you whimpering and gagging around the bearcock throatfucking you. The barbs in your ass seem to bring a new sensation to the abuse as wet slapping noises echo in the tent. Your " + player.buttDescript()  + " is wet with the combined cum of three males in a row, their cum and pre-cum dripping from your upturned " + player.buttDescript()  + " to form a growing puddle of lust on the floor and table.");
				outputText("\n\nThe bear and tiger don't last long. The bear finishes first as he pins your head between his hips and the table. Your fingers clench over his furred legs as a deep groan rumbles from his belly. You can feel his load shooting directly down your throat to fill your stomach. The bear pulls out as the last lurch of his cock spits a rope of cum over your face, causing you to shut your eyes and wince as the hot liquid oozes down your cheeks. With an amused grunt, the bear gets off the table to leave you with the tiger man. With a raspy hiss the tiger is last, his flared barbs quivering over your cum soaked walls as he grows closer to adding his own spunk to your collection. He leans down over your laying form and gives you a wink. ");
				if (player.hasCock()) outputText("His hand dips down to play with your " + player.multiCockDescriptLight()  + ", stroking you off as he gives a few more brutal pounds of his hips. ");
				else if (player.hasVagina()) outputText("Fingers ram into your " + player.vaginaDescript(0)  + ", thrusting into you as he fucks your other hole. ");
				outputText("His face near yours, he licks your cheek and plants a brief kiss on your lips. You give him a confused look at the affection and he meets it with a wide grin. \"<i>You're cute for a cocksucker. Knew I had it made when I found you.</i>\" he snickers, causing you to blush.");
				if (player.gender > 0) outputText(" Your lips part as you moan, feeling your climax building before coating the tiger's hand and your lower body in your sex. The tiger man just brings his hand up to his lips to taste your juices before hilting into you one last time.");
				outputText(" A third wave of warmth floods you, the pressure growing even higher as you resemble an overstuffed, breeding bitch. Exhaustion catches up with you and you begin to feel your eyes grow heavy. The last thing you see is the feline's face contorted in pleasurable orgasm before you nod off.");
		 
				outputText("\n\nYou wake up with a start, the sound of morning birds echoing in the abandoned tent is all that greets you. You try to get up quickly but immediately regret it. Your body is sore from all the abuse you took last night. You slide off the table and look around for your gear. Shockingly enough, you find it folded up in a neat bundle");
				if (player.gems > 1) {
					outputText(" with only a few gems missing");
					player.gems -= 3 + rand(4);
					if (player.gems < 0) player.gems = 0;
				}
				outputText(". You redress yourself before realizing something. You have acquired something extra: a lust draft potion with an orange ribbon tied to it. A note at the end reads: \"<i>Thanks for bailing me out of buying booze. Your ass was amazing even after that orc had it.</i>\" There's no name on the note but you have a good idea who left it for you, judging by the drawn tiger paw print in the corner. You pocket the lust draft and leave the tent to head back to the bazaar in the morning light.\n\n");
				player.orgasm('Anal');
				dynStats("sen", 5);
				getGame().time.days++;
				getGame().time.hours = 6;
				//Lust sated
				//Gained 1 lust draft, lost a few gems(9 or so?)
				inventory.takeItem(consumables.L_DRAFT, camp.returnToCampUseOneHour);
				//Time set to morning
				statScreenRefresh();
			}
			//((Ending 2 , suck bear, //crazy steel jaw))
			else if (road == 1) {
				outputText("\n\nYou are hardly able to focus on the girthy bear-cock in your mouth, moaning around the fat cock as you look at the small bump on your belly. With your hands servicing the tiger as the bear fills your mouth, the two men haven't left either side of your head. With a wet pop the bear pulls his saliva-coated prick from your mouth and he moves to the orc, shoving him aside with a grunt. \"<i>My turn now.</i>\" He grins impishly as he lines himself up with your hole, your " + player.assholeDescript()  + " looking like a well-used cum dump. He rams in with ease and begins to pound away inside of you, making you moan with your mouth open wide.");
				outputText("\n\nThe tiger takes advantage of this, shoving his barbed cock between your open lips. Your lips vibrate around his shaft as you moan. The tiger climbs onto the table and begins to fuck your face while your " + player.assholeDescript()  + " is used for the third time in a row. The barbs scrape and tickle at your mouth and throat while your hands grip at the tiger's legs. You look up at him with pleading eyes though he only grins down at you as he watches his barbed length slipping past your lips and bulging inside your throat. Your throat constricts with gags and vibrates with moans as you involuntarily milk the tiger's cock. Each time the bear cock drills into you, the thickness leave you whimpering and gagging around the tigercock throatfucking you. Your throat vibrates around the tigercock with muffled moans as the thick bearcock makes your pucker ache from the strain.");
				player.buttChange(45,true,true,false);
				outputText("\n\nHis hefty girth spreads you further than the orc, painfully spreading you apart while simultaneously driving you wild with the fuck. Your " + player.buttDescript()  + " is wet with the combined cum of three males in a row, their cum and pre-cum dripping from your upturned " + player.buttDescript()  + " to form a growing puddle of lust on the floor and table. The bear and tiger don't last long. The tiger finishes first as he pins your head between his hips and the table. Your fingers clench over his furred legs as a deep purr rumbles from his chest. You can feel his load shooting directly down your throat to fill your stomach. The tiger pulls out as the last lurch of his cock spits a rope of cum over your face, causing you to shut your eyes and wince as the hot liquid oozes down your cheeks. With an amused grunt, the tiger gets off the table to leave you with the bear's cock in your ass.");
				
				outputText("\n\nWith a raspy growl the bear is last, his thick dick spasming as he grinds his fat cock over your cum soaked walls while he grows closer and closer to adding his own spunk to your collection. He leans down over your laying form and gives you a wink. ");
				//[(If cock(s))
				if (player.hasCock()) outputText("His hand dips down to play with your " + player.multiCockDescriptLight()  + ", stroking you off as he gives a few more brutal pounds of his hips.");
				else if (player.hasVagina()) outputText("Fingers ram into your " + player.vaginaDescript(0)  + ", thrusting into you as he fucks your other hole.");
				outputText(" His face near yours, he licks your cheek and plants a brief kiss on your lips. You give him a confused look at the affection and he meets it with a wide grin. \"<i>You're cute for a cocksucker. Loved the way you went right for my dick.</i>\" He snickers, causing you to blush.");
				if (player.gender > 0) outputText(" Your lips part as you moan, feeling your climax building before coating the bear's hand and your lower body in your sex. The bear just brings his hand up to his lips to taste your honey before hilting into you one last time.");
				outputText(" A third wave of warmth floods you, the pressure growing even higher as you resemble an overstuffed, breeding bitch. Exhaustion catches up with you and you begin to feel your eyes grow heavy. The last thing you see is the bear's face contorted in pleasurable orgasm before you nod off.");

				outputText("\n\nYou wake up with a start, the sound of morning birds echoing in the abandoned tent is all that greets you. You try to get up quickly but immediately regret it. Your body is sore from all the abuse you took last night. You slide off the table and look around for your gear. Shockingly enough, you find it folded up in a neat bundle");
				if (player.gems > 1) {
					outputText(" with only a few gems missing");
					player.gems -= 3 + rand(4);
					if (player.gems < 0) player.gems = 0;
				}
				outputText(". You redress yourself before realizing something. You have acquired something extra: A lust draft potion with a brown ribbon tied to it. A note at the end reads: \"<i>I'll always remember the face you made trying to wrap your cute lips around my giant dick.</i>\" There's no name on the note but you have a good idea who left it for you, judging by the drawn bear paw print in the corner. You pocket the lust draft and leave the tent to head back to the bazaar in the morning light.\n\n");
				player.orgasm('Anal');
				dynStats("sen", 5);
				getGame().time.days++;
				getGame().time.hours = 6;
				//Lust sated
				//Gained 1 lust draft, lost a few gems(9 or so?)
				inventory.takeItem(consumables.L_DRAFT, camp.returnToCampUseOneHour);
				//Time set to morning
				statScreenRefresh();
			}
			//((Ending 3 , suck none, //No furry plx))
			else {
				outputText("\n\nYou pant labored breaths as your skin tingles from the orc's flood of thick spunk. Shakily, your hands continue to stroke off the bear and tiger's cocks and they continue to press to your cheeks and glaze your skin with pre-cum. You feel the bear make a move towards the orc, but the green muscleman snarls and leans forward possessively. \"<i>This Zug's hole! Zug not done!</i>\" The orc growls out as he protects his territory. The bear backs away carefully and returns his dick to your face, pressing his cock back against your lips in determination to at least get some action. The orc's fat cock stiffens as it revs back up for round two (Or in your case, round 3). He pounds into your spunk-filled confines and you cry out in pleasure. The two cocks in front of your face immediately thrust past your open lips, their cockheads rubbing together and filling your mouth with gushes of pre-cum. Your tongue flicks over them to push them from your mouth but it only encourages them.");
				outputText("\n\nYour hands frantically work over their shafts, squeezing and tugging at their hard erections while your nimble fingers dance over the stiff flesh. Your efforts bear fruit as the two men groan out, one cumming and the other soon after, shooting into your mouth with twin streams of cum. They shoot into your mouth and sloppily coat your lips and chin, pulling out to let a few ropes coat your face. Your eyes shut as the two continue to give you a sperm facial. Each new, hot rope of cum clings over your cheeks and warms your skin. The tiger and bear move away as you reach up to clean the mess from your eyes and, as soon as you open them you're greeted with the sight of the large orc looming over you. He grins oddly at you as his head leans down to lick the cum from your face, instead covering you in his saliva. \"<i>Zug like you. Zug know you love big orc cock.</i>\" His speech is simple and grunted, though the words make you feel a hot blush rise in your cheeks.");
				
				outputText("\n\nHe shouts out a war cry and starts brutally fucking you senseless.");
				if (player.hasCock()) outputText(" His hand drips down to clumsily play with your " + player.multiCockDescriptLight()  + ", stroking you off as he gives you a few more brutal pounds of his hips.");
				else if (player.hasVagina()) outputText(" Fingers dip into your " + player.vaginaDescript(0)  + ", ramming into you as he fucks your other hole.");
				if (player.gender > 0) outputText(" Your lips part as you feel your climax building, and soon you coat the orc's hand and your lower body in your lust. The orc just brings his hand up to taste your juices before hilting into you one last time.");
				outputText(" A third wave of warmth floods you and the pressure grows even higher as you resemble an overstuffed breeding bitch. Exhaustion catches up with you and your eyes begin to grow heavy. The last thing you see is the orc's face twisted in orgasmic pleasure before you pass out.");
				
				outputText("\n\nYou wake up with a start. The sound of morning birds echoing in the abandoned tent is all that greets you. You try to get up quickly but immediately regret it. Your entire body is sore from all the abuse you took last night. Sliding off the table carefully, you look around for your gear. ");
				if (player.gems > 1) {
					outputText("The only thing missing is a few gems. ");
					player.gems -= 3 + rand(4);
					if (player.gems < 0) player.gems = 0;
				}
				outputText("You re-dress yourself quickly before realizing that you have something extra: A bimbo potion with a green ribbon tied to it. A note at the end of the ribbon reads: \"<i>Zug think you make good orc bitch. Drink this and Zug fuck all your holes!</i>\" The writing is a childish scrawl, and you can barely make out the rest of the words. By the stains on the paper, it's obvious the orc got too excited to properly finish his note, broken English or otherwise. You pocket the bimbo potion and leave the tent to head back to the bazaar in the morning light.\n\n");
				//Lust sated
				//Gained 1 Bimbo brew, lost a few gems(9 or so?)
				//Time set to morning
				player.orgasm('Generic');
				dynStats("sen", 5);
				getGame().time.days++;
				
				getGame().time.hours = 6;
				//Lust sated
				//Gained 1 lust draft, lost a few gems(9 or so?)
				inventory.takeItem(consumables.BIMBOLQ, camp.returnToCampUseOneHour);
				statScreenRefresh();
				//Time set to morning
			}
		}

		//Prisoner mod!
		private  investigateBackAlley(): void {
			clearOutput();
			outputText("Your curiosity draws you half way down a dark alleyway between two tents. In the gloom ahead you see what appears to be a cage wagon, and hear the sounds of guttural voices engaged in boisterous conversation. Inexplicably you find yourself struck by an unwholesome sense of foreboding. <b>Even from here that cage looks like it is designed to carry people off to somewhere very unpleasant, some place where your life could be turned upside down and the rules you have become accustomed to in this world may no longer apply.</b> You take a long moment to consider turning back. Do you throw caution to the wind and investigate further?");
			doYesNo(getGame().prison.goDirectlyToPrisonDoNotPassGoDoNotCollect200Gems, enterTheBazaarAndMenu);
		}
		//Nope no prison for me thank you very much
		private  investigateBackAlleyNoPrison(): void {
			clearOutput();
			outputText("Your curiosity draws you half way down a dark alleyway between two tents. In the gloom ahead you see what appears to be a cage wagon, and hear the sounds of guttural voices engaged in boisterous conversation. Inexplicably you find yourself struck by an unwholesome sense of foreboding. Even from here that cage looks like it is designed to carry people off to somewhere very unpleasant, some place where your life could be turned upside down and the rules you have become accustomed to in this world may no longer apply. You take the wise decision of walking away.");
			menu();
			addButton(0, "Next", enterTheBazaarAndMenu);
		}

	}

