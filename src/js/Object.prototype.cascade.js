// Note: it was necessary to do it this way to appease Babel. Otherwise, we get an error:
// "you gave us a visitor for the node type"
Object.defineProperty(Object.prototype, 'cascade', {
	value: function(f) {
		return f(this)
	}
})