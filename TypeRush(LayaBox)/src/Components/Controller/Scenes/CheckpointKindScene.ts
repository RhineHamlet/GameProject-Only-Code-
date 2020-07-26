import DC from "../../../GlobalData/DataCenter";
import DataConfig from "../../../GlobalData/DataConfig";

export default class CheckpointKindScene extends Laya.Script {

    private static SELECT_MOVE_DISTANCE: number = 500;      //跳转资料片的移动距离单位
    private static CHECKPOINT_KIND_NUM: number = 3;         //资料片个数
    private static LIGHT_IMAGE_URL: Array<string> = ["checkpoint_res/Image15.png", "checkpoint_res/Image16.png"];
    private static CHECKPOINT_INFO_URL: string = "config/checkpoint_kind/checkpoint_info";

    private m_back: Laya.Image;                             //返回
    private m_leftArrow: Laya.Image;                        //向左箭头
    private m_rightArrow: Laya.Image;                       //向右箭头
    private m_kindNode: Laya.Image;                         //资料片节点
    private m_lights: Array<Laya.Image> = [];               //标识灯1

    private m_kindNodeMask: Laya.Sprite;                    //资料片节点的遮罩图片

    private m_selectKindIndex: number;                      //选择的资料片索引

    private m_isArrowClick: boolean;                        //能否点击箭头

    private m_isLoad: boolean;                              //正在进入关卡选择界面

    constructor() { super(); }

    onEnable(): void {
        this.initData();
        this.initParams();
        this.initUI();

        this.selectCheckpointKind(1 - DC.selectKindIndex);

        this.m_back.on(Laya.Event.CLICK, this, this.onBackClick);
        this.m_leftArrow.on(Laya.Event.CLICK, this, this.onLeftArrowClick);
        this.m_rightArrow.on(Laya.Event.CLICK, this, this.onRightArrowClick);
        for (let i = 0; i < CheckpointKindScene.CHECKPOINT_KIND_NUM; i++) {
            const e = this.m_kindNode.getChildAt(i);
            e.on(Laya.Event.CLICK, this, this.onCheckpointKindClick);
        }
    }

    onDisable(): void {
        this.m_back.off(Laya.Event.CLICK, this, this.onBackClick);
        this.m_leftArrow.off(Laya.Event.CLICK, this, this.onLeftArrowClick);
        this.m_rightArrow.off(Laya.Event.CLICK, this, this.onRightArrowClick);
        for (let i = 0; i < CheckpointKindScene.CHECKPOINT_KIND_NUM; i++) {
            const e = this.m_kindNode.getChildAt(i);
            e.off(Laya.Event.CLICK, this, this.onCheckpointKindClick);
        }
    }

    private initData(): void {
        this.m_selectKindIndex = 0;
        this.m_isArrowClick = true;
        this.m_isLoad = false;
    }

    private initParams(): void {
        this.m_back = this.owner.getChildByName("back") as Laya.Image;
        this.m_leftArrow = this.owner.getChildByName("left_arrow") as Laya.Image;
        this.m_rightArrow = this.owner.getChildByName("right_arrow") as Laya.Image;
        this.m_kindNode = this.owner.getChildByName("kind_node") as Laya.Image;
        //获取带“light”的元素
        for (let i = 1; i <= CheckpointKindScene.CHECKPOINT_KIND_NUM; i++) {
            const e = this.owner.getChildByName("light" + i) as Laya.Image;
            this.m_lights.push(e);
        }
    }

    private initUI(): void {
        //设置资料片节点的遮罩
        this.m_kindNodeMask = new Laya.Sprite();
        this.m_kindNodeMask.pos(0, 0);
        this.m_kindNodeMask.graphics.drawRect(-246, -190, 492, 500, "#ffffff");
        this.m_kindNode.mask = this.m_kindNodeMask;

        this.setLightImageSkin();
        this.setKindNodeChildMouseEnabled();
        this.setArrowVisible();
    }

    /**
     * 点击返回按钮事件
     */
    private onBackClick(): void {
        Laya.Scene.open("main/MainScene.scene");
    }

    /**
     * 点击向左箭头事件
     */
    private onLeftArrowClick(): void {
        if (this.m_selectKindIndex <= 0) { return; }
        if (!this.m_isArrowClick) { return; }
        this.selectCheckpointKind(1);
    }

    /**
     * 点击向右箭头事件
     */
    private onRightArrowClick(): void {
        if (this.m_selectKindIndex >= CheckpointKindScene.CHECKPOINT_KIND_NUM - 1) { return; }
        if (!this.m_isArrowClick) { return; }
        this.selectCheckpointKind(-1);
    }

