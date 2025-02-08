// # Check functions-------------------------------------------------

var zisString = (arg) => typeof arg === 'string' || arg instanceof String;

var zisNumber = (arg) => typeof arg === 'number' && isFinite(arg);

var zallNumbers = (argArray) => argArray.every(zisNumber);

var zisFunction = (arg) => typeof arg === 'function';

var zisAsyncFunction = (arg) => zisFunction(arg) && arg.constructor.name === 'AsyncFunction';

var zisObject = (arg) => Object.prototype.toString.call(arg) === '[object Object]';

var zisArray = (arg) => Array.isArray(arg);

var zisOneInArray = (arr) => arr.length === 1;

var zisZeroPx = (str) => str === '0px';

var zisPxValue = (str) => zisString(str) && str.endsWith('px');

var zisNone = (str) => str === 'none';

var zcurrentUrlStartsWith = (str) => globalThis.location.href.startsWith(str);

// # Transform functions-------------------------------------------------

var zpxToNumber = (str) => {
    if (!str) return 0;
    if (zisNumber(str)) return str;
    return Number(str.slice(0, str.length - 2));
};

var zparseNum = (str) => +str.replace(/[^.\d]/g, '');

var zvalueToNumber = (str) => {
    let nbrVal = zparseNum(str);
    if (str.includes('K')) nbrVal *= 1000;
    return nbrVal;
};

const zgetStringNewLines = (arr) => {
    const res = arr.reduce((acc, curr, idx) => {
        if (idx < arr.length - 1) {
            acc = acc + curr + '\n';
        } else {
            acc = acc + curr;
        }
        return acc;
    }, '');
    return res;
};

var zremoveStr = (arg, strRemove, toNumber = false) => {
    const resWithoutStr = arg.split(strRemove).join('');
    return toNumber ? Number(resWithoutStr) : resWithoutStr;
};

var zremoveCommas = (arg, toNumber = false) => {
    const resWithoutCommas = arg.split(',').join('');
    return toNumber ? Number(resWithoutCommas) : resWithoutCommas;
};

var zremoveCharactersFromString = (str, ...chars) =>
    str
        .split('')
        .filter((ch) => !chars.includes(ch))
        .join('');

var zgetArrayStrClean = (arr) => {
    let resStr = `[`;
    arr.forEach((el, i) => {
        let value = el;
        if (zisObject(value)) value = zgetObjectStrClean(value);
        else if (zisArray(value)) value = zgetArrayStrClean(value);
        if (i === arr.length - 1) resStr += `${value}]`;
        else resStr += `${value}, `;
    });
    return resStr;
};

var zgetObjectStrClean = (obj) => {
    let resStr = `{`;
    const entries = Object.entries(obj);
    entries.forEach(([k, v], i) => {
        let value = v;
        if (zisObject(v)) value = zgetObjectStrClean(value);
        else if (zisArray(v)) value = zgetArrayStrClean(v);
        if (i === entries.length - 1) resStr += `${k}: ${value}}`;
        else resStr += `${k}: ${value}, `;
    });
    return resStr;
};

var zsumValues = (arr) =>
    arr.reduce((acc, curr) => {
        const currValue = zisString(curr) ? zremoveCommas(curr, true) : curr;
        return acc + currValue;
    }, 0);

var zformatDateAsShownInConsole = (date) => {
    const dateToFormat = new Date(date);
    const res = dateToFormat.toLocaleTimeString() + '.' + dateToFormat.getMilliseconds();
    return res;
};

// # Dom

var zgetElement = (arg, rootElement) => {
    const rootEl = rootElement ? rootElement : document;
    let searchString = '';
    if (rootElement && rootEl.nodeName !== '#document-fragment') {
        if (zisString(arg)) searchString = `:scope ${arg}`;
        else if (zisArray(arg)) searchString = arg.map((sel) => `:scope ${sel}`).join(', ');
    } else searchString = zisArray(arg) ? arg.join(', ') : arg;
    const element = rootEl.querySelector(searchString);
    return element;
};

var zgetAllElements = (arg, rootElement) => {
    const rootEl = rootElement ? rootElement : document;
    let searchString = '';
    if (rootElement && rootElement !== document && rootEl.nodeName !== '#document-fragment') {
        if (zisString(arg)) searchString = `:scope ${arg}`;
        else if (zisArray(arg)) searchString = arg.map((sel) => `:scope ${sel}`).join(', ');
    } else searchString = zisArray(arg) ? arg.join(', ') : arg;
    const elements = rootEl.querySelectorAll(searchString);
    return Array.from(elements);
};

