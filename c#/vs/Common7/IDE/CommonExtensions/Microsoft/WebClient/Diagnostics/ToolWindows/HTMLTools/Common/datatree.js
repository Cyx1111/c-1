// Expected global variables:
/*global jQuery toolwindowHelpers */

(function ($) {
    /// <summary>
    ///     DataTreeView - JQuery extension for constructing a tree view consisting of name value pairs, 
    ///     The data tree view object can be initialized by calling dataTreeView on a jQuery object.
    ///     Requires:
    ///     - datatree.css
    ///     - itemCollapsedIcon.png
    ///     - itemExpandedIcon.png
    ///     - itemCollapsedDarkThemeIcon.png
    ///     - itemExpandedDarkThemeIcon.png    
    /// </summary>
    
    // Styling information
    var dataTreeIndent = 10;
    var dataTreeInitialWidth = 170;
    var dataTreeMinWidth = 80;


    var methods = {
    
        // Default constructor
        init: function (properties) {
            /// <summary>
            ///     Creates a new DataTreeView for a BPT-DataTree-Container
            /// </summary>  
            /// <param name="properties" type="Object">
            ///     The properties for this DataTree in the following format:
            ///     {initialWidth: Number}
            /// </param>             
            /// <returns type="Object">
            ///     The jquery object for the new DataTreeView
            /// </returns>
            
            // Calculate the initial width of the tree
            var initialWidth = dataTreeInitialWidth;
            if (properties && properties.initialWidth) {
                initialWidth = properties.initialWidth;
            }
            
            var rootElement = $("<div class='BPT-DataTree' data-treeWidth='" + initialWidth + "'></div>");
            this.append(rootElement);

            var useDarkTheme = toolwindowHelpers.isDarkThemeBackground(rootElement);
            if (useDarkTheme) {
                rootElement.addClass("BPT-Tree-DarkTheme");
            } else {
                rootElement.removeClass("BPT-Tree-DarkTheme");
            }
            
            // Attach the event handlers if we need to
            if (!rootElement.data("attachedHandlers")) {
                var container = rootElement.parent(".BPT-DataTree-Container");
                
                container.bind("mousedown.dataTreeView", function (event) {
                    $(this).data("mouseActivate", true);
                });
                
                container.bind("click.dataTreeView", function (event) {
                    var element = $(event.target);
                    if (!element.is(".BPT-DataTreeItem-ChildCollection")) {
                        var row = element.closest(".BPT-DataTreeItem");
                        
                        if (row.length > 0) {
                            // If they clicked the expand icon, toggle the row
                            if (element.hasClass("BPT-DataTreeItem-ExpandIcon")) {
                                methods.toggle.call(row);
                            }
                            methods.select.call(row);
                        }
                    }
                });
                
                container.bind("dblclick.dataTreeView", function (event) {
                    var element = $(event.target);
                    var item = element.closest(".BPT-DataTreeItem, .BPT-DataTreeItem-EditableSection");
                    
                    if (item.length > 0) {
                        if (item.hasClass("BPT-DataTreeItem")) {
                            // Double clicking the row will expand/collapse it
                            if (item.hasClass("BPT-DataTreeItem-Collapsed") || item.hasClass("BPT-DataTreeItem-Expanded")) {
                                if (!element.hasClass("BPT-DataTreeItem-ExpandIcon")) {
                                    methods.toggle.call(item);
                                }
                            }
                        } else if (item.hasClass("BPT-DataTreeItem-EditableSection")) {
                            // Double clicking an attribute will edit it
                            var row = item.parents(".BPT-DataTreeItem:first");
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
     
                container.bind("focus.dataTreeView", function (event) {
                    if (!$(this).data("mouseActivate")) {
                        var element = $(this);
                        var selected = element.children(".BPT-DataTree").dataTreeView("getSelected");
                        if (selected.length === 0) {
                            selected = element.find(".BPT-DataTreeItem:first").dataTreeView("select");
                        }
                        
                        if (selected && selected.length > 0) {
                            var wasScrolled = toolwindowHelpers.scrollIntoView(selected.children(".BPT-DataTreeItem-Header")[0], selected.closest(".BPT-DataTree-ScrollContainer")[0]);
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
                
                container.bind("focusin.dataTreeView", function (event) {
                    $(this).addClass("BPT-DataTree-Container-CurrentFocus");
                });
                
                container.bind("focusout.dataTreeView", function (event) {
                    $(this).removeClass("BPT-DataTree-Container-CurrentFocus");
                });

                container.bind("keydown.dataTreeView", function (event) {
                    var selected;

                    if (event.keyCode >= 37 && event.keyCode <= 40) { // Arrow Keys
                    
                        // Don't do anything if we are inside a text input box
                        if ($(document.activeElement).is(":text")) {
                            return;
                        }

                        selected = methods.getSelected.call($(this).children(":first"));
                        
                        var moveUp = function (toParent) {
                            /// <summary>
                            ///     Moves the selection up to the previous node
                            /// </summary>
                            /// <param name="toParent" type="Boolean" optional="true">
                            ///     Optional parameter specifying if the jumps to parent nodes are allowed (default false)
                            /// </param>  

                            var newElement = null;
                            var sibling = selected.prev(".BPT-DataTreeItem:last");
                            if (sibling.length > 0 && !toParent) {
                                // Find the last child
                                newElement = sibling.find(".BPT-DataTreeItem:last");
                                
                                if (newElement.length === 0) {
                                    // Use the sibling instead
                                    newElement = sibling;
                                }
                            } else {
                                newElement = selected.parents(".BPT-DataTreeItem:first");
                            }
                            
                            if (newElement && newElement.length > 0) {
                                methods.select.call(newElement);
                                toolwindowHelpers.scrollIntoView(newElement.children(".BPT-DataTreeItem-Header")[0], newElement.closest(".BPT-DataTree-ScrollContainer")[0]);
                                event.preventDefault();
                                return false;
                            }
                        };
                        
                        var moveDown = function () {
                            /// <summary>
                            ///     Moves the selection down to the next node
                            /// </summary>

                            var newElement = selected.find(".BPT-DataTreeItem:first");
                            newElement = (newElement.length > 0 ? newElement : selected.next(".BPT-DataTreeItem:first"));
                            
                            var searchedParent = selected;
                            while (newElement.length === 0) {
                                searchedParent = searchedParent.parents(".BPT-DataTreeItem");
                                if (searchedParent.length === 0) {
                                    break;
                                }
                                newElement = searchedParent.next(".BPT-DataTreeItem:first");
                            }
                            
                            if (newElement && newElement.length > 0) {
                                methods.select.call(newElement);
                                toolwindowHelpers.scrollIntoView(newElement.children(".BPT-DataTreeItem-Header")[0], newElement.closest(".BPT-DataTree-ScrollContainer")[0]);
                                event.preventDefault();
                                return false;
                            }
                        };
                        
                        if (selected.length > 0) {
                            switch (event.keyCode) {
                                case 37: // Left(37)
                                    if (selected.hasClass("BPT-DataTreeItem-Expanded")) {
                                        methods.toggle.call(selected);
                                    } else {
                                        moveUp(true);
                                    }
                                    break;
                                    
                                case 38: // Up(38)
                                    moveUp();
                                    break;
                                    
                                case 39: // Right(39)
                                    if (selected.hasClass("BPT-DataTreeItem-Collapsed")) {
                                        methods.toggle.call(selected);
                                    } else if (selected.hasClass("BPT-DataTreeItem-Expanded")) {    
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
                        var element = $(this).children(".BPT-DataTree");
                        selected = element.dataTreeView("getSelected").children(".BPT-DataTreeItem-Header");
                        if (selected.length > 0) {
                            // Ensure we aren't currently editing a textbox, nor on an active link
                            if (document.activeElement && document.activeElement.type !== "text" && (document.activeElement.className && document.activeElement.className.indexOf("BPT-FileLink") === -1)) {
                                if (event.keyCode === 13) { // Enter(13)
                                
                                    // Find a double click edit control
                                    var valueNode = selected.find(".BPT-DataTreeItem-Value");
                                    var eventData = valueNode.data("events");
                                    if (eventData && eventData.dblclick) {
                                        valueNode.triggerHandler("dblclick");
                                        return false;
                                    }
                                }

                                // Find a checkbox or link
                                var clickable = selected.find("input[type='checkbox']");
                                clickable = (clickable.length > 0 ? clickable : selected.find("a"));

                                if (clickable.length === 0) {
                                    // Check for a file link
                                    var src = $(event.srcElement);
                                    if (src.hasClass("BPT-FileLink")) {
                                        clickable = src;
                                    } else {
                                        // Check for a file link in the header
                                        clickable = selected.find(".BPT-FileLink");
                                        
                                        if (clickable.length === 0) {
                                            // Check for a file link in the item itself
                                            clickable = element.dataTreeView("getSelected").children(".BPT-FileLink");
                                        }
                                    }
                                }
                                
                                if (clickable.length > 0) {
                                    // Activate the item
                                    clickable[0].click();
                                    return false;
                                } else if (event.keyCode === 32) { // Space(32)
                                
                                    // We didn't have an item to click and they were pressing space
                                    // so stop the scroll container from scrolling.
                                    return false;
                                }
                            }
                        }
                    } else if (event.keyCode === 9 && !event.shiftKey) { // Tab(9)
                        var tree = $(this).children(".BPT-DataTree");
                        var link = tree.dataTreeView("getSelected").children(".BPT-DataTreeItem-Header").find(".BPT-FileLink");
                        
                        if (link.length > 0 && document.activeElement !== link[0]) {
                            $(document.body).addClass("showFocus");
                            link[0].setActive();
                            link.focus();
                            return false;
                        }
                    }
                });
                container = null;
                rootElement.data("attachedHandlers", true);
            }
            
            
            var divider = $("<div class='BPT-DataTree-Divider' style='left:" + initialWidth + "px'></div>");
            divider.mousedown(function (e) {
                var prevCursor = document.body.style.cursor;
                document.body.style.cursor = "w-resize";
                    
                var offsetX = divider.offset().left;
                var startX = divider.position().left;
                
                divider.addClass("BPT-DataTree-DividerVisible");
                
                // Create mouse handlers for resizing
                var mouseMoveHandler, mouseUpHandler;
                mouseMoveHandler = function (e) {
                    // If the user triggered the 'mouseup' event outside the tool window
                    if (!window.event.button) {
                        mouseUpHandler();
                    }

                    var newWidth = startX + (e.pageX - offsetX);
                    if (newWidth < dataTreeMinWidth) {
                        newWidth = dataTreeMinWidth;
                    }

                    divider.css("left", newWidth);
                };
                mouseUpHandler = function () {
                    $(document).unbind("mousemove", mouseMoveHandler);
                    $(document).unbind("mouseup", mouseUpHandler);
                    document.body.style.cursor = prevCursor;
                    
                    divider.removeClass("BPT-DataTree-DividerVisible");
                    
                    var rootElement = divider.parent();
                    var treeWidth = parseInt(rootElement.children(":first").css("left"), 10);
                    rootElement.find(".BPT-DataTreeItem:not(.BPT-DataTreeItem-CollapsibleBlock)").each(function () {
                        var element = $(this);
                        var indent = parseInt(element.attr("data-indent"), 10);
                        element.find(".BPT-DataTreeItem-Header:first .BPT-DataTreeItem-Name").width(treeWidth - indent);
                    });
                    rootElement.attr("data-treeWidth", treeWidth);
                };
                $(document).bind("mousemove", mouseMoveHandler);
                $(document).bind("mouseup", mouseUpHandler);
                
                // Prevent highlighting text while resizing
                // This also stops resizing while the cursor is outside our window.
                e.stopImmediatePropagation();
                e.preventDefault();
            });
            rootElement.append(divider);

            
            return this;
        },
        
        destroy : function () {
            /// <summary>
            ///     Disposes of a DataTreeView and removes all data and event handlers
            /// </summary> 
            
            // Remove event handlers
            if (this.data("attachedHandlers")) {
                this.parent(".BPT-DataTree-Container").unbind(".dataTreeView");
                this.data("attachedHandlers", false);
            }
        },
        
        addSingleItem: function (id, name, value) {
            /// <summary>
            ///     Adds a single item to the DataTreeItem
            /// </summary>
            /// <param name="id" type="String">
            ///     An identifier to use for this item
            /// </param>  
            /// <param name="name" type="String">
            ///     The name column
            /// </param>  
            /// <param name="value" type="String">
            ///     The value column
            /// </param>                      
            /// <returns type="Object">
            ///     The jquery object that was created
            /// </returns> 
            
            var item = {uid: id, name: name, value: value, hasChildren: false};
            var childrenCollection = methods.addItems.call(this, [item]);
            return childrenCollection.children(":last");
        },
        
        addItems: function (items, toggleCallback, editCallback, selectCallback, stopAutoScroll) {
            /// <summary>
            ///     Adds an array of items to the DataTreeItem
            /// </summary>
            /// <param name="items" type="Array">
            ///     An array of objects that describe the children items, in the following format:
            ///     [{uid: String, name: String, value: String, hasChildren: Boolean}]
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
            /// <param name="stopAutoScroll" type="Boolean">
            ///     An optional parameter that specifies if we should not auto scroll the new items into view
            /// </param>             
            /// <returns type="Object">
            ///     A jquery object that was created that contains all the new elements wrapped in a span
            /// </returns> 
            
            var newItemsString = "<span class='BPT-DataTreeItem-ChildCollection'>";
            
            var isDataTree = !(this.hasClass("BPT-DataTreeItem"));
            var indent = isDataTree ? 0 : (this.parents(".BPT-DataTreeItem").length + 1) * dataTreeIndent;
            var initialWidth = (isDataTree ? this.children(".BPT-DataTree").attr("data-treeWidth") : this.closest(".BPT-DataTree").attr("data-treeWidth")) - indent;
            
            for (var i = 0; i < items.length; i++) {
            
                // Get the properties of this new element
                var id = items[i].uid;
                var name = items[i].name;
                var value = items[i].value;
                var isExpandable = items[i].hasChildren;
                var link = items[i].link;
                var blockOpenText = items[i].blockOpenText;
                var blockCloseText = items[i].blockCloseText;
                var blockIsInline = items[i].blockIsInline;
                var tooltip = items[i].alreadyEncodedTooltip;

                var tooltipPart = (tooltip ? " title='" + tooltip.replace(/\r\n/g, "&#13;&#10;") + "'" : "");
                
                var nameElement = "";
                var valueElement = "";
                var collapsibleBlockFooter = "";
                
                if (blockIsInline) {
                    // Inline blocks do not need a header and footer
                    nameElement = "<span class='BPT-DataTreeItem-Name' style='width:" + initialWidth + "px'>" + name + (blockOpenText ? "<span>" + blockOpenText + "</span>" : "") + "</span>";
                    valueElement = "<span class='BPT-DataTreeItem-Value'>" + value + (blockCloseText ? "<span>" + blockCloseText + "</span>" : "") + "</span>";
                } else {
                    // Blocks
                    var nameStyle = "";

                    // Block's might require a header that collapses
                    var collapsibleBlockHeader = "";
                    if (blockOpenText && blockCloseText) {
                        collapsibleBlockHeader = "<span> " + blockOpenText + "</span><span class='BPT-DataTreeItem-CollapsedBlockFooter'>..." + blockCloseText + "</span>";
                        collapsibleBlockFooter = "<span class='BPT-DataTreeItem-BlockFooter'>" + blockCloseText + "</span>";
                    } else {
                        // Non-collapsible requires that we set the width
                        nameStyle = "width: " + initialWidth + "px";
                    }

                    nameElement = "<span class='BPT-DataTreeItem-Name' style='" + nameStyle + "'>" + name + collapsibleBlockHeader + "</span>";
                    valueElement = "<span class='BPT-DataTreeItem-Value'>" + value + "</span>";
                }

                var expandIcon = (isExpandable ? "<div class='BPT-DataTreeItem-ExpandIcon' />" : "");
                var expandClass = (isExpandable ? " BPT-DataTreeItem-Collapsed" : "");
                var blockClass = (collapsibleBlockFooter ? " BPT-DataTreeItem-CollapsibleBlock" : "");
                
                // Generate the link and select its location
                var linkElement = toolwindowHelpers.createLinkDivText(link, "BPT-DataTreeItem-FileLink-Right");
                var linkElementInline = (collapsibleBlockFooter ? "" : linkElement);
                var linkElementCollapsible = (collapsibleBlockFooter ? linkElement : "");
                
                newItemsString += "<div class='BPT-DataTreeItem" + expandClass + blockClass + "' data-id='" + id + "' data-indent='" + indent + "'" + tooltipPart + ">" + expandIcon + linkElementCollapsible + "<div class='BPT-DataTreeItem-Header'>" + nameElement + valueElement + linkElementInline + "</div>" + collapsibleBlockFooter + "</div>";
            }
            
            newItemsString += "</span>";
            
            // Create the new children
            var childrenCollection = $(newItemsString);
            if (toggleCallback || editCallback || selectCallback) {
                childrenCollection.data({
                    toggleCallback: toggleCallback,
                    editCallback: editCallback,
                    selectCallback: selectCallback
                });
            }
            
            // Get the header that will contain the new children
            var header = (isDataTree ? this.children(".BPT-DataTree") : this.children(".BPT-DataTreeItem-Header"));
            
            var childHolder = (isDataTree ? header.children(".BPT-DataTreeItem-ChildCollection") : header.siblings(".BPT-DataTreeItem-ChildCollection"));
            if (childHolder.length > 0) {
                // We already have some children, so append to the existing ones
                childrenCollection.children().appendTo(childHolder);
                childrenCollection = childHolder;
            } else {
                // New children
                if (isDataTree) {
                    header.append(childrenCollection);
                } else {
                    header.after(childrenCollection);
                }
            }
            
            // Calculate the width to use before wrapping any collapsible blocks with links
            var links = childrenCollection.find(".BPT-DataTreeItem-FileLink-Right");
            for (var linkIndex = 0; linkIndex < links.length; linkIndex++) {
                var width = links[linkIndex].clientWidth + 10;
                if (links[linkIndex].parentNode.className.indexOf("BPT-DataTreeItem-CollapsibleBlock") >= 0) {
                    links[linkIndex].nextSibling.style.maxWidth = "calc(100% - " + width + "px)";
                } else {
                    links[linkIndex].parentNode.style.minWidth = "calc(100% - 10px)";
                }
            }

            if (!stopAutoScroll) {
                // Scroll the element to the top if the last child is out of view
                window.setTimeout(function () {
                    var child = childrenCollection.children().last();
                    var scrollContainer = child.closest(".BPT-DataTree-ScrollContainer")[0];
                    
                    // Don't move horizontally
                    if (scrollContainer) {
                        var x = scrollContainer.scrollLeft;
                        if (toolwindowHelpers.scrollIntoView(child.children(".BPT-DataTreeItem-Header")[0], scrollContainer)) {
                            childrenCollection[0].scrollIntoView(true);
                            scrollContainer.scrollLeft = x;
                        }
                    }
                }, 0);
            }
            
            return childrenCollection;
        },
        
        showLoading: function (text) {
            /// <summary>
            ///     Shows a loading message if the item does not already have one
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object
            /// </returns>
            
            if (!this.hasClass("BPT-DataTreeItem-ShowingLoader")) {
                var newRowHtml = "<div class='BPT-DataTreeItem BPT-DataTreeItem-Loading'>" + text + "</div>";
                this.append($(newRowHtml));
                this.addClass("BPT-DataTreeItem-ShowingLoader");
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

            if (this.hasClass("BPT-DataTreeItem-ShowingLoader")) {
                this.removeClass("BPT-DataTreeItem-ShowingLoader");
                this.children(".BPT-DataTreeItem-Loading").remove();
            }
            return this;
        },
        
        getChildren: function () {
            /// <summary>
            ///     Gets a jquery object of the children of this DataTreeItem
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object of the children
            /// </returns>
            
            if (this.hasClass("BPT-DataTree-Container")) {
                return this.children(":first").children(".BPT-DataTreeItem-ChildCollection").children(".BPT-DataTreeItem");
            } else {
                return this.children(".BPT-DataTreeItem-ChildCollection").children(".BPT-DataTreeItem");
            }
        },
        
        getName: function () {
            /// <summary>
            ///     Gets a jquery object of the name side of the DataTreeItem
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object of the name
            /// </returns>
            
            var nameNode = this.find("span.BPT-DataTreeItem-Name:first");
            var cssName = nameNode.children("span.BPT-HTML-CSS-Name");
            return (cssName.length === 1 ? cssName : nameNode);
        },
        
        getValue: function () {
            /// <summary>
            ///     Gets a jquery object of the value side of the DataTreeItem
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object of the value
            /// </returns>

            var valueNode = this.find("span.BPT-DataTreeItem-Value:first");
            var cssValue = valueNode.children("span.BPT-HTML-CSS-Value");
            return (cssValue.length === 1 ? cssValue : valueNode);
        },        
        
        isCollapsed: function () {
            /// <summary>
            ///     Gets the collasped state of the DataTreeItem
            /// </summary>  
            /// <returns type="Object">
            ///     True if the DataTreeItem is collapsed, false if it is expanded
            /// </returns>
            
            return this.hasClass("BPT-DataTreeItem-Collapsed");
        },
        
        isExpanded: function () {
            /// <summary>
            ///     Gets the expanded state of the DataTreeItem
            /// </summary>  
            /// <returns type="Object">
            ///     True if the DataTreeItem is expanded, false if it is collapsed
            /// </returns>
            
            return this.hasClass("BPT-DataTreeItem-Expanded");
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
                toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsDataTreeToggleBegin);
            
                if (this.hasClass("BPT-DataTreeItem-Collapsed")) {
                    // Expand
                    this.removeClass("BPT-DataTreeItem-Collapsed");
                    toggleCallback(true, this, this.attr("data-id"), onExpandComplete);
                    this.addClass("BPT-DataTreeItem-Expanded");
                } else {
                    // Collapse
                    this.removeClass("BPT-DataTreeItem-Expanded");
                    toggleCallback(false, this, this.attr("data-id"));
                    this.children(".BPT-DataTreeItem-ChildCollection").remove();
                    this.addClass("BPT-DataTreeItem-Collapsed");
                
                    // Fire the End code marker
                    toolwindowHelpers.codeMarker(toolwindowHelpers.codeMarkers.perfBrowserTools_DiagnosticsToolWindowsDataTreeToggleEnd);
                }
                
            }
            return this;
        },
        
        getSelected: function () {
            /// <summary>
            ///     Gets the currently selected DataTreeItem
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object that is selected
            /// </returns> 
            
            if (this.hasClass("BPT-DataTreeItem-Selected")) {
                return this;
            }
            
            var rootElement = this.closest(".BPT-DataTree");
            rootElement = (rootElement.length > 0 ? rootElement : this);
            return rootElement.find(".BPT-DataTreeItem-Selected:first");
        },
        
        select: function () {
            /// <summary>
            ///     Selects the DataTreeItem
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object that was selected
            /// </returns> 
            
            var rootElement = this.closest(".BPT-DataTree");
            rootElement.find(".BPT-DataTreeItem-Selected").removeClass("BPT-DataTreeItem-Selected");

            this.addClass("BPT-DataTreeItem-Selected");
            
            // Remove focus from a link if there is one
            if (document.activeElement && document.activeElement.className && document.activeElement.className.indexOf("BPT-FileLink") >= 0) {
                var container = rootElement.parent(".BPT-DataTree-Container");
                container[0].setActive();
                container.focus();
            }
            
            var selectCallback = this.data("selectCallback");
            selectCallback = (selectCallback ? selectCallback : this.parent().data("selectCallback"));
            if (selectCallback) {
                selectCallback(this, this.attr("data-id"), this.attr("data-tag"));
            }
            this.trigger("itemSelected");
            return this;
        },        
        
        clear: function () {
            /// <summary>
            ///     Removes all children
            /// </summary>  
            /// <returns type="Object">
            ///     The jquery object that was cleared
            /// </returns> 
            
            this.children(".BPT-DataTreeItem-ChildCollection").remove();
            if (this.hasClass("BPT-DataTree-Container")) {
                this.children(":first").children(".BPT-DataTreeItem-ChildCollection").remove();
            }
            return this;
        },
        
        removeAndSelect: function () {
            /// <summary>
            ///     Removes all children and the node itself, and selects the next nearest item
            /// </summary>  
            
            var select = this.prev(".BPT-DataTreeItem");
            select = (select.length > 0 ? select : this.next(".BPT-DataTreeItem"));
            
            this.remove();
            
            if (select.length > 0) {
                methods.select.call(select);
            }
        }
        
    };

    $.fn.dataTreeView = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            return methods.init.apply(this, arguments);
        }
        return this;
    };
}(jQuery));

// SIG // Begin signature block
// SIG // MIIaOAYJKoZIhvcNAQcCoIIaKTCCGiUCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFLs0zQcr4t/d
// SIG // MiES6uvUQIyPH7AWoIIVLTCCBKAwggOIoAMCAQICCmEZ
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
// SIG // MAwGCisGAQQBgjcCARUwIwYJKoZIhvcNAQkEMRYEFIFD
// SIG // NSo3eOisThCusk1KE4xlTUcFMEIGCisGAQQBgjcCAQwx
// SIG // NDAyoBiAFgBkAGEAdABhAHQAcgBlAGUALgBqAHOhFoAU
// SIG // aHR0cDovL21pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEB
// SIG // BQAEggEApRb9VuZ/0hlv1GXWVVhMwf1wmv5Wn5TiaQft
// SIG // oFNRfltSKQSiqslAXbSLVcjLSFTK8f4CIscDRDNmZ1PI
// SIG // Ue3J4tJY15h4ACUaZw3ZLqt/7G97mHJSp4P1AvWqbFYi
// SIG // eXE+Di4ChFTR+UrW+svP5syyvYb/+WK2r6wjSnmQ3E2w
// SIG // r/l4fA1MS3JD+9UjINJ0qI/+oHvf5PNuRDSraiD2qCcy
// SIG // ngxF7ReMhcXwLtlezWWvBB7ic+G+rKA/60HFmwyzpRSv
// SIG // OxZ4gupr9mrlY7DsuusGphS7LTy1ESQ/ye1pI6l/Q3xu
// SIG // TG8FxPQqQRFpDz8IslR5oqFa/UCSANwyQJ9x5T79jaGC
// SIG // Ah8wggIbBgkqhkiG9w0BCQYxggIMMIICCAIBATCBhTB3
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSEwHwYDVQQDExhNaWNy
// SIG // b3NvZnQgVGltZS1TdGFtcCBQQ0ECCmECjkIAAAAAAB8w
// SIG // CQYFKw4DAhoFAKBdMBgGCSqGSIb3DQEJAzELBgkqhkiG
// SIG // 9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTEyMDcyNzAxNDYy
// SIG // NlowIwYJKoZIhvcNAQkEMRYEFL7reYYBPQB/LtpQfevN
// SIG // WaMh6jwHMA0GCSqGSIb3DQEBBQUABIIBACfnNhDFglDq
// SIG // 16lD2AWHlq/CGuzaYvwlGD6YrpALXXVdMUi9GXc4JOf4
// SIG // vr539dzoC76vLl0U9GHT4unJAYMoTNTFA90WClrMtH7S
// SIG // C+l9KkhL3Zi73GOuLJPwjjknNUPf4cG9BmWoxg0O+p9O
// SIG // T/QYrLo9Aiz/YgG32UsNSDL7TVQqe7cMfZIcmVhNL6ar
// SIG // 3kDtwO3wsOXuqNKeg6Fxtx+k59WQW63LMd3Ea+m82xil
// SIG // 7YY1/aJ8pe5jOa3e/KJCAtu3NYlmWy0ekDGefbplmY2b
// SIG // yLFYXwJgcBENE1HkINUjo7b6lvDc486m8iuqn05Q7Kwv
// SIG // QfHgtqTeAer8FhkSLh9YU8o=
// SIG // End signature block
