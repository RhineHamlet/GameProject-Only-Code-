import DC from "../../../GlobalData/DataCenter";
import EA from "./Elements/ElementAchievement";

export default class Achievement extends Laya.Script {

    /** @prop {name:Achievement,tips:"成就",type:Prefab}*/
    Achievement: Laya.Prefab;

    private m_lable: Laya.Label;//进度条数值，例如1/5
    private m_lable1: Laya.Label;//成就详情介绍
    private m_imageX: Laya.Image;//成就图片
    private m_loading: Laya.ProgressBar;//进度条
    private m_rewardBtn: Laya.Button;//领取奖励按钮

    private m_list: Laya.List;//传入链表的数组
    private btn_state: Array<any> = [];

    private m_success: Laya.Image;//获取奖励成功界面
    private m_successExit: Laya.Button;//退出获取奖励成功界面
    private m_obtain: Laya.Text;//获取奖励信息



    private Exit: Laya.Button;//退出按钮
    constructor() { super(); }

    onEnable(): void {
        this.initData();
        this.initParams();
        this.initUI();
        this.initEvent();
    }

    onDisable(): void {
        this.finalizeEvent();
    }

    onUpdate(): void {

    }

    onAwake(): void {


    }

    private initData(): void {
        for (let i = 0; i < DC.ownerUserInfo.achievementAry.length; i++) {
            DC.AchievementInfoAry[i].loading = DC.ownerUserInfo.achievementAry[i].progress;
            let nr = DC.ownerUserInfo.achievementAry[i].notReceive;
            let li = DC.AchievementInfoAry[i].loading;
            let ll = DC.AchievementInfoAry[i].lable;

            if (li >= ll && nr) {
                DC.AchievementInfoAry[i].rewardbtn = false;
            }
            else {
                DC.AchievementInfoAry[i].rewardbtn = true;
            }
        }
    }

    private initParams(): void {
        this.Exit = this.owner.getChildByName("Exit") as Laya.Button;                          //获取退出按钮
        this.m_success = this.owner.getChildByName("Successfulreception") as Laya.Image;       //成功获取奖励信息面板
        this.m_successExit = this.m_success.getChildByName("Success_Exit") as Laya.Button;     //退出信息面板
        this.m_obtain = this.m_success.getChildByName("Obtain") as Laya.Text;                  //奖励信息

        this.m_list = this.owner.getChildByName("my_list") as Laya.List;                       //获取链表
        this.m_list.renderHandler = new Laya.Handler(this, this.onRender);                     // 渲染list
        this.m_list.mouseHandler = new Laya.Handler(this, this.onMouse);
    }

    private initUI(): void {

        let data: Array<any> = [];
        for (let m = 0; m < DC.AchievementInfoAry.length; m++) {
            let a = Laya.Pool.getItemByCreateFun("achievement", this.Achievement.create, this.Achievement) as Laya.Sprite;
            data.push({ achievement: a });
        }
        this.m_list.array = data;
        this.m_list.refresh();
    }

    private initEvent(): void {
        this.Exit.on(Laya.Event.MOUSE_UP, this, this.onExit);
            this.m_successExit.on(Laya.Event.MOUSE_UP, this, this.onSuccess_Exit);
    }

    private finalizeEvent(): void {
        this.Exit.off(Laya.Event.MOUSE_UP, this, this.onExit);
    }

    private onRender(cell: Laya.Box, index: number): void {
        let ac: Laya.Sprite = cell.getChildAt(0) as Laya.Sprite;

        (ac.getComponent(EA) as EA).setUI(DC.AchievementInfoAry[index]);
    }

    private onMouse(e: Laya.Event, index: number): void {
        // 事件类型是否为Event.CLICK
        let a = (e.target == this.m_list.getCell(index).getChildAt(0).getChildAt(4));
        if (e.type == Laya.Event.CLICK && a) {
            let ea: EA = this.m_list.getCell(index).getChildAt(0).getComponent(EA);
            let a = DC.AchievementInfoAry[index];
            let b = DC.ownerUserInfo.achievementAry[index];

            a.rewardbtn = true;
            ea.setUI(a);
            b.notReceive = false;

            this.m_success.visible = true;
        }
    }

    private onExit(): void {
        Laya.Scene.open("main/MainScene.scene");
    }

    private onSuccess_Exit(): void {
        if (this.m_success.visible == true){
            this.m_success.visible = false;
        }
    }
}