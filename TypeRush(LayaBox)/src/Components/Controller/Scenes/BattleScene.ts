import DC from "../../../GlobalData/DataCenter";
import BattleEnemy from "../../Data/BattleEnemy";
import ResLoader from "../../../Tools/ResLoader";
import CSysUtils from "../../../Helper/SysUtils";
import SoundMgr from "../../../Tools/SoundMgr";
import KeyCodeMap from "../../../Tools/KeyCodeMap";
import DT from "../../../GlobalData/DataConst";

/**
 * 具体战斗场景
 */
export default class BattleScene extends Laya.Script {

    private static TIMER_INTERVAL: number = 50;         //定时器时间间隔

    private m_sprMaskStar: Laya.Sprite;                 //星星上面的进度遮罩
    private m_panelStars: Laya.Sprite;                  //放置动态星星的面板容器
    private m_panelAni: Laya.Sprite;                    //放置动画的容器
    private m_txtDisplay: Laya.Text;                    //显示文字
    private m_txtInput: Laya.Text;                      //输入文字
    private m_txtRestSecs: Laya.Text;                   //剩余时间
    private m_barEnemyHp: Laya.ProgressBar;             //怪物血条
    private m_barUserHp: Laya.ProgressBar;              //人物血条
    private m_txtSpeed: Laya.Text;                      //速度
    private m_txtHint: Laya.Text;                       //提示信息
    private m_txtRightRate: Laya.Text;                  //正确率

    private m_curSelWordIdx = 0;                        //随机一个字符串
    private m_curSelWord: string = "";                  //当前选择字符串
    private m_curSelWordTime: number = 0;               //当前选择字符串需要的时间(毫秒)
    private m_curInputIdx = 0;                          //目前字符串输入到第几个字符

    private m_attackHurtRate = 1;                       //攻击伤害倍率
    private m_critRate = 1;                             //暴击几率

    private m_twinkleChar = true;                       //打错字后是否在闪烁状态
    private m_usedSecs = 0.001;                         //总使用时间
    private m_validChars = 0;                           //正确字符数
    private m_errChars = 0;                             //错误的个数
    private m_isShiftDown = false;                      //Shift键是否按下
    private m_isShiftUsed = false;                      //Shift组合键是否使用

    private m_enemy: BattleEnemy;                       //怪物动画对象

    constructor() {
        super();
    }

    onEnable(): void {

        //播放背景音乐
        SoundMgr.playBgMusic(SoundMgr.MUSIC_BG_TAG_BATTLE, SoundMgr.MUSIC_BG_NAME_BATTLE);

        this.m_sprMaskStar = this.owner.getChildByName("Mask") as Laya.Sprite;
        this.m_panelStars = this.owner.getChildByName("stars") as Laya.Sprite;
        this.m_panelAni = this.owner.getChildByName("panel_ani") as Laya.Sprite;
        this.m_txtDisplay = this.owner.getChildByName("show") as Laya.Text;
        this.m_txtInput = this.owner.getChildByName("input") as Laya.Text;
        this.m_txtRestSecs = this.owner.getChildByName("time") as Laya.Text;
        this.m_txtHint = this.owner.getChildByName("text") as Laya.Text;
        this.m_barUserHp = this.owner.getChildByName("player") as Laya.ProgressBar;
        this.m_barEnemyHp = this.owner.getChildByName("monster") as Laya.ProgressBar;
        this.m_txtSpeed = this.owner.getChildByName(" speed") as Laya.Text;
        this.m_txtRightRate = this.owner.getChildByName("Accuracy") as Laya.Text;

        this.owner.timer.loop(50 / DC.enemyAttackSpeed, this, this.checkEnemyAttackIdle);
        this.owner.timer.frameLoop(15, this, this.createStarsIdle);
        this.owner.timer.loop(BattleScene.TIMER_INTERVAL, this, this.checkTimeoutIdle);

        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);

        this.m_enemy = new BattleEnemy(DC.fightEnemyResId);
        this.m_enemy.pos(0, 0);
        this.m_panelAni.addChild(this.m_enemy);

        this.m_barUserHp.value = DC.userHp / (DC.userTotalHp + DC.userHpDelta);
        this.m_txtInput.underline = true;
        this.m_txtInput.underlineColor = "#00dfff";

