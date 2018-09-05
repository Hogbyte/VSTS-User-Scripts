# VSTS-User-Scripts
User scripts for Visual Studio Team Services (VSTS) and Team Foundation Server (TFS).

# Instructions
1. Install the Tampermonkey browser extension in the browser of your choice:
  * [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
  * [Microsoft Edge](https://www.microsoft.com/store/apps/9NBLGGH5162S)
  * [Safari](https://safari.tampermonkey.net/tampermonkey.safariextz)
  * [Opera](https://addons.opera.com/en/extensions/details/tampermonkey-beta/)
  * [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
2. Install the user script(s) of your choice:
  *  [All Pages - Load Dark Theme CSS](https://github.com/Hogbyte/VSTS-User-Scripts/raw/master/All_LoadDarkThemeCss.user.js)
  *  [Pull Request List - Add Additional Links](https://github.com/Hogbyte/VSTS-User-Scripts/raw/master/PullRequestList_AddAdditionalLinks.user.js)
  * [Pull Request - Add File Check Boxes](https://github.com/Hogbyte/VSTS-User-Scripts/raw/master/PullRequest_AddFileCheckBoxes.user.js)
  * [Pull Request - Add File Tree Toggle Button](https://github.com/Hogbyte/VSTS-User-Scripts/raw/master/PullRequest_AddFileTreeToggleButton.user.js)
3. On-premis TFS users: Add match rules to apply the user script(s) to your TFS installation:
  * Click on the Tampermonkey icon to the right of the address bar (default location) to view the Tampermonkey pop-up menu
  * Click on the "Dashboard" menu item
  * Click on the script you wish to edit to open the script in the editor
  * Click on the "Settings" tab
  * In the "Includes/Excludes" section, click on the "Add" button that is under the "User matches" text box
  * Enter the URL match rule in the pop-up and click "OK"
  
Note: If the Tampermonkey browser extension is installed, clicking the above links should give you a screen from which you can choose to install the user script(s).
