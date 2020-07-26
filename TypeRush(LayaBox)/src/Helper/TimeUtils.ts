
/////////////////////////////////////////////////////////////////////////////
/// 时间相关操作
export default class CTimeUtils {
	constructor() {
	}

	//秒数转换成时间类型00:00:00
	public static SecsToTimeStr(num: number) {
		let h = Math.floor(num / 3600).toString();
		let m = Math.floor((num % 3600) / 60).toString();
		let s = (num % 60).toString();
		return CStrUtils.FillStrStart(h, 2, "0") + ':' + CStrUtils.FillStrStart(m, 2, "0") + ':' + CStrUtils.FillStrStart(s, 2, "0");
	}

	//秒数转换成时间类型00:00
	public static SecsToTimeHourStr(num: number) {
		let m = Math.floor(num / 60).toString();
		let s = (num % 60).toString();
		return CStrUtils.FillStrStart(m, 2, "0") + ':' + CStrUtils.FillStrStart(s, 2, "0");
	}

	//当天剩余秒数
	public static GetTodayRestSecs() {
		let today = new Date();
		today.setHours(0, 0, 0, 0);
		let todayZeroTick = Math.round(today.getTime() / 1000);
		let nowTick = Math.round(new Date().getTime() / 1000);
		return (24 * 3600 - (nowTick - todayZeroTick));
	}

	//格式化字符串函数
	public static FormatDateTimeStr(date, format) {
		var str = format;
		var Week = ['日', '一', '二', '三', '四', '五', '六'];

		str = str.replace(/yyyy|YYYY/, date.getFullYear());
		str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));
		var month = date.getMonth() + 1;
		str = str.replace(/MM/, month > 9 ? month.toString() : '0' + month);
		str = str.replace(/M/g, month);

		str = str.replace(/w|W/g, Week[date.getDay()]);

		str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
		str = str.replace(/d|D/g, date.getDate());

		str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
		str = str.replace(/h|H/g, date.getHours());
		str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
		str = str.replace(/m/g, date.getMinutes());

		str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
		str = str.replace(/s|S/g, date.getSeconds());
		return str;
	}
}