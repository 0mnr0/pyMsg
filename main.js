(function(){
	let alertShowen = false;
	
	function pinger() {
		fetch('http://127.0.0.1:8970/ping').then(res => {
			if (document.querySelector('.pingBar')){
				document.querySelector('.pingBar').classList.add('sucsess')
			}
		}).catch(err=>{
			if (document.querySelector('.pingBar')){
				document.querySelector('.pingBar').classList.remove('sucsess')
			}
			if (!alertShowen) { alert("Ping to server is not sucsessful") }
			alertShowen = true;
		})
	};
	window.pinger = pinger;
})();




window.onload = function() {
	pinger()
	setInterval(pinger, 2000)
}
