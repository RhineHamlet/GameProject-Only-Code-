import DT from "../../../GlobalData/DataConst";

/*
    传送门
*/
export default class ElementDoor extends Laya.Script {

    /** @prop {name:transferPointX,tips:"传送点",type:number}*/
    transferPointX: number;
    /** @prop {name:transferPointY,tips:"传送点",type:number}*/
    transferPointY: number;

    public myRigidBody: Laya.RigidBody;             //自己的RigidBody
    public myBoxCollider: Laya.BoxCollider;         //自己的BoxCollider

    constructor() { 
        super(); 
    }

    onEnable() {
        this.myRigidBody = this.owner.getComponent(Laya.RigidBody);
        this.myRigidBody.type = "static";

        this.myBoxCollider = this.owner.getComponent(Laya.BoxCollider);
        this.myBoxCollider.isSensor = true;
        this.myBoxCollider.label = "door";
    }

    /** 碰撞开始函数 */
    onTriggerEnter(other: any, self: any, contact: any): void {
        if (other.label == DT.LABEL_BC_PLAYER) {

            Laya.stage.event(DT.EVENT_PLAYER_TOUCH_CONVEY_DOOR, [this.transferPointX, this.transferPointY]);
        }
    }
}