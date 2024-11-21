
const baseUrl = 'http://192.168.12.26:8970';
const authVersion = 'v3';
var CanSendMessages = true;

var RmDD = true;
var ASInner = false;

const isScrolledToBottom = (div) => {
  return div.scrollHeight - div.scrollTop === div.clientHeight;
};

document.title = 'PyMsg!'


function scrollToBottom(){
	let chat = document.querySelector('div.chatBox #chat')
	if (chat) {
		if (isScrolledToBottom(chat)) {
			document.querySelectorAll('.scrollToBottom').forEach(scrollBtn => {scrollBtn.classList.remove('visible')})
		} else {
			document.querySelectorAll('.scrollToBottom').forEach(scrollBtn => {scrollBtn.classList.add('visible')})
		}
	}
}

setInterval(scrollToBottom, 100)

function removeLoadedEffect(element) {
	const pseudoElement = window.getComputedStyle(element, '::before');
	const currentBgPosition = pseudoElement.getPropertyValue('background-position');
	
	element.style.setProperty('--background-position', currentBgPosition);
	
	element.classList.add('fadeOut');
	
	setTimeout(() => {
		element.classList.remove('loadedEffect');
		element.classList.remove('animatedBorder');
		element.classList.remove('fadeOut');
		element.style.removeProperty('--background-position');
	}, 500);
}


function fetchData(url, method, json) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
        .then(response => {
            if (!response.ok) {
                reject(`Ошибка: ${response.status} ${response.statusText}`);
            } else {
                return response.json(); // Преобразуем ответ в JSON
            }
        })
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
}



function MainPageLoaded() {
	if (document.querySelector('div.chatBox')) {
		function SendMyMessage(msg, element){
			if (msg.replaceAll('\n','').length == 0) {return}
			if (CanSendMessages === true) {
				fetchData('/send', 'POST', {user_id: localStorage.getItem('authName'+authVersion), message: msg, pass: localStorage.getItem('password'+authVersion)}).then(res=> {
					element.value = '';
					createMessageInChat(res, true)
				})
			} else {
				element.replace('\n', '')
			}
		}
		
		
		let chatBox = document.querySelector('div.chatBox')
		let chat = chatBox.querySelector('div#chat')
		let chatInput = chatBox.querySelector('textarea#myMessage')
		chatInput.addEventListener('keypress', function(e){
			if (e.key === "Enter" && !isShiftPressed) {
				SendMyMessage(chatInput.value, chatInput);
			}
			if (!isShiftPressed && !CanSendMessages) {
				e.preventDefault();
			}
		})
		if (localStorage.getItem('authName'+authVersion) !== null) {
			fetchStream()
		}
		
		document.querySelector('.imWritingMyMessage .sendMsg').addEventListener("click", (e) => {
			SendMyMessage(chatInput.value, chatInput);
		});
	}
	
	
	
}


let isShiftPressed = false;

document.addEventListener("keydown", (event) => {
  if (event.shiftKey) {
    isShiftPressed = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "Shift") {
    isShiftPressed = false;
  }
});


