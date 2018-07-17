// ==UserScript==
// @name         VSTS - Pull Request - Add File Check Boxes
// @namespace    https://github.com/Hogbyte
// @version      18.07.12
// @description  Add check boxes next to files on the VSTS/TFS Pull Request file tree.
// @author       David Christensen
// @match        https://*.visualstudio.com/*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    // TODO: Script uses localStorage but never deletes old pull request data
    // may need to change this if the browser does not handle this for us

    // TODO: Because VSTS dynamically adds/removes HTML elements, memory leaks are
    // likely because event listeners added by this script are not cleaned up

    // Script Options
    const _options = {
        logEnabled: false, // Set to true to log informational messages to the JavaScript console
        confirmUncheckClick: true, // Set to false to remove confirmation on "Uncheck All/Visible" buttons
        intervalMs: 1000 // Milliseconds between processing intervals (when the script checks for new file tree nodes)
    };

    // Constants
    const LOG_PREFIX = "**LOG**";
    const CSS_CLASS_UNCHECK_BUTTON_CONTAINER = "custom-css-uncheck-button-container";
    const CSS_CLASS_FILE_CHECKBOX = "custom-css-file-checkbox";
    const LOCAL_STORAGE_KEY_PREFIX = "PullRequest_CheckedFiles_";

    // Script state
    const _state = {
        pullRequestId: null,
        filesChecked: [],
        previousTreeRowElements: []
    };

    function log(...itemsToLog) {
        if (!_options.logEnabled) { return; }
        console.info(LOG_PREFIX, ...itemsToLog);
    }

    function getPullRequestId() {
        // The pull request ID is the last segment on the path
        let pathItems = window.location.pathname.split("/");
        return Number(pathItems[pathItems.length - 1]);
    }

    function getFileListStorageKey(pullRequestId) {
        return `${LOCAL_STORAGE_KEY_PREFIX}${pullRequestId}`;
    }

    function saveFileList(pullRequestId, fileList) {
        let storageKey = getFileListStorageKey(pullRequestId),
            storageTimeStamp = new Date().getTime(),
            storageData = { timeStamp: storageTimeStamp, files: fileList },
            storageDataString = JSON.stringify(storageData);
        localStorage.setItem(storageKey, storageDataString);
        log("File List Saved:", storageData);
    }

    function loadFileList(pullRequestId) {
        let storageKey = getFileListStorageKey(pullRequestId),
            storageDataString = localStorage.getItem(storageKey),
            storageData = storageDataString ? JSON.parse(storageDataString) : {},
            fileList = storageData.files || [];
        log("File List Loaded:", fileList);
        return fileList;
    }

    function isFile(typeIconElement) {
        // Rows that represent files have bowtie-file* CSS class
        let classNames = typeIconElement.className.split(" ");
        for (let className of classNames) {
            if (className.indexOf("bowtie-file") === 0) { return true; }
        }
        return false;
    }

    function getFilePath(cellElement) {
        // The full path is stored on the 'content' attribute of the element
        let contentAttributeValue = cellElement.getAttribute("content");
        if (!contentAttributeValue) { return null; }

        // Only need the text up to the first space
        return contentAttributeValue.split(" ")[0];
    }

    function checkBoxClickHandler(event) {
        // Stop check box clicks from selecting the file
        event.stopPropagation();
    }

    function checkBoxCheckHandler(event) {
        // Grab check box information
        let checkBoxElement = event.target,
            filePath = checkBoxElement.value;

        // Update the file list
        let currentIndex = _state.filesChecked.indexOf(filePath);
        if (currentIndex < 0 && checkBoxElement.checked) {
            // Add the file to the list
            _state.filesChecked.push(filePath);
            saveFileList(_state.pullRequestId, _state.filesChecked);
        } else if (currentIndex >= 0 && !checkBoxElement.checked) {
            // Remove the file from the list
            _state.filesChecked.splice(currentIndex, 1);
            saveFileList(_state.pullRequestId, _state.filesChecked);
        }
    }

    function createFileCheckBox(filePath, fileIsChecked) {
        // Create the check box element
        let checkBoxElement = document.createElement("input");
        checkBoxElement.type = "checkbox";
        checkBoxElement.checked = fileIsChecked;
        checkBoxElement.value = filePath;
        checkBoxElement.title = "Done";
        checkBoxElement.className = CSS_CLASS_FILE_CHECKBOX;

        // Set styles
        checkBoxElement.style.cursor = "default";
        checkBoxElement.style.width = "13px";
        checkBoxElement.style.height = "13px";
        checkBoxElement.style.padding = "0";
        checkBoxElement.style.margin = "9px -13px 0 0";

        // Add event handlers
        checkBoxElement.addEventListener("click", checkBoxClickHandler);
        checkBoxElement.addEventListener("change", checkBoxCheckHandler);

        // Return the checkbox
        return checkBoxElement;
    }

    function uncheckFiles(allFiles) {
        // Confirm action
        let confirmText = allFiles ? "Uncheck all of the files?" : "Uncheck visible files?";
        let isConfirmed = _options.confirmUncheckClick ? confirm(confirmText) : true;
        if (!isConfirmed) { return; }

        // Always need to grab all of the checkbox elements and uncheck them
        let fileCheckBoxElements = [...document.querySelectorAll(`.${CSS_CLASS_FILE_CHECKBOX}`)];
        fileCheckBoxElements.forEach(fileCheckBox => { fileCheckBox.checked = false; });

        // Update the checked file list
        if (allFiles) {
            _state.filesChecked = [];
        } else {
            fileCheckBoxElements.forEach(fileCheckBox => {
                let currentIndex = _state.filesChecked.indexOf(fileCheckBox.value);
                if (currentIndex >= 0) { _state.filesChecked.splice(currentIndex, 1); }
            });
        }
        saveFileList(_state.pullRequestId, _state.filesChecked);
    }

    function addUncheckButtonsIfNeeded() {
        // Skip if the buttons were already added
        let containerElement = document.querySelector(`.${CSS_CLASS_UNCHECK_BUTTON_CONTAINER}`);
        if (containerElement) { return; }

        // First find the file tree (add within the scrollable tree container to not mess up the tree CSS sizing)
        let treeElement = document.querySelector(".tree");
        if (!treeElement) {
            log("File tree element not found.");
            return false;
        }

        // Create the container element
        containerElement = document.createElement("div");
        containerElement.className = CSS_CLASS_UNCHECK_BUTTON_CONTAINER;

        // Create the "Uncheck All" button
        let uncheckAllButton = document.createElement("button");
        uncheckAllButton.innerText = "Uncheck All";
        uncheckAllButton.style.marginLeft = "8px";
        uncheckAllButton.addEventListener("click", () => { uncheckFiles(true); });

        // Create the "Uncheck Visible" button
        let uncheckVisibleButton = document.createElement("button");
        uncheckVisibleButton.innerText = "Uncheck Visible";
        uncheckVisibleButton.style.marginLeft = "8px";
        uncheckVisibleButton.addEventListener("click", () => { uncheckFiles(false); });

        // Add the buttons above the file tree
        containerElement.appendChild(uncheckAllButton);
        containerElement.appendChild(uncheckVisibleButton);
        treeElement.parentNode.insertBefore(containerElement, treeElement);
        return true;
    }

    function processPage() {
        // Skip if we are not on the pull request page
        if (window.location.pathname.indexOf("/pullrequest/") < 0) { return; }

        // Get all tree rows (spread the NodeList into an array)
        let treeRowElements = [...document.querySelectorAll(".tree .tree-row")];
        if (treeRowElements.length === 0) {
            // Nothing found, short-circuit out
            _state.previousTreeRowElements = treeRowElements;
            return;
        }

        // Reset state if a new pull request was loaded
        let pullRequestId = getPullRequestId();
        if (_state.pullRequestId !== pullRequestId) {
            log("New Pull Request ID:", pullRequestId);
            _state.pullRequestId = pullRequestId;
            _state.filesChecked = loadFileList(pullRequestId);
            _state.previousTreeRowElements = [];
        }

        // Process each tree row
        let newTreeRowFound = false;
        for (let rowElement of treeRowElements) {
            // Skip rows that were already processed
            if (_state.previousTreeRowElements.indexOf(rowElement) >= 0) { continue; }
            newTreeRowFound = true;

            // Grab required child elements (skip this row if we can't find all of them)
            let leftSpacerElement = rowElement.querySelector(".tree-left-spacer"),
                cellElement = rowElement.querySelector(".vc-tree-cell"),
                typeIconElement = rowElement.querySelector(".vc-tree-cell > .type-icon");
            if (!(leftSpacerElement && cellElement && typeIconElement)) {
                log("Required child element not found.", "Left Spacer:", leftSpacerElement, "Tree Cell:", cellElement, "Type Icon:", typeIconElement);
                continue;
            }

            // Skip rows that do not represent a file
            if (!isFile(typeIconElement)) {
                log("Row is not for a file:", rowElement);
                continue;
            }

            // Verify that the row has a file path
            let filePath = getFilePath(cellElement);
            if (!filePath) {
                log("Missing file path:", cellElement);
                continue;
            }

            // Determine if the file should be checked
            let fileIsChecked = _state.filesChecked.some(item => item === filePath);

            // Add the check box element
            let checkBoxElement = createFileCheckBox(filePath, fileIsChecked);
            leftSpacerElement.appendChild(checkBoxElement);
        }

        // If a new tree row was found, make sure that the uncheck buttons are in the DOM
        if (newTreeRowFound) { addUncheckButtonsIfNeeded(); }

        // Store the row elements that were processed
        _state.previousTreeRowElements = treeRowElements;
    }

    // Continuously check for new file tree elements in the DOM
    window.setInterval(processPage, _options.intervalMs);

})();
