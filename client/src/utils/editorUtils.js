export const step = (initial, change) => {
    const endingIndex = initial.length - change.end
    return initial.slice(0, change.front) + change.inserted + initial.slice(endingIndex)
}

export const compareStrings = (str, next) => {
    let inserted = "";
    let front = 0;
    let end = 0;
    if (str === next) return { inserted, front, end: 0 }
    while (str[front] === next[front] && front < str.length) {
        front = front + 1;
    }
    // you could definitely do this just by shortening the while loop but okay
    let choppedStr = str.slice(front)
    let choppedNext = next.slice(front)
    while (choppedStr[choppedStr.length - end - 1] === choppedNext[choppedNext.length - end - 1] && end < choppedStr.length) {
        end = end + 1;
    }

    inserted = next.slice(front, next.length - end);
    const t = new Date();
    return { inserted, front, end, t }
}

export const reconstruct = (initial, changes, index) => {
    return changes.slice(0, index).reduce((acc, val) => step(acc, val), initial)
}
