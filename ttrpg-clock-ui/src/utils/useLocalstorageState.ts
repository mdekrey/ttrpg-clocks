import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { isSSR } from "./isSSR";

function recursiveFill<T>(original: T, _default: T) {
	try {
		if (typeof original !== typeof _default) return _default;
		if (typeof _default === "object" && _default !== null) {
			for (const key in _default) {
				if (Object.prototype.hasOwnProperty.call(_default, key)) {
					(original as any)[key] = recursiveFill(original[key], _default[key]);
				}
			}
			if (Array.isArray(_default)) {
				_default.forEach((value, index) => {
					(original as any)[index] = recursiveFill((original as any)[index], _default[index]);
				});
			}
		}
		return original;
	} catch {
		return _default;
	}
}

export function useLocalstorageState<T>(key: string, initialState: T): [T, Dispatch<SetStateAction<T>>] {
	if (isSSR()) return useState(initialState);
	const localStorageRawValue = localStorage.getItem(key);
	const localStorageValue = localStorageRawValue
		? recursiveFill(JSON.parse(localStorageRawValue), initialState)
		: initialState;

	const [state, setState] = useState<T>(localStorageValue);
	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(state));
	}, [state, key]);
	return [state, setState];
}
