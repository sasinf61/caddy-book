(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/caddy-booking-app/src/app/register/verify/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VerifyEmailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/caddy-booking-app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/caddy-booking-app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/caddy-booking-app/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/caddy-booking-app/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// (We must wrap the component that uses 'useSearchParams' in Suspense)
// Create the main component (the logic)
function VerifyAndCompleteForm() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    // State for the form
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(''); // Optional phone
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Verifying token...');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isTokenValid, setIsTokenValid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // useEffect: Verify the token *on load*
    // (We must check if the token is valid *before* showing the password form)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VerifyAndCompleteForm.useEffect": ()=>{
            const tokenFromParams = searchParams.get('token');
            if (!tokenFromParams) {
                setError('Invalid link. No token provided.');
                setIsLoading(false);
                return;
            }
            setToken(tokenFromParams);
            const verifyToken = {
                "VerifyAndCompleteForm.useEffect.verifyToken": async ()=>{
                    // (SIMPLIFIED: Assume token is valid if it exists)
                    // (We will validate it server-side when they submit the form)
                    setIsTokenValid(true);
                    setIsLoading(false);
                    setMessage('Token verified. Please set your password.');
                }
            }["VerifyAndCompleteForm.useEffect.verifyToken"];
            verifyToken();
        }
    }["VerifyAndCompleteForm.useEffect"], [
        searchParams
    ]);
    // handleSubmit function (calls the *new* API)
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3001/api/auth/register/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    token,
                    password,
                    phone
                })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Registration complete! Redirecting to homepage...');
                setTimeout(()=>{
                    router.push('/');
                }, 3000);
            } else {
                setError(data.message || 'Failed to complete registration.');
                setIsLoading(false);
            }
        } catch (error) {
            setError('Could not connect to server.');
            setIsLoading(false);
        }
    };
    // Render Logic (Glassmorphism theme)
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "flex items-center justify-center min-h-screen p-4 bg-gray-900",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-2xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-white mb-6 text-center",
                    children: "Complete Registration"
                }, void 0, false, {
                    fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, this),
                isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center text-gray-300",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
                    lineNumber: 88,
                    columnNumber: 23
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center text-red-400",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
                    lineNumber: 89,
                    columnNumber: 19
                }, this),
                message && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center text-green-400",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
                    lineNumber: 90,
                    columnNumber: 31
                }, this),
                isTokenValid && !message?.includes('complete') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-6 mt-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "password",
                                value: password,
                                onChange: (e)=>setPassword(e.target.value),
                                required: true,
                                className: "input-field w-full px-4 py-3 text-white bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                placeholder: "Create Password"
                            }, void 0, false, {
                                fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
                                lineNumber: 96,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
                            lineNumber: 95,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "password",
                                value: confirmPassword,
                                onChange: (e)=>setConfirmPassword(e.target.value),
                                required: true,
                                className: "input-field w-full px-4 py-3 text-white bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                placeholder: "Confirm Password"
                            }, void 0, false, {
                                fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
                                lineNumber: 102,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "tel",
                                value: phone,
                                onChange: (e)=>setPhone(e.target.value),
                                className: "input-field w-full px-4 py-3 text-white bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                placeholder: "เบอร์โทรศัพท์ (ถ้าต้องการเปลี่ยน)"
                            }, void 0, false, {
                                fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
                                lineNumber: 108,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
                            lineNumber: 107,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: isLoading,
                            className: "w-full py-3 px-4 font-semibold text-gray-900 bg-white rounded-lg hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50",
                            children: isLoading ? "Saving..." : "Set Password & Finish"
                        }, void 0, false, {
                            fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
                            lineNumber: 113,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
                    lineNumber: 93,
                    columnNumber: 11
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/login",
                    className: "inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700",
                    children: "Go to Login"
                }, void 0, false, {
                    fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
                    lineNumber: 121,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
            lineNumber: 84,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_s(VerifyAndCompleteForm, "6GxKlJsJpBWxGYCCiivvFa66d1Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = VerifyAndCompleteForm;
function VerifyEmailPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen bg-gray-900 text-white",
            children: "Loading Verification..."
        }, void 0, false, {
            fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
            lineNumber: 133,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$caddy$2d$booking$2d$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VerifyAndCompleteForm, {}, void 0, false, {
            fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
            lineNumber: 134,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/caddy-booking-app/src/app/register/verify/page.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
_c1 = VerifyEmailPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "VerifyAndCompleteForm");
__turbopack_context__.k.register(_c1, "VerifyEmailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=caddy-booking-app_src_app_register_verify_page_tsx_6e1cd8a7._.js.map