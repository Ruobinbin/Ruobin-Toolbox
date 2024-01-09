window.addEventListener('DOMContentLoaded', () => {
    const openMusicButton = document.getElementById("openMusic");
    const connectButton = document.getElementById("connect");
    const openLiveButton = document.getElementById("openLive");
    const minecraftServerStartButton = document.getElementById("minecraftServerStart");
    const danmuLockImg = document.getElementById("danmuLock");
    const musicLockImg = document.getElementById("musicLock");
    const roomIdInput = document.getElementById("roomId");
    const { ipcRenderer, shell } = require('electron');
    {
        // 获取所有侧边栏中的链接元素
        var links = document.querySelectorAll('.sidebar a');

        // 获取主内容区域中的所有 div 元素
        var contents = document.querySelectorAll('#main div');

        // 遍历所有的链接元素
        links.forEach(function (link) {
            // 为每个链接元素添加点击事件监听器
            link.addEventListener('click', function (e) {
                // 阻止链接的默认行为，也就是阻止页面跳转
                e.preventDefault();

                // 获取被点击的链接元素的 href 属性值，并去掉第一个字符（#）
                var id = this.getAttribute('href').substring(1);

                // 遍历所有的 div 元素
                contents.forEach(function (content) {
                    // 将每个 div 元素的 display 属性设置为 'none'，使得所有的 div 元素都不可见
                    content.style.display = 'none';
                });

                // 将 id 对应的 div 元素的 display 属性设置为 'block'，使得该 div 元素可见
                document.getElementById(id).style.display = 'block';
            });
        });
    }
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