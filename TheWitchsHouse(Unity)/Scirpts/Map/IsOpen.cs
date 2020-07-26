using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class IsOpen : MonoBehaviour
{
    //地图上有特定需要达成条件才能开启的门，用于判定这类门是否能够开启
    // Start is called before the first frame update
    void Start()
    {     
        if (GameManager._getInstance.GetPass())
        {
            transform.GetComponent<OpenDoor>().enabled = true;
            transform.GetComponent<Animator>().enabled = true;
        }
        else
        {
            transform.GetComponent<OpenDoor>().enabled = false;
            transform.GetComponent<Animator>().enabled = false;
        } 
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
