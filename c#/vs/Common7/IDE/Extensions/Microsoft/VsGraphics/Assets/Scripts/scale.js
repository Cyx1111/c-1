//
// Copyright (c) Microsoft Corporation.  All rights reserved.
//
//
// Use of this source code is subject to the terms of the Microsoft shared
// source or premium shared source license agreement under which you licensed
// this source code. If you did not accept the terms of the license agreement,
// you are not authorized to use this source code. For the terms of the license,
// please see the license agreement between you and Microsoft or, if applicable,
// see the SOURCE.RTF on your install media or the root of your tools installation.
// THE SOURCE CODE IS PROVIDED "AS IS", WITH NO WARRANTIES OR INDEMNITIES.
//

///////////////////////////////////////////////////////////////////////////////
// heper to get a designer property as a bool
///////////////////////////////////////////////////////////////////////////////
function getDesignerPropAsBool(tname) {
    if (document.designerProps.hasTrait(tname))
        return document.designerProps.getTrait(tname).value;

    return false;
}

function getSelectionMode() {
    if (getDesignerPropAsBool("usePivot"))
        return 0; // default to object mode when using pivot
    if (document.designerProps.hasTrait("SelectionMode"))
        return document.designerProps.getTrait("SelectionMode").value;
    return 0;
}

function getCommandState(commandName) {
    var commandData = services.commands.getCommandData(commandName);
    if (commandData != null) {
        var trait = commandData.getTrait("state");
        if (trait != null) {
            return trait.value;
        }
    }
    return -1;
}

///////////////////////////////////////////////////////////////////////////////
// Button state trait
///////////////////////////////////////////////////////////////////////////////
var state = command.getTrait("state");

///////////////////////////////////////////////////////////////////////////////
// Property window and tool option settings 
///////////////////////////////////////////////////////////////////////////////

var enablePropertyWindow = 8;

var stepAmount = 1.0;

function StepAmountChanged(sender, args) {
    stepAmount = document.toolProps.getTrait("StepAmount").value;
}

var toolProps;
var toolPropCookie;
var snapCookie;
function createOptions() {
    toolProps = document.createElement("toolProps", "type", "toolProps");
    toolProps.getOrCreateTrait("StepAmount", "float", enablePropertyWindow);
    document.toolProps = toolProps;

    var snapTrait = document.designerProps.getOrCreateTrait("snap", "bool", 0);
    snapCookie = snapTrait.addHandler("OnDataChanged", OnSnapEnabledTraitChanged);

    toolProps.getTrait("StepAmount").value = stepAmount;

    // Set up the callback when the option traits are changed
    toolPropCookie = toolProps.getTrait("StepAmount").addHandler("OnDataChanged", StepAmountChanged);

    OnSnapEnabledTraitChanged(null, null);
}

function OnSnapEnabledTraitChanged(sender, args) {
    var snapTrait = document.designerProps.getOrCreateTrait("snap", "bool", 0);
    if (toolProps != null) {
        var stepAmountTrait = toolProps.getTrait("StepAmount");
        if (stepAmountTrait != null) {
            var newFlags = stepAmountTrait.flags;
            if (snapTrait.value) {
                newFlags |= enablePropertyWindow;
            }
            else {
                newFlags &= ~enablePropertyWindow;
            }
            stepAmountTrait.flags = newFlags;

            document.refreshPropertyWindow();
        }
    }
}

function getCameraElement()
{
    var camera = document.elements.findElementByTypeId("Microsoft.VisualStudio.3D.PerspectiveCamera");
    return camera;
}

function getWorldMatrix(element) {
    return element.getTrait("WorldTransform").value;
}

// find the mesh child
function findFirstChildMesh(parent) {
    // find the mesh child
    for (var i = 0; i < parent.childCount; i++) {

        // get child and its materials
        var child = parent.getChild(i);
        if (child.typeId == "Microsoft.VisualStudio.3D.Mesh") {
            return child;
        }
    }
    return null;
}

