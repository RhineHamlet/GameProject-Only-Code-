import FightScene from "../Scenes/FightScene";
import DC from "../../../GlobalData/DataCenter";
import ResLoader from "../../../Tools/ResLoader";
import TreasureBoxBattle from "../../Data/TreasureBoxBattle";
import CSysUtils from "../../../Helper/SysUtils";
import KeyCodeMap from "../../../Tools/KeyCodeMap";
import DT from "../../../GlobalData/DataConst";

/**
 * 开启宝箱界面
 */
export default class TreasureBoxPage extends Laya.Script {

    private static MAX_INPUT_SECS: number = 10; //最大输入秒数
    private static TIMER_INTERVAL: number = 50; //定时器时间间隔

    private m_wordList: Array<string> = ["password"];

    private m_txtDisplay: Laya.Text;            //标题信息
    private m_txtInput: Laya.Text;              //输入的文字
    private m_txtTitle: Laya.Text;              //显示的文字
    private m_txtRestSecs: Laya.Text;           //剩余时间显示

    private m_restSecs = 0;                     //剩余时间
    private m_curSelWordIdx = -1;               //当前选择字符串索引
    private m_curSelWord: string = "";          //当前选择字符串
    private m_curInputIdx = 0;                  //目前字符串输入到第几个字符
    private m_isShiftDown = false;              //Shift键是否按下
    private m_isShiftUsed = false;              //Shift组合键是否使用

    private m_treasureBoxPanel;                 //宝箱Panel
    private m_treasureBox: TreasureBoxBattle;   //宝箱资源

    /** 构造函数 */
    constructor() {
        super();
    }

    onEnable(): void {

        //初始化密码字符
        this.m_wordList = [];
        for(let i=0; i<100; i++)
            this.m_wordList.push(CSysUtils.GetRandomStr(6, '4'));

        //预加载怪物和宝箱动画资源
        ResLoader.preLoadEnemySkin([1]);
        ResLoader.preLoadTreasureBox([1]);

        //绑定变量
        this.m_txtDisplay = this.owner.getChildByName("txt_display") as Laya.Text;
        this.m_txtTitle = this.owner.getChildByName("txt_title") as Laya.Text;
        this.m_txtInput = this.owner.getChildByName("txt_input") as Laya.Text;
        this.m_txtRestSecs = this.owner.getChildByName("txt_time") as Laya.Text;

        //初始化参数
        this.m_restSecs = TreasureBoxPage.MAX_INPUT_SECS;
        this.m_curSelWordIdx = CSysUtils.GetRandomInt(0, this.m_wordList.length - 1);
        this.m_curSelWord = this.m_wordList[this.m_curSelWordIdx];

        //初始化界面
        this.m_txtDisplay.text = this.m_curSelWord;
        this.m_txtInput.underline = true;
        this.m_txtInput.underlineColor = "#ff0000";

        //设置事件
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
        this.owner.timer.loop(TreasureBoxPage.TIMER_INTERVAL, this, this.checkTimeoutIdle);

        //创建宝箱
        this.m_treasureBoxPanel = this.owner.getChildByName("ani_panel") as Laya.Sprite;
        this.m_treasureBox = new TreasureBoxBattle(1);
        this.m_treasureBox.pos(0, 0);
        this.m_treasureBoxPanel.addChild(this.m_treasureBox);
    }

    //检测是否超时函数
    private checkTimeoutIdle(): void {
        this.m_restSecs -= (TreasureBoxPage.TIMER_INTERVAL / 1000);
        this.m_txtRestSecs.text = "" + Math.round(this.m_restSecs);

        if (this.m_restSecs <= 0) {
            this.owner.timer.clear(this, this.checkTimeoutIdle);

            //关闭窗口
            this.fadeHideWindow();
        }
    }

    //重新生成一个字符串
    public reCreateWord(): void {

        //产生一个和上次不同的字符
        var rndIdx = this.m_curSelWordIdx;
        while (this.m_curSelWordIdx == rndIdx) {
            rndIdx = CSysUtils.GetRandomInt(0, this.m_wordList.length - 1);
        }

        //更新当前选中的字符
        this.m_curSelWordIdx = rndIdx;
        this.m_curSelWord = this.m_wordList[this.m_curSelWordIdx];

        this.m_txtDisplay.text = this.m_curSelWord;
        this.m_txtInput.text = "";
        this.m_curInputIdx = 0;
    }

