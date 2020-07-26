//数据中心
export default class CDataConst {
    public static VERSION_CODE = "1.1.1130.0";

    //返回结果代码
    public static RC_OK: number = 0;
    public static RC_UNKNOWN: number = -1;

    //URL地址常量
    //public static URL_HTTP_HOST: string = "http://test.bole.com";
    public static URL_HTTP_HOST: string = "http://www.net963.com/rush_game_server";

    public static URL_TEST: string = "/home/user/test";
    public static URL_LOGIN_BY_BOLEMA: string = "/home/user/LoginByBoleMa";
    public static URL_GAME_INFO = "/home/Bolema/GetGameInfo";

    //技能属性
    public static ATTR_TYPE_SPEED_X: string = "AttrTypeSpeedX";
    public static ATTR_TYPE_SPEED_Y: string = "AttrTypeSpeedY";
    public static ATTR_TYPE_HP: string = "AttrTypeHp";
    public static ATTR_TYPE_ATTACK: string = "AttrTypeAttack";
    public static ATTR_TYPE_JUMP_MULTI: string = "AttrTypeJumpMulti";

    //宝箱界面的显示层级
    public static ZORDER_TREASURE_BOX_OPEN: number = 100;

    //配置变量
    public static CFG_GRAVITY_SCALE = 10;                                           //系统配置重力
    public static CFG_JUMP_SPEED_INIT = 40;                                         //初始跳跃能力
    public static CFG_RUN_SPEED_INIT = 15;                                          //初始跑动速度
    public static CFG_KEY_MOVE_LEFT = 74;                                           //向左按键
    public static CFG_KEY_MOVE_RIGHT = 76;                                          //向右按键
    public static CFG_KEY_JUMP = 32;                                                //跳跃按键
    public static CFG_KEY_PAUSE = 27;                                               //暂停按键
    public static CFG_KEY_PICK_BOX = 70;                                            //捡取宝箱按键

    //Label
    public static LABEL_BC_PLAYER = "player";                                       //玩家标签
    public static LABEL_BC_FLOOR = "floor";                                         //地板标签
    public static LABEL_BC_TERMINAL = "terminalPoint";                              //终点

    //事件
    public static EVENT_ATTR_RENEW = "EventAttrReNew";                              //玩家附加属性重置
    public static EVENT_USER_JUMP_MULTI = "EventUserJumpMulti";                     //玩家零重力
    public static EVENT_USER_RESTORE_HP = "EventUserRestoreHp";                     //玩家恢复HP
    public static EVENT_USER_HP_CHANGE = "EventUserHpChange";                       //玩家HP变化
    public static EVENT_USER_GAIN_STAR = "EventUserGainStar";                       //获得星星
    public static EVENT_FIGHT_START = "EventFightStart";                            //战斗开始
    public static EVENT_FIGHT_END = "EventFightEnd";                                //战斗结束
    public static EVENT_KILL_ENEMY_NUM_CHANGE = "EventKillEnemyNumChange";          //击杀怪物数量改变
    public static EVENT_GAME_PAUSE = "EventGamePause";                              //游戏暂停
    public static EVENT_GAME_RESUME = "EventGameResume";                            //游戏继续
    public static EVENT_GAME_OVER = "EventGameOver";                                //游戏结束
    public static EVENT_GAME_AGAIN_START = "EventGameAgainStart";                   //游戏重新开始
    public static EVENT_PLAYER_POS_VARY = "EventPlayerPosVary";                     //人物位置变化
    public static EVENT_GAME_VICTORY = "EventGameVictory";                          //游戏胜利
    public static EVENT_SAVE_POS = "EventSavePos";                                  //保存位置
    public static EVENT_PLAYER_SINK = "EventPlayerSink";                            //人物掉落
    public static EVENT_PLAYER_STATE_VARY = "EventPlayerStateVary";                 //人物状态变化
    public static EVENT_PLAYER_STATE_VARY_FEEDBACK = "EventPlayerStateVaryFeedback";//人物状态变化的反馈
    public static EVENT_PLAYER_TOUCH_FLOOR = "EventPlayerTouchFloor";               //人物触摸地面
    public static EVENT_PLAYER_TOUCH_GROUND_THORN = "EventPlayerTouchGroundThorn";  //人物触摸地刺
    public static EVENT_PLAYER_TOUCH_SPRING = "EventPlayerTouchSpring";             //人物触摸弹簧
    public static EVENT_PLAYER_TOUCH_CONVEY_DOOR = "EventPlayerTouchConveyDoor";    //人物触摸传送门

    //图片地址
    public static MONEY_IMG_KIND_ARY = { gold: "mainImage/Image3.png", gem: "mainImage/Image4.png" };

    public static COMMODITY_KIND: string = "药水,装备,周边产品";
}