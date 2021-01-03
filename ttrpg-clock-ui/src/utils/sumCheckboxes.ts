export function sumCheckboxes(xp: Readonly<boolean[]>) {
	return xp.reduce((xp, value) => xp + (value ? 1 : 0), 0);
}