var zgetAllShadowRootChildren = (zshadow) => {
    let newChildren = [];
    const allChildren = zgetAllElements('*', zshadow);
    allChildren.forEach((c) => {
        newChildren.push(c);
        if (c.shadowRoot) {
            const shadowChildren = zgetAllShadowRootChildren(c.shadowRoot);
            newChildren = newChildren.concat(shadowChildren);
        }
    });
    return newChildren;
};

// Gets all children of element, including shadowroots and open iframes
var zgetAllChildren = (el) => {
    let newChildren = [];
    const allChildren = zgetAllElements('*', el);
    allChildren.forEach((c) => {
        newChildren.push(c);
        if (c.shadowRoot) {
            const shadowChildren = zgetAllChildren(c.shadowRoot);
            newChildren = newChildren.concat(shadowChildren);
        }
        if (c.nodeName === 'IFRAME') {
            if (!c.contentDocument) console.log('zgetAllChildren > no contentDocument for iframe:', c, 'el:', el);
            else {
                const iframeChildren = zgetAllChildren(el.contentDocument);
                newChildren = newChildren.concat(iframeChildren);
            }
        }
    });
    return newChildren;
};

var ZNODE_NAMES_FILTER = ['HEAD', 'META', 'TITLE', 'BASE', 'LINK', 'STYLE', 'SCRIPT'];

var zgetAllElementsIncludingShadowRoots = (rootElement, nodeNamesFilter = ZNODE_NAMES_FILTER) => {
    const rootEl = rootElement ? rootElement : document;
    let ztot = [];
    zgetAllElements('*', rootEl).forEach((el) => {
        ztot.push(el);
        if (el.shadowRoot) {
            const shadowChildren = zgetAllShadowRootChildren(el.shadowRoot);
            ztot = ztot.concat(shadowChildren);
        }
    });
    if ('shadowRoot' in rootEl && rootEl.shadowRoot) {
        const rootElShadowChildren = zgetAllShadowRootChildren(rootEl.shadowRoot);
        ztot = ztot.concat(rootElShadowChildren);
    }
    if (nodeNamesFilter.length) ztot = ztot.filter((el) => !nodeNamesFilter.some((f) => f === el.nodeName));
    return ztot;
};

var zgetAllElementsIncludingShadowRootsAndIframes = (rootElement, nodeNamesFilter = ZNODE_NAMES_FILTER) => {
    const rootEl = rootElement ? rootElement : document;
    let ztot = [];
    zgetAllElements('*', rootEl).forEach((el) => {
        ztot.push(el);
        if (el.shadowRoot) {
            const shadowChildren = zgetAllChildren(el.shadowRoot);
            ztot = ztot.concat(shadowChildren);
        }
        if (el.nodeName === 'IFRAME') {
            if (!el.contentDocument) console.warn('zgetAllElementsIncludingShadowRootsAndIframes > no contentDocument for el:', el, 'rootElement:', rootElement);
            else {
                const iframeChildren = zgetAllChildren(el.contentDocument);
                console.log('found contentDocument for iframe > el:', el, 'iframeChildren:', iframeChildren);
                ztot = ztot.concat(iframeChildren);
            }
        }
    });
    if ('shadowRoot' in rootEl && rootEl.shadowRoot) {
        const rootElShadowChildren = zgetAllChildren(rootEl.shadowRoot);
        ztot = ztot.concat(rootElShadowChildren);
    }
    if (rootEl.nodeName === 'IFRAME' && rootEl.contentDocment) {
        const rootElIframeChildren = zgetAllChildren(rootEl.contentDocment);
        ztot = ztot.concat(rootElIframeChildren);
    }
    if (nodeNamesFilter.length) ztot = ztot.filter((el) => !nodeNamesFilter.some((f) => f === el.nodeName));
    return ztot;
};

var zgetElementIncludingShadowRootBySelector = (selectors, rootElement) => {
    const allElements = zgetAllElementsIncludingShadowRoots(rootElement, []);
    const firstMatchingElement = allElements.find((el) => el.matches(selectors));
    return firstMatchingElement;
};

var zgetAllElementsIncludingShadowRootsBySelector = (selectors, rootElement) => {
    const allElements = zgetAllElementsIncludingShadowRoots(rootElement, []);
    const allMatchingElements = allElements.filter((el) => el.matches(selectors));
    return allMatchingElements;
};

