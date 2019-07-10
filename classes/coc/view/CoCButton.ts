import { Block } from "./Block";
import { Utils } from "../../classes/internals/Utils";
import { BitmapDataSprite } from "./BitmapDataSprite";
import { MainView } from "./MainView";
import { UIUtils } from "./UIUtils";
import { ItemType } from "../../classes/ItemType";

/****
    coc.view.CoCButton

    note that although this stores its current tool tip text,
    it does not display the text.  That is taken care of
    by whoever owns this.

    The mouse event handlers are public to facilitate reaction to
    keyboard events.
****/

export class CoCButton extends Block {

    // [Embed(source = '../../../res/ui/Shrewsbury-Titling_Bold.ttf',
    //     advancedAntiAliasing = 'true',
    //     fontName = 'ShrewsburyTitlingBold',
    //     embedAsCFF = 'false')]
    private static BUTTON_LABEL_FONT: any;
    public static BUTTON_LABEL_FONT_NAME: string = (new CoCButton.BUTTON_LABEL_FONT()).fontName;

    private _labelField: TextField;
    public _backgroundGraphic: BitmapDataSprite;
    public _enabled: boolean = true;
    public _callback = undefined;
    public _preCallback = undefined;

    public toolTipHeaderInstance: string;
    public toolTipTextInstance: string;

    /**
     * @param options  enabled, labelText, bitmapClass, callback
     */
    public constructor(options?: Record<string, any>) {
        super();
        this.initButton(options);
    }

    /**
     * Extracted constructor to make use of the JIT compiler.
     *
     * @param	options See constructor.
     */
    private initButton(options: Record<string, any>): void {
        this._backgroundGraphic = this.addBitmapDataSprite({
            stretch: true,
            width: MainView.BTN_W,
            height: MainView.BTN_H
        });
        this._labelField = this.addTextField({
            embedFonts: true,
            // autoSize         : TextFieldAutoSize.CENTER,
            width: MainView.BTN_W,
            height: MainView.BTN_H - 8,
            x: 0,
            y: 8,
            defaultTextFormat: {
                font: CoCButton.BUTTON_LABEL_FONT_NAME,
                size: 18,
                align: 'center'
            }
        });

        this.mouseChildren = true;
        this.buttonMode = true;
        this.visible = true;
        UIUtils.setProperties(this, options);
        if (this.width < 130) { // A workaround for squashed text on narrower buttons.
            this._labelField.x = 0;
            this._labelField.width = this.width;
            this._labelField.scaleX = (MainView.BTN_W / this._labelField.width);
        }

        this.addEventListener(MouseEvent.ROLL_OVER, this.hover);
        this.addEventListener(MouseEvent.ROLL_OUT, this.dim);
        this.addEventListener(MouseEvent.CLICK, this.click);
    }

    //////// Mouse Events... ////////

    public hover(event?: MouseEvent): void {
        if (this._backgroundGraphic)
            this._backgroundGraphic.alpha = this.enabled ? 0.5 : 0.4;
    }

    public dim(event?: MouseEvent): void {
        if (this._backgroundGraphic)
            this._backgroundGraphic.alpha = this.enabled ? 1 : 0.4;
    }

    public click(event?: MouseEvent): void {
        if (!this.enabled) return;
        if (this._preCallback != undefined)
            this._preCallback(this);
        if (this._callback != undefined)
            this._callback();
    }

    //////// Getters and Setters ////////

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(value: boolean) {
        this._enabled = value;
        this._labelField.alpha = value ? 1 : 0.4;
        this._backgroundGraphic.alpha = value ? 1 : 0.4;
    }

    public get labelText(): string {
        return this._labelField.text;
    }

    public set labelText(value: string) {
        this._labelField.text = value;
    }

    public set bitmapClass(value: any) {
        this._backgroundGraphic.bitmapClass = value;
    }

    public get bitmapClass() {
        return undefined;
    }

    public get callback() {
        return this._callback;
    }

