import { Observable } from "rxjs";
import { DependencyList, useEffect, useMemo, useState } from "react";
import { Subject } from "rxjs";
import { map, switchAll } from "rxjs/operators";

export function useRx<T>(target: () => Observable<T>, initial: T, dependencies: DependencyList): T;
export function useRx<T>(target: Observable<T>): T | undefined;
export function useRx<T>(target: Observable<T>, initial: T): T;
export function useRx<T>(
	targetFactory: Observable<T> | (() => Observable<T>),
	initial?: T | undefined,
	dependencies?: DependencyList
) {
	const internal = useMemo(() => new Subject<Observable<T> | (() => Observable<T>)>(), []);
	const mapped = useMemo(
		() =>
			internal.pipe(
				map(v => (typeof v === "function" ? v() : v)),
				switchAll()
			),
		[internal]
	);
	const [result, setResult] = useState<T | undefined>(initial);
	useEffect(() => {
		const subscription = mapped.subscribe(setResult);
		return () => subscription.unsubscribe();
	}, [mapped, setResult]);

	useEffect(() => {
		internal.next(targetFactory);
	}, [internal, ...(dependencies ?? [targetFactory])]);

	return result;
}
