import { useEffect, useState } from "react";

function useAuthString() {
    const [authInfo, setAuthInfo] = useState({
        signature: null,
        authString: null,
    });

    useEffect(() => {
        const configString = window.location.href;
        const url = new URL(configString);
        const params = url.searchParams;
        const signature = params.get("sign");

        function getAuthString() {
            const VK_PREFIX = "vk_";
            const url = new URL(window.location.href);
            const params = url.searchParams;

            const authString = params
                .toString()
                .split("&")
                .filter((p) => p.startsWith(VK_PREFIX))
                .sort()
                .join("&");

            return authString;
        }

        const authString = getAuthString();

        setAuthInfo({ signature, authString });
    }, []);

    return authInfo;
}

export default useAuthString;
