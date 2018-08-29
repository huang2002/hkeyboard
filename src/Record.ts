
export class Record {

    constructor(e: KeyboardEvent) {
        this.key = e.key;
        this.control = e.ctrlKey;
        this.shift = e.shiftKey;
        this.alt = e.altKey;
    }

    key: string;
    control: boolean;
    shift: boolean;
    alt: boolean;

    toString() {
        let result = this.key;
        if (this.alt) {
            result = 'Alt+' + result;
        }
        if (this.shift) {
            result = 'Shift+' + result;
        }
        if (this.control) {
            result = 'Control+' + result;
        }
        return result;
    }

}
