const {
    app,
    Menu,
    Tray,
    BrowserWindow,
    globalShortcut
} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let mixer = null
let tray = null

app.on('ready', () => {
    tray = new Tray('/usr/share/icons/hicolor/64x64/apps/amarok.png')
    const contextMenu = Menu.buildFromTemplate([{
            label: 'Show mixer',
            click() {
                if (mixer.isVisible()) {
                    mixer.hide()
                } else {
                    mixer.show()
                }
            }
        },
        {
            label: 'Exit',
            click() {
                app.exit()
            }
        }
    ]);

    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
    tray.on('click', function(e) {
        if (win.isVisible()) {
            win.hide()
        } else {
            win.show()
        }
    });
    const ret = globalShortcut.register('Meta+A', () => {
        if (win.isVisible()) {
            win.hide()
        } else {
            win.show()
        }
     })
})


function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false
        }
    })

    mixer = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false
        }
    })


    win.setMenu(null);
    mixer.setMenu(null);

    win.maximize();
    mixer.maximize();

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: "player.iceshard.lab",
        protocol: 'http:',
        slashes: true
    }))

    mixer.loadURL(url.format({
        pathname: "mixer.iceshard.lab",
        protocol: 'http:',
        slashes: true
    }))

    mixer.hide()

    win.on('closed', () => {
        win = null
    })

    mixer.on('closed', () => {
        mixer = null
    })

    win.on('close', (event) => {
        //win = null
        console.log(event);
        event.preventDefault();
        win.hide();
    })

    mixer.on('close', (event) => {
        //win = null
        console.log(event);
        event.preventDefault();
        mixer.hide();
    })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    //  if (process.platform !== 'darwin') {
    //    app.quit()
    //  }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
