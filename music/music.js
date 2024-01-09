window.addEventListener('DOMContentLoaded', async () => {
    const { ipcRenderer } = require('electron')

    const qrImg = document.getElementById('qrImg')
    const songListUl = document.getElementById("musicList");
    const nowSongSpan = document.getElementById("nowSong");
    const audio = document.getElementById("musicAudio");
    const lyricsDiv = document.getElementById('lyrics');
    const lyricsDiv2 = document.getElementById('lyrics2');
    const mySongListImg = document.getElementById('mySongList')
    const startImg = document.getElementById('start');
    const skipImg = document.getElementById('skip');
    const volumeSlider = document.getElementById('volume-slider');


    const url = "https://netease-cloud-music-api-lake-omega.vercel.app"
    const userId = 417504463
    audio.volume = 0.1;
    let songList = []
    let isPlayMusic = false
    let currentLine = -1;
    let lyrics = []
    let mySongList = []
    let mySongListId
    await getmySongList(userId)
    let nowSong
    let animationFrameRequest

    //重载歌曲列表
    function renderSongList() {
        // 清空ul中的所有子元素
        songListUl.innerHTML = '';

        songList.forEach((song, index) => {
            // 创建li元素
            const li = document.createElement('li');


            const div = document.createElement('div');
            // 创建置顶按钮
            const topImg = document.createElement('img');
            topImg.setAttribute('src', '../images/topSong.png');
            topImg.width = 25; 
            topImg.height = 25; 
            topImg.addEventListener('click', () => {
                // 将当前歌曲对象从songList数组中删除，并插入到数组的第一个位置
                songList.splice(index, 1);
                songList.unshift(song);
                // 重新渲染歌曲列表到ul中
                renderSongList();
            });
            topImg.classList.add('noDrag');
            // 将按钮添加到li元素中
            div.appendChild(topImg);

            div.appendChild(document.createTextNode(song.name))

            // 创建置顶按钮
            const delImg = document.createElement('img');
            delImg.setAttribute('src', '../images/delSong.png');
            delImg.width = 25; 
            delImg.height = 25; 
            delImg.addEventListener('click', () => {
                // 将当前歌曲对象从songList数组中删除
                songList.splice(index, 1);
                // 重新渲染歌曲列表到ul中
                renderSongList();
            });
            delImg.classList.add('noDrag');
            // 将按钮添加到li元素中
            div.appendChild(delImg);
            li.appendChild(div);

            // 将li元素添加到ul中
            songListUl.appendChild(li);
        });
    }

    function getRandomElement(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    async function getmySongList(userId) {
        let playList = await getPlayListByUid(userId)
        for (const songlist of playList) {
            if (songlist.name === "--tat喜欢的音乐") {
                mySongListId = songlist.id
                mySongList = []
                let songs = await getSongsBySongListId(songlist.id)
                songs.forEach(songInfo => {
                    let song = {
                        id: songInfo.id,
                        name: songInfo.name,
                    };
                    mySongList.push(song)
                });
                break;
            }
        }
    }

    function updateLyrics() {
        let currentTime = audio.currentTime * 1000;
        for (let i = 0; i < lyrics.length; i++) {
            if (currentTime >= lyrics[i][0][0] && currentTime < lyrics[i][0][0] + lyrics[i][0][1]) {
                if (currentLine !== i) {
                    currentLine = i;
                    let text = ""
                    let text2 = ""
                    if (typeof lyrics[i][1][0] === 'string') {
                        text = lyrics[i][1][1]
                        if (i + 1 < lyrics.length) {
                            text2 = lyrics[i + 1][1][1]
                        }
                    } else {
                        for (let index = 0; index < lyrics[i][1].length; index++) {
                            text += lyrics[i][1][index][1]
                        }
                        if (i + 1 < lyrics.length) {
                            for (let index = 0; index < lyrics[i + 1][1].length; index++) {
                                text2 += lyrics[i + 1][1][index][1]
                            }
                        }
                    }
                    lyricsDiv.innerText = text
                    lyricsDiv2.innerText = text2
                }
                break;
            }
        }
    }

    function animateLyricsWhilePlaying() {
        animationFrameRequest = requestAnimationFrame(animateLyricsWhilePlaying);
        updateLyrics();
    }

    async function playNext() {
        // 如果还有音乐未播放，则继续播放
        if (songList.length > 0) {
            nowSong = songList.shift()
            renderSongList()
            nowSongSpan.textContent = "正在播放:" + nowSong.name
            //判断当前播放是否为收藏
            if (mySongList.some(song => song.id === nowSong.id)) {
                startImg.setAttribute('src', '../images/start_on.png');
            } else {
                startImg.setAttribute('src', '../images/start_off.png');
            }

            startImg.style.display = 'block';
            skipImg.style.display = 'block';

            lyrics = nowSong.lyrics

            audio.setAttribute("src", nowSong.url);
            audio.play();
        } else if (mySongListImg.src.charAt(mySongListImg.src.length - 5) == "n") {
            let randoSong
            while (true) {
                randoSong = getRandomElement(mySongList)
                let msg = await checkMusic(randoSong.id)
                if (msg === "ok") {
                    break
                }
            }
            let song = {
                id: randoSong.id,
                name: randoSong.name,
                url: await getSongUrl(randoSong.id),
                lyrics: await getSongLyric(randoSong.id)
            };
            if (song.url !== "未登录") {
                songList.push(song)
                playNext();
            }
        } else {
            // 如果没有音乐可播放，则暂停播放，并将 isPlayMusic 设置为 false
            nowSongSpan.textContent = "正在播放:没了"
            startImg.style.display = 'none';
            skipImg.style.display = 'none';
            audio.pause();
            isPlayMusic = false;
        }
    }
    // 监听音频播放状态变化
    audio.addEventListener("ended", function () {
        lyricsDiv.innerText = ""
        lyricsDiv2.innerText = ""
        playNext();
    });
    audio.addEventListener('playing', () => {
        animateLyricsWhilePlaying();
    });
    audio.addEventListener('pause', () => {
        cancelAnimationFrame(animationFrameRequest);
    });

    async function login() {
        // 获取 unikey
        const response1 = await fetch(`${url}/login/qr/key?timestamp=${Date.now()}`);
        const data1 = await response1.json();
        let key = data1.data.unikey;
        // 创建二维码
        const response2 = await fetch(`${url}/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`);
        const data2 = await response2.json();
        qrImg.src = data2.data.qrimg;
        // 轮询检查二维码状态
        timer = setInterval(async () => {
            let response = await fetch(`${url}/login/qr/check?key=${key}&timestamp=${Date.now()}`);
            let data = await response.json();
            let code = data.code
            if (code === 800) {
                alert('二维码已过期,请重新获取')
                qrImg.src = ""
                clearInterval(timer)
            }
            if (code === 803) {
                // 这一步会返回cookie
                clearInterval(timer)
                qrImg.src = ""
                alert('授权登录成功')
            }
        }, 3000)

    }

    async function getSongInfo(songName) {
        try {
            const response = await fetch(`${url}/cloudsearch?keywords=${songName}`)
            const data = await response.json()
            return data.result.songs[0]
        } catch (error) {
            console.log("访问歌曲信息异常:" + error)
            return
        }
    }

    async function startSong(op, songListId, songId) {
        const response = await fetch(`${url}/playlist/tracks?op=${op}&pid=${songListId}&tracks=${songId}`)
        const data = await response.json()
        if (data.body.code === 200) {
            return true
        } else {
            return false
        }
    }

    async function getSongUrl(songId) {
        const response = await fetch(`${url}/song/url/v1?id=${songId}&level=lossless`)
        const data = await response.json()
        if (data.data[0].url !== null && url !== '') {
            return data.data[0].url
        } else {
            login()
            return "未登录"
        }
    }

    async function getSongsBySongListId(songListId) {
        const response = await fetch(`${url}/playlist/track/all?id=${songListId}`)
        const data = await response.json();
        return data.songs
    }

    async function getPlayListByUid(uid) {
        const response = await fetch(`${url}/user/playlist?uid=${uid}`);
        const data = await response.json();
        return data.playlist
    }

    async function checkMusic(songId) {
        const response = await fetch(`${url}/check/music?id=${songId}`)
        const data = await response.json()
        return data.message
    }

    async function getSongLyric(songId) {
        let geCi = []
        const response = await fetch(`${url}/lyric/new?id=${songId}`)
        const data = await response.json()
        if (data.yrc) {
            const lines = data.yrc.lyric.trim().split('\n');
            for (const line of lines) {
                if (line.startsWith('[')) {
                    const tokens = line.trim().split('(');
                    let hang = [JSON.parse("[" + tokens.shift().slice(1, -1) + "]"), []]
                    tokens.forEach(element => {
                        let word = element.trim().split(')');
                        word[0] = word[0].split(',').map(Number);
                        hang[1].push(word)
                    });
                    geCi.push(hang)
                }
            }
        } else {
            const lines = data.lrc.lyric.trim().split('\n');
            for (let index = 0; index < lines.length; index++) {
                if (lines[index].startsWith('[')) {
                    const tokens = lines[index].trim().split(']');
                    let str = tokens[0].slice(1)
                    let res = parseInt(str.substr(0, 2)) * 60000 + parseFloat(str.substr(3, 6) * 1000)
                    let res2 = 10000
                    if (index + 1 < lines.length) {
                        let tokens = lines[index + 1].trim().split(']');
                        let str = tokens[0].slice(1)
                        res2 = parseInt(str.substr(0, 2)) * 60000 + parseFloat(str.substr(3, 6) * 1000) - res
                    }
                    geCi.push([[res, res2], tokens])
                }
            }
        }
        return geCi
    }

    ipcRenderer.on('songName', async (event, arg) => {
        let songInfo = await getSongInfo(arg)
        let song = {
            id: songInfo.id,
            name: songInfo.name,
            url: await getSongUrl(songInfo.id),
            lyrics: await getSongLyric(songInfo.id)
        };
        if (song.url !== "未登录") {
            songList.push(song)
            renderSongList()
            if (isPlayMusic === false) {
                isPlayMusic = true;
                playNext();
            }
        }
    })

    mySongListImg.addEventListener('click', async function () {
        if (mySongListImg.src.charAt(mySongListImg.src.length - 5) == "f") {
            mySongListImg.src = mySongListImg.src.slice(0, -7) + "on.png";
            await getmySongList(userId)
            if (isPlayMusic === false) {
                isPlayMusic = true;
                playNext();
            }
        } else {
            mySongListImg.src = mySongListImg.src.slice(0, -6) + "off.png";
            mySongList = []
        }
    });

    startImg.addEventListener('click', async function () {
        if (startImg.src.includes('off')) {
            if (await startSong("add", mySongListId, nowSong.id)) {
                startImg.setAttribute('src', '../images/start_on.png');
                let song = {
                    id: nowSong.id,
                    name: nowSong.name,
                };
                mySongList.push(song)
            }
        } else {
            if (await startSong("del", mySongListId, nowSong.id)) {
                startImg.setAttribute('src', '../images/start_off.png');
                mySongList = mySongList.filter(item => item.id !== nowSong.id);
            }
        }
    });

    skipImg.addEventListener('click', function () {
        audio.currentTime = audio.duration;
    });

    // 给滑动条添加 input 事件，当滑动条的值改变时调整音量
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value; // 将音量设置为滑动条的值
    });

})