import DT from "../../../GlobalData/DataConst";
import { PlayerState, ElementName } from "../../../GlobalData/DataStruct";

/*
    左右、上下移动板和静止板
*/
export default class ElementBoardMoving extends Laya.Script {

    /** @prop {name:directionMode,tips:"1：上下模式；2：左右模式;3:静止",type:number,default:3}*/
    directionMode: number = 3;

    /** @prop {name:moveSpeed,tips:"移动的速度",type:number,default:0}*/
    moveSpeed: number = 0;

    /** @prop {name:beginPoint,tips:"起始点,必须在你的图片座标左边",type:number,default:0}*/
    beginPoint: number = 0;

    /** @prop {name:endPoint,tips:"终止点，必须在你的图片座标右边",type:number,default:0}*/
    endPoint: number = 0;

    /** @prop {name:tag,tips:"板子的种类标签,1:普通地面,2:冰面,3:定时消失板,4:站立消失板",type:number,default:1}*/
    tag: number = 1;

    private m_ownerSpr: Laya.Sprite;                    //自己的精灵对象
    private m_ownerRB: Laya.RigidBody;                  //自己的RigidBody
    private m_ownerBC: Laya.BoxCollider;                //自己的BoxCollider

    public m_direction: number;                         //方向
    private m_saveSpeed;                                //暂停前的速度

    private m_isPlayerEnter: boolean;                   //是否与主角接触
    private m_isDisappear: boolean;                     //是否消失

    constructor() {
        super();
    }

    onEnable(): void {
        this.m_direction = 0;
        this.m_isPlayerEnter = false;
        this.m_isDisappear = false;

        this.m_ownerSpr = (this.owner as Laya.Sprite);

        //读取并设置刚体和碰撞体类型
        this.m_ownerRB = this.owner.getComponent(Laya.RigidBody);
        this.m_ownerRB.allowRotation = false;
        this.m_ownerRB.type = "kinematic";
        this.m_ownerRB.bullet = true;
        this.m_ownerRB.gravityScale = 0;

        this.m_ownerBC = this.owner.getComponent(Laya.BoxCollider);
        this.m_ownerBC.isSensor = false;
        this.m_ownerBC.friction = 0;
        this.m_ownerBC.label = DT.LABEL_BC_FLOOR;

        //设置移动速度
        this.m_ownerRB.linearVelocity = { x: 0, y: 0 };
        if (this.directionMode == 1) {
            this.m_ownerRB.linearVelocity = { x: 0, y: this.moveSpeed };
        }
        else if (this.directionMode == 2) {
            this.m_ownerRB.linearVelocity = { x: this.moveSpeed, y: 0 };
        }

        if (this.directionMode == 1 || this.directionMode == 2) {
            this.owner.timer.frameLoop(1, this, this.ondirectionIdle);
            Laya.stage.on(DT.EVENT_GAME_PAUSE, this, this.onGamePause);
            Laya.stage.on(DT.EVENT_GAME_RESUME, this, this.onGameResume);
            Laya.stage.on(DT.EVENT_PLAYER_STATE_VARY, this, this.onPlayerStateVary);
        }
        if (this.tag == 3) {
            this.owner.timer.loop(5000, this, this.onTimingDisappear);
        }
        Laya.stage.on(DT.EVENT_GAME_OVER, this, this.onGameOver);
        Laya.stage.on(DT.EVENT_GAME_VICTORY, this, this.onGameOver);
    }

    onDisable() {
        if (this.directionMode == 1 || this.directionMode == 2) {
            Laya.stage.off(DT.EVENT_GAME_PAUSE, this, this.onGamePause);
            Laya.stage.off(DT.EVENT_GAME_RESUME, this, this.onGameResume);
            Laya.stage.off(DT.EVENT_PLAYER_STATE_VARY, this, this.onPlayerStateVary);
        }
        Laya.stage.off(DT.EVENT_GAME_OVER, this, this.onGameOver);
        Laya.stage.off(DT.EVENT_GAME_VICTORY, this, this.onGameOver);
    }

