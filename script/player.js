const audio = document.getElementById("audio");
const playlistElement = document.getElementById("playlist");
const seekBar = document.getElementById("seekBar");
const currentTimeSpan = document.getElementById("currentTime");
const durationSpan = document.getElementById("duration");
const loopButton = document.getElementById("loopButton");
const volumeSlider = document.getElementById("volumeSlider");
const muteButton = document.getElementById("muteButton");
const rewindButton = document.getElementById("rewindButton");
const fastForwardButton = document.getElementById("fastForwardButton");
const playPauseButton = document.getElementById("playPauseButton");
const nowPlayingText = document.getElementById("nowPlayingText");
const albumArt = document.getElementById("albumArt");
let currentIndex = 0;

function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.file;
    nowPlayingText.textContent = `Now Playing: ${track.title}`;
    albumArt.src = track.cover || "https://via.placeholder.com/50x50?text=🎵";
    [...playlistElement.children].forEach(li => li.classList.remove("now-playing"));
    playlistElement.children[index].classList.add("now-playing");
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

audio.addEventListener("timeupdate", () => {
    seekBar.max = Math.floor(audio.duration);
    seekBar.value = Math.floor(audio.currentTime);
    currentTimeSpan.textContent = formatTime(audio.currentTime);
    durationSpan.textContent = isNaN(audio.duration) ? "0:00" : formatTime(audio.duration);
});

seekBar.addEventListener("input", () => {
    audio.currentTime = seekBar.value;
});

playlist.forEach((track, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <div class="song-title">${track.title}</div>
    ${track.lyrics ? `<button class="lyrics-toggle">🎤 Show Lyrics</button>
    <div class="lyrics hidden">${track.lyrics.replace(/\n/g, "<br>")}</div>` : ""}
  `;

    li.querySelector(".song-title").onclick = () => {
        currentIndex = i;
        loadTrack(currentIndex);
        audio.play();
    };

    const toggleBtn = li.querySelector(".lyrics-toggle");
    if (toggleBtn) {
        toggleBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering song playback
            const lyricsDiv = li.querySelector(".lyrics");
            const showing = !lyricsDiv.classList.contains("hidden");
            lyricsDiv.classList.toggle("hidden");
            toggleBtn.textContent = showing ? "🎤 Show Lyrics" : "🎵 Hide Lyrics";
        };
    }

    playlistElement.appendChild(li);
});


loopButton.onclick = () => {
    audio.loop = !audio.loop;
    loopButton.textContent = audio.loop ? "🔁 Loop: On" : "🔁 Loop: Off";
};

rewindButton.onclick = () => {
    audio.currentTime = Math.max(audio.currentTime - 10, 0);
};

fastForwardButton.onclick = () => {
    audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
};

muteButton.onclick = () => {
    audio.muted = !audio.muted;
    muteButton.textContent = audio.muted ? "🔈 Unmute" : "🔇 Mute";
};

volumeSlider.oninput = () => {
    audio.volume = volumeSlider.value;
};

playPauseButton.onclick = () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
};

document.getElementById("prevButton").onclick = () => {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentIndex);
    audio.play();
};

document.getElementById("nextButton").onclick = () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(currentIndex);
    audio.play();
};


audio.onended = () => {
    if (!audio.loop) {
        currentIndex = (currentIndex + 1) % playlist.length;
        loadTrack(currentIndex);
        audio.play();
    }
};

function adjustPaddingForPlayer() {
    const player = document.getElementById("playerBar");
    const container = document.querySelector(".container");
    const playerHeight = player.offsetHeight;
    container.style.paddingBottom = `${playerHeight + 20}px`; // 20px buffer
}

adjustPaddingForPlayer();

window.addEventListener("resize", adjustPaddingForPlayer);

loadTrack(currentIndex);