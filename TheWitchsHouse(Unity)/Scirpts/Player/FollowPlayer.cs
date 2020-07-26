using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FollowPlayer : MonoBehaviour
{
    //定义一个Transform类型的player
    private Transform player;
    //定义摄像机与人物的偏移位置
    private Vector3 offsetStation; 
    //定义摄像机移动距离
    public float xMin, xMax, yMin, yMax;

    //在Awake里获取到移动物体Player的transform组件，其实也是初始化定义的字段
    void Awake()
    {
        //找到角色
        player = GameObject.FindGameObjectWithTag("Player").transform;
        //让摄像机朝向人物的位置
        transform.LookAt(player.position);
        //得到偏移量
        offsetStation = transform.position - player.position;
    }
    void Update()
    {
        //让摄像机的位置= 人物行走的位置+与偏移量的相加(限制摄像机的移动范围)
        transform.position = new Vector3(
            Mathf.Clamp(offsetStation.x + player.position.x, xMin, xMax),
            Mathf.Clamp(offsetStation.y + player.position.y, yMin, yMax), -10);
    }
    
}
