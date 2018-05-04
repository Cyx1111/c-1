namespace MyKTV
{
    partial class FrmMusic
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
            this.lblName = new System.Windows.Forms.Label();
            this.lblS = new System.Windows.Forms.Label();
            this.lblType = new System.Windows.Forms.Label();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.textBox2 = new System.Windows.Forms.TextBox();
            this.lblSinger = new System.Windows.Forms.Label();
            this.textBox3 = new System.Windows.Forms.TextBox();
            this.btnSelect = new System.Windows.Forms.Button();
            this.lblNames = new System.Windows.Forms.Label();
            this.textBox4 = new System.Windows.Forms.TextBox();
            this.btnLook = new System.Windows.Forms.Button();
            this.btnOK = new System.Windows.Forms.Button();
            this.btnNo = new System.Windows.Forms.Button();
            this.comboBox1 = new System.Windows.Forms.ComboBox();
            this.SuspendLayout();
            // 
            // lblName
            // 
            this.lblName.AutoSize = true;
            this.lblName.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblName.Location = new System.Drawing.Point(56, 35);
            this.lblName.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.lblName.Name = "lblName";
            this.lblName.Size = new System.Drawing.Size(72, 16);
            this.lblName.TabIndex = 1;
            this.lblName.Text = "歌曲名称";
            // 
            // lblS
            // 
            this.lblS.AutoSize = true;
            this.lblS.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblS.Location = new System.Drawing.Point(56, 89);
            this.lblS.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.lblS.Name = "lblS";
            this.lblS.Size = new System.Drawing.Size(72, 16);
            this.lblS.TabIndex = 2;
            this.lblS.Text = "拼音缩写";
            // 
            // lblType
            // 
            this.lblType.AutoSize = true;
            this.lblType.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblType.Location = new System.Drawing.Point(56, 151);
            this.lblType.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.lblType.Name = "lblType";
            this.lblType.Size = new System.Drawing.Size(72, 16);
            this.lblType.TabIndex = 3;
            this.lblType.Text = "歌曲类型";
            // 
            // textBox1
            // 
            this.textBox1.Font = new System.Drawing.Font("宋体", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.textBox1.Location = new System.Drawing.Point(185, 34);
            this.textBox1.Margin = new System.Windows.Forms.Padding(2);
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(257, 24);
            this.textBox1.TabIndex = 4;
            // 
            // textBox2
            // 
            this.textBox2.Font = new System.Drawing.Font("宋体", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.textBox2.Location = new System.Drawing.Point(185, 89);
            this.textBox2.Margin = new System.Windows.Forms.Padding(2);
            this.textBox2.Name = "textBox2";
            this.textBox2.Size = new System.Drawing.Size(257, 24);
            this.textBox2.TabIndex = 5;
            // 
            // lblSinger
            // 
            this.lblSinger.AutoSize = true;
            this.lblSinger.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblSinger.Location = new System.Drawing.Point(70, 219);
            this.lblSinger.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.lblSinger.Name = "lblSinger";
            this.lblSinger.Size = new System.Drawing.Size(40, 16);
            this.lblSinger.TabIndex = 7;
            this.lblSinger.Text = "歌手";
            // 
            // textBox3
            // 
            this.textBox3.Font = new System.Drawing.Font("宋体", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.textBox3.Location = new System.Drawing.Point(185, 217);
            this.textBox3.Margin = new System.Windows.Forms.Padding(2);
            this.textBox3.Name = "textBox3";
            this.textBox3.ReadOnly = true;
            this.textBox3.Size = new System.Drawing.Size(186, 24);
            this.textBox3.TabIndex = 8;
            // 
            // btnSelect
            // 
            this.btnSelect.Location = new System.Drawing.Point(385, 216);
            this.btnSelect.Margin = new System.Windows.Forms.Padding(2);
            this.btnSelect.Name = "btnSelect";
            this.btnSelect.Size = new System.Drawing.Size(57, 25);
            this.btnSelect.TabIndex = 9;
            this.btnSelect.Text = "查询";
            this.btnSelect.UseVisualStyleBackColor = true;
            this.btnSelect.Click += new System.EventHandler(this.btnSelect_Click);
            // 
            // lblNames
            // 
            this.lblNames.AutoSize = true;
            this.lblNames.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblNames.Location = new System.Drawing.Point(40, 271);
            this.lblNames.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.lblNames.Name = "lblNames";
            this.lblNames.Size = new System.Drawing.Size(88, 16);
            this.lblNames.TabIndex = 10;
            this.lblNames.Text = "歌曲文件名";
            // 
            // textBox4
            // 
            this.textBox4.Font = new System.Drawing.Font("宋体", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.textBox4.Location = new System.Drawing.Point(87, 300);
            this.textBox4.Margin = new System.Windows.Forms.Padding(2);
            this.textBox4.Name = "textBox4";
            this.textBox4.Size = new System.Drawing.Size(284, 24);
            this.textBox4.TabIndex = 11;
            // 
            // btnLook
            // 
            this.btnLook.Location = new System.Drawing.Point(385, 300);
            this.btnLook.Margin = new System.Windows.Forms.Padding(2);
            this.btnLook.Name = "btnLook";
            this.btnLook.Size = new System.Drawing.Size(57, 25);
            this.btnLook.TabIndex = 12;
            this.btnLook.Text = "浏览";
            this.btnLook.UseVisualStyleBackColor = true;
            this.btnLook.Click += new System.EventHandler(this.btnLook_Click);
            // 
            // btnOK
            // 
            this.btnOK.Location = new System.Drawing.Point(303, 393);
            this.btnOK.Margin = new System.Windows.Forms.Padding(2);
            this.btnOK.Name = "btnOK";
            this.btnOK.Size = new System.Drawing.Size(68, 25);
            this.btnOK.TabIndex = 13;
            this.btnOK.Text = "保存";
            this.btnOK.UseVisualStyleBackColor = true;
            this.btnOK.Click += new System.EventHandler(this.btnOK_Click);
            // 
            // btnNo
            // 
            this.btnNo.Location = new System.Drawing.Point(436, 393);
            this.btnNo.Margin = new System.Windows.Forms.Padding(2);
            this.btnNo.Name = "btnNo";
            this.btnNo.Size = new System.Drawing.Size(68, 25);
            this.btnNo.TabIndex = 14;
            this.btnNo.Text = "关闭";
            this.btnNo.UseVisualStyleBackColor = true;
            this.btnNo.Click += new System.EventHandler(this.btnNo_Click);
            // 
            // comboBox1
            // 
            this.comboBox1.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.comboBox1.Font = new System.Drawing.Font("宋体", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.comboBox1.FormattingEnabled = true;
            this.comboBox1.Location = new System.Drawing.Point(185, 150);
            this.comboBox1.Margin = new System.Windows.Forms.Padding(2);
            this.comboBox1.Name = "comboBox1";
            this.comboBox1.Size = new System.Drawing.Size(257, 22);
            this.comboBox1.TabIndex = 6;
            // 
            // FrmMusic
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackgroundImage = global::MyKTV.Properties.Resources._22;
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.ClientSize = new System.Drawing.Size(553, 450);
            this.Controls.Add(this.btnNo);
            this.Controls.Add(this.btnOK);
            this.Controls.Add(this.btnLook);
            this.Controls.Add(this.textBox4);
            this.Controls.Add(this.lblNames);
            this.Controls.Add(this.btnSelect);
            this.Controls.Add(this.textBox3);
            this.Controls.Add(this.lblSinger);
            this.Controls.Add(this.comboBox1);
            this.Controls.Add(this.textBox2);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.lblType);
            this.Controls.Add(this.lblS);
            this.Controls.Add(this.lblName);
            this.Name = "FrmMusic";
            this.Text = "新增歌曲";
            this.Load += new System.EventHandler(this.FrmMusic_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label lblName;
        private System.Windows.Forms.Label lblS;
        private System.Windows.Forms.Label lblType;
        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.TextBox textBox2;
        private System.Windows.Forms.Label lblSinger;
        public System.Windows.Forms.TextBox textBox3;
        private System.Windows.Forms.Button btnSelect;
        private System.Windows.Forms.Label lblNames;
        private System.Windows.Forms.TextBox textBox4;
        private System.Windows.Forms.Button btnLook;
        private System.Windows.Forms.Button btnOK;
        private System.Windows.Forms.Button btnNo;
        private System.Windows.Forms.ComboBox comboBox1;
    }
}