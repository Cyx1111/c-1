﻿using System;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Collections;
using System.Reflection;
using System.Workflow.ComponentModel;
using System.Workflow.ComponentModel.Design;
using System.Workflow.Runtime;
using System.Workflow.Activities;
using System.Workflow.Activities.Rules;

namespace $safeprojectname$
{
    partial class $SafeClassName$
    {
		#region Designer generated code
        
        /// <summary> 
        /// 设计器支持所需的方法 - 不要
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        [System.Diagnostics.DebuggerNonUserCode]
        [System.CodeDom.Compiler.GeneratedCode("","")]
        private void InitializeComponent()
        {
            this.CanModifyActivities = true;
            this.$safeitemname$InitialState = new System.Workflow.Activities.StateActivity();
            // 
            // $safeitemname$InitialState
            // 
            this.$safeitemname$InitialState.Name = "$safeitemname$InitialState";
            // 
            // $safeitemname$
            // 
            this.Activities.Add(this.$safeitemname$InitialState);
            this.CompletedStateName = null;
            this.DynamicUpdateCondition = null;
            this.InitialStateName = "$safeitemname$InitialState";
            this.Name = "$SafeClassName$";
            this.CanModifyActivities = false;
        }

        #endregion

        private StateActivity $safeitemname$InitialState;
	}
}
