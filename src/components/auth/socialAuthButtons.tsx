// src/components/SocialAuthButtons.tsx

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/auth/AuthProvider";
import CustomButton from "../customButton";

const SocialAuthButtons = () => {
	const { socialSignin, isLoading } = useAuth();
	return (
		<div className="mt-8">
			<hr className="mt-4 mb-2 border-gray-400" />

			<div className="flex items-center justify-center -mt-5.5">
				<p className="text-center text-gray-400 font-semibold bg-white px-2">
					or use socials to login
				</p>
			</div>

			<div className="mt-5 flex justify-center gap-x-2">
				<CustomButton
					color="red"
					size="lg"
					disabled={isLoading}
					onClick={() => socialSignin("google")}
					className="space-x-2 w-full"
				>
					<FontAwesomeIcon icon={["fab", "google"]} />
					<span className="text-sm">GOOGLE</span>
				</CustomButton>
				<CustomButton
					color="blue"
					size="lg"
					disabled={isLoading}
					onClick={() => socialSignin("facebook")}
					className="space-x-2 w-full"
				>
					<FontAwesomeIcon icon={["fab", "facebook-f"]} />
					<span className="text-sm">FACEBOOK</span>
				</CustomButton>
			</div>
		</div>
	);
};

export default SocialAuthButtons;
