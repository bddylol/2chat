(async function() {
  const socket = io('/voice')
  
	let Mute_Checkbox = document.getElementById("Mute_Checkbox");
	let Deafen_Checkbox = document.getElementById("Deafen_Checkbox");
	
	this.testTime = 300
	let stream;

  socket.emit('voice.join', document.currentScript.getAttribute('c'))

  try {
		if (Mute_Checkbox.checked == true || Deafen_Checkbox.checked == true) return;
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream)
  	mediaRecorder.start()
  
  	let fileReader = new FileReader();
  
  	mediaRecorder.ondataavailable = (e) => {
  		fileReader.readAsDataURL(e.data);
  		fileReader.onloadend = function() {
        //const muted = document.getElementById('muted').checked
  			//if (muted) return;
        socket.emit('voice.data', fileReader.result)
  		};
  	}
  	setInterval(() => {
  		mediaRecorder.stop()
  		mediaRecorder.start()
  	}, this.testTime)
  } catch (err) {
    // Microphone permissions disabled
  }

	
  socket.on('voice.data', (user, dataUri) => {
		if (Deafen_Checkbox.checked == true) return;
    console.log('Recieved voice data from', user.name)
    const aud = new Audio(dataUri)
    aud.play();
  })

  let usersDiv = document.getElementsByClassName('users')[0]

/*
  <!-- 
    Not speaking: <img class="user" id="USER_ID" src="USER_PFP" alt="USER_NAME"/>
    Speaking: <img class="user speaking" id="USER_ID" src="USER_PFP" alt="USER_NAME"/>
  -->
*/
  
  function handleUserJoin(user) {
    let figure = document.createElement('figure')
    let userImg = document.createElement('img')

    userImg.src = user.img

    userImg.classList.add('user')
    userImg.classList.add('userVoiceChatProfilePicture')
    figure.classList.add('userVoiceChatProfilePicture')

    figure.id = user.id

    userImg.alt = user.name
    
    usersDiv.appendChild(figure)
    figure.appendChild(userImg)
    figure.innerHTML = `${figure.innerHTML}<figcaption style="text-align:center;">${user.name}</figcaption>` 
  }

  socket.on('voice.users', (users) => {
    // Users is an object, key is socket.id, val is object with user id and user name
    console.log(`Welcome to 2chat voice! There are ${Object.values(users).length} users online in this voice channel, not including you.`)
    Object.values(users).forEach(user => handleUserJoin(user))
  })

  socket.on('voice.join', (user) => {
    console.log(user.name + ' just joined the VC!')
    handleUserJoin(user)
  })

  socket.on('voice.leave', (user) => {
    document.getElementById(user.id).remove()
  })
})();