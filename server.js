'use strict'

/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstrap Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass relative path from the project root.
*/

const {Ignitor} = require('@adonisjs/ignitor')
const {exec} = require('child_process');

const runMigFlag = 0

if (runMigFlag) {
    exec('npm run init', function (error, stdout, stderr) {
        if (error) {
            console.error(`exec error: ${error}`);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    
        new Ignitor(require('@adonisjs/fold'))
            .appRoot(__dirname)
            .fireHttpServer()
            .catch(console.error)
    })
} else {
    new Ignitor(require('@adonisjs/fold'))
        .appRoot(__dirname)
        .fireHttpServer()
        .catch(console.error)
}

