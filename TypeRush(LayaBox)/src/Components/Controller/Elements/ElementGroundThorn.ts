import DC from "../../../GlobalData/DataCenter";
import DT from "../../../GlobalData/DataConst";

/*
    地刺
*/
export default class ElementGroundThorn extends Laya.Script {

    /** @prop {name:grade,tips:"地刺等级",type:number,default:1}*/
    grade: number = 1;
    /** @prop {name:rebornTime,tips:"地刺复活时间(单位：毫秒),小于等于零表示不复活，大于零表示指定时间后复活，",type:number,default:0}*/
    rebornTime: number = 0;
    /** @prop {name:hurt,tips:"地刺基本伤害值(总伤害为grade*hurt)",type:number,default:10}*/
    hurt: number = 10;

    private m_ownerSpr: Laya.Sprite;                //自己的精灵        
    private m_ownerRB: Laya.RigidBody;              //自己的刚体
    private m_ownerBC: Laya.BoxCollider;            //自己的碰撞体

    onEnable() {
        this.m_ownerSpr = (this.owner as Laya.Sprite);
        this.m_ownerRB = this.owner.getComponent(Laya.RigidBody);
        this.m_ownerBC = this.owner.getComponent(Laya.BoxCollider);

        this.m_ownerRB.type = "static";
    }

    onUpdate() {

    }

    /** 碰撞开始函数 */
    onTriggerEnter(other: any, self: any, contact: any): void {
        //不显示时忽略碰撞
        if (this.m_ownerSpr.visible == false)
            return;

        if (other.label == DT.LABEL_BC_PLAYER) {
            if (this.rebornTime <= 0) {
                Laya.Tween.to(this.m_ownerSpr, { alpha: 0 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
                    this.m_ownerSpr.destroy(true);
                }));
            } else {
                Laya.Tween.to(this.m_ownerSpr, { alpha: 0 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
                    this.m_ownerSpr.visible = false;
                }));

                //指定时间后重新显示
                Laya.timer.once(this.rebornTime, this, function () {
                    this.m_ownerSpr.visible = true;
                    Laya.Tween.to(this.m_ownerSpr, { alpha: 1 }, 500, Laya.Ease.linearIn);
                });
            }

            Laya.stage.event(DT.EVENT_PLAYER_TOUCH_GROUND_THORN, [this.grade * this.hurt]);
        }
    }
}