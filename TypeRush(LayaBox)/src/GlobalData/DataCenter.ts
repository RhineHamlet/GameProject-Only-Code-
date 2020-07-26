import { ElementInfo, GameMode, CommodityInfo, AchievementInfo, CurrencyKind, UserInfo } from "./DataStruct";

/*
    数据中心存储类
*/
export default class DataCenter extends Laya.Script {

    public static isInitialized = false;               //初始化

    public static wordList: Array<string> = ["print", "int"];   //所有字符串数组
    public static wordListTime: Array<number> = [1000, 1000];    //所有字符数组时间

    public static isInBattle = false;                  //是否为战斗状态
    public static fightingEnemyIdx = 1;                //正在攻击的怪物索引
    public static fightEnemyResId: number = 1;         //正在攻击怪物的资源ID
    public static isOpeningTreasureBox = false;        //是否在宝箱开始过程中

    public static enemyHp = 100;                       //怪物目前血量
    public static enemyTotalHp = 100;                  //怪物总血量
    public static enemyAttackSpeed = 1;                //怪物的攻击频率

    public static userHp = 100;                        //主角现血量
    public static userTotalHp = 100;                   //主角总血量
    public static userHpDelta = 0;                     //主角血量增量
    public static userAttack = 20;                     //玩家的攻击力
    public static userSinkHurt = 10;                   //主角掉落后的伤害

    public static critSecs = 0;                        //暴击时间
    public static weakSecs = 0;                        //虚弱时间
    public static critSecDelta = 0;                    //增加暴击时间
    public static userSpeedDeltaX = 0;                 //玩家x的速度增量
    public static userSpeedDeltaY = 0;                 //玩家y的速度增量
    public static userAttackDelta = 0;                 //玩家攻击力增量
    public static userJumpMultiSecs = 0;               //玩家连续跳跃时间

    public static totalKillEnemyNum = 0;               //击杀怪物数量
    public static errorCharNum = 0;                    //总错误字符数
    public static validCharNum = 0;                    //总正确字符数
    public static totalUsedSecs = 0;                   //总使用时间(秒)

    public static dropTreasureBoxRate = 90;            //掉落宝箱的概率(百分比)
    public static isDropTreasureBox = false;           //是否掉落宝箱

    public static bgMusicName = "";                    //当前正在播放的背景音乐名称

    public static killEnemyNumTask: number = 0;         //任务中的杀怪物数
    public static indexTask: number = 0;                //任务索引

    public static curMapIndex: number = 0;              //当前地图索引
    public static isLoadImg: boolean = false;           //加载小地图图片

    public static mapNode: Laya.Sprite;                 //地图根节点
    public static uiNode: Laya.Sprite;                  //UI根节点

    public static selectKindIndex: number = 1;          //选择的资料片索引
    /**选择关卡的绝对值 */
    public static selectCheckpointAbsoluteValue: number = 0;
    /**选择关卡的相对值 */
    public static selectCheckpointRelativeValue: number = 0;
    //关卡信息
    public static checkpointAry: Array<Array<number>> =
        [
            [-1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1],
            [-2, -2, -2, -2, -1,
            -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1]
        ];
    public static gameMode: GameMode = GameMode.CHECKPOINT;    //游戏模式

