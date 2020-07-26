
/////////////////////////////////////////////////////////////////////////////
/// 本地数据库相关操作
export default class CLocalDbUtils {
	constructor() {
	}

	//设置字符串数据
	public static SetItem(key: string, value: string): void {
		Laya.LocalStorage.setItem(key, value);
	}

	//获取字符串数据
	public static GetItem(key: string): string {
		return Laya.LocalStorage.getItem(key);
	}

	//获取Bool值数据
	public static GetBool(key: string): any {
		if (Laya.PlatformClass)
			return CLocalDbUtils.GetItem(key);
		else
			return CLocalDbUtils.GetItem(key) == "true" ? true : false;
	}

	//设置Json数据
	public static SetJson(key: string, value: any): void {
		Laya.LocalStorage.setJSON(key, value);
	}

	//获取Json数据
	public static GetJson(key: string): any {
		return Laya.LocalStorage.getJSON(key);
	}
}