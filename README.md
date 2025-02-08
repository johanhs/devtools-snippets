This file contains a collection of utility functions designed to simplify various JavaScript tasks, specially useful for various devtools snippets or extensions. Below are descriptions for some of the functions.

All names starts with a z because of easy auto suggestions and to unvoiding global collisions. Shortcuts are set furthest down, and names will change if there is a collission.

## DOM Functions
- **zgetElement(arg, rootElement)**: Gets a single element based on selector(s), optional from a scoped rootElement.
  - zge
- **zgetAllElements(arg, rootElement)**: Gets all elements based on selector(s), optional from a scoped rootElement.
  - zgae
- **zgetAllElementsIncludingShadowRoots(rootElement, nodeNamesFilter)**: Gets all elements including those in shadow roots, with optional filtering.
- **zgetElementIncludingShadowRootBySelector(selectors, rootElement)**: Gets the first matching element including those in shadow roots.
  - zges
- **zgetAllElementsIncludingShadowRootsBySelector(selectors, rootElement)**: Gets all matching elements including those in shadow roots.
  - zgaes
- **zgetAllElementsIncludingShadowRootsAndIframesBySelector(selectors, rootElement)**: Gets all matching elements including those in shadow roots and iframes.
  - zgaes
- **zgetElementAndScrollIntoView(selector, rootElement)**: Gets an element and scrolls it into view.
-- zgeas
- **zelIsVisible(el, inFlow)**: Checks if an element is visible.
- **zelIsPartlyInViewport(el)**: Checks if an element is partly in the viewport.
- **zclickElement(arg)**: Clicks an element.
- **zclickAll(arr)**: Clicks all elements in an array.
- **zhideElement(arg, keepInFlow)**: Hides an element.
- **zhideElements(argsArr, keepInFlow)**: Hides multiple elements.
- **zremoveElement(arg)**: Removes an element based on a selector or element.
- **zremoveElements(argsArr)**: Removes multiple elements.
- **zcreateElement(elementType, attributes)**: Creates a new element with specified attributes.
- **zfindHighestContainerWithSameBounds(el)**: Finds the highest container with the same bounds as the element.
- **zmoveElements(els, parent)**: Moves elements to a new parent.
- **ztriggerEvent(event, elementToDispatchOn)**: Triggers an event on an element.
- **zremoveSiblingElements(rootEl)**: Removes sibling elements.
- **traversePrevElSiblingFunc(currEl, argFn)**: Traverses and calls function on all previous siblings
- **traversePrevElSiblingsUntilCondition(currEl, argFn)**: Traverses previous siblings and returns the one when function condition is true
- **zhideSiblingElements(rootEl, keepInFlow)**: Hides sibling elements.
- **zhideAllOthers(el, keepInFlow)**: Hides all other elements except the specified one.

## CSS Functions
- **zgetTrimmedStyleValues(key, value)**: Trims CSS style key and value and handling !important.
- **zstyleElement(el, cssStyle)**: Applies CSS styles to an element.
- **zinsertCss(cssCode, rootElement)**: Inserts CSS code into the document or an optional rootElement.
- **zgetInlineStylesStr(el)**: Gets the inline styles of an element as a string.
- **zgetComputedStylesMap(el)**: Gets a stylePropertyMap of an element

## Transform Functions
- **zpxToNumber(str)**: Converts a 'px' value string to a number.
- **zparseNum(str)**: Parses a string to extract numeric values.
- **zvalueToNumber(str)**: Converts a string with 'K' to a number.
- **zgetStringNewLines(arr)**: Joins an array of strings with new lines.
- **zremoveStr(arg, strRemove, toNumber)**: Removes a substring from a string and optionally converts the result to a number.
- **zremoveCommas(arg, toNumber)**: Removes commas from a string and optionally converts the result to a number.
- **zremoveCharactersFromString(str, ...chars)**: Removes specified characters from a string.
- **zgetArrayStrClean(arr)**: Converts an array to a clean string representation.
- **zgetObjectStrClean(obj)**: Converts an object to a clean string representation.
- **zsumValues(arr)**: Sums the values in an array.
- **zformatDateAsShownInConsole(date)**: Formats a date as shown in the console.

