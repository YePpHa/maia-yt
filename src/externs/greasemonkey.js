/**
 * @type {Window}
 * @const
 * @see https://wiki.greasespot.net/UnsafeWindow
 */
var unsafeWindow;

/**
 * Adds the given style to the document.
 * @param {?string} css the css style.
 * @see https://wiki.greasespot.net/GM_addStyle
 */
function GM_addStyle(css) {}

/**
 * Deletes `name` from storage.
 * @param {?string} name the name.
 * @see https://wiki.greasespot.net/GM_deleteValue
 */
function GM_deleteValue(name) {}

/**
 * Returns the resource text.
 * @param {?string} resourceName the resource name.
 * @return {?string} the resource text.
 * @throws {Error} if the named resource doesn't exist.
 * @see https://wiki.greasespot.net/GM_getResourceText
 */
function GM_getResourceText(resourceName) {}

/**
 * Returns the resource URL.
 * @param {?string} resourceName the resource name.
 * @return {?string} the resource URL.
 * @throws {Error} if the named resource doesn't exist.
 * @see https://wiki.greasespot.net/GM_getResourceURL
 */
function GM_getResourceURL(resourceName) {}

/**
 * Returns the value of `name`.
 * @param {?string} name the name.
 * @param {string|Number|Boolean=} opt_default optional default value.
 * @return {string|Number|Boolean} the value of `name`.
 * @see https://wiki.greasespot.net/GM_getValue
 */
function GM_getValue(name, opt_default) {}

/**
 * Returns information about Greasemonkey and the running User Script.
 * @return {?Object} metadata about Greasemonkey and the running User Script.
 * @see https://wiki.greasespot.net/GM_info
 */
function GM_info() {}

/**
 * List all names of the storage.
 * @return {?Array<string>} all names of the storage.
 * @see https://wiki.greasespot.net/GM_listValues
 */
function GM_listValues() {}

/**
 * Opens the specified URL in a new tab.
 * @param {?string} url the URL to navigate the new tab to.
 * @param {boolean=} opt_openInBackground whether to force the tab to open in
 *    the background.
 * @return {?Window} the window of the created tab.
 * @see https://wiki.greasespot.net/GM_openInTab
 */
function GM_openInTab(url, opt_openInBackground) {}

/**
 * Register a menu command.
 * @param {?string} caption the caption of the menu item.
 * @param {?Function} commandFunc the function that's called when the menu item
 *    is selected by the user.
 * @param {string=} opt_accessKey a single character that can be used to select
 *    command when the menu is open. It should be a letter in the `caption`.
 * @see https://wiki.greasespot.net/GM_registerMenuCommand
 */
function GM_registerMenuCommand(caption, commandFunc, opt_accessKey) {}

/**
 * Set the current contents of the OS's clipboard.
 * @param {?string} text the text to set the clipboard contents to.
 * @see https://wiki.greasespot.net/GM_setClipboard
 */
function GM_setClipboard(text) {}

/**
 * Set the value of `name` to the storage.
 * @param {?string} name the unique (within this script) name for this value.
 * @param {string|Number|Boolean} value the value.
 * @see https://wiki.greasespot.net/GM_setValue
 */
function GM_setValue(name, value) {}

/**
 * Perform xmlHttpRequest without the CORS restrictions.
 * @param {?Object} details the details.
 * @see https://wiki.greasespot.net/GM_xmlhttpRequest
 */
function GM_xmlhttpRequest(details) {}
