
/////////////////////////////////////////////////////////////////////////////
/// 字符串相关操作
export default class CStrUtils {
	constructor() {
	}

	//判断对象是否为空字符(未定义变量和null变量均为空)
	//let x1; 			IsEmptyStr(x1) = true;
	//let x2 = null; 	IsEmptyStr(x2) = true;
	//let x3 = NaN; 	IsEmptyStr(x3) = true;
	//let x4 = 0; 		IsEmptyStr(x4) = true;
	//let x5 = "ddd"; 	IsEmptyStr(x5) = false;
	//let x6 = ""; 		IsEmptyStr(x6) = true;
	//let x7 = false; 	IsEmptyStr(x7) = true;
	//let x8 = []; 		IsEmptyStr(x8) = true;
	public static IsEmptyStr(str: any) {
		if (typeof (str) != "string")
			return true;
		if (str.length > 0)
			return false;
		return true;
	}

	//在字符串前面填充字符串到指定长度
	public static FillStrStart(str: string, len: number, ch: string) {
		while (str.length < len)
			str = ch + str;
		return str;
	}

	//在字符串前面填充字符串到指定长度
	public static FillStrEnd(str: string, len: number, ch: string) {
		while (str.length < len)
			str = str + ch;
		return str;
	}

	//判断姓名是否都是汉字
	public static IsChineseWord(str: string): boolean {
		if (str == null || str == "")
			return false;
		for (let i: number = 0; i < str.length; i++) {
			if (!(/^[\u3220-\uFA29]+$/.test(str[i])))
				return false;
		}
		return true;
	}

	//验证手机号格式是否合法
	public static CheckPhoneNum(PhoneNum: string): boolean {
		let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
		if (!phoneReg.test(PhoneNum)) {
			return false;
		}
		return true;
	}

	//验证两个手机号是否一致(前三位，后四位)
	public static CheckTwoPhoneNumIsSame(str1: string, str2: string) {
		if (str1.substr(0, 3) == str2.substr(0, 3) && str1.substr(7, 4) == str2.substr(7, 4)) {
			return true;
		}
		else {
			return false;
		}
	}

	//判断昵称字符数
	public static Chkstrlen(str): number {
		if (str) {
			var strlen = 0;
			for (var i = 0; i < str.length; i++) {
				if (str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
					strlen += 2;
				else
					strlen++;
			}
			return strlen;
		}
	}

	//判断身份证号格式是否合法
	//身份证号规则：长度18位 第1到6位是省市区代码，第7-14位是出生日期，第15-17位是个人编号，第18位为校验位，最后一位允许为X
	public static IsValidIdCard(str: string): boolean {
		let iSum = 0;
		let info = "";
		if (!/^\d{17}(\d|x)$/i.test(str))
			return false;

		str = str.replace(/x$/i, "a");
		if (parseInt(str.substr(0, 2)) == null)
			return false;

		let sBirthday = str.substr(6, 4) + "-" + Number(str.substr(10, 2)) + "-" + Number(str.substr(12, 2));
		let d = new Date(sBirthday.replace(/-/g, "/"));
		if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()))
			return false;

		for (var i = 17; i >= 0; i--) { iSum += (Math.pow(2, i) % 11) * parseInt(str.charAt(17 - i), 11); }
		if (iSum % 11 != 1)
			return false;

		return true;
	}

	//将字符串截断到固定字节长度(1个英文字符为1字节，1个中文为2字节)
	//注意：中文不会从中间截断，如TruncStringByBytes("abc我的", 4)，返回abc我
	public static TruncStringByBytes(str: string, bytesLen: number): string {
		if (typeof (str) != "string" || bytesLen <= 0)
			return "";

		var bytesCount = 0;
		for (var i = 0; i < str.length; i++) {
			let cNum = (/^[\u0000-\u00ff]$/.test(str.charAt(i))) ? 1 : 2;
			bytesCount += cNum;

			if (bytesCount >= bytesLen)
				return str.substr(0, i + 1);
		}
		return str;
	}

	public static delSpace(str: string) {
		return str.replace(/\s*/g, "");
	}
}