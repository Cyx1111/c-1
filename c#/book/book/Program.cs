using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace book
{
    class Program
    {
        static void Main(string[] args)
        { }

        public static void menu()
        {

            Boolean isright = true;
            do
            {
                Console.WriteLine("欢迎使用电子图书系统");
                Console.WriteLine("--------------------------");
                Console.WriteLine("1.查询\t2.添加图书\t3.删除图书\t4.修改图书\t5.退出");
                Console.WriteLine("--------------------------");
                int choose = int.Parse(Console.ReadLine());
                switch (choose)
                {
                    case 1:
                        break;

                    case 2:
                        break;

                    case 3:
                        break;

                    case 4:
                        break;

                    case 5:
                        break;

                    default:
                        break;
                }
            } while (isright);

        }

      
    }
}
