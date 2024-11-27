let LoginType = 'reg'



window.onload = function() {
	let origHeight = 0;
	let ContinueButton = document.querySelector('button.continue');
	 
	let RegForm = document.querySelector('div.RegistrationForm');
	RegForm.addEventListener('mouseenter', function(){
		RegForm.classList.add('loadedEffect')
	})
	
	let MainTitle = document.querySelector('.RegistrationForm span.MainTitle');
	let WarningMessage = document.querySelector('.warning');
	let LoginSwitchType = document.querySelector('div.RegistrationForm a.switchLoginType');
	LoginSwitchType.addEventListener('click', function(){
		if (LoginType === 'reg'){
			LoginSwitchType.textContent = 'Или зарегистрировать новый аккаунт'
			LoginType='login';
			MainTitle.textContent = 'Войти в аккаунт';
			origHeight = WarningMessage.clientHeight
			WarningMessage.style='height: '+(origHeight-10)+'px';
			ContinueButton.textContent = 'Войти'
			setTimeout(function(){WarningMessage.style='height: 0px; padding: 0px 10px; '}, 10)
		} else {
			LoginSwitchType.textContent = 'Или войти в аккаунт'
			LoginType='reg';
			MainTitle.textContent = 'Регистрация';
			WarningMessage.style='height: 0px';
			ContinueButton.textContent = 'Зарегистрироваться'
			setTimeout(function(){WarningMessage.style='height: '+(origHeight)+'px;'}, 10)
			
		}
	})
	
	
	RegForm.addEventListener('mouseleave', function(){
		removeLoadedEffect(RegForm)
	})
	 
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
			
			
			
			
			console.warn("LoginType:",LoginType)
			if (LoginType !== 'login'){
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
					}).catch(e => {alert("Не удалось вас зарегистрировать :("); console.warn(e); ContinueButton.disabled = false;})
				}).catch(err => {
					alert(err);
					ContinueButton.disabled = false;
				})
			} else {
				fetchData(baseUrl+'/userLogin', 'POST', { name: insertedValue, pass: passWord}).then(res=>{
					ContinueButton.disabled = false;
					if (res.status === "OK"){
						localStorage.setItem('authName'+authVersion, insertedValue);
						localStorage.setItem('password'+authVersion, passWord);
						window.location.href = (window.location.href.replaceAll('/reg',''));
					}
				}).catch(err=>{
					if (err === 401) {
						alert("Неправильный логин или пароль")
					} else {
						alert("Что - то пошло не так");
						console.warn(err)
					}
					ContinueButton.disabled = false;
				})
			}
		
		}
	})
}


