namespace s2_003
{
    partial class frmci
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
            this.gbtext = new System.Windows.Forms.GroupBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.button1 = new System.Windows.Forms.Button();
            this.txtid = new System.Windows.Forms.TextBox();
            this.txtage = new System.Windows.Forms.TextBox();
            this.txtname = new System.Windows.Forms.TextBox();
            this.txtsex = new System.Windows.Forms.ComboBox();
            this.gbtext.SuspendLayout();
            this.SuspendLayout();
            // 
            // gbtext
            // 
            this.gbtext.Controls.Add(this.txtsex);
            this.gbtext.Controls.Add(this.txtname);
            this.gbtext.Controls.Add(this.txtage);
            this.gbtext.Controls.Add(this.txtid);
            this.gbtext.Controls.Add(this.button1);
            this.gbtext.Controls.Add(this.label4);
            this.gbtext.Controls.Add(this.label3);
            this.gbtext.Controls.Add(this.label2);
            this.gbtext.Controls.Add(this.label1);
            this.gbtext.Location = new System.Drawing.Point(29, 26);
            this.gbtext.Name = "gbtext";
            this.gbtext.Size = new System.Drawing.Size(307, 276);
            this.gbtext.TabIndex = 0;
            this.gbtext.TabStop = false;
            this.gbtext.Text = "信息维护";
            this.gbtext.Enter += new System.EventHandler(this.gbtext_Enter);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(35, 36);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(37, 15);
            this.label1.TabIndex = 0;
            this.label1.Text = "工号";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(35, 88);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(37, 15);
            this.label2.TabIndex = 1;
            this.label2.Text = "年龄";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(35, 141);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(37, 15);
            this.label3.TabIndex = 2;
            this.label3.Text = "姓名";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(35, 194);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(37, 15);
            this.label4.TabIndex = 3;
            this.label4.Text = "性别";
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(98, 235);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 35);
            this.button1.TabIndex = 4;
            this.button1.Text = "保存";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // txtid
            // 
            this.txtid.Location = new System.Drawing.Point(116, 26);
            this.txtid.Name = "txtid";
            this.txtid.Size = new System.Drawing.Size(124, 25);
            this.txtid.TabIndex = 5;
            this.txtid.TextChanged += new System.EventHandler(this.textBox1_TextChanged);
            // 
            // txtage
            // 
            this.txtage.Location = new System.Drawing.Point(116, 78);
            this.txtage.Name = "txtage";
            this.txtage.Size = new System.Drawing.Size(124, 25);
            this.txtage.TabIndex = 6;
            // 
            // txtname
            // 
            this.txtname.Location = new System.Drawing.Point(116, 131);
            this.txtname.Name = "txtname";
            this.txtname.Size = new System.Drawing.Size(124, 25);
            this.txtname.TabIndex = 7;
            // 
            // txtsex
            // 
            this.txtsex.FormattingEnabled = true;
            this.txtsex.Items.AddRange(new object[] {
            "男",
            "女"});
            this.txtsex.Location = new System.Drawing.Point(116, 186);
            this.txtsex.Name = "txtsex";
            this.txtsex.Size = new System.Drawing.Size(121, 23);
            this.txtsex.TabIndex = 8;
            // 
            // frmci
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(367, 335);
            this.Controls.Add(this.gbtext);
            this.Name = "frmci";
            this.Text = "员工信息维护";
            this.Load += new System.EventHandler(this.frmci_Load);
            this.gbtext.ResumeLayout(false);
            this.gbtext.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox gbtext;
        private System.Windows.Forms.TextBox txtid;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox txtsex;
        private System.Windows.Forms.TextBox txtname;
        private System.Windows.Forms.TextBox txtage;
    }
}