using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
/*用于判断选择到的selectable对象*/
public class SelectController : MonoBehaviour
{
    //脚本单例对象
    public static SelectController _getInstance;

    public GameObject[] selectable;

    private void Awake()
    {
        _getInstance = this;
       
    }

    public void SelectMemu(int type) 
    {
        //选中菜单栏选项 0为物品栏，1为存储界面，2为设置界面，3为确定选项，4为否定选项
        switch (type)
        {
            case 0:
                selectable[0].GetComponent<Selectable>().Select();
                break;
            case 1:
                selectable[1].GetComponent<Selectable>().Select();
                break;
            case 2:
                selectable[2].GetComponent<Selectable>().Select();
                break;
            case 3:
                selectable[3].GetComponent<Selectable>().Select();
                break;
            case 4:
                selectable[4].GetComponent<Selectable>().Select();
                break;
        }
    }

    public void SelectType() //根据选中的选项打开不同的界面
    {
        GameObject selectMemu = EventSystem.current.currentSelectedGameObject;
        if (selectMemu.Equals(selectable[0]))
        {
            UIManager._getInstance.OpenItemList();
        }
        else if (selectMemu.Equals(selectable[1]))
        {
            UIManager._getInstance.OpenSaveView();
        }
        else if (selectMemu.Equals(selectable[2]))
        {
            UIManager._getInstance.OpenSetting();
        }
    }

    public bool IsSelectOption()
    {
        GameObject selectOption = EventSystem.current.currentSelectedGameObject;
        if (selectOption.Equals(selectable[3]))
        {
            return true;
        }
        return false;
    }
}