    /**
     * 点击资料片图片事件
     */
    private onCheckpointKindClick(): void {
        if (this.m_isLoad) { return; }
        this.m_isLoad = true;
        DC.selectKindIndex = this.m_selectKindIndex + 1;
        switch (DC.selectKindIndex) {
            case 1:
                if (DataConfig.checkpointInfoList1.length == 0) {
                    Laya.loader.load(CheckpointKindScene.CHECKPOINT_INFO_URL + 1 + ".json", Laya.Handler.create(this, this.onJsonLoaded), null);
                }
                else { Laya.Scene.open("main/CheckpointSelectScene.scene"); }
                break;
            case 2:
                if (DataConfig.checkpointInfoList2.length == 0) {
                    Laya.loader.load(CheckpointKindScene.CHECKPOINT_INFO_URL + 2 + ".json", Laya.Handler.create(this, this.onJsonLoaded), null);
                }
                else { Laya.Scene.open("main/CheckpointSelectScene.scene"); }
                break;
            case 3:
                if (DataConfig.checkpointInfoList3.length == 0) {
                    Laya.loader.load(CheckpointKindScene.CHECKPOINT_INFO_URL + 3 + ".json", Laya.Handler.create(this, this.onJsonLoaded), null);
                }
                else { Laya.Scene.open("main/CheckpointSelectScene.scene"); }
                break;
        }
    }

    /**
     * 选择关卡种类索引
     * @param moveNum 移动距离
     */
    private selectCheckpointKind(moveNum: number): void {
        let distance = moveNum * CheckpointKindScene.SELECT_MOVE_DISTANCE;
        let node = this.m_kindNode;
        this.m_isArrowClick = false;

        Laya.Tween.to(node, { x: node.x + distance, y: node.y }, 500, Laya.Ease.linearNone, Laya.Handler.create(this, function () {
            this.m_isArrowClick = true;
            if (moveNum < 0) { this.m_selectKindIndex -= moveNum; }
            else if (moveNum > 0) { this.m_selectKindIndex -= moveNum; }

            this.setLightImageSkin();
            this.setKindNodeChildMouseEnabled();
            this.setArrowVisible();

        }), 0, false);
        Laya.Tween.to(this.m_kindNodeMask, { x: this.m_kindNodeMask.x - distance, y: this.m_kindNodeMask.y }, 500, Laya.Ease.linearNone);
    }

    /**
     * 设置资料片图片是否响应鼠标事件
     */
    private setKindNodeChildMouseEnabled(): void {
        for (let i = 0; i < CheckpointKindScene.CHECKPOINT_KIND_NUM; i++) {
            const e = this.m_kindNode.getChildAt(i) as Laya.Image;
            if (i == this.m_selectKindIndex) { e.mouseEnabled = true; }
            else { e.mouseEnabled = false; }
        }
    }

    /**
     * 设置灯的图片
     */
    private setLightImageSkin(): void {
        for (let i = 0; i < this.m_lights.length; i++) {
            const e = this.m_lights[i];
            if (i == this.m_selectKindIndex) { e.skin = CheckpointKindScene.LIGHT_IMAGE_URL[1]; }
            else { e.skin = CheckpointKindScene.LIGHT_IMAGE_URL[0]; }
        }
    }

    /**
     * 设置左右箭头的隐藏
     */
    private setArrowVisible(): void {
        if (this.m_selectKindIndex <= 0) { this.m_leftArrow.visible = false; }
        else { this.m_leftArrow.visible = true; }
        if (this.m_selectKindIndex >= CheckpointKindScene.CHECKPOINT_KIND_NUM - 1) { this.m_rightArrow.visible = false; }
        else { this.m_rightArrow.visible = true; }
    }

    /**
     * Json加载回调
     * @param e 
     */
    private onJsonLoaded(e): void {
        if (e == null) {
            console.log("加载配置文件失败");
            return;
        }

        //初始化配置数据
        this.initCheckpointInfo();

        Laya.Scene.open("main/CheckpointSelectScene.scene");
    }

    /**
     * 初始化关卡信息
     */
    private initCheckpointInfo(): void {
        let json: Array<any>;
        switch (DC.selectKindIndex) {
            case 1:
                json = Laya.loader.getRes(CheckpointKindScene.CHECKPOINT_INFO_URL + 1 + ".json") as Array<any>;
                DataConfig.checkpointInfoList1 = json;
                break;
            case 2:
                json = Laya.loader.getRes(CheckpointKindScene.CHECKPOINT_INFO_URL + 2 + ".json") as Array<any>;
                DataConfig.checkpointInfoList2 = json;
                break;
            case 3:
                json = Laya.loader.getRes(CheckpointKindScene.CHECKPOINT_INFO_URL + 3 + ".json") as Array<any>;
                DataConfig.checkpointInfoList3 = json;
                break;
        }
    }
}