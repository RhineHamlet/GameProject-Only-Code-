
/**
 * 声音播放管理
 */
export default class SoundMgr {

    //音乐标记
    public static MUSIC_BG_TAG_1: string = "MUSIC_BG_1";
    public static MUSIC_BG_NAME_1: string = "Music/youxichangjing1BGM.mp3";

    public static MUSIC_BG_TAG_BATTLE: string = "MUSIC_BG_BATTLE";
    public static MUSIC_BG_NAME_BATTLE: string = "Music/zhandouchangjingBGM.mp3";

    public static curBgMusicTag: string = "";

    //播放背景音乐
    public static playBgMusic(tagName: string, musicPath: string): void {
        if (SoundMgr.curBgMusicTag != tagName) {
            Laya.SoundManager.playMusic(musicPath);
            SoundMgr.curBgMusicTag = tagName;
        }
    }
}