## Utility Functions
- **zmapKey(arr, key)**: Maps a key in an array of objects.
  - zmk
- **zmapFunction(arr, func)**: Maps a function over an array.
  - zmf
- **zmapKeyFunction(arr, key, func)**: Maps keys in an array and calls a function.
- **zgetUniques(arr)**: Gets unique values from an array.
- **zgetDuplicates(arr)**: Gets duplicate values from an array.
- **zgetLastInArray(arr)**: Gets the last element in an array.
- **zgetURL()**: Gets the current URL.
- **zcallFunction(func)**: Calls a function, handling async functions.

## Time Functions
- **zgetTimeDiff(dateFrom, dateTo)**: Gets the time difference between two dates.
- **zgetFormatedTimeString(timeObj)**: Formats a time object as a string.
- **zgetTimeSince(timeFrom)**: Gets the time since a specified date.

## Loop Functions
- **zstartLoop(arg, time, asyncType)**: Starts a loop calling a function or array of functions.
- **zstartAsyncLoop(zafunc, ztime)**: Starts an asynchronous loop.
- **zstopLoops()**: Stops all loops.
- **zwait(time)**: Creates a promise for a specified time.
- **ztimeoutFunction(arg, timeout)**: Calls a function after a timeout.
- **zperformanceMeasure(func)**: Measures the performance of a function.
- **zperformanceMeasureAsync(func)**: Measures the performance of an async function.
- **zstartPerformanceMeasureLoop(func, timeInMillis)**: Starts a loop measuring the performance of a function.
- **zstopPerformanceMeasureLoop()**: Stops the performance measure loop.
- **zstartPerformanceMeasureAsyncLoop(asyncFunc, timeInMillis)**: Starts a loop measuring the performance of an async function.
- **zstopPerformanceMeasureAsyncLoop()**: Stops the performance measure async loop.

## Debug Functions
- **zdebugMutationCallback(mutationList)**: Logs mutation events.
- **zinitNewDebugObserver(observeElement)**: Initializes a new debug observer.
- **zinitNewStyleObserver(observeElement)**: Initializes a new style observer.
- **zstopObserver()**: Stops the observer.
- **zlog(...args)**: Logs arguments.
- **zDebugLogTrue(...args)**: Logs arguments and returns true, useful when adding logs in one-line if statement conditions without changing the code too much.
- **zDebugWarnTrue(...args)**: Logs warnings and returns true.
- **zdebugLogPromise(promise)**: Logs the result of a promise.

## Random Functions
- **zgetGQLProps()**: Gets GraphQL properties.
- **zchangeReactInputValue(inputElement, newValue)**: Changes the value of a React input element.

## Check Functions
- **zisString(arg)**: Checks if the argument is a string.
- **zisNumber(arg)**: Checks if the argument is a finite number.
- **zallNumbers(argArray)**: Checks if all elements in an array are numbers.
- **zisFunction(arg)**: Checks if the argument is a function.
- **zisAsyncFunction(arg)**: Checks if the argument is an asynchronous function.
- **zisObject(arg)**: Checks if the argument is a plain object.
- **zisArray(arg)**: Checks if the argument is an array.
- **zisOneInArray(arr)**: Checks if the array has exactly one element.
- **zisZeroPx(str)**: Checks if the string is '0px'.
- **zisPxValue(str)**: Checks if the string ends with 'px'.
- **zisNone(str)**: Checks if the string is 'none'.
- **zcurrentUrlStartsWith(str)**: Checks if the current URL starts with the given string.

## Shortcuts
- **ZSHORTCUTS**: A collection of shortcuts for commonly used functions.

## Shortcut Management
- **zisNoneCollidingShortcut(shortcut)**: Checks if a shortcut is non-colliding.
- **zgetShortcut(shortcut)**: Gets a non-colliding shortcut.
- **zaddShortcuts(shortCuts)**: Adds shortcuts to the global scope.

---