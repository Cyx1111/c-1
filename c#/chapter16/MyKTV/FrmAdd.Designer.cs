namespace MyKTV
{
    partial class FrmAdd
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
            this.grpInfo = new System.Windows.Forms.GroupBox();
            this.btnbrowse = new System.Windows.Forms.Button();
            this.grpphto = new System.Windows.Forms.GroupBox();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.rbtgrup = new System.Windows.Forms.RadioButton();
            this.rbtwmen = new System.Windows.Forms.RadioButton();
            this.rbtmen = new System.Windows.Forms.RadioButton();
            this.txtName = new System.Windows.Forms.TextBox();
            this.cmbmold = new System.Windows.Forms.ComboBox();
            this.lblmold = new System.Windows.Forms.Label();
            this.lblSex = new System.Windows.Forms.Label();
            this.lblName = new System.Windows.Forms.Label();
            this.grpaddition = new System.Windows.Forms.GroupBox();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.lbldescribe = new System.Windows.Forms.Label();
            this.btnADD = new System.Windows.Forms.Button();
            this.btnesc = new System.Windows.Forms.Button();
            this.grpInfo.SuspendLayout();
            this.grpphto.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            this.grpaddition.SuspendLayout();
            this.SuspendLayout();
            // 
            // grpInfo
            // 
            this.grpInfo.BackColor = System.Drawing.Color.Transparent;
            this.grpInfo.Controls.Add(this.btnbrowse);
            this.grpInfo.Controls.Add(this.grpphto);
            this.grpInfo.Controls.Add(this.rbtgrup);
            this.grpInfo.Controls.Add(this.rbtwmen);
            this.grpInfo.Controls.Add(this.rbtmen);
            this.grpInfo.Controls.Add(this.txtName);
            this.grpInfo.Controls.Add(this.cmbmold);
            this.grpInfo.Controls.Add(this.lblmold);
            this.grpInfo.Controls.Add(this.lblSex);
            this.grpInfo.Controls.Add(this.lblName);
            this.grpInfo.Location = new System.Drawing.Point(12, 12);
            this.grpInfo.Name = "grpInfo";
            this.grpInfo.Size = new System.Drawing.Size(574, 228);
            this.grpInfo.TabIndex = 0;
            this.grpInfo.TabStop = false;
            this.grpInfo.Text = "歌手基本信息";
            // 
            // btnbrowse
            // 
            this.btnbrowse.Location = new System.Drawing.Point(406, 199);
            this.btnbrowse.Name = "btnbrowse";
            this.btnbrowse.Size = new System.Drawing.Size(75, 23);
            this.btnbrowse.TabIndex = 5;
            this.btnbrowse.Text = "浏览";
            this.btnbrowse.UseVisualStyleBackColor = true;
            this.btnbrowse.Click += new System.EventHandler(this.btnbrowse_Click);
            // 
            // grpphto
            // 
            this.grpphto.Controls.Add(this.pictureBox1);
            this.grpphto.Location = new System.Drawing.Point(328, 32);
            this.grpphto.Name = "grpphto";
            this.grpphto.Size = new System.Drawing.Size(220, 147);
            this.grpphto.TabIndex = 4;
            this.grpphto.TabStop = false;
            this.grpphto.Text = "歌手照片";
            // 
            // pictureBox1
            // 
            this.pictureBox1.Location = new System.Drawing.Point(10, 20);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(204, 121);
            this.pictureBox1.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.pictureBox1.TabIndex = 0;
            this.pictureBox1.TabStop = false;
            // 
            // rbtgrup
            // 
            this.rbtgrup.AutoSize = true;
            this.rbtgrup.Location = new System.Drawing.Point(230, 104);
            this.rbtgrup.Name = "rbtgrup";
            this.rbtgrup.Size = new System.Drawing.Size(47, 16);
            this.rbtgrup.TabIndex = 3;
            this.rbtgrup.TabStop = true;
            this.rbtgrup.Text = "组合";
            this.rbtgrup.UseVisualStyleBackColor = true;
            // 
            // rbtwmen
            // 
            this.rbtwmen.AutoSize = true;
            this.rbtwmen.Location = new System.Drawing.Point(172, 104);
            this.rbtwmen.Name = "rbtwmen";
            this.rbtwmen.Size = new System.Drawing.Size(35, 16);
            this.rbtwmen.TabIndex = 3;
            this.rbtwmen.TabStop = true;
            this.rbtwmen.Text = "女";
            this.rbtwmen.UseVisualStyleBackColor = true;
            // 
            // rbtmen
            // 
            this.rbtmen.AutoSize = true;
            this.rbtmen.Location = new System.Drawing.Point(113, 104);
            this.rbtmen.Name = "rbtmen";
            this.rbtmen.Size = new System.Drawing.Size(35, 16);
            this.rbtmen.TabIndex = 3;
            this.rbtmen.TabStop = true;
            this.rbtmen.Text = "男";
            this.rbtmen.UseVisualStyleBackColor = true;
            // 
            // txtName
            // 
            this.txtName.Location = new System.Drawing.Point(117, 32);
            this.txtName.Name = "txtName";
            this.txtName.Size = new System.Drawing.Size(150, 21);
            this.txtName.TabIndex = 2;
            // 
            // cmbmold
            // 
            this.cmbmold.FormattingEnabled = true;
            this.cmbmold.Location = new System.Drawing.Point(117, 163);
            this.cmbmold.Name = "cmbmold";
            this.cmbmold.Size = new System.Drawing.Size(150, 20);
            this.cmbmold.TabIndex = 1;
            // 
            // lblmold
            // 
            this.lblmold.AutoSize = true;
            this.lblmold.Font = new System.Drawing.Font("宋体", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblmold.Location = new System.Drawing.Point(45, 166);
            this.lblmold.Name = "lblmold";
            this.lblmold.Size = new System.Drawing.Size(57, 12);
            this.lblmold.TabIndex = 0;
            this.lblmold.Text = "歌手类型";
            // 
            // lblSex
            // 
            this.lblSex.AutoSize = true;
            this.lblSex.Font = new System.Drawing.Font("宋体", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblSex.Location = new System.Drawing.Point(45, 106);
            this.lblSex.Name = "lblSex";
            this.lblSex.Size = new System.Drawing.Size(31, 12);
            this.lblSex.TabIndex = 0;
            this.lblSex.Text = "性别";
            // 
            // lblName
            // 
            this.lblName.AutoSize = true;
            this.lblName.Font = new System.Drawing.Font("宋体", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblName.Location = new System.Drawing.Point(45, 35);
            this.lblName.Name = "lblName";
            this.lblName.Size = new System.Drawing.Size(44, 12);
            this.lblName.TabIndex = 0;
            this.lblName.Text = "歌手名";
            // 
            // grpaddition
            // 
            this.grpaddition.BackColor = System.Drawing.Color.Transparent;
            this.grpaddition.Controls.Add(this.textBox1);
            this.grpaddition.Controls.Add(this.lbldescribe);
            this.grpaddition.Location = new System.Drawing.Point(14, 246);
            this.grpaddition.Name = "grpaddition";
            this.grpaddition.Size = new System.Drawing.Size(572, 133);
            this.grpaddition.TabIndex = 1;
            this.grpaddition.TabStop = false;
            this.grpaddition.Text = "附加信息";
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(111, 23);
            this.textBox1.Multiline = true;
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(404, 96);
            this.textBox1.TabIndex = 1;
            // 
            // lbldescribe
            // 
            this.lbldescribe.AutoSize = true;
            this.lbldescribe.Font = new System.Drawing.Font("宋体", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lbldescribe.Location = new System.Drawing.Point(33, 26);
            this.lbldescribe.Name = "lbldescribe";
            this.lbldescribe.Size = new System.Drawing.Size(70, 12);
            this.lbldescribe.TabIndex = 0;
            this.lbldescribe.Text = "歌手描述：";
            // 
            // btnADD
            // 
            this.btnADD.Location = new System.Drawing.Point(129, 386);
            this.btnADD.Name = "btnADD";
            this.btnADD.Size = new System.Drawing.Size(75, 23);
            this.btnADD.TabIndex = 2;
            this.btnADD.Text = "添改";
            this.btnADD.UseVisualStyleBackColor = true;
            this.btnADD.Click += new System.EventHandler(this.btnADD_Click);
            // 
            // btnesc
            // 
            this.btnesc.Location = new System.Drawing.Point(350, 386);
            this.btnesc.Name = "btnesc";
            this.btnesc.Size = new System.Drawing.Size(75, 23);
            this.btnesc.TabIndex = 2;
            this.btnesc.Text = "取消";
            this.btnesc.UseVisualStyleBackColor = true;
            this.btnesc.Click += new System.EventHandler(this.btnesc_Click);
            // 
            // FrmAdd
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.SystemColors.ButtonHighlight;
            this.BackgroundImage = global::MyKTV.Properties.Resources._22;
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.ClientSize = new System.Drawing.Size(598, 421);
            this.Controls.Add(this.btnesc);
            this.Controls.Add(this.btnADD);
            this.Controls.Add(this.grpaddition);
            this.Controls.Add(this.grpInfo);
            this.DoubleBuffered = true;
            this.Name = "FrmAdd";
            this.Text = "编辑歌手信息窗口";
            this.Load += new System.EventHandler(this.FrmAdd_Load);
            this.grpInfo.ResumeLayout(false);
            this.grpInfo.PerformLayout();
            this.grpphto.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            this.grpaddition.ResumeLayout(false);
            this.grpaddition.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox grpInfo;
        private System.Windows.Forms.RadioButton rbtgrup;
        private System.Windows.Forms.RadioButton rbtwmen;
        private System.Windows.Forms.RadioButton rbtmen;
        private System.Windows.Forms.TextBox txtName;
        private System.Windows.Forms.ComboBox cmbmold;
        private System.Windows.Forms.Label lblmold;
        private System.Windows.Forms.Label lblSex;
        private System.Windows.Forms.Label lblName;
        private System.Windows.Forms.GroupBox grpphto;
        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.Button btnbrowse;
        private System.Windows.Forms.GroupBox grpaddition;
        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.Label lbldescribe;
        private System.Windows.Forms.Button btnADD;
        private System.Windows.Forms.Button btnesc;
    }
}