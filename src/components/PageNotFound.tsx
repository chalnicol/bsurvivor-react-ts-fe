// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const PageNotFound: React.FC = () => {
	return (
		<div className="py-10 min-h-[calc(100dvh-57px)] text-center">
			<div className="border rounded max-w-sm mx-auto p-3 mb-4 shadow-lg flex justify-center items-center space-x-4">
				<div>
					<h1 className="text-3xl lg:text-4xl font-bold">404</h1>
					<h2 className="text-lg font-semibold">Page Not Found</h2>
				</div>
			</div>

			<p>
				The page you are looking for does not exist. Go to{" "}
				<Link to="/" className="underline">
					Home
				</Link>
			</p>
		</div>
	);
};

export default PageNotFound;
