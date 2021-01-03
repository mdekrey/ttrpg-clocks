import React from "react";
import { delayedProgress } from "./delayedProgress";
import { useCancelableEvent } from "./useCancelableEvent";
import { Observable } from "rxjs";

export function useDefaultCancelableEvent<TEvent, TResult>(
	pipe: (target: TEvent) => Observable<TResult>,
	deps: React.DependencyList
) {
	return useCancelableEvent(React.useCallback(delayedProgress(pipe), deps), undefined);
}
