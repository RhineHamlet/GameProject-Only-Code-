import { CommodityInfo, CurrencyKind } from "../../../../GlobalData/DataStruct";
import DT from "../../../../GlobalData/DataConst";


export default class ElementCommodity extends Laya.Script {

    private m_amount: Laya.FontClip;                //价格
    private m_currencyImg: Laya.Image;              //货币image
    private m_picture: Laya.Image;                  //商品显示图片

    private m_currencyKind: CurrencyKind;           //货币种类

    private m_name: string;                         //商品名字
    private m_summary: string;                      //商品简介

    constructor() { super(); }

    onDisable(): void {

    }

    private initParams(): void {
        this.m_amount = this.owner.getChildByName("amount") as Laya.FontClip;
        this.m_currencyImg = this.owner.getChildByName("currency_kind") as Laya.Image;
        this.m_picture = this.owner.getChildByName("picture") as Laya.Image;
    }

    public setUI(info: CommodityInfo): void {
        if (this.m_amount == null) {
            this.initParams();
        }

        this.m_name = info.name;
        this.m_summary = info.summary;
        this.m_amount.value = info.amount.toString();
        this.m_currencyKind = info.currencyKind;
        this.m_picture.skin = info.picture_url;

        switch (this.m_currencyKind) {
            case CurrencyKind.GOLD:
                this.m_currencyImg.skin = DT.MONEY_IMG_KIND_ARY.gold;
                break;
            case CurrencyKind.GEM:
                this.m_currencyImg.skin = DT.MONEY_IMG_KIND_ARY.gem;
                break;
        }
    }

    /** 获取商品信息*/
    public getCommodityInfo(): CommodityInfo {
        return new CommodityInfo(Number(this.m_amount.value), this.m_currencyKind, this.m_picture.skin, this.m_name, this.m_summary);
    }
}