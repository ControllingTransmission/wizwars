Math.randomInt = function(min, max)
{
	return Math.floor((Math.random()*(max - min))+1) +  min;
}

Visual = Proto.clone().newSlots({
	protoType: "Visual",
	layers: null,
	renderer: null,
	camera: null,
	scene: null,
	light: null,
	downKeys: {},
	selectedLayer: null
}).setSlots({
	go: function()
	{
		this.setup()
		this.run()
		return this
	},
	
	removeGroup: function(aGroup)
	{
		for (var k in this.layers())
		{
			if(this.layers()[k] == aGroup)
			{
				this.toggleLayer(k, aGroup)
			}
		}
	},
	
	toggleLayer: function(name, aGroup)
	{
		if (aGroup)
		{
			var layer = this.layers()[name]
			if (layer)
			{
				layer.close()
				delete this.layers()[name]
				this.setSelectedLayer(null)
				if (layer.resets())
				{
					this.turnOnGroup(name, aGroup)
				}
			}
			else
			{
				this.turnOnGroup(name, aGroup)
			}
		}
		
		return this
	},
	
	turnOnGroup: function(name, aGroup)
	{
		var g = aGroup.clone().open()
		g.setOwner(this)
		this.layers()[name] = g
		this.setSelectedLayer(g)		
	},
	
	run: function()
	{
		this.setLayers({})
		
		//this.addLayer(BackgroundGroup.clone())
		//this.addLayer(SquaresGroup.clone().open())
		
		this.animate()	
		// document.body.style.backgroundColor = "red"
	},

	setup: function()
	{
		this.setScene(new THREE.Scene())
		this.setupRenderer()
		//this.setupPerspectiveCamera()
		//this.setup2DCamera()
		this.setupOrthoCamera()
		this.setupLight()
		this.setupEvents()
	},
	
	setupRenderer: function()
	{
		var container = document.createElement('div');
		document.body.appendChild(container);
		this.setRenderer(new THREE.WebGLRenderer({ antialias: true }))
		this.renderer().setSize(window.innerWidth, window.innerHeight);
		container.appendChild(this.renderer().domElement);
	},

	setupOrthoCamera2: function()
	{
		var width = 8000
		var height = 8000
		var near = -2000
		var far = 2000
		this.setCamera(new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, near, far ))		
		this.camera().position.x = 0;
		this.camera().position.y = 0;
		this.camera().position.z = 800;
		this.camera().lookAt(new THREE.Vector3(0, 0, 0));	
	},
	
	setupOrthoCamera: function()
	{
		var width = .5
		var height = .5
		var near = -2000
		var far = 2000
		//this.setCamera(new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, near, far ))		
		this.setCamera(new THREE.OrthographicCamera(-width, width, height, -height, near, far ))		
		this.camera().position.x = 0;
		this.camera().position.y = 0;
		this.camera().position.z = 1;
		this.camera().lookAt(new THREE.Vector3(0, 0, 0));		
	},
	
	setup2DCamera: function()
	{
		var width = 1
		var height = 1
		var near = -1
		var far = 1
		this.setCamera(new THREE.OrthographicCamera(-width, width, height, -height, near, far ))		
		this.camera().position.x = 0;
		this.camera().position.y = 0;
		this.camera().position.z = 800;
		this.camera().lookAt(new THREE.Vector3(0, 0, 0));		
	},
		
	setupPerspectiveCamera: function()
	{		
		this.setCamera(new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 8000))
		this.camera().position.x = 0;
		this.camera().position.y = 0;
		this.camera().position.z = 1000;
		this.camera().lookAt(new THREE.Vector3(0, 0, 0));		
	},
	
	setupEvents: function()
	{	
		var self = this
		window.addEventListener('resize', function () { self.onWindowResize() }, false);
		$(document).bind('keydown', function(e) { self.keydown(e) })		
		$(document).bind('keyup', function(e) { self.keyup(e) })
	},
	
	setupLight: function()
	{	
		this.setLight(new THREE.DirectionalLight(0xffffff))
		this.light().position.set(0, 50, 50);
		this.light().target.position.set(0, 0, 0);
		this.scene().add(this.light())
	},

	animate: function() 
	{
		this.update()
		var self = this
		requestAnimationFrame(function () { self.animate() });
		
		TWEEN.update();

		this.render();
	},
	
	update: function()
	{
		for (var k in this.layers())
		{
			var layer = this.layers()[k]
			layer.update()
		}

		
		var bins = Spectrum.timeStep()
		if (Spectrum.reducedBins())
		{
			//console.log("rbins: " + JSON.stringify(Spectrum.reducedBins()))
		}
		/*
		for ( var i = 0; i < scene.children.length; i ++) 
		{
			var object = scene.children[i];
			var x = object.position.x 
			var y = object.position.y

			if (bins)
			{
				var b = Math.floor((r+400)/10)
				
				if (b < bins.length)
				{
					var vs = bins[b]/100
					var s = vs*vs*vs*vs*vs
					object.scale.x = s*.5
					object.scale.y = s*.5
				}
			}
		}
		*/		
	},
	
	render: function()
	{
		this.renderer().render(this.scene(), this.camera());
	},

	onWindowResize: function() 
	{
		this.camera().aspect = window.innerWidth / window.innerHeight;
		this.camera().updateProjectionMatrix();
		this.renderer().setSize(window.innerWidth, window.innerHeight);
	},
	
	// -------------------------------
	
	keyForKeyCode: function(code)
	{
		var codeToKey = { 
			219: "[", 
			221: "]", 
			188: ",", 
			190: ".",
			189: "-",
			186: ";",
			222: "'"
		}
		var k = codeToKey[code]
		
		if (k == null)
	    {
			k = String.fromCharCode(code);
		}
		
		return k
	},
	
	selectLayerWithEvent: function(e)
	{
	    var k = this.keyForKeyCode(e.keyCode);
		e.key = k

		var g = Groups.groupWithKey(k)
		console.log("group with key " + k + " = " + g)
		if (g)
		{
			this.toggleLayer(k, g)
			return true
		}
		
		return false
	},
	
	keydown: function(e)
	{
		console.log("e.keyCode " + e.keyCode)
		var k = this.keyForKeyCode(e.keyCode)
		
		
		if (k == "M") 
		{
			Palettes.next()
			var c = Palettes.current().background()
			this.setBackgroundColor(c.r, c.g, c.b)
			return 
		}
		
		Keyboard.shiftKey = e.shiftKey
		//console.log("Keyboard.shiftKey " + Keyboard.shiftKey)
		// track down key to avoid key repeats
		if (this.downKeys()[e.keyCode]) 
		{
			return;
		}
		
		this.downKeys()[e.keyCode] = true
		
		// choose a layer with number keys, send all other keys to selected layer
		if(this.selectLayerWithEvent(e) == false)
		{
			var layer = this.selectedLayer()
			//console.log("sending to layer " + layer)
			if (layer && layer.keydown)
			{
				layer.keydown(e)
			}
		}		
	},
	
	keyup: function(e)
	{
		this.downKeys()[e.keyCode] = false 
		
		var layer = this.selectedLayer()
		
		if(layer && layer.keyup)
		{
			layer.keyup(e)			
		}
	},
	
	setBackgroundColor: function(r, g, b)
	{
		var s = "rgb(" + Math.floor(r*255) + ", " + Math.floor(g*255) + ", " + Math.floor(b*255) + ")"
		//console.log(this.protoType() + " set " + s)
		document.body.style.backgroundColor = s
		return this
	}
})

Keyboard = {}

/*
Keyboard.shiftKey = e.shiftKey
Keyboard.altKey   = e.altKey
Keyboard.ctrlKey  = e.ctrlKey
var retChar = 13
var escChar = 27
var sqChar = 192

var char = String.fromCharCode(e.keyCode).toLowerCase()
var space = 32

if (e.keyCode == 32)
{
}
*/

