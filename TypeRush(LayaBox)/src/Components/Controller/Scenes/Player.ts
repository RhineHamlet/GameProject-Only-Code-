import ElementBoardDraw from "../Elements/ElementBoardDraw";
import ElementDoor from "../Elements/ElementDoor";
import DC from "../../../GlobalData/DataCenter";
import { PlayerState, ElementName } from "../../../GlobalData/DataStruct";
import DT from "../../../GlobalData/DataConst";
import FightScene from "./FightScene";
import DF from "../../../GlobalData/DataConfig";
/*
    主角控制器
*/
export default class PlayerController extends Laya.Script {

    public static PLAYER_ANIMATION_INTERVAL = 80;           //角色Animation的播放动画间隔
    public static ATLAS_URL_PREV: string = "player_skin";   //player的atlas资源的文件夹地址前缀

    private m_resId: number;                                //资源编号
    private m_faceDR: string;                               //脸朝向("left"或"right)
    private m_tagIdle: string;                              //Idle动画标记
    private m_tagRun: string;                               //Run动画标记
    private m_tagJump: string;                              //Jump动画标记
    private m_curAniTag: string;                            //当前播放动画的名称

    private m_aniOwner: Laya.Sprite;                        //自己动画的父容器
    public m_ani: Laya.Animation;                           //自己的动画
    public m_ownerBoxCollider: Laya.BoxCollider;            //自己的碰撞体
    public m_ownerRigiBody: Laya.RigidBody;                 //自己的刚体
    private m_barUserHp: Laya.ProgressBar;                  //血量进度条

    private m_lastJumpTick: number = 0;                     //最后一次跳跃标记
    public m_gainStarNum: number = 0;                       //获取的星星数
    private m_isBouncing: boolean = false;                  //是否是在弹起状态，弹起时按键不能控制
    private m_isJumping: boolean = false;                   //是否在跳跃状态
    private m_allowKeyInput: boolean = true;                //是否允许键盘输入

    private m_sceneCtrl: FightScene;                        //该场景的脚本

    private m_savePos: Laya.Point;                          //保存点保存的位置

    private m_isMoveLeft: boolean;                          //是否向左移动
    private m_isMoveRight: boolean;                         //是否向右移动
    private m_state: PlayerState;                           //角色状态
    private m_touchFloorTag: number;                        //触摸地面的标签

    constructor() { super(); }

    onEnable() {
        this.initParams();

        this.m_isMoveLeft = false;
        this.m_isMoveRight = false;
        this.m_state = PlayerState.IDLE;
        this.m_touchFloorTag = 0;

        //初始化所有事件处理
        this.initEventProcessor();
    }

    onDisable() {
        this.finalizeEventProcessor();
    }

    //更新函数
    onUpdate() {

    }

    /**
     * 初始化数据
     * @param x X坐标
     * @param y Y坐标
     * @param resId 人物资源ID
     * @param sceneCtrl 场景控制器
     * @param faceDR 脸朝向，left或right
     */
    public initData(x: number, y: number, resId: number, sceneCtrl: any, faceDR: string = "left"): void {
        (this.owner as Laya.Sprite).x = x;
        (this.owner as Laya.Sprite).y = y;
        this.m_resId = 2;
        this.m_faceDR = faceDR;
        this.m_sceneCtrl = sceneCtrl;
        this.m_gainStarNum = 0;
        this.m_savePos = new Laya.Point(x, y);

        this.m_tagIdle = "Player_Idle" + this.m_resId;
        this.m_tagRun = "Player_Run" + this.m_resId;
        this.m_tagJump = "Player_Jump" + this.m_resId;

        this.m_ani.loadAtlas(PlayerController.ATLAS_URL_PREV + this.m_resId + "/Idle.atlas", null, this.m_tagIdle);
        this.m_ani.loadAtlas(PlayerController.ATLAS_URL_PREV + this.m_resId + "/Run.atlas", null, this.m_tagRun);
        this.m_ani.loadAtlas(PlayerController.ATLAS_URL_PREV + this.m_resId + "/Jump.atlas", null, this.m_tagJump);
        this.m_ani.interval = PlayerController.PLAYER_ANIMATION_INTERVAL;
        this.playMyAni(this.m_tagIdle);
        this.m_ani.pos(0, 0);

        //更改脸朝向
        if (this.m_faceDR != "left") {
            this.m_aniOwner.skewY = 180;
            this.m_ownerBoxCollider.x = 4;
        }
    }

