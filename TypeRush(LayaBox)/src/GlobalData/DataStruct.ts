
//地图构成元素基本属性
export class ElementInfo {

    public name: string;                        //名称
    public width: number;                       //宽度
    public needCreateEnemy: boolean;            //是否产生怪物
    public enemyDatas;                          //怪物数据
    public haveExtFunc: boolean;                //是否有附加功能

    constructor(name: string = "", width: number = 0, createEnemy: boolean = true, haveExtFunc: boolean = true, enemy_datas = null) {
        this.name = name;
        this.width = width;
        this.needCreateEnemy = createEnemy;
        this.enemyDatas = enemy_datas;
        this.haveExtFunc = haveExtFunc;
    }
}

/**
 * 怪物对象信息
 */
export class EnemyInfo {

    public startPointX: number[];       //路径点X数组(在不同X坐标来回走动)
    public startPosY: number;           //起始点Y
    public resId: number;               //资源代号
    public runSpeed: number;            //场景中的移动速度
    public hp: number;                  //血量
    public attackSpeed: number;         //攻击速度
    public reviveSecs: number;          //复活时间
    public critSecs: number;            //全力一击时间
    public weakSecs: number;            //虚弱攻击时间
}

export enum GameMode {
    BO_LE_MA,//伯乐码
    CHECKPOINT//冒险闯关
}

export enum ElementName {
    BOARD_MOVING,
    WIND
}

export enum CurrencyKind {
    GOLD,
    GEM
}
export enum PlayerState {
    IDLE,//站立
    FLY,//悬空
    RUN//跑
}

/** 商品信息*/
export class CommodityInfo {
    public amount: number;//价格
    public currencyKind: CurrencyKind;//币种
    public picture_url: string;//商品图片
    public name: string;
    public summary: string;
    constructor(amout: number, currencyKind: CurrencyKind, picture_url: string, name: string, summary: string) {
        this.amount = amout;
        this.currencyKind = currencyKind;
        this.picture_url = picture_url;
        this.name = name;
        this.summary = summary;
    }
}

/** 成就信息*/
export class AchievementInfo {
    public imagex: string;      //成就图片
    public loading: number;     //进度条
    public lableinfo: string;   //成就信息
    public lable: number;       //进度信息
    public rewardbtn: boolean;   //获取按钮

    constructor(imagex: string, loading: number, lableinfo: string, lable: number, rewardbtn: boolean) {
        this.imagex = imagex;
        this.loading = loading;
        this.lableinfo = lableinfo;
        this.lable = lable;
        this.rewardbtn = rewardbtn;
    }
}

//用户信息类
export class UserInfo {
    public name: string;
    public avatar_url: string;
    public gold_num: number;
    public gem_num: number;
    public goodsAry: Array<any>;
    public achievementAry: Array<any>
    constructor(name: string, avatar_url: string, gold_num: number, gem: number, goodsAry: Array<any>, achievementAry: Array<any> = []) {
        this.name = name;
        this.avatar_url = avatar_url;
        this.gold_num = gold_num;
        this.gem_num = gem;
        this.goodsAry = goodsAry;
        this.achievementAry = achievementAry;
    }
}