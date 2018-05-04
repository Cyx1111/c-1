namespace New_text
{
    partial class FrmFormation
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
            this.listView1 = new System.Windows.Forms.ListView();
            this.name = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader2 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader3 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.imageSmall = new System.Windows.Forms.ImageList(this.components);
            this.imagebig = new System.Windows.Forms.ImageList(this.components);
            this.columnHeader1 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.button1 = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // listView1
            // 
            this.listView1.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.name,
            this.columnHeader2,
            this.columnHeader3,
            this.columnHeader1});
            this.listView1.Location = new System.Drawing.Point(31, 44);
            this.listView1.Name = "listView1";
            this.listView1.Size = new System.Drawing.Size(525, 396);
            this.listView1.TabIndex = 0;
            this.listView1.UseCompatibleStateImageBehavior = false;
            this.listView1.View = System.Windows.Forms.View.Details;
            this.listView1.SelectedIndexChanged += new System.EventHandler(this.listView1_SelectedIndexChanged);
            // 
            // name
            // 
            this.name.Text = "名称";
            this.name.Width = 99;
            // 
            // columnHeader2
            // 
            this.columnHeader2.Text = "类型";
            // 
            // columnHeader3
            // 
            this.columnHeader3.Text = "总大小";
            // 
            // imageSmall
            // 
            this.imageSmall.ColorDepth = System.Windows.Forms.ColorDepth.Depth8Bit;
            this.imageSmall.ImageSize = new System.Drawing.Size(16, 16);
            this.imageSmall.TransparentColor = System.Drawing.Color.Transparent;
            // 
            // imagebig
            // 
            this.imagebig.ColorDepth = System.Windows.Forms.ColorDepth.Depth8Bit;
            this.imagebig.ImageSize = new System.Drawing.Size(16, 16);
            this.imagebig.TransparentColor = System.Drawing.Color.Transparent;
            // 
            // columnHeader1
            // 
            this.columnHeader1.Text = "可用空间";
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(444, 473);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(112, 39);
            this.button1.TabIndex = 1;
            this.button1.Text = "详细信息";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // FrmFormation
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(660, 550);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.listView1);
            this.Name = "FrmFormation";
            this.Text = "FrmFormation";
            this.Load += new System.EventHandler(this.FrmFormation_Load);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.ListView listView1;
        private System.Windows.Forms.ColumnHeader name;
        private System.Windows.Forms.ColumnHeader columnHeader2;
        private System.Windows.Forms.ColumnHeader columnHeader3;
        private System.Windows.Forms.ImageList imageSmall;
        private System.Windows.Forms.ImageList imagebig;
        private System.Windows.Forms.ColumnHeader columnHeader1;
        private System.Windows.Forms.Button button1;
    }
}