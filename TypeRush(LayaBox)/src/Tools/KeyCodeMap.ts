
/**
 * 键盘代码映射
 */
export default class KeyCodeMap {

    private static KEYCODE_NUM = ['0','1','2','3','4','5','6','7','8','9'];
    private static KEYCODE_NUM_SHIFT = [')','!','@','#','$','%','^','&','*','('];

    private static KEYCODE_CHAR = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    private static KEYCODE_CHAR_SHIFT = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    private static KEYCODE_SIGN1 = [';','=',',','-','.','/','`'];
    private static KEYCODE_SIGN1_SHIFT = [':','+','<','_','>','?','~'];

    private static KEYCODE_SIGN2 = ['[','\\',']','\''];
    private static KEYCODE_SIGN2_SHIFT = ['{','|','}','"'];

    /**
     * 从键盘码获取对应字符
     * @param keyCode 键盘码
     * @param isShiftDown 是否按下Shift
     * @returns 正确返回字符，否则会返回空字符串
     */
    public static getCharFromKeyCode(keyCode: number, isShiftDown: boolean): String {
        //空格
        if(keyCode == 32)
            return " ";
        
        //数字
        if(keyCode >= 48 && keyCode <=57)
        {
            let idx = keyCode - 48;
            return isShiftDown ? this.KEYCODE_NUM_SHIFT[idx] : this.KEYCODE_NUM[idx];
        }

        //字符
        if(keyCode >= 65 && keyCode <=90)
        {
            let idx = keyCode - 65;
            return isShiftDown ? this.KEYCODE_CHAR_SHIFT[idx] : this.KEYCODE_CHAR[idx];
        }
        
        //特殊符号1
        if(keyCode >= 186 && keyCode <=192)
        {
            let idx = keyCode - 186;
            return isShiftDown ? this.KEYCODE_SIGN1_SHIFT[idx] : this.KEYCODE_SIGN1[idx];
        }
        
        //特殊符号2
        if(keyCode >= 219 && keyCode <=222)
        {
            let idx = keyCode - 219;
            return isShiftDown ? this.KEYCODE_SIGN2_SHIFT[idx] : this.KEYCODE_SIGN2[idx];
        }

        return '';
    }
}