var zgetAllElementsIncludingShadowRootsAndIframesBySelector = (selectors, rootElement) => {
    const allElements = zgetAllElementsIncludingShadowRootsAndIframes(rootElement, []);
    const allMatchingElements = allElements.filter((el) => el.matches(selectors));
    return allMatchingElements;
};

var zgetElementAndScrollIntoView = (selector, rootElement) => {
    const res = zgetElement(selector, rootElement);
    if (res?.scrollIntoViewIfNeeded) res.scrollIntoViewIfNeeded();
    return res;
};

// use inFlow = true if elements that takes up space should be treated as visible
var zelIsVisible = (el, inFlow = false) => {
    if (!inFlow && getComputedStyle(el).visibility === 'hidden') return false;
    const bounds = el.getBoundingClientRect();
    return !!bounds.height && !!bounds.width;
};

var zelIsPartlyInViewport = (el) => {
    const elBounds = el.getBoundingClientRect();
    if (elBounds.bottom < 0) return false;
    return elBounds.top <= (window.innerHeight || document.documentElement.clientHeight);
};

var zclickElement = (arg) => {
    const el = zisString(arg) ? zgetElement(arg) : arg;
    if (el && el.click) el.click();
    else console.warn('zclickElement > cant click el for arg: ', arg, 'el:', el);
};

// TODO: improve to handle all kind of args
var zclickAll = (arr) => {
    arr.forEach((zel) => zclickElement(zel));
};

var zhideElement = (arg, keepInFlow = false) => {
    const el = zisString(arg) ? zgetElement(arg) : arg;
    if (!el) {
        console.warn('zhideElement > found no el for arg:', arg);
        return;
    }
    if (keepInFlow) el.style.visibility = 'hidden';
    else el.style.display = 'none';
};

var zhideElements = (argsArr, keepInFlow = false) => {
    argsArr.forEach((arg) => zhideElement(arg, keepInFlow));
};

var zremoveElement = (arg) => {
    const el = zisString(arg) ? zgetElement(arg) : arg;
    if (el && el.remove) el.remove();
    else console.log('zremoveEl > cant remove el for arg: ', arg, 'el: ', el);
};

var zremoveElements = (argsArr) => {
    argsArr.forEach((arg) => zremoveElement(arg));
};

var zcreateElement = (elementType, attributes) => {
    const el = document.createElement(elementType);
    if (zisObject(attributes)) {
        Object.entries(attributes).forEach(([key, value]) => {
            el[key] = value;
        });
    }
    return el;
};

var zfindHighestContainerWithSameBounds = (el) => {
    if (el.nodeName === 'HTML' || !el.parentElement) return el;
    const bounds = el.getBoundingClientRect();
    const parentBounds = el.parentElement.getBoundingClientRect();
    if (
        zpxToNumber(parentBounds.width) > zpxToNumber(bounds.width) ||
        zpxToNumber(parentBounds.height) > zpxToNumber(bounds.height)
    )
        return el;
    return zfindHighestContainerWithSameBounds(el.parentElement);
};

var zmoveElements = (els, parent) => {
    els.forEach((zel) => parent.appendChild(zel));
};

var ztriggerEvent = (event, elementToDispatchOn = document) => elementToDispatchOn.dispatchEvent(event);

var zremoveSiblingElements = (rootEl) => {
    rootEl.previousElementSibling?.remove();
    rootEl.nextElementSibling?.remove();
    if (rootEl.previousElementSibling || rootEl.nextElementSibling) zremoveSiblingElements(rootEl);
};

var traversePrevElSiblingFunc = (currEl, argFn) => {
    if (currEl.previousElementSibling) {
        argFn(currEl.previousElementSibling);
        traverseElSiblingFunc(currEl.previousElementSibling, argFn);
    }
};

var traversePrevElSiblingsUntilCondition = (currEl, argFn) => {
    if (currEl.previousElementSibling) {
        if (argFn(currEl.previousElementSibling)) return currEl.previousElementSibling;
        return traversePrevElSiblingsUntilCondition(currEl.previousElementSibling, argFn);
    } else console.log('found no elementSibling for currEl:', currEl);
};

var zhideSiblingElements = (rootEl, keepInFlow = false) => {
    let currEl = rootEl.parentElement.firstElementChild;
    while (currEl) {
        if (currEl !== rootEl) zhideElement(currEl, keepInFlow);
        currEl = currEl.nextElementSibling;
    }
};

