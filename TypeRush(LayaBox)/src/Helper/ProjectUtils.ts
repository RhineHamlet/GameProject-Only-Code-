
/**
 * 当前项目辅助函数
 */

export default class CProjectUtils {
	constructor() {
	}

	private static saveStagePoint: Laya.Point = new Laya.Point(0, 0);

	/**
	 * 强制舞台回到原点
	 */
	public static resetStageToZeroAndSaveOld(): void {

		CProjectUtils.saveStagePoint.setTo(Laya.stage.x, Laya.stage.y);
	}

	/**
	 * 获取舞台存储的位置
	 */
	public static getSaveStagePoint(): Laya.Point {
		return CProjectUtils.saveStagePoint;
	}

	/**
	 * 将浮动UI设置到原始舞台原点
	 * @param target 目标UI
	 */
	public static setFloatUIToStageOrigin(target: Laya.Sprite): void {
		target.x = -Laya.stage.x / Laya.stage.clientScaleX + (Laya.stage.width - target.width) / 2;
		target.y = -Laya.stage.y / Laya.stage.clientScaleY + (Laya.stage.height - target.height) / 2;
	}
}