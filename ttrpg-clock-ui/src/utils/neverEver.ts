export function neverEver(shouldNever: never): never {
	throw new Error(`${shouldNever} should never have happened.`);
}
