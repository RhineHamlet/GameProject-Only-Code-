using UnityEngine;
using UnityEngine.SceneManagement;

/*主菜单控制器*/
public class MainMenu : MonoBehaviour
{
    //获取主菜单界面按钮
    public GameObject[] menuBtn;
    //获取用户界面
    public GameObject userView;
    //获取主菜单界面
    public GameObject mainMenu;
    //获取主菜单存档界面选项
    public GameObject save;
    //获取主菜单设置选项
    public GameObject setting;


    private void Start()
    {

    }

    public void StartGame()//主界面开始游戏
    {
        SceneManager.LoadScene(2);
        GameManager._getInstance.LoadPlayer();
        GameManager._getInstance.SetGameState(0);
        AudioManager._audioManager.PlayBGM("windbgm");
        AudioManager._audioManager.PlaySound("s003cur");
    }

    public void OpenMainMenu()//打开或关闭主菜单界面
    {
        if (!mainMenu.activeInHierarchy)
        {
            mainMenu.SetActive(true);
            AudioManager._audioManager.PlaySound("s003cur");
        }
        else
        {
            mainMenu.SetActive(false);
            AudioManager._audioManager.PlaySound("mv_Cursor1");
        }
    }

    public void OpenSave()//主界面打开或关闭存档界面
    {
        if (!save.activeInHierarchy)
        {
            CloseMenuBtn();
            save.SetActive(true);
            AudioManager._audioManager.PlaySound("s003cur");
        }
        else
        {
            CloseMenuBtn();
            save.SetActive(false);
            AudioManager._audioManager.PlaySound("mv_Cursor1");
        }
    }

    public void OpenSetting()//主界面打开或关闭设置选项
    {
        if (!setting.activeInHierarchy)
        {
            CloseMenuBtn();
            setting.SetActive(true);
            AudioManager._audioManager.IsActive = true;
            AudioManager._audioManager.PlaySound("s003cur");
        }
        else
        {
            CloseMenuBtn();
            setting.SetActive(false);
            AudioManager._audioManager.IsActive = false;
            AudioManager._audioManager.PlaySound("mv_Cursor1");
        }
    }

    public void QuitGame()//主界面退出游戏
    {
        Application.Quit();
        AudioManager._audioManager.PlaySound("s003cur");
    }

    private void CloseMenuBtn()//隐藏和显示主菜单界面所有按钮
    {
        for (int i = 0; i < menuBtn.Length; i++)
        {
            if (menuBtn[i].activeInHierarchy)
                menuBtn[i].SetActive(false);
            else
                menuBtn[i].SetActive(true);
        }
    }

    public void ReturnMenu()//从设置界面返回主菜单界面
    {
        AudioManager._audioManager.PlaySound("mv_Cursor1");
        if (setting.activeInHierarchy)
            OpenSetting();
        if (save.activeInHierarchy)
            OpenSave();
    }

   
}
