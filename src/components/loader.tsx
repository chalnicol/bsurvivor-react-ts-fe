import { useEffect, useState } from "react";
import img from "../assets/bsurvivor.png";
import ModalBase from "./modalBase";

interface LoaderProps {
	prompt?: string;
}
const Loader = ({ prompt }: LoaderProps) => {
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
		<ModalBase>
			<div className="space-y-1 px-3 py-2 rounded shadow bg-gray-900">
				<img
					// src={"logo_bbsurvivor.png"}
					src={img}
					alt="logo"
					className="h-8 mx-auto"
				/>
				<div className="flex justify-center text-white font-semibold">
					<p>{prompt || "LOADING"}</p>
					<p className="w-6 text-left">{ellipsis}</p>
				</div>
			</div>
		</ModalBase>
	);
};

export default Loader;
