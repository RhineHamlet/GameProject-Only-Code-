import DC from "../../../GlobalData/DataCenter";
import { GameMode } from "../../../GlobalData/DataStruct";

export default class MainScene extends Laya.Script {

    private m_checkpoint: Laya.Sprite;               //冒险闯关
    private m_bolema: Laya.Sprite;                    //伯乐码

    private m_name: Laya.Label;                       //名字
    private m_level: Laya.Label;                      //等级
    private m_gold: Laya.Label;                       //金币数量
    private m_diamond: Laya.Label;                    //钻石数量

    private m_on_off: Laya.Sprite;                    //开关
    private m_event: Laya.Sprite;                     //开关控制的节点
    private m_activity: Laya.Sprite;                  //活动
    private m_achievement: Laya.Sprite;               //成就
    private m_shop: Laya.Sprite;                      //商店
    private m_ranking: Laya.Sprite;                   //排行
    private m_backpack: Laya.Sprite;                  //背包

    private m_isOn: Boolean;                            //是否已经点击开关
    private m_isCanClick: Boolean;                       //是否能点击开关

    constructor() { super(); }

    onEnable(): void {
        this.initParams();
        this.initData();
        this.initUI();
        this.initEvent();
    }

    onDisable(): void {
        this.finalizeEvent();
    }

    onUpdate(): void {
    }

    private initParams(): void {
        this.m_checkpoint = this.owner.getChildByName("checkpoint") as Laya.Sprite;
        this.m_bolema = this.owner.getChildByName("bolema") as Laya.Sprite;

        this.m_name = this.owner.getChildByName("name") as Laya.Label;
        this.m_level = this.owner.getChildByName("level") as Laya.Label;
        this.m_gold = this.owner.getChildByName("gold") as Laya.Label;
        this.m_diamond = this.owner.getChildByName("diamond") as Laya.Label;

        this.m_on_off = this.owner.getChildByName("on_off") as Laya.Sprite;
        this.m_event = this.owner.getChildByName("event") as Laya.Sprite;
        this.m_activity = this.m_event.getChildByName("activity") as Laya.Sprite;
        this.m_achievement = this.m_event.getChildByName("achievement") as Laya.Sprite;
        this.m_backpack = this.m_event.getChildByName("backpack") as Laya.Sprite;
        this.m_ranking = this.m_event.getChildByName("ranking") as Laya.Sprite;
        this.m_shop = this.m_event.getChildByName("shop") as Laya.Sprite;
    }


    private initData(): void {
        this.m_isOn = true;
        this.m_isCanClick = true;
    }

    private initUI(): void {

    }

    private initEvent(): void {
        //进入游戏的按钮
        this.m_checkpoint.on(Laya.Event.CLICK, this, this.onCheckpointClick);
        this.m_bolema.on(Laya.Event.CLICK, this, this.onBoLeMa);

        //功能按钮
        this.m_on_off.on(Laya.Event.CLICK, this, this.onOnOff);
        this.m_achievement.on(Laya.Event.CLICK, this, this.onAchievement);
        this.m_activity.on(Laya.Event.CLICK, this, this.onActivity);
        this.m_shop.on(Laya.Event.CLICK, this, this.onShop);
        this.m_ranking.on(Laya.Event.CLICK, this, this.onRanking);
        this.m_backpack.on(Laya.Event.CLICK, this, this.onBackpack);
    }

    private finalizeEvent(): void {
        //关闭进入游戏的按钮
        this.m_checkpoint.off(Laya.Event.CLICK, this, this.onCheckpointClick);
        this.m_bolema.off(Laya.Event.CLICK, this, this.onBoLeMa);

        //关闭功能按钮
        this.m_on_off.off(Laya.Event.CLICK, this, this.onOnOff);
        this.m_achievement.off(Laya.Event.CLICK, this, this.onAchievement);
        this.m_activity.off(Laya.Event.CLICK, this, this.onActivity);
        this.m_shop.off(Laya.Event.CLICK, this, this.onShop);
        this.m_ranking.off(Laya.Event.CLICK, this, this.onRanking);
        this.m_backpack.off(Laya.Event.CLICK, this, this.onBackpack);
    }

    private onCheckpointClick(): void {
        DC.gameMode = GameMode.CHECKPOINT;
        Laya.Scene.open("main/CheckpointKindScene.scene");
    }

    private onBoLeMa(): void {
        DC.gameMode = GameMode.BO_LE_MA;
        Laya.Scene.open("main/FightScene.scene");
    }

    private onOnOff(): void {
        if (!this.m_isCanClick) {
            return;
        }

        let isVisible: boolean;
        let on_off_image: string;
        let actionX: number;
        let actionY: number;
        let actionScale: number;
        let actionRt: number;

        if (this.m_isOn) {
            this.m_isOn = false;
            actionX = this.m_on_off.x - 60;
            actionY = this.m_on_off.y;
            actionScale = 0.001;
            isVisible = false;
            actionRt = 180;
            on_off_image = "mainImage/Image8.png";
            this.onAction(this.m_event, this.m_on_off, actionX, actionY, actionScale, actionRt, isVisible, on_off_image);
        }
        else {
            this.m_isOn = true;
            actionX = 618;
            actionY = 639;
            actionScale = 1;
            isVisible = true;
            actionRt = 0;
            on_off_image = "mainImage/Image9.png";
            this.onAction(this.m_event, this.m_on_off, actionX, actionY, actionScale, actionRt, isVisible, on_off_image);
        }
    }

    private onAction(target1: Laya.Sprite, target2: Laya.Sprite, m_x: number, m_y: number, sc: number, rt: number, isV: boolean, img: string): void {
        this.m_isCanClick = false;
        Laya.Tween.to(target1,
            { x: m_x, y: m_y, scaleX: sc, scaleY: sc }, 1000,
            Laya.Ease.elasticInOut, Laya.Handler.create(this, this.onhide, [target1, isV]), 0);
        Laya.Tween.to(target2, { rotation: rt }, 1000,
            Laya.Ease.elasticInOut, Laya.Handler.create(this, this.canClick), 0);
        this.m_on_off.loadImage(img);
    }

    private canClick(): void {
        this.m_isCanClick = true;
    }

    private onhide(target: Laya.Sprite, isV: boolean): void {
        target.visible = isV;
    }

    //成就界面
    private onAchievement(): void {
        Laya.Scene.open("user_action/Achievement_Scene.scene");
    }

    //活动界面
    private onActivity(): void {
        
    }

    //商店界面
    private onShop(): void {
        Laya.Scene.open("user_action/StoreScene.scene");
    }

    //排行界面
    private onRanking(): void {
        Laya.Scene.open("user_action/RankingScene.scene");
    }


    //背包界面
    private onBackpack(): void {
        Laya.Scene.open("user_action/BackpackScene.scene");
    }
}