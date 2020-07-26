import DC from "../../../GlobalData/DataCenter";

export default class RankingScene extends Laya.Script {

    private m_back: Laya.Button;                                //返回按钮
    private m_rankingList: Laya.List;                           //排行榜list

    constructor() { super(); }

    onEnable(): void {
        this.initParams();
        this.initUI();


        this.m_back.on(Laya.Event.CLICK, this, this.onBack);
    }

    onDisable(): void {
        this.m_back.off(Laya.Event.CLICK, this, this.onBack);
    }

    /** 返回主界面*/
    private onBack(): void {
        Laya.Scene.open("main/MainScene.scene");
    }

    private initParams(): void {
        this.m_back = this.owner.getChildByName("back") as Laya.Button;
        this.m_rankingList = this.owner.getChildByName("ranking_list") as Laya.List;
    }

    private initUI(): void {
        this.m_rankingList.renderHandler = new Laya.Handler(this, this.onRender);
        this.m_rankingList.mouseHandler = new Laya.Handler(this, this.onMouse);

        let data: Array<any> = [];
        for (let m = 0; m < DC.hundredUserInfoAry.length; m++) {
            data.push({ img: {} });
        }
        this.m_rankingList.array = data;
        this.m_rankingList.refresh();
    }

    /**
     * 渲染list
     * @param cell 单元格
     * @param index 单元格索引
     */
    private onRender(cell: Laya.Box, index: number): void {
        let bg = cell.getChildByName("bg") as Laya.Image;
        let ranking_num = cell.getChildByName("ranking_num") as Laya.FontClip;
        let name_lab = cell.getChildByName("name_lab") as Laya.Label;
        let avatar = cell.getChildByName("avatar") as Laya.Image;

        let info = DC.hundredUserInfoAry[index];
        if (info != null) {
            if (index % 2 == 0 && bg != null) {
                bg.destroy(true);
            }
            ranking_num.value = (index + 1).toString();
            name_lab.text = info.name;
            avatar.skin = info.avatar_url;
        }
    }

    /** list单元格鼠标点击事件*/
    private onMouse(e: Laya.Event, index: number) {
        // 事件类型是否为Event.CLICK
        if (e.type == Laya.Event.CLICK) {

        }
    }
}