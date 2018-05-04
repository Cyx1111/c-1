using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace 鲜花项目
{
    public partial class frmcha : Form
    {
        public frmcha()
        {
            InitializeComponent();
        }
        string sql =" Data Source=.;Initial Catalog=FlowerSys;Persist Security Info=True;User ID=sa;Password=123456";
      
        private void frmcha_Load(object sender, EventArgs e)
        {
           
            SqlConnection conn = new SqlConnection(sql);
            string str = " select SaleId,o.FlowerId,FlowerName,SaleCount,SalePrice,SaleDate,SaleClerk,Remark from Flower as f,FlowerSate as o where f.FlowerId=o.FlowerId ";
            SqlCommand cmd = new SqlCommand(str, conn);

            SqlDataAdapter da = new SqlDataAdapter();
            da.SelectCommand = cmd;
            DataSet ds = new DataSet();

            da.Fill(ds, "ss");
            dataGridView1.DataSource = ds.Tables["ss"];

           
            
        }

        private void 修改ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            frmxiugai1 x = new frmxiugai1();
            x.no = dataGridView1.SelectedRows[0].Cells[0].Value.ToString();
            //窗体传值
            x.textBox2.Text = dataGridView1.SelectedRows[0].Cells[3].Value.ToString();
            //窗体传值
            x.textBox3.Text = dataGridView1.SelectedRows[0].Cells[4].Value.ToString();
            //窗体传值
            x.richTextBox1.Text = dataGridView1.SelectedRows[0].Cells[7].Value.ToString();

            x.Show();


        }

        private void button1_Click(object sender, EventArgs e)
        {
            string name = textBox1.Text;
            SqlConnection conn = new SqlConnection(sql);
            string str = " select SaleId,o.FlowerId,FlowerName,SaleCount,SalePrice,SaleDate,SaleClerk,Remark from Flower as f,FlowerSate as o where f.FlowerId=o.FlowerId and FlowerName like '%"+name+"%' ";
            SqlCommand cmd = new SqlCommand(str, conn);

            SqlDataAdapter da = new SqlDataAdapter();
            da.SelectCommand = cmd;
            DataSet ds = new DataSet();

            da.Fill(ds, "ss");
            dataGridView1.DataSource = ds.Tables["ss"];
        }
    }
}
