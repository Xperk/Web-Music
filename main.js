// 1.Render songs
// 2.Scroll top
// 3.Play/ pause/ seek
// 4.CD rotate
// 5.Nexr/ prev
// 6.Random
// 7.Next/ Repeat when ended
// 8.Active song
// 9.Scroll active song into view
// 10.Play song when click

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const player = $('.player');
const progress = $('#progress')
const nextBtn = $('.btn-next');
const preBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Đứa nào em buồn',
            singer: 'Phúc Du ft Hoàng Dũng',
            path: './acsset/Music/Dllem.mp3',
            image: './acsset/img/dnleb.jpg'
        },
        {
            name: 'Couting Start',
            singer: 'Phúc Du ft Hoàng Dũng',
            path: './acsset/Music/st.mp3',
            image: './acsset/img/cts.jpg'
        },
        {
            name: 'Dancin',
            singer: 'Phúc Du ft Hoàng Dũng',
            path: './acsset/Music/dancin.mp3',
            image: './acsset/img/dancin.jpg'
        },
        {
            name: 'Roar',
            singer: 'Phúc Du ft Hoàng Dũng',
            path: './acsset/Music/roar.mp3',
            image: './acsset/img/roar.jpg'
        },
        {
            name: 'Waiting For love',
            singer: 'Phúc Du ft Hoàng Dũng',
            path: './acsset/Music/wait.mp3',
            image: './acsset/img/wtfl.png'
        },
        {
            name: 'I want it that way',
            singer: 'Phúc Du ft Hoàng Dũng',
            path: './acsset/Music/iwan.mp3',
            image: './acsset/img/iwant.jpg'
        },
        {
            name: 'Uptown Funk',
            singer: 'Mark Ronson ft. Bruno Mars',
            path: './acsset/Music/upto.mp3',
            image: './acsset/img/utf.jpg'
        },
        {
            name: 'Ex hate me',
            singer: 'Phúc Du ft Hoàng Dũng',
            path: './acsset/Music/Ehm.mp3',
            image: './acsset/img/ehm.jpg'
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // xu ly CD quay / dung
        const cdThumbanimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10s
            iterations: Infinity
        })
        cdThumbanimate.pause();
        // xu ly phong to thu nho cd
        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        },
            playBtn.onclick = function () {
                if (_this.isPlaying) {
                    audio.pause();
                }
                else {
                    audio.play();
                }
            }

        // Khi song play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbanimate.play();
        }
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbanimate.pause();
        }

        // Khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        // xu ly khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scroolToActiveSong();
        }

        // khi pre song
        preBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.preSong();
            }
            audio.play();
            _this.render();
            _this.scroolToActiveSong();
        }

        // Xu ly bat tat random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // xu ly next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                //Xu ly khi click vao song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // xu ly khi click vao option
                if (e.target.closest(".option")) {

                }
            }
        }
    },
    scroolToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 300)
    }
    ,
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    preSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {
        // Gan cau hinh tu config vao ung dung
        this.loadConfig();

        // Dinh nghia cac thuoc tinh cho object
        this.defineProperties();

        // Lang nghe su kien
        this.handleEvents();

        // load song hien tai
        this.loadCurrentSong();

        // render playlist
        this.render();

        // hien thi trang thai ban dau cua btn repeat & random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }

}
app.start();