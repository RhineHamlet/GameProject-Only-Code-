import DT from "../../../GlobalData/DataConst";

export default class ElementsSavePos extends Laya.Script {

    private m_ownerSpr: Laya.Sprite;
    private m_ownerBC: Laya.BoxCollider;
    private m_ownerRB: Laya.RigidBody;

    private m_isUse: boolean;               //是否使用过

    constructor() { super(); }

    onEnable(): void {

        this.m_ownerSpr = (this.owner as Laya.Sprite);

        this.m_ownerRB = this.owner.getComponent(Laya.RigidBody);
        this.m_ownerRB.type = "static";

        this.m_ownerBC = this.owner.getComponent(Laya.BoxCollider);
        this.m_ownerBC.isSensor = true;
    }

    //碰撞检测函数，当有物体进入时
    onTriggerEnter(other: any, self: any, contact: any): void {
        if (this.m_isUse) { return; }
        if (other.label == DT.LABEL_BC_PLAYER) {

            Laya.SoundManager.playSound("Music/jiandaoxingxing.wav", 1);
            
            //发送保存位置事件
            Laya.stage.event(DT.EVENT_SAVE_POS, [this.m_ownerSpr.x, this.m_ownerSpr.y]);
            this.m_isUse = true;
        }
    }
}