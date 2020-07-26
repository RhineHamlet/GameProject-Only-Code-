import ElementCommodity from "./Elements/ElementCommodity";
import DC from "../../../GlobalData/DataCenter";
import DT from "../../../GlobalData/DataConst";
import { CommodityInfo, CurrencyKind } from "../../../GlobalData/DataStruct";

export default class StoreScene extends Laya.Script {

    /** @prop {name:Commodity,tips:"商品",type:Prefab}*/
    Commodity: Laya.Prefab;

    private static KIND_NUM: number = 3;                        //商品种类的数量

    private m_listAry: Array<Laya.List> = [];                   //商品list数组
    private m_sortTab: Laya.Tab;                                //选择商品种类tab
    private m_back: Laya.Button;                                //返回按钮

    private m_commodityInfoBox: Laya.Image;                     //商品信息窗口
    private m_determineBuy: Laya.Button;                        //确认购买
    private m_cancelBuy: Laya.Button;                           //取消购买
    private m_numClip: Laya.FontClip;                           //购买数量
    private m_moneyLab: Laya.Label;                             //需要钱的数额
    private m_moneyKindImg: Laya.Image;                         //钱的种类
    private m_numSlider: Laya.HSlider;                          //滑动条
    private m_commodityImg: Laya.Image;                         //商品图片
    private m_selectCommodityPrice: number;                     //选择商品的单价

    private m_selectKindIndex: number;                          //选择种类索引

    private m_isClickSlider: boolean;                           //是否点击滑动条
    private m_isOpenInfoBox: boolean;                           //是否打开商品信息窗口

    constructor() { super(); }

    onEnable(): void {
        this.initData();
        this.initParams();
        this.initUI();

        this.m_sortTab.on(Laya.Event.CLICK, this, this.onSelectSort);
        this.m_determineBuy.on(Laya.Event.CLICK, this, this.onDetermineBuy);
        this.m_cancelBuy.on(Laya.Event.CLICK, this, this.onCancelBuy);
        this.m_back.on(Laya.Event.CLICK, this, this.onBack);
    }

    onDisable(): void {
        this.m_sortTab.off(Laya.Event.CLICK, this, this.onSelectSort);
        this.m_determineBuy.off(Laya.Event.CLICK, this, this.onDetermineBuy);
        this.m_cancelBuy.off(Laya.Event.CLICK, this, this.onCancelBuy);
        this.m_back.off(Laya.Event.CLICK, this, this.onBack);
    }

    onStageMouseDown(e: Laya.Event) {
        // 点中目标是否为slider
        if (e.target as Laya.HSlider) {
            this.m_isClickSlider = true;
        }
    }

    onStageMouseMove() {
        if (this.m_isClickSlider) {
            this.m_numClip.value = this.m_numSlider.value.toString();

            this.m_moneyLab.text = (this.m_numSlider.value * this.m_selectCommodityPrice).toString();
        }
    }

    private initData(): void {
        this.m_selectKindIndex = 0;
        this.m_selectCommodityPrice = 0;
        this.m_isClickSlider = false;
        this.m_isOpenInfoBox = false;
        StoreScene.KIND_NUM = DC.commodityListAry.length;
    }

    private initParams(): void {
        this.m_commodityInfoBox = this.owner.getChildByName("commodity_info") as Laya.Image;
        this.m_determineBuy = this.m_commodityInfoBox.getChildByName("determine_buy") as Laya.Button;
        this.m_cancelBuy = this.m_commodityInfoBox.getChildByName("cancel_buy") as Laya.Button;
        this.m_numClip = this.m_commodityInfoBox.getChildByName("num_clip") as Laya.FontClip;
        this.m_moneyLab = this.m_commodityInfoBox.getChildByName("money_lab") as Laya.Label;
        this.m_moneyKindImg = this.m_commodityInfoBox.getChildByName("money_kind") as Laya.Image;
        this.m_numSlider = this.m_commodityInfoBox.getChildByName("slider") as Laya.HSlider;
        this.m_commodityImg = this.m_commodityInfoBox.getChildByName("img") as Laya.Image;

        this.m_sortTab = this.owner.getChildByName("sort_tab") as Laya.Tab;
        this.m_back = this.owner.getChildByName("back") as Laya.Button;

        for (let i = 1; i <= StoreScene.KIND_NUM; i++) {
            let list = this.owner.getChildByName("list" + i) as Laya.List;

            if (list !== null) {
                this.m_listAry.push(list);
                list.renderHandler = new Laya.Handler(this, this.onRender, [i - 1]); // 渲染list
                list.mouseHandler = new Laya.Handler(this, this.onMouse, [i - 1]);
            }
        }
    }

