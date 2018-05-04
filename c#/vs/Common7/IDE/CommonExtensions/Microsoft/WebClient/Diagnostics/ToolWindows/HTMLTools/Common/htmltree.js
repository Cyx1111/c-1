// Expected global variables:
/*global jQuery toolwindowHelpers */

(function ($) {
    /// <summary>
    ///     HtmlTreeView - JQuery extension for constructing a tree view consisting of tags and attributes, 
    ///     The html tree view object can be initialized by calling htmlTreeView on a jQuery object.
    ///     Requires:
    ///     - htmltree.css
    ///     - itemCollapsedIcon.png
    ///     - itemExpandedIcon.png
    ///     - itemCollapsedDarkThemeIcon.png
    ///     - itemExpandedDarkThemeIcon.png
    /// </summary>
    
    // The number of elements to display before the 'show all' link is shown
    var initialElementLimit = 200;
    
    var methods = {

        // Default constructor
        init: function () {
            /// <summary>
            ///     Creates a new HtmlTreeView for a BPT-HtmlTree-Container
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object for the new HtmlTreeView
            /// </returns>
            
            var rootElement = $("<div class='BPT-HtmlTree'></div>");
            this.append(rootElement);
            
            var useDarkTheme = toolwindowHelpers.isDarkThemeBackground(rootElement);
            if (useDarkTheme) {
                rootElement.addClass("BPT-Tree-DarkTheme");
            } else {
                rootElement.removeClass("BPT-Tree-DarkTheme");
            }
            
            // Attach the event handlers if we need to
            if (!rootElement.data("attachedHandlers")) {
                var container = rootElement.parent(".BPT-HtmlTree-Container");
                
                container.bind("mousedown.htmlTreeView", function (event) {
                    $(this).data("mouseActivate", true);
                });
                
                container.bind("click.htmlTreeView", function (event) {
                    var element = $(event.target);
                    if (!element.is(".BPT-HtmlTree-ChildCollection")) {
                        var row = element.closest(".BPT-HtmlTreeItem");
                        
                        if (row.length > 0) {
                            // If they clicked the expand icon, toggle the row
                            if (element.hasClass("BPT-HtmlTreeItem-ExpandIcon")) {
                                methods.toggle.call(row);
                            }
                            methods.select.call(row);
                        }
                    }
                });
                
                container.bind("dblclick.htmlTreeView", function (event) {
                    var element = $(event.target);
                    var item = element.closest(".BPT-HtmlTreeItem, .BPT-HTML-Attribute-Section, .BPT-HTML-Text, .BPT-HtmlTree-ChildCollection-Pager");
                    
                    if (item.length > 0) {
                        if (item.hasClass("BPT-HtmlTreeItem")) {
                            // Double clicking the row will expand/collapse it
                            if (item.hasClass("BPT-HtmlTreeItem-Collapsed") || item.hasClass("BPT-HtmlTreeItem-Expanded")) {
                                if (!element.hasClass("BPT-HtmlTreeItem-ExpandIcon")) {
                                    methods.toggle.call(item);
                                }
                            }
                        } else if (item.hasClass("BPT-HTML-Attribute-Section") || item.hasClass("BPT-HTML-Text")) {
                            // Double clicking an attribute or inline text will edit it
                            var row = item.parents(".BPT-HtmlTreeItem:first");
                            if (row.length > 0) {
                                var editCallback = row.data("editCallback");
                                editCallback = (editCallback ? editCallback : row.parent().data("editCallback"));
                                
                                if (editCallback) {
                                    editCallback(row, item);
                                    event.stopPropagation();
                                }
                            }
                        }
                    }             
                });                
                
                container.bind("focus.htmlTreeView", function (event) {
                    if (!$(this).data("mouseActivate")) {
                        var element = $(this);
                        var selected = element.children(".BPT-HtmlTree").htmlTreeView("getSelected");
                        if (selected.length === 0) {
                            selected = element.find(".BPT-HtmlTreeItem:not(.BPT-HtmlTreeItem-HiddenRoot):first").htmlTreeView("select");
                        }
                        
                        if (selected && selected.length > 0) {
                            var wasScrolled = toolwindowHelpers.scrollIntoView(selected.children(".BPT-HtmlTreeItem-Header")[0], selected.closest(".BPT-HtmlTree-ScrollContainer")[0]);
                            if (wasScrolled) {
                                event.preventDefault();
                                return false;
                            }
                        }
                    }
                    // Always prevent the default scrolling behavior on focus as it jumps to the top
                    event.preventDefault();
                    $(this).data("mouseActivate", false);
                });
                
                container.bind("keydown.htmlTreeView", function (event) {
                    if (event.keyCode >= 37 && event.keyCode <= 40) { // Arrow Keys
                    
                        // Don't do anything if we are inside an input
                        if ($(document.activeElement).is(":input")) {
                            return;
                        }
                        
                        var selected = methods.getSelected.call($(this).children(":first"));
                        
                        var moveUp = function (toParent) {
                            /// <summary>
                            ///     Moves the selection up to the previous node
                            /// </summary>
                            /// <param name="toParent" type="Boolean" optional="true">
                            ///     Optional parameter specifying if the jumps to parent nodes are allowed (default false)
                            /// </param>  
                            
                            var newElement = null;
                            var sibling = selected.prev(".BPT-HtmlTreeItem:not(.BPT-HtmlTreeItem-HiddenRoot):last");
                            if (sibling.length > 0 && !toParent) {
                                // Find the last child
                                newElement = sibling.find(".BPT-HtmlTreeItem:not(.BPT-HtmlTreeItem-HiddenRoot):last");
                                
                                if (newElement.length === 0) {
                                    // Use the sibling instead
                                    newElement = sibling;
                                }
                            } else {
                                newElement = selected.parents(".BPT-HtmlTreeItem:not(.BPT-HtmlTreeItem-HiddenRoot):first");
                            }
                            
                            if (newElement && newElement.length > 0) {
                                methods.select.call(newElement);
                                toolwindowHelpers.scrollIntoView(newElement.children(".BPT-HtmlTreeItem-Header")[0], newElement.closest(".BPT-HtmlTree-ScrollContainer")[0]);
                                event.preventDefault();
                                return false;
                            }
                        };
                        
                        var moveDown = function () {
                            /// <summary>
                            ///     Moves the selection down to the next node
                            /// </summary>
                            
                            var newElement = selected.find(".BPT-HtmlTreeItem:not(.BPT-HtmlTreeItem-HiddenRoot):first");
                            newElement = (newElement.length > 0 ? newElement : selected.next(".BPT-HtmlTreeItem:first"));
                            
                            var searchedParent = selected;
                            while (newElement.length === 0) {
                                searchedParent = searchedParent.parents(".BPT-HtmlTreeItem:not(.BPT-HtmlTreeItem-HiddenRoot)");
                                if (searchedParent.length === 0) {
                                    break;
                                }
                                newElement = searchedParent.next(".BPT-HtmlTreeItem:not(.BPT-HtmlTreeItem-HiddenRoot):first");
                            }
                            
                            if (newElement && newElement.length > 0) {
                                methods.select.call(newElement);
                                toolwindowHelpers.scrollIntoView(newElement.children(".BPT-HtmlTreeItem-Header")[0], newElement.closest(".BPT-HtmlTree-ScrollContainer")[0]);
                                event.preventDefault();
                                return false;
                            }
                        };
                        
                        if (selected.length > 0) {
                            switch (event.keyCode) {
                                case 37: // Left(37)
                                    if (selected.hasClass("BPT-HtmlTreeItem-Expanded")) {
                                        methods.toggle.call(selected);
                                    } else {
                                        moveUp(true);
                                    }
                                    break;
                                    
                                case 38: // Up(38)
                                    moveUp();
                                    break;
                                    
                                case 39: // Right(39)
                                    if (selected.hasClass("BPT-HtmlTreeItem-Collapsed")) {
                                        methods.toggle.call(selected);
                                    } else if (selected.hasClass("BPT-HtmlTreeItem-Expanded")) {    
                                        moveDown();
                                    }  
                                    break;
                                    
                                case 40: // Down(40)
                                    moveDown();
                                    break;
                            }                        
                        }
                        
                        // Prevent the tree from scrolling with the arrows (matches solution explorer behavior)
                        event.preventDefault();
                        return false;  
                        
                    } else if (event.keyCode === 13 || event.keyCode === 32) { // Enter(13) or Space(32) 
                    
                        // Ensure we are not currently editing
                        if (document.activeElement && document.activeElement.type !== "text") {
                        
                            if (event.keyCode === 32) { // Space(32)
                                // We didn't have an item to click and they were pressing space,
                                // so stop the scroll container from scrolling.
                                return false;
                            }
                            
                            // Find out if this is an editable text node
                            var selectedNode = methods.getSelected.call($(this).children(":first"));
                            
                            // Find out if this is a 'show all' link
                            var isShowAllLink = selectedNode.hasClass("BPT-HtmlTree-ChildCollection-ShowAll");
                            if (isShowAllLink) {
                                selectedNode.click();
                                return;
                            }
                            
                            // Find out if this is an editable text node
                            var text = selectedNode.find(".BPT-HtmlTreeItem-Header:first > .BPT-HTML > .BPT-HTML-Text:last");
                            if (text.length === 1) {
                                // Found a text node, so emulate a double click
                                event.preventDefault();
                                event.stopImmediatePropagation();
                                text.trigger("dblclick");
                            }
                        }
                    }
                });
                container = null;
                rootElement.data("attachedHandlers", true);
            }
            
            return this;
        },
        
        destroy : function () {
            /// <summary>
            ///     Disposes of an HtmlTreeView and removes all data and event handlers
            /// </summary>  
            
            // Remove event handlers
            if (this.data("attachedHandlers")) {
                this.children(".BPT-HtmlTree-Container").unbind(".htmlTreeView");
                this.data("attachedHandlers", false);
            }
        },
        
        addRootElement: function (uid, tag, rootTagToShow, toggleCallback, editCallback, selectCallback) {
            /// <summary>
            ///     Adds a single element that will act as the root for this HtmlTreeView
            /// </summary>
            /// <param name="uid" type="String">
            ///     A unique id to assign to this element
            /// </param>  
            /// <param name="tag" type="String">
            ///     The tag to use in the display (#document tags will be hidden)
            /// </param>  
            /// <param name="rootTagToShow" type="String">
            ///     The text to use for the root element's tag.
            ///     If this is null or an empty string, no root node will be shown.
            /// </param>  
            /// <param name="toggleCallback" type="Function">
            ///     An optional callback that will be triggered when the element is toggled
            /// </param>  
            /// <param name="editCallback" type="Function">
            ///     An optional callback that will be triggered when an attribute is double clicked
            /// </param>              
            /// <param name="selectCallback" type="Function">
            ///     An optional callback that will be triggered when the element is selected
            /// </param>            
            /// <returns type="Object">
            ///     The jquery object that was created
            /// </returns> 
            
            if (toggleCallback) {
                this.data({
                    toggleCallback: toggleCallback
                });
            }
            
            var newElements = [{uid: uid, tag: tag, text: "", hasChildren: (toggleCallback ? true : false), attributes: null, rootTagToShow: rootTagToShow}];
            
            var rootElement = methods.addElements.call(this, newElements, toggleCallback, editCallback, selectCallback).children(":first");
            return rootElement;
        },
        
        addElements: function (elements, toggleCallback, editCallback, selectCallback, keepExistingElements, stopAutoScroll) {
            /// <summary>
            ///     Adds an array of elements to the HtmlTreeItem
            /// </summary>
            /// <param name="elements" type="Array">
            ///     An array of objects that describe the children elements, in the following format:
            ///     [{uid: String, tag: String, text: String, hasChildren: Boolean, attributes: [{name:String, value: String}]}]
            /// </param>  
            /// <param name="toggleCallback" type="Function">
            ///     An optional callback that will be triggered when a child element is toggled
            /// </param>  
            /// <param name="editCallback" type="Function">
            ///     An optional callback that will be triggered when an attribute is double clicked
            /// </param>              
            /// <param name="selectCallback" type="Function">
            ///     An optional callback that will be triggered when a child element is selected
            /// </param>   
            /// <param name="keepExistingElements" type="Boolean" optional="true">
            ///     An optional parameter that specifies if we should keep any existing children
            ///     If false (or not specified) all children elements will be replaced with the new ones
            /// </param> 
            /// <param name="stopAutoScroll" type="Boolean" optional="true">
            ///     An optional parameter that specifies if we should not auto scroll the new items into view
            /// </param> 
            /// <returns type="Object">
            ///     A jquery object that was created that contains all the new elements wrapped in a span
            /// </returns> 
            
            var newElementsString = "<span class='BPT-HtmlTree-ChildCollection'>";
            
            var isShowingAll = true;
            var elementCount = elements.length;
            
            if (!this.data("forceShowAll")) {
                // Set the limit of nodes to display
                if (elementCount > initialElementLimit) {
                    elementCount = initialElementLimit;
                    isShowingAll = false;
                }
            }
            
            var existingIdMap = {};
            if (keepExistingElements) {
                // Generate a map of the existing element id's, so we don't overwrite ones that haven't changed
                var existingElements = this.children(".BPT-HtmlTree-ChildCollection").children();
                for (var elementIndex = 0; elementIndex < existingElements.length; elementIndex++) {
                    var uid = $(existingElements[elementIndex]).attr("data-id");
                    existingIdMap[uid] = true;
                }
            }
            
            for (var i = 0; i < elementCount; i++) {
            
                // Get the properties of this new element
                var id = elements[i].uid;
                var tag = elements[i].tag;
                var text = elements[i].text;
                var isExpandable = elements[i].hasChildren;
                var attributes = elements[i].attributes;
                var rootTagToShow = elements[i].rootTagToShow;
                
                if (!tag && (!text || !$.trim(text))) {
                    // Ignore empty text nodes
                    continue;
                }
                
                if (keepExistingElements && existingIdMap[id]) {
                    // Add a fake element as this id already exists and so we will just replace it with the original one
                    newElementsString += "<div class='replaceMe' data-id='" + id + "'></div>";
                    continue;
                }
                
                if (text) {
                    // Escape the < > for the text
                    text = toolwindowHelpers.htmlEscape(text);
                }
                
                // Create the header and footer
                var header;
                var footer;
                if (tag === "#document") {
                    // Document nodes
                    var rootHeader = "";
                    var rootFooter = "";
                    if (rootTagToShow) {
                        // Show a tag name for this document
                        var safeRootTag = toolwindowHelpers.htmlEscape(rootTagToShow);
                        rootHeader = "<span class='BPT-HTML'>&lt;</span><span class='BPT-HTML-Tag'>" + safeRootTag + "</span><span class='BPT-HTML'>&gt;</span>";
                        rootFooter = "<span class='BPT-HTML'>&lt;/</span><span class='BPT-HTML-Tag'>" + safeRootTag + "</span><span class='BPT-HTML'>&gt;</span>";
                    }
                    header = "<span class='BPT-HTML-Document'>" + rootHeader + "</span>";
                    footer = "<span class='BPT-HTML-Document'>" + rootFooter + "</span>";
                } else if (tag === "#doctype") {
                    // DocType nodes
                    header = "<span class='BPT-HTML-DocType'></span>";
                    footer = "<span class='BPT-HTML-DocType'></span>";
                } else if (tag === "#comment") {
                    // Comment nodes
                    header = "<span class='BPT-HTML-Comment'>&lt;!--</span>";
                    footer = "<span class='BPT-HTML-Comment'>--&gt;</span>";
                } else if (tag === null || tag === undefined) {
                    // Text nodes
                    header = "<span class='BPT-HTML-Text'></span>";
                    footer = "<span class='BPT-HTML-Text'></span>";
                } else {
                    // For All other nodes - Create the attributes if we have any
                    var attributesString = "";
                    if (attributes && attributes.length > 0) {
                        for (var j = 0; j < attributes.length; j++) {
                            attributesString += "<span class='BPT-HTML-Attribute-Section'> <span class='BPT-HTML-Attribute'>" + attributes[j].name + "</span><span class='BPT-HTML-Operator'>=</span>\"" +
                                                "<span class='BPT-HTML-Value' data-attrName='" + attributes[j].name + "'>" + toolwindowHelpers.htmlEscape(attributes[j].value) + "</span>\"</span>";
                        }
                    }
                    
                    header = "&lt;<span class='BPT-HTML-Tag'>" + tag + "</span>" + attributesString + "<span class='BPT-HTML'>&gt;</span>";
                    footer = "&lt;/<span class='BPT-HTML-Tag'>" + tag + "</span><span class='BPT-HTML'>&gt;</span>";
                }

                var textContent = (text ? "<span class='BPT-HTML-Text'>" + text + "</span>" : "");
                
                var collapsedFooter = "<span class='BPT-HtmlTreeItem-CollapsedFooter'>" + (isExpandable ? "..." : "") + "<span class='BPT-HTML'>" + footer + "</span></span>";
                var expandIcon = (isExpandable ? "<div class='BPT-HtmlTreeItem-ExpandIcon' />" : "");
                var expandClass = (isExpandable ? " BPT-HtmlTreeItem-Collapsed" : "");
                
                // Document nodes should be hidden
                if (tag === "#document" && !rootTagToShow) {
                    textContent = "";
                    collapsedFooter = "";
                    expandIcon = "";
                    expandClass = " BPT-HtmlTreeItem-HiddenRoot BPT-HtmlTreeItem-Collapsed";
                }
                
                // Check for node numbering
                var nodeIndex = "";
                if (this.attr("data-tag") === "NodeList" || this.attr("data-tag") === "HtmlCollection") {
                    nodeIndex = "<span class='BPT-HTML BPT-HTML-Text BPT-HTML-Numbering'>" + i + "</span>";
                }
                
                newElementsString += "<div class='BPT-HtmlTreeItem" + expandClass + "' data-id='" + id + "' data-tag='" + (tag ? tag : "") + "'>" + expandIcon + "<div class='BPT-HtmlTreeItem-Header'>" + nodeIndex + "<span class='BPT-HTML'>" + header + textContent + "</span>" + collapsedFooter + "</div><div class='BPT-HtmlTreeItem-Footer'><span class='BPT-HTML'>" + footer + "</span></div></div>";
            }

            if (!isShowingAll) {
                // Add the 'show all' link
                newElementsString += "<span class='BPT-HtmlTree-ChildCollection-ShowAll BPT-HtmlTreeItem'>" + "Showing " + elementCount + " of " + elements.length + ". Click to show all" + "</span>";
            }
            
            newElementsString += "</span>";

            // Create the new children
            var childrenCollection = $(newElementsString);
            if (toggleCallback || editCallback || selectCallback) {
                childrenCollection.data({
                    toggleCallback: toggleCallback,
                    editCallback: editCallback,
                    selectCallback: selectCallback
                });
            }
            
            var isFirstRow = !(this.hasClass("BPT-HtmlTreeItem"));
            if (isFirstRow) {
                // Append a new children collection span to the tree
                this.children(".BPT-HtmlTree").append(childrenCollection);
            } else {
                // Check to see if we need to replace nodes before appending them
                if (keepExistingElements) {
                    var existingChildrenCollection = this.children(".BPT-HtmlTree-ChildCollection");
                    if (existingChildrenCollection.length > 0) {
                        // Go through the new children and replace any fake nodes
                        var replaceableChildren = childrenCollection.children("div.replaceMe");
                        for (var index = 0; index < replaceableChildren.length; index++) {
                            // Get the id
                            var replaceableChild = $(replaceableChildren[index]);
                            var idToReplace = replaceableChild.attr("data-id");
                            
                            // Replace the node
                            var existingElement = existingChildrenCollection.children("div.BPT-HtmlTreeItem[data-id='" + idToReplace + "']");
                            replaceableChild.replaceWith(existingElement);
                        }
                        
                        // Check if the selected item is being removed, if so select another row
                        var selectedId = methods.getSelected.call(this).attr("data-id");
                        if (selectedId && existingIdMap[selectedId]) {
                            var found = childrenCollection.children("[data-id='" + selectedId + "'");
                            if (found.length === 0) {
                                // Select the closest available row
                                methods.select.call(this.closest(".BPT-HtmlTreeItem"));
                            }
                        }
                        
                        // Remove the existing collection, so we can replace it with the new one
                        existingChildrenCollection.remove();
                    }
                }
                
                // Append a new children collection span after the item's header
                this.children(".BPT-HtmlTreeItem-Header").after(childrenCollection);
            }

            if (!isShowingAll) {
                // We need to add the link handler
                var row = this;
                var showAll = childrenCollection.children(".BPT-HtmlTree-ChildCollection-ShowAll");
                if (showAll.length > 0) {
                
                    // Add the handler for clicking the link
                    showAll.bind("click", function (event) {
                        if (event.type === "click") {
                            row.data("forceShowAll", true);
                            methods.toggle.call(row);
                            methods.toggle.call(row);
                            row = null;
                        }
                    });
                }
            }
            
            if (!stopAutoScroll) {
                // Scroll the element to the top if the last child is out of view
                window.setTimeout(function () {
                    var child = childrenCollection.children().last();
                    var scrollContainer = child.closest(".BPT-HtmlTree-ScrollContainer")[0];
                    
                    // Don't move horizontally
                    if (scrollContainer) {
                        var x = scrollContainer.scrollLeft;
                        if (toolwindowHelpers.scrollIntoView(child.children(".BPT-HtmlTreeItem-Header")[0], scrollContainer)) {
                            childrenCollection.parent()[0].scrollIntoView(true);
                            scrollContainer.scrollLeft = x;
                        }
                    }
                }, 0);
            }

            return childrenCollection;
        },
        
        addAttribute: function (name, value) {
            /// <summary>
            ///     Adds an attribute to an HtmlTreeItem in the correct position
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object that the attribute was added to
            /// </returns>
            
            var attributesString = "<span class='BPT-HTML-Attribute-Section'> <span class='BPT-HTML-Attribute'>" + name + "</span><span class='BPT-HTML-Operator'>=</span>\"" +
                                   "<span class='BPT-HTML-Value' data-attrName='" + name + "'>" + value + "</span>\"</span>";

            // Add the new attribute after the existing ones
            var existingAttributes = this.find(".BPT-HtmlTreeItem-Header .BPT-HTML:first").children(".BPT-HTML-Attribute-Section");
            if (existingAttributes.length === 0) {
                this.find(".BPT-HtmlTreeItem-Header .BPT-HTML-Tag:first").after($(attributesString));
            } else {
                $(existingAttributes[existingAttributes.length - 1]).after($(attributesString));
            }
            
            return this;
        },
        
        showLoading: function (text) {
            /// <summary>
            ///     Shows a loading message if the item does not already have one
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object
            /// </returns>
            
            if (!this.hasClass("BPT-HtmlTreeItem-ShowingLoader")) {
                var newRowHtml = "<div class='BPT-HtmlTreeItem BPT-HtmlTreeItem-Loading'>" + text + "</div>";
                this.children(".BPT-HtmlTreeItem-Header").append($(newRowHtml));
                this.addClass("BPT-HtmlTreeItem-ShowingLoader");
            }
            return this;
        },
        
        hideLoading: function () {
            /// <summary>
            ///     Removes an existing loading message
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object
            /// </returns>        

            if (this.hasClass("BPT-HtmlTreeItem-ShowingLoader")) {
                this.removeClass("BPT-HtmlTreeItem-ShowingLoader");
                this.children(".BPT-HtmlTreeItem-Header").children(".BPT-HtmlTreeItem-Loading").remove();
            }
            return this;
        },        
        
        getChildren: function () {
            /// <summary>
            ///     Gets a jquery object of the children of this HtmlTreeItem
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object of the children
            /// </returns>
            
            return this.children(".BPT-HtmlTree-ChildCollection").children(".BPT-HtmlTreeItem");
        },
        
        isCollapsed: function () {
            /// <summary>
            ///     Gets the collasped state of the HtmlTreeItem
            /// </summary>  
            /// <returns type="Object">
            ///     True if the HtmlTreeItem is collapsed, false if it is expanded
            /// </returns>
            
            return this.hasClass("BPT-HtmlTreeItem-Collapsed");
        },
        
        isExpanded: function () {
            /// <summary>
            ///     Gets the expanded state of the HtmlTreeItem
            /// </summary>  
            /// <returns type="Object">
            ///     True if the HtmlTreeItem is expanded, false if it is collapsed
            /// </returns>
            
            return this.hasClass("BPT-HtmlTreeItem-Expanded");
        },
        
        changeExpandableState: function (nowExpandable) {
            /// <summary>
            ///     Changes the state of an HtmlTreeItem element to be expandable or not
            /// </summary>  
            /// <param name="nowExpandable" type="Boolean">
            ///     True if the element should now be expandable, False otherwise
            /// </param>              
            /// <returns type="Object">
            ///     The jquery object that was changed
            /// </returns> 
            
            if (nowExpandable) {
                // Now expandable
                var expandIcon = $("<div class='BPT-HtmlTreeItem-ExpandIcon' />");
                this.prepend(expandIcon);
                
                this.find(".BPT-HtmlTreeItem-CollapsedFooter").prepend($("<span>...</span>"));
                this.find(".BPT-HTML-Text").remove();

                // Starts off collapsed if we have children
                this.addClass("BPT-HtmlTreeItem-Collapsed");
            } else {
                // No longer expandable
                this.remove(".BPT-HtmlTreeItem-ExpandIcon");
                this.find(".BPT-HtmlTreeItem-CollapsedFooter").remove(":first-child");
            }
            
            return this;
        },
        
        toggle: function (onExpandComplete) {
            /// <summary>
            ///     Toggles a row between collapsed and expanded views
            /// </summary>
            /// <param name="onExpandComplete" type="Function">
            ///     An optional callback that will be triggered when the toggle expansion has finished
            /// </param>            
            /// <returns type="Object">
            ///     The jquery object that was toggled
            /// </returns> 
        
            // Get the callback
            var toggleCallback = this.data("toggleCallback");
            toggleCallback = (toggleCallback ? toggleCallback : this.parent().data("toggleCallback"));
            
            // If it has a callback then it can be expanded
            if (toggleCallback) {
                // Fire the Begin code marker
                toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsTreeViewToggleBegin);
            
                if (this.hasClass("BPT-HtmlTreeItem-Collapsed")) {
                    // Expand
                    this.removeClass("BPT-HtmlTreeItem-Collapsed");
                    toggleCallback(true, this, this.attr("data-id"), onExpandComplete);
                    this.addClass("BPT-HtmlTreeItem-Expanded");
                } else {
                
                    if (this.hasClass("BPT-HtmlTreeItem-HiddenRoot")) {
                        return this;
                    }
                
                    // Collapse
                    this.removeClass("BPT-HtmlTreeItem-Expanded");
                    toggleCallback(false, this, this.attr("data-id"));
                    this.children(".BPT-HtmlTree-ChildCollection").remove();
                    this.addClass("BPT-HtmlTreeItem-Collapsed");

                    // Fire the End code marker
                    toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsTreeViewToggleEnd);
                }
            }
            return this;
        },
        
        getSelected: function () {
            /// <summary>
            ///     Gets the currently selected HtmlTreeItem
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object that is selected
            /// </returns> 
            
            if (this.hasClass("BPT-HtmlTreeItem-Selected")) {
                return this;
            }
            
            var rootElement = this.closest(".BPT-HtmlTree");
            rootElement = (rootElement.length > 0 ? rootElement : this);
            return rootElement.find(".BPT-HtmlTreeItem-Selected:first");
        },
        
        select: function () {
            /// <summary>
            ///     Selects the HtmlTreeItem
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object that was selected
            /// </returns> 
            
            var rootElement = this.closest(".BPT-HtmlTree");
            rootElement.find(".BPT-HtmlTreeItem-Selected").removeClass("BPT-HtmlTreeItem-Selected");

            this.addClass("BPT-HtmlTreeItem-Selected");
            
            var selectCallback = this.data("selectCallback");
            selectCallback = (selectCallback ? selectCallback : this.parent().data("selectCallback"));
            if (selectCallback) {
                selectCallback(this, this.attr("data-id"), this.attr("data-tag"));
            }
            return this;
        },
        
        clear: function () {
            /// <summary>
            ///     Removes all children
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object that was cleared
            /// </returns> 
            
            // We are removing all our children, so select ourselves instead (the parent node)
            var selectedChild = this.children().find(".BPT-HtmlTreeItem-Selected");
            if (selectedChild.length > 0) {
                methods.select.call(this);
            }
            
            this.children(".BPT-HtmlTree-ChildCollection").remove();
            if (this.hasClass("BPT-HtmlTree-Container")) {
                this.removeAttr("tabindex");
            }
            return this;
        }
    };

    $.fn.htmlTreeView = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            return methods.init.apply(this, arguments);
        }
    };
}(jQuery));


