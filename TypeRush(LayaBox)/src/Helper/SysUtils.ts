import CTimeUtils from "./TimeUtils";

/////////////////////////////////////////////////////////////////////////////
/// 系统辅助类
export default class CSysUtils {
	private static m_AjustRatio = null;
	private static m_PrintLog = true;

	constructor() {
	}

	//是否输出日志
	public static ToggleIsPrintLog() {
		CSysUtils.m_PrintLog = !CSysUtils.m_PrintLog;
	}

	//输出Log日志
	public static LOG(_data: string): void {
		if (!CSysUtils.m_PrintLog)
			return;

		var t = CTimeUtils.FormatDateTimeStr(new Date(), "YYYY-MM-DD hh:mm:ss");
		console.log(t + " " + _data);
	}

	//输出warn日志
	public static WARN(_data: string): void {
		if (!CSysUtils.m_PrintLog)
			return;

		var t = CTimeUtils.FormatDateTimeStr(new Date(), "YYYY-MM-DD hh:mm:ss");
		console.warn(t + " " + _data);
	}

	//输出错误日志
	public static ERR(_data: string): void {
		if (!CSysUtils.m_PrintLog)
			return;

		var t = CTimeUtils.FormatDateTimeStr(new Date(), "YYYY-MM-DD hh:mm:ss");
		console.error(t + " " + _data);
	}

	//解析Json字符串不抛出异常，返回数组
	//请使用数组的解构赋值，例如let [jsonRet, jsonObj] = this.JsonDecode("{\"a\":}");
	public static JsonDecodeNoException(jsonData: string) {
		try {
			return [true, JSON.parse(jsonData)];
		} catch (error) {
			return [false, null];
		}
	}


	/**
	 * 范围内获取整数随机数(包含min和max)
	 * @param min 最小整数
	 * @param max 最大整数
	 */
	public static GetRandomInt(min: number, max: number): number {
		var Gap = max - min;
		var Rand = Math.random();
		return (min + Math.round(Rand * Gap));
	}

	/**
	 * 获取随机字符串
	 * @param len 长度
	 * @param type 类型(0-大小写数字混合，1-大小写混合， 2-仅小写 3-仅数字 4-数字、字母小写)
	 */
	public static GetRandomStr(len: number, type: string = '0'): string {
		const STR_CHAR_ALL = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		const STR_CHAR_LOW_UPPER = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const STR_CHAR_LOW = "abcdefghijklmnopqrstuvwxyz";
		const STR_CHAR_NUM = "0123456789";
		const STR_CHAR_NUM_LOW = "0123456789abcdefghijklmnopqrstuvwxyz";

		let retStr = "";
		for (let i = 0; i < len; i++) {
			if(type == '0') {
				retStr += STR_CHAR_ALL.substr(CSysUtils.GetRandomInt(0, STR_CHAR_ALL.length-1), 1);
			}
			else if(type == '1') {
				retStr += STR_CHAR_LOW_UPPER.substr(CSysUtils.GetRandomInt(0, STR_CHAR_LOW_UPPER.length-1), 1);
			}
			else if(type == '2') {
				retStr += STR_CHAR_LOW.substr(CSysUtils.GetRandomInt(0, STR_CHAR_LOW.length-1), 1);
			}
			else if(type == '3') {
				retStr += STR_CHAR_NUM.substr(CSysUtils.GetRandomInt(0, STR_CHAR_NUM.length-1), 1);
			}
			else if(type == '4') {
				retStr += STR_CHAR_NUM_LOW.substr(CSysUtils.GetRandomInt(0, STR_CHAR_NUM_LOW.length-1), 1);
			}
		}
		return retStr;
	}

	/**
	 * 深拷贝对象，使用Json打包再解包实现（需要效率的地方请谨慎使用）
	 * @param obj 要复制的对象
	 */
	public static DeepCopy(obj: any): any {
		return JSON.parse(JSON.stringify(obj));
	}

	//获取UI修正比例
	public static GetUIAjustRatio() {
		if (CSysUtils.m_AjustRatio == null) {
			let designRate = 1136 / 640;
			let curRate = Laya.Browser.width / Laya.Browser.height;

			if (Laya.stage.scaleMode == Laya.Stage.SCALE_FIXED_HEIGHT) {
				CSysUtils.m_AjustRatio = 1;
			} else {
				CSysUtils.m_AjustRatio = designRate / curRate;
			}
		}
		return CSysUtils.m_AjustRatio;
	}

