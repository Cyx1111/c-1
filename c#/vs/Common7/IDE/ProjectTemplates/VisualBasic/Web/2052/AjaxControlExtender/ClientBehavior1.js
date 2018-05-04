/// <reference name="MicrosoftAjax.js"/>

Type.registerNamespace("$safeprojectname$");

$safeprojectname$.ClientBehavior1 = function(element) {
    $safeprojectname$.ClientBehavior1.initializeBase(this, [element]);
}

$safeprojectname$.ClientBehavior1.prototype = {
    initialize: function() {
        $safeprojectname$.ClientBehavior1.callBaseMethod(this, 'initialize');
        
        // 在此处添加自定义初始化
    },
    dispose: function() {        
        //在此处添加自定义释放操作
        $safeprojectname$.ClientBehavior1.callBaseMethod(this, 'dispose');
    }
}
$safeprojectname$.ClientBehavior1.registerClass('$safeprojectname$.ClientBehavior1', Sys.UI.Behavior);

if (typeof(Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();