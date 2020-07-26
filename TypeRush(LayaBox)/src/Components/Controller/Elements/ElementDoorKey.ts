import DT from "../../../GlobalData/DataConst";

/*
    普通门钥匙
*/
export default class ElementDoorKey extends Laya.Script {
    /** @prop {name:door, tips:"门的实例", type:node}*/
    public door;

    private m_ownerSpr: Laya.Sprite;                //自己的精灵        
    private m_ownerRB: Laya.RigidBody;              //自己的刚体
    private m_ownerBC: Laya.BoxCollider;            //自己的碰撞体
    
    constructor() { 
        super(); 
    }

    onEnable(): void {
        this.m_ownerSpr = (this.owner as Laya.Sprite);

        this.m_ownerRB = this.owner.getComponent(Laya.RigidBody);
        this.m_ownerRB.type = "static";

        this.m_ownerBC = this.owner.getComponent(Laya.BoxCollider);
        this.m_ownerBC.isSensor = true;
        this.m_ownerBC.x = 0;
        this.m_ownerBC.y = 0;
        this.m_ownerBC.width = this.m_ownerSpr.width;
        this.m_ownerBC.height = this.m_ownerSpr.height;
    }

    /** 碰撞开始函数 */
    onTriggerEnter(other: any, self: any, contact: any): void {
        if (other.owner.getComponent(Laya.BoxCollider).label == DT.LABEL_BC_PLAYER) {
            this.door.removeSelf();
            this.owner.destroy(true);
        }
    }
}