    private initParams(): void {
        this.m_barUserHp = this.owner.getChildByName("playerHP") as Laya.ProgressBar;
        this.m_barUserHp.visible = true;
        this.m_aniOwner = this.owner.getChildByName("ani_owner") as Laya.Sprite;

        //碰撞体的初始化
        this.m_ownerBoxCollider = this.owner.getComponent(Laya.BoxCollider);

        //刚体的初始化
        this.m_ownerRigiBody = this.owner.getComponent(Laya.RigidBody);
        this.m_ownerRigiBody.gravityScale = DT.CFG_GRAVITY_SCALE;
        this.m_ownerRigiBody.allowRotation = false;

        //人物动画初始化
        this.m_ani = new Laya.Animation();
        this.m_aniOwner.addChild(this.m_ani);
    }

    /** 碰撞检测函数，当有物体进入时 */
    onTriggerEnter(other: any, self: any, contact: any) {
        if (other.owner == null)
            return;

            console.log("nnn")

        let otherBC = other.owner.getComponent(Laya.BoxCollider) as Laya.BoxCollider;
        let lbOtherBC = otherBC.label;

        //调试信息
        // console.log("onTriggerEnter", lbOtherBC, Date.now());

        if (lbOtherBC == DT.LABEL_BC_FLOOR) {
            //判断角色是否是在平台上方进入
            let b2WorldManifold = new Laya.Browser.window.box2d.b2WorldManifold();
            contact.GetWorldManifold(b2WorldManifold);
            let l_colX = b2WorldManifold.points[0].x * Laya.Physics.PIXEL_RATIO;
            let l_colY = b2WorldManifold.points[0].y * Laya.Physics.PIXEL_RATIO;
            if (other.y + other.owner.y + 5 >= l_colY) {
                this.TouchFloorEnter();
            }
        }
        else if (lbOtherBC == DT.LABEL_BC_TERMINAL) {
            this.m_sceneCtrl.isOver = true;
            this.m_sceneCtrl.CreateFinishPage();
        }
    }

    /** 碰撞检测函数，当有物体离开时 */
    onTriggerExit(other: any, self: any, contact: any) {
        if (other.owner == null)
            return;

        //双方碰撞体
        let otherBC = other.owner.getComponent(Laya.BoxCollider) as Laya.BoxCollider;
        let ownerBC = this.m_ownerBoxCollider;
        let ownerSpr = this.owner as Laya.Sprite;

        if (otherBC.label == DT.LABEL_BC_FLOOR) {
            //判断角色是否是在平台上方离开
            if (ownerSpr.y + this.m_ownerBoxCollider.height <= other.owner.y + other.y) {
                this.TouchFloorExit();
            }
        }
    }

    onKeyDown(e: Laya.Event) {
        //不允许键盘输入
        if (!this.m_allowKeyInput)
            return;

        switch (e.keyCode) {
            case DT.CFG_KEY_MOVE_LEFT:          //向左(J)
                {
                    //打开按键定时器
                    this.owner.timer.frameLoop(1, this, this.onLeftKeyIdle);

                    //修改人物碰撞体位置(由于人物图片脚的位置不在正中心)
                    if (this.m_aniOwner.skewY != 0) {
                        this.m_ownerBoxCollider.x = -20;

                        this.m_isMoveLeft = true;
                        this.m_isMoveRight = false;

                        //转换方向并播放动画
                        this.m_aniOwner.skewY = 0;

                        //清理按键右定时执行程序
                        this.owner.timer.clear(this, this.onRightKeyIdle);
                    }
                }
                break;
            case DT.CFG_KEY_MOVE_RIGHT:         //向右(L)
                {
                    //打开按键定时器
                    this.owner.timer.frameLoop(1, this, this.onRightKeyIdle);

                    //修改人物碰撞体位置(由于人物图片脚的位置不在正中心)
                    if (this.m_aniOwner.skewY != 180) {
                        this.m_ownerBoxCollider.x = 4;

                        this.m_isMoveRight = true;
                        this.m_isMoveLeft = false;

                        //转换方向并播放动画(需要修正人物碰撞位置)
                        this.m_aniOwner.skewY = 180;

                        //清理按键左定时执行程序
                        this.owner.timer.clear(this, this.onLeftKeyIdle);
                    }
                }
                break;
            case DT.CFG_KEY_JUMP:               //跳跃(空格)
                {
                    if (Laya.Browser.now() - this.m_lastJumpTick < 200)
                        break;

                    //处理重复跳跃(如果在多次跳跃状态则允许操作)
                    if (DC.userJumpMultiSecs <= 0 && this.m_state == PlayerState.FLY)
                        break;

                    //设置上次跳跃时间
                    this.m_lastJumpTick = Laya.Browser.now();

                    Laya.SoundManager.playSound("Music/tiaoyue.mp3", 1);

                    //增加跳跃速度(负数表示向上的速度)
                    this.setMySpeed(0, -this.getUserRealSpeedY());
                }
                break;
        }
    }

