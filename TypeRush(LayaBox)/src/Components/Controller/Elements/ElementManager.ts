import FightScene from "../Scenes/FightScene";
import FightEnemy from "../../Data/FightEnemy";
import CSysUtils from "../../../Helper/SysUtils";
import { ElementInfo, EnemyInfo } from "../../../GlobalData/DataStruct";
import DC from "../../../GlobalData/DataCenter";

/*
    元素对象管理
*/
export default class ElementManager extends Laya.Script {

    public m_sceneCtrl: FightScene;       //场景控制器

    constructor() {
        super();
    }

    /**
	 *  创建怪物对象
	 * @param emInfo	怪物信息
	 */
    public createEnemy(emInfo: ElementInfo): void {
        if (emInfo.needCreateEnemy) {
            let sprOwner: Laya.Sprite = this.owner as Laya.Sprite;

            //设置怪物起始点(50%概率反向走动)
            let startX = sprOwner.x + 30;
            let endX = sprOwner.x + sprOwner.width - 30;
            let backMove = CSysUtils.GetRandomInt(1, 2) != 1;

            //构造怪物信息
            let enemyInfo = new EnemyInfo();
            enemyInfo.startPointX = (backMove ? [endX, startX] : [startX, endX]);
            enemyInfo.startPosY = sprOwner.y;
            enemyInfo.resId = emInfo.enemyDatas[0];
            enemyInfo.runSpeed = emInfo.enemyDatas[1];
            enemyInfo.hp = CSysUtils.GetRandomInt(emInfo.enemyDatas[2], emInfo.enemyDatas[3]);
            enemyInfo.attackSpeed = emInfo.enemyDatas[4];
            enemyInfo.reviveSecs = emInfo.enemyDatas[5];
            enemyInfo.critSecs = emInfo.enemyDatas[6];
            enemyInfo.weakSecs = emInfo.enemyDatas[7];

            //创建怪物并加入场景
            let newEnemy = new FightEnemy(enemyInfo, this.m_sceneCtrl);
            DC.mapNode.addChild(newEnemy);

            //场景管理器记录怪物
            this.m_sceneCtrl.addEnemy(newEnemy);

            //怪物调整位置
            newEnemy.adjustPos();
        }
    }

    onEnable() {
        this.m_sceneCtrl = this.owner.scene.getComponent(FightScene);

        //将元素对象加入到主场景管理器
        this.m_sceneCtrl.addElement(this.owner as Laya.Sprite);
    }
}