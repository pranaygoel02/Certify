import QRCode from "qrcode";

export const generateQRCode = (url) => {
    return new Promise((resolve, reject) => {
        console.log("generating QR Code for URL: " + url);
        QRCode.toDataURL(
            url,
            {
                width: 800,
                margin: 2,
                color: {
                    dark: "#335383FF",
                    light: "#EEEEEEFF",
                },
            },
            (err, url) => {
                if (err) return console.error(err);
                console.log("qr generated url", url);
                // return url
                resolve(url);
            }
        );
    });
};
export const getQRCodes = (urls) => {
    return new Promise((resolve, reject) => {
        console.log("generating QR Codes for URLs: ", urls);
        Promise.all(urls.map((url) => generateQRCode(url)))
            .then((qrCodes) => {
                console.log("QR codes generated successfully");
                resolve(qrCodes);
            })
            .catch((error) => {
                console.error("Error generating QR codes:", error);
                reject(error);
            });
    });
};

const generateQRFile = async (qrUrl, recipientName, courseName) => {
    const qrImageFileData = await fetch(qrUrl);
    const blob = await qrImageFileData.blob();
    const file = new File([blob], `${recipientName}|${courseName}`, {
        type: "image/png",
    });
    return file
};

export const getQRCodeFiles = (qrCodesURLs, fileNameData) => {
    return new Promise((resolve, reject) => {
        Promise.all(qrCodesURLs?.map((url,i) => generateQRFile(url, fileNameData[i]?.recipientName, fileNameData[i]?.courseName)))
        .then((qrCodeFiles) => {
             console.log("QR code files generated successfully");
             resolve(qrCodeFiles);
         })
    });
};
