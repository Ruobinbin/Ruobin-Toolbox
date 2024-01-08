window.addEventListener('DOMContentLoaded', () => {
    const zlib = require('zlib');
    const openMusicButton = document.getElementById("openMusic");
    const connectButton = document.getElementById("connect");
    const openLiveButton = document.getElementById("openLive");
    const minecraftServerStartButton = document.getElementById("minecraftServerStart");
    const danmuLockImg = document.getElementById("danmuLock");
    const musicLockImg = document.getElementById("musicLock");
    const roomIdInput = document.getElementById("roomId");
    const textEncoder = new TextEncoder('utf-8');
    const textDecoder = new TextDecoder('utf-8');
    const { ipcRenderer, shell } = require('electron');

    var ws = null
    var interval = null

    const readInt = function (buffer, start, len) {
        let result = 0
        for (let i = len - 1; i >= 0; i--) {
            result += Math.pow(256, len - i - 1) * buffer[start + i]
        }
        return result
    }
    const writeInt = function (buffer, start, len, value) {
        let i = 0
        while (i < len) {
            buffer[start + i] = value / Math.pow(256, len - i - 1)
            i++
        }
    }
    const encode = function (str, op) {
        let data = textEncoder.encode(str);
        let packetLen = 16 + data.byteLength;
        let header = [0, 0, 0, 0, 0, 16, 0, 1, 0, 0, 0, op, 0, 0, 0, 1]
        writeInt(header, 0, 4, packetLen)
        return (new Uint8Array(header.concat(...data))).buffer
    }

    const decoder = function (buffer) {
        let result = {}
        result.packetLen = readInt(buffer, 0, 4)
        result.headerLen = readInt(buffer, 4, 2)
        result.ver = readInt(buffer, 6, 2)
        result.op = readInt(buffer, 8, 4)
        result.seq = readInt(buffer, 12, 4)
        if (result.op === 5) {
            result.body = []
            let offset = 0;
            while (offset < buffer.length) {
                let packetLen = readInt(buffer, offset + 0, 4)
                let headerLen = 16// readInt(buffer,offset + 4,4)
                if (result.ver == 2) {
                    let data = buffer.slice(offset + headerLen, offset + packetLen);
                    let newBuffer = zlib.inflateSync(new Uint8Array(data));
                    const obj = decoder(newBuffer);
                    const body = obj.body;
                    result.body = result.body.concat(body);
                } else {
                    let data = buffer.slice(offset + headerLen, offset + packetLen);
                    let body = textDecoder.decode(data);
                    if (body) {
                        result.body.push(JSON.parse(body));
                    }
                }
                // let body = textDecoder.decode(pako.inflate(data));
                // if (body) {
                //     result.body.push(JSON.parse(body.slice(body.indexOf("{"))));
                // }
                offset += packetLen;
            }
        } else if (result.op === 3) {
            result.body = {
                count: readInt(buffer, 16, 4)
            };
        }
        return result;
    }
    const decode = function (blob) {
        return new Promise(function (resolve, reject) {
            const result = decoder(blob);
            // const result = unpack(blob);
            resolve(result)
        });
    }

    function closeWs(ws) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close();
            ws = null;
            console.log("断开连接")
        }
    }

    ipcRenderer.on('danmuWindowClose', (event, arg) => {
        closeWs(ws)
        clearInterval(interval)
    })

    connectButton.addEventListener('click', function () {
        const roomId = parseInt(roomIdInput.value);
        ipcRenderer.send('clickConnect', roomId)

        closeWs(ws)

        ws = new WebSocket('wss://broadcastlv.chat.bilibili.com:2245/sub');
        ws.onopen = function () {
            ws.send(encode(JSON.stringify({
                roomid: roomId
            }), 7));
        };
        interval = setInterval(function () {
            // if (ws && ws.readyState === WebSocket.OPEN){
            ws.send(encode('', 2));
            // console.log("这是心跳包")
            // }
        }, 30000);



        ws.onmessage = async function (msgEvent) {
            const arrayBuffer = await msgEvent.data.arrayBuffer();
            const buf = Buffer.from(arrayBuffer);
            const packet = await decode(buf);
            // console.log(packet);
            ipcRenderer.send('packet', packet)
        };
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