import { getTopWindow } from '../../../../../common/lib/util/WindowElement';

type DOMTreeChangeHookCallback = (addedNodes: Node[], removedNodes: Node[]) => void;

export default class DOMObserver {
    private static readonly domTreeChangeHook: DOMTreeChangeHookCallback[] = [];

    public static addDOMTreeChangeHook(cb: DOMTreeChangeHookCallback): void {
        this.domTreeChangeHook.push(cb);
    }

    public static init(): void {
        const nodeListToNodeArray = (nodeList: NodeList): Node[] => {
            const arr: Node[] = [];
            nodeList.forEach((_) => arr.push(_));
            return arr;
        };
        const handleDOMTreeChange = (mutationRecords: MutationRecord[]) => {
            this.domTreeChangeHook.forEach((_) =>
                _(
                    mutationRecords
                        .map((mutationRecord) => nodeListToNodeArray(mutationRecord.addedNodes))
                        .reduce((lst, value) => lst.concat(value), []),
                    mutationRecords
                        .map((mutationRecord) => nodeListToNodeArray(mutationRecord.removedNodes))
                        .reduce((lst, value) => lst.concat(value), []),
                ),
            );
        };
        new MutationObserver((mutationRecords) =>
            handleDOMTreeChange(
                mutationRecords.filter((mutationRecord) => mutationRecord.type === 'childList'),
            ),
        ).observe(getTopWindow().document.body, {
            attributes: true,
            childList: true,
            subtree: true,
        });
    }
}
