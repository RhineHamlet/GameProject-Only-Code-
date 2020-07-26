import DT from "../../../GlobalData/DataConst";

/*
    弹跳对象
*/
export default class ElementBoardDraw extends Laya.Script {

    /** @prop {name:speedX,tips:"速度",type:number,default:0}*/
    speedX: number = 0;
    /** @prop {name:speedY,tips:"速度",type:number,default:0}*/
    speedY: number = 0;

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

        this.m_ownerBC.x = 0;
        this.m_ownerBC.y = 0;
        this.m_ownerBC.width = this.m_ownerSpr.width;
        this.m_ownerBC.height = this.m_ownerSpr.height;
    }

    /** 碰撞开始函数 */
    onTriggerEnter(other: any, self: any, contact: any): void {
        if (other.label == DT.LABEL_BC_PLAYER) {

            Laya.stage.event(DT.EVENT_PLAYER_TOUCH_SPRING, [this.speedX, this.speedY]);
        }
    }
}