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

namespace MyKTV
{
    public partial class FrmsingerName : Form
    {
        public FrmsingerName()
        {
            InitializeComponent();
        }
        DBHelper db = new DBHelper();
     
        SqlDataAdapter da;
        DataSet ds;
        public string name;
        public string ab;
        public int type;
        public string look;
        public string names;
        public string value;
        //查询歌手，编号
        public void Add()
        {
            string sql = "select * from singer_info";
            da = new SqlDataAdapter(sql,db.Connection);
            ds = new DataSet();
            if (ds.Tables["singer_info"]!=null)
            {
                ds.Tables["singer_info"].Clear();
            }
            da.Fill(ds, "singer_info");
            this.dataGridView1.DataSource = ds.Tables["singer_info"];
        }
        //主窗口
        private void FrmsingerName_Load(object sender, EventArgs e)
        {

            this.dataGridView1.AutoGenerateColumns = false;
            Add();
        }
        private void AfterType()
        {
            if (this.treeView1.SelectedNode.Level == 1)
            {
                int type = Convert.ToInt32(this.treeView1.SelectedNode.Tag);
                DataView dv = ds.Tables["singer_info"].DefaultView;
                // MessageBox.Show(type.ToString());
                dv.RowFilter = string.Format(" singertype_id={0}", type);
            }
        }

        private void treeView1_AfterSelect(object sender, TreeViewEventArgs e)
        {
            AfterType();
        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            

        }

        private void dataGridView1_DoubleClick(object sender, EventArgs e)
        {
            value = this.dataGridView1.SelectedRows[0].Cells[1].Value.ToString();
            int id = (int)this.dataGridView1.SelectedRows[0].Cells[0].Value;
            if (!value.Equals(string.Empty))
            {
                this.Hide();
                FrmMusic byMusic = new FrmMusic();
                byMusic.go = value;
                byMusic.name = name;
                byMusic.id = id;
                byMusic.ab = ab;
                byMusic.type = type;
                byMusic.look = look;
                byMusic.names = names;
                byMusic.MdiParent = this.MdiParent;
                byMusic.Show();
            }
          
        }
    }
}
