﻿namespace MyKTV
{
    partial class Frmamend
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Frmamend));
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.btncha = new System.Windows.Forms.Button();
            this.cmbtype = new System.Windows.Forms.ComboBox();
            this.lbltype = new System.Windows.Forms.Label();
            this.txtName1 = new System.Windows.Forms.TextBox();
            this.lblName = new System.Windows.Forms.Label();
            this.imageList1 = new System.Windows.Forms.ImageList(this.components);
            this.grpselect = new System.Windows.Forms.GroupBox();
            this.dataGridView1 = new System.Windows.Forms.DataGridView();
            this.Column1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column2 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column3 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column4 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column5 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.contextMenuStrip1 = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.修改ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.删除ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.singerinfoBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.kTVDataSet = new MyKTV.KTVDataSet();
            this.singer_infoTableAdapter = new MyKTV.KTVDataSetTableAdapters.singer_infoTableAdapter();
            this.groupBox1.SuspendLayout();
            this.grpselect.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).BeginInit();
            this.contextMenuStrip1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.singerinfoBindingSource)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.kTVDataSet)).BeginInit();
            this.SuspendLayout();
            // 
            // groupBox1
            // 
            this.groupBox1.BackColor = System.Drawing.Color.Transparent;
            this.groupBox1.Controls.Add(this.btncha);
            this.groupBox1.Controls.Add(this.cmbtype);
            this.groupBox1.Controls.Add(this.lbltype);
            this.groupBox1.Controls.Add(this.txtName1);
            this.groupBox1.Controls.Add(this.lblName);
            this.groupBox1.Location = new System.Drawing.Point(12, 15);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(580, 61);
            this.groupBox1.TabIndex = 0;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "查询条件";
            this.groupBox1.Enter += new System.EventHandler(this.groupBox1_Enter);
            // 
            // btncha
            // 
            this.btncha.Location = new System.Drawing.Point(499, 24);
            this.btncha.Name = "btncha";
            this.btncha.Size = new System.Drawing.Size(75, 23);
            this.btncha.TabIndex = 4;
            this.btncha.Text = "查询";
            this.btncha.UseVisualStyleBackColor = true;
            this.btncha.Click += new System.EventHandler(this.btncha_Click);
            // 
            // cmbtype
            // 
            this.cmbtype.FormattingEnabled = true;
            this.cmbtype.Location = new System.Drawing.Point(332, 26);
            this.cmbtype.Name = "cmbtype";
            this.cmbtype.Size = new System.Drawing.Size(131, 20);
            this.cmbtype.TabIndex = 3;
            // 
            // lbltype
            // 
            this.lbltype.AutoSize = true;
            this.lbltype.Location = new System.Drawing.Point(244, 29);
            this.lbltype.Name = "lbltype";
            this.lbltype.Size = new System.Drawing.Size(53, 12);
            this.lbltype.TabIndex = 2;
            this.lbltype.Text = "歌手类型";
            // 
            // txtName1
            // 
            this.txtName1.Location = new System.Drawing.Point(115, 26);
            this.txtName1.Name = "txtName1";
            this.txtName1.Size = new System.Drawing.Size(100, 21);
            this.txtName1.TabIndex = 1;
            // 
            // lblName
            // 
            this.lblName.AutoSize = true;
            this.lblName.Location = new System.Drawing.Point(49, 29);
            this.lblName.Name = "lblName";
            this.lblName.Size = new System.Drawing.Size(53, 12);
            this.lblName.TabIndex = 0;
            this.lblName.Text = "歌手姓名";
            // 
            // imageList1
            // 
            this.imageList1.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("imageList1.ImageStream")));
            this.imageList1.TransparentColor = System.Drawing.Color.Transparent;
            this.imageList1.Images.SetKeyName(0, "01e75359327686a8012193a32daab8.jpg@2o.jpg");
            this.imageList1.Images.SetKeyName(1, "01.gif");
            this.imageList1.Images.SetKeyName(2, "03.gif");
            this.imageList1.Images.SetKeyName(3, "04.gif");
            this.imageList1.Images.SetKeyName(4, "20140509170947-2087121164.jpg");
            // 
            // grpselect
            // 
            this.grpselect.BackColor = System.Drawing.Color.Transparent;
            this.grpselect.Controls.Add(this.dataGridView1);
            this.grpselect.Location = new System.Drawing.Point(12, 93);
            this.grpselect.Name = "grpselect";
            this.grpselect.Size = new System.Drawing.Size(580, 370);
            this.grpselect.TabIndex = 2;
            this.grpselect.TabStop = false;
            this.grpselect.Text = "查询结果";
            // 
            // dataGridView1
            // 
            this.dataGridView1.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.dataGridView1.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridView1.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.Column1,
            this.Column2,
            this.Column3,
            this.Column4,
            this.Column5});
            this.dataGridView1.ContextMenuStrip = this.contextMenuStrip1;
            this.dataGridView1.Location = new System.Drawing.Point(0, 20);
            this.dataGridView1.Name = "dataGridView1";
            this.dataGridView1.ReadOnly = true;
            this.dataGridView1.RowTemplate.Height = 23;
            this.dataGridView1.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dataGridView1.Size = new System.Drawing.Size(574, 331);
            this.dataGridView1.TabIndex = 0;
            this.dataGridView1.CellContentClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dataGridView1_CellContentClick);
            // 
            // Column1
            // 
            this.Column1.DataPropertyName = "singer_id";
            this.Column1.HeaderText = "歌手号";
            this.Column1.Name = "Column1";
            this.Column1.ReadOnly = true;
            // 
            // Column2
            // 
            this.Column2.DataPropertyName = "singer_name";
            this.Column2.HeaderText = "歌手姓名";
            this.Column2.Name = "Column2";
            this.Column2.ReadOnly = true;
            // 
            // Column3
            // 
            this.Column3.DataPropertyName = "singertype_name";
            this.Column3.HeaderText = "歌手类型";
            this.Column3.Name = "Column3";
            this.Column3.ReadOnly = true;
            // 
            // Column4
            // 
            this.Column4.DataPropertyName = "singer_Sex";
            this.Column4.HeaderText = "歌手性别";
            this.Column4.Name = "Column4";
            this.Column4.ReadOnly = true;
            // 
            // Column5
            // 
            this.Column5.DataPropertyName = "singer_del";
            this.Column5.HeaderText = "歌手描述";
            this.Column5.Name = "Column5";
            this.Column5.ReadOnly = true;
            // 
            // contextMenuStrip1
            // 
            this.contextMenuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.修改ToolStripMenuItem,
            this.删除ToolStripMenuItem});
            this.contextMenuStrip1.Name = "contextMenuStrip1";
            this.contextMenuStrip1.Size = new System.Drawing.Size(101, 48);
            // 
            // 修改ToolStripMenuItem
            // 
            this.修改ToolStripMenuItem.Name = "修改ToolStripMenuItem";
            this.修改ToolStripMenuItem.Size = new System.Drawing.Size(100, 22);
            this.修改ToolStripMenuItem.Text = "修改";
            this.修改ToolStripMenuItem.Click += new System.EventHandler(this.修改ToolStripMenuItem_Click_1);
            // 
            // 删除ToolStripMenuItem
            // 
            this.删除ToolStripMenuItem.Name = "删除ToolStripMenuItem";
            this.删除ToolStripMenuItem.Size = new System.Drawing.Size(100, 22);
            this.删除ToolStripMenuItem.Text = "删除";
            this.删除ToolStripMenuItem.Click += new System.EventHandler(this.删除ToolStripMenuItem_Click);
            // 
            // singerinfoBindingSource
            // 
            this.singerinfoBindingSource.DataMember = "singer_info";
            this.singerinfoBindingSource.DataSource = this.kTVDataSet;
            // 
            // kTVDataSet
            // 
            this.kTVDataSet.DataSetName = "KTVDataSet";
            this.kTVDataSet.SchemaSerializationMode = System.Data.SchemaSerializationMode.IncludeSchema;
            // 
            // singer_infoTableAdapter
            // 
            this.singer_infoTableAdapter.ClearBeforeFill = true;
            // 
            // Frmamend
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackgroundImage = global::MyKTV.Properties.Resources._221;
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.ClientSize = new System.Drawing.Size(604, 456);
            this.Controls.Add(this.grpselect);
            this.Controls.Add(this.groupBox1);
            this.Name = "Frmamend";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "歌手查询";
            this.Load += new System.EventHandler(this.Frmamend_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.grpselect.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).EndInit();
            this.contextMenuStrip1.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.singerinfoBindingSource)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.kTVDataSet)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Button btncha;
        private System.Windows.Forms.ComboBox cmbtype;
        private System.Windows.Forms.Label lbltype;
        private System.Windows.Forms.TextBox txtName1;
        private System.Windows.Forms.Label lblName;
        private System.Windows.Forms.ImageList imageList1;
        private System.Windows.Forms.GroupBox grpselect;
        private System.Windows.Forms.DataGridView dataGridView1;
        private KTVDataSet kTVDataSet;
        private System.Windows.Forms.BindingSource singerinfoBindingSource;
        private KTVDataSetTableAdapters.singer_infoTableAdapter singer_infoTableAdapter;
        private System.Windows.Forms.DataGridViewTextBoxColumn singertypeidDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column1;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column2;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column3;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column4;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column5;
        private System.Windows.Forms.ContextMenuStrip contextMenuStrip1;
        private System.Windows.Forms.ToolStripMenuItem 修改ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem 删除ToolStripMenuItem;
    }
}