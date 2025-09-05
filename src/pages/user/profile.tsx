import ChangePassword from "../../components/profile/changePassword";
import DeleteAccount from "../../components/profile/deleteAccount";
import ContentBase from "../../components/contentBase";
import EndOfPage from "../../components/endOfPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/auth/AuthProvider";
import { useEffect, useRef, useState } from "react";
import StatusMessage from "../../components/statusMessage";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import EditInfo from "../../components/profile/editInfo";
import ProfileInfo from "../../components/profile/profileInfo";
import gsap from "gsap";

type Tab = "details" | "edit" | "password" | "delete";

interface TabInfo {
	id: number;
	label: string;
	type: Tab;
}

const ProfilePage = () => {
	const { success, error, isLoading, clearMessages } = useAuth();
	const [tab, setTab] = useState<Tab>("details");
	const [showMenu, setShowMenu] = useState<boolean>(false);

	const menuRef = useRef<HTMLDivElement>(null);

	const parentMenuRef = useOutsideClick<HTMLDivElement>(() => {
		// 2. Callback function: close the dropdown when an outside click occurs
		setShowMenu(false);
	});

	const tabs: TabInfo[] = [
		{ id: 1, label: "PROFILE INFO", type: "details" },
		{ id: 2, label: "EDIT INFO", type: "edit" },
		{ id: 3, label: "CHANGE PASSWORD", type: "password" },
		{ id: 4, label: "DELETE ACCOUNT", type: "delete" },
	];

	const handleMenuClick = (tab: Tab) => {
		setTab(tab);
		setShowMenu(false);
	};

	useEffect(() => {
		const handleResize = () => {
			setShowMenu(false);
		};
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		if (showMenu && menuRef.current) {
			gsap.fromTo(
				menuRef.current,
				{ scale: 0 },
				{
					scale: 1,
					duration: 0.4,
					ease: "elastic.out(1, 0.6)",
					transformOrigin: "0 0",
				}
			);
		}
		return () => {
			if (menuRef.current) {
				gsap.killTweensOf(menuRef.current);
			}
		};
	}, [showMenu]);

	return (
		<ContentBase className="py-10 space-y-8 min-h-[calc(100dvh-96px)] px-4">
			<div className="p-3 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<h1 className="text-xl font-bold flex-1">
					<FontAwesomeIcon icon="caret-right" /> User Profile
				</h1>
				<p className="text-sm font-medium my-1">
					View and manage your profile information.
				</p>

				<div className="md:flex mt-4 bg-gray-800 text-white rounded min-h-100">
					<div
						ref={parentMenuRef}
						className="block md:hidden p-2 relative inline-block"
					>
						<div className="relative space-x-0.5">
							<button
								className="text-white w-7 aspect-square rounded-full cursor-pointer hover:bg-gray-600"
								onClick={() => setShowMenu((prev) => !prev)}
							>
								<FontAwesomeIcon icon="bars" />
							</button>
							<span className="font-semibold">MENU</span>
						</div>
						{showMenu && (
							<div
								ref={menuRef}
								className="absolute z-10 w-44  border border-gray-500 shadow rounded overflow-hidden"
							>
								{tabs.map((t) => (
									<button
										key={t.id}
										className={`py-1.5 px-3 text-left text-sm w-full font-semibold ${
											tab == t.type
												? "bg-gray-800/90 text-amber-400"
												: "bg-gray-600/90 hover:bg-gray-500/90 cursor-pointer"
										}`}
										onClick={() => handleMenuClick(t.type)}
										disabled={isLoading || tab == t.type}
									>
										{t.label}
									</button>
								))}
							</div>
						)}
					</div>
					<div className="flex-none hidden md:flex flex-col p-4 lg:p-5 text-white space-y-1.5 font-semibold text-sm border border-gray-600">
						{tabs.map((t) => (
							<button
								key={t.id}
								className={`border border-gray-500 py-2 px-3 text-left font-semibold ${
									tab == t.type
										? "text-amber-400"
										: "bg-gray-600 hover:bg-gray-500 cursor-pointer"
								}`}
								onClick={() => setTab(t.type)}
								disabled={isLoading || tab == t.type}
							>
								{t.label}
							</button>
						))}
					</div>

					<div className="flex-1 p-4 lg:p-5">
						{success && (
							<StatusMessage
								type="success"
								message={success}
								onClose={() => clearMessages()}
							/>
						)}
						{error && (
							<StatusMessage
								type="error"
								message={error}
								onClose={() => clearMessages()}
							/>
						)}
						{tab == "details" && <ProfileInfo />}
						{tab == "edit" && <EditInfo />}

						{tab == "password" && <ChangePassword />}
						{tab == "delete" && <DeleteAccount />}
					</div>
				</div>
			</div>

			<EndOfPage />
		</ContentBase>
	);
};

export default ProfilePage;
