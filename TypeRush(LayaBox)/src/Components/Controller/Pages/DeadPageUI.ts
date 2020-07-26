import DC from "../../../GlobalData/DataCenter";
import FinishPageUI from "./FinishPageUI";
import CProjectUtils from "../../../Helper/ProjectUtils";
import DT from "../../../GlobalData/DataConst";

export default class DeadPageUI extends Laya.Script {

    private m_btnResume: Laya.Button;                 //继续按钮
    private m_btnBack: Laya.Button;                 //返回按钮

    constructor() {
        super();
    }

    onEnable() {
        this.m_btnResume = this.owner.getChildByName("btn_resume") as Laya.Button;
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

        this.m_btnBack = this.owner.getChildByName("btn_back") as Laya.Button;
        this.m_btnBack.on(Laya.Event.MOUSE_UP, this, function () {
            this.clean();

            switch (DC.gameMode) {
                case 0:
                    Laya.Scene.open("main/FightScene.scene");
                    break;
                case 1:
                    Laya.Scene.open("main/CheckpointSelectScene.scene");
                    break;
            }
        });
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