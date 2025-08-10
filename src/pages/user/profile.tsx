import ProfileInformation from "../../components/profile/profileInformation";
import ChangePassword from "../../components/profile/changePassword";
import DeleteAccount from "../../components/profile/deleteAccount";
import ContentBase from "../../components/contentBase";

const ProfilePage = () => {
	return (
		<ContentBase className="py-10 space-y-8 min-h-[calc(100dvh-96px)] px-4">
			{/* profile */}
			<ProfileInformation />
			{/* change password */}
			<ChangePassword />
			{/* delete account */}
			<DeleteAccount />
		</ContentBase>
	);
};

export default ProfilePage;
