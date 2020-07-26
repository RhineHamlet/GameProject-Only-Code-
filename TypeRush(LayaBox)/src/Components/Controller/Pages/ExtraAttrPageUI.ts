import DC from "../../../GlobalData/DataCenter";
import DT from "../../../GlobalData/DataConst";

/**
 * 附加属性界面
 */
export default class ExtraAttrPageUI extends Laya.Script {

    private m_arySpr: any = [];
    private m_aryFunc: any = [];

    constructor() {
        super();
    }

    onEnable() {
        this.initUI();

        this.m_arySpr[DT.ATTR_TYPE_SPEED_X] = this.owner.getChildByName("speed_x") as Laya.Sprite;
        this.m_arySpr[DT.ATTR_TYPE_SPEED_Y] = this.owner.getChildByName("speed_y") as Laya.Sprite;
        this.m_arySpr[DT.ATTR_TYPE_HP] = this.owner.getChildByName("hp") as Laya.Sprite;
        this.m_arySpr[DT.ATTR_TYPE_ATTACK] = this.owner.getChildByName("attack") as Laya.Sprite;
        this.m_arySpr[DT.ATTR_TYPE_JUMP_MULTI] = this.owner.getChildByName("jump_multi") as Laya.Sprite;

        this.m_aryFunc[DT.ATTR_TYPE_SPEED_X] = this.onIdleSpeedX;
        this.m_aryFunc[DT.ATTR_TYPE_SPEED_Y] = this.onIdleSpeedY
        this.m_aryFunc[DT.ATTR_TYPE_HP] = this.onIdleHp
        this.m_aryFunc[DT.ATTR_TYPE_ATTACK] = this.onIdleAttack
        this.m_aryFunc[DT.ATTR_TYPE_JUMP_MULTI] = this.onIdleJumpMulti;

        Laya.stage.on(DT.EVENT_ATTR_RENEW, this, this.onEventAttrReNew);
    }

    onDisable() {
        Laya.stage.offAll(DT.EVENT_ATTR_RENEW);
    }

    private initUI(): void {
        (this.owner as Laya.Sprite).pos(0,0);
    }

    private onIdleSpeedX(attrType: string, totalMSecs: number): void {
        this.drawMaskSprite(attrType, totalMSecs);
    }

    private onIdleSpeedY(attrType: string, totalMSecs: number): void {
        this.drawMaskSprite(attrType, totalMSecs);
    }

    private onIdleHp(attrType: string, totalMSecs: number): void {
        this.drawMaskSprite(attrType, totalMSecs);
    }    

    private onIdleAttack(attrType: string, totalMSecs: number): void {
        this.drawMaskSprite(attrType, totalMSecs);
    }
    
    private onIdleJumpMulti(attrType: string, totalMSecs: number): void {
        this.drawMaskSprite(attrType, totalMSecs);
    }

    /** 绘制遮罩对象 */
    private drawMaskSprite(attrType: string, totalMSecs: number): void {
        let Img = this.m_arySpr[attrType];
        let maskSpr = this.getMaskSprite(Img);

        maskSpr.name = (parseFloat(maskSpr.name) + (360 / totalMSecs) * 100).toString();
        maskSpr.graphics.clear();
        maskSpr.graphics.drawPie(Img.width / 2, Img.height / 2, Img.width / 2 - 4, 0, parseFloat(maskSpr.name), "0x000000");
        
        //计时结束
        if (parseFloat(maskSpr.name) >= 360) {
            Img.visible = false;

            if (attrType == DT.ATTR_TYPE_SPEED_X) DC.userSpeedDeltaX = 0;
            else if (attrType == DT.ATTR_TYPE_SPEED_Y) DC.userSpeedDeltaY = 0;
            else if (attrType == DT.ATTR_TYPE_HP) DC.userHpDelta = 0;
            else if (attrType == DT.ATTR_TYPE_ATTACK) DC.userAttackDelta = 0;
            else if (attrType == DT.ATTR_TYPE_JUMP_MULTI) {
                DC.userJumpMultiSecs = 0;
                Laya.stage.event(DT.EVENT_USER_JUMP_MULTI, ['off']);
            }

            maskSpr.destroy();
            Laya.timer.clear(this, this.m_aryFunc[attrType]);

            //调整一下位置
            this.adjustIconPos();
        }
    }

    /** 属性重置事件 */
    private onEventAttrReNew(attrType: string, attrVal: number, elapsedMsecs: number): void {
        let Img = this.m_arySpr[attrType];
        Img.visible = true;

        //先删除遮罩对象
        let oldMaskSpr = this.getMaskSprite(Img);
        if(oldMaskSpr != null)
            oldMaskSpr.removeSelf();

        //遮罩
        let maskSpr: Laya.Sprite = new Laya.Sprite();
        maskSpr.width = Img.width;
        maskSpr.height = Img.height;
        maskSpr.name = "0";
        maskSpr.alpha = 0.4;
        Img.addChild(maskSpr);

        //数字
        let txtNum = Img.getChildByName("num") as Laya.Text;
        txtNum.text = "+" + attrVal.toString();

        let func = this.m_aryFunc[attrType];
        if(func != null)
        {
            Laya.timer.clear(this, func);
            Laya.timer.loop(100, this, func, [attrType, elapsedMsecs]);
        }        
        
        //调整位置
        this.adjustIconPos();
    }

    onUpdate() {

    }

    //获取遮罩精灵对象
    private getMaskSprite(img: Laya.Sprite): Laya.Sprite {
        for (let i = 0; i < img.numChildren; i++) {
            if (img.getChildAt(i).name != "num") {
                return img.getChildAt(i) as Laya.Sprite;
            }
        }
        return null;
    }
    
    //调整图标位置
    private adjustIconPos(): void {
        let i = 0;
        for(let key in this.m_arySpr)
        {
            if (this.m_arySpr[key].visible) { 
                this.m_arySpr[key].x = 13 + i * 82;
                i++;
            }
        }
    }
}