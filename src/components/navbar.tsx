import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthProvider";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useOutsideClick } from "../hooks/useOutsideClick";
// import Dropdown from "./dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotificationLink from "./NotificationLink";

interface LinksInfo {
	name: string;
	label: string;
	route: string;
}
const Navbar = () => {
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [showMenu, setShowMenu] = useState<boolean>(false);
	const [showMenuDropDown, setShowMenuDropDown] = useState<boolean>(false);

	const {
		user,
		isAuthenticated,
		hasRole,
		logout,
		fetchUnreadCount,
		updateUnreadCount,
		unreadCount,
	} = useAuth();

	const navigate = useNavigate();

	const menuRef = useRef<HTMLDivElement>(null);

	const dropdownMenuRef = useRef<HTMLDivElement>(null);

	const dropdownRef = useOutsideClick<HTMLDivElement>(() => {
		// 2. Callback function: close the dropdown when an outside click occurs
		setShowDropdown(false);
	});

	const userLinks: LinksInfo[] = [
		{ name: "profile", label: "Profile", route: "/profile" },
		{ name: "entries", label: "Entries", route: "/entries" },
		{ name: "friends", label: "Friends", route: "/friends" },
	];

	const handleLogout = async () => {
		setShowDropdown(false);
		closeMenuAnim();
		const response = await logout();
		if (response) {
			navigate("/login");
		}
	};

	const handleMenuClick = (route: string) => {
		console.log("menu click", route);
		closeMenuAnim();
		navigate(route);
	};

	const handleMenuOptionsClick = (): void => {
		if (!showMenu) {
			setShowMenu(true);
		} else {
			closeMenuAnim();
		}
	};

	const closeMenuAnim = () => {
		if (!menuRef.current) return;
		gsap.to(menuRef.current, {
			xPercent: 100,
			duration: 0.3,
			ease: "power4.out",
			onComplete: () => {
				setShowMenu(false);
				setShowMenuDropDown(false);
			},
		});
	};

	const handleDropdownMenuClick = () => {
		if (!showMenuDropDown) {
			setShowMenuDropDown(true);
		} else {
			closeDropdownMenuAnim();
		}
	};

	const closeDropdownMenuAnim = () => {
		if (!dropdownMenuRef.current) return;
		gsap.to(dropdownMenuRef.current, {
			height: 0,
			duration: 0.2,
			ease: "power4.out",
			onComplete: () => setShowMenuDropDown(false),
		});
	};

	useEffect(() => {
		if (showMenu) {
			if (!menuRef.current) return;
			gsap.from(menuRef.current, {
				xPercent: 100,
				duration: 0.3,
				ease: "power4.out",
			});
		}
		return () => {
			if (!menuRef.current) return;
			gsap.killTweensOf(menuRef.current);
		};
	}, [showMenu]);

	useEffect(() => {
		if (showMenuDropDown) {
			if (!dropdownMenuRef.current) return;
			gsap.from(dropdownMenuRef.current, {
				height: 0,
				duration: 0.2,
				ease: "power4.out",
			});
		}
		return () => {
			if (!dropdownMenuRef.current) return;
			gsap.killTweensOf(dropdownMenuRef.current);
		};
	}, [showMenuDropDown]);

	useEffect(() => {
		const handleResize = () => {
			setShowDropdown(false);

			if (window.innerWidth >= 1024) {
				setShowMenu(false);
				setShowMenuDropDown(false);
			}
		};
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		if (!user) return;

		fetchUnreadCount();

		window.Echo.private(`users.${user.id}`).notification(
			(unreadCount: number) => {
				updateUnreadCount(unreadCount);
			}
		);
		return () => {
			window.Echo.leaveChannel(`users.${user.id}`);
		};
	}, [user]);

	return (
		<nav className="bg-gray-800 border-b border-gray-600 h-14 sticky top-0 z-20">
			<div className="max-w-7xl mx-auto flex justify-between items-center gap-x-6 h-full px-4">
				<Link to="/" className="text-lg text-white font-bold">
					<FontAwesomeIcon icon="basketball" /> BBSurvivor
				</Link>

				<div className="hidden md:flex items-center text-white font-medium flex-1">
					<div className="flex-1 space-x-3">
						<Link to="/">Home</Link>
						<Link to="/about">About</Link>
					</div>
					<div className="flex items-center space-x-5">
						{isAuthenticated && user ? (
							<>
								<NotificationLink unreadCount={unreadCount} />

								<div className="relative" ref={dropdownRef}>
									<button
										className="block cursor-pointer "
										onClick={() => setShowDropdown((prev) => !prev)}
									>
										<div className="bg-gray-700 border rounded overflow-hidden px-2 space-x-1.5">
											<span className="font-semibold">
												{user.username}
											</span>
											<FontAwesomeIcon icon="caret-down" />
										</div>
									</button>
									{showDropdown && (
										<div className="absolute font-medium border border-gray-300 bg-white rounded-lg min-w-40 text-gray-700 shadow-lg right-0 mt-2 overflow-hidden">
											{userLinks.map((link) => (
												<Link
													key={link.name}
													to={link.route}
													className="px-3 py-2 hover:bg-gray-100 cursor-pointer block text-right"
													onClick={() => setShowDropdown(false)}
												>
													{link.label}
												</Link>
											))}
											{hasRole("admin") && (
												<Link
													to="/admin"
													className="px-3 py-2 hover:bg-gray-100 cursor-pointer block text-right"
													onClick={() => setShowDropdown(false)}
												>
													Admin Page
												</Link>
											)}

											<button
												className="w-full text-right px-3 py-2 border-t border-gray-300 font-medium hover:bg-gray-100 cursor-pointer"
												onClick={handleLogout}
											>
												Logout
											</button>
										</div>
									)}
								</div>
							</>
						) : (
							<>
								<Link to="/register">Register</Link>
								<Link to="/login">Login</Link>
							</>
						)}
					</div>
				</div>

				<div className="md:hidden flex space-x-4 items-center">
					{isAuthenticated && user && (
						<NotificationLink
							unreadCount={unreadCount}
							className="text-white"
						/>
					)}

					<button
						className="cursor-pointer text-white border rounded font-bold px-2"
						onClick={handleMenuOptionsClick}
					>
						<FontAwesomeIcon icon={showMenu ? "xmark" : "bars"} />
					</button>
				</div>

				{showMenu && (
					<div className="fixed w-full h-[calc(100dvh-57px)] bottom-0 end-0">
						<div
							className="absolute w-full h-full bg-[#3a3a3a66]"
							onClick={handleMenuOptionsClick}
						></div>
						<div
							ref={menuRef}
							className="absolute end-0 w-full max-w-[350px] h-full bg-gray-700 text-white pointer-events-auto"
						>
							<button
								className="border-b p-2 w-full text-left"
								onClick={() => handleMenuClick("/")}
							>
								Home
							</button>
							<button
								className="border-b p-2 w-full text-left"
								onClick={() => handleMenuClick("/about")}
							>
								About
							</button>

							{isAuthenticated ? (
								<>
									<button
										className="border-b p-2 w-full text-left flex items-center gap-x-2"
										onClick={handleDropdownMenuClick}
									>
										{/* <img src="/user.png" className="h-6" alt="user" /> */}
										<FontAwesomeIcon icon="user" />
										<div>
											<span className="me-2">
												{user ? user.username : "user"}
											</span>
											<FontAwesomeIcon
												icon={
													!showMenuDropDown
														? "caret-down"
														: "caret-up"
												}
												size="xs"
											/>
										</div>
									</button>

									{showMenuDropDown && (
										<div
											ref={dropdownMenuRef}
											className="overflow-hidden bg-gray-600"
										>
											{userLinks.map((link) => (
												<button
													key={link.name}
													className="border-b p-2 w-full text-left"
													onClick={() =>
														handleMenuClick(link.route)
													}
												>
													{link.label}
												</button>
											))}

											{hasRole("admin") && (
												<button
													className="border-b p-2 w-full text-left"
													onClick={() => handleMenuClick("/admin")}
												>
													Admin Page
												</button>
											)}

											<button
												className="border-b p-2 w-full text-left"
												onClick={() => handleLogout()}
											>
												Logout
											</button>
										</div>
									)}
								</>
							) : (
								<>
									<button
										className="border-b p-2 w-full text-left"
										onClick={() => handleMenuClick("/register")}
									>
										Register
									</button>
									<button
										className="border-b p-2 w-full text-left"
										onClick={() => handleMenuClick("/login")}
									>
										Login
									</button>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};
export default Navbar;
