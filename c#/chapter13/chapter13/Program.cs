using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace chapter13
{
    class Program
    {
        static void Main(string[] args)
        { 
            // 数据库连接字符串

            string connstring = "Data Source=.;Initial Catalog=MySchool;Integrated Security=True";
            
            // 创建sqlConnection连接对象

            SqlConnection connectiion = new SqlConnection(connstring);
            // 打开数据库连接
            //处理异常的方法
            try
            {
                connectiion.Open();
                Console.WriteLine("打开成功");
            }
            catch (Exception ex)
            {
                Console.WriteLine("出现异常" + ex.Message);
            }
            finally
            {
                // 关闭数据库连接
                connectiion.Close();
                Console.WriteLine("关闭成功");
                Console.ReadLine();
            }
        }
    }
}
