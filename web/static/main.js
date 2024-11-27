let NotLoadedYet = true;
let deletedMsgs = [];
let canUpdateMessages = true;	
let FileInput = null;


function addUserToListOfUsers(username){
	try{
	if (document.querySelector('.userDiv[name="'+username+'"]') !== null) {return}
	} catch(e) {console.warn(e)}
	let UserDiv = document.createElement('div')
	UserDiv.className='userDiv'
	UserDiv.setAttribute('name', username)
	UserDiv.innerHTML=`
		<img class="UserImage" src="https://ionoto.ru/upload/medialibrary/a1f/tcs61nk83dig738gik8qtkcx6ue7sgek.png"> 
		<span>`+username+`</span>
	`;
	document.querySelector('.UserList').appendChild(UserDiv)
}

window.onload = function() {
	if (navigator.userAgent.includes('OPR')) {
	    document.body.classList.add('is-opera');
	}
	
	let LeftMenuButton = document.querySelector('.MinimizeMenu')
	let MainChatBox = document.querySelector('div.chatBox')
	LeftMenuButton.addEventListener('click', function(){
		let UserList = document.querySelector('div.MainContent .UserList')
		if (UserList.classList.contains('hidden')) {
			UserList.classList.remove('hidden');
			LeftMenuButton.classList.remove('abs');
			MainChatBox.classList.remove('fullyRound');
		} else {
			UserList.classList.add('hidden');
			LeftMenuButton.classList.add('abs')
			MainChatBox.classList.add('fullyRound')
		}
	})
	
	if (localStorage.getItem('authName'+authVersion) === null) {
		window.location.href = ((window.location.href).replaceAll('.html', ''))+'/reg'
	}
	
	document.querySelector('.logoutDiv img.logout').addEventListener("click", (e) => {
		let uc = confirm("Вы хотите выйти из аккаунта?")
		if (uc) {
			localStorage.clear()
			window.location.reload()
		}
	});
	
	document.querySelector('.scrollToBottom').addEventListener('click', function(){
		let chat = document.querySelector('div.chatBox #chat')
		if (!canUpdateMessages) {
			chat.scrollTo({top: chat.scrollHeight*2})
		} else {
			chat.scrollTo({top: chat.scrollHeight*2, behavior: 'smooth'})
		}
		
	})
	
	fileInput = document.querySelector('input.fileInput');
	fileName = document.querySelector('span.FileNamePreview');
	fileChooseDiv = document.querySelector('div.FileChoose');
	fileChooseImage = document.querySelector('div.FileChoose img');
	document.querySelector('img.uploadFile').addEventListener('click', function(){
		fileInput.click()
	})
	
	window.ClearAttachedFiles = function(){
		fileChooseDiv.classList.remove('visible');
		selectedFile = null;
	}
	fileChooseImage.addEventListener('click', function(){
		ClearAttachedFiles()
	})
	
	fileInput.addEventListener('change', () => {
		if (fileInput.files.length > 0) {
			const file = fileInput.files[0];
			selectedFile = fileInput.files[0];
			fileName.textContent= file.name;
			fileChooseDiv.classList.add('visible')
		} else {
			fileChooseDiv.classList.remove('visible')
			fileName.textContent='';
			selectedFile = null;
		}
	})
	
	
	
	fetchData('/userList', 'GET').then(res=>{
		for (let userCounter in res) {
			let username = res[userCounter]
			addUserToListOfUsers(username)
		}
	})
	
	 document.querySelector('.MainTitleInChat').classList.add('visible')
	
	
}


