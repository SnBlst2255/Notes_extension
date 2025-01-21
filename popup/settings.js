export default class Settings {
    updateSettings(size, wrapping) {
        return new Promise(resolve => {
            chrome.storage.local.set({ size, wrapping }, () => {
                resolve();
            });
        });
    }

    getSettings() {
        return new Promise(resolve => {
            chrome.storage.local.get(['size', 'wrapping'], (result) => {
                if (result.size === undefined || result.wrapping === undefined) {
                    this.updateSettings(16, true).then(() => {
                        resolve({
                            size: 16,
                            wrapping: true
                        });
                    });
                } else {
                    resolve({
                        size: result.size,
                        wrapping: result.wrapping
                    });
                }
            });
        });
    }
}