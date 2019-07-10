import { BaseContent } from "../BaseContent";
import { LoggerFactory } from "../internals/LoggerFactory";
import { VaginalPregnancy } from "./VaginalPregnancy";
import { PregnancyStore } from "../PregnancyStore";
import { AnalPregnancy } from "./AnalPregnancy";
import { StatusEffects } from "../StatusEffects";
import { kFLAGS } from "../GlobalFlags/kFLAGS";
import { Player } from "../Player";
import { PerkLib } from "../PerkLib";
import { kGAMECLASS } from "../GlobalFlags/kGAMECLASS";

export class PregnancyProgression extends BaseContent {
    private static LOGGER: ILogger = LoggerFactory.getLogger(PregnancyProgression);

    /**
     * This sensing variable is used by tests to detect if
     * the vaginal birth code has been called. This is used for pregnancies
     * that do not provide any other means of detection (e.g. counter variables).
     */
    public senseVaginalBirth: number[];

    /**
     * This sensing variable is used by tests to detect if
     * the anal birth code has been called. This is used for pregnancies
     * that do not provide any other means of detection (e.g. counter variables).
     */
    public senseAnalBirth: number[];

    /**
     * Map pregnancy type to the class that contains the matching scenes.
     * Currently only stores player pregnancies.
     */
    private vaginalPregnancyScenes: Record<string, any>;

    /**
     * Map pregnancy type to the class that contains the matching scenes.
     * Currently only stores player pregnancies.
     */
    private analPregnancyScenes: Record<string, any>;

    public constructor() {
        super();
        this.senseVaginalBirth = [];
        this.senseAnalBirth = [];

        this.vaginalPregnancyScenes = {};
        this.analPregnancyScenes = {};
    }

    /**
     * Record a call to a vaginal birth function.
     * This method is used for testing.
     * @param	pregnancyType to record
     */
    public detectVaginalBirth(pregnancyType: number): void {
        this.senseVaginalBirth.push(pregnancyType);
    }

    /**
     * Record a call to a anal birth function.
     * This method is used for testing.
     * @param	pregnancyType to record
     */
    public detectAnalBirth(pregnancyType: number): void {
        this.senseAnalBirth.push(pregnancyType);
    }

    /**
     * Register a scene for vaginal pregnancy. The registered scene will be used for pregnancy
     * progression and birth.
     * <b>Note:</b> Currently only the player is supported as the mother.
     *
     * @param	pregnancyTypeMother The creature that is the mother
     * @param	pregnancyTypeFather The creature that is the father
     * @param	scenes The scene to register for the combination
     * @return true if an existing scene was overwritten
     * @throws ArgumentError If the mother is not the player
     */
    public registerVaginalPregnancyScene(pregnancyTypeMother: number, pregnancyTypeFather: number, scenes: VaginalPregnancy): boolean {
        if (pregnancyTypeMother !== PregnancyStore.PREGNANCY_PLAYER) {
            PregnancyProgression.LOGGER.error("Currently only the player is supported as mother");
            throw new ArgumentError("Currently only the player is supported as mother");
        }

        let previousReplaced: boolean = false;

        if (this.hasRegisteredVaginalScene(pregnancyTypeMother, pregnancyTypeFather)) {
            previousReplaced = true;
            PregnancyProgression.LOGGER.warn("Vaginal scene registration for mother {0}, father {1} will be replaced.", pregnancyTypeMother, pregnancyTypeFather);
        }

        this.vaginalPregnancyScenes[pregnancyTypeFather] = scenes;
        PregnancyProgression.LOGGER.debug("Mapped pregancy scene {0} to mother {1}, father {2}", scenes, pregnancyTypeMother, pregnancyTypeFather);

        return previousReplaced;
    }

    /**
     * Register a scene for anal pregnancy. The registered scene will be used for pregnancy
     * progression and birth.
     * <b>Note:</b> Currently only the player is supported as the mother.
     *
     * @param	pregnancyTypeMother The creature that is the mother
     * @param	pregnancyTypeFather The creature that is the father
     * @param	scenes The scene to register for the combination
     * @return true if an existing scene was overwritten
     * @throws ArgumentError If the mother is not the player
     */
    public registerAnalPregnancyScene(pregnancyTypeMother: number, pregnancyTypeFather: number, scenes: AnalPregnancy): boolean {
        if (pregnancyTypeMother !== PregnancyStore.PREGNANCY_PLAYER) {
            PregnancyProgression.LOGGER.error("Currently only the player is supported as mother");
            throw new ArgumentError("Currently only the player is supported as mother");
        }

        let previousReplaced: boolean = false;

        if (this.hasRegisteredAnalScene(pregnancyTypeMother, pregnancyTypeFather)) {
            previousReplaced = true;
            PregnancyProgression.LOGGER.warn("Anal scene registration for mother {0}, father {1} will be replaced.", pregnancyTypeMother, pregnancyTypeFather);
        }

        this.analPregnancyScenes[pregnancyTypeFather] = scenes;
        PregnancyProgression.LOGGER.debug("Mapped anal pregancy scene {0} to mother {1}, father {2}", scenes, pregnancyTypeMother, pregnancyTypeFather);

        return previousReplaced;
    }

