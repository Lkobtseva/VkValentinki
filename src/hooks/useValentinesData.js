import { useEffect, useState } from "react";

const useValentinesData = (baseUrl) => {
    const [valentines, setValentines] = useState([]);
    const [backgrounds, setBackgrounds] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = 'https://valentine.itc-hub.ru';
                const response = await fetch(`${baseUrl}/getvalentines`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                const valentinesWithFullPaths = data.valentines.map((valentine) => ({
                    ...valentine,
                    image: `${url}${valentine.image}`,
                    icon_valentine: `${url}${valentine.icon_valentine}`,

                }));

                const backgroundsWithFullPaths = data.backgrounds.map((background) => ({
                    ...background,
                    image_background: `${url}${background.image_background}`,
                    icon_background: `${url}${background.icon_background}`,

                }));
                setValentines(valentinesWithFullPaths);
                setBackgrounds(backgroundsWithFullPaths);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [baseUrl]);

    return { valentines, backgrounds };
};

export default useValentinesData;
