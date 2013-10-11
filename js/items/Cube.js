
Cube = Thing.clone().newSlots({
	protoType: "Square"
}).setSlots({
	init: function()
	{
		Thing.init.apply(this)
		this.setup()
	},
	
	setup: function()
	{		
		var geometry = new THREE.CubeGeometry(500, 500, 500, 1, 1);
		
		var material = new THREE.MeshLambertMaterial( 
			{
				color: new THREE.Color().setRGB(0,0,0), 
				wireframe: false, 
				wireframeLinewidth: 1,
				opacity: 1,
				transparent: true
			} );

	    this._object = new THREE.Mesh(geometry, material);
	},

/*
	update: function() 
	{	
		Thing.update.apply(this)		
	}
	*/
})

