import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import { AuthProvider } from "./context/auth/AuthProvider.tsx";
import { AdminProvider } from "./context/admin/AdminProvider.tsx";
import "./utils/axiosConfig.ts"; // <--- IMPORT YOUR AXIOS CONFIG HERE

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<AdminProvider>
					<App />
				</AdminProvider>
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>
);
