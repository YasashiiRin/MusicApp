const SETTING_STORAGE_KEY = 'SETTING';
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $('.player');
const heading = $('header h2');
const cdthumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playbtn = $('.btn-toggle-play');
const range = $('.progress');
const nextbtn = $('.btn-next');
const randombtn = $('.btn-random');
const prevbtn = $('.btn-prev');
const repeatbtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(SETTING_STORAGE_KEY) || '{}'),

    currentIndex: 0,
    songs: [

        {
            name: 'Đồi hoa mặt trời ',
            singer: 'Nguyên Hà ',
            path: './asset/music/doi_hoa_mat_troi.mp3',
            img: './asset/img/doihoamattroi.jpg'
        }
        ,
        {
            name: 'hello World',
            singer: 'AW',
            path: './asset/music/hello_world.mp3',
            img: './asset/img/helloworld.jpg'
        }
        ,
        {
            name: 'drop in the ocean',
            singer: 'light',
            path: './asset/music/drop_in_the_ocean.mp3',
            img: './asset/img/dropintheocean.jpg'
        }
        ,
        {
            name: 'nhắm mắt thấy mùa hè',
            singer: 'Nguyên Hà',
            path: './asset/music/nham_mat_thay_mua_he.mp3',
            img: './asset/img/nhammatthaymuahe.jpg'
        },
        {
            name: 'Trích tiên',
            singer: 'light',
            path: './asset/music/trich_tien.mp3',
            img: './asset/img/trichtien.jpg'
        },
        {
            name: 'suzume',
            singer: 'light',
            path: './asset/music/suzume.mp3',
            img: './asset/img/suzume.jpg'
        }
    ],
    setconfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(SETTING_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                      <div class="thumb"
                    style="background-image: url('${song.img}')">
                     </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                     <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
                    `;
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
    handleEvent: function () {
        const _this = this;
        const cdwidth = cd.offsetWidth;
        //quay 
        const cdthumbSprinning = [{
            transform: 'rotate(360deg)'
        }];
        const cdthumbTiming = {
            duration: 10000,
            iterations: Infinity
        };
        const rotateanimate = cdthumb.animate(cdthumbSprinning, cdthumbTiming);
        rotateanimate.pause();
        document.onscroll = function () {
            const scrolltop = window.scrollY || document.documentElement.scrollTop;
            const newcdwidth = cdwidth - scrolltop;
            cd.style.width = newcdwidth > 0 ? newcdwidth + 'px' : 0;
            cd.style.opacity = newcdwidth / cdwidth;

        }
        //nhaans play
        playbtn.onclick = function () {
            if (_this.isPlaying == true) {

                audio.pause();

            }
            else {

                audio.play();
            }
            audio.onplay = function () {
                _this.isPlaying = true;
                rotateanimate.play();
                player.classList.add('playing');
            }
            audio.onpause = function () {
                _this.isPlaying = false;
                rotateanimate.pause();
                player.classList.remove('playing');
            }
            // thanh seekbar thay đổi
            audio.ontimeupdate = function () {
                if (audio.duration) {
                    const acroll = audio.currentTime / audio.duration * 100;
                    range.value = acroll;

                }
            }

        }
        range.onchange = function (e) {
            const seek = audio.duration / 100 * e.target.value;
            console.log("total time" + audio.duration);
            console.log("time chage" + 100 * e.target.value);
            audio.currentTime = seek;

        }
        //next song 
        nextbtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomsong();
            } else {
                _this.nextSong();
            }

            audio.play();
            _this.render();
            _this.scrollview();
        }
        prevbtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomsong();
            } else {
                _this.prevsong();
            }

            audio.play();
            _this.render();
            _this.scrollview();
        }
        randombtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setconfig('isRandom', _this.isRandom);
            randombtn.classList.toggle('active', _this.isRandom);
        }
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
                console.log("re");
            } else {
                console.log("not re");
                nextbtn.click();
            }
        }
        playlist.onclick = function (e: any) {
            playbtn.click();
            const songelement = e.target.closest('.song:not(.active)')
            console.log(songelement)
            if (songelement || e.target.closest('.options')) {
                if (songelement) {
                    _this.currentIndex = Number(songelement.dataset.index);
                    _this.Loadcurrentsong();
                    audio.play();
                    _this.render();

                }
                if (e.target.closest('.options')) {

                }
            }
        }
        //loop play song
        repeatbtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setconfig('isRepeat', _this.isRepeat);
            repeatbtn.classList.toggle('active', _this.isRepeat);
        }
    },
    LoadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    scrollview: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            }, 300);
        })
    },
    Loadcurrentsong: function () {
        heading.textContent = this.currentSong.name;
        cdthumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path;

    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.Loadcurrentsong();
    },
    prevsong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length;
        }
        this.Loadcurrentsong();
    },
    randomsong: function () {
        let newindex
        do {
            newindex = Math.floor(Math.random() * this.songs.length);
        } while (newindex === this.currentIndex);
        this.currentIndex = newindex;
        this.Loadcurrentsong();
    },
    start: function () {
        //set config 
        this.LoadConfig();
        //-----------------------
        this.defineProperties();
        this.handleEvent();
        this.Loadcurrentsong();
        this.render();
        randombtn.classList.toggle('active', this.isRandom);
        repeatbtn.classList.toggle('active', this.isRepeat);
    }


}
app.start();
