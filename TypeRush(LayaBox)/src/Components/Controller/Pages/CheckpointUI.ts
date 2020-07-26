import DC from "../../../GlobalData/DataCenter";

export default class CheckpointUI extends Laya.Script {

    private static MAIN_IMAGE_URL: Array<string> = ["checkpoint_res/Image3.png", "checkpoint_res/Image4.png"];
    private static STAR_IMAGE_URL: Array<string> = ["checkpoint_res/Image11.png", "checkpoint_res/Image12.png"];

    private m_starAry: Array<Laya.Image> = [];      //关卡星星
    private m_indexText: Laya.FontClip;             //关卡索引text
    private m_mainImage: Laya.Image;                //关卡主图片

    private m_state: number;                        //关卡按钮状态
    private m_index: number;                        //关卡按钮索引

    onAwake() {
        this.initParams();
    }
    onDisable() {

    }

    onClick() {
        DC.selectCheckpointAbsoluteValue = (DC.selectKindIndex - 1) * DC.checkpointAry[0].length + this.m_index;
        DC.selectCheckpointRelativeValue = this.m_index;
        if (DC.selectCheckpointAbsoluteValue < 10) {
            Laya.Scene.open("checkpoint_list/0" + DC.selectCheckpointAbsoluteValue + ".scene");
        } else {
            Laya.Scene.open("checkpoint_list/" + DC.selectCheckpointAbsoluteValue + ".scene");
        }
    }

    public initData(index: number, state: number): void {
        this.m_state = state;
        this.m_index = index;
        this.initUI();
    }

    private initParams(): void {
        this.m_mainImage = this.owner.getChildByName("main") as Laya.Image;
        this.m_indexText = this.owner.getChildByName("index") as Laya.FontClip;
        for (let i = 1; i <= 3; i++) {
            const e = this.owner.getChildByName("star" + i) as Laya.Image;
            this.m_starAry.push(e);
        }
    }

    private initUI(): void {
        this.m_indexText.value = (this.m_index + 1).toString();

        if (this.m_state == -2) {
            this.m_mainImage.skin = CheckpointUI.MAIN_IMAGE_URL[1];
            (this.owner as Laya.Sprite).mouseEnabled = false;
            for (let i = 0; i < this.m_starAry.length; i++) {
                this.m_starAry[i].destroy(true);
            }
            this.m_indexText.destroy(true);
        }
        else if (this.m_state == -1) {
            this.m_mainImage.skin = CheckpointUI.MAIN_IMAGE_URL[0];
            for (let i = 0; i < this.m_starAry.length; i++) {
                this.m_starAry[i].destroy(true);
            }
        }
        else {
            for (let i = 0; i < this.m_starAry.length; i++) {
                const e = this.m_starAry[i];
                if (i >= this.m_state) { e.skin = CheckpointUI.STAR_IMAGE_URL[0]; }
            }
        }
    }
}