    //商城商品种类
    public static commodityListAry: Array<Array<CommodityInfo>> =
        [
            [new CommodityInfo(500, CurrencyKind.GOLD, "mainImage/knapsackImage/Image10.png", "sssss", "nvnvnvnv"),
            new CommodityInfo(500, CurrencyKind.GOLD, "mainImage/knapsackImage/Image11.png", "sssss", "vnvsdfsdfsfadasew"),
            new CommodityInfo(500, CurrencyKind.GEM, "mainImage/knapsackImage/Image10.png", "sssss", "rsgregsregser")],

            [new CommodityInfo(500, CurrencyKind.GOLD, "mainImage/knapsackImage/Image10.png", "sssss", "ffsfsfsdfsfsfsfsfsfsdf"),
            new CommodityInfo(500, CurrencyKind.GOLD, "mainImage/knapsackImage/Image10.png", "sssss", "sdfsdafasdfadsfad"),
            new CommodityInfo(500, CurrencyKind.GOLD, "mainImage/knapsackImage/Image10.png", "sssss", "ffsfsfsdfsfsfsfsfsfsdf")],

            [new CommodityInfo(500, CurrencyKind.GOLD, "mainImage/knapsackImage/Image10.png", "sssss", "ffsfsfsdfsfsfsfsfsfsdf"),
            new CommodityInfo(500, CurrencyKind.GOLD, "mainImage/knapsackImage/Image10.png", "sssss", "sdgdsgdsgdfg"),
            new CommodityInfo(500, CurrencyKind.GOLD, "mainImage/knapsackImage/Image10.png", "sssss", "ffsfsfsdfsfsfsfsfsfsdf"),
            new CommodityInfo(500, CurrencyKind.GOLD, "mainImage/knapsackImage/Image10.png", "sssss", "ffsfsfsdfsfsfsfsfsfsdf")]
        ];
    //自身用户信息
    public static ownerUserInfo: UserInfo = new UserInfo("ddd", "", 10, 10,
        [
            { kind: 0, index: 0, num: 10 },
            { kind: 0, index: 1, num: 10 },
            { kind: 0, index: 2, num: 10 },
            { kind: 0, index: 2, num: 100 }
        ],
        [
            { progress: 0, notReceive: true },
            { progress: 0, notReceive: true },
            { progress: 11, notReceive: true },
            { progress: 0, notReceive: true },
            { progress: 0, notReceive: true },
            { progress: 0, notReceive: true },
            { progress: 0, notReceive: true },
            { progress: 0, notReceive: true }
        ]
    );
    //前一百名用户信息
    public static hundredUserInfoAry: Array<UserInfo> = [new UserInfo("ddd", "", 10, 10,
    [
        { kind: 0, index: 0, num: 10 },
        { kind: 0, index: 1, num: 10 },
        { kind: 0, index: 2, num: 10 },
        { kind: 0, index: 2, num: 100 }
    ],
    ),new UserInfo("fff", "", 10, 10,
    [
        { kind: 0, index: 0, num: 10 },
        { kind: 0, index: 1, num: 10 },
        { kind: 0, index: 2, num: 10 },
        { kind: 0, index: 2, num: 100 }
    ],
    ),new UserInfo("ggg", "", 10, 10,
    [
        { kind: 0, index: 0, num: 10 },
        { kind: 0, index: 1, num: 10 },
        { kind: 0, index: 2, num: 10 },
        { kind: 0, index: 2, num: 100 }
    ],
    ),new UserInfo("hhh", "", 10, 10,
    [
        { kind: 0, index: 0, num: 10 },
        { kind: 0, index: 1, num: 10 },
        { kind: 0, index: 2, num: 10 },
        { kind: 0, index: 2, num: 100 }
    ],
    [
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true }
    ]),new UserInfo("rrr", "", 10, 10,
    [
        { kind: 0, index: 0, num: 10 },
        { kind: 0, index: 1, num: 10 },
        { kind: 0, index: 2, num: 10 },
        { kind: 0, index: 2, num: 100 }
    ],
    [
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true }
    ]),new UserInfo("eee", "", 10, 10,
    [
        { kind: 0, index: 0, num: 10 },
        { kind: 0, index: 1, num: 10 },
        { kind: 0, index: 2, num: 10 },
        { kind: 0, index: 2, num: 100 }
    ],
    [
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true }
    ]),new UserInfo("www", "", 10, 10,
    [
        { kind: 0, index: 0, num: 10 },
        { kind: 0, index: 1, num: 10 },
        { kind: 0, index: 2, num: 10 },
        { kind: 0, index: 2, num: 100 }
    ],
    [
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true },
        {progress:0,notReceive:true }
    ])];

    public static AchievementInfoAry: Array<AchievementInfo> =
        [
            new AchievementInfo("mainImage/knapsackImage/Image10.png", 0, "完成", 10, true),
            new AchievementInfo("mainImage/knapsackImage/Image10.png", 0, "完成", 20, true),
            new AchievementInfo("mainImage/knapsackImage/Image10.png", 0, "完成", 11, true),
            new AchievementInfo("mainImage/knapsackImage/Image10.png", 0, "完成", 15, true),
            new AchievementInfo("mainImage/knapsackImage/Image10.png", 0, "完成", 16, true),
            new AchievementInfo("mainImage/knapsackImage/Image10.png", 0, "取消", 18, true),
            new AchievementInfo("mainImage/knapsackImage/Image10.png", 0, "完成", 14, true),
            new AchievementInfo("mainImage/knapsackImage/Image10.png", 0, "完成", 13, true)
        ];

    /** 构造函数 */
    constructor() {
        super();
    }

    onEnable(): void {
        if (!DataCenter.isInitialized) {
            Laya.SoundManager.autoReleaseSound = false;
            DataCenter.isInitialized = true;
        }
    }
}
