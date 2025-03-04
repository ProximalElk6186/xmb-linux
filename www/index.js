"use strict";
var ui;
function fetchTheme() {
    var request = new XMLHttpRequest();
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
    createCanvas(windowWidth - 10, windowHeight - 10);
    textFont(loadFont('/assets/xmb.ttf'));
    ui = new RenderXMB(fetchTheme(), placeholders.xmb());
}
function windowResized() {
    resizeCanvas(windowWidth - 10, windowHeight - 10);
}
function draw() {
    ui.draw();
}
function keyPressed() {
    if (keyCode == LEFT_ARROW)
        ui.previousCategory();
    else if (keyCode == RIGHT_ARROW)
        ui.nextCategory();
    else if (keyCode == UP_ARROW)
        ui.previousOption();
    else if (keyCode == DOWN_ARROW)
        ui.nextOption();
    else if (keyCode == RETURN)
        ui.pressOption();
    else if (keyCode == KEY_1)
        ui.options();
}
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var XMBItem = (function () {
    function XMBItem() {
        this._y = 0;
        this._targetY = 0;
    }
    return XMBItem;
}());
var XMBAction = (function (_super) {
    __extends(XMBAction, _super);
    function XMBAction(args) {
        var _a, _b;
        var _this = _super.call(this) || this;
        _this.title = args.title;
        _this.icon = args.icon;
        _this.description = (_a = args.description) !== null && _a !== void 0 ? _a : '';
        _this.onPress = (_b = args.onPress) !== null && _b !== void 0 ? _b : (function () { return null; });
        return _this;
    }
    return XMBAction;
}(XMBItem));
var XMBMenu = (function (_super) {
    __extends(XMBMenu, _super);
    function XMBMenu(args) {
        var _a;
        var _this = _super.call(this) || this;
        _this.children = [];
        _this.title = args.title;
        _this.description = (_a = args.description) !== null && _a !== void 0 ? _a : '';
        _this.icon = args.icon;
        return _this;
    }
    XMBMenu.prototype.add = function (child) {
        this.children.push(child);
        return this;
    };
    XMBMenu.prototype.onPress = function () { };
    return XMBMenu;
}(XMBItem));
var XMBCategory = (function (_super) {
    __extends(XMBCategory, _super);
    function XMBCategory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XMBCategory;
}(XMBMenu));
var XMBRoot = (function () {
    function XMBRoot() {
        this.children = [];
    }
    XMBRoot.prototype.add = function (child) {
        this.children.push(child);
        return this;
    };
    return XMBRoot;
}());
var placeholders = {
    image: function () {
        var icon = createGraphics(80, 80);
        icon.background(0);
        icon.fill(random(255), random(255), random(255));
        icon.ellipse(icon.width / 2, icon.height / 2, 60, 60);
        return icon;
    },
    string: function () {
        var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var res = '';
        for (var i = 0; i < 5; i++)
            res += chars.charAt(floor(random(chars.length)));
        return res;
    },
    xmbAction: function () {
        var title = placeholders.string();
        var onPress = function () { return alert(title); };
        return new XMBAction({
            title: title,
            icon: placeholders.image(),
            description: title,
            onPress: onPress
        });
    },
    xmbCategory: function () {
        var title = placeholders.string();
        var category = new XMBCategory({
            title: title,
            icon: placeholders.image()
        });
        for (var i = 0; i < 20; i++)
            category.add(placeholders.xmbAction());
        return category;
    },
    xmb: function () {
        var xmb = new XMBRoot();
        for (var i = 0; i < 10; i++)
            xmb.add(placeholders.xmbCategory());
        return xmb;
    }
};
var RenderXMBCategory = (function () {
    function RenderXMBCategory(theme, category) {
        this.selected = 0;
        this.height = 0;
        this.theme = theme;
        this.category = category;
        this.updateTargetPositions();
    }
    RenderXMBCategory.prototype.draw = function (x, y, cameraOffset, isSelected) {
        this.height = this.drawIcon(x, y, cameraOffset, isSelected) + this.drawName(x, y, cameraOffset, isSelected);
        if (isSelected)
            this.drawChildren(x, y, cameraOffset);
    };
    RenderXMBCategory.prototype.drawIcon = function (x, y, cameraOffset, isSelected) {
        var iconSize = isSelected ? this.theme.menu.root.selectedIconSize : this.theme.menu.root.unselectedIconSize;
        imageMode(CENTER);
        image(this.category.icon, x - cameraOffset, y, iconSize, iconSize);
        return iconSize;
    };
    RenderXMBCategory.prototype.drawName = function (x, y, cameraOffset, isSelected) {
        if (!isSelected)
            return 0;
        fill(this.theme.defaultFontColor);
        textSize(this.theme.menu.root.selectedFontSize);
        var textX = x - this.category.icon.width / 2 - cameraOffset + 1;
        var textY = y + this.category.icon.height / 2 + 30;
        text(this.category.title, textX, textY);
        return this.theme.menu.root.unselectedIconSize / 2 + 30 + this.theme.menu.root.selectedFontSize;
    };
    RenderXMBCategory.prototype.drawChildren = function (x, y, cameraOffset) {
        var _this = this;
        this.category.children.forEach(function (child, i) {
            child._y += (child._targetY - child._y) * _this.theme.easing;
            _this.drawChild(x, y, cameraOffset, child, i);
        });
    };
    RenderXMBCategory.prototype.drawChild = function (x, y, cameraOffset, child, index) {
        var isSelected = index === this.selected;
        var iconSize = isSelected ? this.theme.menu.items.selectedIconSize : this.theme.menu.items.unselectedIconSize;
        var yOffset = this.height / 2;
        var imageX = x - cameraOffset;
        var imageY = y + 40 + yOffset + child._y;
        image(child.icon, imageX, imageY, iconSize, iconSize);
        fill(isSelected ? this.theme.selectedFontColor : this.theme.defaultFontColor);
        textSize(this.theme.defaultFontSize);
        var textX = x - cameraOffset + iconSize / 2 + 10;
        var textY = y + 40 + yOffset + child._y;
        if (this.theme.menu.items.drawLabelsForUnselected || isSelected)
            text(child.title, textX, textY);
        if (!isSelected)
            return;
        var description = child.description;
        if (description.length == 0)
            return;
        var descY = textY + this.theme.defaultFontSize + 2;
        fill(this.theme.menu.items.description.color);
        textSize(this.theme.menu.items.description.fontSize);
        text(description, textX, descY);
    };
    RenderXMBCategory.prototype.updateTargetPositions = function () {
        var _this = this;
        this.category.children.forEach(function (child, i) {
            child._targetY = i < _this.selected ? (i - _this.selected) * 40 - _this.height :
                i === _this.selected ? 0 :
                    (i - _this.selected) * 40;
        });
    };
    return RenderXMBCategory;
}());
var RenderXMBClock = (function () {
    function RenderXMBClock(theme) {
        this.x = 0;
        this.y = 0;
        this.theme = theme;
    }
    RenderXMBClock.padStart = function (string, targetLength, padString) {
        string = String(string);
        if (string.length >= targetLength)
            return string;
        var paddingLength = targetLength - string.length;
        var repeatedPadString = '';
        while (repeatedPadString.length < paddingLength)
            repeatedPadString += padString;
        repeatedPadString = repeatedPadString.slice(0, paddingLength);
        return repeatedPadString + string;
    };
    RenderXMBClock.timeString = function () {
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var hours = date.getHours();
        var minutes = RenderXMBClock.padStart(date.getMinutes().toString(), 2, '0');
        var amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return "".concat(day, "/").concat(month, " ").concat(hours, ":").concat(minutes, " ").concat(amPm);
    };
    RenderXMBClock.prototype.draw = function () {
        this.drawBox();
        this.drawText();
    };
    RenderXMBClock.prototype.drawBox = function () {
        if (this.theme.clock.backgroundColor)
            fill(this.theme.clock.backgroundColor);
        else
            noFill();
        stroke(this.theme.clock.stroke.color);
        strokeWeight(this.theme.clock.stroke.weight);
        this.x = width - this.theme.clock.rect.width + this.theme.clock.stroke.weight + 1;
        this.y = height * this.theme.clock.rect.y;
        rect(this.x, this.y, this.theme.clock.rect.width, this.theme.clock.rect.height);
    };
    RenderXMBClock.prototype.drawText = function () {
        var string = RenderXMBClock.timeString();
        noStroke();
        fill(this.theme.clock.stroke.color);
        textAlign(RIGHT, CENTER);
        textSize(this.theme.clock.text.fontSize);
        text(string, width - this.theme.clock.text.xOffset, this.y + this.theme.clock.rect.height / 2);
    };
    return RenderXMBClock;
}());
var RenderXMB = (function () {
    function RenderXMB(theme, root, sound) {
        this.selected = 0;
        this.camera = 0;
        this.targetCamera = 0;
        this.clock = new RenderXMBClock(theme);
        this.theme = theme;
        this.sound = sound;
        this.root = root.children.map(function (child) { return new RenderXMBCategory(theme, child); });
    }
    RenderXMB.prototype.playSound = function () {
        if (this.sound == null)
            return;
        this.sound.play();
    };
    RenderXMB.prototype.updateCamera = function () {
        this.camera += (this.targetCamera - this.camera) * this.theme.easing;
    };
    RenderXMB.prototype.updateTargetCamera = function () {
        this.targetCamera = this.selected * 200 - 100;
    };
    RenderXMB.prototype.draw = function () {
        var _this = this;
        background(this.theme.backgroundColor);
        textAlign(LEFT, CENTER);
        noStroke();
        this.updateCamera();
        var xStart = width * this.theme.origin.x;
        var yStart = width * this.theme.origin.y;
        this.root.forEach(function (category, i) {
            var x = xStart + i * _this.theme.menu.root.xOffsetBetweenCategories;
            category.draw(x, yStart, _this.camera, i === _this.selected);
        });
        this.clock.draw();
    };
    RenderXMB.prototype.nextCategory = function () {
        if (this.selected >= this.root.length - 1)
            return;
        this.selected++;
        this.targetCamera += this.theme.menu.root.xOffsetBetweenCategories;
        this.updateTargetCamera();
        this.playSound();
    };
    RenderXMB.prototype.previousCategory = function () {
        if (this.selected <= 0)
            return;
        this.selected--;
        this.targetCamera -= this.theme.menu.root.xOffsetBetweenCategories;
        this.updateTargetCamera();
        this.playSound();
    };
    RenderXMB.prototype.nextOption = function () {
        var currentCategory = this.root[this.selected];
        if (currentCategory.selected < currentCategory.category.children.length - 1) {
            currentCategory.selected++;
            currentCategory.updateTargetPositions();
            this.playSound();
        }
    };
    RenderXMB.prototype.previousOption = function () {
        var currentCategory = this.root[this.selected];
        if (currentCategory.selected > 0) {
            currentCategory.selected--;
            currentCategory.updateTargetPositions();
            this.playSound();
        }
    };
    RenderXMB.prototype.pressOption = function () {
        var currentCategory = this.root[this.selected];
        currentCategory.category.children[currentCategory.selected].onPress();
        this.playSound();
    };
    RenderXMB.prototype.options = function () {
        this.playSound();
    };
    return RenderXMB;
}());
//# sourceMappingURL=index.js.map