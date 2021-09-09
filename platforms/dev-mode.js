const express = require('express');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');

const fs = require("fs");
const path = require("path");

const SERVER_PORT = 3123;
const PUBLIC_PATH = `http://127.0.0.1:${SERVER_PORT}`;

const providerString = process.argv.find((value => value.startsWith('--provider=')));

const isDir = (fp) => {
    try {
        return fs.statSync(fp).isDirectory();
    } catch(e) {
        return false;
    }
};

if(providerString === undefined){
    console.error('Expecting --provider=<Name>');
    process.exit(1);
} else {
    const provider = providerString.split("=")[1].trim();
    console.log(`Running dev mode for ${provider}`);
    if (isDir(path.resolve(__dirname, 'providers/' + provider))) {
        //good to go...

        const compiler = webpack({
            mode: 'development',
            entry: {
                main: './providers/' + provider + '/src/Main.ts',
            },
            output: {
                path: '/tmp',
                filename: '[name].js',
                chunkFilename: '[name].chunk.js',
                publicPath: PUBLIC_PATH,
                jsonpFunction: '_s8_' + provider.toLowerCase() + '_loader',
            },
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.json']
            },
            devtool: 'inline-source-map',
            watch: false,
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    presets: [
                                        ['@babel/preset-env',{
                                            useBuiltIns: "usage",
                                            targets: "> 0.25%, last 2 versions, not dead, ie 11",
                                            corejs: "3.15.1",
                                            debug: true
                                        }]
                                        ,'@babel/preset-typescript'],
                                    plugins: [
                                        '@babel/proposal-class-properties',
                                        '@babel/proposal-object-rest-spread'
                                    ]
                                }
                            },
                        ]
                    },
                    {
                        test: /\.tsx?$/,
                        exclude: /node_modules/,
                        loader: 'ts-loader',
                    },
                ],
            }
        });

        const instance = middleware(compiler);
        const app = express();
        app.use(instance);

        app.listen(SERVER_PORT, () => {
            console.log(`Server @ ${PUBLIC_PATH}`);
        });

    } else {
        console.error(`Unable to find provider '${provider}'`);
        process.exit(1);
    }

}
