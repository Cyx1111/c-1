using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace chapter14
{
    class Class2
    {

        //创建对象
        Program _dbOper = new Program();

        public void Login()
        {
            Console.WriteLine("请输入用户名：");
            string username = Console.ReadLine();
            Console.WriteLine("请输入密码：");
            string pwd = Console.ReadLine();
            string strMsg = string.Empty;
            //string strMsg = null;
            bool surMsg = _dbOper.ChenkUserInfo(username, pwd, ref strMsg);
            if (surMsg)
            {
                Console.WriteLine("登陆成功！！");
                Console.WriteLine("================");
                Console.WriteLine("1.统计学生人数");
                Console.WriteLine("2.查看学生名单");
                Console.WriteLine("3.按学号查询学生姓名");
                Console.WriteLine("4.按姓名查询学生信息");
                Console.WriteLine("5.修改学生出生日期");
                Console.WriteLine("6.删除学生记录");
                Console.WriteLine("7.新增年纪记录");
                Console.WriteLine("8.退出");
                Console.WriteLine("================");
                Console.WriteLine("请选择数字：");
                string option = Console.ReadLine();
                switch (option)
                {
                    case "1":
                        getstudentcount();
                        break;

                    case "2":
                        ShowStudent();
                        break;

                    case "3":
                        GetStudentNameByNo();
                        break;

                    case "4":
                        ShowStudentName();
                        break;

                    case "5":
                        updatestudent();
                        break;

                    case "6":
                        deletestudent();
                        break;

                    case "7":
                        inputgrade();
                        break;

                    case "8":
                        xixi();
                        break;
                        

                    default:
                        Console.WriteLine("输入的数字不正确！");
                        break;
                }


            }
            else
            {
                Console.WriteLine("登录失败！");
            }
        }
        public void ShowStudent()
        {
            
            //调用DBOperation类的方法
            SqlDataReader reader = null;
            reader = _dbOper.GetStudentListReturn();
            if (reader == null)
            {
                Console.WriteLine("出现异常了，额。。。");
                return;
            }
            Console.WriteLine("-------------------------------");
            Console.WriteLine("学号\t         姓名");
            Console.WriteLine("-------------------------------");
            //创建StringBuilder的对象
            StringBuilder sb = new StringBuilder();
            //循环读取DataReader
            while (reader.Read())
            {
                sb.AppendFormat("{0}\t{1}", reader["StudentNo"], reader["StudentName"]);
                Console.WriteLine(sb);
                sb.Length = 0;
            }
            Console.WriteLine("-------------------------------");
            //关闭DataReader对象
            reader.Close();

        }
        public void getstudentcount()
        {
            int iter = _dbOper.getstudentcount();
            if (iter < 0)
            {
                Console.WriteLine("查询出错！！！");
            }
            else
            {
                Console.WriteLine("学生总人数" + iter);
            }

        }
     
        public void  GetStudentNameByNo(){
       Console.WriteLine("请输入学号");
        string stuNo = Console.ReadLine();
        string stuName =_dbOper.GetStudentNameByNo(stuNo);
        if (stuName.Equals(string.Empty))
        {
            Console.WriteLine("出现异常");
        }
        else {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("学号是{0}的学生姓名为：{1}", stuNo, stuName);
            Console.WriteLine(sb);
        }
        }//按学号查


        public void ShowStudentName()
        {
            //创建StrinngBuilder类对象
            StringBuilder sb = new StringBuilder();
            Console.WriteLine("请输入学生姓名：");
            string stuName = Console.ReadLine();
       
            //创建DataReader对象读取数据库中的值
            SqlDataReader reader = _dbOper.GetStudentName(stuName);
            if (reader == null)
            {
                Console.WriteLine("出现异常！");
                return;
            }
            Console.WriteLine("--------------------------------------------------------------------------------------------------");
            Console.WriteLine("学号\t姓名\t性别\t年级\t联系电话\t地址\t\t出生日期\t\t邮箱");
            //循环读取拿到的数据,并格式化输出
            while (reader.Read())
            {
                sb.AppendFormat("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}", reader["StudentNo"], reader["StudentName"], reader["Sex"],
                    reader["GradeName"], reader["Phone"], reader["Address"], reader["BornDate"], reader["Email"]);
                Console.WriteLine(sb.ToString());
                sb.Length = 0;
            }
            Console.WriteLine("--------------------------------------------------------------------------------------------------");
            reader.Close();
        }//按姓名查
        public void inputgrade()
        {
            Console.WriteLine("请输入待插入的年纪名称 ");
            string gradename = Console.ReadLine();
            int iret = _dbOper.InsertGrade(gradename);
            if (iret == -1)
            {
                Console.WriteLine("有异常");
            }
            else
            {
                Console.WriteLine("好的");
            }
        }//新增年级名称
        public void updatestudent()
        {
            try
            {
                Console.WriteLine("请输入学号");
                string stuno = Console.ReadLine();
                Console.WriteLine("请输入修改后的生日（xxxx-xx-xx)；");
                string stuborndate = Console.ReadLine();
                DateTime dastudate = Convert.ToDateTime(stuborndate);
                int iret = _dbOper.updatastudent(stuborndate,stuno);
                if (iret == -1)
                {
                    Console.WriteLine("有异常");
                }
                else
                {
                    Console.WriteLine("成功啦哈哈哈哈哈");
                }

           }
            catch (Exception)
            {
                Console.WriteLine("输入错误！");
            }

        }//修改日期
        public void deletestudent() 
        {
            try
            {
                Console.WriteLine("请输入学号：");
                string stuno = Console.ReadLine();
                Console.WriteLine("确定要删除学号" + stuno + "? (n/y)");
               string  stt= Console.ReadLine();
               if (stt.Equals("y"))
               {
                   Console.WriteLine("删除成功");
               }
               else 
               {
                   Console.WriteLine("取消删除");
               }

            }
            catch (Exception)
            {
                Console.WriteLine("输入错误！");
            }

        }//删除
        public void xixi() {
            Console.WriteLine("已退出");
        }
    }
}

