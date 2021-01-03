export default () => {
	return (
		<div className="flex flex-col h-screen text-center">
			<div className="flex-grow"></div>
			<h1>TTRP Clock Tracker</h1>
			<p>
				Use a URL sent to you by your GM or{" "}
				<button className="bg-gray-300 border border-gray-800 rounded p-1 shadow">Start new Clocks</button>.
			</p>
			<div className="flex-grow"></div>
			<div className="flex-grow"></div>
		</div>
	);
};
