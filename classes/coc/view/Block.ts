/**
 * Coded by aimozg on 06.06.2017.
 */

export class Block {
    public static ON_LAYOUT: string = 'coc$layout';
    private static LOGGER: ILogger = LoggerFactory.getLogger(Block);
    /**
     * Null layout. All elements' positions and sizes are NOT adjusted
     */
    public static LAYOUT_NONE: string = 'none';
    /**
     * Common layout parameters: any * padding{s,Horiz,Vert,Top,Right,Bottom,Left} - a distance from borders of this block to its elements
     * * `ignoreHidden` - ignore all hidden (visible=false) elements. Default layout-dependent
     * Common element hints: any * `ignore` - ignore element
     */
    /**
     * Grid layout. Aligns elements in a grid of fixed cell size, fixed cell count
     * Config: any * `rows`, `cols` - number or rows and columns. Default 1
     * * `setWidth`, `setHeight - should set width/height of elements. Default false
     * Hints: any * `row`, `col` - 2D position in grid. Defaults to "next cell"
     * * `setWidth`, `setHeight - should set width/height of this element. Default to layout config
     */
    public static LAYOUT_GRID: string = 'grid';
    private applyGridLayout(): void {
        const config: Record<string, any> = this._layoutConfig;
        const ignoreHidden: boolean = 'ignoreHidden' in config ? config.ignoreHidden : false;
        const rows: number = config.rows || 1;
        const cols: number = config.cols || 1;
        const innerw: number = innerWidth;
        const innerh: number = innerHeight;
        const cellw: number = innerw / cols;
        const cellh: number = innerh / rows;
        const setcw: boolean = config.setWidth;
        const setch: boolean = config.setHeight;

        let row: number = 0;
        let col: number = 0;
        for (let ci: number = 0, cn: number = this._container.numChildren; ci < cn; ci++) {
            const child: DisplayObject = this._container.getChildAt(ci);
            const hint: Record<string, any> = this._layoutHints[child] || {};
            if (hint.ignore || !child.visible && ignoreHidden) continue;
            const setw: boolean = 'setWidth' in hint ? hint.setWidth : setcw;
            const seth: boolean = 'setHeight' in hint ? hint.setHeight : setch;
            if ('row' in hint && 'col' in hint) {
                row = hint.row;
                col = hint.col;
            }
            child.x = col * cellw + this.paddingLeft;
            child.y = row * cellh + this.paddingTop;
            if (setw) child.width = cellw;
            if (seth) child.height = cellh;
            col = col + 1;
            if (col >= cols) {
                col = 0;
                row++;
            }
        }
    }
    /**
     * Flow layout. Aligns size-providing elements in a row or column
     * Config: any `direction` - 'row'|'column'. Defaults to 'row'
     * `gap` - Gap between neighbouring elements. Defaults to 2.
     * `ignoreHidden` defaults to true
     * Hints: any `before`, `after` - Additional gap before/after that element. May be negative
     */
    public static LAYOUT_FLOW: string = 'flow';
    private applyFlowLayout(): void {
        const config: Record<string, any> = this._layoutConfig;
        const ignoreHidden: boolean = 'ignoreHidden' in config ? config.ignoreHidden : true;
        const dir: string = config.direction || 'row';
        const gap: number = 'gap' in config ? config.gap : 2;
        let x: number = this.paddingLeft;
        let y: number = this.paddingTop;
        for (let ci: number = 0, cn: number = this._container.numChildren; ci < cn; ci++) {
            const child: DisplayObject = this._container.getChildAt(ci);
            const hint: Record<string, any> = this._layoutHints[child] || {};
            if (hint.ignore || !child.visible && ignoreHidden) continue;
            const before: number = 'before' in hint ? hint.before : 0;
            if (dir == 'column') {
                y += before;
            } else {
                x += before;
            }
            child.x = x;
            child.y = y;
            const after: number = 'after' in hint ? hint.after : 0;
            if (dir == 'column') {
                y += child.height + after + gap;
            } else {
                x += child.width + after + gap;
            }
        }
    }

    private _container: Sprite;
    private _layoutHints: Dictionary = new Dictionary();
    private _dirty: boolean = false;
    private _layoutConfig: Record<string, any>;
    private explicitWidth: number = 0;
    private explicitHeight: number = 0;

    public constructor(options?: Record<string, any>) {
        super();
        this._layoutConfig = { type: Block.LAYOUT_NONE };
        UIUtils.setProperties(this, options || {});
        this._container = new Sprite();
        addChild(this._container);
        addEventListener(Event.ADDED_TO_STAGE, this.addedToStage);
        this.invalidateLayout();
    }

