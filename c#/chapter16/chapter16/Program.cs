using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace chapter16
{
    class Program
    {
        string strString = "Data Source=.;Initial Catalog=MySchool;Persist Security Info=True;User ID=sa;Password=123456";
        public bool chauser(string username, string pwd, ref string strMsg)
        {
            // 创建SqlCconnection对象
            SqlConnection conn = new SqlConnection(strString);
            try
            {
                // 创建sql语句
                string sql = "select count(*) from admin where LoginId = '" + username + "' and LoginPwd = '" + pwd + "'";
                // 打开数据库
                conn.Open();

                // 创建SqlCommand对象
                SqlCommand comm = new SqlCommand(sql, conn);
                int Reat = (int)comm.ExecuteScalar();
                if (Reat != 1)
                {
                    strMsg = "用户名密码错误！！！";
                    return false;
                }
                else
                {
                    return true;
                }
            }
            catch (Exception)
            {
                strMsg = "发生异常！！！";
                return false;
            }
            finally
            {
                // 关闭数据库
                conn.Close();
            }
        }

    }
}
