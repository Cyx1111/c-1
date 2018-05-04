namespace SuperMarket
{
    partial class FrmSuperMarketSort
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FrmSuperMarketSort));
            this.imageList1 = new System.Windows.Forms.ImageList(this.components);
            this.tsSuperMarket = new System.Windows.Forms.ToolStrip();
            this.tsbtnAdd = new System.Windows.Forms.ToolStripButton();
            this.tsbtnUpdate = new System.Windows.Forms.ToolStripButton();
            this.tsbtnDelete = new System.Windows.Forms.ToolStripButton();
            this.tsbtnExit = new System.Windows.Forms.ToolStripButton();
            this.gbSuper = new System.Windows.Forms.GroupBox();
            this.dgvSort = new System.Windows.Forms.DataGridView();
            this.tsSuperMarket.SuspendLayout();
            this.gbSuper.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dgvSort)).BeginInit();
            this.SuspendLayout();
            // 
            // imageList1
            // 
            this.imageList1.ColorDepth = System.Windows.Forms.ColorDepth.Depth8Bit;
            this.imageList1.ImageSize = new System.Drawing.Size(16, 16);
            this.imageList1.TransparentColor = System.Drawing.Color.Transparent;
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
            this.tsSuperMarket.Location = new System.Drawing.Point(0, 0);
            this.tsSuperMarket.Name = "tsSuperMarket";
            this.tsSuperMarket.Size = new System.Drawing.Size(817, 61);
            this.tsSuperMarket.TabIndex = 9;
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
            this.tsbtnDelete.Click += new System.EventHandler(this.tsbtnDelete_Click);
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
            // gbSuper
            // 
            this.gbSuper.Controls.Add(this.dgvSort);
            this.gbSuper.Dock = System.Windows.Forms.DockStyle.Fill;
            this.gbSuper.Location = new System.Drawing.Point(0, 61);
            this.gbSuper.Name = "gbSuper";
            this.gbSuper.Size = new System.Drawing.Size(817, 492);
            this.gbSuper.TabIndex = 10;
            this.gbSuper.TabStop = false;
            this.gbSuper.Text = "显示数据";
            // 
            // dgvSort
            // 
            this.dgvSort.AllowUserToAddRows = false;
            this.dgvSort.AllowUserToDeleteRows = false;
            this.dgvSort.AllowUserToResizeColumns = false;
            this.dgvSort.AllowUserToResizeRows = false;
            this.dgvSort.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.dgvSort.BackgroundColor = System.Drawing.SystemColors.Window;
            this.dgvSort.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dgvSort.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dgvSort.Location = new System.Drawing.Point(3, 17);
            this.dgvSort.Name = "dgvSort";
            this.dgvSort.ReadOnly = true;
            this.dgvSort.RowHeadersVisible = false;
            this.dgvSort.RowTemplate.Height = 23;
            this.dgvSort.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dgvSort.Size = new System.Drawing.Size(811, 472);
            this.dgvSort.TabIndex = 1;
            // 
            // FrmSuperMarketSort
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(817, 553);
            this.Controls.Add(this.gbSuper);
            this.Controls.Add(this.tsSuperMarket);
            this.Name = "FrmSuperMarketSort";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "商品类别列表";
            this.Load += new System.EventHandler(this.FrmSuperMarketSort_Load);
            this.tsSuperMarket.ResumeLayout(false);
            this.tsSuperMarket.PerformLayout();
            this.gbSuper.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.dgvSort)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ImageList imageList1;
        private System.Windows.Forms.ToolStrip tsSuperMarket;
        private System.Windows.Forms.ToolStripButton tsbtnAdd;
        private System.Windows.Forms.ToolStripButton tsbtnUpdate;
        private System.Windows.Forms.ToolStripButton tsbtnDelete;
        private System.Windows.Forms.ToolStripButton tsbtnExit;
        private System.Windows.Forms.GroupBox gbSuper;
        private System.Windows.Forms.DataGridView dgvSort;
    }
}