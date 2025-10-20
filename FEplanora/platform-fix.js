import { execSync } from 'child_process';
import os from 'os';

const platform = os.platform();
const arch = os.arch();

try {
  // Remove any existing platform-specific rollup packages
  const removeCmd = 'npm uninstall @rollup/rollup-linux-x64-gnu @rollup/rollup-win32-x64-msvc @rollup/rollup-darwin-x64';
  console.log('Removing existing platform-specific packages...');
  execSync(removeCmd, { stdio: 'inherit' });

  // Install the correct platform-specific package
  let installPackage = '';
  if (platform === 'linux' && arch === 'x64') {
    installPackage = '@rollup/rollup-linux-x64-gnu';
  } else if (platform === 'win32' && arch === 'x64') {
    installPackage = '@rollup/rollup-win32-x64-msvc';
  } else if (platform === 'darwin' && arch === 'x64') {
    installPackage = '@rollup/rollup-darwin-x64';
  }

  if (installPackage) {
    console.log(`Installing platform-specific package: ${installPackage}`);
    execSync(`npm install --save-optional ${installPackage}`, { stdio: 'inherit' });
    console.log('Platform-specific installation completed successfully.');
  } else {
    console.log(`No specific Rollup package found for platform: ${platform} ${arch}`);
  }
} catch (error) {
  console.error('Error during platform-specific installation:', error);
  process.exit(1);
}