    private get xmin(): number {
        let xmin: number = 0;
        if (this._container) {
            for (let i: number = 0, n: number = this.numElements; i < n; i++) {
                xmin = Math.min(xmin, this.getElementAt(i).x);
            }
        }
        return xmin;
    }
    private get ymin(): number {
        let ymin: number = 0;
        if (this._container) {
            for (let i: number = 0, n: number = this.numElements; i < n; i++) {
                ymin = Math.min(ymin, this.getElementAt(i).y);
            }
        }
        return ymin;
    }
    public get width(): number {
        if (this.explicitWidth) return this.explicitWidth;
        return this.width - this.xmin;
    }
    public get height(): number {
        if (this.explicitHeight) return this.explicitHeight;
        return this.height - this.ymin;
    }
    public set width(value: number) {
        if (this.width != value) {
            this.explicitWidth = value;
            this.resize();
        }
    }
    public set height(value: number) {
        if (this.height != value) {
            this.explicitHeight = value;
            this.resize();
        }
    }
    private resize(): void {
        if (this.width > 0 || this.height > 0) {
            graphics.clear();
            graphics.beginFill(0, 0);
            graphics.drawRect(0, 0, this.width, this.height);
            graphics.endFill();
        }
        if (this.width && this.height) {
            super.width = this.width + Math.max(0, -this.xmin);
            super.height = this.height + Math.max(0, -this.ymin);
        }
    }
    public get layoutConfig(): Record<string, any> {
        return this._layoutConfig;
    }

    public set layoutConfig(value: Record<string, any>): void {
        this._layoutConfig = value;
        this.invalidateLayout();
    }
    public get innerWidth(): number {
        return Math.max(0, (this.width || this.explicitWidth) - this.paddingLeft - this.paddingRight);
    }
    public get innerHeight(): number {
        return Math.max(0, (this.height || this.explicitHeight) - this.paddingTop - this.paddingBottom);
    }
    protected addedToStage(e: Event): void {
    }

    public addElement(e: DisplayObject, hint: Record<string, any> = undefined): DisplayObject {
        this._container.addChild(e);
        this.layElement(e, hint);
        return e;
    }

    public addElementAt(e: DisplayObject, index: number, hint: Record<string, any> = undefined): DisplayObject {
        this._container.addChildAt(e, index);
        this.layElement(e, hint);
        return e;
    }

    public layElement(e: DisplayObject, hint: Record<string, any>): Block {
        this._layoutHints[e] = hint;
        this.invalidateLayout();
        return this;
    }

    public getElementIndex(e: DisplayObject): number {
        return this._container.getChildIndex(e);
    }

    public getElementByName(name: string): DisplayObject {
        return this._container.getChildByName(name);
    }
    public getElementAt(index: number): DisplayObject {
        return this._container.getChildAt(index);
    }
    public get numElements(): number {
        return this._container.numChildren;
    }

    public removeElement(e: DisplayObject): void {
        this._container.removeChild(e);
        delete this._layoutHints[e];
        this.invalidateLayout();
    }

    public invalidateLayout(): void {
        if (!this._dirty) {
            this._dirty = true;
            setTimeout(this.maybeDoLayout, 0);
        }
    }

    public get paddingTop(): number {
        const config: Record<string, any> = this._layoutConfig;
        if ('paddingTop' in config) return config.paddingTop;
        if ('paddingVert' in config) return config.paddingVert;
        if ('padding' in config) return config.padding;
        return 0;
    }
    public get paddingRight(): number {
        const config: Record<string, any> = this._layoutConfig;
        if ('paddingRight' in config) return config.paddingRight;
        if ('paddingHoriz' in config) return config.paddingHoriz;
        if ('padding' in config) return config.padding;
        return 0;
    }
    public get paddingBottom(): number {
        const config: Record<string, any> = this._layoutConfig;
        if ('paddingBottom' in config) return config.paddingBottom;
        if ('paddingVert' in config) return config.paddingVert;
        if ('padding' in config) return config.padding;
        return 0;
    }
    public get paddingLeft(): number {
        const config: Record<string, any> = this._layoutConfig;
        if ('paddingLeft' in config) return config.paddingLeft;
        if ('paddingHoriz' in config) return config.paddingHoriz;
        if ('padding' in config) return config.padding;
        return 0;
    }
    public doLayout(): void {
        this._dirty = false;
        const type: string = this._layoutConfig.type;
        switch (type) {
            case "grid":
                this.applyGridLayout();
                break;
            case "flow":
                this.applyFlowLayout();
                break;
            case "none":
                break;
            default:
                Block.LOGGER.warn("Unknown layout config type ", type);
                break;
        }
        dispatchEvent(new Event(Block.ON_LAYOUT, true, true));
    }

    protected maybeDoLayout(): void {
        if (this._dirty) this.doLayout();
    }

    public applyShadow(): void {
        if (this.filters.length > 0) {
            return;
        }

        const dropShadow: DropShadowFilter = new DropShadowFilter();
        this._container.filters.push(dropShadow);
    }

    /////////////////
    // Helper methods
    /////////////////

    public addBitmapDataSprite(options: Record<string, any>, hint: Record<string, any> = undefined): BitmapDataSprite {
        const e: BitmapDataSprite = new BitmapDataSprite(options);
        this.addElement(e, hint);
        return e;
    }
    public addTextField(options: Record<string, any>, hint: Record<string, any> = undefined): TextField {
        const e: TextField = new TextField();
        e.antiAliasType = AntiAliasType.ADVANCED;
        if ('defaultTextFormat' in options) {
            e.defaultTextFormat = UIUtils.convertTextFormat(options.defaultTextFormat);
        }
        UIUtils.setProperties(e, options, {
            defaultTextFormat: UIUtils.convertTextFormat,
            background: UIUtils.convertColor
        });
        if (!('mouseEnabled' in options) && options.type != 'input') e.mouseEnabled = false;
        if (!('width' in options || 'height' in options || 'autoSize' in options)) {
            e.autoSize = TextFieldAutoSize.LEFT;
        }
        this.addElement(e, hint);
        return e;
    }

}

