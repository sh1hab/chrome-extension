
async function executeContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
    return true;
  } catch (err) {
    console.error('Content script injection failed:', err);
    return false;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  if (request.action === 'uploadProduct') {
    chrome.tabs.create({
      url: 'https://www.facebook.com/marketplace/create/item'
    }, async (tab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          
          setTimeout(async () => {
            const success = await executeContentScript(tab.id);
            if (success) {
              setTimeout(() => {
                chrome.tabs.sendMessage(tab.id, {
                  action: 'fillForm',
                  product: request.product
                }, (response) => {
                  if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError);
                  } else {
                    console.log('Message sent successfully:', response);
                  }
                });
              }, 1000); 
            }
          }, 1000);
        }
      });
    });
  }
  return true;
});