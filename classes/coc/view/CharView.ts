/**
 * Coded by aimozg on 10.07.2017.
 */

export class CharView {
    private static LOGGER: ILogger = LoggerFactory.getLogger(CharView);
    private loading: boolean;
    private sprites: Record<string, any> = {}; // spritesheet/spritemap -> CharViewSprite
    public composite: CompositeImage;
    private ss_total: number;
    private ss_loaded: number;
    private file_total: number;
    private file_loaded: number;
    private _originX: number;
    private _originY: number;
    private _width: uint;
    private _height: uint;
    private scale: number;
    private pendingRedraw: boolean;
    private loaderLocation: string;
    private parts: Statement;
    private _palette: Palette;

    public get palette(): Palette {
        return this._palette;
    }
    public constructor() {
        this.clearAll();
    }
	/**
	 * @param location "external" or "internal"
	 */
    public reload(location: string = "external"): void {
        this.loaderLocation = location;
        if (this.loading) return;
        try {
            this.loading = true;
            this.clearAll();
            if (this.loaderLocation == "external") CharView.LOGGER.info("loading XML res/model.xml");
            CoCLoader.loadText("res/model.xml", function(success: boolean, result: string, e: Event): void {
                if (success) {
                    init(XML(result));
                } else {
                    CharView.LOGGER.error("XML file not found: " + e);
                    loading = false;
                }
            }, this.loaderLocation);
        } catch (e: Error) {
            this.loading = false;
            CharView.LOGGER.error("[ERROR]\n" + e.getStackTrace());
        }
    }
    private clearAll(): void {
        this.sprites = {};
        this.composite = undefined;
        this.ss_total = 0;
        this.ss_loaded = 0;
        this.file_total = 0;
        this.file_loaded = 0;
        this._width = 180;
        this._height = 220;
        this.scale = 1;
        this.pendingRedraw = false;
        this.parts = new StmtList();
        this.clearSprite();
    }
    private clearSprite(): void {
        let g: Graphics = graphics;
        g.clear();
        g.beginFill(0, 0);
        g.drawRect(0, 0, this._width, this._height);
        g.endFill();
    }
    private init(xml: XML): void {
        this._width = xml.;@width
        this._height = xml.;@height
        this._originX = xml.;@originX || 0;
        this._originY = xml.;@originY || 0;
        this.composite = new CompositeImage(this._width, this._height);
        this.ss_loaded = 0;
        this.ss_total = -1;
        /**/
        this.loadPalette(xml);
        let compiler: CharViewCompiler = new CharViewCompiler(this);
        this.parts = compiler.compileXMLList(xml.logic.children());
        let n: number = 0;
        let item: XML;
        for (item of xml.spritesheet) {
            n++;
            this.loadSpritesheet(xml, item);
        }
        for (item of xml.spritemap) {
            n++;
            this.loadSpritemap(xml, item);
        }
        this.ss_total = n;
        if (n == 0) this.loadLayers(xml);
        let g: Graphics = graphics;
        this.clearSprite();
        this.scale = parseFloat(xml.;@scale)
        this.scaleX = this.scale;
        this.scaleY = this.scale;
        this.loading = false;
        if (this.pendingRedraw) this.redraw();
    }
    private loadPalette(xml: XML): void {
        this._palette = new Palette();
        for (let xpal of xml.palettes.palette) {
            let lookups: Record<string, any> = {};
            for (let color of xpal.color) {
                lookups[color.;@name.toString()] = color.text().toString();
            }
            this._palette.addLookups(xpal.;@name.toString(), lookups;)
        }
        for (let prop of xml.properties.property) {
            let propname: string = prop.;@name.toString()

            let pp: PaletteProperty;
            let defaultt: uint = Color.convertColor(prop.;@default.toString();)
            let lookupNames: any = prop.;@palette.toString().split(',')
            if ('@src' in prop) {
                pp = new EvalPaletteProperty(this._palette, propname, defaultt, lookupNames, prop.;@src.toString())
            } else {
                pp = new PaletteProperty(this._palette, propname, defaultt, lookupNames);
            }
            this._palette.addPaletteProperty(pp);
        }
        for (let key of xml.colorkeys.key) {
            let src: uint = Color.convertColor(key.;@src.toString())
            let base: string = key.;@base.toString()
            let tf: string = key.;@transform.toString() || "";
            this._palette.addKeyColor(src, base, tf);
        }
    }
    public lookupColorValue(layername: string, propname: string, colorname: string): uint {
        return this._palette.lookupColor(layername, propname, colorname);
    }
    private loadLayers(xml: XML): void {
        this.file_loaded = 0;
        let item: XML;
        let n: number = 0;
        this.file_total = -1;
        for (item of xml.layers..layer) {
            let lpfx: string = item.;@name + "/";
            for (let sname of this.sprites) {
                if (sname.indexOf(lpfx) == 0) {
                    let sprite: CharViewSprite = this.sprites[sname];
                    this.composite.addLayer(sname, sprite.bmp,
                        sprite.dx - this._originX, sprite.dy - this._originY, false);
                }
            }
        }
        this.file_total = n;
        if (this.pendingRedraw) this.redraw();
    }
    private _character: Record<string, any> = {};
    public setCharacter(value: Record<string, any>): void {
        this._character = value;
    }
    public redraw(): void {
        if (this.file_total == 0 && this.ss_total == 0 && !this.loading) {
            this.reload();
        }
        this.pendingRedraw = true;
        if (this.ss_loaded != this.ss_total || this.file_loaded != this.file_total || (this.ss_total + this.file_total) == 0) {
            return;
        }
        this.pendingRedraw = false;

        // Mark visible layers
        this.composite.hideAll();
        this.parts.execute(new CharViewContext(this, this._character));

        this._palette.character = this._character;
        let bd: BitmapData = this.composite.draw(this._palette);
        let g: Graphics = graphics;
        g.clear();
        g.beginBitmapFill(bd);
        g.drawRect(0, 0, this._width, this._height);
        g.endFill();
        this.scaleX = this.scale;
        this.scaleY = this.scale;
    }
    private loadSpritemap(xml: XML, sm: XML): void {
        const filename: string = sm.;@file
        let path: string = xml.;@dir + filename;
        if (this.loaderLocation == "external") CharView.LOGGER.info('loading spritemap ' + path);
        CoCLoader.loadImage(path, function(success: boolean, result: BitmapData, e: Event): void {
            if (!success) {
                CharView.LOGGER.error("Spritemap file not found: " + e);
                ss_loaded++;
                if (pendingRedraw) redraw();
                return;
            }
            for (let cell of sm.cell) {
                let rect: /*String*/Array = cell.;@rect.toString().match(/^(\d+),(\d+),(\d+),(\d+)$/)
                let x: number = rect ? int(rect[1]) : cell.;@x
                let y: number = rect ? int(rect[2]) : cell.;@y
                let w: number = rect ? int(rect[3]) : cell.;@w
                let h: number = rect ? int(rect[4]) : cell.;@h
                let f: string = cell.;@name
                let dx: number = cell.;@dx
                let dy: number = cell.;@dy
                let bd: BitmapData = new BitmapData(w, h, true, 0);
                bd.copyPixels(result, new Rectangle(x, y, w, h), new Point(0, 0));
                sprites[f] = new CharViewSprite(bd, dx, dy);
            }
            ss_loaded++;
            if (ss_loaded == ss_total) loadLayers(xml);
        }, this.loaderLocation);
    }
    private loadSpritesheet(xml: XML, ss: XML): void {
        const filename: string = ss.;@file
        const cellwidth: number = ss.;@cellwidth
        const cellheight: number = ss.;@cellheight
        let path: string = xml.;@dir + filename;
        if (this.loaderLocation == "external") CharView.LOGGER.info('loading spritesheet ' + path);
        CoCLoader.loadImage(path, function(success: boolean, result: BitmapData, e: Event): void {
            if (!success) {
                CharView.LOGGER.error("Spritesheet file not found: " + e);
                ss_loaded++;
                if (pendingRedraw) redraw();
                return;
            }
            let y: number = 0;
            for (let row of ss.row) {
                let x: number = 0;
                let files: /*String*/Array = row.text().toString().split(",");
                for (let f of files) {
                    if (f) {
                        let bd: BitmapData = new BitmapData(cellwidth, cellheight, true, 0);
                        bd.copyPixels(result, new Rectangle(x, y, cellwidth, cellheight), new Point(0, 0));
                        sprites[f] = new CharViewSprite(bd, 0, 0);
                    }
                    x += cellwidth;
                }
                y += cellheight;
            }
            ss_loaded++;
            if (ss_loaded == ss_total) loadLayers(xml);
        }, this.loaderLocation);
    }

}

