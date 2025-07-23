import { useEffect, useState } from "react";

const Loader = () => {
	const [ellipsis, setEllipsis] = useState<string>(".");

	useEffect(() => {
		let tmp = "";
		const timer = setInterval(() => {
			tmp += ".";
			setEllipsis(tmp);
			if (tmp.length > 3) {
				tmp = "";
			}
		}, 300);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<div className="fixed top-0 left-0 overflow-y-auto z-10 w-full h-full">
			<div className="absolute w-full h-full bg-gray-900 opacity-50"></div>
			<div className="absolute h-full w-full flex justify-center items-center ">
				<div className="w-44 h-10 flex justify-center items-center rounded font-semibold bg-white text-center">
					<div className="flex justify-center">
						<p>Loading</p>
						<p className="w-6 text-left">{ellipsis}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Loader;
