const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const Winreg = require('winreg');

let logs = [];

const startupFolderPath = path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');

function cleanStartupFolder() {
    return new Promise((resolve) => {
        fs.readdir(startupFolderPath, (err, files) => {
            if (err) {
                return resolve();
            }

            if (files.length === 0) {
                logs.push("Startup Folder Clean.");
                return resolve();
            } else {
                let promises = files.map(file => {
                    return new Promise((res) => {
                        const filePath = path.join(startupFolderPath, file);
                        fs.unlink(filePath, () => {
                         {
                                logs.push(`Startup Deleted: ${file}`);
                            }
                            res();
                        });
                    });
                });
                Promise.all(promises).then(resolve);
            }
        });
    });
}

const regKey = new Winreg({
    hive: Winreg.HKCU,
    key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
});

function cleanRegistry() {
    return new Promise((resolve) => {
        regKey.values((err, items) => {
            if (err) {
                return resolve();
            }

            if (items.length === 0) {
                logs.push("Regedit Clean.");
                return resolve();
            } else {
                let promises = items.map(item => {
                    return new Promise((res) => {
                        regKey.remove(item.name, err => {
                            {
                                logs.push(`Regedit Deleted: ${item.name}`);
                            }
                            res();
                        });
                    });
                });
                Promise.all(promises).then(resolve);
            }
        });
    });
}

const localAppDataPath = path.join(process.env.LOCALAPPDATA);

function searchForIndexJs(folderPath) {
    return new Promise((resolve) => {
        fs.readdir(folderPath, { withFileTypes: true }, (err, entries) => {
            if (err) {
                return resolve();
            }

            let promises = entries.map(entry => {
                const entryPath = path.join(folderPath, entry.name);

                if (entry.isDirectory()) {
                    if (entry.name === 'discord_desktop_core') {
                        const indexPath = path.join(entryPath, 'index.js');
                        return new Promise((res) => {
                            fs.access(indexPath, fs.constants.F_OK, (err) => {
                                if (err) {
                                    return res();
                                } else {
                                    checkIndexJsContent(indexPath).then(res);
                                }
                            });
                        });
                    } else {
                        return searchForIndexJs(entryPath);
                    }
                } else {
                    return Promise.resolve();
                }
            });

            Promise.all(promises).then(resolve);
        });
    });
}

function checkIndexJsContent(indexPath) {
    return new Promise((resolve) => {
        fs.readFile(indexPath, 'utf8', (err, data) => {
            if (err) {
                return resolve();
            }

            const expectedContent = "module.exports = require('./core.asar');";
            if (data.trim() === expectedContent) {
                logs.push(`Discord Clean`);
                return resolve();
            } else {
                logs.push(`Discord infected with virus please restart discord and change password`);
                updateIndexJs(indexPath, expectedContent).then(resolve);
            }
        });
    });
}

function updateIndexJs(indexPath, content) {
    return new Promise((resolve) => {
        fs.writeFile(indexPath, content, 'utf8', (err) => {
            if (err) {
            } else {
            }
            resolve();
        });
    });
}


function writeLogsToFile() {
    const logFilePath = path.join(__dirname, 'logs.txt');
    const logContent = logs.join('\n');
    fs.writeFile(logFilePath, logContent, 'utf8', (err) => {

    });
}

async function main() {
    await cleanStartupFolder();
    await cleanRegistry();

    const folders = await new Promise((resolve) => {
        fs.readdir(localAppDataPath, (err, folders) => {
            if (err) {
                resolve([]);
            } else {
                resolve(folders);
            }
        });
    });

    for (const folder of folders) {
        if (folder.toLowerCase().includes('discord')) {
            const discordFolderPath = path.join(localAppDataPath, folder);
            await searchForIndexJs(discordFolderPath);
        }
    }

    writeLogsToFile();
}

main();
