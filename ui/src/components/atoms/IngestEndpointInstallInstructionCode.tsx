import { FC } from 'react';
import { IngestEndpointInstallInstructionCodeProps } from '../molecules/IngestEndpointInstallInstructions';
import CopyBlock from './CopyBlock';

export type IngestEndpointInstallSnippet = {
    id: string;
    text: string;
    snippet: string;
    language: string;
    trailingNewline: boolean;
};

const ingestEndpointInstallSnippets: IngestEndpointInstallSnippet[] = [
    //
    // cURL
    //
    {
        id: 'curl',
        text: 'cURL',
        snippet: `
curl --location --request POST '[endpoint]' \\
--header 'Content-Type: application/json' \\
--data-raw '[payloadShell]'
`.trim(),
        language: 'sh',
        trailingNewline: false,
    },
    //
    // JavaScript - Fetch
    //
    {
        id: 'javascript-fetch',
        text: 'JavaScript - Fetch',
        snippet: `
var jsonHeaders = new Headers();
jsonHeaders.append("Content-Type", "application/json");

var payload = '[payloadJs]';

var fetchOptions = {
  method: 'POST',
  headers: jsonHeaders,
  body: payload,
  redirect: 'follow'
};

fetch("[endpoint]", fetchOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log(error));
`.trim(),
        language: 'javascript',
        trailingNewline: false,
    },
    //
    // JavaScript - jQuery
    //
    {
        id: 'javascript-jquery',
        text: 'JavaScript - jQuery',
        snippet: `
var payload = '[payloadJs]';

var ajaxSettings = {
  "url": "[endpoint]",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Content-Type": "application/json"
  },
  "data": payload,
};

$.ajax(ajaxSettings).done(function (response) {
  console.log(JSON.stringify(response));
});
        `.trim(),
        language: 'javascript',
        trailingNewline: false,
    },
    //
    // JavaScript - XHR
    //
    {
        id: 'javascript-xhr',
        text: 'JavaScript - XHR',
        snippet: `
var payload = '[payloadJs]';

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
xhr.addEventListener("readystatechange", function() {
  if(this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "[endpoint]");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send(payload);
        `.trim(),
        language: 'javascript',
        trailingNewline: false,
    },
    //
    // NodeJs - Axios
    //
    {
        id: 'nodejs-axios',
        text: 'NodeJs - Axios',
        snippet: `
var payload = '[payloadJs]';

var axios = require('axios');
var axiosConfig = {
  method: 'post',
  url: '[endpoint]',
  headers: {
    'Content-Type': 'application/json'
  },
  data : payload
};

axios(axiosConfig)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
        `.trim(),
        language: 'javascript',
        trailingNewline: true,
    },
    //
    // NodeJs - Native
    //
    {
        id: 'nodejs-native',
        text: 'NodeJs - Native',
        snippet: `
var https = require('follow-redirects').https;
var fs = require('fs');

var payload = '[payloadJs]';
var reqOptions = {
  'method': 'POST',
  'hostname': '[domain]',[portOption][pathOption]
  'headers': {
    'Content-Type': 'application/json'
  },
  'maxRedirects': 20
};

var req = https.request(reqOptions, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

req.write(payload);
req.end();
        `.trim(),
        language: 'javascript',
        trailingNewline: false,
    },
    //
    // PHP - cURL
    //
    {
        id: 'php-curl',
        text: 'PHP - cURL',
        snippet: `
<?php

$url = '[endpoint]';
$payload = '[payloadPhp]';
$jsonHeader = array('Content-Type: application/json');

$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => $url,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => $payload,
  CURLOPT_HTTPHEADER => $jsonHeader,
));
$response = curl_exec($curl);
curl_close($curl);

echo $response;
        `.trim(),
        language: 'php',
        trailingNewline: true,
    },
    //
    // Python - Requests
    //
    {
        id: 'python-requests',
        text: 'Python - Requests',
        snippet: `
import requests

url = "[endpoint]"
payload = '''[payloadPython]'''
headers = {
  'Content-Type': 'application/json'
}

res = requests.request("POST", url, headers=headers, data=payload)
print(res.text)
        `.trim(),
        language: 'python',
        trailingNewline: true,
    },
    //
    // Ruby - Net::HTTP
    //
    {
        id: 'ruby',
        text: 'Ruby - Net/HTTP',
        snippet: `
require "net/http"

url = URI("[endpoint]")

https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true

req = Net::HTTP::Post.new(url)
req["Content-Type"] = "application/json"
req.body = '[payloadRuby]'

res = https.request(req)
puts res.read_body
        `.trim(),
        language: 'ruby',
        trailingNewline: true,
    },
];
const IngestEndpointInstallInstructionCode: FC<IngestEndpointInstallInstructionCodeProps> = (
    props: IngestEndpointInstallInstructionCodeProps,
) => {
    const payloadSimple = JSON.stringify(props.payload);
    const payloadEscaped = payloadSimple.replace(/'/g, "\\'");
    const payloadRuby = payloadEscaped.replace(/\\\\/g, '\\\\\\');
    const payloadPython = payloadSimple.replace(/\\/g, '\\\\');
    const payloadPhp = payloadPython.replace(/'/g, "\\'");
    const payloadJs = payloadPhp;
    const payloadShell = JSON.stringify(props.payload, null, 2).replace(/'/g, "'\\''");

    const text = props.snippet.snippet
        .replace('[endpoint]', props.endpoint)
        .replace('[domain]', props.domain)
        .replace('[portOption]', props.port === '' ? '' : `\n  'port': ${props.port},`)
        .replace('[pathOption]', props.path === '' ? '' : `\n  'path': '${props.path}',`)
        .replace('[portParameter]', props.port === '' ? '' : `, ${props.port}`)
        .replace('[payloadRuby]', payloadRuby)
        .replace('[payloadPython]', payloadPython)
        .replace('[payloadPhp]', payloadPhp)
        .replace('[payloadJs]', payloadJs)
        .replace('[payloadShell]', payloadShell);
    return (
        <CopyBlock
            text={`${text}${props.snippet.trailingNewline ? '\n' : ''}`}
            language={props.snippet.language}
        />
    );
};

export { IngestEndpointInstallInstructionCode, ingestEndpointInstallSnippets };
