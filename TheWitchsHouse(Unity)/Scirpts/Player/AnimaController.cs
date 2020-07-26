using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AnimaController : MonoBehaviour
{
    //存档NPC用于播放动画的脚本
    public Animator animator;

    private void Start()
    {
        PlayAnimation();
    }

    public void PlayAnimation()
    {
        if (animator == null) return;
        switch (GameManager._getInstance.GetMapIndex())//0 向右 1向下 2向左
        {
            case 0:
                animator.SetInteger("state", 0);
                break;
            case 2:
                animator.SetInteger("state", 2);
                break;
            case 5:
                animator.SetInteger("state", 1);
                break;
            case 14:
                animator.SetInteger("state", 1);
                break;
        }
    }
}
