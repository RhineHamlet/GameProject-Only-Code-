import DC from "../../../GlobalData/DataCenter";
import CProjectUtils from "../../../Helper/ProjectUtils";
import DT from "../../../GlobalData/DataConst";

export default class FinishPageUI extends Laya.Script {

    private static star_image_str1: string = "common_image/icn_star_hui@2x.png";         //灰色星星图片地址
    private static star_image_str2: string = "common_image/icn_star@2x.png";             //黄色星星图片地址

    private m_txtScore: Laya.Text;                  //得分
    private m_txtMonster: Laya.Text;                //击杀怪物数量
    private m_txtRightRate: Laya.Text;              //打字正确率
    private m_txtSpeed: Laya.Text;                  //平均速度

    private m_btnResume: Laya.Button;               //继续按钮
    private m_btnBack: Laya.Button;                 //返回按钮

    private m_imgStars: Laya.Image[] = [];          //星星list

    private m_gainStarNum: number;                  //获取星星数

    constructor() { super(); }

    onEnable() {
        this.initParams();

        this.m_btnResume.on(Laya.Event.MOUSE_UP, this, function () {
            this.clean();

            switch (DC.gameMode) {
                case 0:
                    Laya.Scene.open("main/FightScene.scene");
                    break;
                case 1:
                    if (DC.selectCheckpointAbsoluteValue < 10) {
                        Laya.Scene.open("checkpoint_list/0" + DC.selectCheckpointAbsoluteValue + ".scene");
                    } else {
                        Laya.Scene.open("checkpoint_list/" + DC.selectCheckpointAbsoluteValue + ".scene");
                    }
                    break;
            }
        });

        this.m_btnBack.on(Laya.Event.MOUSE_UP, this, function () {
            this.clean();

            switch (DC.gameMode) {
                case 0:
                    Laya.Scene.open("main/FightScene.scene");
                    break;
                case 1:
                    if (this.m_gainStarNum > DC.checkpointAry[DC.selectKindIndex - 1][DC.selectCheckpointRelativeValue]) {
                        DC.checkpointAry[DC.selectKindIndex - 1][DC.selectCheckpointRelativeValue] = this.m_gainStarNum;
                        if (DC.selectCheckpointRelativeValue < DC.checkpointAry[DC.selectKindIndex - 1].length - 1) {
                            if (DC.checkpointAry[DC.selectKindIndex - 1][DC.selectCheckpointRelativeValue + 1] < -1) {
                                DC.checkpointAry[DC.selectKindIndex - 1][DC.selectCheckpointRelativeValue + 1] = -1;
                            }
                        } else {
                            if (DC.selectKindIndex + 1 <= DC.checkpointAry.length) {
                                if (DC.checkpointAry[DC.selectKindIndex][0] < -1) {
                                    DC.checkpointAry[DC.selectKindIndex][0] = -1;
                                }
                            }
                        }
                    }

                    Laya.Scene.open("main/CheckpointSelectScene.scene");
                    break;
            }
        });

        Laya.stage.on(DT.EVENT_GAME_VICTORY, this, this.onGameVictory);
    }

    onDisable() {
        Laya.stage.off(DT.EVENT_GAME_VICTORY, this, this.onGameVictory);
    }

    /** 游戏胜利 */
    private onGameVictory(gainStarNum: number): void {
        this.m_gainStarNum = gainStarNum;
        this.initUI();
    }

    public initUI() {
        //每秒5个字符为100分
        let speed = (DC.validCharNum / DC.totalUsedSecs);
        let score = Math.min(Math.floor(speed * 100 / 5), 100);

        this.m_txtScore.text = "最终得分:" + score.toString();
        this.m_txtMonster.text = "击杀怪物数:" + DC.totalKillEnemyNum;
        this.m_txtRightRate.text = "打字正确率:" + (DC.validCharNum / (DC.errorCharNum + DC.validCharNum) * 100).toFixed(1) + "%";
        this.m_txtSpeed.text = "平均速度：" + speed.toFixed(2) + "个/s";

        for (var i = 0; i < 3; i++) {
            if (i < this.m_gainStarNum) {
                this.m_imgStars[i].skin = FinishPageUI.star_image_str2;
            }
            else {
                this.m_imgStars[i].skin = FinishPageUI.star_image_str1;
            }
        }
    }

    private initParams(): void {
        this.m_txtScore = this.owner.getChildByName("txt_score") as Laya.Text;
        this.m_txtMonster = this.owner.getChildByName("txt_monster") as Laya.Text;
        this.m_txtRightRate = this.owner.getChildByName("txt_right_rate") as Laya.Text;
        this.m_txtSpeed = this.owner.getChildByName("txt_speed") as Laya.Text;

        this.m_imgStars.push(this.owner.getChildByName("Star1") as Laya.Image);
        this.m_imgStars.push(this.owner.getChildByName("Star2") as Laya.Image);
        this.m_imgStars.push(this.owner.getChildByName("Star3") as Laya.Image);

        this.m_btnResume = this.owner.getChildByName("btn_resume") as Laya.Button;
        this.m_btnBack = this.owner.getChildByName("btn_back") as Laya.Button;
    }

    /**
     * 清理游戏场景和设置属性
     */
    private clean(): void {
        this.m_btnResume.offAll();
        this.m_btnBack.offAll();
        this.owner.destroy(true);
        Laya.stage.event(DT.EVENT_GAME_AGAIN_START);

        Laya.stage.offAll();
        //设置物理世界根容器
        Laya.Physics.I.worldRoot = Laya.stage;
    }
}