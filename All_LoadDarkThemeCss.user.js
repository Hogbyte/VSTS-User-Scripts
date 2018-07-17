// ==UserScript==
// @name         VSTS - Load Dark Theme CSS
// @namespace    https://github.com/Hogbyte
// @version      18.07.16
// @description  Loads a remote CSS file to apply a dark theme to the VSTS/TFS web portal
// @author       David Christensen
// @match        https://*.visualstudio.com/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    const CSS_FILE_URL = "https://cdn.rawgit.com/Hogbyte/VSTS-User-Scripts/master/Themes/ZachPosten_VstsDark.css";

    let linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.type = "text/css";
    linkElement.href = CSS_FILE_URL;

    document.head.appendChild(linkElement);
})();
