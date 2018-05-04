using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyKTV
{
    class DBHelper
    {
        //数据库连接字符串
        private string str = "Data Source=.;Initial Catalog=KTV;User ID=yang;Password=yang";
        //数据库连接Connection对象
        private SqlConnection connection;
        /// <summary>
        /// 创建sqlConnection对象
        /// 
        /// </summary>
        public SqlConnection Connection
        {
            get
            {
                if (connection == null)
                {
                    connection = new SqlConnection(str);
                }
                return connection;
            }
            
        }
        /// <summary>
        /// 打开数据库连接
        /// </summary>
        public void OpenConnection()
        { 
            if (Connection.State == ConnectionState.Closed)
	{
		 Connection.Open();
	}
            else if (Connection.State == ConnectionState.Broken)
            {
                Connection.Close();
                Connection.Open();
            }
        }
        /// <summary>
        /// 关闭数据库的连接
        /// </summary>
        public void CloseConnection()
        {
            if (Connection.State == ConnectionState.Open || Connection.State == ConnectionState.Broken)
            {
                Connection.Close();
            }
        }
    }
}
