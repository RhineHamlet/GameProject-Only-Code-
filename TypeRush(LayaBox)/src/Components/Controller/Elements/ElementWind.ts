import DT from "../../../GlobalData/DataConst";
import { PlayerState, ElementName } from "../../../GlobalData/DataStruct";

/*
    风
*/
export default class ElementWind extends Laya.Script {

    /** @prop {name:forceX,tips:"X方向的力",type:number,default:0}*/
    forceX: number = 0;
    /** @prop {name:forceY,tips:"Y方向的力",type:number,default:0}*/
    forceY: number = 0;

    private m_ownerSpr: Laya.Sprite;
    private m_ownerBC: Laya.BoxCollider;
    private m_ownerRB: Laya.RigidBody;

    private m_isPlayerEnter: boolean;               //主角是否进入风区
    private m_isStop: boolean;                      //是否停止风

    constructor() {
        super();
    }

    onEnable() {
        this.m_ownerSpr = (this.owner as Laya.Sprite);

        this.m_ownerRB = this.owner.getComponent(Laya.RigidBody);
        this.m_ownerRB.type = "static";

        this.m_ownerBC = this.owner.getComponent(Laya.BoxCollider);
        this.m_ownerBC.isSensor = true;

        this.m_isPlayerEnter = false;
        this.m_isStop = false;

        Laya.stage.on(DT.EVENT_GAME_PAUSE, this, this.onGamePause);
        Laya.stage.on(DT.EVENT_GAME_RESUME, this, this.onGameResume);
        Laya.stage.on(DT.EVENT_GAME_OVER, this, this.onGameOver);
        Laya.stage.on(DT.EVENT_GAME_VICTORY, this, this.onGameOver);
        Laya.stage.on(DT.EVENT_PLAYER_STATE_VARY, this, this.onPlayerStateVary);
    }

    onDisable() {
        Laya.stage.off(DT.EVENT_GAME_PAUSE, this, this.onGamePause);
        Laya.stage.off(DT.EVENT_GAME_RESUME, this, this.onGameResume);
        Laya.stage.off(DT.EVENT_GAME_OVER, this, this.onGameOver);
        Laya.stage.off(DT.EVENT_GAME_VICTORY, this, this.onGameOver);
        Laya.stage.off(DT.EVENT_PLAYER_STATE_VARY, this, this.onPlayerStateVary);
    }

    /** 碰撞开始 */
    onTriggerEnter(other: any, self: any, contact: any): void {
        //如果和用户碰撞
        if (other.label == DT.LABEL_BC_PLAYER) {
            this.m_isPlayerEnter = true;
            if (this.m_isStop) {
                return;
            }
            Laya.stage.event(DT.EVENT_PLAYER_STATE_VARY_FEEDBACK, [this.forceX, this.forceY, ElementName.WIND]);
        }
    }

    /** 碰撞结束 */
    onTriggerExit(other: any, self: any, contact: any): void {
        //如果和用户碰撞
        if (other.label == DT.LABEL_BC_PLAYER) {
            this.m_isPlayerEnter = false;
            if (this.m_isStop) {
                return;
            }
            Laya.stage.event(DT.EVENT_PLAYER_STATE_VARY_FEEDBACK, [this.forceX, this.forceY, ElementName.WIND]);
        }
    }
    /** 角色状态变化*/
    private onPlayerStateVary(state: PlayerState): void {
        if (!this.m_isPlayerEnter || this.m_isStop) {
            return;
        }
        Laya.stage.event(DT.EVENT_PLAYER_STATE_VARY_FEEDBACK, [this.forceX, this.forceY, ElementName.WIND]);
    }

    /** 游戏暂停 */
    private onGamePause(): void {
        this.m_isStop = true;
    }

    /** 游戏继续 */
    private onGameResume(): void {
        this.m_isStop = false;
    }

    /** 游戏终止 */
    private onGameOver(): void {
        Laya.timer.clearAll(this);
        this.m_isStop = true;
    }
}