import PlayerController from "./Player";
import FightEnemy from "../../Data/FightEnemy";
import DC from "../../../GlobalData/DataCenter";
import ResLoader from "../../../Tools/ResLoader";
import { EnemyInfo, GameMode } from "../../../GlobalData/DataStruct";
import SoundMgr from "../../../Tools/SoundMgr";
import DT from "../../../GlobalData/DataConst";
import CProjectUtils from "../../../Helper/ProjectUtils";
import DF from "../../../GlobalData/DataConfig";

/**
 * 游戏场景界面
 */
export default class FightScene extends Laya.Script {

    /** @prop {name:Player,tips:"主角",type:Prefab}*/
    Player: Laya.Prefab;
    /** @prop {name:FinishPage,tips:"结束界面",type:Prefab}*/
    FinishPage: Laya.Prefab;
    /** @prop {name:DeadPage,tips:"死亡界面",type:Prefab}*/
    DeadPage: Laya.Prefab;
    /** @prop {name:PausePage,tips:"暂停界面",type:Prefab}*/
    PausePage: Laya.Prefab;
    /** @prop {name:AttributesPage,tips:"属性界面",type:Prefab}*/
    AttributesPage: Laya.Prefab;
    /** @prop {name:FightInfoPage,tips:"战斗信息界面",type:Prefab}*/
    FightInfoPage: Laya.Prefab;
    /** @prop {name:MapPage,tips:"小地图界面",type:Prefab}*/
    MapPage: Laya.Prefab;

    private static mapJudgeDifferNum: number = 40;   //判断地图移动距离值的数量

    public m_playerSpr: Laya.Sprite;                //主角
    public m_playerCtrl: PlayerController;          //主角控制器

    private enemys: FightEnemy[] = [];              //怪物集合
    public elments: Laya.Sprite[] = [];             //所有的物体集合

    public m_attrExtPage;                           //附加属性界面
    public m_fightInfoPage;                         //战斗信息界面
    public m_mapPage;                               //小地图界面

    public isOver: boolean;                         //是否游戏结束
    public isPause: boolean;                        //是否游戏暂停

    private m_playerBeforeFramePos: Laya.Point;     //人物前一帧的位置

    public m_lowPos: number;                        //最低点

    /** 构造函数 */
    constructor() {
        super();
    }

    onAwake() {
        //设置地图和UI根节点
        DC.mapNode = this.owner.getChildByName("map") as Laya.Sprite;
        DC.uiNode = this.owner.getChildByName("ui") as Laya.Sprite;
        //设置物理世界根容器
        Laya.Physics.I.worldRoot = DC.mapNode;
    }

    onEnable() {
        DC.userAttackDelta = 0;
        DC.userSpeedDeltaX = 0;
        DC.userSpeedDeltaY = 0;

        //播放背景音乐
        SoundMgr.playBgMusic(SoundMgr.MUSIC_BG_TAG_1, SoundMgr.MUSIC_BG_NAME_1);

        DC.userHp = (DC.userTotalHp + DC.userHpDelta);
        DC.totalKillEnemyNum = 0;
        DC.errorCharNum = 0;
        DC.validCharNum = 0;
        DC.totalUsedSecs = 0;
        DC.isDropTreasureBox = false;

        //创建主角
        this.m_playerSpr = Laya.Pool.getItemByCreateFun("Player", this.Player.create, this.Player);
        DC.mapNode.addChild(this.m_playerSpr);

        this.m_playerCtrl = this.m_playerSpr.getComponent(PlayerController);//Player.ts
        if (DC.gameMode == GameMode.BO_LE_MA) {
            this.m_playerCtrl.initData(881, 6660, 2, this, "right");
            //预加载怪物动画资源
            ResLoader.preLoadEnemySkin([1]);
        }
        else if (DC.gameMode == GameMode.CHECKPOINT) {
            let checkpoint_info;
            switch (DC.selectKindIndex) {
                case 1:
                    checkpoint_info = DF.checkpointInfoList1[DC.selectCheckpointRelativeValue];
                    break;
                case 2:
                    checkpoint_info = DF.checkpointInfoList2[DC.selectCheckpointRelativeValue];
                    break;
                case 3:
                    checkpoint_info = DF.checkpointInfoList3[DC.selectCheckpointRelativeValue];
                    break;
            }
            this.m_playerCtrl.initData(checkpoint_info.player[0], checkpoint_info.player[1], 2, this, "right");
            //预加载怪物动画资源
            ResLoader.preLoadEnemySkin(checkpoint_info.enemy_res_code);
        }

        this.initData();
        this.initUI();

        Laya.stage.on(DT.EVENT_FIGHT_END, this, this.onFightEnd);
        Laya.stage.on(DT.EVENT_GAME_OVER, this, this.onGameOver);
        Laya.stage.on(DT.EVENT_GAME_RESUME, this, this.onGameResume);
    }

