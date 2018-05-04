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
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            
        }
        public void shujv()
        {
           Class2 db = new Class2();
            string name = textname.Text;

            SqlConnection conn = new SqlConnection(Class2.str);
            try{
                conn.Open();
                string sql = "Select Id,Name,author,time,type from book where Name like '%"+textname.Text+"%'";
              
                

                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader dr = cmd.ExecuteReader();
               
                        while (dr.Read())
                        {
                            int xue =Convert.ToInt32( dr["Id"]);
                            string Name = dr["Name"].ToString();
                            string greadid = dr["author"].ToString();
                            DateTime time =Convert.ToDateTime(dr["time"]);
                            string it = dr["type"].ToString();

                            ListViewItem item = new ListViewItem(xue.ToString());
                            item.SubItems.Add(Name);
                            item.SubItems.Add(greadid);
                            item.SubItems.Add(time.ToString());
                            item.SubItems.Add(it);

                            listView1.Items.Add(item);

                        }
                       
                    }catch(Exception)
                    {
                        MessageBox.Show("出现异常！");
                    }
            finally
            {
                conn.Close();
            }
        }



        private void namebutt_Click(object sender, EventArgs e)
        {
            this.shujv();
        }
    }
}

