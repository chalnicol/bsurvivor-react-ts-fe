import { useAuth } from "../../context/auth/AuthProvider";
import AuthFormBase from "../authFormBase";

const EmailVerificationNotice = () => {
	const { isLoading, error, success, sendVerificationEmail } = useAuth();

	return (
		<AuthFormBase>
			<div className="border border-gray-400 bg-white p-8 pt-6 rounded shadow-md m-auto w-full max-w-md text-center">
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

				{success && (
					<p className="my-4 text-green-600 text-sm">{success}</p>
				)}
				{error && <p className="my-4 text-red-600 text-sm">{error}</p>}
			</div>
		</AuthFormBase>
	);
};

export default EmailVerificationNotice;
