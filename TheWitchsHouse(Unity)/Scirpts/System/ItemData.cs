using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ItemData : MonoBehaviour
{
    public List<string> _itemList = new List<string>();

    //脚本单例对象
    public static ItemData _itemData;

    private void Awake()
    {
        _itemData = this;    
    }

    private void Start()
    {
        _itemList = new List<string>(); //初始化List对象
    }

    private void DisplayItems()  //打印当前List的控制台信息
    {
        string itemDisplay = "items: ";
        foreach (string item in _itemList)
        {
            itemDisplay += item;
        }
        Debug.Log(itemDisplay);
    }

    public bool IsListItem() //判断集合中是否存在数据
    {
        if (_itemList.Count == 0)
        {
            return false;
        }
        return true;
    }

    public void AddItem(string name) //添加物品进入List集合中
    {
        for(int i = 0; i < _itemList.Count; i++)
        {
            if (_itemList[i] == name)
            {
                Debug.LogWarning("重复拾取!!!!");
            }
        }
        _itemList.Add(name);
        DisplayItems();  //将物品添加到List并将列表信息打印到控制台
    }

    public string GetItemName(string name) //根据名字在List集合中寻找道具
    {
        for (int i = 0; i < _itemList.Count; i++)
        {
            if (_itemList[i] == name)
            {
                return _itemList[i];
            }
        }
        return null;
    }

    public void DeleteItem(string name) //根据名字删除List集合中道具
    {
        for (int i = 0; i < _itemList.Count; i++)
        {
            if (_itemList[i] == name)
            {
                _itemList.Remove(_itemList[i]);
                Debug.Log("删除物品信息" + name + "成功!");
            }
            else
            {
                Debug.LogWarning("错误，物品信息" + name + "不存在!!!");
            }
        }
    }
}
