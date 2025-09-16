import ChangePassword from "../../components/profile/changePassword";
import DeleteAccount from "../../components/profile/deleteAccount";
import ContentBase from "../../components/contentBase";
import EndOfPage from "../../components/endOfPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/auth/AuthProvider";
import { useState } from "react";
import StatusMessage from "../../components/statusMessage";
import EditInfo from "../../components/profile/editInfo";
import { useNavigate } from "react-router-dom";
import MenuBar from "../../components/menuBar";
import type { TabInfo } from "../../data/adminData";
import LoadAuth from "../../components/auth/loadAuth";

type Tab = "edit" | "password" | "delete" | "profile";

interface ProfileTabInfo extends TabInfo<Tab> {}

const ProfilePage = () => {
	const navigate = useNavigate();

	const { user, success, error, isLoading, clearMessages } = useAuth();
	const [tab, setTab] = useState<Tab>("edit");

	const tabs: ProfileTabInfo[] = [
		{ id: 2, label: "EDIT INFO", tab: "edit", type: "button" },
		{ id: 3, label: "CHANGE PASSWORD", tab: "password", type: "button" },
		{ id: 4, label: "DELETE ACCOUNT", tab: "delete", type: "button" },
		{ id: 5, label: "PUBLIC PROFILE", tab: "profile", type: "link" },
	];

	const handleMenuClick = (tab: Tab) => {
		// setShowMenu(false);
		if (tab !== "profile") {
			setTab(tab);
		} else {
			if (user) {
				navigate(`/users/${user.username}`);
			}
		}
	};

	if (!user) {
		return <LoadAuth />;
	}

	return (
		<>
			<title>{`PROFILE | ${import.meta.env.VITE_APP_NAME}`}</title>

			<ContentBase className="py-8 space-y-8 min-h-[calc(100dvh-96px)] px-4">
				<div className="p-3 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
					<h1 className="text-xl font-bold flex-1">
						<FontAwesomeIcon icon="caret-right" /> User Profile
					</h1>
					<p className="text-sm font-medium my-1">
						View and manage your profile information.
					</p>
					<div className="mt-5">
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
						<div className="md:flex mt-2 bg-gray-800 text-white rounded min-h-100">
							{/* <div
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
									<Link
										to={`/users/${user?.username}`}
										className="block py-1.5 px-3 text-left text-sm w-full font-semibold bg-gray-600/90 hover:bg-gray-500/90 cursor-pointer"
									>
										PROFILE PAGE
										<FontAwesomeIcon
											icon="external-link"
											size="sm"
											className="ms-2"
										/>
									</Link>
								</div>
							)}
						</div> */}
							<div className="block md:hidden border-b border-gray-300 px-3 py-1.5">
								<MenuBar<Tab>
									activeTab={tab}
									tabs={tabs}
									onClick={handleMenuClick}
									isLoading={isLoading}
									className="text-white"
								/>
							</div>

							<div className="flex-none hidden md:flex flex-col p-4 lg:p-5 text-white space-y-1.5 font-semibold text-sm border border-gray-600 min-w-50 lg:min-w-60">
								{tabs.map((t) => (
									<button
										key={t.id}
										className={`border border-gray-500 py-2 px-3 text-left font-semibold ${
											tab == t.tab
												? "text-amber-400"
												: "bg-gray-600 hover:bg-gray-500 cursor-pointer"
										}`}
										onClick={() => handleMenuClick(t.tab)}
										disabled={isLoading || tab == t.tab}
									>
										{t.label}
										{t.type == "link" && (
											<FontAwesomeIcon
												icon="external-link"
												size="sm"
												className="ms-2"
											/>
										)}
									</button>
								))}
								{/* <hr className="mt-2 mb-3.5 border-gray-400" /> */}
							</div>

							<div className="flex-1 p-4 lg:p-5">
								{tab == "edit" && <EditInfo />}
								{tab == "password" &&
									(user.social_user ? (
										<p>Not available for social login users.</p>
									) : (
										<ChangePassword />
									))}

								{tab == "delete" && <DeleteAccount />}
							</div>
						</div>
					</div>
				</div>

				<EndOfPage />
			</ContentBase>
		</>
	);
};

export default ProfilePage;
