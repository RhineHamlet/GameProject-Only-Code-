using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
/*UI管理器*/
public class UIManager : MonoBehaviour
{
    //脚本单例对象
    public static UIManager _getInstance;
    public GameObject systemMenu;
    public GameObject backPackView;
    public GameObject save;
    public GameObject setting;
    public GameObject itemInfo;
    public Text itemText;
    public GameObject option;
    public Text optionText;
    public Text optionTextB;
    public GameObject message;
    public Text messageText;
    public GameObject[] mapFog;
    public GameObject newbie;
    public GameObject death;
    public Animator left;

    private void Awake()
    {
        _getInstance = this;
    }
    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        //按键打开或关闭系统菜单
        if (Input.GetKeyDown(KeyCode.X) || Input.GetKeyDown(KeyCode.Escape))
        {
            if (GameManager._getInstance.GetGameState() == 3) return;
            if (!systemMenu.activeInHierarchy && !itemInfo.activeInHierarchy && !option.activeInHierarchy) 
            {
                AudioManager._audioManager.PlaySound("s003cur");
                SelectController._getInstance.SelectMemu(0);
                systemMenu.SetActive(true);
                GameManager._getInstance.SetGameState(1);
                if (backPackView.activeInHierarchy)
                {
                    CloseItemList(0);
                }
                else if (save.activeInHierarchy)
                {
                    CloseSaveView(0);
                }
                else if (setting.activeInHierarchy)
                {
                    CloseSetting();
                }
            }
            else
            {
                systemMenu.SetActive(false);
                GameManager._getInstance.SetGameState(0);
                AudioManager._audioManager.PlaySound("mv_Cursor1");
            }
            //按键关闭物品信息显示和选项
            if(itemInfo.activeInHierarchy)
            {
                CloseItemInfo();
                AudioManager._audioManager.PlaySound("mv_Cursor1");
            }
            if (option.activeInHierarchy)
            {
                CloseOption();
                AudioManager._audioManager.PlaySound("mv_Cursor1");
            }
            if (message.activeInHierarchy)
            {
                OpenOrCloseMessage();
                AudioManager._audioManager.PlaySound("mv_Cursor1");
            }
        }
        //按键打开不同的菜单
        if (Input.GetKeyDown(KeyCode.Z) && systemMenu.activeInHierarchy)
        {
            SelectController._getInstance.SelectType();
            AudioManager._audioManager.PlaySound("s003cur");
        }
    }

    public void OpenItemList()     //打开物品栏
    {
        ItemManager._getInstance.FirstSelectItem();
        if (!backPackView.activeInHierarchy && systemMenu.activeInHierarchy) 
        {
            backPackView.SetActive(true);
            systemMenu.SetActive(false);
        }
    }

    public void CloseItemList(int type)    //关闭物品栏
    {
        if (backPackView.activeInHierarchy)
        {
            if(type == 0)
            {
                backPackView.SetActive(false);
                systemMenu.SetActive(true);
                SelectController._getInstance.SelectMemu(0);
            }
            else if(type == 1)
            {
                backPackView.SetActive(false);
            }
        }
    }  
 
    public void OpenSaveView()     //打开存档界面
    {
        if (!save.activeInHierarchy)
        {
            save.SetActive(true);
            systemMenu.SetActive(false);
        }
    }

    public void CloseSaveView(int type)    //关闭存档界面
    {
        if (save.activeInHierarchy)
        {
            if (type == 0)
            {
                save.SetActive(false);
                systemMenu.SetActive(true);
                SelectController._getInstance.SelectMemu(1);
            }
            else if(type == 1)
            {
                save.SetActive(false);
            }
        }
    }

    public void OpenSetting()      //打开设置栏
    {
        if (!setting.activeInHierarchy && systemMenu.activeInHierarchy)
        {
            setting.SetActive(true);
            systemMenu.SetActive(false);
            AudioManager._audioManager.IsActive = true;
        }
    }

    public void CloseSetting()     //关闭设置栏
    {
        if (setting.activeInHierarchy)
        {
            setting.SetActive(false);
            systemMenu.SetActive(true);
            SelectController._getInstance.SelectMemu(2);
            AudioManager._audioManager.IsActive = false;
        }
    }


    public void OpenItemInfo()     //打开物品信息对话框
    {
        if (!itemInfo.activeInHierarchy)
        {
            itemInfo.SetActive(true);
            GameManager._getInstance.SetGameState(1);
        }
    }

    public void CloseItemInfo()    //关闭物品信息对话框
    {
        if (itemInfo.activeInHierarchy)
        {
            itemInfo.SetActive(false);
            GameManager._getInstance.SetGameState(0);
        }
    }

    public void OpenOption()       //打开选项信息
    {
        if (!option.activeInHierarchy)
        {
            option.SetActive(true);
            SelectController._getInstance.SelectMemu(3);
            GameManager._getInstance.SetGameState(1);
        }
    }

    public void CloseOption()      //关闭选项信息
    {
        if (option.activeInHierarchy)
        {
            option.SetActive(false);
            SelectController._getInstance.SelectMemu(4);
            GameManager._getInstance.SetGameState(0);
        }
    }

    public void OpenOrCloseMessage() //打开或关闭讯息
    {
        if (message.activeInHierarchy)
        {
            message.SetActive(false);
            ItemController._getItem.PlayAnimation("讯息", true);
            AudioManager._audioManager.PlaySound("p004hasami");
            GameManager._getInstance.SetGameState(0);
        }
        else
        {
            message.SetActive(true);
            GameManager._getInstance.SetGameState(1);
        }
    }

    public void ShowItemInfo(GameObject item,int type)//物品信息文本0表示物品自带说明
    {
        if(type == 0)
        {
            itemText.text = item.GetComponent<ItemController>().GetItemInfo();
        }
        else
        {
            itemText.text = "得到了" + item.GetComponent<ItemController>().GetItemInfo();
        }
    }

    public void ShowItemInfo(int type)   //物品信息文本
    {
        switch (type)
        {
            case 0:
                itemText.text = "这里有一把生锈的砍刀";
                break;
            case 1:
                itemText.text = "得到了砍刀";
                break;
            case 2:
                itemText.text = "道路通了，砍刀损坏了";
                break;
            case 3:
                itemText.text = "泰迪熊倚靠在堆积如山的礼物盒上";
                break;
            case 4:
                itemText.text = "得到了泰迪熊的身体";
                break;
            case 5:
                itemText.text = "把泰迪熊的身体塞进篮子里。" + "某处传来开锁的声音";
                break;
            case 6:
                itemText.text = "泰迪熊的手脚掉在地上";
                break;
            case 7:
                itemText.text = "得到了银汤勺";
                break;
            case 8:
                itemText.text = "放到汤里的汤勺，变成了黑色" + "某处传来开锁的声音";
                break;
            case 9:
                itemText.text = "桶子里有条绳子";
                break;
            case 10:
                itemText.text = "得到了蝴蝶";
                break;
            case 11:
                itemText.text = "玻璃柜很牢固，没有办法打开";
                break;
            case 12:
                itemText.text = "把书塞了进去。\n能听到玻璃柜盖子脱落的声音。";
                break;
            case 13:
                itemText.text = "得到了蝴蝶模型";
                break;
            case 14:
                itemText.text = "蝴蝶模型被挂在蜘蛛网上";
                break;
            case 15:
                itemText.text = "蝴蝶从手心飞起，\n穿过墙壁的缝隙飞走了";
                break;
            case 16:
                itemText.text = "保存游戏成功";
                break;
        }
    }

    public void ShowOptionInfo(int type)  //选项信息文本
    {
        switch (type)
        {
            case 0:
                optionText.text = "拿走";
                optionTextB.text = "什么也不做";
                break;
            case 1:
                optionText.text = "砍断蔷薇";
                optionTextB.text = "还是算了";
                break;
            case 2:
                optionText.text = "剪掉熊的手脚";
                optionTextB.text = "什么都不做";
                break;
            case 3:
                optionText.text = "放进篮子里";
                optionTextB.text = "什么也不做";
                break;
            case 4:
                optionText.text = "阅读";
                optionTextB.text = "不阅读";
                break;
            case 5:
                optionText.text = "把熊的手脚给他";
                optionTextB.text = "什么也不做";
                break;
            case 6:
                optionText.text = "把汤勺放进汤里";
                optionTextB.text = "什么也不做";
                break;
            case 7:
                optionText.text = "搭话";
                optionTextB.text = "什么也不做";
                break;
            case 8:
                optionText.text = "把绳子给他";
                optionTextB.text = "不给";
                break;
            case 9:
                optionText.text = "把书塞进去";
                optionTextB.text = "什么也不做";
                break;
            case 10:
                optionText.text = "把蝴蝶模型挂上去";
                optionTextB.text = "什么也不做";
                break;
            case 11:
                optionText.text = "确定";
                optionTextB.text = "放弃";
                break;
        }
    }

    public void ShowMessageInfo(GameObject item) //讯息文本
    {
        messageText.text = item.GetComponent<ItemController>().GetItemInfo();
    }

    public void ShowBookInfo(int type)//书本文本
    {
        if(type == 0)
        {
            messageText.text =
                "这是很久以前的故事。\n" +
                "位处统治阶级，富裕阶层的人们非常喜欢使用银质餐具。\n"+
                "透过这些难以保养的银质餐具，向世间展示足以雇佣下人的经济实力。\n"+
                "另外，银质餐具遇毒会产生颜色上的变化，有防止被毒杀的作用。";
        }
    }

    public void DialogInfo(int type)//对话框文本
    {
        switch (type)
        {
            case 0:
                itemText.text = "???\n"+"[啊啊，书本整理得真是不顺利啊呀。\n有没有什么 可以用来捆绑的东西吗...。]";
                break;
            case 1:
                itemText.text = "???\n" + "[啊，要把那个给我吗？]";
                break;
            case 2:
                itemText.text = "???\n" + "[谢谢。...这个给你]";
                break;
        }
    }

    public void CloseMapFog()//关闭mapfog组件
    {
        if (mapFog == null) return;
        for (int i = 0; i < mapFog.Length; i++) 
        {
            mapFog[i].SetActive(false);
        }
    }

    public void OpenMapFog(int type)//开启mapfog组件
    {  
        switch (type)
        {
            case 0:
                mapFog[0].SetActive(true);
                break;
            case 1:
                CloseMapFog();
                mapFog[1].SetActive(true);
                break;
            case 2:
                mapFog[2].SetActive(true);
                break;
        }
    }

    public void CloseNewBie()
    {
        if (newbie.activeInHierarchy)
            newbie.SetActive(false);
    }

    public void OpenOrCloseDeath()
    {
        if (death.activeInHierarchy)
        {
            death.SetActive(false);
        }
        else
        {
            death.SetActive(true);
        }
    }

    public void ReturnMainMenu()
    {
        GameManager._getInstance.ReturnMenuFromGameScene();
    }

    public void IsAnimaOver(Animator animator)
    {
        if (animator.enabled == false) return;
        AnimatorStateInfo info = animator.GetCurrentAnimatorStateInfo(0);
        // 判断动画是否播放完成
        if (info.normalizedTime >= 1.0f)
        {
            CloseMapFog();
            OpenOrCloseDeath();
        }
    }
}
