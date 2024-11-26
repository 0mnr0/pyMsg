let deletedMsgs = [];
let canUpdateMessages = true;	



let FileInput = null;
let TameImpalaDict = {
	0: {text: "I cannot vanish, you will now scare me", time: 3.85},
	1: {text: "Try to get through it, try to push through it", time: 3.85},
	2: {text: "You were not thinking that I will not do it", time: 3.85},
	3: {text: "They be lovin' someone and I'm another story", time: 3.85},
	4: {text: "Take the next ticket, get the next train", time: 3.85},
	5: {text: "Why would I do it? Anyone'd think that", time: 3.85},
	6: {text: "Baby, now I'm ready, moving on", time: 3.85},
	7: {text: "Oh, but maybe I was ready all along", time: 3.85},
	8: {text: "Oh, I'm ready for the moment and the sound", time: 3.85},
	9: {text: "Oh, but maybe I was ready all along", time: 3.85},
	10: {text: "Baby, now I'm ready, moving on", time: 3.85},
	11: {text: "Oh, but maybe I was ready all along", time: 3.85},
	12: {text: "Oh, I'm ready for the moment and the sound", time: 3.85},
	13: {text: "Oh, but maybe I was ready all along", time: 3.85}
}

function LaunchTame(){
	if (CanSendMessages === false) {console.warn("Message Cooldown working! Try another time"); return 0}
	for (let i = 0; i < 14; i++){
			setTimeout(function(){
			fetchData('/send', 'POST', {user_id: localStorage.getItem('authName'+authVersion), message: TameImpalaDict[i].text, pass: localStorage.getItem('password'+authVersion)}).then(res=> {
				fetchData('/getMessages','GET').then(evData => {
					refreshWithChatMessages(evData)
				})
			})
		}, (3850*i)+TameImpalaDict[i].time*1000)
		
	}
}


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
		chat.scrollTo({top: chat.scrollHeight*2, behavior: 'smooth'})
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


function createMessageInChat(dat, afterISended){
		if (afterISended) {
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
		msg.setAttribute('msgId', dat.id)
		msg.id = 'userMessage'+(dat.id)
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
				return
			}
		} catch(e) {}
		
		msg.classList.add('userMessage');
		if (dat.user_id === localStorage.getItem('authName'+authVersion)) {
			msg.classList.add('myMessage');
		}
		if (dat.user_id === 1) {
			msg.classList.add('myMessage');
		}
		let totalInner = `
			<div class="userCreds"> <span class="userName">${dat.user_id}</span> <img src="https://ionoto.ru/upload/medialibrary/a1f/tcs61nk83dig738gik8qtkcx6ue7sgek.png"></div>`
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
			if (dat.message.length > 0) { totalInner+=`<span class="text"></span>` }
			totalInner+=`<span class="timestamp">${dat.timestamp}</span>
		`;
		
		 
		msg.innerHTML = totalInner
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
		if (isScrolledToBottom(chat)) {
			chat.appendChild(msg)
			chat.scrollTo({top: chat.scrollHeight})
		} else {
			chat.appendChild(msg)
		}
		
		
		if (msg.querySelector('img.deleteMsg')) {
			msg.querySelector('img.deleteMsg').addEventListener('click',function(){
				let uc = confirm("Удалить сообщение?")
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
}
function refreshWithChatMessages(json, afterISended) {
    canUpdateMessages = false;
    try {
        let LastPossibleMessage = json.id;
        let startmsgCount = json[0].id;
        let totalMsgCount = json.length;
        let i = 0;

        function processNextMessage() {
			document.querySelector('div.chatBox span.chatTitle').textContent = 
				'Чат (' + (document.querySelectorAll('div.chatBox .userMessage').length) + '): ';
            if (i < totalMsgCount) {
                let dat = json[i];
                createMessageInChat(dat, afterISended);
                i++;
                requestAnimationFrame(processNextMessage); // Продолжаем обработку в следующем кадре
            } else {
                canUpdateMessages = true; // Завершаем обновление
            }
        }

        requestAnimationFrame(processNextMessage); // Запускаем процесс
    } catch (e) {
        console.warn(e);
        canUpdateMessages = true;
    }
}


let UnSucsessConnextions = 0;
let ErrorNotificationShowen = false;
async function fetchStream() {
	fetchData('/getMessages', 'GET').then(res => {
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
		setTimeout(fetchStream, 1000);
		if (navigator.userAgent.includes('OPR')) {
			document.body.classList.add('is-opera');
		}
	})	
}