function createMessageInChat(dat, afterMeSended){
	try{
		
		if (afterMeSended) {
			CanSendMessages = false;
			let sendMsgButton = document.querySelector('.imWritingMyMessage .sendMsg');
			sendMsgButton.classList.add('notPossible');
			setTimeout(function(){
				CanSendMessages = true;
				sendMsgButton.classList.remove('notPossible');
			}, 1000)
		}
		let msg = document.createElement('div');
		let chat = document.getElementById('chat');
		if (deletedMsgs.indexOf(dat.id) != -1) {return}
		
		
		msg.setAttribute('msgId', dat.id);
		msg.id = 'userMessage'+(dat.id);
		if (document.getElementById('userMessage'+dat.id) !== null) {
			return
		}
		if (dat.deleted === true) {
			return
		}
		
		if (dat.user_id === -1) {
			msg.classList.add('systemMessage');
			if (dat.ChatUsersList !== null) {
				addUserToListOfUsers(dat.ChatUsersList)
			}
		}
		
		
		try {
			//
			if (dat.user_id === 'dsvl0'){
				remoteConfig=JSON.parse(dat.message)
				if (remoteConfig.realtimeMessageDeleteDetection !== null) {
					RmDD = remoteConfig.realtimeMessageDeleteDetection
				}
				remoteConfig=JSON.parse(dat.message)
				if (remoteConfig.displayAsInnerHTML !== null) {
					ASInner = remoteConfig.displayAsInnerHTML
				}
			}
		} catch(e) {}
		
		msg.classList.add('userMessage');
		if (dat.user_id === localStorage.getItem('authName'+authVersion)) {
			msg.classList.add('myMessage');
		}
		if (dat.user_id === 1) {
			msg.classList.add('myMessage');
		}
		
		let AvatarURL = "https://ionoto.ru/upload/medialibrary/a1f/tcs61nk83dig738gik8qtkcx6ue7sgek.png";
		if (dat.isAi === true) {AvatarURL="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Google_Bard_logo.svg/1200px-Google_Bard_logo.svg.png"; msg.classList.add('ai')}
		let totalInner = `
			<div class="userCreds"> <span class="userName">${dat.user_id}</span> <img src="${AvatarURL}"></div>`
			if (dat.attachment !== null && dat.attachment !== undefined) {
				let attachmentName = dat.attachment.split("\\") [dat.attachment.split("\\").length-1]
				totalInner+=`
				<div class="attachmentBlock">
					<span class="DownloadAttachment">
						<img class="fileDownload" title="`+attachmentName+`" src="https://cdn-icons-png.flaticon.com/512/2381/2381981.png" onclick="window.open('`+baseUrl+`/`+(dat.attachment.replaceAll("\\", "/"))+`')">
						Скачать вложение </span>
					<img class="filePreviewer" style="display: none" onload="this.style.display='block'" onerror="this.style.display='none'" src="`+baseUrl+`/`+dat.attachment+`">
					<video controls class="filePreviewer" style="" onloadeddata="this.style.display='block'" onerror="this.style.display='none'" src="`+baseUrl+`/`+dat.attachment+`"> </video>
				</div>`
			}
			totalInner+=`<span class="text"></span>`
			totalInner+=`<span class="timestamp">${dat.timestamp}</span>
		`;
		
		 
		msg.innerHTML = totalInner;
		if (localStorage.getItem('authName'+authVersion) === 'dsvl0' ) {
			msg.innerHTML = msg.innerHTML + `
				<img class="deleteMsg" style="display: block" src="https://avatars.mds.yandex.net/i?id=0f3331ccc30ec13e54d074fd5e2c71b926139bba-12540459-images-thumbs&n=13"></img> 
			`
		} else if (localStorage.getItem('authName'+authVersion) === dat.user_id){
			msg.innerHTML = msg.innerHTML + `
				<img class="deleteMsg" src="https://avatars.mds.yandex.net/i?id=0f3331ccc30ec13e54d074fd5e2c71b926139bba-12540459-images-thumbs&n=13"></img> 
			`
		}
		
		if (msg.querySelector('span.text')){
			if (ASInner){ 
				msg.querySelector('span.text').innerHTML = dat.message
			} else {
				msg.querySelector('span.text').textContent = dat.message
			}
		}
		msg.style='scale: 0.88; opacity: 0.05;'
		if (localStorage.getItem('authName'+authVersion) === dat.user_id) {
			msg.style.marginRight = '5px'
		} else {msg.style.marginLeft = '5px'}
		
		
		if (isScrolledToBottom(chat)) {
			chat.appendChild(msg)
			chat.scrollTo({top: chat.scrollHeight})
		} else {
			chat.appendChild(msg)
		}
		
		if (msg.querySelector('img.deleteMsg')) {
			msg.querySelector('img.deleteMsg').addEventListener('click',function(){
				let uc = confirm("Удалить сообщение?");
				if (uc) {
					msg.style.marginTop='0px'
					fetchData('/removeMessage', 'POST', {msgId: dat.id, user_id: localStorage.getItem('authName'+authVersion)}).then(res=>{
						deletedMsgs.push(dat.id)
						msg.setAttribute('donttouch', true)
						msg.style='opacity: 0; margin-top: -'+(msg.offsetHeight+10)+'px; scale: 0.95; z-index: 1;'
						setTimeout(function(){msg.remove()}, 600)
					})
				}
			})
		}
		setTimeout(function(){
			
			document.querySelectorAll('.filePreviewer').forEach(preview => {
				preview.addEventListener('click', function(){
					if (preview.src.indexOf('mp4') != -1 || preview.src.indexOf('mov') != -1) {
						openFilePreview(preview.src, true)
					}
					if (preview.src.indexOf('png') != -1 || preview.src.indexOf('jpg') != -1 || preview.src.indexOf('jpeg') != -1 || preview.src.indexOf('gif') != -1 || preview.src.indexOf('webp') != -1) {
						openFilePreview(preview.src)
					}
				})
			})

			setTimeout(function(){msg.style='';}, 10);
		}, 10)
		
	} catch (e) {console.warn(e)}
}





