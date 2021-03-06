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

// services.debug.trace("Rotate");


///////////////////////////////////////////////////////////////////////////////
//
// Global data
//
///////////////////////////////////////////////////////////////////////////////

var useStep = false;
var state = command.getTrait("state");
var stepAmount = 5.0;
var enablePropertyWindow = 8;
var toolProps;

// establish tool options and deal with tool option changes
var manipulatorTraitXYZTraitChangedCookie;

// get manipulator
var manipulatorData = services.manipulators.getManipulatorData("RotationManipulator");
var manipulator = services.manipulators.getManipulator("RotationManipulator");
var undoableItem;

var mxyz = manipulatorData.getTrait("RotationManipulatorTraitXYZ");

var accumDx;
var accumDy;
var accumDz;

var tool = new Object();

var onBeginManipulationHandler;


///////////////////////////////////////////////////////////////////////////////
// designer props bool access
///////////////////////////////////////////////////////////////////////////////
function getDesignerPropAsBool(tname) {
    if (document.designerProps.hasTrait(tname))
        return document.designerProps.getTrait(tname).value;
    return false;
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

function getShouldUsePivot() {
    return getDesignerPropAsBool("usePivot");
}

function getSelectionMode() {
    if (getShouldUsePivot())
        return 0; // default to object mode when using pivot
    if (document.designerProps.hasTrait("SelectionMode"))
        return document.designerProps.getTrait("SelectionMode").value;
    return 0;
}

// setup tool options
function UseStepChanged(sender, args) {
    useStep = document.toolProps.getTrait("UseStep").value;
}

function StepAmountChanged(sender, args) {
    stepAmount = document.toolProps.getTrait("StepAmount").value;
}

var snapCookie;
var toolPropCookie;
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
//
// Helper functions
//
///////////////////////////////////////////////////////////////////////////////

function getWorldMatrix(element) {
    return element.getTrait("WorldTransform").value;
}

function getCameraElement() {
    var camera = document.elements.findElementByTypeId("Microsoft.VisualStudio.3D.PerspectiveCamera");
    return camera;
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

function getRotationTraitId() {
    return "Rotation";
}

///////////////////////////////////////////////////////////////////////////////
//
// helper that given an angle/axis in world space, returns the matrix for
// the rotation in local space of a node
//
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
//
// rotate logic
//
///////////////////////////////////////////////////////////////////////////////
function coreRotate(axis) {

    var selectionMode = getSelectionMode();

    var selectedElement = getFirstSelectedWithoutAncestorInSelection();
    if (selectedElement == null) {
        return;
    }

    // get the angle and axis
    var angle = math.getLength(axis);
    axis = math.getNormalized(axis);

    if (selectionMode == 0) {

        //
        // object mode
        //

        // get the selected as node
        var selectedNode = selectedElement.behavior;

        // determine local to world transform
        var localToWorld = selectedElement.getTrait("WorldTransform").value;
        
        // remove scale
        var scale = selectedElement.getTrait("Scale").value;
        var scaleMatrix = math.createScale(scale);
        var scaleInverse = math.getInverse(scaleMatrix);
        localToWorld = math.multiplyMatrix(localToWorld, scaleInverse);

        // get world to local as inverse
        var worldToLocal = math.getInverse(localToWorld);

        // transform the axis into local space
        axis = math.transformNormal(worldToLocal, axis);
        axis = math.getNormalized(axis);

        // compute the rotation matrix in local space
        var rotationDeltaInLocal = math.createRotationAngleAxis(angle, axis);

        // determine the trait name to modify
        var rotationTraitId = getRotationTraitId();

        // get the current rotation value as euler xyz
        var currentRotation = selectedElement.getTrait(rotationTraitId).value;

        // convert to radians
        var factor = 3.14 / 180.0;
        currentRotation[0] *= factor;
        currentRotation[1] *= factor;
        currentRotation[2] *= factor;

        // get the current rotation matrix
        var currentRotationMatrixInLocal = math.createEulerXYZ(
            currentRotation[0],
            currentRotation[1],
            currentRotation[2]
            );

        // compute the new rotation matrix
        var newRotationInLocal = math.multiplyMatrix(currentRotationMatrixInLocal, rotationDeltaInLocal);

        // extract euler angles
        var newXYZ = math.getEulerXYZ(newRotationInLocal);

        // convert to degrees
        var invFactor = 1.0 / factor;
        newXYZ[0] *= invFactor;
        newXYZ[1] *= invFactor;
        newXYZ[2] *= invFactor;

        // check for grid snap
        var isSnapMode = getDesignerPropAsBool("snap");
        if (isSnapMode && stepAmount != 0) {

            //
            // snap to grid is ON
            //

            var targetX = newXYZ[0] + accumDx;
            var targetY = newXYZ[1] + accumDy;
            var targetZ = newXYZ[2] + accumDz;

            var roundedX = Math.round(targetX / stepAmount) * stepAmount;
            var roundedY = Math.round(targetY / stepAmount) * stepAmount;
            var roundedZ = Math.round(targetZ / stepAmount) * stepAmount;

            var halfStep = stepAmount * 0.5;
            var stepPct = halfStep * 0.9;

            var finalXYZ = selectedElement.getTrait(rotationTraitId).value;
            if (Math.abs(roundedX - targetX) < stepPct) {
                finalXYZ[0] = roundedX;
            }

            if (Math.abs(roundedY - targetY) < stepPct) {
                finalXYZ[1] = roundedY;
            }

            if (Math.abs(roundedZ - targetZ) < stepPct) {
                finalXYZ[2] = roundedZ;
            }

            accumDx = targetX - finalXYZ[0];
            accumDy = targetY - finalXYZ[1];
            accumDz = targetZ - finalXYZ[2];

            newXYZ = finalXYZ;
        }

        undoableItem._lastValue = newXYZ;
        undoableItem.onDo();
    }
    else if (selectionMode == 1 || selectionMode == 2 || selectionMode == 3) {
        //
        // polygon or edge selection mode
        //

        localToWorld = selectedElement.getTrait("WorldTransform").value;
        
        // normalize the local to world matrix to remove scale
        var scale = selectedElement.getTrait("Scale").value;
        var scaleMatrix = math.createScale(scale);
        var scaleInverse = math.getInverse(scaleMatrix);
        localToWorld = math.multiplyMatrix(localToWorld, scaleInverse);

        // get world to local as inverse
        var worldToLocal = math.getInverse(localToWorld);

        // transform the axis into local space
        axis = math.transformNormal(worldToLocal, axis);
        axis = math.getNormalized(axis);

        // compute the rotation matrix in local space
        var rotationDeltaInLocal = math.createRotationAngleAxis(angle, axis);
        
        undoableItem._currentDelta = rotationDeltaInLocal;

        undoableItem.onDo();
    }
}

///////////////////////////////////////////////////////////////////////////////
//
// Listens to manipulator position changes
//
///////////////////////////////////////////////////////////////////////////////
function onManipulatorXYZChangedHandler(sender, args) {
    var axis = manipulatorData.getTrait("RotationManipulatorTraitXYZ").value;
    coreRotate(axis);
}

//
// create an object that can be used to do/undo subobject rotation
//
function UndoableSubobjectRotation(elem) {
    
    this._totalDelta = math.createIdentity();
    this._currentDelta = math.createIdentity();

    // find the mesh child
    this._meshElem = findFirstChildMesh(elem);
    if (this._meshElem == null) {
        return;
    }

    // get the manipulator position. we will use this as our rotation origin
    var rotationOrigin = manipulator.getWorldPosition();

    // get the transform into mesh local space
    var localToWorldMatrix = getWorldMatrix(this._meshElem);
    var worldToLocal = math.getInverse(localToWorldMatrix);

    // transform the manipulator position into mesh space
    this._rotationOrigin = math.transformPoint(worldToLocal, rotationOrigin);

    // get the mesh behavior to use later
    this._mesh = this._meshElem.behavior;

    // get the collection element
    var collElem = this._mesh.selectedObjects;
    if (collElem == null) {
        return;
    }

    // clone the collection element
    this._collectionElement = collElem.clone();

    // get the actual collection we can operate on
    this._collection = this._collectionElement.behavior;
    
    // get the geometry we will operate on
    this._geom = this._meshElem.getTrait("Geometry").value
}

//
// called whenever a manipulation is started
//
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

        var traitId = getRotationTraitId();

        function UndoableRotation(trait, traitValues, initialValue, rotationOffset, urrGeom, restoreGeom, meshes, shouldUsePivot) {
            this._traitArray = traitArray;
            this._traitValues = traitValues;
            this._initialValues = initialValue;
            this._restoreGeom = restoreGeom;
            this._currGeom = currGeom;
            this._rotationOffset = rotationOffset;
            this._meshes = meshes;
            this._shouldUsePivot = shouldUsePivot;
        }

        var traitArray = new Array();
        var traitValues = new Array();
        var initialValues = new Array();
        var restoreGeom = new Array();
        var currGeom = new Array();
        var rotationOffset = new Array();
        var meshes = new Array();

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

                var currTrait = currSelected.getTrait(traitId);

                // get the transform to object space
                var localToWorldMatrix = getWorldMatrix(currSelected);
                var worldToLocal = math.getInverse(localToWorldMatrix);

                // get the manipulators position
                var rotationOriginInWorld = manipulator.getWorldPosition(currSelected);

                // get the manip position in object space
                var rotationPivotInObject = math.transformPoint(worldToLocal, rotationOriginInWorld);

                var meshElem = findFirstChildMesh(currSelected);
                if (meshElem != null) {
                    // save the geometry pointer and a copy of the geometry to restore on undo
                    meshes.push(meshElem.behavior);

                    var geom;
                    geom = meshElem.getTrait("Geometry").value;
                    currGeom.push(geom);
                    restoreGeom.push(geom.clone());
                }
                else {
                    meshes.push(null);
                    currGeom.push(null);
                    restoreGeom.push(null);
                }

                traitArray.push(currTrait);
                traitValues.push(currTrait.value);
                initialValues.push(currTrait.value);
                rotationOffset.push(rotationPivotInObject);
            }
        }

        // create the undoable item
        undoableItem = new UndoableRotation(traitArray, traitValues, initialValues, rotationOffset, currGeom, restoreGeom, meshes, getShouldUsePivot());
        undoableItem.onDo = function () {

            var count = this._traitArray.length;

            // movement delta of all the selected is determined by delta of the first selected
            var delta = [0, 0, 0];
            if (count > 0) {
                delta[0] = this._lastValue[0] - this._initialValues[0][0];
                delta[1] = this._lastValue[1] - this._initialValues[0][1];
                delta[2] = this._lastValue[2] - this._initialValues[0][2];
            }

            var factor = 3.14 / 180.0;
            for (i = 0; i < count; i++) {
                var currTrait = this._traitArray[i];
                this._traitValues[i][0] = this._initialValues[i][0] + delta[0];
                this._traitValues[i][1] = this._initialValues[i][1] + delta[1];
                this._traitValues[i][2] = this._initialValues[i][2] + delta[2];

                var theVal = [0, 0, 0];
                theVal[0] = this._traitValues[i][0];
                theVal[1] = this._traitValues[i][1];
                theVal[2] = this._traitValues[i][2];

                // get the current rotation matrix
                if (this._shouldUsePivot) {
                    var theOldVal = this._traitArray[i].value;
                    var currentRotationMatrixInLocal = math.createEulerXYZ(factor * theOldVal[0], factor * theOldVal[1], factor * theOldVal[2]);

                    // get the new rotation matrix
                    var newRotationInLocal = math.createEulerXYZ(factor * theVal[0], factor * theVal[1], factor * theVal[2]);

                    // get the inverse rotation of the old rotation
                    var toOldRotation = math.getInverse(currentRotationMatrixInLocal);

                    // compute the rotation delta as matrix
                    var rotationDelta = math.multiplyMatrix(toOldRotation, newRotationInLocal);
                    rotationDelta = math.getInverse(rotationDelta);

                    // we want to rotate relative to the manipulator position
                    if (this._meshes[i] != null) {
                        var translationMatrix = math.createTranslation(this._rotationOffset[i][0], this._rotationOffset[i][1], this._rotationOffset[i][2]);
                        var invTranslationMatrix = math.getInverse(translationMatrix);
                        var transform = math.multiplyMatrix(rotationDelta, invTranslationMatrix);
                        transform = math.multiplyMatrix(translationMatrix, transform);

                        // apply inverse delta to geometry
                        this._currGeom[i].transform(transform);
                        this._meshes[i].recomputeCachedGeometry();
                    }
                }

                // set the rotation trait value
                this._traitArray[i].value = theVal;
            }
        }

        undoableItem.onUndo = function () {
            var count = this._traitArray.length;
            for (i = 0; i < count; i++) {
                this._traitArray[i].value = this._initialValues[i];
                if (this._shouldUsePivot) {
                    if (this._meshes[i] != null) {
                        this._currGeom[i].copyFrom(this._restoreGeom[i]);
                        this._meshes[i].recomputeCachedGeometry();
                    }
                }
            }
        }
    }
    else {

        // create the undoable item
        undoableItem = new UndoableSubobjectRotation(document.selectedElement);

        if (selectionMode == 1) {
            // polygon selection mode
            undoableItem.getPoints = function () {

                // use map/hash in object to eliminate dups in collection 
                var points = new Object();

                // loop over the point indices in the poly collection
                var polyCount = this._collection.getPolygonCount();
                for (var i = 0; i < polyCount; i++) {
                    var polyIndex = this._collection.getPolygon(i);

                    // get the point count and loop over polygon points
                    var polygonPointCount = this._geom.getPolygonPointCount(polyIndex);
                    for (var j = 0; j < polygonPointCount; j++) {

                        // get the point index
                        var pointIndex = this._geom.getPolygonPoint(polyIndex, j);
                        points[pointIndex] = pointIndex;
                    }
                }
                return points;
            }
        }
        else if (selectionMode == 2) {
            // edge selection mode
            undoableItem.getPoints = function () {

                // use map/hash in object to eliminate dups in collection 
                var points = new Object();

                // loop over the edges
                var edgeCount = this._collection.getEdgeCount();
                for (var i = 0; i < edgeCount; i++) {
                    var edge = this._collection.getEdge(i);

                    points[edge[0]] = edge[0];
                    points[edge[1]] = edge[1];
                }
                return points;
            }
        }
        else if (selectionMode == 3) {
            // edge selection mode
            undoableItem.getPoints = function () {

                // use map/hash in object to eliminate dups in collection
                var points = new Object();

                // loop over the points
                var ptCount = this._collection.getPointCount();
                for (var i = 0; i < ptCount; i++) {
                    var pt = this._collection.getPoint(i);

                    points[pt] = pt;
                }
                return points;
            }
        }

        // do
        undoableItem.onDo = function () {

            // we want to rotate relative to the manipulator position
            var polygonPoints = this.getPoints()

            var translationMatrix = math.createTranslation(this._rotationOrigin[0], this._rotationOrigin[1], this._rotationOrigin[2]);
            var invTranslationMatrix = math.getInverse(translationMatrix);
            var transform = math.multiplyMatrix(this._currentDelta, invTranslationMatrix);
            transform = math.multiplyMatrix(translationMatrix, transform);

            // loop over the unique set of indices and transform the associated point
            for (var key in polygonPoints) {
                var ptIdx = polygonPoints[key];
                var pt = this._geom.getPointAt(ptIdx);

                pt = math.transformPoint(transform, pt);

                this._geom.setPointAt(ptIdx, pt);
            }

            this._totalDelta = math.multiplyMatrix(this._currentDelta, this._totalDelta);

            // invalidate the mesh collision
            this._mesh.recomputeCachedGeometry();
        }

        //
        // undo
        //
        undoableItem.onUndo = function () {

            // we want to rotate relative to the manipulator position
            var polygonPoints = this.getPoints()

            var invTotal = math.getInverse(this._totalDelta);

            // we want to rotate relative to the manipulator position
            var translationMatrix = math.createTranslation(this._rotationOrigin[0], this._rotationOrigin[1], this._rotationOrigin[2]);
            var invTranslationMatrix = math.getInverse(translationMatrix);
            var transform = math.multiplyMatrix(invTotal, invTranslationMatrix);
            transform = math.multiplyMatrix(translationMatrix, transform);

            // loop over the unique set of indices and transform the associated point
            for (var key in polygonPoints) {
                var ptIdx = polygonPoints[key];
                var pt = this._geom.getPointAt(ptIdx);

                pt = math.transformPoint(transform, pt);

                this._geom.setPointAt(ptIdx, pt);
            }

            this._currentDelta = this._totalDelta;
            this._totalDelta = math.createIdentity();

            this._mesh.recomputeCachedGeometry();
        }
    }

    if (undoableItem != null) {
        //
        // getName()
        //
        undoableItem.getName = function () {
            var IDS_MreUndoRotate = 144;
            return services.strings.getStringFromId(IDS_MreUndoRotate);
        }

        services.undoService.addUndoableItem(undoableItem);
    }
}

