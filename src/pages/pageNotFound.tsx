// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import ContentBase from "../components/contentBase";

const PageNotFound: React.FC = () => {
	return (
		<>
			<title>{`PAGE NOT FOUND | ${import.meta.env.VITE_APP_NAME}`}</title>
			<ContentBase className="px-4 py-6">
				<div className="rounded p-3 mb-4 bg-gray-800 h-50 text-white flex justify-center items-center space-x-4">
					<div className="text-center">
						<h1 className="text-3xl lg:text-5xl font-bold">404</h1>
						<h2 className="text-lg font-semibold">Page Not Found</h2>
						<hr className="my-3" />
						<p className="text-center">
							The page you are looking for does not exist. Go to{" "}
							<Link to="/" className="underline">
								Home
							</Link>
						</p>
					</div>
				</div>
			</ContentBase>
		</>
	);
};

export default PageNotFound;