    onKeyUp(e: Laya.Event) {
        let keyCode = e["keyCode"];
        if (keyCode == DT.CFG_KEY_MOVE_LEFT || keyCode == DT.CFG_KEY_MOVE_RIGHT) {

            //清除定时执行程序
            if (keyCode == DT.CFG_KEY_MOVE_LEFT) {
                this.owner.timer.clear(this, this.onLeftKeyIdle);
                this.m_isMoveLeft = false;
            }
            else if (keyCode == DT.CFG_KEY_MOVE_RIGHT) {
                this.owner.timer.clear(this, this.onRightKeyIdle);
                this.m_isMoveRight = false;
            }

            if (!this.m_isMoveLeft && !this.m_isMoveRight) {

                //设置移动速度为0
                if (this.m_touchFloorTag != 2) { this.setMySpeed(0, this.m_ownerRigiBody.linearVelocity.y); }

                if (!this.m_isJumping) { this.state = PlayerState.IDLE; }
            }
        }
    }

    /** 战斗开始事件 */
    private onFightStartEvent(): void {
        //停止移动
        this.setMySpeed(0, 0);
        //清除按键处理定时器
        this.clearKeyProcessTimer();
        //设置不允许输入状态
        this.setAllowKeyInputStates(false);

        this.state = PlayerState.IDLE;
    }

    /** 战斗结束事件 */
    private onFightEndEvent(): void {
        this.setAllowKeyInputStates(true);
    }

    /** 用户多次跳跃事件 */
    private onUserJumpMultiEvent(type: string): void {

    }

    /** 用户Hp恢复事件 */
    private onUserHpRestoreEvent(addNum: number): void {
        DC.userHp = Math.min((DC.userHp + addNum), (DC.userTotalHp + DC.userHpDelta));
    }

    /** 用户获得星星事件 */
    private onUserGainStarEvent(addNum: number): void {
        this.m_gainStarNum += addNum;
    }

    /** 用户血量变化事件 */
    private onUserHpChangeEvent(hp: number, hpTotal: number): void {
        this.m_barUserHp.value = hp / hpTotal;

        //用户血量为0，则退出场景
        if (hp <= 0) {
            Laya.stage.event(DT.EVENT_GAME_OVER);
        }
    }

    /** 击杀怪物数量总数改变事件 */
    private onUserKillEnemyNumChange(num: number): void {
        let task = DF.jumpMultiTasks[DC.indexTask];
        if (num >= task[0]) {
            DC.userJumpMultiSecs = task[1] * 1000;

            Laya.stage.event(DT.EVENT_USER_JUMP_MULTI, ['on']);
            Laya.stage.event(DT.EVENT_ATTR_RENEW, [DT.ATTR_TYPE_JUMP_MULTI, task[1], task[1] * 1000]);
        }
    }

    /** 游戏结束 */
    private onGameOver(): void {
        this.setMySpeed(0, 0);
        this.state = PlayerState.IDLE;
    }

    /** 初始化所有事件处理 */
    private initEventProcessor(): void {
        Laya.stage.on(DT.EVENT_USER_JUMP_MULTI, this, this.onUserJumpMultiEvent);
        Laya.stage.on(DT.EVENT_USER_RESTORE_HP, this, this.onUserHpRestoreEvent);
        Laya.stage.on(DT.EVENT_USER_GAIN_STAR, this, this.onUserGainStarEvent);
        Laya.stage.on(DT.EVENT_USER_HP_CHANGE, this, this.onUserHpChangeEvent);
        Laya.stage.on(DT.EVENT_FIGHT_START, this, this.onFightStartEvent);
        Laya.stage.on(DT.EVENT_FIGHT_END, this, this.onFightEndEvent);
        Laya.stage.on(DT.EVENT_KILL_ENEMY_NUM_CHANGE, this, this.onUserKillEnemyNumChange);
        Laya.stage.on(DT.EVENT_GAME_OVER, this, this.onGameOver);
        Laya.stage.on(DT.EVENT_GAME_VICTORY, this, this.onGameOver);
        Laya.stage.on(DT.EVENT_SAVE_POS, this, this.onSavePos);
        Laya.stage.on(DT.EVENT_PLAYER_SINK, this, this.onPlayerSink);
        Laya.stage.on(DT.EVENT_PLAYER_STATE_VARY_FEEDBACK, this, this.onPlayerStateVaryFeedback);
        Laya.stage.on(DT.EVENT_PLAYER_TOUCH_FLOOR, this, this.onPlayerTouchFloor);
        Laya.stage.on(DT.EVENT_PLAYER_TOUCH_GROUND_THORN, this, this.onPlayerTouchGroundThorn);
        Laya.stage.on(DT.EVENT_PLAYER_TOUCH_SPRING, this, this.onPlayerTouchSpring);
        Laya.stage.on(DT.EVENT_PLAYER_TOUCH_CONVEY_DOOR, this, this.onPlayerTouchConveyDoor);
    }

