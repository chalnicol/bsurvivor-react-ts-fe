// import { useState } from "react";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import ProfilePage from "./pages/user/profile";

import Register from "./components/auth/register";
import Login from "./components/auth/login";
import ForgotPassword from "./components/auth/forgotPassword";
import ResetPassword from "./components/auth/resetPassword";

import About from "./pages/about";
import NBAPage from "./pages/leagues/nba";
import PBAPage from "./pages/leagues/pba";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

import { Routes, Route } from "react-router-dom";

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
} from "@fortawesome/free-solid-svg-icons";
import BracketEntries from "./pages/user/bracketEntries";
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
	faXmark
);

function App() {
	return (
		<>
			<Navbar />
			<div className="w-full bg-gray-50">
				<div className="max-w-7xl mx-auto px-4">
					<Routes>
						{/* Define your routes inside Routes */}
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/nba" element={<NBAPage />} />
						<Route path="/pba" element={<PBAPage />} />

						<Route element={<PublicOnlyRoute />}>
							<Route path="/register" element={<Register />} />
							<Route path="/login" element={<Login />} />
							<Route
								path="/forgot-password"
								element={<ForgotPassword />}
							/>
							<Route
								path="/reset-password"
								element={<ResetPassword />}
							/>
						</Route>

						{/* <Route path="/contact" element={<Contact />} /> */}
						{/* Optional: A "Not Found" route */}
						<Route path="*" element={<h2>404 - Not Found</h2>} />

						<Route element={<ProtectedRoute />}>
							<Route path="/profile" element={<ProfilePage />} />
							<Route path="/entries" element={<BracketEntries />} />

							{/* <Route path="/dashboard" element={<Dashboard />} /> */}
							{/* Add other routes that require authentication here */}
							{/* Example: <Route path="/leagues" element={<LeaguesPage />} /> */}
						</Route>
					</Routes>
				</div>
			</div>
		</>
	);
}

export default App;
