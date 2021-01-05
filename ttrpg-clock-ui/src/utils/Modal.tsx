import React from "react";
import { createPortal } from "react-dom";

const InnerModalContext = React.createContext<null | React.MutableRefObject<number>>(null);

/*
Example:

    <Modal onRequestHide={() => setShowModal(false)} show={showModal}>
        <ModalContent>
            <ModalHeader>Deactivate account</ModalHeader>
            <p className="mt-2 text-sm leading-5 text-gray-500">
                Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.
            </p>
        </ModalContent>
        <ModalFooter>
            <ModalButton className={buttonStyles.green}>
                OK
            </ModalButton>
            <ModalButton>
                Cancel
            </ModalButton>
        </ModalFooter>
    </Modal>
*/
export const Modal = ({
	children,
	onRequestHide,
	show,
}: {
	children?: React.ReactNode;
	show: boolean;
	onRequestHide?: () => void;
}) => {
	const outerModalHandle = React.useContext(InnerModalContext);
	const innerModalCount = React.useRef(0);
	const element = React.useMemo(() => document.createElement("div"), []);
	React.useEffect(() => {
		const modalRoot = document.getElementsByTagName("body")[0];
		modalRoot?.appendChild(element);
		return () => {
			modalRoot?.removeChild(element);
		};
	}, [element]);
	React.useEffect(() => {
		if (!show) return () => {};
		function keyPress(e: KeyboardEvent) {
			if (e.defaultPrevented || innerModalCount.current > 0) {
				return;
			}
			if (e.key === "Escape" && onRequestHide) {
				e.preventDefault();
				// write your logic here.
				onRequestHide();
			}
		}
		document.addEventListener("keyup", keyPress);
		return () => document.removeEventListener("keyup", keyPress);
	}, [onRequestHide, show]);

	React.useEffect(() => {
		// ensures the most recently shown modal is at the bottom
		if (show) element.parentElement?.appendChild(element);
	}, [element, show]);
	React.useEffect(() => {
		if (!outerModalHandle || !show) {
			return () => {};
		}
		outerModalHandle.current++;
		return () => (outerModalHandle.current -= 1);
	}, [outerModalHandle, show]);
	if (!show) return null;

	return createPortal(
		<div className="fixed z-10 inset-0 overflow-y-auto">
			<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block">
				{/* <!--
            Background overlay, show/hide based on modal state.

            Entering: "ease-out duration-300"
                From: "opacity-0"
                To: "opacity-100"
            Leaving: "ease-in duration-200"
                From: "opacity-100"
                To: "opacity-0"
            --> */}
				<div className="fixed inset-0 transition-opacity">
					<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
				</div>
				{/* <!-- This element is to trick the browser into centering the modal contents. --> */}
				<span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
				{/* <!--
            Modal panel, show/hide based on modal state.

            Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            --> */}
				<div
					className="inline-block align-bottom bg-black text-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg md:max-w-4xl sm:w-full "
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-headline"
				>
					{onRequestHide ? (
						<button className="absolute top-0 right-0 m-2 w-8 h-8" onClick={onRequestHide}>
							<svg
								className="w-6 h-6 text-gray-100 m-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M6 18L18 6 M6 6l12 12" strokeWidth="3" />
							</svg>
						</button>
					) : null}
					<InnerModalContext.Provider value={innerModalCount}>{children}</InnerModalContext.Provider>
				</div>
			</div>
		</div>,
		element
	);
};
export const ModalContent = ({ children, icon }: { children?: React.ReactNode; icon?: React.ReactNode }) => (
	<div className="bg-black px-4 pt-5 pb-4 sm:p-6">
		<div className="sm:flex sm:items-start">
			{icon ? icon : null}
			<div className={`text-center sm:text-left w-full ${icon ? "mt-3 sm:mt-0 sm:ml-4" : ""}`}>{children}</div>
		</div>
	</div>
);
export const RoundedIcon = ({
	icon,
	iconColor,
	iconBgColor,
}: {
	icon: React.ReactNode;
	iconColor: string;
	iconBgColor: string;
}) => (
	<div
		className={`mx-auto flex-shrink-0 flex items-center justify-center rounded-full ${iconBgColor} sm:mx-0 h-12 w-12 sm:h-10 sm:w-10`}
	>
		<svg
			className={`h-6 w-6 ${iconColor}`}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			{icon}
		</svg>
	</div>
);
/* Heroicon name: exclamation */
export const DarkRedExclamation = () => (
	<RoundedIcon
		iconColor="text-red-600"
		iconBgColor="bg-red-900"
		icon={
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
			/>
		}
	/>
);

export const ModalHeader = ({ children }: { children?: React.ReactNode }) => (
	<h3 className="text-lg leading-6 font-medium text-gray-100" id="modal-headline">
		{children}
	</h3>
);

export const ModalFooter = ({ children }: { children?: React.ReactNode }) => (
	<div className="bg-gray-900 py-3 px-4 sm:p-6 sm:flex sm:flex-row-reverse">{children}</div>
);

export const buttonStyles = {
	normal: "bg-black text-gray-200 hover:text-white hover:bg-blue-900 focus:bg-blue-800 focus:shadow-outline-blue",
	green: "bg-green-600 text-white hover:bg-green-900 focus:bg-green-900 focus:border-white hover:border-white",
	red: "bg-red-600 text-white hover:bg-red-900 focus:bg-red-900 focus:border-white hover:border-white",
};

export const ModalButton = ({
	className = buttonStyles.normal,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
	<span className="mt-3 first:mt-0 flex w-full shadow-sm sm:ml-3 sm:mt-0 sm:w-auto">
		<button
			type="button"
			className={`inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 text-base leading-6 font-medium shadow-sm focus:outline-none  focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
				className || ""
			}`}
			{...props}
		/>
	</span>
);
