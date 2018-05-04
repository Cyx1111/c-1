using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Data;
using System.Data.SqlClient;
namespace SuperMarket
{
    class DBHelper
    {
        // 数据库连接字符串
        private string connString = @"Data Source=localhost;Initial Catalog=SuperMarket;User ID=sa;Pwd=bdqn";

        // 数据库连接 Connection 对象
        private SqlConnection connection;

        /// <summary>
        /// Connection对象
        /// </summary>
        public SqlConnection Connection
        {
            get
            {
                if (connection == null)
                {
                    connection = new SqlConnection(connString);
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
        /// 关闭数据库连接
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
