using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class OpenDoor : MonoBehaviour
{
    //用于播放开门动画和音效的脚本
    public Animator animator;

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.transform.gameObject.tag == "Player")
        {
            PlayAnimation(true);
            AudioManager._audioManager.PlaySound("p001door");
        }
    }

    public void PlayAnimation(bool state)//调用道具的动画参数
    {
        if (animator != null)
            animator.SetBool("Open", state);
    }
}
