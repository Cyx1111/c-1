namespace SuperMarket
{
    partial class FrmChangePwd
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
            this.btnReturn = new System.Windows.Forms.Button();
            this.btnUpdatePwd = new System.Windows.Forms.Button();
            this.txtReNewPwd = new System.Windows.Forms.TextBox();
            this.txtNewPwd = new System.Windows.Forms.TextBox();
            this.txtOldPwd = new System.Windows.Forms.TextBox();
            this.lblReNewPwd = new System.Windows.Forms.Label();
            this.lblNewPwd = new System.Windows.Forms.Label();
            this.lblOldPwd = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // btnReturn
            // 
            this.btnReturn.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.btnReturn.Location = new System.Drawing.Point(177, 170);
            this.btnReturn.Name = "btnReturn";
            this.btnReturn.Size = new System.Drawing.Size(75, 23);
            this.btnReturn.TabIndex = 12;
            this.btnReturn.Text = "返  回";
            this.btnReturn.UseVisualStyleBackColor = true;
            this.btnReturn.Click += new System.EventHandler(this.btnReturn_Click);
            // 
            // btnUpdatePwd
            // 
            this.btnUpdatePwd.Location = new System.Drawing.Point(78, 170);
            this.btnUpdatePwd.Name = "btnUpdatePwd";
            this.btnUpdatePwd.Size = new System.Drawing.Size(75, 23);
            this.btnUpdatePwd.TabIndex = 11;
            this.btnUpdatePwd.Text = "修  改";
            this.btnUpdatePwd.UseVisualStyleBackColor = true;
            this.btnUpdatePwd.Click += new System.EventHandler(this.btnUpdatePwd_Click);
            // 
            // txtReNewPwd
            // 
            this.txtReNewPwd.Location = new System.Drawing.Point(115, 133);
            this.txtReNewPwd.Name = "txtReNewPwd";
            this.txtReNewPwd.Size = new System.Drawing.Size(140, 21);
            this.txtReNewPwd.TabIndex = 10;
            this.txtReNewPwd.UseSystemPasswordChar = true;
            // 
            // txtNewPwd
            // 
            this.txtNewPwd.Location = new System.Drawing.Point(115, 90);
            this.txtNewPwd.Name = "txtNewPwd";
            this.txtNewPwd.Size = new System.Drawing.Size(140, 21);
            this.txtNewPwd.TabIndex = 9;
            this.txtNewPwd.UseSystemPasswordChar = true;
            // 
            // txtOldPwd
            // 
            this.txtOldPwd.Location = new System.Drawing.Point(115, 47);
            this.txtOldPwd.Name = "txtOldPwd";
            this.txtOldPwd.Size = new System.Drawing.Size(140, 21);
            this.txtOldPwd.TabIndex = 8;
            this.txtOldPwd.UseSystemPasswordChar = true;
            // 
            // lblReNewPwd
            // 
            this.lblReNewPwd.AutoSize = true;
            this.lblReNewPwd.Location = new System.Drawing.Point(38, 140);
            this.lblReNewPwd.Name = "lblReNewPwd";
            this.lblReNewPwd.Size = new System.Drawing.Size(77, 12);
            this.lblReNewPwd.TabIndex = 15;
            this.lblReNewPwd.Text = "确认新密码：";
            // 
            // lblNewPwd
            // 
            this.lblNewPwd.AutoSize = true;
            this.lblNewPwd.Location = new System.Drawing.Point(62, 97);
            this.lblNewPwd.Name = "lblNewPwd";
            this.lblNewPwd.Size = new System.Drawing.Size(53, 12);
            this.lblNewPwd.TabIndex = 14;
            this.lblNewPwd.Text = "新密码：";
            // 
            // lblOldPwd
            // 
            this.lblOldPwd.AutoSize = true;
            this.lblOldPwd.Location = new System.Drawing.Point(61, 52);
            this.lblOldPwd.Name = "lblOldPwd";
            this.lblOldPwd.Size = new System.Drawing.Size(53, 12);
            this.lblOldPwd.TabIndex = 13;
            this.lblOldPwd.Text = "原密码：";
            // 
            // FrmChangePwd
            // 
            this.AcceptButton = this.btnUpdatePwd;
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.WhiteSmoke;
            this.CancelButton = this.btnReturn;
            this.ClientSize = new System.Drawing.Size(292, 233);
            this.Controls.Add(this.btnReturn);
            this.Controls.Add(this.btnUpdatePwd);
            this.Controls.Add(this.txtReNewPwd);
            this.Controls.Add(this.txtNewPwd);
            this.Controls.Add(this.txtOldPwd);
            this.Controls.Add(this.lblReNewPwd);
            this.Controls.Add(this.lblNewPwd);
            this.Controls.Add(this.lblOldPwd);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "FrmChangePwd";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "修改密码";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnReturn;
        private System.Windows.Forms.Button btnUpdatePwd;
        private System.Windows.Forms.TextBox txtReNewPwd;
        private System.Windows.Forms.TextBox txtNewPwd;
        private System.Windows.Forms.TextBox txtOldPwd;
        private System.Windows.Forms.Label lblReNewPwd;
        private System.Windows.Forms.Label lblNewPwd;
        private System.Windows.Forms.Label lblOldPwd;
    }
}