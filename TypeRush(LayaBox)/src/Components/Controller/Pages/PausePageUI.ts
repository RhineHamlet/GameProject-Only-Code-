import DT from "../../../GlobalData/DataConst";
import CProjectUtils from "../../../Helper/ProjectUtils";

export default class PausePageUI extends Laya.Script {
    private return_image: Laya.Button;                   //返回按钮
    private recur_image: Laya.Button;                    //继续按钮

    constructor() {
        super();

    }

    onEnable() {
        this.return_image = this.owner.getChildByName("return") as Laya.Button;
        this.return_image.on(Laya.Event.MOUSE_UP, this, function () {
            Laya.stage.event(DT.EVENT_GAME_OVER);
            this.return_image.offAll();
            this.recur_image.offAll();
            this.owner.destroy(true);
        });

        this.recur_image = this.owner.getChildByName("recur") as Laya.Button;
        this.recur_image.on(Laya.Event.MOUSE_UP, this, function () {

            Laya.stage.event(DT.EVENT_GAME_RESUME);

            this.return_image.offAll();
            this.recur_image.offAll();
            this.owner.destroy(true);
        });
    }
}