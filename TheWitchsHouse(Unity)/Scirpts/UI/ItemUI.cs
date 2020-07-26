using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
/*背包物体预制脚本，用于显示在背包栏内的物体脚本*/
public class ItemUI : MonoBehaviour
{
    public Text itemName;

    public void UpdateItemName(string name)
    {
        itemName.text = name;
    }

    public string GetName()
    {
        return itemName.text;
    }

    public void DestroyItem()
    {
        Destroy(gameObject);
    }
}
