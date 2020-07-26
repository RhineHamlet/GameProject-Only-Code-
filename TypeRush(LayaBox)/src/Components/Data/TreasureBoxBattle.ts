import ResLoader from "../../Tools/ResLoader";

/**
 * 战斗中的宝箱
 */
export default class TreasureBoxBattle extends Laya.Sprite {

    public static TREASURECHEST_ANIMATION_INTERVAL = 80;       //怪物Animation的播放动画间隔

    private m_resId: number;                                   //怪物的atlas资源编号
    private m_ani: Laya.Animation;                             //自己的动画

    constructor(resId: number) {
        super();
        
        this.m_resId = resId;

        //动画初始化
        this.m_ani = new Laya.Animation();
        this.m_ani.interval = TreasureBoxBattle.TREASURECHEST_ANIMATION_INTERVAL;
        this.m_ani.play(0, false, ResLoader.getCacheAniKey(ResLoader.TREASURE_BOX_IDLE, this.m_resId));
        this.addChild(this.m_ani);
    }

    public openBox(): void {
        this.m_ani.play(0, false, ResLoader.getCacheAniKey(ResLoader.TREASURE_BOX_OPEN, this.m_resId));
        this.m_ani.on(Laya.Event.COMPLETE, this, function () {});
    }
}