var zhideAllOthers = (el, keepInFlow = false) => {
    const leBody = zgetElement('body');
    zhideSiblingElements(el, keepInFlow);
    let parentEl = el.parentElement;
    while (parentEl && parentEl !== leBody) {
        zhideSiblingElements(parentEl, keepInFlow);
        parentEl = parentEl.parentElement;
    }
};

// # CSS

var zgetTrimmedStyleValues = (key, value) => {
    const trimmedKey = key.trim();
    let trimmedValue = value.trim();
    const priority = trimmedValue.includes('!important') ? 'important' : '';
    if (priority) {
        trimmedValue = trimmedValue.substring(0, trimmedValue.indexOf('!important')).trim();
    }
    return { trimmedKey, trimmedValue, priority };
};

var zstyleElement = (el, cssStyle) => {
    if (zisString(cssStyle)) {
        cssStyle
            .split(';')
            .filter(Boolean)
            .forEach((style) => {
                const [key, value] = style.split(':');
                const { trimmedKey, trimmedValue, priority } = zgetTrimmedStyleValues(key, value);
                el.style.setProperty(trimmedKey, trimmedValue, priority);
            });
    } else if (zisObject(cssStyle)) {
        Object.entries(cssStyle).forEach(([key, value]) => {
            const { trimmedKey, trimmedValue, priority } = zgetTrimmedStyleValues(key, value);
            el.style.setProperty(trimmedKey, trimmedValue, priority);
        });
    }
};

var zinsertCss = (cssCode, rootElement) => {
    const styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.innerHTML = cssCode;
    const rootEl = rootElement ? rootElement : document.getElementsByTagName('head')[0];
    rootEl.appendChild(styleEl);
};

var zgetInlineStylesStr = (el) => el.getAttribute('style');

var zgetComputedStylesMap = (el) => {
    const computedStyleMap = el.computedStyleMap();
    const styles = [];
    for (const [k, v] of computedStyleMap) {
        styles.push({[k]: v});
    }
    return styles;
};

// # Utility functions  -------------------------------------------------

// zMapKey - map key in array of objects
var zmapKey = (arr, key) => arr.map((el) => el[key]);

// zMapFunction - map function in array
var zmapFunction = (arr, func) => arr.map((el) => func(el));

// zMapKeyThenMapFunction - map keys in array, and call function
var zmapKeyFunction = (arr, key, func) => zmapFunction(zmapKey(arr, key), func);

// zFilterKey - filter key in array of objects
var zfilterKey = (arr, key) => arr.filter((el) => el[key]);

// zFilterFunction - filter function in array of objects
var zfilterFunction = (arr, func) => arr.filter((el) => func(el));

// get array with unique strings or numbers
var zgetUniques = (arr) => Array.from(new Set(arr));

var zgetDuplicates = (arr) => arr.filter((v, i) => arr.indexOf(v) !== i);

var zgetLastInArray = (arr) => arr[arr.length - 1];

var zgetURL = () => globalThis.location.href;

var zcallFunction = async (func) => {
    if (zisAsyncFunction(func)) return await func();
    else if (zisFunction(func)) return func();
};

// MILLIS
var SECONDS_IN_MILLIS = 1000;
var MINUTES_IN_MILLIS = SECONDS_IN_MILLIS * 60;
var HOURS_IN_MILLIS = MINUTES_IN_MILLIS * 60;
var DAYS_IN_MILLIS = HOURS_IN_MILLIS * 24;

var zgetTimeDiff = (dateFrom, dateTo) => {
    const timeDiff = dateTo - dateFrom;
    const days = Math.trunc(timeDiff / DAYS_IN_MILLIS);
    const hours = Math.trunc(timeDiff / HOURS_IN_MILLIS) - days * 24;
    const minutes = Math.trunc(timeDiff / MINUTES_IN_MILLIS) - (days * 24 * 60 + hours * 60);
    const seconds = Math.trunc(timeDiff / SECONDS_IN_MILLIS) - (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60);
    return { days, hours, minutes, seconds };
};

var zgetFormatedTimeString = (timeObj) => {
    let timeString = '';
    if (timeObj.days) timeString += `${timeObj.days} days, `;
    if (timeObj.hours) timeString += `${timeObj.hours} hours, `;
    if (timeObj.minutes) timeString += `${timeObj.minutes} minutes, `;
    if (timeObj.seconds) timeString += `${timeObj.seconds} seconds`;
    return timeString;
};

