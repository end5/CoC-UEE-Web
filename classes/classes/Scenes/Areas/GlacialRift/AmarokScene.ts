//By Foxwells
//No wolf-fucking scenes because NO BESTIALITY. This is a WOLF and I am not having you fuck a LITERAL, NON-MORPH, ACTUAL WOLF
//Note: You get bad-ended if you lose 5 times in a row. Amarok eats you. I avoided vore fetish as best as I could (though I admit to making some miscellaneous jokes about it in commentary), did my best not to sexualise it. I don't like vore either. Shit's weird. Anyway if I crossed a line, let me know and I'll fix it

	export class AmarokScene extends BaseContent {

		public  AmarokScene() {}
		//He's not actually going to eat you. Unless you fuck up 5 times
		public  amarokChowTime(): void {
			clearOutput();
			spriteSelect(SpriteDb.s_amarok);
			credits.modContent = true;
			credits.authorText = "Foxwells";
			outputText(images.showImage("amarok-defeat"));
			flags[kFLAGS.AMAROK_LOSSES]++;
			if (player.HP <= 0) {
				outputText("Your legs give out under you and your " + player.weaponName + " falls into the snow. The Amarok has you beat. Your face crashes into the snow, a refreshing cool on the heat of your wounds. You raise your head at the sound of footsteps and find yourself staring at the Amarok's nose as it sniffs you. You let your head drop and resign yourself to fate.");
				amarokFlagCheck();
			}
			else //if you lust lost you kinda deserve it, he shouldn't tease if I did this right
				outputText("You collapse into the snow, your lust uncontrollable. As your hand reaches for your loins, you silently curse yourself for bringing yourself to this state. You raise your head at the sound of footsteps and find yourself staring at the Amarok's nose as it sniffs you. You let your head drop and resign yourself to fate.");
		}

		public  amarokFlagCheck(): void {
			if (player.hasStatusEffect(StatusEffects.Infested)) amarokNoEat();
			else if (flags[kFLAGS.AMAROK_LOSSES] >= 5) amarokBadEnd();
			else if (flags[kFLAGS.AMAROK_LOSSES] < 5) amarokChompo();
		}
		//He doesn't want to eat worms
		private  amarokNoEat(): void {
			clearOutput();
			spriteSelect(SpriteDb.s_amarok);
			credits.modContent = true;
			credits.authorText = "Foxwells";
			outputText(images.showImage("area-glacialrift"));
			outputText("\n\nMuch to your surprise, however, the Amarok suddenly backs away with a low growl. It resumes sniffing you at a distance, eventually coming over to your lower half. The worms inside you wriggle about, and you let out a low groan of discomfort. As though on cue, the Amarok take a sniff of your crotch, then promptly backs off with another snarl. It must be able to detect your worm infestation, and more importantly, not like it! It turns away and kicks snow on you with one of its back back, letting out a huff of irritation. You watch it walk off as blackness washes over your vision.");
			combat.cleanupAfterCombat();
		}

		private  amarokChompo(): void {
			clearOutput();
			spriteSelect(SpriteDb.s_amarok);
			credits.modContent = true;
			credits.authorText = "Foxwells";
			if (player.gender > 1) outputText(images.showImage("amarok-chompo-female"));
			else outputText(images.showImage("amarok-chompo-male"));
			outputText("It lets out a soft bark as you close your eyes and skips to the other side of you. You remain still in fear of what it plans to do. It picks you by your neck. Its grip isn't hard enough to even break your skin, but firm enough that it won't drop you. It then begins to drag you somewhere. Something in your mind tells you to struggle, but you can't seem to muster the will to try. It'd just bite through your neck and kill you anyway. The feeling of its hot breath running down your back is oddly soothing. You open your eyes long enough to make sense of your surroundings, then pass out.");
			outputText("\n\nYou awaken some time later to a chorus of yips. You've stopped moving. You're on the ground, with small paws and dull teeth prodding you all over. They don't hurt you outside of being uncomfortable, but you're sure you'll be left with bruises. You focus your vision and slowly make out where you are-- the side of a short cliff, protected from snow by tall trees. You're laying atop of pine needles and dead leaves. A strong scent of feces causes you to jolt upright in disgust, and something that'd been gnawing on your ear fell to the ground with a squeak. You look back at it. It's a black wolf pup, likely the Amarok's. You spot three others scattered about the den. You must have been left as food for them. The pups, however, seem much more interested in using you as a toy than a meal. You get to your feet, shaking off the pups. You don't feel like sticking around for them to change their minds.");
			outputText("\n\nYou spot your " + player.armorName + " a bit away. It must've been ripped off you when you were passed out. You scramble to it and put it back on, then head back to camp as fast as you can.");
			combat.cleanupAfterCombat();
		}
		//Hungry Hungry Hipp-- err, Wolves
		public  amarokBadEnd(): void {
			clearOutput();
			spriteSelect(SpriteDb.s_amarok);
			credits.modContent = true;
			credits.authorText = "Foxwells";
			outputText(images.showImage("badend-amarok"));
			outputText("You've been here before. The Amarok will carry you to its den, let its pups deal with you as they will, and it'll vanish off somewhere. You'll wake up later and flee before it returns or its pups get hungry. You close your eyes and wait for it to pick you up. You just want to get this over with.");
			outputText("\n\nThe Amarok, however, has other plans. Instead of coming behind you and picking you up, it hits you with a paw that rolls you onto your back, then puts said paw on your chest. You wheeze under its weight. It managed to step in just the right spot to knock your breath out of you. As though the air wasn't freezing enough, a wave of cold horror washes through your spine. You don't know what's going to happen, but you don't like it.");
			outputText("\n\nYou writhe under its grasp as your throat closes in terror. Your efforts are fruitless, and the Amarok watches you in mild amusement. Your blood starts to pound in your ears. You need something-- anything --that'll help you get away. You flop an arm at the leg holding you down, praying it'll knock the Amarok off. It doesn't work. You try to get a foot under it and kick it off. You can't even roll your legs up. You try to scream for help in a futile hope anyone is nearby. You instead choke on your own breath. The Amarok's cruel gaze watches you with glee.");
			outputText("\n\nYou stop thinking. You just want air.");
			outputText("\n\nLines of pain well in your abdomen and you take in the biggest breath of your life-- only to promptly release it with a screech. You instinctively curl up to try and protect yourself, but the Amarok takes a hold of one of your arms and shakes you violently. It only releases you when it accidentally rips off part of your " + player.armorName + ". You get flung a bit away and take a small tumble. Before you can get up, though, the Amarok is on you. It holds you down with one of its paws and begins to tear off the rest of your " + player.armorName + ", carelessly tossing it aside. You jerk, and roll, and rip at its leg, but it refuses to release you. Instead, it opens its jaws and snaps them shut around your neck.");
			player.takeDamage(player.HP, false);
			getGame().gameOver();
		}

		public  winAgainstAmarok(): void {
			flags[kFLAGS.AMAROK_LOSSES]--; //kinda unfair to continually stack it imo
			if (flags[kFLAGS.AMAROK_LOSSES] < 0)
				flags[kFLAGS.AMAROK_LOSSES] = 0;
			clearOutput();
			credits.modContent = true;
			credits.authorText = "Foxwells";
			outputText(images.showImage("amarok-victory"));
			outputText("The Amarok collapses, unable to withstand any more.");
			combat.cleanupAfterCombat();
		}
	}

