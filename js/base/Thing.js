

Thing = Proto.clone().newSlots({
	protoType: "Thing",
	open: false,
	object: null,
	groupPos: null,
	movers: null,
	t: 0,
	groupX: 0,
	groupY: 0,
	groupZ: 0,
	group: null
}).setSlots({
	init: function()
	{
		this._movers = {}
	},
	
	opacity: function()
	{
		return this.object().material.opacity
	},
	
	setOpacity: function(v)
	{
		var mat = this.object().material
		mat.opacity = v
		mat.needsUpdate = true
		return this
	},
	
	setGroupPosToCurrent: function()
	{
		this.setGroupPos(this.object().position.clone())
		return this
	},

	open: function()
	{
		Visual.scene().add(this._object)
		this._open = true
		return this
	},	
	
	close: function()
	{
		Visual.scene().remove(this._object)
		this._open = false
		return this
	},

	toggle: function()
	{
		if(this._open)
			this.close()
		else
			this.open()
		return this
	},
	
	setMover: function(name, m)
	{
		var oldMover = this.movers()[name]
		
		if (oldMover)
		{
			oldMover.prepareToStop()
			delete this.movers()[name]
		}
		else
		{
			this.movers()[name] = m
			m.setThing(this)
			m.prepareToStart()
		}
		
		return this
	},
	
	removeMover: function(aMover)
	{
		for (var name in this.movers())
		{
			var m = this.movers()[name]
			if (m == aMover)
			{
				m.prepareToStop()
				delete this.movers()[name]
			}
		}
		
		return this
	},
	
	prepareToStop: function()
	{
		
	},
	
	update: function(dt) 
	{			
		//this.movers().forEach(function (k, mover) { mover.update(dt) })
		for (var k in this.movers())
		{
			var mover = this._movers[k]
			mover.update(dt)
		}
		
		this._t ++
	},
	
	setColor: function (c)
	{
		var mat = this.object().material
		mat.color = c
		mat.needsUpdate = true
		return this
	},
	
	toggleWireframe: function()
	{
		var mat = this.object().material
		mat.wireframe = !mat.wireframe
		mat.needsUpdate = true
		return this
	},
	
	increaseAlpha: function()
	{
		var mat = this.object().material
		mat.opacity = 1
		mat.needsUpdate = true
	},
	
	decreaseAlpha: function()
	{
		var mat = this.object().material
		mat.opacity = .25
		mat.needsUpdate = true
	},	
})

