window.addEventListener('DOMContentLoaded', () => {
    const openMusicButton = document.getElementById("openMusic");
    const connectButton = document.getElementById("connect");
    const openLiveButton = document.getElementById("openLive");
    const minecraftServerStartButton = document.getElementById("minecraftServerStart");
    const danmuLockImg = document.getElementById("danmuLock");
    const musicLockImg = document.getElementById("musicLock");
    const roomIdInput = document.getElementById("roomId");
    const { ipcRenderer, shell } = require('electron');
    
    connectButton.addEventListener('click', function () {
        const roomId = parseInt(roomIdInput.value);
        ipcRenderer.send('clickConnect', roomId)
    });
    openMusicButton.addEventListener('click', function () {
        ipcRenderer.send('clickOpenMusic', '点击了点歌机按钮')
    });
    openLiveButton.addEventListener('click', function () {
        const roomId = parseInt(roomIdInput.value);
        shell.openExternal(`https://live.bilibili.com/${roomId}?broadcast_type=0&is_room_feed=1&spm_id_from=333.999.to_liveroom.0.click&live_from=86002`)
    });
    danmuLockImg.addEventListener('click', function () {
        if (danmuLockImg.src.includes('suoDing')) {
            danmuLockImg.src = danmuLockImg.src.slice(0, -11) + "jieSuo.png";
            ipcRenderer.send('danmuSetIgnoreMouse', false)
        } else {
            danmuLockImg.src = danmuLockImg.src.slice(0, -10) + "suoDing.png";
            ipcRenderer.send('danmuSetIgnoreMouse', true)
        }
    });
    musicLockImg.addEventListener('click', function () {
        if (musicLockImg.src.includes('suoDing')) {
            musicLockImg.src = musicLockImg.src.slice(0, -11) + "jieSuo.png";
            ipcRenderer.send('musicSetIgnoreMouse', false)
        } else {
            musicLockImg.src = musicLockImg.src.slice(0, -10) + "suoDing.png";
            ipcRenderer.send('musicSetIgnoreMouse', true)
        }
    });
    minecraftServerStartButton.addEventListener('click', function () {
        ipcRenderer.send('clickminecraftServerStartButton', '开启服务器')
    });
})