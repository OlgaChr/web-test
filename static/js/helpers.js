export function toTimestamp(date) {
    date.setHours(0, 0, 0, 0);
    var datum = Date.parse(date);
    return datum / 1000;
}

export function createElementWithClassName(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}