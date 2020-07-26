
/**
 * 资源加载器(负责各种资源加载)
 */
export default class ResLoader {

    //宝箱1静态图片
    public static TREASURE_STATIC_IMG_1: string = "treasure_box/1_static.png";

    public static IMG_BATTLE_STAR: string = "battle_scene/star.png";

    //怪物动画动作常量
    public static ENEMY_FIGHT_RUN: string = "enemy_fight_run_";
    public static ENEMY_FIGHT_DEAD: string = "enemy_fight_dead_";
    public static ENEMY_BATTLE_IDLE: string = "enemy_battle_idle_";
    public static ENEMY_BATTLE_ATTACK: string = "enemy_battle_attack_";
    public static ENEMY_BATTLE_BE_ATTACK: string = "enemy_battle_be_attack_";

    //宝箱动作动画常量
    public static TREASURE_BOX_OPEN: string = "treasure_box_open_";
    public static TREASURE_BOX_IDLE: string = "treasure_box_idle_";

    /**
     * 获取缓存动画键值
     * @param action 动作名称，必须是常量(当前类中定义的常量)
     * @param resId 资源ID
     */
    public static getCacheAniKey(action: string, resId: number): string {
        return action + resId;
    }

    /**
     * 怪物动画预加载
     * @param ids 皮肤ID数组
     */
    public static preLoadEnemySkin(ids: number[]): void {
        let ani = new Laya.Animation();
        for (let i = 0; i < ids.length; i++) {
            ani.loadAtlas("enemy_skin" + ids[i] + "/run.atlas", null, ResLoader.getCacheAniKey(ResLoader.ENEMY_FIGHT_RUN, ids[i]));
            ani.loadAtlas("enemy_skin" + ids[i] + "/dead.atlas", null, ResLoader.getCacheAniKey(ResLoader.ENEMY_FIGHT_DEAD, ids[i]));
            ani.loadAtlas("enemy_skin" + ids[i] + "/battle_idle.atlas", null, ResLoader.getCacheAniKey(ResLoader.ENEMY_BATTLE_IDLE, ids[i]));
            ani.loadAtlas("enemy_skin" + ids[i] + "/battle_attack.atlas", null, ResLoader.getCacheAniKey(ResLoader.ENEMY_BATTLE_ATTACK, ids[i]));
            ani.loadAtlas("enemy_skin" + ids[i] + "/battle_be_attack.atlas", null, ResLoader.getCacheAniKey(ResLoader.ENEMY_BATTLE_BE_ATTACK, ids[i]));
        }
    }

    /**
     * 宝箱动画预加载
     * @param ids 皮肤ID数组
     */
    public static preLoadTreasureBox(ids: number[]): void {
        let ani = new Laya.Animation();
        for (let i = 0; i < ids.length; i++) {
            ani.loadAtlas("treasure_box/" + ids[i] + "_idle.atlas", null, ResLoader.getCacheAniKey(ResLoader.TREASURE_BOX_IDLE, ids[i]));
            ani.loadAtlas("treasure_box/" + ids[i] + "_open.atlas", null, ResLoader.getCacheAniKey(ResLoader.TREASURE_BOX_OPEN, ids[i]));
        }
    }
}