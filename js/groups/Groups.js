
Groups = Proto.clone().newSlots({
	protoType: "Groups",
	groups: [],
}).setSlots({
	
	add: function(g)
	{
		this.groups().push(g)
	},
	
	groupWithKey: function(k)
	{
		for (var i = 0; i < this.groups().length; i ++)
		{
			var g = this.groups()[i]
			if (g.key() == k)
			{
				return g
			}
		}
		return null
	}
})


// -----------------------------------------------------


// -----------------------------------------------------


// -----------------------------------------------------


SpectrumGroup = Group.clone().newSlots({
	protoType: "SpectrumGroup",
	items: null,
	max: 5,
	orientation: "x",
	key: "1",
}).setSlots({
	init: function()
	{
		Group.init.apply(this)
		this.addSquares()
		//this.setTtl(60)
	},
	
	moverProto: function()
	{
		return AudioDXMover
	},
	
	addSquares: function()
	{
		var max = Spectrum._reducedBinCount
		
		for (var x = 0; x < max; x ++)
		{
			var s = Square.clone()
			s._object.scale.x = .03
			s._object.scale.y = 1
			s._object.position.x = -.5 + x*1/(max-1)
			s._object.position.y = 0
			s._object.position.z = 1
			s.setGroupX(x).setGroupY(0)
			s.setMover("D", this.moverProto().clone())
			s.setColor(Palettes.current().foreground2())
			this.addItem(s)
		}
	},
	
})

Groups.add(SpectrumGroup)

// -----------------------------------------------------

/*
SpectrumGroup2 = SpectrumGroup.clone().newSlots({
	protoType: "SpectrumGroup2",
	key: "5"
}).setSlots({
	moverProto: function()
	{
		return AudioMiddleMover
	},	
})

Groups.add(SpectrumGroup2)
*/

// ------------------------------------------------------

MiddleGroup = Group.clone().newSlots({
	protoType: "MiddleGroup",
	items: null,
	max: 50,
	key: "2",
}).setSlots({
	init: function()
	{
		Group.init.apply(this)
		this._leftItems = this.addSquaresAtX(-.5)
		this._rightItems = this.addSquaresAtX(.5)
	},
	
	max: function()
	{
		return Spectrum._reducedBinCount/8
	},
	
	addSquaresAtX: function(xpos)
	{
		var max = this.max()
		var newItems = []
		
		for (var x = 0; x < max; x ++)
		{
			var s = Square.clone()
			s._object.scale.x = .1
			s._object.scale.y = .1
			s._object.position.x = xpos
			s._object.position.y = 0 
			s._object.position.z = 1
			s.setGroupX(x).setGroupY(0)
			s.setColor(new THREE.Color().setRGB(0,0,0))
			//s.setOpacity(.2)
			this.addItem(s)
			newItems.push(s)
		}
		return newItems
	},
	
	update: function()
	{
		this.updateSide(this._leftItems)
		this.updateSide(this._rightItems)
	},
	
	updateSide: function(sideItems)
	{
		var max = this.max()
		
		var rbins = Spectrum.reducedBins()
		var dbins = Spectrum.diffBins()
			
		for (var x = 0; x < sideItems.length; x ++)
		{
			var s = sideItems[x]
			var r = Math.random() 
			
			//if (r < .3)
			{
				s.object().scale.x = .001 + rbins[rbins.length/2-x]*.8 //Math.random()
				s.object().scale.y = .001 + .5*(10/(10+x))
			}
		
		}
	}
})

Groups.add(MiddleGroup)

// ------------------------------------------------------

