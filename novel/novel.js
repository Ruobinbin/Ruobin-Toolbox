window.addEventListener('DOMContentLoaded', async () => {
    const fs = require('fs');
    const fsPromises = require('fs').promises;
    const path = require('path');
    const axios = require('axios');
    const { execSync, spawn } = require('child_process');

    const novelContentTextarea = document.getElementById("novelContentTextarea");
    const showVideoButton = document.getElementById("showVideoButton");
    const generateVideoButton = document.getElementById("generateVideoButton");
    const generateAudioButton = document.getElementById("generateAudioButton");
    const startDocker = document.getElementById("startDockerButton");
    const stopDocker = document.getElementById("stopDockerButton");
    const outputPre = document.getElementById("outputPre");
    const videoUrlsDiv = document.getElementById("videoUrlsDiv");
    const youtubeChannelInput = document.getElementById("youtubeChannelInput");
    const randomVideoCountInput = document.getElementById("randomVideoCountInput");

    const YOUTUBE_DATA_API_KEY = 'AIzaSyBkPEp-9_9T4PBwAYKks1A4-xoBlJs4n8s';
    const YOUTUBE_DATA_API_URL = new URL('https://www.googleapis.com')

    const mediaPath = './novel/output'
    let videoTotalDuration = 0;

    let youtubeChannelUrl = youtubeChannelInput.value;
    let randomVideoCount = randomVideoCountInput.value;
    let videoUrls = await getYoutubeVideoUrlFromUrl(youtubeChannelUrl, randomVideoCount);
    //改动后更新
    youtubeChannelInput.addEventListener('input', async function () {
        youtubeChannelUrl = youtubeChannelInput.value;
        videoUrls = await getYoutubeVideoUrlFromUrl(youtubeChannelUrl, randomVideoCount);
        showOnOutput('获取视频列表成功：' + videoUrls);
    });
    //改动后更新
    randomVideoCountInput.addEventListener('input', async function () {
        randomVideoCount = randomVideoCountInput.value;
        videoUrls = await getYoutubeVideoUrlFromUrl(youtubeChannelUrl, randomVideoCount);
        showOnOutput('获取视频列表成功：' + videoUrls);
    });
    //生成音频按钮
    generateAudioButton.addEventListener('click', async function () {
        const novelContent = novelContentTextarea?.value; //获取输入的小说内容
        if (!novelContent) {
            showOnOutput('请输入小说内容');
            return;
        }
        await writeToText(novelContent, path.join(mediaPath, 'text.txt')); //写入到txt
        await downAudio(novelContent, path.join(mediaPath, 'audio.wav')); //下载音频
        await controlDocker('aeneas', 'up'); //生成字幕
    });
    //展示视频按钮
    showVideoButton.addEventListener('click', async function () {
        await showRandomVideoList(await getAudioDuration('../' + path.join(mediaPath, 'audio.wav'))); //根据音频长度下载视频数量
    });
    //生成视频按钮
    generateVideoButton.addEventListener('click', async function () {
        await deleteVideoFiles(mediaPath) //删除所有视频
        await downloadVideos(getFinalVideoUrlList())
        await generateVideoList(mediaPath)
        await controlDocker('ffmpeg', 'up'); //合成最终视频
    });
    //开启容器按钮
    startDocker.addEventListener('click', async function () {
        controlDocker('ytdlp', 'up');
        controlDocker('vsa', 'up');
    });
    //关闭容器按钮
    stopDocker.addEventListener('click', async function () {
        await controlDocker('ytdlp', 'stop');
        await controlDocker('vsa', 'stop');
    });
    //展示随机的视频
    async function showRandomVideoList(audioDuration) {
        while (videoTotalDuration < audioDuration) {
            let randomVideoUrl= videoUrls[Math.floor(Math.random() * videoUrls.length)];
            let randomVideoDuration = await getYoutubeVideoDuration(randomVideoUrl.split('v=')[1]);
            videoTotalDuration += randomVideoDuration;
    
            // 创建一个新的div元素，然后创建一个a元素和一个按钮元素，并将它们添加到div中
            const div = document.createElement('div');
            const a = document.createElement('a');
            const button = document.createElement('button');
    
            a.href = randomVideoUrl;
            a.textContent = randomVideoUrl;
            a.target = '_blank';
            button.textContent = '替换';
            button.onclick = function() {
                // 从videoUrlsDiv中删除div
                videoUrlsDiv.removeChild(div);
    
                // 从videoTotalDuration中减去randomVideoDuration
                videoTotalDuration -= randomVideoDuration;
    
                // 如果videoTotalDuration小于audioDuration，再次调用showRandomVideoList函数
                if (videoTotalDuration < audioDuration) {
                    showRandomVideoList(audioDuration);
                }
            };
    
            div.appendChild(a);
            div.appendChild(button);
    
            videoUrlsDiv.appendChild(div);
        }
    }
    //获取最终的视频列表
    function getFinalVideoUrlList() {
        const videoList = [];
        const divs = videoUrlsDiv.children;
        for (let i = 0; i < divs.length; i++) {
            const a = divs[i].querySelector('a');
            if (a) {
                videoList.push(a.href);
            }
        }
        return videoList;
    }
    // 删除路径下以"video"开头的视频文件
    async function deleteVideoFiles(dir) {
        const fsPromises = fs.promises;
        try {
            const files = await fsPromises.readdir(dir);
            const videoFiles = files.filter(file => file.startsWith('video'));
            if (videoFiles.length === 0) {
                showOnOutput('没有视频文件需要删除。');
                return;
            }
            const deletePromises = videoFiles.map(file => fsPromises.unlink(path.join(dir, file)));
            await Promise.all(deletePromises);
            showOnOutput('视频文件删除成功。');
        } catch (error) {
            showOnOutput('删除视频文件失败:', error);
        }
    }
    //下载音频
    async function downAudio(str, audioPath) {
        try {
            const response = await axios({
                method: 'post',
                url: `http://127.0.0.1:23456/voice/gpt-sovits`,
                data: {
                    id: 1,
                    preset: 'paimeng_30h3',
                    text: str
                },
                responseType: 'arraybuffer' // 修改为 'arraybuffer'
            });

            const buffer = Buffer.from(response.data); // 将 ArrayBuffer 转换为 Buffer
            await fsPromises.writeFile(audioPath, buffer); // 写入 Buffer

        } catch (error) {
            showOnOutput('下载音频失败:', error);
            fs.unlink(audioPath, (err) => {
                if (err) showOnOutput('删除音频失败:', err);
            });
            throw error;
        }
    }
    // 写入str到txtPath
    async function writeToText(str, txtPath) {
        return new Promise((resolve, reject) => {
            const fileTxt = path.join(txtPath);
            fs.writeFile(fileTxt, str, (err) => {
                if (err) {
                    showOnOutput(`写入到${txtPath}失败: ${err}`);
                    reject(err);
                } else {
                    showOnOutput(`写入到${txtPath}成功`);
                    resolve();
                }
            });
        });
    }
    //终端输出内容
    function showOnOutput(str) {
        outputPre.textContent += str;
        outputPre.scrollTop = outputPre.scrollHeight;
    }
    //控制docker
    async function controlDocker(service, command) {
        return new Promise((resolve, reject) => {
            const docker = spawn('docker-compose', ['-f', `./docker_services/${service}/docker-compose.yaml`, command]);

            docker.stdout.on('data', (data) => {
                showOnOutput(`${service}|stdout: ${data}\n`)
            });

            docker.stderr.on('data', (data) => {
                showOnOutput(`${service}|stderr: ${data}\n`)
            });

            docker.on('error', (error) => {
                showOnOutput(`${service}|执行的错误: ${error}\n`)
                reject();
            });

            docker.on('close', (code) => {
                showOnOutput(`${service}|进程退出，退出码 ${code}\n`)
                resolve();
            });
        });
    }
    //下载videoList中的视频
    async function downloadVideos(videoList) {
        for (const videoUrl of videoList) {
            showOnOutput('下载视频:' + videoUrl);
            await new Promise((resolve, reject) => {
                const ytdlpDocker = spawn('docker-compose', ['-f', './docker_services/ytdlp/docker-compose.yaml', 'exec', 'yt-dlp', 'yt-dlp', '--no-playlist', '-f', 'bestvideo[ext=mp4]/best[ext=mp4]', '-o', `/app/video-${Date.now()}.%(ext)s`, videoUrl]);

                ytdlpDocker.stdout.on('data', (data) => {
                    outputPre.textContent += `ytdlpDocker|stdout: ${data}\n`;
                    outputPre.scrollTop = outputPre.scrollHeight;
                });

                ytdlpDocker.stderr.on('data', (data) => {
                    outputPre.textContent += `ytdlpDocker|stderr: ${data}\n`;
                    outputPre.scrollTop = outputPre.scrollHeight;
                });

                ytdlpDocker.on('error', (error) => {
                    outputPre.textContent += `ytdlpDocker: ${error}\n`;
                    outputPre.scrollTop = outputPre.scrollHeight;
                    reject(error);
                });

                ytdlpDocker.on('close', (code) => {
                    outputPre.textContent += `ytdlpDocker子进程退出，退出码 ${code}\n`;
                    outputPre.scrollTop = outputPre.scrollHeight;
                    resolve();
                });
            });
        }
    }
    //根据videoid获取视频时常
    async function getYoutubeVideoDuration(videoId) {
        YOUTUBE_DATA_API_URL.pathname = '/youtube/v3/videos';
        YOUTUBE_DATA_API_URL.search = new URLSearchParams({
            key: YOUTUBE_DATA_API_KEY,
            id: videoId,
            part: 'contentDetails',
        });

        try {
            const response = await axios.get(YOUTUBE_DATA_API_URL.toString());
            const data = response.data;
            const duration = data.items[0].contentDetails.duration;
            return durationToSeconds(duration);
        } catch (error) {
            showOnOutput('获取视频时长失败:', error);
        }
    }
    //根据youtube网址获取VideoUrls
    async function getYoutubeVideoUrlFromUrl(youtubeUrl, maxResults) {
        // 获取YouTube频道ID
        const response = await axios.get(youtubeUrl);
        const html = response.data;
        const match = html.match(/<meta itemprop="identifier" content="(.*?)">/);
        const channelId = match ? match[1] : null;

        // 使用频道ID获取视频ID
        if (channelId) {
            YOUTUBE_DATA_API_URL.pathname = '/youtube/v3/search';
            YOUTUBE_DATA_API_URL.search = new URLSearchParams({
                key: YOUTUBE_DATA_API_KEY,
                channelId: channelId,
                part: 'snippet',
                type: 'video',
                order: 'date',
                maxResults: maxResults,
            });
            try {
                const response = await axios.get(YOUTUBE_DATA_API_URL.toString());
                const data = response.data;
                const videoUrls = data.items.map(item => `https://www.youtube.com/watch?v=${item.id.videoId}`);
                return videoUrls;
            } catch (error) {
                showOnOutput('获取video IDs失败:', error);
            }
        } else {
            showOnOutput('获取channel ID失败');
        }
    }
    //ISO 8601 转 秒
    function durationToSeconds(duration) {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

        const hours = (parseInt(match[1]) || 0);
        const minutes = (parseInt(match[2]) || 0);
        const seconds = (parseInt(match[3]) || 0);

        return hours * 3600 + minutes * 60 + seconds;
    }
    // 获取mediaPath下的video-开头的文件并生成videolist.txt
    async function generateVideoList(mediaPath) {
        const files = fs.readdirSync(mediaPath);
        const videoFiles = files.filter(file => file.startsWith('video-'));
        fs.writeFileSync(path.join(mediaPath, 'videolist.txt'), videoFiles.map(file => 'file ' + path.basename(file)).join('\n'));
    }
    // 获取音频的时长
    async function getAudioDuration(audioPath) {
        const audio = document.createElement('audio');
        audio.src = audioPath;

        return new Promise((resolve, reject) => {
            audio.onloadedmetadata = function () {
                resolve(this.duration);
            };
            audio.onerror = function () {
                reject(new Error('加载音频失败'));
            };
        });
    }
});
