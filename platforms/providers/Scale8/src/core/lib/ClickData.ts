import ObjectReference from '../../../../../common/lib/util/ObjectReference';

type ClickDataType = {
    id: string;
    classes: string[];
    attributes: { [k: string]: string };
};

type cb = () => void;

export default class ClickData {
    protected static readonly clickData: Map<string, ClickDataType> = new Map();
    private static readonly updateHooks: Map<string, cb[]> = new Map();

    public static addUpdateHook(ruleId: string, cb: cb): void {
        const cbs = this.updateHooks.get(ruleId) || [];
        this.updateHooks.set(ruleId, [...cbs, cb]);
    }

    public static dump(): [string, { [k: string]: any }][] {
        return Array.from(this.clickData);
    }

    public static get(ruleId: string, k: string): any {
        return ObjectReference.getReferenceFromPath(k, this.clickData.get(ruleId) || {});
    }

    private static namedNodeMapToObject(n: NamedNodeMap): { [k: string]: string } {
        const o: { [k: string]: string } = {};
        for (let i = 0; i < n.length; i++) {
            const v = n.item(i);
            if (v !== null) {
                o[v.name] = v.value;
            }
        }
        return o;
    }

    public static setClickElement(ruleId: string, elm: EventTarget | Element | HTMLElement) {
        //update here...
        if (elm instanceof HTMLElement || elm instanceof Element) {
            this.clickData.set(ruleId, {
                id: elm.id,
                classes: (elm.className || '').split(' '),
                attributes: this.namedNodeMapToObject(elm.attributes),
            });
            (this.updateHooks.get(ruleId) || []).forEach((_) => _());
        }
    }
}
