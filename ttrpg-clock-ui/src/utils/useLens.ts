import produce, { Draft } from "immer";
import React, { useCallback, useMemo } from "react";

export type Setter<T> = React.Dispatch<React.SetStateAction<Readonly<T>>>;
export type Stateful<T> = [T, Setter<T>];
export type Lens<T, U> = {
	get: (v: T) => U;
	set: (prev: Draft<T>, next: U) => void;
};
export function createLens<T, U>(getValue: (v: T) => U, mergeValue: (prev: Draft<T>, next: U) => void): Lens<T, U> {
	return { get: getValue, set: mergeValue };
}
export function useLens<T, U>(
	[inValue, setInValue]: Stateful<T>,
	{ get: getValue, set: mergeValue }: Lens<T, U>
): Stateful<U> {
	const ezMerge = useCallback(
		(prev: T, next: U): T =>
			produce(prev, v => {
				mergeValue(v, next);
			}),
		[mergeValue]
	);
	const outValue = useMemo(() => getValue(inValue), [inValue, getValue]);
	const setOutValue = useCallback(
		(uAction: React.SetStateAction<U>) =>
			setInValue(inValue =>
				typeof uAction === "function"
					? ezMerge(inValue, (uAction as (prevState: U) => U)(getValue(inValue)))
					: ezMerge(inValue, uAction)
			),
		[ezMerge, setInValue, getValue]
	);

	return [outValue, setOutValue];
}
