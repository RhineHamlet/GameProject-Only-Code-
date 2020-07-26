using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
/*用于在标题界面生成存档按钮*/
public class AddSaveBtn : MonoBehaviour
{
    public int saveNum = 1;
    public GameObject saveList;
    // Start is called before the first frame update
    void Start()
    {
        AddSaveBtnInLoad();
    }

    public void AddSaveBtnFuction()
    {
        GameObject save = (GameObject)Instantiate(Resources.Load("prefabs/UI/Save"));
        save.GetComponent<SaveUI>().UpdataSaveName("存档" + saveNum);
        save.transform.SetParent(saveList.transform);
        save.transform.localPosition = Vector3.zero;
        save.transform.localScale = Vector3.one;
        saveNum++;
    }

    public void AddSaveBtnInLoad()
    {
        for (int i = 0; i < 5; i++)
        {
            string filePath = Application.dataPath + "/StreamingFile" + "/gameData" + i + ".json";
            if (File.Exists(filePath))
            {
                AddSaveBtnFuction();
            }
            else
            {
                return;
            }
        }
    }
}
