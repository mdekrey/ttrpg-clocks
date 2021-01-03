import React from "react";
import { Observable } from "rxjs";
import { cancelableEvent } from "./cancelableEvent";
import { useRx } from "./useRx";

export function useCancelableEvent<TEvent, TResult>(
	pipe: (target: Observable<TEvent>) => Observable<Observable<TResult>>,
	defaultValue: TResult
) {
	const { state$, emitEvent, emitCancelation } = React.useMemo(() => cancelableEvent(pipe, defaultValue), [
		pipe,
		defaultValue,
	]);
	const state = useRx(state$, defaultValue);
	return [state, emitEvent, emitCancelation] as const;
}