var zgetTimeSince = (timeFrom) => {
    const currentTime = Date.now();
    const timeDiff = zgetTimeDiff(timeFrom, currentTime);
    const formattedTimeString = zgetFormatedTimeString(timeDiff);
    return formattedTimeString;
};

// # Loop functions

var zstartLoop = async (arg, time = 1000, asyncType = 'noAwait') => {
    if (globalThis.zloop) {
        clearInterval(globalThis.zloop);
        globalThis.zloop = null;
    }

    if (asyncType === 'noAwait') {
        globalThis.zloop = setInterval(() => {
            if (zisFunction(arg)) zcallFunction(arg);
            else if (zisArray(arg)) arg.forEach((f) => zcallFunction(f));
        }, time);
    } else if (asyncType === 'awaitAll') {
        globalThis.zloop = setInterval(async () => {
            if (zisFunction(arg)) await zcallFunction(arg);
            else if (zisArray(arg)) await Promise.all(arg.map((f) => zcallFunction(f)));
        }, time);
    } else if (asyncType === 'awaitEach') {
        globalThis.zloop = setInterval(async () => {
            if (zisFunction(arg)) await zcallFunction(arg);
            else if (zisArray(arg)) {
                for (const f of arg) {
                    await zcallFunction(f);
                }
            }
        }, time);
    } else console.warn('unknown asyncType:', asyncType);
};

var zstartAsyncLoop = (zafunc, ztime = 1000) => {
    if (globalThis.zaloop) {
        clearInterval(globalThis.zaloop);
        globalThis.zaloop = null;
    }
    globalThis.zaloop = setInterval(async () => {
        await zafunc();
    }, ztime);
};

var zstopLoops = () => {
    zstopPerformanceMeasureLoop();
    zstopPerformanceMeasureAsyncLoop();
    if (globalThis.zloop) {
        clearInterval(globalThis.zloop);
        globalThis.zloop = null;
    }
    if (globalThis.zaloop) {
        clearInterval(globalThis.zaloop);
        globalThis.zaloop = null;
    }
    if (globalThis.zscrollLoop) {
        clearInterval(globalThis.zscrollLoop);
        globalThis.zscrollLoop = null;
    }
};

var zwait = (time) => new Promise((resolve, reject) => setTimeout(resolve, time));

var ztimeoutFunction = async (arg, timeout = 2000) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            if (zisAsyncFunction(arg)) resolve(await zcallFunction(arg));
            if (zisFunction(arg)) resolve(zcallFunction(arg));
            else {
                console.warn('arg is no function! arg:', arg);
                reject();
            }
        }, timeout);
    });
};

var zperformanceMeasure = (func) => {
    const before = performance.now();
    const functionRes = func();
    const after = performance.now();
    const timeRes = after - before;
    console.log('performance: ', timeRes, functionRes);
};

var zperformanceMeasureAsync = async (func) => {
    let functionRes;
    const before = performance.now();
    try {
        functionRes = await func();
    } catch (error) {
        console.error(error);
    }

    const after = performance.now();
    const timeRes = after - before;
    console.log('performance: ', timeRes, functionRes);
};

var zstartPerformanceMeasureLoop = (func, timeInMillis) => {
    let nbrOfCalls = 0;
    let totalTime = 0;
    if (globalThis.zpmloop) clearInterval(globalThis.zpmloop);
    globalThis.zpmloop = setInterval(() => {
        const before = performance.now();
        const functionRes = func();
        const after = performance.now();
        nbrOfCalls += 1;
        const timeRes = after - before;
        totalTime += timeRes;
        console.log('performance > average:', totalTime / nbrOfCalls, 'lastCall:', timeRes, functionRes);
    }, timeInMillis);
};

var zstopPerformanceMeasureLoop = () => {
    if (globalThis.zpmloop) {
        clearInterval(globalThis.zpmloop);
        globalThis.zpmloop = null;
    }
};

var zstartPerformanceMeasureAsyncLoop = (asyncFunc, timeInMillis) => {
    let nbrOfCalls = 0;
    let totalTime = 0;
    if (globalThis.zpmaloop) clearInterval(globalThis.zpmaloop);
    globalThis.zpmaloop = setInterval(async () => {
        const before = performance.now();
        const functionRes = await asyncFunc();
        const after = performance.now();
        nbrOfCalls += 1;
        const timeRes = after - before;
        totalTime += timeRes;
        console.log('performance > average:', totalTime / nbrOfCalls, 'lastCall:', timeRes, functionRes);
    }, timeInMillis);
};

