const root = new XMBRoot();

const videosCategory = new XMBCategory({
	title: "Settings",
	icon: /* your image here */
});
const gamesCategory = new XMBCategory({
	title: "Games",
	icon: /* your image here */
});

const picturesCategory = new XMBCategory({
	title: "Pictures",
	icon: /* your image here */
});

const videosCategory = new XMBCategory({
	title: "Videos",
	icon: /* your image here */
});

const musicCategory = new XMBCategory({
	title: "Music",
	icon: /* your image here */
});


/*Adding the items*/
settingsCategory.add(new XMBAction({
  title: "Screen",
  icon: /*imagehere*/,
  onPress: () => console.log("pressed 'settings -> screen'");
}));



root.add(gamesCategory);
root.add(picturesCategory);
root.add(videosCategory);
root.add(musicCategory);





let ui: RenderXMB;

function setup() {
	createCanvas(800, 600);
	ui = new RenderXMB("../../www/assets/theme.json", root);
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