// SIG // Begin signature block
// SIG // MIIaOAYJKoZIhvcNAQcCoIIaKTCCGiUCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFE4X6c4yMV0C
// SIG // IqCrOXQxSv6G8mYHoIIVLTCCBKAwggOIoAMCAQICCmEZ
// SIG // zJMAAQAAAGYwDQYJKoZIhvcNAQEFBQAweTELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0IENv
// SIG // ZGUgU2lnbmluZyBQQ0EwHhcNMTExMDEwMjAzMjI1WhcN
// SIG // MTMwMTEwMjAzMjI1WjCBgzELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjENMAsGA1UECxMETU9QUjEeMBwGA1UEAxMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMIIBIjANBgkqhkiG9w0BAQEF
// SIG // AAOCAQ8AMIIBCgKCAQEA7lu+fREk44YG4Gb/SLUXvQLk
// SIG // tAwy8HI+fS6H106hsadDL/dlnjHhMjFFrtfBJIQh1y61
// SIG // hH76NdNTHNe2UR5Pzma567cMAv0pXK2oh/bKIrTVvwh1
// SIG // 9Ypwj2PX74oe6Y9DJGRa04d9kG07rHbNVzZ96LwQVqyY
// SIG // 8IldLmTGryYJXh5jFfE9vxaPmYgCwzC3wQtgHw9yzNa3
// SIG // qDUShpuhCwrmk1uO+lScwfMZX0KNEp8dP5C3JxODGTKC
// SIG // HfPZh9QhsjyitgdP1ySq7o31s9n6+TlPp+nyr1lS9NxB
// SIG // my8RcGPd6t6q8W0hBBBTM7uyT8XhU7JBZUduN/a86ZsW
// SIG // QZFrLlswwwIDAQABo4IBHTCCARkwEwYDVR0lBAwwCgYI
// SIG // KwYBBQUHAwMwHQYDVR0OBBYEFBtSDvMRKrfAicMRgT3U
// SIG // lli5o1NuMA4GA1UdDwEB/wQEAwIHgDAfBgNVHSMEGDAW
// SIG // gBTLEejK0rQWWAHJNy4zFha5TJoKHzBWBgNVHR8ETzBN
// SIG // MEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NybC9wcm9kdWN0cy9NaWNDb2RTaWdQQ0FfMDgt
// SIG // MzEtMjAxMC5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsG
// SIG // AQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NlcnRzL01pY0NvZFNpZ1BDQV8wOC0zMS0yMDEw
// SIG // LmNydDANBgkqhkiG9w0BAQUFAAOCAQEApVs2bK1Om2kS
// SIG // 42+KAptpd8NsZHIoiNk9RW0sGHvUKC8T4llqG8ILNLeK
// SIG // /eq5lOwHMeZq9HUE06faXjoGnhD9qQ29nFFDb/9nlJzh
// SIG // z3zwJLA1zINd7trAbzZJwFoKV/Zz4Z7z4whMOz4vzNLN
// SIG // 7k8icPcEHwKmS5u4j1yIDjaUbDMHuKmtUaDQwtyOIhK9
// SIG // w9+C11ah993wpSBXEBCd7qyGdGxxm8Hw8sJwXqfbbU03
// SIG // WJlNeUDQNF1aJa5n6xtORgawjCkfoxCPpTOfI9X4tUZ9
// SIG // 4O5jmJBLPgWoL7AYs1mkr0FTjggFEC0qyToGTBwuqTFR
// SIG // VmSsmsysl5gpipeQh+qdtjCCBLowggOioAMCAQICCmEC
// SIG // jkIAAAAAAB8wDQYJKoZIhvcNAQEFBQAwdzELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBMB4XDTEyMDEwOTIyMjU1OFoXDTEz
// SIG // MDQwOTIyMjU1OFowgbMxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // DTALBgNVBAsTBE1PUFIxJzAlBgNVBAsTHm5DaXBoZXIg
// SIG // RFNFIEVTTjpGNTI4LTM3NzctOEE3NjElMCMGA1UEAxMc
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIw
// SIG // DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJbsjkdN
// SIG // VMJclYDXTgs9v5dDw0vjYGcRLwFNDNjRRi8QQN4LpFBS
// SIG // EogLQ3otP+5IbmbHkeYDym7sealqI5vNYp7NaqQ/56ND
// SIG // /2JHobS6RPrfQMGFVH7ooKcsQyObUh8yNfT+mlafjWN3
// SIG // ezCeCjOFchvKSsjMJc3bXREux7CM8Y9DSEcFtXogC+Xz
// SIG // 78G69LPYzTiP+yGqPQpthRfQyueGA8Azg7UlxMxanMTD
// SIG // 2mIlTVMlFGGP+xvg7PdHxoBF5jVTIzZ3yrDdmCs5wHU1
// SIG // D92BTCE9djDFsrBlcylIJ9jC0rCER7t4utV0A97XSxn3
// SIG // U9542ob3YYgmM7RHxqBUiBUrLHUCAwEAAaOCAQkwggEF
// SIG // MB0GA1UdDgQWBBQv6EbIaNNuT7Ig0N6JTvFH7kjB8jAf
// SIG // BgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7syuwwzWzDzBU
// SIG // BgNVHR8ETTBLMEmgR6BFhkNodHRwOi8vY3JsLm1pY3Jv
// SIG // c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsGAQUFBwEBBEww
// SIG // SjBIBggrBgEFBQcwAoY8aHR0cDovL3d3dy5taWNyb3Nv
// SIG // ZnQuY29tL3BraS9jZXJ0cy9NaWNyb3NvZnRUaW1lU3Rh
// SIG // bXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0G
// SIG // CSqGSIb3DQEBBQUAA4IBAQBz/30unc2NiCt8feNeFXHp
// SIG // aGLwCLZDVsRcSi1o2PlIEZHzEZyF7BLUVKB1qTihWX91
// SIG // 7sb1NNhUpOLQzHyXq5N1MJcHHQRTLDZ/f/FAHgybgOIS
// SIG // CiA6McAHdWfg+jSc7Ij7VxzlWGIgkEUvXUWpyI6zfHJt
// SIG // ECfFS9hvoqgSs201I2f6LNslLbldsR4F50MoPpwFdnfx
// SIG // Jd4FRxlt3kmFodpKSwhGITWodTZMt7MIqt+3K9m+Kmr9
// SIG // 3zUXzD8Mx90Gz06UJGMgCy4krl9DRBJ6XN0326RFs5E6
// SIG // Eld940fGZtPPnEZW9EwHseAMqtX21Tyi4LXU+Bx+BFUQ
// SIG // axj0kc1Rp5VlMIIFvDCCA6SgAwIBAgIKYTMmGgAAAAAA
// SIG // MTANBgkqhkiG9w0BAQUFADBfMRMwEQYKCZImiZPyLGQB
// SIG // GRYDY29tMRkwFwYKCZImiZPyLGQBGRYJbWljcm9zb2Z0
// SIG // MS0wKwYDVQQDEyRNaWNyb3NvZnQgUm9vdCBDZXJ0aWZp
// SIG // Y2F0ZSBBdXRob3JpdHkwHhcNMTAwODMxMjIxOTMyWhcN
// SIG // MjAwODMxMjIyOTMyWjB5MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSMwIQYDVQQDExpNaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// SIG // ggEBALJyWVwZMGS/HZpgICBCmXZTbD4b1m/My/Hqa/6X
// SIG // FhDg3zp0gxq3L6Ay7P/ewkJOI9VyANs1VwqJyq4gSfTw
// SIG // aKxNS42lvXlLcZtHB9r9Jd+ddYjPqnNEf9eB2/O98jak
// SIG // yVxF3K+tPeAoaJcap6Vyc1bxF5Tk/TWUcqDWdl8ed0WD
// SIG // hTgW0HNbBbpnUo2lsmkv2hkL/pJ0KeJ2L1TdFDBZ+NKN
// SIG // Yv3LyV9GMVC5JxPkQDDPcikQKCLHN049oDI9kM2hOAaF
// SIG // XE5WgigqBTK3S9dPY+fSLWLxRT3nrAgA9kahntFbjCZT
// SIG // 6HqqSvJGzzc8OJ60d1ylF56NyxGPVjzBrAlfA9MCAwEA
// SIG // AaOCAV4wggFaMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0O
// SIG // BBYEFMsR6MrStBZYAck3LjMWFrlMmgofMAsGA1UdDwQE
// SIG // AwIBhjASBgkrBgEEAYI3FQEEBQIDAQABMCMGCSsGAQQB
// SIG // gjcVAgQWBBT90TFO0yaKleGYYDuoMW+mPLzYLTAZBgkr
// SIG // BgEEAYI3FAIEDB4KAFMAdQBiAEMAQTAfBgNVHSMEGDAW
// SIG // gBQOrIJgQFYnl+UlE/wq4QpTlVnkpDBQBgNVHR8ESTBH
// SIG // MEWgQ6BBhj9odHRwOi8vY3JsLm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NybC9wcm9kdWN0cy9taWNyb3NvZnRyb290Y2Vy
// SIG // dC5jcmwwVAYIKwYBBQUHAQEESDBGMEQGCCsGAQUFBzAC
// SIG // hjhodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2Nl
// SIG // cnRzL01pY3Jvc29mdFJvb3RDZXJ0LmNydDANBgkqhkiG
// SIG // 9w0BAQUFAAOCAgEAWTk+fyZGr+tvQLEytWrrDi9uqEn3
// SIG // 61917Uw7LddDrQv+y+ktMaMjzHxQmIAhXaw9L0y6oqhW
// SIG // nONwu7i0+Hm1SXL3PupBf8rhDBdpy6WcIC36C1DEVs0t
// SIG // 40rSvHDnqA2iA6VW4LiKS1fylUKc8fPv7uOGHzQ8uFaa
// SIG // 8FMjhSqkghyT4pQHHfLiTviMocroE6WRTsgb0o9ylSpx
// SIG // bZsa+BzwU9ZnzCL/XB3Nooy9J7J5Y1ZEolHN+emjWFbd
// SIG // mwJFRC9f9Nqu1IIybvyklRPk62nnqaIsvsgrEA5ljpnb
// SIG // 9aL6EiYJZTiU8XofSrvR4Vbo0HiWGFzJNRZf3ZMdSY4t
// SIG // vq00RBzuEBUaAF3dNVshzpjHCe6FDoxPbQ4TTj18KUic
// SIG // ctHzbMrB7HCjV5JXfZSNoBtIA1r3z6NnCnSlNu0tLxfI
// SIG // 5nI3EvRvsTxngvlSso0zFmUeDordEN5k9G/ORtTTF+l5
// SIG // xAS00/ss3x+KnqwK+xMnQK3k+eGpf0a7B2BHZWBATrBC
// SIG // 7E7ts3Z52Ao0CW0cgDEf4g5U3eWh++VHEK1kmP9QFi58
// SIG // vwUheuKVQSdpw5OPlcmN2Jshrg1cnPCiroZogwxqLbt2
// SIG // awAdlq3yFnv2FoMkuYjPaqhHMS+a3ONxPdcAfmJH0c6I
// SIG // ybgY+g5yjcGjPa8CQGr/aZuW4hCoELQ3UAjWwz0wggYH
// SIG // MIID76ADAgECAgphFmg0AAAAAAAcMA0GCSqGSIb3DQEB
// SIG // BQUAMF8xEzARBgoJkiaJk/IsZAEZFgNjb20xGTAXBgoJ
// SIG // kiaJk/IsZAEZFgltaWNyb3NvZnQxLTArBgNVBAMTJE1p
// SIG // Y3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0
// SIG // eTAeFw0wNzA0MDMxMjUzMDlaFw0yMTA0MDMxMzAzMDla
// SIG // MHcxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xITAfBgNVBAMTGE1p
// SIG // Y3Jvc29mdCBUaW1lLVN0YW1wIFBDQTCCASIwDQYJKoZI
// SIG // hvcNAQEBBQADggEPADCCAQoCggEBAJ+hbLHf20iSKnxr
// SIG // LhnhveLjxZlRI1Ctzt0YTiQP7tGn0UytdDAgEesH1VSV
// SIG // FUmUG0KSrphcMCbaAGvoe73siQcP9w4EmPCJzB/LMySH
// SIG // nfL0Zxws/HvniB3q506jocEjU8qN+kXPCdBer9CwQgSi
// SIG // +aZsk2fXKNxGU7CG0OUoRi4nrIZPVVIM5AMs+2qQkDBu
// SIG // h/NZMJ36ftaXs+ghl3740hPzCLdTbVK0RZCfSABKR2YR
// SIG // JylmqJfk0waBSqL5hKcRRxQJgp+E7VV4/gGaHVAIhQAQ
// SIG // MEbtt94jRrvELVSfrx54QTF3zJvfO4OToWECtR0Nsfz3
// SIG // m7IBziJLVP/5BcPCIAsCAwEAAaOCAaswggGnMA8GA1Ud
// SIG // EwEB/wQFMAMBAf8wHQYDVR0OBBYEFCM0+NlSRnAK7UD7
// SIG // dvuzK7DDNbMPMAsGA1UdDwQEAwIBhjAQBgkrBgEEAYI3
// SIG // FQEEAwIBADCBmAYDVR0jBIGQMIGNgBQOrIJgQFYnl+Ul
// SIG // E/wq4QpTlVnkpKFjpGEwXzETMBEGCgmSJomT8ixkARkW
// SIG // A2NvbTEZMBcGCgmSJomT8ixkARkWCW1pY3Jvc29mdDEt
// SIG // MCsGA1UEAxMkTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNh
// SIG // dGUgQXV0aG9yaXR5ghB5rRahSqClrUxzWPQHEy5lMFAG
// SIG // A1UdHwRJMEcwRaBDoEGGP2h0dHA6Ly9jcmwubWljcm9z
// SIG // b2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL21pY3Jvc29m
// SIG // dHJvb3RjZXJ0LmNybDBUBggrBgEFBQcBAQRIMEYwRAYI
// SIG // KwYBBQUHMAKGOGh0dHA6Ly93d3cubWljcm9zb2Z0LmNv
// SIG // bS9wa2kvY2VydHMvTWljcm9zb2Z0Um9vdENlcnQuY3J0
// SIG // MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEB
// SIG // BQUAA4ICAQAQl4rDXANENt3ptK132855UU0BsS50cVtt
// SIG // DBOrzr57j7gu1BKijG1iuFcCy04gE1CZ3XpA4le7r1ia
// SIG // HOEdAYasu3jyi9DsOwHu4r6PCgXIjUji8FMV3U+rkuTn
// SIG // jWrVgMHmlPIGL4UD6ZEqJCJw+/b85HiZLg33B+JwvBhO
// SIG // nY5rCnKVuKE5nGctxVEO6mJcPxaYiyA/4gcaMvnMMUp2
// SIG // MT0rcgvI6nA9/4UKE9/CCmGO8Ne4F+tOi3/FNSteo7/r
// SIG // vH0LQnvUU3Ih7jDKu3hlXFsBFwoUDtLaFJj1PLlmWLMt
// SIG // L+f5hYbMUVbonXCUbKw5TNT2eb+qGHpiKe+imyk0Bnca
// SIG // Ysk9Hm0fgvALxyy7z0Oz5fnsfbXjpKh0NbhOxXEjEiZ2
// SIG // CzxSjHFaRkMUvLOzsE1nyJ9C/4B5IYCeFTBm6EISXhrI
// SIG // niIh0EPpK+m79EjMLNTYMoBMJipIJF9a6lbvpt6Znco6
// SIG // b72BJ3QGEe52Ib+bgsEnVLaxaj2JoXZhtG6hE6a/qkfw
// SIG // Em/9ijJssv7fUciMI8lmvZ0dhxJkAj0tr1mPuOQh5bWw
// SIG // ymO0eFQF1EEuUKyUsKV4q7OglnUa2ZKHE3UiLzKoCG6g
// SIG // W4wlv6DvhMoh1useT8ma7kng9wFlb4kLfchpyOZu6qeX
// SIG // zjEp/w7FW1zYTRuh2Povnj8uVRZryROj/TGCBHcwggRz
// SIG // AgEBMIGHMHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNV
// SIG // BAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBAgph
// SIG // GcyTAAEAAABmMAkGBSsOAwIaBQCggaIwGQYJKoZIhvcN
// SIG // AQkDMQwGCisGAQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEO
// SIG // MAwGCisGAQQBgjcCARUwIwYJKoZIhvcNAQkEMRYEFCiI
// SIG // OhLaenolte7NVNevQJ7pzoMuMEIGCisGAQQBgjcCAQwx
// SIG // NDAyoBiAFgBoAHQAbQBsAHQAcgBlAGUALgBqAHOhFoAU
// SIG // aHR0cDovL21pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEB
// SIG // BQAEggEAN69uklOBjWl59C+t6FKhajcMHvv1C6LtvimV
// SIG // 1lF6fTYF9bAX5MmKFE/iKN6nvUfZybusbQMPLGKpMC6S
// SIG // nQa88r2/6tmjZ+TAIFbsIdnY5FTCJ0VPC3OJ46x8NEYV
// SIG // qIMV/G3CsrOPedMFXYyAh1O6aDqnFEKwPFbmzdCMlDxP
// SIG // Hrp+pqGbGJLMEkEQYIGWPk08oUwhRvQX3ZxiwKkYveGD
// SIG // 7DkRRZ8V90/x12KG4yPTLj2opgNudCMER1R7IvlCqqub
// SIG // LL+oJPrBqGxJ9CBIh+OdXKvKAc8QybHLixedupu/29vo
// SIG // ehPbN1Y+wE8NQ2TEEQEWvRhJ0iOheJ0CutuV8p7b76GC
// SIG // Ah8wggIbBgkqhkiG9w0BCQYxggIMMIICCAIBATCBhTB3
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSEwHwYDVQQDExhNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0ECCmECjkIAAAAAAB8w
// SIG // CQYFKw4DAhoFAKBdMBgGCSqGSIb3DQEJAzELBgkqhkiG
// SIG // 9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTEyMDcyNzAxNDYy
// SIG // NlowIwYJKoZIhvcNAQkEMRYEFM9Q7klRX1RGec+wudVg
// SIG // O2KdQebPMA0GCSqGSIb3DQEBBQUABIIBAGdlCPQJAlZa
// SIG // QcZ+eapliUUPRwgo5qaIAt+MEaEbDDuCEA+L5cGI6qyW
// SIG // WbZfhLbt5wMw7hgFy/qmc2AaIN0e45y03RBzguI2b0BA
// SIG // x/l4xOTD8JU9IWIMKvptQ/U6NTfSX4RPwkaCJxJ0je7J
// SIG // tqn3Nd3Lg3YRTnFEH/UQANPnacgKOgxXybG/f2j0qGHI
// SIG // W2EO0O7TcBYbY4XQSK4KIe1DIIgpQ2P9nbWnR5xZrNaB
// SIG // swdEKY63EGdZorPURUmv0XQBsz8GPlBfHVdHkCzvHfc7
// SIG // 4Pz8RyLRS+5g+jcxr7S7++a590k8H/cSc5Jz2FO9r9VM
// SIG // 24rxXCU1vS2WfjrptnmKWIc=
// SIG // End signature block
