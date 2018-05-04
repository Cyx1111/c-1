namespace new_next3
{
    partial class dvglist
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(dvglist));
            System.Windows.Forms.TreeNode treeNode1 = new System.Windows.Forms.TreeNode("女", 2, 2);
            System.Windows.Forms.TreeNode treeNode2 = new System.Windows.Forms.TreeNode("男", 3, 3);
            System.Windows.Forms.TreeNode treeNode3 = new System.Windows.Forms.TreeNode("1", 0, 1, new System.Windows.Forms.TreeNode[] {
            treeNode1,
            treeNode2});
            System.Windows.Forms.TreeNode treeNode4 = new System.Windows.Forms.TreeNode("女", 2, 2);
            System.Windows.Forms.TreeNode treeNode5 = new System.Windows.Forms.TreeNode("男", 3, 3);
            System.Windows.Forms.TreeNode treeNode6 = new System.Windows.Forms.TreeNode("2", 0, 1, new System.Windows.Forms.TreeNode[] {
            treeNode4,
            treeNode5});
            System.Windows.Forms.TreeNode treeNode7 = new System.Windows.Forms.TreeNode("女");
            System.Windows.Forms.TreeNode treeNode8 = new System.Windows.Forms.TreeNode("男", 3, 3);
            System.Windows.Forms.TreeNode treeNode9 = new System.Windows.Forms.TreeNode("3", 0, 1, new System.Windows.Forms.TreeNode[] {
            treeNode7,
            treeNode8});
            System.Windows.Forms.TreeNode treeNode10 = new System.Windows.Forms.TreeNode("女", 2, 2);
            System.Windows.Forms.TreeNode treeNode11 = new System.Windows.Forms.TreeNode("男", 3, 3);
            System.Windows.Forms.TreeNode treeNode12 = new System.Windows.Forms.TreeNode("s4", 0, 1, new System.Windows.Forms.TreeNode[] {
            treeNode10,
            treeNode11});
            System.Windows.Forms.TreeNode treeNode13 = new System.Windows.Forms.TreeNode("全部", new System.Windows.Forms.TreeNode[] {
            treeNode3,
            treeNode6,
            treeNode9,
            treeNode12});
            this.button1 = new System.Windows.Forms.Button();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.button2 = new System.Windows.Forms.Button();
            this.dataGridView1 = new System.Windows.Forms.DataGridView();
            this.Column1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column2 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column3 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column4 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.studentNoDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.loginPwdDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.studentNameDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.sexDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.gradeIdDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.phoneDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.addressDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.bornDateDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.emailDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.studentBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.mySchoolDataSet = new new_next3.MySchoolDataSet();
            this.studentTableAdapter = new new_next3.MySchoolDataSetTableAdapters.StudentTableAdapter();
            this.imageList1 = new System.Windows.Forms.ImageList(this.components);
            this.treeView1 = new System.Windows.Forms.TreeView();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.studentBindingSource)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.mySchoolDataSet)).BeginInit();
            this.SuspendLayout();
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(343, 101);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(110, 39);
            this.button1.TabIndex = 0;
            this.button1.Text = "姓名";
            this.button1.UseVisualStyleBackColor = true;
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(527, 106);
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(144, 25);
            this.textBox1.TabIndex = 1;
            this.textBox1.TextChanged += new System.EventHandler(this.textBox1_TextChanged);
            // 
            // button2
            // 
            this.button2.Location = new System.Drawing.Point(744, 101);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(107, 39);
            this.button2.TabIndex = 2;
            this.button2.Text = "查询";
            this.button2.UseVisualStyleBackColor = true;
            this.button2.Click += new System.EventHandler(this.button2_Click);
            // 
            // dataGridView1
            // 
            this.dataGridView1.AutoGenerateColumns = false;
            this.dataGridView1.AutoSizeRowsMode = System.Windows.Forms.DataGridViewAutoSizeRowsMode.DisplayedHeaders;
            this.dataGridView1.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridView1.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.Column1,
            this.Column2,
            this.Column3,
            this.Column4,
            this.studentNoDataGridViewTextBoxColumn,
            this.loginPwdDataGridViewTextBoxColumn,
            this.studentNameDataGridViewTextBoxColumn,
            this.sexDataGridViewTextBoxColumn,
            this.gradeIdDataGridViewTextBoxColumn,
            this.phoneDataGridViewTextBoxColumn,
            this.addressDataGridViewTextBoxColumn,
            this.bornDateDataGridViewTextBoxColumn,
            this.emailDataGridViewTextBoxColumn});
            this.dataGridView1.DataSource = this.studentBindingSource;
            this.dataGridView1.Location = new System.Drawing.Point(389, 173);
            this.dataGridView1.Name = "dataGridView1";
            this.dataGridView1.RowTemplate.Height = 27;
            this.dataGridView1.Size = new System.Drawing.Size(445, 384);
            this.dataGridView1.TabIndex = 3;
            this.dataGridView1.CellContentClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dataGridView1_CellContentClick_1);
            // 
            // Column1
            // 
            this.Column1.DataPropertyName = "StudentNo";
            this.Column1.HeaderText = "学号";
            this.Column1.Name = "Column1";
            // 
            // Column2
            // 
            this.Column2.DataPropertyName = "StudentName";
            this.Column2.HeaderText = "姓名";
            this.Column2.Name = "Column2";
            // 
            // Column3
            // 
            this.Column3.DataPropertyName = "Sex";
            this.Column3.HeaderText = "性别";
            this.Column3.Name = "Column3";
            // 
            // Column4
            // 
            this.Column4.DataPropertyName = "Address";
            this.Column4.HeaderText = "地址";
            this.Column4.Name = "Column4";
            // 
            // studentNoDataGridViewTextBoxColumn
            // 
            this.studentNoDataGridViewTextBoxColumn.DataPropertyName = "StudentNo";
            this.studentNoDataGridViewTextBoxColumn.HeaderText = "StudentNo";
            this.studentNoDataGridViewTextBoxColumn.Name = "studentNoDataGridViewTextBoxColumn";
            // 
            // loginPwdDataGridViewTextBoxColumn
            // 
            this.loginPwdDataGridViewTextBoxColumn.DataPropertyName = "LoginPwd";
            this.loginPwdDataGridViewTextBoxColumn.HeaderText = "LoginPwd";
            this.loginPwdDataGridViewTextBoxColumn.Name = "loginPwdDataGridViewTextBoxColumn";
            // 
            // studentNameDataGridViewTextBoxColumn
            // 
            this.studentNameDataGridViewTextBoxColumn.DataPropertyName = "StudentName";
            this.studentNameDataGridViewTextBoxColumn.HeaderText = "StudentName";
            this.studentNameDataGridViewTextBoxColumn.Name = "studentNameDataGridViewTextBoxColumn";
            // 
            // sexDataGridViewTextBoxColumn
            // 
            this.sexDataGridViewTextBoxColumn.DataPropertyName = "Sex";
            this.sexDataGridViewTextBoxColumn.HeaderText = "Sex";
            this.sexDataGridViewTextBoxColumn.Name = "sexDataGridViewTextBoxColumn";
            // 
            // gradeIdDataGridViewTextBoxColumn
            // 
            this.gradeIdDataGridViewTextBoxColumn.DataPropertyName = "GradeId";
            this.gradeIdDataGridViewTextBoxColumn.HeaderText = "GradeId";
            this.gradeIdDataGridViewTextBoxColumn.Name = "gradeIdDataGridViewTextBoxColumn";
            // 
            // phoneDataGridViewTextBoxColumn
            // 
            this.phoneDataGridViewTextBoxColumn.DataPropertyName = "Phone";
            this.phoneDataGridViewTextBoxColumn.HeaderText = "Phone";
            this.phoneDataGridViewTextBoxColumn.Name = "phoneDataGridViewTextBoxColumn";
            // 
            // addressDataGridViewTextBoxColumn
            // 
            this.addressDataGridViewTextBoxColumn.DataPropertyName = "Address";
            this.addressDataGridViewTextBoxColumn.HeaderText = "Address";
            this.addressDataGridViewTextBoxColumn.Name = "addressDataGridViewTextBoxColumn";
            // 
            // bornDateDataGridViewTextBoxColumn
            // 
            this.bornDateDataGridViewTextBoxColumn.DataPropertyName = "BornDate";
            this.bornDateDataGridViewTextBoxColumn.HeaderText = "BornDate";
            this.bornDateDataGridViewTextBoxColumn.Name = "bornDateDataGridViewTextBoxColumn";
            // 
            // emailDataGridViewTextBoxColumn
            // 
            this.emailDataGridViewTextBoxColumn.DataPropertyName = "Email";
            this.emailDataGridViewTextBoxColumn.HeaderText = "Email";
            this.emailDataGridViewTextBoxColumn.Name = "emailDataGridViewTextBoxColumn";
            // 
            // studentBindingSource
            // 
            this.studentBindingSource.DataMember = "Student";
            this.studentBindingSource.DataSource = this.mySchoolDataSet;
            // 
            // mySchoolDataSet
            // 
            this.mySchoolDataSet.DataSetName = "MySchoolDataSet";
            this.mySchoolDataSet.SchemaSerializationMode = System.Data.SchemaSerializationMode.IncludeSchema;
            // 
            // studentTableAdapter
            // 
            this.studentTableAdapter.ClearBeforeFill = true;
            // 
            // imageList1
            // 
            this.imageList1.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("imageList1.ImageStream")));
            this.imageList1.TransparentColor = System.Drawing.Color.Transparent;
            this.imageList1.Images.SetKeyName(0, "01.gif");
            this.imageList1.Images.SetKeyName(1, "02.gif");
            this.imageList1.Images.SetKeyName(2, "03.gif");
            this.imageList1.Images.SetKeyName(3, "04.gif");
            // 
            // treeView1
            // 
            this.treeView1.ImageIndex = 0;
            this.treeView1.ImageList = this.imageList1;
            this.treeView1.Location = new System.Drawing.Point(1, 0);
            this.treeView1.Name = "treeView1";
            treeNode1.ImageIndex = 2;
            treeNode1.Name = "节点5";
            treeNode1.SelectedImageIndex = 2;
            treeNode1.Tag = "1";
            treeNode1.Text = "女";
            treeNode2.ImageIndex = 3;
            treeNode2.Name = "节点6";
            treeNode2.SelectedImageIndex = 3;
            treeNode2.Tag = "0";
            treeNode2.Text = "男";
            treeNode3.ImageIndex = 0;
            treeNode3.Name = "节点1";
            treeNode3.SelectedImageIndex = 1;
            treeNode3.Text = "1";
            treeNode4.ImageIndex = 2;
            treeNode4.Name = "节点7";
            treeNode4.SelectedImageIndex = 2;
            treeNode4.Text = "女";
            treeNode5.ImageIndex = 3;
            treeNode5.Name = "节点8";
            treeNode5.SelectedImageIndex = 3;
            treeNode5.Text = "男";
            treeNode6.ImageIndex = 0;
            treeNode6.Name = "节点2";
            treeNode6.SelectedImageIndex = 1;
            treeNode6.Text = "2";
            treeNode7.ImageKey = "03.gif";
            treeNode7.Name = "节点9";
            treeNode7.SelectedImageIndex = 2;
            treeNode7.Text = "女";
            treeNode8.ImageIndex = 3;
            treeNode8.Name = "节点10";
            treeNode8.SelectedImageIndex = 3;
            treeNode8.Text = "男";
            treeNode9.ImageIndex = 0;
            treeNode9.Name = "节点3";
            treeNode9.SelectedImageIndex = 1;
            treeNode9.Text = "3";
            treeNode10.ImageIndex = 2;
            treeNode10.Name = "节点11";
            treeNode10.SelectedImageIndex = 2;
            treeNode10.Text = "女";
            treeNode11.ImageIndex = 3;
            treeNode11.Name = "节点12";
            treeNode11.SelectedImageIndex = 3;
            treeNode11.Text = "男";
            treeNode12.ImageIndex = 0;
            treeNode12.Name = "节点4";
            treeNode12.SelectedImageIndex = 1;
            treeNode12.Text = "s4";
            treeNode13.Name = "节点0";
            treeNode13.Text = "全部";
            this.treeView1.Nodes.AddRange(new System.Windows.Forms.TreeNode[] {
            treeNode13});
            this.treeView1.SelectedImageIndex = 0;
            this.treeView1.Size = new System.Drawing.Size(336, 618);
            this.treeView1.TabIndex = 4;
            this.treeView1.AfterSelect += new System.Windows.Forms.TreeViewEventHandler(this.treeView1_AfterSelect);
            // 
            // dvglist
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(953, 614);
            this.Controls.Add(this.treeView1);
            this.Controls.Add(this.dataGridView1);
            this.Controls.Add(this.button2);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.button1);
            this.Name = "dvglist";
            this.Text = " ";
            this.Load += new System.EventHandler(this.dvglist_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.studentBindingSource)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.mySchoolDataSet)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.Button button2;
        private System.Windows.Forms.DataGridView dataGridView1;
        private MySchoolDataSet mySchoolDataSet;
        private System.Windows.Forms.BindingSource studentBindingSource;
        private MySchoolDataSetTableAdapters.StudentTableAdapter studentTableAdapter;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column1;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column2;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column3;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column4;
        private System.Windows.Forms.ImageList imageList1;
        private System.Windows.Forms.TreeView treeView1;
        private System.Windows.Forms.DataGridViewTextBoxColumn studentNoDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn loginPwdDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn studentNameDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn sexDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn gradeIdDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn phoneDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn addressDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn bornDateDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn emailDataGridViewTextBoxColumn;
    }
}