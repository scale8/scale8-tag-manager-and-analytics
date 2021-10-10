// noinspection JSUnusedGlobalSymbols

import { FC } from 'react';
import Head from 'next/head';
import LazyShiki from '../components/atoms/LibraryLoaders/LazyShiki';

const ErrorHighlightTester: FC = () => {
    const src = `
function serverRequest(query, callback){
  setTimeout(function(){
    var response = query + "full!";
    callback(response);
  },5000);
}

function getResults(results){
  console.log("Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Response from the server: " + results);
}

serverRequest("The glass is half ", getResults);

// Result in console after 5 second delay:
// Response from the server: The glass is half full!
`.trim();

    return (
        <>
            <Head>
                <title>Scale8 - Error HighLight Test</title>
                <meta name="description" content="Scale8 - Diff Test." />
            </Head>

            <LazyShiki language="js" code={src} errorPosition={{ row: 9, col: 16 }} />
        </>
    );
};

export default ErrorHighlightTester;
