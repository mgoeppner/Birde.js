/**
* Represents any object in the world - versatile, general object.
*/
var Actor = function(id, props)
{

	this.id = id;

	// First extends the provided properties object with defaults
	Birde.extend(props, {
		x : 0,
		y : 0,
		w : 0,
		h : 0,
		class : [],

		// maintains a list of all the bindings this Actor is registered for // NOT IMPLEMENTED YET
		bindings : [],

		// all actors have no parent by default
		parent : null,
	});

	// then extends the actor object with those properties - there's probably a cheap way to reduce this to a one-step process
	Birde.extend(this, props);

	this.collisionShape = new Shape.Rectangle(0, 0, this.w, this.h);

	/**
	* Returns the position that this object should be drawn on the screen in - takes into account the position of the world, its parent's position,
	* and its own position within its parent's coordinate space. 
	*/
	this.getScreenPos = function()
	{
		// Returns the coordinates of the object relative to the world and any parents
		var pos = {};
		pos.x = Birde.Scene.Position.x;
		pos.y = Birde.Scene.Position.y;

		if (this.parent != null)
		{
			var parentPos = this.parent.getScreenPos();
			pos.x += parentPos.x;
			pos.y += parentPos.y;
		}

		pos.x += this.x;
		pos.y += this.y;

		return pos;
	}

	/**
	* Returns true if this Actor is part of a particular class.
	*/
	this.hasClass = function(c)
	{
		if (this.class.indexOf(c) > -1)
			return true;

		return false;
	}

	/**
	* Returns true if this actor is bound to the requested event
	*/
	this.isBoundTo = function(binding)
	{
		/*
		if (typeof EventRegistry[binding][this.id] !== 'undefined')
			return true;

		return false;
		*/
	}

	/**
	* Removes this Actor from the scene entirely. Needs work to unbind everything the actor's done.
	*/
	this.destroy = function()
	{
		// Needs to unbind everything
		Birde.fn.Scene.Actors[this.id] = "";
	}

	/**
	* Moves this object based on the provided delta object.
	*/
	this.move = function(dir)
	{
		var x = dir.x * Tick;
		var y = dir.y * Tick;

		this.x += x;
		this.y += y;

		return this;
	}
}
