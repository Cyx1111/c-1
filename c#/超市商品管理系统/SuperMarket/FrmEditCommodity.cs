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
    public partial class FrmEditCommodity : Form
    {
        private DataSet ds = new DataSet(); // 数据集
        
        //判断是添加还修改
        public int commodityID=0;

        #region 按钮事件
        public FrmEditCommodity()
        {
            InitializeComponent();
        }

        /// <summary>
        /// 窗体加载
        /// </summary>
        private void FrmAddCommodity_Load(object sender, EventArgs e)
        {
            // 添加
            if (this.commodityID == 0)
            {
                this.GetCommoditySort();
            }
            // 修改
            else
            {
                this.GetCommidity();
                this.btnSave.Text = "修改(&U)";
            }
           
        }

        /// <summary>
        /// 保存
        /// </summary>
        private void btnSave_Click(object sender, EventArgs e)
        {
            if (this.CheckInput())
            {
                // 判断commodityID 0为添加数据 1为修改数据
                if (this.commodityID == 0)
                {
                    this.InsertCommodity();
                }
                else
                {
                    this.UpdateCommodity();
                }
            }
        }

        /// <summary>
        /// 取消操作
        /// </summary>
        private void btnCancel_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        /// <summary>
        /// 控制特价价格控件是否可使用
        /// </summary>
        private void chkIsPrice_CheckedChanged(object sender, EventArgs e)
        {
            if (chkIsPrice.Checked)
            {
                this.numReducedPrice.Enabled = true;
            }
            else
            {
                this.numReducedPrice.Enabled = false;
                this.numReducedPrice.Value = this.numPrice.Value;
            }
        }
        #endregion

        #region 自定义方法

        /// <summary>
        /// 从数据库得到商品类别
        /// </summary>
        private void GetCommoditySort()
        {
            DBHelper helper = new DBHelper();

            try
            {
                SqlDataAdapter adapter = new SqlDataAdapter();
                // 读出信息
                adapter.SelectCommand = new SqlCommand("SELECT * FROM [CommoditySort] ORDER BY SortID", helper.Connection);
                adapter.Fill(ds, "CommoditySort");

                // 绑定数据源
                this.cboSort.DataSource = ds.Tables["CommoditySort"];
                this.cboSort.ValueMember = "SortID";
                this.cboSort.DisplayMember = "SortName";
            }
            catch(Exception ex)
            {
                MessageBox.Show("数据库操作错误！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }

        /// <summary>
        /// 修改数据库
        /// </summary>
        private void GetCommidity()
        {
            // 先把获取类别值
            GetCommoditySort();
            // 初始化数据库连接
            DBHelper helper = new DBHelper();
            try
            {
                StringBuilder sb = new StringBuilder();

                //得到信息
                sb.AppendFormat("SELECT * FROM [Commodity] WHERE CommodityID={0}", this.commodityID);
                SqlCommand com= new SqlCommand(sb.ToString(), helper.Connection);
                helper.OpenConnection();
                SqlDataReader reader = com.ExecuteReader();
                if (reader.Read())
                {
                    //得到信息给控件值
                    this.txtName.Text = reader["CommodityName"].ToString();
                    this.cboSort.SelectedValue = reader["SortID"].ToString();
                    this.numPrice.Value = Convert.ToDecimal(reader["CommodityPrice"].ToString());
                    this.chkIsPrice.Checked = Convert.ToBoolean(reader["IsDiscount"].ToString());
                    this.numReducedPrice.Value = Convert.ToDecimal(reader["ReducedPrice"].ToString());
                }
                reader.Close();
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

        /// <summary>
        /// 检查窗体输入
        /// </summary>
        /// <returns>True 通过 False 不通过</returns>
        private bool CheckInput()
        {
            bool ok = true;
            this.txtName.Text = this.txtName.Text.Trim();
            if (this.txtName.Text.Length == 0)
            {
                MessageBox.Show("名称不能为空！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                ok = false;
            }
            return ok;
        }

        /// <summary>
        /// 保存到数据库
        /// </summary>
        private void InsertCommodity()
        {
            DBHelper db = new DBHelper();
            try
            {
                StringBuilder sql = new StringBuilder();
                
                sql.AppendLine("INSERT INTO [Commodity]");
                sql.AppendFormat(" VALUES('{0}',{1},{2},{3},{4})",
                    this.txtName.Text,Convert.ToInt32(this.cboSort.SelectedValue), this.numPrice.Value, this.chkIsPrice.Checked ? 1 : 0, this.numReducedPrice.Value);
                SqlCommand com = new SqlCommand(sql.ToString(), db.Connection);
                db.OpenConnection();
                int result = com.ExecuteNonQuery();
                if (result == 1)
                {
                    MessageBox.Show("添加成功！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    this.Close();
                }                
            }
            catch(Exception ex)
            {
                MessageBox.Show("数据库操作失败！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            finally
            {
                db.CloseConnection();
            }

        }

        /// <summary>
        /// 修改数据库
        /// </summary>
        private void UpdateCommodity()
        {
            DBHelper db = new DBHelper();
            try
            {
                StringBuilder sql = new StringBuilder();
                
                //修改数据库语句
                sql.AppendFormat("UPDATE [Commodity] SET [CommodityName]='{0}'", this.txtName.Text);
                sql.AppendFormat(" ,[SortID]='{0}'", Convert.ToInt32(this.cboSort.SelectedValue));
                sql.AppendFormat(" ,[CommodityPrice]='{0}'", this.numPrice.Value);
                sql.AppendFormat(" ,[IsDiscount]='{0}'", this.chkIsPrice.Checked ? 1 : 0);
                sql.AppendFormat(" ,[ReducedPrice]='{0}'", this.numReducedPrice.Value);
                sql.AppendFormat(" WHERE [CommodityID]={0}", this.commodityID);
                //执行SQL语句
                SqlCommand com = new SqlCommand(sql.ToString(), db.Connection);
                db.OpenConnection();
                int result = com.ExecuteNonQuery();
                if (result == 1)
                {
                    MessageBox.Show("修改成功！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    this.Close();
                }                
            }
            catch(Exception ex)
            {
                MessageBox.Show("数据库操作失败！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            finally
            {
                db.CloseConnection();
            }
        }

        #endregion
    }
}
