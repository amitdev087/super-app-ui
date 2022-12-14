import https from 'https-browserify';
import crypto from 'crypto-browserify';
import stream from 'stream-browserify;'
import http from 'stream-http;'

const secretKey = "<your-secret-key>";
const accessKey = "<your-access-key>";
const log = false;

async function makeRequest(method, urlPath, body = null) {

    try {
        var httpMethod = method;
        var httpBaseURL = "sandboxapi.rapyd.net";
        var httpURLPath = urlPath;
        var salt = generateRandomString(8);
        var idempotency = new Date().getTime().toString();
        var timestamp = Math.round(new Date().getTime() / 1000);
        var signature = sign(httpMethod, httpURLPath, salt, timestamp, body)

        const options = {
            hostname: httpBaseURL,
            port: 443,
            path: httpURLPath,
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json',
                salt: salt,
                timestamp: timestamp,
                signature: signature,
                access_key: accessKey,
                idempotency: idempotency
            }
        }

        return await httpRequest(options, body, log);
    }
    catch (error) {
        console.error("Error generating request options");
        throw error;
    }
}

function sign(method, urlPath, salt, timestamp, body) {

    try {
        let bodyString = "";
        if (body) {
            bodyString = JSON.stringify(body);
            bodyString = bodyString == "{}" ? "" : bodyString;
        }

        let toSign = method.toLowerCase() + urlPath + salt + timestamp + accessKey + secretKey + bodyString;

        let hash = crypto.createHmac('sha256', secretKey);
        hash.update(toSign);
        const signature = Buffer.from(hash.digest("hex")).toString("base64")

        return signature;
    }
    catch (error) {
        console.error("Error generating signature");
        throw error;
    }
}

function generateRandomString(size) {
    try {
        return crypto.randomBytes(size).toString('hex');
    }
    catch (error) {
        console.error("Error generating salt");
        throw error;
    }
}

async function httpRequest(options, body) {

    return new Promise((resolve, reject) => {

        try {
            
            let bodyString = "";
            if (body) {
                bodyString = JSON.stringify(body);
                bodyString = bodyString == "{}" ? "" : bodyString;
            }

            const req = https.request(options, (res) => {
                let response = {
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: ''
                };

                res.on('data', (data) => {
                    response.body += data;
                });

                res.on('end', () => {

                    response.body = response.body ? JSON.parse(response.body) : {}

                    if (response.statusCode !== 200) {
                        return reject(response);
                    }

                    return resolve(response);
                });
            })
            
            req.on('error', (error) => {
                return reject(error);
            })
            
            req.write(bodyString)
            req.end();
        }
        catch(err) {
            return reject(err);
        }
    })

}

exports.makeRequest = makeRequest;