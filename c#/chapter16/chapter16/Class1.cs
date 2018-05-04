using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace chapter16
{
    class Class1
    {
        public void chauser()
        {
            int num = 0;
            do
            {
                Console.WriteLine("请输入用户名");
                string name = Console.ReadLine();
                Console.WriteLine("请输入用户密码");
                string pwd = Console.ReadLine();
                // 返回的结果信息
                string msg = string.Empty;
                // 它的定义和初始化等价于 string str = null/str = "";
                // 创建DBhlper对象

                // 获取值
                bool isReact = db.chauser(name, pwd, ref msg);// msg 返回db中接收异常
                // 判断
                if (isReact)
                {
                    Console.WriteLine("登录成功！");
                    ShowMenu();
                    break;

                }
                else
                {
                    Console.WriteLine("登录失败!!!" + msg);
                    num++;



                }
            } while (num < 3);
            if (num == 3)
            {
                Console.WriteLine("错误三次，请稍后再试");
            }



        }

    }
}
