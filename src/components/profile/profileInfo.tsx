import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/auth/AuthProvider";

const ProfileInfo = () => {
	const { user } = useAuth();

	if (!user) {
		return null;
	}
	return (
		<div className="sm:flex gap-x-3 space-y-2 sm:space-y-0">
			<div className="flex-none">
				<div className="w-18 mx-auto aspect-square border-2 border-gray-400 text-gray-400 rounded-full shadow-lg overflow-hidden flex items-center justify-center">
					<FontAwesomeIcon icon="user" size="2xl" />
				</div>
			</div>
			<div className="flex-1 space-y-2">
				<div>
					<p className="font-semibold text-sm border-b py-1">Full Name</p>
					<p className="mt-2 w-full px-3 py-1.5 rounded bg-gray-600 rounded-md">
						{user.fullname}
					</p>
				</div>
				<div>
					<p className="font-semibold text-sm border-b py-1">Username</p>
					<p className="mt-2 w-full px-3 py-1.5 rounded bg-gray-600 rounded-md">
						{user.username}
					</p>
				</div>
				<div>
					<p className="font-semibold text-sm border-b py-1">
						E-mail{" "}
						<span className="ms-1 text-gray-400 text-xs">
							(Not shown in public)
						</span>
					</p>
					<p className="mt-2 w-full px-3 py-1.5 rounded bg-gray-600 rounded-md">
						{user.email}
					</p>
				</div>
				<div className="space-x-2 mt-6 text-sm">
					<Link
						to={`/users/${user.username}`}
						className={`inline-block w-full sm:w-auto text-white font-bold py-2 bg-gray-600 hover:bg-gray-500 cursor-pointer px-4 min-w-30 rounded transition duration-200`}
					>
						VIEW PUBLIC PROFILE PAGE
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ProfileInfo;
