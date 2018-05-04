namespace new_text2
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
            this.label1 = new System.Windows.Forms.Label();
            this.textname = new System.Windows.Forms.TextBox();
            this.namebutt = new System.Windows.Forms.Button();
            this.listView1 = new System.Windows.Forms.ListView();
            this.contextMenuStrip1 = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.大图标ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.小图标ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.详细信息ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.imbig = new System.Windows.Forms.ImageList(this.components);
            this.imsmall = new System.Windows.Forms.ImageList(this.components);
            this.columnHeader1 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader2 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader3 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader4 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader5 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.contextMenuStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(107, 84);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(37, 15);
            this.label1.TabIndex = 0;
            this.label1.Text = "姓名";
            // 
            // textname
            // 
            this.textname.Location = new System.Drawing.Point(199, 74);
            this.textname.Name = "textname";
            this.textname.Size = new System.Drawing.Size(169, 25);
            this.textname.TabIndex = 1;
            // 
            // namebutt
            // 
            this.namebutt.Location = new System.Drawing.Point(441, 76);
            this.namebutt.Name = "namebutt";
            this.namebutt.Size = new System.Drawing.Size(75, 23);
            this.namebutt.TabIndex = 2;
            this.namebutt.Text = "查找";
            this.namebutt.UseVisualStyleBackColor = true;
            this.namebutt.Click += new System.EventHandler(this.namebutt_Click);
            // 
            // listView1
            // 
            this.listView1.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnHeader1,
            this.columnHeader2,
            this.columnHeader3,
            this.columnHeader4,
            this.columnHeader5});
            this.listView1.ContextMenuStrip = this.contextMenuStrip1;
            this.listView1.LargeImageList = this.imbig;
            this.listView1.Location = new System.Drawing.Point(68, 138);
            this.listView1.Name = "listView1";
            this.listView1.Size = new System.Drawing.Size(484, 305);
            this.listView1.SmallImageList = this.imsmall;
            this.listView1.TabIndex = 3;
            this.listView1.UseCompatibleStateImageBehavior = false;
            this.listView1.View = System.Windows.Forms.View.Details;
            // 
            // contextMenuStrip1
            // 
            this.contextMenuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.大图标ToolStripMenuItem,
            this.小图标ToolStripMenuItem,
            this.详细信息ToolStripMenuItem});
            this.contextMenuStrip1.Name = "contextMenuStrip1";
            this.contextMenuStrip1.Size = new System.Drawing.Size(139, 76);
            // 
            // 大图标ToolStripMenuItem
            // 
            this.大图标ToolStripMenuItem.Name = "大图标ToolStripMenuItem";
            this.大图标ToolStripMenuItem.Size = new System.Drawing.Size(138, 24);
            this.大图标ToolStripMenuItem.Text = "大图标";
            // 
            // 小图标ToolStripMenuItem
            // 
            this.小图标ToolStripMenuItem.Name = "小图标ToolStripMenuItem";
            this.小图标ToolStripMenuItem.Size = new System.Drawing.Size(138, 24);
            this.小图标ToolStripMenuItem.Text = "小图标";
            // 
            // 详细信息ToolStripMenuItem
            // 
            this.详细信息ToolStripMenuItem.Name = "详细信息ToolStripMenuItem";
            this.详细信息ToolStripMenuItem.Size = new System.Drawing.Size(138, 24);
            this.详细信息ToolStripMenuItem.Text = "详细信息";
            // 
            // imbig
            // 
            this.imbig.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("imbig.ImageStream")));
            this.imbig.TransparentColor = System.Drawing.Color.Transparent;
            this.imbig.Images.SetKeyName(0, "大图1.png");
            this.imbig.Images.SetKeyName(1, "大图2.png");
            this.imbig.Images.SetKeyName(2, "大图3.png");
            // 
            // imsmall
            // 
            this.imsmall.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("imsmall.ImageStream")));
            this.imsmall.TransparentColor = System.Drawing.Color.Transparent;
            this.imsmall.Images.SetKeyName(0, "图1.png");
            this.imsmall.Images.SetKeyName(1, "图2.png");
            this.imsmall.Images.SetKeyName(2, "图3.png");
            // 
            // columnHeader1
            // 
            this.columnHeader1.Text = "学号";
            this.columnHeader1.Width = 69;
            // 
            // columnHeader2
            // 
            this.columnHeader2.Text = "姓名";
            this.columnHeader2.Width = 71;
            // 
            // columnHeader3
            // 
            this.columnHeader3.Text = "作者";
            this.columnHeader3.Width = 81;
            // 
            // columnHeader4
            // 
            this.columnHeader4.Text = "日期";
            this.columnHeader4.Width = 84;
            // 
            // columnHeader5
            // 
            this.columnHeader5.Text = "类型";
            this.columnHeader5.Width = 109;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(628, 481);
            this.Controls.Add(this.listView1);
            this.Controls.Add(this.namebutt);
            this.Controls.Add(this.textname);
            this.Controls.Add(this.label1);
            this.Name = "Form1";
            this.Text = "学生信息";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.contextMenuStrip1.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox textname;
        private System.Windows.Forms.Button namebutt;
        private System.Windows.Forms.ListView listView1;
        private System.Windows.Forms.ContextMenuStrip contextMenuStrip1;
        private System.Windows.Forms.ToolStripMenuItem 大图标ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem 小图标ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem 详细信息ToolStripMenuItem;
        private System.Windows.Forms.ImageList imbig;
        private System.Windows.Forms.ImageList imsmall;
        private System.Windows.Forms.ColumnHeader columnHeader1;
        private System.Windows.Forms.ColumnHeader columnHeader2;
        private System.Windows.Forms.ColumnHeader columnHeader3;
        private System.Windows.Forms.ColumnHeader columnHeader4;
        private System.Windows.Forms.ColumnHeader columnHeader5;
    }
}

