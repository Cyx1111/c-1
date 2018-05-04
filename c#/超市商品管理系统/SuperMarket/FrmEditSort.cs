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
    public partial class FrmEditSort : Form
    {
        // 得到类别编号，如果是0表示为新增类别
        public int sortID=0;

        // 得到修改数据
        private DataSet ds = new DataSet(); // 数据集        

        #region 控件事件
        public FrmEditSort()
        {
            InitializeComponent();
        }

        private void FrmAddSort_Load(object sender, EventArgs e)
        {
            if (this.sortID != 0)
            {
                this.GetSortInfo(); // 显示类别信息 
                this.btnSave.Text = "修改(&U)";
            }
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            if (this.CheckItem())
            {
                // 判断commodityID 0为添加数据 1为修改数据
                if (this.sortID == 0)
                {
                    this.InsertDB();
                }
                else
                {
                    this.UpdateDB();
                }
            }
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        #endregion

        #region 自定义方法

        /// <summary>
        /// 从数据库得到商品类别
        /// </summary>
        private void GetSortInfo()
        {
            DBHelper helper = new DBHelper();

            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append("SELECT *FROM [CommoditySort]");
                sql.AppendFormat(" WHERE SortID='{0}'",this.sortID);
                SqlCommand com = new SqlCommand(sql.ToString(), helper.Connection);
                helper.OpenConnection();
                SqlDataReader reader = com.ExecuteReader();
                if (reader.Read())
                {
                    this.txtSort.Text = reader["SortName"].ToString();
                }
            }
            catch(Exception ex )
            {
                MessageBox.Show("数据库操作错误！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            finally
            {
                helper.CloseConnection(); 
            }
        }
        
        /// <summary>
        /// 检查名称
        /// </summary>
        /// <returns>True 通过 False 不通过</returns>
        private bool CheckItem()
        {
            bool checkValue = true;
            this.txtSort.Text = this.txtSort.Text.Trim();
            if (this.txtSort.Text.Length == 0)
            {
                MessageBox.Show("名称不能为空！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                checkValue = false;
            }
            if (this.CheckSortNameExit())
            {
                MessageBox.Show("名称存在请重新输入！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                checkValue = false;
                this.txtSort.Text = string.Empty;
            }

            return checkValue;
        }

        /// <summary>
        /// 检查商品类别名称是否已经存在
        /// </summary>
        private bool CheckSortNameExit()
        {
            bool exit = false ;
            DBHelper helper = new DBHelper();
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.AppendLine("SELECT *FROM [CommoditySort]");
                sql.AppendFormat("  WHERE SortName='{0}'" ,this.txtSort.Text);
                SqlCommand com = new SqlCommand(sql.ToString(), helper.Connection);
                helper.OpenConnection();
                SqlDataReader reader = com.ExecuteReader();
                if (reader.Read())
                {
                    exit = true;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("数据库操作错误！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            finally
            {
                helper.CloseConnection();
            }
            return exit;
        }

        /// <summary>
        /// 保存到数据库
        /// </summary>
        private void InsertDB()
        {
            DBHelper db = new DBHelper();
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.AppendLine("INSERT INTO [CommoditySort]");
                sql.AppendFormat(" VALUES('{0}')", this.txtSort.Text);
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
        private void UpdateDB()
        {
            DBHelper db = new DBHelper();
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.AppendFormat("UPDATE [CommoditySort] SET [SortName]='{0}'", this.txtSort.Text);
                sql.AppendFormat(" WHERE [SortID]={0}", this.sortID);
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

        #endregion
    }
}
