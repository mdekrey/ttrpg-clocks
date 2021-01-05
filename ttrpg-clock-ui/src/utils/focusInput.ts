export const focusInput = (input: HTMLInputElement | null) => {
	setTimeout(() => {
		input?.focus();
	});
};
