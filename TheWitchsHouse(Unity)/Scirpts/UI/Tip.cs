using UnityEngine;
using UnityEngine.UI;


public class Tip : MonoBehaviour
{
    public Text text;
    
    public void UpdateText(string str)
    {
        text.text = str;
    }

    public void Disspear()
    {
        transform.gameObject.SetActive(false);
    }

    private void Update()
    {
        Invoke("Disspear", 2.5f);
    }
}
