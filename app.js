const startButton = document.querySelector("#start");
const endButton = document.querySelector("#stop");
const speachButton = document.querySelector("#speach");
const msgs = document.querySelector(".messages");
const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const openingSound = document.querySelector("#opening-sound");

const API_KEY = '____________________________________'; // Removed chat gpt api key due to security reasons, to run this program on your device you must register for an api key on the chat gpt website


// creating chat
function createMsg(who, msg){
    let newmsg = document.createElement("p");
    newmsg.innerText = msg;
    newmsg.setAttribute("class", who);
    msgs.appendChild(newmsg);
}
 
// start up
function autoJarvis(){
    setTimeout(() => {
        recognition.start();
    }, 1000);
}

window.onload = () => {
    openingSound.play();
    openingSound.addEventListener("ended", () => { 
      setTimeout(() => {
        autoJarvis();
        readOut("Ready to go sir");
      }, 200);
    });
  }  



// speech reco start
recognition.onstart = function () {
    console.log("voice active");
};

// on result
recognition.onresult = async function (event) {
    let current = event.resultIndex;
    let transcript = event.results[current][0].transcript;
    transcript = transcript.toLowerCase();

    createMsg("usermsg", transcript);

    if (transcript.includes("hi jarvis")){
        readOut("hello sir, how are you doing today");
    } else if (transcript.includes("what is your name")){
        readOut("my name is jarvis you");
    } else if (transcript.includes("open youtube")){
        readOut("opening youtube sir");
        window.open("https://www.youtube.com/");
    } else if (transcript.includes("open google")){
        readOut("opening google sir");
        window.open("https://www.google.com/");
    }else if (transcript.includes("open gmail")){
        readOut("opening gmail sir");
        window.open("https://www.gmail.com/");
    } else if (transcript.includes("open outlook")){
        readOut("opening outlook sir");
        window.open("https://www.outlook.com/");
    } else if (transcript.includes("search for") || transcript.includes("show me")){
        readOut("Here is your result sir");
        let input = transcript.split("");
        input.splice(0,11);
        input = input.join("").split(" ").join("+");
        window.open(`https://www.google.com/search?q=${input}`)
        console.log(input);
    } else if (transcript.includes("search youtube for")){
        readOut("Here is your result sir");
        let input = transcript.split("");
        input.splice(0,19);
        input = input.join("").split(" ").join("+");
        window.open(`https://www.youtube.com/search?q=${input}`)
        console.log(input);
    } else if (transcript.includes("what is the weather in")){
        let input = transcript.slice(22).trim();
        readOut("showing weather in " + input + " sir");
        findWeather(input);
    } else if (transcript.includes("play the song")){
        let input = transcript.slice(13).trim();
        readOut("playing the song " + input + " sir");
        let voiceCommandMusic = true;
        loadSong(input, voiceCommandMusic);
    } else {
        try {
            const response = await callGptAPI(transcript);
            readOut(response.choices[0].text);
          } catch (error) {
            console.error("Error calling GPT API:", error);
          }
    }

};

// speech reco stop
recognition.onend = function (event){
    console.log("voice deactiviated");
};

// voice reco continuous
// recognition.continuous = true;


startButton.addEventListener("click", () => {
    recognition.start();
});

endButton.addEventListener("click", () => {
    recognition.stop();
});


// jarvis speech
function readOut(message){
    const speech = new SpeechSynthesisUtterance();
    // different voices
    const allVoices = speechSynthesis.getVoices();
    speech.voice = allVoices[8];
    speech.text = message;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
    console.log("speaking out");
    createMsg("jmsg", message);
}

  
  

async function callGptAPI(input) {
    const url = "https://api.openai.com/v1/engines/text-davinci-002/completions";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    };
    const data = {
      prompt: `You are Jarvis, a virtual assistant with witty responses and swearing. ${input}`,
      max_tokens: 500,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    return await response.json();
}


function findWeather(city){
    console.log(city);
    const apiKey =  "18b85c3c0e72393779154b876d70b239";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
    const weatherIcon = document.querySelector(" .weather-icon");

    async function checkWeather(city){
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        var data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        
        if(data.weather[0].main == "Clouds"){
            weatherIcon.src = "images/clouds.png"
        } else if (data.weather[0].main == "Clear"){
            weatherIcon.src = "images/clear.png"
        } else if (data.weather[0].main == "Rain"){
            weatherIcon.src = "images/Rain.png"
        } else if (data.weather[0].main == "Drizzle"){
            weatherIcon.src = "images/drizzle"
        } else if (data.weather[0].main == "Mist"){
            weatherIcon.src = "images/mist.png"
        }

        const weatherElement = document.querySelector(".weather");
        if (weatherElement) {
          weatherElement.style.display = "block";
        }
    
        const errorElement = document.querySelector(".error");
        if (errorElement) {
          errorElement.style.display = "none";
        }

        
    }
    checkWeather(city);
    
}

// music player
const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');

// Song titles
const songs = ['hey', 'summer', 'The Color Violet', 'ukulele', 'reminder'];

// Keep track of song
let songIndex = 4;

// Initially load song details into DOM
loadSong(songs[songIndex]);

// Update song details
function loadSong(input, voiceCommandMusic) {
  title.innerText = input;
  audio.src = `music/${input}.mp3`;
  cover.src = `music-images/${input}.jpg`;
  console.log(input);
  if(voiceCommandMusic == true){
    playSong();
  }
}

// Play song
function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');

  audio.play();
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');

  audio.pause();
}

// Previous song
function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }

  loadSong(songs[songIndex]);

  playSong();
}

// Next song
function nextSong() {
  songIndex++;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);
  playSong();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

//get duration & currentTime for Time of song
function DurTime (e) {
	const {duration,currentTime} = e.srcElement;
	var sec;
	var sec_d;

	// define minutes currentTime
	let min = (currentTime==null)? 0:
	 Math.floor(currentTime/60);
	 min = min <10 ? '0'+min:min;

	// define seconds currentTime
	function get_sec (x) {
		if(Math.floor(x) >= 60){
			
			for (var i = 1; i<=60; i++){
				if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) {
					sec = Math.floor(x) - (60*i);
					sec = sec <10 ? '0'+sec:sec;
				}
			}
		}else{
		 	sec = Math.floor(x);
		 	sec = sec <10 ? '0'+sec:sec;
		 }
	} 

	get_sec (currentTime,sec);

	// change currentTime DOM
	currTime.innerHTML = min +':'+ sec;

	// define minutes duration
	let min_d = (isNaN(duration) === true)? '0':
		Math.floor(duration/60);
	 min_d = min_d <10 ? '0'+min_d:min_d;


	 function get_sec_d (x) {
		if(Math.floor(x) >= 60){
			
			for (var i = 1; i<=60; i++){
				if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) {
					sec_d = Math.floor(x) - (60*i);
					sec_d = sec_d <10 ? '0'+sec_d:sec_d;
				}
			}
		}else{
		 	sec_d = (isNaN(duration) === true)? '0':
		 	Math.floor(x);
		 	sec_d = sec_d <10 ? '0'+sec_d:sec_d;
		 }
	} 

	// define seconds duration
	
	get_sec_d (duration);

	// change duration DOM
	durTime.innerHTML = min_d +':'+ sec_d;
		
};

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);

// Time of song
audio.addEventListener('timeupdate',DurTime);
