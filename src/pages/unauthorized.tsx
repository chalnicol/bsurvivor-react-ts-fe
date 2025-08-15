import React from "react";
import { Link } from "react-router-dom";

const Unauthorized: React.FC = () => {
	return (
		<div className="py-10 min-h-[calc(100dvh-57px)] text-center">
			<div className="border rounded max-w-sm mx-auto p-3 mb-4 shadow-lg flex justify-center items-center space-x-4">
				<div>
					<h1 className="text-3xl lg:text-4xl font-bold">401</h1>
					<h2 className="text-lg font-semibold">Unauthorized</h2>
				</div>
			</div>

			<p>
				You do not have permission to view this page. Go to{" "}
				<Link to="/" className="underline">
					Home
				</Link>
			</p>
		</div>
	);
};

export default Unauthorized;
