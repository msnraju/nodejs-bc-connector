import { BCConnector } from './bc-connector';
import * as https from 'https';

const tenantId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx';
const clientId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx';
const hostName = 'api.businesscentral.dynamics.com';
const userName = 'admin@xxxx.onmicrosoft.com';
const password = 'xxxxxxxx';

const dynamics = new BCConnector(tenantId,
    hostName,
    clientId,
    userName,
    password);

dynamics.connect().then(response => {
    console.log(`retrieving data from bc...`);
    var req = https.request({
        hostname: 'api.businesscentral.dynamics.com',
        path: '/v2.0/Production/api/v2.0/companies',
        headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${response.accessToken}`
        }
    }, res => {
        res.on('data', d => {
            const responseJson = JSON.parse(d.toString());
            console.log(JSON.stringify(responseJson, null, 2));
        })
    });

    req.on('error', error => {
        console.error(error)
    })

    req.end();
}).catch(error => {
    console.error(error);
});


