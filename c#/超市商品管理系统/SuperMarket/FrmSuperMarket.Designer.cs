namespace SuperMarket
{
    partial class FrmSuperMarket
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FrmSuperMarket));
            System.Windows.Forms.TreeNode treeNode1 = new System.Windows.Forms.TreeNode("正价商品", 0, 1);
            System.Windows.Forms.TreeNode treeNode2 = new System.Windows.Forms.TreeNode("特价商品", 0, 1);
            System.Windows.Forms.TreeNode treeNode3 = new System.Windows.Forms.TreeNode("所有商品", 0, 1, new System.Windows.Forms.TreeNode[] {
            treeNode1,
            treeNode2});
            this.gbShowCommodity = new System.Windows.Forms.GroupBox();
            this.dgvCommodity = new System.Windows.Forms.DataGridView();
            this.tsSuperMarket = new System.Windows.Forms.ToolStrip();
            this.tsbtnAdd = new System.Windows.Forms.ToolStripButton();
            this.tsbtnUpdate = new System.Windows.Forms.ToolStripButton();
            this.tsbtnDelete = new System.Windows.Forms.ToolStripButton();
            this.tsbtnExit = new System.Windows.Forms.ToolStripButton();
            this.splitter1 = new System.Windows.Forms.Splitter();
            this.tvSort = new System.Windows.Forms.TreeView();
            this.ilIcons = new System.Windows.Forms.ImageList(this.components);
            this.gbSort = new System.Windows.Forms.GroupBox();
            this.gbShowCommodity.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dgvCommodity)).BeginInit();
            this.tsSuperMarket.SuspendLayout();
            this.gbSort.SuspendLayout();
            this.SuspendLayout();
            // 
            // gbShowCommodity
            // 
            this.gbShowCommodity.Controls.Add(this.dgvCommodity);
            this.gbShowCommodity.Controls.Add(this.tsSuperMarket);
            this.gbShowCommodity.Dock = System.Windows.Forms.DockStyle.Fill;
            this.gbShowCommodity.Location = new System.Drawing.Point(236, 0);
            this.gbShowCommodity.Name = "gbShowCommodity";
            this.gbShowCommodity.Size = new System.Drawing.Size(581, 553);
            this.gbShowCommodity.TabIndex = 7;
            this.gbShowCommodity.TabStop = false;
            this.gbShowCommodity.Text = "商品显示";
            // 
            // dgvCommodity
            // 
            this.dgvCommodity.AllowUserToAddRows = false;
            this.dgvCommodity.AllowUserToDeleteRows = false;
            this.dgvCommodity.AllowUserToResizeColumns = false;
            this.dgvCommodity.AllowUserToResizeRows = false;
            this.dgvCommodity.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.dgvCommodity.BackgroundColor = System.Drawing.SystemColors.Window;
            this.dgvCommodity.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dgvCommodity.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dgvCommodity.Location = new System.Drawing.Point(3, 80);
            this.dgvCommodity.Name = "dgvCommodity";
            this.dgvCommodity.ReadOnly = true;
            this.dgvCommodity.RowHeadersVisible = false;
            this.dgvCommodity.RowTemplate.Height = 23;
            this.dgvCommodity.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dgvCommodity.Size = new System.Drawing.Size(575, 470);
            this.dgvCommodity.TabIndex = 0;
            // 
            // tsSuperMarket
            // 
            this.tsSuperMarket.Font = new System.Drawing.Font("宋体", 10.5F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.tsSuperMarket.GripStyle = System.Windows.Forms.ToolStripGripStyle.Hidden;
            this.tsSuperMarket.ImageScalingSize = new System.Drawing.Size(40, 40);
            this.tsSuperMarket.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tsbtnAdd,
            this.tsbtnUpdate,
            this.tsbtnDelete,
            this.tsbtnExit});
            this.tsSuperMarket.Location = new System.Drawing.Point(3, 19);
            this.tsSuperMarket.Name = "tsSuperMarket";
            this.tsSuperMarket.Size = new System.Drawing.Size(575, 61);
            this.tsSuperMarket.TabIndex = 8;
            this.tsSuperMarket.Text = "toolStrip1";
            // 
            // tsbtnAdd
            // 
            this.tsbtnAdd.Image = ((System.Drawing.Image)(resources.GetObject("tsbtnAdd.Image")));
            this.tsbtnAdd.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbtnAdd.Name = "tsbtnAdd";
            this.tsbtnAdd.Padding = new System.Windows.Forms.Padding(10, 0, 10, 0);
            this.tsbtnAdd.Size = new System.Drawing.Size(64, 58);
            this.tsbtnAdd.Text = "增加";
            this.tsbtnAdd.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.tsbtnAdd.Click += new System.EventHandler(this.tsbtnAdd_Click);
            // 
            // tsbtnUpdate
            // 
            this.tsbtnUpdate.Image = ((System.Drawing.Image)(resources.GetObject("tsbtnUpdate.Image")));
            this.tsbtnUpdate.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbtnUpdate.Name = "tsbtnUpdate";
            this.tsbtnUpdate.Padding = new System.Windows.Forms.Padding(10, 0, 10, 0);
            this.tsbtnUpdate.Size = new System.Drawing.Size(64, 58);
            this.tsbtnUpdate.Text = "修改";
            this.tsbtnUpdate.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.tsbtnUpdate.Click += new System.EventHandler(this.tsbtnUpdate_Click);
            // 
            // tsbtnDelete
            // 
            this.tsbtnDelete.Image = ((System.Drawing.Image)(resources.GetObject("tsbtnDelete.Image")));
            this.tsbtnDelete.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbtnDelete.Name = "tsbtnDelete";
            this.tsbtnDelete.Padding = new System.Windows.Forms.Padding(10, 0, 10, 0);
            this.tsbtnDelete.Size = new System.Drawing.Size(64, 58);
            this.tsbtnDelete.Text = "删除";
            this.tsbtnDelete.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.tsbtnDelete.Click += new System.EventHandler(this.tmbtnDelete_Click);
            // 
            // tsbtnExit
            // 
            this.tsbtnExit.Image = ((System.Drawing.Image)(resources.GetObject("tsbtnExit.Image")));
            this.tsbtnExit.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.tsbtnExit.Name = "tsbtnExit";
            this.tsbtnExit.Padding = new System.Windows.Forms.Padding(10, 0, 10, 0);
            this.tsbtnExit.Size = new System.Drawing.Size(64, 58);
            this.tsbtnExit.Text = "退出";
            this.tsbtnExit.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.tsbtnExit.Click += new System.EventHandler(this.tsbtnExit_Click);
            // 
            // splitter1
            // 
            this.splitter1.Location = new System.Drawing.Point(233, 0);
            this.splitter1.Name = "splitter1";
            this.splitter1.Size = new System.Drawing.Size(3, 553);
            this.splitter1.TabIndex = 6;
            this.splitter1.TabStop = false;
            // 
            // tvSort
            // 
            this.tvSort.BackColor = System.Drawing.Color.White;
            this.tvSort.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tvSort.ImageIndex = 0;
            this.tvSort.ImageList = this.ilIcons;
            this.tvSort.Location = new System.Drawing.Point(3, 19);
            this.tvSort.Name = "tvSort";
            treeNode1.ImageIndex = 0;
            treeNode1.Name = "节点1";
            treeNode1.SelectedImageIndex = 1;
            treeNode1.Text = "正价商品";
            treeNode2.ImageIndex = 0;
            treeNode2.Name = "节点2";
            treeNode2.SelectedImageIndex = 1;
            treeNode2.Text = "特价商品";
            treeNode3.ImageIndex = 0;
            treeNode3.Name = "节点0";
            treeNode3.SelectedImageIndex = 1;
            treeNode3.Text = "所有商品";
            this.tvSort.Nodes.AddRange(new System.Windows.Forms.TreeNode[] {
            treeNode3});
            this.tvSort.SelectedImageIndex = 0;
            this.tvSort.Size = new System.Drawing.Size(227, 531);
            this.tvSort.TabIndex = 0;
            this.tvSort.AfterSelect += new System.Windows.Forms.TreeViewEventHandler(this.tvSort_AfterSelect);
            // 
            // ilIcons
            // 
            this.ilIcons.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("ilIcons.ImageStream")));
            this.ilIcons.TransparentColor = System.Drawing.Color.Transparent;
            this.ilIcons.Images.SetKeyName(0, "1.gif");
            this.ilIcons.Images.SetKeyName(1, "11.gif");
            // 
            // gbSort
            // 
            this.gbSort.Controls.Add(this.tvSort);
            this.gbSort.Dock = System.Windows.Forms.DockStyle.Left;
            this.gbSort.Location = new System.Drawing.Point(0, 0);
            this.gbSort.Name = "gbSort";
            this.gbSort.Size = new System.Drawing.Size(233, 553);
            this.gbSort.TabIndex = 5;
            this.gbSort.TabStop = false;
            this.gbSort.Text = "商品分类";
            // 
            // FrmSuperMarket
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 14F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.WhiteSmoke;
            this.ClientSize = new System.Drawing.Size(817, 553);
            this.Controls.Add(this.gbShowCommodity);
            this.Controls.Add(this.splitter1);
            this.Controls.Add(this.gbSort);
            this.Font = new System.Drawing.Font("宋体", 10.5F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.Name = "FrmSuperMarket";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "商品列表";
            this.Load += new System.EventHandler(this.FrmSuperMarket_Load);
            this.gbShowCommodity.ResumeLayout(false);
            this.gbShowCommodity.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dgvCommodity)).EndInit();
            this.tsSuperMarket.ResumeLayout(false);
            this.tsSuperMarket.PerformLayout();
            this.gbSort.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox gbShowCommodity;
        private System.Windows.Forms.DataGridView dgvCommodity;
        private System.Windows.Forms.Splitter splitter1;
        private System.Windows.Forms.TreeView tvSort;
        private System.Windows.Forms.GroupBox gbSort;
        private System.Windows.Forms.ImageList ilIcons;
        private System.Windows.Forms.ToolStrip tsSuperMarket;
        private System.Windows.Forms.ToolStripButton tsbtnAdd;
        private System.Windows.Forms.ToolStripButton tsbtnUpdate;
        private System.Windows.Forms.ToolStripButton tsbtnDelete;
        private System.Windows.Forms.ToolStripButton tsbtnExit;
    }
}