
export class WeaponShop extends Shop {
	
	public  WeaponShop() {
		super();
		sprite = SpriteDb.s_weaponsmith;
	}

	protected  inside(): void {
		clearOutput();
		outputText("The high pitched ring of a steel hammer slamming into hot metal assaults your ears as you walk up to the stand.  Sparks are flying with every blow the stand's owner strikes on his current work.  The metal is glowing red hot, and the hammer falls with the relentless, practiced precision of an experienced blacksmith's guiding hand.  Thick gray and white fur ruffles as the blacksmith stands up, revealing the details of his form to you.  He's one of the dog-people that inhabits this city, though his fur and ears remind you of a dog one of your friends had growing up called a husky.  The blacksmith is anything but husky.  He's fairly short, but lean and whip-cord tough.  His right arm is far more thickly muscled than his left thanks to his trade, and he walks with a self-assured gait that can only come with age and experience.\n\n");
		outputText("His piercing blue eyes meet yours as he notices you, and he barks, \"<i>Buy something or fuck off.</i>\"\n\nWhat do you buy?");
		menu();
		addItemBuyButton(consumables.W_STICK);
		addItemBuyButton(weapons.CLAYMR0);
		addItemBuyButton(weapons.WARHAM0);
		addItemBuyButton(weapons.KATANA0);
		addItemBuyButton(weapons.SPEAR_0);
		addItemBuyButton(weapons.WHIP__0);
		addItemBuyButton(weapons.W_STAFF);
		addItemBuyButton(weapons.S_GAUN0);
		addItemBuyButton(weapons.DAGGER0);
		addItemBuyButton(weapons.SCIMTR0);
		addItemBuyButton(weapons.MACE__0);
		addItemBuyButton(weapons.FLAIL_0);

		if (player.hasKeyItem("Sheila's Lethicite") >= 0 || flags[kFLAGS.SHEILA_LETHICITE_FORGE_DAY] > 0) {
			addButton(12, "ScarBlade", forgeScarredBlade);
		}
		addButton(13, "Upgrade", getGame().equipmentUpgrade.equipmentUpgradeMenu, ItemUpgrade.TELADRE_WEAPON_SHOP, inside);
		addButton(14, "Leave", telAdre.telAdreMenu);
	}

	protected override function confirmBuy(itype:ItemType = undefined, priceOverride: number = -1, keyItem: string = ""): void {
		clearOutput();
		outputText("The gruff metal-working husky gives you a slight nod and slams the weapon down on the edge of his stand.  He grunts, \"<i>That'll be " + itype.value + " gems.</i>\"");
		super.confirmBuy(itype);
	}

	private  forgeScarredBlade(): void {
		if (player.hasKeyItem("Sheila's Lethicite") >= 0) {
			forgeScarredBladeStart();
		}
		//remove Sheila's Lethicite key item, set sheilacite = 3, start sheilaforge timer, increment once per day at 0:00
		if (getGame().time.days - flags[kFLAGS.SHEILA_LETHICITE_FORGE_DAY] < 14) {
			forgeScarredBladeMiddle();
		}
		if (getGame().time.days - flags[kFLAGS.SHEILA_LETHICITE_FORGE_DAY] >= 14) {
			forgeScarredBladeEnd();
		}
	}

	private  forgeScarredBladeStart(): void {
		clearOutput();
		outputText("The blacksmith turns an appraising eye on you as you approach him without looking at any of the weapons on display.\n\n");
		outputText("\"<i>What do you want?</i>\" he says, with characteristic gruffness.\n\n");
		outputText("You pull out the dark purple crystal you received from Sheila and ask if it would be possible to alloy a blade from it.  He doesn't move to take it from your outstretched hand just yet, but you can see a hint of interest in the softening of his features.	\"<i>That's a lethicite.  Where'd you get it?</i>\" asks the smith.\n\n");
		outputText("\"<i>Stole it from a demon,</i>\" you lie.\n\n");
		outputText("He considers for a moment more before responding.  \"<i>Well done, then.</i>\"	At that, he takes the crystal gingerly from your hand.	\"<i>Never worked with this before.  I promise nothing, but come back in two weeks.  I should have an update for you.</i>\"\n\n");
		flags[kFLAGS.SHEILA_LETHICITE_FORGE_DAY] = getGame().time.days;
		player.removeKeyItem("Sheila's Lethicite");
		doNext(inside);
	}

	private  forgeScarredBladeMiddle(): void {
		clearOutput();
		outputText("The weaponsmith looks up from the forge as you enter.  \"<i>Oh, it's you.  I'm not done yet.</i>\"	With a gesture, he dismisses you.  You can only content yourself with looking at the finished products.\n\n");
		doNext(inside);
	}

	private  forgeScarredBladeEnd(): void {
		clearOutput();
		outputText("The smith looks up as you enter, and you could swear the already-thin, no-nonsense line of his mouth becomes even tighter.	\"<i>It's you.	Come here.</i>\"\n\n");
		outputText("Obligingly, you approach him, though the forge's heat is stifling.	\"<i>I finished.  The crystal impregnated the metal easily, but the blade itself... just have a look.</i>\"  He picks up a tatty scabbard from a pile of half-finished weapons and holds it to you - as he does, you notice for the first time the numerous bandages on his hands.	A bit wary, you unsheathe the blade halfway; it hisses against the oiled leather as you draw it.  The revealed form of the weapon is slim, curved rakishly, and glows with an umbral light against the backdrop of the lit forge, but its broad side is covered in deep lines.\n\n");
		outputText("\"<i>Damnedest thing.  I couldn't straighten the blade for the life of me - with every hammer blow it would leap, vibrating, from the anvil, and warp somewhere else, adding a new twist for each one I took out.  After a few failures, I settled for a backsword design and channeled the bending toward the flat edge.  That's not the uncanny bit though.  You can see how sharp it is; the edge fairly shaped itself with just a touch of the grinder.  I haven't honed it - didn't need to.  But when I tried to etch a design just above the hilt, it would slide under the stencil, leaving a gouge on the blade.</i>\"\n\n");
		outputText("Closer examination reveals the veracity of his claim: all the numerous scratches and flaws on the blade have their origins right above the tang, from the smith's abortive attempts at decoration.	Yet though several ugly gashes stop just short of the edge, none of them actually break the perfect arc, as if cutting were all the blade cared about.\n\n");
		outputText("\"<i>Damnedest thing,</i>\" he repeats, breaking your train of thought.  \"<i>Every time the blade slipped, it would twist toward my hands.  It's as if it's alive and eager to find flesh.  Truth be told... I was debating whether to turn it over to the Covenant and tell you the crystal couldn't be used.  But you're here, so take it and go.\"	Giving you barely enough time to sheathe the blade again, he places a strong hand against your back and all-but-pushes you out to the street.\n\n");
		inventory.takeItem(weapons.SCARBLD, finishTakingScarredBlade, inside);
	}

	private  finishTakingScarredBlade(): void {
		flags[kFLAGS.SHEILA_LETHICITE_FORGE_DAY] = -1;
		inside();
	}
	
}