	//自适应修正控件缩放
	public static AutoAjustUIScale(_node): void {
		let ajustRatio = CSysUtils.GetUIAjustRatio();
		_node.scaleX = (ajustRatio > 1) ? _node.scaleX : (_node.scaleX * ajustRatio);
		_node.scaleY = (ajustRatio > 1) ? (_node.scaleY / ajustRatio) : _node.scaleY;
	}

	//世界坐标矩形碰撞判断
	public static IsIntersectsRect(obj1, obj2): boolean {
		let dtX = Math.abs(obj1.x - obj2.x);
		let dtY = Math.abs(obj1.y - obj2.y);
		if ((dtX > (obj1.width / 2 + obj2.width / 2)) || (dtY > (obj1.height / 2 + obj2.height / 2)))
			return false;
		return true;
	}

	//本地坐标矩形碰撞判断
	public static IsIntersectsRectLocal(obj1, obj2): boolean {
		let globalObj2Pt = obj2.parent.localToGlobal(new Laya.Point(obj2.x, obj2.y));
		let dtX = Math.abs(obj1.x - globalObj2Pt.x);
		let dtY = Math.abs(obj1.y - globalObj2Pt.y);
		if ((dtX > (obj1.width / 2 + obj2.width / 2)) || (dtY > (obj1.height / 2 + obj2.height / 2)))
			return false;
		return true;
	}

	//根据固定距离检测矩形碰撞判断
	public static IsIntersectsRectFixed(obj1, obj2, rectLen): boolean {
		let dtX = Math.abs(obj1.x - obj2.x);
		let dtY = Math.abs(obj1.y - obj2.y);
		if ((dtX > (rectLen / 2 + rectLen / 2)) || (dtY > (rectLen / 2 + rectLen / 2)))
			return false;
		return true;
	}

	//当前点击位置矩形判断
	public static IsMouseIntersectsRect(obj): boolean {
		let dtX = Math.abs(Laya.stage.mouseX - obj.x);
		let dtY = Math.abs(Laya.stage.mouseY - obj.y);
		if ((dtX > obj.width / 2) || (dtY > obj.height / 2))
			return false;
		return true;
	}

	//当前点击节点位置碰撞判断
	public static IsMouseIntersectsNodeRect(node, obj): boolean {
		let dtX = Math.abs(node.mouseX - obj.x);
		let dtY = Math.abs(node.mouseY - obj.y);
		if ((dtX > obj.width / 2) || (dtY > obj.height / 2))
			return false;
		return true;
	}

	//绘制节点矩形区域
	public static DrawNodeRect(_node: any): void {
		// let img = new laya.ui.Image();
		// img.pos(0, 0);
		// img.graphics.drawRect(0, 0, _node.width, _node.height, null, "#ffff00");
		// img.pivotX = _node.width * 0.5;
		// img.pivotY = _node.height * 0.5;
		// _node.addChild(img);
	}

	//设置全局蒙层
	public static ShowMaskLayer(_node: Laya.Node, canClick: boolean = true, zOrder: number = 1000000000): void {
		//先移除对象，保证只会出现一层蒙层
		_node.removeChildByName("mask_layer_common_yq7vrh4538caufr6");

		let spr = new Laya.Sprite();
		spr.zOrder = zOrder;
		spr.name = "mask_layer_common_yq7vrh4538caufr6";
		_node.addChild(spr);
		spr.alpha = 0.65;
		spr.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
		spr.mouseThrough = canClick;
	}

	//显示所有子对象
	public static ShowAllChildren(node: Laya.Node) {
		for (let i = 0; i < node.numChildren; i++) {
			let it: any = node.getChildAt(i);
			it.visible = true;
		}
	}

	//隐藏所有子对象
	public static HideAllChildren(node: Laya.Node) {
		for (let i = 0; i < node.numChildren; i++) {
			let it: any = node.getChildAt(i);
			it.visible = false;
		}
	}

	//隐藏特殊标志开头Name的子对象
	public static HideAllChildrenByPrefix(node: Laya.Node, prefix: string) {
		for (let i = 0; i < node.numChildren; i++) {
			let it: any = node.getChildAt(i);
			if (it.name.substr(0, prefix.length) == prefix)
				it.visible = false;
		}
	}

	//显示特殊标志开头Name的子对象
	public static ShowAllChildrenByPrefix(node: Laya.Node, prefix: string) {
		for (let i = 0; i < node.numChildren; i++) {
			let it: any = node.getChildAt(i);
			if (it.name.substr(0, prefix.length) == prefix)
				it.visible = true;
		}
	}

