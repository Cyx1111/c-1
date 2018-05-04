namespace MyKTV
{
    partial class FrmSongurl
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
            this.lblOld = new System.Windows.Forms.Label();
            this.txtOld = new System.Windows.Forms.TextBox();
            this.lblNew = new System.Windows.Forms.Label();
            this.txtNew = new System.Windows.Forms.TextBox();
            this.btnLook = new System.Windows.Forms.Button();
            this.btnOK = new System.Windows.Forms.Button();
            this.btnNO = new System.Windows.Forms.Button();
            this.folderBrowserDialog1 = new System.Windows.Forms.FolderBrowserDialog();
            this.SuspendLayout();
            // 
            // lblOld
            // 
            this.lblOld.AutoSize = true;
            this.lblOld.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblOld.Location = new System.Drawing.Point(70, 24);
            this.lblOld.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.lblOld.Name = "lblOld";
            this.lblOld.Size = new System.Drawing.Size(72, 16);
            this.lblOld.TabIndex = 5;
            this.lblOld.Text = "当前路径";
            // 
            // txtOld
            // 
            this.txtOld.Font = new System.Drawing.Font("宋体", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.txtOld.Location = new System.Drawing.Point(209, 23);
            this.txtOld.Margin = new System.Windows.Forms.Padding(2);
            this.txtOld.Name = "txtOld";
            this.txtOld.ReadOnly = true;
            this.txtOld.Size = new System.Drawing.Size(397, 24);
            this.txtOld.TabIndex = 7;
            // 
            // lblNew
            // 
            this.lblNew.AutoSize = true;
            this.lblNew.Font = new System.Drawing.Font("宋体", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.lblNew.Location = new System.Drawing.Point(70, 82);
            this.lblNew.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.lblNew.Name = "lblNew";
            this.lblNew.Size = new System.Drawing.Size(56, 16);
            this.lblNew.TabIndex = 8;
            this.lblNew.Text = "新路径";
            // 
            // txtNew
            // 
            this.txtNew.Font = new System.Drawing.Font("宋体", 10.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.txtNew.Location = new System.Drawing.Point(209, 82);
            this.txtNew.Margin = new System.Windows.Forms.Padding(2);
            this.txtNew.Name = "txtNew";
            this.txtNew.Size = new System.Drawing.Size(397, 24);
            this.txtNew.TabIndex = 9;
            // 
            // btnLook
            // 
            this.btnLook.Location = new System.Drawing.Point(546, 146);
            this.btnLook.Margin = new System.Windows.Forms.Padding(2);
            this.btnLook.Name = "btnLook";
            this.btnLook.Size = new System.Drawing.Size(104, 26);
            this.btnLook.TabIndex = 10;
            this.btnLook.Text = "浏览";
            this.btnLook.UseVisualStyleBackColor = true;
            this.btnLook.Click += new System.EventHandler(this.btnLook_Click);
            // 
            // btnOK
            // 
            this.btnOK.Location = new System.Drawing.Point(487, 267);
            this.btnOK.Margin = new System.Windows.Forms.Padding(2);
            this.btnOK.Name = "btnOK";
            this.btnOK.Size = new System.Drawing.Size(67, 26);
            this.btnOK.TabIndex = 11;
            this.btnOK.Text = "保存";
            this.btnOK.UseVisualStyleBackColor = true;
            this.btnOK.Click += new System.EventHandler(this.btnOK_Click);
            // 
            // btnNO
            // 
            this.btnNO.Location = new System.Drawing.Point(644, 267);
            this.btnNO.Margin = new System.Windows.Forms.Padding(2);
            this.btnNO.Name = "btnNO";
            this.btnNO.Size = new System.Drawing.Size(67, 26);
            this.btnNO.TabIndex = 12;
            this.btnNO.Text = "取消";
            this.btnNO.UseVisualStyleBackColor = true;
            this.btnNO.Click += new System.EventHandler(this.btnNO_Click);
            // 
            // FrmSongurl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackgroundImage = global::MyKTV.Properties.Resources._22;
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.ClientSize = new System.Drawing.Size(722, 343);
            this.Controls.Add(this.btnNO);
            this.Controls.Add(this.btnOK);
            this.Controls.Add(this.btnLook);
            this.Controls.Add(this.txtNew);
            this.Controls.Add(this.lblNew);
            this.Controls.Add(this.txtOld);
            this.Controls.Add(this.lblOld);
            this.Name = "FrmSongurl";
            this.Text = "歌曲路径";
            this.Load += new System.EventHandler(this.FrmSongurl_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label lblOld;
        private System.Windows.Forms.TextBox txtOld;
        private System.Windows.Forms.Label lblNew;
        private System.Windows.Forms.TextBox txtNew;
        private System.Windows.Forms.Button btnLook;
        private System.Windows.Forms.Button btnOK;
        private System.Windows.Forms.Button btnNO;
        private System.Windows.Forms.FolderBrowserDialog folderBrowserDialog1;
    }
}