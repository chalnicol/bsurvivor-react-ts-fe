// import { useState } from "react";
import Navbar from "./components/navbar";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import ForgotPassword from "./components/auth/forgotPassword";
import ResetPassword from "./components/auth/resetPassword";
import ProtectedRoute from "./components/protectedRoute";
import PublicOnlyRoute from "./components/publicOnlyRoute";
import Unauthorized from "./components/unauthorized";
import PageNotFound from "./components/pageNotFound";
import AdminDashboard from "./pages/admin/adminDashboard";
import About from "./pages/about";
import NBAPage from "./pages/leagues/nba";
import PBAPage from "./pages/leagues/pba";
import ProfilePage from "./pages/user/profile";
import ListBracketChallenges from "./pages/admin/bracketChallengers/listBracketChallenges";
import CreateBracketChallenge from "./pages/admin/bracketChallengers/createBracketChallenge";
import EditBracketChallenge from "./pages/admin/bracketChallengers/editBracketChallenge";
import ViewBracketChallenge from "./pages/admin/bracketChallengers/viewBracketChallenge";
import ListLeagues from "./pages/admin/leagues/listLeagues";
import CreateLeague from "./pages/admin/leagues/createLeague";
import ViewLeague from "./pages/admin/leagues/viewLeague";
import ListTeams from "./pages/admin/teams/listTeams";
import CreateTeam from "./pages/admin/teams/createTeam";
import ViewTeam from "./pages/admin/teams/viewTeam";
import ListUsers from "./pages/admin/users/listUsers";
import ViewUser from "./pages/admin/users/viewUser";
import BracketEntriesList from "./pages/user/bracketEntriesList";
import EdiLeague from "./pages/admin/leagues/editLeague";
import EditTeam from "./pages/admin/teams/editTeam";
import BracketChallengePage from "./pages/bracketChallengePage";
import HomePage from "./pages/homePage";
import Footer from "./components/footer";
import TermsOfServicePage from "./pages/termsOfService";
import PrivacyPolicyPage from "./pages/privacyPolicy";
import ListBracketChallengeEntries from "./pages/admin/bracketChallengeEntries/listBracketChallengeEntries";
import ViewBracketChallengeEntry from "./pages/admin/bracketChallengeEntries/viewBracketChallengeEntry";

import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/scrollToTop";

// Import the library
import { library } from "@fortawesome/fontawesome-svg-core";

import {
	faCoffee,
	faCheckSquare,
	faGear,
	faCaretDown,
	faCircleInfo,
	faBasketball,
	faBars,
	faXmark,
	faCaretUp,
	faUser,
	faPlus,
	faCircleCheck,
	faXmarkCircle,
	faLock,
	faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import BracketChallengeEntryPage from "./pages/bracketChallengeEntryPage";

// import { fab } from "@fortawesome/free-brands-svg-icons"; // For all brand icons

// Add the imported icons/styles to the library
library.add(
	faCoffee,
	faCheckSquare,
	faGear,
	faCaretDown,
	faCaretUp,
	faCircleInfo,
	faBasketball,
	faBars,
	faXmark,
	faUser,
	faPlus,
	faCircleCheck,
	faXmarkCircle,
	faLock,
	faCaretRight
);

function App() {
	return (
		<>
			<Navbar />
			<div className="w-full bg-gray-200">
				<div className="max-w-7xl mx-auto">
					<ScrollToTop />
					<Routes>
						{/* Define your routes inside Routes */}
						<Route path="/" element={<HomePage />} />
						<Route path="/about" element={<About />} />
						<Route path="/nba" element={<NBAPage />} />
						<Route path="/pba" element={<PBAPage />} />
						<Route
							path="/bracket-challenges/:slug"
							element={<BracketChallengePage />}
						/>
						<Route
							path="/bracket-challenge-entries/:slug"
							element={<BracketChallengeEntryPage />}
						/>
						<Route
							path="/terms-of-service"
							element={<TermsOfServicePage />}
						/>
						<Route
							path="/privacy-policy"
							element={<PrivacyPolicyPage />}
						/>
						<Route path="/unauthorized" element={<Unauthorized />} />

						<Route path="/register" element={<Register />} />
						<Route path="/login" element={<Login />} />

						{/* Public routes */}
						<Route element={<PublicOnlyRoute />}>
							<Route
								path="/forgot-password"
								element={<ForgotPassword />}
							/>
							<Route
								path="/reset-password"
								element={<ResetPassword />}
							/>
						</Route>

						{/* Optional: A "Not Found" route */}
						<Route path="*" element={<PageNotFound />} />
						<Route element={<ProtectedRoute />}>
							<Route path="/profile" element={<ProfilePage />} />
							<Route path="/entries" element={<BracketEntriesList />} />

							<Route element={<ProtectedRoute requiredRoles="admin" />}>
								<Route path="/admin" element={<AdminDashboard />} />

								{/* bracket challenge entries routes */}
								<Route
									path="/admin/bracket-challenge-entries/"
									element={<ListBracketChallengeEntries />}
								/>
								<Route
									path="/admin/bracket-challenge-entries/:id"
									element={<ViewBracketChallengeEntry />}
								/>

								{/* bracket challenge routes */}
								<Route
									path="/admin/bracket-challenges/"
									element={<ListBracketChallenges />}
								/>
								<Route
									path="/admin/bracket-challenges/:id"
									element={<ViewBracketChallenge />}
								/>
								<Route
									path="/admin/bracket-challenges/create"
									element={<CreateBracketChallenge />}
								/>
								<Route
									path="/admin/bracket-challenges/:id/edit"
									element={<EditBracketChallenge />}
								/>

								{/* league routes */}
								<Route
									path="/admin/leagues/"
									element={<ListLeagues />}
								/>
								<Route
									path="/admin/leagues/create"
									element={<CreateLeague />}
								/>
								<Route
									path="/admin/leagues/:id"
									element={<ViewLeague />}
								/>
								<Route
									path="/admin/leagues/:id/edit"
									element={<EdiLeague />}
								/>

								{/* team routes */}
								<Route path="/admin/teams/" element={<ListTeams />} />
								<Route path="/admin/teams/:id" element={<ViewTeam />} />
								<Route
									path="/admin/teams/:id/edit"
									element={<EditTeam />}
								/>
								<Route
									path="/admin/teams/create"
									element={<CreateTeam />}
								/>

								{/* users routes */}
								<Route path="/admin/users/" element={<ListUsers />} />
								<Route path="/admin/users/:id" element={<ViewUser />} />
							</Route>

							{/* <Route element={<ProtectedRoute requiredPermissions="delete_users" />}>
									<Route path="/user-delete-tool" element={<UserDeleteToolPage />} />
							</Route> */}

							{/* Add other routes that require authentication here */}
						</Route>
					</Routes>
				</div>
			</div>
			<Footer />
		</>
	);
}

export default App;
