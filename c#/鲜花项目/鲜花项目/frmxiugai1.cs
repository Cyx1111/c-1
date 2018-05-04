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
    public partial class frmxiugai1 : Form
    {
        public frmxiugai1()
        {
            InitializeComponent();
        }
        string sql = " Data Source=.;Initial Catalog=FlowerSys;Persist Security Info=True;User ID=sa;Password=123456";

       public string id;
        public string no;
        private void button1_Click(object sender, EventArgs e)
        {
             SqlConnection conn = new SqlConnection(sql);
          
             try
             {
                 conn.Open();//打开数据库
                 //根据商品ID修改的sql语句

                 string str = "update FlowerSate set SaleCount='" + textBox2.Text + "',SalePrice='" + textBox3.Text + "', Remark='"+richTextBox1.Text  +"'where SaleId ='" + no + "'";

                 SqlCommand cmd = new SqlCommand(str, conn);
                 int num = cmd.ExecuteNonQuery();//返回行数方法
                 if (num > 0)
                 {
                     MessageBox.Show("修改成功", "提示", MessageBoxButtons.OK);
                 }
                 else
                 {

                     MessageBox.Show("修改失败", "提示", MessageBoxButtons.OK, MessageBoxIcon.Error);
                 }
             }
             catch (Exception ex)
             {

                 MessageBox.Show(ex.ToString(), "提示");
             }
             finally {

                 conn.Close();
             }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void frmxiugai1_Load(object sender, EventArgs e)
        {
            label1.Text = "销售编号：" + no;

        }

        private void textBox3_TextChanged(object sender, EventArgs e)
        {

        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }
    }
}
