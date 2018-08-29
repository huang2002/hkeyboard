import { Record } from "./Record";

export function testSeq(history: Record[], seq: string[], caseSensitive = false) {
    const offset = history.length - seq.length;
    return offset >= 0 && seq.every(
        caseSensitive ?
            (key, i) => key === history[i + offset].toString() :
            (key, i) => key.toLowerCase() === history[i + offset].toString().toLowerCase()
    );
}
