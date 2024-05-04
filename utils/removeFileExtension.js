export function removeFileExtension(fileName) {
    return fileName.replace(/\.[^/.]+$/, "");
}
