var ws = null
function closeWs(ws) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
        ws = null;
        console.log("断开连接")
    }
}
window.addEventListener('beforeunload', () => {
    if (ws) {
        ws.close();
        ws = null;
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const { ipcRenderer } = require('electron')
    const path = require('path')
    const md5 = require('md5')
    const axios = require('axios');
    const fs = require('fs');
    const zlib = require('zlib');
    const textEncoder = new TextEncoder('utf-8');
    const textDecoder = new TextDecoder('utf-8');
    var ul = document.getElementById("danmu");
    const onlineUserCountDiv = document.getElementById('onlineUserCount');
    var damuDisappearTime = 20
    var roomId
    ipcRenderer.on('roomId', (event, arg) => {
        roomId = arg
    })
    {
        var interval = null

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
            ipcRenderer.send('packet', packet)
            // console.log(packet);
            switch (packet.op) {
                case 8:
                    // console.log('服务器收到鉴权包后的回复');
                    break;
                case 3:
                    // console.log('服务器收到心跳包的回复');\
                    onlineUserCountDiv.innerHTML = await getLiveRoomOnlineUsers(roomId);
                    break;
                case 5:
                    packet.body.forEach(async (body) => {
                        let userInfo
                        let image
                        switch (body.cmd) {
                            case 'DANMU_MSG':
                                userInfo = await getUserInfoByUid(body.info[2][0])
                                let danmuLi = document.createElement('li');
                                let danmuDiv = document.createElement('div');
                                // 姓名 弹幕内容
                                let spanName = returnSpan(`${body.info[2][1]}`, "danmuName")
                                randomColor(spanName)
                                let spanMsg = returnSpan(`${body.info[1]}`, "danmuMsg")
                                image = setImageClassBySex(userInfo.sex, userInfo.face)
                                danmuDiv.appendChild(spanName)
                                danmuDiv.appendChild(spanMsg)
                                danmuLi.append(image, danmuDiv)
                                danmuMove(ul, danmuLi)
                                if (body.info[1].startsWith("点歌 ")) {
                                    const songName = body.info[1].slice(3);
                                    ipcRenderer.send('songName', songName)
                                }
                                break;
                            case 'SEND_GIFT':
                                let imgPath = path.join(__dirname, '..', 'images', 'gift', `${body.data.giftName}.png`);
                                if (fs.existsSync(imgPath)) {
                                    for (let index = 0; index < body.data.num; index++) {
                                        addBodies(imgPath)
                                    }
                                } else {
                                    console.log(body.data.giftName + "文件不存在");
                                    for (let index = 0; index < body.data.num; index++) {
                                        addBodies(path.join(__dirname, '..', 'images', 'gift', `未知.png`))
                                    }
                                }
                                userInfo = await getUserInfoByUid(body.data.uid)
                                let giftLi = document.createElement('li');
                                let giftDiv = document.createElement('div');
                                let sendGiftUserNameSpan = returnSpan(`${body.data.uname}`)
                                randomColor(sendGiftUserNameSpan)
                                let giftNameSpan = returnSpan(`${body.data.action} ${body.data.num} 个 ${body.data.giftName}`, "elseMsg")
                                image = setImageClassBySex(userInfo.sex, userInfo.face)
                                giftDiv.appendChild(sendGiftUserNameSpan)
                                giftDiv.appendChild(giftNameSpan)
                                giftLi.append(image, giftDiv)
                                giftLi.className = "giftLi"
                                danmuMove(ul, giftLi)
                                break;
                            case 'INTERACT_WORD':
                                if (body.data.msg_type == 2) {
                                    userInfo = await getUserInfoByUid(body.data.uid)
                                    let interactLi = document.createElement('li');
                                    let interactDiv = document.createElement('div');
                                    let interactUserNameSpan = returnSpan(`${body.data.uname}`)
                                    randomColor(interactUserNameSpan)
                                    let interactMsgSpan = returnSpan(`关注了主播`, "elseMsg")
                                    image = setImageClassBySex(userInfo.sex, userInfo.face)
                                    interactDiv.appendChild(interactUserNameSpan)
                                    interactDiv.appendChild(interactMsgSpan)
                                    interactLi.append(image, interactDiv)
                                    interactLi.className = "interactLi"
                                    danmuMove(ul, interactLi)
                                }
                                // 姓名 姓名颜色
                                // danmuMove(ul, `欢迎 ${body.data.uname} ${body.data.uname_color}`)
                                break;
                            case 'GUARD_BUY':
                                userInfo = await getUserInfoByUid(body.data.uid)
                                let guardLi = document.createElement('li');
                                let guardDiv = document.createElement('div');
                                let buyGuardUserNameSpan = returnSpan(`${body.data.username}(${body.data.guard_level})`)
                                let guardNameSpan = returnSpan(`${body.data.num} 个 ${body.data.gift_name}`, "elseMsg")
                                image = setImageClassBySex(userInfo.sex, userInfo.face)
                                guardDiv.appendChild(buyGuardUserNameSpan)
                                guardDiv.appendChild(guardNameSpan)
                                guardLi.append(image, guardDiv)
                                guardLi.className = "guardLi"
                                danmuMove(ul, guardLi)
                                break;
                            case 'USER_TOAST_MSG':
                                userInfo = await getUserInfoByUid(body.data.uid)
                                let toastGuardLi = document.createElement('li');
                                let toastGuardDiv = document.createElement('div');
                                let toastGuardUserNameSpan = returnSpan(`${body.data.username}(${body.data.guard_level})`)
                                let toastGuardNameSpan = returnSpan(`${body.data.num} 个 ${body.data.role_name}(${body.data.toast_msg})`, "elseMsg")
                                image = setImageClassBySex(userInfo.sex, userInfo.face)
                                toastGuardDiv.appendChild(toastGuardUserNameSpan)
                                toastGuardDiv.appendChild(toastGuardNameSpan)
                                toastGuardLi.append(image, toastGuardDiv)
                                toastGuardLi.className = "guardLi"
                                danmuMove(ul, toastGuardLi)
                                break;
                            case 'SUPER_CHAT_MESSAGE':
                                userInfo = await getUserInfoByUid(body.data.uid)
                                let superChatLi = document.createElement('li');
                                let superChatDiv = document.createElement('div');
                                let superChatNameSpan = returnSpan(`${body.data.user_info.uname}(${body.data.price})`)
                                let superChatMsgSpan = returnSpan(`${body.data.message}`, "elseMsg")
                                image = setImageClassBySex(userInfo.sex, body.data.user_info.face)
                                superChatDiv.appendChild(superChatNameSpan)
                                superChatDiv.appendChild(superChatMsgSpan)
                                superChatLi.append(image, superChatDiv)
                                superChatLi.className = "superChatLi"
                                danmuMove(ul, superChatLi)
                                break;
                            case 'SUPER_CHAT_MESSAGE_JPN':
                                // console.log(`醒目留言-jpn${body.data}`)
                                break;
                            case 'SUPER_CHAT_MESSAGE_DELETE':
                                // console.log(`醒目留言消失${body.data}`)
                                break;
                            case 'COMBO_SEND':
                                let comboGiftpath = path.join(__dirname, '..', 'images', 'gift', `${body.data.gift_name}.png`);
                                if (fs.existsSync(comboGiftpath)) {
                                    for (let index = 0; index < body.data.combo_num; index++) {
                                        addBodies(comboGiftpath)
                                    }
                                } else {
                                    for (let index = 0; index < body.data.combo_num; index++) {
                                        addBodies(path.join(__dirname, '..', 'images', 'gift', `未知.png`))
                                    }
                                    console.log(body.data.gift_name + "文件不存在");
                                }
                                userInfo = await getUserInfoByUid(body.data.uid)
                                let comboGiftLi = document.createElement('li');
                                let comboGiftDiv = document.createElement('div');
                                let comboGiftUserNameSpan = returnSpan(`${body.data.uname}`)
                                randomColor(comboGiftUserNameSpan)
                                let comboGiftNameSpan = returnSpan(`${body.data.action} ${body.data.combo_num} 个 ${body.data.gift_name}(连击)`, "elseMsg")
                                image = setImageClassBySex(userInfo.sex, userInfo.face)
                                comboGiftDiv.appendChild(comboGiftUserNameSpan)
                                comboGiftDiv.appendChild(comboGiftNameSpan)
                                comboGiftLi.append(image, comboGiftDiv)
                                comboGiftLi.className = "giftLi"
                                danmuMove(ul, comboGiftLi)
                                break;
                            case 'LIKE_INFO_V3_CLICK':
                                console.log(`点赞`)
                                console.log(body.data.uname)
                                break;
                            case 'LIKE_INFO_V3_UPDATE':
                                // console.log(`点赞`)
                                // console.log(body)
                                break;
                            case 'ENTRY_EFFECT':
                                // console.log(`用户进场特效${body.data}`)
                                break;
                            case 'NOTICE_MSG':
                                // console.log(`消息通知${body}`)
                                break;
                            case 'WATCHED_CHANGE':
                                // console.log(`直播间看过人数${body.data}`)
                                break;
                            case 'ONLINE_RANK_COUNT':
                                // console.log(`直播间高能用户数量${body.data}`)
                                break;
                            case 'STOP_LIVE_ROOM_LIST':
                                // console.log(`下播的直播间${body.data}`)
                                break;
                            case 'ROOM_REAL_TIME_MESSAGE_UPDATE':
                                // console.log(`主播信息更新${body.data}`)
                                break;
                            case 'COMMON_NOTICE_DANMAKU':
                                // console.log(`直播间在所属分区排名提升的祝福${body.data}`)
                                break;
                            case 'POPULAR_RANK_CHANGED':
                                // console.log(`不明${body.data}`)
                                break;
                            case 'HOT_ROOM_NOTIFY':
                                // console.log(`不明${body.data}`)
                                break;
                            case 'ONLINE_RANK_V2':
                                // console.log(`高能用户相关${body.data}`)
                                break;
                            case 'ONLINE_RANK_TOP3':
                                // console.log(`高能用户前三${body.data}`)
                                break;
                            default:
                                // console.log(body.cmd)
                                // console.log(body)
                                break;
                        }
                    })
                default:
                    // console.log(arg);
                    break;
    
            }
            
        };
    }

    //////////////////////////////////////////////获取头像
    // 获取w_rid
    const mixinKeyEncTab = [
        46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
        33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
        61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
        36, 20, 34, 44, 52
    ]
    // 对 imgKey 和 subKey 进行字符顺序打乱编码
    function getMixinKey(orig) {
        let temp = ''
        mixinKeyEncTab.forEach((n) => {
            temp += orig[n]
        })
        return temp.slice(0, 32)
    }
    // 为请求参数进行 wbi 签名
    function encWbi(params, img_key, sub_key) {
        const mixin_key = getMixinKey(img_key + sub_key),
            curr_time = Math.round(Date.now() / 1000),
            chr_filter = /[!'\(\)*]/g
        let query = []
        params = Object.assign(params, { wts: curr_time })    // 添加 wts 字段
        // 按照 key 重排参数
        Object.keys(params).sort().forEach((key) => {
            query.push(
                encodeURIComponent(key) +
                '=' +
                // 过滤 value 中的 "!'()*" 字符
                encodeURIComponent(('' + params[key]).replace(chr_filter, ''))
            )
        })
        query = query.join('&')
        const wbi_sign = md5(query + mixin_key) // 计算 w_rid
        return query + '&w_rid=' + wbi_sign
    }
    // 获取最新的 img_key 和 sub_key
    async function getWbiKeys() {
        const resp = await axios({
            url: 'https://api.bilibili.com/x/web-interface/nav',
            method: 'get',
            responseType: 'json'
        }),
            json_content = resp.data,
            img_url = json_content.data.wbi_img.img_url,
            sub_url = json_content.data.wbi_img.sub_url
        return {
            img_key: img_url.substring(img_url.lastIndexOf('/') + 1, img_url.length).split('.')[0],
            sub_key: sub_url.substring(sub_url.lastIndexOf('/') + 1, sub_url.length).split('.')[0]
        }
    }
    async function getUserInfoByUid(uid) {
        const wbi_keys = await getWbiKeys()
        const query = encWbi(
            {
                mid: uid,
            },
            wbi_keys.img_key,
            wbi_keys.sub_key
        )
        try {
            const response = await fetch(`https://api.bilibili.com/x/space/wbi/acc/info?${query}`);
            const data = await response.json();

            if (data.code == "0") {
                return (data.data);
            } else {
                return {
                    sex: "查询失败",
                    face: "https://i0.hdslb.com/bfs/face/member/noface.jpg"
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    //下面是matter.js的内容////////////////////////////////////////////////////////////////////////////////////
    const Matter = require('../danmu/matter.js');
    const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse, Texture } = Matter;
    const canvasContainer = document.querySelector("#canvas-container");
    const canvas = document.createElement('canvas')
    let width = window.innerWidth;
    let height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        render.options.width = width
        render.options.height = height
        updateWalls()
        Render.setPixelRatio(render, window.devicePixelRatio)
    });

    //Add the canvas
    const engine = Engine.create();
    const { world } = engine;
    const render = Render.create({
        element: canvasContainer,
        engine: engine,
        options: {
            wireframes: false,
            width,
            height,
            background: 'rgba(255, 255, 255, 0)',
        }
    })
    Render.run(render);
    Runner.run(Runner.create(), engine)

    function addBodies(path) {
        let texture = new Image();
        texture.src = path;
        texture.onload = function () {
            let randomX = Math.floor(Math.random() * width);
            let randomY = 10;
            let yuan = Bodies.circle(randomX, randomY, 20, {
                render: {
                    sprite: {
                        texture: path, // 设置纹理
                        xScale: 20 / texture.width + 0.3, // 根据圆的大小调整横向比例
                        yScale: 20 / texture.height + 0.3 // 根据圆的大小调整纵向比例
                    }
                }
            })
            World.add(world, yuan);
            setTimeout(() => {
                World.remove(world, yuan);
            }, 20000);
        }
    }
    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
    World.add(world, mouseConstraint);

    updateWalls()
    function updateWalls() {
        const wallOptions = {
            isStatic: true, // 使墙体不受其他物体影响 
            render: { fillStyle: 'rgba(204, 204, 204, 0)' } // 设置墙体颜色 
        };
        const wallWidth = Math.min(width, height) * 0.02; // 墙体宽度设为窗口宽高的2%
        const walls = [
            Bodies.rectangle(width / 2, 0, width, wallWidth, wallOptions), // 顶部墙体
            Bodies.rectangle(width / 2, height, width, wallWidth, wallOptions), // 底部墙体
            Bodies.rectangle(0, height / 2, wallWidth, height, wallOptions), // 左侧墙体
            Bodies.rectangle(width, height / 2, wallWidth, height, wallOptions) // 右侧墙体
        ];

        World.clear(world); // 清空现有物体
        World.add(world, walls); // 添加新的墙体到物理世界
        World.add(world, mouseConstraint);
    }
    /////////////////////////////////心跳包相关方法
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

    /////////////////////////////////方法
    function danmuMove(ul, li) {
        // 滚动到最底部
        document.body.scrollTop = document.body.scrollHeight;
        document.documentElement.scrollTop = document.documentElement.scrollHeight;
        damuDisappearTime = 20
        ul.appendChild(li)
    }
    setInterval(() => {
        damuDisappearTime = damuDisappearTime - 1
        if (damuDisappearTime == 0) {
            while (ul.firstChild) {
                ul.removeChild(ul.firstChild);
            }
        }
    }, 1000);
    async function getLiveRoomOnlineUsers(roomId) {
        const response = await fetch(`https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`);
        const data = await response.json();
        return data.data.online
    }
    function setImageClassBySex(sex, scr) {
        let image = document.createElement('img');
        image.src = scr;
        if (sex === "保密") {
            image.className = "touXiangBaoMiImg"
        } else if (sex === "男") {
            image.className = "touXiangNanImg"
        } else if (sex === "女") {
            image.className = "touXiangNvImg"
        } else {
            image.className = "touXiangErrorImg"
        }
        return (image)
    }
    function randomColor(elecment) {
        // 生成一个随机颜色值
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        // 设置 span 元素的文字颜色为该随机颜色
        elecment.style.color = randomColor;
    }
    function returnSpan(text, className) {
        let span = document.createElement("span");
        span.textContent = text
        if (className) {
            span.className = className
        }
        return span
    }
})