    public set callback(value): void {
        this._callback = value;
    }

    public get preCallback() {
        return this._preCallback;
    }

    public set preCallback(value): void {
        this._preCallback = value;
    }
    //////////// Builder functions
    /**
     * Setup (text, callback, tooltip) and show enabled button. Removes all previously set options
     * @return this
     */
    public show(text: string, callback: any, toolTipText: string = "", toolTipHeader: string = ""): CoCButton {
        this.labelText = text;
        this.callback = callback;
        this.hint(toolTipText, toolTipHeader);
        this.visible = true;
        this.enabled = true;
        this.alpha = 1;
        return this;
    }
    /**
     * Setup (text, tooltip) and show disabled button. Removes all previously set options
     * @return this
     */
    public showDisabled(text: string, toolTipText: string = "", toolTipHeader: string = ""): CoCButton {
        this.labelText = text;
        this.callback = undefined;
        this.hint(toolTipText, toolTipHeader);
        this.visible = true;
        this.enabled = false;
        this.alpha = 1;
        return this;
    }
    /**
     * Set text and tooltip. Don't change callback, enabled, visibility
     * @return this
     */
    public text(text: string, toolTipText: string = "", toolTipHeader: string = ""): CoCButton {
        this.labelText = text;
        this.hint(toolTipText, toolTipHeader);
        return this;
    }
    /**
     * Set tooltip only. Don't change text, callback, enabled, visibility
     * @return this
     */
    public hint(toolTipText: string = "", toolTipHeader: string = ""): CoCButton {
        this.toolTipTextInstance = toolTipText || CoCButton.getToolTipText(this.labelText);
        this.toolTipHeaderInstance = toolTipHeader || CoCButton.getToolTipHeader(this.labelText);
        return this;
    }
    /**
     * Disable if condition is true, optionally change tooltip. Does not un-hide button.
     * @return this
     */
    public disableIf(condition: boolean, toolTipText?: string): CoCButton {
        this.enabled = !condition;
        if (toolTipText !== undefined) this.toolTipTextInstance = condition ? toolTipText : this.toolTipTextInstance;
        return this;
    }
    /**
     * Disable, optionally change tooltip. Does not un-hide button.
     * @return this
     */
    public disable(toolTipText?: string): CoCButton {
        this.enabled = false;
        if (toolTipText !== undefined) this.toolTipTextInstance = toolTipText;
        return this;
    }
    /**
     * Set callback to fn(...args)
     * @return this
     */
    public call(fn: any, ...args: any[]): CoCButton {
        this.callback = Utils.curry.apply(fn, args);
        return this;
    }
    /**
     * Hide the button
     * @return this
     */
    public hide(): CoCButton {
        visible = false;
        return this;
    }

    public static getToolTipHeader(buttonText: string): string {
        let toolTipHeader: string;

        if (buttonText.indexOf(" x") !== -1) {
            buttonText = buttonText.split(" x")[0];
        }

        // Get items
        let itype: ItemType = ItemType.lookupItem(buttonText) || ItemType.lookupItemByShort(buttonText);
        let temp: string = "";

        if (itype !== undefined) {
            temp = itype.longName;
        }

        if (temp !== "") {
            temp = Utils.capitalizeFirstLetter(temp);
            toolTipHeader = temp;
        }

        // Set tooltip header to button.
        if (toolTipHeader === undefined) {
            toolTipHeader = buttonText;
        }

        return toolTipHeader;
    }

    // Returns a string or undefined.
    public static getToolTipText(buttonText: string): string {
        let toolTipText: string;

        buttonText = buttonText || '';

        // TODO: Remove those code eventually.
        if (buttonText.indexOf(" x") !== -1) {
            buttonText = buttonText.split(" x")[0];
        }

        let itype: ItemType = ItemType.lookupItem(buttonText) || ItemType.lookupItemByShort(buttonText);

        if (itype != undefined) {
            toolTipText = itype.description;
        }

        return toolTipText;
    }
}