///////////////////////////////////////////////////////////////////////////////
//
// tool method implementations
//
///////////////////////////////////////////////////////////////////////////////

tool.activate = function () {
    state.value = 2;

    createOptions();

    services.manipulators.activate("RotationManipulator");

    onBeginManipulationHandler = manipulator.addHandler("OnBeginManipulation", onBeginManipulation);

    manipulatorTraitXYZTraitChangedCookie = mxyz.addHandler("OnDataChanged", onManipulatorXYZChangedHandler);
}

tool.deactivate = function () {
    state.value = 0;

    toolProps.getTrait("StepAmount").removeHandler("OnDataChanged", toolPropCookie);

    var snapTrait = document.designerProps.getOrCreateTrait("snap", "bool", 0);
    snapTrait.removeHandler("OnDataChanged", snapCookie);

    mxyz.removeHandler("OnDataChanged", manipulatorTraitXYZTraitChangedCookie);
    services.manipulators.deactivate("RotationManipulator");

    manipulator.removeHandler("OnBeginManipulation", onBeginManipulationHandler);
}

// If we're already running, do nothing
if (state.value != 2) {
    document.setTool(tool);
}

// SIG // Begin signature block
// SIG // MIIaMgYJKoZIhvcNAQcCoIIaIzCCGh8CAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFNglgMDpaNk6
// SIG // GSbE5wYY8YACArz9oIIVLTCCBKAwggOIoAMCAQICCmEZ
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
// SIG // VmSsmsysl5gpipeQh+qdtjCCBLowggOioAMCAQICCmEF
// SIG // GZYAAAAAABswDQYJKoZIhvcNAQEFBQAwdzELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBMB4XDTExMDcyNTIwNDIxOVoXDTEy
// SIG // MTAyNTIwNDIxOVowgbMxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // DTALBgNVBAsTBE1PUFIxJzAlBgNVBAsTHm5DaXBoZXIg
// SIG // RFNFIEVTTjo5RTc4LTg2NEItMDM5RDElMCMGA1UEAxMc
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIw
// SIG // DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANPLO1Oi
// SIG // n0SjeqtNVnFTineqN5N+AT79qwKjU6n/0bEixQCQ53Vu
// SIG // 7hjogQ4TxdhhAL4foHY7BA0ExQSgqPxDUwahBAS5C5KY
// SIG // AmI479QzEvcrPXvvrUVXhZUgn9djNJxiRo6+ruDZnjn2
// SIG // qVX9z+d35jUT71zov0iTTxpDB1g4in+FFGzqydBLeoJu
// SIG // y9MVYAgUiZSoWz86yT8gfW0vWBp9yoo4vMPCOWjYLVga
// SIG // I+0qEAhaIIyCpe3Rl0WShczDN4PfDZh8xdO24JlT2HgI
// SIG // 9eUjIQdihlpqaRn9cPlTNIH3JTEZhoeLwFWa/apMNRX9
// SIG // W+mVyatTmClfLKXhJQ9kxfKwJ3UCAwEAAaOCAQkwggEF
// SIG // MB0GA1UdDgQWBBR5I+ehDb5VLGgYKWKCZ9bz4TY4WjAf
// SIG // BgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7syuwwzWzDzBU
// SIG // BgNVHR8ETTBLMEmgR6BFhkNodHRwOi8vY3JsLm1pY3Jv
// SIG // c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsGAQUFBwEBBEww
// SIG // SjBIBggrBgEFBQcwAoY8aHR0cDovL3d3dy5taWNyb3Nv
// SIG // ZnQuY29tL3BraS9jZXJ0cy9NaWNyb3NvZnRUaW1lU3Rh
// SIG // bXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0G
// SIG // CSqGSIb3DQEBBQUAA4IBAQBHwnaBWzHdb9M8mfJ6bH6X
// SIG // E1AsBRcbELhEobWM9FbPvbAhtGRtYRzY7ujr9ZLuQ6IY
// SIG // RMP6+u+ttlx/l21LtUP7J2F4CFR8sfmvmAq0dMSq6C1Q
// SIG // xH3+fU6hmdYnKLeu2N+xj4Mijs7zefxhFG2/68yEsN+j
// SIG // u1sFt+pU9WIdbCemY0v646H6u9+FlmVpU7C2cZhkJma9
// SIG // xfFcYryR9D2cS0IADc84BRQmWtwqBUt/apk42N1zmaLO
// SIG // jFAknqTr9T+KeMxUmV0lZqRBBiivScS0UpTs3gKDZP5N
// SIG // 1P9LovwpgNvuP6s87TOIyr8iYNBcOwSwCrSYbTynOk+a
// SIG // 0QEWEWKKQXagMIIFvDCCA6SgAwIBAgIKYTMmGgAAAAAA
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
// SIG // zjEp/w7FW1zYTRuh2Povnj8uVRZryROj/TGCBHEwggRt
// SIG // AgEBMIGHMHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNV
// SIG // BAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBAgph
// SIG // GcyTAAEAAABmMAkGBSsOAwIaBQCggZ4wGQYJKoZIhvcN
// SIG // AQkDMQwGCisGAQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEO
// SIG // MAwGCisGAQQBgjcCARUwIwYJKoZIhvcNAQkEMRYEFD9D
// SIG // yZ8H425ECYF+MzzsnJAwGwdiMD4GCisGAQQBgjcCAQwx
// SIG // MDAuoBSAEgBSAG8AdABhAHQAZQAuAGoAc6EWgBRodHRw
// SIG // Oi8vbWljcm9zb2Z0LmNvbTANBgkqhkiG9w0BAQEFAASC
// SIG // AQAS8ypP7VOFh2HvFuJeqCaB2SoV5S13p+2oL36CMPoT
// SIG // RgqZ/uyTxURj+XQwMBpMFPX5CEHdCWwTAQo3Wa71wUkh
// SIG // Sw+MiBJA+OL6AEWVqsxUYVBJ57yBc28zB+Iw8hWocWnX
// SIG // /WENpIGjhbtkZtq0daJdF4c+WW4ZU7MX/Qqdjl/7hGb4
// SIG // tfFZ60bu0CAlrz8aq4Yi66ak+FrYWaOeba9HNnjFsJ3T
// SIG // fcjO8fOjkxqnOy5wNXK6hKUntXJVhGGTakrMImhcTFQx
// SIG // JpYkyjXeKZckT7TJ2gCqUGQMPgTg1+UUfn8JlzYX3Z4B
// SIG // clmDxqRjGYzUUwI06vvledsTYKTK9HIlrrT3oYICHTCC
// SIG // AhkGCSqGSIb3DQEJBjGCAgowggIGAgEBMIGFMHcxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xITAfBgNVBAMTGE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFBDQQIKYQUZlgAAAAAAGzAHBgUr
// SIG // DgMCGqBdMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0BBwEw
// SIG // HAYJKoZIhvcNAQkFMQ8XDTEyMDcyNzAxNDYzMlowIwYJ
// SIG // KoZIhvcNAQkEMRYEFPlrda9jl3uuxrHmzzDc9sTgBhlZ
// SIG // MA0GCSqGSIb3DQEBBQUABIIBAAbuvr7P6SNZwLnAmH+5
// SIG // hzXQQHNwc4mBsBOjNQ9VamGTJtry6If/85k/5xaFpY9U
// SIG // PYgwPRVb/YjqRTfoqWUogPRX6B46b6LsGy/+1nU82Blx
// SIG // x9rUTYzG4R62eRTsFiOfLyCs2CZYLjPOMr/oC5FipNy6
// SIG // 7fj51mxXvZkkr9vGcLoLFbbKL6UTcyJVIrvvpWYrw718
// SIG // LLrg2evAnO/3l1Z5qZYnqyJRpSdaahgm978zpslnQ2D+
// SIG // ntzuv5aTzGoD/cMXTSqoZBGXxf+1x9vljXvDXt8+7BXi
// SIG // 9rXFUcxMRVyX6sQaHUgAPk98haqi27dD7kUhtSlQXvfh
// SIG // iXEz6aZ39NtFDQM=
// SIG // End signature block