    /** 终止所有事件处理 */
    private finalizeEventProcessor(): void {
        Laya.stage.off(DT.EVENT_USER_JUMP_MULTI, this, this.onUserJumpMultiEvent);
        Laya.stage.off(DT.EVENT_USER_RESTORE_HP, this, this.onUserHpRestoreEvent);
        Laya.stage.off(DT.EVENT_USER_GAIN_STAR, this, this.onUserGainStarEvent);
        Laya.stage.off(DT.EVENT_USER_HP_CHANGE, this, this.onUserHpChangeEvent);
        Laya.stage.off(DT.EVENT_FIGHT_START, this, this.onFightStartEvent);
        Laya.stage.off(DT.EVENT_FIGHT_END, this, this.onFightEndEvent);
        Laya.stage.off(DT.EVENT_KILL_ENEMY_NUM_CHANGE, this, this.onUserKillEnemyNumChange);
        Laya.stage.off(DT.EVENT_GAME_OVER, this, this.onGameOver);
        Laya.stage.off(DT.EVENT_GAME_VICTORY, this, this.onGameOver);
        Laya.stage.off(DT.EVENT_SAVE_POS, this, this.onSavePos);
        Laya.stage.off(DT.EVENT_PLAYER_SINK, this, this.onPlayerSink);
        Laya.stage.off(DT.EVENT_PLAYER_STATE_VARY_FEEDBACK, this, this.onPlayerStateVaryFeedback);
        Laya.stage.off(DT.EVENT_PLAYER_TOUCH_FLOOR, this, this.onPlayerTouchFloor);
        Laya.stage.off(DT.EVENT_PLAYER_TOUCH_GROUND_THORN, this, this.onPlayerTouchGroundThorn);
        Laya.stage.off(DT.EVENT_PLAYER_TOUCH_SPRING, this, this.onPlayerTouchSpring);
        Laya.stage.off(DT.EVENT_PLAYER_TOUCH_CONVEY_DOOR, this, this.onPlayerTouchConveyDoor);
        this.owner.timer.clearAll(this);
    }

    private onPlayerTouchConveyDoor(transferPointX: number, transferPointY: number): void {
        this.setUserPosition(transferPointX, transferPointY);
        this.setMySpeed(0, 0);
        this.state = PlayerState.IDLE;
    }

    private onPlayerTouchSpring(speedX: number, speedY: number): void {
        this.setMySpeed(speedX, speedY);
        this.state = PlayerState.IDLE;

        //设置弹起状态,同时关闭键盘输入
        this.m_isBouncing = true;
        this.setAllowKeyInputStates(false);
    }

    private onPlayerTouchGroundThorn(value: number): void {
        this.state = PlayerState.IDLE;

        //更新血条
        DC.userHp -= value;

        //发出变化通知
        Laya.stage.event(DT.EVENT_USER_HP_CHANGE, [DC.userHp, (DC.userTotalHp + DC.userHpDelta)]);
    }

    /**
     * 角色触摸地面
     * @param tag 地面标签
     */
    private onPlayerTouchFloor(tag: number): void {
        switch (tag) {
            case 1:
                {
                    //接触地板后X速度降为0
                    this.setMySpeed(0, this.m_ownerRigiBody.linearVelocity.y);
                }
                break;
            case 2:
                {

                }
                break;
            case 3:
                {
                    this.setMySpeed(0, this.m_ownerRigiBody.linearVelocity.y);
                }
                break;
            case 4:
                {
                    this.setMySpeed(0, this.m_ownerRigiBody.linearVelocity.y);
                }
                break;
        }
        this.m_touchFloorTag = tag;
        this.state = PlayerState.IDLE;
    }

    /**
     * 
     * @param x x方向速度增值
     * @param y y方向速度增值
     * @param name 元素名字
     */
    private onPlayerStateVaryFeedback(x: number, y: number, name: ElementName): void {
        this.setMySpeedDelta(x, y);
    }

