import ContentBase from "../contentBase";
import { useAuth } from "../../context/auth/AuthProvider";

const EmailVerificationNotice = () => {
	const { isLoading, error, message, sendVerificationEmail } = useAuth();

	return (
		<ContentBase className="flex items-center justify-center p-4">
			<div className="border border-gray-400 bg-white p-8 pt-6 rounded shadow-md w-full max-w-md text-center">
				<h1 className="text-2xl font-bold mb-1">Email Verification</h1>
				<p>
					A verification link has been sent to your email address. Please
					click the link to confirm your account{" "}
				</p>

				<hr className="my-4 border-gray-300" />

				<p>Didn't receive the email?</p>
				<button
					className="text-white bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded mt-2 font-semibold w-full cursor-pointer"
					onClick={sendVerificationEmail}
					disabled={isLoading}
				>
					CLICK HERE TO RESEND VERIFICATION LINK
				</button>

				{message && <p className="my-3 text-green-500">{message}</p>}
				{error && <p className="my-3 text-red-500">{error}</p>}
			</div>
		</ContentBase>
	);
};

export default EmailVerificationNotice;
