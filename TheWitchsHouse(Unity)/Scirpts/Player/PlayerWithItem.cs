using System.Collections;
using System.Collections.Generic;
using UnityEngine;
/*人物与道具交互脚本*/
public class PlayerWithItem : MonoBehaviour
{
    private GameObject item = null;
    private Animator animator;

    private void Start()
    {
        animator = GetComponent<Animator>();
    }
    // Update is called once per frame
    void Update()
    {
        //按键与地图上物品交互
        if (Input.GetKeyDown(KeyCode.Z) && !UIManager._getInstance.systemMenu.activeInHierarchy
            && !UIManager._getInstance.backPackView.activeInHierarchy)
        {
            if (item != null)
            {
                switch (item.name)
                {
                    case "star(Clone)":
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(0);
                        UIManager._getInstance.OpenOption();
                        UIManager._getInstance.ShowOptionInfo(0);
                        break;
                    case "rose":
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(item, 0);
                        break;
                    case "scrip01":
                        UIManager._getInstance.OpenOrCloseMessage();
                        if (UIManager._getInstance.message.activeInHierarchy)
                        {
                            GameManager._getInstance.SetPass(true);
                        }
                        break;
                    case "scrip02":
                        UIManager._getInstance.OpenOrCloseMessage();
                        UIManager._getInstance.ShowMessageInfo(item);
                        break;
                    case "bearbasket(Clone)":
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(item, 0);
                        break;
                    case "babybear(Clone)":
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(3);
                        UIManager._getInstance.OpenOption();
                        UIManager._getInstance.ShowOptionInfo(0);
                        break;
                    case "scissor":
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(item, 0);
                        break;
                    case "bearhand(Clone)":
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(6);
                        UIManager._getInstance.OpenOption();
                        UIManager._getInstance.ShowOptionInfo(0);
                        break;
                    case "scrip03":
                        UIManager._getInstance.OpenOrCloseMessage();
                        UIManager._getInstance.ShowMessageInfo(item);
                        break;
                    case "scrip04":
                        UIManager._getInstance.OpenOrCloseMessage();
                        UIManager._getInstance.ShowMessageInfo(item);
                        break;
                    case "BoneSoup(Clone)":
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(item, 0);
                        break;
                    case "book01":
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(item, 0);
                        UIManager._getInstance.OpenOption();
                        UIManager._getInstance.ShowOptionInfo(4);
                        break;
                    case "cook":
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(item, 0);
                        break;
                    case "scrip05":
                        UIManager._getInstance.OpenOrCloseMessage();
                        UIManager._getInstance.ShowMessageInfo(item);
                        break;
                    case "rope(Clone)":
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(9);
                        UIManager._getInstance.OpenOption();
                        UIManager._getInstance.ShowOptionInfo(0);
                        break;
                    case "goldbuffer(Clone)":
                        if (ItemManager._getInstance.IsItem("蝴蝶模型"))
                        {
                            UIManager._getInstance.OpenItemInfo();
                            UIManager._getInstance.ShowItemInfo(item, 0);
                            UIManager._getInstance.OpenOption();
                            UIManager._getInstance.ShowOptionInfo(0);
                        }
                        break;
                    case "Invisible":
                        if (!ItemManager._getInstance.IsItem("读了就会死的书"))
                        {
                            UIManager._getInstance.OpenItemInfo();
                            UIManager._getInstance.ShowItemInfo(item, 0);
                            UIManager._getInstance.OpenOption();
                            UIManager._getInstance.ShowOptionInfo(7);
                        }
                        else
                        {
                            UIManager._getInstance.OpenItemInfo();
                            UIManager._getInstance.ShowItemInfo(item, 0);
                        }
                        break;
                    case "case":
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(item, 0);
                        break;
                    case "glassLeft":
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(item, 0);
                        break;
                    case "buffer(Clone)":
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(item, 0);
                        UIManager._getInstance.OpenOption();
                        UIManager._getInstance.ShowOptionInfo(0);
                        break;
                    case "BlackCat":
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(item, 0);
                        UIManager._getInstance.OpenOption();
                        UIManager._getInstance.ShowOptionInfo(11);
                        break;
                }
            }
        }
        //按键与背包中物品交互
        else if (Input.GetKeyDown(KeyCode.Z) && UIManager._getInstance.backPackView.activeInHierarchy)
        {
            if (item != null)
            {
                switch (item.name)
                {
                    case "rose":
                        if (ItemManager._getInstance.GetSelectItemName() == "砍刀")
                        {
                            UIManager._getInstance.OpenOption();
                            UIManager._getInstance.ShowOptionInfo(1);
                        }
                        break;
                    case "scissor":
                        if (ItemManager._getInstance.GetSelectItemName() == "泰迪熊")
                        {
                            UIManager._getInstance.OpenOption();
                            UIManager._getInstance.ShowOptionInfo(2);
                        }
                        break;
                    case "bearbasket(Clone)":
                        if (ItemManager._getInstance.GetSelectItemName() == "泰迪熊的身体")
                        {
                            UIManager._getInstance.OpenOption();
                            UIManager._getInstance.ShowOptionInfo(3);
                        }
                        break;
                    case "cook":
                        if (ItemManager._getInstance.GetSelectItemName() == "泰迪熊的手脚")
                        {
                            UIManager._getInstance.OpenOption();
                            UIManager._getInstance.ShowOptionInfo(5);
                        }
                        break;
                    case "BoneSoup(Clone)":
                        if(ItemManager._getInstance.GetSelectItemName() == "银汤勺")
                        {
                            UIManager._getInstance.OpenOption();
                            UIManager._getInstance.ShowOptionInfo(6);
                        }
                        break;
                    case "Invisible":
                        if (ItemManager._getInstance.GetSelectItemName() == "绳子")
                        {
                            UIManager._getInstance.CloseItemList(1);
                            UIManager._getInstance.OpenItemInfo();
                            UIManager._getInstance.DialogInfo(1);
                            UIManager._getInstance.OpenOption();
                            UIManager._getInstance.ShowOptionInfo(8);
                            GameManager._getInstance.SetPass(true);
                        }
                        break;
                    case "case":
                        if(ItemManager._getInstance.GetSelectItemName() == "读了就会死的书")
                        {
                            UIManager._getInstance.OpenOption();
                            UIManager._getInstance.ShowOptionInfo(9);
                        }
                        break;
                    case "crash(trigger)":
                        if(ItemManager._getInstance.GetSelectItemName() == "蝴蝶模型")
                        {
                            UIManager._getInstance.OpenOption();
                            UIManager._getInstance.ShowOptionInfo(10);
                        }
                        break;
                }
            }
        }
        //确认键交互
        else if (Input.GetKeyDown(KeyCode.Q) && UIManager._getInstance.option.activeInHierarchy)
        {
            if (!SelectController._getInstance.IsSelectOption())
            {
                UIManager._getInstance.CloseItemInfo();
                UIManager._getInstance.CloseOption();
            }
            if (SelectController._getInstance.IsSelectOption())
            {
                UIManager._getInstance.CloseItemInfo();
                UIManager._getInstance.CloseOption();
                switch (item.name)
                {
                    case "star(Clone)":
                        UIManager._getInstance.ShowItemInfo(1);
                        UIManager._getInstance.OpenItemInfo();
                        GameManager._getInstance.StoreItemInfo(item);
                        GameManager._getInstance.ChangeItem(0, item);
                        GameManager._getInstance.SetItemActive(0, false);
                        AudioManager._audioManager.PlaySound("f_item");
                        break;
                    case "rose":
                        GameManager._getInstance.ChangeItem(1, item);
                        GameManager._getInstance.ChangeItem(2, item);
                        GameManager._getInstance.DeleteItemInfo("砍刀");
                        UIManager._getInstance.CloseItemList(1);
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(2);
                        AudioManager._audioManager.PlaySound("t004hasami");
                        break;
                    case "babybear(Clone)":
                        UIManager._getInstance.ShowItemInfo(item, 1);
                        UIManager._getInstance.OpenItemInfo();
                        GameManager._getInstance.StoreItemInfo(item);
                        GameManager._getInstance.ChangeItem(0, item);
                        GameManager._getInstance.SetItemActive(2, false);
                        AudioManager._audioManager.PlaySound("f_item");
                        break;
                    case "scissor":
                        GameManager._getInstance.DeleteItemInfo("泰迪熊");
                        GameManager._getInstance.StoreItemInfo("泰迪熊的身体");
                        UIManager._getInstance.CloseItemList(1);
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(4);
                        AudioManager._audioManager.PlaySound("f_item");
                        break;
                    case "bearbasket(Clone)":
                        GameManager._getInstance.DeleteItemInfo("泰迪熊的身体");
                        GameManager._getInstance.ChangeItem(1, item);
                        GameManager._getInstance.SetItemActive(1, false);
                        GameManager._getInstance.SetPass(true);
                        UIManager._getInstance.CloseItemList(1);
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(5);
                        AudioManager._audioManager.PlaySound("s001door");
                        break;
                    case "bearhand(Clone)":
                        UIManager._getInstance.ShowItemInfo(item, 1);
                        UIManager._getInstance.OpenItemInfo();
                        GameManager._getInstance.StoreItemInfo(item);
                        GameManager._getInstance.ChangeItem(0, item);
                        AudioManager._audioManager.PlaySound("f_item");
                        break;
                    case "book01":
                        UIManager._getInstance.OpenOrCloseMessage();
                        UIManager._getInstance.ShowBookInfo(0);
                        break;
                    case "cook":
                        GameManager._getInstance.DeleteItemInfo("泰迪熊的手脚");
                        GameManager._getInstance.StoreItemInfo("银汤勺");
                        UIManager._getInstance.CloseItemList(1);
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(7);
                        AudioManager._audioManager.PlaySound("f_item");
                        break;
                    case "BoneSoup(Clone)":
                        GameManager._getInstance.DeleteItemInfo("银汤勺");
                        GameManager._getInstance.SetPass(true);
                        UIManager._getInstance.CloseItemList(1);
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(8);
                        AudioManager._audioManager.PlaySound("s012silver");
                        break;
                    case "rope(Clone)":
                        GameManager._getInstance.StoreItemInfo("绳子");
                        GameManager._getInstance.SetItemActive(7, false);
                        UIManager._getInstance.ShowItemInfo(item, 1);                       
                        UIManager._getInstance.OpenItemInfo();
                        GameManager._getInstance.ChangeItem(0, item);
                        AudioManager._audioManager.PlaySound("f_item");
                        break;
                    case "goldbuffer(Clone)":
                        GameManager._getInstance.StoreItemInfo("蝴蝶");
                        GameManager._getInstance.ChangeItem(0, item);
                        GameManager._getInstance.SetItemActive(4, false);
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(10);
                        AudioManager._audioManager.PlaySound("f_item");
                        break;
                    case "Invisible":
                        if (GameManager._getInstance.GetPass()) 
                        {
                            GameManager._getInstance.DeleteItemInfo("绳子");
                            GameManager._getInstance.StoreItemInfo("读了就会死的书");
                            GameManager._getInstance.ResetMapState();
                            UIManager._getInstance.OpenItemInfo();
                            UIManager._getInstance.DialogInfo(2);
                            AudioManager._audioManager.PlaySound("f_item");
                        }
                        else
                        {
                            UIManager._getInstance.OpenItemInfo();
                            UIManager._getInstance.DialogInfo(0);
                        }
                        break;
                    case "buffer(Clone)":
                        if (GameManager._getInstance.GetPass())
                        {
                            GameManager._getInstance.StoreItemInfo("蝴蝶模型");
                            GameManager._getInstance.ResetMapState();
                            GameManager._getInstance.ChangeItem(1, item);
                            GameManager._getInstance.SetItemActive(5, false);
                            UIManager._getInstance.OpenItemInfo();
                            UIManager._getInstance.ShowItemInfo(13);
                            AudioManager._audioManager.PlaySound("f_item");
                        }
                        else
                        {
                            UIManager._getInstance.OpenItemInfo();
                            UIManager._getInstance.ShowItemInfo(11);
                        }
                        break;
                    case "case":
                        GameManager._getInstance.DeleteItemInfo("读了就会死的书");
                        GameManager._getInstance.SetPass(true);
                        GameManager._getInstance.ChangeItem(0, item);
                        UIManager._getInstance.CloseItemList(1);
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(12);
                        AudioManager._audioManager.PlaySound("s001door");
                        break;
                    case "crash(trigger)":
                        GameManager._getInstance.DeleteItemInfo("蝴蝶模型");
                        GameManager._getInstance.SetItemActive(6, false);
                        GameManager._getInstance.LoadMapItemPrefabs();
                        UIManager._getInstance.CloseItemList(1);
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(14);
                        break;
                    case "BlackCat":
                        GameManager._getInstance.SaveGame();
                        SaveManager._getInstance.AddSaveBtn();
                        UIManager._getInstance.OpenItemInfo();
                        UIManager._getInstance.ShowItemInfo(16);
                        AudioManager._audioManager.PlaySound("f_item");
                        break;
                }
            }
        }
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.transform.tag == "Item")
        {
            item = collision.transform.gameObject;
        }
        if (collision.transform.tag == "NPC")
        {
            item = collision.transform.gameObject;
        }
        if (collision.transform.name == "lastdoor")
        {
            if (GameManager._getInstance.GetPass())
            {
                UIManager._getInstance.OpenItemInfo();
                UIManager._getInstance.ShowItemInfo(17);
            }
            else
            {
                GameManager._getInstance.ReturnMenuFromGameScene();
            }
        }
    }

    private void OnCollisionExit2D(Collision2D collision)
    {
        item = null;
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.transform.tag == "Item")
        {
            item = collision.transform.gameObject;
        }

        if (collision.transform.tag == "NPC")
        {
            item = collision.transform.gameObject;
        }
    
        if (collision.transform.tag == "Event")
        {
            if (GameManager._getInstance.GetPass())
            {
                GameManager._getInstance.CreateItem();
            } 
        }
    }

    private void OnTriggerStay2D(Collider2D collision)
    {
        if (collision.transform.tag == "Item")
        {
            item = collision.transform.gameObject;
        }

        if (collision.transform.tag == "NPC")
        {
            item = collision.transform.gameObject;
        }

        if (collision.transform.name == "bufferleave") 
        {
            if (ItemManager._getInstance.IsItem("蝴蝶"))
            {
                animator.SetBool("run", false);
                GameManager._getInstance.PlayerAnimation(4);
                GameManager._getInstance.DeleteItemInfo("蝴蝶");
                GameManager._getInstance.ChangeItem(0, item);
                AudioManager._audioManager.PlaySound("f_item");
            }
        }
    }

    private void OnTriggerExit2D(Collider2D collision)
    {
        item = null;
    }
}
