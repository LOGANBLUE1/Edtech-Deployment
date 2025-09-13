import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import IconBtn from "../../../Common/IconBtn";
import { apiConnector } from "../../../../services/apiConnector";

export default function HitAPI() {
    const BASE_URL = process.env?.REACT_APP_BASE_URL;
    const { token } = useSelector((state) => state.auth);
    const methods = ["GET", "POST", "PUT", "DELETE"];
    const [method, setMethod] = useState("GET");
    const [url, setUrl] = useState("");
    const [queryParams, setQueryParams] = useState([{ key: "", value: "" }]);
    const [bodyData, setBodyData] = useState([{ key: "", value: "" }]);
    const [response, setResponse] = useState(null);

    const apiUrls = [
        { name: "DELETE_PROFILE_PERMANENTLY_API", url: BASE_URL + "/admin/deleteUserPermanently" },
        { name: "CREATE_CATEGORY_API", url: BASE_URL + "/admin/createCategory" },
        { name: "GET_ALL_USER_EMAILS", url: BASE_URL + "/admin/users" },
    ];

    const convertToObject = (arr) => {
        return arr.reduce((acc, { key, value }) => {
            if (key) acc[key] = value;
            return acc;
        }, {});
    };

    const buildUrlWithQueryParams = (baseUrl, params) => {
        const queryString = new URLSearchParams(convertToObject(params)).toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    };

    async function execute() {
        if (!url) {
            toast.error("Please enter or select a URL.");
            return;
        }

        const finalUrl = buildUrlWithQueryParams(url, queryParams);

        try {
            const res = await apiConnector(
                method,
                finalUrl,
                method === "GET" || method === "DELETE" ? null : convertToObject(bodyData),
                { Authorization: `Bearer ${token}` },
                queryParams.length ? convertToObject(queryParams) : null
            );

            if (res) {
                console.log("Response:", res);
                setResponse(res);
                res.success ? toast.success(res.message) : toast.error(res.message);
            }
        } catch (error) {
            toast.error("API call failed!");
        }
    }

    return (
        <div className="flex flex-col gap-4 rounded-md border border-richblack-700 bg-richblack-800 p-8">
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="form-style">
                {methods.map((m) => (<option key={m} value={m}>{m}</option>))}
            </select>

            <select value={url} onChange={(e) => setUrl(e.target.value)} className="form-style">
                <option value="">Select API URL</option>
                {apiUrls.map(({ name, url }) => (<option key={url} value={url}>{name}</option>))}
            </select>

            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Or enter API URL" className="form-style" />

            {(method === "GET" || method === "DELETE") && (
                <div className="space-y-2">
                    <p className="text-sm text-richblack-300">Query Parameters</p>
                    {queryParams.map((param, index) => (
                        <div key={index} className="flex gap-2">
                            <input type="text" placeholder="Key" value={param.key} onChange={(e) => {
                                const newParams = [...queryParams];
                                newParams[index].key = e.target.value;
                                setQueryParams(newParams);
                            }} className="form-style" />
                            <input type="text" placeholder="Value" value={param.value} onChange={(e) => {
                                const newParams = [...queryParams];
                                newParams[index].value = e.target.value;
                                setQueryParams(newParams);
                            }} className="form-style" />
                            <button className="bg-red-500 text-white px-2 rounded" onClick={() => setQueryParams(queryParams.filter((_, i) => i !== index))}>X</button>
                        </div>
                    ))}
                    <button className="bg-green-500 text-white px-2 rounded" onClick={() => setQueryParams([...queryParams, { key: "", value: "" }])}>+ Add Query Param</button>
                </div>
            )}

            {(method === "POST" || method === "PUT" || method === "DELETE") && (
                <div className="space-y-2">
                    <p className="text-sm text-richblack-300">Body Data</p>
                    {bodyData.map((param, index) => (
                        <div key={index} className="flex gap-2">
                            <input type="text" placeholder="Key" value={param.key} onChange={(e) => {
                                const newParams = [...bodyData];
                                newParams[index].key = e.target.value;
                                setBodyData(newParams);
                            }} className="form-style" />
                            <input type="text" placeholder="Value" value={param.value} onChange={(e) => {
                                const newParams = [...bodyData];
                                newParams[index].value = e.target.value;
                                setBodyData(newParams);
                            }} className="form-style" />
                            <button className="bg-red-500 text-white px-2 rounded" onClick={() => setBodyData(bodyData.filter((_, i) => i !== index))}>X</button>
                        </div>
                    ))}
                    <button className="bg-green-500 text-white px-2 rounded" onClick={() => setBodyData([...bodyData, { key: "", value: "" }])}>+ Add Body Param</button>
                </div>
            )}

            <IconBtn onclick={execute} customClasses="justify-center" text="Execute"/>

            {response && (
                <div className="p-4 bg-gray-900 rounded-md text-white">
                    <p><strong>Response Code:</strong> {response.status || "N/A"}</p>
                    <p><strong>Url:</strong>{buildUrlWithQueryParams(url, queryParams)}</p>
                    <p>
                        <strong>Status:</strong>
                        {response.success ? (
                            <span className="text-caribbeangreen-500"> ✔</span>
                        ) : (
                            <span className="text-red"> ✘</span>
                        )}
                    </p>
                    <p><strong>Message:</strong> {response.message || "No message"}</p>
                    <pre><strong>Data:</strong> {JSON.stringify(response.data, null, 2) || "No data"}</pre>
                </div>
            )}
        </div>
    );
}