    private initUI(): void {
        this.m_numSlider.value = 1;
        this.m_numClip.value = this.m_numSlider.value.toString();
        this.m_sortTab.labels = DT.COMMODITY_KIND;

        this.setCommodityKindPage();

        for (let i = 0; i < StoreScene.KIND_NUM; i++) {
            let data: Array<any> = [];
            for (let m = 0; m < DC.commodityListAry[i].length; m++) {
                let com = Laya.Pool.getItemByCreateFun("Commodity", this.Commodity.create, this.Commodity) as Laya.Sprite;
                data.push({ commodity: com });
            }
            this.m_listAry[i].array = data;
            this.m_listAry[i].refresh();
        }
    }

    /** 购买商品*/
    private onDetermineBuy(): void {
        this.m_commodityInfoBox.visible = false;
        this.m_sortTab.mouseEnabled = true;
        this.m_isOpenInfoBox = false;
    }

    /** 取消购买商品*/
    private onCancelBuy(): void {
        this.m_commodityInfoBox.visible = false;
        this.m_sortTab.mouseEnabled = true;
        this.m_isOpenInfoBox = false;
    }

    /** 返回主界面*/
    private onBack(): void {
        Laya.Scene.open("main/MainScene.scene");
    }

    /**
     * 渲染list
     * @param _index list索引
     * @param cell 单元格
     * @param index 单元格索引
     */
    private onRender(_index: number, cell: Laya.Box, index: number): void {
        let commodity: Laya.Image = cell.getChildAt(0) as Laya.Image;
        if (DC.commodityListAry[_index][index] != null) {
            (commodity.getComponent(ElementCommodity) as ElementCommodity).setUI(DC.commodityListAry[_index][index]);
        }
    }

    /** list单元格鼠标点击事件*/
    private onMouse(_index: number, e: Laya.Event, index: number) {
        if (this.m_isOpenInfoBox) {
            return;
        }
        // 事件类型是否为Event.CLICK
        if (e.type == Laya.Event.CLICK) {
            if (this.m_listAry[_index].getCell(index) != null) {
                let commodity: ElementCommodity = this.m_listAry[_index].getCell(index).getChildAt(0).getComponent(ElementCommodity);
                let info = commodity.getCommodityInfo();
                this.onUserLookCommodity(info);
            }
        }
    }

    /** 切换商品种类*/
    private onSelectSort(): void {
        this.setCommodityKindPage();
    }

    /**
     * 用户查看商品
     * @param info 
     */
    private onUserLookCommodity(info: CommodityInfo): void {
        this.m_commodityInfoBox.visible = true;
        this.m_sortTab.mouseEnabled = false;
        this.m_isOpenInfoBox = true;

        this.m_numSlider.value = 1;
        this.m_numClip.value = this.m_numSlider.value.toString();
        this.m_selectCommodityPrice = info.amount;
        this.m_moneyLab.text = (this.m_numSlider.value * this.m_selectCommodityPrice).toString();
        switch (info.currencyKind) {
            case CurrencyKind.GOLD:
                this.m_moneyKindImg.skin = DT.MONEY_IMG_KIND_ARY.gold;
                break;
            case CurrencyKind.GEM:
                this.m_moneyKindImg.skin = DT.MONEY_IMG_KIND_ARY.gem;
                break;
        }

        this.m_commodityImg.skin = info.picture_url;
    }

    /** 设置商品种类页面*/
    private setCommodityKindPage(): void {
        this.m_selectKindIndex = this.m_sortTab.selectedIndex;

        for (let i = 0; i < this.m_listAry.length; i++) {
            if (i == this.m_selectKindIndex) {
                this.m_listAry[i].visible = true;
            } else {
                this.m_listAry[i].visible = false;
            }
        }
    }
}