function getFirstSelectedWithoutAncestorInSelection() {
    var count = services.selection.count;
    for (var i = 0; i < count; i++) {
        var currSelected = services.selection.getElement(i);

        //
        // don't operate on items whose parents (in scene) are ancestors
        // since this will double the amount of translation applied to those
        //
        var hasAncestor = false;
        for (var otherIndex = 0; otherIndex < count; otherIndex++) {
            if (otherIndex != i) {
                var ancestor = services.selection.getElement(otherIndex);
                if (currSelected.behavior.isAncestor(ancestor)) {
                    hasAncestor = true;
                    break;
                }
            }
        }

        if (!hasAncestor) {
            return currSelected;
        }
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
// Manipulator registration and event handling
///////////////////////////////////////////////////////////////////////////////
var manipulatorData = services.manipulators.getManipulatorData("ScaleManipulator");
var manipulator = services.manipulators.getManipulator("ScaleManipulator");
var undoableItem;

var manipulatorTraitXYZTraitChangedCookie;
var mxyz;

var accumDx;
var accumDy;
var accumDz;

///////////////////////////////////////////////////////////////////////////////
// Scale logic
///////////////////////////////////////////////////////////////////////////////
function coreScale(dx, dy, dz) {

    var selectionMode = getSelectionMode();

    var selectedElement = getFirstSelectedWithoutAncestorInSelection();

    if (selectedElement == null) {
        return;
    }

    if (selectionMode == 0) {

        //
        // object mode
        //
        var t = selectedElement.getTrait("Scale").value;

        var isSnapMode = getDesignerPropAsBool("snap");
        if (isSnapMode && stepAmount != 0) {

            var targetX = t[0] + dx + accumDx;
            var targetY = t[1] + dy + accumDy;
            var targetZ = t[2] + dz + accumDz;

            var roundedX = Math.round(targetX / stepAmount) * stepAmount;
            var roundedY = Math.round(targetY / stepAmount) * stepAmount;
            var roundedZ = Math.round(targetZ / stepAmount) * stepAmount;

            var halfStep = stepAmount * 0.5;
            var stepPct = halfStep * 0.9;

            if (Math.abs(roundedX - targetX) < stepPct) {
                t[0] = roundedX;
            }

            if (Math.abs(roundedY - targetY) < stepPct) {
                t[1] = roundedY;
            }

            if (Math.abs(roundedZ - targetZ) < stepPct) {
                t[2] = roundedZ;
            }

            accumDx = targetX - t[0];
            accumDy = targetY - t[1];
            accumDz = targetZ - t[2];
        }
        else {
            t[0] = t[0] + dx;
            t[1] = t[1] + dy;
            t[2] = t[2] + dz;
        }

        var minScale = 0.00001;
        if (Math.abs(t[0]) < minScale) {
            t[0] = minScale;
        }
        if (Math.abs(t[1]) < minScale) {
            t[1] = minScale;
        }
        if (Math.abs(t[2]) < minScale) {
            t[2] = minScale;
        }

        undoableItem._lastValue = t;
        undoableItem.onDo();
    }
    else if (selectionMode == 1 || selectionMode == 2 || selectionMode == 3) {

        // subobjects    
        undoableItem._currentDelta[0] = dx;
        undoableItem._currentDelta[1] = dy;
        undoableItem._currentDelta[2] = dz;

        undoableItem.onDo();
    }
}

///////////////////////////////////////////////////////////////////////////////
//
// Listens to manipulator position changes
//
///////////////////////////////////////////////////////////////////////////////
function onManipulatorXYZChangedHandler(sender, args) {
    var xyzDelta = manipulatorData.getTrait("ManipulatorTraitXYZ").value;
    var dx = xyzDelta[0];
    var dy = xyzDelta[1];
    var dz = xyzDelta[2];

    coreScale(dx, dy, dz);
}

function UndoableSubobjectScale(obj, elem) {

    obj._totalDelta = [1, 1, 1];
    obj._currentDelta = [0, 0, 0];
    
    // find the mesh child
    obj._meshElem = findFirstChildMesh(elem);
    if (obj._meshElem == null) {
        return;
    }

    // get the scale origin in local space of node we're manipulating
    var manipulatorToWorld = manipulator.getWorldTransform();
    manipulatorToWorld = math.getNormalizedMatrix(manipulatorToWorld);

    var localToWorldMatrix = getWorldMatrix(obj._meshElem);

    var worldToLocal = math.getInverse(localToWorldMatrix);
    obj._manipulatorToLocal = math.multiplyMatrix(worldToLocal, manipulatorToWorld);
    obj._localToManipulator = math.getInverse(obj._manipulatorToLocal);

    obj._mesh = obj._meshElem.behavior;

    // loop over the elements in the polygon collection
    var collElem = obj._mesh.selectedObjects;
    if (collElem == null) {
        return;
    }

    obj._collectionElem = collElem.clone();

    // get the actual collection we can operate on
    obj._collection = obj._collectionElem.behavior;

    obj._geom = obj._meshElem.getTrait("Geometry").value
}

function SubobjectDoScale(obj)
{
    var polygonPoints = obj.getPoints();
    var lastTotal = [0, 0, 0];

    lastTotal[0] = obj._totalDelta[0];
    lastTotal[1] = obj._totalDelta[1];
    lastTotal[2] = obj._totalDelta[2];

    obj._totalDelta[0] += obj._currentDelta[0];
    obj._totalDelta[1] += obj._currentDelta[1];
    obj._totalDelta[2] += obj._currentDelta[2];

    var scale = [obj._totalDelta[0] / lastTotal[0], obj._totalDelta[1] / lastTotal[1], obj._totalDelta[2] / lastTotal[2]];

    var scaleMatrix = math.createScale(scale);

    var transform = math.multiplyMatrix(scaleMatrix, obj._localToManipulator);
    transform = math.multiplyMatrix(obj._manipulatorToLocal, transform);

    // loop over the unique set of indices and transform the associated point
    for (var key in polygonPoints) {

        var ptIdx = polygonPoints[key];
        var pt = obj._geom.getPointAt(ptIdx);

        pt = math.transformPoint(transform, pt);

        obj._geom.setPointAt(ptIdx, pt);
    }

    // invalidate the mesh collision
    obj._mesh.recomputeCachedGeometry();
}

function SubobjectUndoScale(obj) {
    var polygonPoints = obj.getPoints();

    var scale = [1.0 / obj._totalDelta[0], 1.0 / obj._totalDelta[1], 1.0 / obj._totalDelta[2]];

    var scaleMatrix = math.createScale(scale);

    var transform = math.multiplyMatrix(scaleMatrix, obj._localToManipulator);
    transform = math.multiplyMatrix(obj._manipulatorToLocal, transform);

    // loop over the unique set of indices and transform the associated point
    for (var key in polygonPoints) {

        var ptIdx = polygonPoints[key];
        var pt = obj._geom.getPointAt(ptIdx);

        pt = math.transformPoint(transform, pt);

        obj._geom.setPointAt(ptIdx, pt);
    }

    obj._currentDelta[0] = obj._totalDelta[0] - 1;
    obj._currentDelta[1] = obj._totalDelta[1] - 1;
    obj._currentDelta[2] = obj._totalDelta[2] - 1;

    obj._totalDelta[0] = 1;
    obj._totalDelta[1] = 1;
    obj._totalDelta[2] = 1;

    obj._mesh.recomputeCachedGeometry();
}

function onBeginManipulation() {

    undoableItem = null;

    //
    // Check the selection mode
    //
    var selectionMode = getSelectionMode();
    if (selectionMode == 0) {
        //
        // object selection
        //

        accumDx = 0;
        accumDy = 0;
        accumDz = 0;

        function UndoableScale(trait, traitValues, initialValue) {
            this._traitArray = traitArray;
            this._traitValues = traitValues;
            this._initialValues = initialValue;
        }

        var traitArray = new Array();
        var traitValues = new Array();
        var initialValues = new Array();

        //
        // add the traits of selected items to the collections that we'll be operating on
        //
        var count = services.selection.count;
        for (i = 0; i < count; i++) {
            var currSelected = services.selection.getElement(i);

            //
            // don't operate on items whose parents (in scene) are ancestors
            // since this will double the amount of translation applied to those
            //
            var hasAncestor = false;
            for (var otherIndex = 0; otherIndex < count; otherIndex++) {
                if (otherIndex != i) {
                    var ancestor = services.selection.getElement(otherIndex);
                    if (currSelected.behavior.isAncestor(ancestor)) {
                        hasAncestor = true;
                        break;
                    }
                }
            }

            if (!hasAncestor) {
                var currTrait = currSelected.getTrait("Scale");

                traitArray.push(currTrait);
                traitValues.push(currTrait.value);
                initialValues.push(currTrait.value);
            }
        }


        // create the undoable item
        undoableItem = new UndoableScale(traitArray, traitValues, initialValues);

        undoableItem.onDo = function () {

            var count = this._traitArray.length;

            // movement delta of all the selected is determined by delta of the first selected
            var delta = [0, 0, 0];
            if (count > 0) {
                delta[0] = this._lastValue[0] - this._initialValues[0][0];
                delta[1] = this._lastValue[1] - this._initialValues[0][1];
                delta[2] = this._lastValue[2] - this._initialValues[0][2];
            }

            for (i = 0; i < count; i++) {
                var currTrait = this._traitArray[i];
                this._traitValues[i][0] = this._initialValues[i][0] + delta[0];
                this._traitValues[i][1] = this._initialValues[i][1] + delta[1];
                this._traitValues[i][2] = this._initialValues[i][2] + delta[2];

                var theVal = [this._traitValues[i][0], this._traitValues[i][1], this._traitValues[i][2]];
                this._traitArray[i].value = theVal;
            }
        }

        undoableItem.onUndo = function () {
            var count = this._traitArray.length;
            for (i = 0; i < count; i++) {
                this._traitArray[i].value = this._initialValues[i];
            }
        }
    }
    else {
        
        // create the undoable item
        undoableItem = new Object();
        UndoableSubobjectScale(undoableItem, document.selectedElement);

        if (selectionMode == 1) {
            
            // face selection mode

            // gets the points
            undoableItem.getPoints = function () {

                // map we will store indices in
                // we use the map instead of array to eliminate dups
                var polygonPoints = new Object();

                // loop over the point indices in the poly collection
                var polyCount = this._collection.getPolygonCount();
                for (var i = 0; i < polyCount; i++) {
                    var polyIndex = this._collection.getPolygon(i);

                    // get the point count and loop over polygon points
                    var polygonPointCount = this._geom.getPolygonPointCount(polyIndex);
                    for (var j = 0; j < polygonPointCount; j++) {

                        // get the point index
                        var pointIndex = this._geom.getPolygonPoint(polyIndex, j);
                        polygonPoints[pointIndex] = pointIndex;
                    }
                }

                return polygonPoints;
            }
        }
        else if (selectionMode == 2) {

            // edges selection mode

            // gets the points
            undoableItem.getPoints = function () {

                // we use the map instead of array to eliminate dups
                var polygonPoints = new Object();

                // loop over the edges collection
                var edgeCount = this._collection.getEdgeCount();
                for (var i = 0; i < edgeCount; i++) {
                    var edge = this._collection.getEdge(i);
                    polygonPoints[edge[0]] = edge[0];
                    polygonPoints[edge[1]] = edge[1];
                }

                return polygonPoints;
            }
        }
        else if (selectionMode == 3) {

            // point selection mode

            // gets the points
            undoableItem.getPoints = function () {

                // we use the map instead of array to eliminate dups
                var polygonPoints = new Object();

                // loop over the point indices in the collection
                var ptCount = this._collection.getPointCount();
                for (var i = 0; i < ptCount; i++) {
                    var pt = this._collection.getPoint(i);
                    polygonPoints[pt] = pt;
                }

                return polygonPoints;
            }
        }

        //
        // do
        //
        undoableItem.onDo = function () {
            SubobjectDoScale(this);
        }

        //
        // undo
        //
        undoableItem.onUndo = function () {
            SubobjectUndoScale(this);
        }
    }

    if (undoableItem != null) {
        //
        // getName()
        //
        undoableItem.getName = function () {
            var IDS_MreUndoScale = 145;
            return services.strings.getStringFromId(IDS_MreUndoScale);
        }

        // add to undo stack
        services.undoService.addUndoableItem(undoableItem);
    }
}

//
// the tool
//
var tool = new Object();

var onBeginManipulationHandler;

tool.activate = function () {
    state.value = 2;

    createOptions();

    services.manipulators.activate("ScaleManipulator")

    mxyz = manipulatorData.getTrait("ManipulatorTraitXYZ");

    manipulatorTraitXYZTraitChangedCookie = mxyz.addHandler("OnDataChanged", onManipulatorXYZChangedHandler);

    onBeginManipulationHandler = manipulator.addHandler("OnBeginManipulation", onBeginManipulation);
}

tool.deactivate = function () {
    state.value = 0;

    toolProps.getTrait("StepAmount").removeHandler("OnDataChanged", toolPropCookie);

    var snapTrait = document.designerProps.getOrCreateTrait("snap", "bool", 0);
    snapTrait.removeHandler("OnDataChanged", snapCookie);

    mxyz.removeHandler("OnDataChanged", manipulatorTraitXYZTraitChangedCookie);
    
    manipulator.removeHandler("OnBeginManipulation", onBeginManipulationHandler);

    services.manipulators.deactivate("ScaleManipulator");
}

///////////////////////////////////////////////////////////////////////////////
// Global code
///////////////////////////////////////////////////////////////////////////////
if (state.value != 2) {
    document.setTool(tool);
}
// SIG // Begin signature block
// SIG // MIIaGwYJKoZIhvcNAQcCoIIaDDCCGggCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFPk1TrhToGUY
// SIG // 2pN4Cs9QI2tPAAX1oIIVFjCCBKAwggOIoAMCAQICCmEZ
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
// SIG // o/0xggRxMIIEbQIBATCBhzB5MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSMwIQYDVQQDExpNaWNyb3NvZnQgQ29kZSBTaWdu
// SIG // aW5nIFBDQQIKYRnMkwABAAAAZjAJBgUrDgMCGgUAoIGc
// SIG // MBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEEMBwGCisG
// SIG // AQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMCMGCSqGSIb3
// SIG // DQEJBDEWBBSjopzyDU7C4bVgw7GRHqnyIScPJjA8Bgor
// SIG // BgEEAYI3AgEMMS4wLKASgBAAUwBjAGEAbABlAC4AagBz
// SIG // oRaAFGh0dHA6Ly9taWNyb3NvZnQuY29tMA0GCSqGSIb3
// SIG // DQEBAQUABIIBAGdvRTe2FLNpYtYAWOWhIEDzhBe//RZY
// SIG // Ec7Z6rbAt+n+yuRXhx3ixzUfo9uOZhq14NycmsOy1dwU
// SIG // r8GP71wia7Kr7iKHORrWOkdKbPuQz5xwDesXbLIZUbhH
// SIG // vH2+jkAZnW+OGYHCvffhZVdqPCkeR4Ep1c2s8M7nJw+D
// SIG // NWvzoayV+jeXBMVwheJu1I5TGdBwSa9GqkvTNU97gS9Y
// SIG // Ve6WWEud5KLDJyoUTDAst/JXDlD8KTCAP+cS3YdxJF8A
// SIG // QcZVmVBq4ixI5qWjmTlLMBDITeGOY6qkA+rH7NQTWe+u
// SIG // yYnDtrKbUE60nWCcJVkKTYBzsQQzA4OzJFYb+delvIlR
// SIG // x22hggIfMIICGwYJKoZIhvcNAQkGMYICDDCCAggCAQEw
// SIG // gYUwdzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMY
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBAgphDa+NAAAA
// SIG // AAAoMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMxCwYJ
// SIG // KoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xMjA3Mjcw
// SIG // MTQ2MzJaMCMGCSqGSIb3DQEJBDEWBBROc6z59JW+aUBw
// SIG // tBWurpqohkck4jANBgkqhkiG9w0BAQUFAASCAQAvNUbK
// SIG // KppBdhOc0JheTS4uohIRl/7EPhAVhBScgWx8P1ZZtFnp
// SIG // 1G7aDlCqVJ3eIkV6qtBD6gPOkoD1lAz/K2fPVJC5TtVP
// SIG // bypvtuZaYEt/0Jdlg6QUOEWlLUl5OhuaepwuNPZwqq/u
// SIG // Nwc8FK+zSIAiyZhC3LleHT6w8G9PyU2sKmNhbmyUvuPe
// SIG // dLufLtOArJxhe16tKpRRMMzYuMTM/LcrTOBnDZXmE47A
// SIG // cYeZIhO3k3jLfUhpRDYn/VS/TsNrmoDxfQELT+UzyXPS
// SIG // PVNWfTWXnWJnO5e6uvJoEjr4jT7dIgJRoosGTSJaJivP
// SIG // /d+yTD52UpcDNqfuVLaSEPKbiyhP
// SIG // End signature block
