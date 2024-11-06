(function(){
	function pinger() {
		fetch('http://127.0.0.1:8970/ping').then(res => {
			if (document.querySelector('.pingBar')){
				document.querySelector('.pingBar').classList.add('sucsess')
			}
		}).catch(err=>{
			if (document.querySelector('.pingBar')){
				document.querySelector('.pingBar').classList.remove('sucsess')
			}
		})
	};
	window.pinger = pinger;
})();




window.onload = function() {
	pinger()
	setInterval(pinger, 2000);
	 
	 
	let RegForm = document.querySelector('div.RegistrationForm');
	RegForm.addEventListener('mouseenter', function(){
		RegForm.classList.add('loadedEffect')
	})
	RegForm.addEventListener('mouseleave', function(){
		removeLoadedEffect(RegForm)
	})
	 
	let ContinueButton = document.querySelector('button.continue');
	ContinueButton.addEventListener('click', function(){
		let inp = document.querySelector('div.RegistrationForm input.userName')
		if (inp.value.length < 3){
			alert("Имя должно длиной быть больше 2 символов")
		} else if {
			fetch('http://127.0.0.1:8970/isRegistered','GET').then(res=>{
				
			})
		
		}
	})
}


