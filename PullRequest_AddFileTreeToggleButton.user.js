// ==UserScript==
// @name         VSTS - Pull Request - Add File Tree Toggle Button
// @namespace    https://github.com/Hogbyte
// @version      18.09.04
// @run-at       document-start
// @description  Adds the toggle button to the VSTS/TFS Pull Request File Tree splitter.
// @author       David Christensen
// @match        https://*.visualstudio.com/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    // VSS splitter control information:
    // https://docs.microsoft.com/en-us/vsts/extend/develop/ui-controls/splittero?view=vsts

    // Add an event listener to detect when DOM Nodes are added,
    // and manipulate the VSS "splitter" elements to force the toggle button to be present.
    document.addEventListener("DOMNodeInserted", event => {
        // Verify that we are on a "pull request" page
        if (window.location.pathname.indexOf("/pullrequest/") < 0) { return; }

        // Grab a reference to the new element
        let newElement = event.target;

        // We only care about div elements
        if (newElement.tagName === "DIV") {
            // Next, only act based on certain CSS classes being present
            if (newElement.classList.contains("splitter")) {
                // The splitter host element is being added, make sure that the toggle button is enabled
                newElement.classList.add("toggle-button-enabled");

            } else if (newElement.classList.contains("handleBar")) {
                // Add label to the handle bar
                newElement.innerHTML =
                    '<div class="handlebar-label" title="File Tree">' +
                    '<span class="handlebar-label-text">File Tree</span>' +
                    '</div>';
            }
        }
    });

})();
