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

                var tooltipPart = (tooltip ? " title='" + tooltip + "'" : "");
                
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
// SIG // MIIaTQYJKoZIhvcNAQcCoIIaPjCCGjoCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFKeKwhvBVd1c
// SIG // 7F4CXI2puY532nvKoIIVFjCCBKAwggOIoAMCAQICCmEZ
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
// SIG // VmSsmsysl5gpipeQh+qdtjCCBKMwggOLoAMCAQICCmEN
// SIG // r40AAAAAACgwDQYJKoZIhvcNAQEFBQAwdzELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBMB4XDTEyMDIyMDIxMzY0N1oXDTEz
// SIG // MDUyMDIxNDY0N1owgbMxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // DTALBgNVBAsTBE1PUFIxJzAlBgNVBAsTHm5DaXBoZXIg
// SIG // RFNFIEVTTjpDMEY0LTMwODYtREVGODElMCMGA1UEAxMc
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIw
// SIG // DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANDJ9rK+
// SIG // Gu/uLXz4AGAeCLaaYWKStKnXDjEDPbpcfdP0ABq4m3hc
// SIG // RHdhq4Jnr6IwqeBZJkU73oA9j6lU87f84tOdgAEDQBYj
// SIG // KwRxXLkFbQnErIKKVwOcHgy03B/wpCzMWxl7ZcM/Cc+E
// SIG // jRJAreDmP3EwdhzqeRjFmmal8pOi5IPOOm8i4LVOtfFR
// SIG // DJynHMj/gf4zNVH3mzIp+/9pZhxJTcFOJoVXdu3TpI9k
// SIG // f9FEECEfTgJSHKIl9Zi9pSuuRZgDT8r0tsZ6GPdNnZvR
// SIG // opi1PbJNYDsoi3LbjTfbhyzpZN3IGPoJ3eNNp0WOoLoq
// SIG // rzWL6Mnv9DUZRRWFgvF3/QkS49sCAwEAAaOB8zCB8DAd
// SIG // BgNVHQ4EFgQUN+fwSUd2RYwO41LysvR6NzJrhdMwHwYD
// SIG // VR0jBBgwFoAUIzT42VJGcArtQPt2+7MrsMM1sw8wVAYD
// SIG // VR0fBE0wSzBJoEegRYZDaHR0cDovL2NybC5taWNyb3Nv
// SIG // ZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWljcm9zb2Z0
// SIG // VGltZVN0YW1wUENBLmNybDBYBggrBgEFBQcBAQRMMEow
// SIG // SAYIKwYBBQUHMAKGPGh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2kvY2VydHMvTWljcm9zb2Z0VGltZVN0YW1w
// SIG // UENBLmNydDANBgkqhkiG9w0BAQUFAAOCAQEAbyv5ZHfk
// SIG // phuPosWMlNbjaIEB8v7EhJ/pJr3lZ2xcb33NdWVlAGgA
// SIG // VAmGOXq44nqvJ0maRRL3LJ9qRjiNflOvlOh+ZjcL+lTQ
// SIG // FsPx6NjDazMHghc0kI4aQEbMnNmiaX7fX0dqOpgLbkiK
// SIG // mf5pFDhv2C9kGyBHjwJcwKtpYzM3P0grjG6GVt6qIjTm
// SIG // OAsdMqdMsPePRh7nUa6AiEgjlgmDCTqmP84qByH0sEvI
// SIG // 9ZpNYf2XbhJFZZJsnsX4SJIpZVxl0T1ZFPBL7FU5CzRc
// SIG // FMpJbzdfcuTTRJA/CHM6eB6w/cgrawVF2A7YCevUT1yQ
// SIG // aEi+bgYqwt+uLYucfxwRJnI+ZTCCBbwwggOkoAMCAQIC
// SIG // CmEzJhoAAAAAADEwDQYJKoZIhvcNAQEFBQAwXzETMBEG
// SIG // CgmSJomT8ixkARkWA2NvbTEZMBcGCgmSJomT8ixkARkW
// SIG // CW1pY3Jvc29mdDEtMCsGA1UEAxMkTWljcm9zb2Z0IFJv
// SIG // b3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5MB4XDTEwMDgz
// SIG // MTIyMTkzMloXDTIwMDgzMTIyMjkzMloweTELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0IENv
// SIG // ZGUgU2lnbmluZyBQQ0EwggEiMA0GCSqGSIb3DQEBAQUA
// SIG // A4IBDwAwggEKAoIBAQCycllcGTBkvx2aYCAgQpl2U2w+
// SIG // G9ZvzMvx6mv+lxYQ4N86dIMaty+gMuz/3sJCTiPVcgDb
// SIG // NVcKicquIEn08GisTUuNpb15S3GbRwfa/SXfnXWIz6pz
// SIG // RH/XgdvzvfI2pMlcRdyvrT3gKGiXGqelcnNW8ReU5P01
// SIG // lHKg1nZfHndFg4U4FtBzWwW6Z1KNpbJpL9oZC/6SdCni
// SIG // di9U3RQwWfjSjWL9y8lfRjFQuScT5EAwz3IpECgixzdO
// SIG // PaAyPZDNoTgGhVxOVoIoKgUyt0vXT2Pn0i1i8UU956wI
// SIG // APZGoZ7RW4wmU+h6qkryRs83PDietHdcpReejcsRj1Y8
// SIG // wawJXwPTAgMBAAGjggFeMIIBWjAPBgNVHRMBAf8EBTAD
// SIG // AQH/MB0GA1UdDgQWBBTLEejK0rQWWAHJNy4zFha5TJoK
// SIG // HzALBgNVHQ8EBAMCAYYwEgYJKwYBBAGCNxUBBAUCAwEA
// SIG // ATAjBgkrBgEEAYI3FQIEFgQU/dExTtMmipXhmGA7qDFv
// SIG // pjy82C0wGQYJKwYBBAGCNxQCBAweCgBTAHUAYgBDAEEw
// SIG // HwYDVR0jBBgwFoAUDqyCYEBWJ5flJRP8KuEKU5VZ5KQw
// SIG // UAYDVR0fBEkwRzBFoEOgQYY/aHR0cDovL2NybC5taWNy
// SIG // b3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvbWljcm9z
// SIG // b2Z0cm9vdGNlcnQuY3JsMFQGCCsGAQUFBwEBBEgwRjBE
// SIG // BggrBgEFBQcwAoY4aHR0cDovL3d3dy5taWNyb3NvZnQu
// SIG // Y29tL3BraS9jZXJ0cy9NaWNyb3NvZnRSb290Q2VydC5j
// SIG // cnQwDQYJKoZIhvcNAQEFBQADggIBAFk5Pn8mRq/rb0Cx
// SIG // MrVq6w4vbqhJ9+tfde1MOy3XQ60L/svpLTGjI8x8UJiA
// SIG // IV2sPS9MuqKoVpzjcLu4tPh5tUly9z7qQX/K4QwXacul
// SIG // nCAt+gtQxFbNLeNK0rxw56gNogOlVuC4iktX8pVCnPHz
// SIG // 7+7jhh80PLhWmvBTI4UqpIIck+KUBx3y4k74jKHK6BOl
// SIG // kU7IG9KPcpUqcW2bGvgc8FPWZ8wi/1wdzaKMvSeyeWNW
// SIG // RKJRzfnpo1hW3ZsCRUQvX/TartSCMm78pJUT5Otp56mi
// SIG // LL7IKxAOZY6Z2/Wi+hImCWU4lPF6H0q70eFW6NB4lhhc
// SIG // yTUWX92THUmOLb6tNEQc7hAVGgBd3TVbIc6YxwnuhQ6M
// SIG // T20OE049fClInHLR82zKwexwo1eSV32UjaAbSANa98+j
// SIG // Zwp0pTbtLS8XyOZyNxL0b7E8Z4L5UrKNMxZlHg6K3RDe
// SIG // ZPRvzkbU0xfpecQEtNP7LN8fip6sCvsTJ0Ct5PnhqX9G
// SIG // uwdgR2VgQE6wQuxO7bN2edgKNAltHIAxH+IOVN3lofvl
// SIG // RxCtZJj/UBYufL8FIXrilUEnacOTj5XJjdibIa4NXJzw
// SIG // oq6GaIMMai27dmsAHZat8hZ79haDJLmIz2qoRzEvmtzj
// SIG // cT3XAH5iR9HOiMm4GPoOco3Boz2vAkBq/2mbluIQqBC0
// SIG // N1AI1sM9MIIGBzCCA++gAwIBAgIKYRZoNAAAAAAAHDAN
// SIG // BgkqhkiG9w0BAQUFADBfMRMwEQYKCZImiZPyLGQBGRYD
// SIG // Y29tMRkwFwYKCZImiZPyLGQBGRYJbWljcm9zb2Z0MS0w
// SIG // KwYDVQQDEyRNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0
// SIG // ZSBBdXRob3JpdHkwHhcNMDcwNDAzMTI1MzA5WhcNMjEw
// SIG // NDAzMTMwMzA5WjB3MQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSEw
// SIG // HwYDVQQDExhNaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0Ew
// SIG // ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCf
// SIG // oWyx39tIkip8ay4Z4b3i48WZUSNQrc7dGE4kD+7Rp9FM
// SIG // rXQwIBHrB9VUlRVJlBtCkq6YXDAm2gBr6Hu97IkHD/cO
// SIG // BJjwicwfyzMkh53y9GccLPx754gd6udOo6HBI1PKjfpF
// SIG // zwnQXq/QsEIEovmmbJNn1yjcRlOwhtDlKEYuJ6yGT1VS
// SIG // DOQDLPtqkJAwbofzWTCd+n7Wl7PoIZd++NIT8wi3U21S
// SIG // tEWQn0gASkdmEScpZqiX5NMGgUqi+YSnEUcUCYKfhO1V
// SIG // eP4Bmh1QCIUAEDBG7bfeI0a7xC1Un68eeEExd8yb3zuD
// SIG // k6FhArUdDbH895uyAc4iS1T/+QXDwiALAgMBAAGjggGr
// SIG // MIIBpzAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQj
// SIG // NPjZUkZwCu1A+3b7syuwwzWzDzALBgNVHQ8EBAMCAYYw
// SIG // EAYJKwYBBAGCNxUBBAMCAQAwgZgGA1UdIwSBkDCBjYAU
// SIG // DqyCYEBWJ5flJRP8KuEKU5VZ5KShY6RhMF8xEzARBgoJ
// SIG // kiaJk/IsZAEZFgNjb20xGTAXBgoJkiaJk/IsZAEZFglt
// SIG // aWNyb3NvZnQxLTArBgNVBAMTJE1pY3Jvc29mdCBSb290
// SIG // IENlcnRpZmljYXRlIEF1dGhvcml0eYIQea0WoUqgpa1M
// SIG // c1j0BxMuZTBQBgNVHR8ESTBHMEWgQ6BBhj9odHRwOi8v
// SIG // Y3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0
// SIG // cy9taWNyb3NvZnRyb290Y2VydC5jcmwwVAYIKwYBBQUH
// SIG // AQEESDBGMEQGCCsGAQUFBzAChjhodHRwOi8vd3d3Lm1p
// SIG // Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY3Jvc29mdFJv
// SIG // b3RDZXJ0LmNydDATBgNVHSUEDDAKBggrBgEFBQcDCDAN
// SIG // BgkqhkiG9w0BAQUFAAOCAgEAEJeKw1wDRDbd6bStd9vO
// SIG // eVFNAbEudHFbbQwTq86+e4+4LtQSooxtYrhXAstOIBNQ
// SIG // md16QOJXu69YmhzhHQGGrLt48ovQ7DsB7uK+jwoFyI1I
// SIG // 4vBTFd1Pq5Lk541q1YDB5pTyBi+FA+mRKiQicPv2/OR4
// SIG // mS4N9wficLwYTp2OawpylbihOZxnLcVRDupiXD8WmIsg
// SIG // P+IHGjL5zDFKdjE9K3ILyOpwPf+FChPfwgphjvDXuBfr
// SIG // Tot/xTUrXqO/67x9C0J71FNyIe4wyrt4ZVxbARcKFA7S
// SIG // 2hSY9Ty5ZlizLS/n+YWGzFFW6J1wlGysOUzU9nm/qhh6
// SIG // YinvopspNAZ3GmLJPR5tH4LwC8csu89Ds+X57H2146So
// SIG // dDW4TsVxIxImdgs8UoxxWkZDFLyzs7BNZ8ifQv+AeSGA
// SIG // nhUwZuhCEl4ayJ4iIdBD6Svpu/RIzCzU2DKATCYqSCRf
// SIG // WupW76bemZ3KOm+9gSd0BhHudiG/m4LBJ1S2sWo9iaF2
// SIG // YbRuoROmv6pH8BJv/YoybLL+31HIjCPJZr2dHYcSZAI9
// SIG // La9Zj7jkIeW1sMpjtHhUBdRBLlCslLCleKuzoJZ1GtmS
// SIG // hxN1Ii8yqAhuoFuMJb+g74TKIdbrHk/Jmu5J4PcBZW+J
// SIG // C33Iacjmbuqnl84xKf8OxVtc2E0bodj6L54/LlUWa8kT
// SIG // o/0xggSjMIIEnwIBATCBhzB5MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSMwIQYDVQQDExpNaWNyb3NvZnQgQ29kZSBTaWdu
// SIG // aW5nIFBDQQIKYRnMkwABAAAAZjAJBgUrDgMCGgUAoIHO
// SIG // MBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEEMBwGCisG
// SIG // AQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMCMGCSqGSIb3
// SIG // DQEJBDEWBBTV47Caz7OiR2N4KDT37x/y4cwd7zBuBgor
// SIG // BgEEAYI3AgEMMWAwXqBEgEIATQBpAGMAcgBvAHMAbwBm
// SIG // AHQAIABWAGkAcwB1AGEAbAAgAFMAdAB1AGQAaQBvACAA
// SIG // VwBlAGIAIABUAG8AbwBsAHOhFoAUaHR0cDovL3d3dy5h
// SIG // c3AubmV0LyAwDQYJKoZIhvcNAQEBBQAEggEAu26N2vRV
// SIG // SXJWSy4k6H6AOld/nsehEXCIcx85990bwYJqW+A2vcVh
// SIG // OPbJ1zTnGgTbNGyNgcgfz/Cv9yeNeh3v8Kwk6J6/Z0I6
// SIG // +6g/g8eY+hTdbkW9rZAi1AvEuSDiRNtuW4zSM29CKyeP
// SIG // C0AGkEqz/uZ4cJocETJsb5EAUzVHuMQftDObGyZaVmQK
// SIG // qbsoiTU1yE2suFySIgImoetmNpsJ/QZ3avPBAW1nqJEL
// SIG // xEtWzkwqFh/eB59wa2ZRVZJeYRyCZGihKb2UKzn9k5MC
// SIG // 9U74+EqNXimRQEvxb/xN0ZWHBqfDuHUeVXgASmI1vQuY
// SIG // Xba52eyTuKCBrsyPP+fj2VWeSaGCAh8wggIbBgkqhkiG
// SIG // 9w0BCQYxggIMMIICCAIBATCBhTB3MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSEwHwYDVQQDExhNaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0ECCmENr40AAAAAACgwCQYFKw4DAhoFAKBd
// SIG // MBgGCSqGSIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZI
// SIG // hvcNAQkFMQ8XDTEyMDcxMDIxMzgzOFowIwYJKoZIhvcN
// SIG // AQkEMRYEFO31HzDoTkJYJaHu7qUkXXYjxTEZMA0GCSqG
// SIG // SIb3DQEBBQUABIIBAAuvwWwWEVcnFgMqZoZpHIwLJAZA
// SIG // 3tEWb24liOGM3KlAQDVM/XBMQ0Rkzn+2QVSi3FWzZSxl
// SIG // XcXQ4yCOmyEce5WhtpsKqM2ES3XnyiW0B9SkKd1geimo
// SIG // ibg2p9GfdIkMxQLfyiQyU3HIffvE1WbR6aEJOkxHUTy2
// SIG // JSNaeRvaoD6ehGZEeDXcD6cAp80NgjLuNQ9HbwuZ0eGR
// SIG // dSgAHxk6N8u++etgHfcI8SvwEgFgWlViSJMDlOcgS9wH
// SIG // 7rgO2q1ZAVdbVv8TpOhSdrJf1d8g1O6BpKAeLCIk4jyY
// SIG // RhVzs7/buYkTXqfbsIX/chHiiGPKM0u1oreeZ28U0OJz
// SIG // 6CZE7Bo=
// SIG // End signature block
