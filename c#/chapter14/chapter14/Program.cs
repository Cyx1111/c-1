
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace chapter14
{
    class Program
    {


        // 连接字符串
        string strString = "Data Source=.;Initial Catalog=MySchool;User ID=sa;Password=123456";

        // SqlConnection对象

        SqlConnection conn = null;

        /// <summary>
        /// 用户验证
        /// </summary>
        /// <param name="username">用户名</param>
        /// <param name="pwd">密码</param>
        /// <param name="strMsg">需要返回处理的信息</param>
        /// <returns>返回结果（成功&失败）</returns>
        public bool ChenkUserInfo(string username, string pwd, ref string strMsg)
        {
            // 创建SqlCconnection对象
            conn = new SqlConnection(strString);
            try
            {
                // 创建sql语句
                string sql = "select count(*) from Admin where LoginId = '" + username + "' and LoginPwd = '" + pwd + "'";
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


        #region 获取学生名单

        public SqlDataReader GetStudentListReturn()
        {
            SqlConnection conn = new SqlConnection(strString);//创建SqlConnection对象，将数据源放入
            //数据库异常处理
            try
            {
                conn.Open();//打开数据库连接
                StringBuilder sb = new StringBuilder();//创建StringBuilder的对象
                sb.AppendLine("select");
                sb.AppendLine(" [StudentNo]");
                sb.AppendLine(" ,[StudentName]  ");
                sb.AppendLine("from");
                sb.AppendLine(" [Student]");
                SqlCommand comm = new SqlCommand(sb.ToString(), conn);
                /*CommandBeHavior.CloseConnection:在执行命令时，若关闭关联的DataReader对象，则关联的Connection对象也将关闭*/
                return comm.ExecuteReader(CommandBehavior.CloseConnection);
            }
            catch (Exception)
            {
                return null;
            }

        }//查学号

        #endregion
        public int getstudentcount()
        {
            conn = new SqlConnection(strString);
              try
            {
                string strsql = "select count(*) from Student";
                conn.Open();
                SqlCommand comm = new SqlCommand(strsql, conn);
                int iret = (int)comm.ExecuteScalar();
                return iret;
            }
            catch (Exception)
            {

                return -1;
            }
            finally {

                conn.Close();
            }
        }//查总数
        //public void getstudentnameno()
        //{
        //    conn = new SqlConnection(strString);
        //    try
        //    {
        //        conn.Open();
        //        StringBuilder stu = new StringBuilder();
        //        ////stu.AppendLine("select");
        //        ////stu.AppendLine("    s.[studentno]");
        //        ////stu.AppendLine("    s.[studentname]");
        //        ////stu.AppendLine("    g.[gradeid]");
        //        ////stu.AppendLine("    g.[gradename]");
        //        ////stu.AppendLine("from");
        //        ////stu.AppendLine("    [student] s");
        //        ////stu.AppendLine("inner join grade g");
        //        ////stu.AppendLine("on s.GradeId=g.GradeId");
        //        ////stu.AppendLine("where ");
        //        ////stu.AppendLine("StudentName like '% %'");
        //        ////stu.AppendLine("and StudentNo= ''");
        //        ////stu.AppendLine("s.[studentno]='"+stuno+"'");
        //        ////Comm=new Sqlcommand()
        //    }
        //    catch (Exception)
        //    { 
        //    }
        //    finally
        //    {
        //        // 关闭数据库
        //        conn.Close();
        //    }

        //}
        public string GetStudentNameByNo(string stuNo)//学号查
        {


            try
            {
                conn.Open();
                StringBuilder sb = new StringBuilder();//创建StringBuilder的对象
                sb.AppendLine("select");
                sb.AppendLine(" [StudentNo]");
                sb.AppendLine(" ,[StudentName]  ");
                sb.AppendLine("from");
                sb.AppendLine(" [Student]");
                sb.AppendLine("WHERE");
                sb.AppendLine(" [StudentNo]='" + stuNo + "'");
                SqlCommand comm = new SqlCommand(sb.ToString(), conn);
                SqlDataReader reader = comm.ExecuteReader();
                string stuName = string.Empty;
                if (reader.Read())
                {
                    stuName = Convert.ToString(reader["studentName"]);
                }
                reader.Close();


                return stuName;
            }
            catch (Exception)
            {
                return string.Empty;

            }
            finally
            {

                conn.Close();
            }
        }
        public SqlDataReader GetStudentName(string stuName)
        {

            try
            {
                conn.Open();
                StringBuilder sb = new StringBuilder();
                sb.AppendLine("select");
                sb.AppendLine("      A.[StudentNo]");
                sb.AppendLine("     , A.[StudentName]  ");
                sb.AppendLine("     , A.[Sex]  ");
                sb.AppendLine("     , B.[GradeName]  ");
                sb.AppendLine("     , A.[Phone]  ");
                sb.AppendLine("     , A.[Address]  ");
                sb.AppendLine("     , A.[BornDate]  ");
                sb.AppendLine("     , A.[Email]  ");
                sb.AppendLine("from");
                sb.AppendLine(" [Student] as A, [Grade] as B");
                sb.AppendLine("WHERE");
                sb.AppendLine(" [StudentName]   like  '%" + stuName + "%'");
                sb.AppendLine("  and");
                sb.AppendLine("A.[GradeId]=B.[GradeId]");
                SqlCommand comm = new SqlCommand(sb.ToString(), conn);
                return comm.ExecuteReader(CommandBehavior.CloseConnection);
            }
            catch (Exception)
            {

                return null;
            }



        }//姓名查
        public int InsertGrade(string gradename)
        {
             conn = new SqlConnection(strString);
             try
             {
                 conn.Open();
                 StringBuilder sb = new StringBuilder();
                 sb.AppendLine(" insert into");
                 sb.AppendLine("     [grade]");
                 sb.AppendLine("values");
                 sb.AppendLine("     ('" + gradename + " ')");

                 SqlCommand Comm = new SqlCommand(sb.ToString(), conn);
                 return Comm.ExecuteNonQuery();
             }
             catch (Exception)
             {
                 return -1;
 
             }
             conn.Close();

        }//新增
        public int updatastudent(string borndata,string  stuno)//修改
        {
            try
            {
                SqlConnection conn = new SqlConnection(strString);
                conn.Open();

                StringBuilder sb = new StringBuilder();
                sb.AppendLine("update");
                sb.AppendLine("     [student]");
                sb.AppendLine("set");
                sb.AppendLine("        [borndate]='"+borndata+"'");
                sb.AppendLine("where");
                sb.AppendLine("         [studentno]="+stuno);
                SqlCommand comm = new SqlCommand(sb.ToString(), conn);
                return comm.ExecuteNonQuery();
                
            }
            catch(Exception)
            {
                return -1;
            }
            finally
            {
                conn.Close();
            }
        }
        public int deletestudent(string studentno) 
        {
            try
            {  
                conn = new SqlConnection(strString);
                conn.Open();
                StringBuilder sb = new StringBuilder();
                sb.AppendLine("delete");
                sb.AppendLine("     [studentno]");
                sb.AppendLine("from");
                sb.AppendLine("     [student]");
                sb.AppendLine("where");
                sb.AppendLine("         [studentno]=" + studentno+"'");
                SqlCommand comm = new SqlCommand(sb.ToString(), conn);
                return comm.ExecuteNonQuery();
 }
            catch(Exception)
            {
                return -1;
            }
            finally
            {
                conn.Close();
            }
        }//删除信息
        

        }
    }
 

  