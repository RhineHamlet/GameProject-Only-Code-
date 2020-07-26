import DT from "../../../GlobalData/DataConst";

/*
    钻石对象
*/
export default class ElementDiamond extends Laya.Script {

    private m_ownerSpr: Laya.Sprite;                //自己的精灵        
    private m_ownerRB: Laya.RigidBody;              //自己的刚体
    private m_ownerBC: Laya.BoxCollider;            //自己的碰撞体

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
        if (other.owner.getComponent(Laya.BoxCollider).label == DT.LABEL_BC_PLAYER) {
            Laya.SoundManager.playSound("Music/jiandaoxingxing.wav", 1);
            
            //发送恢复血量事件
            Laya.stage.event(DT.EVENT_USER_RESTORE_HP, [20]);
            this.owner.destroy(true);
        }
    }

}