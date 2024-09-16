interface Playable {
	play(): void;
}

// this isnt quite ready for actual theming
// i just made it so i dont have magic values everywhere
// but there are still some magic values
// i just put a number to fix some bugs
// they number fixes them
// and i dont know what to name the number
// so i just keep it as a magic number
type XMBTheme = {
	easing: number,

	origin: {
		x: number,
		y: number
	},

	backgroundColor: any,
	defaultFontColor: any,
	selectedFontColor: any,
	defaultFontSize: number,

	menu: {
		root: {
			selectedFontSize: number,
			selectedIconSize: number,
			unselectedIconSize: number,
			xOffsetBetweenCategories: number,
		},

		items: {
			selectedIconSize: number,
			unselectedIconSize: number,
			drawLabelsForUnselected: boolean,
			description: {
				fontSize: number,
				color: number
			}
		}
	},

	clock: {
		backgroundColor: any | null, // null for no bg

		stroke: {
			color: any,
			weight: number
		},

		rect: {
			width: number,
			height: number,
			y: number
		},

		text: {
			fontSize: number,
			xOffset: number
		}
	}
}

class RenderXMBCategory {
	private readonly theme: XMBTheme;
	public readonly category: XMBCategory;
	public selected: number = 0;
	private height: number = 0;

	public constructor(theme: XMBTheme, category: XMBCategory) {
		this.theme = theme;
		this.category = category;
		this.updateTargetPositions();
	}

	public draw(x: number, y: number, cameraOffset: number, isSelected: boolean) {
		this.height = this.drawIcon(x, y, cameraOffset, isSelected) + this.drawName(x, y, cameraOffset, isSelected);
		if (isSelected) this.drawChildren(x, y, cameraOffset);
	}

	public drawIcon(x: number, y: number, cameraOffset: number, isSelected: boolean): number {
		const iconSize = isSelected ? this.theme.menu.root.selectedIconSize : this.theme.menu.root.unselectedIconSize;
		imageMode(CENTER);
		image(this.category.icon, x - cameraOffset, y, iconSize, iconSize);
		return iconSize;
	}

	public drawName(x: number, y: number, cameraOffset: number, isSelected: boolean): number {
		if (!isSelected) return 0;
		fill(this.theme.defaultFontColor);
		textSize(this.theme.menu.root.selectedFontSize);

		const textX = x - this.category.icon.width/2 - cameraOffset + 1;
		const textY = y + this.category.icon.height / 2 + 30;

		text(this.category.title, textX, textY);
		return this.theme.menu.root.unselectedIconSize / 2 + 30 + this.theme.menu.root.selectedFontSize;
	}

	public drawChildren(x: number, y: number, cameraOffset: number): void {
		this.category.children.forEach((child, i) => {
			child._y += (child._targetY - child._y) * this.theme.easing;
			this.drawChild(x, y, cameraOffset, child, i);
		})
	}

	public drawChild(x: number, y: number, cameraOffset: number, child: XMBItem, index: number): void {
		const isSelected = index === this.selected;
		const iconSize = isSelected ? this.theme.menu.items.selectedIconSize : this.theme.menu.items.unselectedIconSize;
		const yOffset = this.height / 2;
		
		const imageX = x - cameraOffset;
		const imageY = y + 40 + yOffset + child._y;

		image(child.icon, imageX, imageY, iconSize, iconSize);
		fill(isSelected ? this.theme.selectedFontColor : this.theme.defaultFontColor);
		textSize(this.theme.defaultFontSize);
		
		const textX = x - cameraOffset + iconSize / 2 + 10;
		const textY = y + 40 + yOffset + child._y;

		if (this.theme.menu.items.drawLabelsForUnselected || isSelected)
			text(child.title, textX, textY);

		if (!isSelected) return;

		const description = child.description;
		if (description.length == 0) return;

		const descY = textY + this.theme.defaultFontSize + 2;

		fill(this.theme.menu.items.description.color);
		textSize(this.theme.menu.items.description.fontSize);
		text(description, textX, descY)
	}

	public updateTargetPositions(): void { // only my previous self and god knows what this code does
		this.category.children.forEach((child, i) => {
			child._targetY = i < this.selected ? (i - this.selected) * 40 - this.height :
				i === this.selected ? 0 :
				(i - this.selected) * 40;
		})
	}
}

class RenderXMBClock {
	private readonly theme: XMBTheme;
	private x: number = 0;
	private y: number = 0;

