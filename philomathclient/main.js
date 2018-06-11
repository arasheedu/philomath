const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain} = electron;

var mainWindow;

app.on("ready", function () {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "indexAndSearchWindow.html"),
        protocol: "file",
        slashes: true
    }));
    mainWindow.on("closed", function () {
        app.quit();
    });
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    mainWindow.setMenu(mainMenu);
});

ipcMain.on("item:search", function (e, keyword) {
    mainWindow.webContents.send("item:search", keyword);
});

const mainMenuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Quit",
                accelerator: process.platform == "darwin" ? 'Command+Q' : "Ctrl+Q",
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform == "darwin") {
    mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== "production") {
    mainMenuTemplate.push(
        {
            label: "Developer Tools",
            submenu: [
                {
                    label: "Toggle DevTools",
                    accelerator: process.platform == "darwin" ? 'Command+I' : "Ctrl+I",
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    },
                },
                {
                    role: 'reload'
                }
            ]
        });
}