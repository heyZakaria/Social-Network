export async function FetchData(url, mthd = "GET", bodyObj = {}) {
    try {
        const HeaderData =  {
            credentials: "include",
            method: mthd,
        };
        if (mthd !== "GET" && bodyObj && Object.keys(bodyObj).length > 0) {
            HeaderData.body = JSON.stringify(bodyObj);
            HeaderData.headers = {
                "Content-Type": "application/json",
            };
        }
        const res = await fetch(url, HeaderData);
        const data = await res.json();
       
        return data
    } catch (error) {
        // TODO Handle Error
        console.error("Error loading posts:", error);
    }
};
