
export function toSeq(shortcut: string) {

    const result = new Array<string>();

    let lastIsPlusSign = false,
        key = '';

    shortcut.split('').forEach(char => {
        if (char === ' ' && !lastIsPlusSign) {
            if (key) {
                result.push(key);
                key = '';
            }
        } else {
            key += char;
        }
        lastIsPlusSign = char === '+';
    });
    result.push(key);

    return result;

}
