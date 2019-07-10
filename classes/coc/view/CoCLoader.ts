/**
 * Coded by aimozg on 23.07.2017.
 */



/**
 *
 */
export class CoCLoader {
    private static LOGGER: ILogger = LoggerFactory.getLogger(CoCLoader);
    public CoCLoader() {
    }
    // [path: string]=>String
    private static TEXT_BUNDLE: Record<string, any> = {};

    // [Embed(source = "../../../res/model.xml", mimeType = "application/octet-stream")]
    public static BUNDLE_RES_MODEL_XML: Class;

    public static bundleText(key: string, c: Class): void {
        if (c) TEXT_BUNDLE[key] = new c();
    }

    // [path: string]=>BitmapData
    private static IMAGE_BUNDLE: Record<string, any> = {};

    //    [Embed(source="../../../res/char1.png", mimeType="image/png")]
    //    public static const BUNDLE_RES_CHAR1_PNG:Class;

    // [Embed(source = "../../../res/charview/body.png", mimeType = "image/png")]
    public static BUNDLE_RES_CHARVIEW_BODY_PNG: Class;

    // [Embed(source = "../../../res/charview/extra.png", mimeType = "image/png")]
    public static BUNDLE_RES_CHARVIEW_EXTRA_PNG: Class;

    // [Embed(source = "../../../res/charview/hair.png", mimeType = "image/png")]
    public static BUNDLE_RES_CHARVIEW_HAIR_PNG: Class;

    // [Embed(source = "../../../res/charview/head.png", mimeType = "image/png")]
    public static BUNDLE_RES_CHARVIEW_HEAD_PNG: Class;

    // [Embed(source = "../../../res/charview/lewd.png", mimeType = "image/png")]
    public static BUNDLE_RES_CHARVIEW_LEWD_PNG: Class;

    // [Embed(source = "../../../res/charview/tails.png", mimeType = "image/png")]
    public static BUNDLE_RES_CHARVIEW_TAILS_PNG: Class;

    // [Embed(source = "../../../res/charview/wings.png", mimeType = "image/png")]
    public static BUNDLE_RES_CHARVIEW_WINGS_PNG: Class;

