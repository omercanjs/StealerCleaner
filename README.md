# 🧹 Cleanup Script for Windows

This script performs various cleanup tasks on a Windows system to enhance its security and performance. It specifically targets startup items, registry entries, and a common security issue related to the Discord application.

## ✨ Features

1. **Clean Startup Folder**: Removes all files from the Windows startup folder to prevent unwanted programs from launching at startup.
2. **Clean Registry**: Deletes all entries from the Windows registry's `Run` key to further ensure that no unwanted programs start automatically.
3. **Check Discord Security**: Scans the local application data folder for the Discord application, checks the content of the `index.js` file in the `discord_desktop_core` directory, and ensures it matches the expected clean state. If the file is found to be modified, it restores the expected content.

## 📋 Prerequisites

- Node.js installed on your system [Node Js Download](https://nodejs.org/dist/v20.15.1/node-v20.15.1-x64.msi).
- Required npm packages: `fs`, `path`, `child_process`, `winreg`.

## 🚀 Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/omercanjs/StealerRemover.git
    cd StealerRemover
    ```

2. Install the dependencies:
    ```sh
   install.bat
    ```

## 🛠️ Usage

1. Run the script:
    ```sh
    start.bat
    ```

## 📖 Detailed Functionality

### 1. 🗑️ Clean Startup Folder

The script first checks the Windows startup folder located at `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup` and deletes all files within it. This step prevents unwanted programs from being executed at user startup.

### 2. 🧹 Clean Registry

The script accesses the Windows registry key `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` and removes all entries. This step prevents unwanted programs from being executed at user login.

### 3. 🔍 Check Discord Security

it verifies the content of the `index.js` file to ensure it matches the expected clean state. If any modifications are detected, the script restores the file to its original content and logs a security warning.

### 4. 📝 Log Results

All actions performed by the script are logged into a `logs.txt` file for review.

## 📝 Example Log Output
```
Startup Deleted: example.lnk
Regedit Deleted: ExampleProgram
Discord Clean
```
## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## 📄 License

This project is dedicated to the public domain under the [CC0 1.0 Universal (CC0 1.0) Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/). See the `LICENSE` file for details.

---


