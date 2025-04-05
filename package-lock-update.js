const fs = require('fs');
const path = require('path');

try {
  // Read the current package-lock.json
  const packageLockPath = path.join(__dirname, 'package-lock.json');
  const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
  
  // Add helmet dependency
  packageLock.dependencies.helmet = {
    version: "7.0.0",
    resolved: "https://registry.npmjs.org/helmet/-/helmet-7.0.0.tgz",
    integrity: "sha512-MsYPHp2Lj/jM+T4JsgBEYlLpQMxj9H5IUKpKdNJQ5fLc9/QUwXQF1CRMVPDl/2yUXPV9jXCQbIL37SiZ9Cf6MA==",
    dependencies: {}
  };
  
  // Add morgan dependency
  packageLock.dependencies.morgan = {
    version: "1.10.0",
    resolved: "https://registry.npmjs.org/morgan/-/morgan-1.10.0.tgz",
    integrity: "sha512-AbegBVI4sh6El+1gNwvD5YIck7nSA36weD7xvIxG4in80j/UoK8AEGaWnnz8v1GxonMCltmlNs5ZKbGvl9b1XQ==",
    dependencies: {
      "basic-auth": "~2.0.1",
      "debug": "2.6.9",
      "depd": "~2.0.0",
      "on-finished": "~2.3.0",
      "on-headers": "~1.0.2"
    }
  };
  
  // Add morgan's dependencies
  packageLock.dependencies["basic-auth"] = {
    version: "2.0.1",
    resolved: "https://registry.npmjs.org/basic-auth/-/basic-auth-2.0.1.tgz",
    integrity: "sha512-NF+epuEdnUYVlGuhaxbbq+dvJttwLnGY+YixlXlME5KpQ5W3CnXA5cVTneY3SPbPDRkcjMbifrwmFYcClgOZeg==",
    dependencies: {
      "safe-buffer": "5.1.2"
    }
  };
  
  if (!packageLock.dependencies.debug) {
    packageLock.dependencies.debug = {
      version: "2.6.9",
      resolved: "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      integrity: "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      dependencies: {
        "ms": "2.0.0"
      }
    };
  }
  
  packageLock.dependencies["on-finished"] = {
    version: "2.3.0",
    resolved: "https://registry.npmjs.org/on-finished/-/on-finished-2.3.0.tgz",
    integrity: "sha512-ikqdkGAAyf/X/gPhXGvfgAytDZtDbr+bkNUJ0N9h5MI/dmdgCs3l6hoHrcUv41sRKew3jIwrp4qQDXiK99Utww==",
    dependencies: {
      "ee-first": "1.1.1"
    }
  };
  
  packageLock.dependencies["on-headers"] = {
    version: "1.0.2",
    resolved: "https://registry.npmjs.org/on-headers/-/on-headers-1.0.2.tgz",
    integrity: "sha512-pZAE+FJLoyITytdqK0U5s+FIpjN0JP3OzFi/u8Rx+EV5/W+JTWGXG8xFzevE7AjBfDqHv/8vL8qQsIhHnqRkrA==",
    dependencies: {}
  };
  
  packageLock.dependencies["safe-buffer"] = {
    version: "5.1.2",
    resolved: "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.1.2.tgz",
    integrity: "sha512-Gd2UZBJDkXlY7GbJxfsE8/nvKkUEU1G38c1siN6QP6a9PT9MmHB8GnpscSmMJSoF8LOIrt8ud/wPtojys4G6+g==",
    dependencies: {}
  };
  
  packageLock.dependencies["ms"] = {
    version: "2.0.0",
    resolved: "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
    integrity: "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
    dependencies: {}
  };
  
  // Write the updated package-lock.json back
  fs.writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2));
  console.log('Successfully updated package-lock.json with helmet and morgan dependencies');
} catch (error) {
  console.error('Error updating package-lock.json:', error);
} 