    public static bundleImage(key: string, c: Class): void {
        var o: BitmapData = c ? ((new c() as Bitmap).bitmapData) : undefined;
        if (o) IMAGE_BUNDLE[key] = o;
    }
    /**
     * @param path
     * @param callback Function (success:Boollean, result: any,event:Event): any
     * where result is String or Error
     * @param location "external", "internal"
     */
    public static loadText(path: string, callback, location: string = "external"): void {
        function orLocal(e: Event): void {
            if (path in TEXT_BUNDLE) {
                setTimeout(callback, 0, true, TEXT_BUNDLE[path], new Event("complete"));
            } else {
                setTimeout(callback, 0, false, undefined, e);
            }
        }
        if (path.indexOf("./") == 0) path = path.slice(2);
        switch (location) {
            case "internal":
                orLocal(new ErrorEvent("error", false, false,
                    "Internal resource " + path + "not found"));
                break;
            case "external":
                var loader: URLLoader = new URLLoader();
                loader.addEventListener(Event.COMPLETE, function (e: Event): void {
                    try {
                        LOGGER.info("Loaded external " + path);
                        TEXT_BUNDLE[path] = loader.data;
                    } catch (e: Error) {
                        LOGGER.warn(e.name + " loading external " + path + ": " + e.message);
                        orLocal(new ErrorEvent("error", false, false, e.message));
                        return;
                    }
                    callback(true, loader.data, e);
                });
                var req: URLRequest = new URLRequest(path);
                loader.addEventListener(IOErrorEvent.IO_ERROR, function (e: IOErrorEvent): void {
                    LOGGER.warn(e.type + " loading external " + path + ": " + e.toString());
                    orLocal(e);
                });
                try {
                    loader.load(req);
                } catch (e: Error) {
                    LOGGER.warn(e.name + " loading external " + path + ": " + e.message);
                    orLocal(new ErrorEvent("error", false, false, e.message));
                }
                break;
            default:
                throw new Error("Incorrect location " + location);
        }

    }
    /**
     * @param path
     * @param callback Function (success:Boollean, result:BitmapData, e:Event): any
     * @param location "external", "internal"
     */
    public static loadImage(path: string, callback, location: string = "external"): void {
        function orLocal(e: Event): void {
            if (path in IMAGE_BUNDLE) {
                setTimeout(callback, 0, true, IMAGE_BUNDLE[path], new Event("complete"));
            } else {
                setTimeout(callback, 0, false, undefined, e);
            }
        }
        if (path.indexOf("./") == 0) path = path.slice(2);
        switch (location) {
            case "internal":
                orLocal(new ErrorEvent("error", false, false,
                    "Internal resource " + path + "not found"));
                break;
            case "external":
                var loader: Loader = new Loader();
                var cli: LoaderInfo = loader.contentLoaderInfo;
                cli.addEventListener(Event.COMPLETE, function (e: Event): void {
                    var bmp: Bitmap = undefined;
                    try {
                        bmp = cli.content as Bitmap;
                    } catch (e: Error) {
                        LOGGER.warn(e.name + " loading external " + path + ": " + e.message);
                        orLocal(new ErrorEvent("error", false, false, e.message));
                        return;
                    }
                    if (bmp) {
                        LOGGER.info("Loaded external " + path);
                        IMAGE_BUNDLE[path] = bmp.bitmapData;
                        callback(true, bmp.bitmapData, e);
                    } else {
                        LOGGER.warn("Not found external " + path);
                        callback(false, undefined, e);
                    }
                });
                cli.addEventListener(IOErrorEvent.IO_ERROR, function (e: IOErrorEvent): void {
                    LOGGER.warn(e.type + " loading external " + path + ": " + e.toString());
                    orLocal(e);
                });
                try {
                    loader.load(new URLRequest(path));
                } catch (e: Error) {
                    LOGGER.warn(e.name + " loading external " + path + ": " + e.message);
                    orLocal(new ErrorEvent("error", false, false, e.message));
                }
                break;
            default:
                throw new Error("Incorrect location " + location);
        }

    }

    private static bundleResources(CoCLoader: Class): void {
        var dt: XML = describeType(CoCLoader);
        // <type name="coc.view::CoCLoader" ...
        var classname: string = String(dt.@name);
        var extraPath: string = "classes/";
        if (classname.indexOf('::') >= 0) {
            var packageName: string = classname.split('::')[0];
            if (packageName) {
                extraPath += packageName.replace(/\./g, '/') + "/";
                // => extraPath = "classes/coc/view/"
            }
        }
        for (var decl: XML in dt.variable.(@type == "Class")) {
            /*
            <variable name="BUNDLE_RES_MODEL_XML" type="Class">
                <metadata name="Embed">
                    <arg key="source" value="../../../res/model.xml"/>
                    <arg key="mimeType" value="application/octet-stream"/>
                </metadata>
            </variable>
             */
            var name: string = decl.@name;
            var meta: XMLList = decl.metadata.(@name == "Embed");
            var src: string = meta.arg.(@key == "source").@value;
            var mime: string = meta.arg.(@key == "mimeType").@value;
            if (name && src) {
                var value: Class = CoCLoader[name];
                src = extraPath + src;
                // src = "classes/coc/view/../../../res/model.xml"
                while (true) {
                    var src2: string = src.replace(/[^\/]+\/\.\.\//, '');
                    // src  = "classes/coc/view/../../../res/model.xml"
                    // src2 = "classes/coc/"+     "../../res/model.xml"
                    if (src == src2) break;
                    src = src2;
                }
                if (mime.indexOf('image/') == 0) {
                    bundleImage(src, value);
                } else {
                    bundleText(src, value);
                }
            }
        }
    }
    bundleResources(CoCLoader);
}

