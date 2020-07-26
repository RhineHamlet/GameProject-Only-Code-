import DC from "../../../GlobalData/DataCenter";
import CheckpointUI from "../Pages/CheckpointUI";

export default class CheckpointSelectScene extends Laya.Script {

    /** @prop {name:checkpoint,tips:"关卡按钮",type:Prefab}*/
    checkpoint: Laya.Prefab;

    private static SELECT_MOVE_DISTANCE: number = 500;      //跳转一页的移动距离
    private static CHECKPOINT_NUM: number = 50;             //关卡按钮总数 
    private static ONE_PAGE_NUM: number = 25;               //一页的关卡按钮个数
    private static LIGHT_IMAGE_URL: Array<string> = ["checkpoint_res/Image15.png", "checkpoint_res/Image16.png"];

    private m_back: Laya.Image;                             //返回
    private m_leftArrow: Laya.Image;                        //向左箭头
    private m_rightArrow: Laya.Image;                       //向右箭头
    private m_checkpointNode: Laya.Image;                   //关卡按钮节点
    private m_starText: Laya.FontClip;                      //星星数文本

    private m_checkpointNodeMask: Laya.Sprite;              //关卡按钮节点的遮罩图片

    private m_selectPageIndex: number;                      //选择的页面索引

    private m_isArrowClick: boolean;                        //能否点击箭头

    private m_checkpointPageNum: number;                    //关卡页面数

    private m_starNum: number;                              //星星数

    constructor() { super(); }

    onEnable(): void {
        this.initData();
        this.initParams();
        this.initUI();

        this.m_back.on(Laya.Event.CLICK, this, this.onBackClick);
        this.m_leftArrow.on(Laya.Event.CLICK, this, this.onLeftArrowClick);
        this.m_rightArrow.on(Laya.Event.CLICK, this, this.onRightArrowClick);
    }

    onDisable(): void {
        this.m_back.off(Laya.Event.CLICK, this, this.onBackClick);
        this.m_leftArrow.off(Laya.Event.CLICK, this, this.onLeftArrowClick);
        this.m_rightArrow.off(Laya.Event.CLICK, this, this.onRightArrowClick);
    }

    private initData(): void {
        this.m_selectPageIndex = 0;
        this.m_isArrowClick = true;
        this.m_starNum = 0;
        CheckpointSelectScene.CHECKPOINT_NUM = DC.checkpointAry[DC.selectKindIndex - 1].length;
        this.m_checkpointPageNum = CheckpointSelectScene.CHECKPOINT_NUM / CheckpointSelectScene.ONE_PAGE_NUM;
    }

    private initParams(): void {
        this.m_back = this.owner.getChildByName("back") as Laya.Image;
        this.m_leftArrow = this.owner.getChildByName("left_arrow") as Laya.Image;
        this.m_rightArrow = this.owner.getChildByName("right_arrow") as Laya.Image;
        this.m_checkpointNode = this.owner.getChildByName("checkpoint_node") as Laya.Image;
        this.m_starText = this.owner.getChildByName("star_num") as Laya.FontClip;

        for (let i = 0; i < CheckpointSelectScene.CHECKPOINT_NUM; i++) {
            let e = Laya.Pool.getItemByCreateFun("checkpoint", this.checkpoint.create, this.checkpoint) as Laya.Image;
            let x = (i % 5) * 100 + 400 + Math.floor(i / CheckpointSelectScene.ONE_PAGE_NUM) * CheckpointSelectScene.SELECT_MOVE_DISTANCE + 40;
            let y = (Math.floor(i / 5) - Math.floor(i / CheckpointSelectScene.ONE_PAGE_NUM) * 5) * 100 + 190;
            e.pos(x, y);
            let state = DC.checkpointAry[DC.selectKindIndex - 1][i];
            if (state > 0) { this.m_starNum += state; }
            this.m_checkpointNode.addChild(e);
            (e.getComponent(CheckpointUI) as CheckpointUI).initData(i, state);
        }
    }

    private initUI(): void {
        //设置关卡节点的遮罩
        this.m_checkpointNodeMask = new Laya.Sprite();
        this.m_checkpointNodeMask.pos(0, 0);
        this.m_checkpointNodeMask.graphics.drawRect(400, 140, 492, 500, "#ffffff");
        this.m_checkpointNode.mask = this.m_checkpointNodeMask;

        this.setArrowVisible();
        //设置星星数文本
        this.m_starText.value = this.m_starNum.toString();
    }

    /**
     * 点击返回按钮事件
     */
    private onBackClick(): void {
        Laya.Scene.open("main/CheckpointKindScene.scene");
    }

    /**
     * 点击向左箭头事件
     */
    private onLeftArrowClick(): void {
        if (this.m_selectPageIndex <= 0) { return; }
        if (!this.m_isArrowClick) { return; }
        this.selectCheckpointPage(CheckpointSelectScene.SELECT_MOVE_DISTANCE);
    }

    /**
     * 点击向右箭头事件
     */
    private onRightArrowClick(): void {
        if (this.m_selectPageIndex >= this.m_checkpointPageNum - 1) { return; }
        if (!this.m_isArrowClick) { return; }
        this.selectCheckpointPage(-CheckpointSelectScene.SELECT_MOVE_DISTANCE);
    }

    private selectCheckpointPage(moveNum: number): void {
        let node = this.m_checkpointNode;
        this.m_isArrowClick = false;

        Laya.Tween.to(node, { x: node.x + moveNum, y: node.y }, 500, Laya.Ease.linearNone, Laya.Handler.create(this, function () {
            this.m_isArrowClick = true;
            if (moveNum < 0) { this.m_selectPageIndex++; }
            else if (moveNum > 0) { this.m_selectPageIndex--; }
            this.setArrowVisible();
        }), 0, false);
        Laya.Tween.to(this.m_checkpointNodeMask, { x: this.m_checkpointNodeMask.x - moveNum, y: this.m_checkpointNodeMask.y }, 500, Laya.Ease.linearNone);
    }

    /**
     * 设置左右箭头的隐藏
     */
    private setArrowVisible(): void {
        if (this.m_selectPageIndex <= 0) { this.m_leftArrow.visible = false; }
        else { this.m_leftArrow.visible = true; }
        if (this.m_selectPageIndex >= this.m_checkpointPageNum - 1) { this.m_rightArrow.visible = false; }
        else { this.m_rightArrow.visible = true; }
    }
}