import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthProvider";
import { useState } from "react";
// import Dropdown from "./dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
	const [showDropdown, setShowDropdown] = useState<boolean>(false);

	const { user, isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	return (
		<nav className="bg-gray-800 h-14">
			<div className="max-w-7xl mx-auto flex justify-between items-center gap-x-6 h-full px-4">
				<Link to="/" className="text-lg text-white font-bold">
					BBSurvivor
				</Link>

				<div className="lg:hidden border border-white rounded space-y-1 p-1">
					<div className="h-1 bg-white w-6"></div>
					<div className="h-1 bg-white w-6"></div>
					<div className="h-1 bg-white w-6"></div>
				</div>

				<div className="hidden lg:flex text-white font-medium flex-1">
					<div className="flex-1 space-x-3">
						<Link to="/">Home</Link>
						<Link to="/about">About</Link>
					</div>
					<div className="space-x-3">
						{isAuthenticated && user ? (
							<>
								<button
									className="relative cursor-pointer"
									onClick={() => setShowDropdown((prev) => !prev)}
								>
									<span className="me-2">{user.username}</span>
									<FontAwesomeIcon icon="caret-down" size="xs" />
									{showDropdown && (
										<div className="z-10 absolute bg-white rounded min-w-36 text-gray-600 mt-2 shadow-lg right-0 overflow-hidden">
											<ul>
												<li
													className="text-right px-3 py-1 font-medium hover:bg-gray-100 cursor-pointer"
													onClick={() => navigate("/profile")}
												>
													My Profile
												</li>
												<li
													className="text-right px-3 py-1 font-medium hover:bg-gray-100 cursor-pointer"
													onClick={() => navigate("/entries")}
												>
													My Entries
												</li>
												<li
													className="text-right px-3 py-1 font-medium hover:bg-gray-100 cursor-pointer"
													onClick={handleLogout}
												>
													Logout
												</li>
											</ul>
										</div>
									)}
								</button>
							</>
						) : (
							<>
								<Link to="/register">Register</Link>
								<Link to="/login">Login</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};
export default Navbar;
