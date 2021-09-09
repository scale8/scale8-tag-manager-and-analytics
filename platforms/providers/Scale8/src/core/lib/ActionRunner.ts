import Frame from '../../../../../common/lib/util/Frame';
import Random from '../../../../../common/lib/util/Random';
import Loader from '../../../../../common/lib/util/Loader';
import Logger from '../../../../../common/lib/util/Logger';
import { getTopWindow } from '../../../../../common/lib/util/WindowElement';

export default class ActionRunner {
    public static create(
        code: string,
        actionData: { [k: string]: any },
        success: () => void,
        failure: (reason: string) => void,
        stdOut: (msg: string) => void,
        stdErr: (msg: string) => void,
    ): HTMLIFrameElement {
        const ufid = Random.numberBetween(1, 9e7) + '';
        //listen for complete / failure...
        getTopWindow().addEventListener(ufid, (e) => {
            const err = (e as any).detail?.err;
            if (err === undefined) {
                stdOut('Action invoked success method');
                success();
            } else {
                stdErr(`Action invoked failure method: ${err}`);
                failure(err);
            }
        });
        stdOut('Calling action code...');
        const api = `/* Start - S8 - Basic API */
var data = ${JSON.stringify(actionData)};
var ufid = ${ufid};
var success = function() {
  window.top.dispatchEvent(new CustomEvent(ufid));
}, failure = function(b) {
  window.top.dispatchEvent(new CustomEvent(ufid, {detail:{err:b}}));
};
(function() {
  if ("function" === typeof window.CustomEvent) {
    return !1;
  }
  window.CustomEvent = function(b, a) {
    a = a || {bubbles:!1, cancelable:!1, detail:null};
    var c = document.createEvent("CustomEvent");
    c.initCustomEvent(b, a.bubbles, a.cancelable, a.detail);
    return c;
  };
})();
/* End - S8 - Basic API */
        `;
        const injectedCode = api + '\n' + code.trim();
        Logger.debug(injectedCode);
        const js = ('<scr' + 'ipt>' + injectedCode + '</scr' + 'ipt>') as string;
        const frame = Frame.createFrame(`raw-code-frame-${ufid}`, 0, 0);
        frame.style.display = 'none';
        getTopWindow().document.body.appendChild(frame);
        return Loader.injectJS(js, frame);
    }
}
