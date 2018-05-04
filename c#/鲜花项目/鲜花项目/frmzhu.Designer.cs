namespace 鲜花项目
{
    partial class frmMain
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.系统管理ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.鲜花销售管理ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.查看鲜花销售信息ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.录入鲜花销售记录ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.鲜花销售统计ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.退出ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // menuStrip1
            // 
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.系统管理ToolStripMenuItem,
            this.鲜花销售管理ToolStripMenuItem,
            this.退出ToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(656, 28);
            this.menuStrip1.TabIndex = 1;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // 系统管理ToolStripMenuItem
            // 
            this.系统管理ToolStripMenuItem.Name = "系统管理ToolStripMenuItem";
            this.系统管理ToolStripMenuItem.Size = new System.Drawing.Size(81, 24);
            this.系统管理ToolStripMenuItem.Text = "系统管理";
            // 
            // 鲜花销售管理ToolStripMenuItem
            // 
            this.鲜花销售管理ToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.查看鲜花销售信息ToolStripMenuItem,
            this.录入鲜花销售记录ToolStripMenuItem,
            this.鲜花销售统计ToolStripMenuItem});
            this.鲜花销售管理ToolStripMenuItem.Name = "鲜花销售管理ToolStripMenuItem";
            this.鲜花销售管理ToolStripMenuItem.Size = new System.Drawing.Size(111, 24);
            this.鲜花销售管理ToolStripMenuItem.Text = "鲜花销售管理";
            // 
            // 查看鲜花销售信息ToolStripMenuItem
            // 
            this.查看鲜花销售信息ToolStripMenuItem.Name = "查看鲜花销售信息ToolStripMenuItem";
            this.查看鲜花销售信息ToolStripMenuItem.Size = new System.Drawing.Size(198, 24);
            this.查看鲜花销售信息ToolStripMenuItem.Text = "查看鲜花销售信息";
            this.查看鲜花销售信息ToolStripMenuItem.Click += new System.EventHandler(this.查看鲜花销售信息ToolStripMenuItem_Click);
            // 
            // 录入鲜花销售记录ToolStripMenuItem
            // 
            this.录入鲜花销售记录ToolStripMenuItem.Name = "录入鲜花销售记录ToolStripMenuItem";
            this.录入鲜花销售记录ToolStripMenuItem.Size = new System.Drawing.Size(198, 24);
            this.录入鲜花销售记录ToolStripMenuItem.Text = "录入鲜花销售记录";
            // 
            // 鲜花销售统计ToolStripMenuItem
            // 
            this.鲜花销售统计ToolStripMenuItem.Name = "鲜花销售统计ToolStripMenuItem";
            this.鲜花销售统计ToolStripMenuItem.Size = new System.Drawing.Size(198, 24);
            this.鲜花销售统计ToolStripMenuItem.Text = "鲜花销售统计";
            // 
            // 退出ToolStripMenuItem
            // 
            this.退出ToolStripMenuItem.Name = "退出ToolStripMenuItem";
            this.退出ToolStripMenuItem.Size = new System.Drawing.Size(51, 24);
            this.退出ToolStripMenuItem.Text = "退出";
            this.退出ToolStripMenuItem.Click += new System.EventHandler(this.退出ToolStripMenuItem_Click);
            // 
            // frmMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(656, 528);
            this.Controls.Add(this.menuStrip1);
            this.IsMdiContainer = true;
            this.MainMenuStrip = this.menuStrip1;
            this.Name = "frmMain";
            this.Text = "鲜花销售管理系统";
            this.Load += new System.EventHandler(this.frmMain_Load);
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem 系统管理ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem 鲜花销售管理ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem 查看鲜花销售信息ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem 录入鲜花销售记录ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem 鲜花销售统计ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem 退出ToolStripMenuItem;
    }
}

