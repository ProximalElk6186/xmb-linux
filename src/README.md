# XMB Menu Tutorial

In this tutorial, we'll walk you through creating a basic XMB menu structure with four categories: **Games**, **Pictures**, **Videos**, and **Music**. Each category will contain some example items.

## Step 1: Create the XMBRoot

Start by creating the root of your menu system, which will hold all the top-level categories.

```typescript
const root = new XMBRoot();
```

## Step 2: Create the Categories

Now, let's create the four main categories: **Games**, **Pictures**, **Videos**, and **Music**.

```typescript
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
```

## Step 3: Add Items to the Categories

Next, add some example items to each category. We'll create simple actions like "Game 1", "Picture 1", etc.

### Adding Items to the Games Category

```typescript
gamesCategory.add(new XMBAction({
	title: "Game 1",
	icon: /* your image here */,
	onPress: () => console.log("Launching Game 1")
}));

gamesCategory.add(new XMBAction({
	title: "Game 2",
	icon: /* your image here */,
	onPress: () => console.log("Launching Game 2")
}));
```

### Adding Items to the Pictures Category

```typescript
picturesCategory.add(new XMBAction({
	title: "Picture 1",
	icon: /* your image here */,
	onPress: () => console.log("Viewing Picture 1")
}));

picturesCategory.add(new XMBAction({
	title: "Picture 2",
	icon: /* your image here */,
	onPress: () => console.log("Viewing Picture 2")
}));
```

### Adding Items to the Videos Category

```typescript
videosCategory.add(new XMBAction({
	title: "Video 1",
	icon: /* your image here */,
	onPress: () => console.log("Playing Video 1")
}));

videosCategory.add(new XMBAction({
	title: "Video 2",
	icon: /* your image here */,
	onPress: () => console.log("Playing Video 2")
}));
```

### Adding Items to the Music Category

```typescript
musicCategory.add(new XMBAction({
	title: "Song 1",
	icon: /* your image here */,
	onPress: () => console.log("Playing Song 1")
}));

musicCategory.add(new XMBAction({
	title: "Song 2",
	icon: /* your image here */,
	onPress: () => console.log("Playing Song 2")
}));
```

## Step 4: Add Categories to the Root

```typescript
root.add(gamesCategory);
root.add(picturesCategory);
root.add(videosCategory);
root.add(musicCategory);
```

## Step 5: Render the XMB

Now for the most important part, we need to render our XMB.

```typescript
let ui: RenderXMB;

function setup() {
	createCanvas(800, 600);
	ui = new RenderXMB(/* your theme here */, root);
}

function draw() {
	ui.draw();
}
```

## Step 6: Handle User Input

Last but not least, we need to handle user input.

```typescript
function keyPressed() {
	if (keyCode == LEFT_ARROW) ui.previousCategory();
	else if (keyCode == RIGHT_ARROW) ui.nextCategory();
	else if (keyCode == UP_ARROW) ui.previousOption();
	else if (keyCode == DOWN_ARROW) ui.nextOption();
	else if (keyCode == RETURN) ui.pressOption();
}
```

## Final Structure

At this point, you've created an XMB menu structure with the following hierarchy:

- **Games**
  - Game 1
  - Game 2
- **Pictures**
  - Picture 1
  - Picture 2
- **Videos**
  - Video 1
  - Video 2
- **Music**
  - Song 1
  - Song 2

This structure can be navigated within your application, and the `onPress` callbacks will be triggered when items are selected.

### Summary

This tutorial showed you how to create a basic XMB menu structure with four categories and some example items in each. You can expand on this by adding more items, menus, or even subcategories to create a richer user experience.
