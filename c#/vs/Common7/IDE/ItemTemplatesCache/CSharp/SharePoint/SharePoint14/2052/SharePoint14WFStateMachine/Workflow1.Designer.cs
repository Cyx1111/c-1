﻿using System;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Collections;
using System.Drawing;
using System.Reflection;
using System.Workflow.ComponentModel.Compiler;
using System.Workflow.ComponentModel.Serialization;
using System.Workflow.ComponentModel;
using System.Workflow.ComponentModel.Design;
using System.Workflow.Runtime;
using System.Workflow.Activities;
using System.Workflow.Activities.Rules;

namespace $rootnamespace$.$subNamespace$
{
    public sealed partial class $ProjectItemClassName$
    {
        #region Designer generated code
        
        /// <summary> 
        /// $loc_Comment5$
        /// $loc_Comment6$
        /// </summary>
        [System.Diagnostics.DebuggerNonUserCode]
        private void InitializeComponent()
        {
            this.CanModifyActivities = true;
            System.Workflow.Runtime.CorrelationToken correlationtoken1 = new System.Workflow.Runtime.CorrelationToken();
            System.Workflow.ComponentModel.ActivityBind activitybind1 = new System.Workflow.ComponentModel.ActivityBind();
            this.onWorkflowActivated1 = new Microsoft.SharePoint.WorkflowActions.OnWorkflowActivated();
            this.eventDrivenActivity1 = new System.Workflow.Activities.EventDrivenActivity();
            this.$ProjectItemClassName$InitialState = new System.Workflow.Activities.StateActivity();
            // 
            // onWorkflowActivated1
            // 
            correlationtoken1.Name = "workflowToken";
            correlationtoken1.OwnerActivityName = "$ProjectItemClassName$";
            this.onWorkflowActivated1.CorrelationToken = correlationtoken1;
            this.onWorkflowActivated1.EventName = "OnWorkflowActivated";
            this.onWorkflowActivated1.Name = "onWorkflowActivated1";
            this.onWorkflowActivated1.WorkflowId = new System.Guid("00000000-0000-0000-0000-000000000000");
            activitybind1.Name = "$ProjectItemClassName$";
            activitybind1.Path = "workflowProperties";
            this.onWorkflowActivated1.SetBinding(Microsoft.SharePoint.WorkflowActions.OnWorkflowActivated.WorkflowPropertiesProperty, ((System.Workflow.ComponentModel.ActivityBind)(activitybind1)));
            // 
            // eventDrivenActivity1
            // 
            this.eventDrivenActivity1.Activities.Add(this.onWorkflowActivated1);
            this.eventDrivenActivity1.Name = "eventDrivenActivity1";
            // 
            // $ProjectItemClassName$InitialState
            // 
            this.$ProjectItemClassName$InitialState.Activities.Add(this.eventDrivenActivity1);
            this.$ProjectItemClassName$InitialState.Name = "$ProjectItemClassName$InitialState";
            // 
            // $ProjectItemClassName$
            // 
            this.Activities.Add(this.$ProjectItemClassName$InitialState);
            this.CompletedStateName = null;
            this.DynamicUpdateCondition = null;
            this.InitialStateName = "$ProjectItemClassName$InitialState";
            this.Name = "$ProjectItemClassName$";
            this.CanModifyActivities = false;

        }

        #endregion

        private Microsoft.SharePoint.WorkflowActions.OnWorkflowActivated onWorkflowActivated1;
        private EventDrivenActivity eventDrivenActivity1;
        private StateActivity $ProjectItemClassName$InitialState;
    }
}
