import { merge, Observable, of, Subject } from "rxjs";
import { map, switchAll } from "rxjs/operators";

export function cancelableEvent<TEvent, TResult>(
	pipe: (target: Observable<TEvent>) => Observable<Observable<TResult>>,
	defaultValue: TResult
) {
	const eventSubject = new Subject<TEvent>();
	const cancelationSubject = new Subject();
	const state$ = merge(eventSubject.pipe(pipe), cancelationSubject.pipe(map(() => of(defaultValue)))).pipe(
		switchAll()
	);
	const emitEvent = (event: TEvent) => eventSubject.next(event);
	const emitCancelation = () => cancelationSubject.next();
	return { state$, emitEvent, emitCancelation } as const;
}
