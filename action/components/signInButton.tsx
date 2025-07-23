export default function SignInButton() {
    const signInWithGoogle = async () => {
        const authData = await chrome.runtime.sendMessage({ type: "sign-in", loginHint: "t324076@m.chukyo-u.ac.jp" });
        console.log("Auth Data:", JSON.stringify(authData, null, 2));
    };

    return (
        <>
            <button
                onClick={signInWithGoogle}
                className="bg-white text-gray-600 mx-auto px-4 py-2 rounded-md flex items-center cursor-pointer text-center border-2"
            >
                Sign In with Google
            </button>
        </>
    );
}
