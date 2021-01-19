import { useMemo, useCallback } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ajax, AjaxRequest, AjaxResponse } from "rxjs/ajax";
import { map, shareReplay, switchAll } from "rxjs/operators";
import { Observable } from "rxjs";

function getBaseUrl() {
	return "/api";
}

function getConnection(ajaxHelper: (urlOrRequest: AjaxRequest) => Observable<AjaxResponse>) {
	return ajaxHelper({
		method: "POST",
		url: `negotiate`,
	}).pipe(
		map(r => {
			if (r.status !== 200) throw new Error("Could not negotiate SignalR");
			return r.response;
		}),
		map(({ accessToken, url, endpoint }) => {
			const target = url || endpoint;
			return new HubConnectionBuilder()
				.withUrl(target, {
					accessTokenFactory: () => accessToken,
				})
				.withAutomaticReconnect()
				.configureLogging(LogLevel.Information)
				.build();
		}),
		map(hub => {
			return new Observable<HubConnection>(observer => {
				hub.start().then(() => observer.next(hub));
				return () => hub.stop();
			});
		}),
		switchAll(),
		shareReplay(1)
	);
}

export function useSignalRConnection(gamerId: string) {
	const ajaxHelper = useCallback(
		function ({ url, headers = {}, ...init }: AjaxRequest) {
			return ajax({ url: `${getBaseUrl()}/${url}`, headers: { "X-Gamer-Id": gamerId, ...headers }, ...init });
		},
		[gamerId]
	);

	const connection = useMemo(() => getConnection(ajaxHelper), [ajaxHelper]);

	return { connection, ajax: ajaxHelper };
}
