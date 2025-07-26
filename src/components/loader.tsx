import { useEffect, useState } from "react";
import img from "../assets/logo_bbsurvivor.png";

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
				<div className="space-y-1 px-3 py-2 rounded shadow bg-gray-900">
					<img
						// src={"logo_bbsurvivor.png"}
						src={img}
						alt="logo"
						className="h-8 mx-auto"
					/>
					<div className="flex justify-center text-white font-semibold">
						<p>LOADING</p>
						<p className="w-6 text-left">{ellipsis}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Loader;
