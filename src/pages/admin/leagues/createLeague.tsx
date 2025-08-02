import { useState } from "react";
import BreadCrumbs from "../../../components/breadCrumbs";
import apiClient from "../../../utils/axiosConfig";
import Loader from "../../../components/loader";
import StatusMessage from "../../../components/statusMessage";
import ErrorDisplay from "../../../components/errorDisplay";
import ContentBase from "../../../components/ContentBase";

const CreateLeague = () => {
	const [logoUrl, setLogoUrl] = useState<string>("");
	const [fileLogo, setFileLogo] = useState<File | null>(null);
	const [abbr, setAbbr] = useState<string>("");
	const [name, setName] = useState<string>("");

	const [isLogoFile, setIsLogoFile] = useState<boolean>(false);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({}); // To hold validation errors

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null;
		if (file) {
			setFileLogo(file);
		} else {
			setFileLogo(null);
		}
		console.log("file", file);
	};

	const handleFileInputType = () => {
		setIsLogoFile((prev) => !prev);
		setLogoUrl("");
		setFileLogo(null);
	};

	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLogoUrl(e.target.value);
		setFileLogo(null);
	};

	const resetForms = () => {
		setLogoUrl("");
		setFileLogo(null);
		setAbbr("");
		setName("");
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData();

		formData.append("name", name);
		formData.append("abbr", abbr);
		if (fileLogo !== null) {
			formData.append("logo", fileLogo);
			console.log(fileLogo);
		} else {
			formData.append("logo_url", logoUrl);
		}
		console.log(formData);

		setIsLoading(true);
		setError(null);
		setSuccess(null);
		try {
			const response = await apiClient.post("/admin/leagues", formData);
			setSuccess(response.data.message || "League created successfully.");
			resetForms();
		} catch (error: any) {
			if (error.type === "validation") {
				setFieldErrors(error.errors);
				// setError(error.message); // Often 'The given data was invalid.'
			} else if (
				error.type === "server" ||
				error.type === "general" ||
				error.type === "network" ||
				error.type === "client"
			) {
				setError(error.message);
			} else {
				// Fallback for any other unexpected error type
				setError("An unknown error occurred.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ContentBase className="py-7 px-4">
			<div className="p-4 md:p-6 rounded-lg shadow border border-gray-400">
				<BreadCrumbs />
				<h1 className="text-lg font-bold mb-4">Create League</h1>

				<div className="max-w-lg">
					{success && (
						<StatusMessage
							type="success"
							message={success}
							onClose={() => setSuccess(null)}
						/>
					)}
					{error && (
						<StatusMessage
							type="error"
							message={error}
							onClose={() => setError(null)}
						/>
					)}
					<form className="space-y-2 text-sm" onSubmit={handleSubmit}>
						<div>
							<label htmlFor="fullName" className="text-xs">
								Name
							</label>
							<input
								type="text"
								id="fullName"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter league's full name"
								required
							/>
							{fieldErrors.name && (
								<ErrorDisplay errors={fieldErrors.name} />
							)}
						</div>
						<div>
							<label htmlFor="abbr" className="text-xs">
								Abbreviation
							</label>
							<input
								type="text"
								id="abbr"
								value={abbr}
								onChange={(e) => setAbbr(e.target.value)}
								className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter league's abbreviation"
								required
							/>
							{fieldErrors.abbr && (
								<ErrorDisplay errors={fieldErrors.abbr} />
							)}
						</div>

						<div>
							<label htmlFor="file" className="text-xs">
								Logo (Upload image or provide URL)
							</label>

							{isLogoFile ? (
								<>
									<input
										key="fileinput"
										type="file"
										id="file"
										onChange={handleFileChange}
										className="w-full mt-2 block px-2 py-1.5 rounded border border-gray-300 shadow-sm text-sm text-stone-500 cursor-pointer file:mr-5 file:py-1.5 file:px-4 file:border file:border-stone-400 file:rounded file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700"
									/>
									{fieldErrors.logo && (
										<ErrorDisplay errors={fieldErrors.logo} />
									)}
								</>
							) : (
								<>
									<input
										key="urlinput"
										type="text"
										id="url"
										value={logoUrl}
										onChange={handleUrlChange}
										className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
										placeholder="Enter logo URL"
									/>
									{fieldErrors.logo_url && (
										<ErrorDisplay errors={fieldErrors.logo_url} />
									)}
								</>
							)}
							<button
								type="button"
								className="text-sm cursor-pointer text-cyan-600 hover:text-cyan-500 mt-1 text-xs"
								onClick={handleFileInputType}
							>
								{isLogoFile ? "I have a link" : "I have a file"}
							</button>
						</div>

						<button
							type="submit"
							className="mt-2 bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition duration-200 cursor-pointer"
						>
							CREATE LEAGUE
						</button>
					</form>
				</div>
			</div>
			{isLoading && <Loader />}
		</ContentBase>
	);
};

export default CreateLeague;
