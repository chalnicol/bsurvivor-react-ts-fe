import ProfileInformation from "../../components/profile/profileInformation";
import ChangePassword from "../../components/profile/changePassword";
import DeleteAccount from "../../components/profile/deleteAccount";

const ProfilePage = () => {
	return (
		<div className="py-10 space-y-8 min-h-[calc(100dvh-96px)] p-4">
			{/* profile */}
			<ProfileInformation />
			{/* change password */}
			<ChangePassword />
			{/* delete account */}
			<DeleteAccount />
		</div>
	);
};

export default ProfilePage;