    onDisable() {
        Laya.stage.off(DT.EVENT_FIGHT_END, this, this.onFightEnd);
        Laya.stage.off(DT.EVENT_GAME_OVER, this, this.onGameOver);
        Laya.stage.off(DT.EVENT_GAME_RESUME, this, this.onGameResume);
    }

    onUpdate() {
        if (this.isOver || this.isPause || DC.isInBattle)
            return;

       // this.playerPosVary();
        this.StageFollow();
        this.procMeetEnemyAndClear();
    }

    /** 键盘按下事件 */
    onKeyDown(e: laya.events.Event): void {
        if (this.isOver || this.isPause || DC.isInBattle)
            return;
        //退出(ESC),暂停界面
        if (e.keyCode == DT.CFG_KEY_PAUSE) {
            if (!this.isPause) {
                this.isPause = true;
                this.CreatePausePage();

                //发出事件通知
                Laya.stage.event(DT.EVENT_GAME_PAUSE);
            }
        }
    }

    private initData(): void {
        this.isOver = false;
        this.isPause = false;
        this.m_lowPos = 0;
        this.m_playerBeforeFramePos = new Laya.Point(this.m_playerSpr.x, this.m_playerSpr.y);
    }

    private initUI(): void {
        //创建附加属性面板
        this.m_attrExtPage = Laya.Pool.getItemByCreateFun("AttributesPage", this.AttributesPage.create, this.AttributesPage);
        DC.uiNode.addChild(this.m_attrExtPage);

        //创建战斗信息面板
        this.m_fightInfoPage = Laya.Pool.getItemByCreateFun("FightInfoPage", this.FightInfoPage.create, this.FightInfoPage);
        DC.uiNode.addChild(this.m_fightInfoPage);

        //创建小地图面板
        if (DC.gameMode == GameMode.BO_LE_MA) {
            this.m_mapPage = Laya.Pool.getItemByCreateFun("MapPage", this.MapPage.create, this.MapPage);
            DC.uiNode.addChild(this.m_mapPage);
        }
    }

    /** 战斗结束 */
    private onFightEnd(): void {

        //初始怪物死亡
        if (DC.fightingEnemyIdx >= 0 && DC.fightingEnemyIdx < this.enemys.length)
            this.enemys[DC.fightingEnemyIdx].procDeadState();
    }

    /** 游戏结束 */
    private onGameOver(): void {
        this.CreateDeadPage();
        this.isOver = true;
    }

    /** 游戏继续 */
    private onGameResume(): void {
        this.isPause = false;
    }

    //摄象机跟随
    StageFollow() {
        let dX = 0;
        let dY = 0;
        let posZero = new Laya.Point(0, 0);
        this.m_playerSpr.localToGlobal(posZero);
        Laya.stage.globalToLocal(posZero);
        if (posZero.x < 540) {
            dX = 540 - posZero.x;
        }
        else if (posZero.x > 740) {
            dX = 740 - posZero.x;
        }
        if (posZero.y < 310) {
            dY = 310 - posZero.y;
        }
        else if (posZero.y > 410) {
            dY = 410 - posZero.y;
        }
        if (dX != 0 || dY != 0) {
            console.log(dX);
            console.log(dY);

            DC.mapNode.x += dX;
            DC.mapNode.y += dY;
        }
    }

    //人物位置变化
    private playerPosVary(): void {
        let pos = this.m_playerBeforeFramePos;
        if (pos.x != this.m_playerSpr.x || pos.y != this.m_playerSpr.y) {
            //发出人物位置变化事件
            let posZero = new Laya.Point(0, 0);
            this.m_playerSpr.localToGlobal(posZero);
            DC.mapNode.globalToLocal(posZero);
            Laya.stage.event(DT.EVENT_PLAYER_POS_VARY, [posZero.x, posZero.y]);
            if (pos.x != this.m_playerSpr.x) { pos.x = this.m_playerSpr.x; }
            if (pos.y != this.m_playerSpr.y) { pos.y = this.m_playerSpr.y; }

            this.judgePlayerSink();
        }
    }

