using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace cn.book.util
{
    public class DBHlper
    {    //连接数据库
        private string connstr = "Data Source=.;Initial Catalog=book;Persist Security Info=True;User ID=sa;Password=123456";
        //定义sqlconnection，本身是一个变量
        private SqlConnection conn;
        private SqlCommand comm;

        #region 打开数据库
        public void openconnection() 
        {
            //创建sqlconnection的对象
            conn = new SqlConnection(connstr);
            //判断是否为空
            if (connstr == null)
            {
                //如果是空，打开数据库
                conn.Open();
            }
                //判断是否有异常。如果是断开状态关闭。打开
            else if (conn.State == ConnectionState.Broken)
            {
                conn.Close();
                conn.Open();
            }
            else
            {   //打开数据库
                conn.Open();
            }
        }
        #endregion

        #region 关闭数据库
        public void closeconnection() 
        {
            //如果状态不为空，并且状态不为关的时候
            if (connstr !=null &&conn.State  != ConnectionState.Broken)
            {
                //关闭数据库
                conn.Close();
            }
              
            }
        #endregion

        #region 读取数据
        public SqlDataReader Read(string  sql)
        /// <summary>
        /// 查询语句
        /// </summary>
        /// <param name="sql"> 链接数据库，操作数据库</param>
        /// <returns>返回值</returns>
        {
            try
            {
                    //创建命令对象
                using (comm = new SqlCommand(sql, conn)) 
                {   //执行sql语句并返回结果
                    return comm.ExecuteReader();
                }
            }
            catch (Exception)
            {
                //遇到异常返回null
                return null;
            }

        }
        #endregion

        #region 增，删，改
        public int NonQuery(string sql)
        {
            try
            {
                //创建命令
                using (comm = new SqlCommand(sql, conn))
                {
                    //执行sql语句，并返回结果
                    return comm.ExecuteNonQuery();
                }
            }
            catch (Exception)
            {
                //遇到异常，返回-1
                return -1;
            }
        }
        #endregion

    }
}
