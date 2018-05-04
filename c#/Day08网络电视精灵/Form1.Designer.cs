namespace Day08网络电视精灵
{
    partial class Form1
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
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.dgvProgList = new System.Windows.Forms.DataGridView();
            this.playTime = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Median = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.programeName = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.path = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.tvChannel = new System.Windows.Forms.TreeView();
            this.cmenuRight = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.tsmAddToFavor = new System.Windows.Forms.ToolStripMenuItem();
            this.TMenuItemDel = new System.Windows.Forms.ToolStripMenuItem();
            this.imageIcons = new System.Windows.Forms.ImageList(this.components);
            this.menuTree = new System.Windows.Forms.MenuStrip();
            this.tsmListRefresh = new System.Windows.Forms.ToolStripMenuItem();
            this.tsmRemindManage = new System.Windows.Forms.ToolStripMenuItem();
            this.tcWeekone = new System.Windows.Forms.TabControl();
            this.tabPage1 = new System.Windows.Forms.TabPage();
            ((System.ComponentModel.ISupportInitialize)(this.dgvProgList)).BeginInit();
            this.cmenuRight.SuspendLayout();
            this.menuTree.SuspendLayout();
            this.tcWeekone.SuspendLayout();
            this.SuspendLayout();
            // 
            // dgvProgList
            // 
            this.dgvProgList.AllowUserToAddRows = false;
            this.dgvProgList.AllowUserToDeleteRows = false;
            this.dgvProgList.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.dgvProgList.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dgvProgList.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.playTime,
            this.Median,
            this.programeName,
            this.path});
            this.dgvProgList.Location = new System.Drawing.Point(311, 76);
            this.dgvProgList.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.dgvProgList.MultiSelect = false;
            this.dgvProgList.Name = "dgvProgList";
            this.dgvProgList.RowTemplate.Height = 23;
            this.dgvProgList.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dgvProgList.Size = new System.Drawing.Size(561, 377);
            this.dgvProgList.TabIndex = 0;
            // 
            // playTime
            // 
            this.playTime.DataPropertyName = "playTime";
            this.playTime.HeaderText = "播放时间";
            this.playTime.Name = "playTime";
            this.playTime.ReadOnly = true;
            // 
            // Median
            // 
            this.Median.DataPropertyName = "Median";
            this.Median.HeaderText = "时段";
            this.Median.Name = "Median";
            this.Median.ReadOnly = true;
            this.Median.Visible = false;
            // 
            // programeName
            // 
            this.programeName.DataPropertyName = "programname";
            this.programeName.HeaderText = "节目名称";
            this.programeName.Name = "programeName";
            this.programeName.ReadOnly = true;
            // 
            // path
            // 
            this.path.DataPropertyName = "FilePath";
            this.path.HeaderText = "文件路径";
            this.path.Name = "path";
            this.path.ReadOnly = true;
            this.path.Visible = false;
            // 
            // tvChannel
            // 
            this.tvChannel.ContextMenuStrip = this.cmenuRight;
            this.tvChannel.ImageIndex = 0;
            this.tvChannel.ImageList = this.imageIcons;
            this.tvChannel.Location = new System.Drawing.Point(37, 51);
            this.tvChannel.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.tvChannel.Name = "tvChannel";
            this.tvChannel.SelectedImageIndex = 1;
            this.tvChannel.Size = new System.Drawing.Size(217, 412);
            this.tvChannel.TabIndex = 6;
            this.tvChannel.Tag = "1";
            this.tvChannel.AfterSelect += new System.Windows.Forms.TreeViewEventHandler(this.tvChannel_AfterSelect);
            // 
            // cmenuRight
            // 
            this.cmenuRight.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tsmAddToFavor,
            this.TMenuItemDel});
            this.cmenuRight.Name = "cmenuRight";
            this.cmenuRight.Size = new System.Drawing.Size(169, 52);
            // 
            // tsmAddToFavor
            // 
            this.tsmAddToFavor.Name = "tsmAddToFavor";
            this.tsmAddToFavor.Size = new System.Drawing.Size(168, 24);
            this.tsmAddToFavor.Text = "加入我的电台";
            // 
            // TMenuItemDel
            // 
            this.TMenuItemDel.Name = "TMenuItemDel";
            this.TMenuItemDel.Size = new System.Drawing.Size(168, 24);
            this.TMenuItemDel.Text = "删除";
            // 
            // imageIcons
            // 
            this.imageIcons.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("imageIcons.ImageStream")));
            this.imageIcons.TransparentColor = System.Drawing.Color.Transparent;
            this.imageIcons.Images.SetKeyName(0, "arrowright.gif");
            this.imageIcons.Images.SetKeyName(1, "arrowdown.gif");
            // 
            // menuTree
            // 
            this.menuTree.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tsmListRefresh,
            this.tsmRemindManage});
            this.menuTree.Location = new System.Drawing.Point(0, 0);
            this.menuTree.Name = "menuTree";
            this.menuTree.Padding = new System.Windows.Forms.Padding(8, 2, 0, 2);
            this.menuTree.Size = new System.Drawing.Size(900, 28);
            this.menuTree.TabIndex = 7;
            this.menuTree.Text = "menuStrip1";
            this.menuTree.ItemClicked += new System.Windows.Forms.ToolStripItemClickedEventHandler(this.menuTree_ItemClicked);
            // 
            // tsmListRefresh
            // 
            this.tsmListRefresh.Name = "tsmListRefresh";
            this.tsmListRefresh.Size = new System.Drawing.Size(96, 24);
            this.tsmListRefresh.Text = "更新节目单";
            // 
            // tsmRemindManage
            // 
            this.tsmRemindManage.Name = "tsmRemindManage";
            this.tsmRemindManage.Size = new System.Drawing.Size(81, 24);
            this.tsmRemindManage.Text = "提醒管理";
            // 
            // tcWeekone
            // 
            this.tcWeekone.Controls.Add(this.tabPage1);
            this.tcWeekone.Location = new System.Drawing.Point(280, 51);
            this.tcWeekone.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.tcWeekone.Name = "tcWeekone";
            this.tcWeekone.SelectedIndex = 0;
            this.tcWeekone.Size = new System.Drawing.Size(577, 414);
            this.tcWeekone.TabIndex = 5;
            // 
            // tabPage1
            // 
            this.tabPage1.Location = new System.Drawing.Point(4, 25);
            this.tabPage1.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.tabPage1.Name = "tabPage1";
            this.tabPage1.Padding = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.tabPage1.Size = new System.Drawing.Size(569, 385);
            this.tabPage1.TabIndex = 0;
            this.tabPage1.Text = "节目";
            this.tabPage1.UseVisualStyleBackColor = true;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(900, 483);
            this.Controls.Add(this.dgvProgList);
            this.Controls.Add(this.tvChannel);
            this.Controls.Add(this.menuTree);
            this.Controls.Add(this.tcWeekone);
            this.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.Name = "Form1";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "网络电视精灵";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dgvProgList)).EndInit();
            this.cmenuRight.ResumeLayout(false);
            this.menuTree.ResumeLayout(false);
            this.menuTree.PerformLayout();
            this.tcWeekone.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.DataGridView dgvProgList;
        private System.Windows.Forms.DataGridViewTextBoxColumn playTime;
        private System.Windows.Forms.DataGridViewTextBoxColumn Median;
        private System.Windows.Forms.DataGridViewTextBoxColumn programeName;
        private System.Windows.Forms.DataGridViewTextBoxColumn path;
        private System.Windows.Forms.TreeView tvChannel;
        private System.Windows.Forms.ContextMenuStrip cmenuRight;
        private System.Windows.Forms.ToolStripMenuItem tsmAddToFavor;
        private System.Windows.Forms.ToolStripMenuItem TMenuItemDel;
        private System.Windows.Forms.ImageList imageIcons;
        private System.Windows.Forms.MenuStrip menuTree;
        private System.Windows.Forms.ToolStripMenuItem tsmListRefresh;
        private System.Windows.Forms.ToolStripMenuItem tsmRemindManage;
        private System.Windows.Forms.TabControl tcWeekone;
        private System.Windows.Forms.TabPage tabPage1;
    }
}