	// YES TYPESCRIPT DOESNT HAVE A PAD METHOD BUT THANKS CHATGPT
	private static padStart(string: string, targetLength: number, padString: string) {
		string = String(string);
		if (string.length >= targetLength) return string;
		const paddingLength = targetLength - string.length;
		
		let repeatedPadString = ''; // YES TYPESCRIPT HASNT A REPEAT METHOD :-)
		while (repeatedPadString.length < paddingLength)
			repeatedPadString += padString;

		repeatedPadString = repeatedPadString.slice(0, paddingLength);
		return repeatedPadString + string;
	}

	public static timeString(): string {
		const date = new Date();
		
		const day = date.getDate();
		const month = date.getMonth() + 1;

		let hours = date.getHours();
		const minutes = RenderXMBClock.padStart(date.getMinutes().toString(), 2, '0');
		
		const amPm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12;

		return `${day}/${month} ${hours}:${minutes} ${amPm}`;
	}

	public constructor(theme: XMBTheme) {
		this.theme = theme;
	}

	public draw(): void {
		this.drawBox();
		this.drawText();
	}

	public drawBox(): void {
		if (this.theme.clock.backgroundColor) fill(this.theme.clock.backgroundColor);
		else noFill();

		stroke(this.theme.clock.stroke.color);
		strokeWeight(this.theme.clock.stroke.weight);

		this.x = width - this.theme.clock.rect.width + this.theme.clock.stroke.weight + 1;
		this.y = height * this.theme.clock.rect.y;

		rect(this.x, this.y, this.theme.clock.rect.width, this.theme.clock.rect.height);
	}

	public drawText(): void {
		const string = RenderXMBClock.timeString();

		noStroke();
		fill(this.theme.clock.stroke.color);
		textAlign(RIGHT, CENTER);
		textSize(this.theme.clock.text.fontSize);
		text(string, width - this.theme.clock.text.xOffset, this.y + this.theme.clock.rect.height / 2);
	}
}

class RenderXMB {
	public readonly clock: RenderXMBClock;
	public readonly theme: XMBTheme;
	public readonly sound?: Playable;
	public readonly root: RenderXMBCategory[];
	public selected: number = 0;
	public camera: number = 0;
	public targetCamera: number = 0;

	public constructor(theme: XMBTheme, root: XMBRoot, sound?: Playable) {
		this.clock = new RenderXMBClock(theme);
		this.theme = theme;
		this.sound = sound;
		this.root = root.children.map(child => new RenderXMBCategory(theme, child));
	}

	public playSound(): void {
		if (this.sound == null) return;
		this.sound.play();
	}

	public updateCamera(): void {
		this.camera += (this.targetCamera - this.camera) * this.theme.easing;
	}

	public updateTargetCamera(): void {
		this.targetCamera = this.selected * 200 - 100;
	}

	public draw(): void {
		background(this.theme.backgroundColor);

		textAlign(LEFT, CENTER);
		noStroke();

		this.updateCamera();
		
		const xStart = width * this.theme.origin.x;
		const yStart = width * this.theme.origin.y;

		this.root.forEach((category, i) => {
			const x = xStart + i * this.theme.menu.root.xOffsetBetweenCategories;
			category.draw(x, yStart, this.camera, i === this.selected);
		});

		this.clock.draw();
	}

	public nextCategory(): void {
		if (this.selected >= this.root.length - 1) return;
		this.selected++;
		this.targetCamera += this.theme.menu.root.xOffsetBetweenCategories;
		this.updateTargetCamera();
		this.playSound();
	}

	public previousCategory(): void {
		if (this.selected <= 0) return;
		this.selected--;
		this.targetCamera -= this.theme.menu.root.xOffsetBetweenCategories;
		this.updateTargetCamera();
		this.playSound();
	}

	public nextOption(): void {
		const currentCategory = this.root[this.selected];
		if (currentCategory.selected < currentCategory.category.children.length - 1) {
			currentCategory.selected++;
			currentCategory.updateTargetPositions();
			this.playSound();
		}
	}

	public previousOption(): void {
		const currentCategory = this.root[this.selected];
		if (currentCategory.selected > 0) {
			currentCategory.selected--;
			currentCategory.updateTargetPositions();
			this.playSound();
		}
	}

	public pressOption(): void {
		const currentCategory = this.root[this.selected];
		currentCategory.category.children[currentCategory.selected].onPress();
		this.playSound();
	}

	public options(): void	{
		// Currently no logic
		
		this.playSound();
	}
}