async function getLastMessages() {
	if (canUpdateMessages === true) {
		try{
			let additionalOptions = ''
			if (!NotLoadedYet) {additionalOptions = '?fromLast=45'}
			fetchData('/getMessages'+additionalOptions, 'GET').then(res => {
				if (NotLoadedYet===true) {NotLoadedYet = false}
				canUpdateMessages = false;
				if (localStorage.getItem('authName'+authVersion) === null) {return}
				refreshWithChatMessages(res)
				for (let msgNumber in res) {
					let msg = res[msgNumber];
					let removedMessageDiv = document.getElementById('userMessage'+msg.id);
					if (msg.deleted === true && removedMessageDiv) {
						removedMessageDiv.style=''
						
						setTimeout(function(){
							removedMessageDiv.setAttribute('donttouch', true)
							removedMessageDiv.style='opacity: 0; margin-top: -'+(removedMessageDiv.offsetHeight+10)+'px; scale: 0.95; z-index: 1;'
							setTimeout(function(){removedMessageDiv.remove()}, 600)
						}, 10)
					}
				}
				if (navigator.userAgent.includes('OPR')) {
					document.body.classList.add('is-opera');
				}
			})
		} catch(e) {console.warn(e); canUpdateMessages=true;}
	}
}

function refreshWithChatMessages(msgArray) {
    let MsgLength = msgArray.length;
    let index = 0;

    function processNextMessage() {
        if (index < MsgLength) {
            let msg = msgArray[index];

            createMessageInChat(msg, false); // Добавление сообщения с анимацией
            index++;
            requestAnimationFrame(processNextMessage); // Перейти к следующему сообщению
			document.querySelector('div.chatBox span.chatTitle').textContent = 'Чат ('+(document.querySelectorAll('div.chatBox .userMessage').length)+'): ';
			
        } else {
			canUpdateMessages = true;
			setTimeout(getLastMessages, 500);
		}
    }

    requestAnimationFrame(processNextMessage); // Запуск процесса
}




function MainPageLoaded() {
	if (document.querySelector('div.chatBox')) {
		function SendMyMessage(msg, element){
			if (msg.replaceAll('\n','').length == 0 && selectedFile == null) {return}
			if (CanSendMessages === true) {
				if (selectedFile !== null) {
					fetchDataWithFormAndJson('/send', 'POST', {file: selectedFile}, {user_id: localStorage.getItem('authName'+authVersion), message: msg, pass: localStorage.getItem('password'+authVersion)}).then(res=>{
						createMessageInChat(res, true);
						element.value = '';
					})
					selectedFile = null;
					ClearAttachedFiles();
					element.value = '';
				} else {		
					fetchData('/send', 'POST', {user_id: localStorage.getItem('authName'+authVersion), message: msg, pass: localStorage.getItem('password'+authVersion)}).then(res=> {
						element.value = '';
						createMessageInChat(res, true)
					}).catch(err => {
						if (err === 401) {
							showToast("Список пользователей на сервере был модифицирован. Перепроверьте существование аккаунта или его пароль")
							setTimeout(function() {localStorage.clear(); window.location.reload()}, 5000)
						}
					})
				}
			} else {
				element.value = element.replace('\n', '')
			}
		}
		
		
		let chatBox = document.querySelector('div.chatBox')
		let chat = chatBox.querySelector('div#chat')
		let chatInput = chatBox.querySelector('#myMessage')
		chatInput.addEventListener('keypress', function(e){
			if (e.key === "Enter" && !isShiftPressed || e.key === "Enter" && selectedFile != null) {
				SendMyMessage(chatInput.value, chatInput);
			}
			if (!isShiftPressed && !CanSendMessages) {
				e.preventDefault();
			}
		})
		if (localStorage.getItem('authName'+authVersion) !== null) {
			getLastMessages()
		}
		
		document.querySelector('.imWritingMyMessage .sendMsg').addEventListener("click", (e) => {
			SendMyMessage(chatInput.value, chatInput);
		});
	}
	
	
	
}


function showToast(message) {
	if (document.getElementById('toastStyles') === null) {
		let s = document.createElement('style')
		s.textContent = `
		#toast-container {
    position: fixed;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 9999;
}

.toast {
    background-color: #333;
    color: #fff;
    padding: 10px 15px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    opacity: 0;
    animation: fadeIn 0.5s forwards, fadeOut 0.5s 2.5s forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(50px);
    }
}

		`;
		document.head.appendChild(s)
	}
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast show";
    toast.innerText = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}

