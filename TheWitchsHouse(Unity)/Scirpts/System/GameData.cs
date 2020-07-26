using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
/*游戏数据类*/
[Serializable]//可序列化标识符
public class GameData
{ 
    public int mapIndex;
    public bool isPass;
    public Vector3 playerPos;
    public int fileNum;
    public int saveNum;
    public List<bool> itemAcitve = new List<bool>();
    public List<string> itemDatas = new List<string>();
}


