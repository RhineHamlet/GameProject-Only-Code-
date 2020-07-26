import { AchievementInfo } from "../../../../GlobalData/DataStruct";
import DC from "../../../../GlobalData/DataCenter";

export default class ElementAchievement extends Laya.Script {

    private m_img: Laya.Image;
    private m_loading: Laya.ProgressBar;
    private m_lableInfo: Laya.Label;
    private m_lable: Laya.Label;
    private m_rewardBtn: Laya.Button;

    constructor() { super(); }

    onEnable(): void {
        this.initParams();
        this.initData();
        this.initUI();
        this.initEvent();
    }

    onDisable(): void {
        this.finalizeEvent();
    }

    onUpdate(): void {

    }

    private initParams(): void {
        this.m_img = this.owner.getChildByName("image") as Laya.Image;
        this.m_loading = this.owner.getChildByName("loading") as Laya.ProgressBar;
        this.m_lableInfo = this.owner.getChildByName("lableinfo") as Laya.Label;
        this.m_lable = this.owner.getChildByName("lable") as Laya.Label;
        this.m_rewardBtn = this.owner.getChildByName("rewardbtn") as Laya.Button;
    }

    private initData(): void {
    }
    private initUI(): void {
    }
    private initEvent(): void {
    }
    private finalizeEvent(): void {
    }

    public setUI(info: AchievementInfo): void {
        this.m_img.skin = info.imagex;
        this.m_loading.value = info.loading / info.lable;
        this.m_lableInfo.text = info.lableinfo;
        this.m_lable.text = info.loading + "/" + info.lable;
        this.m_rewardBtn.disabled = info.rewardbtn;
    }

    public getCommodityInfo(): AchievementInfo {
        return new AchievementInfo(this.m_img.skin, this.m_loading.value, this.m_lableInfo.text, Number(this.m_lable.text), this.m_rewardBtn.disabled = true);
    }
}