    /**
     * Check if the given vaginal pregnancy combination has a registered scene.
     * @param	pregnancyTypeMother The creature that is the mother
     * @param	pregnancyTypeFather The creature that is the father
     * @return true if a scene is registered for the combination
     */
    public hasRegisteredVaginalScene(pregnancyTypeMother: number, pregnancyTypeFather: number): boolean {
        // currently only player pregnancies are supported
        if (pregnancyTypeMother !== PregnancyStore.PREGNANCY_PLAYER) {
            return false;
        }

        return pregnancyTypeFather in this.vaginalPregnancyScenes;
    }

    /**
     * Check if the given anal pregnancy combination has a registered scene.
     * @param	pregnancyTypeMother The creature that is the mother
     * @param	pregnancyTypeFather The creature that is the father
     * @return true if a scene is registered for the combination
     */
    public hasRegisteredAnalScene(pregnancyTypeMother: number, pregnancyTypeFather: number): boolean {
        // currently only player pregnancies are supported
        if (pregnancyTypeMother !== PregnancyStore.PREGNANCY_PLAYER) {
            return false;
        }

        return pregnancyTypeFather in this.analPregnancyScenes;
    }

    /**
     * Update the current vaginal and anal pregnancies (if any). Updates player status and outputs messages related to pregnancy or birth.
     * @return true if the output needs to be updated
     */
    public updatePregnancy(): boolean {
        let displayedUpdate: boolean = false;
        const pregText: string = "";
        if ((this.player.pregnancyIncubation <= 0 && this.player.buttPregnancyIncubation <= 0) ||
            (this.player.pregnancyType === 0 && this.player.buttPregnancyType === 0)) {
            return false;
        }

        displayedUpdate = this.cancelHeat();

        if (this.player.pregnancyIncubation > 0 && this.player.pregnancyIncubation < 2) this.player.knockUpForce(this.player.pregnancyType, 1);
        // IF INCUBATION IS VAGINAL
        if (this.player.pregnancyIncubation > 1) {
            displayedUpdate = this.updateVaginalPregnancy(displayedUpdate);
        }
        // IF INCUBATION IS ANAL
        if (this.player.buttPregnancyIncubation > 1) {
            displayedUpdate = this.updateAnalPregnancy(displayedUpdate);
        }

        this.amilyPregnancyFailsafe();

        if (this.player.pregnancyIncubation === 1) {
            displayedUpdate = this.updateVaginalBirth(displayedUpdate);
        }

        if (this.player.buttPregnancyIncubation === 1) {
            displayedUpdate = this.updateAnalBirth(displayedUpdate);
        }

        return displayedUpdate;
    }

    private cancelHeat(): boolean {
        if (this.player.inHeat) {
            this.outputText("\nYou calm down a bit and realize you no longer fantasize about getting fucked constantly.  It seems your heat has ended.\n");
            // Remove bonus libido from heat
            this.dynStats("lib", -this.player.statusEffectv2(StatusEffects.Heat));

            if (this.player.lib < 10) {
                this.player.lib = 10;
            }

            this.statScreenRefresh();
            this.player.removeStatusEffect(StatusEffects.Heat);

            return true;
        }

        return false;
    }

    private updateVaginalPregnancy(displayedUpdate: boolean): boolean {
        if (this.hasRegisteredVaginalScene(PregnancyStore.PREGNANCY_PLAYER, this.player.pregnancyType)) {
            const scene: VaginalPregnancy = this.vaginalPregnancyScenes[this.player.pregnancyType] as VaginalPregnancy;
            PregnancyProgression.LOGGER.debug("Updating pregnancy for mother {0}, father {1} by using class {2}", PregnancyStore.PREGNANCY_PLAYER, this.player.pregnancyType, scene);
            return scene.updateVaginalPregnancy();
        } else {
            PregnancyProgression.LOGGER.debug("Could not find a mapped vaginal pregnancy for mother {0}, father {1} - using legacy pregnancy progression", PregnancyStore.PREGNANCY_PLAYER, this.player.pregnancyType);
        }

        return displayedUpdate;
    }

    private updateAnalPregnancy(displayedUpdate: boolean): boolean {
        const analPregnancyType: number = this.player.buttPregnancyType;

        if (this.hasRegisteredAnalScene(PregnancyStore.PREGNANCY_PLAYER, analPregnancyType)) {
            const scene: AnalPregnancy = this.analPregnancyScenes[analPregnancyType] as AnalPregnancy;
            PregnancyProgression.LOGGER.debug("Updating anal pregnancy for mother {0}, father {1} by using class {2}", PregnancyStore.PREGNANCY_PLAYER, analPregnancyType, scene);
            return scene.updateAnalPregnancy() || displayedUpdate;
        } else {
            PregnancyProgression.LOGGER.debug("Could not find a mapped anal pregnancy for mother {0}, father {1} - using legacy pregnancy progression", PregnancyStore.PREGNANCY_PLAYER, analPregnancyType);
        }

        return displayedUpdate;
    }

