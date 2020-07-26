using System.Collections;
using System.Collections.Generic;
using UnityEngine;
/*音效管理器*/
public class AudioManager : MonoBehaviour
{
    public static AudioManager _audioManager;

    private AudioSource BGMSource;
    private AudioSource soundEffects;
    private AudioClip audioClip;
    private AudioClip soundClip;
    private float BGMValue;
    private float soundValue;

    public bool IsActive;

    private void Awake()
    {
        _audioManager = this;
        BGMSource = GetComponent<AudioSource>();
        soundEffects = transform.GetChild(0).GetComponent<AudioSource>();
    }
    private void OnGUI()
    {
        if (IsActive) 
            SoundCtroller();
    }
    //播放给定名字的背景音乐
    public void PlayBGM(string musicName)
    {
        if (audioClip != null)
        {
            audioClip = null;
        }
        audioClip = (AudioClip)Resources.Load("Audio/bgm/" + musicName);
        BGMSource.clip = audioClip;
        BGMSource.Play();
    }
    //播放游戏音效
    public void PlaySound(string musicName)
    {
        if (soundClip != null)
        {
            soundClip = null;
        }
        soundClip = (AudioClip)Resources.Load("Audio/sound/" + musicName);
        soundEffects.PlayOneShot(soundClip);
    }
    //暂停播放背景音乐
    public void PauseBGM()
    {
        BGMSource.clip = null;
        BGMSource.Pause();
    }
    //可视化音量控制滚动条生成
    public void SoundCtroller()
    {
        //滑动条矩形
        Rect bRect = new Rect(new Vector2(500, 360), new Vector2(250, 20));
        Rect sRect = new Rect(new Vector2(500, 420), new Vector2(250, 20));
        //音量值对象
        BGMValue = GUI.HorizontalSlider(bRect, BGMSource.volume, 0.0f, 1.0f);
        soundValue = GUI.HorizontalSlider(sRect, soundEffects.volume, 0.0f, 1.0f);
        //音量控制slider
        BGMSource.volume = BGMValue;
        soundEffects.volume = soundValue;
    }
}
