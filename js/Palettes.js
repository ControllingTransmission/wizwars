
Palette = Proto.clone().newSlots({
	protoType: "Palette",
	colors: []
}).setSlots({
	background: function()
	{
		return new THREE.Color(this.colors()[0])
	},

	foreground: function()
	{
		return new THREE.Color(this.colors()[1])
	},
	
	foreground2: function()
	{
		return new THREE.Color(this.colors()[2])
	},
	
	highlight: function()
	{
		return new THREE.Color(this.colors()[3])
	},	
})

Palettes = Proto.clone().newSlots({
	protoType: "Palettes",
	palettes: [],
	index: 0
}).setSlots({
	addPaletteWithColors: function(c)
	{
		this.addPalette(Palette.clone().setColors(c))
		return this
	},
	
	addPalette: function(p)
	{
		this.palettes().push(p)
		return this
	},
	
	next: function()
	{
		this.setIndex((this.index() + 1) % this.palettes().length)
		return this
	},
	
	current: function()
	{
		return this.palettes()[this.index()]
	}
})

// back, fore, fore2, high
Palettes.addPaletteWithColors(["#ff5500", "#ffffff", "#222222", "#000000"])
Palettes.addPaletteWithColors(["red", "black", "#222222", "#000000"])
Palettes.addPaletteWithColors(["#0055ff", "#ffffff", "#222222", "#000000"])
Palettes.addPaletteWithColors(["#0000ff", "#ffffff", "#222222", "#000000"])
//Palettes.addPaletteWithColors(["#555555", "#000000", "#222222", "#000000"])
/*
Palettes.addPaletteWithColors(["#f19aaf", "#000000", "#000000", "#000000"])
Palettes.addPaletteWithColors(["#fbf7a6", "#000000", "#000000", "#000000"])
Palettes.addPaletteWithColors(["#b3b0fa", "#000000", "#000000", "#000000"])
*/
//Palettes.addPaletteWithColors(["#0c9ae2", "#010b10", "gray", "#f3c932"])
//Palettes.addPaletteWithColors(["#000000", "#ef0c59", "gray", "#5df856"])
