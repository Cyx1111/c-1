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

namespace new_text2
{
    public partial class FrmAdd : Form
    {
        public FrmAdd()
        {
            InitializeComponent();
        }

        private void FrmAdd_Load(object sender, EventArgs e)
        {
            tpty();
        }
        public void tpty()
        {
            Class1 db = new Class1();
            SqlConnection conn = new SqlConnection(db.str);
            try
            {
                conn.Open();
                string str = "select id,name,author,time,type from book";
                SqlCommand cmd = new SqlCommand(str, conn);
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr != null)
                {
                    if (dr.HasRows)
                    {
                        while (dr.Read())
                        {
                            int xue = Convert.ToInt32(dr["id"]);
                            string name = dr["name"].ToString();
                            string author = dr["author"].ToString();
                            DateTime br = Convert.ToDateTime(dr["time"]);
                            string type = dr["type"].ToString();
                            string sql = "Select Id,Name,author,time,type from book where Name like '%" + textBox1.Text + "%'";
              
                            ListViewItem item = new ListViewItem(xue.ToString(), 0);

                            item.SubItems.Add(name);
                            item.SubItems.Add(author.ToString());
                            item.SubItems.Add(br.ToString());
                            item.SubItems.Add(type.ToString());

                            listView1.Items.Add(item);

                        }
                        dr.Close();
                    }
                }

            }
            catch (Exception)
            {
                MessageBox.Show("异常");
            }
            finally
            {
                conn.Close();
            }
        }
    }
}