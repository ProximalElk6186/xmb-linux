const placeholders = {
	image(): XMBIcon {
		const icon = createGraphics(80, 80);
		icon.background(0);
		icon.fill(random(255), random(255), random(255));
		icon.ellipse(icon.width / 2, icon.height / 2, 60, 60);
		
		return icon;
	},

	string(): string {
		const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
		let res = '';

		for (let i = 0; i < 5; i++)
			res += chars.charAt(floor(random(chars.length)));

		return res;
	},

	xmbAction(): XMBAction {
		const title = placeholders.string();
		const onPress = () => alert(title);

		return new XMBAction({
			title,
			icon: placeholders.image(),
			description: title,
			onPress
		});
	},

	xmbCategory(): XMBCategory {
		const title = placeholders.string();
		
		const category = new XMBCategory({
			title,
			icon: placeholders.image()
		});

		for (let i = 0; i < 20; i++)
			category.add(placeholders.xmbAction());

		return category;
	},

	xmb(): XMBRoot {
		const xmb = new XMBRoot();

		for (let i = 0; i < 10; i++)
			xmb.add(placeholders.xmbCategory());

		return xmb;
	}
}