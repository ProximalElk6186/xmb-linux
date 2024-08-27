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
	icon: XMBIcon
}

abstract class XMBItem {
	public _y: number = 0;
	public _targetY: number = 0;

	public abstract get title(): string;
	public abstract get icon(): XMBIcon;
	public abstract onPress(): void;
}

class XMBAction extends XMBItem {
	private readonly _title: string;
	private readonly _icon: XMBIcon;
	private readonly _onPress: XMBOnPressCallback;

	public readonly description: string;

	public constructor(args: XMBActionConstructorArgs) {
		super();

		this._title = args.title;
		this._icon = args.icon;
		this.description = args.description ?? '';
		this._onPress = args.onPress ?? (() => null); 
	}

	public get title(): string {
		return this._title;
	}

	public get icon(): XMBIcon {
		return this._icon;
	}

	public onPress(): void {
		this._onPress();
	}
}

class XMBMenu extends XMBItem {
	private readonly _title: string;
	private readonly _icon: XMBIcon;
	
	public readonly children: XMBItem[] = [];

	public constructor(args: XMBMenuConstructorArgs) {
		super();
		this._title = args.title;
		this._icon = args.icon;
	}

	public add(child: XMBItem): XMBMenu {
		this.children.push(child);		
		return this;
	}

	public get title(): string {
		return this._title;
	}

	public get icon(): XMBIcon {
		return this._icon;
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
