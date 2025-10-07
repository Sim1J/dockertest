https://anandmutyala.medium.com/install-homebrew-in-macos-9ac0e976af3a // This is for installing homebrew -- used to instal node

Follos the commands: 

 `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`- this should start the setup

 `echo $PATH` - check the PATH -- nottorius mac

 `export PATH=$PATH:/opt/homebrew/bin` - Add the PATH

 `node -v` - to check if node was installed

NOTE: If you have node installed in your machine, ignore the steps Above

 `npx create-next-app@latest frontend --yes`
    `cd my-app`
    `npm run dev` -- Create the folder/directory cd into that directory and run it 

