import DC from "../../../GlobalData/DataCenter";
import DF from "../../../GlobalData/DataConfig";
import { EnemyInfo } from "../../../GlobalData/DataStruct";
import FightScene from "./FightScene";

export default class CheckpointAdventureScene extends Laya.Script {

    public m_sceneCtrl: FightScene;

    constructor() { super(); }

    onStart(): void {
        this.m_sceneCtrl = this.owner.getComponent(FightScene);

        let info;
        switch (DC.selectKindIndex) {
            case 1:
                info = DF.checkpointInfoList1[DC.selectCheckpointRelativeValue];
                break;
            case 2:
                info = DF.checkpointInfoList2[DC.selectCheckpointRelativeValue];
                break;
            case 3:
                info = DF.checkpointInfoList3[DC.selectCheckpointRelativeValue];
                break;
        }

        this.m_sceneCtrl.m_lowPos = info.low_point;

        this.initEnemy(info);
        this.initWord(info);
    }

    onDisable(): void {

    }

    private initEnemy(info: any): void {
        let enemy_info_list: Array<any> = info.enemy_info;

        enemy_info_list.forEach(element => {
            //构造怪物信息
            let enemyInfo = new EnemyInfo();
            enemyInfo.startPointX = element[0];
            enemyInfo.startPosY = element[1];
            enemyInfo.resId = element[2];
            enemyInfo.runSpeed = element[3];
            enemyInfo.hp = element[4];
            enemyInfo.attackSpeed = element[5];
            enemyInfo.reviveSecs = element[6];
            enemyInfo.critSecs = element[7];
            enemyInfo.weakSecs = element[8];
            this.m_sceneCtrl.createNewEnemy(enemyInfo);
        });
    }

    private initWord(info: any): void {
        DC.wordList = info.word;
    }
}