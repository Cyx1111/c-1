namespace MyKTV
{
    partial class FrmEnter
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
            this.label1 = new System.Windows.Forms.Label();
            this.lblName = new System.Windows.Forms.Label();
            this.txtName = new System.Windows.Forms.TextBox();
            this.lblpwd = new System.Windows.Forms.Label();
            this.txtpwd = new System.Windows.Forms.TextBox();
            this.btnenter = new System.Windows.Forms.Button();
            this.btncancel = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("宋体", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.label1.ForeColor = System.Drawing.SystemColors.ActiveCaptionText;
            this.label1.Location = new System.Drawing.Point(99, 24);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(299, 24);
            this.label1.TabIndex = 0;
            this.label1.Text = "欢迎使用KTV后台管理系统";
            // 
            // lblName
            // 
            this.lblName.AutoSize = true;
            this.lblName.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblName.Location = new System.Drawing.Point(120, 133);
            this.lblName.Name = "lblName";
            this.lblName.Size = new System.Drawing.Size(51, 16);
            this.lblName.TabIndex = 1;
            this.lblName.Text = "姓名 ";
            // 
            // txtName
            // 
            this.txtName.Location = new System.Drawing.Point(215, 130);
            this.txtName.Name = "txtName";
            this.txtName.Size = new System.Drawing.Size(168, 21);
            this.txtName.TabIndex = 2;
            // 
            // lblpwd
            // 
            this.lblpwd.AutoSize = true;
            this.lblpwd.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblpwd.Location = new System.Drawing.Point(120, 221);
            this.lblpwd.Name = "lblpwd";
            this.lblpwd.Size = new System.Drawing.Size(42, 16);
            this.lblpwd.TabIndex = 1;
            this.lblpwd.Text = "密码";
            // 
            // txtpwd
            // 
            this.txtpwd.Location = new System.Drawing.Point(215, 218);
            this.txtpwd.Name = "txtpwd";
            this.txtpwd.PasswordChar = '*';
            this.txtpwd.Size = new System.Drawing.Size(168, 21);
            this.txtpwd.TabIndex = 2;
            // 
            // btnenter
            // 
            this.btnenter.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.btnenter.Location = new System.Drawing.Point(154, 302);
            this.btnenter.Name = "btnenter";
            this.btnenter.Size = new System.Drawing.Size(75, 23);
            this.btnenter.TabIndex = 3;
            this.btnenter.Text = "登录";
            this.btnenter.UseVisualStyleBackColor = true;
            this.btnenter.Click += new System.EventHandler(this.btnenter_Click);
            // 
            // btncancel
            // 
            this.btncancel.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.btncancel.Location = new System.Drawing.Point(353, 302);
            this.btncancel.Name = "btncancel";
            this.btncancel.Size = new System.Drawing.Size(75, 23);
            this.btncancel.TabIndex = 3;
            this.btncancel.Text = "取消";
            this.btncancel.UseVisualStyleBackColor = true;
            this.btncancel.Click += new System.EventHandler(this.btncancel_Click);
            // 
            // FrmEnter
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackgroundImage = global::MyKTV.Properties.Resources._15526014_4711e9e95e29309e237e4911d2b8fe1a_0;
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.ClientSize = new System.Drawing.Size(493, 348);
            this.Controls.Add(this.btncancel);
            this.Controls.Add(this.btnenter);
            this.Controls.Add(this.txtpwd);
            this.Controls.Add(this.txtName);
            this.Controls.Add(this.lblpwd);
            this.Controls.Add(this.lblName);
            this.Controls.Add(this.label1);
            this.ForeColor = System.Drawing.SystemColors.ActiveCaptionText;
            this.Name = "FrmEnter";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "管理员登录";
            this.Load += new System.EventHandler(this.FrmEnter_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label lblName;
        private System.Windows.Forms.TextBox txtName;
        private System.Windows.Forms.Label lblpwd;
        private System.Windows.Forms.TextBox txtpwd;
        private System.Windows.Forms.Button btnenter;
        private System.Windows.Forms.Button btncancel;
    }
}