    //碰撞检测函数，当有物体进入时
    onTriggerEnter(other: any, self: any, contact: any): void {
        if (this.m_isDisappear) {
            return;
        }
        if (other.label == DT.LABEL_BC_PLAYER) {
            //判断角色是否是在平台上方进入
            let b2WorldManifold = new Laya.Browser.window.box2d.b2WorldManifold();
            contact.GetWorldManifold(b2WorldManifold);
            let l_colX = b2WorldManifold.points[0].x * Laya.Physics.PIXEL_RATIO;
            let l_colY = b2WorldManifold.points[0].y * Laya.Physics.PIXEL_RATIO;
            if (self.y + self.owner.y + 5 >= l_colY) {
                if (this.tag == 4) { this.touchDisappear(); }
                this.m_isPlayerEnter = true;
                Laya.stage.event(DT.EVENT_PLAYER_TOUCH_FLOOR, [this.tag]);
            }
        }
    }

    /** 碰撞检测函数，当有物体离开时 */
    onTriggerExit(other: any, self: any, contact: any) {
        if (other.label == DT.LABEL_BC_PLAYER) {
            this.m_isPlayerEnter = false;
        }
    }

    /** 定时消失*/
    private onTimingDisappear(): void {
        if(this.m_isDisappear){
            this.m_ownerSpr.visible = true;
            this.m_ownerBC.isSensor = false;
            this.m_isDisappear = false;
        }else{
            this.m_ownerSpr.visible = false;
            this.m_ownerBC.isSensor = true;
            this.m_isDisappear = true;
        }
    }

    private ondirectionIdle(): void {
        if (this.m_isDisappear) {
            return;
        }
        //移动方向切换
        if (this.directionMode == 1) {
            //垂直方向
            if (this.m_ownerSpr.y < this.beginPoint && this.m_direction != 1) {
                this.m_direction = 1;
                this.m_ownerRB.linearVelocity = { x: 0, y: this.moveSpeed };
            }
            else if (this.m_ownerSpr.y > this.endPoint && this.m_direction != 2) {
                this.m_direction = 2;
                this.m_ownerRB.linearVelocity = { x: 0, y: -this.moveSpeed };
            }
        }
        else if (this.directionMode == 2) {
            //水平方向
            if (this.m_ownerSpr.x < this.beginPoint && this.m_direction != 1) {
                this.m_direction = 1;
                this.m_ownerRB.linearVelocity = { x: this.moveSpeed, y: 0 };

                //发出通知
                if (this.m_isPlayerEnter) {
                    Laya.stage.event(DT.EVENT_PLAYER_STATE_VARY_FEEDBACK, [this.moveSpeed * 2, 0, ElementName.BOARD_MOVING]);
                }
            }
            else if (this.m_ownerSpr.x > this.endPoint && this.m_direction != 2) {
                this.m_direction = 2;
                this.m_ownerRB.linearVelocity = { x: -this.moveSpeed, y: 0 };

                //发出通知
                if (this.m_isPlayerEnter) {
                    Laya.stage.event(DT.EVENT_PLAYER_STATE_VARY_FEEDBACK, [-this.moveSpeed * 2, 0, ElementName.BOARD_MOVING]);
                }
            }
        }
    }

    /** 角色状态变化*/
    private onPlayerStateVary(state: PlayerState): void {
        if (!this.m_isPlayerEnter || this.m_isDisappear)
            return;
        if (this.directionMode == 2) {
            if (state == PlayerState.IDLE || state == PlayerState.RUN) {
                let Sx = this.m_direction == 1 ? this.moveSpeed : -this.moveSpeed;
                Laya.stage.event(DT.EVENT_PLAYER_STATE_VARY_FEEDBACK, [Sx, 0, ElementName.BOARD_MOVING]);
            }
        }
    }

    /** 游戏暂停 */
    private onGamePause(): void {
        this.m_saveSpeed = this.m_ownerRB.linearVelocity;
        this.m_ownerRB.linearVelocity = { x: 0, y: 0 };
    }

    /** 游戏继续 */
    private onGameResume(): void {
        this.m_ownerRB.linearVelocity = this.m_saveSpeed;
    }

    /** 游戏终止 */
    private onGameOver(): void {
        this.owner.timer.clearAll(this);
    }

    /** 触摸消失*/
    private touchDisappear(): void {
        this.owner.timer.once(10000, this, function () {
            this.m_ownerSpr.visible = false;
            this.m_ownerBC.isSensor = true;
            this.m_isDisappear = true;
            this.owner.timer.once(5000, this, function () {
                this.m_ownerSpr.visible = true;
                this.m_ownerBC.isSensor = false;
                this.m_isDisappear = false;
            });
        });
    }
}