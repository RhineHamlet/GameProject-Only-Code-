using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using System.IO;
/*游戏管理器*/
public class GameManager : MonoBehaviour
{
    //脚本单例对象
    public static GameManager _getInstance;
    //游戏状态 0正常，1暂停，2死亡，3动画
    public int gameState;

    //获取主角对象
    private GameObject player;
    //当前地图索引
    private int mapIndex = 0;//修改
    //用于加载地图的gameobject
    private GameObject level;
    //解密达成的条件判断值
    private bool IsPass = false;//修改
    //道具是否添加的条件
    private bool[] IsItemAc = new bool[15];
    //
    private int fileNum = 0;


    private void Awake()
    {
        if (_getInstance == null)
        {
            DontDestroyOnLoad(gameObject);
            _getInstance = this;
        }
        else if (_getInstance != null)
        {
            Destroy(gameObject);
        }
    }

    private void Start()
    {
        //初始化变量IsItemAC
        for(int i = 0; i < IsItemAc.Length; i++)
        {
            IsItemAc[i] = true;
        }
        //初始化游戏状态
        gameState = 0;
    }

    private void Update()
    {
        LoadMapPrefabs();
        GameStateListener();
    }

    public void LoadPlayer()//加载人物
    {
        //加载角色预制体
        if (player != null)
        {
            Destroy(player);
        }
        player = (GameObject)Instantiate(Resources.Load("prefabs/NPC/Viola"));
        player.transform.SetParent(transform);
    }

    public void ReturnMenuFromGameScene()//从游戏界面返回标题界面
    {
        SceneManager.LoadScene(1);
        ResetMapState();
        ChangeMapIndex(0);
        AudioManager._audioManager.PlayBGM("Lost_Chair");
        AudioManager._audioManager.IsActive = false;
        Destroy(player);
    }

    private void ContinueGame()//继续游戏
    {
        //Time.timeScale = 1;
        if (player != null) 
            player.GetComponent<PlayController>().enabled = true;
    }

    private void PauseGame()//暂停游戏
    {
        //Time.timeScale = 0;
        if (player != null)
            player.GetComponent<PlayController>().enabled = false;
    }

    private GameData CreateSaveData()//创建游戏存档数据对象
    {
        GameData gameData = new GameData();
        gameData.mapIndex = mapIndex;
        gameData.isPass = GetPass();
        gameData.playerPos = new Vector3(0, 0, 0);
        gameData.fileNum = fileNum;
        gameData.saveNum = SaveManager._getInstance.saveNum;

        foreach(bool isitemactive in IsItemAc)
        {
            gameData.itemAcitve.Add(isitemactive);
        }

        foreach(string itemdata in ItemData._itemData._itemList)
        {
            gameData.itemDatas.Add(itemdata);
        }

        return gameData;
    }

    private void SetAllBool(GameData gameData)//设置所有IsItemAc的值,用于读取存档时设置道具生成或消失
    {
        for(int i = 0; i < gameData.itemAcitve.Count; i++)
        {
            SetItemActive(i, gameData.itemAcitve[i]);
        }
    }

    private void SetItemWithGameData(GameData gameData)//根据得到的游戏数据，读取游戏数据来设置相应的场景情况
    {
        foreach (string itemdata in gameData.itemDatas)
        {
            ItemData._itemData._itemList.Add(itemdata);
        }
    }

    public void SetGameWithData(GameData gameData)//根据游戏存档设置游戏状态
    {
        SceneManager.LoadScene(2);
        SetGameState(0);
        SetPass(gameData.isPass);
        ChangeMapIndex(gameData.mapIndex);
        ChangePlayerPos(gameData.playerPos);
        fileNum = gameData.fileNum;
        SetAllBool(gameData);
        SetItemWithGameData(gameData);
        if (mapIndex < 3)
        {
            AudioManager._audioManager.PlayBGM("windbgm");
        }
        if (mapIndex > 4 && mapIndex < 12)
        {
            AudioManager._audioManager.PlayBGM("Warehouse");
        }
        if (mapIndex > 13)
        {
            AudioManager._audioManager.PlayBGM("Cellar");
        }

    }

    public void SaveGame()//保存游戏存档 
    {
        if (fileNum > 6)
        {
            Debug.LogWarning("存档已满");
            return;
        }
        //创建游戏数据类对象
        GameData gameData = CreateSaveData();
        //创建游戏存档路径
        string filePath = Application.dataPath + "/StreamingFile" + "/gameData" + fileNum + ".json";
        //将游戏数据转化为json文本
        string jsonStr = JsonUtility.ToJson(gameData);
        //创建文件写入流StreamWriter对象
        StreamWriter sw = new StreamWriter(filePath);
        //写入json文本
        sw.Write(jsonStr);
        //关闭流
        sw.Close();

        fileNum++;

        Debug.Log("保存成功");
    }
    
