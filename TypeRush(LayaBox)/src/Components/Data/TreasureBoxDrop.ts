import FightScene from "../Controller/Scenes/FightScene";
import DC from "../../GlobalData/DataCenter";
import DT from "../../GlobalData/DataConst";

/**
 * 场景中掉落宝箱对象
 */
export default class TreasureBoxDrop extends Laya.Sprite {
    private m_sprMain: Laya.Sprite;
    private m_isPlayEnter: boolean;
    public m_sceneCtrl: FightScene;

    constructor(x: number, y: number, imageUrl: string, sceneCtrl: FightScene) {
        super();

        this.x = x;
        this.y = y;
        this.m_sceneCtrl = sceneCtrl;
        this.m_isPlayEnter = false;

        //创建并加载宝箱图片
        this.m_sprMain = new Laya.Sprite();
        this.m_sprMain.width = 100;
        this.m_sprMain.height = 100;
        this.m_sprMain.loadImage(imageUrl);
        this.addChild(this.m_sprMain);

        //宝箱执行动画
        this.runJumpAni();

        //监听键盘事件
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);

        //启动碰撞检测定时器
        this.timer.loop(200, this, this.onCheckEnterIdle);

        //8秒后宝箱消失
        this.timer.once(8000, this, function () {
            this.clearAndDestroy();
        });
    }

    /** 计算是否进入可捡取范围 */
    private onCheckEnterIdle(): void {
        //计算碰撞距离
        let sprUser = this.m_sceneCtrl.m_playerSpr;
        if (sprUser.getBounds().intersects(this.getBounds())) {
            this.m_isPlayEnter = true;
        } else {
            this.m_isPlayEnter = false;
        }
    }

    onKeyUp(e: Laya.Event): void {

        //按下F键捡取宝箱
        if (e["keyCode"] != DT.CFG_KEY_PICK_BOX)
            return;

        //捡取宝箱
        if (this.m_isPlayEnter && DC.isInBattle == false) {
            
            DC.isOpeningTreasureBox = true;
            DC.isInBattle = true;
            Laya.loader.load("prefab/TreasureBoxPage.json", Laya.Handler.create(this, function (json: any) {
                let pef = new Laya.Prefab();
                pef.json = json;
                var page = pef.create() as Laya.Image;
                page.zOrder = DT.ZORDER_TREASURE_BOX_OPEN;
                DC.uiNode.addChild(page);

                page.x = 0;
                page.y = 0;
            }));

            this.clearAndDestroy();
        }
    }

    /** 执行动画 */
    private runJumpAni(): void {
        Laya.Tween.to(this.m_sprMain, { y: -20 }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
            Laya.Tween.to(this.m_sprMain, { y: 0 }, 1000, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                this.runJumpAni();
            }));
        }));
    }

    /** 清理并移除当前对象 */
    private clearAndDestroy(): void {
        Laya.stage.off(Laya.Event.KEY_UP, this, this.onKeyUp);
        this.timer.clearAll(this);
        this.destroy(true);
    }
}