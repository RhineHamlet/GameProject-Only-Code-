import DT from "../../../GlobalData/DataConst";

/*
    星星
*/
export default class ElementStar extends Laya.Script {

    private m_ownerSpr: Laya.Sprite;
    private m_ownerBC: Laya.BoxCollider;
    private m_ownerRB: Laya.RigidBody;

    constructor() {
        super();
    }

    onEnable() {
        this.m_ownerSpr = (this.owner as Laya.Sprite);

        this.m_ownerRB = this.owner.getComponent(Laya.RigidBody);
        this.m_ownerRB.type = "static";

        this.m_ownerBC = this.owner.getComponent(Laya.BoxCollider);
        this.m_ownerBC.isSensor = true;
    }

    //碰撞检测函数，当有物体进入时
    onTriggerEnter(other: any, self: any, contact: any): void {
        if (other.label == DT.LABEL_BC_PLAYER) {

            Laya.SoundManager.playSound("Music/jiandaoxingxing.wav", 1);
            
            //发送获得星星事件
            Laya.stage.event(DT.EVENT_USER_GAIN_STAR, [1]);
            this.owner.destroy(true);
        }
    }
}