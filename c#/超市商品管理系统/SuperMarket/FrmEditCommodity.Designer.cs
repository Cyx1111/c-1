namespace SuperMarket
{
    partial class FrmEditCommodity
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
            this.txtName = new System.Windows.Forms.TextBox();
            this.lblSort = new System.Windows.Forms.Label();
            this.cboSort = new System.Windows.Forms.ComboBox();
            this.lblPrice = new System.Windows.Forms.Label();
            this.chkIsPrice = new System.Windows.Forms.CheckBox();
            this.lblCheaply = new System.Windows.Forms.Label();
            this.numReducedPrice = new System.Windows.Forms.NumericUpDown();
            this.numPrice = new System.Windows.Forms.NumericUpDown();
            this.btnCancel = new System.Windows.Forms.Button();
            this.btnSave = new System.Windows.Forms.Button();
            this.gbBaseInfo = new System.Windows.Forms.GroupBox();
            this.gbOtherInfo = new System.Windows.Forms.GroupBox();
            ((System.ComponentModel.ISupportInitialize)(this.numReducedPrice)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.numPrice)).BeginInit();
            this.gbBaseInfo.SuspendLayout();
            this.gbOtherInfo.SuspendLayout();
            this.SuspendLayout();
            // 
            // lblName
            // 
            this.lblName.AutoSize = true;
            this.lblName.Location = new System.Drawing.Point(21, 31);
            this.lblName.Name = "lblName";
            this.lblName.Size = new System.Drawing.Size(77, 14);
            this.lblName.TabIndex = 0;
            this.lblName.Text = "商品名称：";
            // 
            // txtName
            // 
            this.txtName.Location = new System.Drawing.Point(103, 27);
            this.txtName.Name = "txtName";
            this.txtName.Size = new System.Drawing.Size(217, 23);
            this.txtName.TabIndex = 1;
            // 
            // lblSort
            // 
            this.lblSort.AutoSize = true;
            this.lblSort.Location = new System.Drawing.Point(21, 66);
            this.lblSort.Name = "lblSort";
            this.lblSort.Size = new System.Drawing.Size(77, 14);
            this.lblSort.TabIndex = 2;
            this.lblSort.Text = "商品类别：";
            // 
            // cboSort
            // 
            this.cboSort.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboSort.FormattingEnabled = true;
            this.cboSort.Location = new System.Drawing.Point(103, 62);
            this.cboSort.Name = "cboSort";
            this.cboSort.Size = new System.Drawing.Size(217, 22);
            this.cboSort.TabIndex = 3;
            // 
            // lblPrice
            // 
            this.lblPrice.AutoSize = true;
            this.lblPrice.Location = new System.Drawing.Point(21, 101);
            this.lblPrice.Name = "lblPrice";
            this.lblPrice.Size = new System.Drawing.Size(77, 14);
            this.lblPrice.TabIndex = 4;
            this.lblPrice.Text = "预售价格：";
            // 
            // chkIsPrice
            // 
            this.chkIsPrice.AutoSize = true;
            this.chkIsPrice.Location = new System.Drawing.Point(103, 22);
            this.chkIsPrice.Name = "chkIsPrice";
            this.chkIsPrice.Size = new System.Drawing.Size(96, 18);
            this.chkIsPrice.TabIndex = 6;
            this.chkIsPrice.Text = "是否为特价";
            this.chkIsPrice.UseVisualStyleBackColor = true;
            this.chkIsPrice.CheckedChanged += new System.EventHandler(this.chkIsPrice_CheckedChanged);
            // 
            // lblCheaply
            // 
            this.lblCheaply.AutoSize = true;
            this.lblCheaply.Location = new System.Drawing.Point(21, 52);
            this.lblCheaply.Name = "lblCheaply";
            this.lblCheaply.Size = new System.Drawing.Size(77, 14);
            this.lblCheaply.TabIndex = 7;
            this.lblCheaply.Text = "特价价格：";
            // 
            // numReducedPrice
            // 
            this.numReducedPrice.DecimalPlaces = 2;
            this.numReducedPrice.Enabled = false;
            this.numReducedPrice.Increment = new decimal(new int[] {
            1000,
            0,
            0,
            131072});
            this.numReducedPrice.Location = new System.Drawing.Point(103, 50);
            this.numReducedPrice.Name = "numReducedPrice";
            this.numReducedPrice.Size = new System.Drawing.Size(221, 23);
            this.numReducedPrice.TabIndex = 16;
            this.numReducedPrice.ThousandsSeparator = true;
            // 
            // numPrice
            // 
            this.numPrice.DecimalPlaces = 2;
            this.numPrice.Increment = new decimal(new int[] {
            1000,
            0,
            0,
            131072});
            this.numPrice.Location = new System.Drawing.Point(103, 99);
            this.numPrice.Name = "numPrice";
            this.numPrice.Size = new System.Drawing.Size(221, 23);
            this.numPrice.TabIndex = 15;
            this.numPrice.ThousandsSeparator = true;
            // 
            // btnCancel
            // 
            this.btnCancel.Location = new System.Drawing.Point(278, 252);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new System.Drawing.Size(87, 27);
            this.btnCancel.TabIndex = 10;
            this.btnCancel.Text = "取消(&C)";
            this.btnCancel.UseVisualStyleBackColor = true;
            this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
            // 
            // btnSave
            // 
            this.btnSave.Location = new System.Drawing.Point(176, 252);
            this.btnSave.Name = "btnSave";
            this.btnSave.Size = new System.Drawing.Size(87, 27);
            this.btnSave.TabIndex = 9;
            this.btnSave.Text = "保存(&S)";
            this.btnSave.UseVisualStyleBackColor = true;
            this.btnSave.Click += new System.EventHandler(this.btnSave_Click);
            // 
            // gbBaseInfo
            // 
            this.gbBaseInfo.Controls.Add(this.lblName);
            this.gbBaseInfo.Controls.Add(this.txtName);
            this.gbBaseInfo.Controls.Add(this.numPrice);
            this.gbBaseInfo.Controls.Add(this.lblSort);
            this.gbBaseInfo.Controls.Add(this.cboSort);
            this.gbBaseInfo.Controls.Add(this.lblPrice);
            this.gbBaseInfo.Location = new System.Drawing.Point(17, 12);
            this.gbBaseInfo.Name = "gbBaseInfo";
            this.gbBaseInfo.Size = new System.Drawing.Size(348, 134);
            this.gbBaseInfo.TabIndex = 17;
            this.gbBaseInfo.TabStop = false;
            this.gbBaseInfo.Text = "基本信息";
            // 
            // gbOtherInfo
            // 
            this.gbOtherInfo.Controls.Add(this.chkIsPrice);
            this.gbOtherInfo.Controls.Add(this.lblCheaply);
            this.gbOtherInfo.Controls.Add(this.numReducedPrice);
            this.gbOtherInfo.Location = new System.Drawing.Point(17, 160);
            this.gbOtherInfo.Name = "gbOtherInfo";
            this.gbOtherInfo.Size = new System.Drawing.Size(348, 86);
            this.gbOtherInfo.TabIndex = 18;
            this.gbOtherInfo.TabStop = false;
            this.gbOtherInfo.Text = "其他信息";
            // 
            // FrmEditCommodity
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 14F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.WhiteSmoke;
            this.ClientSize = new System.Drawing.Size(383, 294);
            this.Controls.Add(this.gbOtherInfo);
            this.Controls.Add(this.gbBaseInfo);
            this.Controls.Add(this.btnCancel);
            this.Controls.Add(this.btnSave);
            this.Font = new System.Drawing.Font("宋体", 10.5F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "FrmEditCommodity";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "编辑商品信息";
            this.Load += new System.EventHandler(this.FrmAddCommodity_Load);
            ((System.ComponentModel.ISupportInitialize)(this.numReducedPrice)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.numPrice)).EndInit();
            this.gbBaseInfo.ResumeLayout(false);
            this.gbBaseInfo.PerformLayout();
            this.gbOtherInfo.ResumeLayout(false);
            this.gbOtherInfo.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Label lblName;
        private System.Windows.Forms.TextBox txtName;
        private System.Windows.Forms.Label lblSort;
        private System.Windows.Forms.ComboBox cboSort;
        private System.Windows.Forms.Label lblPrice;
        private System.Windows.Forms.CheckBox chkIsPrice;
        private System.Windows.Forms.Label lblCheaply;
        private System.Windows.Forms.Button btnCancel;
        private System.Windows.Forms.Button btnSave;
        private System.Windows.Forms.NumericUpDown numReducedPrice;
        private System.Windows.Forms.NumericUpDown numPrice;
        private System.Windows.Forms.GroupBox gbBaseInfo;
        private System.Windows.Forms.GroupBox gbOtherInfo;
    }
}