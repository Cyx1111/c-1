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
    public partial class FrmEnter : Form
    {
        public FrmEnter()
        {
            InitializeComponent();
        }


      
        /// <summary>
        /// 主窗体
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void FrmEnter_Load(object sender, EventArgs e)
        {
            //读取歌手的路径
            singerPhotoPath();
            //读取歌曲的路径
            DBHelper db = new DBHelper();
            string sql = "select resource_path from Resource_Path where resource_type = '歌曲'";
            SqlCommand cmd = new SqlCommand(sql, db.Connection);
            try
            {
                db.OpenConnection();
                KTVUtil.songPath = cmd.ExecuteScalar().ToString();
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
        /// 歌手的路径
        /// </summary>
        public void singerPhotoPath()
        {

            //读取歌手的路径
            DBHelper db = new DBHelper();
            string sql = "select resource_path from Resource_Path where resource_type = '歌手'";
            SqlCommand cmd = new SqlCommand(sql, db.Connection);
            try
            {
                db.OpenConnection();
                KTVUtil.singerPhotoPath = cmd.ExecuteScalar().ToString();
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
        /// 登录的按钮
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnenter_Click(object sender, EventArgs e)
        {
            //如果不为空判断用户是否存在，否则提醒并获取焦点
            if (NoNull() == true)
            {
                //如果存在该用户，隐藏登陆窗口并打开主管理页面
                Admin();
                FrmminLoin manage = new FrmminLoin();
                this.Hide();
                manage.Show();
            }

        }
        //数据库连接帮助类
        DBHelper help = new DBHelper();

        //非空验证
        public bool NoNull()
        {
            if (txtName.Text.Trim().Equals(string.Empty))
            {
                MessageBox.Show("请输入账号");
                txtName.Focus();
                return false;
            }
            else if (txtpwd.Text.Trim().Equals(string.Empty))
            {
                MessageBox.Show("请输入密码");
                txtpwd.Focus();
                return false;
            }
            else
            {
                return true;
            }
        }
        /// <summary>
        /// 检索用户名，密码是否存在
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        /// 
        //判断账户是否存在
        public void Admin()
        {
            string admin = this.txtName.Text;
            string pwd = this.txtpwd.Text;
            string sql = string.Format("select count(*) from admin_info where admin_name='{0}' and admin_pwd='{1}'", admin, pwd);
            SqlCommand com = new SqlCommand(sql, help.Connection);
            try
            {
                help.OpenConnection();
                int chose = (int)com.ExecuteScalar();
                if (chose > 0)
                {
                    MessageBox.Show("登陆成功");
                }
                else
                {

                    if (MessageBox.Show("账号或密码错误", "提示", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
                    {
                        Application.Exit();
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
            finally
            {
                help.CloseConnection();
            }
        }
        private void btncancel_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }
    }
}
