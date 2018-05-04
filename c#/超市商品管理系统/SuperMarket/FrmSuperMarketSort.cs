using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

using System.Data.SqlClient;
namespace SuperMarket
{
    public partial class FrmSuperMarketSort : Form
    {
        private DataSet ds;
        //折行SQL语句
        private string sql;

        public FrmSuperMarketSort()
        {
            InitializeComponent();
        }

        private void FrmSuperMarketSort_Load(object sender, EventArgs e)
        {
            this.GetDB();
        }

        /// <summary>
        /// 得到全部全据
        /// </summary>
        /// <param name="sql">SELECT *FROM 表名</param>
        private void GetDB()
        {
            //初始化数据库连接
            DBHelper helper = new DBHelper();
            this.ds = new DataSet();
            try
            {
                this.sql = "SELECT SortID AS 编号,SortName AS 类别名称 From  [CommoditySort] ORDER BY SortID";
                SqlDataAdapter sda = new SqlDataAdapter();
                sda.SelectCommand = new SqlCommand(sql, helper.Connection);
                helper.OpenConnection();
                //读取数据并填充
                sda.Fill(ds, "CommoditySort");
                helper.CloseConnection();
                this.dgvSort.DataSource = this.ds.Tables[0];
            }
            catch(Exception ex)
            {
                MessageBox.Show("数据库操作错误！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            finally
            {
                helper.CloseConnection();
            }
        }

     
        //添加
        private void tsbtnAdd_Click(object sender, EventArgs e)
        {
            FrmEditSort frm = new FrmEditSort();
            frm.sortID = 0;
            frm.ShowDialog();
            this.GetDB();
        }
        //修改
        private void tsbtnUpdate_Click(object sender, EventArgs e)
        {
            FrmEditSort frm = new FrmEditSort();
            frm.sortID = Convert.ToInt32(this.dgvSort.CurrentRow.Cells["编号"].Value);
            frm.ShowDialog();
            this.GetDB();
        }
        //删除
        private void tsbtnDelete_Click(object sender, EventArgs e)
        {

            DBHelper helper = new DBHelper();
            try
            {
                if (this.dgvSort.SelectedRows.Count > 0)
                {
                    StringBuilder sbDel = new StringBuilder();
                    sbDel.AppendFormat("确定要删除类别为 {0} 的数据吗?", this.dgvSort.SelectedCells[1].Value);
                    if (MessageBox.Show(sbDel.ToString(), "系统提示", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
                    {
                        sbDel = new StringBuilder();
                        int num = Convert.ToInt32(this.dgvSort.SelectedCells[0].Value);
                        sbDel.AppendFormat("DELETE FROM [CommoditySort] WHERE SortID={0}", num);
                        SqlCommand command = new SqlCommand(sbDel.ToString(), helper.Connection);
                        helper.OpenConnection();
                        command.ExecuteNonQuery();
                        helper.CloseConnection();
                        MessageBox.Show("删除成功！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        //重新加载新数据
                        this.GetDB();
                    }

                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("数据库操作失败！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);

            }
            finally
            {
                helper.CloseConnection();
            }
        }

        private void tsbtnExit_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
