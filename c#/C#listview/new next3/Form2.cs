using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;

namespace new_next3
{
    public partial class Form2 : Form
    {
        public Form2()
        {
            InitializeComponent();
        }

        private void Form2_Load(object sender, EventArgs e)
        {
            string str = "Data Source=.;Initial Catalog=MySchool;User ID=sa; pwd = 123456";
            SqlConnection conn = new SqlConnection(str);
            string sql = "select * from Student";
            SqlDataAdapter da = new SqlDataAdapter(sql,conn);
            DataSet ds = new DataSet();
            da.Fill(ds,"stu");
            dataGridView1.DataSource = ds.Tables["stu"];


        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }
    }
}
