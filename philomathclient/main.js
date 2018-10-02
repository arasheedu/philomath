const electron = require("electron");
const url = require("url");
const path = require("path");
const dockerCLI = require('docker-cli-js');
const delay = require('delay');

const { app, BrowserWindow, Menu, ipcMain} = electron;

var mainWindow;

var DockerOptions = dockerCLI.Options;
var Docker = dockerCLI.Docker;
var dockerBuildDir = '..';

var options = new DockerOptions(
            /* machinename */ null,
            /* currentWorkingDirectory */ dockerBuildDir
);

var docker = new Docker(options);

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};


app.on("ready", function () {

    mainWindow = new BrowserWindow({ show: false });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "indexAndSearchWindow.html"),
        protocol: "file",
        slashes: true
    }));

    var dockerBuildCommandLine = 'build -t philomath -f Dockerfile.philomath .';
    var dockerRunESCommandLine = 'run --name elasticsearch --volume c:\\philomathindex\\:/usr/share/elasticsearch/data/ -p 9200:9200  --env cluster.name=philomath --env http.port=9200 --env http.cors.allow-origin="*"  --env http.cors.enabled=true --env http.cors.allow-headers=X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization --env http.cors.allow-credentials=true --env http.cors.allow-methods=OPTIONS,HEAD,GET,POST,PUT,DELETE docker.elastic.co/elasticsearch/elasticsearch-oss:6.2.4';
    var dockerRunPhilomathCommandLine = 'run --name philomath --link elasticsearch:elasticsearch -p 8080:8080 philomath';

    (async () => {
        docker.command('images').then(function (data) {
            var images = JSON.stringify(data);
            if (images.indexOf('philomath') === -1) {
                docker.command(dockerBuildCommandLine);
            }
        });
        docker.command(dockerRunESCommandLine);
        await delay(5000);
        docker.command(dockerRunPhilomathCommandLine);
        await delay(5000);
    })();

    mainWindow.show();

    mainWindow.on("closed", function () {
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    mainWindow.setMenu(mainMenu);
});

app.on("quit", function () {
    try {
        docker.command('stop philomath', function (err, data) {
            console.log('err = ', err);
        });
    }
    catch (err) {
    }
    try {
        docker.command('stop elasticsearch', function (err, data) {
            console.log('err = ', err);
        });
    }
    catch (err) {
    }
    try {
        docker.command('rm --force philomath elasticsearch', function (err, data) {
            console.log('err = ', err);
        });
    }
    catch (err) {
    }
    try {
        docker.command('container prune --force', function (err, data) {
            console.log('err = ', err);
        });
    }
    catch (err) {
    }
});

ipcMain.on("item:search", function (e, keyword) {
    mainWindow.webContents.send("item:search", keyword);
});

const mainMenuTemplate = [
    {
        label: "File",
        //submenu: [
        //    {
        //        label: "Quit",
        //        accelerator: process.platform === "darwin" ? 'Command+Q' : "Ctrl+Q",
        //        click() {
        //            app.quit();
        //        }
        //    }
        //]
    }
];

if (process.platform === "darwin") {
    mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== "production") {
    mainMenuTemplate.push(
        {
            label: "Developer Tools",
            submenu: [
                {
                    label: "Toggle DevTools",
                    accelerator: process.platform === "darwin" ? 'Command+I' : "Ctrl+I",
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