const path = require('path');
const express = require('express');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const WriteFilePlugin = require('write-file-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { spawn } = require('child_process');

const SERVER_PORT = 3123;
const PUBLIC_PATH = `http://127.0.0.1:${SERVER_PORT}`;

const runTests = (projectName) => {
    return new Promise((resolve, reject) => {
        const opts = [
            '--testEnvironment=node',
            "--transform='" + JSON.stringify({
                '\\.tsx?$': 'ts-jest',
            }) + "'",
            `--moduleFileExtensions=js`,
            `--moduleFileExtensions=ts`,
            `--testRegex='providers/${projectName}/tests/.+?spec\\.ts$'`,
        ];

        console.log(`Jest opts: ${opts.join(' ')}`);

        const jest = spawn('yarn jest', opts, { shell: true, stdio: 'inherit' });

        jest.on('close', (code) => {
            if(code === 0){
                resolve();
            } else {
                reject('Failed to pass tests');
            }
        });

    });
}

const runBuild = async (projectName) => {

    console.log('Running tests for: ' + projectName);
    await runTests(projectName);

    console.log('Running build for: ' + projectName);
    const outputDir = path.resolve(__dirname, './builds/' + projectName);

    const compiler = webpack({
        mode: 'production',
        entry: {
            main: './providers/' + projectName + '/src/Main.ts',
        },
        output: {
            path: outputDir,
            filename: '[name].js',
            chunkFilename: '[name].chunk.js',
            publicPath: PUBLIC_PATH,
            jsonpFunction: '_s8_' + projectName.toLowerCase() + '_loader',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json']
        },
        devtool: 'source-map',
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
        },
        plugins: [
            new webpack.DefinePlugin({
                __S8_MODE: JSON.stringify('build'),
                __S8_IS_CORE: JSON.stringify(projectName === 'Scale8'),
            }),
            new WriteFilePlugin(),
            new HtmlWebpackPlugin(),
        ],
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    test: /\.js(\?.*)?$/i,
                    uglifyOptions: {
                        comments: false,
                        keep_fnames: true,
                    }
                })
            ],
        },
    });

    const buildConfigFromSpec = (spec) => JSON.stringify(
        spec,
        (k, v) => {
            return typeof v === 'object' && Object.keys(v).length === 0? undefined : v;
        },
        2
    );

    const instance = middleware(compiler);
    const app = express();
    app.use(instance);

    return new Promise(resolve => {
        const server = app.listen(SERVER_PORT, () => {
            instance.waitUntilValid(() => {
                (async () => {
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.goto(PUBLIC_PATH);
                    const spec = await page.evaluate(() => __S8_BUILD_SPEC);
                    fs.writeFileSync(outputDir + "/config.json", buildConfigFromSpec(spec));
                    await browser.close();
                    await server.close(() => resolve());
                })();
            });
        });
    });
}

const directories = source => fs.readdirSync(source, {
    withFileTypes: true
}).reduce((a, c) => {
    c.isDirectory() && a.push(c.name)
    return a
}, []);

(async () => {
    for(const provider of directories(path.resolve(__dirname, './providers'))){
        await runBuild(provider);
    }
    process.exit(0);
})();
