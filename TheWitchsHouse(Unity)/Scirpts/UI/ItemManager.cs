using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
/*背包道具脚本*/
public class ItemManager : MonoBehaviour
{
    //脚本单例对象
    public static ItemManager _getInstance;
    //获取背包内物品栏空格
    public Transform[] itemList = new Transform[4];
    //获取场景道具储存的对象
    public Transform itemTransform;

    private void Awake()
    {
        _getInstance = this;
        AddItemFromItemData();
    }

    private Transform GetEmptyGrid()//得到一个物品栏的空格
    {
        for(int i = 0; i < itemList.Length; i++)
        {
            if (itemList[i].childCount == 0)
            {
                return itemList[i];
            }
        }
        return null;
    }

    public void StoreItem(GameObject items)//将道具存入物品栏
    {
        GameObject itemName = (GameObject)Instantiate(Resources.Load("prefabs/Interactable/ItemName"));
        itemName.GetComponent<ItemUI>().UpdateItemName(items.GetComponent<ItemController>().GetItemInfo());
        Transform emptyGrid = GetEmptyGrid();
        if (emptyGrid == null)
        {
            Debug.LogWarning("物品栏已满");
            return;
        }
        itemName.transform.SetParent(emptyGrid);
        itemName.transform.localPosition = new Vector3(10, 0, 0);
        itemName.transform.localScale = Vector3.one;
    }

    public void StoreItem(string name)//输入名字将道具存入物品栏
    {
        GameObject itemName = (GameObject)Instantiate(Resources.Load("prefabs/Interactable/ItemName"));
        itemName.GetComponent<ItemUI>().UpdateItemName(name);
        Transform emptyGrid = GetEmptyGrid();
        if (emptyGrid == null)
        {
            Debug.LogWarning("物品栏已满");
            return;
        }
        itemName.transform.SetParent(emptyGrid);
        itemName.transform.localPosition = Vector3.zero;
        itemName.transform.localScale = Vector3.one;
    }

    public void AddItemFromItemData()
    {
        for (int i = 0; i < ItemData._itemData._itemList.Count; i++) 
        {
            if (ItemData._itemData._itemList[i] != null)
            {
                StoreItem(ItemData._itemData._itemList[i]);
            }
        }
    }

    public void DeleteItem(string name)//根据道具名称删除道具
    {
        if (!IsItem(name))
        {
            Debug.LogWarning("物品栏不存在" + name + "这件物品");
            return;
        }
        for(int i = 0; i < itemList.Length; i++)
        {
            if(itemList[i].childCount != 0)
            {
                if (itemList[i].GetChild(0).GetComponent<ItemUI>().GetName() == name)
                {
                    itemList[i].GetChild(0).GetComponent<ItemUI>().DestroyItem();
                }
            }
        }
    }

    public void FirstSelectItem()//选中物品栏中的第一个道具
    {
        itemList[0].GetComponent<Selectable>().Select();
    }

    public string GetSelectItemName()//获取选中的物品名称
    {
        GameObject selectItem = EventSystem.current.currentSelectedGameObject;
        if (selectItem.transform.childCount != 0)
        {
            if (SelectController._getInstance.IsSelectOption()) return null;
            string itemName = selectItem.transform.GetChild(0).GetComponent<ItemUI>().GetName();
            return itemName;
        }
        return null;
    }

    public bool IsItem(string name)//根据名字判断物品栏中是否存在这件物品
    {
        for(int i = 0; i < itemList.Length; i++)
        {
            if (itemList[i].childCount != 0)
            {
                if (itemList[i].GetChild(0).GetComponent<ItemUI>().GetName() == name)
                {
                    return true;
                }
            }
        }
        return false;
    }

    public void ClearAllItem()//清空地图上所有加载的预制体
    {
        if (itemTransform.childCount != 0)
        {
            for (int i = 0; i < itemTransform.childCount; i++)
            {
                itemTransform.GetChild(i).GetComponent<ItemController>().DestroyItem();
            }
        }
    }
}
