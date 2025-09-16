import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthProvider";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useOutsideClick } from "../hooks/useOutsideClick";
// import Dropdown from "./dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotificationLink from "./NotificationLink";
import Icon from "./icon";
import { useSearchParams } from "react-router-dom";

interface LinksInfo {
	name: string;
	label: string;
	route: string;
}

interface NavbarProps {
	className?: string;
}
const Navbar = ({ className }: NavbarProps) => {
	const [searchParams] = useSearchParams();

	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [showMenu, setShowMenu] = useState<boolean>(false);
	const [showMenuDropDown, setShowMenuDropDown] = useState<boolean>(false);

	const {
		authLoading,
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

	const otherMenuRef = useRef<HTMLDivElement>(null);

	const dropdownMenuRef = useRef<HTMLDivElement>(null);

	const dropdownRef = useOutsideClick<HTMLDivElement>(() => {
		// 2. Callback function: close the dropdown when an outside click occurs
		setShowDropdown(false);
	});

	const isLoadedRef = useRef<boolean>(false);

	const friendsTab = searchParams.get("tab") || "active";

	const entriesSearch = searchParams.get("search");

	const bracketSearch = searchParams.get("search");
	const bracketUrl = `/bracket-challenges${
		bracketSearch ? `?search=${bracketSearch}` : ""
	}`;

	const userLinks: LinksInfo[] = [
		{ name: "profile", label: "Profile", route: "/profile" },
		{
			name: "entries",
			label: "Entries",
			route: `/entries${entriesSearch ? `?search=${entriesSearch}` : ""}`,
		},
		{
			name: "friends",
			label: "Friends",
			route: `/friends?tab=${friendsTab}`,
		},
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
		if (showDropdown && otherMenuRef.current) {
			gsap.fromTo(
				otherMenuRef.current,
				{ scaleY: 0 },
				{
					scaleY: 1,
					duration: 0.4,
					ease: "elastic.out(1, 0.8)",
					transformOrigin: "top center",
				}
			);
		}
		return () => {
			if (!otherMenuRef.current) return;
			gsap.killTweensOf(otherMenuRef.current);
		};
	}, [showDropdown]);

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

	// useEffect(() => {
	// 	const handleResize = () =>
	// 		setShowDropdown(false);

	// 		if (window.innerWidth >= 768) {
	// 			setShowMenu(false);
	// 			setShowMenuDropDown(false);
	// 		}
	// 	};
	// 	window.addEventListener("resize", handleResize);

	// 	return () => {
	// 		window.removeEventListener("resize", handleResize);
	// 	};
	// }, []);

	useEffect(() => {
		if (!user || authLoading) return;

		fetchUnreadCount();

		// console.log("this is me");

		window.Echo.private(`users.${user.id}`).notification((data: any) => {
			console.log("unreadCount", data.unread_count);
			updateUnreadCount(data.unread_count);
		});

		const handleResize = () => {
			setShowDropdown(false);

			if (window.innerWidth >= 768) {
				setShowMenu(false);
				setShowMenuDropDown(false);
			}
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.Echo.leaveChannel(`users.${user.id}`);
			window.removeEventListener("resize", handleResize);
		};
	}, [user, authLoading, isLoadedRef]);

	return (
		<nav
			className={`bg-gray-800 border-b border-gray-500 h-14 sticky top-0 z-20 ${className}`}
		>
			<div className="max-w-7xl mx-auto flex justify-between items-center gap-x-6 h-full px-4">
				<Link to="/" className="text-lg text-white font-bold">
					{/* <FontAwesomeIcon icon="basketball" /> BBSurvivor */}
					<Icon className="h-10 object-contain" />
				</Link>

				<div className="hidden md:flex items-center text-white font-medium flex-1">
					<div className="flex-1 space-x-4">
						<Link to="/" className="hover:text-gray-400">
							Home
						</Link>
						<Link to={bracketUrl} className="hover:text-gray-400">
							Bracket Challenges
						</Link>
						<Link to="/about" className="hover:text-gray-400">
							About
						</Link>
					</div>
					<div className="flex items-center space-x-3.5">
						{isAuthenticated && user ? (
							<>
								<NotificationLink unreadCount={unreadCount} />

								<div className="relative" ref={dropdownRef}>
									<button
										className="block cursor-pointer hover:text-gray-300"
										onClick={() => setShowDropdown((prev) => !prev)}
									>
										<div className="bg-gray-700 font-semibold border border-gray-300 rounded overflow-hidden px-2">
											{user.username}{" "}
											<FontAwesomeIcon
												icon={
													showDropdown ? "caret-up" : "caret-down"
												}
											/>
										</div>
									</button>
									{showDropdown && (
										<div
											ref={otherMenuRef}
											className="absolute font-medium border-1 border-gray-7 00 bg-white rounded-lg min-w-40 text-gray-700 shadow-lg right-0 mt-2 overflow-hidden"
										>
											{userLinks.map((link) => (
												<Link
													key={link.name}
													to={link.route}
													className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer block text-right"
													onClick={() => setShowDropdown(false)}
												>
													{link.label}
												</Link>
											))}
											{hasRole("admin") && (
												<Link
													to="/admin"
													className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer block text-right"
													onClick={() => setShowDropdown(false)}
												>
													Admin Page
												</Link>
											)}

											<button
												className="w-full text-right px-3 py-1.5 border-t border-gray-300 font-medium hover:bg-gray-100 cursor-pointer"
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

				<div className="md:hidden flex space-x-3 items-center">
					{isAuthenticated && user && (
						<NotificationLink
							unreadCount={unreadCount}
							className="text-white"
						/>
					)}

					<button
						className="cursor-pointer text-white font-bold hover:text-gray-400 w-8 border border-gray-300 rounded"
						onClick={handleMenuOptionsClick}
					>
						<FontAwesomeIcon
							icon={showMenu ? "xmark" : "bars"}
							size="lg"
						/>
					</button>
				</div>

				{showMenu && (
					<div className="fixed w-full h-[calc(100dvh-56px)] bottom-0 end-0">
						<div
							className="absolute w-full h-full bg-[#3a3a3a66]"
							onClick={handleMenuOptionsClick}
						></div>
						<div
							ref={menuRef}
							className="absolute end-0 w-full max-w-[350px] h-full bg-gray-800 text-white pointer-events-auto"
						>
							<button
								className="p-2 w-full text-left border-b border-gray-300 hover:text-gray-400 cursor-pointer"
								onClick={() => handleMenuClick("/")}
							>
								Home
							</button>
							<button
								className="p-2 w-full text-left border-b border-gray-300 hover:text-gray-400 cursor-pointer"
								onClick={() => handleMenuClick(bracketUrl)}
							>
								Bracket Challenges
							</button>
							<button
								className="p-2 w-full text-left border-b border-gray-300 hover:text-gray-400 cursor-pointer"
								onClick={() => handleMenuClick("/about")}
							>
								About
							</button>

							{isAuthenticated ? (
								<>
									<button
										className="p-2 w-full text-left flex items-center gap-x-2 border-b border-gray-300 hover:text-gray-400 cursor-pointer"
										onClick={handleDropdownMenuClick}
									>
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
											className="overflow-hidden ps-3 border-b border-gray-300"
										>
											{userLinks.map((link) => (
												<button
													key={link.name}
													className="p-2 w-full text-left border-b border-gray-300 hover:text-gray-400 cursor-pointer"
													onClick={() =>
														handleMenuClick(link.route)
													}
												>
													{link.label}
												</button>
											))}

											{hasRole("admin") && (
												<button
													className="p-2 w-full text-left border-b border-gray-300 hover:text-gray-400 cursor-pointer"
													onClick={() => handleMenuClick("/admin")}
												>
													Admin Page
												</button>
											)}

											<button
												className="p-2 w-full text-left hover:text-gray-400 cursor-pointer"
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
