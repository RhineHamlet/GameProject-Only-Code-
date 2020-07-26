using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using System.Data;
using UnityEngine.UI;

public class Login : MonoBehaviour
{
    //获取用户账号输入框
    public InputField userNameInput;
    //获取用户密码输入框
    public InputField passwordInput;
    //获取用户操作提示框
    public GameObject userTip;

    //数据库工具类
    private MySqlAccess mysql;

    private void Start()
    {
        mysql = new MySqlAccess("127.0.0.1", "3306", "root", "a123456", "thewitchhouse");
    }

    public void Register()//注册账号
    {
        mysql.OpenSql();
        if (!Check()) return;
        else
        {
            OpenTip("注册成功");
            mysql.QuerySet("insert into c_user values(null,"
                + "'" + userNameInput.text + "'" + ","
                + "'" + passwordInput.text + "'" + ")");
        }
        mysql.CloseSql();
    }
    public void LoginGame()//登录游戏
    {
        mysql.OpenSql();
        if (!Check()) return;
        DataSet ds = mysql.Select("c_user", new string[] { "0" },
            new string[] { "`" + "user_account" + "`", "`" + "user_password" + "`" },
            new string[] { "=", "=" },
            new string[] { userNameInput.text, passwordInput.text });
        if (ds != null)
        {
            DataTable table = ds.Tables[0];
            if (table.Rows.Count > 0)
            {
                OpenTip("登录成功");
                SceneManager.LoadScene(1);
            }
            else
            {
                OpenTip("账号或密码错误");
            }
        }
        mysql.CloseSql();
    }

    private bool Check()//检测账号密码是否为空
    {
        if (userNameInput.text == "" || passwordInput.text == "")
        {
            OpenTip("账号或密码不能为空");
            return false;
        }
        else return true;
    }

    public void OpenTip(string str)//打开提示
    {
        if (!userTip.activeInHierarchy)
        {
            userTip.SetActive(true);
            userTip.GetComponent<Tip>().UpdateText(str);
        }
    }
}