    public void ReadGame(int type)//读取游戏存档
    {
        //创建读取存档路径
        string filePath = Application.dataPath + "/StreamingFile" + "/gameData" + type + ".json";
        //判断json文件是否存在，不存在则警告
        if (File.Exists(filePath))
        {
            //创建文件读取流StreamReader对象
            StreamReader sr = new StreamReader(filePath);
            //将读取的数据赋值给jsonStr
            string jsonStr = sr.ReadToEnd();
            //关闭流
            sr.Close();
            //将得到的json数据转化成游戏数据
            GameData gameData = JsonUtility.FromJson<GameData>(jsonStr);
            LoadPlayer();
            SetGameWithData(gameData);
        }
        else
        {
            Debug.LogWarning("存档不存在");
        }
    }

    private void GameStateListener()//监听游戏状态来使用相应函数
    {
        if (gameState == 0)
        {
            ContinueGame();
        }
        if (gameState == 1)
        {
            PauseGame();
        }
        if (gameState == 3)
        {

            player.gameObject.GetComponent<PlayController>().enabled = false;
        }
    }

    public int GetGameState()//获取游戏状态的方法
    {
        return gameState;
    }

    public void SetGameState(int state)//设置游戏状态的方法
    {
        gameState = state;
    }

    public bool GetPass()//外部获取IsPass值的方法
    {
        return IsPass;
    }

    public void SetPass(bool state)//设置IsPass值的方法
    {
        IsPass = state;
    }

    public void ResetMapState()//重置游戏状态
    {
        SetPass(false);
    }

    public void ChangeMapIndex(int index)//切换地图索引
    {
        Destroy(level);
        mapIndex = index;
    }

    public int GetMapIndex()//外界获取地图索引变量的方法
    {
        return mapIndex;
    }

    private void LoadMapPrefabs()//加载地图预制体
    {
        if (level == null)
        {
            level = (GameObject)Instantiate(Resources.Load("Level/Level" + mapIndex));
        }
    }

    public void LoadMapItemPrefabs()//加载地图道具预制体
    {
        if (mapIndex == 1)
        {
            if (IsItemAc[0])
            {
                GameObject item = (GameObject)Instantiate(Resources.Load("prefabs/Interactable/star"),
                new Vector3(-2.6f, -0.2f, 0), Quaternion.identity);
                item.transform.SetParent(ItemManager._getInstance.itemTransform);
            }
        }
        if(mapIndex == 7)
        {
            GameObject item = (GameObject)Instantiate(Resources.Load("prefabs/Interactable/bearbasket"),
            new Vector3(0.2f, 0, 0), Quaternion.identity);
            item.transform.SetParent(ItemManager._getInstance.itemTransform);
            if (!IsItemAc[1])
            {
                item.GetComponent<ItemController>().ChangeSprite();
            }
        }
        if (mapIndex == 8)
        {
            if (IsItemAc[2])
            {
                GameObject item = (GameObject)Instantiate(Resources.Load("prefabs/Interactable/babybear"),
                new Vector3(1.7f, -1.5f, 0), Quaternion.identity);
                item.transform.SetParent(ItemManager._getInstance.itemTransform);
            }
        }
        if (mapIndex == 10)
        {
            GameObject item = (GameObject)Instantiate(Resources.Load("prefabs/Interactable/BoneSoup"),
            new Vector3(-0.215f, 0.51f, 0), Quaternion.identity);
            item.transform.SetParent(ItemManager._getInstance.itemTransform);
            if (!IsItemAc[3])
            {
                item.GetComponent<ItemController>().ChangeSprite();
            }
        }
        if (mapIndex == 15)
        {
            if (IsItemAc[4])
            {
                GameObject item = (GameObject)Instantiate(Resources.Load("prefabs/Interactable/goldbuffer"),
                new Vector3(1.9f, 4.5f, 0), Quaternion.identity);
                item.transform.SetParent(ItemManager._getInstance.itemTransform);
            }
            if (!IsItemAc[6])
            {
                GameObject item = (GameObject)Instantiate(Resources.Load("prefabs/Interactable/buffermodel"),
                new Vector3(2f, 4.5f, 0), Quaternion.identity);
                item.transform.SetParent(ItemManager._getInstance.itemTransform);
            }
            if (IsItemAc[7])
            {
                GameObject item = (GameObject)Instantiate(Resources.Load("prefabs/Interactable/rope"),
                new Vector3(1.4346f, 2.015f, 0), Quaternion.identity);
                item.transform.SetParent(ItemManager._getInstance.itemTransform);
            }
        }
        if (mapIndex == 17)
        {
            GameObject item = (GameObject)Instantiate(Resources.Load("prefabs/Interactable/buffer"),
            new Vector3(-2.643f, 1.289f, 0), Quaternion.identity);
            item.transform.SetParent(ItemManager._getInstance.itemTransform);
            if (!IsItemAc[5])
            {
                item.GetComponent<ItemController>().ChangeSprite();
            }
        }
    }

