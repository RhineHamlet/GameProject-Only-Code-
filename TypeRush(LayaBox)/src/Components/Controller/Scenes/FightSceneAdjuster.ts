import FightScene from "./FightScene";
import { ElementInfo, EnemyInfo, GameMode } from "../../../GlobalData/DataStruct";
import ElementManager from "../Elements/ElementManager";
import DC from "../../../GlobalData/DataCenter";
import CSysUtils from "../../../Helper/SysUtils";
import FightEnemy from "../../Data/FightEnemy";
import DataConfig from "../../../GlobalData/DataConfig";
import DT from "../../../GlobalData/DataConst";

/*
    游戏场景调节器(控制相关元素是否显示，已经创建一些子对象)
*/
export default class FightSceneAdjuster extends Laya.Script {

    public static JSON_ELE_PARAMS = "config/elment_param.json";
    public static JSON_ROAD_LIST = "config/road_list.json";
    public static JSON_ROAD_ENEMY = "config/road_enemy.json";

    public static isJsonLoaded = false;

    public curRoadIndex: number = -1;                       //当前使用路线索引(每次加载随机一个路线)
    public m_sceneCtrl: FightScene;

    constructor() {
        super();
    }

    onStart() {
        DC.gameMode = GameMode.BO_LE_MA;

        this.m_sceneCtrl = this.owner.getComponent(FightScene);

        if (FightSceneAdjuster.isJsonLoaded) {
            this.selectPathAndInitData();
        }

        if (!FightSceneAdjuster.isJsonLoaded) {
            //加载配置脚本
            let LOAD_ARY = [FightSceneAdjuster.JSON_ELE_PARAMS, FightSceneAdjuster.JSON_ROAD_LIST, FightSceneAdjuster.JSON_ROAD_ENEMY];
            Laya.loader.load(LOAD_ARY, Laya.Handler.create(this, this.onJsonLoaded), null);
            FightSceneAdjuster.isJsonLoaded = true;
        }
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
        this.initElementParams();
        this.initRoadList();
        this.initRoadEnemyList();

        this.selectPathAndInitData();
    }

    /** 生成随机路径 */
    private createRandomPath(): void {

        this.curRoadIndex = CSysUtils.GetRandomInt(0, DataConfig.availRoadList.length - 1);
        DC.curMapIndex = this.curRoadIndex;
        DC.isLoadImg = true;
        let selRoad = DataConfig.availRoadList[this.curRoadIndex];

        for (let i = 0; i <= selRoad.length - 1; i++) {
            if (selRoad[i].isFunctionality)
                continue;

            //80%概率产生怪物
            if (selRoad[i].isOutEnemy == true) {
                if (CSysUtils.GetRandomInt(1, 100) <= 20)
                    selRoad[i].isOutEnemy = false;
            }
        }
    }

    /**
    * 创建单条路径
    * @param ary 
    */
    private createSingleRoad(ary) {
        let ret = new Array();
        for (var i = 0; i < ary.length; i++) {
            let it = DataConfig.elementParams[ary[i]];
            if (it != null) {
                ret.push(CSysUtils.DeepCopy(it));
            }
        }
        return ret;
    }


    /**
     * 产生路径附加的怪物
     * @param roadIdx 路径索引
     */
    private createRoadEnemys(roadIdx: number): void {
        if (roadIdx >= DataConfig.roadEnemyList.length)
            return;

        let enemyDatas = DataConfig.roadEnemyList[roadIdx];
        if (enemyDatas == null)
            return;

        enemyDatas.forEach(element => {
            //构造怪物信息
            let enemyInfo = new EnemyInfo();
            enemyInfo.startPointX = [element[2], element[3]];
            enemyInfo.startPosY = element[4];
            enemyInfo.resId = element[0];
            enemyInfo.runSpeed = element[1];
            enemyInfo.hp = CSysUtils.GetRandomInt(element[5], element[6]);
            enemyInfo.attackSpeed = element[7];
            enemyInfo.reviveSecs = element[8];
            enemyInfo.critSecs = element[9];
            enemyInfo.weakSecs = element[10];

            //创建怪物并加入场景
            let newEnemy = new FightEnemy(enemyInfo, this.m_sceneCtrl);
            DC.mapNode.addChild(newEnemy);

            //场景管理器记录怪物
            this.m_sceneCtrl.addEnemy(newEnemy);

            //怪物调整位置
            newEnemy.adjustPos();
        });
    }

    /**
     * 初始化元素配置信息
     */
    private initElementParams(): void {
        let r = DataConfig.elementParams;
        let json: Array<ElementInfo> = Laya.loader.getRes(FightSceneAdjuster.JSON_ELE_PARAMS) as Array<ElementInfo>;
        json.forEach(em => {
            r[em.name] = new ElementInfo(em.name, em.width, em.needCreateEnemy, em.haveExtFunc, em.enemyDatas);
        });
    }

    /**
     * 初始化路径列表
     */
    private initRoadList(): void {
        let r = DataConfig.availRoadList;
        let json: Array<any> = Laya.loader.getRes(FightSceneAdjuster.JSON_ROAD_LIST) as Array<any>;
        json.forEach(element => {
            r.push(this.createSingleRoad(element));
        });
    }

    /**
     * 初始化路径附带的怪物
     */
    private initRoadEnemyList(): void {
        let r = DataConfig.roadEnemyList;
        let json: Array<any> = Laya.loader.getRes(FightSceneAdjuster.JSON_ROAD_ENEMY) as Array<any>;
        json.forEach(element => {
            r.push(element.enemyDatas);
        });
    }

    /**
     * 选择路径并初始化数据
     */
    private selectPathAndInitData(): void {
        //创建随机路径
        this.createRandomPath();

        //延时100毫秒创建场景内部元素
        this.AdjustAllElement(DataConfig.availRoadList[this.curRoadIndex]);

        //创建线路相关怪物
        this.createRoadEnemys(this.curRoadIndex);
    }

    /**
     * 调整所有元素对象
     * @param emAry 元素信息数组
     */
    public AdjustAllElement(emAry: ElementInfo[] = []): void {

        let toDeleteAry: Laya.Sprite[] = [];

        //遍历每个子元素，调整和创建子对象
        this.m_sceneCtrl.elments.forEach(ele => {

            let isFind = false;
            for (let j = 0; j < emAry.length; j++) {
                if (ele.name == emAry[j].name) {
                    (ele.getComponent(ElementManager) as ElementManager).createEnemy(emAry[j]);
                    isFind = true;
                    break;
                }
            }

            if (!isFind) {
                toDeleteAry.push(ele);
            }
        });

        //将需要删除的对象正式删除
        toDeleteAry.forEach(element => {
            element.destroy(true);
        });
    }
}