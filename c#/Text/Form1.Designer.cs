namespace Text
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
            this.lblDay = new System.Windows.Forms.Label();
            this.lblAddress = new System.Windows.Forms.Label();
            this.lblListend = new System.Windows.Forms.Label();
            this.tboDay = new System.Windows.Forms.TextBox();
            this.tboAddress = new System.Windows.Forms.TextBox();
            this.rtbListend = new System.Windows.Forms.RichTextBox();
            this.btnOk = new System.Windows.Forms.Button();
            this.btnClose = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // lblDay
            // 
            this.lblDay.AutoSize = true;
            this.lblDay.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblDay.Location = new System.Drawing.Point(43, 70);
            this.lblDay.Name = "lblDay";
            this.lblDay.Size = new System.Drawing.Size(69, 20);
            this.lblDay.TabIndex = 0;
            this.lblDay.Text = "日期：";
            // 
            // lblAddress
            // 
            this.lblAddress.AutoSize = true;
            this.lblAddress.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblAddress.Location = new System.Drawing.Point(367, 70);
            this.lblAddress.Name = "lblAddress";
            this.lblAddress.Size = new System.Drawing.Size(69, 20);
            this.lblAddress.TabIndex = 1;
            this.lblAddress.Text = "地点：";
            // 
            // lblListend
            // 
            this.lblListend.AutoSize = true;
            this.lblListend.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblListend.Location = new System.Drawing.Point(43, 142);
            this.lblListend.Name = "lblListend";
            this.lblListend.Size = new System.Drawing.Size(49, 20);
            this.lblListend.TabIndex = 2;
            this.lblListend.Text = "见闻";
            // 
            // tboDay
            // 
            this.tboDay.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.tboDay.Location = new System.Drawing.Point(124, 67);
            this.tboDay.Name = "tboDay";
            this.tboDay.Size = new System.Drawing.Size(194, 30);
            this.tboDay.TabIndex = 3;
            // 
            // tboAddress
            // 
            this.tboAddress.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.tboAddress.Location = new System.Drawing.Point(459, 67);
            this.tboAddress.Name = "tboAddress";
            this.tboAddress.Size = new System.Drawing.Size(194, 30);
            this.tboAddress.TabIndex = 4;
            // 
            // rtbListend
            // 
            this.rtbListend.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.rtbListend.Location = new System.Drawing.Point(46, 182);
            this.rtbListend.Name = "rtbListend";
            this.rtbListend.Size = new System.Drawing.Size(603, 313);
            this.rtbListend.TabIndex = 5;
            this.rtbListend.Text = "";
            // 
            // btnOk
            // 
            this.btnOk.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.btnOk.Location = new System.Drawing.Point(143, 521);
            this.btnOk.Name = "btnOk";
            this.btnOk.Size = new System.Drawing.Size(81, 36);
            this.btnOk.TabIndex = 6;
            this.btnOk.Text = "保存";
            this.btnOk.UseVisualStyleBackColor = true;
            this.btnOk.Click += new System.EventHandler(this.btnOk_Click);
            // 
            // btnClose
            // 
            this.btnClose.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.btnClose.Location = new System.Drawing.Point(433, 521);
            this.btnClose.Name = "btnClose";
            this.btnClose.Size = new System.Drawing.Size(81, 36);
            this.btnClose.TabIndex = 7;
            this.btnClose.Text = "关闭";
            this.btnClose.UseVisualStyleBackColor = true;
            this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(714, 583);
            this.Controls.Add(this.btnClose);
            this.Controls.Add(this.btnOk);
            this.Controls.Add(this.rtbListend);
            this.Controls.Add(this.tboAddress);
            this.Controls.Add(this.tboDay);
            this.Controls.Add(this.lblListend);
            this.Controls.Add(this.lblAddress);
            this.Controls.Add(this.lblDay);
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Form1";
            this.Text = "旅行日志";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label lblDay;
        private System.Windows.Forms.Label lblAddress;
        private System.Windows.Forms.Label lblListend;
        private System.Windows.Forms.TextBox tboDay;
        private System.Windows.Forms.TextBox tboAddress;
        private System.Windows.Forms.RichTextBox rtbListend;
        private System.Windows.Forms.Button btnOk;
        private System.Windows.Forms.Button btnClose;
    }
}

