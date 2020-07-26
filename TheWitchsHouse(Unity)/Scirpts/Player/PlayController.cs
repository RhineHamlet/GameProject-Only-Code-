using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/*人物控制器*/
[RequireComponent(typeof(Rigidbody2D))]
[RequireComponent(typeof(Animator))]
public class PlayController : MonoBehaviour
{
    public float moveSpeed = 30;
    public float speedUp = 60;

    private Animator p_anim;
    private Rigidbody2D rb;
    private float horizontal;
    private float vertical;
    private float hMove;
    private float vMove;
    private float speed;
    private bool IsWalk = false;
    private bool IsRun = false;
    

    private void Awake()
    {
        p_anim = GetComponent<Animator>();
    }

    // Start is called before the first frame update
    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    // Update is called once per frame
    void Update()
    {
        KeyBoardEventListen();
    }

    public void ResetPlayerState()
    {
        GameManager._getInstance.SetGameState(0);
        UIManager._getInstance.OpenItemInfo();
        UIManager._getInstance.ShowItemInfo(15);
        p_anim.SetInteger("AnimState", 0);
    }

    private void FixedUpdate()
    {
        //获取水平增量
        horizontal = Input.GetAxis("Horizontal");
        //获取垂直增量
        vertical = Input.GetAxis("Vertical");

        hMove = horizontal * moveSpeed;
        vMove = vertical * moveSpeed;
        rb.velocity = new Vector2(hMove, vMove) * Time.deltaTime;
        speed = Mathf.Abs(horizontal) + Mathf.Abs(vertical);
    }
    //按键监听
    public void KeyBoardEventListen()
    {
        if (Input.GetKey(KeyCode.LeftShift))
        {
            IsRun = true;
            IsWalk = false;
        }

        else if (!Input.GetKey(KeyCode.LeftShift))
        {
            IsRun = false;
            IsWalk = true;
        }

        if (IsRun)
        {
            moveSpeed = speedUp;
            p_anim.SetBool("Run", true);
            //向上
            if (Input.GetKey(KeyCode.UpArrow))
            {
                p_anim.SetInteger("Direction", 0);
            }

            //向下
            if (Input.GetKey(KeyCode.DownArrow))
            {
                p_anim.SetInteger("Direction", 1);
            }

            //向左
            if (Input.GetKey(KeyCode.LeftArrow))
            {
                p_anim.SetInteger("Direction", 2);
            }

            //向右
            if (Input.GetKey(KeyCode.RightArrow))
            {
                p_anim.SetInteger("Direction", 3);
            }
        }

        else
        {
            moveSpeed = 30;
            p_anim.SetBool("Run", false);
        }

        if (IsWalk)
        {
            p_anim.SetFloat("MoveSpeed", speed);
        }
        else
        {
            p_anim.SetFloat("MoveSpeed", speed);
        }

        if (!IsRun)
        {
            //向上
            if (Input.GetKey(KeyCode.UpArrow))
            {
                p_anim.SetInteger("Direction", 0);
                IsWalk = true;
            }
            if (!Input.GetKey(KeyCode.UpArrow))
            {
                IsWalk = false;
            }

            //向下
            if (Input.GetKey(KeyCode.DownArrow))
            {
                p_anim.SetInteger("Direction", 1);
                IsWalk = true;
            }
            if (!Input.GetKey(KeyCode.DownArrow))
            {
                IsWalk = false;
            }

            //向左
            if (Input.GetKey(KeyCode.LeftArrow))
            {
                p_anim.SetInteger("Direction", 2);
                IsWalk = true;
            }
            if (!Input.GetKey(KeyCode.LeftArrow))
            {
                IsWalk = false;
            }

            //向右
            if (Input.GetKey(KeyCode.RightArrow))
            {
                p_anim.SetInteger("Direction", 3);
                IsWalk = true;
            }
            if (!Input.GetKey(KeyCode.RightArrow))
            {
                IsWalk = false;
            }
        }
    }
}