var zstopPerformanceMeasureAsyncLoop = () => {
    if (globalThis.zpmaloop) {
        clearInterval(globalThis.zpmaloop);
        globalThis.zpmaloop = null;
    }
};

var zdebugMutationCallback = (mutationList) => {
    mutationList.forEach((m) => {
        console.log('debugMutation: ', m);
    });
};

var zinitNewDebugObserver = (observeElement) => {
    if (globalThis.zdebugMutationObserver) {
        console.log('found old zdebugMutationObserver, disconnect and remove!');
        globalThis.zdebugMutationObserver?.disconnect();
        globalThis.zdebugMutationObserver = null;
    }
    globalThis.zdebugMutationObserver = new MutationObserver(zdebugMutationCallback);
    zdebugMutationObserver.observe(observeElement, {
        subtree: true,
        childList: true,
        attributes: true, // will be default true if the next line is set (attributeOldValue)
        attributeOldValue: true,
        characterDataOldValue: true,
    });
};

var zinitNewStyleObserver = (observeElement) => {
    if (globalThis.zdebugMutationObserver) {
        console.log('found old zdebugMutationObserver, disconnect and remove!');
        globalThis.zdebugMutationObserver?.disconnect();
        globalThis.zdebugMutationObserver = null;
    }
    globalThis.zdebugMutationObserver = new MutationObserver(zdebugMutationCallback);
    zdebugMutationObserver.observe(observeElement, {
        subtree: true,
        // attributes: true, // will be default true if the next line is set (attributeOldValue)
        attributeOldValue: true,
        attributeFilter: ['style'],
        // characterData: true,
        // characterDataOldValue: true,
    });
};

var zstopObserver = () => {
    if (globalThis.zdebugMutationObserver) {
        globalThis.zdebugMutationObserver?.disconnect();
        globalThis.zdebugMutationObserver = null;
    }
};

// # Debug logs

var zlog = (...args) => console.log(...args);

// Be able to write one-line if conditions with log and return
var zDebugLogTrue = (...args) => {
    console.log(...args);
    return true;
};

var zDebugWarnTrue = (...args) => {
    console.warn(...args);
    return true;
};

// debug log promise
var zdebugLogPromise = async (promise) => {
    const res = await promise;
    return res;
};

// # Random

// graphQL tools

var zgetGQLProps = () => zgetStringNewLines(zmapKey(zgetAllElements('.CodeMirror-hint'), 'innerText'));

// REACT INPUT CHANGE

var zchangeReactInputValue = (inputElement, newValue) => {
    const eventHandlerKey = Object.keys(inputElement).find((key) => key.startsWith('__reactEventHandlers'));
    if (eventHandlerKey) {
        inputElement[eventHandlerKey].onChange({ target: { value: newValue } });
    }
};

var ZSHORTCUTS = {
    zge: zgetElement,
    zgae: zgetAllElements,
    zges: zgetElementIncludingShadowRootBySelector,
    zgaes: zgetAllElementsIncludingShadowRootsBySelector,
    zgaesi: zgetAllElementsIncludingShadowRootsAndIframesBySelector,
    zdlt: zDebugLogTrue,
    zdwt: zDebugWarnTrue,
    zdlp: zdebugLogPromise,
    zgeas: zgetElementAndScrollIntoView,
    zce: zclickElement,
    zca: zclickAll,
    zpm: zperformanceMeasure,
    zpma: zperformanceMeasureAsync,
    zmk: zmapKey,
    zmf: zmapFunction,
    zmkf: zmapKeyFunction,
    zfk: zfilterKey,
    zff: zfilterFunction
};

var zisNoneCollidingShortcut = (shortcut) => {
    if (shortcut in globalThis) return false;
    return true;
};

var zgetShortcut = (shortcut) => {
    if (zisNoneCollidingShortcut(shortcut)) return { default: true, shortcut };
    let newShortcut = shortcut;
    let foundNoneCollidingShortcut = false;
    while (!foundNoneCollidingShortcut) {
        newShortcut += 'z';
        foundNoneCollidingShortcut = zisNoneCollidingShortcut(newShortcut);
    }
    return { default: false, shortcut: newShortcut };
};

var zaddShortcuts = (shortCuts) => {
    Object.entries(shortCuts).forEach(([k, v]) => {
        const res = zgetShortcut(k);
        if (!res.default) console.log(`Shortcut collission for ${k}: ${v?.name}, new shortcut is: ${res.shortcut}`);
        globalThis[res.shortcut] = v;
    });
};

zaddShortcuts(ZSHORTCUTS);