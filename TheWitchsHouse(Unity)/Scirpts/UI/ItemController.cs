using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

/*道具控制脚本*/
public class ItemController : MonoBehaviour
{
    //脚本单例对象
    public static ItemController _getItem;
    public Text itemInfo;
    public Sprite sprite;
    public Animator animator;

    private void Awake()
    {
        _getItem = this;
    }

    public string GetItemInfo()//得到当前道具信息
    {
        if (itemInfo != null)
        {
            return itemInfo.text;
        }
        else return null;
    }

    public void DestroyItem()
    {
        Destroy(gameObject);
    }

    public void ChangeSprite()//切换道具的精灵图
    {
        transform.GetComponent<SpriteRenderer>().sprite = sprite;
    }

    public void CloseCollider()//关闭道具的碰撞体
    {
        transform.GetComponent<Collider2D>().enabled = false;
    }

    public void PlayAnimation(string name, bool state)//调用道具的动画参数
    {
        if (animator != null)
            if (name == "讯息")
                animator.SetBool("IsRead", state);
    }
}
