// 电影系列数据
const seriesData = [
    {
        title: "古惑仔之人在江湖",
        description: "《古惑仔之人在江湖》是古惑仔系列的第一部，讲述了陈浩南、山鸡等人在洪兴社的成长故事。",
        episodes: [
            { title: "完整版", url: "https://1379636163.vod-qcloud.com/9359fdf7vodtranscq1379636163/eafd53e95145403701176599449/v.f100040.mp4" }
        ]
    },
    {
        title: "古惑仔之猛龙过江",
        description: "《古惑仔之猛龙过江》是古惑仔系列的第二部，讲述了陈浩南等人与台湾三联帮的冲突。",
        episodes: [
            { title: "完整版", url: "https://1379636163.vod-qcloud.com/9359fdf7vodtranscq1379636163/4256e2745145403701214809207/v.f100080.mp4" }
        ]
    },
    {
        title: "古惑仔之只手遮天",
        description: "《古惑仔之只手遮天》是古惑仔系列的第三部，讲述了陈浩南与东星社的冲突。",
        episodes: [
            { title: "完整版", url: "https://1379636163.vod-qcloud.com/9359fdf7vodtranscq1379636163/cf97931e5145403701223098559/v.f101240.m3u8" }
        ]
    },
    {
        title: "古惑仔之战无不胜",
        description: "《古惑仔之战无不胜》是古惑仔系列的第四部，讲述了陈浩南成为铜锣湾扛把子的故事。",
        episodes: [
            { title: "完整版", url: "https://1379636163.vod-qcloud.com/9359fdf7vodtranscq1379636163/ea0bb86e5145403701213356403/v.f101240.m3u8" }
        ]
    },
    {
        title: "古惑仔之龙争虎斗",
        description: "《古惑仔之龙争虎斗》是古惑仔系列的第五部，讲述了陈浩南与东星社的进一步冲突。",
        episodes: [
            { title: "完整版", url: "https://1379636163.vod-qcloud.com/9359fdf7vodtranscq1379636163/ba17eb555145403701219432427/v.f101240.m3u8" }
        ]
    },
    {
        title: "古惑仔之胜者为王",
        description: "《古惑仔之胜者为王》是古惑仔系列的第六部，讲述了陈浩南与山鸡在日本的故事。",
        episodes: [
            { title: "完整版", url: "https://1379636163.vod-qcloud.com/9359fdf7vodtranscq1379636163/f1b0b5865145403701220450411/v.f101240.m3u8" }
        ]
    }
];

// DOM元素
const movieCard = document.getElementById('movieCard');
const seriesContainer = document.getElementById('seriesContainer');
const seriesList = document.getElementById('seriesList');
const backBtn = document.getElementById('backBtn');
const playerContainer = document.getElementById('playerContainer');
const playerTitle = document.getElementById('playerTitle');
const moviePlayer = document.getElementById('moviePlayer');
const movieInfo = document.getElementById('movieInfo');
const playerBackBtn = document.getElementById('playerBackBtn');
const refreshBtn = document.getElementById('refreshBtn');
const loadingMessage = document.getElementById('loadingMessage');

// 当前播放的电影信息
let currentSeriesIndex = null;
let currentEpisodeTitle = null;

// 点击卡片显示系列列表
movieCard.addEventListener('click', function() {
    movieCard.style.display = 'none';
    seriesContainer.style.display = 'block';
    renderSeriesList();
});

// 返回按钮
backBtn.addEventListener('click', function() {
    seriesContainer.style.display = 'none';
    movieCard.style.display = 'block';
});

// 播放器返回按钮
playerBackBtn.addEventListener('click', function() {
    playerContainer.style.display = 'none';
    seriesContainer.style.display = 'block';
    moviePlayer.pause();
});

// 刷新按钮
refreshBtn.addEventListener('click', function() {
    if (currentSeriesIndex !== null && currentEpisodeTitle !== null) {
        playMovie(currentSeriesIndex, currentEpisodeTitle, true);
    }
});

// 渲染系列列表
function renderSeriesList() {
    seriesList.innerHTML = '';
    
    seriesData.forEach((series, index) => {
        const seriesItem = document.createElement('div');
        seriesItem.className = 'series-item';
        seriesItem.innerHTML = `
            <h3>${series.title}</h3>
            <div class="episodes-list" id="episodes-${index}">
                ${series.episodes.map(episode => 
                    `<div class="episode-item">
                        <a href="#" data-series="${index}" data-episode="${episode.title}">${episode.title}</a>
                    </div>`
                ).join('')}
            </div>
        `;
        
        // 点击系列显示/隐藏剧集
        const seriesTitle = seriesItem.querySelector('h3');
        const episodesList = seriesItem.querySelector('.episodes-list');
        
        seriesTitle.addEventListener('click', function() {
            // 如果当前剧集列表是显示的，则隐藏；否则显示
            if (episodesList.style.display === 'block') {
                episodesList.style.display = 'none';
            } else {
                // 先隐藏所有剧集列表
                document.querySelectorAll('.episodes-list').forEach(list => {
                    list.style.display = 'none';
                });
                // 然后显示当前剧集列表
                episodesList.style.display = 'block';
            }
        });
        
        // 为剧集链接添加点击事件
        const episodeLinks = seriesItem.querySelectorAll('.episode-item a');
        episodeLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const seriesIndex = this.getAttribute('data-series');
                const episodeTitle = this.getAttribute('data-episode');
                playMovie(seriesIndex, episodeTitle);
            });
        });
        
        seriesList.appendChild(seriesItem);
    });
}

// 播放电影函数
function playMovie(seriesIndex, episodeTitle, isRefresh = false) {
    const series = seriesData[seriesIndex];
    const episode = series.episodes.find(ep => ep.title === episodeTitle);
    
    if (episode && episode.url) {
        // 保存当前播放的电影信息
        currentSeriesIndex = seriesIndex;
        currentEpisodeTitle = episodeTitle;
        
        // 隐藏系列列表，显示播放器
        seriesContainer.style.display = 'none';
        playerContainer.style.display = 'block';
        
        // 设置播放器标题
        playerTitle.textContent = `${series.title} - ${episodeTitle}`;
        
        // 显示加载消息（只要进入视频容器就显示）
        loadingMessage.style.display = 'block';
        
        // 如果是刷新操作，先重置视频源
        if (isRefresh) {
            moviePlayer.src = '';
        }
        
        // 设置视频源
        moviePlayer.src = episode.url;
        
        // 设置电影信息
        movieInfo.innerHTML = `
            <h3>电影简介</h3>
            <p>${series.description}</p>
        `;
        
        // 监听视频加载完成事件
        moviePlayer.addEventListener('loadeddata', function() {
            loadingMessage.style.display = 'none';
        });
        
        // 监听视频错误事件
        moviePlayer.addEventListener('error', function() {
            loadingMessage.textContent = '视频加载失败，请尝试刷新或更换网络后重试';
        });
        
        // 自动播放
        moviePlayer.play().catch(e => {
            console.log("自动播放被阻止:", e);
            // 即使自动播放被阻止，也隐藏加载消息
            setTimeout(() => {
                loadingMessage.style.display = 'none';
            }, 3000);
        });
        
        // 设置超时，5秒后如果还在加载则隐藏提示
        setTimeout(() => {
            loadingMessage.style.display = 'none';
        }, 5000);
    } else {
        alert("该影片暂无播放资源");
    }
}