    /** 判断人物掉落*/
    private judgePlayerSink(): void {
        if (this.m_lowPos != 0 && this.m_playerSpr.y > this.m_lowPos) {
            Laya.stage.event(DT.EVENT_PLAYER_SINK);
        }
    }

    /** 判断是否遇到怪物，同时清理死亡状态怪物 */
    private procMeetEnemyAndClear() {

        //移除数组对象(注意：因为内部删除对象，必须倒序循环)
        for (let i = this.enemys.length - 1; i >= 0; i--) {
            //如果死亡状态为-1则从列表移除
            if (this.enemys[i].m_aliveState == -1) {
                this.enemys.splice(i, 1);
                continue;
            }

            //检测是否遇怪
            if (this.enemys[i].m_aliveState == 1 && this.m_playerSpr.getBounds().intersects(this.enemys[i].getBounds())) {
                this.meetEnemy(i);
                break;
            }
        }
    }

    /**
     * 遇怪操作
     * @param enemyIdx 怪物索引
     */
    private meetEnemy(enemyIdx: number): void {
        let enemy = this.enemys[enemyIdx];

        DC.isInBattle = true;
        DC.enemyHp = enemy.m_enemyInfo.hp;
        DC.enemyTotalHp = enemy.m_enemyInfo.hp;
        DC.enemyAttackSpeed = enemy.m_enemyInfo.attackSpeed;
        DC.fightingEnemyIdx = enemyIdx;
        DC.fightEnemyResId = enemy.m_enemyInfo.resId;
        DC.critSecs = enemy.m_enemyInfo.critSecs;
        DC.weakSecs = enemy.m_enemyInfo.weakSecs;

        //打开战斗界面
        Laya.Scene.open("main/BattleScene.scene", false, Laya.Handler.create(this, (targetScene) => {
            targetScene.pos(0, 0);
        }));

        //发出战斗通知事件
        Laya.stage.event(DT.EVENT_FIGHT_START, [0]);
    }

    /**
     * 创建新怪物
     * @param enemyInfo 怪物数据
     */
    public createNewEnemy(enemyInfo: EnemyInfo): void {
        let newEnemy = new FightEnemy(enemyInfo, this);
        DC.mapNode.addChild(newEnemy);

        this.enemys.push(newEnemy);
    }

    /**
     * 创建结束界面
     */
    public CreateFinishPage(): Laya.Image {
        Laya.SoundManager.playSound("Music/wanchengrenwu.wav", 1);
        Laya.SoundManager.playSound("Music/tongguan.mp3", 1);

        let page = Laya.Pool.getItemByCreateFun("FinishPage", this.FinishPage.create, this.FinishPage);
        DC.uiNode.addChild(page);
        Laya.stage.event(DT.EVENT_GAME_VICTORY, [this.m_playerCtrl.m_gainStarNum]);

        return page;
    }

    /**
     * 创建死亡界面
     */
    public CreateDeadPage(): Laya.Image {
        Laya.SoundManager.playSound("Music/shibaiyinxiao.mp3", 1);

        let page = Laya.Pool.getItemByCreateFun("DeadPage", this.DeadPage.create, this.DeadPage);
        DC.uiNode.addChild(page);

        return page;
    }

    /**
     * 创建暂停界面 
     */
    public CreatePausePage(): Laya.Image {
        Laya.SoundManager.playSound("Music/fanhuianniu.mp3", 1);

        let page = Laya.Pool.getItemByCreateFun("PausePage", this.PausePage.create, this.PausePage);
        DC.uiNode.addChild(page);

        return page;
    }

    /**
     * 增加元素对象到集合
     * @param object 元素对象
     */
    public addElement(object: Laya.Sprite) {
        this.elments.push(object);
    }

    /**
     * 增加怪物对象到集合
     * @param enemy 怪物对象
     */
    public addEnemy(enemy: FightEnemy) {
        this.enemys.push(enemy);
    }
}