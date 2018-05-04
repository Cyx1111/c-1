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

namespace new_next3
{
    public partial class dvglist : Form
    {
        public dvglist()
        {
            InitializeComponent();
        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {
           
            SqlConnection conn = new SqlConnection(demo5.str);
            string sql = "select * from Student where StudentName like '%" + textBox1 .Text+ "%'";
            SqlDataAdapter da = new SqlDataAdapter(sql, conn);
            DataSet ds = new DataSet();
            ds.Tables.Clear();
            da.Fill(ds, "stu");
            dataGridView1.DataSource = ds.Tables["stu"];
        }

        private void dvglist_Load(object sender, EventArgs e)
        {
            dataGridView1.AutoGenerateColumns = false;
            // TODO: 这行代码将数据加载到表“mySchoolDataSet.Student”中。您可以根据需要移动或删除它。
            // this.studentTableAdapter.Fill(this.mySchoolDataSet.Student);
            dataGridView1.AutoGenerateColumns = false;
            SqlConnection conn = new SqlConnection(demo5.str);
            string sql = "select * from Student";
            SqlDataAdapter da = new SqlDataAdapter(sql, conn);
            DataSet sds = new DataSet();
            sds.Tables.Clear();
            da.Fill(sds, "stu");
            dataGridView1.DataSource = sds.Tables["stu"];
        }

        private void treeView1_AfterSelect(object sender, TreeViewEventArgs e)
        {
            demo5 dd= new demo5();
            DataSet ds = new DataSet();
            SqlConnection conn = new SqlConnection(demo5.str);
            string sql = "select * from Student";
            SqlDataAdapter da = new SqlDataAdapter(sql, conn);
            da.Fill(ds, "xinxi");
            dataGridView1.DataSource = ds.Tables["xinxi"];
            if (treeView1.SelectedNode != null)
            {
                DataView dv = new DataView(ds.Tables[0]);
                if (treeView1.SelectedNode.Level == 1)
                {
                    string num = treeView1.SelectedNode.Text;//获取treeView的点击值
                    dv.RowFilter = string.Format("GradeId='{0}'", num);//设置筛选条件
                }
                else if (treeView1.SelectedNode.Level == 2)
                {
                    string sex = treeView1.SelectedNode.Text;//获取treeView的点击值
                    string gradename = treeView1.SelectedNode.Parent.Text;
                    dv.RowFilter = string.Format("Sex='{0}'and GradeId='{1}'", sex, gradename);//设置筛选条件
                }
                dataGridView1.DataSource = dv;//重新筛选

            }




            //string mess = string.Format("选中了{0}节点，深度是{1}", treeView1.SelectedNode.Text, treeView1.SelectedNode.Level);
            //MessageBox.Show(mess, "提示", MessageBoxButtons.OK, MessageBoxIcon.Information);



        }

        private void dataGridView1_CellContentClick_1(object sender, DataGridViewCellEventArgs e)
        {

        }
    }
}
