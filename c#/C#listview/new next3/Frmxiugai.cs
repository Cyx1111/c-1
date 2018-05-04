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
    public partial class Frmxiugai : Form
    {


        public Frmxiugai()
        {
            InitializeComponent();
        }

        private void Frmxiugai_Load(object sender, EventArgs e)
        {


        }

        private void button1_Click(object sender, EventArgs e)
        {

            fillListView();

        }

        public void fillListView()
        {
            string str = "Data Source=.;Initial Catalog=MySchool;User ID=sa;Password=123456";
            SqlConnection conn = new SqlConnection(str);

            if (listView1.Items.Count > 0)
            {
                listView1.Items.Clear();
            }
            string sql = "Select StudentNo,StudentName,Sex,Address from Student where StudentName like '%" + this.box.Text.Trim() + "%'";
            try
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader dr = cmd.ExecuteReader();

                if (!dr.HasRows)
                {
                    MessageBox.Show("没有查到数据", "提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else
                {
                    while (dr.Read())
                    {
                        string xue = dr["StudentNo"].ToString();
                        string Name = dr["StudentName"].ToString();
                        string gender = dr["Sex"].ToString();
                        string it = dr["Address"].ToString();

                        ListViewItem item = new ListViewItem(xue);
                        item.SubItems.Add(Name);
                        item.SubItems.Add(gender);
                        item.SubItems.Add(it);

                        listView1.Items.Add(item);


                    }
                    dr.Close();
                }

            }
            catch (Exception)
            {
                MessageBox.Show("出现异常！");
            }
            finally
            {
                conn.Close();
            }
        }

        private void 修改ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            {
            xiugai();
        }
        }

        public void xiugai() {

            if (this.listView1.SelectedItems.Count > 0)
            {
                demo4 d4 = new demo4();
                //d4.num = Convert.ToInt32( listView1.SelectedItems[0].Text);
                //d4.name = listView1.SelectedItems[0].SubItems[1].Text;
                //d4.pwd = listView1.SelectedItems[0].SubItems[2].Text;
                //d4.dengji = listView1.SelectedItems[0].SubItems[3].Text;
                //d4.email = listView1.SelectedItems[0].SubItems[4].Text;
                //d4.day = listView1.SelectedItems[0].SubItems[5].Text;
                d4.Show();
            }
            else
            {
                MessageBox.Show("请选择一个学生！", "提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
          

        }

        private void 删除ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            demo4 d4 = new demo4();
            d4.Show();
        }

        }
    }

