window.addEventListener('DOMContentLoaded', () => {
    const { spawn } = require('child_process');
    const { ipcRenderer } = require('electron')

    const playerName = "Ruo_bin"
    const startBatPath = "D:/1minecraft/servers/StellarisCraft_v1.1.6_Server/run.bat"
    const runPath = "D:/1minecraft/servers/StellarisCraft_v1.1.6_Server"

    const minecraftMob = [
        ["烈焰人", "minecraft:blaze"],
        ["苦力怕", "minecraft:creeper"],
        ["溺尸", "minecraft:drowned"],
        ["远古守卫者", "minecraft:elder_guardian"],
        ["末影螨", "minecraft:end_mite"],
        ["唤魔者", "minecraft:evoker"],
        ["恶魂", "minecraft:ghast"],
        ["守卫者", "minecraft:guardian"],
        ["疣猪兽", "minecraft:hoglin"],
        ["尸壳", "minecraft:husk"],
        ["岩浆怪", "minecraft:magma_cube"],
        ["幻翼", "minecraft:phantom"],
        ["猪灵蛮兵", "minecraft:piglin_brute"],
        ["掠夺者", "minecraft:pillager"],
        ["劫掠兽", "minecraft:ravager"],
        ["潜影贝", "minecraft:shulker"],
        ["蠹虫", "minecraft:silverfish"],
        ["骷髅", "minecraft:skeleton"],
        ["史莱姆", "minecraft:slime"],
        ["流浪者", "minecraft:stray"],
        ["恼鬼", "minecraft:vex"],
        ["卫道士", "minecraft:vindicator"],
        ["女巫", "minecraft:witch"],
        ["凋灵骷髅", "minecraft:wither_skeleton"],
        ["僵尸疣猪兽", "minecraft:zoglin"],
        ["僵尸村民", "minecraft:zombie_villager"],
        ["僵尸", "minecraft:zombie"],
        ["洞穴蜘蛛", "minecraft:cave_spider"],
        ["末影人", "minecraft:enderman"],
        ["猪灵", "minecraft:piglin"]
        ["蜘蛛", "minecraft:spider"],
        ["僵尸猪灵", "minecraft:zombified_piglin"],
    ]
    const minecraftAllBuff = [
        ["迅捷", "minecraft:speed"],
        ["缓慢", "minecraft:slowness"],
        ["急迫", "minecraft:haste"],
        ["挖掘疲劳", "minecraft:mining_fatigue"],
        ["力量", "minecraft:strength"],
        ["瞬间治疗", "minecraft:instant_health"],
        ["瞬间伤害", "minecraft:instant_damage"],
        ["跳跃提升", "minecraft:jump_boost"],
        ["反胃", "minecraft:nausea"],
        ["生命恢复", "minecraft:regeneration"],
        ["抗性提升", "minecraft:resistance"],
        ["抗火", "minecraft:fire_resistance"],
        ["水下呼吸", "minecraft:water_breathing"],
        ["隐身", "minecraft:invisibility"],
        ["失明", "minecraft:blindness"],
        ["夜视", "minecraft:night_vision"],
        ["饥饿", "minecraft:hunger"],
        ["虚弱", "minecraft:weakness"],
        ["中毒", "minecraft:poison"],
        ["凋零", "minecraft:wither"],
        ["生命提升", "minecraft:health_boost"],
        ["伤害吸收", "minecraft:absorption"],
        ["饱和", "minecraft:saturation"],
        ["发光", "minecraft:glowing"],
        ["飘浮", "minecraft:levitation"],
        ["幸运", "minecraft:luck"],
        ["霉运", "minecraft:unluck"],
        ["缓降", "minecraft:slow_falling"],
        ["潮涌能量", "minecraft:conduit_power"],
        ["海豚的恩惠", "minecraft:dolphins_grace"],
        ["不祥之兆", "minecraft:bad_omen"],
        ["村庄英雄", "minecraft:hero_of_the_village"],
        ["黑暗", "minecraft:darkness"],
    ]
    const minecraftBuff = [
        ["迅捷", "minecraft:speed"],
        ["急迫", "minecraft:haste"],
        ["力量", "minecraft:strength"],
        ["瞬间治疗", "minecraft:instant_health"],
        ["跳跃提升", "minecraft:jump_boost"],
        ["生命恢复", "minecraft:regeneration"],
        ["抗性提升", "minecraft:resistance"],
        ["抗火", "minecraft:fire_resistance"],
        ["水下呼吸", "minecraft:water_breathing"],
        ["隐身", "minecraft:invisibility"],
        ["夜视", "minecraft:night_vision"],
        ["生命提升", "minecraft:health_boost"],
        ["伤害吸收", "minecraft:absorption"],
        ["饱和", "minecraft:saturation"],
        ["幸运", "minecraft:luck"],
        ["缓降", "minecraft:slow_falling"],
        ["潮涌能量", "minecraft:conduit_power"],
        ["海豚的恩惠", "minecraft:dolphins_grace"],
        ["村庄英雄", "minecraft:hero_of_the_village"],
    ]
    const minecraftDeBuff = [
        ["缓慢", "minecraft:slowness"],
        ["挖掘疲劳", "minecraft:mining_fatigue"],
        ["反胃", "minecraft:nausea"],
        ["失明", "minecraft:blindness"],
        ["饥饿", "minecraft:hunger"],
        ["虚弱", "minecraft:weakness"],
        ["中毒", "minecraft:poison"],
        ["凋零", "minecraft:wither"],
        ["发光", "minecraft:glowing"],
        ["飘浮", "minecraft:levitation"],
        ["霉运", "minecraft:unluck"],
        ["不祥之兆", "minecraft:bad_omen"],
        // ["黑暗", "minecraft:darkness"],
    ]
    const mowziesmobs = [
        ["钢铁守护者", "mowziesmobs:ferrous_wroughtnaut"],
        ["冻霜巨兽", "mowziesmobs:frostmaw"],
        ["太阳酋长", "mowziesmobs:barako"],
    ]
    const mutantmonsters = [
        ["突变苦力怕", "mutantmonsters:mutant_creeper"],
        ["突变僵尸", "mutantmonsters:mutant_zombie"],
        ["突变小黑", "mutantmonsters:mutant_enderman"],
        ["突变小白", "mutantmonsters:mutant_skeleton"],
        ["突变蜘蛛猪", "mutantmonsters:spider_pig"],
        ["突变雪傀儡", "mutantmonsters:mutant_snow_golem"],
    ]
    const mutantmore = [
        ["突变潜影贝", "mutantmore:mutant_shulker"],
        ["突变烈焰人", "mutantmore:mutant_blaze"],
        ["突变凋零骷髅", "mutantmore:mutant_wither_skeleton"],
        ["突变疣猪兽", "mutantmore:mutantmore:mutant_hoglin"],
        ["突变尸壳", "mutantmore:mutant_husk"],
    ]
    const mutantbeasts = [
        ["突变苦力怕", "mutantbeasts:mutant_creeper"],
        ["突变末影人", "mutantbeasts:mutant_enderman"],
        ["突变骷髅", "mutantbeasts:mutant_skeleton"],
        ["突变苦力怕", "mutantbeasts:mutant_snow_golem"],
        ["突变苦力怕", "mutantbeasts:mutant_zombie"],
        ["突变苦力怕", "mutantbeasts:spider_pig"],
    ]
    const fme = [
        ["突变溺尸", "fme:me_1"],
        ["fme:me_1_en", "fme:me_1_en"],
        ["突变掠夺者", "fme:me_1_illagel"],
        ["突变僵尸猪人", "fme:me_1_ne"],
        ["突变溺尸", "fme:me_2"],
        ["fme:me_2_en", "fme:me_2_en"],
        ["突变卫道士", "fme:me_2_illagel"],
        ["fme:me_3_en", "fme:me_3_en"],

    ]
    const mutant = [
        ["突变潜影贝", "mutantmore:mutant_shulker"],
        ["突变烈焰人", "mutantmore:mutant_blaze"],
        ["突变凋零骷髅", "mutantmore:mutant_wither_skeleton"],
        ["突变疣猪兽", "mutantmore:mutant_hoglin"],
        ["突变尸壳", "mutantmore:mutant_husk"],

        ["突变苦力怕", "mutantbeasts:mutant_creeper"],
        ["突变末影人", "mutantbeasts:mutant_enderman"],
        ["突变骷髅", "mutantbeasts:mutant_skeleton"],
        ["突变雪傀儡", "mutantbeasts:mutant_snow_golem"],
        ["突变僵尸", "mutantbeasts:mutant_zombie"],
        ["突变蜘蛛猪", "mutantbeasts:spider_pig"],

        ["突变溺尸", "fme:me_1"],
        // ["fme:me_1_en", "fme:me_1_en"],
        ["突变掠夺者", "fme:me_1_illagel"],
        ["突变僵尸猪人", "fme:me_1_ne"],
        ["突变溺尸", "fme:me_2"],
        // ["fme:me_2_en", "fme:me_2_en"],
        ["突变卫道士", "fme:me_2_illagel"],
        // ["fme:me_3_en", "fme:me_3_en"],
    ]
    const twilightforestBoss = [
        ["娜迦", "twilightforest:naga"],
        ["巫妖", "twilightforest:lich"],
        ["九头蛇", "twilightforest:hydra"],
        ["暮色恶魂 ", "twilightforest:ur_ghast"],
        ["雪怪首领", "twilightforest:yeti_alpha"],
        ["冰雪女王", "twilightforest:snow_queen"],
    ]
    const twilightforestEntity = [
        ["幻影骑士", "twilightforest:knight_phantom"],
        ["雪怪", "twilightforest:yeti"],
        ["冰精灵", "twilightforest:stable_ice_core"],
        ["破碎冰精灵", "twilightforest:unstable_ice_core"],
        ["蚊群", "twilightforest:mosquito_swarm"],
        ["洞穴巨魔", "twilightforest:troll"],
        ["恶狼 ", "twilightforest:hostile_wolf"],
        ["哥布林", "twilightforest:kobold"],
        ["国王蜘蛛", "twilightforest:king_spider"],
        ["红帽哥布林", "twilightforest:redcap"],
        ["红帽地精", "twilightforest:redcap_sapper"],
        ["寒冬狼", "twilightforest:winter_wolf"],
        ["集群蜘蛛", "twilightforest:swarm_spider"],
        ["寄居蟹", "twilightforest:helmet_crab"],
        // ["哥布林骑士上身", "twilightforest:upper_goblin_knight"],
        // ["哥布林骑士下身", "twilightforest:lower_goblin_knight"],
        // ["坤铅铁傀儡", "twilightforest:carminite_golem"],
        // ["坤铅寄生虫", "twilightforest:carminite_broodling"],
        // ["坤铅守卫", "twilightforest:carminite_ghastguard"],
        // ["坤铅寄恶灵", "twilightforest:carminite_ghastling"],
        ["武装巨人", "twilightforest:armored_giant"],
        ["巨人矿工", "twilightforest:giant_miner"],
        ["链锤哥布林", "twilightforest:blockchain_goblin"],
        ["死灵书", "twilightforest:death_tome"],
        ["喷火甲虫", "twilightforest:fire_beetle"],
        ["树篱蜘蛛", "twilightforest:hedge_spider"],
        ["冰精", "twilightforest:ice_crystal"],
        ["迷宫史莱姆", "twilightforest:maze_slime"],
        ["米诺菇", "twilightforest:minoshroom"],
        ["牛头人", "twilightforest:minotaur"],
        ["迷雾狼", "twilightforest:mist_wolf"],
        ["巨钳甲虫", "twilightforest:pinch_beetle"],
        ["粘液甲虫", "twilightforest:slime_beetle"],
        ["冰雪守卫", "twilightforest:snow_guardian"],
        // ["塔木蛀虫", "twilightforest:towerwood_borer"],
        ["幽灵", "twilightforest:wraith"],
    ]
    const cataclysmBoss = [
        ["末影守卫", "cataclysm:ender_guardian"],
        ["焰魔", "cataclysm:ignis"],
        ["下届合金巨兽", "cataclysm:netherite_monstrosity"],
        // ["先驱者", "cataclysm:the_harbinger"],
    ]
    const tacGun = [
        ["M1911", "tac:m1911"],
        ["格洛克17", "tac:glock_17"],
        ["塔兰战术STI2011", "tac:sti2011"],
        ["沙漠之鹰", "tac:deagle_357"],
        ["CZ75手枪", "tac:cz75"],
        ["CZ75自动手枪", "tac:cz75_auto"],
        ["黑钢战术 TTI G34 手枪", "tac:tti_g34"],

        ["维克托冲锋枪", "tac:vector45"],
        ["英格拉姆Mac10", "tac:micro_uzi"],
        ["M1191", "tac:hk_mp5a5"],
        ["HK MP5A5冲锋枪", "tac:mp7"],
        ["MP7冲锋枪", "tac:m1191"],

        ["M24狙击步枪", "tac:m24"],
        ["AWM狙击步枪", "tac:ai_awp"],

        ["截短双管猎枪", "tac:db_short"],
        ["AA12突击散弹枪", "tac:aa_12"],
        ["雷明顿M870", "tac:m870_classic"],
        ["M1014战术散弹枪", "tac:m1014"],

        ["M60 机枪", "tac:m60"],
        ["DP-28机枪", "tac:dp28"],
        ["RPK轻机枪", "tac:rpk"],

        ["AK47", "tac:ak47"],
        ["M4A1", "tac:m4"],
        ["QBZ95_1", "tac:qbz_95"],
        ["MK14 EBR 精确步枪", "tac:mk14"],
        ["HK416 A5 突击步枪", "tac:hk416_a5"],
        ["81-1突击步枪", "tac:type81_x"],
        ["FN FAL 突击步枪", "tac:fn_fal"],
        ["SKS 战术步枪", "tac:sks_tactical"],
        ["M16A4 突击步枪", "tac:m16a4"],
        ["SCAR H 突击步枪", "tac:scar_h"],
        ["SCAR L 突击步枪", "tac:scar_l"],
        ["MK47 突击步枪", "tac:mk47"],
        ["射手座 SPR-15 精确步枪", "tac:spr15"],
        ["MK18 MOD1 突击步枪", "tac:mk18_mod1"],
    ]
    const tacbullet = [
        [".45 ACP子弹", "tac:round45"],
        [".50 AE手枪子弹", "tac:ae50"],
        [".30子弹", "tac:win_30-30"],
        [".308子弹", "tac:bullet_308"],
        ["5.56mm子弹", "tac:nato_556_bullet"],
        ["9mm子弹", "tac:9mm_round"],
        ["12号散弹", "tac:10_gauge_round"],
        ["5.8mmDBP87子弹", "tac:58x42"],
        ["7.62mm托卡列夫子弹", "tac:762x25"],
        ["7.62x54mm子弹", "tac:762x54"],
        ["7.62x39mm子弹", "tac:762x39"],
        [".50 BMG 狙击子弹", "tac:50bmg"],
        [".338 Lapua 狙击子弹", "tac:lapua338"],
        ["6.8mm步枪子弹", "tac:bullet68"],

        ["F1手雷", "tac:light_grenade"],
        ["M67延时引信手雷", "tac:baseball_grenade"],
    ]




    const bat = spawn('cmd.exe', ['/c', startBatPath], {
        cwd: runPath,
    });

    bat.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    bat.stderr.on('data', (data) => {
        console.error(data.toString());
    });

    bat.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
    });

    ipcRenderer.on('packet', async (event, arg) => {
        switch (arg.op) {
            case 8:
                break;
            case 3:
                break;
            case 5:
                arg.body.forEach(async (body) => {
                    let giftName
                    let num
                    let userName
                    let price
                    switch (body.cmd) {
                        case 'DANMU_MSG':
                            let name = body.info[2][1]
                            let msg = body.info[1]
                            if (msg == "1145") {
                                summonEntity(name, "僵尸", "minecraft:zombie")
                            }
                            break;
                        case 'SEND_GIFT':
                            giftName = body.data.giftName
                            num = body.data.num
                            userName = body.data.uname
                            price = body.data.price
                            qunXing(giftName, num, userName, price)
                            break;
                        case 'INTERACT_WORD':
                            userName = body.data.uname
                            if (body.data.msg_type == 2) {
                                for (let index = 0; index < 10; index++) {
                                    summonEntity(userName, "僵尸", "minecraft:zombie")
                                }
                            }
                            break;
                        case 'GUARD_BUY':
                            let count = 0;
                            const interval = setInterval(function () {
                                count++;
                                randomFirework()
                                randomFirework()
                                randomFirework()
                                if (count === 60) {
                                    clearInterval(interval);
                                }
                            }, 1000);
                            break;
                        case 'USER_TOAST_MSG':
                            break;
                        case 'SUPER_CHAT_MESSAGE':
                            break;
                        case 'SUPER_CHAT_MESSAGE_JPN':
                            break;
                        case 'SUPER_CHAT_MESSAGE_DELETE':
                            break;
                        case 'COMBO_SEND':
                            giftName = body.data.gift_name
                            num = body.data.combo_num
                            userName = body.data.uname
                            price = body.data.combo_total_coin / num
                            qunXing(giftName, num, userName, price)
                            break;
                        case 'LIKE_INFO_V3_CLICK':
                            summonEntity(body.data.uname, "尸壳", "minecraft:husk")
                            summonEntity(body.data.uname, "尸壳", "minecraft:husk")
                            summonEntity(body.data.uname, "尸壳", "minecraft:husk")
                            break;
                        case 'LIKE_INFO_V3_UPDATE':
                            break;
                        case 'ENTRY_EFFECT':
                            break;
                        case 'NOTICE_MSG':
                            break;
                        case 'WATCHED_CHANGE':
                            break;
                        case 'ONLINE_RANK_COUNT':
                            break;
                        case 'STOP_LIVE_ROOM_LIST':
                            break;
                        case 'ROOM_REAL_TIME_MESSAGE_UPDATE':
                            break;
                        case 'COMMON_NOTICE_DANMAKU':
                            break;
                        case 'POPULAR_RANK_CHANGED':
                            break;
                        case 'HOT_ROOM_NOTIFY':
                            break;
                        case 'ONLINE_RANK_V2':
                            break;
                        case 'ONLINE_RANK_TOP3':
                            break;
                        default:
                            break;
                    }
                })
            default:
                break;

        }
    })


    function giftTOMinecraft(giftName, num, userName, price) {
        for (let index = 0; index < num; index++) {
            switch (giftName) {
                case "辣条":
                    summonEntity(userName, "僵尸", "minecraft:zombie")
                    break;
                case "flag":
                    summonEntity(userName, "忠臣僵尸", "twilightforest:loyal_zombie")
                    break;
                case "小花花":
                    randomItem(tacbullet, 30)
                    break;
                case "小蝴蝶":
                    summonEntity(userName, "闪电苦力怕", "minecraft:creeper", `{CustomName:'{"text":"${userName}"}',CustomNameVisible:1b,powered:1}`)
                    break;
                case "牛哇牛哇":
                    randomEntity(minecraftMob, userName)
                    break;
                case "牛哇":
                    randomEntity(minecraftMob, userName)
                    break;
                case "棒棒糖":
                    summonEntity(userName, "狗子", "minecraft:wolf", `{CustomName:'{"text":"${userName}"}',CustomNameVisible:1b,Owner:${playerName}, Tame:1}`)
                    break;
                case "稳":
                    randomRareEntity(userName)
                    break;
                case "打call":
                    summonEntity(userName, "铁傀儡", "minecraft:iron_golem")
                    break;
                case "PK票":
                    summonEntity(userName, "雪傀儡", "minecraft:snow_golem")
                    break;
                case "盛典门票":
                    giveItem(userName, "附魔金苹果", "minecraft:totem_of_undying")
                    break;
                case "给大佬递茶":
                    giveItem(userName, "附魔金苹果", "minecraft:enchanted_golden_apple")
                    break;
                case "人气票":
                    randomBuff(userName, minecraftBuff)
                    break;
                case "心动卡":
                    randomBuff(userName, minecraftDeBuff)
                    break;
                case "奈斯":
                    sendMsgTOServer(`/effect clear ${playerName}`)
                    break;
                case "粉丝团灯牌":
                    randomEntity(twilightforestEntity, userName)
                    break;
                case "666":
                    randomItem(tacGun)
                    break;
                case "这个好诶":
                    for (let index = 0; index < 10; index++) {
                        summonEntity(userName, "铁套僵尸", "minecraft:zombie", `{CustomName:'{"text":"${userName}"}',CustomNameVisible:1b,ArmorItems:[{id:"iron_boots",Count:1b},{id:"iron_leggings",Count:1b},{id:"iron_chestplate",Count:1b},{id:"iron_helmet",Count:1b}],HandItems:[{id:"iron_sword",Count:1b}]}`)
                    }
                    break;
                case "小蛋糕":
                    for (let index = 0; index < 10; index++) {
                        summonEntity(userName, "钻套僵尸", "minecraft:zombie", `{CustomName:'{"text":"${userName}"}',CustomNameVisible:1b,ArmorItems:[{id:"diamond_boots",Count:1b},{id:"diamond_leggings",Count:1b},{id:"diamond_chestplate",Count:1b},{id:"diamond_helmet",Count:1b}],HandItems:[{id:"diamond_sword",Count:1b}]}`)
                    }
                    break;
                case "锄头":
                    for (let index = 0; index < 10; index++) {
                        summonEntity(userName, "下届套僵尸", "minecraft:zombie", `{CustomName:'{"text":"${userName}"}',CustomNameVisible:1b,ArmorItems:[{id:"netherite_boots",Count:1b},{id:"netherite_leggings",Count:1b},{id:"netherite_chestplate",Count:1b},{id:"netherite_helmet",Count:1b}],HandItems:[{id:"netherite_sword",Count:1b}]}`)
                    }
                    break;
                case "水晶之恋":
                    sendMsgTOServer(`/execute at ${playerName} run summon minecraft:tnt ~ ~ ~ {Fuse:80s}`)
                    break;
                case "泡泡机":
                    sendMsgTOServer(`/execute at ${playerName} run tp ~ 100 ~`)
                    break;
                case "情书":
                    randomEntity(mutant, userName)
                    break;
                case "干杯":
                    summonEntity(userName, "突变雪傀儡", "mutantmonsters:mutant_snow_golem")
                    break;
                // case "星河入梦":
                //     summonEntity(userName, "监守者", "minecraft:warden")
                //     break;
                case "草莓蛋糕":
                    summonEntity(userName, "凋零", "minecraft:wither")
                    break;
                case "前方高能":
                    randomEntity(twilightforestBoss, userName)
                    break;
                case "么么":
                    randomEntity(mowziesmobs, userName)
                    break;
                case "再来亿把":
                    randomEntity(cataclysmBoss, userName)
                    break;
                case "贴贴":
                    sendMsgTOServer(`/tp @e ${userName}`)
                    break;
                case "春暖花开":
                    sendMsgTOServer(`/kill @e[type=!minecraft:player]`)
                    break;
                case "告白花束":
                    sendMsgTOServer(`/enhancedcelestials setLunarEvent enhancedcelestials:blood_moon`)
                    break;
                case "花式夸夸":
                    sendMsgTOServer(`/enhancedcelestials setLunarEvent enhancedcelestials:super_blood_moon`)
                    break;
                case "动鳗电池":
                    sendMsgTOServer(`/enhancedcelestials setLunarEvent enhancedcelestials:default`)
                    break;
                    // case "星月盲盒":
                    //     console.log(body)
                    // case "心动盲盒":
                    //     console.log(body)
                    //     break;
                    // case "闪耀盲盒":
                    //     console.log(body)
                    //     break;
                    // case "至尊盲盒":
                    //     console.log(body)
                    break;
                case "璀璨烟火":
                    let count = 0;
                    const interval = setInterval(function () {
                        count++;
                        randomFirework()
                        randomFirework()
                        randomFirework()
                        if (count === 60) {
                            clearInterval(interval);
                        }
                    }, 1000);
                    break;
                default:
                    for (let index = 0; index < price / 100; index++) {
                        randomFirework()
                    }
                    break;
            }
        }
    }

    function qunXing(giftName, num, userName, price) {
        for (let index = 0; index < num; index++) {
            switch (giftName) {
                case "辣条":
                    summonEntity(userName, "溺尸", "minecraft:drowned")
                    break;
                case "小花花":
                    randomEntity(userName, minecraftMob)
                    break;
                case "稳":
                    summonEntity(userName, "狗子", "minecraft:wolf", `{CustomName:'{"text":"${userName}"}',CustomNameVisible:1b,Owner:${playerName}, Tame:1}`)
                    break;
                case "打call":
                    summonEntity(userName, "铁傀儡", "minecraft:iron_golem")
                    break;
                case "前方高能":
                    randomEntity(userName, mowziesmobs, cataclysmBoss)
                    break;
                default:
                    for (let index = 0; index < price / 100; index++) {
                        randomFirework()
                    }
                    break;
            }
        }
    }


    function sendMsgTOServer(msg) {
        bat.stdin.write(`${msg}\n`);
    }
    function randomFirework() {
        let colorCount = Math.floor(Math.random() * 3) + 1
        let color = ""
        for (let index = 0; index < colorCount; index++) {
            color += Math.floor(Math.random() * 16777216) + ","
        }
        let fadeColors = Math.floor(Math.random() * 16777216)
        let flicker = Math.floor(Math.random() * 2)
        let trail = Math.floor(Math.random() * 2)
        let type = Math.floor(Math.random() * 5)
        let lifeTime = Math.floor(Math.random() * 4 + 3) * 10
        let offsetX = Math.floor(Math.random() * 20) - 10
        let offsetZ = Math.floor(Math.random() * 20) - 10
        sendMsgTOServer(`/execute at ${playerName} run summon minecraft:firework_rocket ~${offsetX} ~2 ~${offsetZ} {LifeTime:${lifeTime},FireworksItem:{id:firework_rocket,Count:1,tag:{Fireworks:{Explosions:[{Type:${type},Colors:[I;${color}],FadeColors:[I;${fadeColors}],Flicker:${flicker},Trail:${trail}}]}}}}`)
    }
    function randomBuff(userName, ...arrays) {
        let buffList = [].concat(...arrays);
        let Buff = buffList[Math.floor(Math.random() * buffList.length)]
        let level = Math.floor(Math.random() * 10)
        sendMsgTOServer(`/effect give ${playerName} ${Buff[1]} 60 ${level}`)
        sendMsgTOServer(`/say §e${userName}§f给予了§b${Buff[0]}§c${level}`)
    }
    function randomRareEntity(userName) {
        let offsetX = Math.floor(Math.random() * 11) - 5
        let offsetZ = Math.floor(Math.random() * 11) - 5
        const rareEntity = [
            ["Johnny", `/execute at ${playerName} run summon minecraft:vindicator ~${offsetX} ~2 ~${offsetZ} {CustomName:'{"text":"Johnny"}',Johnny:1b,HandItems:[{id:"minecraft:iron_axe",Count:1b}]}`],
            ["彩虹羊", `/execute at ${playerName} run summon minecraft:sheep ~${offsetX} ~2 ~${offsetZ} {CustomName:'{"text":"jeb_"}'}`],
            ["Toast", `/execute at ${playerName} run summon minecraft:rabbit ~${offsetX} ~2 ~${offsetZ} {CustomName:'{"text":"Toast"}'}`],
            ["倒立僵尸", `/execute at ${playerName} run summon minecraft:zombie ~${offsetX} ~2 ~${offsetZ} {CustomName:'{"text":"Dinnerbone"}'}`],
            ["倒立僵尸", `/execute at ${playerName} run summon minecraft:zombie ~${offsetX} ~2 ~${offsetZ} {CustomName:'{"text":"Grumm"}'}`],
            ["杀手兔", `/execute at ${playerName} run summon minecraft:rabbit ~${offsetX} ~2 ~${offsetZ} {RabbitType:99}`],
            ["幻术师", `/execute at ${playerName} run summon minecraft:illusioner ~${offsetX} ~2 ~${offsetZ}`],
            ["巨人", `/execute at ${playerName} run summon minecraft:giant ~${offsetX} ~2 ~${offsetZ}`],
            ["僵尸马", `/execute at ${playerName} run summon minecraft:zombie_horse ~${offsetX} ~2 ~${offsetZ}`],
            ["巨大史莱姆", `/execute at ${playerName} run summon minecraft:slime ~${offsetX} ~2 ~${offsetZ} {Size:18}`],
            ["陷阱骷髅马", `/execute at ${playerName} run summon minecraft:skeleton_horse ~${offsetX} ~2 ~${offsetZ} {SkeletonTrap:1}`]
        ]
        let randomEntity = rareEntity[Math.floor(Math.random() * rareEntity.length)]
        sendMsgTOServer(`/say §e${userName}§f召唤了§b${randomEntity[0]}`)
        sendMsgTOServer(randomEntity[1])
    }
    function randomEntity(userName, ...entitieLists) {
        let entitieList = [].concat(...entitieLists);
        let offsetX = Math.floor(Math.random() * 11) - 5
        let offsetZ = Math.floor(Math.random() * 11) - 5
        entity = entitieList[Math.floor(Math.random() * entitieList.length)]
        sendMsgTOServer(`/say §e${userName}§f召唤了§b${entity[0]}`)
        sendMsgTOServer(`/execute at ${playerName} run summon ${entity[1]} ~${offsetX} ~2 ~${offsetZ} {CustomName:'{"text":"${userName}"}',CustomNameVisible:1b}`)
    }
    function summonEntity(userName, entityName, entityId, tag) {
        let offsetX = Math.floor(Math.random() * 11) - 5
        let offsetZ = Math.floor(Math.random() * 11) - 5
        if (typeof tag === 'undefined') {
            sendMsgTOServer(`/execute at ${playerName} run summon ${entityId} ~${offsetX} ~2 ~${offsetZ} {CustomName:'{"text":"${userName}"}',CustomNameVisible:1b}`)
        } else {
            sendMsgTOServer(`/execute at ${playerName} run summon ${entityId} ~${offsetX} ~2 ~${offsetZ} ${tag}`)
        }
        sendMsgTOServer(`/say §e${userName}§f召唤了§b${entityName}`)
    }
    function randomItem(userName, itemList, num) {
        let item = itemList[Math.floor(Math.random() * itemList.length)]
        if (typeof num === 'undefined') {
            sendMsgTOServer(`/give ${playerName} ${item[1]}`)
            sendMsgTOServer(`/say §e${userName}§给予了§b${item[0]}`)
        } else {
            sendMsgTOServer(`/give ${playerName} ${item[1]} ${num}`)
            sendMsgTOServer(`/say §e${userName}§给予了§b${item[0]}*${num}`)
        }
    }
    function giveItem(userName, itemName, itemID, num) {
        if (typeof num === 'undefined') {
            sendMsgTOServer(`/give ${playerName} ${itemID}`)
            sendMsgTOServer(`/say §e${userName}§给予了§b${itemName}`)
        } else {
            sendMsgTOServer(`/give ${playerName} ${itemID} ${num}`)
            sendMsgTOServer(`/say §e${userName}§给予了§b${itemName}*${num}`)
        }
    }

    function summonTest(...arrays) {
        let newArrays = [].concat(...arrays);
        newArrays.forEach(element => {
            sendMsgTOServer(`/execute at ${playerName} run summon ${element[1]} ~ ~ ~`)
            sendMsgTOServer(`/say §e${playerName}§f召唤了§b${element[0]}`)
        });
    }
    function giveItemTest(...arrays) {
        let newArrays = [].concat(...arrays);
        newArrays.forEach(element => {
            sendMsgTOServer(`/give ${playerName} ${element[1]}`)
            sendMsgTOServer(`/say §e${playerName}§f给予了§b${element[0]}`)
        });
    }
    function buffTest(...arrays) {
        let buffList = [].concat(...arrays);
        let level = Math.floor(Math.random() * 10)
        buffList.forEach(element => {
            sendMsgTOServer(`/effect give ${playerName} ${element[1]} 60 ${level}`)
            sendMsgTOServer(`/say §e${playerName}§f给予了§b${element[0]}§c${level}`)
        });

    }


    window.addEventListener('beforeunload', () => {
        sendMsgTOServer("stop")
    });

    // // 轮播礼物
    // {
    //     var carousel = document.getElementById('carousel');
    //     var items = carousel.querySelectorAll('.item');
    //     var currentIndex = 0;
    //     var intervalTime = 5000; // 切换时间间隔（毫秒数）
    //     function lunBO() {
    //         // 隐藏所有的div
    //         for (var i = 0; i < items.length; i++) {
    //             items[i].classList.remove('active');
    //         }
    //         // 显示当前div
    //         items[currentIndex].classList.add('active');
    //         currentIndex++;
    //         if (currentIndex >= items.length) {
    //             currentIndex = 0;
    //         }
    //     }
    //     setInterval(lunBO, intervalTime);
    // }
})