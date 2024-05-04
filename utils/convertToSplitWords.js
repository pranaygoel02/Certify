export default function convertToSplitWords(variableName) {
    // Convert camelCase to split words
    if (/^[a-z][a-zA-Z\d]*$/.test(variableName)) {
        return variableName.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
    }

    // Convert underscore_based to split words
    if (/^[a-z][a-zA-Z\d]*(_[a-zA-Z\d]+)+$/.test(variableName)) {
        return variableName.replace(/_/g, ' ').toLowerCase();
    }

    // If the input doesn't match either convention, return as is
    return variableName;
}