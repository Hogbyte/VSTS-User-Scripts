// ==UserScript==
// @name         VSTS - Pull Requests List - Additional Links
// @namespace    https://github.com/Hogbyte
// @version      18.07.12
// @description  Adds additional links on the Pull Requests list page.
// @author       David Christensen
// @match        https://*.visualstudio.com/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    // Script options
    const _options = {
        filesFullScreen: true, // Set to true to open the files tab in full-screen mode
        intervalMs: 1000 // Milliseconds between processing intervals (when the script checks for new pull request rows)
    };

    // Script constants
    const CSS_PULL_REQUEST_UPDATED = "custom-css-vc-pullRequest-updated";

    function addLink(parentElement, linkText, baseUrl, additionalQueryString) {
        let linkElement = document.createElement("a");
        linkElement.innerText = linkText;
        linkElement.style.fontStyle = "italic";
        linkElement.style.margin = "3px 3px 3px 0";
        linkElement.href = `${baseUrl}?_a=${linkText.toLowerCase()}${additionalQueryString}`;
        linkElement.title = `Open pull request on ${linkText} tab`;
        parentElement.appendChild(linkElement);
    }

    function processPage() {
        // Skip if not on the pull requests list
        let pathName = window.location.pathname;
        if (pathName.indexOf("/pullrequests") < 0 && pathName.indexOf("/_pulls") < 0) {
            return;
        }

        // Grab a list of rows that have not yet been updated
        let pullRequestListRows = [...document.querySelectorAll(`.vc-pullRequest-list-row:not(.${CSS_PULL_REQUEST_UPDATED})`)];

        // Process each row
        for (let row of pullRequestListRows) {
            // Flag the row as updated
            row.classList.add(CSS_PULL_REQUEST_UPDATED);

            // Find the original link element
            let linkElement = row.querySelector("a");
            if (!linkElement) { continue; }

            // Grab the link element's parent node
            let linkParentElement = linkElement.parentNode;

            // Add a link contianer element
            let containerElement = document.createElement("span");
            containerElement.style.marginLeft = "5px";
            linkParentElement.appendChild(containerElement);

            // Add a link elements
            let baseUrl = linkElement.href.split("?")[0];
            containerElement.appendChild(document.createTextNode("["));
            addLink(containerElement, "Files", baseUrl, `&fullScreen=${_options.filesFullScreen}`);
            addLink(containerElement, "Updates", baseUrl, "");
            addLink(containerElement, "Commits", baseUrl, "");
            containerElement.appendChild(document.createTextNode("]"));
        }
    }

    // Periodically check for links to add
    window.setInterval(processPage, 1000);
})();