StaticGroup = Group.clone().newSlots({
	protoType: "StaticGroup",
	items: null,
	max: 50,
	key: "3",
}).setSlots({
	init: function()
	{
		Group.init.apply(this)
		this.addSquaresAtY(.5)
		this.addSquaresAtY(-.5)
	},
	
	max: function()
	{
		return Spectrum._reducedBinCount/8
	},
	
	addSquaresAtY: function(ypos)
	{
		var max = this.max()
		
		for (var x = 0; x < max; x ++)
		{
			var s = Square.clone()
			s._object.scale.x = 1/(max-1)
			s._object.scale.y = .1
			s._object.position.x = -.5 + x*1/(max-1)
			s._object.position.y = ypos 
			s._object.position.z = 1
			s.setGroupX(x).setGroupY(0)
			//s.setMover("D", StaticMover.clone())
			s.setColor(new THREE.Color().setRGB(0,0,0))
			this.addItem(s)
		}
	},
	
	update: function()
	{
		var max = this.max()
		
		for (var x = 0; x < this.items().length; x ++)
		{
			var s = this.items()[x]
			var r = Math.random() 
			if (r < .3)
			{
				s.setOpacity(1)
			}
			else if (r < .6)
			{
				s.setOpacity(.5)
			}
			else
			{
				s.setOpacity(0)
			}			
		}
	}
	
})

Groups.add(StaticGroup)

// -----------------------------------------------------


ImageFlashGroup = Group.clone().newSlots({
	protoType: "ImageFlashGroup",
	imageSet: "set1",
	imageCount: 6,
	imageNames: [],
	key: "Q",
	showAge: 0,
	hideAge: 0,
	isHidden: true,
	ttl: 120
}).setSlots({
	init: function()
	{
		Group.init.apply(this)
	},

	unhide: function()
	{
		this.element().style.display = "inline"	
		this._showAge = 0	
		this._isHidden = false
	},
	
	hide: function()
	{
		this.element().style.display = "none"	
		this._hideAge = 0
		this._isHidden = true
	},
	
	element: function()
	{
		return document.getElementById("foregroundImage");
	},
	
	showNextImage: function()
	{
		this.unhide()
		//var n = Math.floor(this.t()/2) % this.imageCount()
		var n = Math.floor(Math.random()*100) % this.imageCount()
		var name = "images/" + this.imageSet() + "/" + n + ".png"
		this.element().src = name	
	},
	
	update: function()
	{
		this.showNextImage()
		
		if (Math.random() > .5)
		{
			this.hide()
		}
		else
		{
			this.unhide()
		}
		Group.update.apply(this)
	},
	
	removeSelf: function()
	{
		Group.removeSelf.apply(this)
		this.hide()			
	}
})

Groups.add(ImageFlashGroup)

// ---------------------------------------------------
ImageFlashGroup2 = ImageFlashGroup.clone().newSlots({
	imageSet: "set2",
	key:"W",
	imageCount: 1,
	ttl: 60
})

Groups.add(ImageFlashGroup2)

// ---------------------------------------------------

ImageFlashGroup3 = ImageFlashGroup.clone().newSlots({
	imageSet: "set3",
	key:"E",
	imageCount: 1,
	ttl: 10
})

Groups.add(ImageFlashGroup3)

// --------------------------------------------------------

FlashBackgroundGroup = Group.clone().newSlots({
	protoType: "FlashBackgroundGroup",
	key: "8",
	colors: ["white", "red", "blue", "yellow"],
	ttl: -1
}).setSlots({
	init: function()
	{
		Group.init.apply(this)
	},
	
	update: function()
	{
		var colors = this.colors()
		var r = Math.floor(Math.random()*100) % colors.length
		var c = colors[r]
		
		if (this._originalColor	== null)
		{
			this._originalColor	= document.body.style.backgroundColor
		}

		document.body.style.backgroundColor = c
		
		Group.update.apply(this)
	},
	
	removeSelf: function()
	{
		Group.removeSelf.apply(this)
		document.body.style.backgroundColor = this._originalColor			
	},
	
	keyup: function()
	{
		this.removeSelf()
	}
})

Groups.add(FlashBackgroundGroup)

// ----------------------------

FlashBackgroundGroup2 = FlashBackgroundGroup.clone().newSlots({
	key: "9",
	colors: ["#444", "#333", "#222"],
})

Groups.add(FlashBackgroundGroup2)

// ----------------------------

