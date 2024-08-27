let ui: RenderXMB;

function fetchTheme() {
	const request = new XMLHttpRequest();
	request.open('GET', '/assets/theme.json?' + Math.random(), false);
	request.send(null);
	
	if (request.status !== 200) {
		console.error('error fetching the theme:', request.statusText);
		return false;
	}
	
	console.log(request.responseText);
	return JSON.parse(request.responseText);
}

function setup() {
	createCanvas(windowWidth-10, windowHeight-10);
	textFont(loadFont('/assets/xmb.ttf'));
	ui = new RenderXMB(fetchTheme(), placeholders.xmb());
}

function windowResized() {
	resizeCanvas(windowWidth-10, windowHeight-10);
}

function draw() {
	ui.draw();
}

function keyPressed() {
	if (keyCode == LEFT_ARROW) ui.previousCategory();
	else if (keyCode == RIGHT_ARROW) ui.nextCategory();
	else if (keyCode == UP_ARROW) ui.previousOption();
	else if (keyCode == DOWN_ARROW) ui.nextOption();
	else if (keyCode == RETURN) ui.pressOption();
}
