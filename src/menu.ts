type XMBIcon = p5.Graphics | p5.Image;
type XMBOnPressCallback = () => void;

type XMBActionConstructorArgs = {
	title: string,
	icon: XMBIcon,
	description?: string,
	onPress?: XMBOnPressCallback
}

type XMBMenuConstructorArgs = {
	title: string,
	icon: XMBIcon,
	description?: string
}

abstract class XMBItem {
	public _y: number = 0;
	public _targetY: number = 0;

	public abstract get title(): string;
	public abstract get description(): string;
	public abstract get icon(): XMBIcon;
	public abstract onPress(): void;
}

class XMBAction extends XMBItem {
	public readonly title: string;
	public readonly icon: XMBIcon;
	public readonly onPress: XMBOnPressCallback;

	public readonly description: string;

	public constructor(args: XMBActionConstructorArgs) {
		super();

		this.title = args.title;
		this.icon = args.icon;
		this.description = args.description ?? '';
		this.onPress = args.onPress ?? (() => null); 
	}
}

class XMBMenu extends XMBItem {
	public readonly title: string;
	public readonly description: string;
	public readonly icon: XMBIcon;
	
	public readonly children: XMBItem[] = [];

	public constructor(args: XMBMenuConstructorArgs) {
		super();
		this.title = args.title;
		this.description = args.description ?? '';
		this.icon = args.icon;
	}

	public add(child: XMBItem): XMBMenu {
		this.children.push(child);		
		return this;
	}

	public onPress(): void {}
}

class XMBCategory extends XMBMenu {}

class XMBRoot {
	public readonly children: XMBCategory[] = [];
	
	public add(child: XMBCategory): XMBRoot {
		this.children.push(child);		
		return this;
	}
}
