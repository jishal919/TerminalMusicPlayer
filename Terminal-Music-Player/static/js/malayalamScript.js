let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let wave = document.getElementById('wave');
let randomIcon = document.querySelector('.fa-random');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

let malayalam; // Holds the loaded music data
function setupMediaSessionControls() {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: malayalam[track_index].name,
      artist: malayalam[track_index].artist,
      // Include other metadata information here
      artwork: [
        { src: malayalam[track_index].img, sizes: '96x96', type: 'image/jpeg' },
      ],
    });

    navigator.mediaSession.setActionHandler('play', function() {
      playTrack();
    });

    navigator.mediaSession.setActionHandler('pause', function() {
      pauseTrack();
    });

    navigator.mediaSession.setActionHandler('previoustrack', function() {
      prevTrack();
    });

    navigator.mediaSession.setActionHandler('nexttrack', function() {
      nextTrack();
    });
  }
  
}

// Load music data from data.json
const apiUrl = 'https://api.github.com/repos/jishal919/telegram-bot-database/contents/api/static/js/SongList.json';
const apiKey = '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';

fetch(apiUrl, {
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
})
  .then(response => response.json())
  .then(data => {
    // Now 'data' contains the content of the SongList.json file
    console.log(data);

    // If the content is base64 encoded, decode it
    const decodedContent = atob(data.content);
    const jsonData = JSON.parse(decodedContent);
    
    // Now 'jsonData' contains the parsed JSON content
    console.log(jsonData);

    // Continue with your code...
    malayalam = jsonData.malayalam;
    loadTrack(track_index); // Load the initial track
    setupMediaSessionControls();
  })
  .catch(error => console.error('Error fetching data:', error));


function loadTrack(track_index) {
  clearInterval(updateTimer);
  reset();

  // Remove any existing buffering GIFs
  const existingBufferingGifs = document.querySelectorAll('.buffering-gif');
  existingBufferingGifs.forEach(gif => gif.remove());

  // Display the buffering GIF while loading the song metadata
  let bufferingGif = document.createElement('img');
  bufferingGif.src = '/static/buffering.gif'; // Replace with the actual path to your buffering GIF
  bufferingGif.classList.add('buffering-gif');
  track_art.appendChild(bufferingGif);

  // Create a random query parameter to force the image to refresh
  let randomQuery = Math.random();
  let imageUrl = malayalam[track_index].img + '?' + randomQuery;
  track_art.style.backgroundImage = "url(" + imageUrl + ")";

  // Load the audio element with the music source
  curr_track.src = malayalam[track_index].music;

  // Listen for the loadedmetadata event to remove the buffering GIF
  curr_track.onloadedmetadata = function () {
    // Remove the buffering GIF
    bufferingGif.remove();
    
    // Enable transitions after the image has been updated
    track_art.style.transition = "background-image 0.5s"; // Adjust the duration as needed
  };

  // Reset isPlaying to false so that the animation and audio won't start automatically
  isPlaying = false;
  wave.classList.remove('playing'); // Remove the 'playing' class
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i';

  // Get the track name and other details
  let trackName = malayalam[track_index].name;
  if (trackName.length > 30) {
    trackName = trackName.substring(0, 25) + "...";
  }

  track_name.textContent = trackName;
  track_artist.textContent = malayalam[track_index].artist;
  now_playing.textContent = "Playing music " + (track_index + 1) + " of " + malayalam.length;

  let addedBy = malayalam[track_index]['added_by'];
  let addedByElement = document.createElement('div');
  addedByElement.classList.add('added-by');

if (addedBy === 'Added by Rikaz.' || addedBy === 'Added by Nadeer.') {
    let blueTickElement = document.createElement('img');
    blueTickElement.src = '/static/images/icons8-verification-badge-48.png';
    blueTickElement.alt = 'Blue Tick';
    addedByElement.appendChild(document.createTextNode(addedBy));
    addedByElement.appendChild(blueTickElement);
} else if (addedBy === 'Added by Terminal.') {
    let developerElement = document.createElement('img');
    developerElement.src = '/static/images/icons8-developer-64.png';
    developerElement.alt = 'Developer';
    addedByElement.appendChild(document.createTextNode(addedBy));
    addedByElement.appendChild(developerElement);
} else {
    // Replace "SPaCE" with an actual space
    addedBy = addedBy.replace(/SPaCE/g, ' ');

    addedByElement.textContent = addedBy;
}

now_playing.appendChild(addedByElement);


  // Set the update timer
  updateTimer = setInterval(setUpdate, 1000);
  curr_track.addEventListener('ended', nextTrack);
}



function reset() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function randomTrack() {
  isRandom ? pauseRandom() : playRandom();
}

function playRandom() {
  isRandom = true;
  randomIcon.classList.add('randomActive');
}

function pauseRandom() {
  isRandom = false;
  randomIcon.classList.remove('randomActive');
}

function repeatTrack() {
  let current_index = track_index;
  loadTrack(current_index);
  playTrack();
}

function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  wave.classList.add('playing'); // Add the 'playing' class
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  wave.classList.remove('playing'); // Remove the 'playing' class
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
  if (track_index < malayalam.length - 1 && isRandom === false) {
    track_index += 1;
  } else if (track_index < malayalam.length - 1 && isRandom === true) {
    let random_index = Number.parseInt(Math.random() * malayalam.length);
    track_index = random_index;
  } else {
    track_index = 0;
  }
  loadTrack(track_index);
  playTrack();
  setupMediaSessionControls()
}

function prevTrack() {
  if (track_index > 0) {
    track_index -= 1;
  } else {
    track_index = malayalam.length - 1;
  }
  loadTrack(track_index);
  playTrack();
  setupMediaSessionControls()
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

volume_slider.addEventListener('input', setVolume);

function setUpdate() {
  let seekPosition = 0;
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60) + 1;
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

let downloadBtn = document.querySelector('.floating-download-button');
downloadBtn.addEventListener('click', function() {
  let currentTrack = malayalam[track_index];
  let downloadLink = document.createElement('a');
  
  // Modify the download file name
  let fileName = currentTrack.name + ' [terminal.serveo.net]';
  
  downloadLink.href = currentTrack.music;
  downloadLink.setAttribute('download', fileName);
  
  // Append the download link to the document body
  document.body.appendChild(downloadLink);
  
  // Trigger the click event on the download link
  downloadLink.dispatchEvent(new MouseEvent('click'));
  
  // Remove the download link from the document body
  document.body.removeChild(downloadLink);
});

document.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
    playpauseTrack();
  } else if (event.code === 'ArrowRight') {
    nextTrack();
  } else if (event.code === 'ArrowLeft') {
    prevTrack();
  }
});