FlashBackgroundGroup3 = FlashBackgroundGroup.clone().newSlots({
	key: "0",
	colors: ["#004", "#005", "#006"],
	//colors: ["#004", "#00a", "#002"],
})

Groups.add(FlashBackgroundGroup3)

// ----------------------------

FlashBackgroundGroup4 = FlashBackgroundGroup.clone().newSlots({
	key: "-",
	colors: ["#fff", "#f00", "#ff0"],
})

Groups.add(FlashBackgroundGroup4)


// ------------------------------


MiddleBarGroup = Group.clone().newSlots({
	protoType: "MiddleGroup",
	items: null,
	key: "5",
	xw: .0001,
	isClosing: false
}).setSlots({
	init: function()
	{
		Group.init.apply(this)
		this.addSquaresAtX(0)
	},
	
	max: function()
	{
		return 1
	},
	
	addSquaresAtX: function(xpos)
	{
		var max = this.max()
		var newItems = []
		
		for (var x = 0; x < max; x ++)
		{
			var s = Square.clone()
			s._object.scale.x = .4
			s._object.scale.y = 1
			s._object.position.x = xpos
			s._object.position.y = 0
			s._object.position.z = -1
			s.setGroupX(x).setGroupY(0)
			s.setColor(new THREE.Color().setRGB(0,0,0))
			//s.setOpacity(.2)
			this.addItem(s)
			newItems.push(s)
		}
		return newItems
	},
	
	update: function()
	{		
		var max = this.max()
		var rbins = Spectrum.reducedBins()
		//var dbins = Spectrum.diffBins()

		if (this._isClosing == false)
		{
			this._xw += (.4 - this._xw)*.05
		}
		else
		{
			this._xw += (.0001 - this._xw)*.05
			if (this._xw < .001)
			{
				//console.log("removing")
				this.removeSelf()
			}
		}
		
		for (var x = 0; x < this.items().length; x ++)
		{
			var s = this.items()[x]
			var r = Math.random() 

			//s.object().scale.x = .4 + Math.random()/100
			var v = this._xw - rbins[55]/10
			s.object().scale.x = v //Math.floor(v*64)/64
		}
		
	},
	
	/*
	keyup: function()
	{
		this._isClosing = true
	},
	*/
	
})

Groups.add(MiddleBarGroup)


// -----------------------------------------


// ------------------------------


HMiddleBarGroup = Group.clone().newSlots({
	protoType: "HMiddleBarGroup",
	items: null,
	key: "6",
	xw: .0001
}).setSlots({
	init: function()
	{
		Group.init.apply(this)
		this.addSquaresAtX(0)
	},
	
	max: function()
	{
		return 1
	},
	
	addSquaresAtX: function(xpos)
	{
		var max = this.max()
		var newItems = []
		
		for (var x = 0; x < max; x ++)
		{
			var s = Square.clone()
			s._object.scale.x = 1
			s._object.scale.y = .4
			s._object.position.x = xpos
			s._object.position.y = 0
			s._object.position.z = -1
			s.setGroupX(x).setGroupY(0)
			s.setColor(new THREE.Color().setRGB(0,0,0))
			//s.setOpacity(.2)
			this.addItem(s)
			newItems.push(s)
		}
		return newItems
	},
	
	update: function()
	{
		console.log("update")
		
		var max = this.max()
		var rbins = Spectrum.reducedBins()
		//var dbins = Spectrum.diffBins()

		this._xw += (.1 - this._xw)*.05
		for (var x = 0; x < this.items().length; x ++)
		{
			var s = this.items()[x]
			var r = Math.random() 

			//s.object().scale.x = .4 + Math.random()/100
			var v = this._xw - rbins[75]/10
			s.object().scale.y = v //Math.floor(v*64)/64

/*
			if (r < .3)
			{
				console.log("set color")
				s.setColor(new THREE.Color().setRGB(2,2,2))
			}
			else
			{
				s.setColor(new THREE.Color().setRGB(0,0,0))
			}
			*/
		}
		
	}
})

Groups.add(HMiddleBarGroup)