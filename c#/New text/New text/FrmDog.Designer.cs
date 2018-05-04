namespace New_text
{
    partial class FrmDog
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FrmDog));
            System.Windows.Forms.ListViewItem listViewItem1 = new System.Windows.Forms.ListViewItem(new string[] {
            "",
            "50g",
            "20",
            "20",
            "12"}, 0);
            System.Windows.Forms.ListViewItem listViewItem2 = new System.Windows.Forms.ListViewItem(new string[] {
            "",
            "11",
            "12",
            "23"}, 1);
            System.Windows.Forms.ListViewItem listViewItem3 = new System.Windows.Forms.ListViewItem(new string[] {
            "",
            "12",
            "20",
            "33"}, 2);
            this.imList = new System.Windows.Forms.ImageList(this.components);
            this.imBig = new System.Windows.Forms.ImageList(this.components);
            this.listView1 = new System.Windows.Forms.ListView();
            this.btnsmall = new System.Windows.Forms.Button();
            this.btnlarge = new System.Windows.Forms.Button();
            this.contextMenuStrip1 = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.大图标ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.小图标ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.columnHeader1 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader2 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader3 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader4 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.详细信息ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.contextMenuStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // imList
            // 
            this.imList.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("imList.ImageStream")));
            this.imList.TransparentColor = System.Drawing.Color.Transparent;
            this.imList.Images.SetKeyName(0, "图1.png");
            this.imList.Images.SetKeyName(1, "图2.png");
            this.imList.Images.SetKeyName(2, "图3.png");
            // 
            // imBig
            // 
            this.imBig.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("imBig.ImageStream")));
            this.imBig.TransparentColor = System.Drawing.Color.Transparent;
            this.imBig.Images.SetKeyName(0, "大图1.png");
            this.imBig.Images.SetKeyName(1, "大图2.png");
            this.imBig.Images.SetKeyName(2, "大图3.png");
            // 
            // listView1
            // 
            this.listView1.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnHeader1,
            this.columnHeader2,
            this.columnHeader3,
            this.columnHeader4});
            this.listView1.ContextMenuStrip = this.contextMenuStrip1;
            this.listView1.Items.AddRange(new System.Windows.Forms.ListViewItem[] {
            listViewItem1,
            listViewItem2,
            listViewItem3});
            this.listView1.LargeImageList = this.imBig;
            this.listView1.Location = new System.Drawing.Point(131, 82);
            this.listView1.Name = "listView1";
            this.listView1.Size = new System.Drawing.Size(514, 188);
            this.listView1.SmallImageList = this.imList;
            this.listView1.TabIndex = 0;
            this.listView1.UseCompatibleStateImageBehavior = false;
            this.listView1.View = System.Windows.Forms.View.Details;
            // 
            // btnsmall
            // 
            this.btnsmall.Location = new System.Drawing.Point(90, 357);
            this.btnsmall.Name = "btnsmall";
            this.btnsmall.Size = new System.Drawing.Size(75, 23);
            this.btnsmall.TabIndex = 1;
            this.btnsmall.Text = "小图标";
            this.btnsmall.UseVisualStyleBackColor = true;
            this.btnsmall.Click += new System.EventHandler(this.btnsmall_Click);
            // 
            // btnlarge
            // 
            this.btnlarge.Location = new System.Drawing.Point(588, 357);
            this.btnlarge.Name = "btnlarge";
            this.btnlarge.Size = new System.Drawing.Size(75, 23);
            this.btnlarge.TabIndex = 2;
            this.btnlarge.Text = "大图标";
            this.btnlarge.UseVisualStyleBackColor = true;
            this.btnlarge.Click += new System.EventHandler(this.btnlarge_Click);
            // 
            // contextMenuStrip1
            // 
            this.contextMenuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.大图标ToolStripMenuItem,
            this.小图标ToolStripMenuItem,
            this.详细信息ToolStripMenuItem});
            this.contextMenuStrip1.Name = "contextMenuStrip1";
            this.contextMenuStrip1.Size = new System.Drawing.Size(153, 98);
            // 
            // 大图标ToolStripMenuItem
            // 
            this.大图标ToolStripMenuItem.Name = "大图标ToolStripMenuItem";
            this.大图标ToolStripMenuItem.Size = new System.Drawing.Size(152, 24);
            this.大图标ToolStripMenuItem.Text = "大图标";
            this.大图标ToolStripMenuItem.Click += new System.EventHandler(this.大图标ToolStripMenuItem_Click);
            // 
            // 小图标ToolStripMenuItem
            // 
            this.小图标ToolStripMenuItem.Name = "小图标ToolStripMenuItem";
            this.小图标ToolStripMenuItem.Size = new System.Drawing.Size(152, 24);
            this.小图标ToolStripMenuItem.Text = "小图标";
            this.小图标ToolStripMenuItem.Click += new System.EventHandler(this.小图标ToolStripMenuItem_Click);
            // 
            // columnHeader1
            // 
            this.columnHeader1.Text = "名称";
            this.columnHeader1.Width = 118;
            // 
            // columnHeader2
            // 
            this.columnHeader2.Text = "空间";
            this.columnHeader2.Width = 96;
            // 
            // columnHeader3
            // 
            this.columnHeader3.Text = "已用";
            this.columnHeader3.Width = 102;
            // 
            // columnHeader4
            // 
            this.columnHeader4.Text = "剩余总量";
            this.columnHeader4.Width = 77;
            // 
            // 详细信息ToolStripMenuItem
            // 
            this.详细信息ToolStripMenuItem.Name = "详细信息ToolStripMenuItem";
            this.详细信息ToolStripMenuItem.Size = new System.Drawing.Size(152, 24);
            this.详细信息ToolStripMenuItem.Text = "详细信息";
            this.详细信息ToolStripMenuItem.Click += new System.EventHandler(this.详细信息ToolStripMenuItem_Click);
            // 
            // FrmDog
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(768, 522);
            this.Controls.Add(this.btnlarge);
            this.Controls.Add(this.btnsmall);
            this.Controls.Add(this.listView1);
            this.Name = "FrmDog";
            this.Text = "FrmDog";
            this.Load += new System.EventHandler(this.FrmDog_Load);
            this.contextMenuStrip1.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.ImageList imList;
        private System.Windows.Forms.ImageList imBig;
        private System.Windows.Forms.ListView listView1;
        private System.Windows.Forms.Button btnsmall;
        private System.Windows.Forms.Button btnlarge;
        private System.Windows.Forms.ContextMenuStrip contextMenuStrip1;
        private System.Windows.Forms.ToolStripMenuItem 大图标ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem 小图标ToolStripMenuItem;
        private System.Windows.Forms.ColumnHeader columnHeader1;
        private System.Windows.Forms.ColumnHeader columnHeader2;
        private System.Windows.Forms.ColumnHeader columnHeader3;
        private System.Windows.Forms.ColumnHeader columnHeader4;
        private System.Windows.Forms.ToolStripMenuItem 详细信息ToolStripMenuItem;
    }
}

