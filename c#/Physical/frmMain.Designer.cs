namespace Physical
{
    partial class frmMain
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
            this.lblName = new System.Windows.Forms.Label();
            this.txtName = new System.Windows.Forms.TextBox();
            this.btnAdd = new System.Windows.Forms.Button();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.lblLie = new System.Windows.Forms.Label();
            this.cobLie = new System.Windows.Forms.ComboBox();
            this.lblXiang = new System.Windows.Forms.Label();
            this.cobXiang = new System.Windows.Forms.ComboBox();
            this.btnAdd1 = new System.Windows.Forms.Button();
            this.btnDelete = new System.Windows.Forms.Button();
            this.lblName1 = new System.Windows.Forms.Label();
            this.lblMoney = new System.Windows.Forms.Label();
            this.dataGridView1 = new System.Windows.Forms.DataGridView();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.lblName2 = new System.Windows.Forms.Label();
            this.lblPrice = new System.Windows.Forms.Label();
            this.lblPrice1 = new System.Windows.Forms.Label();
            this.Column1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column2 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column3 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).BeginInit();
            this.groupBox2.SuspendLayout();
            this.SuspendLayout();
            // 
            // lblName
            // 
            this.lblName.AutoSize = true;
            this.lblName.Location = new System.Drawing.Point(50, 28);
            this.lblName.Name = "lblName";
            this.lblName.Size = new System.Drawing.Size(53, 12);
            this.lblName.TabIndex = 0;
            this.lblName.Text = "套餐名称";
            // 
            // txtName
            // 
            this.txtName.Location = new System.Drawing.Point(109, 23);
            this.txtName.Name = "txtName";
            this.txtName.Size = new System.Drawing.Size(138, 21);
            this.txtName.TabIndex = 1;
            this.txtName.TextChanged += new System.EventHandler(this.txtName_TextChanged);
            // 
            // btnAdd
            // 
            this.btnAdd.Location = new System.Drawing.Point(265, 23);
            this.btnAdd.Name = "btnAdd";
            this.btnAdd.Size = new System.Drawing.Size(75, 23);
            this.btnAdd.TabIndex = 2;
            this.btnAdd.Text = "添加";
            this.btnAdd.UseVisualStyleBackColor = true;
            this.btnAdd.Click += new System.EventHandler(this.btnAdd_Click);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.btnAdd);
            this.groupBox1.Controls.Add(this.txtName);
            this.groupBox1.Controls.Add(this.lblName);
            this.groupBox1.Location = new System.Drawing.Point(19, 20);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(467, 65);
            this.groupBox1.TabIndex = 3;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "新建套餐";
            // 
            // lblLie
            // 
            this.lblLie.AutoSize = true;
            this.lblLie.Location = new System.Drawing.Point(47, 23);
            this.lblLie.Name = "lblLie";
            this.lblLie.Size = new System.Drawing.Size(53, 12);
            this.lblLie.TabIndex = 4;
            this.lblLie.Text = "套餐列表";
            // 
            // cobLie
            // 
            this.cobLie.FormattingEnabled = true;
            this.cobLie.Location = new System.Drawing.Point(109, 20);
            this.cobLie.Name = "cobLie";
            this.cobLie.Size = new System.Drawing.Size(138, 20);
            this.cobLie.TabIndex = 5;
            this.cobLie.SelectedIndexChanged += new System.EventHandler(this.cobLie_SelectedIndexChanged);
            // 
            // lblXiang
            // 
            this.lblXiang.AutoSize = true;
            this.lblXiang.Location = new System.Drawing.Point(258, 23);
            this.lblXiang.Name = "lblXiang";
            this.lblXiang.Size = new System.Drawing.Size(53, 12);
            this.lblXiang.TabIndex = 6;
            this.lblXiang.Text = "检查项目";
            // 
            // cobXiang
            // 
            this.cobXiang.FormattingEnabled = true;
            this.cobXiang.Location = new System.Drawing.Point(322, 20);
            this.cobXiang.Name = "cobXiang";
            this.cobXiang.Size = new System.Drawing.Size(121, 20);
            this.cobXiang.TabIndex = 7;
            this.cobXiang.SelectedIndexChanged += new System.EventHandler(this.cobXiang_SelectedIndexChanged);
            // 
            // btnAdd1
            // 
            this.btnAdd1.Location = new System.Drawing.Point(260, 58);
            this.btnAdd1.Name = "btnAdd1";
            this.btnAdd1.Size = new System.Drawing.Size(75, 23);
            this.btnAdd1.TabIndex = 8;
            this.btnAdd1.Text = "添加";
            this.btnAdd1.UseVisualStyleBackColor = true;
            this.btnAdd1.Click += new System.EventHandler(this.btnAdd1_Click);
            // 
            // btnDelete
            // 
            this.btnDelete.Location = new System.Drawing.Point(341, 58);
            this.btnDelete.Name = "btnDelete";
            this.btnDelete.Size = new System.Drawing.Size(75, 23);
            this.btnDelete.TabIndex = 9;
            this.btnDelete.Text = "删除";
            this.btnDelete.UseVisualStyleBackColor = true;
            this.btnDelete.Click += new System.EventHandler(this.btnDelete_Click);
            // 
            // lblName1
            // 
            this.lblName1.AutoSize = true;
            this.lblName1.Location = new System.Drawing.Point(47, 93);
            this.lblName1.Name = "lblName1";
            this.lblName1.Size = new System.Drawing.Size(53, 12);
            this.lblName1.TabIndex = 10;
            this.lblName1.Text = "套餐名：";
            // 
            // lblMoney
            // 
            this.lblMoney.AutoSize = true;
            this.lblMoney.Location = new System.Drawing.Point(232, 93);
            this.lblMoney.Name = "lblMoney";
            this.lblMoney.Size = new System.Drawing.Size(41, 12);
            this.lblMoney.TabIndex = 11;
            this.lblMoney.Text = "价格：";
            // 
            // dataGridView1
            // 
            this.dataGridView1.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.dataGridView1.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridView1.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.Column1,
            this.Column2,
            this.Column3});
            this.dataGridView1.Location = new System.Drawing.Point(6, 118);
            this.dataGridView1.Name = "dataGridView1";
            this.dataGridView1.ReadOnly = true;
            this.dataGridView1.RowTemplate.Height = 23;
            this.dataGridView1.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dataGridView1.Size = new System.Drawing.Size(455, 174);
            this.dataGridView1.TabIndex = 12;
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.lblPrice1);
            this.groupBox2.Controls.Add(this.lblPrice);
            this.groupBox2.Controls.Add(this.lblName2);
            this.groupBox2.Controls.Add(this.dataGridView1);
            this.groupBox2.Controls.Add(this.lblMoney);
            this.groupBox2.Controls.Add(this.lblName1);
            this.groupBox2.Controls.Add(this.btnDelete);
            this.groupBox2.Controls.Add(this.btnAdd1);
            this.groupBox2.Controls.Add(this.cobXiang);
            this.groupBox2.Controls.Add(this.lblXiang);
            this.groupBox2.Controls.Add(this.cobLie);
            this.groupBox2.Controls.Add(this.lblLie);
            this.groupBox2.Location = new System.Drawing.Point(19, 91);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(467, 298);
            this.groupBox2.TabIndex = 13;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "检查套餐维护";
            this.groupBox2.Enter += new System.EventHandler(this.groupBox2_Enter);
            // 
            // lblName2
            // 
            this.lblName2.AutoSize = true;
            this.lblName2.Location = new System.Drawing.Point(106, 93);
            this.lblName2.Name = "lblName2";
            this.lblName2.Size = new System.Drawing.Size(41, 12);
            this.lblName2.TabIndex = 13;
            this.lblName2.Text = "label1";
            // 
            // lblPrice
            // 
            this.lblPrice.AutoSize = true;
            this.lblPrice.Location = new System.Drawing.Point(270, 93);
            this.lblPrice.Name = "lblPrice";
            this.lblPrice.Size = new System.Drawing.Size(0, 12);
            this.lblPrice.TabIndex = 14;
            // 
            // lblPrice1
            // 
            this.lblPrice1.AutoSize = true;
            this.lblPrice1.Location = new System.Drawing.Point(276, 93);
            this.lblPrice1.Name = "lblPrice1";
            this.lblPrice1.Size = new System.Drawing.Size(41, 12);
            this.lblPrice1.TabIndex = 15;
            this.lblPrice1.Text = "label1";
            // 
            // Column1
            // 
            this.Column1.DataPropertyName = "name";
            this.Column1.HeaderText = "项目名";
            this.Column1.Name = "Column1";
            this.Column1.ReadOnly = true;
            // 
            // Column2
            // 
            this.Column2.DataPropertyName = "description";
            this.Column2.HeaderText = "描述";
            this.Column2.Name = "Column2";
            this.Column2.ReadOnly = true;
            // 
            // Column3
            // 
            this.Column3.DataPropertyName = "price";
            this.Column3.HeaderText = "价格";
            this.Column3.Name = "Column3";
            this.Column3.ReadOnly = true;
            // 
            // frmMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(511, 397);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.Name = "frmMain";
            this.Text = "体检套餐管理系统";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).EndInit();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Label lblName;
        private System.Windows.Forms.TextBox txtName;
        private System.Windows.Forms.Button btnAdd;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Label lblLie;
        private System.Windows.Forms.ComboBox cobLie;
        private System.Windows.Forms.Label lblXiang;
        private System.Windows.Forms.ComboBox cobXiang;
        private System.Windows.Forms.Button btnAdd1;
        private System.Windows.Forms.Button btnDelete;
        private System.Windows.Forms.Label lblName1;
        private System.Windows.Forms.Label lblMoney;
        private System.Windows.Forms.DataGridView dataGridView1;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.Label lblPrice1;
        private System.Windows.Forms.Label lblPrice;
        private System.Windows.Forms.Label lblName2;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column1;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column2;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column3;
    }
}

