import DC from "../../../GlobalData/DataCenter";
import HttpReq from "../../../Helper/HttpReq";
import DT from "../../../GlobalData/DataConst";
import CSysUtils from "../../../Helper/SysUtils";
import { GameMode } from "../../../GlobalData/DataStruct";

export default class LoadScene extends Laya.Script {

    private MAIN_RES_ARY: Array<any> = [
        { url: "FZGJ/0.png", type: Laya.Loader.IMAGE },
        { url: "FZGJ/1.png", type: Laya.Loader.IMAGE },
        { url: "FZGJ/End.png", type: Laya.Loader.IMAGE },
        { url: "FZGJ/Forest_acceleration.png", type: Laya.Loader.IMAGE },
        { url: "FZGJ/bg.jpg", type: Laya.Loader.IMAGE },
        { url: "FZGJ/forest_floor.png", type: Laya.Loader.IMAGE },
        { url: "FZGJ/Forest_thorn1.png", type: Laya.Loader.IMAGE },
        { url: "Music/youxichangjing1BGM.mp3", type: Laya.Loader.SOUND },
        { url: "Music/zhandouchangjingBGM.mp3", type: Laya.Loader.SOUND },
        { url: "enemy_skin1/dead.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin1/dead.png", type: Laya.Loader.IMAGE },
        { url: "enemy_skin1/run.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin1/run.png", type: Laya.Loader.IMAGE },
        { url: "enemy_skin1/battle_attack.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin1/battle_attack.png", type: Laya.Loader.IMAGE },
        { url: "enemy_skin1/battle_be_attack.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin1/battle_be_attack.png", type: Laya.Loader.IMAGE },
        { url: "enemy_skin1/battle_idle.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin1/battle_idle.png", type: Laya.Loader.IMAGE },

        { url: "enemy_skin2/dead.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin2/dead.png", type: Laya.Loader.IMAGE },
        { url: "enemy_skin2/run.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin2/run.png", type: Laya.Loader.IMAGE },
        { url: "enemy_skin2/battle_attack.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin2/battle_attack.png", type: Laya.Loader.IMAGE },
        { url: "enemy_skin2/battle_be_attack.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin2/battle_be_attack.png", type: Laya.Loader.IMAGE },
        { url: "enemy_skin2/battle_idle.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin2/battle_idle.png", type: Laya.Loader.IMAGE },

        { url: "enemy_skin3/dead.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin3/dead.png", type: Laya.Loader.IMAGE },
        { url: "enemy_skin3/run.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin3/run.png", type: Laya.Loader.IMAGE },
        { url: "enemy_skin3/battle_attack.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin3/battle_attack.png", type: Laya.Loader.IMAGE },
        { url: "enemy_skin3/battle_be_attack.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin3/battle_be_attack.png", type: Laya.Loader.IMAGE },
        { url: "enemy_skin3/battle_idle.atlas", type: Laya.Loader.ATLAS },
        { url: "enemy_skin3/battle_idle.png", type: Laya.Loader.IMAGE },

        { url: "player_skin2/Idle.atlas", type: Laya.Loader.ATLAS },
        { url: "player_skin2/Idle.png", type: Laya.Loader.IMAGE },
        { url: "player_skin2/Jump.atlas", type: Laya.Loader.ATLAS },
        { url: "player_skin2/Jump.png", type: Laya.Loader.IMAGE },
        { url: "player_skin2/Run.atlas", type: Laya.Loader.ATLAS },
        { url: "player_skin2/Run.png", type: Laya.Loader.IMAGE },
        { url: "mainImage/main_BK.jpg", type: Laya.Loader.IMAGE },

        { url: "battle_scene/711.png", type: Laya.Loader.IMAGE },

        { url: "treasure_box/1_open.atlas", type: Laya.Loader.ATLAS },
        { url: "treasure_box/1_open.png", type: Laya.Loader.IMAGE },
        { url: "treasure_box/1_idle.atlas", type: Laya.Loader.ATLAS },
        { url: "treasure_box/1_idle.png", type: Laya.Loader.IMAGE },
        { url: "treasure_box/1_static.png", type: Laya.Loader.IMAGE },

        { url: "font/Consola.ttf", type: Laya.Loader.TTF },

        { url: "scene_image/reward_clip_num.png", type: Laya.Loader.IMAGE },
        { url: "main/MainScene.json", type: Laya.Loader.JSON },
        { url: "mainImage/Image2.png", type: Laya.Loader.IMAGE },
    ];