    public void SetItemActive(int index, bool state)//单独设置IsItemAc中的值,用于单个地图道具物体的消失和出现
    {
        IsItemAc[index] = state;
    }

    public void ChangePlayerPos(int pos)//在切换地图时改变人物位置
    {
        switch (pos)
        {
            case 0:
                player.transform.position = new Vector2(-1.67f, -3.5f);
                break;
            case 1:
                player.transform.position = new Vector2(1.68f, 2.26f);
                break;
            case 2:
                player.transform.position = new Vector2(0.05f, -4.86f);
                break;
            case 3:
                player.transform.position = new Vector2(-0.017f, -1.126f);
                break;
            case 4:
                player.transform.position = new Vector2(0f, -1f);
                break;
            case 5:
                player.transform.position = new Vector2(0f, 1f);
                break;
            case 6:
                player.transform.position = new Vector2(0f, 1.2f);
                break;
            case 7:
                player.transform.position = new Vector2(-0.3f, -2.3f);
                break;
            case 8:
                player.transform.position = new Vector2(2.3f, 0.2f);
                break;
            case 9:
                player.transform.position = new Vector2(-1.2f, -0.3f);
                break;
            case 10:
                player.transform.position = new Vector2(0.45f, -2.2f);
                break;
            case 11:
                player.transform.position = new Vector2(0.45f, 1.1f);
                break;
            case 12:
                player.transform.position = new Vector2(1f, 0.2f);
                break;
            case 13:
                player.transform.position = new Vector2(-2.2f, 0.2f);
                break;
            case 14:
                player.transform.position = new Vector2(-3.2f, -2.3f);
                break;
            case 15:
                player.transform.position = new Vector2(-1.2f, -2f);
                break;
            case 16:
                player.transform.position = new Vector2(3.1f, 2.2f);
                break;
            case 17:
                player.transform.position = new Vector2(0f, -1.5f);
                break;
            case 18:
                player.transform.position = new Vector2(-1f, 0.1f);
                break;
            case 19:
                player.transform.position = new Vector2(6.2f, -0.35f);
                break;
            case 20:
                player.transform.position = new Vector2(0f, -3.5f);
                break;
            case 21:
                player.transform.position = new Vector2(-0.95f, -1.6f);
                break;
            case 22:
                player.transform.position = new Vector2(-3.2f, 3.6f);
                break;
            case 23:
                player.transform.position = new Vector2(3.1f, 0.5f);
                break;
            case 24:
                player.transform.position = new Vector2(-3.6f, 0.4f);
                break;
            case 25:
                player.transform.position = new Vector2(-3.6f, -0.6f);
                break;
        }
    }

    public void ChangePlayerPos(Vector3 pos)//改变角色坐标
    {
        player.transform.position = pos;
    }

    public void ChangeItem(int type,GameObject item)//改变场景物品状态
    {
        switch (type)
        {
            case 0:
                item.GetComponent<ItemController>().DestroyItem();
                break;
            case 1:
                item.GetComponent<ItemController>().ChangeSprite();
                break;
            case 2:
                item.GetComponent<ItemController>().CloseCollider();
                break;
        }
    }

    public void StoreItemInfo(GameObject item)//将道具数据存储
    {
        ItemManager._getInstance.StoreItem(item);
        ItemData._itemData.AddItem(item.GetComponent<ItemController>().GetItemInfo());
    }

    public void StoreItemInfo(string name)//根据名字添加道具到物品栏
    {
        ItemManager._getInstance.StoreItem(name);
        ItemData._itemData.AddItem(name);
    }

    public void DeleteItemInfo(string name)//根据名字删除道具
    {
        ItemManager._getInstance.DeleteItem(name);
        ItemData._itemData.DeleteItem(name);
    }

    public void SetHome(bool state)//设置动画参数Home
    {
        player.GetComponent<Animator>().SetBool("Home", state);
    }

    public void CreateItem()//在地图生成上生成道具预制体
    {
        if (IsItemAc[4])
        {
            GameObject item = (GameObject)Instantiate(Resources.Load("prefabs/Interactable/bearhand"),
                new Vector3(-0.24f, 0.18f, 0), Quaternion.identity);
            item.transform.SetParent(ItemManager._getInstance.itemTransform);
        }
    }

    public void PlayerAnimation(int type)//播放人物动画
    {
        switch (type)
        {
            case 4:
                if (player.GetComponent<Animator>().GetInteger("AnimState") != 1)
                player.GetComponent<Animator>().SetInteger("AnimState", 1);
                break;
            case 5:

                break;
        }
    }
    
}
