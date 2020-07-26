import DC from "../../../GlobalData/DataCenter";
import { CommodityInfo } from "../../../GlobalData/DataStruct";

export default class BackpackScene extends Laya.Script {

    private m_back: Laya.Button;                                //返回按钮
    private m_summaryText: Laya.Text;                           //简介文本
    private m_nameLab: Laya.Label;                              //名字文本
    private m_numLab: Laya.Label;                               //数量文本
    private m_goodsList: Laya.List;                             //物品list

    constructor() { super(); }

    onEnable(): void {

        this.initParams();
        this.initUI();

        this.m_back.on(Laya.Event.CLICK, this, this.onBack);
    }

    onDisable(): void {

        this.m_back.off(Laya.Event.CLICK, this, this.onBack);
    }

    private initData(): void {

    }

    private initParams(): void {
        this.m_back = this.owner.getChildByName("back") as Laya.Button;
        this.m_summaryText = this.owner.getChildByName("summary") as Laya.Text;
        this.m_nameLab = this.owner.getChildByName("name_lab") as Laya.Label;
        this.m_numLab = this.owner.getChildByName("num_lab") as Laya.Label;
        this.m_goodsList = this.owner.getChildByName("goods_list") as Laya.List;
    }

    private initUI(): void {
        this.m_summaryText.text = "";
        this.m_nameLab.text = "";
        this.m_numLab.text = "";

        this.m_goodsList.renderHandler = new Laya.Handler(this, this.onRender);
        this.m_goodsList.mouseHandler = new Laya.Handler(this, this.onMouse);

        let data: Array<any> = [];
        for (let m = 0; m < DC.ownerUserInfo.goodsAry.length; m++) {
            data.push({ img: {} });
        }
        this.m_goodsList.array = data;
        this.m_goodsList.refresh();
    }

    /** 返回主界面*/
    private onBack(): void {
        Laya.Scene.open("main/MainScene.scene");
    }

    /**
     * 渲染list
     * @param cell 单元格
     * @param index 单元格索引
     */
    private onRender(cell: Laya.Box, index: number): void {
        let goods = cell.getChildByName("img") as Laya.Image;
        let info = DC.commodityListAry[DC.ownerUserInfo.goodsAry[index].kind][DC.ownerUserInfo.goodsAry[index].index];
        if (info != null) {
            goods.skin = info.picture_url;
        }
    }

    /** list单元格鼠标点击事件*/
    private onMouse(e: Laya.Event, index: number) {
        // 事件类型是否为Event.CLICK
        if (e.type == Laya.Event.CLICK) {
            if (this.m_goodsList.getCell(index) != null) {
                let info = DC.commodityListAry[DC.ownerUserInfo.goodsAry[index].kind][DC.ownerUserInfo.goodsAry[index].index];
                if (info != null) {
                    this.m_summaryText.text = info.summary;
                    this.m_nameLab.text = info.name;
                    this.m_numLab.text = DC.ownerUserInfo.goodsAry[index].num.toString();
                }
            }
        }
    }
}