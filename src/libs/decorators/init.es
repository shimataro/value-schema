export default (TargetClass) =>
{
	TargetClass.prototype._initializers = [];
	TargetClass.prototype._adjusters = [];

	return TargetClass;
};
