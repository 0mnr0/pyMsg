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
