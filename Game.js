// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     || 
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

Game = {
	Running : false,
	Settings :
	{
		FPS : 60,
		TargetCanvasID : null
	},
	
	Setup : function(TargetCanvasID)
	{
		Graphics.SetupCanvas(TargetCanvasID);
		EventDelegate.Initialize(TargetCanvasID);
		return this;
	},
	
	Start : function(TargetCanvasID)
	{
		// If debugging is turned off, just get rid of console.log completely
		if (!DEBUG)
			console.log = function(){ /* This function does nothing */ };
			
		if (typeof TargetCanvasID == 'undefined' || TargetCanvasID == null)
			if (typeof this.Settings.TargetCanvasID == 'undefined' || this.Settings.TargetCanvasID == null)
				return null;
			else
				TargetCanvasID = this.Settings.TargetCanvasID;
		else
			this.Settings.TargetCanvasID = TargetCanvasID;
		
		
		console.log("Starting engine.");
		
		// Call the setup method to get everything in place
		this.Setup(TargetCanvasID);
		
		// Start the game loop
		this.Running = true;
		this.Update( 0 );
		return this;
	},
	
	Stop : function()
	{
		this.Running = false;
		return this;
	},
	World : 
	{
		SceneGraph : [],
		ClassIndex :
		{
			GENERIC : []
		},
		Position :
		{
			// X and Y world positions determine the world's position relative to the canvas
			// in turn, elements in SceneGraph will be affected
			x : 0,
			y : 0
		},
		RegisterClass : function(Obj)
		{
			if (typeof this.ClassIndex[Obj.Class] == 'undefined' || this.ClassIndex[Obj.Class] == null)
				this.ClassIndex[Obj.Class] = [];
				
			this.ClassIndex[Obj.Class].push( Obj );
		},
		Add : function()
		{
			if (arguments.length == 0)
				return this;
			for (var obj in arguments)
			{
				// Registers an object for events and then pushes it onto the scene graph
				EventDelegate.RegisterObject( arguments[obj] );
				this.RegisterClass( arguments[obj] );
				this.SceneGraph.push( arguments[obj] );
				this.SceneGraph.sort(this.ZCompare);
			}
			return this;
		},
		ZCompare : function(a, b)
		{
			if (a.Position.z > b.Position.z)
				return -1;
			else if (a.Position.z < b.Position.z)
				return 1;
			return 0;
		}
	},
	Input : 
	{
	
	},
	Update : function(lastTime)
	{
		
		// Get the time this frame starts at
		// subtract the last frame's start time
		var newTime = new Date().getTime();
		
		var dt;
		if (lastTime == 0) // first frame
			dt = 0;
		else
			dt = newTime - lastTime;
		
		// Clear the buffers
		Graphics.Clear();
		
		// Loop through the whole scene graph, updating and drawing
		var i = 0;
		while (i < this.World.SceneGraph.length)
		{
			if (typeof this.World.SceneGraph[i]["Update"] !== 'undefined')
			{
				this.World.SceneGraph[i].Update(this.World.SceneGraph[i], dt / 1000);
				this.World.SceneGraph[i].Draw(this.World.SceneGraph[i], Graphics.ContextCache[0]);
			}
			i++;
		}
		
		if (DEBUG)
		{
			Debug.FPS = Math.floor( 1000 / dt );
			Debug.Draw();
		}
		
		if (!this.Running) // Game has been told to stop
			return;

		this.LoopHandle = setTimeout( function() { Game.Update(newTime); }, 1000 / Game.Settings.FPS);
	},
};