using System.Collections;
using System.Collections.Generic;
using UnityEngine;
/*触发死亡事件脚本*/
public class DeathEvent : MonoBehaviour
{
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.transform.gameObject.tag == "Player")
        {
            PlayDeathAnimation();
            GameManager._getInstance.SetGameState(2);
        }
    }
    private void OnTriggerStay2D(Collider2D collision)
    {
        if (collision.transform.gameObject.tag == "Player")
        {
            UIManager._getInstance.IsAnimaOver(UIManager._getInstance.left);
        }
    }
    private void Update()
    {
        
    }
    private void PlayDeathAnimation()
    {
        UIManager._getInstance.OpenMapFog(2);
    }
}
