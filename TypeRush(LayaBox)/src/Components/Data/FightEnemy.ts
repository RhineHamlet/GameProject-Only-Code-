import FightScene from "../Controller/Scenes/FightScene";
import DC from "../../GlobalData/DataCenter";
import { EnemyInfo } from "../../GlobalData/DataStruct";
import CSysUtils from "../../Helper/SysUtils";
import ResLoader from "../../Tools/ResLoader";
import TreasureBoxDrop from "./TreasureBoxDrop";
import DT from "../../GlobalData/DataConst";

/**
 * 场景中的怪物对象
 */
export default class FightEnemy extends Laya.Sprite {

    public static ENEMY_ANIMATION_INTERVAL = 80;        //怪物动画的播放间隔

    public m_ownerScale: number;                        //自己的缩放值

    public m_enemyInfo: EnemyInfo;                      //怪物信息
    private m_runDirection: number = 0;                 //跑动方向(0-初始值，1-向左，2-向右)
    private m_runMode: number;                          //跑动模式(1-从终点消失 2-在终点与起点之间来回)
    private m_dealCtrlFlag: boolean;                    //怪物死亡控制标记
    public m_aliveState: number;                        //(0-死 1-活)
    private m_roadPoints: number[];                     //路径点数组X
    private m_roadPointIdx: number;                     //当前路径点数组索引

    public m_Ani: Laya.Animation;                       //怪物动画
    private m_sceneCtrl: FightScene;                    //所在场景的脚本

    private m_reviveFun: any;                           //重生计时器

    /**
     * 默认构造函数
     * @param enemyInfo 
     * @param sceneCtrl 
     */
    constructor(enemyInfo: EnemyInfo, sceneCtrl: FightScene) {
        super();

        //初始化数据
        this.m_enemyInfo = CSysUtils.DeepCopy(enemyInfo);

        this.m_dealCtrlFlag = false;
        this.m_aliveState = 1;
        this.m_roadPointIdx = 0;
        this.m_roadPoints = CSysUtils.DeepCopy(this.m_enemyInfo.startPointX);
        this.x = this.m_roadPoints[this.m_roadPointIdx];
        this.y = this.m_enemyInfo.startPosY;
        this.m_runMode = (this.m_roadPoints.length == 2 ? 2 : 1);

        this.m_sceneCtrl = sceneCtrl;
        this.m_ownerScale = 0.1;
        this.m_reviveFun = null;

        //初始化动画
        this.m_Ani = new Laya.Animation();
        this.m_Ani.x = 0;
        this.m_Ani.autoSize = true;
        this.m_Ani.scale(this.m_ownerScale, this.m_ownerScale, true);
        this.m_Ani.interval = FightEnemy.ENEMY_ANIMATION_INTERVAL;

      
        this.m_Ani.play(0, true, ResLoader.getCacheAniKey(ResLoader.ENEMY_FIGHT_RUN, this.m_enemyInfo.resId));
        this.addChild(this.m_Ani);

        this.timer.loop(50, this, this.onIdle);
        Laya.stage.on(DT.EVENT_GAME_AGAIN_START, this, this.onDelete);
    }

    private onDelete(): void {
        if (this.m_reviveFun != null) {
            Laya.timer.clear(this, this.m_reviveFun);
        }
        Laya.stage.off(DT.EVENT_GAME_AGAIN_START, this, this.onDelete);
    }

    /**
     * 定时调用函数(暂定10毫秒执行一次)
     */
    private onIdle(): void {

        //场景结束、战斗、暂停状态均无需执行
        if (this.m_sceneCtrl.isOver || this.m_sceneCtrl.isPause || DC.isInBattle)
            return;

        //正常状态
        if (this.m_aliveState == 1) {
            this.checkDirectionIdle();
            this.checkMovingIdle();

            return;
        }

        //死亡状态
        if (this.m_aliveState == 0) {
            if (!this.m_dealCtrlFlag) {

                //指定时间后重生
                Laya.timer.once(this.m_enemyInfo.reviveSecs * 1000, this, this.m_reviveFun = function () {
                    this.m_sceneCtrl.createNewEnemy(this.m_enemyInfo);
                    Laya.stage.off(DT.EVENT_GAME_AGAIN_START, this, this.onDelete);
                    this.destroy(true);
                });

                //掉落宝箱
                if (DC.isDropTreasureBox) {
                    DC.isDropTreasureBox = false;
                    let tBox = new TreasureBoxDrop(this.x, this.y - 30, ResLoader.TREASURE_STATIC_IMG_1, this.m_sceneCtrl);
                    DC.mapNode.addChild(tBox);
                }

                //清空所有定时器
                this.timer.clear(this, this.onIdle);
                this.m_dealCtrlFlag = true;
            }
        }
    }

    /**
     * 切换行走方向
     */
    private changeRunDirection(): void {
        let destX: number = this.m_roadPoints[this.m_roadPointIdx];
        if (this.x < destX && this.m_runDirection != 2) {
            this.m_runDirection = 2;
            this.skewY = 180;
        }
        else if (this.x > destX && this.m_runDirection != 1) {
            this.m_runDirection = 1;
            this.skewY = 0;
        }
    }

    /**
     * 是否到达终点
     */
    private isReachTerminal(): boolean {
        return Math.abs(this.m_roadPoints[this.m_roadPointIdx] - this.x) < 5;
    }

    /**
     * 方向检测定时调用函数
     */
    private checkDirectionIdle(): void {
        this.m_Ani.x = -this.m_Ani.width * this.m_ownerScale / 2;

        //距离终点5像素以内，则认为已经到达终点，且到达终点后切换路线
        if (this.isReachTerminal()) {
            this.m_roadPointIdx++;
            if (this.m_roadPointIdx >= this.m_roadPoints.length) {

                //单向移动模式
                if (this.m_runMode == 1) {
                    this.procDeadState();
                }
                else if (this.m_runMode == 2) {
                    this.m_roadPointIdx = 0;
                }
            }
        }

        this.changeRunDirection();
    }

    /**
     * 移动检测定时调用函数
     */
    private checkMovingIdle(): void {
        switch (this.m_runDirection) {
            case 1:
                this.x -= this.m_enemyInfo.runSpeed;
                break;
            case 2:
                this.x += this.m_enemyInfo.runSpeed;
                break;
        }
    }

    /**
     * 处理死亡信息 
     */
    public procDeadState() {
        this.m_aliveState = -1;

        this.m_Ani.play(0, false, ResLoader.getCacheAniKey(ResLoader.ENEMY_FIGHT_DEAD, this.m_enemyInfo.resId));
        this.m_Ani.on(Laya.Event.COMPLETE, this, function () {
            this.m_Ani.visible = false;
            this.m_aliveState = 0;
        });
    }

    /**
     * 调整位置
     */
    public adjustPos() {
        this.y -= this.m_Ani.height * this.m_ownerScale;
        this.m_enemyInfo.startPosY -= this.m_Ani.height * this.m_ownerScale;
    }
}