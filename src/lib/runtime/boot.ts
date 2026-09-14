import { DENSITIES } from './density';
import { THEMES } from './theme';

/* The one preference path that runs before the first paint. It is a string so
 * the document can execute it before the client bundle or any island loads. */
const NON_DEFAULT_THEMES = THEMES.filter((theme) => theme !== 'system');
const NON_DEFAULT_DENSITIES = DENSITIES.filter((density) => density !== 'comfortable');

/** Inline, blocking, and small enough to inspect in page source. */
export const RUNTIME_BOOT_SCRIPT = `(function(){try{
var d=document.documentElement;
var t=localStorage.getItem("theme");
if(${NON_DEFAULT_THEMES.map((theme) => `t===${JSON.stringify(theme)}`).join('||')})d.dataset.theme=t;
var n=localStorage.getItem("density");
if(${NON_DEFAULT_DENSITIES.map((density) => `n===${JSON.stringify(density)}`).join('||')})d.dataset.density=n;
}catch(e){}})();`;
