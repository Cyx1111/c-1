namespace Travellog
{
    partial class FrmMain
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
            this.labTime = new System.Windows.Forms.Label();
            this.labPlace = new System.Windows.Forms.Label();
            this.labStories = new System.Windows.Forms.Label();
            this.textTime = new System.Windows.Forms.TextBox();
            this.textPlace = new System.Windows.Forms.TextBox();
            this.rtbStories = new System.Windows.Forms.RichTextBox();
            this.bttSave = new System.Windows.Forms.Button();
            this.bttDie = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // labTime
            // 
            this.labTime.AutoSize = true;
            this.labTime.Location = new System.Drawing.Point(72, 71);
            this.labTime.Name = "labTime";
            this.labTime.Size = new System.Drawing.Size(37, 15);
            this.labTime.TabIndex = 0;
            this.labTime.Text = "日期";
            // 
            // labPlace
            // 
            this.labPlace.AutoSize = true;
            this.labPlace.Location = new System.Drawing.Point(494, 71);
            this.labPlace.Name = "labPlace";
            this.labPlace.Size = new System.Drawing.Size(37, 15);
            this.labPlace.TabIndex = 1;
            this.labPlace.Text = "地点";
            // 
            // labStories
            // 
            this.labStories.AutoSize = true;
            this.labStories.Location = new System.Drawing.Point(72, 120);
            this.labStories.Name = "labStories";
            this.labStories.Size = new System.Drawing.Size(37, 15);
            this.labStories.TabIndex = 2;
            this.labStories.Text = "见闻";
            // 
            // textTime
            // 
            this.textTime.Location = new System.Drawing.Point(211, 66);
            this.textTime.Name = "textTime";
            this.textTime.Size = new System.Drawing.Size(100, 25);
            this.textTime.TabIndex = 3;
            // 
            // textPlace
            // 
            this.textPlace.Location = new System.Drawing.Point(611, 66);
            this.textPlace.Name = "textPlace";
            this.textPlace.Size = new System.Drawing.Size(100, 25);
            this.textPlace.TabIndex = 4;
            // 
            // rtbStories
            // 
            this.rtbStories.Location = new System.Drawing.Point(75, 138);
            this.rtbStories.Name = "rtbStories";
            this.rtbStories.Size = new System.Drawing.Size(678, 268);
            this.rtbStories.TabIndex = 5;
            this.rtbStories.Text = "";
            // 
            // bttSave
            // 
            this.bttSave.Location = new System.Drawing.Point(174, 443);
            this.bttSave.Name = "bttSave";
            this.bttSave.Size = new System.Drawing.Size(75, 23);
            this.bttSave.TabIndex = 6;
            this.bttSave.Text = "保存";
            this.bttSave.UseVisualStyleBackColor = true;
            this.bttSave.Click += new System.EventHandler(this.bttSave_Click);
            // 
            // bttDie
            // 
            this.bttDie.Location = new System.Drawing.Point(514, 443);
            this.bttDie.Name = "bttDie";
            this.bttDie.Size = new System.Drawing.Size(75, 23);
            this.bttDie.TabIndex = 6;
            this.bttDie.Text = "取消";
            this.bttDie.UseVisualStyleBackColor = true;
            // 
            // FrmMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(896, 505);
            this.Controls.Add(this.bttDie);
            this.Controls.Add(this.bttSave);
            this.Controls.Add(this.rtbStories);
            this.Controls.Add(this.textPlace);
            this.Controls.Add(this.textTime);
            this.Controls.Add(this.labStories);
            this.Controls.Add(this.labPlace);
            this.Controls.Add(this.labTime);
            this.Name = "FrmMain";
            this.Text = "旅行日志";
            this.Load += new System.EventHandler(this.FrmMain_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label labTime;
        private System.Windows.Forms.Label labPlace;
        private System.Windows.Forms.Label labStories;
        private System.Windows.Forms.TextBox textTime;
        private System.Windows.Forms.TextBox textPlace;
        private System.Windows.Forms.RichTextBox rtbStories;
        private System.Windows.Forms.Button bttSave;
        private System.Windows.Forms.Button bttDie;
    }
}

