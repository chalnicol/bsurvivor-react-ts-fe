import { useState } from "react";
import BreadCrumbs from "../../../components/breadCrumbs";

const CreateTeam = () => {
	const [logo, setLogo] = useState<string>("");
	const [fileLogo, setFileLogo] = useState<File | null>(null);
	const [abbr, setAbbr] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [league, setLeague] = useState<number>(0);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null;
		if (file) {
			setFileLogo(file);
		} else {
			setFileLogo(null);
		}
	};
	return (
		<div className="py-7 min-h-[calc(100dvh-57px)]">
			<div className="p-4 md:p-6 rounded-lg shadow border border-gray-400">
				<BreadCrumbs />
				<h1 className="text-lg font-bold mb-4">Create Team</h1>

				<div className="max-w-lg">
					<form className="space-y-2 text-sm">
						<div>
							<label htmlFor="league" className="text-xs">
								Select League
							</label>
							<select
								id="league"
								value={league}
								onChange={(e) => setLeague(Number(e.target.value))}
								className="w-full px-3 py-1.5 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								required
							>
								<option value={0}>Select a league</option>
								<option value={1}>NBA</option>
								<option value={2}>PBA</option>
								{/* Add more leagues as needed */}
							</select>
						</div>
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
						</div>

						<div>
							<label htmlFor="file" className="text-xs">
								Logo (Upload image or provide URL)
							</label>

							<input
								type="text"
								id="challengeName"
								value={logo}
								onChange={(e) => setLogo(e.target.value)}
								className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter logo URL"
							/>
							<input
								type="file"
								id="file"
								onChange={handleFileChange}
								className="w-full mt-2 block px-2 py-1.5 rounded border border-gray-300 shadow-sm text-sm text-stone-500 cursor-pointer file:mr-5 file:py-1.5 file:px-4 file:border file:border-stone-400 file:rounded file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700"
							/>
						</div>

						<button
							type="submit"
							className="mt-4 bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition duration-200 cursor-pointer"
						>
							CREATE TEAM
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateTeam;
