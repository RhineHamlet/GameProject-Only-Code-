import CProjectUtils from "../../../Helper/ProjectUtils";
import CSysUtils from "../../../Helper/SysUtils";
import DC from "../../../GlobalData/DataCenter";
import DT from "../../../GlobalData/DataConst";

export default class MapPageUI extends Laya.Script {

    private m_bgImg: Laya.Sprite;
    private m_playerPos: Laya.Sprite;

    constructor() { super(); }

    onEnable(): void {
        this.m_bgImg = this.owner.getChildByName("bg_img") as Laya.Sprite;
        this.m_playerPos = this.owner.getChildByName("player_pos") as Laya.Sprite;

        Laya.stage.on(DT.EVENT_PLAYER_POS_VARY, this, this.onPlayerMove);
    }

    onUpdate() {
        if (DC.isLoadImg) {
            if (DC.curMapIndex >= 0 && DC.curMapIndex < 30) {
                this.m_bgImg.loadImage("map/" + (DC.curMapIndex + 1) + ".png");
                DC.isLoadImg = false;
            }
        }
    }

    onDisable(): void {
        Laya.stage.off(DT.EVENT_PLAYER_POS_VARY, this, this.onPlayerMove);
    }
    private onPlayerMove(varyX: number, varyY: number): void {
        let x = varyX / 42.2;
        let y = varyY / 44.4;
        this.m_playerPos.x = this.m_bgImg.x + x;
        this.m_playerPos.y = this.m_bgImg.y + y;
    }
}