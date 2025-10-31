const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('archiveFilesDB', 1);
        
        request.onerror = () => reject(request.error);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('files')) {
                db.createObjectStore('files', { keyPath: 'id' });
            }
        };
        
        request.onsuccess = () => resolve(request.result);
    });
};

export const saveToIndexedDB = async (id, files) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['files'], 'readwrite');
        const store = transaction.objectStore('files');
        
        const request = store.put({ id, files, timestamp: Date.now() });
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
};

export const getFromIndexedDB = async (id) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['files'], 'readonly');
        const store = transaction.objectStore('files');
        
        const request = store.get(id);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            // Check if data exists and is not older than 24 hours
            const data = request.result;
            if (data && (Date.now() - data.timestamp) < 24 * 60 * 60 * 1000) {
                resolve(data.files);
            } else {
                resolve(null);
            }
        };
    });
};
