using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
/*存档按钮物体预制体脚本*/
public class SaveUI : MonoBehaviour
{
    public Text saveName;
    public Text time;
    public Text site;

    public void UpdataSaveName(string str)
    {
        saveName.text = str;
    }

    public void UpdataTime(string str)
    {
        time.text = str;
    }

    public void ReadGame()
    {
        switch (saveName.text)
        {
            case "存档1":
                GameManager._getInstance.ReadGame(0);
                break;
            case "存档2":
                GameManager._getInstance.ReadGame(1);
                break;
            case "存档3":
                GameManager._getInstance.ReadGame(2);
                break;
            case "存档4":
                GameManager._getInstance.ReadGame(3);
                break;
            case "存档5":
                GameManager._getInstance.ReadGame(4);
                break;
        }

    }
}