    /**
     * 键盘按下事件处理
     * @param e 事件对象
     */
    public onKeyDown(e): void {

        //Shift按下处理
        if (e.keyCode == 16) {
            this.m_isShiftDown = true;
        }
        else {
            //按下非Shift键的时候，如果Shift键已经按下则认为当次Shift有效,此举是为了防止Shift键提前松开
            this.m_isShiftUsed = this.m_isShiftDown;
        }
    }

    /**
     * 按键弹起事件
     * @param e 事件对象
     */
    public onKeyUp(e): void {

        if (e.keyCode == 16)
            this.m_isShiftDown = false;

        //检测是否是输入的字符
        let charInput: String = KeyCodeMap.getCharFromKeyCode(e.keyCode, this.m_isShiftUsed);
        if (charInput == this.m_curSelWord.substr(this.m_curInputIdx, 1)) {
            Laya.SoundManager.playSound("Music/dazi.mp3", 1);

            //输入字符显示
            this.m_txtInput.text += charInput;
            this.m_curInputIdx++;

            if (this.m_curInputIdx == this.m_curSelWord.length) {
                this.m_treasureBox.openBox();
                this.owner.timer.clear(this, this.checkTimeoutIdle);

                this.reCreateWord();
                this.m_txtDisplay.visible = false;
                this.m_txtRestSecs.visible = false;
                this.m_txtInput.text = "密码正确";
                this.m_txtInput.align = "center";
                this.m_txtInput.underline = false;

                //2秒后渐隐窗体
                Laya.timer.once(1000, this, function() {
                    this.fadeHideWindow();
                });

                //不同概率产生不同效果
                let rndType = CSysUtils.GetRandomInt(1, 100);
                if (rndType >= 1 && rndType <= 10) {
                    let rndHp = CSysUtils.GetRandomInt(10, 30);
                    DC.userHpDelta += rndHp;
                    DC.userHp += rndHp;
                    this.m_txtTitle.text = "增加血量上限" + rndHp;
                    Laya.stage.event(DT.EVENT_ATTR_RENEW, [DT.ATTR_TYPE_HP, rndHp, 30 * 1000]);
                } else if (rndType >= 11 && rndType <= 20) {
                    let rndAttack = CSysUtils.GetRandomInt(1, 10);
                    DC.userAttackDelta += rndAttack;
                    this.m_txtTitle.text = "增加攻击力" + rndAttack;
                    Laya.stage.event(DT.EVENT_ATTR_RENEW, [DT.ATTR_TYPE_ATTACK, rndAttack, 30 * 1000]);
                } else if (rndType >= 21 && rndType <= 30) {
                    let rndSpeed = CSysUtils.GetRandomInt(1, 5);
                    DC.userSpeedDeltaX += rndSpeed;
                    this.m_txtTitle.text = "增加跑动速度" + rndSpeed;
                    Laya.stage.event(DT.EVENT_ATTR_RENEW, [DT.ATTR_TYPE_SPEED_X, rndSpeed, 30 * 1000]);
                }
                else if (rndType >= 31 && rndType <= 40)  {
                    let rndJumpX = CSysUtils.GetRandomInt(5, 10);
                    DC.userJumpMultiSecs = rndJumpX;
                    this.m_txtTitle.text = "增加连续跳跃时间" + rndJumpX + "秒";

                    Laya.stage.event(DT.EVENT_USER_JUMP_MULTI, ['on']);
                    Laya.stage.event(DT.EVENT_ATTR_RENEW, [DT.ATTR_TYPE_JUMP_MULTI, rndJumpX, rndJumpX * 1000]);
                }
                else {
                    let rndY = CSysUtils.GetRandomInt(10, 50);
                    DC.userSpeedDeltaY += rndY;
                    this.m_txtTitle.text = "增加跳跃速度" + rndY;
                    Laya.stage.event(DT.EVENT_ATTR_RENEW, [DT.ATTR_TYPE_SPEED_Y, rndY, 30 * 1000]);
                }

                Laya.Tween.to(this.m_txtTitle, {scaleX:1.4, scaleY:1.4}, 600, Laya.Ease.bounceOut);
            }
        }
    }

    /** 渐隐窗口 */
    private fadeHideWindow(): void {
        Laya.Tween.to(this.owner, { alpha: 0 }, 1000, Laya.Ease.strongOut,
            Laya.Handler.create(this, function () {
                DC.isOpeningTreasureBox = false;
                DC.isInBattle = false;
                this.owner.removeSelf();
            }, ),
            0
        );
    }
}