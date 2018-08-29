import { defaultAliases } from "./defaultAliases";
import { Record } from "./Record";
import { toSeq } from "./toSeq";
import { testSeq } from "./testSeq";

export type KeyBindingCallback = () => void;

export interface KeyBinding {
    shortcut: string;
    seq: string[];
    callback: KeyBindingCallback;
}

export const specialKeys: ReadonlyArray<string> = ['Control', 'Shift', 'Alt'];

export interface KeyboardOptions {
    caseSensitive?: boolean;
    maxGap?: number;
    preventDefault?: boolean;
    preventDefaultOnHitOnly?: boolean;
    aliases?: typeof defaultAliases;
}

export class Keyboard implements KeyboardOptions {

    constructor(options: KeyboardOptions = {}) {
        Object.assign(this, options);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
    }

    caseSensitive = false;
    maxGap = 1500;
    preventDefault = true;
    preventDefaultOnHitOnly = true;
    aliases = new Map(defaultAliases);
    isDown = new Set<string>();
    history = new Array<Record>();
    keybindings = new Array<KeyBinding>();

    private _tgt?: EventTarget;
    private _opt?: AddEventListenerOptions;
    private _id: any;

    get target() {
        return this._tgt;
    }
    get options() {
        return this._opt;
    }

    clearLater() {
        clearTimeout(this._id);
        this._id = setTimeout(() => {
            this.history.length = 0;
        }, this.maxGap);
    }

    keydownHandler(e: KeyboardEvent) {
        const { key } = e,
            { isDown } = this;
        if (!isDown.has(key)) {
            isDown.add(key);
            if (specialKeys.indexOf(key) === -1) {
                this.history.push(new Record(e));
                if (this.preventDefault && (this.check() || !this.preventDefaultOnHitOnly)) {
                    e.preventDefault();
                }
            }
        }
        this.clearLater();
    }

    keyupHandler(e: KeyboardEvent) {
        const { key } = e,
            { isDown } = this;
        if (isDown.has(key)) {
            isDown.delete(key);
        }
        this.clearLater();
    }

    transform(seq: string[]) {
        this.aliases.forEach((replace, search) => {
            seq = seq.map(fragment => fragment.replace(search, replace));
        });
        return seq;
    }

    check() {
        const { history } = this,
            hit = new Set<string>();
        this.keybindings.forEach(b => {
            if (hit.has(b.shortcut)) {
                b.callback();
            } else if (testSeq(history, this.transform(b.seq), this.caseSensitive)) {
                hit.add(b.shortcut);
                b.callback();
            }
        });
        return hit.size > 0;
    }

    on(shortcut: string, callback: KeyBindingCallback) {
        this.keybindings.push({
            shortcut,
            seq: toSeq(shortcut),
            callback
        });
        return this;
    }

    off(shortcut: string, callback?: KeyBindingCallback) {
        this.keybindings = callback ?
            this.keybindings.filter(b => b.shortcut !== shortcut) :
            this.keybindings.filter(b => b.shortcut !== shortcut || b.callback !== callback);
        return this;
    }

    listenOn(target: EventTarget, options?: AddEventListenerOptions) {
        [this._tgt, this._opt] = [target, options];
        target.addEventListener('keydown', this.keydownHandler as EventListener, options);
        target.addEventListener('keyup', this.keyupHandler as EventListener, options);
        return this;
    }

    listenOff() {
        const { _tgt, _opt } = this;
        if (!_tgt) {
            throw "Haven't listened on any target!";
        }
        _tgt.removeEventListener('keydown', this.keydownHandler as EventListener, _opt);
        _tgt.removeEventListener('keyup', this.keyupHandler as EventListener, _opt);
        this._tgt = this._opt = undefined;
        return this;
    }

}
