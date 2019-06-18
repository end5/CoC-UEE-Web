
	CONFIG::AIR
	{
	}



export class Saves extends BaseContent implements Serializable {
	private static  LOGGER:ILogger = LoggerFactory.getLogger(Saves);
	private static  SERIALIZATION_VERSION: number = 3;
	private static  SERIALIZATION_UUID: string = "377de6d1-a593-43f8-a87c-61a51ab3e58e";
	
	
	private static  SAVE_FILE_CURRENT_INTEGER_FORMAT_VERSION: number		= 816;
		//Didn't want to include something like this, but an integer is safer than depending on the text version number from the CoC class.
		//Also, this way the save file version doesn't need updating unless an important structural change happens in the save file.
		
	private static  TEMP_SAVEGAME: string = "temp-savegame";
		
	private  gameStateGet;
	private  gameStateSet;
	private  gearStorageGet;
	private  permObjectFileName: string = "CoC_Main";

	public  Saves(gameStateDirectGet, gameStateDirectSet) {
		gameStateGet = gameStateDirectGet; //This is so that the save game functions (and nothing else) get direct access to the gameState variable
		gameStateSet = gameStateDirectSet;
	}

	public  linkToInventory(gearStorageDirectGet): void {
		gearStorageGet = gearStorageDirectGet;
	}

CONFIG::AIR {
	public  airFile:File;
}
public  file:FileReference;
public  loader:URLLoader;

public  saveFileNames: any[] = ["CoC_1", "CoC_2", "CoC_3", "CoC_4", "CoC_5", "CoC_6", "CoC_7", "CoC_8", "CoC_9", "CoC_10", "CoC_11", "CoC_12", "CoC_13", "CoC_14"];
public  versionProperties: Record<string, any> = {"test" : 0, "legacy" : 100, "0.8.3f7" : 124, "0.8.3f8" : 125, "0.8.4.3":119, "latest" : 119};
public  savedGameDir: string = "data/com.fenoxo.coc";

public  notes: string = "";

public  cloneObj(obj: Record<string, any>): Record<string, any>
{
var  temp:ByteArray = new ByteArray();
	temp.writeObject(obj);
	temp.position = 0;
	return temp.readObject();
}

public  getClass(obj: Record<string, any>):Class
{
	return Class(flash.utils.getDefinitionByName(flash.utils.getQualifiedClassName(obj)));
}

//ASSetPropFlags(Object.prototype, ["clone"], 1);

public  loadSaveDisplay(saveFile: Record<string, any>, slotName: string): string
{
var  holding: string = "";
	if (saveFile.data.exists/* && saveFile.data.flags[2066] == undefined*/)
	{
		if (saveFile.data.notes == undefined)
		{
			saveFile.data.notes = "No notes available.";
		}
		holding = slotName;
		holding += ": <b>";
		holding += saveFile.data.short;
		holding += "</b> - <i>" + saveFile.data.notes + "</i>\r";
		holding += "    Days - " + saveFile.data.days + " | Gender - ";
		if (saveFile.data.cocks.length > 0 && saveFile.data.vaginas.length > 0)
			holding += "H";
		else if (saveFile.data.cocks.length > 0)
			holding += "M";
		else if (saveFile.data.vaginas.length > 0)
			holding += "F";
		else
			holding += "U";
		if (saveFile.data.flags != undefined) {
			holding += " | Difficulty - ";
			if (saveFile.data.flags[kFLAGS.GAME_DIFFICULTY] != undefined) { //Handles undefined
				if (saveFile.data.flags[kFLAGS.GAME_DIFFICULTY] == 0 || saveFile.data.flags[kFLAGS.GAME_DIFFICULTY] == undefined) {
					if (saveFile.data.flags[kFLAGS.EASY_MODE_ENABLE_FLAG] == 1) holding += "<font color=\"#008000\">Easy</font>";
					else holding += "<font color=\"#808000\">Normal</font>";
				}
				if (saveFile.data.flags[kFLAGS.GAME_DIFFICULTY] == 1)
					holding += "<font color=\"#800000\">Hard</font>";
				if (saveFile.data.flags[kFLAGS.GAME_DIFFICULTY] == 2)
					holding += "<font color=\"#C00000\">Nightmare</font>";
				if (saveFile.data.flags[kFLAGS.GAME_DIFFICULTY] >= 3)
					holding += "<font color=\"#FF0000\">EXTREME</font>";
			}
			else {
				if (saveFile.data.flags[kFLAGS.EASY_MODE_ENABLE_FLAG] != undefined) { //Workaround to display Easy if difficulty is set to easy.
					if (saveFile.data.flags[kFLAGS.EASY_MODE_ENABLE_FLAG] == 1) holding += "<font color=\"#008000\">Easy</font>";
					else holding += "<font color=\"#808000\">Normal</font>";
				}
				else holding += "<font color=\"#808000\">Normal</font>";
			}
		}
		else {
			holding += " | <b>REQUIRES UPGRADE</b>";
		}
		holding += "\r";
		return holding;
	}
	/*else if (saveFile.data.exists && saveFile.data.flags[2066] != undefined) //This check is disabled in CoC Revamp Mod. Otherwise, we would be unable to load mod save files!
	{
		return slotName + ":  <b>UNSUPPORTED</b>\rThis is a save file that has been created in a modified version of CoC.\r";
	}*/
	else
	{
		return slotName + ": <b>EMPTY</b>\r   \r";
	}
}

CONFIG::AIR
{

	private  selectLoadButton(gameObject: Record<string, any>, slot: string): void {
		//trace("Loading save with name ", fileList[fileCount].url, " at index ", i);
		clearOutput();
		loadGameObject(gameObject, slot);
		outputText("Slot " + slot + " Loaded!");
		statScreenRefresh();
		doNext(playerMenu);
	}

public  loadScreenAIR(): void
{
var  airSaveDir:File = File.documentsDirectory.resolvePath(savedGameDir);
var  fileList: any[] = new Array();
var  maxSlots: number = saveFileNames.length;
var  slots: any[] = new Array(maxSlots);
var  gameObjects: any[] = new Array(maxSlots);

	try
	{
		airSaveDir.createDirectory();
		fileList = airSaveDir.getDirectoryListing();
	}
	catch (error:Error)
	{
		clearOutput();
		outputText("Error reading save directory: " + airSaveDir.url + " (" + error.message + ")");
		return;
	}
	clearOutput();
	outputText("<b><u>Slot: Sex, Game Days Played</u></b>\r");

var  i:uint = 0;
	for (var fileCount:uint = 0; fileCount < fileList.length; fileCount++)
	{
		// We can only handle maxSlots at this time
		if (i >= maxSlots)
			break;

		// Only check files expected to be save files
	var  pattern:RegExp = /\.coc$/i;
		if (!pattern.test(fileList[fileCount].url))
			continue;

		gameObjects[i] = getGameObjectFromFile(fileList[fileCount]);
		outputText(loadSaveDisplay(gameObjects[i], String(i+1)));

		if (gameObjects[i].data.exists)
		{
			//trace("Creating function with indice = ", i);
			(function(i: number): void		// messy hack to work around closures. See: http://en.wikipedia.org/wiki/Immediately-invoked_function_expression
			{
				slots[i] = function() : void 		// Anonymous functions FTW
				{
					//trace("Loading save with name ", fileList[fileCount].url, " at index ", i);
					clearOutput();
					loadGameObject(gameObjects[i]);
					outputText("Slot " + String(i+1) + " Loaded!");
					statScreenRefresh();
					doNext(playerMenu);
				}
			})(i);
		}
		else
		{
			slots[i] = undefined;		// You have to set the parameter to 0 to disable the button
		}
		i++;
	}
	menu();
var  s: number = 0
	while (s < 14) {
		//if (slots[s] != undefined) addButton(s, "Slot " + (s + 1), slots[s]);
		if (slots[s] != undefined) addButton(s, "Slot " + (s + 1), selectLoadButton, gameObjects[s], "CoC_" + String(s+1));
		s++;
	}
	addButton(14, "Back", saveLoad);
}

public  getGameObjectFromFile(aFile:File): Record<string, any>
{
var  stream:FileStream = new FileStream();
var  bytes:ByteArray = new ByteArray();
	try
	{
		stream.open(aFile, FileMode.READ);
		stream.readBytes(bytes);
		stream.close();
		return bytes.readObject();
	}
	catch (error:Error)
	{
		clearOutput();
		outputText("Failed to read save file, " + aFile.url + " (" + error.message + ")");
	}
	return undefined;
 }

}

public  loadScreen(): void
{
var  slots: any[] = new Array(saveFileNames.length);

	clearOutput();
	outputText("<b><u>Slot: Sex, Game Days Played</u></b>\r");

	for (var i: number = 0; i < saveFileNames.length; i += 1)
	{
	var  test: Record<string, any> = SharedObject.getLocal(saveFileNames[i], "/");
		outputText(loadSaveDisplay(test, String(i + 1)));
		if (test.data.exists/* && test.data.flags[2066] == undefined*/)
		{
			//trace("Creating function with indice = ", i);
			(function(i: number): void		// messy hack to work around closures. See: http://en.wikipedia.org/wiki/Immediately-invoked_function_expression
			{
				slots[i] = function() : void 		// Anonymous functions FTW
				{
					//trace("Loading save with name", saveFileNames[i], "at index", i);
					if (loadGame(saveFileNames[i]))
					{
						doNext(playerMenu);
						showStats();
						statScreenRefresh();
						clearOutput();
						outputText("Slot " + i + " Loaded!");
					}
				}
			})(i);
		}
		else
		{
			slots[i] = undefined;		// You have to set the parameter to 0 to disable the button
		}
	}
	menu();
var  s: number = 0
	while (s < 14) {
		if (slots[s] != 0) addButton(s, "Slot " + (s+1), slots[s]);
		s++;
	}
	addButton(14, "Back", saveLoad);
}

public  saveScreen(): void
{
	mainView.nameBox.x = 210;
	mainView.nameBox.y = 620;
	mainView.nameBox.width = 550;
	mainView.nameBox.text = "";
	mainView.nameBox.maxChars = 54;
	mainView.nameBox.visible = true;

	// var test; // Disabling this variable because it seems to be unused.
	if (flags[kFLAGS.HARDCORE_MODE] > 0)
	{
		saveGame(flags[kFLAGS.HARDCORE_SLOT])
		clearOutput();
		outputText("You may not create copies of Hardcore save files! Your current progress has been saved.");
		doNext(playerMenu);
		return;
	}

	clearOutput();
	if (player.slotName != "VOID")
		outputText("<b>Last saved or loaded from: " + player.slotName + "</b>\r\r");
	outputText("<b><u>Slot: Sex, Game Days Played</u></b>\r");

var  saveFuncs: any[] = [];


	for (var i: number = 0; i < saveFileNames.length; i += 1)
	{
	var  test: Record<string, any> = SharedObject.getLocal(saveFileNames[i], "/");
		outputText(loadSaveDisplay(test, String(i + 1)));
		//trace("Creating function with indice = ", i);
		(function(i: number) : void		// messy hack to work around closures. See: http://en.wikipedia.org/wiki/Immediately-invoked_function_expression
		{
			saveFuncs[i] = function() : void 		// Anonymous functions FTW
			{
				clearOutput();
				//trace("Saving game with name", saveFileNames[i], "at index", i);
				saveGame(saveFileNames[i], true);
			}
		})(i);

	}


	if (player.slotName == "VOID")
		outputText("\r\r");

	outputText("<b>Leave the notes box blank if you don't wish to change notes.\r<u>NOTES:</u></b>");
	menu();
var  s: number = 0
	while (s < 14) {
		addButton(s, "Slot " + (s+1), saveFuncs[s]);
		s++;
	}
	addButton(14, "Back", saveLoad);
}

public  saveLoad(): void
{
	getGame().mainMenu.hideMainMenu();
	mainView.eventTestInput.x = -10207.5;
	mainView.eventTestInput.y = -1055.1;
	//Hide the name box in case of backing up from save
	//screen so it doesnt overlap everything.
	mainView.nameBox.visible = false;
var  autoSaveSuffix: string = ""
	if (player.autoSave) autoSaveSuffix = "ON";
	else autoSaveSuffix = "OFF";

	clearOutput();
	outputText("<b>Where are my saves located?</b>\n");
	outputText("In Windows Vista/7 (IE/FireFox/Other): <pre>Users/{username}/Appdata/Roaming/Macromedia/Flash Player/#Shared Objects/{GIBBERISH}/</pre>\n\n");
	outputText("In Windows Vista/7 (Chrome): <pre>Users/{username}/AppData/Local/Google/Chrome/User Data/Default/Pepper Data/Shockwave Flash/WritableRoot/#SharedObjects/{GIBBERISH}/</pre>\n\n");
	outputText("Inside that folder it will saved in a folder corresponding to where it was played from. If you saved the CoC.swf to your HDD, then it will be in a folder called localhost. If you played from my website, it will be in fenoxo.com. The save files will be labelled CoC_1.sol, CoC_2.sol, CoC_3.sol, etc.\n\n");

	outputText("<b>Why do my saves disappear all the time?</b>\n");
	outputText("There are numerous things that will wipe out flash local shared files. If your browser or player is set to delete flash cookies or data, that will do it. CCleaner will also remove them. CoC or its updates will never remove your savegames - if they disappear something else is wiping them out.\n\n");

	outputText("<b>When I play from my HDD I have one set of saves, and when I play off your site I have a different set of saves. Why?</b>\n");
	outputText("Flash stores saved data relative to where it was accessed from. Playing from your HDD will store things in a different location than fenoxo.com or FurAffinity.\n");
	outputText("If you want to be absolutely sure you don't lose a character, copy the .sol file for that slot out and back it up! <b>For more information, google flash shared objects.</b>\n\n");

	outputText("<b>Why does the Save File and Load File option not work?</b>\n");
	outputText("Save File and Load File are limited by the security settings imposed upon CoC by Flash. These options will only work if you have downloaded the game from the website, and are running it from your HDD. Additionally, they can only correctly save files to and load files from the directory where you have the game saved.");
	//This is to clear the 'game over' block from stopping simpleChoices from working.  Loading games supercede's game over.
	if (mainView.getButtonText( 0 ) == "Game Over")
	{
		temp = 777;
		mainView.setButtonText( 0, "save/load" );
	}
	menu();
	//addButton(0, "Save", saveScreen);
	addButton(1, "Load", loadScreen);
	addButton(2, "Delete", deleteScreen);
	//addButton(5, "Save to File", saveToFile);
	addButton(6, "Load File", loadFromFile);
	//addButton(8, "AutoSave: " + autoSaveSuffix, autosaveToggle);
	addButton(14, "Back", kGAMECLASS.gameOver);


	if (temp == 777) {
		clearOutput();
		addButton(14, "Back", kGAMECLASS.gameOver);
		return;
	}
	if (player.str == 0) {
		addButton(14, "Back", kGAMECLASS.mainMenu.mainMenu);
		return;
	}
	if (inDungeon) {
		addButton(14, "Back", playerMenu);
		return;
	}
	if (gameStateGet() == 3) {
		addButton(0, "Save", saveScreen);
		addButton(5, "Save to File", saveToFile);
		addButton(3, "AutoSave: " + autoSaveSuffix, autosaveToggle);
		addButton(14, "Back", kGAMECLASS.mainMenu.mainMenu);
	}
	else
	{
		addButton(0, "Save", saveScreen);
		addButton(5, "Save to File", saveToFile);
		addButton(3, "AutoSave: " + autoSaveSuffix, autosaveToggle);
		addButton(14, "Back", playerMenu);
	}
	if (flags[kFLAGS.HARDCORE_MODE] >= 1) {
		removeButton(5); //Disable "Save to File" in Hardcore Mode.
	}
}

private  saveToFile(): void {
	clearOutput();
	saveGameObject(undefined, true);
}

private  loadFromFile(): void {
	openSave();
	showStats();
	statScreenRefresh();
}

private  autosaveToggle(): void {
	player.autoSave = !player.autoSave;
	saveLoad();
}

public  deleteScreen(): void
{
	clearOutput();
	outputText("Slot, Race, Sex, Game Days Played\n");


var  delFuncs: any[] = [];


	for (var i: number = 0; i < saveFileNames.length; i += 1)
	{
	var  test: Record<string, any> = SharedObject.getLocal(saveFileNames[i], "/");
		outputText(loadSaveDisplay(test, String(i + 1)));
		if (test.data.exists)
		{
			//slots[i] = loadFuncs[i];

			//trace("Creating function with indice = ", i);
			(function(i: number): void		// messy hack to work around closures. See: http://en.wikipedia.org/wiki/Immediately-invoked_function_expression
			{
				delFuncs[i] = function() : void 		// Anonymous functions FTW
				{
							flags[kFLAGS.TEMP_STORAGE_SAVE_DELETION] = saveFileNames[i];
							confirmDelete();
				}
			})(i);
		}
		else
			delFuncs[i] = undefined;	//disable buttons for empty slots
	}

	outputText("\n<b>ONCE DELETED, YOUR SAVE IS GONE FOREVER.</b>");
	menu();
var  s: number = 0
	while (s < 14) {
		if (delFuncs[s] != undefined) addButton(s, "Slot " + (s+1), delFuncs[s]);
		s++;
	}
	addButton(14, "Back", saveLoad);
}

public  confirmDelete(): void
{
	clearOutput();
	outputText("You are about to delete the following save: <b>" + flags[kFLAGS.TEMP_STORAGE_SAVE_DELETION] + "</b>\n\nAre you sure you want to delete it?");
	menu();
	addButton(0, "No", deleteScreen);
	addButton(1, "Yes", purgeTheMutant);
}

public  purgeTheMutant(): void
{
var  test: any = SharedObject.getLocal(flags[kFLAGS.TEMP_STORAGE_SAVE_DELETION], "/");
	//trace("DELETING SLOT: " + flags[kFLAGS.TEMP_STORAGE_SAVE_DELETION]);
var  blah: any[] = ["been virus bombed", "been purged", "been vaped", "been nuked from orbit", "taken an arrow to the knee", "fallen on its sword", "lost its reality matrix cohesion", "been cleansed", "suffered the following error: (404) Porn Not Found", "been deleted"];

	//trace(blah.length + " array slots");
var  select: number = rand(blah.length);
	clearOutput();
	outputText(flags[kFLAGS.TEMP_STORAGE_SAVE_DELETION] + " has " + blah[select] + ".");
	test.clear();
	doNext(deleteScreen);
}

public  confirmOverwrite(slot: string): void {
	mainView.nameBox.visible = false;
	clearOutput();
	outputText("You are about to overwrite the following save slot: " + slot + ".");
	outputText("\n\n<i>If you choose to overwrite a save file from the original CoC, it will no longer be playable on the original version. I recommend you use slots 10-14 for saving on the mod.</i>");
	outputText("\n\n<b>ARE YOU SURE?</b>");
	doYesNo(createCallBackFunction(saveGame, slot), saveScreen);
}

public  saveGame(slot: string, bringPrompt: boolean = false): void
{
var  saveFile: any = SharedObject.getLocal(slot, "/");
	if (player.slotName != slot && saveFile.data.exists && bringPrompt) {
		confirmOverwrite(slot);
		return;
	}
	player.slotName = slot;
	saveGameObject(slot, false);
}

public  loadGame(slot: string): void
{
var  saveFile: any = SharedObject.getLocal(slot, "/");

	// Check the property count of the file
var  numProps: number = 0;
	for (var prop: string in saveFile.data)
	{
		numProps++;
	}

var  sfVer: any;
	if (saveFile.data.version == undefined)
	{
		sfVer = versionProperties["legacy"];
	}
	else
	{
		sfVer = versionProperties[saveFile.data.version];
	}

	if (!(sfVer is Number))
	{
		sfVer = versionProperties["latest"];
	} else {
		sfVer = sfVer as Number;
	}

	//trace("File version "+(saveFile.data.version || "legacy")+"expects propNum " + sfVer);

	if (numProps < sfVer)
	{
		//trace("Got " + numProps + " file properties -- failed!");
		clearOutput();
		outputText("<b>Aborting load. The current save file is missing a number of expected properties.</b>\n\n");

	var  backup:SharedObject = SharedObject.getLocal(slot + "_backup", "/");

		if (backup.data.exists)
		{
			outputText("Would you like to load the backup version of this slot?");
			menu();
			SaveGameUtils.copySaveGame(slot + "_backup", TEMP_SAVEGAME);
			addButton(0, "Yes", loadGame, TEMP_SAVEGAME);
			addButton(1, "No", saveLoad);
		}
		else
		{
			menu();
			addButton(0, "Next", saveLoad);
		}
	}
	else
	{
		//trace("Got " + numProps + " file properties -- success!");
		// I want to be able to write some debug stuff to the GUI during the loading process
		// Therefore, we clear the display *before* calling loadGameObject
		clearOutput();

		loadGameObject(tempSharedObject(slot), slot);
		loadPermObject();
		outputText("Game Loaded");
		temp = 0;

		if (player.slotName == "VOID")
		{
			//trace("Setting in-use save slot to: " + slot);
			player.slotName = slot;
		}
		statScreenRefresh();
		doNext(playerMenu);
	}
}

/**
 * Create and return a copy of the given savegame slot.
 * @param slot name of the savegame to load
 * @return The object of a copy of the savegame
 */
private  tempSharedObject(slot: string): any
{
	SaveGameUtils.copySaveGame(slot, TEMP_SAVEGAME);
	return SharedObject.getLocal(TEMP_SAVEGAME, "/");
}
/**
 * Set the filename that is used to save and load the perm object,
 * which permanently stores data accross games, e.g. achievments.
 * This file will show up in the same directory as the save games.
 * @param	filename to use for the perm object file
 */
public  setPermObjectFilename(filename: string): void
{
	this.permObjectFileName = filename;
	LOGGER.debug("Filename for perm object was set to {0}", filename);
}

//Used for tracking achievements.
public  savePermObject(isFile: boolean): void {
	//Initialize the save file
var  saveFile: any;
var  backup:SharedObject;
	if (isFile)
	{
		saveFile = {};

		saveFile.data = {};
	}
	else
	{
		saveFile = SharedObject.getLocal(permObjectFileName, "/");
	}

	saveFile.data.exists = true;
	saveFile.data.version = ver;

var  processingError: boolean = false;
var  dataError:Error;

	try {
	var  i: number
		//flag settings
		saveFile.data.flags = [];
		for (i = 0; i < achievements.length; i++) {
			if (flags[i] != 0)
			{
				saveFile.data.flags[i] = 0;
			}
		}
		saveFile.data.flags[kFLAGS.NEW_GAME_PLUS_BONUS_UNLOCKED_HERM] = flags[kFLAGS.NEW_GAME_PLUS_BONUS_UNLOCKED_HERM];
		saveFile.data.flags[kFLAGS.GRIMDARK_BACKGROUND_UNLOCKED] = flags[kFLAGS.GRIMDARK_BACKGROUND_UNLOCKED];

		saveFile.data.flags[kFLAGS.SHOW_SPRITES_FLAG] = flags[kFLAGS.SHOW_SPRITES_FLAG];
		saveFile.data.flags[kFLAGS.SILLY_MODE_ENABLE_FLAG] = flags[kFLAGS.SILLY_MODE_ENABLE_FLAG];
		saveFile.data.flags[kFLAGS.PRISON_ENABLED] = flags[kFLAGS.PRISON_ENABLED];
		saveFile.data.flags[kFLAGS.WATERSPORTS_ENABLED] = flags[kFLAGS.WATERSPORTS_ENABLED];
		saveFile.data.flags[kFLAGS.ADDICTIONS_ENABLED] = flags[kFLAGS.ADDICTIONS_ENABLED];

		saveFile.data.flags[kFLAGS.USE_OLD_INTERFACE] = flags[kFLAGS.USE_OLD_INTERFACE];
		saveFile.data.flags[kFLAGS.USE_OLD_FONT] = flags[kFLAGS.USE_OLD_FONT];
		saveFile.data.flags[kFLAGS.TEXT_BACKGROUND_STYLE] = flags[kFLAGS.TEXT_BACKGROUND_STYLE];
		saveFile.data.flags[kFLAGS.CUSTOM_FONT_SIZE] = flags[kFLAGS.CUSTOM_FONT_SIZE];
		if ((flags[kFLAGS.GRIMDARK_MODE] == 0 && flags[kFLAGS.GRIMDARK_BACKGROUND_UNLOCKED] == 0) || (flags[kFLAGS.GRIMDARK_MODE] == 1 && flags[kFLAGS.GRIMDARK_BACKGROUND_UNLOCKED] == 1)) saveFile.data.flags[kFLAGS.BACKGROUND_STYLE] = flags[kFLAGS.BACKGROUND_STYLE];
		saveFile.data.flags[kFLAGS.IMAGEPACK_ENABLED] = flags[kFLAGS.IMAGEPACK_ENABLED];
		saveFile.data.flags[kFLAGS.SFW_MODE] = flags[kFLAGS.SFW_MODE];
		saveFile.data.flags[kFLAGS.ANIMATE_STATS_BARS] = flags[kFLAGS.ANIMATE_STATS_BARS];
		saveFile.data.flags[kFLAGS.ENEMY_STATS_BARS_ENABLED] = flags[kFLAGS.ENEMY_STATS_BARS_ENABLED];
		saveFile.data.flags[kFLAGS.USE_12_HOURS] = flags[kFLAGS.USE_12_HOURS];
		saveFile.data.flags[kFLAGS.AUTO_LEVEL] = flags[kFLAGS.AUTO_LEVEL];
		saveFile.data.flags[kFLAGS.USE_METRICS] = flags[kFLAGS.USE_METRICS];
		saveFile.data.flags[kFLAGS.DISABLE_QUICKLOAD_CONFIRM] = flags[kFLAGS.DISABLE_QUICKLOAD_CONFIRM];
		saveFile.data.flags[kFLAGS.DISABLE_QUICKSAVE_CONFIRM] = flags[kFLAGS.DISABLE_QUICKSAVE_CONFIRM];
		
		saveFile.data.charviewEnabled = GameSettings.charviewEnabled;

		//achievements
		saveFile.data.achievements = [];
		for (i = 0; i < achievements.length; i++)
		{
			// Don't save unset/default achievements
			if (achievements[i] != 0)
			{
				saveFile.data.achievements[i] = achievements[i];
			}
		}
		if (getGame().permObjVersionID != 0)
			saveFile.data.permObjVersionID = getGame().permObjVersionID;
	}
	catch (error:Error)
	{
		processingError = true;
		dataError = error;
		//trace(error.message);
	}
	//trace("done saving achievements");
}

public  loadPermObject(): void {
var  saveFile: any = SharedObject.getLocal(permObjectFileName, "/");
	LOGGER.info("Loading achievements from {0}!", permObjectFileName);
	//Initialize the save file
	//var saveFile: Record<string, any> = loader.data.readObject();
	if (saveFile.data.exists)
	{
		//Load saved flags.
		if (saveFile.data.flags) {
			if (saveFile.data.flags[kFLAGS.NEW_GAME_PLUS_BONUS_UNLOCKED_HERM] != undefined) flags[kFLAGS.NEW_GAME_PLUS_BONUS_UNLOCKED_HERM] = saveFile.data.flags[kFLAGS.NEW_GAME_PLUS_BONUS_UNLOCKED_HERM];
			if (saveFile.data.flags[kFLAGS.GRIMDARK_BACKGROUND_UNLOCKED] != undefined) flags[kFLAGS.GRIMDARK_BACKGROUND_UNLOCKED] = saveFile.data.flags[kFLAGS.GRIMDARK_BACKGROUND_UNLOCKED];

			if (saveFile.data.flags[kFLAGS.SHOW_SPRITES_FLAG] != undefined)
				flags[kFLAGS.SHOW_SPRITES_FLAG] = saveFile.data.flags[kFLAGS.SHOW_SPRITES_FLAG];
			else
				flags[kFLAGS.SHOW_SPRITES_FLAG] = 2;
			if (saveFile.data.flags[kFLAGS.SILLY_MODE_ENABLE_FLAG] != undefined) flags[kFLAGS.SILLY_MODE_ENABLE_FLAG] = saveFile.data.flags[kFLAGS.SILLY_MODE_ENABLE_FLAG];
			if (saveFile.data.flags[kFLAGS.PRISON_ENABLED] != undefined) flags[kFLAGS.PRISON_ENABLED] = saveFile.data.flags[kFLAGS.PRISON_ENABLED];
			if (saveFile.data.flags[kFLAGS.WATERSPORTS_ENABLED] != undefined) flags[kFLAGS.WATERSPORTS_ENABLED] = saveFile.data.flags[kFLAGS.WATERSPORTS_ENABLED];
			if (saveFile.data.flags[kFLAGS.ADDICTIONS_ENABLED] != undefined)
				flags[kFLAGS.ADDICTIONS_ENABLED] = saveFile.data.flags[kFLAGS.ADDICTIONS_ENABLED];
			else
				flags[kFLAGS.ADDICTIONS_ENABLED] = 1;

			if (saveFile.data.flags[kFLAGS.USE_OLD_INTERFACE] != undefined) flags[kFLAGS.USE_OLD_INTERFACE] = saveFile.data.flags[kFLAGS.USE_OLD_INTERFACE];
			if (saveFile.data.flags[kFLAGS.USE_OLD_FONT] != undefined) flags[kFLAGS.USE_OLD_FONT] = saveFile.data.flags[kFLAGS.USE_OLD_FONT];
			if (saveFile.data.flags[kFLAGS.TEXT_BACKGROUND_STYLE] != undefined) flags[kFLAGS.TEXT_BACKGROUND_STYLE] = saveFile.data.flags[kFLAGS.TEXT_BACKGROUND_STYLE];
			if (saveFile.data.flags[kFLAGS.CUSTOM_FONT_SIZE] != undefined) flags[kFLAGS.CUSTOM_FONT_SIZE] = saveFile.data.flags[kFLAGS.CUSTOM_FONT_SIZE];
			if (saveFile.data.flags[kFLAGS.BACKGROUND_STYLE] != undefined) flags[kFLAGS.BACKGROUND_STYLE] = saveFile.data.flags[kFLAGS.BACKGROUND_STYLE];
			if (saveFile.data.flags[kFLAGS.IMAGEPACK_ENABLED] != undefined)
				flags[kFLAGS.IMAGEPACK_ENABLED] = saveFile.data.flags[kFLAGS.IMAGEPACK_ENABLED];
			else
				flags[kFLAGS.IMAGEPACK_ENABLED] = 1;
			if (saveFile.data.flags[kFLAGS.SFW_MODE] != undefined) flags[kFLAGS.SFW_MODE] = saveFile.data.flags[kFLAGS.SFW_MODE];
			if (saveFile.data.flags[kFLAGS.ANIMATE_STATS_BARS] != undefined)
				flags[kFLAGS.ANIMATE_STATS_BARS] = saveFile.data.flags[kFLAGS.ANIMATE_STATS_BARS];
			else
				flags[kFLAGS.ANIMATE_STATS_BARS] = 1; //Default to ON.
			if (saveFile.data.flags[kFLAGS.ENEMY_STATS_BARS_ENABLED] != undefined)
				flags[kFLAGS.ENEMY_STATS_BARS_ENABLED] = saveFile.data.flags[kFLAGS.ENEMY_STATS_BARS_ENABLED];
			else
				flags[kFLAGS.ENEMY_STATS_BARS_ENABLED] = 1; //Default to ON.
			if (saveFile.data.flags[kFLAGS.USE_12_HOURS] != undefined) flags[kFLAGS.USE_12_HOURS] = saveFile.data.flags[kFLAGS.USE_12_HOURS];
			if (saveFile.data.flags[kFLAGS.AUTO_LEVEL] != undefined) flags[kFLAGS.AUTO_LEVEL] = saveFile.data.flags[kFLAGS.AUTO_LEVEL];
			if (saveFile.data.flags[kFLAGS.USE_METRICS] != undefined) flags[kFLAGS.USE_METRICS] = saveFile.data.flags[kFLAGS.USE_METRICS];
			if (saveFile.data.flags[kFLAGS.DISABLE_QUICKLOAD_CONFIRM] != undefined) flags[kFLAGS.DISABLE_QUICKLOAD_CONFIRM] = saveFile.data.flags[kFLAGS.DISABLE_QUICKLOAD_CONFIRM];
			if (saveFile.data.flags[kFLAGS.DISABLE_QUICKSAVE_CONFIRM] != undefined) flags[kFLAGS.DISABLE_QUICKSAVE_CONFIRM] = saveFile.data.flags[kFLAGS.DISABLE_QUICKSAVE_CONFIRM];
		}
		if (saveFile.data.charviewEnabled != undefined) {
			GameSettings.charviewEnabled = saveFile.data.charviewEnabled;
		}
		//Grimdark
		if (flags[kFLAGS.GRIMDARK_MODE] >= 1 && saveFile.data.flags[kFLAGS.GRIMDARK_BACKGROUND_UNLOCKED] == 0) {
			flags[kFLAGS.BACKGROUND_STYLE] = 9;
		}
		//achievements, will check if achievement exists.
		if (saveFile.data.achievements) {
			for (var i: number = 0; i < achievements.length; i++)
			{
				if (saveFile.data.achievements[i] != undefined)
					achievements[i] = saveFile.data.achievements[i];
			}
		}

		if (saveFile.data.permObjVersionID != undefined) {
			getGame().permObjVersionID = saveFile.data.permObjVersionID;
			LOGGER.debug("Found internal permObjVersionID:{0}", getGame().permObjVersionID);
		}

		if (getGame().permObjVersionID < 1039900) {
			// apply fix for issue #337 (Wrong IDs in kACHIEVEMENTS conflicting with other achievements)
			achievements[kACHIEVEMENTS.ZONE_EXPLORER] = 0;
			achievements[kACHIEVEMENTS.ZONE_SIGHTSEER] = 0;
			achievements[kACHIEVEMENTS.GENERAL_PORTAL_DEFENDER] = 0;
			achievements[kACHIEVEMENTS.GENERAL_BAD_ENDER] = 0;
			getGame().permObjVersionID = 1039900;
			savePermObject(false);
			LOGGER.debug("PermObj internal versionID updated:{0}", getGame().permObjVersionID);
		}
	}
	else { //Defaults certain settings for first-time startup.
		flags[kFLAGS.IMAGEPACK_ENABLED] = 1;
		flags[kFLAGS.SHOW_SPRITES_FLAG] = 2;
		flags[kFLAGS.ANIMATE_STATS_BARS] = 1;
	}
}

/**
 * Save the current game state to the given save game slot. This can be any string, 
 * but the game only will list slot1 to slot15 for loading in the GUI.
 * 
 * The menu handles loading from and saving to saves and Files, deleting saves and recovering
 * savegames from backups.
 * Creates backup saves on save. Contains error handling code for failed saves and loads.
 * 
 * @param	slot the file name to save to
 * @param	isFile true if the save is a file, if false a SharedObject is used
 */
public  saveGameObject(slot: string, isFile: boolean): void
{
	//Autosave stuff
	if (player.slotName != "VOID")
		player.slotName = slot;

var  backupAborted: boolean = false;

	//Initialize the save file
var  saveFile: any;
var  backup:SharedObject;
	if (isFile)
	{
		saveFile = {};

		saveFile.data = {};
	}
	else
	{
		saveFile = SharedObject.getLocal(slot, "/");
	}

	//Notes
	if (mainView.nameBox.text != "")
	{
		notes = mainView.nameBox.text;
	}
	else
	{
		mainView.nameBox.visible = false;
	}
	if (flags[kFLAGS.HARDCORE_MODE] > 0)
	{
		notes = "<font color=\"#ff0000\">HARDCORE MODE</font>";
	}
	
var  processingError: boolean = false;
var  dataError:Error;

	try
	{
		writeGameStateToObject(saveFile);
	}
	catch (error:Error)
	{
		processingError = true;
		dataError = error;
		//trace(error.message);
	}


	//trace("done saving");
	// Because actionscript is stupid, there is no easy way to block until file operations are done.
	// Therefore, I'm hacking around it for the chaos monkey.
	// Really, something needs to listen for the FileReference.complete event, and re-enable saving/loading then.
	// Something to do in the future
	if (isFile && !processingError)
	{
		//outputText(serializeToString(saveFile.data)));
	var  bytes:ByteArray = new ByteArray();
		bytes.writeObject(saveFile);
		CONFIG::AIR
		{
			// saved filename: "name of character".coc
		var  airSaveDir:File = File.documentsDirectory.resolvePath(savedGameDir);
		var  airFile:File = airSaveDir.resolvePath(player.short + ".coc");
		var  stream:FileStream = new FileStream();
			try
			{
				airSaveDir.createDirectory();
				stream.open(airFile, FileMode.WRITE);
				stream.writeBytes(bytes);
				stream.close();
				clearOutput();
				outputText("Saved to file: " + airFile.url);
				doNext(playerMenu);
			}
			catch (error:Error)
			{
				backupAborted = true;
				clearOutput();
				outputText("Failed to write to file: " + airFile.url + " (" + error.message + ")\n\n");
				rawOutputText(error.getStackTrace());
				doNext(playerMenu);
			}
		}
		CONFIG::STANDALONE
		{
			file = new FileReference();
			file.save(bytes, undefined);
			clearOutput();
			outputText("Attempted to save to file.");
		}
	}
	else if (!processingError)
	{
		// Write the file
		saveFile.flush();

		// Reload it
		saveFile = SharedObject.getLocal(slot, "/");
		backup = SharedObject.getLocal(slot + "_backup", "/");
	var  numProps: number = 0;

		// Copy the properties over to a new file object
		for (var prop: string in saveFile.data)
		{
			numProps++;
			backup.data[prop] = saveFile.data[prop];
		}

		// There should be 124 root properties minimum in the save file. Give some wiggleroom for things that might be omitted? (All of the broken saves I've seen are MUCH shorter than expected)
		if (numProps < versionProperties[ver])
		{
			clearOutput();
			outputText("<b>Aborting save. Your current save file is broken, and needs to be bug-reported.</b>\n\nWithin the save folder for CoC, there should be a pair of files named \"" + slot + ".sol\" and \"" + slot + "_backup.sol\"\n\n<b>We need BOTH of those files, and a quick report of what you've done in the game between when you last saved, and this message.</b>\n\n");
			outputText("<b>Aborting save. Your current save file is broken, and needs to be bug-reported.</b>\n\nWithin the save folder for CoC, there should be a pair of files named \"" + slot + ".sol\" and \"" + slot + "_backup.sol\"\n\n<b>We need BOTH of those files, and a quick report of what you've done in the game between when you last saved, and this message.</b>\n\n");
			outputText("When you've sent us the files, you can copy the _backup file over your old save to continue from your last save.\n\n");
			outputText("Alternatively, you can just hit the restore button to overwrite the broken save with the backup... but we'd really like the saves first!");
			//trace("Backup Save Aborted! Broken save detected!");
			backupAborted = true;
		}
		else
		{
			// Property count is correct, write the backup
			backup.flush();
		}

		if (!backupAborted) {
			clearOutput();
			outputText("Saved to slot" + slot + "!");
		}
	}
	else
	{
		outputText("There was a processing error during saving. Please report the following message:\n\n");
		rawOutputText(dataError.message);
		outputText("\n\n");
		rawOutputText(dataError.getStackTrace());
	}

	if (!backupAborted)
	{
		doNext(playerMenu);
	}
	else
	{
		menu();
		addButton(0, "Next", playerMenu);
		addButton(9, "Restore", restore, slot);
	}

}

/**
 * Method to write the game state to an object, it is agnostic to the source of the object.
 * Method is protected for easy use in testing, as save files do not have to be used.
 * This allows for easier crafting of savegame states.
 * 
 * @param	saveFile the object where the game state should be written to
 */
protected  writeGameStateToObject(saveFile: any): void
{
	CoC.saveAllAwareClasses(getGame()); //Informs each saveAwareClass that it must save its values in the flags array
	
	//Set a single variable that tells us if this save exists

	saveFile.data.exists = true;
	
	saveFile.data.notes = notes;

	SerializationUtils.serialize(saveFile.data, this);
	saveFile.data.version = ver;
	flags[kFLAGS.SAVE_FILE_INTEGER_FORMAT_VERSION] = SAVE_FILE_CURRENT_INTEGER_FORMAT_VERSION;
	
	//flags
	saveFile.data.flags = [];
	for (var i: number = 0; i < flags.length; i++)
	{
		// Don't save unset/default flags
		if (flags[i] != 0)
		{
			saveFile.data.flags[i] = flags[i];
		}
	}

	//CLOTHING/ARMOR
	saveFile.data.armorId = player.armor.id;
	saveFile.data.weaponId = player.weapon.id;
	saveFile.data.jewelryId = player.jewelry.id;
	saveFile.data.shieldId = player.shield.id;
	saveFile.data.upperGarmentId = player.upperGarment.id;
	saveFile.data.lowerGarmentId = player.lowerGarment.id;
	saveFile.data.armorName = player.modArmorName;

	//saveFile.data.weaponName = player.weaponName;// uncomment for backward compatibility
	//saveFile.data.weaponVerb = player.weaponVerb;// uncomment for backward compatibility
	//saveFile.data.armorDef = player.armorDef;// uncomment for backward compatibility
	//saveFile.data.armorPerk = player.armorPerk;// uncomment for backward compatibility
	//saveFile.data.weaponAttack = player.weaponAttack;// uncomment for backward compatibility
	//saveFile.data.weaponPerk = player.weaponPerk;// uncomment for backward compatibility
	//saveFile.data.weaponValue = player.weaponValue;// uncomment for backward compatibility
	//saveFile.data.armorValue = player.armorValue;// uncomment for backward compatibility

	//PIERCINGS
	saveFile.data.nipplesPierced = player.nipplesPierced;
	saveFile.data.nipplesPShort = player.nipplesPShort;
	saveFile.data.nipplesPLong = player.nipplesPLong;
	saveFile.data.lipPierced = player.lipPierced;
	saveFile.data.lipPShort = player.lipPShort;
	saveFile.data.lipPLong = player.lipPLong;
	saveFile.data.tonguePierced = player.tonguePierced;
	saveFile.data.tonguePShort = player.tonguePShort;
	saveFile.data.tonguePLong = player.tonguePLong;
	saveFile.data.eyebrowPierced = player.eyebrowPierced;
	saveFile.data.eyebrowPShort = player.eyebrowPShort;
	saveFile.data.eyebrowPLong = player.eyebrowPLong;
	saveFile.data.earsPierced = player.earsPierced;
	saveFile.data.earsPShort = player.earsPShort;
	saveFile.data.earsPLong = player.earsPLong;
	saveFile.data.nosePierced = player.nosePierced;
	saveFile.data.nosePShort = player.nosePShort;
	saveFile.data.nosePLong = player.nosePLong;

	//Combat STATS
	saveFile.data.teaseLevel = player.teaseLevel;
	saveFile.data.teaseXP = player.teaseXP;
	//Prison STATS
	saveFile.data.hunger = player.hunger;
	saveFile.data.esteem = player.esteem;
	saveFile.data.obey = player.obey;
	saveFile.data.obeySoftCap = player.obeySoftCap;
	saveFile.data.will = player.will;

	saveFile.data.prisonItems = player.prisonItemSlots;
	//saveFile.data.prisonArmor = prison.prisonItemSlotArmor;
	//saveFile.data.prisonWeapon = prison.prisonItemSlotWeapon;
	//LEVEL STATS
	saveFile.data.perkPoints = player.perkPoints;
	saveFile.data.statPoints = player.statPoints;
	saveFile.data.ascensionPerkPoints = player.ascensionPerkPoints;
	//Appearance
	saveFile.data.startingRace = player.startingRace;
	saveFile.data.thickness = player.thickness;
	saveFile.data.tone = player.tone;
	saveFile.data.furColor = player.skin.furColor;
	saveFile.data.hairColor = player.hair.color;
	saveFile.data.hairType = player.hair.type;
	saveFile.data.gillType = player.gills.type;
	saveFile.data.armType = player.arms.type;
	saveFile.data.hairLength = player.hair.length;
	saveFile.data.beardLength = player.beard.length;
	saveFile.data.eyeType = player.eyes.type;
	saveFile.data.eyeCount = player.eyes.count;
	saveFile.data.beardStyle = player.beard.style;
	saveFile.data.skinType = player.skin.type;
	saveFile.data.skinTone = player.skin.tone;
	saveFile.data.skinDesc = player.skin.desc;
	saveFile.data.skinAdj = player.skin.adj;
	saveFile.data.faceType = player.face.type;
	saveFile.data.tongueType = player.tongue.type;
	saveFile.data.earType = player.ears.type;
	saveFile.data.earValue = player.ears.value;
	saveFile.data.antennae = player.antennae.type;
	saveFile.data.horns = player.horns.value;
	saveFile.data.hornType = player.horns.type;
	saveFile.data.underBody = player.underBody.toObject();
	saveFile.data.neck = player.neck.toObject();
	saveFile.data.rearBody = player.rearBody.toObject();
	// <mod name="Predator arms" author="Stadler76">
	saveFile.data.clawTone = player.arms.claws.tone;
	saveFile.data.clawType = player.arms.claws.type;
	// </mod>
	saveFile.data.wingType = player.wings.type;
	saveFile.data.wingColor = player.wings.color;
	saveFile.data.wingColor2 = player.wings.color2;
	saveFile.data.lowerBody = player.lowerBody.type;
	saveFile.data.legCount = player.lowerBody.legCount;
	saveFile.data.incorporeal = player.lowerBody.incorporeal;
	saveFile.data.tailType = player.tail.type;
	saveFile.data.tailVenum = player.tail.venom;
	saveFile.data.tailRecharge = player.tail.recharge;
	saveFile.data.hipRating = player.hips.rating;
	saveFile.data.buttRating = player.butt.rating;
	saveFile.data.udder = player.udder.toObject();

	//Preggo stuff
	saveFile.data.pregnancyIncubation = player.pregnancyIncubation;
	saveFile.data.pregnancyType = player.pregnancyType;
	saveFile.data.buttPregnancyIncubation = player.buttPregnancyIncubation;
	saveFile.data.buttPregnancyType = player.buttPregnancyType;

	/*myLocalData.data.furnitureArray = new Array();
	   for (var i: number = 0; i < GameArray.length; i++) {
	   myLocalData.data.girlArray.push(new Array());
	   myLocalData.data.girlEffectArray.push(new Array());
	 }*/

	saveFile.data.perks = [];
	saveFile.data.statusAffects = [];
	saveFile.data.keyItems = [];
	saveFile.data.gearStorage = [];

	//Set Perk Array
	//Populate Perk Array
	for (i = 0; i < player.perks.length; i++)
	{
		saveFile.data.perks.push([]);
		//trace("Saveone Perk");
		//trace("Populate One Perk");
		saveFile.data.perks[i].id = player.perk(i).ptype.id;
		//saveFile.data.perks[i].perkName = player.perk(i).ptype.id; //uncomment for backward compatibility
		saveFile.data.perks[i].value1 = player.perk(i).value1;
		saveFile.data.perks[i].value2 = player.perk(i).value2;
		saveFile.data.perks[i].value3 = player.perk(i).value3;
		saveFile.data.perks[i].value4 = player.perk(i).value4;
		//saveFile.data.perks[i].perkDesc = player.perk(i).perkDesc; // uncomment for backward compatibility
	}

	//Set Status Array
	for (i = 0; i < player.statusEffects.length; i++)
	{
		saveFile.data.statusAffects.push([]);
			//trace("Saveone statusEffects");
	}
	//Populate Status Array
	for (i = 0; i < player.statusEffects.length; i++)
	{
		//trace("Populate One statusEffects");
		saveFile.data.statusAffects[i].statusAffectName = player.statusEffect(i).stype.id;
		saveFile.data.statusAffects[i].value1 = player.statusEffect(i).value1;
		saveFile.data.statusAffects[i].value2 = player.statusEffect(i).value2;
		saveFile.data.statusAffects[i].value3 = player.statusEffect(i).value3;
		saveFile.data.statusAffects[i].value4 = player.statusEffect(i).value4;
		if (player.statusEffect(i).dataStore !== undefined) {
			saveFile.data.statusAffects[i].dataStore = player.statusEffect(i).dataStore;
		}
	}
	//Set keyItem Array
	for (i = 0; i < player.keyItems.length; i++)
	{
		saveFile.data.keyItems.push([]);
			//trace("Saveone keyItem");
	}
	//Populate keyItem Array
	for (i = 0; i < player.keyItems.length; i++)
	{
		//trace("Populate One keyItemzzzzzz");
		saveFile.data.keyItems[i].keyName = player.keyItems[i].keyName;
		saveFile.data.keyItems[i].value1 = player.keyItems[i].value1;
		saveFile.data.keyItems[i].value2 = player.keyItems[i].value2;
		saveFile.data.keyItems[i].value3 = player.keyItems[i].value3;
		saveFile.data.keyItems[i].value4 = player.keyItems[i].value4;
	}
	
	//Re-enabled for the tests.
	saveFile.data.inventory = [];
	SerializationUtils.serialize(saveFile.data.inventory, inventory);
	//Set gear slot array
	for (i = 0; i < gearStorageGet().length; i++)
	{
		saveFile.data.gearStorage.push([]);
	}

	//Populate gear slot array
	for (i = 0; i < gearStorageGet().length; i++)
	{
		//saveFile.data.gearStorage[i].shortName = gearStorage[i].itype.id;// uncomment for backward compatibility
		saveFile.data.gearStorage[i].id = (gearStorageGet()[i].isEmpty()) ? undefined : gearStorageGet()[i].itype.id;
		saveFile.data.gearStorage[i].quantity = gearStorageGet()[i].quantity;
		saveFile.data.gearStorage[i].unlocked = gearStorageGet()[i].unlocked;
		saveFile.data.gearStorage[i].damage = gearStorageGet()[i].damage;
	}

	saveFile.data.gameState = gameStateGet(); // Saving game state?

	//Time and Items
	saveFile.data.minutes = getGame().time.minutes;
	saveFile.data.hours = getGame().time.hours;
	saveFile.data.days = getGame().time.days;
	saveFile.data.autoSave = player.autoSave;

	// Save non-flag plot variables.
	saveFile.data.isabellaOffspringData = [];
	for (i = 0; i < kGAMECLASS.isabellaScene.isabellaOffspringData.length; i++) {
		saveFile.data.isabellaOffspringData.push(kGAMECLASS.isabellaScene.isabellaOffspringData[i]);
	}

	// Keybinds
	saveFile.data.controls = getGame().inputManager.SaveBindsToObj();
}

/**
 * Save NPCs to the save file. The NPC data is placed in the 'npcs' object (saveFile.data.npcs).
 * This method is protected instead of private to allow for testing.
 * @param	saveFile the file to save the NPC data to.
 */
private  saveNPCs(saveFile: any): void {
	saveFile.npcs = [];
var  npcs: any = saveFile.npcs;

	npcs.jojo = [];

	SerializationUtils.serialize(npcs.jojo, new Jojo());
}

public  restore(slotName: string): void
{
	clearOutput();
	// copy slot_backup.sol over slot.sol
var  backupFile:SharedObject = SharedObject.getLocal(slotName + "_backup", "/");
var  overwriteFile:SharedObject = SharedObject.getLocal(slotName, "/");

	for (var prop: string in backupFile.data)
	{
		overwriteFile.data[prop] = backupFile.data[prop];
	}

	overwriteFile.flush();

	clearOutput();
	outputText("Restored backup of " + slotName);
	menu();
	doNext(playerMenu);
}

public  openSave(): void
{
	CONFIG::AIR
	{
		loadScreenAIR();
	}
	CONFIG::STANDALONE
	{
		file = new FileReference();
		file.addEventListener(Event.SELECT, onFileSelected);
		file.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
		file.browse();
	}
	//var fileObj : Record<string, any> = readObjectFromStringBytes("");
	//loadGameFile(fileObj);
}


public  onFileSelected(evt:Event): void
{
	CONFIG::AIR
	{
		airFile.addEventListener(Event.COMPLETE, onFileLoaded);
		airFile.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
		airFile.load();
	}
	CONFIG::STANDALONE
	{
		file.addEventListener(Event.COMPLETE, onFileLoaded);
		file.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
		file.load();
	}
}

public  onFileLoaded(evt:Event): void
{
var  tempFileRef:FileReference = FileReference(evt.target);
	//trace("File target = ", evt.target);
	loader = new URLLoader();
	loader.dataFormat = URLLoaderDataFormat.BINARY;
	loader.addEventListener(Event.COMPLETE, onDataLoaded);
	loader.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
	try
	{
	var  req: any = new URLRequest(tempFileRef.name);
		loader.load(req);
	}
	catch (error:Error)
	{
		clearOutput();
		outputText("<b>!</b> Save file not found, check that it is in the same directory as the CoC.swf file.\n\nLoad from file is not available when playing directly from a website like furaffinity or fenoxo.com.");
	}
}

public  ioErrorHandler(e:IOErrorEvent): void
{
	clearOutput();
	outputText("<b>!</b> Save file not found, check that it is in the same directory as the CoC_" + ver + ".swf file.\r\rLoad from file is not available when playing directly from a website like furaffinity or fenoxo.com.");
	doNext(saveLoad);
}

public  onDataLoaded(evt:Event): void
{
	//var fileObj = readObjectFromStringBytes(loader.data);
	try
	{
		// I want to be able to write some debug stuff to the GUI during the loading process
		// Therefore, we clear the display *before* calling loadGameObject
		clearOutput();
		outputText("Loading save...");
		//trace("OnDataLoaded! - Reading data", loader, loader.data.readObject);
	var  tmpObj: Record<string, any> = loader.data.readObject();
		//trace("Read in object = ", tmpObj);

		CONFIG::debug
		{
			if (tmpObj == undefined)
			{
				throw new Error("Bad Save load?"); // Re throw error in debug mode.
			}
		}
		loadGameObject(tmpObj);
		outputText("Loaded Save");
	}
	catch (rangeError:RangeError)
	{
		clearOutput();
		outputText("<b>!</b> File is either corrupted or not a valid save");
		doNext(saveLoad);
	}
	catch (error:Error)
	{
		LOGGER.error(error.message+"\n"+error.getStackTrace());
		clearOutput();
		outputText("<b>!</b> Unhandled Exception");
		outputText("[pg]Failed to load save. The file may be corrupt!\n\n");
		//Dump stacktrace here.
		rawOutputText("<b>" + error.message + "</b>\n" + error.getStackTrace());
		doNext(saveLoad);
	}
	loadPermObject();
	statScreenRefresh();
	//playerMenu();
}

private  hasViridianCockSock(player:Player): boolean {
	for each (var cock:Cock in player.cocks) {
		if (cock.sock === "viridian") {
			return true;
		}
	}

	return false;
}

public  loadGameObject(saveData: Record<string, any>, slot: string = "VOID"): void
{
var  game:CoC = getGame();
	game.dungeonLoc = 0;
	//Not needed, dungeonLoc = 0 does this:	game.inDungeon = false;
	game.inDungeon = false; //Needed AGAIN because fuck includes folder. If it ain't broke, don't fix it!
	game.inRoomedDungeon = false;
	game.inRoomedDungeonResume = undefined;

	//Autosave stuff
	player.slotName = slot;

	//trace("Loading save!")
	//Initialize the save file
	//var saveFile: Record<string, any> = loader.data.readObject();
var  saveFile: any = saveData;
	if (saveFile.data.exists)
	{

		//KILL ALL COCKS;
		player = new Player();
		flags = new DefaultDict();

		SerializationUtils.deserialize(saveFile.data, this);
		//trace("Type of saveFile.data = ", getClass(saveFile.data));

		inventory.clearStorage();
		inventory.clearGearStorage();
		notes = saveFile.data.notes;

		//flags
		for (var i: number = 0; i < flags.length; i++)
		{
			if (saveFile.data.flags[i] != undefined)
				flags[i] = saveFile.data.flags[i];
		}

		if (saveFile.data.versionID != undefined) {
			game.versionID = saveFile.data.versionID;
			//trace("Found internal versionID:", game.versionID);
		}

		//PIERCINGS

		//trace("LOADING PIERCINGS");
		player.nipplesPierced = saveFile.data.nipplesPierced;
		player.nipplesPShort = saveFile.data.nipplesPShort;
		player.nipplesPLong = saveFile.data.nipplesPLong;
		player.lipPierced = saveFile.data.lipPierced;
		player.lipPShort = saveFile.data.lipPShort;
		player.lipPLong = saveFile.data.lipPLong;
		player.tonguePierced = saveFile.data.tonguePierced;
		player.tonguePShort = saveFile.data.tonguePShort;
		player.tonguePLong = saveFile.data.tonguePLong;
		player.eyebrowPierced = saveFile.data.eyebrowPierced;
		player.eyebrowPShort = saveFile.data.eyebrowPShort;
		player.eyebrowPLong = saveFile.data.eyebrowPLong;
		player.earsPierced = saveFile.data.earsPierced;
		player.earsPShort = saveFile.data.earsPShort;
		player.earsPLong = saveFile.data.earsPLong;
		player.nosePierced = saveFile.data.nosePierced;
		player.nosePShort = saveFile.data.nosePShort;
		player.nosePLong = saveFile.data.nosePLong;

		//CLOTHING/ARMOR
	var  found: boolean = false;
		if (saveFile.data.weaponId){
			player.setWeaponHiddenField((ItemType.lookupItem(saveFile.data.weaponId) as Weapon) || WeaponLib.FISTS);
		} else {
			player.setWeapon(WeaponLib.FISTS);
			//player.weapon = WeaponLib.FISTS;
			for each (var itype:ItemType in ItemType.getItemLibrary()) {
				if (itype is Weapon && (itype as Weapon).name == saveFile.data.weaponName){
					player.setWeaponHiddenField(itype as Weapon || WeaponLib.FISTS);
					found = true;
					break;
				}
			}
		}
		if (saveFile.data.shieldId){
			player.setShieldHiddenField((ItemType.lookupItem(saveFile.data.shieldId) as Shield) || ShieldLib.NOTHING);
		} else {
			player.setShield(ShieldLib.NOTHING);
			//player.weapon = WeaponLib.FISTS;
			for each (itype in ItemType.getItemLibrary()) {
				if (itype is Shield && (itype as Shield).name == saveFile.data.shieldName){
					player.setShieldHiddenField(itype as Shield || ShieldLib.NOTHING);
					found = true;
					break;
				}
			}
		}
		if (saveFile.data.jewelryId){
			player.setJewelryHiddenField((ItemType.lookupItem(saveFile.data.jewelryId) as Jewelry) || JewelryLib.NOTHING);
		} else {
			player.setJewelry(JewelryLib.NOTHING);
			for each (itype in ItemType.getItemLibrary()) {
				if (itype is Jewelry && (itype as Jewelry).name == saveFile.data.jewelryName){
					player.setJewelryHiddenField(itype as Jewelry || JewelryLib.NOTHING);
					found = true;
					break;
				}
			}
		}
		if (saveFile.data.upperGarmentId){
			player.setUndergarmentHiddenField((ItemType.lookupItem(saveFile.data.upperGarmentId) as Undergarment) || UndergarmentLib.NOTHING, UndergarmentLib.TYPE_UPPERWEAR);
		} else {
			player.setUndergarment(UndergarmentLib.NOTHING);
			for each (itype in ItemType.getItemLibrary()) {
				if (itype is Undergarment && (itype as Undergarment).name == saveFile.data.upperGarmentName){
					player.setUndergarmentHiddenField(itype as Undergarment || UndergarmentLib.NOTHING, UndergarmentLib.TYPE_UPPERWEAR);
					found = true;
					break;
				}
			}
		}
		if (saveFile.data.lowerGarmentId){
			player.setUndergarmentHiddenField((ItemType.lookupItem(saveFile.data.lowerGarmentId) as Undergarment) || UndergarmentLib.NOTHING, UndergarmentLib.TYPE_LOWERWEAR);
		} else {
			player.setUndergarment(UndergarmentLib.NOTHING);
			for each (itype in ItemType.getItemLibrary()) {
				if (itype is Undergarment && (itype as Undergarment).name == saveFile.data.lowerGarmentName){
					player.setUndergarmentHiddenField(itype as Undergarment || UndergarmentLib.NOTHING, UndergarmentLib.TYPE_LOWERWEAR);
					found = true;
					break;
				}
			}
		}
		if (saveFile.data.armorId){
			player.setArmorHiddenField((ItemType.lookupItem(saveFile.data.armorId) as Armor) || ArmorLib.COMFORTABLE_UNDERCLOTHES);
			if (player.armor.name != saveFile.data.armorName) player.modArmorName = saveFile.data.armorName;
		} else {
			found = false;
			player.setArmor(ArmorLib.COMFORTABLE_UNDERCLOTHES);
			//player.armor = ArmorLib.COMFORTABLE_UNDERCLOTHES;
			for each (itype in ItemType.getItemLibrary()) {
				if (itype is Armor && (itype as Armor).name == saveFile.data.armorName){
					player.setArmorHiddenField(itype as Armor || ArmorLib.COMFORTABLE_UNDERCLOTHES);
					found = true;
					break;
				}
			}
			if (!found){
				for each (itype in ItemType.getItemLibrary()){
					if (itype is Armor){
					var  a:Armor = itype as Armor;
						if (a.value == saveFile.data.armorValue &&
								a.def == saveFile.data.armorDef &&
								a.perk == saveFile.data.armorPerk){
							player.setArmor(a);
							//player.armor = a;
							player.modArmorName = saveFile.data.armorName;
							found = true;
							break;
						}
					}
				}
			}
		}

		//Combat STATS
		if (saveFile.data.teaseXP == undefined)
			player.teaseXP = 0;
		else
			player.teaseXP = saveFile.data.teaseXP;
		if (saveFile.data.teaseLevel == undefined)
			player.teaseLevel = 0;
		else
			player.teaseLevel = saveFile.data.teaseLevel;
		//Prison STATS
		if (saveFile.data.hunger == undefined)
			player.hunger = 50;
		else
			player.hunger = saveFile.data.hunger;
		if (saveFile.data.esteem == undefined)
			player.esteem = 50;
		else
			player.esteem = saveFile.data.esteem;
		if (saveFile.data.obey == undefined)
			player.obey = 0;
		else
			player.obey = saveFile.data.obey;
		if (saveFile.data.will == undefined)
			player.will = 50;
		else
			player.will = saveFile.data.will;
		if (saveFile.data.obeySoftCap == undefined)
			player.obeySoftCap = true;
		else
			player.obeySoftCap = saveFile.data.obeySoftCap;
		//Prison storage
		//Items
		if (saveFile.data.prisonItems == undefined) {
			//trace("Not found");
			player.prisonItemSlots = [];
		}
		else {
			//trace("Items FOUND!");
			//for (var k: number = 0; k < 10; i++) {
				player.prisonItemSlots = saveFile.data.prisonItems;
			//}
		}
		//Armour
		/*if (saveFile.data.prisonArmor == undefined) {
			trace("Armour not found");
			prison.prisonItemSlotArmor = undefined;
		}
		else {
			trace("Armour FOUND!");
			if (saveFile.data.prisonArmor is ItemType) {
				trace("Loading prison armour");
				prison.prisonItemSlotArmor = saveFile.data.prisonArmor;
			}
		}
		//Weapon
		if (saveFile.data.prisonWeapon == undefined) {
			trace("Weapon not found");
			prison.prisonItemSlotWeapon = undefined;
		}
		else {
			trace("Weapon FOUND!");
			if (saveFile.data.prisonWeapon is ItemType) {
				trace("Loading prison weapon");
				prison.prisonItemSlotWeapon = saveFile.data.prisonWeapon;
			}
		}*/

		if (saveFile.data.perkPoints == undefined)
			player.perkPoints = 0;
		else
			player.perkPoints = saveFile.data.perkPoints;

		if (saveFile.data.statPoints == undefined)
			player.statPoints = 0;
		else
			player.statPoints = saveFile.data.statPoints;

		if (saveFile.data.ascensionPerkPoints == undefined)
			player.ascensionPerkPoints = 0;
		else
			player.ascensionPerkPoints = saveFile.data.ascensionPerkPoints;

		//Appearance
		if (saveFile.data.startingRace != undefined)
			player.startingRace = saveFile.data.startingRace;
		//EYES
		if (saveFile.data.eyeType == undefined)
			player.eyes.type = Eyes.HUMAN;
		else
			player.eyes.type = saveFile.data.eyeType;
		//BEARS
		if (saveFile.data.beardLength == undefined)
			player.beard.length = 0;
		else
			player.beard.length = saveFile.data.beardLength;
		if (saveFile.data.beardStyle == undefined)
			player.beard.style = 0;
		else
			player.beard.style = saveFile.data.beardStyle;
		//BODY STYLE
		if (saveFile.data.tone == undefined)
			player.tone = 50;
		else
			player.tone = saveFile.data.tone;
		if (saveFile.data.thickness == undefined)
			player.thickness = 50;
		else
			player.thickness = saveFile.data.thickness;

		if (saveFile.data.furColor == undefined || saveFile.data.furColor == "no")
			player.skin.furColor = saveFile.data.hairColor;
		else
			player.skin.furColor = saveFile.data.furColor;
		player.hair.color = saveFile.data.hairColor;
		if (saveFile.data.hairType == undefined)
			player.hair.type = 0;
		else
			player.hair.type = saveFile.data.hairType;
		if (saveFile.data.gillType != undefined)
			player.gills.type = saveFile.data.gillType;
		else if (saveFile.data.gills == undefined)
			player.gills.type = Gills.NONE;
		else
			player.gills.type = saveFile.data.gills ? Gills.ANEMONE : Gills.NONE;
		if (saveFile.data.armType == undefined)
			player.arms.type = Arms.HUMAN;
		else
			player.arms.type = saveFile.data.armType;
		player.hair.length = saveFile.data.hairLength;
		player.skin.type = saveFile.data.skinType;
		if (saveFile.data.skinAdj == undefined)
			player.skin.adj = "";
		else
			player.skin.adj = saveFile.data.skinAdj;
		player.skin.tone = saveFile.data.skinTone;
		player.skin.desc = saveFile.data.skinDesc;
		//Silently discard Skin.UNDEFINED
		if (player.skin.type == Skin.UNDEFINED)
		{
			player.skin.adj = "";
			player.skin.desc = "skin";
			player.skin.type = Skin.PLAIN;
		}
		//Convert from old skinDesc to new skinAdj + skinDesc!
		if (player.skin.desc.indexOf("smooth") != -1)
		{
			player.skin.adj = "smooth";
			if (player.hasPlainSkin())
				player.skin.desc = "skin";
			if (player.hasFur())
				player.skin.desc = "fur";
			if (player.hasScales())
				player.skin.desc = "scales";
			if (player.hasGooSkin())
				player.skin.desc = "goo";
		}
		if (player.skin.desc.indexOf("thick") != -1)
		{
			player.skin.adj = "thick";
			if (player.hasPlainSkin())
				player.skin.desc = "skin";
			if (player.hasFur())
				player.skin.desc = "fur";
			if (player.hasScales())
				player.skin.desc = "scales";
			if (player.hasGooSkin())
				player.skin.desc = "goo";
		}
		if (player.skin.desc.indexOf("rubber") != -1)
		{
			player.skin.adj = "rubber";
			if (player.hasPlainSkin())
				player.skin.desc = "skin";
			if (player.hasFur())
				player.skin.desc = "fur";
			if (player.hasScales())
				player.skin.desc = "scales";
			if (player.hasGooSkin())
				player.skin.desc = "goo";
		}
		if (player.skin.desc.indexOf("latex") != -1)
		{
			player.skin.adj = "latex";
			if (player.hasPlainSkin())
				player.skin.desc = "skin";
			if (player.hasFur())
				player.skin.desc = "fur";
			if (player.hasScales())
				player.skin.desc = "scales";
			if (player.hasGooSkin())
				player.skin.desc = "goo";
		}
		if (player.skin.desc.indexOf("slimey") != -1)
		{
			player.skin.adj = "slimey";
			if (player.hasPlainSkin())
				player.skin.desc = "skin";
			if (player.hasFur())
				player.skin.desc = "fur";
			if (player.hasScales())
				player.skin.desc = "scales";
			if (player.hasGooSkin())
				player.skin.desc = "goo";
		}
		player.face.type = saveFile.data.faceType;
		if (saveFile.data.tongueType == undefined)
			player.tongue.type = Tongue.HUMAN;
		else
			player.tongue.type = saveFile.data.tongueType;
		if (saveFile.data.earType == undefined)
			player.ears.type = Ears.HUMAN;
		else
			player.ears.type = saveFile.data.earType;
		if (saveFile.data.earValue == undefined)
			player.ears.value = 0;
		else
			player.ears.value = saveFile.data.earValue;
		if (saveFile.data.antennae == undefined)
			player.antennae.type = Antennae.NONE;
		else
			player.antennae.type = saveFile.data.antennae;
		player.horns.value = saveFile.data.horns;
		if (saveFile.data.hornType == undefined)
			player.horns.type = Horns.NONE;
		else
			player.horns.type = saveFile.data.hornType;

		if (isObject(saveFile.data.underBody))
			player.underBody.setAllProps(saveFile.data.underBody);
		if (isObject(saveFile.data.neck))
			player.neck.setAllProps(saveFile.data.neck);
		if (isObject(saveFile.data.rearBody))
			player.rearBody.setAllProps(saveFile.data.rearBody);
		// <mod name="Predator arms" author="Stadler76">
		player.arms.claws.tone = (saveFile.data.clawTone == undefined) ? ""               : saveFile.data.clawTone;
		player.arms.claws.type = (saveFile.data.clawType == undefined) ? Claws.NORMAL : saveFile.data.clawType;
		// </mod>

		player.wings.type = saveFile.data.wingType;
		player.wings.color = saveFile.data.wingColor || "no";
		player.wings.color2 = saveFile.data.wingColor2 || "no";
		player.lowerBody.type = saveFile.data.lowerBody;
		player.lowerBody.incorporeal = saveFile.data.incorporeal;
		player.tail.type = saveFile.data.tailType;
		player.tail.venom = saveFile.data.tailVenum;
		player.tail.recharge = saveFile.data.tailRecharge;
		player.hips.rating = saveFile.data.hipRating;
		player.butt.rating = saveFile.data.buttRating;

		if (player.hasDragonWings() && (["", "no"].indexOf(player.wings.color) !== -1 || ["", "no"].indexOf(player.wings.color2) !== -1)) {
			player.wings.color = player.skin.tone;
			player.wings.color2 = player.skin.tone;
		}

		if (player.wings.type == 8) {
			player.wings.restore();
			player.rearBody.setAllProps({type: RearBody.SHARK_FIN});
		}

		if (player.lowerBody.type === 4) {
			player.lowerBody.type = LowerBody.HOOFED;
			player.lowerBody.legCount = 4;
		}

		if (player.lowerBody.type === 24) {
			player.lowerBody.type = LowerBody.CLOVEN_HOOFED;
			player.lowerBody.legCount = 4;
		}

		if (saveFile.data.legCount == undefined) {
			if (player.lowerBody.type == LowerBody.DRIDER) {
				player.lowerBody.legCount = 8;
			}
			else if (player.lowerBody.type == 4) {
				player.lowerBody.legCount = 4;
				player.lowerBody.type = LowerBody.HOOFED;
			}
			else if (player.lowerBody.type == LowerBody.PONY) {
				player.lowerBody.legCount = 4;
			}
			else if (player.lowerBody.type == 24) {
				player.lowerBody.legCount = 4;
				player.lowerBody.type = LowerBody.CLOVEN_HOOFED;
			}
			else if (player.lowerBody.type == LowerBody.NAGA) {
				player.lowerBody.legCount = 1;
			}
			else if (player.lowerBody.type == LowerBody.GOO) {
				player.lowerBody.legCount = 1;
			}
			else player.lowerBody.legCount = 2;
		}
		else
			player.lowerBody.legCount = saveFile.data.legCount;

		if (player.eyes.type === Eyes.FOUR_SPIDER_EYES) {
			player.eyes.type = Eyes.SPIDER;
		}
		if (saveFile.data.eyeCount == undefined) {
			player.eyes.count = player.eyes.type === Eyes.SPIDER ? 4 : 2;
		} else {
			player.eyes.count = saveFile.data.eyeCount;
		}
		if (player.eyes.type === Eyes.SPIDER && player.eyes.count < 4) {
			player.eyes.count = 4;
		}

		// Fix deprecated and merged underBody-types
		switch (player.underBody.type) {
			case UnderBody.DRAGON: player.underBody.type = UnderBody.REPTILE; break;
			case UnderBody.WOOL:   player.underBody.type = UnderBody.FURRY;   break;
			default: //Move along.
		}
        if (isObject(saveFile.data.udder))
			player.udder.setAllProps(saveFile.data.udder);

		//Preggo stuff
		player.knockUpForce(saveFile.data.pregnancyType, saveFile.data.pregnancyIncubation);
		player.buttKnockUpForce(saveFile.data.buttPregnancyType, saveFile.data.buttPregnancyIncubation);

	var  hasHistoryPerk: boolean = false;
	var  hasLustyRegenPerk: boolean = false;
	var  addedSensualLover: boolean = false;

		//Populate Perk Array
		for (i = 0; i < saveFile.data.perks.length; i++)
		{
		var  id: string = saveFile.data.perks[i].id || saveFile.data.perks[i].perkName;
		var  value1: number = saveFile.data.perks[i].value1;
		var  value2: number = saveFile.data.perks[i].value2;
		var  value3: number = saveFile.data.perks[i].value3;
		var  value4: number = saveFile.data.perks[i].value4;

			// Fix saves where the Whore perk might have been malformed.
			if (id == "History: Whote") id = "History: Whore";

			// Fix saves where the Lusty Regeneration perk might have been malformed.
			if (id == "Lusty Regeneration")
			{
				hasLustyRegenPerk = true;
			}
			else if (id == "LustyRegeneration")
			{
				id = "Lusty Regeneration";
				hasLustyRegenPerk = true;
			}

			// Some shit checking to track if the incoming data has an available History perk
			if (id.indexOf("History:") != -1)
			{
				hasHistoryPerk = true;
			}

		var  ptype:PerkType = PerkType.lookupPerk(id);

			if (ptype == undefined)
			{
				//trace("ERROR: Unknown perk id="+id);

				//(saveFile.data.perks as Array).splice(i,1);
				// NEVER EVER EVER MODIFY DATA IN THE SAVE FILE LIKE THIS. EVER. FOR ANY REASON.
			}
			else
			{
				//trace("Creating perk : " + ptype);
				player.createPerk(ptype,value1,value2,value3,value4);

				if (isNaN(player.perk(player.numPerks - 1).value1))
				{
					if (player.perk(player.numPerks - 1).perkName == "Wizard's Focus")
					{
						player.perk(player.numPerks - 1).value1 = .3;
					}
					else
					{
						player.perk(player.numPerks).value1 = 0;
					}

					//trace("NaN byaaaatch: " + player.perk(player.numPerks - 1).value1);
				}

				if (player.perk(player.numPerks - 1).perkName == "Wizard's Focus")
				{
					if (player.perk(player.numPerks - 1).value1 == 0 || player.perk(player.numPerks - 1).value1 < 0.1)
					{
						//trace("Wizard's Focus boosted up to par (.5)");
						player.perk(player.numPerks - 1).value1 = .5;
					}
				}
			}
		}

		// Fixup missing History: Whore perk IF AND ONLY IF the flag used to track the prior selection of a history perk has been set
		if (hasHistoryPerk == false && flags[kFLAGS.HISTORY_PERK_SELECTED] != 0)
		{
			player.createPerk(PerkLib.HistoryWhore, 0, 0, 0, 0);
		}

		// Fixup missing Lusty Regeneration perk, if the player has an equipped viridian cock sock and does NOT have the Lusty Regeneration perk
		if (hasViridianCockSock(kGAMECLASS.player) === true && hasLustyRegenPerk === false)
		{
			player.createPerk(PerkLib.LustyRegeneration, 0, 0, 0, 0);
		}

		if (flags[kFLAGS.TATTOO_SAVEFIX_APPLIED] == 0)
		{
			// Fix some tatto texts that could be broken
			if (flags[kFLAGS.VAPULA_TATTOO_LOWERBACK] is String && (flags[kFLAGS.VAPULA_TATTOO_LOWERBACK] as String).indexOf("lower back.lower back") != -1)
			{
				flags[kFLAGS.VAPULA_TATTOO_LOWERBACK] = (flags[kFLAGS.VAPULA_TATTOO_LOWERBACK] as String).split(".")[0] + ".";
			}


		var  refunds: number = 0;

			if (flags[kFLAGS.JOJO_TATTOO_LOWERBACK] is String)
			{
				refunds++;
				flags[kFLAGS.JOJO_TATTOO_LOWERBACK] = 0;
			}

			if (flags[kFLAGS.JOJO_TATTOO_BUTT] is String)
			{
				refunds++;
				flags[kFLAGS.JOJO_TATTOO_BUTT] = 0;
			}

			if (flags[kFLAGS.JOJO_TATTOO_COLLARBONE] is String)
			{
				refunds++;
				flags[kFLAGS.JOJO_TATTOO_COLLARBONE] = 0;
			}

			if (flags[kFLAGS.JOJO_TATTOO_SHOULDERS] is String)
			{
				refunds++;
				flags[kFLAGS.JOJO_TATTOO_SHOULDERS] = 0;
			}

			player.gems += 50 * refunds;
			flags[kFLAGS.TATTOO_SAVEFIX_APPLIED] = 1;
		}

		if (flags[kFLAGS.FOLLOWER_AT_FARM_MARBLE] == 1)
		{
			flags[kFLAGS.FOLLOWER_AT_FARM_MARBLE] = 0;
			//trace("Force-reverting Marble At Farm flag to 0.");
		}

		//Set Status Array
		for (i = 0; i < saveFile.data.statusAffects.length; i++)
		{
			if (saveFile.data.statusAffects[i].statusAffectName == "Lactation EnNumbere") continue; // ugh...
		var  stype:StatusEffectType = StatusEffectType.lookupStatusEffect(saveFile.data.statusAffects[i].statusAffectName);
			if (stype == undefined){
				CoC_Settings.error("Cannot find status affect '"+saveFile.data.statusAffects[i].statusAffectName+"'");
				continue;
			}
		var  sec:StatusEffect = player.createStatusEffect(
				stype,
				saveFile.data.statusAffects[i].value1,
				saveFile.data.statusAffects[i].value2,
				saveFile.data.statusAffects[i].value3,
				saveFile.data.statusAffects[i].value4,
				false
			);
			if (saveFile.data.statusAffects[i].dataStore !== undefined) {
				sec.dataStore = saveFile.data.statusAffects[i].dataStore;
			}
			//trace("StatusEffect " + player.statusEffect(i).stype.id + " loaded.");
		}
		//Make sure keyitems exist!
		if (saveFile.data.keyItems != undefined)
		{
			//Set keyItems Array
			for (i = 0; i < saveFile.data.keyItems.length; i++)
			{
				player.createKeyItem("TEMP", 0, 0, 0, 0);
			}
			//Populate keyItems Array
			for (i = 0; i < saveFile.data.keyItems.length; i++)
			{
				player.keyItems[i].keyName = saveFile.data.keyItems[i].keyName;
				player.keyItems[i].value1 = saveFile.data.keyItems[i].value1;
				player.keyItems[i].value2 = saveFile.data.keyItems[i].value2;
				player.keyItems[i].value3 = saveFile.data.keyItems[i].value3;
				player.keyItems[i].value4 = saveFile.data.keyItems[i].value4;
					//trace("KeyItem " + player.keyItems[i].keyName + " loaded.");
			}
		}
		
		//First load legacy inventory.
		if (saveFile.data.itemSlot1 != undefined && saveFile.data.flags[kFLAGS.MOD_SAVE_VERSION] < 16) {
		var  itemSlotsToAccess: any[] = [saveFile.data.itemSlot1, saveFile.data.itemSlot2, saveFile.data.itemSlot3, saveFile.data.itemSlot4, saveFile.data.itemSlot5, saveFile.data.itemSlot6, saveFile.data.itemSlot7, saveFile.data.itemSlot8, saveFile.data.itemSlot9, saveFile.data.itemSlot10];
			for (i = 0; i < itemSlotsToAccess.length; i++) {
				if (itemSlotsToAccess[i] == undefined || itemSlotsToAccess[i] == undefined) continue; //Skip over if missing.
				if (player.itemSlots.length < itemSlotsToAccess.length) player.itemSlots.push(new ItemSlot());
				player.itemSlots[i].unlocked = itemSlotsToAccess[i].unlocked;
				player.itemSlots[i].emptySlot(); //Clear before setting.
				player.itemSlots[i].setItemAndQty(ItemType.lookupItem(itemSlotsToAccess[i].id), itemSlotsToAccess[i].quantity);
				player.itemSlots[i].damage = itemSlotsToAccess[i].damage;
				//delete saveFile.data["itemSlot" + (i + 1).toString()]; //Remove old data.
			}
		}
		else if (saveFile.data.inventory != undefined) {
			SerializationUtils.deserialize(saveFile.data.inventory, inventory);
		}
		
	var  storage:ItemSlot;
		//Load legacy item storage.
		if (saveFile.data.inventory.itemStorage != undefined && saveFile.data.flags[kFLAGS.MOD_SAVE_VERSION] < 16)
		{
			for (i = 0; i < saveFile.data.inventory.itemStorage.length; i++)
			{
				//trace("Populating a storage slot save with data");
				inventory.createStorage();
				storage = inventory.itemStorageDirectGet()[i];
			var  savedIS: any = saveFile.data.inventory.itemStorage[i];
				if (savedIS.shortName)
				{
					if (savedIS.shortName.indexOf("Gro+") != -1)
						savedIS.id = "GroPlus";
					else if (savedIS.shortName.indexOf("Sp Honey") != -1)
						savedIS.id = "SpHoney";
				}
				if (savedIS.quantity > 0) {
					storage.setItemAndQty(ItemType.lookupItem(savedIS.id || savedIS.shortName), savedIS.quantity);
					storage.damage = savedIS.damage != undefined ? savedIS.damage : 0;
				} else {
					storage.emptySlot();
					storage.unlocked = savedIS.unlocked;
				}
				//delete saveFile.data.inventory.itemStorage[i]; //Clear the old data. Disabled as it messes up save.
			}
		}
		
		//Set gear slot array
		if (saveFile.data.gearStorage == undefined)
		{
			//trace("OLD SAVES DO NOT CONTAIN ITEM STORAGE ARRAY - Creating new!");
			inventory.initializeGearStorage();
		}
		else
		{
			for (i = 0; i < saveFile.data.gearStorage.length && gearStorageGet().length < 45; i++)
			{
				gearStorageGet().push(new ItemSlot());
					//trace("Initialize a slot for one of the item storage locations to load.");
			}
			//Populate storage slot array
			for (i = 0; i < saveFile.data.gearStorage.length && i < gearStorageGet().length; i++)
			{
				//trace("Populating a storage slot save with data");
				storage = gearStorageGet()[i];
				if ((saveFile.data.gearStorage[i].shortName == undefined && saveFile.data.gearStorage[i].id == undefined)
                        || saveFile.data.gearStorage[i].quantity == undefined
						|| saveFile.data.gearStorage[i].quantity == 0)
					storage.emptySlot();
				else {
					storage.setItemAndQty(ItemType.lookupItem(saveFile.data.gearStorage[i].id || saveFile.data.gearStorage[i].shortName), saveFile.data.gearStorage[i].quantity);
					storage.damage = saveFile.data.gearStorage[i].damage != undefined ? saveFile.data.gearStorage[i].damage : 0;
				}
				storage.unlocked = saveFile.data.gearStorage[i].unlocked;
			}
		}

		gameStateSet(saveFile.data.gameState);  // Loading game state

		//Days
		//Time and Items
		getGame().time.minutes = saveFile.data.minutes;
		getGame().time.hours = saveFile.data.hours;
		getGame().time.days = saveFile.data.days;
		if (saveFile.data.autoSave == undefined)
			player.autoSave = false;
		else
			player.autoSave = saveFile.data.autoSave;

		// Fix possible old save for Plot & Exploration
		flags[kFLAGS.TIMES_EXPLORED_LAKE]     = (flags[kFLAGS.TIMES_EXPLORED_LAKE] || saveFile.data.exploredLake || 0);
		flags[kFLAGS.TIMES_EXPLORED_MOUNTAIN] = (flags[kFLAGS.TIMES_EXPLORED_MOUNTAIN] || saveFile.data.exploredMountain || 0);
		flags[kFLAGS.TIMES_EXPLORED_FOREST]   = (flags[kFLAGS.TIMES_EXPLORED_FOREST] || saveFile.data.exploredForest || 0);
		flags[kFLAGS.TIMES_EXPLORED_DESERT]   = (flags[kFLAGS.TIMES_EXPLORED_DESERT] || saveFile.data.exploredDesert || 0);
		flags[kFLAGS.TIMES_EXPLORED]          = (flags[kFLAGS.TIMES_EXPLORED] || saveFile.data.explored || 0);

		flags[kFLAGS.JOJO_STATUS]        = (flags[kFLAGS.JOJO_STATUS] || saveFile.data.monk || 0);
		flags[kFLAGS.SANDWITCH_SERVICED] = (flags[kFLAGS.SANDWITCH_SERVICED] || saveFile.data.sand || 0);
		flags[kFLAGS.GIACOMO_MET]        = (flags[kFLAGS.GIACOMO_MET] || saveFile.data.giacomo || 0);

		if (saveFile.data.beeProgress == 1)
			game.forest.beeGirlScene.setTalked();

		kGAMECLASS.isabellaScene.isabellaOffspringData = [];
		if (saveFile.data.isabellaOffspringData == undefined) {
			//NOPE
		}
		else {
			for (i = 0; i < saveFile.data.isabellaOffspringData.length; i += 2) {
				kGAMECLASS.isabellaScene.isabellaOffspringData.push(saveFile.data.isabellaOffspringData[i], saveFile.data.isabellaOffspringData[i+1])
			}
		}

		CoC.loadAllAwareClasses(getGame()); //Informs each saveAwareClass that it must load its values from the flags array
		unFuckSave();

		// Control Bindings
		if (saveFile.data.controls != undefined)
		{
			game.inputManager.LoadBindsFromObj(saveFile.data.controls);
		}
		doNext(playerMenu);
	}
}

/**
 * Load NPCs from the save file. The NPC data is loaded from the 'npcs' object (saveFile.data.npcs).
 * Creates empty dummy structure if the NPC data is missing, to avoid errors on loading.
 * This method is protected instead of private to allow for testing.
 * @param	saveFile the file to save the NPC data to.
 */
private  loadNPCs(saveFile: any): void
{
var  npcs: any = saveFile.npcs;

	SerializationUtils.deserialize(npcs.jojo, new Jojo());
}

public  unFuckSave(): void
{
	//Fixing shit!
	if (player.wings.type == Wings.FEATHERED_LARGE && player.wings.color == "no") {
		// Player has harpy wings from an old save, let's fix its color
		player.wings.color = player.hasFur() ? player.skin.furColor : player.hair.color;
	}

	// Fix duplicate elven bounty perks
	if (player.findPerk(PerkLib.ElvenBounty) >= 0) {
		//CLear duplicates
		while(player.perkDuplicated(PerkLib.ElvenBounty)) player.removePerk(PerkLib.ElvenBounty);
		//Fix fudged preggers value
		if (player.perkv1(PerkLib.ElvenBounty) == 15) {
			player.setPerkValue(PerkLib.ElvenBounty,1,0);
			player.addPerkValue(PerkLib.ElvenBounty,2,15);
		}
	}

	while (player.hasStatusEffect(StatusEffects.KnockedBack))
	{
		player.removeStatusEffect(StatusEffects.KnockedBack);
	}

	if (player.hasStatusEffect(StatusEffects.Tentagrappled))
	{
		player.removeStatusEffect(StatusEffects.Tentagrappled);
	}

	if (isNaN(getGame().time.minutes)) getGame().time.minutes = 0;
	if (isNaN(getGame().time.hours)) getGame().time.hours = 0;
	if (isNaN(getGame().time.days)) getGame().time.days = 0;

	if (player.hasStatusEffect(StatusEffects.SlimeCraving) && player.statusEffectv4(StatusEffects.SlimeCraving) == 1) {
		player.changeStatusValue(StatusEffects.SlimeCraving, 3, player.statusEffectv2(StatusEffects.SlimeCraving)); //Duplicate old combined strength/speed value
		player.changeStatusValue(StatusEffects.SlimeCraving, 4, 1); //Value four indicates this tracks strength and speed separately
	}

	// Fix issues with corrupt cockTypes caused by a error in the serialization code.

	//trace("CockInfo = ", flags[kFLAGS.RUBI_COCK_TYPE]);
	//trace("getQualifiedClassName = ", getQualifiedClassName(flags[kFLAGS.RUBI_COCK_TYPE]));
	//trace("typeof = ", typeof(flags[kFLAGS.RUBI_COCK_TYPE]));
	//trace("is CockTypesEnum = ", flags[kFLAGS.RUBI_COCK_TYPE] is CockTypesEnum);
	//trace("instanceof CockTypesEnum = ", flags[kFLAGS.RUBI_COCK_TYPE] instanceof CockTypesEnum);



	if (!(flags[kFLAGS.RUBI_COCK_TYPE] is CockTypesEnum || flags[kFLAGS.RUBI_COCK_TYPE] is Number))
	{ // Valid contents of flags[kFLAGS.RUBI_COCK_TYPE] are either a CockTypesEnum or a number

		//trace("Fixing save (goo girl)");
		outputText("\n<b>Rubi's cockType is invalid. Defaulting him to human.</b>\n");
		flags[kFLAGS.RUBI_COCK_TYPE] = 0;
	}


	if (!(flags[kFLAGS.GOO_DICK_TYPE] is CockTypesEnum || flags[kFLAGS.GOO_DICK_TYPE] is Number))
	{ // Valid contents of flags[kFLAGS.GOO_DICK_TYPE] are either a CockTypesEnum or a number

		//trace("Fixing save (goo girl)");
		outputText("\n<b>Latex Goo-Girls's cockType is invalid. Defaulting him to human.</b>\n");
		flags[kFLAGS.GOO_DICK_TYPE] = 0;
	}

var  flagData: any[] = String(flags[kFLAGS.KATHERINE_BREAST_SIZE]).split("^");
	if (flagData.length < 7 && flags[kFLAGS.KATHERINE_BREAST_SIZE] > 0) { //Older format only stored breast size or zero if not yet initialized
		getGame().telAdre.katherine.breasts.cupSize			= flags[kFLAGS.KATHERINE_BREAST_SIZE];
		getGame().telAdre.katherine.breasts.lactationLevel	= BreastStore.LACTATION_DISABLED;
	}

	if (flags[kFLAGS.SAVE_FILE_INTEGER_FORMAT_VERSION] < 816) {
		//Older saves don't have pregnancy types for all impregnable NPCs. Have to correct this.
		//If anything is detected that proves this is a new format save then we can return immediately as all further checks are redundant.
		if (flags[kFLAGS.AMILY_INCUBATION] > 0) {
			if (flags[kFLAGS.AMILY_PREGNANCY_TYPE] != 0) return; //Must be a new format save
			flags[kFLAGS.AMILY_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_PLAYER;
		}
		if (flags[kFLAGS.AMILY_OVIPOSITED_COUNTDOWN] > 0) {
			if (flags[kFLAGS.AMILY_BUTT_PREGNANCY_TYPE] != 0) return; //Must be a new format save
			if (player.findPerk(PerkLib.SpiderOvipositor) >= 0)
				flags[kFLAGS.AMILY_BUTT_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_DRIDER_EGGS;
			else
				flags[kFLAGS.AMILY_BUTT_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_BEE_EGGS;
		}

		if (flags[kFLAGS.COTTON_PREGNANCY_INCUBATION] > 0) {
			if (flags[kFLAGS.COTTON_PREGNANCY_TYPE] != 0) return; //Must be a new format save
			flags[kFLAGS.COTTON_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_PLAYER;
		}

		if (flags[kFLAGS.EMBER_INCUBATION] > 0) {
			if (flags[kFLAGS.EMBER_PREGNANCY_TYPE] != 0) return; //Must be a new format save
			flags[kFLAGS.EMBER_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_PLAYER;
		}

		if (flags[kFLAGS.FEMALE_SPIDERMORPH_PREGNANCY_INCUBATION] > 0) {
			if (flags[kFLAGS.FEMALE_SPIDERMORPH_PREGNANCY_TYPE] != 0) return; //Must be a new format save
			flags[kFLAGS.FEMALE_SPIDERMORPH_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_PLAYER;
		}

		if (flags[kFLAGS.HELSPAWN_AGE] > 0) {
			kGAMECLASS.helScene.pregnancy.knockUpForce(); //Clear Pregnancy, also removed any old value from HEL_PREGNANCY_NOTICES
		}
		else if (flags[kFLAGS.HEL_PREGNANCY_INCUBATION] > 0) {
			if (flags[kFLAGS.HELIA_PREGNANCY_TYPE] > 3) return; //Must be a new format save
			//HELIA_PREGNANCY_TYPE was previously HEL_PREGNANCY_NOTICES, which ran from 0 to 3. Converted to the new format by multiplying by 65536
			//Since HelSpawn's father is already tracked separately we might as well just use PREGNANCY_PLAYER for all possible pregnancies
			flags[kFLAGS.HELIA_PREGNANCY_TYPE] = (65536 * flags[kFLAGS.HELIA_PREGNANCY_TYPE]) + PregnancyStore.PREGNANCY_PLAYER;
		}

		if (flags[kFLAGS.KELLY_INCUBATION] > 0) {
			if (flags[kFLAGS.KELLY_PREGNANCY_TYPE] != 0) return; //Must be a new format save
			flags[kFLAGS.KELLY_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_PLAYER;
		}

		if (flags[kFLAGS.MARBLE_PREGNANCY_TYPE] == PregnancyStore.PREGNANCY_PLAYER) return; //Must be a new format save
		if (flags[kFLAGS.MARBLE_PREGNANCY_TYPE] == PregnancyStore.PREGNANCY_OVIELIXIR_EGGS) return; //Must be a new format save
		if (flags[kFLAGS.MARBLE_PREGNANCY_TYPE] == 1) flags[kFLAGS.MARBLE_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_PLAYER;
		if (flags[kFLAGS.MARBLE_PREGNANCY_TYPE] == 2) flags[kFLAGS.MARBLE_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_OVIELIXIR_EGGS;

		if (flags[kFLAGS.PHYLLA_DRIDER_INCUBATION] > 0) {
			if (flags[kFLAGS.PHYLLA_VAGINAL_PREGNANCY_TYPE] != 0) return; //Must be a new format save
			flags[kFLAGS.PHYLLA_VAGINAL_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_DRIDER_EGGS;
			flags[kFLAGS.PHYLLA_DRIDER_INCUBATION] *= 24; //Convert pregnancy to days
		}

		if (flags[kFLAGS.SHEILA_PREGNANCY_INCUBATION] > 0) {
			if (flags[kFLAGS.SHEILA_PREGNANCY_TYPE] != 0) return; //Must be a new format save
			flags[kFLAGS.SHEILA_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_PLAYER;
			if (flags[kFLAGS.SHEILA_PREGNANCY_INCUBATION] >= 4)
				flags[kFLAGS.SHEILA_PREGNANCY_INCUBATION] = 0; //Was ready to be born
			else
				flags[kFLAGS.SHEILA_PREGNANCY_INCUBATION] = 24 * (4 - flags[kFLAGS.SHEILA_PREGNANCY_INCUBATION]); //Convert to hours and count down rather than up
		}

		if (flags[kFLAGS.SOPHIE_PREGNANCY_TYPE] != 0 && flags[kFLAGS.SOPHIE_INCUBATION] != 0) return; //Must be a new format save
		if (flags[kFLAGS.SOPHIE_PREGNANCY_TYPE] > 0 && flags[kFLAGS.SOPHIE_INCUBATION] == 0) { //She's in the wild and pregnant with an egg
			flags[kFLAGS.SOPHIE_INCUBATION] = flags[kFLAGS.SOPHIE_PREGNANCY_TYPE]; //SOPHIE_PREGNANCY_TYPE was previously SOPHIE_WILD_EGG_COUNTDOWN_TIMER
			flags[kFLAGS.SOPHIE_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_PLAYER;
		}
		else if (flags[kFLAGS.SOPHIE_PREGNANCY_TYPE] == 0 && flags[kFLAGS.SOPHIE_INCUBATION] > 0) {
			flags[kFLAGS.SOPHIE_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_PLAYER;
		}

		if (flags[kFLAGS.TAMANI_DAUGHTERS_PREGNANCY_TYPE] != 0) return; //Must be a new format save
		if (flags[kFLAGS.TAMANI_DAUGHTER_PREGGO_COUNTDOWN] > 0) {
			flags[kFLAGS.TAMANI_DAUGHTERS_PREGNANCY_TYPE]   = PregnancyStore.PREGNANCY_PLAYER;
			flags[kFLAGS.TAMANI_DAUGHTER_PREGGO_COUNTDOWN] *= 24; //Convert pregnancy to days
			flags[kFLAGS.TAMANI_DAUGHTERS_PREGNANCY_COUNT]  = player.statusEffectv3(StatusEffects.Tamani);
		}

		if (flags[kFLAGS.TAMANI_PREGNANCY_TYPE] != 0) return; //Must be a new format save
		if (player.hasStatusEffect(StatusEffects.TamaniFemaleEncounter)) player.removeStatusEffect(StatusEffects.TamaniFemaleEncounter); //Wasn't used in previous code
		if (player.hasStatusEffect(StatusEffects.Tamani)) {
			if (player.statusEffectv1(StatusEffects.Tamani) == -500) { //This used to indicate that a player had met Tamani as a male
				flags[kFLAGS.TAMANI_PREGNANCY_INCUBATION] = 0;
				flags[kFLAGS.TAMANI_MET]                  = 1; //This now indicates the same thing
			}
			else flags[kFLAGS.TAMANI_PREGNANCY_INCUBATION] = player.statusEffectv1(StatusEffects.Tamani) * 24; //Convert pregnancy to days
			flags[kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS] = player.statusEffectv2(StatusEffects.Tamani);
			flags[kFLAGS.TAMANI_PREGNANCY_COUNT]     = player.statusEffectv3(StatusEffects.Tamani);
			flags[kFLAGS.TAMANI_TIMES_IMPREGNATED]   = player.statusEffectv4(StatusEffects.Tamani);
			if (flags[kFLAGS.TAMANI_PREGNANCY_INCUBATION] > 0) flags[kFLAGS.TAMANI_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_PLAYER;
			player.removeStatusEffect(StatusEffects.Tamani);
		}

		if (flags[kFLAGS.EGG_WITCH_TYPE] == PregnancyStore.PREGNANCY_BEE_EGGS || flags[kFLAGS.EGG_WITCH_TYPE] == PregnancyStore.PREGNANCY_DRIDER_EGGS) return; //Must be a new format save
		if (flags[kFLAGS.EGG_WITCH_TYPE] > 0) {
			if (flags[kFLAGS.EGG_WITCH_TYPE] == 1)
				flags[kFLAGS.EGG_WITCH_TYPE] = PregnancyStore.PREGNANCY_BEE_EGGS;
			else
				flags[kFLAGS.EGG_WITCH_TYPE] = PregnancyStore.PREGNANCY_DRIDER_EGGS;
			flags[kFLAGS.EGG_WITCH_COUNTER] = 24 * (8 - flags[kFLAGS.EGG_WITCH_COUNTER]); //Reverse the count and change to hours rather than days
		}

		if (player.buttPregnancyType == PregnancyStore.PREGNANCY_BEE_EGGS) return; //Must be a new format save
		if (player.buttPregnancyType == PregnancyStore.PREGNANCY_DRIDER_EGGS) return; //Must be a new format save
		if (player.buttPregnancyType == PregnancyStore.PREGNANCY_SANDTRAP_FERTILE) return; //Must be a new format save
		if (player.buttPregnancyType == PregnancyStore.PREGNANCY_SANDTRAP) return; //Must be a new format save
		if (player.buttPregnancyType == 2) player.buttKnockUpForce(PregnancyStore.PREGNANCY_BEE_EGGS, player.buttPregnancyIncubation);
		if (player.buttPregnancyType == 3) player.buttKnockUpForce(PregnancyStore.PREGNANCY_DRIDER_EGGS, player.buttPregnancyIncubation);
		if (player.buttPregnancyType == 4) player.buttKnockUpForce(PregnancyStore.PREGNANCY_SANDTRAP_FERTILE, player.buttPregnancyIncubation);
		if (player.buttPregnancyType == 5) player.buttKnockUpForce(PregnancyStore.PREGNANCY_SANDTRAP, player.buttPregnancyIncubation);

		//If dick length zero then player has never met Kath, no need to set flags. If her breast size is zero then set values for flags introduced with the employment expansion
		if (flags[kFLAGS.KATHERINE_BREAST_SIZE] != 0) return; //Must be a new format save
		if (flags[kFLAGS.KATHERINE_DICK_LENGTH] != 0) {
			flags[kFLAGS.KATHERINE_BREAST_SIZE]		= BreastCup.B;
			flags[kFLAGS.KATHERINE_BALL_SIZE]		= 1;
			flags[kFLAGS.KATHERINE_HAIR_COLOR]		= "neon pink";
			flags[kFLAGS.KATHERINE_HOURS_SINCE_CUM] = 200; //Give her maxed out cum for that first time
		}

		if (flags[kFLAGS.URTA_PREGNANCY_TYPE] == PregnancyStore.PREGNANCY_BEE_EGGS) return; //Must be a new format save
		if (flags[kFLAGS.URTA_PREGNANCY_TYPE] == PregnancyStore.PREGNANCY_DRIDER_EGGS) return; //Must be a new format save
		if (flags[kFLAGS.URTA_PREGNANCY_TYPE] == PregnancyStore.PREGNANCY_PLAYER) return; //Must be a new format save
		if (flags[kFLAGS.URTA_PREGNANCY_TYPE] > 0) { //URTA_PREGNANCY_TYPE was previously URTA_EGG_INCUBATION, assume this was an egg pregnancy
			flags[kFLAGS.URTA_INCUBATION] = flags[kFLAGS.URTA_PREGNANCY_TYPE];
			if (player.findPerk(PerkLib.SpiderOvipositor) >= 0)
				flags[kFLAGS.URTA_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_DRIDER_EGGS;
			else
				flags[kFLAGS.URTA_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_BEE_EGGS;
		}
		else if (flags[kFLAGS.URTA_INCUBATION] > 0) { //Assume Urta was pregnant with the player's baby
			flags[kFLAGS.URTA_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_PLAYER;
			flags[kFLAGS.URTA_INCUBATION] = 384 - flags[kFLAGS.URTA_INCUBATION]; //Reverse the pregnancy counter since it now counts down rather than up
		}

		if (flags[kFLAGS.EDRYN_PREGNANCY_TYPE] > 0 && flags[kFLAGS.EDRYN_PREGNANCY_INCUBATION] == 0) {
			//EDRYN_PREGNANCY_TYPE was previously EDRYN_BIRF_COUNTDOWN - used when Edryn was pregnant with Taoth
			if (flags[kFLAGS.EDRYN_PREGNANCY_INCUBATION] > 0)
				flags[kFLAGS.URTA_FERTILE]            = PregnancyStore.PREGNANCY_PLAYER;          //These two variables are used to store information on the pregnancy Taoth
			flags[kFLAGS.URTA_PREG_EVERYBODY]        = flags[kFLAGS.EDRYN_PREGNANCY_INCUBATION]; //is overriding (if any), so they can later be restored.
			flags[kFLAGS.EDRYN_PREGNANCY_INCUBATION] = flags[kFLAGS.EDRYN_PREGNANCY_TYPE];
			flags[kFLAGS.EDRYN_PREGNANCY_TYPE]       = PregnancyStore.PREGNANCY_TAOTH;
		}
		else if (flags[kFLAGS.EDRYN_PREGNANCY_INCUBATION] > 0 && flags[kFLAGS.EDRYN_PREGNANCY_TYPE] == 0) flags[kFLAGS.EDRYN_PREGNANCY_TYPE] = PregnancyStore.PREGNANCY_PLAYER;
	}
	if (flags[kFLAGS.BEHEMOTH_CHILDREN] > 0) {
		if (flags[kFLAGS.BEHEMOTH_CHILDREN] >= 1 && flags[kFLAGS.BEHEMOTH_CHILD_1_BIRTH_DAY] <= 0) flags[kFLAGS.BEHEMOTH_CHILD_1_BIRTH_DAY] = getGame().time.days;
		if (flags[kFLAGS.BEHEMOTH_CHILDREN] >= 2 && flags[kFLAGS.BEHEMOTH_CHILD_2_BIRTH_DAY] <= 0) flags[kFLAGS.BEHEMOTH_CHILD_2_BIRTH_DAY] = getGame().time.days;
		if (flags[kFLAGS.BEHEMOTH_CHILDREN] >= 3 && flags[kFLAGS.BEHEMOTH_CHILD_3_BIRTH_DAY] <= 0) flags[kFLAGS.BEHEMOTH_CHILD_3_BIRTH_DAY] = getGame().time.days;
	}
	if (flags[kFLAGS.LETHICE_DEFEATED] > 0 && flags[kFLAGS.D3_JEAN_CLAUDE_DEFEATED] == 0) flags[kFLAGS.D3_JEAN_CLAUDE_DEFEATED] = 1;
	if (player.hasKeyItem("Camp - Chest") >= 0 || player.hasKeyItem("Camp - Murky Chest") >= 0 || player.hasKeyItem("Camp - Ornate Chest") >= 0) { //Force correct slots.
	var  amt: number = 0;
		if (player.hasKeyItem("Camp - Chest") >= 0) amt += 6;
		if (player.hasKeyItem("Camp - Murky Chest") >= 0) amt += 4;
		if (player.hasKeyItem("Camp - Ornate Chest") >= 0) amt += 4;
		while (inventory.itemStorageDirectGet().length < amt) {
			inventory.itemStorageDirectGet().push(new ItemSlot());
		}
	}
	if (gearStorageGet().length < 45) {
		while (gearStorageGet().length < 45) {
			gearStorageGet().push(new ItemSlot());
		}
	}
	if (player.hasKeyItem("Laybans") >= 0) {
		flags[kFLAGS.D3_MIRRORS_SHATTERED] = 1;
	}
	//Rigidly enforce rank caps
	if (player.perkv1(PerkLib.AscensionDesires) > CharCreation.MAX_DESIRES_LEVEL) player.setPerkValue(PerkLib.AscensionDesires, 1, CharCreation.MAX_DESIRES_LEVEL);
	if (player.perkv1(PerkLib.AscensionEndurance) > CharCreation.MAX_ENDURANCE_LEVEL) player.setPerkValue(PerkLib.AscensionEndurance, 1, CharCreation.MAX_ENDURANCE_LEVEL);
	if (player.perkv1(PerkLib.AscensionFertility) > CharCreation.MAX_FERTILITY_LEVEL) player.setPerkValue(PerkLib.AscensionFertility, 1, CharCreation.MAX_FERTILITY_LEVEL);
	if (player.perkv1(PerkLib.AscensionMoralShifter) > CharCreation.MAX_MORALSHIFTER_LEVEL) player.setPerkValue(PerkLib.AscensionMoralShifter, 1, CharCreation.MAX_MORALSHIFTER_LEVEL);
	if (player.perkv1(PerkLib.AscensionMysticality) > CharCreation.MAX_MYSTICALITY_LEVEL) player.setPerkValue(PerkLib.AscensionMysticality, 1, CharCreation.MAX_MYSTICALITY_LEVEL);
	if (player.perkv1(PerkLib.AscensionTolerance) > CharCreation.MAX_TOLERANCE_LEVEL) player.setPerkValue(PerkLib.AscensionTolerance, 1, CharCreation.MAX_TOLERANCE_LEVEL);
	if (player.perkv1(PerkLib.AscensionVirility) > CharCreation.MAX_VIRILITY_LEVEL) player.setPerkValue(PerkLib.AscensionVirility, 1, CharCreation.MAX_VIRILITY_LEVEL);
	if (player.perkv1(PerkLib.AscensionWisdom) > CharCreation.MAX_WISDOM_LEVEL) player.setPerkValue(PerkLib.AscensionWisdom, 1, CharCreation.MAX_WISDOM_LEVEL);
	
	//If converting from vanilla, set Grimdark flag to 0.
	if (flags[kFLAGS.MOD_SAVE_VERSION] == 0 || flags[kFLAGS.GRIMDARK_MODE] == 3) flags[kFLAGS.GRIMDARK_MODE] = 0;
	//Set to Grimdark if doing kaizo unless locked
	if (flags[kFLAGS.GRIMDARK_MODE] > 0) {
		if (flags[kFLAGS.GRIMDARK_BACKGROUND_UNLOCKED] == 0) {
			flags[kFLAGS.BACKGROUND_STYLE] = 9;
		}
		getGame().inRoomedDungeon = true;
	}
	//Unstick shift key flag
	flags[kFLAGS.SHIFT_KEY_DOWN] = 0;
}

//This is just the save/load code - from it you can get
//strings from the save objects, and load games from strings.
//What you do with the strings, and where you get them from
//is not handled here. For this to work right, you'll need to
//modify saveGameObject() to use an int or something instead
//of a boolean to identify the save type (0 = normal,
//1 = file, 2 = text and so on), and modify the if/else at the
//bottom, which currently checks if a boolean is true for
//using the file saving code, else it uses slot saving.

//Arrays for converting a byte array into a string
public static  encodeChars: any[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];
public static  decodeChars: any[] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];

//ByteArray > String
public  b64e(data:ByteArray): string
{
var  out: any[] = [];
var  i: number = 0;
var  j: number = 0;
var  r: number = data.length % 3;
var  len: number = data.length - r;
var  c: number;
	while (i < len)
	{
		c = data[i++] << 16 | data[i++] << 8 | data[i++];
		out[j++] = encodeChars[c >> 18] + encodeChars[c >> 12 & 0x3f] + encodeChars[c >> 6 & 0x3f] + encodeChars[c & 0x3f];
	}
	if (r == 1)
	{
		c = data[i++];
		out[j++] = encodeChars[c >> 2] + encodeChars[(c & 0x03) << 4] + "==";
	}
	else if (r == 2)
	{
		c = data[i++] << 8 | data[i++];
		out[j++] = encodeChars[c >> 10] + encodeChars[c >> 4 & 0x3f] + encodeChars[(c & 0x0f) << 2] + "=";
	}
	return out.join('');
}

//String > ByteArray
public  b64d(str: string):ByteArray
{
var  c1: number;
var  c2: number;
var  c3: number;
var  c4: number;
var  i: number;
var  len: number;
var  out:ByteArray;
	len = str.length;
	i = 0;
	out = new ByteArray();
	while (i < len)
	{
		// c1
		do
		{
			c1 = decodeChars[str.charCodeAt(i++) & 0xff];
		} while (i < len && c1 == -1);
		if (c1 == -1)
		{
			break;
		}
		// c2
		do
		{
			c2 = decodeChars[str.charCodeAt(i++) & 0xff];
		} while (i < len && c2 == -1);
		if (c2 == -1)
		{
			break;
		}

		out.writeByte((c1 << 2) | ((c2 & 0x30) >> 4));

		// c3
		do
		{
			c3 = str.charCodeAt(i++) & 0xff;
			if (c3 == 61)
			{
				return out;
			}
			c3 = decodeChars[c3];
		} while (i < len && c3 == -1);
		if (c3 == -1)
		{
			break;
		}

		out.writeByte(((c2 & 0x0f) << 4) | ((c3 & 0x3c) >> 2));

		// c4
		do
		{
			c4 = str.charCodeAt(i++) & 0xff;
			if (c4 == 61)
			{
				return out;
			}
			c4 = decodeChars[c4];
		} while (i < len && c4 == -1);
		if (c4 == -1)
		{
			break;
		}
		out.writeByte(((c3 & 0x03) << 6) | c4);
	}
	return out;
}

//This loads the game from the string
public  loadText(saveText: string): void
{
	//Get the byte array from the string
var  rawSave:ByteArray = b64d(saveText);

	//Inflate
	rawSave.inflate();

	//Read the object
var  obj: Record<string, any> = rawSave.readObject();

	//Load the object
	loadGameObject(obj);
}

public  serialize(relativeRootObject: any): void
{
	SerializationUtils.serialize(relativeRootObject, player);
	saveNPCs(relativeRootObject);
}

public  deserialize(relativeRootObject: any): void
{
	SerializationUtils.deserialize(relativeRootObject, player);
	loadNPCs(relativeRootObject);
}

public  upgradeSerializationVersion(relativeRootObject: any, serializedDataVersion: number): void
{
	switch(serializedDataVersion) {
		case 0:
			upgradeUnversionedSave(relativeRootObject);
		case 1:
			moveItemStorageToInventory(relativeRootObject);
		case 2:
			addMissingVersionPlayer(relativeRootObject);
			
		default:
		/*
		 * The default block is left empty intentionally,
		 * this switch case operates by using fall through behavior.
		 */
	}
}

public  currentSerializationVerison(): number
{
	return SERIALIZATION_VERSION;
}

public  serializationUUID(): string 
{
	return SERIALIZATION_UUID;
}

private  upgradeUnversionedSave(relativeRootObject: any): void
{
	if (relativeRootObject.npcs === undefined) {
		relativeRootObject.npcs = [];
	}

var  npcs: any = relativeRootObject.npcs;

	if (npcs.jojo === undefined) {
		npcs.jojo = [];
	}
	
}

private  addMissingVersionPlayer(relativeRootObject: any): void
{
var  player:Player = new Player();
	
	relativeRootObject["serializationVersionDictionary"] = [];
	relativeRootObject["serializationVersionDictionary"][player.serializationUUID()] = 1;
}

/**
 * Move the item storage to inventory object, as the serialization versions will collide
 * (Saves and Inventory write version to saveFile.data).
 * 
 * @param	relativeRootObject the root savefile data storage (saveFile.data)
 */
private  moveItemStorageToInventory(relativeRootObject: any): void
{
	LOGGER.info("Upgrading item storage to use inventory instead of the save game root...");
	
	if (relativeRootObject.inventory === undefined) {
		LOGGER.debug("No inventory in save game, creating...");
		
		relativeRootObject.inventory = [];
	}
	
	if (relativeRootObject.itemStorage !== undefined) {
		LOGGER.debug("Found item storage in save root, moving to inventory...");
		
		relativeRootObject.inventory.itemStorage = relativeRootObject.itemStorage;
		delete relativeRootObject["itemStorage"];
	}
}

//*******
//This is the modified if for initialising saveFile in saveGameObject(). It assumes the save type parameter passed is an int, that 0 means a slot-save, and is called saveType.
/*
   if (saveType != 0)
   {
   saveFile = new Object();

   saveFile.data = new Object();
   }
   else
   {
   saveFile = SharedObject.getLocal(slot,"/");
   }
   //*******
   //This stuff is for converting the save object into a string, should go down in saveGameObject(), as an else-if (if saveType == 2, etc)
  var  rawSave:ByteArray = new ByteArray;

   //Write the object to the byte array
   rawSave.writeObject(saveFile);

   //Deflate
   rawSave.deflate();

   //Convert to a Base64 string
  var  saveString: string = b64e(rawSave);
 */
//*******
}

