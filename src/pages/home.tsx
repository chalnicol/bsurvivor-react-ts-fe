import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth/AuthProvider";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = () => {
	const { isAuthenticated } = useAuth();

	return (
		<>
			<div className="w-full py-8 min-h-[calc(100dvh-57px)]">
				<h1 className="text-4xl font-bold mb-4 text-center">
					Welcome to Basketball Survivor!
				</h1>
				<p className="text-justify text-sm">
					Ready to put your prediction skills to the test? Welcome to
					Basketball Survivor! Choose wisely across different leagues, make
					those winning picks, and outplay the competition to be the last
					survivor. Make your predictions count!
				</p>

				<hr className="my-3 border-gray-400" />

				<div className="space-y-3">
					<div>
						<h2 className="text-lg font-bold mb-2">
							Live Bracket Challenges
						</h2>

						<div className="space-y-2">
							<div className="flex items-center">
								<div className="flex-1 text-sm">NBA 2025</div>

								<Link
									to="/nba"
									className="bg-gray-600 hover:bg-gray-500 text-xs p-1 w-16 rounded text-white text-center font-semibold cursor-pointer"
								>
									VIEW
								</Link>
							</div>
							<div className="flex items-center">
								<div className="flex-1 text-sm">
									PBA GOVERNORS CUP 2025
								</div>
								<Link
									to="/pba"
									className="bg-gray-600 hover:bg-gray-500 text-xs p-1 w-16 rounded text-white text-center font-semibold cursor-pointer"
								>
									VIEW
								</Link>
								{/* <span className="bg-green-500 text-xs p-1 w-16 rounded text-white font-semibold text-center">
									LISTED
								</span> */}
							</div>
						</div>
						{!isAuthenticated && (
							<div className="text-sm rounded text-gray-700 mt-4">
								<FontAwesomeIcon icon="circle-info" />{" "}
								<Link to="/login" className="hover:underline">
									Login
								</Link>
								/
								<Link to="/register" className="hover:underline">
									Register
								</Link>{" "}
								<span>to join bracket challenges!</span>
							</div>
						)}

						<hr className="mt-4 mb-3 border-gray-400" />
					</div>

					<div>
						<h2 className="text-lg font-bold mb-2">Survivors</h2>
						<div className="md:flex gap-x-4 space-y-2">
							{/* nba */}
							<div className="flex-1">
								<div className="px-2 py-1 bg-red-600 text-white flex items-center">
									<p className="font-semibold flex-1">NBA (19)</p>
									<Link
										to="/nba"
										className="text-xs font-semibold border hover:bg-red-600 py-0.5 px-3 rounded"
									>
										View All
									</Link>
								</div>
								<div className="text-sm">
									<p className="p-1 odd:bg-gray-200">chalnicol</p>
									<p className="p-1 odd:bg-gray-200">chalnicol</p>
									<p className="p-1 odd:bg-gray-200">chalnicol</p>
								</div>
							</div>
							{/* pba */}
							<div className="flex-1">
								<div className="px-2 py-1 bg-blue-800 text-white flex items-center">
									<p className="font-semibold flex-1">PBA (29)</p>
									<Link
										to="/pba"
										className="text-xs font-semibold border hover:bg-blue-800 py-0.5 px-3 rounded"
									>
										View All
									</Link>
								</div>
								<div className="text-sm">
									<p className="p-1 odd:bg-gray-200">chalnicol</p>
									<p className="p-1 odd:bg-gray-200">chalnicol</p>
									<p className="p-1 odd:bg-gray-200">chalnicol</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Home;
