/* eslint-disable no-console */
const { exec } = require("child_process");

const justPrint = (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(stderr);
    return;
  }
  console.log(stdout);
};

const args = process.argv.slice(2);
const [command] = args;

switch (command) {
case 'make-update': {
  if(args[1] == null) {
    throw new Error('No release channel specified');
  }
  if([ "development", "preview" ].includes(args[1]) || args[1].startsWith("prod-v")) {
    console.log(`expo publish --release-channel ${args[1]}`);
    exec(`expo publish --release-channel ${args[1]}`, justPrint);
  }
  break;
}
case 'make-build': {
  let profile = null;
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--profile') {
      if([
        "dev-client", "development", "preview", "production"
      ].includes(args[i + 1])) {
        profile = args[i + 1];
      } else if (args[i + 1] == null) {
        throw new Error('No profile specified after profile flag');
      } else {
        throw new Error(`Invalid profile: ${args[i + 1]}`);
      }
      break;
    }
  }
  if (profile == null) {
    throw new Error('No profile specified');
  }
  for (let i = 1; i < args.length; i++) {
    if ([ "android", "ios" ].includes(args[i])) {
      console.log(`eas build --platform=${args[i]} --profile=${profile} --auto-submit`);
      exec(`eas build --platform=${args[i]} --profile=${profile} --auto-submit`, justPrint);
    }
  }
  break;
}
default: {
  throw new Error('Unknown command.');
}
}