    private m_lbLoad: Laya.Label;
    private m_lbPercent: Laya.Label;
    private m_barLoad: Laya.ProgressBar;
    private m_lbVersion: Laya.Label;
    private m_loadIdx: number = 0;

    //构造函数
    constructor() { super(); }

    onEnable() {
        this.m_lbLoad = this.owner.getChildByName("loadText") as Laya.Label;
        this.m_lbPercent = this.owner.getChildByName("percentage") as Laya.Label;
        this.m_lbVersion = this.owner.getChildByName("ver") as Laya.Label;
        this.m_barLoad = this.owner.getChildByName("bar") as Laya.ProgressBar;

        this.m_lbVersion.text = "ver" + DT.VERSION_CODE;

        Laya.loader.load(this.MAIN_RES_ARY[this.m_loadIdx].url, Laya.Handler.create(this, this.onComplete), Laya.Handler.create(this, this.onProgress, null, false));
    }

    private onProgress(loadNum: number): void {
        this.m_lbPercent.text = "正在加载资源：" + (loadNum * 100).toFixed(0) + "% [" + (this.m_loadIdx + 1) + "/" + this.MAIN_RES_ARY.length + "]";
        this.m_barLoad.value = (this.m_loadIdx + 1) / this.MAIN_RES_ARY.length;
    }

    private onComplete(): void {
        this.m_loadIdx++;
        if (this.m_loadIdx >= this.MAIN_RES_ARY.length) {

            //读取伯乐码数据
            this.m_lbPercent.text = "正在读取数据：100%";
            this.getUserInfoFromBoleMa();

            return;
        }

        Laya.loader.load(this.MAIN_RES_ARY[this.m_loadIdx].url, Laya.Handler.create(this, this.onComplete), Laya.Handler.create(this, this.onProgress, null, false));
    }

    //从伯乐码读取用户信息和关卡信息
    private getUserInfoFromBoleMa(): void {
        let paramToken = CSysUtils.GetQueryString("token");
        let paramTimesId = CSysUtils.GetQueryString("timesId");

        paramToken = paramToken == null ? "" : paramToken;
        paramTimesId = paramTimesId == null ? "" : paramTimesId;
        if (paramToken == "" || paramTimesId == "") {
            paramToken = "8f885367d26286dd066bbfce8129b782003d1dcfbb8c8ae4084bd181d7550a5cd04e8f6be4945e528d72972384c9d26f";
            paramTimesId = "1275";
        }

        let http = new HttpReq();
        http.Get(DT.URL_HTTP_HOST + DT.URL_GAME_INFO + "?token=" + paramToken + "&timesId=" + paramTimesId, this, function (msg: any): void {
            if (msg.State == HttpReq.SUCC && msg.Data.Code == DT.RC_OK) {
                let retData: any = msg.Data.Data;
                DC.wordList = [];
                DC.wordListTime = [];
                retData.wordList.forEach(it => {
                    DC.wordList.push(it.wordName);
                    DC.wordListTime.push(it.standardUseTime);
                });

                //进入主场景
                DC.gameMode = GameMode.BO_LE_MA;
                Laya.Scene.open("main/FightScene.scene");

                console.log(retData);
            }
            else {
                console.log("http get data error");
                console.log(msg);
            }
        });
    }

}