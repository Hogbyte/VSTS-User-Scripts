// ==UserScript==
// @name         VSTS - Pull Request - Add File Tree Toggle Button
// @namespace    https://github.com/Hogbyte
// @version      18.07.12
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

    // Script state
    let _state = {
        lastPathName: "",
        processInsertedNodes: false
    };

    // Add an event listener to detect when DOM Nodes are added,
    // and manipulate the VSS "splitter" elements to force the toggle button to be present.
    document.addEventListener("DOMNodeInserted", event => {
        // Check for a path change (since the list time that the event has run)
        if (window.location.pathname !== _state.lastPathName) {
            _state.lastPathName = window.location.pathname;
            _state.processInsertedNodes = (_state.lastPathName.indexOf("/pullrequest/") > 0);
        }

        // Skip if inserted nodes should not be processed
        if (!_state.processInsertedNodes) { return; }

        // Grab a reference to the new element
        let newElement = event.target;

        // We only care about div elements
        if (newElement.tagName === "DIV") {
            // Next, only act based on certain CSS classes being present
            if (newElement.classList.contains("splitter")) {
                // The splitter host element is being added, make sure that the toggle button is enabled
                newElement.classList.add("toggle-button-enabled");
                // Splitter host element found, stop processing until a new pull request is loaded (location.pathName changes)
                _state.processInsertedNodes = false;
            }
        }
    });

})();
