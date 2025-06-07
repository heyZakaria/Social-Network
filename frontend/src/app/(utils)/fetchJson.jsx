export async function FetchData(url, mthd = "GET") {
    try {
        const res = await fetch(url, {
            credentials: "include",
            method: mthd,
        }
        );

        if (!res.ok) {
            // TODO Handle Error of Unothorized
            throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        return data
    } catch (error) {
        // TODO Handle Error
        console.error("Error loading posts:", error);
    }
};
