import { useStateContext } from "@/context";
import Button from "./Button";

function DownloadButton({ fileUri, ...props }) {
    const { getIpfsUrl } = useStateContext();

    async function handleDownload(e) {
        e.preventDefault();
        const response = await fetch(getIpfsUrl(fileUri));
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "filename"); // Set the desired filename here
        document.body.appendChild(link);

        // Trigger a click event to initiate download
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    return <Button onClick={handleDownload} {...props} />;
}

export default DownloadButton;
