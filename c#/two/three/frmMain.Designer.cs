namespace three
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
            this.treeView1 = new System.Windows.Forms.TreeView();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.tebjie = new System.Windows.Forms.TextBox();
            this.tebjv = new System.Windows.Forms.TextBox();
            this.teblou = new System.Windows.Forms.TextBox();
            this.tebfang = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // treeView1
            // 
            this.treeView1.Location = new System.Drawing.Point(1, 1);
            this.treeView1.Name = "treeView1";
            this.treeView1.Size = new System.Drawing.Size(267, 570);
            this.treeView1.TabIndex = 0;
            this.treeView1.AfterSelect += new System.Windows.Forms.TreeViewEventHandler(this.treeView1_AfterSelect);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.label1.Location = new System.Drawing.Point(362, 85);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(51, 20);
            this.label1.TabIndex = 1;
            this.label1.Text = "街道";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.label2.Location = new System.Drawing.Point(362, 174);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(72, 20);
            this.label2.TabIndex = 2;
            this.label2.Text = "居委会";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.label3.Location = new System.Drawing.Point(362, 271);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(51, 20);
            this.label3.TabIndex = 3;
            this.label3.Text = "楼号";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.label4.Location = new System.Drawing.Point(362, 371);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(72, 20);
            this.label4.TabIndex = 4;
            this.label4.Text = "房间号";
            // 
            // tebjie
            // 
            this.tebjie.Location = new System.Drawing.Point(462, 85);
            this.tebjie.Name = "tebjie";
            this.tebjie.Size = new System.Drawing.Size(167, 25);
            this.tebjie.TabIndex = 5;
            // 
            // tebjv
            // 
            this.tebjv.Location = new System.Drawing.Point(462, 174);
            this.tebjv.Name = "tebjv";
            this.tebjv.Size = new System.Drawing.Size(167, 25);
            this.tebjv.TabIndex = 6;
            // 
            // teblou
            // 
            this.teblou.Location = new System.Drawing.Point(462, 271);
            this.teblou.Name = "teblou";
            this.teblou.Size = new System.Drawing.Size(167, 25);
            this.teblou.TabIndex = 7;
            // 
            // tebfang
            // 
            this.tebfang.Location = new System.Drawing.Point(462, 371);
            this.tebfang.Name = "tebfang";
            this.tebfang.Size = new System.Drawing.Size(167, 25);
            this.tebfang.TabIndex = 8;
            // 
            // frmMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(767, 571);
            this.Controls.Add(this.tebfang);
            this.Controls.Add(this.teblou);
            this.Controls.Add(this.tebjv);
            this.Controls.Add(this.tebjie);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.treeView1);
            this.Name = "frmMain";
            this.Text = "街道管理";
            this.Load += new System.EventHandler(this.frmMain_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TreeView treeView1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox tebjie;
        private System.Windows.Forms.TextBox tebjv;
        private System.Windows.Forms.TextBox teblou;
        private System.Windows.Forms.TextBox tebfang;
    }
}

