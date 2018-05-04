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
    public partial class FrmSong : Form
    {
        public FrmSong()
        {
            InitializeComponent();
        }
        DBHelper db = new DBHelper();

        //全部
        public void ADD()
        {
            //显示全部的信息
            string sql1 = @"select song_id,song_name,songtype_name,song_play_count 
                 from song_type inner join song_info on song_type.songtype_id=song_info.songtype_id";
            SqlDataAdapter da = new SqlDataAdapter(sql1, db.Connection);
            DataSet ds = new DataSet();
            if (ds.Tables["song_type"] != null)
            {
                ds.Tables["song_type"].Clear();
            }
            da.Fill(ds, "song_type");
            dataGridView1.DataSource = ds.Tables["song_type"];
        }
        //查询按钮
        private void btncha_Click(object sender, EventArgs e)
        {
            try
            {
                //显示田间查询的
                string one = txtName1.Text;
                string two = cmbtype.Text;
                string sql = @"select song_id,song_name,songtype_name,song_play_count 
                 from song_type inner join song_info on song_type.songtype_id=song_info.songtype_id
                 where song_info.song_name like '%" + one + "%' and song_type.songtype_name = '" + two + "'";
                if (two.Equals("请选择"))
                {
                    ADD();
                }
                else
                {
                    SqlDataAdapter da = new SqlDataAdapter(sql, db.Connection);
                    DataSet ds = new DataSet();
                    if (ds.Tables["song_type"] != null)
                    {
                        ds.Tables["song_type"].Clear();
                    }
                    da.Fill(ds, "song_type");
                    dataGridView1.DataSource = ds.Tables["song_type"];
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);

            }
            finally
            {
                db.CloseConnection();
            }
        }
        //添加歌曲类型
        public void songtype()
        {
            try
            {
                //拼接sql语句
                string sql = "select * from song_type";
                SqlDataAdapter da = new SqlDataAdapter(sql,db.Connection);
                DataSet ds = new DataSet();
                if (ds.Tables["song_type"] !=null)
                {
                    ds.Tables["song_type"].Clear();
                }
                da.Fill(ds, "song_type");
                DataRow row = ds.Tables["song_type"].NewRow();
                row["songtype_id"] = -1;
                row["songtype_name"] = "请选择";
                ds.Tables["song_type"].Rows.InsertAt(row,0);
                cmbtype.DisplayMember = "songtype_name";
                cmbtype.ValueMember = "songtype_id";
                cmbtype.DataSource = ds.Tables["song_type"];

            }
            catch (Exception)
            {
                
                throw;
            }
          
            
        }
        //主窗口
        private void FrmSong_Load(object sender, EventArgs e)
        {
            //调用类型
            songtype();
        }
        //删除
        private void 删除ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            // 数据库类
            DBHelper helper = new DBHelper();
            try
            {
                if (this.dataGridView1.CurrentRow != null)
                {
                    string message = string.Format("确定要删除名称为 {0} 的数据吗?", this.dataGridView1.CurrentRow.Cells[1].Value);

                    // 通过谈出对话框让用户选择
                    if (MessageBox.Show(message, "系统提示", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
                    {
                        StringBuilder sb = new StringBuilder();
                        int num = Convert.ToInt32(this.dataGridView1.CurrentRow.Cells[0].Value);
                        // 删除语句
                        sb.AppendFormat(@"delete from song_info where song_id = {0}", num);
                        // 执行删除操作
                        SqlCommand command = new SqlCommand(sb.ToString(), helper.Connection);
                        helper.OpenConnection();
                        int result = command.ExecuteNonQuery();
                        if (result == 1)
                        {
                            MessageBox.Show("删除成功！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);

                            // 重新加载新数据
                            this.ADD();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }
            finally
            {
                helper.CloseConnection();
            }
                }

        private void 修改ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            FrmMusic fm = new FrmMusic();
            fm.names = Convert.ToString(dataGridView1.CurrentRow.Cells[1].Value);
            fm.Show();
        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void btncha_MouseMove(object sender, MouseEventArgs e)
        {
        }
        }
    }