        //创建单词
        this.reCreateWord();
    }

    /** 重新生成一个字符串 */
    private reCreateWord() {

        //产生一个和上次不同的字符
        var rndIdx = this.m_curSelWordIdx;
        while (this.m_curSelWordIdx == rndIdx) {
            rndIdx = CSysUtils.GetRandomInt(0, DC.wordList.length - 1);
        }

        //更新当前选中的字符
        this.m_curSelWordIdx = rndIdx;
        this.m_curSelWord = DC.wordList[this.m_curSelWordIdx];
        this.m_curSelWordTime = DC.wordListTime[this.m_curSelWordIdx];

        this.m_txtDisplay.text = this.m_curSelWord;
        this.m_txtInput.text = "";
        this.m_curInputIdx = 0;
        this.m_sprMaskStar.x = 0;
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

    /**键盘抬起下处理*/
    public onKeyUp(e) {
        if (e.keyCode == 16)
            this.m_isShiftDown = false;

        //按向下方向键跳过战斗
        if (e.keyCode == 40) {
            DC.enemyHp -= 99999999;
            this.procEnemyDead();
            return;
        }

        //检测是否是输入的字符
        let charInput: String = KeyCodeMap.getCharFromKeyCode(e.keyCode, this.m_isShiftUsed);
        if (charInput == this.m_curSelWord.substr(this.m_curInputIdx, 1)) {
            Laya.SoundManager.playSound("Music/dazi.mp3", 1);

            //输入字符显示
            this.m_txtInput.text += charInput;
            this.m_curInputIdx++;

            //显示正确率
            this.m_validChars++;
            this.m_txtSpeed.text = "速率：" + Math.ceil(this.m_validChars * 60 / this.m_usedSecs) + "个/分";
            this.m_txtRightRate.text = "正确率：" + Math.ceil((this.m_validChars / (this.m_errChars + this.m_validChars)) * 100) + "%";

            //已经打完当前单词
            if (this.m_curInputIdx == this.m_curSelWord.length) {

                //计算攻击伤害倍率
                if (1280 / (20 * DC.enemyAttackSpeed) - this.m_sprMaskStar.x / (20 * DC.enemyAttackSpeed) >= DC.critSecs)
                    this.m_attackHurtRate = 1.5;
                else if (1280 / (20 * DC.enemyAttackSpeed) - this.m_sprMaskStar.x / (20 * DC.enemyAttackSpeed) >= DC.weakSecs)
                    this.m_attackHurtRate = 1;
                else
                    this.m_attackHurtRate = 0.5;

                //计算暴击倍率
                this.m_critRate = (1280 / (20 * DC.enemyAttackSpeed) - this.m_sprMaskStar.x / (20 * DC.enemyAttackSpeed)) / (1280 / (20 * DC.enemyAttackSpeed));
                this.m_critRate = (25 + DC.critSecDelta) * this.m_critRate;

                //计算暴击
                let userTotalAttack = DC.userAttack + DC.userAttackDelta;
                if (CSysUtils.GetRandomInt(1, 100) <= this.m_critRate + 5) {
                    Laya.SoundManager.playSound("Music/baoji.mp3", 1);

                    this.m_txtHint.text = "暴击:-" + userTotalAttack * this.m_attackHurtRate * 2;
                    DC.enemyHp -= userTotalAttack * this.m_attackHurtRate * 2;
                    this.m_barEnemyHp.value = DC.enemyHp / DC.enemyTotalHp;
                }
                else {

                    //计算总伤害
                    let totalHurtHp = userTotalAttack * this.m_attackHurtRate * 1.0;
                    if (this.m_attackHurtRate == 1.5) {
                        Laya.SoundManager.playSound("Music/baoji.mp3", 1);
                        this.m_txtHint.text = "全力一击:-" + totalHurtHp;
                    }
                    else if (this.m_attackHurtRate == 1) {
                        this.m_txtHint.text = "普通攻击:-" + totalHurtHp;
                        Laya.SoundManager.playSound("Music/gongjiyinxiao.mp3", 1);
                    }
                    else if (this.m_attackHurtRate == 0.5) {
                        this.m_txtHint.text = "虚弱攻击:-" + totalHurtHp;
                        Laya.SoundManager.playSound("Music/xuruogongji.mp3", 1);
                    }

                    DC.enemyHp -= totalHurtHp;
                    this.m_barEnemyHp.value = DC.enemyHp / DC.enemyTotalHp;
                }

                //重新创建单词
                this.reCreateWord();
                this.m_txtHint.alpha = 1;

                //提示文字动画
                Laya.Tween.to(this.m_txtHint, { alpha: 0 }, 2000, Laya.Ease.elasticInOut, null, 0);
            }

            //处理怪物死亡
            this.procEnemyDead();
        }
        else {
            if (e.keyCode != 16) {
                this.m_errChars++;
                this.m_txtRightRate.text = "正确率：" + Math.ceil((this.m_validChars / (this.m_errChars + this.m_validChars)) * 100) + "%";

                //错误时闪烁字符
                if (this.m_twinkleChar) {
                    this.m_twinkleChar = false;
                    Laya.Tween.from(this.m_txtInput, { alpha: 0.1 }, 500, Laya.Ease.elasticInOut, Laya.Handler.create(this, this.onTwinkleCharComplete), 0);
                }

                //错误时消耗时间
                this.m_sprMaskStar.x += 80;
            }
        }
    }

    //怪物死亡
    private procEnemyDead(): void {
        if (DC.enemyHp <= 0) {
            DC.totalKillEnemyNum++;
            DC.killEnemyNumTask++;
            DC.validCharNum += this.m_validChars;
            DC.errorCharNum += this.m_errChars;
            DC.totalUsedSecs += this.m_usedSecs;
            this.owner.timer.clear(this, this.checkEnemyAttackIdle);

            //发送击杀怪物数量改变消息
            Laya.stage.event(DT.EVENT_KILL_ENEMY_NUM_CHANGE, [DC.killEnemyNumTask]);

            //宝箱掉落判断
            let rnd = CSysUtils.GetRandomInt(1, 100);
            if (rnd <= DC.dropTreasureBoxRate && DC.isOpeningTreasureBox == false) {
                DC.isDropTreasureBox = true;
            }

            //播放背景音乐
            SoundMgr.playBgMusic(SoundMgr.MUSIC_BG_TAG_1, SoundMgr.MUSIC_BG_NAME_1);
            Laya.Scene.close("main/BattleScene.scene");

            DC.isInBattle = false;

            //发出战斗结束事件
            console.log("--------------")
            console.log(Laya.stage.event(DT.EVENT_FIGHT_END, [0]));
            console.log("+++++++++++++")
        }
    }

    //检测是否超时函数
    private checkTimeoutIdle(): void {
        this.m_usedSecs += (BattleScene.TIMER_INTERVAL / 1000);
    }

    /** 字符闪烁完毕回调函数 */
    private onTwinkleCharComplete(): void {
        this.m_twinkleChar = true;
    }

    /** 检查怪物攻击 */
    private checkEnemyAttackIdle(): void {
        this.m_txtRestSecs.text = "" + Math.round((1280 - this.m_sprMaskStar.x) / (20 * DC.enemyAttackSpeed))
        this.m_sprMaskStar.x += 1 * DC.enemyAttackSpeed;

        if (this.m_sprMaskStar.x >= 1280) {
            Laya.SoundManager.playSound("Music/aida.wav", 1);

            //更新血条
            DC.userHp -= 20;
            this.m_barUserHp.value = DC.userHp / (DC.userTotalHp + DC.userHpDelta);

            //发出变化通知
            Laya.stage.event(DT.EVENT_USER_HP_CHANGE, [DC.userHp, (DC.userTotalHp + DC.userHpDelta)]);

            //玩家死亡，关闭定时器
            if (DC.userHp <= 0) {
                this.owner.timer.clear(this, this.checkEnemyAttackIdle);

                //播放背景音乐
                SoundMgr.playBgMusic(SoundMgr.MUSIC_BG_TAG_1, SoundMgr.MUSIC_BG_NAME_1);

                Laya.Scene.close("main/BattleScene.scene");
                DC.isInBattle = false;
            }

            //重新
            this.reCreateWord();
            this.m_sprMaskStar.x = 0;
        }
    }

    /** 创建星星 */
    private createStarsIdle(): void {
        var img: Laya.Image = new Laya.Image();
        img.skin = ResLoader.IMG_BATTLE_STAR;
        img.x = CSysUtils.GetRandomInt(1, 1280);
        img.y = 200;
        let rndScale = Math.random();
        img.scale(rndScale, rndScale);
        Laya.Tween.to(img, { y: -500, rotation: Math.random() * 360 }, 15000, Laya.Ease.strongOut, Laya.Handler.create(this, this.removeTarget, [img]), 0);
        this.m_panelStars.addChild(img);
    }

    /** 移除指定对象 */
    private removeTarget(img) {
        img.removeSelf();
    }
}