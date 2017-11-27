import * as browser from 'webextension-polyfill';

browser.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId !== 0) return;
  if (details.url !== "https://www.youtube.com" && !details.url.startsWith('https://www.youtube.com/')) return;
  await browser.tabs.executeScript(details.tabId, {
    file: '/content.js',
    runAt: 'document_start'
  });

  const err = browser.runtime.lastError;
  if (!err) return;

  console.error(err);
});