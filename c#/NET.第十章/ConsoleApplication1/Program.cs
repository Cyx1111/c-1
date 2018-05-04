using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        { }
             static int Fn(int n)
        {
            if (n <= 0)
                return 0;
            if (n == 1 || n == 2)
                return 1;
            return Fn(n - 1) + Fn(n - 2);
        }
        //一般实现
        static int Fnl(int n)
        {
            if (n <= 0)
                return 0;
            int a = 1;
            int b = 1;
            int c = 1;
            for (int i = 3; i <= n; i++)
            {
                c = checked(a + b);
                a = b;
                b = c;
            }
            return c;
        }
        //两个临时变量进行计算
        static int Fn2(int n)
        {
            if (n <= 0)
                return 0;
            int a = 1;
            int b = 1;
            for (int i = 3; i <= n; i++)
            {
                b = checked(a + b);
                a = b - a;
            }
            return b;
        }
        

        }
    }
