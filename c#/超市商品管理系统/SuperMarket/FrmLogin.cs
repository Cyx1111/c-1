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
    public partial class FrmLogin : Form
    {

        public FrmLogin()
        {
            InitializeComponent();
        }

        private void btnLogin_Click(object sender, EventArgs e)
        {  
            if (this.CheckUser() == true)
            {
                if (this.CheckDBUser() == true)
                {
                    FrmSuperMarketMain frm = new FrmSuperMarketMain();

                    // 保存用户
                    User user = new User();
                    // 给属性赋值
                    user.UserName = this.txtUserName.Text;
                    user.PassWord = this.txtPwd.Text;
                    // 隐藏窗体
                    this.Hide();

                    // 传递用户数据到下一个窗体
                    frm.user = user;
                    frm.ShowDialog();
                }
            }
        }

        #region 用户密码不存在检查

        /// <summary>
        /// 检查用户名和密码
        /// </summary>
        private bool CheckUser()
        {
            bool txtEmpte = true;

            this.txtUserName.Text = this.txtUserName.Text.Trim();
            this.txtPwd.Text = this.txtPwd.Text.Trim();

            if (this.txtUserName.Text.Length == 0)
            {
                txtEmpte = false;
                MessageBox.Show("请输入用户名！","系统提示",MessageBoxButtons.OK, MessageBoxIcon.Information);
                return txtEmpte;
            }
            
            if (this.txtPwd.Text.Length == 0)
            {
                txtEmpte = false;
                MessageBox.Show("请输入密码！","系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                return txtEmpte;
            }
            return txtEmpte;
        }

        /// <summary>
        /// 判断用户名和密码
        /// </summary>
        /// <param name="UserOrPwd">True 为用户.Flase 为用户+密码</param>
        /// <returns>0为无数据 1为有数据</returns>
        private bool CheckDBUser()
        {
            bool isResult = true;
            int count = 0;
            StringBuilder sb = new StringBuilder(); // 查询用的SQL语句
            DBHelper helper = new DBHelper();
            try
            {
                sb.AppendFormat("SELECT *FROM [USER] WHERE UserName='{0}'", this.txtUserName.Text);
                //SqlCommand 初始化方法1 构造函数
                SqlCommand command = new SqlCommand(sb.ToString(), helper.Connection);
                helper.OpenConnection();
                count = Convert.ToInt32(command.ExecuteScalar());
                if (count == 0)
                {
                    MessageBox.Show("请正确输入用户名！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    isResult = false;
                    return isResult;
                }
                helper.CloseConnection();
                sb =new StringBuilder();
                sb.AppendFormat("SELECT *FROM [USER] WHERE UserName='{0}' AND PassWord='{1}'", this.txtUserName.Text, this.txtPwd.Text);
                //SqlCommand 初始化方法2 通过属性
                //连接字符串
                command.Connection = helper.Connection;
                //执行SQL语句
                command.CommandText = sb.ToString();
                helper.OpenConnection();
                //返回值用来判断用户名和密码
                count = Convert.ToInt32(command.ExecuteScalar());
                if (count == 0)
                {
                    isResult = false;
                    MessageBox.Show("请正确输入用户名和密码！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }

                helper.CloseConnection();
            }
            catch(Exception ex)
            {
                isResult = false;
                MessageBox.Show("数据库操作错误！", "系统提示", MessageBoxButtons.OK, MessageBoxIcon.Information);

            }
            finally
            {
                helper.CloseConnection();
            }      

            return isResult;
 
        }


        #endregion

       
        private void btnCancel_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
