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
    public partial class Frmamend : Form
    {
        public Frmamend()
        {
            InitializeComponent();
        }
        DBHelper db = new DBHelper();
        //查询
        private void btncha_Click(object sender, EventArgs e)
        {
            try
            {
                //拿到文本框的值
                string grader = txtName1.Text;
                string grade = cmbtype.Text;
                //拼接sql语句
                string sql = @"select singer_id,singer_name,singertype_name,singer_Sex,singer_del from singer_info,singer_type
               where singer_info.singertype_id = singer_type.singertype_id and singer_name like'%" + grader + "%' and singertype_name = '" + grade + "'";
                SqlDataAdapter da = new SqlDataAdapter(sql, db.Connection);
                DataSet ds = new DataSet();
                da.Fill(ds);
                dataGridView1.DataSource = ds.Tables[0];
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

        /// <summary>
        /// 歌手类型
        /// </summary>
        public void type()
        {
            string sql = "select * from singer_type";
            SqlDataAdapter da = new SqlDataAdapter(sql, db.Connection);
            DataSet ds = new DataSet();
            da.Fill(ds);
            DataRow row = ds.Tables[0].NewRow();
            row["singertype_id"] = -1;
            row["singertype_name"] = "请选择";
            ds.Tables[0].Rows.InsertAt(row, 0);
            //获取或者设置文本框的数据源
            cmbtype.DataSource = ds.Tables[0];
            cmbtype.DisplayMember = "singertype_name";
            cmbtype.ValueMember = "singertype_id";
            cmbtype.DataSource = ds.Tables[0];//绑定数据源
        }
        /// <summary>
        /// 主窗口
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Frmamend_Load(object sender, EventArgs e)
        {
            //调用歌手类型
            type();
            ADD();
        }
        //全部
        public void ADD()
        {
            try
            {
                //拼接sql语句
                string sql = @"select singer_id,singer_name,singertype_name,singer_Sex,singer_del from singer_info,singer_type
              where singer_info.singertype_id = singer_type.singertype_id";
                SqlDataAdapter da = new SqlDataAdapter(sql, db.Connection);
                DataSet ds = new DataSet();
                da.Fill(ds);
                this.dataGridView1.DataSource = ds.Tables[0];
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
        private void groupBox1_Enter(object sender, EventArgs e)
        {

        }



        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void 修改ToolStripMenuItem_Click_1(object sender, EventArgs e)
        {
            FrmAdd fm = new FrmAdd();
            fm.name = Convert.ToString(this.dataGridView1.CurrentRow.Cells[1].Value);
            fm.Show();
        }

        private void 删除ToolStripMenuItem_Click(object sender, EventArgs e)
        {  // 数据库类
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
                        sb.AppendFormat(@"delete from song_info where singer_id = {0};
                                           delete from singer_info where singer_id = {0}", num);

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
    }
}