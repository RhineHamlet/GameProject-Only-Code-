using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ChangeMap : MonoBehaviour
{
    //用于切换地图的触发器所携带的脚本，用于调用切换地图方法，改变人物位置，加载下个地图的道具方法
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.tag == "Player")
        {
            ItemManager._getInstance.ClearAllItem();
            switch (transform.gameObject.name)
            {
                case "changemap01":
                    GameManager._getInstance.ChangeMapIndex(1);
                    GameManager._getInstance.ChangePlayerPos(1);
                    GameManager._getInstance.LoadMapItemPrefabs();
                    break;
                case "changemap02":
                    GameManager._getInstance.ChangeMapIndex(0);
                    GameManager._getInstance.ChangePlayerPos(0);
                    break;
                case "changemap03":
                    GameManager._getInstance.ChangeMapIndex(2);
                    GameManager._getInstance.ChangePlayerPos(2);
                    UIManager._getInstance.OpenMapFog(0);
                    break;
                case "changemap04":
                    GameManager._getInstance.ChangeMapIndex(3);
                    GameManager._getInstance.ChangePlayerPos(3);
                    GameManager._getInstance.SetHome(true);
                    UIManager._getInstance.OpenMapFog(1);
                    UIManager._getInstance.CloseNewBie();
                    AudioManager._audioManager.PauseBGM();
                    break;
                case "changemap05":
                    GameManager._getInstance.ChangeMapIndex(4);
                    GameManager._getInstance.ChangePlayerPos(3);
                    break;
                case "changemap06":
                    if (!GameManager._getInstance.GetPass())  
                    {
                        GameManager._getInstance.ChangeMapIndex(3);
                        GameManager._getInstance.ChangePlayerPos(5);
                    }
                    else
                    {
                        GameManager._getInstance.ChangeMapIndex(5);
                        GameManager._getInstance.ChangePlayerPos(6);
                        GameManager._getInstance.ResetMapState();
                        AudioManager._audioManager.PlayBGM("Warehouse");
                    }
                    break;
                case "changemap07":
                    GameManager._getInstance.ChangeMapIndex(6);
                    GameManager._getInstance.ChangePlayerPos(7);
                    break;
                case "changemap08":
                    GameManager._getInstance.ChangeMapIndex(5);
                    GameManager._getInstance.ChangePlayerPos(8);
                    break;
                case "changemap09":
                    GameManager._getInstance.ChangeMapIndex(7);
                    GameManager._getInstance.ChangePlayerPos(9);
                    GameManager._getInstance.LoadMapItemPrefabs();
                    break;
                case "changemap10":
                    GameManager._getInstance.ChangeMapIndex(8);
                    GameManager._getInstance.ChangePlayerPos(9);
                    GameManager._getInstance.LoadMapItemPrefabs();
                    break;
                case "changemap11":
                    GameManager._getInstance.ChangeMapIndex(6);
                    GameManager._getInstance.ChangePlayerPos(10);
                    break;
                case "changemap12":
                    GameManager._getInstance.ChangeMapIndex(6);
                    GameManager._getInstance.ChangePlayerPos(11);
                    break;
                case "changemap13":
                    GameManager._getInstance.ChangeMapIndex(9);
                    GameManager._getInstance.ChangePlayerPos(12);
                    break;
                case "changemap14":
                    GameManager._getInstance.ChangeMapIndex(5);
                    GameManager._getInstance.ChangePlayerPos(13);
                    break;
                case "changemap15":
                    if (GameManager._getInstance.GetPass())
                    {
                        GameManager._getInstance.ChangeMapIndex(10);
                        GameManager._getInstance.ChangePlayerPos(14);
                        GameManager._getInstance.LoadMapItemPrefabs();
                        GameManager._getInstance.ResetMapState();
                    }
                    break;
                case "changemap16":
                    GameManager._getInstance.ChangeMapIndex(11);
                    GameManager._getInstance.ChangePlayerPos(15);
                    break;
                case "changemap17":
                    GameManager._getInstance.ChangeMapIndex(10);
                    GameManager._getInstance.ChangePlayerPos(16);
                    GameManager._getInstance.LoadMapItemPrefabs();
                    break;
                case "changemap18":
                    if (GameManager._getInstance.GetPass())
                    {
                        GameManager._getInstance.ChangeMapIndex(12);
                        GameManager._getInstance.ChangePlayerPos(17);
                        GameManager._getInstance.ResetMapState();
                        AudioManager._audioManager.PauseBGM();
                    }
                    break;
                case "changemap19":
                    GameManager._getInstance.ChangeMapIndex(13);
                    GameManager._getInstance.ChangePlayerPos(18);
                    break;
                case "changemap20":
                    GameManager._getInstance.ChangeMapIndex(14);
                    GameManager._getInstance.ChangePlayerPos(19);
                    AudioManager._audioManager.PlayBGM("Cellar");
                    break;
                case "changemap21":
                    GameManager._getInstance.ChangeMapIndex(15);
                    GameManager._getInstance.ChangePlayerPos(20);
                    GameManager._getInstance.LoadMapItemPrefabs();
                    break;
                case "changemap22":
                    GameManager._getInstance.ChangeMapIndex(16);
                    GameManager._getInstance.ChangePlayerPos(21);
                    break;
                case "changemap23":
                    GameManager._getInstance.ChangeMapIndex(17);
                    GameManager._getInstance.ChangePlayerPos(22);
                    GameManager._getInstance.LoadMapItemPrefabs();
                    break;
                case "changemap24":
                    GameManager._getInstance.ChangeMapIndex(14);
                    GameManager._getInstance.ChangePlayerPos(23);
                    break;
                case "changemap25":
                    GameManager._getInstance.ChangeMapIndex(14);
                    GameManager._getInstance.ChangePlayerPos(24);
                    break;
                case "changemap26":
                    GameManager._getInstance.ChangeMapIndex(14);
                    GameManager._getInstance.ChangePlayerPos(25);
                    break;
            }
        }
    }
}
