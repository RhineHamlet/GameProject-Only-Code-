import CSysUtils from "../../../Helper/SysUtils";
import DC from "../../../GlobalData/DataCenter";
import DT from "../../../GlobalData/DataConst";
import DataConfig from "../../../GlobalData/DataConfig";
import CProjectUtils from "../../../Helper/ProjectUtils";

export default class FightInfoUI extends Laya.Script {

    private static JSON_KILL_ENEMY_TASK = "config/kill_enemy_reward.json";

    private m_killEnemyText: Laya.FontClip;                 //杀敌数文本
    private m_killEnemyImg: Laya.Image;                     //杀敌数图片

    private m_rewardKillEnemyBar: Laya.ProgressBar;         //杀敌奖励进度条
    private m_rewardKillEnemyText: Laya.FontClip;           //杀敌奖励文本
    private m_rewardKillEnemyImg: Laya.Image;               //杀敌奖励图片

    private m_inputSpeedText: Laya.FontClip;                //打字速度文本
    private m_inputSpeedImg: Laya.Image;                    //打字速度图片

    private m_owner: Laya.Sprite;                           //自己本身

    constructor() { super(); }

    onEnable(): void {
        this.initParams();

        //加载配置脚本
        let LOAD_ARY = [FightInfoUI.JSON_KILL_ENEMY_TASK];
        Laya.loader.load(LOAD_ARY, Laya.Handler.create(this, this.onJsonLoaded), null);

        Laya.stage.on(DT.EVENT_KILL_ENEMY_NUM_CHANGE, this, this.onKillEnemyNumChange);
    }

    onDisable(): void {
        Laya.stage.off(DT.EVENT_KILL_ENEMY_NUM_CHANGE, this, this.onKillEnemyNumChange);
    }

    onUpdate() {
        
    }

    private initParams(): void {
        this.m_owner = this.owner as Laya.Sprite;

        this.m_killEnemyText = this.m_owner.getChildByName("kill_enemy_text") as Laya.FontClip;
        this.m_killEnemyImg = this.m_owner.getChildByName("kill_enemy_img") as Laya.Image;

        this.m_rewardKillEnemyBar = this.m_owner.getChildByName("reward_kill_enemy_bar") as Laya.ProgressBar;
        this.m_rewardKillEnemyText = this.m_owner.getChildByName("reward_kill_enemy_text") as Laya.FontClip;
        this.m_rewardKillEnemyImg = this.m_owner.getChildByName("reward_kill_enemy_img") as Laya.Image;

        this.m_inputSpeedText = this.m_owner.getChildByName("input_speed_text") as Laya.FontClip;
        this.m_inputSpeedImg = this.m_owner.getChildByName("input_speed_img") as Laya.Image
    }

    private initUI(): void {
        this.m_owner.pos(0,0);

        let task = DataConfig.jumpMultiTasks[DC.indexTask];

        //初始化杀敌奖励相关
        this.m_rewardKillEnemyText.value = "0/" + task[0];
        this.m_rewardKillEnemyBar.value = 0;

        //初始化杀敌数相关
        this.m_killEnemyText.value = "0个";

        //初始化打字速度相关
        this.m_inputSpeedText.value = "0个/分";
    }

    /** 击杀怪物数量总数改变事件 */
    private onKillEnemyNumChange(num: number): void {
        let jump_Tasks = DataConfig.jumpMultiTasks;
        if (DC.indexTask >= jump_Tasks.length || DC.indexTask < 0) { DC.indexTask = 0; }
        
        let task = jump_Tasks[DC.indexTask];
        if (num >= task[0]) {
            DC.killEnemyNumTask = 0;
            DC.indexTask++;
            if (DC.indexTask >= jump_Tasks.length) { DC.indexTask = 0; }
        }
        task = jump_Tasks[DC.indexTask];

        //更新杀敌奖励相关
        this.m_rewardKillEnemyText.value = DC.killEnemyNumTask + "/" + task[0];
        this.m_rewardKillEnemyBar.value = DC.killEnemyNumTask == 0 ? 0 : DC.killEnemyNumTask / task[0];

        //更新杀敌数相关
        this.m_killEnemyText.value = DC.totalKillEnemyNum.toString() + "个";

        //更新打字速度相关
        let speed = Math.floor(DC.validCharNum * 60 / DC.totalUsedSecs);
        this.m_inputSpeedText.value = speed + "个/分";
    }

    /**
     * Json加载回调
     * @param e 
     */
    private onJsonLoaded(e): void {
        if (e == null) {
            console.log("加载配置文件失败");
            return;
        }
        this.initKillEnemyReward();

        this.initUI();
    }

    /** 初始化杀敌奖励*/
    private initKillEnemyReward(): void {
        let json = Laya.loader.getRes(FightInfoUI.JSON_KILL_ENEMY_TASK);
        DataConfig.jumpMultiTasks = json.jump_multi as Array<any>;
    }
}