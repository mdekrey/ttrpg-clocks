import { useMemo } from "react";
import { isSSR } from "./isSSR";

export function useLocationParams() {
	return useMemo(() => {
		if (isSSR()) return {};
		if (!window.location.search) return {};
		const searchParts = window.location.search.split("?");
		const params = searchParts[searchParts.length - 1].split("&");
		return params.reduce((prev, next) => {
			const [key, value] = next.split("=");
			prev[key] = value;
			return prev;
		}, {} as Record<string, string>);
	}, []);
}
