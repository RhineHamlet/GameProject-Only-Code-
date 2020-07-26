import ResLoader from "../../Tools/ResLoader";

/**
 * 战斗中怪物对象(非控制器)
 */
export default class BattleEnemy extends Laya.Sprite {

    public static ENEMY_ANIMATION_INTERVAL = 80;        //怪物Animation的播放动画间隔

    private m_resId: number;                            //怪物的atlas资源编号
    private m_ownerScale: number = 0.3;                 //自己的缩放值
    public m_ani: Laya.Animation;                       //自己的animation

    /**
     * 构造函数
     * @param resId 
     */
    constructor(resId: number) {
        super();
        
        this.m_resId = resId;

        //初始化动画
        this.m_ani = new Laya.Animation();
        this.m_ani.autoSize = true;
        this.m_ani.scale(this.m_ownerScale, this.m_ownerScale, true);
        this.m_ani.interval = BattleEnemy.ENEMY_ANIMATION_INTERVAL;
        this.m_ani.play(0, true, ResLoader.getCacheAniKey(ResLoader.ENEMY_BATTLE_IDLE, this.m_resId));
        this.addChild(this.m_ani);

        //调整怪物位置
        this.x -= this.m_ani.width / 2 * this.m_ownerScale;
    }

    /**
     * 攻击
     */
    public Attack(): void {
        this.m_ani.play(0, false, ResLoader.getCacheAniKey(ResLoader.ENEMY_BATTLE_ATTACK, this.m_resId));
        this.m_ani.on(Laya.Event.COMPLETE, this, function () {
            this.myAnimation.play(0, true, this.enemyIdle_str);
        });
    }

    /**
     * 被攻击
     */
    public BeAttack(): void {
        this.m_ani.play(0, false, ResLoader.getCacheAniKey(ResLoader.ENEMY_BATTLE_BE_ATTACK, this.m_resId));
        this.m_ani.on(Laya.Event.COMPLETE, this, function () {
            this.myAnimation.play(0, true, this.enemyIdle_str);
        });
    }
}