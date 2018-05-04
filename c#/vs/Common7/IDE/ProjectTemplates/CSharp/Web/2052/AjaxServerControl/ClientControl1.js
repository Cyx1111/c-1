/// <reference name="MicrosoftAjax.js"/>


Type.registerNamespace("$safeprojectname$");

$safeprojectname$.ClientControl1 = function(element) {
    $safeprojectname$.ClientControl1.initializeBase(this, [element]);
}

$safeprojectname$.ClientControl1.prototype = {
    initialize: function() {
        $safeprojectname$.ClientControl1.callBaseMethod(this, 'initialize');
        
        // 在此处添加自定义初始化
    },
    dispose: function() {        
        //在此处添加自定义释放操作
        $safeprojectname$.ClientControl1.callBaseMethod(this, 'dispose');
    }
}
$safeprojectname$.ClientControl1.registerClass('$safeprojectname$.ClientControl1', Sys.UI.Control);

if (typeof(Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();