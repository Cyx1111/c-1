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
    public partial class demo3 : Form
    {
        public demo3()
        {
            InitializeComponent();
        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {

        }

        private void demo3_Load(object sender, EventArgs e)
        {
            string con = "server =.; dataBase =MySchool; Uid =sa; pwd =123456";
            SqlConnection conn = new SqlConnection(con);

            string sql = "select * from Grade";

            SqlCommand cmd = new SqlCommand(sql, conn);

            SqlDataAdapter da = new SqlDataAdapter();
            da.SelectCommand = cmd;
            DataSet ds = new DataSet();

            da.Fill(ds, "Grade");

            DataRow row = ds.Tables["Grade"].NewRow();
            row[0] = -1;
            row[1] = "全部";
            ds.Tables["Grade"].Rows.InsertAt(row, 0);

            comboBox1.DataSource = ds.Tables["Grade"];
            comboBox1.DisplayMember = "GradeName";
            comboBox1.ValueMember = "GradeId";

        }
    }
}
