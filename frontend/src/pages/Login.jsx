import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { Sun, Moon, Eye, EyeOff } from "lucide-react";
import api from "../utils/api";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from;
    const lastPage = localStorage.getItem("lastPage");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const isElectron =
        typeof navigator !== "undefined" &&
        navigator.userAgent.toLowerCase().includes("electron");
    const isNative = Capacitor.isNativePlatform() || isElectron;

    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme) return savedTheme;

        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDark ? "dark" : "light";
    });

    /* ================= Theme Toggle ================= */

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        const hidePassword = () => {
            setShowPassword(false);
        };

        document.addEventListener("click", hidePassword);

        return () => {
            document.removeEventListener("click", hidePassword);
        };
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };
    const loginWithGoogleNative = async () => {

        const platform = isElectron ? "electron" : "android";
        const url = `${import.meta.env.VITE_BACKEND}/api/auth/google-redirect?platform=${platform}`;

        if (isElectron) {
            window.location.href = url;
        } else {
            await Browser.open({ url });
        }

    };

    /* ================= Login ================= */

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post(
                "/api/auth/login",
                { email, password }
            );

            const { token, role } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            if (from) {
                navigate(from.pathname + (from.search || ""), { replace: true });
                return;
            }

            if (lastPage) {
                navigate(lastPage, { replace: true });
                return;
            }

            if (role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            } else if (role === "faculty") {
                navigate("/faculty/dashboard", { replace: true });
            } else if (role === "student") {
                navigate("/student/dashboard", { replace: true });
            }

        }catch (err) {
        if (!err.response) {
            setError("Server unreachable. Please check your connection.");
        } else {
            setError("Invalid email or password");
        }
    }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const response = await api.post("/api/auth/google", {
                credential: credentialResponse.credential
            });

            const { token, role } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            if (from) {
                navigate(from.pathname + (from.search || ""), { replace: true });
                return;
            }

            if (lastPage) {
                navigate(lastPage, { replace: true });
                return;
            }

            if (role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            } else if (role === "faculty") {
                navigate("/faculty/dashboard", { replace: true });
            } else if (role === "student") {
                navigate("/student/dashboard", { replace: true });
            }

        }catch (err) {
        if (!err.response) {
            setError("Server unreachable. Please check your connection.");
        } else {
            setError("Google login failed");
        }
    }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4 sm:px-6">

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="absolute top-5 right-5 p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title="Toggle theme"
            >
                {theme === "dark" ? (
                    <Sun
                        size={20}
                        className="text-gray-300 transition-transform duration-300 group-hover:rotate-12"
                    />
                ) : (
                    <Moon
                        size={20}
                        className="text-gray-700 transition-transform duration-300 group-hover:-rotate-12"
                    />
                )}
            </button>

            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-sm transition-colors duration-300">

                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                    College Login
                </h1>

                {error && (
                    <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">

                    <div>
                        <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 outline-none transition"
                            placeholder="admin@college.com"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm text-gray-600 dark:text-gray-300">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 pr-10 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 outline-none transition"
                                placeholder="Enter password"
                            />

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPassword(!showPassword);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-black dark:hover:bg-gray-600 transition disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>

                </form>
                <div className="mt-6 flex justify-center">
                    {isNative ? (
                        <button
                            onClick={() => {
                                setGoogleLoading(true);
                                loginWithGoogleNative();
                            }}
                            disabled={googleLoading}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition disabled:opacity-60"
                        >
                            {googleLoading ? "Signing you in..." : "Sign in with Google"}
                        </button>
                    ) : (
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => setError("Google login failed")}
                            theme={theme === "dark" ? "filled_black" : "outline"}
                            shape="pill"
                        />
                    )}
                </div>

            </div>

        </div>
    );
};

export default Login;