    /**
     * Changes pregnancy type to Mouse if Amily is in a invalid state.
     */
    private amilyPregnancyFailsafe(): void {
        // Amily failsafe - converts PC with pure babies to mouse babies if Amily is corrupted
        if (this.player.pregnancyIncubation === 1 && this.player.pregnancyType === PregnancyStore.PREGNANCY_AMILY) {
            if (this.flags[kFLAGS.AMILY_FOLLOWER] === 2 || this.flags[kFLAGS.AMILY_CORRUPTION] > 0) {
                this.player.knockUpForce(PregnancyStore.PREGNANCY_MOUSE, this.player.pregnancyIncubation);
            }
        }

        // Amily failsafe - converts PC with pure babies to mouse babies if Amily is with Urta
        if (this.player.pregnancyIncubation === 1 && this.player.pregnancyType === PregnancyStore.PREGNANCY_AMILY) {
            if (this.flags[kFLAGS.AMILY_VISITING_URTA] === 1 || this.flags[kFLAGS.AMILY_VISITING_URTA] === 2) {
                this.player.knockUpForce(PregnancyStore.PREGNANCY_MOUSE, this.player.pregnancyIncubation);
            }
        }

        // Amily failsafe - converts PC with pure babies to mouse babies if PC is in prison.
        if (this.player.pregnancyIncubation === 1 && this.player.pregnancyType === PregnancyStore.PREGNANCY_AMILY) {
            if (this.prison.inPrison) {
                this.player.knockUpForce(PregnancyStore.PREGNANCY_MOUSE, this.player.pregnancyIncubation);
            }
        }
    }

    /**
     * Check is the player has a vagina and create one if missing.
     */
    private createVaginaIfMissing(): void {
        PregnancyUtils.createVaginaIfMissing(this.output, this.player);
    }

    private updateVaginalBirth(displayedUpdate: boolean): boolean {
        if (this.hasRegisteredVaginalScene(PregnancyStore.PREGNANCY_PLAYER, this.player.pregnancyType)) {
            const scene: VaginalPregnancy = this.vaginalPregnancyScenes[this.player.pregnancyType] as VaginalPregnancy;
            PregnancyProgression.LOGGER.debug("Updating vaginal birth for mother {0}, father {1} by using class {2}", PregnancyStore.PREGNANCY_PLAYER, this.player.pregnancyType, scene);
            scene.vaginalBirth();

            // TODO find a cleaner way to solve this
            // ignores Benoit pregnancy because that is a special case
            if (this.player.pregnancyType !== PregnancyStore.PREGNANCY_BENOIT) {
                this.giveBirth();
            }
        } else {
            PregnancyProgression.LOGGER.debug("Could not find a mapped vaginal pregnancy scene for mother {0}, father {1} - using legacy pregnancy progression", PregnancyStore.PREGNANCY_PLAYER, this.player.pregnancyType);
        }

        // TODO find a better way to do this
        // due to non-conforming pregancy code
        if (this.player.pregnancyType === PregnancyStore.PREGNANCY_BENOIT && this.player.pregnancyIncubation === 3) {
            return displayedUpdate;
        }

        this.player.knockUpForce();

        return true;
    }

    /**
     * Updates fertility and tracks number of births. If the player has birthed
     * enough children, gain the broodmother perk.
     */
    public giveBirth(): void {
        // TODO remove this once new Player calls have been removed
        const player: Player = kGAMECLASS.player;

        if (player.fertility < 15) {
            player.fertility++;
        }

        if (player.fertility < 25) {
            player.fertility++;
        }

        if (player.fertility < 40) {
            player.fertility++;
        }

        if (!player.hasStatusEffect(StatusEffects.Birthed)) {
            player.createStatusEffect(StatusEffects.Birthed, 1, 0, 0, 0);
        } else {
            player.addStatusValue(StatusEffects.Birthed, 1, 1);

            if (player.findPerk(PerkLib.BroodMother) < 0 && player.statusEffectv1(StatusEffects.Birthed) >= 10) {
                this.output.text("\n<b>You have gained the Brood Mother perk</b> (Pregnancies progress twice as fast as a normal woman's).\n");
                player.createPerk(PerkLib.BroodMother, 0, 0, 0, 0);
            }
        }
    }

    private updateAnalBirth(displayedUpdate: boolean): boolean {
        const analPregnancyType: number = this.player.buttPregnancyType;

        if (this.hasRegisteredAnalScene(PregnancyStore.PREGNANCY_PLAYER, analPregnancyType)) {
            const scene: AnalPregnancy = this.analPregnancyScenes[analPregnancyType] as AnalPregnancy;
            PregnancyProgression.LOGGER.debug("Updating anal birth for mother {0}, father {1} by using class {2}", PregnancyStore.PREGNANCY_PLAYER, analPregnancyType, scene);
            scene.analBirth();
            displayedUpdate = true;
        } else {
            PregnancyProgression.LOGGER.debug("Could not find a mapped anal pregnancy scene for mother {0}, father {1} - using legacy pregnancy progression", PregnancyStore.PREGNANCY_PLAYER, analPregnancyType);
        }

        this.player.buttKnockUpForce();

        return displayedUpdate;
    }
}
