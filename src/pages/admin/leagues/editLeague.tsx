import React, { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCsrfToken, apiClient } from "../../../utils/api"; // <--- Import axiosInstance and getCsrfToken
import BreadCrumbs from "../../../components/breadCrumbs";
import { type LeagueInfo } from "../../../data/adminData";

const EditLeague = () => {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();

	const [league, setLeague] = useState<LeagueInfo | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [validationErrors, setValidationErrors] = useState<
		Record<string, string[]>
	>({});
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const [isLogoFile, setIsLogoFile] = useState<boolean>(false);
	const [logo, setLogo] = useState<string>("");
	const [fileLogo, setFileLogo] = useState<File | null>(null);
	const [abbr, setAbbr] = useState<string>("");
	const [name, setName] = useState<string>("");

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null;
		if (file) {
			setFileLogo(file);
		} else {
			setFileLogo(null);
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
	};

	return (
		<div className="py-7 min-h-[calc(100dvh-57px)]">
			<div className="p-4 md:p-6 rounded-lg shadow border border-gray-400">
				<BreadCrumbs />
				<h1 className="text-lg font-bold mb-4">Edit League</h1>

				<div className="max-w-lg">
					<form className="space-y-2 text-sm" onSubmit={handleSubmit}>
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
						</div>
						<div>
							<label htmlFor="fullName" className="text-xs">
								Full Name
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
						</div>
						<div>
							<label htmlFor="file" className="text-xs">
								Logo
							</label>

							{isLogoFile ? (
								<input
									type="file"
									id="file"
									onChange={handleFileChange}
									className="w-full mt-1 block px-2 py-1.5 rounded border border-gray-300 shadow-sm text-sm text-stone-500 cursor-pointer file:mr-5 file:py-1.5 file:px-4 file:border file:border-stone-400 file:rounded file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700"
								/>
							) : (
								<input
									type="text"
									id="challengeName"
									value={logo}
									onChange={(e) => setLogo(e.target.value)}
									className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									placeholder="Enter logo URL"
									required
								/>
							)}
							<button
								type="button"
								className="text-xs text-amber-700 cursor-pointer ps-1 mt-2 rounded selection-none"
								onClick={() => setIsLogoFile((prev) => !prev)}
							>
								{isLogoFile
									? "Click here to enter URL"
									: "Click here to upload an image"}
							</button>
						</div>

						<button
							type="submit"
							className="mt-4 bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition duration-200 cursor-pointer"
						>
							CREATE LEAGUE
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditLeague;
