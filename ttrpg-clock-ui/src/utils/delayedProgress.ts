import { Observable, of } from "rxjs";
import { catchError, map, throwIfEmpty } from "rxjs/operators";

export type DelayedProgressResult<TResult> = "progress" | ["succeeded", TResult] | ["failed", Error];

export function isWorking<TResult>(t: DelayedProgressResult<TResult> | undefined): t is undefined | "progress" {
	return t === undefined || t === "progress";
}
export function isComplete<TResult>(
	t: DelayedProgressResult<TResult> | undefined
): t is ["succeeded", TResult] | ["failed", Error] {
	return t !== undefined && t !== "progress";
}
export function showLoading<TResult>(t: DelayedProgressResult<TResult> | undefined): t is "progress" {
	return t === "progress";
}
export function isSuccess<TResult>(t: DelayedProgressResult<TResult> | undefined): t is ["succeeded", TResult] {
	return !isWorking(t) && t[0] === "succeeded";
}
export function isFailure<TResult>(t: DelayedProgressResult<TResult> | undefined): t is ["failed", Error] {
	return !isWorking(t) && t[0] === "failed";
}
export function successValue<TResult>(t: ["succeeded", TResult]) {
	return t[1];
}
export function failureError<TResult>(t: ["failed", Error]) {
	return t[1];
}

export function delayedProgress<TEvent, TResult>(action: (event: TEvent) => Observable<TResult>) {
	return map(
		(event: TEvent) =>
			new Observable<DelayedProgressResult<TResult>>(observer => {
				observer.next(undefined);
				let timeout: NodeJS.Timeout | undefined = setTimeout(() => observer.next("progress"), 140);
				const subscription = action(event)
					.pipe(
						map(result => ["succeeded", result] as DelayedProgressResult<TResult>),
						throwIfEmpty(),
						catchError(error => of(["failed", error] as DelayedProgressResult<TResult>))
					)
					.subscribe(observer);
				function clear() {
					if (timeout) {
						clearTimeout(timeout);
						timeout = undefined;
					}
				}

				subscription.add(clear);

				return subscription;
			})
	);
}
