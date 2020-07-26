using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
/*存档管理器*/
public class SaveManager : MonoBehaviour
{
    public static SaveManager _getInstance;
    //获取存档UI位置
    public GameObject saveList;

    public int saveNum = 1;

    private void Awake()
    {
        _getInstance = this;
        AddSaveBtnInLoad();
    }

    public void AddSaveBtn()
    {
        if (saveNum > 6)
        {
            Debug.LogWarning("存档已满");
            return;
        }
        GameObject save = (GameObject)Instantiate(Resources.Load("prefabs/UI/Save"));
        save.GetComponent<SaveUI>().UpdataSaveName("存档" + saveNum);
        save.transform.SetParent(saveList.transform);
        save.transform.localPosition = Vector3.zero;
        save.transform.localScale = Vector3.one;
        saveNum++;
    }

    public void AddSaveBtnInLoad()
    {
        for(int i = 0; i < 5; i++)
        {
            string filePath = Application.dataPath + "/StreamingFile" + "/gameData" + i + ".json";
            if (File.Exists(filePath))
            {
                AddSaveBtn();
            }
            else
            {
                return;
            }
        }
    }
}
