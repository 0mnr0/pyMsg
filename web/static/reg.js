



window.onload = function() {
	 
	 
	let RegForm = document.querySelector('div.RegistrationForm');
	RegForm.addEventListener('mouseenter', function(){
		RegForm.classList.add('loadedEffect')
	})
	RegForm.addEventListener('mouseleave', function(){
		removeLoadedEffect(RegForm)
	})
	 
	let ContinueButton = document.querySelector('button.continue');
	ContinueButton.addEventListener('click', function(){
		function isEnglishAndDigitsOnly(str) {
			return /^[A-Za-z0-9]+$/.test(str);
		}

		
		ContinueButton.disabled = true;
		let inp = document.querySelector('div.RegistrationForm input.userName')
		let passinput = document.querySelector('div.RegistrationForm input.userPassword')
		if (inp.value.length < 3){
			alert("Имя должно длиной быть больше 2 символов");
			ContinueButton.disabled = false;
		} else {
			let insertedValue = inp.value;
			let passWord = passinput.value;
			if (!isEnglishAndDigitsOnly(insertedValue)) {
				alert("Имя не подходит под требования!");
				ContinueButton.disabled = false;
				return
			}
			if (passWord.length <= 3) {
				alert("Пароль не подходит под требования!");
				ContinueButton.disabled = false;
				return
			}
			
			
			fetchData(baseUrl+'/isRegistered', 'POST', { name: insertedValue }).then(res=>{
				if (res.isRegistered == true) {
					document.querySelector('.userExistsStatus').classList.remove('correctuserName')
					document.querySelector('.userExistsStatus').classList.add('incorrectuserName')
					document.querySelector('.userExistsStatus').textContent = 'Это имя уже занято';
					ContinueButton.disabled = false;
					return
				} else {
					document.querySelector('.userExistsStatus').textContent = 'Это имя свободно :)'
					document.querySelector('.userExistsStatus').classList.add('correctuserName')
					document.querySelector('.userExistsStatus').classList.remove('incorrectuserName')
				}
				fetchData('/userRegister', 'POST', {name: insertedValue, pass: passWord}).then(reg=>{
					
					localStorage.setItem('authName'+authVersion, insertedValue);
					localStorage.setItem('password'+authVersion, passWord);
					ContinueButton.disabled = false;
					setTimeout(function(){
						alert("Вы усепшно зарегистрировались под именем '"+insertedValue+"'!");
						window.location.href = (window.location.href.replaceAll('/reg',''));
					}, 100)
				}).catch(e => {alert("Не удалось вас зарегистрировть :("); console.warn(e); ContinueButton.disabled = false;})
			}).catch(err => {
				alert(err);
				ContinueButton.disabled = false;
			})
		
		}
	})
}