    /** 保存点保存位置*/
    private onSavePos(x: number, y: number): void {
        this.m_savePos = new Laya.Point(x, y);
    }

    /** 人物位置下沉*/
    private onPlayerSink(): void {
        this.setUserPosition(this.m_savePos.x + 50, this.m_savePos.y);
        this.setMySpeed(0, 0);

        this.state = PlayerState.IDLE;
        //更新血条
        DC.userHp -= DC.userSinkHurt;

        //发出变化通知
        Laya.stage.event(DT.EVENT_USER_HP_CHANGE, [DC.userHp, (DC.userTotalHp + DC.userHpDelta)]);
    }

    /** 开始接触地板处理 */
    private TouchFloorEnter(): void {
        //如果是弹起状态，则关闭弹起状态，并允许输入
        if (this.m_isBouncing) {
            this.m_isBouncing = false;
            this.setAllowKeyInputStates(true);
        }

        this.m_isJumping = false;
    }

    /** 开始离开地板处理 */
    private TouchFloorExit(): void {
        this.m_isJumping = true;
        this.state = PlayerState.FLY;
    }

    /** 右键按下定时执行函数 */
    private onRightKeyIdle(): void {
        if (this.getUserRealSpeedX() != this.m_ownerRigiBody.linearVelocity.x) {
            this.setMySpeed(this.getUserRealSpeedX(), this.m_ownerRigiBody.linearVelocity.y);
        }
        this.state = PlayerState.RUN;
    }

    /** 左键按下定时执行函数 */
    private onLeftKeyIdle(): void {
        if (this.getUserRealSpeedX() != this.m_ownerRigiBody.linearVelocity.x) {
            this.setMySpeed(-this.getUserRealSpeedX(), this.m_ownerRigiBody.linearVelocity.y);
        }
        this.state = PlayerState.RUN;
    }

    /** 设置角色的状态*/
    private set state(value: PlayerState) {
        if (this.m_state == value) {
            return;
        }
        switch (value) {
            case PlayerState.IDLE:
                {
                    this.playMyAni(this.m_tagIdle);
                }
                break;
            case PlayerState.RUN:
                {
                    if (this.m_state == PlayerState.FLY) {
                        return;
                    }
                    this.playMyAni(this.m_tagRun);
                }
                break;
            case PlayerState.FLY:
                {
                    this.playMyAni(this.m_tagJump);
                }
                break;
        }
        this.m_state = value;
        if (this.m_sceneCtrl.isOver || this.m_sceneCtrl.isPause || DC.isInBattle) {
            return;
        }
        Laya.stage.event(DT.EVENT_PLAYER_STATE_VARY, [this.m_state]);
    }

    /** 直接改变人物坐标 */
    public setUserPosition(x, y) {
        (this.owner as Laya.Sprite).x = x;
        (this.owner as Laya.Sprite).y = y;
    }

    //清除按键定时器
    private clearKeyProcessTimer(): void {
        this.owner.timer.clear(this, this.onLeftKeyIdle);
        this.owner.timer.clear(this, this.onRightKeyIdle);
    }

    /**
     * 设置自己的速度
     * @param speedX 水平反向速度
     * @param speedY 垂直方向速度
     */
    private setMySpeed(speedX: number, speedY: number): void {
        this.m_ownerRigiBody.setVelocity({ x: speedX, y: speedY });
    }

    /**
     * 设置自己的速度差值
     * @param speedX 水平反向速度
     * @param speedY 垂直方向速度
     */
    private setMySpeedDelta(speedDX: number, speedDY: number): void {
        this.m_ownerRigiBody.setVelocity({ x: this.m_ownerRigiBody.linearVelocity.x + speedDX, y: this.m_ownerRigiBody.linearVelocity.y + speedDY });
    }

    /**
     * 播放自己动画
     * @param tag 动画类型
     */
    private playMyAni(tag: string): void {
        if (this.m_curAniTag == tag)
            return;
        this.m_curAniTag = tag;
        this.m_ani.play(0, true, tag);
    }

    /** 获取当前实时跑动速度 */
    private getUserRealSpeedX(): number {
        return DT.CFG_RUN_SPEED_INIT + DC.userSpeedDeltaX;
    }

    /** 获取当前实时跳跃速度 */
    private getUserRealSpeedY(): number {
        return DT.CFG_JUMP_SPEED_INIT + DC.userSpeedDeltaY;
    }

    /** 设置禁止键盘输入状态 */
    private setAllowKeyInputStates(isAllow: boolean): void {
        this.m_allowKeyInput = isAllow;
    }
}