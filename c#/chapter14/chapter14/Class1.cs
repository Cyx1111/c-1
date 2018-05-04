using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace chapter14
{
    class Class1
    {
        static void Main(string[] args)
        {
            Class2 stu = new Class2();
            stu.Login();
            Console.ReadLine();
        }

    }
}