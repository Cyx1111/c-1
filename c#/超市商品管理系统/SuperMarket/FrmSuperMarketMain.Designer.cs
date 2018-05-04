namespace SuperMarket
{
    partial class FrmSuperMarketMain
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FrmSuperMarketMain));
            this.msSuperMarket = new System.Windows.Forms.MenuStrip();
            this.tsmiAccount = new System.Windows.Forms.ToolStripMenuItem();
            this.tsmiPassWord = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripSeparator1 = new System.Windows.Forms.ToolStripSeparator();
            this.tsmiExit = new System.Windows.Forms.ToolStripMenuItem();
            this.tsmiHelp = new System.Windows.Forms.ToolStripMenuItem();
            this.tsmiAbout = new System.Windows.Forms.ToolStripMenuItem();
            this.imageList1 = new System.Windows.Forms.ImageList(this.components);
            this.picCommodity = new System.Windows.Forms.PictureBox();
            this.picCommoditySort = new System.Windows.Forms.PictureBox();
            this.lblCommodity = new System.Windows.Forms.Label();
            this.lblCommoditySort = new System.Windows.Forms.Label();
            this.msSuperMarket.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picCommodity)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.picCommoditySort)).BeginInit();
            this.SuspendLayout();
            // 
            // msSuperMarket
            // 
            this.msSuperMarket.Font = new System.Drawing.Font("宋体", 10.5F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.msSuperMarket.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tsmiAccount,
            this.tsmiHelp});
            this.msSuperMarket.Location = new System.Drawing.Point(0, 0);
            this.msSuperMarket.Name = "msSuperMarket";
            this.msSuperMarket.Padding = new System.Windows.Forms.Padding(7, 2, 0, 2);
            this.msSuperMarket.Size = new System.Drawing.Size(817, 24);
            this.msSuperMarket.TabIndex = 0;
            this.msSuperMarket.Text = "menuStrip1";
            // 
            // tsmiAccount
            // 
            this.tsmiAccount.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tsmiPassWord,
            this.toolStripSeparator1,
            this.tsmiExit});
            this.tsmiAccount.Name = "tsmiAccount";
            this.tsmiAccount.Size = new System.Drawing.Size(96, 20);
            this.tsmiAccount.Text = "账户管理(&U)";
            // 
            // tsmiPassWord
            // 
            this.tsmiPassWord.Name = "tsmiPassWord";
            this.tsmiPassWord.Size = new System.Drawing.Size(151, 22);
            this.tsmiPassWord.Text = "修改密码(&P)";
            this.tsmiPassWord.Click += new System.EventHandler(this.tsmiChangePassWord_Click);
            // 
            // toolStripSeparator1
            // 
            this.toolStripSeparator1.Name = "toolStripSeparator1";
            this.toolStripSeparator1.Size = new System.Drawing.Size(148, 6);
            // 
            // tsmiExit
            // 
            this.tsmiExit.Name = "tsmiExit";
            this.tsmiExit.Size = new System.Drawing.Size(151, 22);
            this.tsmiExit.Text = "退出(&X)";
            this.tsmiExit.Click += new System.EventHandler(this.tsmiExit_Click);
            // 
            // tsmiHelp
            // 
            this.tsmiHelp.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tsmiAbout});
            this.tsmiHelp.Name = "tsmiHelp";
            this.tsmiHelp.Size = new System.Drawing.Size(68, 20);
            this.tsmiHelp.Text = "帮助(&H)";
            // 
            // tsmiAbout
            // 
            this.tsmiAbout.Name = "tsmiAbout";
            this.tsmiAbout.Size = new System.Drawing.Size(123, 22);
            this.tsmiAbout.Text = "关于(&A)";
            this.tsmiAbout.Click += new System.EventHandler(this.tsmiHelp_Click);
            // 
            // imageList1
            // 
            this.imageList1.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("imageList1.ImageStream")));
            this.imageList1.TransparentColor = System.Drawing.Color.Transparent;
            this.imageList1.Images.SetKeyName(0, "48policies.jpg");
            this.imageList1.Images.SetKeyName(1, "48roles.jpg");
            this.imageList1.Images.SetKeyName(2, "pig.jpg");
            this.imageList1.Images.SetKeyName(3, "pig_story.jpg");
            this.imageList1.Images.SetKeyName(4, "Azul.jpg");
            // 
            // picCommodity
            // 
            this.picCommodity.Image = ((System.Drawing.Image)(resources.GetObject("picCommodity.Image")));
            this.picCommodity.Location = new System.Drawing.Point(114, 151);
            this.picCommodity.Name = "picCommodity";
            this.picCommodity.Size = new System.Drawing.Size(183, 157);
            this.picCommodity.SizeMode = System.Windows.Forms.PictureBoxSizeMode.AutoSize;
            this.picCommodity.TabIndex = 1;
            this.picCommodity.TabStop = false;
            this.picCommodity.Click += new System.EventHandler(this.picCommodity_Click);
            // 
            // picCommoditySort
            // 
            this.picCommoditySort.Image = ((System.Drawing.Image)(resources.GetObject("picCommoditySort.Image")));
            this.picCommoditySort.Location = new System.Drawing.Point(469, 151);
            this.picCommoditySort.Name = "picCommoditySort";
            this.picCommoditySort.Size = new System.Drawing.Size(185, 160);
            this.picCommoditySort.SizeMode = System.Windows.Forms.PictureBoxSizeMode.AutoSize;
            this.picCommoditySort.TabIndex = 2;
            this.picCommoditySort.TabStop = false;
            this.picCommoditySort.Click += new System.EventHandler(this.picCommoditySort_Click);
            // 
            // lblCommodity
            // 
            this.lblCommodity.AutoSize = true;
            this.lblCommodity.Location = new System.Drawing.Point(179, 117);
            this.lblCommodity.Name = "lblCommodity";
            this.lblCommodity.Size = new System.Drawing.Size(63, 14);
            this.lblCommodity.TabIndex = 3;
            this.lblCommodity.Text = "商品管理";
            // 
            // lblCommoditySort
            // 
            this.lblCommoditySort.AutoSize = true;
            this.lblCommoditySort.Location = new System.Drawing.Point(514, 117);
            this.lblCommoditySort.Name = "lblCommoditySort";
            this.lblCommoditySort.Size = new System.Drawing.Size(91, 14);
            this.lblCommoditySort.TabIndex = 4;
            this.lblCommoditySort.Text = "商品类别管理";
            // 
            // FrmSuperMarketMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 14F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.WhiteSmoke;
            this.ClientSize = new System.Drawing.Size(817, 553);
            this.Controls.Add(this.lblCommoditySort);
            this.Controls.Add(this.lblCommodity);
            this.Controls.Add(this.picCommoditySort);
            this.Controls.Add(this.picCommodity);
            this.Controls.Add(this.msSuperMarket);
            this.Font = new System.Drawing.Font("宋体", 10.5F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.MainMenuStrip = this.msSuperMarket;
            this.Name = "FrmSuperMarketMain";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "超市商品管理";
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.FrmSuperMarketMain_FormClosed);
            this.msSuperMarket.ResumeLayout(false);
            this.msSuperMarket.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picCommodity)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.picCommoditySort)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.MenuStrip msSuperMarket;
        private System.Windows.Forms.ToolStripMenuItem tsmiAccount;
        private System.Windows.Forms.ToolStripMenuItem tsmiPassWord;
        private System.Windows.Forms.ToolStripMenuItem tsmiHelp;
        private System.Windows.Forms.ImageList imageList1;
        private System.Windows.Forms.PictureBox picCommodity;
        private System.Windows.Forms.PictureBox picCommoditySort;
        private System.Windows.Forms.Label lblCommodity;
        private System.Windows.Forms.Label lblCommoditySort;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator1;
        private System.Windows.Forms.ToolStripMenuItem tsmiExit;
        private System.Windows.Forms.ToolStripMenuItem tsmiAbout;
    }
}