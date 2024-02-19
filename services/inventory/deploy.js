const semver = require('semver');
const shell = require('shelljs');
const fs = require('fs');

const versionFilePath = './package.json';

const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf-8'));
let currentVersion = versionData.version;

const newVersion = semver.inc(currentVersion, 'patch');
versionData.version = '1.0.3';

fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2), 'utf-8');
shell.exec(`docker build -t inventory:${newVersion} .`);

// Tag the image for Docker Hub
shell.exec(`docker tag inventory:${newVersion} rishiwhite11/inventory:${newVersion}`);
shell.exec(`docker tag inventory:${newVersion} rishiwhite11/inventory:latest`);

// Push both tags to Docker Hub
shell.exec(`docker push rishiwhite11/inventory:${newVersion}`);
shell.exec(`docker push rishiwhite11/inventory:latest`);

console.log(`Deployed version ${newVersion} to Docker Hub.`);
shell.cd('deployment');
shell.exec('kubectl apply -f .');
console.log(`Deployed in kubernetes`);


