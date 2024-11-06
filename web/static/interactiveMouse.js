
window.addEventListener('load', function(){
	let msitrct = document.querySelector('div.mouseInteract')
	let basicStyle = 'z-index: 1;'
	document.body.style=' z-index: 2'
	if (msitrct){
		msitrct.style='background: #11111180; filter: blur(10px)'

		window.addEventListener('mousemove', function(coords){
			console.log(coords)
		})
	}
})