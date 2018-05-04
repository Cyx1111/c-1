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
    public partial class FrmChangePwd : Form
    {
        public  User user; // 当前登录的用户

        public FrmChangePwd()
        {
            InitializeComponent();
        }

        private void btnUpdatePwd_Click(object sender, EventArgs e)
        {
            bool result = false; // 更新结果

            //检查密码是否与登录密码一致
            if (CheckOldPwd() && CheckNewPwd())
            {
                result = UpdateInfoByPwd();
                if (result == true)
                {
                    MessageBox.Show("修改成功！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    this.Close();
                }
                else
                {
                    MessageBox.Show("修改失败，请重试！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            } 
        }

        private void btnReturn_Click(object sender, EventArgs e)
        {
            this.Close();
        }


        #region 方法
        /// <summary>
        /// 检查密码是否与登录密码一致
        /// </summary> 
        /// <returns>true:一致,false:不一致</returns>
        public bool CheckOldPwd()
        {
            if (txtOldPwd.Text.Trim().Equals(string.Empty))
            {
                MessageBox.Show("请输入原密码！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Warning);
               
                return false;
            }
            else if (txtOldPwd.Text.Trim().Equals(this.user.PassWord))
            {
                return true;
            }
            else
            {
                MessageBox.Show("原密码错误！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtOldPwd.Focus();
                return false;
            }
        }

        /// <summary>
        /// 检查新旧密码是否一致
        /// </summary>        
        /// <returns>true:一致,false:不一致</returns>
        public bool CheckNewPwd()
        {
            if (txtNewPwd.Text.Trim().Equals(string.Empty))
            {
                MessageBox.Show("请输入新密码！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtNewPwd.Focus();
                return false;
            }
            else if (txtReNewPwd.Text.Trim().Equals(txtNewPwd.Text.Trim()))
            {
                return true;
            }
            else
            {
                MessageBox.Show("两次输入的密码不一致！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtReNewPwd.Focus();
                return false;
            }
        }

        /// <summary>
        /// 将新密码更新到数据库中
        /// </summary>        
        /// <returns>true:更新成功,false:更新失败</returns>
        public bool UpdateInfoByPwd()
        {
            bool success = false; // 更新结果
            StringBuilder sql = new StringBuilder();  // SQL 语句

            //创建数据库连接
            DBHelper dbhelper = new DBHelper();

            try
            {
                //修改
                sql.AppendFormat("UPDATE [User] SET [PassWord] = '{0}' WHERE [UserName] ='{1}'",
                       txtNewPwd.Text.Trim(), user.UserName);

                dbhelper.OpenConnection();
                //创建Command
                SqlCommand command = new SqlCommand(sql.ToString(), dbhelper.Connection);

                int result = command.ExecuteNonQuery(); // 执行sql语句

                // 返回的值小于1，说明没有记录被影响，操作失败
                if (result == 1)
                {
                    success = true;
                }
            }
            catch (Exception ex)
            {
                success = false;
            }
            finally
            {
                //关闭数据库连接
                dbhelper.CloseConnection();
            }
            return success;
        }
        #endregion        
    }
}