	//移除素有子对象
	public static RemoveAllChildren(node: Laya.Node) {
		while (node.numChildren > 0)
			node.removeChildAt(0);
	}

	//判断鱼是否在屏幕内
	public static IsFishInWindow(fishPos: any): boolean {
		if (fishPos.x > 0 && fishPos.y > 0 && fishPos.x < Laya.stage.width && fishPos.y < Laya.stage.height)
			return true;
		return false;
	}

	// 打印JS的调用堆栈( 可以用来调试 )
	public static Trace(count?: number) {
		let caller = arguments.callee.caller;
		let maxCount = count || 10;
		console.log("---------------------Trace--->>>---------------------");
		let i = 0;
		while (caller && i < maxCount) {
			console.log("-----%d----\n", i);
			console.log(caller.toString());
			caller = caller.caller;
			i++;
		}
		console.log("---------------------Trace---<<<----------------------");
	}

	public static GetUUID(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	// 宽高比大于2的则视为刘海屏手机/全面屏手机
	public static IsFullScreen(): boolean {
		return Laya.Browser.width / Laya.Browser.height > 2;
	}

	//设置精灵Mask显示百分比(percent在0-1之间)
	public static SetSpriteMaskPercent(spr: Laya.Sprite, percent: number) {
		if (!spr.mask)
			spr.mask = new Laya.Sprite;
		spr.mask.graphics.clear(true);
		spr.mask.graphics.drawRect(0, 0, spr.width * percent, spr.height, "#ff000000");
		spr.mask.pos(0, 0);
	}

	//快捷创建图片
	public static EasyCreateImage(skin: string, x: number = 0, y: number = 0, anchorX: number = 0, anchorY: number = 0, zOrder: number = 0, name: string = ""): Laya.Image {
		let img = new Laya.Image();
		img.skin = skin;
		img.name = name;
		img.pos(x, y);
		img.anchorX = anchorX;
		img.anchorY = anchorY;
		img.zOrder = zOrder;
		return img;
	}

	//快捷浅拷贝图片
	public static Clone(Img: Laya.Image): Laya.Image {
		let img = new Laya.Image();
		img.skin = Img.skin;
		img.name = Img.name;
		img.pos(Img.x, Img.y);
		img.anchorX = Img.anchorX;
		img.anchorY = Img.anchorY;
		img.zOrder = Img.zOrder;
		return img;
	}

	//快捷创建文字
	public static EasyCreateLabel(text: string, fontName: string = "Microsoft YaHei", fontSize: number = 12, fontColor: string = "#FFFFFF", x: number = 0, y: number = 0,
		anchorX: number = 0, anchorY: number = 0, zOrder: number = 0, align: string = "center", name: string = ""): Laya.Label {
		let lb = new Laya.Label(text);
		if (fontName != '')
			lb.font = fontName;
		lb.fontSize = fontSize;
		lb.color = fontColor;
		lb.pos(x, y);
		lb.align = align;
		lb.anchorX = anchorX;
		lb.anchorY = anchorY;
		lb.zOrder = zOrder;
		lb.name = name;
		return lb;
	}

	/**
	 * 获取当前页面参数
	 * @param key 参数名称
	 * @returns 返回null或字符串
	 */
	public static GetQueryString(key: string): string {
		return Laya.Utils.getQueryString(key);
	}

	/**
     * 克隆sprite
     * @param sp 要克隆的sprite
     */
    public CloneSprite(sp: Laya.Sprite) {
        //参数定义
        let ox = (sp.getBounds().width / 2);
        let oy = (sp.getBounds().height / 2);
        let ms: Laya.Sprite = new Laya.Sprite();

        //调整参数
        if (ox % 512 == 0) { ox++; }
        if (oy % 512 == 0) { oy++; }

        //宽高小于8192的返回克隆sprite
        if (ox * 2 <= 8192 && oy * 2 <= 8192) {
            let hc: Laya.HTMLCanvas = sp.drawToCanvas(ox * 2, oy * 2, 0, 0);
            ms.graphics.drawTexture(hc.getTexture());//把截图绘制到精灵上
            return ms;
        }

        //宽高超过限制的分为4块组合为一个返回克隆sprite
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                let hc: Laya.HTMLCanvas = sp.drawToCanvas(ox, oy, -i * ox, -j * oy);
                let ig: Laya.Sprite = new Laya.Sprite();
                ig.graphics.drawTexture(hc.getTexture());
                ig.x = i * ox;
                ig.y = j * oy;
                ms.addChild(ig);
            }
        }
        return ms;
    }
}