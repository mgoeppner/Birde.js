/**
* This is where core events are bound to and called from.
*/
var EventRegistry =
{
	draw : [],
	step : [],
	keydown : [],
	keyup : [],
	keypress : [],
	contentloadupdate : [],
	contentload : []
}

/**
* Manually fires an event, without arguments.
*/
var FireEvent = function(event)
{
	var i = 0;
	while (i < EventRegistry[event].length)
	{
		var a = EventRegistry[event][i];
		a.response.call(a.target, arguments[1]);
		i++;
	}
}

function Event(overrides)
{
	this.keyCode = overrides.keyCode || 0;
}