import client from 'https';
import fs from 'fs';

export function downloadImg(url, filePath) {
    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filePath))
                    .on('error', reject)
                    .once('close', () => resolve(filePath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        })
    });
}
