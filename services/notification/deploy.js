const semver = require('semver');
const shell = require('shelljs');
const fs = require('fs');

const versionFilePath = './package.json';

const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf-8'));
let currentVersion = versionData.version;

const newVersion = semver.inc(currentVersion, 'patch');
versionData.version = newVersion;

fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2), 'utf-8');
shell.exec(`docker build -t notification:${newVersion} .`);

// Tag the image for Docker Hub
shell.exec(`docker tag notification:${newVersion} rishiwhite11/notification:${newVersion}`);
shell.exec(`docker tag notification:${newVersion} rishiwhite11/notification:latest`);

// Push both tags to Docker Hub
shell.exec(`docker push rishiwhite11/notification:${newVersion}`);
shell.exec(`docker push rishiwhite11/notification:latest`);

console.log(`Deployed version ${newVersion} to Docker Hub.`);
shell.cd('deployment');
shell.exec('kubectl apply -f .');
console.log(`Deployed in kubernetes`);


